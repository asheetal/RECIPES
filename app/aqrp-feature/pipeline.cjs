"use strict";
const { FINAL_STEP } = require("./steps.cjs");
const METHODS_NORMS = new Set(['10.1177/1094428112452151','10.1191/1478088706qp063oa','10.5465/amr.2009.0486']);

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
  if (!rdf.options.includes(rdf.chosen)) throw new Error(at + '.chosen must be one of options');
  if (typeof rdf.rationale !== 'string' || !rdf.rationale.trim()) throw new Error(at + '.rationale required');
  if (!Array.isArray(rdf.citations_used)) throw new Error(at + '.citations_used must be array');
  if (!allowedPools.includes(rdf.pool_id)) throw new Error(at + '.pool_id must be one of ' + allowedPools.join(','));
  const st = ['pool_selected','partial','none_gut_feeling'];
  if (!st.includes(rdf.citation_status)) throw new Error(at + '.citation_status must be one of ' + st.join(','));
  if (rdf.citation_status === 'none_gut_feeling' && !rdf.gut_rationale) throw new Error(at + '.gut_rationale required when none_gut_feeling');
  if (rdf.citation_status === 'pool_selected' && rdf.pool_id !== 'P00' && pools && pools[rdf.pool_id]) {
    const poolDois = new Set((pools[rdf.pool_id].top_k || []).map(t => String(t.doi || '').toLowerCase()));
    const bad = rdf.citations_used.filter(d => !poolDois.has(String(d).toLowerCase()));
    if (bad.length) throw new Error(at + '.citations_used contains DOI(s) not in ' + rdf.pool_id + ': ' + bad.slice(0,3).join(', '));
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
      if (!Array.isArray(row.codes) || row.codes.length === 0) throw new Error(ra + '.codes must be non-empty array');
      if (row.codes.some(c => typeof c !== 'string' || !c.trim())) throw new Error(ra + '.codes must contain non-empty strings');
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
      if (set.size !== expected.size) throw new Error('coder ' + coder + ' covers ' + set.size + ' of ' + expected.size + ' expected records');
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
  if (!Array.isArray(p.topics) || p.topics.length < 2 || p.topics.length > 5) throw new Error('Step 2: topics must be array of 2-5 non-empty strings');
  if (!p.topics.every(t => typeof t === 'string' && t.trim())) throw new Error('Step 2: topics must be array of 2-5 non-empty strings');
  return { output: { ...p, status: 'TOPICS_IDENTIFIED' } };
}

