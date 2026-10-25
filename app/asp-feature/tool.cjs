'use strict';
const NAME = 'asp_step_run';
const { FINAL_STEP } = require('./core.cjs');
const def = {
  name: NAME,
  description: `Execute step N of the Automated SEM Pipeline. Steps 1..${FINAL_STEP}. Tool steps (1,4,6,8,9,11,13): call with {step:N}. Cognitive steps (2,3,5,7,10,12): call with {step:N, payload:{...}}. Step 1 also requires file_id. Call in order, one step per iteration, then stop when step 13 returns done.`,
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
    if (!Array.isArray(refs) || refs.length === 0) throw new Error('step 12: sections.references must be a non-empty array');
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
  3:  { inherit: ['file_path','data_sheet','header_row_index','max_evaluations'], rename: {}, append: ['claims','retrieval_log','decision_log'] },
  5:  { inherit: ['file_path','data_sheet','header_row_index','max_evaluations','controls','taxonomy'], rename: { models: 'candidate_models' }, append: ['claims','retrieval_log','decision_log'] },
  7:  { inherit: ['file_path','data_sheet','header_row_index','controls','survivors','survivors_count'], rename: {}, append: ['claims','retrieval_log','decision_log'] },
  10: { inherit: ['file_path','data_sheet','header_row_index','controls','bootstrap_results','survivors','survivors_count','shortlisted_models','shortlisted_count','taxonomy','descriptives','missingness','correlations','alpha_table','n_total','variables'], rename: {}, append: ['claims','retrieval_log','decision_log'] },
  12: { inherit: ['file_path','data_sheet','header_row_index','controls','winning_model_id','topology_type','models','rendered_diagrams','bootstrap_results','models_validated_count','taxonomy','survivors','survivors_count','shortlisted_models','shortlisted_count','evaluations','descriptives','missingness','correlations','alpha_table','n_total','variables'], rename: {}, append: ['claims','retrieval_log','decision_log'], derive: [{ field: 'diagram_path', from: 'rendered_diagrams', pick: (rd) => rd && rd[0] && rd[0].output_image }] }
};

const DEDUP_KEY = { claims: 'claim_id', retrieval_log: 'query_id', decision_log: 'decision_id' };

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
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('payload must be a JSON object for cognitive steps');
      const prior = await pipeline.readStep({ runId: currentState.runId, step: step - 1 });
      const merged = mergePassthrough(step, prior, payload);
      validateCognitive(step, merged);
      if (step === 7) validateStep7(merged);
      validateEvidence(step, merged);
      const result = await pipeline.runStep({ step, runId: currentState.runId, payload: merged });
      await stateSvc.completeStep(s, step, merged, null);
      gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, step, status: 'ok' });
      return JSON.stringify({ status: 'step_complete', step, ok: true });
    }
    if (TOOL_STEPS.has(step)) {
      const result = await pipeline.runStep({ step, runId: currentState.runId });
      const extra = step === 13 ? { artifacts_b64: result.artifacts_b64 || null, artifacts_bytes: result.artifacts_bytes || 0 } : null;
      await stateSvc.completeStep(s, step, result.output, extra);
      gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, step, status: 'ok' });
      return JSON.stringify({ status: 'step_complete', step, output: result.output });
    }
    throw new Error(`step ${step} not routed`);
  } catch (e) {
    try {
      const pid = await resolveProjectId(req);
      if (pid) {
        const s = { user: String(req.user.id || req.user._id), tenant: String(req.user.tenantId || ''), projectId: pid };
        await require('/app/asp-feature/automated-sem.cjs').service().failRun(s, e.message);
      }
    } catch (_) {}
    gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, step, status: 'error', error: e.message });
    throw e;
  }
}
function makeTool(req) {
  const { DynamicStructuredTool } = require('@librechat/agents/langchain/tools');
  const { z } = require('zod');
  return new DynamicStructuredTool({
    name: NAME,
    description: def.description,
    schema: z.object({ step: z.number().int(), file_id: z.string().optional(), payload: z.record(z.any()).optional() }),
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
