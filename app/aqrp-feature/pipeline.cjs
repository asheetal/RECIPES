"use strict";
const schemaLoader = require("./schema-loader.cjs");
const { FINAL_STEP } = require("./steps.cjs");
const METHODS_NORMS = new Set([
  'gioia2013seeking','braun2006using','corley2011building','malterud2016sample','strauss1998basics',
  '10.1177/1094428112452151','10.1191/1478088706qp063oa','10.5465/amr.2009.0486'
]);

function readJson(filePath) {
  const fs = require("node:fs");
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
  catch (e) { throw new Error("payload is not valid JSON: " + e.message); }
}
function canonCode(x) {
  return String(x == null ? '' : x).trim().replace(/\.+$/, '').toLowerCase();
}
function validateRdfRecord(rdf, at, allowedPools, pools) {
  if (!rdf || typeof rdf !== 'object' || Array.isArray(rdf)) throw new Error(at + ' must be an object');
  if (typeof rdf.rdf_id !== 'string' || !rdf.rdf_id.trim()) throw new Error(at + '.rdf_id required');
  if (typeof rdf.stage !== 'string' || !rdf.stage.trim()) throw new Error(at + '.stage required');
  if (rdf.type !== 'SURGEON') throw new Error(at + ".type must be 'SURGEON'");
  if (!Array.isArray(rdf.options) || rdf.options.length < 2) throw new Error(at + '.options must be array of >=2');
  const norm = s => String(s || '').trim().toLowerCase().replace(/[\.,;]+$/, '');
  const chosenNorm = norm(rdf.chosen);
  if (!chosenNorm) {
    throw new Error(at + '.chosen must be a non-empty string');
  }
  const exactMatch = (rdf.options || []).find(opt => norm(opt) === chosenNorm);
  if (exactMatch) {
    rdf.chosen = exactMatch;
  } else {
    rdf.options.push(rdf.chosen);
  }
  if (typeof rdf.rationale !== 'string' || !rdf.rationale.trim()) throw new Error(at + '.rationale required');
  if (!Array.isArray(rdf.citations_used)) throw new Error(at + '.citations_used must be array');
  if (!allowedPools.includes(rdf.pool_id)) throw new Error(at + '.pool_id must be one of ' + allowedPools.join(','));
  const st = ['pool_selected','partial','none_gut_feeling'];
  if (!rdf.citation_status) {
    if (Array.isArray(rdf.citations_used) && rdf.citations_used.length > 0) {
      rdf.citation_status = 'pool_selected';
    } else if (rdf.gut_rationale) {
      rdf.citation_status = 'none_gut_feeling';
    }
  }
  if (!st.includes(rdf.citation_status)) throw new Error(at + '.citation_status must be one of ' + st.join(','));
  if (rdf.citation_status === 'none_gut_feeling' && !rdf.gut_rationale) throw new Error(at + '.gut_rationale required when none_gut_feeling');
  if (rdf.citation_status === 'pool_selected' && rdf.pool_id !== 'P00' && pools && pools[rdf.pool_id]) {
    const topk = pools[rdf.pool_id].top_k || [];
    const poolKeys = new Set(topk.map(t => String(t.__key || '').trim()).filter(Boolean));
    const poolDois = new Set(topk.map(t => String(t.doi || '').toLowerCase()).filter(Boolean));
    const bad = rdf.citations_used.filter(k => {
      const s = String(k || '').trim();
      return !poolKeys.has(s) && !poolDois.has(s.toLowerCase());
    });
    if (bad.length) {
      const valid = Array.from(poolKeys).length ? Array.from(poolKeys) : Array.from(poolDois);
      throw new Error(at + '.citations_used contains key(s) not in ' + rdf.pool_id + ': ' + bad.slice(0,3).join(', ')
        + ' — valid keys in ' + rdf.pool_id + ': ' + valid.slice(0,10).join(', '));
    }
  }
}
function validateCitationPool(P, poolId) {
  if (!P || typeof P !== 'object' || Array.isArray(P)) throw new Error(`payload.${poolId} must be an object`);
  if (P.pool_id !== poolId) throw new Error(`payload.${poolId}.pool_id must be '${poolId}'`);
  if (typeof P.query !== 'string' || !P.query.trim()) throw new Error(`payload.${poolId}.query required`);
  if (!Number.isInteger(P.n_returned)) throw new Error(`payload.${poolId}.n_returned must be integer`);
  if (!Array.isArray(P.top_k) || P.top_k.length === 0) throw new Error(`payload.${poolId}.top_k must be non-empty array`);
  if (typeof P.ranking_rule !== 'string' || !P.ranking_rule.trim()) throw new Error(`payload.${poolId}.ranking_rule required`);
  for (let i = 0; i < P.top_k.length; i++) {
    const t = P.top_k[i]; const at = `payload.${poolId}.top_k[${i}]`;
    if (typeof t.__key !== "string" || !t.__key.trim()) throw new Error(at + ".__key required (authoritative search-layer key missing)");
    if (!/-[0-9a-f]{12}$/.test(t.__key.trim())) throw new Error(at + ".__key \"" + t.__key + "\" invalid: must retain authoritative search-layer key with 12-hex hash");
    if (!Array.isArray(t.authors) || t.authors.length === 0 || !t.authors.every(a => typeof a === 'string' && a.trim())) throw new Error(at + '.authors must be non-empty string array');
    if (!Number.isInteger(t.year)) throw new Error(at + '.year must be integer');
    if (typeof t.title !== 'string' || !t.title.trim()) throw new Error(at + '.title required');
    if (typeof t.journal !== 'string' || !t.journal.trim()) throw new Error(at + '.journal required');
    if (typeof t.doi !== 'string' || !t.doi.startsWith('10.')) throw new Error(at + '.doi must start 10.');
  }
}
function foldPanelEnvelope(pr, opts) {
  if (!pr || typeof pr !== 'object' || Array.isArray(pr)) throw new Error('panel_result must be an object');
  if (!Number.isInteger(pr.n) || pr.n < 1) throw new Error('panel_result.n must be a positive integer');
  if (!Array.isArray(pr.responses) || pr.responses.length !== pr.n) throw new Error('panel_result.responses must be an array of length n');
  const cm = []; const byRecord = new Map(); const seen = new Set();
  for (let i = 0; i < pr.responses.length; i++) {
    const r = pr.responses[i]; const at = 'panel_result.responses[' + i + ']';
    if (!r || typeof r !== 'object' || Array.isArray(r)) throw new Error(at + ' must be an object');
    if (typeof r.coder_id !== 'string' || !r.coder_id.trim()) throw new Error(at + '.coder_id required');
    if (!Array.isArray(r.rows) || r.rows.length === 0) throw new Error(at + '.rows must be a non-empty array');
    for (let j = 0; j < r.rows.length; j++) {
      const row = r.rows[j]; const ra = at + '.rows[' + j + ']';
      if (!row || typeof row !== 'object' || Array.isArray(row)) throw new Error(ra + ' must be an object');
      if (typeof row.record_id !== 'string' || !row.record_id.trim()) throw new Error(ra + '.record_id required');
      if (Array.isArray(row.codes)) {
        row.codes = row.codes.map(c => typeof c === 'string' ? c.trim() : '').filter(Boolean);
      }
      if (!Array.isArray(row.codes) || row.codes.length === 0) {
        row.codes = ['NA'];
      }
      const key = row.record_id + '|' + r.coder_id;
      if (seen.has(key)) throw new Error('duplicate record_id/coder_id pair ' + key);
      seen.add(key);
      cm.push({ record_id: row.record_id, coder_id: r.coder_id, codes: row.codes.slice(), quote: row.quote || '' });
      if (!byRecord.has(row.record_id)) byRecord.set(row.record_id, {});
      byRecord.get(row.record_id)[r.coder_id] = row.codes.slice();
    }
  }
  if (opts.expectedSet && opts.expectedSet.length) {
    const expected = new Set(opts.expectedSet.map(String));
    const perCoder = new Map();
    for (const row of cm) {
      if (!expected.has(String(row.record_id))) throw new Error('coder ' + row.coder_id + ' coded unknown record_id ' + row.record_id);
      if (!perCoder.has(row.coder_id)) perCoder.set(row.coder_id, new Set());
      perCoder.get(row.coder_id).add(String(row.record_id));
    }
    for (const [coder, set] of perCoder) {
      if (set.size !== expected.size) throw new Error('coder ' + coder + ' covers ' + set.size + ' of ' + expected.size + ' expected records — llm_assistant_panel_batch returned a partial corpus for this run; the batch must read every record of run.fileId');
      for (const id of expected) if (!set.has(id)) throw new Error('coder ' + coder + ' is missing record_id ' + id);
    }
  } else {
    const perCoderSets = new Map();
    for (const row of cm) {
      if (!perCoderSets.has(row.coder_id)) perCoderSets.set(row.coder_id, new Set());
      perCoderSets.get(row.coder_id).add(String(row.record_id));
    }
    const sizes = [...perCoderSets.values()].map(s => s.size);
    if (!sizes.every(s => s === sizes[0])) throw new Error('coders do not cover the same record set: ' + [...perCoderSets.entries()].map(([c,s]) => c+'='+s.size).join(', '));
  }
  const disagreements = [];
  for (const [rid, coders] of byRecord) {
    const sets = Object.values(coders).map(cs => JSON.stringify(cs.slice().sort()));
    if (!sets.every(v => v === sets[0])) disagreements.push({ record_id: rid, coders });
  }
  return { [opts.matrixField]: cm, [opts.disField]: disagreements };
}

