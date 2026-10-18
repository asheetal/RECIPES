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

    @staticmethod
    def _col_to_n(col):
        n = 0
        for ch in col: n = n * 26 + ord(ch) - 64
        return n
    @staticmethod
    def _n_to_col(n):
        out = ''
        while n > 0:
            n, r = divmod(n - 1, 26)
            out = chr(65 + r) + out
        return out
    @staticmethod
    def _parse_ref(ref):
        m = re.match(r'([A-Z]+)(\d+)', ref or '')
        if not m: return None
        return (int(m.group(2)), FileDocument._col_to_n(m.group(1)))
    def _parse_xlsx(self, z):
        ns = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
        rel = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
        strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            strings = [''.join(t.text or '' for t in si.iter(ns + 't')) for si in self.xml(z.read('xl/sharedStrings.xml')).iter(ns + 'si')]
        relationships = {r.get('Id'): r for r in self.xml(z.read('xl/_rels/workbook.xml.rels'))}
        sheets = []
        for sheet in self.xml(z.read('xl/workbook.xml')).iter(ns + 'sheet'):
            relation = relationships[sheet.attrib[rel + 'id']]
            if relation.get('TargetMode') == 'External': raise ValueError('External worksheet relationship')
            target = self.target('xl/workbook.xml', relation.attrib['Target'])
            if not target.startswith('xl/'): raise ValueError('Invalid worksheet target')
            rows = []; maxcol = 0
            for row in self.xml(z.read(target)).iter(ns + 'row'):
                cells = {}
                for c in row.findall(ns + 'c'):
                    ref = c.get('r', '')
                    v = c.find(ns + 'v'); value = v.text if v is not None else None
                    if c.get('t') == 's' and value is not None: value = strings[int(value)]
                    elif c.get('t') == 'inlineStr': value = ''.join(t.text or '' for t in c.iter(ns + 't'))
                    formula = c.find(ns + 'f')
                    if value is None and formula is not None: value = formula.text
                    if value is not None: cells[ref] = value
                    letters = re.match(r'[A-Z]+', ref)
                    if letters: maxcol = max(maxcol, self._col_to_n(letters[0]))
                if cells: rows.append({'row': int(row.get('r') or 0), 'cells': cells})
            sheets.append({'name': sheet.get('name'), 'row_count': len(rows), 'columns': maxcol, 'rows': rows})
        return {'sheets': sheets}
    def _parse_csv(self):
        import csv as csvmod
        text = self.data.decode('utf-8-sig', errors='replace')
        rows_raw = list(csvmod.reader(text.splitlines()))
        rows = []; maxcol = 0
        for i, row in enumerate(rows_raw, 1):
            cells = {}
            for j, val in enumerate(row, 1):
                if val: cells[f'{self._n_to_col(j)}{i}'] = val
                maxcol = max(maxcol, j)
            if cells: rows.append({'row': i, 'cells': cells})
        return {'sheets': [{'name': self.path.stem, 'row_count': len(rows_raw), 'columns': maxcol, 'rows': rows}]}
    def _tabular_parsed(self):
        if self.data.startswith(b'PK'):
            z, kind = self.package()
            if kind != 'xlsx': raise ValueError(f'{kind} is not tabular')
            with z: return self._parse_xlsx(z)
        elif self.path.suffix.lower() == '.csv': return self._parse_csv()
        else: raise ValueError(f'not a tabular file: {self.path.name}')
    def tabular_catalog(self):
        return {'sheets': [{'name': s['name'], 'rows': s['row_count'], 'columns': s['columns']} for s in self._tabular_parsed()['sheets']], 'complete': True}
    def tabular_describe(self, sheet=None, rows=5, cols=10):
        parsed = self._tabular_parsed()
        sheets = parsed['sheets']
        if not sheets: return {'error': 'no sheets', 'complete': False}
        target = sheets[0]
        if sheet:
            found = False
            for s in sheets:
                if s['name'] == sheet: target = s; found = True; break
            if not found: return {'error': f'sheet not found: {sheet}', 'complete': False}
        sample = {}
        for r in target['rows'][:rows]:
            for ref, val in r['cells'].items():
                pr = self._parse_ref(ref)
                if pr and pr[1] <= cols: sample[ref] = val
        return {'sheet': target['name'], 'rows': target['row_count'], 'columns': target['columns'], 'sample': sample, 'sheets': [{'name': s['name'], 'rows': s['row_count'], 'columns': s['columns']} for s in sheets], 'note': 'Transposed sheets have labels in column A (use query with row_label and equals). Normal sheets have headers in row 1 (use query with column_label and equals). Use fetch(start,end) for cell ranges.', 'complete': True}
    @staticmethod
    def _match(val, equals, contains, in_values):
        if val is None: return False
        sv = str(val)
        if equals is not None and sv != str(equals): return False
        if contains is not None and str(contains).lower() not in sv.lower(): return False
        if in_values is not None:
            try:
                if sv not in [str(x) for x in in_values]: return False
            except TypeError: return False
        return True
    def tabular_query(self, sheet=None, row_label=None, column_label=None, equals=None, contains=None, in_values=None, limit=None, count_only=False):
        parsed = self._tabular_parsed()
        sheets = parsed['sheets']
        if not sheets: return {'error': 'no sheets', 'complete': False}
        target = sheets[0]
        if sheet:
            found = False
            for s in sheets:
                if s['name'] == sheet: target = s; found = True; break
            if not found: return {'error': f'sheet not found: {sheet}', 'complete': False}
        if row_label is not None:
            target_row = None
            for r in target['rows']:
                if r['cells'].get(f'A{r["row"]}') == row_label: target_row = r; break
            if not target_row: return {'error': f'row_label not found: {row_label}', 'complete': False}
            header_row = target['rows'][0]
            cols = []
            for ref, val in target_row['cells'].items():
                pr = self._parse_ref(ref)
                if not pr or pr[1] == 1: continue
                if not self._match(val, equals, contains, in_values): continue
                col_letter = self._n_to_col(pr[1])
                header = header_row['cells'].get(f'{col_letter}{header_row["row"]}')
                cols.append({'column': col_letter, 'header': header, 'value': val})
            total = len(cols)
            if limit: cols = cols[:limit]
            if count_only:
                return {'sheet': target['name'], 'row_label': row_label, 'equals': equals, 'contains': contains, 'in': in_values, 'count': total, 'complete': True}
            return {'sheet': target['name'], 'row_label': row_label, 'equals': equals, 'contains': contains, 'in': in_values, 'count': total, 'columns': [c['header'] for c in cols], 'matches': cols, 'complete': True}
        if column_label is not None:
            header_row = target['rows'][0]
            target_col = None
            for ref, val in header_row['cells'].items():
                if val == column_label:
                    pr = self._parse_ref(ref)
                    if pr: target_col = self._n_to_col(pr[1]); break
            if not target_col: return {'error': f'column_label not found: {column_label}', 'complete': False}
            matched = []
            for r in target['rows'][1:]:
                cell = r['cells'].get(f'{target_col}{r["row"]}')
                if not self._match(cell, equals, contains, in_values): continue
                matched.append({'row': r['row'], 'cells': r['cells']})
            total = len(matched)
            if limit: matched = matched[:limit]
            if count_only:
                return {'sheet': target['name'], 'column_label': column_label, 'equals': equals, 'contains': contains, 'in': in_values, 'count': total, 'complete': True}
            return {'sheet': target['name'], 'column_label': column_label, 'equals': equals, 'contains': contains, 'in': in_values, 'count': total, 'rows': matched, 'complete': True}
        return {'error': 'query requires row_label or column_label', 'complete': False}
    def tabular_fetch(self, sheet=None, start='A1', end=None, max_chars=100000):
        parsed = self._tabular_parsed()
        sheets = parsed['sheets']
        if not sheets: return {'error': 'no sheets', 'complete': False}
        target = sheets[0]
        if sheet:
            found = False
            for s in sheets:
                if s['name'] == sheet: target = s; found = True; break
            if not found: return {'error': f'sheet not found: {sheet}', 'complete': False}
        start_ref = self._parse_ref(start)
        end_ref = self._parse_ref(end) if end else start_ref
        if not start_ref or not end_ref: return {'error': 'invalid start/end', 'complete': False}
        r1, c1 = start_ref; r2, c2 = end_ref
        if r2 < r1: r1, r2 = r2, r1
        if c2 < c1: c1, c2 = c2, c1
        cells_out = {}; total = 0
        for r in target['rows']:
            if r['row'] < r1 or r['row'] > r2: continue
            for ref, val in r['cells'].items():
                pr = self._parse_ref(ref)
                if not pr: continue
                rn, cn = pr
                if cn < c1 or cn > c2: continue
                total += len(str(val))
                if total > max_chars: return {'error': f'fetch exceeds max_chars ({max_chars})', 'complete': False}
                cells_out[ref] = val
        return {'sheet': target['name'], 'range': f'{start}:{end}' if end else start, 'cell_count': len(cells_out), 'cells': cells_out, 'complete': True}
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
