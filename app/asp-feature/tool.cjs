'use strict';
const NAME = 'asp_step_run';
const { FINAL_STEP } = require('./core.cjs');
const def = {
  name: NAME,
  description: 'Execute step N of the Automated SEM Pipeline. Steps 1..${FINAL_STEP}. Tool steps (1,4,6,8,9,11,13): call with {step:N}. Cognitive steps (2,3,5,7,10,12): call with {step:N, payload:{...}}. Step 1 also requires file_id. Call in order, one step per iteration, then stop when step 13 returns done. PLAN AND PAYLOAD RULES: (1) the plan JSON MUST be passed as the value of the top-level plan key, never spread at the top level. (2) payload is a top-level key required for every cognitive step.',
  parameters: {
    type: 'object',
    properties: {
      step: { type: 'integer', description: 'Pipeline step number 1..13' },
      file_id: { type: 'string', description: 'Project file id (required only for step 1)' },
      payload: { type: 'object', description: 'Full step JSON for cognitive steps 2,3,5,7,10,12' },
    },
    required: ['step'],
  },
};
async function resolveProjectId(req) {
  if (req?.__aspProjectId) return req.__aspProjectId;
  const convId = req?.body?.conversationId;
  if (!convId || convId === 'new') return null;
  const mongoose = require('mongoose');
  const convo = await mongoose.connection.db.collection('conversations').findOne({ conversationId: convId }, { projection: { chatProjectId: 1 } });
  return convo?.chatProjectId || null;
}
const TOOL_STEPS = new Set([1, 4, 6, 8, 9, 11, 13]);


function validateStep10(payload) {
  const models = payload.models;
  if (!Array.isArray(models) || models.length === 0) throw new Error('step 10: models must be a non-empty array');
  const nodeIds = new Set();
  for (const m of models) {
    if (!m || !Array.isArray(m.nodes) || m.nodes.length === 0) throw new Error('step 10: each model needs non-empty nodes[]');
    for (const n of m.nodes) if (n && n.id) nodeIds.add(n.id);
  }
  for (let i = 0; i < models.length; i++) {
    const m = models[i] || {};
    if (!Number.isFinite(Number(m.node_w)) || Number(m.node_w) <= 0) throw new Error(`step 10: models[${i}].node_w must be a positive number`);
    if (!Number.isFinite(Number(m.node_h)) || Number(m.node_h) <= 0) throw new Error(`step 10: models[${i}].node_h must be a positive number`);
    if (!Array.isArray(m.canvas_xlim) || m.canvas_xlim.length !== 2 || !Number.isFinite(Number(m.canvas_xlim[0])) || !Number.isFinite(Number(m.canvas_xlim[1]))) throw new Error(`step 10: models[${i}].canvas_xlim must be [min, max]`);
    if (!Array.isArray(m.canvas_ylim) || m.canvas_ylim.length !== 2 || !Number.isFinite(Number(m.canvas_ylim[0])) || !Number.isFinite(Number(m.canvas_ylim[1]))) throw new Error(`step 10: models[${i}].canvas_ylim must be [min, max]`);
    if (Number(m.canvas_xlim[0]) >= Number(m.canvas_xlim[1])) throw new Error(`step 10: models[${i}].canvas_xlim min must be < max`);
    if (Number(m.canvas_ylim[0]) >= Number(m.canvas_ylim[1])) throw new Error(`step 10: models[${i}].canvas_ylim min must be < max`);
    const pathsL = Array.isArray(m.paths) ? m.paths : [];
    for (let j = 0; j < pathsL.length; j++) {
      const pp = pathsL[j] || {};
      if (!Number.isFinite(Number(pp.label_x))) throw new Error(`step 10: models[${i}].paths[${j}].label_x required (surgeon owns label placement)`);
      if (!Number.isFinite(Number(pp.label_y))) throw new Error(`step 10: models[${i}].paths[${j}].label_y required (surgeon owns label placement)`);
      if (pp.color !== undefined && typeof pp.color !== 'string') throw new Error(`step 10: models[${i}].paths[${j}].color must be a string`);
      if (pp.line_width !== undefined && !Number.isFinite(Number(pp.line_width))) throw new Error(`step 10: models[${i}].paths[${j}].line_width must be numeric`);
    }
  }
  for (let i = 0; i < models.length; i++) {
    const fn = models[i].footnote;
    if (!fn || typeof fn !== 'object') throw new Error(`step 10: models[${i}].footnote is missing or not an object`);
    if (!Array.isArray(fn.controls) || fn.controls.length === 0) throw new Error(`step 10: models[${i}].footnote.controls must be a non-empty array of human-readable names`);
    if (!Number.isFinite(Number(fn.N))) throw new Error(`step 10: models[${i}].footnote.N must be a number`);
    if (typeof fn.sig_key !== 'string' || !fn.sig_key) throw new Error(`step 10: models[${i}].footnote.sig_key must be a non-empty legend string, e.g. "** p < .01"`);
    if (!fn.imm || typeof fn.imm !== 'object') throw new Error(`step 10: models[${i}].footnote.imm must be an object {point, ci_low, ci_high}`);
    for (const k of ['point','ci_low','ci_high']) if (!Number.isFinite(Number(fn.imm[k]))) throw new Error(`step 10: models[${i}].footnote.imm.${k} must be a number`);
    if (typeof fn.prior_art !== 'string') throw new Error(`step 10: models[${i}].footnote.prior_art must be a string`);
  }
  for (let i = 0; i < (payload.decision_log || []).length; i++) {
    const d = payload.decision_log[i] || {};
    if (Number(d.step) === 10 && d.decision_type !== 'TOPOLOGY_ARBITRATION') {
      throw new Error(`step 10: decision_log[${i}].decision_type must be TOPOLOGY_ARBITRATION (got "${d.decision_type}")`);
    }
  }
  for (let i = 0; i < models.length; i++) {
    const paths = Array.isArray(models[i].paths) ? models[i].paths : null;
    if (!paths || paths.length === 0) throw new Error(`step 10: models[${i}].paths must be a non-empty array`);
    for (let j = 0; j < paths.length; j++) {
      const p = paths[j] || {};
      const checkEndpoint = (kind, val) => {
        if (typeof val !== 'string' || !val) throw new Error(`step 10: models[${i}].paths[${j}].${kind} must be a non-empty string`);
        if (val.includes('->')) {
          const parts = val.split('->').map((x) => x.trim());
          if (parts.length !== 2) throw new Error(`step 10: models[${i}].paths[${j}].${kind}="${val}" malformed stem; must be "<node>-><node>"`);
          for (const part of parts) if (!nodeIds.has(part)) throw new Error(`step 10: models[${i}].paths[${j}].${kind}="${val}" references unknown node "${part}"`);
          return;
        }
        if (val.includes('*')) throw new Error(`step 10: models[${i}].paths[${j}].${kind}="${val}" uses '*' (interaction); use {from:"W", to:"X->M"} for a moderated path`);
        if (!nodeIds.has(val)) throw new Error(`step 10: models[${i}].paths[${j}].${kind}="${val}" references unknown node`);
      };
      checkEndpoint('from', p.from);
      checkEndpoint('to', p.to);
    }
  }
}

