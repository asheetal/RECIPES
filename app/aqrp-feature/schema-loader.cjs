'use strict';
// ============================================================
// schema-loader.cjs — AQRP runtime boundary validation (v237)
// Loads app/aqrp-feature/schema/*.schema with ajv and validates
// the output of each pipeline step against its boundary contract.
// A violation throws; pipeline.runStep lets it propagate; the
// surgeon sees the error and routes to OPD.
// ============================================================
const fs = require('node:fs');
const path = require('node:path');

const SCHEMA_DIR = path.join(__dirname, 'schema');

const BOUNDARY = {
  1:'step1_2.schema', 2:'step2_3.schema', 3:'step3_4.schema', 4:'step4_5.schema',
  5:'step5_6.schema', 6:'step6_7.schema', 7:'step7_8.schema', 8:'step8_9.schema',
  9:'step9_10.schema', 10:'step10_11.schema', 11:'step11_12.schema', 12:'step12_13.schema',
  13:'step13_14.schema', 14:'step14_15.schema', 15:'step15_16.schema', 16:'step16_17.schema',
  17:'step17_18.schema', 18:'step18_19.schema', 19:'step19_20.schema', 20:'step20_21.schema',
  21:'step21_22.schema', 22:'step22_23.schema', 23:'step23_24.schema', 24:'step24_25.schema',
  25:'step25_26.schema', 26:'step26_27.schema', 27:'step27_28.schema', 28:'step28_29.schema',
  29:'step29_30.schema', 30:'step30_31.schema', 31:'step31_32.schema', 32:'step32_out.schema'
};

const SHARED = [
  '_shared/citation_record.schema',
  '_shared/citation_pool.schema',
  '_shared/rdf_record.schema',
  '_shared/panel_result.schema',
  '_shared/warning.schema'
];

const state = { ajv: null, validators: {}, loadErrors: {}, loadedAt: null };

function readSchema(rel) {
  return JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, rel), 'utf8'));
}

function init() {
  if (state.ajv) return;
  const Ajv = require('ajv');
  let addFormats = null;
  try { addFormats = require('ajv-formats'); } catch (_) {}
  const ajv = new Ajv({ allErrors: true, strict: false, coerceTypes: false });
  if (addFormats) addFormats(ajv);

  for (const rel of SHARED) {
    try { ajv.addSchema(readSchema(rel)); }
    catch (e) { console.error('[schema-loader] shared ' + rel + ' failed: ' + e.message); }
  }

  state.ajv = ajv;
  state.loadedAt = new Date().toISOString();

  for (const [k, file] of Object.entries(BOUNDARY)) {
    const step = Number(k);
    try { state.validators[step] = ajv.compile(readSchema(file)); }
    catch (e) {
      state.loadErrors[step] = e;
      console.error('[schema-loader] step ' + step + ': cannot compile ' + file + ': ' + e.message);
    }
  }
}

function validateBoundary(afterStep, output) {
  if (process.env.AQ_DISABLE_SCHEMA_VALIDATION === '1') return;
  init();
  const step = Number(afterStep);
  if (!Number.isInteger(step) || step < 1 || step > 32) {
    throw new Error('schema-loader: invalid step ' + afterStep);
  }
  if (state.loadErrors[step]) {
    throw new Error(BOUNDARY[step] + ' failed to load: ' + state.loadErrors[step].message);
  }
  const v = state.validators[step];
  if (!v) throw new Error('schema-loader: no validator for step ' + step);
  if (!v(output)) {
    const details = (v.errors || []).slice(0, 5)
      .map(e => (e.instancePath || '/') + ' ' + e.message).join('; ');
    const err = new Error(BOUNDARY[step] + ': ' + details);
    err.step = step; err.boundary = BOUNDARY[step]; err.errors = v.errors;
    throw err;
  }
}

function describe() {
  init();
  return {
    loadedAt: state.loadedAt,
    boundaries: Object.keys(state.validators).length,
    expected: 32,
    loadErrors: Object.keys(state.loadErrors).map(Number)
  };
}

module.exports = { validateBoundary, describe, BOUNDARY };
