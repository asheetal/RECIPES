'use strict';
const FINAL_STEP = 1;
async function runStep({ step, filePath, payload }) {
  if (Number(step) !== 1) throw new Error(`step ${step} not implemented yet (FINAL_STEP=${FINAL_STEP})`);
  const fs = require('node:fs');
  const raw = fs.readFileSync(filePath, 'utf8');
  let corpus;
  try { corpus = JSON.parse(raw); } catch (e) { throw new Error(`corpus is not valid JSON: ${e.message}`); }
  const records = Array.isArray(corpus) ? corpus : (Array.isArray(corpus.records) ? corpus.records : (Array.isArray(corpus.corpus) ? corpus.corpus : []));
  if (records.length === 0) throw new Error('corpus contains no records');
  const sample = records[0];
  return { output: { status: 'LOADED', n_records: records.length, corpus: records, sample_keys: sample && typeof sample === 'object' ? Object.keys(sample) : [] } };
}
async function readStep({ runId, step }) { return null; }
module.exports = { runStep, readStep, FINAL_STEP };