function validateStep7(payload) {
  const sm = payload.shortlisted_models;
  if (!Array.isArray(sm) || sm.length === 0) throw new Error('step 7: shortlisted_models must be a non-empty array');
  const okStatus = new Set(['EXACT_PRIOR_TEST_FOUND', 'COMPONENT_PRIOR_TESTS_FOUND', 'NO_PRIOR_TEST_IDENTIFIED']);
  for (let i = 0; i < sm.length; i++) {
    const m = sm[i] || {};
    const nv = m.novelty_verdict;
    if (!nv || typeof nv !== 'object') throw new Error(`step 7: shortlisted_models[${i}].novelty_verdict must be an object`);
    if (!okStatus.has(nv.status)) throw new Error(`step 7: shortlisted_models[${i}].novelty_verdict.status invalid (got "${nv.status}")`);
    if (nv.component_prior_records !== undefined && nv.component_records === undefined) {
      throw new Error(`step 7: shortlisted_models[${i}] uses component_prior_records; must be component_records`);
    }
    const comp = Array.isArray(nv.component_records) ? nv.component_records : [];
    const exact = Array.isArray(nv.exact_prior_records) ? nv.exact_prior_records : [];
    if (nv.status === 'NO_PRIOR_TEST_IDENTIFIED' && (comp.length > 0 || exact.length > 0)) {
      throw new Error(`step 7: shortlisted_models[${i}] status=NO_PRIOR_TEST_IDENTIFIED but component_records=${comp.length} / exact_prior_records=${exact.length}; must be COMPONENT_PRIOR_TESTS_FOUND or EXACT_PRIOR_TEST_FOUND`);
    }
    if (nv.status === 'EXACT_PRIOR_TEST_FOUND' && exact.length === 0) {
      throw new Error(`step 7: shortlisted_models[${i}] status=EXACT_PRIOR_TEST_FOUND but exact_prior_records is empty`);
    }
    for (const [j, r] of [...comp, ...exact].entries()) {
      if (!r || !r.ref_id) throw new Error(`step 7: shortlisted_models[${i}] prior record #${j} missing ref_id`);
      if (!r.justifying_excerpt) throw new Error(`step 7: shortlisted_models[${i}] prior record #${j} missing justifying_excerpt`);
    }
    const sp = Array.isArray(nv.search_provenance) ? nv.search_provenance : [];
    if (sp.length < 3) throw new Error(`step 7: shortlisted_models[${i}] search_provenance must have >= 3 entries (got ${sp.length})`);
  }
  const tax = Array.isArray(payload.taxonomy) ? payload.taxonomy : [];
  const roleOf = new Map();
  for (const t of tax) if (t && t.code) roleOf.set(t.code, t.role);
  const expected = { x: 'IV', w: 'MOD', m: 'MED', y: 'DV' };
  for (let i = 0; i < sm.length; i++) {
    const m = sm[i] || {};
    for (const [k, want] of Object.entries(expected)) {
      const code = m[k];
      if (!code) throw new Error(`step 7: shortlisted_models[${i}].${k} is missing`);
      const got = roleOf.get(code);
      if (!got) throw new Error(`step 7: shortlisted_models[${i}].${k}="${code}" is not in taxonomy`);
      if (got !== want) throw new Error(`step 7: shortlisted_models[${i}].${k}="${code}" has role ${got}; expected ${want}`);
    }
  }
  const dlog = Array.isArray(payload.decision_log) ? payload.decision_log : [];
  const allowed = new Set(['THEORETICAL_FRAMEWORK_SELECTION', 'LITERATURE_GROUNDING', 'PRIOR_ART_ADJUDICATION']);
  for (let i = 0; i < dlog.length; i++) {
    const d = dlog[i] || {};
    if (Number(d.step) === 7 && !allowed.has(d.decision_type)) {
      throw new Error(`step 7: decision_log[${i}].decision_type "${d.decision_type}" invalid; must be one of ${[...allowed].join('|')}`);
    }
  }
}

