'use strict';
// LLM_ASSISTANT_PANEL_BATCH — sibling of assistant-panel.cjs. Same output
// envelope ({panel, n, responses}). Loops M records; per record fans out to
// all N members in parallel; per record up to 5 trials with exponential
// backoff; a slot still failing after trial 5 is a row codes:["NA"].
//
// Shape discipline (body_01 item 15): a member that returns valid evidence in
// a shape the caller did not anticipate is not a defective member — the
// extractor is too narrow. codesOf/quoteOf accept the four observed shapes:
//   { codes: [...] }
//   { rows: [{ codes: [...], quote: "..." }] }
//   { rows: [{ quotes: [{ codes: [...], quote: "..." }] }] }
//   { rows: [ {..}, {codes:[...]} , ... ] }
const panel = require('/app/admin-tools/assistant-panel.cjs');
const TRIALS = 3;
const WAIT = [1000, 2000];
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
  if (!json) return null;

  // If top-level is an array, treat as rows
  if (Array.isArray(json) && json.length > 0) {
    return _extractCodesFromRow(json[0]);
  }

  if (typeof json !== 'object') return null;

  // Direct {codes: [...]}
  if (Array.isArray(json.codes) && json.codes.length) return json.codes.map(String);

  // Wrapped array — try all common names
  for (const key of ['rows', 'records', 'items', 'results', 'outputs', 'entries', 'data', 'codes_list']) {
    const v = json[key];
    if (Array.isArray(v) && v.length > 0) {
      const ex = _extractCodesFromRow(v[0]);
      if (ex) return ex;
      // If first row doesn't yield, try next few
      for (let i = 1; i < Math.min(5, v.length); i++) {
        const e = _extractCodesFromRow(v[i]);
        if (e) return e;
      }
    }
  }

  // Maybe the object itself is one row
  return _extractCodesFromRow(json);
}

function _extractCodesFromRow(row) {
  if (!row || typeof row !== 'object') return null;

  // Direct codes array (string[])
  if (Array.isArray(row.codes) && row.codes.length) return row.codes.map(String);

  // Nested quotes[0].codes
  if (Array.isArray(row.quotes) && row.quotes.length > 0) {
    const q0 = row.quotes[0];
    if (q0 && Array.isArray(q0.codes) && q0.codes.length) return q0.codes.map(String);
  }

  // Fallback: extract all short string-valued fields as codes
  // Skip known metadata fields
  const META = new Set(['record_id', 'id', 'quote', 'quotes', 'memo', 'rationale',
                        'explanation', 'reasoning', 'confidence', 'notes', 'coder_id']);
  const codes = [];
  for (const [k, v] of Object.entries(row)) {
    if (META.has(k)) continue;
    if (typeof v === 'string' && v && v.length <= 80 && !/[\n\r]/.test(v)) {
      codes.push(v);
    } else if (typeof v === 'number' && Number.isFinite(v)) {
      codes.push(String(v));
    } else if (Array.isArray(v) && v.length > 0 && v.every(x => typeof x === 'string' && x.length <= 80)) {
      codes.push(...v);
    }
  }
  if (codes.length > 0 && codes.length <= 8) return codes;

  return null;
}

function quoteOf(json) {
  if (!json || typeof json !== 'object') return '';
  if (typeof json.quote === 'string') return json.quote;
  if (Array.isArray(json.rows) && json.rows.length) {
    const r0 = json.rows[0];
    if (r0 && typeof r0.quote === 'string') return r0.quote;
    if (r0 && Array.isArray(r0.quotes) && r0.quotes.length) {
      const q0 = r0.quotes[0];
      if (q0 && typeof q0.quote === 'string') return q0.quote;
    }
  }
  return '';
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
      let slotsToTry = null;
      for (let t = 0; t < TRIALS; t++) {
        let out = null;
        try {
          out = await panel.askVerbose({ query: q, schema, onlySlots: slotsToTry });
        } catch (e) {
          out = null;
        }
        if (out && Array.isArray(out.raw)) {
          for (const r of out.raw) {
            if (r && r.ok && r.json && typeof r.json === 'object' && got[r.idx] === undefined) {
              if (Object.keys(got).length === 0 && typeof console !== 'undefined') {
                try { console.log('[batch-debug] first successful response shape: ' + JSON.stringify(r.json).slice(0, 400)); } catch (e) {}
              }
              if (codesOf(r.json)) got[r.idx] = r.json;
            }
          }
        }
        if (N === null && out && out.meta && Number.isInteger(out.meta.n)) N = out.meta.n;
        if (N !== null) {
          const missingSlots = [];
          for (let s = 0; s < N; s++) if (got[s] === undefined) missingSlots.push(s);
          if (missingSlots.length === 0) break;
          slotsToTry = missingSlots;
        }
        if (t < TRIALS - 1) await sleep(WAIT[t] || 1000);
      }
      if (N === null) throw Error('panel batch could not resolve roster size at record ' + id);
      const rowsForRecord = [];
      for (let s = 0; s < N; s++) {
        const j = got[s];
        const cs = j ? codesOf(j) : null;
        const quote = quoteOf(j);
        rowsForRecord.push({ coder_id: (j && typeof j.coder_id === 'string' && j.coder_id) ? j.coder_id : null, codes: cs || ['NA'], quote });
      }
      perRecord[i] = rowsForRecord;
      if (typeof onProgress === 'function') {
        const perCoder = rowsForRecord.map((r, s) => ({ coder_id: r.coder_id || ('panel-slot-' + s), codes: r.codes, quote: r.quote }));
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
      const row = (rowsForRecord && rowsForRecord[s]) || { coder_id: null, codes: ['NA'], quote: '' };
      if (!slots[s].coder_id && row.coder_id) slots[s].coder_id = row.coder_id;
      slots[s].rows.push({ record_id: recordId(records[i], i), codes: row.codes, quote: row.quote || '' });
    }
  }

  const responses = slots.map((s, idx) => ({
    coder_id: s.coder_id || 'panel-slot-' + idx,
    rows: s.rows,
  }));

  return { panel: 'LLM_ASSISTANT_PANEL_BATCH', n: N, responses };
}

module.exports = { batch, recordId, codesOf, quoteOf };