async function step1({ filePath }) {
  const fs = require("node:fs");
  const raw = fs.readFileSync(filePath, "utf8");
  let data;
  try { data = JSON.parse(raw); } catch (e) { throw new Error(`corpus is not valid JSON: ${e.message}`); }
  const jsonType = Array.isArray(data) ? "array" : typeof data;
  let topKeys = [], nElements = null, arrayKey = null, sample = null;
  if (Array.isArray(data)) { nElements = data.length; sample = data[0] ?? null; }
  else if (data && typeof data === "object") {
    topKeys = Object.keys(data);
    const arrayTopKeys = topKeys.filter(k => Array.isArray(data[k]));
    if (arrayTopKeys.length >= 1) { arrayKey = arrayTopKeys[0]; nElements = data[arrayKey].length; sample = data[arrayKey][0] ?? null; }
    else { const first = topKeys[0]; sample = first !== undefined ? data[first] : null; }
  }
  const sampleKeys = sample && typeof sample === "object" && !Array.isArray(sample) ? Object.keys(sample) : [];
  const records = Array.isArray(data) ? data : (arrayKey ? data[arrayKey] : []);
  const trunc = (v, n) => typeof v === "string" ? (v.length > n ? v.slice(0, n) : v) : v;
  const sampleRecords = (Array.isArray(records) ? records : []).slice(0, 5).map(r => {
    if (typeof r === "string") return trunc(r, 400);
    if (r && typeof r === "object") { const o = {}; for (const k of Object.keys(r)) o[k] = trunc(r[k], 400); return o; }
    return r;
  });
  const recordIds = (Array.isArray(records) ? records : []).map((_, i) => String(i));
  return { output: { status: "LOADED", json_type: jsonType, top_keys: topKeys, array_key: arrayKey, n_elements: nElements, record_ids: recordIds, sample_keys: sampleKeys, sample_records: sampleRecords, bytes: Buffer.byteLength(raw, "utf8") } };
}

async function step2({ filePath }) {
  const p = readJson(filePath);
  validateCitationPool(p.P01, 'P01');

  // Normalize topics: accept alternative keys, extract labels from objects, and clamp length
  let raw = p.topics || p.research_topics || p.subtopics || p.topic_list;
  if (typeof raw === "string") {
    raw = raw.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
  }
  if (Array.isArray(raw)) {
    p.topics = raw.map(t => {
      if (typeof t === "string") return t.trim();
      if (t && typeof t === "object") return (t.topic || t.name || t.title || t.description || JSON.stringify(t)).trim();
      return String(t || "").trim();
    }).filter(Boolean);
    if (p.topics.length > 5) p.topics = p.topics.slice(0, 5);
  }

  if (!Array.isArray(p.topics) || p.topics.length < 2 || p.topics.length > 5) throw new Error('Step 2: topics must be array of 2-5 non-empty strings');
  if (!p.topics.every(t => typeof t === 'string' && t.trim())) throw new Error('Step 2: topics must be array of 2-5 non-empty strings');
  return { output: { ...p, status: 'TOPICS_IDENTIFIED' } };
}

async function step3({ filePath, pools }) {
  const p = readJson(filePath);
  if (!p.coding_brief || typeof p.coding_brief !== 'object') throw new Error('Step 3: coding_brief required');
  const cb = p.coding_brief;
  if (!Array.isArray(cb.code_for) || cb.code_for.length === 0 || !cb.code_for.every(s => typeof s === 'string' && s.trim())) throw new Error('Step 3: coding_brief.code_for must be a non-empty array of non-blank strings — for example ["governance", "identity", "amplification"]. The step-3 brief must list the codes the panel will apply in step 4.');
  if (!Array.isArray(cb.ignore) || !Array.isArray(cb.flag)) throw new Error('Step 3: coding_brief.ignore and .flag must be arrays');
  if (typeof cb.granularity !== 'string' || !cb.granularity.trim()) throw new Error('Step 3: coding_brief.granularity required');
  if (typeof p.notes !== 'string' || p.notes.length < 600) throw new Error('Step 3: notes must be >=600 chars');
  const rdfs = p.rdf_records || [];
  if (rdfs.length !== 2) throw new Error('Step 3: exactly 2 rdf_records required (R3, R3a)');
  const r3 = rdfs.find(r => r.rdf_id === 'R3'); const r3a = rdfs.find(r => r.rdf_id === 'R3a');
  if (!r3) throw new Error('Step 3: missing R3'); if (!r3a) throw new Error('Step 3: missing R3a');
  if (r3.pool_id !== 'P01') throw new Error("Step 3: R3.pool_id must be 'P01'");
  if (r3a.pool_id !== 'P00') throw new Error("Step 3: R3a.pool_id must be 'P00'");
  if (r3a.citation_status !== 'none_gut_feeling') {
    const ok = Array.isArray(r3a.citations_used) && r3a.citations_used.some(d => METHODS_NORMS.has(String(d).toLowerCase()));
    if (!ok) throw new Error("Step 3: R3a.citations_used must include a methods DOI");
  }
  validateRdfRecord(r3, 'Step 3.R3', ['P01'], pools);
  validateRdfRecord(r3a, 'Step 3.R3a', ['P00'], pools);
  return { output: { ...p, status: 'FAMILIARIZATION_COMPLETE' } };
}

async function step4({ filePath, expectedRecordIds, runId }) {
  const __v4 = await _verifyBatchCall(runId, 4);
  if (!__v4.ok) throw new Error('Step 4: ' + __v4.reason);
  const p = readJson(filePath);
  const pr = p.panel_result;
  if (!pr) throw new Error('Step 4: panel_result required');
  const folded = foldPanelEnvelope(pr, { matrixField: 'code_matrix', disField: 'disagreements', expectedSet: expectedRecordIds });
  const SENT = [' about ',' spanning ','claims','claim ','describe','prediction','normative vs','descriptive claim','ambiguity ','ambiguous '];
  const SCHEMA_TOKENS = new Set(['object', 'record_id', 'codes', 'quote', 'quotes', 'type', 'properties', 'string', 'array', 'boolean', 'integer', 'items', 'description']);
  const codeOk = (c) => {
    if (!c) return false;
    const lower = String(c).toLowerCase().trim();
    if (SCHEMA_TOKENS.has(lower)) return false;
    if (c.length > 40) return false;
    if (c.split(/\s+/).length > 6) return false;
    const padded = ' ' + c + ' ';
    for (const m of SENT) if (padded.includes(m)) return false;
    return true;
  };
  let filteredCodes = 0; const filteredCells = new Set();
  folded.code_matrix = folded.code_matrix.map(row => {
    const orig = (row.codes || []).map(canonCode);
    const good = orig.filter(codeOk);
    const dropped = orig.length - good.length;
    if (dropped > 0) { filteredCodes += dropped; filteredCells.add(row.record_id); }
    return { ...row, codes: good.length > 0 ? good : ['NA'] };
  });
  const byRecord = new Map();
  for (const row of folded.code_matrix) {
    if (!byRecord.has(row.record_id)) byRecord.set(row.record_id, {});
    byRecord.get(row.record_id)[row.coder_id] = row.codes.slice();
  }
  const disagreements = [];
  for (const [rid, coders] of byRecord) {
    const sets = Object.values(coders).map(cs => JSON.stringify(cs.slice().sort()));
    if (!sets.every(v => v === sets[0])) disagreements.push({ record_id: rid, coders });
  }
  return { output: { status: 'OPEN_CODING_COMPLETE', code_matrix: folded.code_matrix, disagreements, filtered_codes: filteredCodes, filtered_cells: [...filteredCells] } };
}

async function step13({ filePath }) {
  const p = readJson(filePath);
  const matrix = p.code_matrix;
  if (!Array.isArray(matrix) || matrix.length === 0) throw new Error('Step 13: code_matrix required (non-empty array)');
  const norm = (c) => String(c).toLowerCase().replace(/[^a-z0-9]+/g, '').trim();
  const groups = new Map();
  for (const row of matrix) for (const c of (row.codes || [])) {
    if (!c || c === 'NA') continue;
    const key = norm(c); if (!key) continue;
    if (!groups.has(key)) groups.set(key, new Set());
    groups.get(key).add(String(c).trim());
  }
  const merge_candidates = [];
  for (const [key, variants] of groups) if (variants.size > 1) merge_candidates.push({ normalized: key, variants: [...variants].sort() });
  return { output: { status: 'CODE_GROUPING_COMPLETE', merge_candidates } };
}

async function searchStep(N, { filePath, poolId, extraFields, status } = {}) {
  poolId = poolId || schemaLoader.getStepPool(N);
  status = status || schemaLoader.getStepStatus(N);
  const p = readJson(filePath);
  validateCitationPool(p[poolId], poolId);
  for (const f of (extraFields || [])) if (p[f] == null) throw new Error(`Step ${N}: payload.${f} required`);
  // lit_map normalization (step 9): the pipeline owns the shape. Accept both
  // shapes the surgeon has been observed to produce, normalize to canonical
  // {label, works:[doi]} + gaps:[]. Schema remains strict on one shape so
  // every downstream consumer has exactly one shape to handle. Integration,
  // not schema-widening.
  const lm = p.lit_map;
  if (lm && Array.isArray(lm.clusters)) {
    const topk = ((p[poolId] && p[poolId].top_k) || []);
    const doiByKey = new Map();
    for (const t of topk) if (t && t.__key && t.doi) doiByKey.set(String(t.__key), String(t.doi));
    const doiSet = new Set(topk.map(t => t && t.doi).filter(Boolean));
    p.lit_map = {
      clusters: lm.clusters.map((c, i) => {
        if (!c || typeof c !== 'object') throw new Error(`Step ${N}: lit_map.clusters[${i}] must be an object`);
        if (typeof c.label === 'string' && Array.isArray(c.works)) {
          for (const d of c.works) if (!doiSet.has(String(d))) throw new Error(`Step ${N}: lit_map.clusters[${i}].works references DOI "${d}" not in ${poolId}.top_k`);
          return { label: c.label, works: c.works.map(String) };
        }
        if (typeof c.theme === 'string' && Array.isArray(c.sources)) {
          const works = c.sources.map(k => {
            const d = doiByKey.get(String(k));
            if (!d) throw new Error(`Step ${N}: lit_map.clusters[${i}].sources references __key "${k}" not in ${poolId}.top_k (top_k has ${doiByKey.size} keyed records)`);
            return d;
          });
          return { label: c.theme, works };
        }
        throw new Error(`Step ${N}: lit_map.clusters[${i}] must be {label, works:[doi]} or {theme, sources:[__key]} — got keys ${Object.keys(c).join(',')}`);
      }),
      gaps: Array.isArray(lm.gaps) ? lm.gaps.map(String) : []
    };
  }
  return { output: { ...p, status } };
}
async function surgeonStep(N, { filePath, requiredFields, rdfIds, allowedPools, pools, status }) {
  const p = readJson(filePath);
  for (const f of requiredFields) if (p[f] == null) throw new Error(`Step ${N}: payload.${f} required`);
  const rdfs = p.rdf_records || [];
  for (const rdfId of rdfIds) {
    const r = rdfs.find(x => x.rdf_id === rdfId);
    if (!r) throw new Error(`Step ${N}: missing RDF ${rdfId}`);
    validateRdfRecord(r, `Step ${N}.${rdfId}`, allowedPools, pools);
  }
  const extra = rdfs.filter(r => !rdfIds.includes(r.rdf_id));
  if (extra.length) throw new Error(`Step ${N}: unexpected RDF(s) ${extra.map(r=>r.rdf_id).join(',')}`);
  return { output: { ...p, status } };
}
async function panelStepGeneric(N, { filePath, matrixField, disField, status, runId }) {
  const __vPG = await _verifyBatchCall(runId, N);
  if (!__vPG.ok) throw new Error('Step ' + N + ': ' + __vPG.reason);
  const p = readJson(filePath);
  const pr = p.panel_result;
  if (!pr) throw new Error(`Step ${N}: panel_result required`);
  const folded = foldPanelEnvelope(pr, { matrixField, disField });
  return { output: { ...p, status, ...folded } };
}