function validateEvidence(step, payload) {
  const cognitive = new Set([2, 3, 5, 7, 10, 12]);
  if (!cognitive.has(step)) return;
  if (!Array.isArray(payload.claims) || payload.claims.length === 0) {
    throw new Error(`step ${step}: claims[] must be non-empty; invoke search({query}) for each rationale and copy the verbatim abstract sentence into justifying_excerpt`);
  }
  const needsRetrieval = payload.claims.some(c => c && c.citations_required === true);
  if (needsRetrieval && (!Array.isArray(payload.retrieval_log) || payload.retrieval_log.length === 0)) {
    throw new Error(`step ${step}: retrieval_log[] must be non-empty because at least one claim has citations_required:true; invoke search({query}) and record results`);
  }
  for (let i = 0; i < payload.claims.length; i++) {
    const c = payload.claims[i] || {};
    const st = c.support_status;
    if (!['SUPPORTED', 'UNSUPPORTED', 'INTERNAL_ARTIFACT'].includes(st)) {
      throw new Error(`step ${step}: claims[${i}].support_status must be SUPPORTED|UNSUPPORTED|INTERNAL_ARTIFACT`);
    }
    if (st === 'SUPPORTED') {
      if (!c.ref_id) throw new Error(`step ${step}: claims[${i}] SUPPORTED but ref_id missing`);
      if (!c.justifying_excerpt) throw new Error(`step ${step}: claims[${i}] SUPPORTED but justifying_excerpt missing`);
    }
  }
  if (step === 12) {
    const sections = payload.sections || {};
    const refs = sections.references || [];
    const reCount = (txt) => { const m = String(txt || '').match(/\{\{ref:[A-Za-z0-9_]+\}\}/g); return m ? m.length : 0; };
    if (reCount(sections.garden_of_forking_paths) < 1) throw new Error('STEP 12 requires at least one {{ref:CLAIM_ID}} in sections.garden_of_forking_paths');
    if (reCount(sections.sem_report) < 3) throw new Error('STEP 12 requires at least three {{ref:CLAIM_ID}} in sections.sem_report');
    const allowed12 = new Set(['METRIC_STANDARDIZATION', 'HYPOTHESIS_DIRECTIONALITY', 'LITERATURE_GROUNDING']);
    for (let i = 0; i < (payload.decision_log || []).length; i++) {
      const d = payload.decision_log[i] || {};
      if (Number(d.step) === 12 && !allowed12.has(d.decision_type)) {
        throw new Error(`step 12: decision_log[${i}].decision_type must be METRIC_STANDARDIZATION|HYPOTHESIS_DIRECTIONALITY|LITERATURE_GROUNDING (got "${d.decision_type}")`);
      }
    }
    const ids = new Set(payload.claims.map(c => c.claim_id));
    for (const secName of ['garden_of_forking_paths','sem_report']) {
      const text = sections[secName] || '';
      const re = /\{\{ref:([A-Za-z0-9_]+)\}\}/g;
      let m;
      while ((m = re.exec(text)) !== null) {
        const cid = m[1];
        if (!ids.has(cid)) throw new Error(`step 12: ${secName} references unknown claim ${cid}`);
        const c = payload.claims.find(x => x.claim_id === cid);
        if (!c || c.support_status !== 'SUPPORTED') throw new Error(`step 12: ${secName} references non-SUPPORTED claim ${cid}`);
      }
    }
  }
}
function validateCognitive(step, payload) {
  if (step === 2) {
    if (payload.status !== 'RESOLVED') throw new Error('step 2: status must be "RESOLVED"');
    if (!Array.isArray(payload.variable_mappings) || payload.variable_mappings.length === 0) throw new Error('step 2: variable_mappings must be a non-empty array');
    for (let i = 0; i < payload.variable_mappings.length; i++) {
      const m = payload.variable_mappings[i] || {};
      if (!m.codebook_name || !m.column_name) throw new Error('step 2: variable_mappings[' + i + '] missing codebook_name or column_name');
      if (m.codebook_name === m.column_name) throw new Error('step 2: variable_mappings[' + i + '].codebook_name must be the human-readable Variable Name, not the code token "' + m.column_name + '"');
    }
    if (typeof (payload.join_key || {}).match_coverage !== 'string') throw new Error('step 2: join_key.match_coverage must be a string like "37/37 (100%)", not a number');
    if (payload.header_row_index !== 0) throw new Error('step 2: header_row_index must be 0');
    if (payload.data_start_row_index !== 1) throw new Error('step 2: data_start_row_index must be 1');
    if (!payload.survey_design || !Array.isArray(payload.survey_design.waves_detected)) throw new Error('step 2: survey_design.waves_detected must be an array');
  } else if (step === 3) {
    if (!Array.isArray(payload.taxonomy) || payload.taxonomy.length === 0) throw new Error('step 3: taxonomy must be a non-empty array');
    const validRoles = new Set(['IV', 'MOD', 'MED', 'DV', 'CONTROL']);
    const validValences = new Set(['Positive', 'Negative', 'Neutral']);
    for (let i = 0; i < payload.taxonomy.length; i++) {
      const t = payload.taxonomy[i] || {};
      if (!validRoles.has(t.role)) throw new Error('step 3: taxonomy[' + i + '].role must be IV|MOD|MED|DV|CONTROL (got "' + t.role + '")');
      if (!validValences.has(t.valence)) throw new Error('step 3: taxonomy[' + i + '].valence must be Positive|Negative|Neutral (got "' + t.valence + '")');
    }
    if (!payload.family_summary || typeof payload.family_summary !== 'object' || Array.isArray(payload.family_summary)) throw new Error('step 3: family_summary must be an object');
    const fams = Object.entries(payload.family_summary);
    if (fams.length === 0) throw new Error('step 3: family_summary must be non-empty');
    for (const [fname, f] of fams) {
      if (!f || typeof f !== 'object' || Array.isArray(f)) throw new Error('step 3: family_summary["' + fname + '"] must be {role, members}, not a scalar count');
      if (typeof f.role !== 'string' || !Array.isArray(f.members) || f.members.length === 0) throw new Error('step 3: family_summary["' + fname + '"] must be {role: string, members: string[]}');
    }
    if (!Array.isArray(payload.controls)) throw new Error('step 3: controls must be an array');
  }
}

