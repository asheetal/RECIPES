"use strict";
const { FINAL_STEP } = require("./steps.cjs");
async function runStep({ step, filePath, expectedRecordIds }) {
  if (Number(step) === 4) return step4({ filePath, expectedRecordIds });
  if (Number(step) === 3) return step3({ filePath });
  if (Number(step) === 2) return step2({ filePath });
  if (Number(step) !== 1) throw new Error(`step ${step} not implemented yet (FINAL_STEP=${FINAL_STEP})`);
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
  const fs = require("node:fs");
  const raw = fs.readFileSync(filePath, "utf8");
  let payload;
  try { payload = JSON.parse(raw); } catch (e) { throw new Error("step 2 payload is not valid JSON: " + e.message); }
  if (!Array.isArray(payload.topics)) throw new Error("Step 2: topics must be an array");
  if (!payload.P01 || typeof payload.P01 !== "object" || Array.isArray(payload.P01)) throw new Error("Step 2: P01 must be an object");
    if (typeof payload.P01.pool_id !== "string") throw new Error("Step 2: P01.pool_id required");
    if (!Array.isArray(payload.P01.top_k)) throw new Error("Step 2: P01.top_k must be an array");
    const REQ_FIELDS = ["authors", "year", "title", "journal", "doi"];
    for (let i = 0; i < payload.P01.top_k.length; i++) {
      const k = payload.P01.top_k[i];
      const at = "Step 2: P01.top_k[" + i + "]";
      if (!k || typeof k !== "object" || Array.isArray(k)) throw new Error(at + " must be an object");
      for (const f of REQ_FIELDS) {
        if (!(f in k) || k[f] === null || k[f] === undefined || k[f] === "") throw new Error(at + " missing required field '" + f + "'");
      }
      if (!Array.isArray(k.authors) || k.authors.length === 0) throw new Error(at + ".authors must be a non-empty array");
      if (!Number.isInteger(k.year)) throw new Error(at + ".year must be an integer");
      if (typeof k.title !== "string" || !k.title.trim()) throw new Error(at + ".title must be a non-empty string");
      if (typeof k.journal !== "string" || !k.journal.trim()) throw new Error(at + ".journal must be a non-empty string");
      const doi = String(k.doi).replace(/^https?:\/\/doi\.org\//i, "");
      if (!/^10\.\d{4,9}\//.test(doi)) throw new Error(at + ".doi must be a DOI");
    }
  return { output: Object.assign({}, payload, { status: "TOPICS_IDENTIFIED" }) };
}
async function step3({ filePath }) {
  const fs = require("node:fs");
  const raw = fs.readFileSync(filePath, "utf8");
  let payload;
  try { payload = JSON.parse(raw); } catch (e) { throw new Error("step 3 payload is not valid JSON: " + e.message); }
  if (payload.rdf_record) throw new Error("Step 3: use rdf_records (array), not rdf_record (singular)");
  const cb = payload.coding_brief;
  if (!cb || typeof cb !== "object" || Array.isArray(cb)) throw new Error("Step 3: coding_brief must be an object");
  for (const f of ["code_for", "ignore", "flag"]) {
    if (!Array.isArray(cb[f])) throw new Error("Step 3: coding_brief." + f + " must be an array");
    if (cb[f].some(x => typeof x !== "string" || !x.trim())) throw new Error("Step 3: coding_brief." + f + " must contain non-empty strings");
  }
  if (cb.code_for.length === 0) throw new Error("Step 3: coding_brief.code_for must be non-empty");
  if (typeof cb.granularity !== "string" || !cb.granularity.trim()) throw new Error("Step 3: coding_brief.granularity required");
  if (typeof payload.notes !== "string") throw new Error("Step 3: notes must be a string");
  if (payload.notes.trim().length < 600) throw new Error("Step 3: notes must be at least 600 characters (a familiarization memo, not a summary)");
  const rdfs = payload.rdf_records;
  if (!Array.isArray(rdfs) || rdfs.length < 2) throw new Error("Step 3: rdf_records must be an array of at least 2 (R3 scope + R3a granularity)");
  const METHODS_NORMS = new Set(["10.1177/1094428112452151","10.1191/1478088706qp063oa","10.5465/amr.2009.0486"]);
  const norm = (d) => String(d || "").replace(/^https?:\/\/doi\.org\//i, "").trim();
  const seen = new Set();
  for (let i = 0; i < rdfs.length; i++) {
    const r = rdfs[i];
    if (!r || typeof r !== "object" || Array.isArray(r)) throw new Error("Step 3: rdf_records[" + i + "] must be an object");
    if (typeof r.rdf_id !== "string" || !r.rdf_id) throw new Error("Step 3: rdf_records[" + i + "].rdf_id required");
    if (seen.has(r.rdf_id)) throw new Error("Step 3: duplicate rdf_id " + r.rdf_id);
    seen.add(r.rdf_id);
    if (!Array.isArray(r.options) || r.options.length < 2) throw new Error("Step 3: rdf_records[" + i + "].options must be array >=2");
    if (typeof r.chosen !== "string" || !r.options.includes(r.chosen)) throw new Error("Step 3: rdf_records[" + i + "].chosen must be one of options");
    if (typeof r.rationale !== "string" || !r.rationale.trim()) throw new Error("Step 3: rdf_records[" + i + "].rationale required");
    if (!Array.isArray(r.citations_used)) throw new Error("Step 3: rdf_records[" + i + "].citations_used must be an array");
    if (r.pool_id !== "P01" && r.pool_id !== "P00") throw new Error("Step 3: rdf_records[" + i + "].pool_id must be 'P01' (topical) or 'P00' (methods)");
    const CS = ["pool_selected", "partial", "none_gut_feeling"];
    if (!CS.includes(r.citation_status)) throw new Error("Step 3: rdf_records[" + i + "].citation_status must be one of " + CS.join(","));
    if (r.citation_status === "none_gut_feeling" && (typeof r.gut_rationale !== "string" || !r.gut_rationale.trim())) throw new Error("Step 3: rdf_records[" + i + "].gut_rationale required when none_gut_feeling");
  }
  const scope = rdfs.find(r => r.rdf_id === "R3");
  if (!scope) throw new Error("Step 3: missing R3 (scope decision RDF)");
  if (scope.pool_id !== "P01") throw new Error("Step 3: R3.pool_id must be 'P01' (scope cites the topical pool)");
  const gr = rdfs.find(r => r.rdf_id === "R3a");
  if (!gr) throw new Error("Step 3: missing R3a (granularity decision RDF)");
  if (gr.pool_id !== "P00") throw new Error("Step 3: R3a.pool_id must be 'P00' (granularity cites methods pool)");
  if (gr.citation_status !== "none_gut_feeling") {
    const ok = gr.citations_used.some(d => METHODS_NORMS.has(norm(d)));
    if (!ok) throw new Error("Step 3: R3a.citations_used must include a coding-granularity norm (10.1177/1094428112452151 Gioia 2013, 10.1191/1478088706qp063oa Braun&Clarke 2006, or 10.5465/amr.2009.0486 Corley&Gioia 2011)");
  }
  return { output: Object.assign({}, payload, { status: "FAMILIARIZATION_COMPLETE" }) };
}

async function step4({ filePath, expectedRecordIds }) {
  const fs = require("node:fs");
  const raw = fs.readFileSync(filePath, "utf8");
  let payload;
  try { payload = JSON.parse(raw); } catch (e) { throw new Error("step 4 payload is not valid JSON: " + e.message); }
  const pr = payload.panel_result;
  if (!pr || typeof pr !== "object" || Array.isArray(pr)) throw new Error("Step 4: panel_result must be an object");
  if (!Number.isInteger(pr.n) || pr.n < 1) throw new Error("Step 4: panel_result.n must be a positive integer");
  if (!Array.isArray(pr.responses) || pr.responses.length !== pr.n) throw new Error("Step 4: panel_result.responses must be an array of length n");
  const cm = [];
  const byRecord = new Map();
  const seen = new Set();
  for (let i = 0; i < pr.responses.length; i++) {
    const r = pr.responses[i];
    const at = "Step 4: panel_result.responses[" + i + "]";
    if (!r || typeof r !== "object" || Array.isArray(r)) throw new Error(at + " must be an object");
    if (typeof r.coder_id !== "string" || !r.coder_id.trim()) throw new Error(at + ".coder_id required");
    if (!Array.isArray(r.rows) || r.rows.length === 0) throw new Error(at + ".rows must be a non-empty array");
    for (let j = 0; j < r.rows.length; j++) {
      const row = r.rows[j];
      const ra = at + ".rows[" + j + "]";
      if (!row || typeof row !== "object" || Array.isArray(row)) throw new Error(ra + " must be an object");
      if (typeof row.record_id !== "string" || !row.record_id.trim()) throw new Error(ra + ".record_id required");
      if (!Array.isArray(row.codes) || row.codes.length === 0) throw new Error(ra + ".codes must be a non-empty array");
      if (row.codes.some(c => typeof c !== "string" || !c.trim())) throw new Error(ra + ".codes must contain non-empty strings");
      const key = row.record_id + "|" + r.coder_id;
      if (seen.has(key)) throw new Error("Step 4: duplicate record_id/coder_id pair " + key);
      seen.add(key);
      cm.push({ record_id: row.record_id, coder_id: r.coder_id, codes: row.codes.slice() });
      if (!byRecord.has(row.record_id)) byRecord.set(row.record_id, {});
      byRecord.get(row.record_id)[r.coder_id] = row.codes.slice();
    }
  }
  const expected = Array.isArray(expectedRecordIds) ? expectedRecordIds.map(String) : [];
  if (expected.length) {
    const expectedSet = new Set(expected);
    const perCoder = new Map();
    for (const row of cm) {
      if (!expectedSet.has(String(row.record_id))) throw new Error("Step 4: coder " + row.coder_id + " coded unknown record_id " + row.record_id);
      if (!perCoder.has(row.coder_id)) perCoder.set(row.coder_id, new Set());
      perCoder.get(row.coder_id).add(String(row.record_id));
    }
    for (const [coder, set] of perCoder) {
      if (set.size !== expectedSet.size) throw new Error("Step 4: coder " + coder + " covers " + set.size + " of " + expectedSet.size + " expected records");
      for (const id of expectedSet) if (!set.has(id)) throw new Error("Step 4: coder " + coder + " is missing record_id " + id);
    }
  }
  const disagreements = [];
  for (const entry of byRecord) {
    const rid = entry[0]; const coders = entry[1];
    const sets = Object.values(coders).map(cs => JSON.stringify(cs.slice().sort()));
    const allSame = sets.every(v => v === sets[0]);
    if (!allSame) disagreements.push({ record_id: rid, coders });
  }
  return { output: { status: "OPEN_CODING_COMPLETE", code_matrix: cm, disagreements } };
}
async function readStep() { return null; }
module.exports = { runStep, readStep, FINAL_STEP };
