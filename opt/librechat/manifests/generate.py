#!/usr/bin/env python3
"""Generate the surgeon toolchain manifest (Python).

Packages live outside git (/opt/librechat/python/lib); only this generator and
its output are tracked, so the exact installed versions are reproducible and
auditable without ever committing the packages themselves.
"""
import datetime, pathlib, re, sys

LIB = pathlib.Path('/opt/librechat/python/lib')
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path('/opt/librechat/manifests')

def norm(name: str) -> str:
    return re.sub(r'[-_.]+', '-', name).lower()

rows = []
for meta in sorted(LIB.glob('*.dist-info/METADATA')):
    name = ver = None
    with meta.open(encoding='utf-8', errors='replace') as fh:
        for line in fh:
            if name is None and line.startswith('Name: '):
                name = line[6:].strip()
            elif ver is None and line.startswith('Version: '):
                ver = line[9:].strip()
            if name and ver:
                break
    if name and ver:
        rows.append(f'{norm(name)}=={ver}')

rows = sorted(set(rows))
if not rows:
    sys.exit(f'no dist-info packages found under {LIB}')

OUT.mkdir(parents=True, exist_ok=True)
text = '\n'.join(rows) + '\n'
(OUT / f'{datetime.date.today().isoformat()}.txt').write_text(text)
(OUT / 'current.txt').write_text(text)
print(f'{len(rows)} packages -> {OUT}/current.txt')
