'use strict';
// ============================================================
// schema-loader.cjs - Triage-chain runtime boundary validation
// Loads app/admin-tools/schema/*.schema with ajv and validates
// the output of each boundary against its declared contract.
// Mirrors app/aqrp-feature/schema-loader.cjs (v237).
// Violation of any schema is a programming/integration bug.
// ============================================================
const fs = require('node:fs');
const path = require('node:path');
const Ajv = require('ajv');

const SCHEMA_DIR = path.join(__dirname, 'schema');

const BOUNDARY = {
  user_in: 'user_in.schema',
  triage_out: 'triage_out.schema',
  surgery_in: 'surgery_in.schema',
  surgery_tool_call: 'surgery_tool_call.schema',
  surgery_tool_result: 'surgery_tool_result.schema',
  surgery_out: 'surgery_out.schema',
  handoff: 'handoff.schema',
  opd_in: 'opd_in.schema',
  opd_out: 'opd_out.schema',
  snowball_in: 'snowball_in.schema',
  snowball_out: 'snowball_out.schema'
};

const SHARED = [
  '_shared/message.schema',
  '_shared/file_record.schema',
  '_shared/tool_record.schema'
];

const state = { ajv: null, validators: {}, rawSchemas: {}, loadErrors: {}, loadedAt: null };

function readSchema(rel) {
  return JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, rel), 'utf8'));
}

function init() {
  if (state.ajv) return;
  const ajv = new Ajv({ allErrors: true, strict: false, coerceTypes: false });
  for (const rel of SHARED) {
    try { ajv.addSchema(readSchema(rel)); }
    catch (e) { console.error('[schema-loader] shared ' + rel + ' failed: ' + e.message); }
  }
  state.ajv = ajv;
  state.loadedAt = new Date().toISOString();
  for (const [name, file] of Object.entries(BOUNDARY)) {
    try {
      const raw = readSchema(file);
      state.rawSchemas[name] = raw;
      state.validators[name] = ajv.compile(raw);
    } catch (e) {
      state.loadErrors[name] = e;
      console.error('[schema-loader] ' + name + ': cannot compile ' + file + ': ' + e.message);
    }
  }
}

function validateBoundary(name, output) {
  init();
  if (!BOUNDARY[name]) throw new Error('schema-loader: unknown boundary ' + name);
  if (state.loadErrors[name]) throw new Error(BOUNDARY[name] + ' failed to load: ' + state.loadErrors[name].message);
  const v = state.validators[name];
  if (!v) throw new Error('schema-loader: no validator for ' + name);
  if (!v(output)) {
    const details = (v.errors || []).slice(0, 5)
      .map(e => (e.instancePath || '/') + ' ' + e.message).join('; ');
    const err = new Error(BOUNDARY[name] + ': ' + details);
    err.boundary = name;
    err.errors = v.errors;
    throw err;
  }
  return output;
}

function describe() {
  init();
  return {
    loadedAt: state.loadedAt,
    boundaries: Object.keys(state.validators).length,
    expected: Object.keys(BOUNDARY).length,
    loadErrors: Object.keys(state.loadErrors)
  };
}

module.exports = { BOUNDARY, validateBoundary, describe };
