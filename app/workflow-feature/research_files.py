import hashlib,json,os,re,tempfile,zipfile,subprocess
from pathlib import Path
from xml.etree import ElementTree as ET
ROOT=Path('/mnt/data')
def path(name, target_sha256=None):
 p=(ROOT/name).resolve()
 if p.exists() and p.is_relative_to(ROOT) and p != ROOT:
  return p
 for candidate in ROOT.rglob('*'):
  if candidate.is_file() and not candidate.name.startswith('.'):
   if candidate.name == name or candidate.stem == name:
    return candidate
   if target_sha256 and digest(candidate.read_bytes()) == target_sha256:
    return candidate
 return p
def digest(b):return hashlib.sha256(b).hexdigest()
def read(p):
 return FileDocument(p, ROOT).read()
def main(a):
 action=a.get('action')
 if action=='read_all':
  names=a.get('names') or ([a['input']] if a.get('input') else None)
  if names:
   big=[]
   for n in names:
    try:
     pp=path(n)
     if pp.is_file() and pp.suffix.lower() in ('.xlsx','.csv') and pp.stat().st_size>200*1024: big.append(n)
    except Exception: pass
   if big: return {'error':'Tabular file exceeds 200KB dump threshold. Use action=describe first, then action=query or action=fetch.','complete':False,'rejected':big}
  if not names:
   files=sorted(p for p in ROOT.rglob('*') if p.is_file() and not any(x.startswith('.') for x in p.relative_to(ROOT).parts) and not p.name.startswith(('file0.','research-read-')))
   return {'inventory_only':True,'files':[{'name':str(p.relative_to(ROOT)),'bytes':p.stat().st_size} for p in files]}
  files=[path(n) for n in names] if names else sorted(p for p in ROOT.rglob('*') if p.is_file() and not any(part.startswith('.') for part in p.relative_to(ROOT).parts) and not p.name.startswith('file0.'))
  results=[];total=0
  for p in files:
   try:r=read(p)
   except Exception as e:r={'name':str(p.relative_to(ROOT)),'error':str(e)}
   total+=len(r.get('text',''));results.append(r)
  if total>3000000:return {'complete':False,'error':'Selected text exceeds the per-call text budget; read the listed files separately by exact name. Do not fall back to manual XML extraction.','files':[{'name':r['name'],'characters':len(r.get('text','')),'error':r.get('error')} for r in results]}
  return {'files':results,'complete':not any('error'in r or 'omitted'in r for r in results)}
 if action=='verify':
  result=[]
  for name in a.get('names',[]):
   p=path(name);r=read(p);r.pop('text',None);result.append(r)
  return {'verified_files':result}
 if action in ('catalog','describe','query','fetch'):
  names=a.get('names') or ([a['input']] if a.get('input') else [])
  if not names: return {'error':action+' requires names=[<file>]','complete':False}
  p_=path(names[0])
  if not p_.is_file(): return {'error':'file not found: '+names[0],'complete':False}
  doc=FileDocument(p_, ROOT)
  try:
   if action=='catalog': return doc.tabular_catalog()
   if action=='describe': return doc.tabular_describe(sheet=a.get('sheet'), rows=int(a.get('rows') or 5), cols=int(a.get('cols') or 10))
   if action=='query': return doc.tabular_query(sheet=a.get('sheet'), row_label=a.get('row_label'), column_label=a.get('column_label'), equals=a.get('equals'), contains=a.get('contains'), contains_any=a.get('contains_any'), in_values=a.get('in_values'), regex=a.get('regex'), limit=int(a['limit']) if a.get('limit') else None, count_only=bool(a.get('count_only')))
   if action=='fetch': return doc.tabular_fetch(sheet=a.get('sheet'), start=a.get('start') or 'A1', end=a.get('end'), max_chars=int(a.get('max_chars') or 100000))
  except Exception as e:
   return {'error':type(e).__name__+': '+str(e),'complete':False}
 if action=='edit_text':
  if not isinstance(a.get('input'),str) or not a['input'] or not isinstance(a.get('sha256'),str) or not re.fullmatch(r'[a-fA-F0-9]{64}',a['sha256']):
   return {'error':'edit_text requires input filename and its current 64-character sha256 from read_all. No changes written.','complete':False}
  p=path(a['input'], a.get('sha256'));b=p.read_bytes()
  if digest(b)!=a['sha256']:raise ValueError('Stale file hash; no changes written')
  raw_out = a.get('output')

  if raw_out:

   out = path(raw_out, a.get('sha256'))

   if out.resolve() != p.resolve():

    raise ValueError('Edits must retain the input filename; omit output or use the same name')

  else:

   out = p
  text=b.decode('utf-8');edits=a.get('edits');spans=[];issues=[];present=[]
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
   def context_matches(pos,value):
    left=text[:pos];right=text[pos+len(value):]
    return (not before or left.endswith(before) or left.rstrip().endswith(before.rstrip())) and (not after or right.startswith(after) or right.lstrip().startswith(after.lstrip()))
   hits=[];offset=0
   while True:
    pos=text.find(old,offset)
    if pos<0:break
    if context_matches(pos,old):hits.append(pos)
    offset=pos+1
   if not hits and old not in text and new and (before.strip() or after.strip()):
    candidates=[m.start() for m in re.finditer(re.escape(new),text) if context_matches(m.start(),new)]
    if len(candidates)==1:
     present.append(number);continue
   if len(hits)!=1:
    issues.append({'edit':number,'code':'ambiguous_match' if hits else 'missing_match','matches':len(hits),
     'locations':[{'line':text.count('\n',0,pos)+1,'before':text[max(0,pos-120):pos],'after':text[pos+len(old):pos+len(old)+120]} for pos in hits[:8]],
     'repair':'Supply exact context_before/context_after to select one occurrence, or a longer unique old passage. Do not guess; all edits remain unapplied.'});continue
   start=hits[0];spans.append((start,start+len(old),new))
  if issues:return {'status':'needs_repair','complete':False,'issues':issues,'already_present':present}
  if not spans:return {'status':'already_present','complete':True,'already_present':present,'sha256':digest(b),'deliver':str(p.relative_to(ROOT))}
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
  return {'output':str(p),'sha256':digest(check),'edits':len(spans),'already_present':present,'verified':'Exact replacements; same filename; saved bytes verified','deliver':str(p.relative_to(ROOT))}
 raise ValueError('Unknown action')
