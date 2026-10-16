import re,sys
from pathlib import Path
p=Path(sys.argv[1]);s=p.read_text();matches=[]
for m in re.finditer(r'new Set\(\[([^\]]+)\]\)',s):
 if all(x in m[1] for x in ['.groovy','.tfstate','.nomad','.tex','.rpm']):matches.append(m)
assert len(matches)==1,'Output extension table changed; stopped'
m=matches[0];s=s[:m.start(1)]+m[1]+',".bib",".bst",".cls",".sty",".bbl",".bbx",".cbx",".makefile","Makefile"'+s[m.end(1):]
p.write_text(s)