async function step3({ filePath, pools }) {
  const p = readJson(filePath);
  if (!p.coding_brief || typeof p.coding_brief !== 'object') throw new Error('Step 3: coding_brief required');
  const cb = p.coding_brief;
  if (!Array.isArray(cb.code_for) || cb.code_for.length === 0 || !cb.code_for.every(s => typeof s === 'string' && s.trim())) throw new Error('Step 3: coding_brief.code_for must be non-empty strings');
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
  const codeOk = (c) => {
    if (!c) return false; if (c.length > 40) return false; if (c.split(/\s+/).length > 6) return false;
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

async function searchStep(N, { filePath, poolId, extraFields, status }) {
  const p = readJson(filePath);
  validateCitationPool(p[poolId], poolId);
  for (const f of (extraFields || [])) if (p[f] == null) throw new Error(`Step ${N}: payload.${f} required`);
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

async function _fetchRunSteps(runId) {
  if (!runId) return {};
  try {
    const mongoose = require('mongoose');
    const run = await mongoose.connection.db.collection('aqrpruns').findOne({ runId });
    return (run && run.steps) || {};
  } catch (e) { return {}; }
}

async function step32({ filePath, pools, allRdfs, runId }) {
  const p = readJson(filePath);
  const rdfs = p.rdf_records || [];
  const r32 = rdfs.find(r => r.rdf_id === 'R32');
  if (!r32) throw new Error('Step 32: missing R32');
  validateRdfRecord(r32, 'Step 32.R32', ['P13'], pools);
  const all = [...(allRdfs || []), r32];
  const steps = await _fetchRunSteps(runId);

  const esc = (s) => { if (s == null) return ''; if (typeof s === 'object') { const inner = s.id || s.name || s.label || s.theme || s.code || ''; return String(inner).replace(/[&%$#_{}]/g, c => '\\' + c); } return String(s).replace(/[&%$#_{}]/g, c => '\\' + c); };
  const safeId = (x) => { if (x == null) return ''; if (typeof x === 'string' || typeof x === 'number') return String(x); if (typeof x === 'object') return String(x.id || x.record_id || x.name || ''); return String(x); };
  const OQ = '\u0060\u0060';
  const CQ = '\u0027\u0027';

  // Pool DOI index
  const poolOrder = ['P01','P02','P03','P04','P05','P06','P07','P08','P09','P10','P11','P12','P13','P00'];
  const doiToRec = {}, poolDOIs = [], poolByID = {};
  for (const k of poolOrder) {
    const pool = pools && pools[k];
    if (!pool) continue;
    const recs = (pool.top_k || []).filter(r => r && r.doi);
    poolByID[k] = recs;
    for (const rec of recs) {
      const d = String(rec.doi);
      if (!doiToRec[d]) { doiToRec[d] = rec; poolDOIs.push(d); }
    }
  }

  // Step data
  const s1  = (steps['1']  && steps['1'].output)  || {};
  const s4  = (steps['4']  && steps['4'].output)  || {};
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
    if (!corpus) return null;
    const idx = Number(recordId);
    const rec = corpus[idx] || corpus.find(r => String(r.record_id) === String(recordId));
    if (!rec) return null;
    const text = rec.actual_said || rec.text || rec.content || '';
    if (text.length < 40) return null;
    if (text.length > 280) {
      const cut = text.slice(0, 280);
      const ls = cut.lastIndexOf(' ');
      return cut.slice(0, ls) + '...';
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

  // Extract paper if present
  let paper = p.submission_paper_tex || '';
  const hasPaper = paper.length > 500 && paper.indexOf('\\begin{document}') >= 0;
  let paperTitle = '', abstractText = '', paperRQ = '', paperLit = '', paperMethods = '', paperDiscussion = '';
  const paperFindings = [];
  if (hasPaper) {
    const beginDoc = paper.indexOf('\\begin{document}');
    const endDoc = paper.lastIndexOf('\\end{document}');
    let body = paper.slice(beginDoc + 16, endDoc);
    const titleMatch = paper.match(/\\title\{([\s\S]*?)\}/);
    paperTitle = titleMatch ? titleMatch[1].trim() : '';
    const abstractMatch = body.match(/\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/);
    abstractText = abstractMatch ? abstractMatch[1].trim() : '';
    body = body.replace(/\\begin\{abstract\}[\s\S]*?\\end\{abstract\}/g, '');
    body = body.replace(/\\title\{[\s\S]*?\}/g, '').replace(/\\author\{[\s\S]*?\}/g, '')
               .replace(/\\date\{[\s\S]*?\}/g, '').replace(/\\maketitle/g, '');
    body = body.replace(/\\begin\{thebibliography\}[\s\S]*?\\end\{thebibliography\}/g, '');
    body = body.replace(/\\bibliographystyle\{[^}]*\}/g, '').replace(/\\bibliography\{[^}]*\}/g, '');
    body = body.replace(/^[ \t]*\bKeywords?\s*:\s*[^\n]+\n?/gim, '');
    const __fc = body.indexOf('\\clearpage');
    if (__fc >= 0) body = body.slice(0, __fc);
    body = body.replace(/\\begin\{singlespacing\}[\s\S]*?\\end\{singlespacing\}/g, '');
    body = body.replace(/\\resizebox\{[^}]*\}\{[^}]*\}\{[\s\S]*?\\end\{tikzpicture\}%?\s*\}/g, '');
    body = body.replace(/\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}/g, '');
    body = body.replace(/\\vspace\{[^}]*\}\s*\n?\\noindent\\textit\{Keywords:\}[^\n]*\n?/g, '');
    body = body.replace(/\\noindent\\textit\{Keywords:\}[^\n]*\n?/g, '');
    body = body.trim();
    function getSection(txt, pat) {
      const re = new RegExp('\\\\section\\*?\\{([^}]*' + pat + '[^}]*)\\}([\\s\\S]*?)(?=\\\\section|\\\\subsection|$)', 'i');
      const m = txt.match(re);
      return m ? m[2].trim() : '';
    }
    paperRQ = getSection(body, 'research question|introduction');
    paperLit = getSection(body, 'literature|prior work');
    paperMethods = getSection(body, 'method');
    paperDiscussion = getSection(body, 'discussion|conclusion');
    const reSub = /\\subsection\*?\{([^}]+)\}([\s\S]*?)(?=\\subsection|\\section|$)/g;
    let mm;
    while ((mm = reSub.exec(body)) !== null) paperFindings.push({ title: mm[1].trim(), text: mm[2].trim() });
  }

  // ── Build tex ──
  const L = [];
  L.push('\\documentclass[11pt]{article}');
  L.push('\\usepackage[margin=1in]{geometry}');
  L.push('\\usepackage{times}');
  L.push('\\usepackage{setspace}');
  L.push('\\usepackage{longtable}');
  L.push('\\usepackage{tabularx}');
  L.push('\\usepackage{array}');
  L.push('\\usepackage{booktabs}');
  L.push('\\usepackage{hyperref}');
  L.push('\\usepackage{ragged2e}');
  L.push('\\usepackage{natbib}');
  L.push('\\usepackage{tikz}');
  L.push('\\usepackage{graphicx}');
  L.push('\\usetikzlibrary{arrows.meta, positioning, shapes.geometric}');
  L.push('\\begin{document}');

  // Title
  const displayTitle = paperTitle || 'Qualitative Analysis of AI Futures';
  L.push('\\begin{center}{\\Large\\bfseries ' + esc(displayTitle) + '}\\end{center}');
  L.push('\\begin{center}\\today\\end{center}');

  if (!hasPaper) {
    L.push('\\vspace{0.4em}');
    L.push('\\begin{center}\\fbox{\\parbox{0.92\\textwidth}{\\small\\textit{Note:}} \\parbox{0.88\\textwidth}{\\small The surgeon\\textquotesingle s paper body is not present for this run (prior re-packages overwrote it). This PDF presents the full analytical apparatus, Findings from state, Model, and complete RDF audit. Run a fresh AQRP to regenerate the paper layer: Abstract, Research Question, Literature, Methods, and full Discussion.}}\\end{center}');
    L.push('');
  }

  // Front matter (paper)
  if (abstractText) { L.push('\\section*{Abstract}'); L.push(esc(abstractText)); L.push(''); }
  if (paperRQ)      { L.push('\\section*{Research Question}'); L.push(paperRQ); L.push(''); }
  if (paperLit)     { L.push('\\section*{Literature}'); L.push(paperLit); L.push(''); }
  if (paperMethods) { L.push('\\section*{Methods}'); L.push(paperMethods); L.push(''); }

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
      if (para) L.push(para);
      else if (dim.mechanism) L.push(esc(String(dim.mechanism)));
      if (dim.tension) L.push('\\noindent\\textit{Tension.} ' + esc(String(dim.tension)) + '\\\\');
      L.push('');
      // Verbatim quotes from corpus by supporting records
      const recs = (dim.supporting_record_ids || []).map(safeId);
      const evid = [];
      for (const rid of recs.slice(0, 3)) {
        const q = quoteFor(rid);
        if (q) evid.push({ rid, quote: q });
      }
      if (evid.length) {
        L.push('\\noindent\\textbf{Representative evidence.}');
        L.push('\\begin{itemize}\\setlength{\\itemsep}{4pt}');
        for (const { rid, quote } of evid) L.push('\\item ' + OQ + esc(quote) + CQ + ' \\textit{(record ' + esc(rid) + ')}');
        L.push('\\end{itemize}');
      } else if (recs.length) {
        // Fall back to coder narratives
        L.push('\\noindent\\textbf{Coder narratives.}');
        L.push('\\begin{itemize}\\setlength{\\itemsep}{3pt}');
        let added = 0;
        for (const rid of recs.slice(0, 2)) {
          for (const c of coderNarrativesFor(rid).slice(0, 1)) {
            L.push('\\item ' + OQ + esc(c.narrative) + CQ + ' \\textit{(record ' + esc(rid) + ', ' + esc(c.coder) + ')}');
            added++;
            if (added >= 3) break;
          }
          if (added >= 3) break;
        }
        L.push('\\end{itemize}');
      }
      L.push('');
    }
  }

  // Model + Figure
  const sanitize = (s) => String(s || '').replace(/[^a-zA-Z0-9]/g, '') || 'x';
  let nodeList = [], edgeList = [];
  if (Array.isArray(dparams.nodes) && dparams.nodes.length) {
    const labels = Array.isArray(dparams.labels) ? dparams.labels : [];
    nodeList = dparams.nodes.map((id, i) => ({ id: sanitize(id), label: String(labels[i] || id) }));
    const idMap = {}; dparams.nodes.forEach((id, i) => { idMap[String(id)] = sanitize(id); });
    if (Array.isArray(dparams.paths)) for (const pth of dparams.paths) {
      const mm = String(pth).match(/^(.+?)\\s*(?:->|\\u2192|:)\\s*(.+?)$/);
      if (!mm) continue;
      const findNode = (raw) => { const lower = String(raw).toLowerCase(); let best = null, bl = 0; for (const n of nodeList) { const ln = String(n.label).toLowerCase(); if (lower.includes(ln) && ln.length > bl) { best = n; bl = ln.length; } } return best; };
      const fn = findNode(mm[1]), tn = findNode(mm[2]);
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
    for (let i = 0; i < nodeList.length; i++) {
      const n = nodeList[i];
      let lbl = n.label;
      if (lbl.length > 28) { const parts = lbl.split(/\\s+/); const mid = Math.ceil(parts.length/2); lbl = parts.slice(0,mid).join(' ') + '\\\\' + parts.slice(mid).join(' '); }
      L.push('  \\node[box] (' + n.id + ') at (' + (i * 5 - (nodeList.length - 1) * 5 / 2).toFixed(2) + ', 0) {' + lbl + '};');
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

  if (paperDiscussion) { L.push('\\section*{Discussion}'); L.push(paperDiscussion); L.push(''); }

  // References (APA-7)
  function __parseName(name) {
    const s = String(name || '').trim();
    if (!s) return { surname: '', given: [] };
    if (s.includes(',')) { const [last, ...rest] = s.split(','); return { surname: last.trim(), given: rest.join(' ').trim().split(/\\s+/).filter(Boolean) }; }
    const parts = s.split(/\\s+/).filter(Boolean);
    return { surname: parts[parts.length - 1] || '', given: parts.slice(0, -1) };
  }
  function __formatAuthor(name) {
    const { surname, given } = __parseName(name);
    if (!surname) return '';
    const initials = given.map(g => { const c = String(g).replace(/\\./g,'')[0]; return c ? c.toUpperCase() + '.' : ''; }).filter(Boolean).join(' ');
    return initials ? esc(surname) + ', ' + esc(initials) : esc(surname);
  }
  function __formatAuthors(arr) {
    const list = (Array.isArray(arr) ? arr : [String(arr||'')]).map(__formatAuthor).filter(Boolean);
    if (!list.length) return '';
    if (list.length === 1) return list[0];
    if (list.length === 2) return list[0] + ', \\& ' + list[1];
    const last = list.pop();
    return list.join(', ') + ', \\& ' + last;
  }
  function lastAuthor(rec) { const a = Array.isArray(rec.authors) ? rec.authors : (rec.authors ? [String(rec.authors)] : ['Anon']); const parts = String(a[0]).trim().split(/[\\s,]+/).filter(Boolean); return parts[parts.length-1] || 'Anon'; }
  function citeLabel(rec) {
    const a = Array.isArray(rec.authors) ? rec.authors : [String(rec.authors || 'Anon')];
    const y = rec.year || 'n.d.';
    if (a.length === 1) return lastAuthor(rec) + '(' + y + ')';
    if (a.length === 2) { const p2 = String(a[1]).trim().split(/[\\s,]+/).filter(Boolean); return lastAuthor(rec) + ' \\\\& ' + (p2[p2.length-1]||'Anon') + '(' + y + ')'; }
    return lastAuthor(rec) + ' et~al.(' + y + ')';
  }
  const __METHODOLOGY = {
    "10.1177/1094428112452151": { authors: ["Gioia, D. A.","Corley, K. G.","Hamilton, A. L."], year: 2013, title: "Seeking qualitative rigor in inductive research: Notes on the Gioia methodology", journal: "Organizational Research Methods" },
    "10.1191/1478088706qp063oa": { authors: ["Braun, V.","Clarke, V."], year: 2006, title: "Using thematic analysis in psychology", journal: "Qualitative Research in Psychology" },
    "10.5465/amr.2009.0486": { authors: ["Charmaz, K."], year: 2009, title: "Shifting the grounds: Constructivist grounded theory methods", journal: "Academy of Management Review" },
    "10.1177/1049732315617444": { authors: ["Malterud, K.","Siersma, V. D.","Guassora, A. D."], year: 2016, title: "Sample size in qualitative interview studies: Guided by information power", journal: "Qualitative Health Research" },
    "10.4135/9781452230153": { authors: ["Strauss, A.","Corbin, J."], year: 1998, title: "Basics of qualitative research: Techniques and procedures for developing grounded theory", journal: "Sage" }
  };
  function __lookupMethodology(doi) { return __METHODOLOGY[String(doi)] || null; }
  const rdfDOIs = new Set();
  for (const r of all) for (const d of (r.citations_used || [])) rdfDOIs.add(String(d));
  const __allDOIs = [...new Set([...rdfDOIs, ...poolDOIs])];
  const refDOIs = __allDOIs.sort((a, b) => {
    const ra = doiToRec[a], rb = doiToRec[b];
    const sa = ra ? lastAuthor(ra).toLowerCase() : a.toLowerCase();
    const sb = rb ? lastAuthor(rb).toLowerCase() : b.toLowerCase();
    if (sa !== sb) return sa < sb ? -1 : 1;
    return ((ra && ra.year)||0) - ((rb && rb.year)||0);
  });
  const bibitems = refDOIs.map(d => {
    let rec = doiToRec[d];
    if (!rec) { const m = __lookupMethodology(d); if (m) rec = m; }
    if (!rec) return '\\bibitem[DOI]{' + d + '} \\href{https://doi.org/' + d + '}{https://doi.org/' + d + '}';
    const url = 'https://doi.org/' + d;
    return '\\bibitem[' + citeLabel(rec) + ']{' + d + '} ' + __formatAuthors(rec.authors) + ' (' + (rec.year || 'n.d.') + '). ' + esc(rec.title || '').replace(/\\.$/,'') + '. \\textit{' + esc(rec.journal || '').replace(/\\.$/,'') + '.} \\href{' + url + '}{' + url + '}';
  });
  if (bibitems.length) {
    L.push('\\clearpage');
    L.push('\\begin{singlespacing}');
    L.push('\\begin{thebibliography}{99}');
    for (const b of bibitems) L.push(b);
    L.push('\\end{thebibliography}');
    L.push('\\end{singlespacing}');
    L.push('');
  }

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
    for (const x of cs) { const t = String(x).toLowerCase().trim(); if (!t || t === 'na') continue; __totalApps++; codeFreq[t] = (codeFreq[t] || 0) + 1; }
  }
  const codesSorted = Object.entries(codeFreq).sort((a,b) => b[1] - a[1]);
  L.push('\\begin{footnotesize}\\begin{tabularx}{\\textwidth}{@{}>{\\raggedright\\arraybackslash}p{0.32\\textwidth} >{\\raggedright\\arraybackslash}p{0.14\\textwidth} >{\\raggedright\\arraybackslash}X@{}}');
  L.push('\\toprule\\textbf{Metric} & \\textbf{Value} & \\textbf{Notes}\\\\\\midrule');
  L.push('Corpus & ' + N_REC + ' records; ' + M_CODERS + ' coders & --- \\\\');
  L.push('Total code applications & ' + __totalApps + ' & across ' + N_REC + ' $\\times$ ' + M_CODERS + ' = ' + (N_REC*M_CODERS) + ' cells \\\\');
  L.push('Distinct codes used & ' + Object.keys(codeFreq).length + ' & first-order \\\\');
  for (const [code, cnt] of codesSorted) {
    const recsWithCode = new Set(cm.filter(r => (r.codes||[]).some(c => String(c).toLowerCase() === code)).map(r => String(r.record_id))).size;
    const pct = N_REC > 0 ? Math.round((recsWithCode / N_REC) * 100) : 0;
    L.push('{' + esc(code) + '} & ' + cnt + ' & ' + recsWithCode + '/' + N_REC + ' records (' + pct + '\\\\%) \\\\');
  }
  L.push('Saturation & \\multicolumn{2}{l}{novel codes stopped appearing after record ' + (suff.saturation_estimate && suff.saturation_estimate.record_index_at_which_novel_codes_stopped || '?') + ' of ' + N_REC + '} \\\\');
  L.push('\\bottomrule\\end{tabularx}\\end{footnotesize}');
  L.push('');

  // A.2 Codebook (FIXED: .code, .applies_when, .example)
  if (codebook.length) {
    L.push('\\subsection*{A.2 Codebook}');
    L.push('\\begin{footnotesize}\\begin{tabularx}{\\textwidth}{@{}>{\\raggedright\\arraybackslash}p{0.13\\textwidth} >{\\raggedright\\arraybackslash}p{0.28\\textwidth} >{\\raggedright\\arraybackslash}p{0.20\\textwidth} >{\\raggedright\\arraybackslash}X@{}}');
    L.push('\\toprule\\textbf{Code} & \\textbf{Definition} & \\textbf{Applies when} & \\textbf{Example from corpus}\\\\\\midrule');
    for (const cb of codebook) {
      const code = cb.code || cb.name || cb.label || '?';
      L.push('{' + esc(code) + '} & ' + esc(cb.definition || '') + ' & ' + esc(cb.applies_when || cb.inclusion || '') + ' & \\textit{' + esc(cb.example || cb.exclusion || '') + '} \\\\');
    }
    L.push('\\bottomrule\\end{tabularx}\\end{footnotesize}');
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
    L.push('\\begin{footnotesize}\\begin{tabularx}{\\textwidth}{@{}>{\\raggedright\\arraybackslash}p{0.28\\textwidth} >{\\raggedright\\arraybackslash}p{0.12\\textwidth} >{\\raggedright\\arraybackslash}X@{}}');
    L.push('\\toprule\\textbf{Theme} & \\textbf{Action} & \\textbf{Rationale}\\\\\\midrule');
    for (const n of noveltyMap) L.push('{' + esc(n.theme || '') + '} & ' + esc(n.action || '') + ' & ' + esc(n.rationale || '') + ' \\\\');
    L.push('\\bottomrule\\end{tabularx}\\end{footnotesize}');
    L.push('');
  }

  // ── APPENDIX B: Full Evidence (all coder narratives) ──
  const allCoderNarr = [];
  for (const resp of ((s16.panel_result && s16.panel_result.responses) || [])) {
    for (const row of (resp.rows || [])) {
      const n = String(row.narrative || row.quote || '').trim();
      if (n.length > 20 && n.length < 500) {
        const codes = (row.codes || []).filter(c => String(c).toUpperCase() !== 'NA');
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
        L.push('\\item ' + OQ + esc(c.narrative) + CQ + ' \\textit{(record ' + esc(c.rid) + ', ' + esc(c.coder) + ')}');
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
      if (a.length === 2) { const p2 = String(a[1]).trim().split(/[\\s,]+/).filter(Boolean); return sn + ' \\\\& ' + (p2[p2.length-1]||'Anon') + ' (' + y + ')'; }
      return sn + ' et~al. (' + y + ')';
    }).join('; ');
  }
  const ledgerRows = all.map(r => {
    const num = (String(r.rdf_id || '').match(/\\d+/) || [String(r.stage || '')])[0];
    const forks = Array.isArray(r.options) ? r.options.filter(o => o !== r.chosen).map(esc).join('; ') : '';
    const poolId = r.pool_id || '';
    const support = esc(r.citation_status || '') + (poolId ? ' [' + poolId + '] ' + esc(poolLabel(poolId)) : '');
    return esc(num) + ' & ' + esc(r.rdf_id) + ' & ' + esc(r.chosen || '') + ' & ' + forks + ' & ' + esc(r.rationale || '') + ' & ' + support + ' \\\\';
  }).join('\n');

  L.push('\\clearpage');
  L.push('\\section*{Appendix C: Researcher Degrees of Freedom Ledger}');
  L.push('\\noindent\\textit{Pool IDs (P00--P13) name the literature searches the pipeline performed. P01 = corpus scope; P02--P12 = step-specific searches; P13 = reporting conventions. P00 is reserved for methodology citations. The top two papers per pool appear inline in the Support column; full bibliography in References.}\\par\\vspace{0.6em}');
  L.push('\\begin{singlespacing}\\begin{tiny}\\setlength{\\tabcolsep}{1.5pt}');
  L.push('\\begin{longtable}{@{}>{\\raggedright\\arraybackslash}p{0.035\\linewidth} >{\\raggedright\\arraybackslash}p{0.055\\linewidth} >{\\raggedright\\arraybackslash}p{0.14\\linewidth} >{\\raggedright\\arraybackslash}p{0.16\\linewidth} >{\\raggedright\\arraybackslash}p{0.36\\linewidth} >{\\raggedright\\arraybackslash}p{0.15\\linewidth}@{}}');
  L.push('\\toprule\\textbf{Step} & \\textbf{RDF} & \\textbf{Choice} & \\textbf{Forks} & \\textbf{Rationale} & \\textbf{Support} \\\\\\midrule\\endfirsthead');
  L.push('\\toprule\\textbf{Step} & \\textbf{RDF} & \\textbf{Choice} & \\textbf{Forks} & \\textbf{Rationale} & \\textbf{Support} \\\\\\midrule\\endhead');
  L.push('\\bottomrule\\endfoot');
  L.push(ledgerRows);
  L.push('\\end{longtable}');
  L.push('\\end{tiny}\\end{singlespacing}');

  L.push('\\end{document}');
  let __rawTex = L.join('\n');
  const tex = __rawTex.replace(/\[object Object\]/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
  return { output: {
    status: 'PACKAGED',
    aqrp_report_tex: tex,
    aqrp_report_audit: { version: '1', runId: runId || null, assembled_at: new Date().toISOString(), rdf_count: all.length, records: all, has_paper_layer: hasPaper },
    rdf_records: [r32],
    submission_paper_tex: p.submission_paper_tex || ''
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
  if (step === 18) return searchStep(18, { filePath, poolId: 'P07', status: 'THEME_SEARCH_COMPLETE' });
  if (step === 19) return surgeonStep(19, { filePath, requiredFields: ['themes_k'], rdfIds: ['R19'], allowedPools: ['P07'], pools, status: 'THEMES_COMPLETE' });
  if (step === 20) return searchStep(20, { filePath, poolId: 'P08', status: 'NOVELTY_SEARCH_COMPLETE' });
  if (step === 21) return surgeonStep(21, { filePath, requiredFields: ['novelty_map'], rdfIds: ['R21'], allowedPools: ['P08'], pools, status: 'NOVELTY_COMPLETE' });
  if (step === 22) return panelStepGeneric(22, { filePath, matrixField: 'negative_case_matrix', disField: 'negative_case_disagreements', status: 'NEGATIVE_CASES_COMPLETE', runId });
  if (step === 23) return searchStep(23, { filePath, poolId: 'P09', status: 'AGGREGATION_SEARCH_COMPLETE' });
  if (step === 24) return surgeonStep(24, { filePath, requiredFields: ['dimensions'], rdfIds: ['R24'], allowedPools: ['P09'], pools, status: 'DIMENSIONS_COMPLETE' });
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
module.exports = { runStep, readStep, FINAL_STEP };
