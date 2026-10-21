#!/usr/bin/python3
"""JSON-in/JSON-out research document operations, confined to /mnt/data."""
import sys,json,os,re,subprocess,difflib,tempfile,zipfile,copy
from pathlib import Path
from datetime import datetime,timezone
ROOT=Path('/mnt/data')

def path(name,exists=True):
    p=(ROOT/name).resolve()
    if not p.is_relative_to(ROOT.resolve()) or p==ROOT.resolve(): raise ValueError('Path must be inside /mnt/data')
    if exists and not p.is_file(): raise ValueError('File not found: '+name)
    if not exists and p.exists(): raise ValueError('Output already exists; choose a new filename')
    return p

def publish(data,target):
    target.parent.mkdir(parents=True,exist_ok=True)
    with target.open('xb') as f:f.write(data)
    return {'output':str(target),'bytes':len(data)}

def text(p):
    if p.suffix.lower()=='.docx':
        from lxml import etree as E
        with zipfile.ZipFile(p) as z:r=E.fromstring(z.read('word/document.xml'))
        ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        return '\n'.join(''.join(p.xpath('.//w:t[not(ancestor::w:del)]/text()',namespaces=ns)) for p in r.xpath('//w:p',namespaces=ns))
    return p.read_text()

def run(a):
    op=a['action']
    if op=='inspect':
        p=path(a['input']);s=text(p);return {'text':s[:100000],'truncated':len(s)>100000,'characters':len(s)}
    if op=='create_docx':
        from docx import Document
        import io
        d=Document()
        for b in a['blocks']:
            if 'table' in b:
                rows=b['table'];assert rows and all(len(x)==len(rows[0]) for x in rows)
                t=d.add_table(rows=0,cols=len(rows[0]));t.style='Table Grid'
                for row in rows:
                    for c,v in zip(t.add_row().cells,row):c.text=str(v)
            elif 'heading' in b:d.add_heading(b['heading'],level=b.get('level',1))
            else:d.add_paragraph(b['text'])
        target=path(a['output'],False);buf=io.BytesIO();d.save(buf);return publish(buf.getvalue(),target)
    if op=='edit_docx':
        from lxml import etree as E
        import io
        src=path(a['input']);target=path(a['output'],False)
        ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'};W='{'+ns['w']+'}'
        with zipfile.ZipFile(src) as z:
            root=E.fromstring(z.read('word/document.xml')); ids=[int(x) for x in root.xpath('//@w:id',namespaces=ns) if x.isdigit()]; rid=max(ids+[0])+1
            for edit in a.get('replacements',[]):
                old,new=edit['old'],edit['new'];assert old,'Empty search text'
                hits=[]
                for r in root.xpath('//w:r[not(ancestor::w:ins) and not(ancestor::w:del)]',namespaces=ns):
                    ts=r.findall(W+'t')
                    if len(ts)==1 and old in (ts[0].text or '') and all(c.tag in (W+'rPr',W+'t') for c in r):hits.append((r,ts[0]))
                if len(hits)!=1 or hits[0][1].text.count(old)!=1:raise ValueError('Replacement must match exactly once within a plain text run; use inspect and a more specific edit. No output written.')
                r,t=hits[0];parent=r.getparent();idx=parent.index(r);before,after=t.text.split(old,1)
                def piece(value,deleted=False):
                    el=copy.deepcopy(r);tx=el.find(W+'t');tx.tag=W+('delText' if deleted else 't');tx.text=value;tx.set('{http://www.w3.org/XML/1998/namespace}space','preserve');return el
                out=[]
                if before:out.append(piece(before))
                if a.get('tracked',True):
                    for tag,value,deleted in [('del',old,True),('ins',new,False)]:
                        e=E.Element(W+tag);e.set(W+'id',str(rid));rid+=1;e.set(W+'author','Research assistant');e.set(W+'date',datetime.now(timezone.utc).isoformat().replace('+00:00','Z'));e.append(piece(value,deleted));out.append(e)
                else:out.append(piece(new))
                if after:out.append(piece(after))
                parent.remove(r)
                for el in reversed(out):parent.insert(idx,el)
            for table in a.get('tables',[]):
                from docx import Document
                d=Document();rows=table['rows'];assert rows and all(len(x)==len(rows[0]) for x in rows)
                t=d.add_table(rows=0,cols=len(rows[0]));t.style='Table Grid'
                for row in rows:
                    for c,v in zip(t.add_row().cells,row):c.text=str(v)
                anchors=[p for p in root.xpath('/w:document/w:body/w:p',namespaces=ns) if ''.join(p.xpath('.//w:t/text()',namespaces=ns))==table['after']]
                if len(anchors)!=1:raise ValueError('Table anchor must match one complete body paragraph')
                anchors[0].addnext(copy.deepcopy(t._tbl))
            buf=io.BytesIO()
            with zipfile.ZipFile(buf,'w',zipfile.ZIP_DEFLATED) as out:
                for info in z.infolist():out.writestr(info,E.tostring(root,xml_declaration=True,encoding='UTF-8',standalone=True) if info.filename=='word/document.xml' else z.read(info.filename))
        return publish(buf.getvalue(),target)
    if op=='edit_text':
        src=path(a['input']);s=src.read_text()
        for e in a['replacements']:
            if not e['old'] or s.count(e['old'])!=1:raise ValueError('Each replacement must match exactly once')
            s=s.replace(e['old'],e['new'],1)
        return publish(s.encode(),path(a['output'],False))
    if op=='compare':
        left,right=path(a['before']),path(a['after']);diff=''.join(difflib.unified_diff(text(left).splitlines(True),text(right).splitlines(True),fromfile=left.name,tofile=right.name))
        return publish(diff.encode(),path(a['output'],False))
    if op=='check':
        s=text(path(a['input']));labels=re.findall(r'\\label\{([^}]+)\}',s);refs=re.findall(r'\\(?:ref|eqref|autoref)\{([^}]+)\}',s)
        return {'words':len(s.split()),'dois':sorted(set(re.findall(r'10\.\d{4,9}/[^\s<>"}]+',s))), 'duplicate_labels':sorted({x for x in labels if labels.count(x)>1}),'undefined_latex_refs':sorted(set(refs)-set(labels)),'possible_placeholders':re.findall(r'\b(?:TODO|TBD|FIXME|CITATION NEEDED)\b',s),'note':'Mechanical checks only; included TeX files are not expanded. Grammar, evidence and arguments require model review. DOI strings are not verified here.'}
    if op=='compile_latex':
        src=path(a['input']);out=path(a['output'],False)
        if out.suffix.lower()!='.pdf':raise ValueError('Output must be PDF')
        with tempfile.TemporaryDirectory(dir=src.parent,prefix='ra-tex-') as td:
            cmd=['latexmk','-xelatex','-interaction=nonstopmode','-halt-on-error','-no-shell-escape','-outdir='+Path(td).name,src.name]
            result=subprocess.run(cmd,cwd=src.parent,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,timeout=120,env={**os.environ,'openin_any':'p','openout_any':'p'})
            if result.returncode:raise ValueError(result.stdout.decode(errors='replace')[-8000:])
            return publish((Path(td)/(src.stem+'.pdf')).read_bytes(),out)
    if op=='render_docx':
        src=path(a['input']);out=path(a['output'],False)
        if out.suffix.lower()!='.pdf':raise ValueError('Output must be PDF')
        with tempfile.TemporaryDirectory(dir=ROOT,prefix='.ra-render-') as td:
            r=subprocess.run(['libreoffice','-env:UserInstallation=file://'+td+'/profile','--headless','--convert-to','pdf','--outdir',td,str(src)],stdout=subprocess.PIPE,stderr=subprocess.STDOUT,timeout=90,
                env={**os.environ, 'HOME':td, 'TMPDIR':td,
                     'XDG_CACHE_HOME':td+'/cache',
                     'XDG_CONFIG_HOME':td+'/config',
                     'XDG_RUNTIME_DIR':td,
                     'SAL_USE_VCLPLUGIN':'svp',
                     'SAL_DISABLE_JAVA':'1'})
            pdf=Path(td)/(src.stem+'.pdf')
            if r.returncode or not pdf.exists():raise ValueError(r.stdout.decode(errors='replace')[-4000:])
            return publish(pdf.read_bytes(),out)
    if op=='copy':return publish(path(a['input']).read_bytes(),path(a['output'],False))
    if op=='list':return {'files':[{'name':str(p.relative_to(ROOT)),'bytes':p.stat().st_size} for p in ROOT.rglob('*') if p.is_file() and not p.is_symlink()][:500]}
    raise ValueError('Unknown action')

if __name__=='__main__':
    try:print(json.dumps(run(json.load(sys.stdin)),ensure_ascii=False))
    except Exception as e:print(json.dumps({'error':str(e)}));sys.exit(1)
