import hashlib,json,os,re,tempfile,zipfile,subprocess
from pathlib import Path
from xml.etree import ElementTree as ET
ROOT=Path('/mnt/data')
def path(name):
 p=(ROOT/name).resolve()
 if not p.is_relative_to(ROOT) or p==ROOT: raise ValueError('File must be inside /mnt/data')
 return p
def digest(b):return hashlib.sha256(b).hexdigest()
def spreadsheet(p):
 ns='{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
 rel='{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
 import posixpath
 with zipfile.ZipFile(p) as z:
  if z.testzip():raise ValueError('Spreadsheet ZIP integrity failed')
  strings=[]
  if 'xl/sharedStrings.xml' in z.namelist():
   strings=[''.join(t.text or '' for t in si.iter(ns+'t')) for si in ET.fromstring(z.read('xl/sharedStrings.xml')).iter(ns+'si')]
  relationships={r.attrib['Id']:r.attrib['Target'] for r in ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))}
  sheets=[]
  for sheet in ET.fromstring(z.read('xl/workbook.xml')).iter(ns+'sheet'):
   target=relationships[sheet.attrib[rel+'id']]
   target=target.lstrip('/') if target.startswith('/') else posixpath.normpath('xl/'+target)
   if not target.startswith('xl/'):raise ValueError('Invalid worksheet target')
   root=ET.fromstring(z.read(target));rows=[];maxcol=0
   for row in root.iter(ns+'row'):
    cells={}
    for c in row.findall(ns+'c'):
     ref=c.get('r','');v=c.find(ns+'v');value=v.text if v is not None else None
     if c.get('t')=='s' and value is not None:value=strings[int(value)]
     elif c.get('t')=='inlineStr':value=''.join(t.text or '' for t in c.iter(ns+'t'))
     formula=c.find(ns+'f')
     if value is not None or formula is not None:
      cells[ref]={'value':value,'formula':formula.text,'cached_value_only':True} if formula is not None else value
     letters=re.match(r'[A-Z]+',ref)
     if letters:
      n=0
      for ch in letters[0]:n=n*26+ord(ch)-64
      maxcol=max(maxcol,n)
    rows.append({'row':row.get('r'),'cells':cells})
   sheets.append({'sheet':sheet.get('name'),'row_records':len(rows),'columns':maxcol,'rows':rows})
  return json.dumps({'sheets':sheets,'note':'Reads actual worksheet cells, ignoring unreliable declared dimensions and drawing references. Formulas are not recalculated; cached values may be absent or stale.'},ensure_ascii=False)
def read(p):
 b=p.read_bytes();ext=p.suffix.lower()
 if ext in {'.xlsx','.xlsm'}:text=spreadsheet(p)
 elif ext=='.docx':
  with zipfile.ZipFile(p) as z:
   if z.testzip():raise ValueError('Corrupt DOCX archive')
   texts=[]
   for n in z.namelist():
    if n=='word/document.xml' or re.match(r'word/(footnotes|endnotes|comments|header\d+|footer\d+)\.xml$',n):
     root=ET.fromstring(z.read(n));ns='{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
     texts.append(n+'\n'+'\n'.join(''.join(t.text or '' for t in par.iter(ns+'t')) for par in root.iter(ns+'p')))
   text='\n'.join(texts)
 elif ext=='.pdf':
  r=subprocess.run(['pdftotext','-layout',str(p),'-'],capture_output=True,text=True,timeout=30,check=True);text=r.stdout
 elif ext in {'.tex','.bib','.sty','.cls','.bst','.txt','.md','.csv','.tsv','.json','.py','.r','.xml','.yaml','.yml'} or p.name=='Makefile':text=b.decode('utf-8')
 else:return {'name':str(p.relative_to(ROOT)),'bytes':len(b),'sha256':digest(b),'omitted':'Binary/data file; use the appropriate reader'}
 return {'name':str(p.relative_to(ROOT)),'bytes':len(b),'sha256':digest(b),'text':text}
