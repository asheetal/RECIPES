"use strict";
const FINAL_STEP = 1;
async function runStep({ step, filePath }) {
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
  return { output: { status: "LOADED", json_type: jsonType, top_keys: topKeys, array_key: arrayKey, n_elements: nElements, sample_keys: sampleKeys, bytes: Buffer.byteLength(raw, "utf8") } };
}
async function readStep() { return null; }
module.exports = { runStep, readStep, FINAL_STEP };
