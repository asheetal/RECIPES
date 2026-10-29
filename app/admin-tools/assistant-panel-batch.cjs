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

async function batch({ query, schema, records, onProgress, skipIds, concurrency }) {
  if (typeof query !== 'string' || !query.trim()) throw Error('query is required');
  if (!schema || typeof schema !== 'object' || schema.type !== 'object' || typeof schema.properties !== 'object')
    throw Error('schema must be a JSON Schema object with type=object and properties');
  if (!Array.isArray(records) || !records.length) throw Error('records must be a non-empty array');

  const M = records.length;
  const W = Math.max(1, Math.min(8, Number.isInteger(concurrency) ? concurrency : 4));
  const skip = new Set(Array.isArray(skipIds) ? skipIds.map(String) : []);
  const todo = [];
  for (let i = 0; i < M; i++) {
    const id = recordId(records[i], i);
    if (!skip.has(id)) todo.push({ i, id, record: records[i] });
  }
  let N = null;
  const perRecord = new Array(M);

  async function runOne(entry) {
    const { i, id, record } = entry;
    const q = query + '\n\nRECORD_ID: ' + id + '\nRECORD: ' + JSON.stringify(record);
    const got = {};
    if (typeof onProgress === 'function') { try { await onProgress({ event: 'start', i, record_id: id, total: M }); } catch (e) {} }
    try {
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
      const rowsForRecord = [];
      for (let s = 0; s < N; s++) {
        const j = got[s];
        const cs = j ? codesOf(j) : null;
        rowsForRecord.push({ coder_id: (j && typeof j.coder_id === 'string' && j.coder_id) ? j.coder_id : null, codes: cs || ['NA'] });
      }
      perRecord[i] = rowsForRecord;
      if (typeof onProgress === 'function') {
        const perCoder = rowsForRecord.map((r, s) => ({ coder_id: r.coder_id || ('panel-slot-' + s), codes: r.codes }));
        try { await onProgress({ event: 'done', i, record_id: id, total: M, perCoder }); } catch (e) {}
      }
    } catch (e) {
      if (typeof onProgress === 'function') { try { await onProgress({ event: 'error', i, record_id: id, total: M, error: e && e.message ? e.message : String(e) }); } catch (_) {} }
      throw e;
    }
  }

  let cursor = 0;
  async function worker() {
    while (true) {
      const idx = cursor++;
      if (idx >= todo.length) return;
      await runOne(todo[idx]);
    }
  }
  const pool = [];
  const nWorkers = Math.min(W, Math.max(1, todo.length));
  for (let w = 0; w < nWorkers; w++) pool.push(worker());
  await Promise.all(pool);

  if (N === null) throw Error('panel batch resolved no roster (no records succeeded)');
  const slots = [];
  for (let s = 0; s < N; s++) slots.push({ coder_id: null, rows: [] });
  for (let i = 0; i < M; i++) {
    const rowsForRecord = perRecord[i];
    for (let s = 0; s < N; s++) {
      const row = (rowsForRecord && rowsForRecord[s]) || { coder_id: null, codes: ['NA'] };
      if (!slots[s].coder_id && row.coder_id) slots[s].coder_id = row.coder_id;
      slots[s].rows.push({ record_id: recordId(records[i], i), codes: row.codes });
    }
  }

  const responses = slots.map((s, idx) => ({
    coder_id: s.coder_id || 'panel-slot-' + idx,
    rows: s.rows,
  }));

  return { panel: 'LLM_ASSISTANT_PANEL_BATCH', n: N, responses };
}

module.exports = { batch, recordId };