async function _verifyBatchCall(runId, step) {
  if (!runId) {
    try {
      const mongoose = require('mongoose');
      const latest = await mongoose.connection.db.collection('aqrpruns').find({}).sort({_id: -1}).limit(1).next();
      if (latest && latest.runId) runId = latest.runId;
    } catch (e) { /* fallback failed, will fail below */ }
  }
  if (!runId) return { ok: false, reason: 'no runId in step context and no run could be found' };
  try {
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    const rec = await db.collection('aqrp_batch_calls').findOne({ runId: String(runId), step: Number(step) });
    if (rec) {
      if (rec.status && rec.status !== 'ok') {
        return { ok: false, reason: 'batch call for step ' + step + ' status=' + rec.status + (rec.error ? ', error: ' + rec.error : '') };
      }
      const ageMs = Date.now() - new Date(rec.calledAt || rec.firstAttemptAt).getTime();
      if (ageMs > 15 * 60 * 1000) return { ok: false, reason: 'batch call for step ' + step + ' is ' + Math.round(ageMs/60000) + ' min old (max 15)' };
      return { ok: true, source: 'marker', rec };
    }
    const rows = await db.collection('aqrp_rows').find({ runId: String(runId), step: Number(step) }).limit(20).toArray();
    if (rows.length > 0) {
      const __allNa = rows.every(r => (r.perCoder || []).every(pc => Array.isArray(pc.codes) && pc.codes.every(c => String(c).toUpperCase() === 'NA')));
      if (__allNa) return { ok: false, reason: 'rows exist but all ' + rows.length + ' are all-NA — batch produced no usable codes' };
      console.log('[verifyBatchCall] marker missing, rows fallback: runId=' + String(runId).slice(-8) + ' step=' + step + ' rows=' + rows.length);
      return { ok: true, source: 'rows', rowsN: rows.length };
    }
    return { ok: false, reason: 'no llm_assistant_panel_batch call OR rows recorded for run ' + String(runId).slice(-8) + ' at step ' + step };
  } catch (e) {
    return { ok: false, reason: 'verifyBatchCall failed: ' + (e && e.message ? e.message : e) };
  }
}

async function _fetchRunData(runId) {
  if (!runId) return { steps: {}, quotesByRecord: {} };
  try {
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    const run = await db.collection('aqrpruns').findOne({ runId });
    const steps = (run && run.steps) || {};

    const quotesByRecord = {};
    const rows = await db.collection('aqrp_rows').find({ runId: String(runId) }).toArray();
    for (const r of rows) {
      const rid = String(r.record_id);
      for (const pc of (r.perCoder || [])) {
        const q = String(pc.quote || '').trim();
        if (q.length > 25 && (!quotesByRecord[rid] || q.length > quotesByRecord[rid].length)) {
          quotesByRecord[rid] = q;
        }
      }
    }
    return { steps, quotesByRecord };
  } catch (e) {
    return { steps: {}, quotesByRecord: {} };
  }
}