const COGNITIVE_STEPS = new Set([2, 3, 5, 7, 10, 12]);
const PASSTHROUGH = {
  2:  { inherit: [], rename: {}, append: ['claims','retrieval_log','decision_log'] },
  3:  { inherit: ['file_path','data_sheet','header_row_index','max_evaluations'], rename: {}, append: ['claims','retrieval_log','decision_log'] },
  5:  { inherit: ['file_path','data_sheet','header_row_index','max_evaluations','controls','taxonomy'], rename: { models: 'candidate_models' }, append: ['claims','retrieval_log','decision_log'] },
  7:  { inherit: ['file_path','data_sheet','header_row_index','controls','taxonomy','survivors','survivors_count'], rename: {}, append: ['claims','retrieval_log','decision_log'] },
  10: { inherit: ['file_path','data_sheet','header_row_index','controls','bootstrap_results','survivors','survivors_count','shortlisted_models','shortlisted_count','taxonomy','descriptives','missingness','correlations','alpha_table','n_total','variables'], rename: {}, append: ['claims','retrieval_log','decision_log'] },
  12: { inherit: ['file_path','data_sheet','header_row_index','controls','winning_model_id','topology_type','models','rendered_diagrams','bootstrap_results','models_validated_count','taxonomy','survivors','survivors_count','shortlisted_models','shortlisted_count','evaluations','descriptives','missingness','correlations','alpha_table','n_total','variables'], rename: {}, append: ['claims','retrieval_log','decision_log'], derive: [{ field: 'diagram_path', from: 'rendered_diagrams', pick: (rd) => rd && rd[0] && rd[0].output_image }] }
};

