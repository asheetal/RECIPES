import hashlib, json, posixpath, re, subprocess, zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

class FileDocument:
    """Content-based, model-independent file reader; original bytes stay unchanged."""
    def __init__(self, filename, root):
        self.path = Path(filename).resolve()
        self.root = Path(root).resolve()
        if not self.path.is_relative_to(self.root) or self.path == self.root:
            raise ValueError('File must be inside the file root')
        self.data = self.path.read_bytes()

    @staticmethod
    def compact(value):
        return json.dumps(value, ensure_ascii=False, separators=(',', ':'), allow_nan=False)

    @staticmethod
    def decode(data):
        if data.startswith((b'\xff\xfe', b'\xfe\xff')):
            text = data.decode('utf-16')
        else:
            text = data.decode('utf-8-sig')
        if any(ord(c) < 32 and c not in '\t\r\n' for c in text):
            raise ValueError('Unsupported binary file')
        return text

    @staticmethod
    def xml(data):
        if b'<!DOCTYPE' in data.upper() or b'<!ENTITY' in data.upper():
            raise ValueError('XML declarations with external entities are unsupported')
        return ET.fromstring(data)

    @staticmethod
    def target(source, target):
        value = target.lstrip('/') if target.startswith('/') else posixpath.normpath(posixpath.join(posixpath.dirname(source), target))
        if value.startswith('../') or value == '..':
            raise ValueError('Invalid document relationship')
        return value

    def package(self):
        z = zipfile.ZipFile(self.path)
        infos = z.infolist()
        names = [v.filename for v in infos]
        if len(names) != len(set(names)) or any(n.startswith('/') or '..' in n.split('/') or '\\' in n for n in names):
            z.close(); raise ValueError('Invalid Office package paths')
        if any(i.flag_bits & 1 for i in infos) or sum(i.file_size for i in infos) > 256 * 1024 * 1024:
            z.close(); raise ValueError('Encrypted or oversized Office package')
        if '[Content_Types].xml' not in names or any('vbaproject' in n.lower() for n in names):
            z.close(); raise ValueError('Unsupported Office package')
        types = self.xml(z.read('[Content_Types].xml'))
        formats = {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml': ('xlsx', 'xl/workbook.xml'),
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml': ('docx', 'word/document.xml'),
            'application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml': ('pptx', 'ppt/presentation.xml')
        }
        found = [formats[x.get('ContentType')] for x in types if x.get('ContentType') in formats]
        if len(found) != 1 or found[0][1] not in names:
            z.close(); raise ValueError('Only XLSX, DOCX and PPTX Office packages are supported')
        if any('macroenabled' in x.get('ContentType', '').lower() for x in types):
            z.close(); raise ValueError('Macro-enabled documents are unsupported')
        if z.testzip():
            z.close(); raise ValueError('Corrupt Office package')
        return z, found[0][0]

    def spreadsheet(self, z):
        ns = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
        rel = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
        strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            strings = [''.join(t.text or '' for t in si.iter(ns + 't')) for si in self.xml(z.read('xl/sharedStrings.xml')).iter(ns + 'si')]
        relationships = {r.get('Id'): r for r in self.xml(z.read('xl/_rels/workbook.xml.rels'))}
        sheets = []
        for sheet in self.xml(z.read('xl/workbook.xml')).iter(ns + 'sheet'):
            relation = relationships[sheet.attrib[rel + 'id']]
            if relation.get('TargetMode') == 'External':
                raise ValueError('External worksheet relationship')
            target = self.target('xl/workbook.xml', relation.attrib['Target'])
            if not target.startswith('xl/'):
                raise ValueError('Invalid worksheet target')
            rows = []; maxcol = 0
            for row in self.xml(z.read(target)).iter(ns + 'row'):
                cells = {}
                for c in row.findall(ns + 'c'):
                    ref = c.get('r', '')
                    v = c.find(ns + 'v'); value = v.text if v is not None else None
                    if c.get('t') == 's' and value is not None:
                        value = strings[int(value)]
                    elif c.get('t') == 'inlineStr':
                        value = ''.join(t.text or '' for t in c.iter(ns + 't'))
                    formula = c.find(ns + 'f')
                    if value is not None or formula is not None:
                        cells[ref] = {'value': value, 'formula': formula.text, 'cached_value_only': True} if formula is not None else value
                    letters = re.match(r'[A-Z]+', ref)
                    if letters:
                        n = 0
                        for ch in letters[0]: n = n * 26 + ord(ch) - 64
                        maxcol = max(maxcol, n)
                rows.append({'row': row.get('r'), 'cells': cells})
            sheets.append({'sheet': sheet.get('name'), 'row_records': len(rows), 'columns': maxcol, 'rows': rows})
        return self.compact({'sheets': sheets, 'note': 'Reads actual worksheet cells, ignoring unreliable declared dimensions and drawing references. Formulas are not recalculated; cached values may be absent or stale.'})

    def word(self, z):
        ns = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
        sections = []
        for name in z.namelist():
            if name == 'word/document.xml' or re.fullmatch(r'word/(footnotes|endnotes|comments|header\d+|footer\d+)\.xml', name):
                root = self.xml(z.read(name))
                sections.append(name + '\n' + '\n'.join(''.join(t.text or '' for t in par.iter(ns + 't')) for par in root.iter(ns + 'p')))
        return '\n'.join(sections)

    def presentation(self, z):
        ns = '{http://schemas.openxmlformats.org/presentationml/2006/main}'
        a = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
        rel = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
        links = {r.get('Id'): r for r in self.xml(z.read('ppt/_rels/presentation.xml.rels'))}
        slides = []
        for idx, slide in enumerate(self.xml(z.read('ppt/presentation.xml')).iter(ns + 'sldId'), 1):
            link = links[slide.attrib[rel + 'id']]
            if link.get('TargetMode') == 'External': raise ValueError('External slide relationship')
            target = self.target('ppt/presentation.xml', link.attrib['Target'])
            root = self.xml(z.read(target))
            item = {'slide': idx, 'paragraphs': [''.join(t.text or '' for t in p.iter(a + 't')) for p in root.iter(a + 'p')]}
            relpath = posixpath.join(posixpath.dirname(target), '_rels', posixpath.basename(target) + '.rels')
            if relpath in z.namelist():
                notes = []
                for r in self.xml(z.read(relpath)):
                    if r.get('Type', '').endswith('/notesSlide') and r.get('TargetMode') != 'External':
                        n = self.xml(z.read(self.target(target, r.attrib['Target'])))
                        notes.extend(''.join(t.text or '' for t in p.iter(a + 't')) for p in n.iter(a + 'p'))
                item['notes'] = notes
            slides.append(item)
        return self.compact({'slides': slides, 'note': 'Extracts slide text and notes; images, charts, and visual layout require visual inspection.'})

    def read(self):
        if self.data.startswith(b'%PDF-'):
            r = subprocess.run(['pdftotext', '-layout', str(self.path), '-'], capture_output=True, text=True, timeout=30, check=True)
            text = r.stdout
            if not text.strip(): raise ValueError('PDF contains no extractable text; OCR is required')
        elif self.data.startswith(b'PK'):
            z, kind = self.package()
            with z:
                text = {'xlsx': self.spreadsheet, 'docx': self.word, 'pptx': self.presentation}[kind](z)
        else:
            text = self.decode(self.data)
            stripped = text.lstrip()
            try:
                text = self.compact(json.loads(text))
            except (ValueError, TypeError):
                if self.path.suffix.lower() == '.json':
                    raise ValueError('Invalid JSON document')
                if stripped.startswith('<'):
                    try: self.xml(text.encode('utf-8'))
                    except ValueError:
                        if self.path.suffix.lower() == '.xml': raise
                    except ET.ParseError:
                        if self.path.suffix.lower() == '.xml': raise
        return {'name': str(self.path.relative_to(self.root)), 'bytes': len(self.data), 'sha256': hashlib.sha256(self.data).hexdigest(), 'text': text}