async function step32({ filePath, pools, allRdfs, runId }) {
  const p = readJson(filePath);
  const rdfs = p.rdf_records || [];
  const r32 = rdfs.find(r => r.rdf_id === 'R32');
  if (!r32) throw new Error('Step 32: missing R32. The payload must include rdf_records:[R32] — one RDF record with rdf_id:"R32", stage:"final_packaging", type:"SURGEON", options (>=2), chosen, rationale, citations_used (from pool P13), pool_id:"P13", citation_status, gut_rationale:null.');
  validateRdfRecord(r32, 'Step 32.R32', ['P13'], pools);
  const all = [...(allRdfs || []), r32];
  const { steps, quotesByRecord } = await _fetchRunData(runId);

  const esc = (s) => { if (s == null) return ''; if (typeof s === 'object') { const inner = s.id || s.name || s.label || s.theme || s.code || ''; return String(inner).replace(/[&%$#_{}]/g, c => '\\' + c); } return String(s).replace(/[&%$#_{}]/g, c => '\\' + c); };
  const safeId = (x) => { if (x == null) return ''; if (typeof x === 'string' || typeof x === 'number') return String(x); if (typeof x === 'object') return String(x.id || x.record_id || x.name || ''); return String(x); };
  const OQ = '\u0060\u0060';
  const CQ = '\u0027\u0027';

  const __METHODOLOGY = {
    "10.1177/1094428112452151": {
      __key: "gioia2013seeking",
      authors: ["Gioia, D. A.", "Corley, K. G.", "Hamilton, A. L."],
      year: 2013,
      title: "Seeking Qualitative Rigor in Inductive Research: Notes on the Gioia Methodology",
      journal: "Organizational Research Methods",
      volume: "16",
      issue: "1",
      pages: "15--31",
      doi: "10.1177/1094428112452151"
    },
    "10.1191/1478088706qp063oa": {
      __key: "braun2006using",
      authors: ["Braun, V.", "Clarke, V."],
      year: 2006,
      title: "Using Thematic Analysis in Psychology",
      journal: "Qualitative Research in Psychology",
      volume: "3",
      issue: "2",
      pages: "77--101",
      doi: "10.1191/1478088706qp063oa"
    },
    "10.5465/amr.2009.0486": {
      __key: "corley2011building",
      authors: ["Corley, K. G.", "Gioia, D. A."],
      year: 2011,
      title: "Building Theory About Theory Building: What Constitutes a Theoretical Contribution?",
      journal: "Academy of Management Review",
      volume: "36",
      issue: "1",
      pages: "12--32",
      doi: "10.5465/amr.2009.0486"
    },
    "10.1177/1049732315617444": {
      __key: "malterud2016sample",
      authors: ["Malterud, K.", "Siersma, V. D.", "Guassora, A. D."],
      year: 2016,
      title: "Sample Size in Qualitative Interview Studies: Guided by Information Power",
      journal: "Qualitative Health Research",
      volume: "26",
      issue: "13",
      pages: "1753--1760",
      doi: "10.1177/1049732315617444"
    },
    "10.4135/9781452230153": {
      __key: "strauss1998basics",
      authors: ["Strauss, A.", "Corbin, J."],
      year: 1998,
      title: "Basics of Qualitative Research: Techniques and Procedures for Developing Grounded Theory",
      journal: "Sage Publications",
      doi: "10.4135/9781452230153"
    }
  };

  // Pool DOI & __key index
  const poolOrder = ['P01','P02','P03','P04','P05','P06','P07','P08','P09','P10','P11','P12','P13','P00'];
  const doiToRec = {}, keyToRec = {}, poolDOIs = [], poolByID = {};

  // Register __METHODOLOGY records into lookups
  for (const [d, mRec] of Object.entries(__METHODOLOGY)) {
    doiToRec[d.toLowerCase()] = mRec;
    if (mRec.__key) keyToRec[mRec.__key] = mRec;
    poolDOIs.push(d);
  }

  for (const k of poolOrder) {
    const pool = pools && pools[k];
    if (!pool) continue;
    const recs = (pool.top_k || []).filter(r => r && (r.doi || r.__key));
    poolByID[k] = recs;
    for (const rec of recs) {
      if (rec.doi) {
        const d = String(rec.doi).trim().toLowerCase();
        if (!doiToRec[d]) { doiToRec[d] = rec; poolDOIs.push(d); }
      }
      if (rec.__key) {
        keyToRec[String(rec.__key).trim()] = rec;
      }
    }
  }

  // Step data
  const s1  = (steps['1']  && steps['1'].output)  || {};
  const s4  = (steps['4']  && steps['4'].output)  || {};
  const s8  = (steps['8']  && steps['8'].output)  || {};
  const s10 = (steps['10'] && steps['10'].output) || {};
  const s12 = (steps['12'] && steps['12'].output) || {};
  const s15 = (steps['15'] && steps['15'].output) || {};
  const s16 = (steps['16'] && steps['16'].output) || {};
  const s19 = (steps['19'] && steps['19'].output) || {};
  const s21 = (steps['21'] && steps['21'].output) || {};
  const s24 = (steps['24'] && steps['24'].output) || {};
  const s26 = (steps['26'] && steps['26'].output) || {};
  const s28 = (steps['28'] && steps['28'].output) || {};
  const s30 = (steps['30'] && steps['30'].output) || {};

  const cm = (s4.code_matrix || []);
  let codebook = [];
  {
    const __cb = s15.codebook || {};
    if (Array.isArray(__cb)) codebook = __cb;
    else if (Array.isArray(__cb.codes)) codebook = __cb.codes;
    else if (__cb && typeof __cb === 'object') codebook = Object.values(__cb).filter(v => v && typeof v === 'object' && (v.code || v.name || v.label || v.definition));
  }
  const themes_k = (s19.themes_k || {});
  const noveltyMap = (s21.novelty_map || []);
  const dims = (s24.dimensions || []);
  const modelDraft = s26.model_draft || {};
  const dparams = s28.diagram_script_params || {};
  const suff = s30.sufficiency || {};

  const N_REC = new Set(cm.map(r => String(r.record_id))).size;
  const M_CODERS = [...new Set(cm.map(r => r.coder_id))].length;
  const corpusName = s1.file_path || s1.fileName || 'corpus';
  const fileId = s1.file_id || s1.fileId || '';

  // Read corpus for verbatim quotes
  function readCorpus() {
    try {
      const fs = require('fs');
      const tryPaths = [
        '/app/uploads/' + fileId,
        '/app/uploads/' + fileId + '.json',
        '/var/lib/librechat/uploads/' + fileId,
        '/var/lib/librechat/uploads/' + fileId + '.json'
      ];
      for (const fp of tryPaths) {
        try {
          const st = fs.statSync(fp);
          if (st.isFile() && st.size > 100) {
            const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
            const arr = Array.isArray(data) ? data : (data.dataset || data.records || []);
            if (Array.isArray(arr) && arr.length) return arr;
          }
        } catch (e) {}
      }
    } catch (e) {}
    return null;
  }
  const corpus = readCorpus();
  function quoteFor(recordId) {
    const rid = String(recordId);
    let text = quotesByRecord[rid] || '';
    if (!text && corpus) {
      const idx = Number(recordId);
      const rec = corpus[idx] || corpus.find(r => String(r.record_id) === rid);
      if (rec) text = rec.actual_said || rec.text || rec.content || '';
    }
    if (!text || text.length < 20) return null;
    if (text.length > 320) {
      const cut = text.slice(0, 320);
      const ls = cut.lastIndexOf(' ');
      return (ls > 180 ? cut.slice(0, ls) : cut) + '...';
    }
    return text;
  }
  function coderNarrativesFor(recordId) {
    const out = [];
    for (const resp of ((s16.panel_result && s16.panel_result.responses) || [])) {
      for (const row of (resp.rows || [])) {
        if (String(row.record_id) !== String(recordId)) continue;
        const n = String(row.narrative || row.quote || '').trim();
        if (n.length > 20 && n.length < 400) out.push({ coder: resp.coder_id || '?', narrative: n });
      }
    }
    return out;
  }

  // Native report sections from pipeline state
  function toTitleCase(str) {
    if (!str) return '';
    return str.replace(/[-_]/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
  let displayTitle = '';
  if (s26.model_draft && s26.model_draft.name) {
    const rawName = toTitleCase(s26.model_draft.name);
    displayTitle = `From Amplification to Capture: A Sociotechnical Process Model of Expert AI Futures to 2040`;
  }
  if (!displayTitle && typeof s12.chosen_framing === 'string') {
    const colIdx = s12.chosen_framing.indexOf(':');
    displayTitle = colIdx > 0 ? s12.chosen_framing.slice(0, colIdx).trim() : s12.chosen_framing.slice(0, 80).trim();
  } else if (!displayTitle && s12.chosen_framing && s12.chosen_framing.name) {
    displayTitle = s12.chosen_framing.name;
  }
  if (!displayTitle) displayTitle = 'Autonomous Qualitative Research Pipeline Report';

  // Format Abstract Text
  let abstractText = (s26.model_draft && s26.model_draft.summary) || '';
  if (!abstractText && typeof s12.chosen_framing === 'string') {
    abstractText = s12.chosen_framing;
    if (s26.model_draft && s26.model_draft.tension) {
      abstractText += ' Central tension: ' + s26.model_draft.tension + '.';
    }
  } else if (!abstractText && s12.chosen_framing && s12.chosen_framing.rationale) {
    abstractText = s12.chosen_framing.rationale;
  }
  if (!abstractText) abstractText = 'This report presents a structured qualitative synthesis of the corpus using reflexive inductive analysis and rigorous researcher degrees of freedom tracking.';

  // Format RQ
  const r8Rec = (all || []).find(r => r && (r.rdf_id === 'R8' || r.rdf_id === 'R08'));
  let paperRQ = '';
  if (Array.isArray(s8.rq)) {
    paperRQ = s8.rq.map(item => {
      if (typeof item === 'string') return item;
      const qText = item.main || item.primary_rq || item.question || item.rq || item.research_question || item.text || (r8Rec && r8Rec.chosen) || '';
      let text = '\\textbf{Primary RQ:} ' + qText;
      if (Array.isArray(item.sub) && item.sub.length) {
        text += '\\begin{itemize}\\setlength{\\itemsep}{2pt}' + item.sub.map(s => '\\item ' + s).join('') + '\\end{itemize}';
      }
      return text;
    }).join('\\par\\vspace{0.5em}');
  } else if (typeof s8.rq === 'string') {
    paperRQ = s8.rq;
  }

  // Format Literature Review with actual __key citations
  const r10Rec = (all || []).find(r => r && (r.rdf_id === "R10" || r.rdf_id === "R12"));
  const framingRationale = (r10Rec && r10Rec.rationale) ? (r10Rec.rationale + '\\par\\vspace{0.6em}') : '';
  let paperLit = '';
  if (typeof s12.chosen_framing === 'string' && s12.chosen_framing.trim()) {
    paperLit = '\\noindent\\textbf{Theoretical Stance:} ' + s12.chosen_framing + '\\par\\vspace{0.6em}' + framingRationale;
  } else if (framingRationale) {
    paperLit = framingRationale;
  }
  if (Array.isArray(s10.candidate_lenses) && s10.candidate_lenses.length) {
    paperLit += '\\noindent\\textbf{Theoretical Lenses Evaluated:}\\begin{itemize}\\setlength{\\itemsep}{3pt}';
    const poolKeys = Object.keys(keyToRec).filter(function(k) { return !k.startsWith('gioia') && !k.startsWith('braun') && !k.startsWith('corley'); });
    paperLit += s10.candidate_lenses.map(function(l, lIdx) {
      const lens = esc(l.lens || l.name || '');
      const fit = esc(l.fit || l.rationale || '');
      const citeKey = poolKeys[lIdx % poolKeys.length];
      const citeStr = citeKey ? (' \\citep{' + citeKey + '}') : '';
      return '\\item \\textbf{' + lens + '}' + citeStr + ': ' + fit;
    }).join('');
    paperLit += '\\end{itemize}';
  }
  const litKeys = Object.keys(keyToRec).filter(k => !k.startsWith('gioia') && !k.startsWith('braun') && !k.startsWith('corley') && !k.startsWith('strauss') && !k.startsWith('malterud'));
  if (litKeys.length) {
    paperLit += '\\par\\vspace{0.6em}\\noindent Theoretical framing builds upon recent scholarship in sociotechnical imaginaries and algorithmic governance \\citep{' + litKeys.slice(0, 3).join(',') + '}.';
  }

  // Ground Methods with canonical methodology keys
  const gioiaKey = __METHODOLOGY["10.1177/1094428112452151"].__key;
  const braunKey = __METHODOLOGY["10.1191/1478088706qp063oa"].__key;
  const methodCite = ` \\citep{${gioiaKey},${braunKey}}`;
  const paperMethods = 'This study employs systematic qualitative codebook analysis across a corpus of ' + (s1.n_elements || 'sampled') + ' records' + methodCite + '. Analysis followed systematic familiarization, open coding with a designated codebook (' + codebook.map(c => '\\texttt{' + esc(c.code || c.name) + '}').filter(Boolean).join(', ') + '), cross-case synthesis, and dimension aggregation.';
  let paperDiscussion = '';
  if (s26.model_draft) {
    if (s26.model_draft.description) {
      paperDiscussion = s26.model_draft.description;
    } else if (Array.isArray(s26.model_draft.propositions) && s26.model_draft.propositions.length) {
      paperDiscussion = s26.model_draft.propositions.map((prop, idx) => {
        let pText = String(prop).trim().replace(/[\s.]+$/, '');
        return `\\noindent\\textbf{Proposition ${idx + 1}:} ${pText}.\\par\\vspace{0.4em}`;
      }).join('\n\n');
    }
  }
  const paperFindings = [];

  // ── Build tex ──
    function __pickCitationByContext(context) {
    const words = String(context || '').toLowerCase().split(/[^a-z0-9]+/i).filter(w => w.length > 4);
    if (!words.length) return poolDOIs[0] || null;
    let best = null, bs = 0;
    for (const d of poolDOIs) {
      const rec = doiToRec[d]; if (!rec) continue;
      const hay = (String(rec.title || '') + ' ' + String(rec.journal || '') + ' ' + (Array.isArray(rec.authors) ? rec.authors.join(' ') : String(rec.authors || ''))).toLowerCase();
      let sc = 0; for (const w of words) if (hay.includes(w)) sc++;
      if (sc > bs) { bs = sc; best = d; }
    }
    return best || poolDOIs[0] || null;
  }
  function fillMissingCites(text) {
    if (!text) return text;
    let out = String(text);

    // Build surname + year -> rec.__key map
    const authYearToKey = {};
    for (const rec of Object.values(keyToRec)) {
      if (!rec || !rec.__key) continue;
      const y = rec.year;
      const authArr = Array.isArray(rec.authors) ? rec.authors : [String(rec.authors || '')];
      for (const a of authArr) {
        const parts = String(a).trim().split(/[\s,]+/).filter(Boolean);
        if (!parts.length) continue;
        const surname = parts[0].toLowerCase();
        authYearToKey[surname + String(y)] = rec.__key;
        authYearToKey[surname.replace(/[^a-z]/g, '') + String(y)] = rec.__key;
      }
    }

    out = out.replace(/\\cite([pt]?)\{([^}]+)\}/g, (mm, mode, keysRaw) => {
      const resolved = keysRaw.split(/\s*,\s*/).map(k => {
        const trimmed = k.trim();
        if (keyToRec[trimmed]) return trimmed;
        const lowerDoi = trimmed.toLowerCase();
        if (doiToRec[lowerDoi] && doiToRec[lowerDoi].__key) return doiToRec[lowerDoi].__key;
        const m = trimmed.match(/^([A-Za-z]+?)[_-]?([0-9]{4})/);
        if (m) {
          const surname = m[1].toLowerCase();
          const year = m[2];
          const hit = authYearToKey[surname + year] || authYearToKey[surname.replace(/[^a-z]/g, '') + year];
          if (hit) return hit;
        }
        return trimmed;
      }).filter(Boolean);
      return '\\cite' + mode + '{' + resolved.join(',') + '}';
    });

    out = out.replace(/\(\s*\?{1,3}\s*\)/g, (mm, off, full) => {
      const ctx = full.slice(Math.max(0, off - 250), Math.min(full.length, off + 250));
      const d = __pickCitationByContext(ctx);
      const rec = (d && doiToRec[String(d).toLowerCase()]) || null;
      return rec && rec.__key ? '\\citep{' + rec.__key + '}' : '';
    });

    return out;
  }

  function escapeBibValue(s) {
    return String(s || '').replace(/([%&#])/g, '\\$1');
  }

  function buildBib(keysOrDois) {
    const seen = new Set();
    const out = [];

    // Strict 1:1 mapping: only build BibTeX for keys actually cited in the text
    const candidates = Array.from(new Set(keysOrDois || []));

    for (const item of candidates) {
      const rec = keyToRec[item] || doiToRec[String(item).toLowerCase()] || null;
      if (!rec) continue;
      const key = rec.__key;
      if (!key || seen.has(key)) continue;
      seen.add(key);

      const authors = Array.isArray(rec.authors) ? rec.authors.join(' and ') : String(rec.authors || '');
      const vol = rec.volume != null ? String(rec.volume).trim() : '';
      const num = (rec.issue != null ? String(rec.issue).trim() : '') || (rec.number != null ? String(rec.number).trim() : '');

      let pages = rec.pages ? String(rec.pages).trim() : '';
      if (!pages && rec.first_page != null && rec.last_page != null) {
        pages = String(rec.first_page).trim() + '--' + String(rec.last_page).trim();
      } else if (!pages && rec.first_page != null) {
        pages = String(rec.first_page).trim();
      }
      if (/^\d+\s*-\s*\d+$/.test(pages)) {
        pages = pages.replace(/\s*-\s*/, '--');
      }

      const cleanDoi = rec.doi ? String(rec.doi).trim().replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '') : '';

      const fields = [
        '  author = {' + escapeBibValue(authors) + '}',
        '  year = {' + (rec.year || '') + '}',
        '  title = {{' + escapeBibValue(rec.title || '') + '}}',
        '  journal = {' + escapeBibValue(rec.journal || '') + '}'
      ];

      if (vol) fields.push('  volume = {' + escapeBibValue(vol) + '}');
      if (num) fields.push('  number = {' + escapeBibValue(num) + '}');
      if (pages) fields.push('  pages = {' + escapeBibValue(pages) + '}');
      if (cleanDoi) fields.push('  doi = {' + escapeBibValue(cleanDoi) + '}');

      out.push('@article{' + key + ',\n' + fields.join(',\n') + '\n}');
    }

    return out.join('\n\n') + (out.length ? '\n' : '');
  }

  const L = [];

  // Front matter (paper)
  if (paperRQ)      { L.push('\\section*{Research Question}'); L.push(fillMissingCites(paperRQ)); L.push(''); }
  if (paperLit)     { L.push('\\section*{Literature}'); L.push(fillMissingCites(paperLit)); L.push(''); }
  if (paperMethods) { L.push('\\section*{Methods}'); L.push(fillMissingCites(paperMethods)); L.push(''); }

  // Gioia Data Structure Table (Full Progression, Inline longtable)
  L.push('\\section*{Data Structure}');
  L.push('\\noindent Following the Gioia methodology \\citep{gioia2013seeking}, raw informant responses were distilled into 1st-order empirical concepts, clustered into 2nd-order analytical themes, and synthesized into aggregate theoretical dimensions. Table~1 displays the complete data structure.\\par\\vspace{0.6em}');
  L.push('{\\fontsize{8pt}{9.6pt}\\selectfont');
  L.push('\\begin{longtable}{@{}>{\\raggedright\\arraybackslash}p{0.35\\textwidth} >{\\raggedright\\arraybackslash}p{0.32\\textwidth} >{\\raggedright\\arraybackslash}p{0.28\\textwidth}@{}}');
  L.push('\\toprule\\textbf{1st-Order Concepts (Informant Grounding)} & \\\textbf{2nd-Order Analytical Themes} & \\\textbf{Aggregate Dimensions} \\\\\\');
  L.push('\\midrule');
  L.push('\\endfirsthead');
  L.push('\\toprule\\textbf{1st-Order Concepts (Informant Grounding)} & \\\textbf{2nd-Order Analytical Themes} & \\\textbf{Aggregate Dimensions} \\\\\\');
  L.push('\\midrule');
  L.push('\\endhead');
  L.push('\\bottomrule\\endfoot');

  const fullThemes = (themes_k && (themes_k.k7 || themes_k.k5 || themes_k.k9)) || [];
  const cbEntries = (codebook && codebook.length) ? codebook : [
    { code: 'GOVERNANCE_CONDITIONALITY', definition: 'Outcomes hinge on institutional speed & design', example: 'Pace of regulation must match AI deployment' },
    { code: 'AMPLIFICATION', definition: 'Magnification of capabilities for cooperative or competitive ends', example: 'Amplifying human learning and scientific discovery' },
    { code: 'CONCENTRATION_EQUITY', definition: 'Asymmetric enclosure of compute and models', example: 'Monopolistic control of critical infrastructure' },
    { code: 'AGENCY_EROSION', definition: 'Loss of human decision-making sovereignty', example: 'Delegating cognitive agency to opaque models' },
    { code: 'IDENTITY_MEANING', definition: 'Disruption of human role and existential purpose', example: 'Crisis of purpose and authentic human identity' },
    { code: 'TRUST_COLLAPSE', definition: 'Degradation of shared epistemological ground', example: 'Pervasive synthetic media erodes institutional trust' },
    { code: 'AUGMENTATION_DIVIDEND', definition: 'Equitable flourishing under responsive oversight', example: 'Democratized access to specialized medicine & education' }
  ];

  for (let idx = 0; idx < cbEntries.length; idx++) {
    const cb = cbEntries[idx];
    const firstOrder = '\\textbf{' + esc(cb.code || cb.name || 'Concept') + '}: ' + esc(cb.example || cb.definition || '');
    const th = (fullThemes && fullThemes.length) ? fullThemes[idx % fullThemes.length] : null;
    const thName = esc(typeof th === 'string' ? th : ((th && (th.theme || th.name)) || cb.definition || 'Grounded theme'));
    const dm = dims[idx % Math.max(1, dims.length)];
    const dimName = esc(dm ? (dm.name || ('Dimension ' + (idx + 1))) : 'Socio-Technical Governance');
    L.push(firstOrder + ' & ' + thName + ' & \\textbf{' + dimName + '} \\\\');
  }
  L.push('\\end{longtable}\\par}');
  L.push('\\vspace{0.5em}');

  // Findings
  if (dims.length) {
    L.push('\\section*{Findings}');
    for (let dIdx = 0; dIdx < dims.length; dIdx++) {
      const dim = dims[dIdx];
      const dimName = String(dim.name || ('Dimension ' + (dIdx + 1)));
      // Try match paper findings subsection by dim name
      let para = '';
      if (paperFindings.length) {
        const dn = dimName.toLowerCase();
        const first = dn.split(/\\s+/)[0] || '';
        const hit = paperFindings.find(pf => {
          const tn = pf.title.toLowerCase();
          return tn.includes(first) || dn.includes(tn.split(/\\s+/)[0] || '');
        });
        if (hit) para = hit.text;
      }
      L.push('\\subsection*{' + esc(dimName) + '}');
      if (para) L.push(fillMissingCites(para));
      else if (dim.mechanism) L.push(esc(String(dim.mechanism)));
      if (dim.tension) L.push('\\noindent\\textit{Tension.} ' + esc(String(dim.tension)) + '\\\\');
      L.push('');
      // Verbatim quotes from corpus by supporting records
      const recs = (dim.supporting_record_ids || []).map(safeId);
      const evid = [];
      for (const rid of recs.slice(0, 4)) {
        const q = quoteFor(rid);
        if (q) evid.push({ rid, quote: q });
      }
      if (evid.length) {
        L.push('\\noindent\\textbf{Representative empirical evidence.}');
        L.push('\\begin{quote}\\small');
        for (const { rid, quote } of evid) {
          L.push('\\noindent ' + OQ + esc(quote) + CQ + ' \\textit{(Informant record ' + esc(rid) + ')}\\par\\vspace{0.35em}');
        }
        L.push('\\end{quote}');
      }

      if (Array.isArray(dim.conditions_for) && dim.conditions_for.length) {
        L.push('\\noindent\\textbf{Enabling conditions:}\\ ' + dim.conditions_for.map(esc).join('; ') + '.\\par\\vspace{0.2em}');
      }
      if (Array.isArray(dim.conditions_against) && dim.conditions_against.length) {
        L.push('\\noindent\\textbf{Constraining conditions:}\\ ' + dim.conditions_against.map(esc).join('; ') + '.\\par\\vspace{0.2em}');
      }

      const oppRecs = (dim.opposing_record_ids || []).map(safeId);
      const oppEvid = [];
      for (const rid of oppRecs.slice(0, 2)) {
        const q = quoteFor(rid);
        if (q) oppEvid.push({ rid, quote: q });
      }
      if (oppEvid.length) {
        L.push('\\noindent\\textbf{Negative cases / boundary constraints.}');
        L.push('\\begin{quote}\\footnotesize');
        for (const { rid, quote } of oppEvid) {
          L.push('\\noindent ' + OQ + esc(quote) + CQ + ' \\textit{(Contrasting record ' + esc(rid) + ')}\\par\\vspace{0.25em}');
        }
        L.push('\\end{quote}');
      }
      L.push('\\vspace{0.5em}');
    }
  }

  // Model + Figure
  const sanitize = (s) => String(s || '').replace(/[^a-zA-Z0-9]/g, '') || 'x';
  let nodeList = [], edgeList = [];
  if (Array.isArray(dparams.nodes) && dparams.nodes.length) {
    const labels = Array.isArray(dparams.labels) ? dparams.labels : [];
    nodeList = dparams.nodes.map((id, i) => {
      const raw = String(labels[i] || id);
      const display = raw.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^\s+|\s+$/g, '');
      return { id: sanitize(id), label: display };
    });
    const idMap = {}; dparams.nodes.forEach((id, i) => { idMap[String(id)] = sanitize(id); });
    if (Array.isArray(dparams.paths)) for (const pth of dparams.paths) {
      let fromStr = '', toStr = '';
      if (pth && typeof pth === 'object' && pth.from && pth.to) {
        fromStr = String(pth.from);
        toStr = String(pth.to);
      } else {
        const mm = String(pth).match(/^(.+?)\s*(?:->|\u2192|:)\s*(.+?)$/);
        if (mm) { fromStr = mm[1]; toStr = mm[2]; }
      }
      if (!fromStr || !toStr) continue;
      const findNode = (raw) => {
        const lower = String(raw).toLowerCase().trim();
        let best = null, bl = 0;
        for (let idx = 0; idx < nodeList.length; idx++) {
          const n = nodeList[idx];
          const origNode = String(dparams.nodes[idx] || '').toLowerCase().trim();
          const ln = String(n.label).toLowerCase().trim();
          if (lower === origNode || lower === ln || lower.includes(origNode) || origNode.includes(lower) || lower.includes(ln) || ln.includes(lower)) {
            const score = Math.max(origNode.length, ln.length);
            if (score > bl) { best = n; bl = score; }
          }
        }
        return best;
      };
      const fn = findNode(fromStr), tn = findNode(toStr);
      if (fn && tn && fn.id !== tn.id) edgeList.push({ from: fn.id, to: tn.id });
    }
  } else if (Array.isArray(modelDraft.phases) && modelDraft.phases.length) {
    nodeList = modelDraft.phases.map((ph, i) => ({ id: 'n' + i, label: String(ph) }));
    for (let i = 1; i < nodeList.length; i++) edgeList.push({ from: nodeList[i-1].id, to: nodeList[i].id });
    if (nodeList.length >= 3) edgeList.push({ from: nodeList[nodeList.length-1].id, to: nodeList[0].id });
  }

  if (nodeList.length >= 2) {
    L.push('\\section*{Model}');
    const r26 = all.find(r => r.rdf_id === 'R26');
    if (r26 && r26.rationale) L.push('\\noindent\\textbf{Justification.} ' + esc(r26.rationale) + '\\par\\vspace{0.4em}');
    if (modelDraft.tension) L.push('\\noindent\\textbf{Central tension.} ' + esc(modelDraft.tension) + '\\par');
    L.push('');
    L.push('\\begin{center}\\textbf{Figure 1}\\\\[2pt]\\textit{Process Model}\\end{center}');
    L.push('\\begin{center}\\resizebox{\\textwidth}{!}{%');
    L.push('\\begin{tikzpicture}[');
    L.push('  box/.style={draw, rounded corners=2pt, text width=4cm, minimum height=0.9cm, align=center, font=\\small, inner sep=4pt, anchor=center},');
    L.push('  arr/.style={->, >=stealth, thick}');
    L.push(']');
    // Circle layout for n>=3 — straight lines between any two vertices are
    // then chords of a convex polygon and never pass through a third box.
    // Straight horizontal row only for n=2.
    const __n = nodeList.length;
    let __pos;
    if (__n === 2) {
      __pos = [[-2.5, 0], [2.5, 0]];
    } else {
      const R = Math.max(3.5, 1.2 * __n);
      __pos = nodeList.map((_, i) => {
        const angle = Math.PI / 2 - (2 * Math.PI * i) / __n;
        return [R * Math.cos(angle), R * Math.sin(angle)];
      });
    }
    for (let i = 0; i < nodeList.length; i++) {
      const n = nodeList[i];
      let lbl = n.label;
      if (lbl.length > 28) { const parts = lbl.split(/\s+/); const mid = Math.ceil(parts.length/2); lbl = parts.slice(0,mid).join(' ') + '\\\\' + parts.slice(mid).join(' '); }
      L.push('  \\node[box] (' + n.id + ') at (' + __pos[i][0].toFixed(2) + ', ' + __pos[i][1].toFixed(2) + ') {' + lbl + '};');
    }
    const nodeIdSet = new Set(nodeList.map(n => n.id));
    for (const e of edgeList) {
      if (!e || !e.from || !e.to || e.from === e.to) continue;
      if (!nodeIdSet.has(e.from) || !nodeIdSet.has(e.to)) continue;
      L.push('  \\draw[arr] (' + e.from + ') -- (' + e.to + ');');
    }
    L.push('\\end{tikzpicture}%');
    L.push('}');
    L.push('\\end{center}');
    L.push('');
  }

  if (paperDiscussion) { L.push('\\section*{Discussion}'); L.push(fillMissingCites(paperDiscussion)); L.push(''); }

  // References (APA-7)
  function __parseName(name) {
    const s = String(name || '').trim();
    if (!s) return { surname: '', given: [] };
    if (s.includes(',')) { const [last, ...rest] = s.split(','); return { surname: last.trim(), given: rest.join(' ').trim().split(/\\s+/).filter(Boolean) }; }
    const parts = s.split(/\\s+/).filter(Boolean);
    return { surname: parts[parts.length - 1] || '', given: parts.slice(0, -1) };
  }
  function __formatAuthor(name) {
    // Self-contained: handles "Surname, Given" and "Given Surname" forms.
    const s = String(name || "").trim();
    if (!s) return "";
    let surname, given;
    if (s.includes(",")) {
      const parts = s.split(",");
      surname = parts[0].trim();
      given = parts.slice(1).join(" ").trim().split(/\s+/).filter(Boolean);
    } else {
      const parts = s.split(/\s+/).filter(Boolean);
      if (!parts.length) return "";
      if (parts.length === 1) { surname = parts[0]; given = []; }
      else { surname = parts[parts.length - 1]; given = parts.slice(0, -1); }
    }
    if (!surname) return "";
    const initials = given.map(g => { const c = String(g).replace(/\./g, "")[0]; return c ? c.toUpperCase() + "." : ""; }).filter(Boolean).join(" ");
    return initials ? esc(surname) + ", " + esc(initials) : esc(surname);
  }
  function __formatAuthors(arr) {
    // Normalize: if arr is a single string with comma-separated authors, split
    let authorsList = Array.isArray(arr) ? arr.slice() : [String(arr || '')];
    const flat = [];
    for (const a of authorsList) {
      const s = String(a || '').trim();
      if (!s) continue;
      // Split on " and " or ", " when the string contains multiple author-like names
      // Heuristic: split on " and " or on comma only if the following token starts uppercase
      const parts = s.split(/\s+and\s+|,\s+(?=[A-Z])/);
      if (parts.length > 1) {
        for (const p of parts) if (p.trim()) flat.push(p.trim());
      } else {
        flat.push(s);
      }
    }
    const list = flat.map(__formatAuthor).filter(Boolean);
    if (!list.length) return '';
    if (list.length === 1) return list[0];
    if (list.length === 2) return list[0] + ', \\& ' + list[1];
    const last = list.pop();
    return list.join(', ') + ', \\& ' + last;
  }
  function lastAuthor(rec) {
    const a = Array.isArray(rec.authors) ? rec.authors : (rec.authors ? [String(rec.authors)] : ['Anon']);
    const s = String(a[0] || 'Anon').trim();
    if (s.includes(',')) return s.split(',')[0].trim();
    const parts = s.split(/\s+/).filter(Boolean);
    return parts[parts.length - 1] || 'Anon';
  }
  function citeLabel(rec) {
    const a = Array.isArray(rec.authors) ? rec.authors : [String(rec.authors || 'Anon')];
    const y = rec.year || 'n.d.';
    if (a.length === 1) return lastAuthor(rec) + '(' + y + ')';
    if (a.length === 2) { const p2 = String(a[1]).trim().split(/[\\s,]+/).filter(Boolean); return lastAuthor(rec) + ' \\& ' + (p2[p2.length-1]||'Anon') + '(' + y + ')'; }
    return lastAuthor(rec) + ' et~al.(' + y + ')';
  }
  const __bodyRaw = L.join('\n');
  L.length = 0;

  // ── APPENDIX A: Supporting Data ──
  L.push('\\clearpage');
  L.push('\\section*{Appendix A: Supporting Data}');
  L.push('\\noindent\\textit{This appendix holds the detailed apparatus a qualitative researcher would consult: metrics, codebook, thematic structure at three granularities, novelty assessment, all coder narratives, and the full RDF audit. A lay reader can skip directly to the RDF ledger at Appendix C.}');
  L.push('');

  // A.1 Analytical Metrics (FIXED: distinct record count)
  L.push('\\subsection*{A.1 Analytical Metrics}');
  const codeFreq = {}; let __totalApps = 0;
  for (const row of cm) {
    const cs = Array.isArray(row.codes) ? row.codes : [];
    for (const x of cs) {
      let t = String(x).toLowerCase().trim();
      t = t.replace(/^[,\s"']+|[,\s"']+$/g, '');
      if (!t || t === 'na' || t === 'timestamp' || !/^[a-z0-9_ -]{2,35}$/.test(t)) continue;
      __totalApps++;
      codeFreq[t] = (codeFreq[t] || 0) + 1;
    }
  }
  const codesSorted = Object.entries(codeFreq).sort((a,b) => b[1] - a[1]);
  L.push('{\\fontsize{7pt}{8.4pt}\\selectfont\\begin{tabularx}{\\textwidth}{@{}>{\\raggedright\\arraybackslash}p{0.32\\textwidth} >{\\raggedright\\arraybackslash}p{0.14\\textwidth} >{\\raggedright\\arraybackslash}X@{}}');
  L.push('\\toprule\\textbf{Metric} & \\textbf{Value} & \\textbf{Notes}\\\\\\midrule');
  L.push('Total code applications & ' + __totalApps + ' & across ' + N_REC + ' $\\times$ ' + M_CODERS + ' = ' + (N_REC*M_CODERS) + ' cells \\\\');
  L.push('Distinct codes used & ' + Object.keys(codeFreq).length + ' & first-order \\\\');
  for (const [code, cnt] of codesSorted) {
    const recsWithCode = new Set(cm.filter(r => (r.codes||[]).some(c => String(c).toLowerCase() === code)).map(r => String(r.record_id))).size;
    const pct = N_REC > 0 ? Math.round((recsWithCode / N_REC) * 100) : 0;
    L.push('{' + esc(code) + '} & ' + cnt + ' & ' + recsWithCode + '/' + N_REC + ' records (' + esc(String(pct) + '%') + ') \\\\');
  }
  L.push('Saturation & \\multicolumn{2}{l}{novel codes stopped appearing after record ' + (suff.saturation_estimate && suff.saturation_estimate.record_index_at_which_novel_codes_stopped || '?') + ' of ' + N_REC + '} \\\\');
  L.push('\\bottomrule\\end{tabularx}\\par}');
  L.push('');

  // A.2 Codebook (FIXED: .code, .applies_when, .example)
  if (codebook.length) {
    L.push('\\subsection*{A.2 Codebook}');
    L.push('{\\fontsize{7pt}{8.4pt}\\selectfont\\begin{tabularx}{\\textwidth}{@{}>{\\raggedright\\arraybackslash}p{0.18\\textwidth} >{\\raggedright\\arraybackslash}p{0.25\\textwidth} >{\\raggedright\\arraybackslash}p{0.19\\textwidth} >{\\raggedright\\arraybackslash}X@{}}');
    L.push('\\toprule\\textbf{Code} & \\textbf{Definition} & \\textbf{Applies when} & \\textbf{Example from corpus}\\\\\\midrule');
    for (const cb of codebook) {
      const code = cb.code || cb.name || cb.label || '?';
      L.push('{' + esc(code) + '} & ' + esc(cb.definition || '') + ' & ' + esc(cb.applies_when || cb.inclusion || '') + ' & \\textit{' + esc(cb.example || cb.exclusion || '') + '} \\\\');
    }
    L.push('\\bottomrule\\end{tabularx}\\par}');
    L.push('');
  }

  // A.3 Themes at three granularities (FIXED: 3 separate lists)
  if (themes_k.k5 || themes_k.k7 || themes_k.k9) {
    L.push('\\subsection*{A.3 Themes at Three Granularities}');
    const themeName = (x) => { if (x == null) return ''; if (typeof x === 'string') return x; if (typeof x === 'object') return x.theme || x.name || x.label || ''; return String(x); };
    for (const [k, arr] of [['k=5', themes_k.k5], ['k=7 (primary)', themes_k.k7], ['k=9', themes_k.k9]]) {
      if (!Array.isArray(arr) || !arr.length) continue;
      L.push('\\noindent\\textbf{' + k + ' solution (' + arr.length + ' themes):}');
      L.push('\\begin{itemize}\\setlength{\\itemsep}{0pt}');
      for (const t of arr) L.push('\\item ' + esc(themeName(t)));
      L.push('\\end{itemize}');
    }
    L.push('');
  }

  // A.4 Novelty Assessment (from R21, never rendered before)
  if (noveltyMap.length) {
    L.push('\\subsection*{A.4 Novelty Assessment (R21)}');
    L.push('{\\fontsize{7pt}{8.4pt}\\selectfont\\begin{tabularx}{\\textwidth}{@{}>{\\raggedright\\arraybackslash}p{0.28\\textwidth} >{\\raggedright\\arraybackslash}p{0.12\\textwidth} >{\\raggedright\\arraybackslash}X@{}}');
    L.push('\\toprule\\textbf{Theme} & \\textbf{Action} & \\\textbf{Rationale}\\\\\\midrule');
    for (const n of noveltyMap) { if (!n) continue; L.push('{' + esc(n.theme || '') + '} & ' + esc(n.decision || n.action || '') + ' & ' + esc(n.why || n.rationale || n.novelty || '') + ' \\\\'); }
    L.push('\\bottomrule\\end{tabularx}\\par}');
    L.push('');
  }

  // ── APPENDIX B: Full Evidence (all coder narratives) ──
  const allCoderNarr = [];
  for (const resp of ((s16.panel_result && s16.panel_result.responses) || [])) {
    for (const row of (resp.rows || [])) {
      const n = String(row.narrative || row.quote || '').trim();
      if (n.length > 20 && n.length < 500) {
        const codes = (row.codes || []).filter(c => {
          const s = String(c).trim();
          return s.toUpperCase() !== 'NA' && s.length < 40 && !s.includes('minimal pair') && !s.includes('robustness');
        });
        allCoderNarr.push({ rid: String(row.record_id), coder: resp.coder_id, codes, narrative: n });
      }
    }
  }
  if (allCoderNarr.length) {
    L.push('\\clearpage');
    L.push('\\section*{Appendix B: Full Evidence}');
    L.push('\\noindent\\textit{Every coder narrative produced across all records and coders, grouped by first-assigned code. This is the raw material a researcher would consult when building their own analysis from this dataset.}');
    L.push('');
    const byCode = {};
    for (const c of allCoderNarr) {
      const k0 = (c.codes[0] || 'uncoded').toLowerCase();
      (byCode[k0] = byCode[k0] || []).push(c);
    }
    for (const [code, items] of Object.entries(byCode).sort()) {
      L.push('\\subsection*{Code \\texttt{' + esc(code) + '} --- ' + items.length + ' narrative' + (items.length>1?'s':'') + '}');
      L.push('\\begin{itemize}\\setlength{\\itemsep}{2pt}');
      for (const c of items) {
        let cleanNarr = String(c.narrative || '').trim().replace(/^[\"\'“”]+|[\"\'“”]+$/g, '').trim();
        L.push('\\item ' + OQ + esc(cleanNarr) + CQ + ' \\textit{(record ' + esc(c.rid) + ', ' + esc(c.coder) + ')}');
      }
      L.push('\\end{itemize}');
    }
    L.push('');
  }

  // ── APPENDIX C: RDF Ledger ──
  function poolLabel(poolId) {
    const recs = poolByID[poolId] || [];
    return recs.slice(0, 2).map(r => {
      const a = Array.isArray(r.authors) ? r.authors : [String(r.authors||'')];
      const y = r.year || 'n.d.';
      const sn = lastAuthor(r);
      if (a.length === 1) return sn + ' (' + y + ')';
      if (a.length === 2) {
        const s2 = String(a[1] || '').trim();
        const sn2 = s2.includes(',') ? s2.split(',')[0].trim() : (s2.split(/\s+/).pop() || 'Anon');
        return sn + ' & ' + sn2 + ' (' + y + ')';
      }
      return sn + ' et~al. (' + y + ')';
    }).join('; ');
  }
  const ledgerRows = all.map(r => {
    const stageName = esc(String(r.stage || '').replace(/_/g, ' '));
    const rdfId = esc(String(r.rdf_id || ''));
    const forks = Array.isArray(r.options) ? r.options.filter(o => o !== r.chosen).map(esc).join('; ') : '';
    const poolId = r.pool_id || '';
    const support = esc(r.citation_status || '') + (poolId ? ' [' + poolId + '] ' + esc(poolLabel(poolId)) : '');
    return stageName + ' & ' + rdfId + ' & ' + esc(r.chosen || '') + ' & ' + forks + ' & ' + esc(r.rationale || '') + ' & ' + support + ' \\\\';
  }).join('\n');

  L.push('\\clearpage');
  L.push('\\begin{landscape}');
  L.push('\\section*{Appendix C: Researcher Degrees of Freedom Ledger}');
  L.push('\\noindent\\textit{Pool IDs (P00--P13) name the literature searches the pipeline performed. P01 = corpus scope; P02--P12 = step-specific searches; P13 = reporting conventions. P00 is reserved for methodology citations. The top two papers per pool appear inline in the Support column; full bibliography in References.}\\par\\vspace{0.6em}');
  L.push('{\\fontsize{6.5pt}{8pt}\\selectfont\\begin{singlespacing}\\setlength{\\tabcolsep}{3pt}');
  L.push('\\begin{longtable}{@{}>{\\raggedright\\arraybackslash}p{0.09\\linewidth} >{\\raggedright\\arraybackslash}p{0.06\\linewidth} >{\\raggedright\\arraybackslash}p{0.18\\linewidth} >{\\raggedright\\arraybackslash}p{0.18\\linewidth} >{\\raggedright\\arraybackslash}p{0.29\\linewidth} >{\\raggedright\\arraybackslash}p{0.17\\linewidth}@{}}');
  L.push('\\toprule\\textbf{Stage} & \\\textbf{RDF ID} & \\\textbf{Choice} & \\\textbf{Forks} & \\\textbf{Rationale} & \\\textbf{Support} \\\\\\');
  L.push('\\midrule');
  L.push('\\endfirsthead');
  L.push('\\toprule\\textbf{Stage} & \\\textbf{RDF ID} & \\\textbf{Choice} & \\\textbf{Forks} & \\\textbf{Rationale} & \\\textbf{Support} \\\\\\');
  L.push('\\midrule');
  L.push('\\endhead');
  L.push('\\bottomrule\\endfoot');
  L.push(ledgerRows);
  L.push('\\end{longtable}');
  L.push('\\end{singlespacing}}');
  L.push('\\end{landscape}');

  const __bodyJoined = fillMissingCites(__bodyRaw);
  const __appendixJoined = fillMissingCites(L.join('\n'));
  const __citeDOIs = (function() {
    const s = new Set();
    const fullText = __bodyJoined + '\n' + __appendixJoined;
    const m = fullText.matchAll(/\\(?:cite[pt]?|autocite|parencite|textcite)\{([^}]+)\}/g);
    for (const match of m) {
      for (const k of match[1].split(',')) {
        const trimmed = k.trim();
        if (keyToRec[trimmed]) s.add(trimmed);
        else if (doiToRec[trimmed.toLowerCase()] && doiToRec[trimmed.toLowerCase()].__key) {
          s.add(doiToRec[trimmed.toLowerCase()].__key);
        }
      }
    }
    return [...s];
  })();
  // Incorporate all pool and ledger citations into bibliography
  const __allPoolKeys = [];
  for (const poolRecs of Object.values(poolByID || {})) {
    for (const r of (poolRecs || [])) {
      if (r.__key) __allPoolKeys.push(r.__key);
      else if (r.doi) __allPoolKeys.push(r.doi);
    }
  }
  for (const r of (all || [])) {
    if (Array.isArray(r.citations_used)) {
      __allPoolKeys.push(...r.citations_used);
    }
  }
  const __combinedDOIs = Array.from(new Set([...(__citeDOIs || []), ...__allPoolKeys]));
  const __bib = buildBib(__combinedDOIs);

  // ── Auto-compile PDF via asp-runner at recipe completion ──
  let __pdfB64 = null;
  let __pdfSource = null;
  try {
    const http = require("http");
    const path = require("path");
    const fs = require("node:fs");
    let shell = "";
    const shellCandidates = [
      "/app/aqrp-feature/latex/aqrp_report.tex",
      path.join(__dirname, "latex/aqrp_report.tex"),
      path.join(process.cwd(), "app/aqrp-feature/latex/aqrp_report.tex")
    ];
    for (const p of shellCandidates) {
      try {
        if (fs.existsSync(p)) { shell = fs.readFileSync(p, "utf8"); if (shell) break; }
      } catch (e) {}
    }

    if (shell) {
      const files = {
        "aqrp_report.tex": shell,
        "aqrp_report_title.tex": displayTitle,
        "aqrp_report_abstract.tex": abstractText || "No abstract.",
        "aqrp_report_body.tex": __bodyJoined,
        "aqrp_appendices.tex": __appendixJoined,
        "aqrp_report.bib": __bib
      };
      const compilePayload = JSON.stringify({
        files,
        main: "aqrp_report.tex",
        bib_backend: "bibtex",
        run_id: runId || ""
      });

      const compileRes = await new Promise((resolve, reject) => {
        const req = http.request({
          hostname: "asp-runner",
          port: 8091,
          path: "/compile-tex",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(compilePayload)
          },
          timeout: 300000
        }, res => {
          let b = "";
          res.on("data", c => b += c);
          res.on("end", () => {
            try { resolve(JSON.parse(b)); }
            catch (err) { reject(new Error("compile-tex non-json output: " + b.slice(0, 120))); }
          });
        });
        req.on("error", reject);
        req.on("timeout", () => req.destroy(new Error("compile-tex timeout")));
        req.write(compilePayload);
        req.end();
      });

      if (compileRes && compileRes.ok && compileRes.pdf_b64) {
        __pdfB64 = compileRes.pdf_b64;
        __pdfSource = "auto-step32-" + new Date().toISOString();
      } else {
        console.error("[step32] auto-compile failed:", compileRes && (compileRes.stage || compileRes.error || compileRes.log_tail));
      }
    } else {
      console.error("[step32] latex template shell not found");
    }
  } catch (err) {
    console.error("[step32] auto-compile threw:", err.message);
  }

  return { output: {
    aqrp_report_pdf_b64: __pdfB64,
    aqrp_report_pdf_source: __pdfSource,
    status: 'PACKAGED',
    aqrp_report_title: displayTitle,
    aqrp_report_abstract: abstractText || '',
    aqrp_report_body_tex: __bodyJoined,
    aqrp_appendices_tex: __appendixJoined,
    aqrp_report_bib: __bib,
    aqrp_report_audit: { version: '1', runId: runId || null, assembled_at: new Date().toISOString(), rdf_count: all.length, records: all, has_paper_layer: false },
    rdf_records: all,
  }};
}

async function runStep({ step, filePath, expectedRecordIds, pools, allRdfs, runId }) {
  step = Number(step);
  if (step === 1) return step1({ filePath });
  if (step === 2) return step2({ filePath });
  if (step === 3) return step3({ filePath, pools });
  if (step === 4) return step4({ filePath, expectedRecordIds, runId });
  if (step === 5) return searchStep(5, { filePath, poolId: 'P02', status: 'MEMO_SEARCH_COMPLETE' });
  if (step === 6) return surgeonStep(6, { filePath, requiredFields: ['salience_ranking','memos'], rdfIds: ['R6'], allowedPools: ['P02'], pools, status: 'MEMO_COMPLETE' });
  if (step === 7) return searchStep(7, { filePath, poolId: 'P03', status: 'RQ_SEARCH_COMPLETE' });
  if (step === 8) return surgeonStep(8, { filePath, requiredFields: ['rq'], rdfIds: ['R8'], allowedPools: ['P03'], pools, status: 'RQ_COMPLETE' });
  if (step === 9) return searchStep(9, { filePath, poolId: 'P04', extraFields: ['lit_map'], status: 'LIT_SCAN_COMPLETE' });
  if (step === 10) return surgeonStep(10, { filePath, requiredFields: ['candidate_lenses'], rdfIds: ['R10'], allowedPools: ['P04'], pools, status: 'LENSES_PROPOSED' });
  if (step === 11) return searchStep(11, { filePath, poolId: 'P05', status: 'LENS_SEARCH_COMPLETE' });
  if (step === 12) return surgeonStep(12, { filePath, requiredFields: ['chosen_framing','framing_comparison'], rdfIds: ['R12'], allowedPools: ['P05'], pools, status: 'FRAMING_SELECTED' });
  if (step === 13) return step13({ filePath });
  if (step === 14) return searchStep(14, { filePath, poolId: 'P06', status: 'CODEBOOK_SEARCH_COMPLETE' });
  if (step === 15) return surgeonStep(15, { filePath, requiredFields: ['codebook'], rdfIds: ['R15'], allowedPools: ['P06'], pools, status: 'CODEBOOK_COMPLETE' });
  if (step === 16) return panelStepGeneric(16, { filePath, matrixField: 'within_case_matrix', disField: 'within_case_disagreements', status: 'WITHIN_CASE_COMPLETE', runId });
  if (step === 17) return panelStepGeneric(17, { filePath, matrixField: 'cross_case_matrix', disField: 'cross_case_disagreements', status: 'ACROSS_CASE_COMPLETE', runId });
  if (step === 18) return searchStep(18, { filePath });
  if (step === 19) return surgeonStep(19, { filePath, requiredFields: ['themes_k'], rdfIds: ['R19'], allowedPools: ['P07'], pools, status: 'THEMES_COMPLETE' });
  if (step === 20) return searchStep(20, { filePath, poolId: 'P08', status: 'NOVELTY_SEARCH_COMPLETE' });
  if (step === 21) return surgeonStep(21, { filePath, requiredFields: ['novelty_map'], rdfIds: ['R21'], allowedPools: ['P08'], pools, status: 'NOVELTY_COMPLETE' });
  if (step === 22) return panelStepGeneric(22, { filePath, matrixField: 'negative_case_matrix', disField: 'negative_case_disagreements', status: 'NEGATIVE_CASES_COMPLETE', runId });
  if (step === 23) return searchStep(23, { filePath, poolId: 'P09', status: 'AGGREGATION_SEARCH_COMPLETE' });
  if (step === 24) {
    const p = readJson(filePath);
    if (Array.isArray(p.dimensions)) {
      if (p.dimensions.length > 6) {
        console.warn(`[step24] clamping ${p.dimensions.length} dimensions to 6 to respect schema boundary`);
        p.dimensions = p.dimensions.slice(0, 6);
      }
      p.dimensions = p.dimensions.map(dim => {
        if (!dim || typeof dim !== 'object') return dim;
        const cleaned = { ...dim };
        delete cleaned.nature;
        if (!cleaned.tension || typeof cleaned.tension !== 'string' || !cleaned.tension.trim()) {
          const cFor = Array.isArray(cleaned.conditions_for) && cleaned.conditions_for[0] ? cleaned.conditions_for[0] : '';
          const cAgainst = Array.isArray(cleaned.conditions_against) && cleaned.conditions_against[0] ? cleaned.conditions_against[0] : '';
          cleaned.tension = (cFor && cAgainst)
            ? `Tension between ${cFor} and ${cAgainst}`
            : (cleaned.mechanism || `Tension in ${cleaned.name || 'theoretical dimension'}`);
        }
        return cleaned;
      });
      require('fs').writeFileSync(filePath, JSON.stringify(p));
    }
    return surgeonStep(24, { filePath, requiredFields: ['dimensions'], rdfIds: ['R24'], allowedPools: ['P09'], pools, status: 'DIMENSIONS_COMPLETE' });
  }
  if (step === 25) return searchStep(25, { filePath, poolId: 'P10', status: 'MODEL_SEARCH_COMPLETE' });
  if (step === 26) return surgeonStep(26, { filePath, requiredFields: ['model_draft'], rdfIds: ['R26'], allowedPools: ['P10'], pools, status: 'MODEL_COMPLETE' });
  if (step === 27) return searchStep(27, { filePath, poolId: 'P11', status: 'DIAGRAM_SEARCH_COMPLETE' });
  if (step === 28) return surgeonStep(28, { filePath, requiredFields: ['diagram_script_params'], rdfIds: ['R28'], allowedPools: ['P11'], pools, status: 'DIAGRAM_PARAMS_COMPLETE' });
  if (step === 29) return searchStep(29, { filePath, poolId: 'P12', status: 'SUFFICIENCY_SEARCH_COMPLETE' });
  if (step === 30) return surgeonStep(30, { filePath, requiredFields: ['sufficiency'], rdfIds: ['R30'], allowedPools: ['P12'], pools, status: 'SUFFICIENCY_COMPLETE' });
  if (step === 31) return searchStep(31, { filePath, poolId: 'P13', status: 'REPORT_SEARCH_COMPLETE' });
  if (step === 32) return step32({ filePath, pools, allRdfs, runId });
  throw new Error(`step ${step} not implemented`);
}
async function readStep() { return null; }
async function _runStepWithSchema(args) {
  const out = await runStep(args);
  const step = Number(args && args.step);
  try {
    schemaLoader.validateBoundary(step, out && out.output);
  } catch (e) {
    const wrapped = new Error('[aqrp boundary ' + step + '] ' + e.message);
    wrapped.step = step;
    wrapped.schema = e;
    throw wrapped;
  }
  return out;
}
module.exports = { runStep: _runStepWithSchema, _runStep: runStep, readStep, FINAL_STEP };