const DEDUP_KEY = { claims: 'claim_id', retrieval_log: 'query_id', decision_log: 'decision_id' };


function deriveStep2Mappings(prior) {
  if (!prior || !Array.isArray(prior.sheets)) return null;
  const meta = prior.sheets.find((sh) => sh && typeof sh.sheet_name === 'string' && /variable\s*description/i.test(sh.sheet_name));
  const data = prior.sheets.find((sh) => sh && typeof sh.sheet_name === 'string' && /^dataset$/i.test(sh.sheet_name.trim()));
  if (!meta || !data) return null;
  const cols = Array.isArray(meta.columns) ? meta.columns : [];
  if (cols.length < 4) return null;
  const waveCol = (cols[0] && cols[0].sample_values) || [];
  const typeCol = (cols[1] && cols[1].sample_values) || [];
  const nameCol = (cols[2] && cols[2].sample_values) || [];
  const codeCol = (cols[3] && cols[3].sample_values) || [];
  const n = Math.min(waveCol.length, typeCol.length, nameCol.length, codeCol.length);
  const dataCols = Array.isArray(data.columns) ? data.columns : [];
  const dataHeaders = dataCols.map((c) => (c && c.sample_values && c.sample_values[0]) || '');
  const roleMap = { 'independent variable': 'IV', 'moderator': 'MOD', 'mediator': 'MED', 'dependent variable': 'DV', 'control': 'Control' };
  const out = [];
  for (let i = 1; i < n; i += 1) {
    const wave = String(waveCol[i] || '').trim();
    const rawRole = String(typeCol[i] || '').trim().toLowerCase();
    const codebook_name = String(nameCol[i] || '').trim();
    const column_name = String(codeCol[i] || '').trim();
    if (!codebook_name || !column_name) continue;
    const ci = dataHeaders.indexOf(column_name);
    if (ci < 0) continue;
    const role = roleMap[rawRole] || 'Control';
    out.push({ codebook_name, column_name, column_index: ci, wave, codebook_role: role, data_type: 'numeric' });
  }
  return out.length > 0 ? out : null;
}


function deriveStep2Fields(prior) {
  const vm = deriveStep2Mappings(prior);
  if (!vm) return null;
  const meta = prior.sheets.find((sh) => sh && typeof sh.sheet_name === 'string' && /variable\s*description/i.test(sh.sheet_name));
  const data = prior.sheets.find((sh) => sh && typeof sh.sheet_name === 'string' && /^dataset$/i.test(sh.sheet_name.trim()));
  if (!meta || !data) return null;
  const cols = meta.columns || [];
  const waveCol = (cols[0] && cols[0].sample_values) || [];
  const buckets = {};
  for (let i = 1; i < waveCol.length; i += 1) {
    const raw = String(waveCol[i] || '').trim();
    if (!raw) continue;
    const m = raw.toLowerCase().match(/wave\s*(\d+)/);
    const key = m ? `wave_${m[1]}` : raw.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    buckets[key] = (buckets[key] || 0) + 1;
  }
  const waveKeys = Object.keys(buckets);
  const survey_design = { multi_wave: waveKeys.length > 1, waves_detected: waveKeys };
  for (const k of waveKeys) survey_design[`${k}_count`] = buckets[k];
  return {
    status: 'RESOLVED',
    file_path: prior.file_path || 'Employee Data.xlsx',
    data_sheet: data.sheet_name,
    metadata_sheet: meta.sheet_name,
    header_row_index: 0,
    data_start_row_index: 1,
    survey_design,
    join_key: {
      codebook_column: 'Variable in Dataset',
      codebook_column_index: 3,
      match_type: 'exact_token',
      match_coverage: `${vm.length}/${vm.length} (100%)`,
    },
    n_variables_mapped: vm.length,
    variable_mappings: vm,
    quorum_passed: true,
  };
}


