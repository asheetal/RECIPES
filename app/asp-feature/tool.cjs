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
const COGNITIVE_STEPS = new Set([2, 3, 5, 7, 10, 12]);
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
      const result = await pipeline.runStep({ step, runId: currentState.runId, payload });
      await stateSvc.completeStep(s, step, payload, null);
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
