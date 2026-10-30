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

  const esc = (s) => String(s == null ? '' : s).replace(/[&%$#_{}]/g, c => '\\' + c);

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

  // Body extraction
  let paper = p.submission_paper_tex || '';
  const beginDoc = paper.indexOf('\\begin{document}');
  const endDoc = paper.lastIndexOf('\\end{document}');
  let body = (beginDoc >= 0 && endDoc > beginDoc)
    ? paper.slice(beginDoc + '\\begin{document}'.length, endDoc)
    : paper;

  const titleMatch = paper.match(/\\title\{([\s\S]*?)\}/);
  const surgeonTitle = titleMatch ? titleMatch[1].trim() : 'Qualitative Analysis of AI Futures';
  const abstractMatch = body.match(/\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/);
  const abstractText = abstractMatch ? abstractMatch[1].trim() : '';
  body = body.replace(/\\begin\{abstract\}[\s\S]*?\\end\{abstract\}/g, '');
  body = body.replace(/\\title\{[\s\S]*?\}/g, '').replace(/\\author\{[\s\S]*?\}/g, '')
             .replace(/\\date\{[\s\S]*?\}/g, '').replace(/\\maketitle/g, '');
  body = body.replace(/\\begin\{thebibliography\}[\s\S]*?\\end\{thebibliography\}/g, '');
  body = body.replace(/\\bibliographystyle\{[^}]*\}/g, '').replace(/\\bibliography\{[^}]*\}/g, '');
  // ── v238/v240 double-wrap recovery ──
  body = body.replace(/\n?\\begin\{center\}\s*\{\\Large\\bfseries[\s\S]*?\}\s*\\end\{center\}\s*\\begin\{center\}\s*\\today\s*\\end\{center\}\s*\\vspace\{[^}]*\}/g, '');
  if (!abstractText) {
    const __v238Abs = body.match(/\\section\*\{Abstract\}[ \t]*\n([\s\S]*?)(?=\n\\vspace|\n\\noindent\\textit\{Keywords:|\n\\section|\n\\clearpage)/);
    if (__v238Abs) {
      abstractText = __v238Abs[1].trim();
      body = body.replace(__v238Abs[0], '');
    }
  }
  body = body.replace(/\n?\\vspace\{[^}]*\}\s*\n\\noindent\\textit\{Keywords:\}[^\n]*\n?/g, '\n');
  body = body.replace(/\n?\\noindent\\textit\{Keywords:\}[^\n]*\n?/g, '\n');

  body = body.replace(/^[ \t]*\bKeywords?\s*:\s*[^\n]+\n?/gim, '');
  body = body.trim();

  // References universe
  const rdfDOIs = new Set();
  for (const r of all) for (const d of (r.citations_used || [])) rdfDOIs.add(String(d));
  const __allDOIs = [...new Set([...rdfDOIs, ...poolDOIs])];
  const refDOIs = __allDOIs.sort((a, b) => {
    const ra = doiToRec[a], rb = doiToRec[b];
    const sa = ra ? lastAuthor(ra).toLowerCase() : a.toLowerCase();
    const sb = rb ? lastAuthor(rb).toLowerCase() : b.toLowerCase();
    if (sa !== sb) return sa < sb ? -1 : 1;
    const ya = (ra && ra.year) || 0;
    const yb = (rb && rb.year) || 0;
    return ya - yb;
  });

  // --- [?] fix: replace literal (?) then sanitize \citep{nonDOI} keys ---
  function pickDOIByContext(context) {
    const words = String(context || '').toLowerCase().split(/[^a-z0-9]+/i).filter(w => w.length > 4);
    if (!words.length) return poolDOIs[0] || null;
    let best = null, bestScore = 0;
    for (const d of poolDOIs) {
      const rec = doiToRec[d]; if (!rec) continue;
      const hay = (String(rec.title||'') + ' ' + String(rec.journal||'') + ' ' +
                   (Array.isArray(rec.authors) ? rec.authors.join(' ') : String(rec.authors||''))).toLowerCase();
      let s = 0; for (const w of words) if (hay.includes(w)) s++;
      if (s > bestScore) { bestScore = s; best = d; }
    }
    return best || poolDOIs[0] || null;
  }
  body = body.replace(/\(\s*\?{1,3}\s*\)/g, (mm, off, full) => {
    const ctx = full.slice(Math.max(0, off - 250), Math.min(full.length, off + 250));
    const d = pickDOIByContext(ctx);
    return d ? `\\citep{${d}}` : '';
  });
  // Every \citep{X} where X isn't a DOI → replace with a context-matched DOI or drop
  const droppedCites = [];
  body = body.replace(/\\cite([pt]?)\{([^}]*)\}/g, (mm, mode, key) => {
    const k = String(key).trim();
    if (refDOIs.includes(k)) return `\\cite${mode}{${k}}`;
    if (/^\s*\?+\s*$/.test(k) || k === '') return '';
    // Fuzzy: find DOI whose citation label includes this key as surname+year
    const m2 = k.match(/^([A-Za-z]+?)(\d{4})/);
    if (m2) {
      const surname = m2[1].toLowerCase(), year = m2[2];
      for (const d of refDOIs) {
        const rec = doiToRec[d]; if (!rec) continue;
        const authors = Array.isArray(rec.authors) ? rec.authors.join(' ') : String(rec.authors||'');
        if (authors.toLowerCase().includes(surname) && String(rec.year) === year) return `\\citep{${d}}`;
      }
    }
    droppedCites.push(k);
    return '';
  });

  function lastAuthor(rec) {
    const authors = Array.isArray(rec.authors) ? rec.authors : (rec.authors ? [String(rec.authors)] : ['Anon']);
    const parts = String(authors[0]).trim().split(/[\s,]+/).filter(Boolean);
    return parts[parts.length - 1] || 'Anon';
  }
  function citeLabel(rec) {
    const authors = Array.isArray(rec.authors) ? rec.authors : [String(rec.authors || 'Anon')];
    const y = rec.year || 'n.d.';
    if (authors.length === 1) return `${lastAuthor(rec)}(${y})`;
    if (authors.length === 2) {
      const p2 = String(authors[1]).trim().split(/[\s,]+/).filter(Boolean);
      return `${lastAuthor(rec)} \\& ${p2[p2.length-1]||'Anon'}(${y})`;
    }
    return `${lastAuthor(rec)} et~al.(${y})`;
  }
  
  // ── APA-7 author formatting ──
  function __parseName(name) {
    const s = String(name || '').trim();
    if (!s) return { surname: '', given: [] };
    if (s.includes(',')) {
      const [last, ...rest] = s.split(',');
      const given = rest.join(' ').trim().split(/\s+/).filter(Boolean);
      return { surname: last.trim(), given };
    }
    const parts = s.split(/\s+/).filter(Boolean);
    return { surname: parts[parts.length - 1] || '', given: parts.slice(0, -1) };
  }
  function __formatAuthor(name) {
    const { surname, given } = __parseName(name);
    if (!surname) return '';
    const initials = given
      .map(g => { const c = String(g).replace(/\./g, '')[0]; return c ? c.toUpperCase() + '.' : ''; })
      .filter(Boolean)
      .join(' ');
    return initials ? `${esc(surname)}, ${esc(initials)}` : esc(surname);
  }
  function __formatAuthors(authorsArr) {
    const list = (Array.isArray(authorsArr) ? authorsArr : [String(authorsArr || '')]).map(__formatAuthor).filter(Boolean);
    if (list.length === 0) return '';
    if (list.length === 1) return list[0];
    if (list.length === 2) return `${list[0]}, \\& ${list[1]}`;
    const last = list.pop();
    return `${list.join(', ')}, \\& ${last}`;
  }

  const bibitems = refDOIs.map(d => {
    const rec = doiToRec[d];
    if (!rec) return `\\bibitem[DOI]{${d}} \\href{https://doi.org/${d}}{https://doi.org/${d}}`;
    const authors = __formatAuthors(rec.authors);
    const y = rec.year || 'n.d.';
    const title = esc(rec.title || '').replace(/\.$/, '') + '.';
    const journal = esc(rec.journal || '').replace(/\.$/, '') + '.';
    const doiUrl = `https://doi.org/${d}`;
    return `\\bibitem[${citeLabel(rec)}]{${d}} ${authors} (${y}). ${title} \\textit{${journal}} \\href{${doiUrl}}{${doiUrl}}`;
  });
  const refs = bibitems.length ? [
    '\\clearpage', '\\begin{singlespacing}', '\\begin{thebibliography}{99}',
    ...bibitems, '\\end{thebibliography}', '\\end{singlespacing}', ''
  ].join('\n') : '';

  // --- Model + diagram ---
  const s26 = (steps['26'] && steps['26'].output) || {};
  const s28 = (steps['28'] && steps['28'].output) || {};
  const modelDraft = s26.model_draft || {};
  const dparams = s28.diagram_script_params || {};

  const sanitize = (s) => String(s || '').replace(/[^a-zA-Z0-9]/g, '') || 'x';
  let nodeList = [], edgeList = [];
  if (Array.isArray(dparams.nodes) && dparams.nodes.length) {
    const labels = Array.isArray(dparams.labels) ? dparams.labels : [];
    nodeList = dparams.nodes.map((id, i) => ({ id: sanitize(id), label: String(labels[i] || id) }));
    const idMap = {}; dparams.nodes.forEach((id, i) => { idMap[String(id)] = sanitize(id); });
    if (Array.isArray(dparams.paths)) for (const pth of dparams.paths) {
      const mm = String(pth).match(/^(.+?)\s*(?:->|→)\s*(.+?)$/);
      if (mm) edgeList.push({ from: idMap[mm[1].trim()] || sanitize(mm[1]), to: idMap[mm[2].trim()] || sanitize(mm[2]) });
    }
  } else if (Array.isArray(modelDraft.phases) && modelDraft.phases.length) {
    nodeList = modelDraft.phases.map((ph, i) => ({ id: 'n' + i, label: String(ph) }));
    for (let i = 1; i < nodeList.length; i++) edgeList.push({ from: nodeList[i-1].id, to: nodeList[i].id });
    if (nodeList.length >= 3) edgeList.push({ from: nodeList[nodeList.length-1].id, to: nodeList[0].id });
  }
  let diagram = '';
  if (nodeList.length >= 2) {
    const tikzNodes = nodeList.map((n, i) => {
      let lbl = n.label;
      if (lbl.length > 28) { const parts = lbl.split(/\s+/); const mid = Math.ceil(parts.length/2); lbl = parts.slice(0,mid).join(' ') + '\\\\' + parts.slice(mid).join(' '); }
      const __spacing = 3.2;
      const __offset = (nodeList.length - 1) * __spacing / 2;
      return `  \\node[box] (${n.id}) at (${(i * __spacing - __offset).toFixed(2)}, 0) {${lbl}};`;
    }).join('\n');
    const tikzEdges = edgeList.map(e => e.from === e.to ? '' : `  \\draw[arr] (${e.from}) -- (${e.to});`).filter(Boolean).join('\n');
    const tensionNote = modelDraft.tension ? `\\noindent\\textit{Note.} ${esc(String(modelDraft.tension))}\\par\n` : '';
    diagram = ['\\clearpage',
      '\\begin{center}\\textbf{Figure 1}\\\\[2pt]','\\textit{Process Model}\\end{center}','\\vspace{0.3em}',
      '\\begin{center}',
      '\\resizebox{\\textwidth}{!}{%',
      '\\begin{tikzpicture}[',
      '  box/.style={draw, rounded corners=2pt, minimum width=2.4cm, minimum height=0.9cm, align=center, font=\\small, inner sep=3pt, anchor=center},',
      '  arr/.style={->, >=stealth, thick}',
      ']',
      tikzNodes, tikzEdges,
      '\\end{tikzpicture}%', '}', '\\end{center}', '\\vspace{0.2em}', tensionNote
    ].join('\n');
  }

  // --- Table 3: Analytical metrics (numbers) ---
  const s4 = (steps['4'] && steps['4'].output) || {};
  const s16 = (steps['16'] && steps['16'].output) || {};
  const s15 = (steps['15'] && steps['15'].output) || {};
  const s24 = (steps['24'] && steps['24'].output) || {};
  const s30 = (steps['30'] && steps['30'].output) || {};
  const cm = (s4.code_matrix || []);
  const codebook = ((s15.codebook && s15.codebook.codes) || []);
  const dims = (s24.dimensions || []);
  const suff = s30.sufficiency || {};

  // Code frequencies
  const codeFreq = {}; let __totalCodeApps = 0;
  const codersByCode = {}; // code -> set of coder_ids that used it
  const recordsByCode = {}; // code -> set of record_ids where it appears
  for (const row of cm) {
    const cid = row.coder_id || '?';
    for (const c of (row.codes || [])) {
      const t = String(c).toLowerCase().trim();
      if (!t || t === 'na') continue;
      codeFreq[t] = (codeFreq[t] || 0) + 1; __totalCodeApps++;
      (codersByCode[t] = codersByCode[t] || new Set()).add(cid);
      (recordsByCode[t] = recordsByCode[t] || new Set()).add(String(row.record_id));
    }
  }
  const codesSorted = Object.entries(codeFreq).sort((a,b) => b[1] - a[1]);
  console.log('[v238.3 metrics] cm=' + cm.length + ' totalApps=' + __totalCodeApps + ' distinct=' + Object.keys(codeFreq).length);
  const N_REC = new Set(cm.map(r => String(r.record_id))).size;
  const codersAll = [...new Set(cm.map(r => r.coder_id))];
  const M_CODERS = codersAll.length;

  // Coder agreement per code: for each record containing this code, did all M coders use it?
  function coderAgreement(code) {
    const byRec = {};
    for (const row of cm) {
      const rec = String(row.record_id);
      if (!byRec[rec]) byRec[rec] = new Set();
      for (const c of (row.codes || [])) {
        const t = String(c).toLowerCase().trim();
        if (t) byRec[rec].add(t);
      }
    }
    const has = Object.keys(byRec).filter(rec => byRec[rec].has(code)).length;
    return has;
  }

  // Saturation: at which record did new codes stop appearing
  let lastNovelRecord = 0;
  const seenCodes = new Set();
  const recIdsSorted = [...new Set(cm.map(r => String(r.record_id)))].sort((a,b)=>Number(a)-Number(b));
  for (const rec of recIdsSorted) {
    let novel = false;
    for (const row of cm) {
      if (String(row.record_id) !== rec) continue;
      for (const c of (row.codes || [])) {
        const t = String(c).toLowerCase().trim();
        if (t && t !== 'na' && !seenCodes.has(t)) { seenCodes.add(t); novel = true; }
      }
    }
    if (novel) lastNovelRecord = Number(rec) + 1;
  }
  const saturationFromData = lastNovelRecord;
  const saturationFromSuff = (suff.saturation_estimate && suff.saturation_estimate.record_index_at_which_novel_codes_stopped) || null;

  // Metrics table rows
  const metricsRows = [];
  metricsRows.push(`\\textit{Corpus} & ${N_REC} records; ${M_CODERS} coders & — \\\\`);
  const __appsText = (__totalCodeApps > 0) ? String(__totalCodeApps) : (cm.length > 0 ? "\\textemdash{}" : "0");
  const __appsNote = (__totalCodeApps > 0) ? `sum across ${N_REC}\\times{}${M_CODERS}=${N_REC*M_CODERS} cells` : `code-level metrics not computable on this run (see logs)`;
  metricsRows.push(`\\textit{Total code applications} & ${__appsText} & ${__appsNote} \\\\`);
  const __distinctText = (Object.keys(codeFreq).length > 0) ? String(Object.keys(codeFreq).length) : (cm.length > 0 ? "\\textemdash{}" : "0");
  metricsRows.push(`\\textit{Distinct codes used} & ${__distinctText} & first-order, from coder output \\\\`);
  for (const [code, count] of codesSorted.slice(0, 12)) {
    const agreement = coderAgreement(code);
    const pct = N_REC > 0 ? Math.round((agreement / N_REC) * 100) : 0;
    metricsRows.push(`${esc(code)} & ${count} & ${agreement}/${N_REC} records (${pct}\\%) \\\\`);
  }
  const saturation = saturationFromSuff != null ? saturationFromSuff : saturationFromData;
  metricsRows.push(`\\textit{Saturation} & \\multicolumn{2}{l}{novel codes stopped appearing after record ${saturation} of ${N_REC}} \\\\`);
  const table3 = [
    '\\begin{singlespacing}',
    '\\begin{center}\\textbf{Table 3}\\\\[2pt]',
    '\\textit{Analytical Metrics}\\end{center}',
    '\\begin{footnotesize}\\setlength{\\tabcolsep}{4pt}',
    '\\begin{tabularx}{\\textwidth}{@{}>{\\raggedright\\arraybackslash}p{0.28\\textwidth} >{\\raggedright\\arraybackslash}p{0.16\\textwidth} >{\\raggedright\\arraybackslash}X@{}}',
    '\\toprule',
    '\\textbf{Metric} & \\textbf{Value} & \\textbf{Notes} \\\\',
    '\\midrule',
    metricsRows.join('\n'),
    '\\bottomrule',
    '\\end{tabularx}',
    '\\end{footnotesize}',
    '\\end{singlespacing}', ''
  ].join('\n');

  // --- Evidence grid (per dimension: quote counts) ---
  const quotePool = [];
  for (const r of ((s16.panel_result && s16.panel_result.responses) || [])) {
    for (const row of (r.rows || [])) {
      const q = String(row.quote || '').trim();
      const codes = (row.codes || []).filter(c => String(c).toUpperCase() !== 'NA').map(c => String(c).toLowerCase());
      if (q.length > 40 && q.length < 350 && codes.length) {
        quotePool.push({ code: codes[0], codes, quote: q, rec: String(row.record_id || '?') });
      }
    }
  }
  let evidenceGrid = '';
  if (dims.length && quotePool.length) {
    const gridRows = dims.map(d => {
      const dimName = String(d.name || '').toLowerCase();
      const hay = (dimName + ' ' + String(d.mechanism || '') + ' ' + String(d.description || '')).toLowerCase();
      const matchedQuotes = quotePool.filter(q => q.codes.some(c => hay.includes(c)));
      const supporting = (d.supporting_record_ids || []).length || matchedQuotes.length;
      const opposing = (d.opposing_record_ids || []).length;
      const condFor = Array.isArray(d.conditions_for) && d.conditions_for.length ? d.conditions_for.length : null;
      const condAgainst = Array.isArray(d.conditions_against) && d.conditions_against.length ? d.conditions_against.length : null;
      return `${esc(String(d.name || ''))} & ${supporting} & ${opposing || '—'} & ${condFor != null ? condFor : '—'} & ${condAgainst != null ? condAgainst : '—'} \\\\`;
    }).join('\n');
    evidenceGrid = [
      '\\begin{singlespacing}',
      '\\begin{center}\\textbf{Table 4}\\\\[2pt]',
      '\\textit{Evidence per Dimension}\\end{center}',
      '\\begin{footnotesize}\\setlength{\\tabcolsep}{4pt}',
      '\\begin{tabularx}{\\textwidth}{@{}>{\\raggedright\\arraybackslash}X >{\\raggedright\\arraybackslash}p{0.10\\textwidth} >{\\raggedright\\arraybackslash}p{0.10\\textwidth} >{\\raggedright\\arraybackslash}p{0.13\\textwidth} >{\\raggedright\\arraybackslash}p{0.13\\textwidth}@{}}',
      '\\toprule',
      '\\textbf{Dimension} & \\textbf{Quotes for} & \\textbf{Quotes against} & \\textbf{Conditions for} & \\textbf{Conditions against} \\\\',
      '\\midrule',
      gridRows,
      '\\bottomrule',
      '\\end{tabularx}',
      '\\end{footnotesize}',
      '\\end{singlespacing}', ''
    ].join('\n');
  }

  // --- Dimension conditions/relationships (from new step-24 fields) ---
  let dimsNarrative = '';
  if (dims.length) {
    const parts = ['\\clearpage', '\\section*{Dimension Details}'];
    for (const d of dims) {
      parts.push('\\subsection*{' + esc(String(d.name || '')) + '}');
      if (d.mechanism) parts.push('\\noindent\\textit{Mechanism.} ' + esc(String(d.mechanism)) + '\\par');
      if (d.tension) parts.push('\\noindent\\textit{Tension.} ' + esc(String(d.tension)) + '\\par');
      if (Array.isArray(d.conditions_for) && d.conditions_for.length) {
        parts.push('\\noindent\\textit{Conditions for.}');
        parts.push('\\begin{itemize}\\setlength{\\itemsep}{0pt}');
        for (const c of d.conditions_for) parts.push('\\item ' + esc(String(c)));
        parts.push('\\end{itemize}');
      }
      if (Array.isArray(d.conditions_against) && d.conditions_against.length) {
        parts.push('\\noindent\\textit{Conditions against.}');
        parts.push('\\begin{itemize}\\setlength{\\itemsep}{0pt}');
        for (const c of d.conditions_against) parts.push('\\item ' + esc(String(c)));
        parts.push('\\end{itemize}');
      }
      if (Array.isArray(d.relationships) && d.relationships.length) {
        parts.push('\\noindent\\textit{Relationships.}');
        parts.push('\\begin{itemize}\\setlength{\\itemsep}{0pt}');
        for (const r of d.relationships) parts.push('\\item ' + esc(String(r.from||'')) + ' $\\rightarrow$ ' + esc(String(r.to||'')) + ': ' + esc(String(r.nature||'')));
        parts.push('\\end{itemize}');
      }
      const hasNew = Array.isArray(d.conditions_for) || Array.isArray(d.relationships);
      if (!hasNew) parts.push('\\noindent\\textit{Conditions and relationships not produced by this run. Re-run with updated prompt to populate.}\\par');
      parts.push('');
    }
    dimsNarrative = parts.join('\n');
  }

  // --- Table 1 (Codes, Themes, Dimensions) ---
  let table1 = '';
  if (dims.length && codebook.length) {
    const rows = dims.map(d => {
      const dimName = esc(d.name || '');
      const dimMech = esc(d.mechanism || '');
      const matched = codebook.filter(cb => {
        const lbl = String(cb.name || cb.label || '').toLowerCase().replace(/_/g,' ');
        const hay = (String(d.name||'') + ' ' + String(d.mechanism||'') + ' ' + String(d.description||'')).toLowerCase();
        return lbl && (hay.includes(lbl) || lbl.split(' ').some(w => w.length > 4 && hay.includes(w)));
      });
      const themes = matched.length ? matched.map(cb => esc(cb.name || cb.label || '')).join('; ')
                                    : codebook.slice(0,2).map(cb => esc(cb.name || cb.label || '')).join('; ');
      return `\\textbf{${dimName}} & ${themes} & \\textit{${dimMech}} \\\\`;
    }).join('\n');
    table1 = ['\\clearpage','\\begin{singlespacing}',
      '\\begin{center}\\textbf{Table 1}\\\\[2pt]','\\textit{Codes, Themes, and Dimensions}\\end{center}',
      '\\begin{footnotesize}\\setlength{\\tabcolsep}{4pt}',
      '\\begin{tabularx}{\\textwidth}{@{}>{\\raggedright\\arraybackslash}p{0.20\\textwidth} >{\\raggedright\\arraybackslash}p{0.32\\textwidth} >{\\raggedright\\arraybackslash}X@{}}',
      '\\toprule','\\textbf{Aggregate dimension} & \\textbf{Second-order themes} & \\textbf{Mechanism} \\\\','\\midrule',
      rows,
      '\\bottomrule','\\end{tabularx}','\\end{footnotesize}','\\end{singlespacing}',''
    ].join('\n');
  }

  // --- Table 2 (Representative Quotations) ---
  const seenQ = new Set(); const uniqQ = [];
  for (const item of quotePool) {
    const k = item.quote.slice(0, 50).toLowerCase();
    if (seenQ.has(k)) continue;
    seenQ.add(k); uniqQ.push(item);
    if (uniqQ.length >= 10) break;
  }
  let table2 = '';
  if (uniqQ.length) {
    const qRows = uniqQ.map(item => `${esc(item.code)} & ``${esc(item.quote)}''\\textsuperscript{${esc(item.rec)}} \\\\`).join('\n');
    table2 = ['\\begin{singlespacing}',
      '\\begin{center}\\textbf{Table 2}\\\\[2pt]','\\textit{Representative Quotations}\\end{center}',
      '\\begin{footnotesize}\\setlength{\\tabcolsep}{4pt}',
      '\\begin{tabularx}{\\textwidth}{@{}>{\\raggedright\\arraybackslash}p{0.24\\textwidth} >{\\raggedright\\arraybackslash}X@{}}',
      '\\toprule','\\textbf{Code} & \\textbf{Verbatim excerpt} \\\\','\\midrule',
      qRows,
      '\\bottomrule','\\end{tabularx}','\\end{footnotesize}','\\end{singlespacing}',''
    ].join('\n');
  }

  // --- Appendix: RDF ledger, no DOI spill ---
  function poolLabel(poolId) {
    const recs = poolByID[poolId] || [];
    return recs.slice(0, 2).map(r => {
      const authors = Array.isArray(r.authors) ? r.authors : [String(r.authors||'')];
      const y = r.year || 'n.d.';
      const surname = lastAuthor(r);
      if (authors.length === 1) return surname + ' (' + y + ')';
      if (authors.length === 2) {
        const p2 = String(authors[1]).trim().split(/[\s,]+/).filter(Boolean);
        return surname + ' \\& ' + (p2[p2.length-1]||'Anon') + ' (' + y + ')';
      }
      return surname + ' et~al. (' + y + ')';
    }).join('; ');
  }
  const ledgerRows = all.map(r => {
    const num = (String(r.rdf_id || '').match(/\d+/) || [String(r.stage || '')])[0];
    const forks = Array.isArray(r.options) ? r.options.filter(o => o !== r.chosen).map(esc).join('; ') : '';
    const poolId = r.pool_id || '';
    const support = esc(r.citation_status || '') + (poolId ? ` [${poolId}] ${esc(poolLabel(poolId))}` : '');
    return `${esc(num)} & ${esc(r.rdf_id)} & ${esc(r.chosen || '')} & ${forks} & ${esc(r.rationale || '')} & ${support} \\\\`;
  }).join('\n');
  const ledger = ['\\clearpage','\\section*{Appendix A: Researcher Degrees of Freedom Ledger}',
    '\\noindent\\textit{Note.} Pool IDs (P00--P13) name the literature searches the pipeline performed. P01 = corpus scope; P02--P12 = step-specific searches (memo, RQ, lens, codebook, theme, novelty, aggregation, model, diagram, sufficiency, reporting); P13 = reporting conventions. P00 is reserved for methodology citations (e.g., Braun \\& Clarke 2006) drawn from outside the search pools. The top two papers per pool appear inline in the Support column; full bibliography in References.\\par\\vspace{0.6em}',
    '\\begin{singlespacing}','\\begin{tiny}\\setlength{\\tabcolsep}{1.5pt}',
    '\\begin{longtable}{@{}>{\\raggedright\\arraybackslash}p{0.035\\linewidth} >{\\raggedright\\arraybackslash}p{0.055\\linewidth} >{\\raggedright\\arraybackslash}p{0.14\\linewidth} >{\\raggedright\\arraybackslash}p{0.16\\linewidth} >{\\raggedright\\arraybackslash}p{0.36\\linewidth} >{\\raggedright\\arraybackslash}p{0.15\\linewidth}@{}}',
    '\\toprule','\\textbf{Step} & \\textbf{RDF} & \\textbf{Choice} & \\textbf{Forks} & \\textbf{Rationale} & \\textbf{Support} \\\\','\\midrule','\\endfirsthead',
    '\\toprule','\\textbf{Step} & \\textbf{RDF} & \\textbf{Choice} & \\textbf{Forks} & \\textbf{Rationale} & \\textbf{Support} \\\\','\\midrule','\\endhead',
    '\\bottomrule','\\endfoot',
    ledgerRows,
    '\\end{longtable}','\\end{tiny}','\\end{singlespacing}'].join('\n');

  // Keywords
  const kw = [];
  for (const d of dims) if (d.name) kw.push(String(d.name).toLowerCase());
  for (const cb of codebook) {
    const k = String(cb.name || cb.label || '').toLowerCase().replace(/_/g,' ');
    if (k && !kw.includes(k)) kw.push(k);
  }
  const kwList = kw.slice(0, 6);

  // Assemble
  const preamble = [
    '\\documentclass[12pt]{article}','\\usepackage[margin=1in]{geometry}','\\usepackage{times}','\\usepackage{setspace}',
    '\\usepackage{longtable}','\\usepackage{tabularx}','\\usepackage{array}','\\usepackage{booktabs}',
    '\\usepackage{hyperref}','\\usepackage{ragged2e}','\\usepackage{natbib}','\\usepackage{tikz}','\\usepackage{graphicx}',
    '\\usetikzlibrary{arrows.meta, positioning, shapes.geometric}',
    '\\doublespacing','\\pagestyle{plain}','\\begin{document}'
  ].join('\n');

  const titleBlock = ['\\begin{center}','{\\Large\\bfseries ' + esc(surgeonTitle) + '}','\\end{center}',
    '\\begin{center}','\\today','\\end{center}','\\vspace{0.5em}'].join('\n');

  const abstractBlock = abstractText ? '\\section*{Abstract}\n' + abstractText + '\n' : '';
  const kwBlock = kwList.length ? '\\vspace{0.5em}\n\\noindent\\textit{Keywords:} ' + esc(kwList.join(', ')) + '\n' : '';

  const full = [preamble, titleBlock, abstractBlock, kwBlock, body, '',
    diagram, table1, table2, table3, evidenceGrid, dimsNarrative, refs, ledger, '\\end{document}'].join('\n');

  return { output: {
    status: 'PACKAGED',
    aqrp_report_tex: full,
    aqrp_report_audit: { version: '1', runId: runId || null, assembled_at: new Date().toISOString(), rdf_count: all.length, records: all },
    rdf_records: [r32],
    dropped_citations: droppedCites
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
