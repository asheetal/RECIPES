"use strict";
const FINAL_STEP = 3;
async function runStep({ step, filePath }) {
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
  return { output: { status: "LOADED", json_type: jsonType, top_keys: topKeys, array_key: arrayKey, n_elements: nElements, sample_keys: sampleKeys, sample_records: sampleRecords, bytes: Buffer.byteLength(raw, "utf8") } };
}
async function step2({ filePath }) {
  const fs = require("node:fs");
  const raw = fs.readFileSync(filePath, "utf8");
  let payload;
  try { payload = JSON.parse(raw); } catch (e) { throw new Error("step 2 payload is not valid JSON: " + e.message); }
  if (!Array.isArray(payload.topics)) throw new Error("Step 2: topics must be an array");
  if (!payload.P01 || typeof payload.P01 !== "object" || Array.isArray(payload.P01)) throw new Error("Step 2: P01 must be an object");
    if (typeof payload.P01.pool_id !== "string") throw new Error("Step 2: P01.pool_id required");
  return { output: Object.assign({}, payload, { status: "TOPICS_IDENTIFIED" }) };
}
async function step3({ filePath }) {
  const fs = require("node:fs");
  const raw = fs.readFileSync(filePath, "utf8");
  let payload;
  try { payload = JSON.parse(raw); } catch (e) { throw new Error("step 3 payload is not valid JSON: " + e.message); }
  if (typeof payload.coding_brief !== "object" || payload.coding_brief === null || Array.isArray(payload.coding_brief)) throw new Error("Step 3: coding_brief must be an object");
  if (!Array.isArray(payload.notes)) throw new Error("Step 3: notes must be an array");
  return { output: Object.assign({}, payload, { status: "FAMILIARIZATION_COMPLETE" }) };
}
async function readStep() { return null; }
module.exports = { runStep, readStep, FINAL_STEP };
