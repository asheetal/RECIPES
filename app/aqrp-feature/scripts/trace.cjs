#!/usr/bin/env node
// aqrp-feature/scripts/trace.cjs
// Usage:
//   docker exec librechat node /app/aqrp-feature/scripts/trace.cjs latest
//   docker exec librechat node /app/aqrp-feature/scripts/trace.cjs <traceId>
// Prints a linear, human-readable AQRP flow trace:
//   LLM_TRIAGE → LLM_SURGERY (with per-iteration tool calls + results) → LLM_OPD → controller_error
// Reads /app/admin-tools/prompt-dumps/<traceId>/*.json (bind mount of /var/log/librechat/prompt-dumps/).

const fs = require('fs');
const path = require('path');
const ROOT = '/app/admin-tools/prompt-dumps';

function pick(o, paths) {
  for (const p of paths) {
    let v = o;
    for (const k of p.split('.')) { if (v == null) break; v = v[k]; }
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return null;
}
const trim = (s, n) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, n || 200);
const fmtTime = (n) => new Date(n).toISOString().slice(11, 23);

function resolveTraceId(arg) {
  if (arg && arg !== 'latest') return arg;
  const dirs = fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => ({ name: d.name, mtime: fs.statSync(path.join(ROOT, d.name)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  if (!dirs.length) throw new Error('no trace dirs in ' + ROOT);
  return dirs[0].name;
}

function loadEvents(traceId) {
  const dir = path.join(ROOT, traceId);
  if (!fs.existsSync(dir)) throw new Error('trace dir missing: ' + dir);
  const out = [];
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    try {
      const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      out.push({ n: Number(f.split('-')[0]) || 0, f, j });
    } catch (_) {}
  }
  out.sort((a, b) => a.n - b.n);
  return out;
}

function render(events) {
  let activeRole = null;
  let iter = 0;
  let stepCalls = 0;
  const stepSeq = [];

  for (const { n, j } of events) {
    const ev = j.event, role = j.role, d = j.data || {};

    if (ev === 'boundary_input' && role) {
      activeRole = role;
      const pr = String(pick(d, ['currentPrompt', 'prompt']) || '');
      console.log('');
      console.log('[' + fmtTime(n) + ']  ' + role + '  ┌─ start');
      if (pr) console.log('                │ prompt: "' + trim(pr, 80) + '…"');
      continue;
    }

    if (ev === 'boundary_output' && role) {
      if (role === 'LLM_TRIAGE') {
        const route = pick(d, ['route']) || '?', source = pick(d, ['source']) || '?';
        console.log('[' + fmtTime(n) + ']  ' + role + '  └─ decision  route=' + route + '  source=' + source);
      } else if (role === 'LLM_SURGERY') {
        const handoff = pick(d, ['handoff']) || {};
        const status = handoff.status || '?', draft = String(handoff.draft || '');
        console.log('');
        console.log('[' + fmtTime(n) + ']  ' + role + '  └─ handoff  status=' + status + '  draft_len=' + draft.length);
      } else if (role === 'LLM_OPD') {
        const reply = String(pick(d, ['reply', 'response', 'content', 'output', 'text', 'message']) || '');
        console.log('[' + fmtTime(n) + ']  ' + role + '  └─ reply  len=' + reply.length);
      }
      activeRole = null;
      continue;
    }

    if (ev === 'model_output') { iter++; continue; }

    if (ev === 'tool_call') {
      const name = pick(d, ['name', 'toolName', 'tool.name', 'tool', 'function.name']) || '?';
      let args = pick(d, ['arguments', 'args', 'input', 'tool.arguments', 'tool.args', 'function.arguments']);
      if (typeof args === 'string') { try { args = JSON.parse(args); } catch (_) {} }
      let desc = '';
      if (args && typeof args === 'object') {
        if (args.step !== undefined) { desc += 'step=' + args.step; stepSeq.push(Number(args.step)); stepCalls++; }
        if (args.file_id) desc += '  file_id=' + String(args.file_id).slice(0, 12);
        if (args.payload && typeof args.payload === 'object') desc += '  payload=[' + Object.keys(args.payload).join(',') + ']';
      }
      if (!desc) desc = '(no args)';
      console.log('[' + fmtTime(n) + ']  ' + (activeRole || 'LLM_SURGERY') + '  iter ' + String(iter).padStart(2, ' ') + '  → ' + name + '  ' + desc);
      continue;
    }

    if (ev === 'tool_result') {
      const err = pick(d, ['error']), ok = pick(d, ['ok']);
      const status = err ? ('ERR: ' + trim(err, 120)) : (ok === false ? 'FAIL' : 'ok');
      console.log('[' + fmtTime(n) + ']  ' + (activeRole || 'LLM_SURGERY') + '  ← ' + status);
      continue;
    }

    if (ev === 'controller_error') {
      console.log('');
      console.log('[' + fmtTime(n) + ']  ⚠ CONTROLLER_ERROR  ' + JSON.stringify(d).slice(0, 400));
      continue;
    }

    if (ev === 'surgery_finished') {
      console.log('');
      console.log('[' + fmtTime(n) + ']  ─── surgery_finished');
    }
  }

  console.log('');
  console.log('════════════════════════════════════════════════════════════');
  console.log('FLOW SUMMARY');
  console.log('  surgeon iterations:  ' + iter);
  console.log('  tool calls w/ step:  ' + stepCalls);
  console.log('  step sequence:       ' + (stepSeq.length ? stepSeq.join(',') : '(none captured)'));
  console.log('  step 32 called:      ' + (stepSeq.includes(32) ? 'YES' : 'NO'));
  console.log('════════════════════════════════════════════════════════════');
}

try {
  const traceId = resolveTraceId(process.argv[2]);
  const events = loadEvents(traceId);
  console.log('════════════════════════════════════════════════════════════');
  console.log('trace: ' + traceId + '  (' + events.length + ' events)');
  console.log('════════════════════════════════════════════════════════════');
  render(events);
} catch (e) {
  console.error('ERROR: ' + (e && e.message ? e.message : e));
  process.exit(1);
}