def main(a):
 action=a.get('action')
 if action=='read_all':
  names=a.get('names')
  if not names:
   files=sorted(p for p in ROOT.rglob('*') if p.is_file() and not any(x.startswith('.') for x in p.relative_to(ROOT).parts) and not p.name.startswith(('file0.','research-read-')))
   return {'inventory_only':True,'files':[{'name':str(p.relative_to(ROOT)),'bytes':p.stat().st_size} for p in files],'instruction':'Select the user-requested manuscript and necessary sources by exact filename and call read_all with names. Do not read old versions, build scripts or unrelated files. This inventory contains no file contents.'}
  files=[path(n) for n in names] if names else sorted(p for p in ROOT.rglob('*') if p.is_file() and not any(part.startswith('.') for part in p.relative_to(ROOT).parts) and not p.name.startswith('file0.'))
  results=[];total=0
  for p in files:
   try:r=read(p)
   except Exception as e:r={'name':str(p.relative_to(ROOT)),'error':str(e)}
   total+=len(r.get('text',''));results.append(r)
  if total>3000000:return {'complete':False,'error':'Selected text exceeds the per-call text budget; read the listed files separately by exact name. Do not fall back to manual XML extraction.','files':[{'name':r['name'],'characters':len(r.get('text','')),'error':r.get('error')} for r in results]}
  return {'files':results,'complete':not any('error'in r or 'omitted'in r for r in results),'instruction':'Retain the entire manuscript context for one coherent plan. Binary omissions/errors are explicit; do not claim they were read.'}
 if action=='verify':
  result=[]
  for name in a.get('names',[]):
   p=path(name);r=read(p);r.pop('text',None);result.append(r)
  return {'verified_files':result,'instruction':'Deliver only these files; disclose unfinished work. Do not start another edit.'}
 if action=='edit_text':
  if not isinstance(a.get('input'),str) or not a['input'] or not isinstance(a.get('sha256'),str) or not re.fullmatch(r'[a-fA-F0-9]{64}',a['sha256']):
   return {'error':'edit_text requires input filename and its current 64-character sha256 from read_all. No changes written.','complete':False}
  p=path(a['input']);b=p.read_bytes()
  if digest(b)!=a['sha256']:raise ValueError('Stale file hash; no changes written')
  out=path(a.get('output',a['input']))
  if out!=p:raise ValueError('Edits must retain the input filename; omit output or use the same name')
  text=b.decode('utf-8');edits=a.get('edits');spans=[];issues=[]
  if not isinstance(edits,list) or not edits:
   return {'error':'Invalid edits: provide a nonempty list of {old,new} objects. No changes written.','complete':False}
  for number,e in enumerate(edits,1):
   if not isinstance(e,dict):
    issues.append({'edit':number,'code':'invalid_edit','required':'{old: nonempty string, new: string}'});continue
   old=e.get('old',e.get('old_text'));new=e.get('new',e.get('new_text'))
   if any(k in e and alias in e and e[k]!=e[alias] for k,alias in [('old','old_text'),('new','new_text')]):
    issues.append({'edit':number,'code':'conflicting_aliases'});continue
   if not isinstance(old,str) or not old or not isinstance(new,str):
    issues.append({'edit':number,'code':'invalid_fields','required':'old must be nonempty text; new must be text (empty text deletes)'});continue
   before=e.get('context_before','');after=e.get('context_after','')
   if not isinstance(before,str) or not isinstance(after,str):
    issues.append({'edit':number,'code':'invalid_context','required':'context_before/context_after must be exact adjacent text'});continue
   hits=[];offset=0
   while True:
    pos=text.find(old,offset)
    if pos<0:break
    if (not before or text[:pos].endswith(before)) and (not after or text[pos+len(old):].startswith(after)):hits.append(pos)
    offset=pos+1
   if len(hits)!=1:
    issues.append({'edit':number,'code':'ambiguous_match' if hits else 'missing_match','matches':len(hits),
     'locations':[{'line':text.count('\n',0,pos)+1,'before':text[max(0,pos-120):pos],'after':text[pos+len(old):pos+len(old)+120]} for pos in hits[:8]],
     'repair':'Supply exact context_before/context_after to select one occurrence, or a longer unique old passage. Do not guess; all edits remain unapplied.'});continue
   start=hits[0];spans.append((start,start+len(old),new))
  if issues:return {'error':'Edit validation failed; no changes written. Correct the listed edits and resubmit the complete batch.','complete':False,'issues':issues}
  spans.sort()
  if any(spans[i][1]>spans[i+1][0] for i in range(len(spans)-1)):raise ValueError('Overlapping edits; no changes written')
  revised=text
  for start,end,new in reversed(spans):revised=revised[:start]+new+revised[end:]
  if p.suffix.lower()=='.tex':
   skeleton=lambda s:re.findall(r'\\(?:section|subsection|subsubsection|label)\*?\{[^}]*\}',s)
   if skeleton(text)!=skeleton(revised) and not a.get('allow_structure_change'):raise ValueError('Headings or labels changed; explicit allow_structure_change required')
  data=revised.encode('utf-8')
  fd,tmp=tempfile.mkstemp(prefix='.edit-',dir=p.parent)
  try:
   with os.fdopen(fd,'wb') as f:
    f.write(data);f.flush();os.fsync(f.fileno())
   os.chmod(tmp,p.stat().st_mode & 0o777)
   if p.read_bytes()!=b:raise ValueError('File changed during edit; no changes written')
   if Path(tmp).read_bytes()!=data:raise ValueError('Temporary output verification failed')
   os.replace(tmp,p)
  finally:
   if os.path.exists(tmp):os.unlink(tmp)
  check=p.read_bytes()
  if check!=data:raise ValueError('Saved file verification failed')
  return {'output':str(p),'sha256':digest(check),'edits':len(edits),'verified':'Exact replacements; same filename; saved bytes verified','deliver':str(p.relative_to(ROOT))}
 raise ValueError('Unknown action')
