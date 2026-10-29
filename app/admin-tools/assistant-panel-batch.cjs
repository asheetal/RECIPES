'use strict';
// LLM_ASSISTANT_PANEL_BATCH — sibling of assistant-panel.cjs. Same output
// envelope ({panel, n, responses}). Loops M records; per record fans out to
// all N members in parallel; per record up to 5 trials with exponential
// backoff; a slot still failing after trial 5 is a row codes:["NA"].
const panel = require('/app/admin-tools/assistant-panel.cjs');
const TRIALS = 5;
const WAIT = [1000, 2000, 4000, 8000];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function recordId(r, i) {
  if (r && typeof r === 'object' && !Array.isArray(r)) {
    for (const k of ['record_id', 'id']) {
      if (r[k] !== undefined && r[k] !== null) return String(r[k]);
    }
  }
  return String(i);
}

function codesOf(json) {
  if (json && Array.isArray(json.rows) && json.rows.length) {
    const r0 = json.rows[0];
    if (r0 && Array.isArray(r0.codes) && r0.codes.length) return r0.codes.map(String);
  }
  if (json && Array.isArray(json.codes) && json.codes.length) return json.codes.map(String);
  return null;
}

async function batch({ query, schema, records }) {
  if (typeof query !== 'string' || !query.trim()) throw Error('query is required');
  if (!schema || typeof schema !== 'object' || schema.type !== 'object' || typeof schema.properties !== 'object')
    throw Error('schema must be a JSON Schema object with type=object and properties');
  if (!Array.isArray(records) || !records.length) throw Error('records must be a non-empty array');

  const M = records.length;
  let N = null;
  const slots = []; // slots[s] = { coder_id, rows: [] }

  for (let i = 0; i < M; i++) {
    const id = recordId(records[i], i);
    const q = query + '\n\nRECORD_ID: ' + id + '\nRECORD: ' + JSON.stringify(records[i]);
    const got = {}; // slot idx -> member json for this record

    for (let t = 0; t < TRIALS; t++) {
      let out = null;
      try {
        out = await panel.askVerbose({ query: q, schema });
      } catch (e) {
        out = null;
      }
      if (out && Array.isArray(out.raw)) {
        for (const r of out.raw) {
          if (r && r.ok && r.json && typeof r.json === 'object' && got[r.idx] === undefined) {
            if (codesOf(r.json)) got[r.idx] = r.json;
          }
        }
      }
      if (N === null && out && out.meta && Number.isInteger(out.meta.n)) N = out.meta.n;
      if (N !== null) {
        let missing = 0;
        for (let s = 0; s < N; s++) if (got[s] === undefined) missing++;
        if (missing === 0) break;
      }
      if (t < TRIALS - 1) await sleep(WAIT[t]);
    }

    if (N === null) throw Error('panel batch could not resolve roster size at record ' + id);

    for (let s = 0; s < N; s++) {
      if (!slots[s]) slots[s] = { coder_id: null, rows: [] };
      const j = got[s];
      const cs = j ? codesOf(j) : null;
      if (cs) {
        if (!slots[s].coder_id && j && typeof j.coder_id === 'string' && j.coder_id) slots[s].coder_id = j.coder_id;
        slots[s].rows.push({ record_id: id, codes: cs });
      } else {
        slots[s].rows.push({ record_id: id, codes: ['NA'] });
      }
    }
  }

  const responses = slots.map((s, idx) => ({
    coder_id: s.coder_id || 'panel-slot-' + idx,
    rows: s.rows,
  }));

  return { panel: 'LLM_ASSISTANT_PANEL_BATCH', n: N, responses };
}

module.exports = { batch };
