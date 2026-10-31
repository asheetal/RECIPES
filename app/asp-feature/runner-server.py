#!/usr/bin/env python3
from http.server import HTTPServer, BaseHTTPRequestHandler
import json, os, base64, subprocess, pathlib, zipfile, io
HOST = '0.0.0.0'; PORT = 8091
RUNS_DIR = '/tmp/asp-runs'
SCRIPTS = '/app/asp-feature/scripts'
JSON_UTILS_SRC = os.path.join(SCRIPTS, 'json_utils.R')
TOOL_STEPS = {
    '1':  {'script': '01_preview_workbook.R', 'interp': ['Rscript'], 'needs_workbook': True,  'prior': None},
    '4':  {'script': '04_combinatorial_search.R', 'interp': ['Rscript'], 'prior': 'step3_out.json'},
    '6':  {'script': '06_filter_substantive.R', 'interp': ['Rscript'], 'prior': 'step5_out.json'},
    '8':  {'script': '08_bootstrap_imm.R', 'interp': ['Rscript'], 'prior': 'step7_out.json'},
    '9':  {'script': '09_descriptive_tables.R', 'interp': ['Rscript'], 'prior': 'step8_out.json'},
    '11': {'script': '11_render_diagram.R', 'interp': ['Rscript'], 'prior': 'step10_out.json'},
    '13': {'script': '13_package_tex.py', 'interp': ['python3'], 'prior': 'step12_out.json', 'extra_args': ['--correlations-from', 'step9_out.json'], 'artifacts': ['*.tex', '*.png', '*.R', '*.pdf']},
}
COGNITIVE_STEPS = {'2','3','5','7','10','12'}
def safe_id(s):
    return isinstance(s, str) and len(s) > 0 and all(c.isalnum() or c in '-_' for c in s)