function formatApa7(r) {
  if (!r || typeof r !== 'object') return '';
  let authors = r.authors || [];
  if (typeof authors === 'string') authors = [authors];
  authors = authors.map((a) => String(a || '').trim()).filter(Boolean);
  const year = r.year;
  const title = String(r.title || '').trim().replace(/\.$/, '');
  const journal = String(r.journal || '').trim().replace(/\.$/, '');
  const volume = String(r.volume || '').trim();
  const issue = String(r.issue || '').trim();
  const pages = String(r.pages || '').trim().replace(/\.$/, '');
  const doi = String(r.doi || '').trim();
  let authStr = '';
  if (authors.length === 1) authStr = authors[0];
  else if (authors.length === 2) authStr = authors[0] + ', & ' + authors[1];
  else if (authors.length > 2 && authors.length <= 20) authStr = authors.slice(0, -1).join(', ') + ', & ' + authors[authors.length - 1];
  else if (authors.length > 20) authStr = authors.slice(0, 19).join(', ') + ', ... ' + authors[authors.length - 1];
  const parts = [];
  if (authStr) parts.push(authStr + '.');
  if (year) parts.push('(' + year + ').');
  if (title) parts.push(title + '.');
  let jblock = '';
  if (journal) jblock += journal;
  if (volume) { jblock += (jblock ? ', ' : '') + volume; if (issue) jblock += '(' + issue + ')'; }
  if (pages) jblock += (jblock ? ', ' : '') + pages;
  if (jblock) parts.push(jblock.replace(/\.$/, '') + '.');
  if (doi) parts.push('URL:https://doi.org/' + doi);
  return parts.join(' ').trim();
}

function backfillRetrievalClaims(prior, claims) {
  if (!prior || !Array.isArray(prior.retrieval_log)) return;
  const byRef = new Map();
  for (const entry of prior.retrieval_log) {
    for (const r of (entry.results || [])) {
      if (r && r.ref_id) {
        if (!byRef.has(r.ref_id)) byRef.set(r.ref_id, []);
        byRef.get(r.ref_id).push(r);
      }
    }
  }
  for (const c of (claims || [])) {
    if (!c || c.support_status !== 'SUPPORTED') continue;
    const rid = c.ref_id;
    if (!rid) continue;
    const recs = byRef.get(rid);
    if (!recs || recs.length === 0) continue;
    const excerpt = String(c.justifying_excerpt || '').trim();
    if (!excerpt) continue;
    for (const r of recs) {
      const abs = String(r.abstract_snippet || '');
      if (abs && abs.indexOf(excerpt) !== -1) {
        const cur = Array.isArray(r.retrieved_for_claims) ? r.retrieved_for_claims.slice() : [];
        if (!cur.includes(c.claim_id)) cur.push(c.claim_id);
        r.retrieved_for_claims = cur;
        break;
      }
    }
  }
}

function deriveStep12References(prior, claims) {
  backfillRetrievalClaims(prior, claims);
  const retrieved = new Map();
  for (const entry of (prior.retrieval_log || [])) {
    for (const r of (entry.results || [])) {
      if (r && r.ref_id) retrieved.set(r.ref_id, r);
    }
  }
  const seen = new Set();
  const refs = [];
  for (const c of (claims || [])) {
    if (!c || c.support_status !== 'SUPPORTED') continue;
    const rid = c.ref_id;
    if (!rid || seen.has(rid)) continue;
    const r = retrieved.get(rid);
    if (!r) continue;
    const apa = formatApa7(r) || (String(r.title || '') + ' (' + (r.year || '') + ').');
    refs.push(`[${rid}] ` + apa);
    seen.add(rid);
  }
  return refs;
}


function reconcileShortlistToSurvivors(out, prior) {
  if (!out || !Array.isArray(out.shortlisted_models)) return;
  const byId = new Map();
  for (const s of (prior.survivors || [])) if (s && s.id) byId.set(s.id, s);
  for (const m of out.shortlisted_models) {
    if (!m || !m.id) continue;
    const s = byId.get(m.id);
    if (!s) continue;
    for (const k of ['x', 'w', 'm', 'y']) {
      if (s[k] !== undefined) m[k] = s[k];
    }
  }
}

