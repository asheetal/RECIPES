#!/usr/bin/env python3
from http.server import HTTPServer, BaseHTTPRequestHandler
import json, os, base64, subprocess, pathlib, uuid, shutil

HOST = '0.0.0.0'
PORT = 8091

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def _json(self, obj, code=200):
        b = json.dumps(obj).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(b)))
        self.end_headers()
        self.wfile.write(b)
    def do_GET(self):
        if self.path == '/health':
            return self._json({'ok': True, 'tool': 'tex-compile',
                               'has_pdflatex': shutil.which('pdflatex') is not None})
        self.send_error(404)
    def do_POST(self):
        if self.path != '/compile-tex':
            return self.send_error(404)
        n = int(self.headers.get('Content-Length', 0))
        try:
            body = json.loads(self.rfile.read(n) or b'{}')
        except Exception as e:
            return self._json({'ok': False, 'error': 'bad json: ' + str(e)}, 400)
        tex = body.get('tex')
        if not isinstance(tex, str) or not tex.strip():
            return self._json({'ok': False, 'error': 'tex (string) required'}, 400)
        run_tag = ''.join(c for c in str(body.get('run_id', '')) if c.isalnum() or c in '-_')[:32] or 'run'
        workdir = os.path.join('/tmp/tex-runs', run_tag + '-' + uuid.uuid4().hex[:8])
        os.makedirs(workdir, exist_ok=True)
        pathlib.Path(os.path.join(workdir, 'report.tex')).write_text(tex, encoding='utf-8')
        try:
            r1 = subprocess.run(['pdflatex', '-interaction=nonstopmode', '-halt-on-error', 'report.tex'],
                                cwd=workdir, capture_output=True, text=True, timeout=60)
            if r1.returncode != 0:
                r2 = subprocess.run(['pdflatex', '-interaction=nonstopmode', 'report.tex'],
                                    cwd=workdir, capture_output=True, text=True, timeout=60)
                if r2.returncode != 0:
                    log_tail = ((r2.stdout or '')[-1500:] + (r2.stderr or '')[-400:]).strip()
                    return self._json({'ok': False, 'stage': 'pdflatex',
                                       'returncode': r2.returncode,
                                       'log_tail': log_tail}, 500)
            pdf_path = os.path.join(workdir, 'report.pdf')
            if not os.path.isfile(pdf_path):
                return self._json({'ok': False, 'error': 'no pdf produced'}, 500)
            pdf_b64 = base64.b64encode(pathlib.Path(pdf_path).read_bytes()).decode('ascii')
            return self._json({'ok': True, 'pdf_b64': pdf_b64, 'bytes': len(pdf_b64)*3//4})
        finally:
            shutil.rmtree(workdir, ignore_errors=True)

if __name__ == '__main__':
    print(f'tex-compile listening on {HOST}:{PORT}', flush=True)
    HTTPServer((HOST, PORT), H).serve_forever()
