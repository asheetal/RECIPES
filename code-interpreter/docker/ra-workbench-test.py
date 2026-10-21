import tempfile,sys,zipfile,importlib.util
from pathlib import Path
from docx import Document
spec=importlib.util.spec_from_file_location('ra',Path(__file__).with_name('ra_workbench.py'));ra=importlib.util.module_from_spec(spec);spec.loader.exec_module(ra)
with tempfile.TemporaryDirectory() as td:
 ra.ROOT=Path(td)
 d=Document();p=d.add_paragraph();p.add_run('We demonstrate the effect.').bold=True;d.save(ra.ROOT/'source.docx');old=(ra.ROOT/'source.docx').read_bytes()
 ra.run({'action':'edit_docx','input':'source.docx','output':'edited.docx','replacements':[{'old':'demonstrate','new':'estimate'}],'tracked':True})
 assert ra.text(ra.ROOT/'edited.docx')=='We estimate the effect.'
 with zipfile.ZipFile(ra.ROOT/'edited.docx') as z:
  xml=z.read('word/document.xml');assert b'<w:del ' in xml and b'<w:ins ' in xml and b'<w:b' in xml
 assert old==(ra.ROOT/'source.docx').read_bytes()
 ra.run({'action':'edit_docx','input':'source.docx','output':'table.docx','tables':[{'after':'We demonstrate the effect.','rows':[['A','B'],['1','2']]}]})
 assert 'A' in ra.text(ra.ROOT/'table.docx')
 for args in [{'action':'copy','input':'source.docx','output':'source.docx'},{'action':'inspect','input':'../../etc/passwd'},{'action':'edit_docx','input':'source.docx','output':'bad.docx','replacements':[{'old':'missing','new':'x'}]}]:
  try:ra.run(args);raise AssertionError('unsafe operation accepted')
  except ValueError:pass
 assert not (ra.ROOT/'bad.docx').exists()
 ra.run({'action':'compare','before':'source.docx','after':'edited.docx','output':'changes.diff'})
 assert 'estimate' in (ra.ROOT/'changes.diff').read_text()
print('PASS: original preservation, tracked edits, formatting, table insertion, comparison, path confinement, failed-edit atomicity')