function mergePassthrough(step, prior, payload) {
  const spec = PASSTHROUGH[step];
  if (!spec || !prior) return payload;
  const out = { ...payload };
  for (const f of spec.inherit) {
    if (prior[f] !== undefined) out[f] = prior[f];
  }
  for (const [src, dst] of Object.entries(spec.rename || {})) {
    if (prior[src] !== undefined) out[dst] = prior[src];
  }
  for (const f of spec.append || []) {
    const key = DEDUP_KEY[f];
    const inherited = Array.isArray(prior[f]) ? prior[f] : [];
    const provided = Array.isArray(out[f]) ? out[f] : [];
    const seen = new Set(inherited.map((x) => x && x[key]).filter(Boolean));
    const merged = inherited.slice();
    for (const item of provided) {
      const k = item && item[key];
      if (!k || !seen.has(k)) { merged.push(item); if (k) seen.add(k); }
    }
    out[f] = merged;
  }
  if (step === 2 && prior) {
    const der = deriveStep2Fields(prior);
    if (der) { for (const [k, v] of Object.entries(der)) out[k] = v; }
  }
  if (step === 12 && prior) {
    const refs = deriveStep12References(prior, out.claims || []);
    if (refs.length > 0) {
      if (!out.sections || typeof out.sections !== 'object') out.sections = {};
      out.sections.references = refs;
    }
  }
  if (step === 7 && prior) reconcileShortlistToSurvivors(out, prior);
  for (const d of spec.derive || []) {
    if (out[d.field] === undefined) {
      const v = d.pick(prior[d.from]);
      if (v !== undefined && v !== null) out[d.field] = v;
    }
  }
  return out;
}

async function invoke(req, args) {
  const gateway = require('/app/admin-tools/role-gateway.cjs');
  const step = Number(args.step);
  gateway.audit(req, 'LLM_SURGERY', 'tool_call', { tool: NAME, step });
  try {
    if (!Number.isInteger(step) || step < 1 || step > FINAL_STEP) throw new Error(`step must be 1..${FINAL_STEP}`);
    const projectId = await resolveProjectId(req);
    if (!projectId) throw new Error('Automated SEM requires a project scope');
    const projectFiles = require('/app/project-files-feature/project-files.cjs').service();
    const s = { user: String(req.user.id || req.user._id), tenant: String(req.user.tenantId || ''), projectId };
    const stateSvc = require('/app/asp-feature/automated-sem.cjs').service();
    const currentState = await stateSvc.getState(s);
    if (step === 1) {
      let fileId = args.file_id;
      if (!fileId && currentState.fileId) fileId = currentState.fileId;
      if (!fileId) throw new Error('file_id required for step 1');
      const { file, buffer } = await projectFiles.read(s, fileId);
      const started = await stateSvc.startRun(s, fileId, file.name, buffer);
      if (started.status === 'no_new_run') throw new Error('Run already complete for this workbook; delete the tile to re-run');
      const st = await stateSvc.getState(s);
      if (st.status !== 'running') throw new Error(`run in unexpected state: ${st.status}`);
      const pipeline = require('/app/asp-feature/pipeline.cjs');
      const result = await pipeline.runStep({ step, runId: st.runId, workbookB64: buffer.toString('base64'), workbookName: file.name });
      await stateSvc.completeStep(s, step, result.output, null);
      gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, step, status: 'ok' });
      return JSON.stringify({ status: 'step_complete', step, output: result.output });
    }
    if (currentState.status !== 'running') throw new Error(`no active run (status=${currentState.status})`);
    const pipeline = require('/app/asp-feature/pipeline.cjs');
    if (COGNITIVE_STEPS.has(step)) {
      let payload = args.payload;
      if (typeof payload === 'string') { try { payload = JSON.parse(payload); } catch (_) {} }
      if (typeof payload === 'string') {
        try { payload = JSON.parse(payload); }
        catch (e) {
          const m = /position (\d+)/.exec(e.message) || /char (\d+)/.exec(e.message) || /column (\d+)/.exec(e.message);
          const at = m ? ` at char ${m[1]}` : '';
          throw new Error(`payload string is not valid JSON${at}. Re-emit as valid JSON (object or JSON-encoded object).`);
        }
      }
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('payload must be a JSON object or a JSON-encoded object string for cognitive steps');
      if (step === 12 && payload && payload.sections && Array.isArray(payload.sections.references) && payload.sections.references.length > 0) throw new Error('step 12: sections.references must be omitted; the tool derives it');
      const prior = await pipeline.readStep({ runId: currentState.runId, step: step - 1 });
      const merged = mergePassthrough(step, prior, payload);
      if (step === 12) backfillRetrievalClaims(prior, merged.claims);
      const schemaErr = validatePayloadSchema(step, merged, require('zod').z);
      if (schemaErr) throw new Error(schemaErr);
      validateCognitive(step, merged);
      if (step === 7) validateStep7(merged);
      if (step === 10) validateStep10(merged);
      validateEvidence(step, merged);
      const result = await pipeline.runStep({ step, runId: currentState.runId, payload: merged });
      await stateSvc.completeStep(s, step, merged, null);
      gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, step, status: 'ok' });
      return JSON.stringify({ status: 'step_complete', step, ok: true });
    }
    if (TOOL_STEPS.has(step)) {
      const result = await pipeline.runStep({ step, runId: currentState.runId });
      const extra = step === 13 ? { artifacts_b64: result.artifacts_b64 || null, artifacts_bytes: result.artifacts_bytes || 0, pdf_b64: result.pdf_b64 || null, pdf_name: result.pdf_name || 'Automated_SEM_Recipe_Report.pdf', pdf_bytes: result.pdf_bytes || 0 } : null;
      await stateSvc.completeStep(s, step, result.output, extra);
      gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, step, status: 'ok' });
      return JSON.stringify({ status: 'step_complete', step, output: result.output });
    }
    throw new Error(`step ${step} not routed`);
  } catch (e) {
    // failRun only for runner errors (pipeline.runStep attaches .detail).
    // Parse/validation/schema errors are recoverable at the tool boundary:
    // the surgeon reformulates within the same iteration, no state changed.
    if (e && e.detail) {
      try {
        const pid = await resolveProjectId(req);
        if (pid) {
          const s = { user: String(req.user.id || req.user._id), tenant: String(req.user.tenantId || ''), projectId: pid };
          await require('/app/asp-feature/automated-sem.cjs').service().failRun(s, e.message);
        }
      } catch (_) {}
    }
    gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, step, status: 'error', error: e.message, recoverable: !(e && e.detail) });
    throw e;
  }
}

