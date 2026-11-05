'use strict';
// ============================================================
// schema-loader.cjs — AQRP runtime boundary validation (v237)
// Loads app/aqrp-feature/schema/*.schema with ajv and validates
// the output of each pipeline step against its boundary contract.
// Also introspects master schemas to provide dynamic contracts
// for tool declarations (tool.cjs) and prompt generation (recipes/aqrp.cjs),
// ensuring a single source of truth across the pipeline.
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

function getStepPool(step) {
  init();
  const raw = state.rawSchemas[step] || readSchema(BOUNDARY[step]);
  if (!raw || !raw.properties) return null;
  for (const [k, v] of Object.entries(raw.properties)) {
    if (/^P\d{2}$/.test(k) || (v.$ref && v.$ref.includes("citation_pool"))) {
      return k;
    }
  }
  return null;
}

function getStepStatus(step) {
  init();
  const raw = state.rawSchemas[step] || readSchema(BOUNDARY[step]);
  if (raw && raw.properties && raw.properties.status && raw.properties.status.const) {
    return raw.properties.status.const;
  }
  return null;
}

const POOL_MAP = new Proxy({}, {
  get: (_, prop) => getStepPool(Number(prop))
});

const RDF_MAP = {
  3: '[R3(pool:P01), R3a(pool:P00)]',
  6: '[R6(pool:P02)]',
  8: '[R8(pool:P03)]',
  10: '[R10(pool:P04)]',
  12: '[R12(pool:P05)]',
  15: '[R15(pool:P06)]',
  19: '[R19(pool:P07)]',
  21: '[R21(pool:P08)]',
  24: '[R24(pool:P09)]',
  26: '[R26(pool:P10)]',
  28: '[R28(pool:P11)]',
  30: '[R30(pool:P12)]',
  32: '[R32(pool:P13)]'
};

const INTERNAL_FIELDS = new Set([
  'status', 'warnings', 'bytes', 'json_type',
  'aqrp_report_title', 'aqrp_report_body_tex', 'aqrp_appendices_tex', 'aqrp_report_bib', 'aqrp_report_audit',
  'within_case_matrix', 'within_case_disagreements',
  'cross_case_matrix', 'cross_case_disagreements',
  'negative_case_matrix', 'negative_case_disagreements',
  'code_matrix', 'disagreements', 'merge_candidates'
]);

const state = { ajv: null, validators: {}, rawSchemas: {}, loadErrors: {}, loadedAt: null };

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
    try {
      const raw = readSchema(file);
      state.rawSchemas[step] = raw;
      state.validators[step] = ajv.compile(raw);
    }
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

function formatTypeSignature(s, propName) {
  if (!s) return 'any';
  if (s.$ref) {
    if (s.$ref.includes('citation_pool')) return 'CitationPool';
    if (s.$ref.includes('panel_result')) return '{ panel, n, responses }';
    if (s.$ref.includes('rdf_record')) return 'RdfRecord';
    return s.$ref.replace(/^.*\/|\.schema#?$/g, '');
  }
  if (Array.isArray(s.enum)) {
    return s.enum.map(v => JSON.stringify(v)).join('|');
  }
  if (s.type === 'array') {
    if (!s.items) return 'array';
    if (s.items.$ref && s.items.$ref.includes('rdf_record')) return '[RdfRecord]';
    return `${formatTypeSignature(s.items)}[]`;
  }
  if (s.type === 'object') {
    if (s.properties) {
      const parts = Object.entries(s.properties).map(([k, v]) => `${k}:${formatTypeSignature(v, k)}`);
      return `{${parts.join(', ')}}`;
    }
    return 'object';
  }
  if (s.type === 'integer') return 'int';
  if (s.type === 'number') return 'number';
  if (s.type === 'string') return 'string';
  if (s.type === 'boolean') return 'boolean';
  return 'any';
}

function getStepContract(step) {
  step = Number(step);
  if (step === 1) return '{ file_id: string }';
  if (step === 13) return 'no payload required (auto-assembled from step 4 state)';
  if (step === 4 || step === 16 || step === 17 || step === 22) return '{ payload: { panel_result: { panel, n, responses } } }';
  if (step === 32) return `{ payload: { rdf_records: ${RDF_MAP[32]} } }`;

  init();
  const raw = state.rawSchemas[step] || readSchema(BOUNDARY[step]);
  if (!raw || !raw.properties) return '{ payload: object }';

  const props = raw.properties;
  const parts = [];

  for (const [k, s] of Object.entries(props)) {
    if (INTERNAL_FIELDS.has(k)) continue;
    if (k === 'rdf_records') {
      parts.push(`rdf_records: ${RDF_MAP[step] || '[RdfRecord]'}`);
    } else if (k === 'notes' && s.minLength && s.minLength >= 600) {
      parts.push(`notes: string (>=${s.minLength} chars)`);
    } else {
      parts.push(`${k}: ${formatTypeSignature(s, k)}`);
    }
  }

  return `{ payload: { ${parts.join(', ')} } }`;
}

function getAllContracts() {
  const contracts = {};
  for (let s = 1; s <= 32; s++) {
    contracts[s] = getStepContract(s);
  }
  return contracts;
}

function getStepInvocationSignature(step) {
  step = Number(step);
  if (step === 1) return '{step:1, file_id:"<attached file_id>"}';
  if (step === 13) return '{step:13}';
  if (step === 4 || step === 16 || step === 17 || step === 22) return `{step:${step}, payload:{panel_result}}`;
  if (step === 32) return '{step:32, payload:{rdf_records:[R32]}}';

  init();
  const raw = state.rawSchemas[step] || readSchema(BOUNDARY[step]);
  const fields = [];
  if (raw && raw.properties) {
    for (const k of Object.keys(raw.properties)) {
      if (INTERNAL_FIELDS.has(k)) continue;
      if (k === 'rdf_records') {
        const rName = step === 3 ? 'R3,R3a' : `R${step}`;
        fields.push(`rdf_records:[${rName}]`);
      } else {
        fields.push(k);
      }
    }
  }
  return `{step:${step}, payload:{${fields.join(', ')}}}`;
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


function getPanelBatchSchema(step) {
  step = Number(step);
  init();
  const boundaryFile = BOUNDARY[step];
  if (!boundaryFile) return null;
  const raw = state.rawSchemas[step] || readSchema(boundaryFile);
  if (!raw || !raw.properties) return null;
  const matrixKey = Object.keys(raw.properties).find(k => k.endsWith('_matrix'));
  if (!matrixKey || !raw.properties[matrixKey].items) return null;
  const rowSchema = raw.properties[matrixKey].items;
  const props = { ...rowSchema.properties };
  delete props.coder_id;
  const req = (rowSchema.required || []).filter(k => k !== 'coder_id');
  return {
    type: 'object',
    properties: props,
    required: req
  };
}

module.exports = {
  getPanelBatchSchema,
  getStepPool,
  getStepStatus,
  validateBoundary,
  describe,
  BOUNDARY,
  getStepContract,
  getAllContracts,
  getStepInvocationSignature
};