class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        if self.path == '/health':
            self._json({'ok': True, 'tool_steps': sorted(TOOL_STEPS), 'cognitive_steps': sorted(COGNITIVE_STEPS)}); return
        if self.path.startswith('/read'):
            from urllib.parse import urlparse, parse_qs
            q = parse_qs(urlparse(self.path).query)
            run_id = (q.get('run_id') or [''])[0]
            step = (q.get('step') or [''])[0]
            if not safe_id(run_id) or not step.isdigit():
                return self._json({'ok': False, 'error': 'bad run_id or step'})
            p = os.path.join(RUNS_DIR, run_id, f'step{step}_out.json')
            if not os.path.isfile(p):
                return self._json({'ok': False, 'error': 'not found', 'step': step})
            try:
                return self._json({'ok': True, 'step': step, 'output': json.loads(pathlib.Path(p).read_text())})
            except Exception as e:
                return self._json({'ok': False, 'error': f'parse: {e}'})
        self.send_error(404)
    def do_POST(self):
        if self.path == '/compile-tex':
            import uuid, shutil
            n = int(self.headers.get('Content-Length', 0))
            try:
                body = json.loads(self.rfile.read(n) or b'{}')
            except Exception as e:
                return self._json({'ok': False, 'error': f'bad json: {e}'})
            if isinstance(body.get('files'), dict) and body['files']:
                files = body['files']; main = body.get('main', ''); bib_backend = body.get('bib_backend', None)
            elif isinstance(body.get('tex'), str) and body['tex'].strip():
                files = {'report.tex': body['tex']}; main = 'report.tex'; bib_backend = None
            else:
                return self._json({'ok': False, 'error': 'either "tex" or "files"+"main" required'})
            def _safe(fn):
                return (isinstance(fn, str) and 0 < len(fn) < 128 and '/' not in fn and '\\' not in fn and '..' not in fn and not fn.startswith('.'))
            if not _safe(main):
                return self._json({'ok': False, 'error': 'bad main filename'})
            for fn in files:
                if not _safe(fn):
                    return self._json({'ok': False, 'error': f'bad filename: {fn}'})
                if not isinstance(files[fn], str):
                    return self._json({'ok': False, 'error': f'file {fn} content must be string'})
            run_tag = ''.join(c for c in str(body.get('run_id', '')) if c.isalnum() or c in '-_')[:32] or 'run'
            workdir = os.path.join(RUNS_DIR, 'tex-' + run_tag + '-' + uuid.uuid4().hex[:8])
            os.makedirs(workdir, exist_ok=True)
            try:
                for fn, content in files.items():
                    pathlib.Path(os.path.join(workdir, fn)).write_text(content, encoding='utf-8')
                r1 = subprocess.run(['pdflatex', '-interaction=nonstopmode', '-halt-on-error', main],
                                    cwd=workdir, capture_output=True, text=True, timeout=60)
                if r1.returncode != 0:
                    log_tail = ((r1.stdout or '')[-2500:] + (r1.stderr or '')[-500:]).strip()
                    return self._json({'ok': False, 'stage': 'pdflatex-pass1', 'returncode': r1.returncode, 'log_tail': log_tail})
                if bib_backend:
                    base = os.path.splitext(main)[0]
                    if bib_backend == 'biber':
                        rb = subprocess.run(['biber', base], cwd=workdir, capture_output=True, text=True, timeout=60)
                    elif bib_backend == 'bibtex':
                        rb = subprocess.run(['bibtex', base], cwd=workdir, capture_output=True, text=True, timeout=60)
                    else:
                        return self._json({'ok': False, 'error': f'unknown bib_backend: {bib_backend}'})
                    if rb.returncode != 0:
                        log_tail = ((rb.stdout or '')[-2000:] + (rb.stderr or '')[-500:]).strip()
                        return self._json({'ok': False, 'stage': bib_backend, 'returncode': rb.returncode, 'log_tail': log_tail})
                for _ in range(2):
                    subprocess.run(['pdflatex', '-interaction=nonstopmode', main],
                                   cwd=workdir, capture_output=True, text=True, timeout=60)
                pdf_name = os.path.splitext(main)[0] + '.pdf'
                pdf_path = os.path.join(workdir, pdf_name)
                if not os.path.isfile(pdf_path) or os.path.getsize(pdf_path) < 1024:
                    return self._json({'ok': False, 'error': f'no pdf after passes (looked for {pdf_name})'})
                pdf_b64 = base64.b64encode(pathlib.Path(pdf_path).read_bytes()).decode('ascii')
                return self._json({'ok': True, 'pdf_b64': pdf_b64, 'bytes': len(pdf_b64) * 3 // 4})
            finally:
                shutil.rmtree(workdir, ignore_errors=True)
        if self.path != '/run': self.send_error(404); return
        n = int(self.headers.get('Content-Length', 0))
        try: body = json.loads(self.rfile.read(n) or b'{}')
        except Exception as e: return self._json({'ok': False, 'error': f'bad json: {e}'})
        step = str(body.get('step', ''))
        run_id = body.get('run_id', '')
        if not safe_id(run_id): return self._json({'ok': False, 'error': 'bad run_id'})
        if step not in TOOL_STEPS and step not in COGNITIVE_STEPS:
            return self._json({'ok': False, 'error': f'step {step} not enabled'})
        workdir = os.path.join(RUNS_DIR, run_id)
        os.makedirs(workdir, exist_ok=True)
        ju_dst = os.path.join(workdir, 'json_utils.R')
        if not os.path.exists(ju_dst):
            pathlib.Path(ju_dst).write_bytes(pathlib.Path(JSON_UTILS_SRC).read_bytes())
        if step in COGNITIVE_STEPS:
            payload = body.get('payload')
            if not isinstance(payload, dict):
                return self._json({'ok': False, 'error': 'payload object required for cognitive steps'})
            out_path = os.path.join(workdir, f'step{step}_out.json')
            pathlib.Path(out_path).write_text(json.dumps(payload, indent=2))
            return self._json({'ok': True, 'step': step, 'cognitive': True, 'workdir': workdir})
        spec = TOOL_STEPS[step]
        cmd = list(spec['interp']) + [os.path.join(SCRIPTS, spec['script'])]
        if spec.get('needs_workbook'):
            wb_name = body.get('workbook_name') or 'input.xlsx'
            wb_path = os.path.join(workdir, wb_name)
            if body.get('workbook_b64'):
                pathlib.Path(wb_path).write_bytes(base64.b64decode(body['workbook_b64']))
            if not os.path.isfile(wb_path):
                return self._json({'ok': False, 'error': 'workbook missing'})
            cmd.append(wb_path)
        else:
            prior = os.path.join(workdir, spec['prior'])
            if not os.path.isfile(prior):
                return self._json({'ok': False, 'error': f'missing prior: {spec["prior"]}'})
            cmd.append(prior)
            for a in spec.get('extra_args', []):
                if a.startswith('step') and a.endswith('.json'):
                    ap = os.path.join(workdir, a)
                    if not os.path.isfile(ap): return self._json({'ok': False, 'error': f'missing {a}'})
                    cmd.append(ap)
                else:
                    cmd.append(a)
        env = dict(os.environ, TZ='UTC')
        try: r = subprocess.run(cmd, cwd=workdir, capture_output=True, text=True, timeout=1800, env=env)
        except subprocess.TimeoutExpired: return self._json({'ok': False, 'error': 'timeout'})
        if r.returncode != 0:
            return self._json({'ok': False, 'error': f'exit {r.returncode}', 'stderr': (r.stderr or '')[-3000:], 'stdout': (r.stdout or '')[-1500:]})
        stdout = (r.stdout or '').strip()
        try: parsed = json.loads(stdout)
        except Exception as e:
            return self._json({'ok': False, 'error': f'non-json stdout: {e}', 'stdout_head': stdout[:1500], 'stderr': (r.stderr or '')[-1500:]})
        pathlib.Path(os.path.join(workdir, f'step{step}_out.json')).write_text(json.dumps(parsed, indent=2))
        resp = {'ok': True, 'step': step, 'workdir': workdir, 'output': parsed, 'stderr': (r.stderr or '')[-1000:]}
        if step == '13':
            buf = io.BytesIO()
            with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
                for pat in spec.get('artifacts', []):
                    for f in pathlib.Path(workdir).glob(pat):
                        if f.is_file(): zf.write(f, arcname=f.name)
            resp['artifacts_b64'] = base64.b64encode(buf.getvalue()).decode()
            resp['artifacts_bytes'] = buf.tell()
            pdf_p = pathlib.Path(workdir) / 'Automated_SEM_Recipe_Report.pdf'
            if pdf_p.is_file():
                resp['pdf_b64'] = base64.b64encode(pdf_p.read_bytes()).decode()
                resp['pdf_name'] = pdf_p.name
                resp['pdf_bytes'] = pdf_p.stat().st_size
        return self._json(resp)
    def _json(self, obj):
        data = json.dumps(obj).encode()
        self.send_response(200); self.send_header('Content-Type', 'application/json'); self.send_header('Content-Length', str(len(data))); self.end_headers(); self.wfile.write(data)
if __name__ == '__main__':
    HTTPServer((HOST, PORT), H).serve_forever()