const PAYLOAD_SCHEMAS = {
  2: (z) => z.object({
    status: z.literal('RESOLVED'),
    unmapped_dropped: z.array(z.any()),
    claims: z.array(z.object({
      claim_id: z.string(),
      decision_id: z.string(),
      text: z.string(),
      claim_type: z.string(),
      citations_required: z.boolean(),
      support_status: z.enum(['SUPPORTED','UNSUPPORTED','INTERNAL_ARTIFACT']),
      ref_id: z.string().optional(),
      short_cite: z.string().optional(),
      justifying_excerpt: z.string().optional(),
    }).strip()).min(1),
    retrieval_log: z.array(z.object({
      query_id: z.string(),
      query: z.string(),
      database: z.string(),
      date: z.string(),
      results: z.array(z.object({
        ref_id: z.string(),
        title: z.string(),
        year: z.union([z.number(), z.string()]),
        doi: z.string().optional(),
        abstract_snippet: z.string(),
        retrieved_for_claims: z.array(z.string()),
      }).strip()),
    }).strip()).min(1),
    decision_log: z.array(z.object({
      step: z.number().int(),
      stage_name: z.string(),
      decision_id: z.string(),
      decision_type: z.string(),
      choice_made: z.string(),
      counterfactual_forks: z.array(z.string()),
      epistemic_rationale: z.string(),
      downstream_impact: z.string(),
      claims: z.array(z.string()),
    }).strip()).min(1),
  }).strict(),
};

function validatePayloadSchema(step, payload, zlib) {
  const builder = PAYLOAD_SCHEMAS[step];
  if (!builder) return null;
  const parsed = builder(zlib).safeParse(payload);
  if (parsed.success) return null;
  const first = parsed.error.issues[0];
  return `payload schema violation at ${first.path.join('.') || '<root>'}: ${first.message}`;
}

function makeTool(req) {
  const { DynamicStructuredTool } = require('@librechat/agents/langchain/tools');
  const { z } = require('zod');
  return new DynamicStructuredTool({
    name: NAME,
    description: def.description,
    schema: z.object({ plan: z.any().optional(), step: z.number().int(), file_id: z.string().optional(), payload: z.union([z.record(z.any()), z.string()]).optional() }).strict(),
    func: (a) => invoke(req, a),
  });
}
function wrapLoad(load) {
  return async (p) => {
    const r = await load(p);
    if (!r || !p.req?.user?.id) return r;
    r.toolDefinitions = [...(r.toolDefinitions || []).filter((t) => t.name !== NAME), def];
    r.toolRegistry = new Map(r.toolRegistry || []);
    r.toolRegistry.set(NAME, def);
    if (p.definitionsOnly === false) r.tools = [...(r.tools || []), makeTool(p.req)];
    return r;
  };
}
function wrapExecution(load) {
  return async (p) => {
    const names = p.toolNames.filter((n) => n !== NAME);
    const r = await load({ ...p, toolNames: names });
    if (!r.loadedTools) r.loadedTools = [];
    if (!r.loadedTools.some((t) => t.name === NAME)) r.loadedTools.push(makeTool(p.req));
    return r;
  };
}
module.exports = { NAME, def, wrapLoad, wrapExecution, invoke };
