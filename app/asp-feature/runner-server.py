#!/usr/bin/env python3
from http.server import HTTPServer, BaseHTTPRequestHandler
import json, os, base64, subprocess, pathlib
HOST = '0.0.0.0'; PORT = 8091
RUNS_DIR = '/tmp/asp-runs'
STEPS = { '1': {'script': '01_preview_workbook.R', 'interp': ['Rscript'], 'needs_workbook': True} }
class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        if self.path == '/health':
            self._json({'ok': True, 'steps': sorted(STEPS.keys())}); return
        self.send_error(404)
    def do_POST(self):
        if self.path != '/run': self.send_error(404); return
        n = int(self.headers.get('Content-Length', 0))
        try: body = json.loads(self.rfile.read(n) or b'{}')
        except Exception as e: return self._json({'ok': False, 'error': f'bad json: {e}'})
        step = str(body.get('step', ''))
        run_id = body.get('run_id', '')
        if step not in STEPS: return self._json({'ok': False, 'error': f'step {step} not enabled'})
        if not run_id or not all(c.isalnum() or c in '-_' for c in run_id): return self._json({'ok': False, 'error': 'bad run_id'})
        workdir = os.path.join(RUNS_DIR, run_id)
        os.makedirs(workdir, exist_ok=True)
        spec = STEPS[step]
        cmd = list(spec['interp']) + [f'/app/asp-feature/scripts/{spec["script"]}']
        if spec.get('needs_workbook'):
            wb_name = body.get('workbook_name') or 'input.xlsx'
            wb_path = os.path.join(workdir, wb_name)
            if body.get('workbook_b64'):
                pathlib.Path(wb_path).write_bytes(base64.b64decode(body['workbook_b64']))
            if not os.path.isfile(wb_path):
                return self._json({'ok': False, 'error': 'workbook missing'})
            cmd.append(wb_path)
        else:
            prior = os.path.join(workdir, f'step{int(step)-1}_out.json')
            if not os.path.isfile(prior): return self._json({'ok': False, 'error': f'missing prior: {prior}'})
            cmd.append(prior)
        env = dict(os.environ, TZ='UTC')
        try: r = subprocess.run(cmd, cwd=workdir, capture_output=True, text=True, timeout=600, env=env)
        except subprocess.TimeoutExpired: return self._json({'ok': False, 'error': 'timeout'})
        if r.returncode != 0:
            return self._json({'ok': False, 'error': f'exit {r.returncode}', 'stderr': (r.stderr or '')[-3000:], 'stdout': (r.stdout or '')[-1000:]})
        stdout = (r.stdout or '').strip()
        try: parsed = json.loads(stdout)
        except Exception as e:
            return self._json({'ok': False, 'error': f'non-json stdout: {e}', 'stdout_head': stdout[:1000], 'stderr': (r.stderr or '')[-1000:]})
        pathlib.Path(os.path.join(workdir, f'step{step}_out.json')).write_text(json.dumps(parsed, indent=2))
        self._json({'ok': True, 'step': step, 'workdir': workdir, 'output': parsed, 'stderr': (r.stderr or '')[-1000:]})
    def _json(self, obj):
        data = json.dumps(obj).encode()
        self.send_response(200); self.send_header('Content-Type', 'application/json'); self.send_header('Content-Length', str(len(data))); self.end_headers(); self.wfile.write(data)
if __name__ == '__main__':
    HTTPServer((HOST, PORT), H).serve_forever()
