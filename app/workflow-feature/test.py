import importlib.util,tempfile,hashlib,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('work',Path(__file__).with_name('research_files.py'));w=importlib.util.module_from_spec(spec);spec.loader.exec_module(w)
class Tests(unittest.TestCase):
 def test_work(self):
  with tempfile.TemporaryDirectory() as d:
   w.ROOT=Path(d);p=w.ROOT/'body.tex';p.write_text('\\section{Intro}\nOne coherent claim.\n')
   (w.ROOT/'refs.bib').write_text('@article{a,title={A}}')
   bundle=w.main({'action':'read_all'});self.assertEqual(len(bundle['files']),2);self.assertTrue(bundle['complete'])
   h=w.digest(p.read_bytes());a={'action':'edit_text','input':'body.tex','output':'revised.tex','sha256':h,'edits':[{'old':'One coherent claim.','new':'A clearer claim.'}]}
   r=w.main(a);self.assertIn('verified',r);self.assertIn('One coherent',p.read_text())
   with self.assertRaises(ValueError):w.main(a)
   a['output']='bad.tex';a['sha256']='stale'
   with self.assertRaises(ValueError):w.main(a)
   a['sha256']=h;a['edits']=[{'old':'Intro','new':'New heading'}]
   with self.assertRaises(ValueError):w.main(a)
   self.assertFalse((w.ROOT/'bad.tex').exists())
   with self.assertRaises(ValueError):w.path('../secret')
   self.assertEqual(len(w.main({'action':'verify','names':['revised.tex']})['verified_files']),1)
unittest.main()
