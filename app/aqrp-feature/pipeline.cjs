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

async function step4({ filePath, expectedRecordIds }) {
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
async function panelStepGeneric(N, { filePath, matrixField, disField, status }) {
  const p = readJson(filePath);
  const pr = p.panel_result;
  if (!pr) throw new Error(`Step ${N}: panel_result required`);
  const folded = foldPanelEnvelope(pr, { matrixField, disField });
  return { output: { ...p, status, ...folded } };
}

async function step32({ filePath, pools, allRdfs, runId }) {
  const p = readJson(filePath);
  if (typeof p.submission_paper_tex !== 'string' || !p.submission_paper_tex.trim()) throw new Error('Step 32: submission_paper_tex required');
  const rdfs = p.rdf_records || [];
  const r32 = rdfs.find(r => r.rdf_id === 'R32');
  if (!r32) throw new Error('Step 32: missing R32');
  validateRdfRecord(r32, 'Step 32.R32', ['P13'], pools);
  const all = [...(allRdfs || []), r32];
  const esc = (s) => String(s == null ? '' : s).replace(/[\\&%$#_{}]/g, c => '\\' + c);
  const lines = all.map(r => `\\item \\textbf{${esc(r.rdf_id)}} (${esc(r.stage)}, pool ${esc(r.pool_id)}): ${esc(r.chosen)} --- ${esc(r.rationale)}`).join('\n');
  const supplementary_rdf_tex = `\\documentclass{article}\n\\begin{document}\n\\section*{Researcher Degrees of Freedom}\n\\begin{itemize}\n${lines}\n\\end{itemize}\n\\end{document}\n`;
  const aqrp_report = { version: '1', runId: runId || null, assembled_at: new Date().toISOString(), rdf_count: all.length, records: all };
  return { output: { status: 'PACKAGED', submission_paper_tex: p.submission_paper_tex, supplementary_rdf_tex, aqrp_report, rdf_records: [r32] } };
}

async function runStep({ step, filePath, expectedRecordIds, pools, allRdfs, runId }) {
  step = Number(step);
  if (step === 1) return step1({ filePath });
  if (step === 2) return step2({ filePath });
  if (step === 3) return step3({ filePath, pools });
  if (step === 4) return step4({ filePath, expectedRecordIds });
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
  if (step === 16) return panelStepGeneric(16, { filePath, matrixField: 'within_case_matrix', disField: 'within_case_disagreements', status: 'WITHIN_CASE_COMPLETE' });
  if (step === 17) return panelStepGeneric(17, { filePath, matrixField: 'cross_case_matrix', disField: 'cross_case_disagreements', status: 'ACROSS_CASE_COMPLETE' });
  if (step === 18) return searchStep(18, { filePath, poolId: 'P07', status: 'THEME_SEARCH_COMPLETE' });
  if (step === 19) return surgeonStep(19, { filePath, requiredFields: ['themes_k'], rdfIds: ['R19'], allowedPools: ['P07'], pools, status: 'THEMES_COMPLETE' });
  if (step === 20) return searchStep(20, { filePath, poolId: 'P08', status: 'NOVELTY_SEARCH_COMPLETE' });
  if (step === 21) return surgeonStep(21, { filePath, requiredFields: ['novelty_map'], rdfIds: ['R21'], allowedPools: ['P08'], pools, status: 'NOVELTY_COMPLETE' });
  if (step === 22) return panelStepGeneric(22, { filePath, matrixField: 'negative_case_matrix', disField: 'negative_case_disagreements', status: 'NEGATIVE_CASES_COMPLETE' });
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
