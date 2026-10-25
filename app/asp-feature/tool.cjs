'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const NAME = 'asp_step_run';
const def = {
  name: NAME,
  description: 'Execute step N of the Automated SEM Pipeline on the project workbook. Only step=1 is enabled in this release. Call asp_step_run exactly once, then stop.',
  parameters: {
    type: 'object',
    properties: {
      step: { type: 'integer', description: 'Pipeline step number (1 only in this release)' },
      file_id: { type: 'string', description: 'Project file id of the workbook (required for step 1)' },
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
async function invoke(req, args) {
  const gateway = require('/app/admin-tools/role-gateway.cjs');
  const step = Number(args.step);
  gateway.audit(req, 'LLM_SURGERY', 'tool_call', { tool: NAME, step, args });
  try {
    if (!Number.isInteger(step) || step < 1) throw new Error('step must be a positive integer');
    if (step !== 1) throw new Error(`step ${step} is not enabled in this release`);
    const projectId = await resolveProjectId(req);
    if (!projectId) throw new Error('Automated SEM requires a project scope');
    const projectFiles = require('/app/project-files-feature/project-files.cjs').service();
    const s = { user: String(req.user.id || req.user._id), tenant: String(req.user.tenantId || ''), projectId };
    const stateSvc = require('/app/asp-feature/automated-sem.cjs').service();
    const currentState = await stateSvc.getState(s);
    let fileId = args.file_id;
    if (!fileId && currentState.fileId) fileId = currentState.fileId;
    if (!fileId) throw new Error('file_id required for step 1');
    const { file, buffer } = await projectFiles.read(s, fileId);
    await stateSvc.startRun(s, fileId, file.name, buffer);
    const st = await stateSvc.getState(s);
    if (st.status !== 'running') throw new Error(`run in unexpected state: ${st.status}`);
    
    const pipeline = require('/app/asp-feature/pipeline.cjs');
    const result = await pipeline.runStep({ step, runId: st.runId, workbookB64: buffer.toString('base64'), workbookName: file.name });
    await stateSvc.completeStep(s, step, result.output);
    const out = { status: 'step_complete', step, workdir: result.workdir, output: result.output };
    gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, step, status: 'ok' });
    return JSON.stringify(out);
  } catch (e) {
    try { const pid = await resolveProjectId(req); if (pid) { const s = { user: String(req.user.id || req.user._id), tenant: String(req.user.tenantId || ''), projectId: pid }; await require('/app/asp-feature/automated-sem.cjs').service().failRun(s, e.message); } } catch (_) {}
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
    schema: z.object({ step: z.number().int(), file_id: z.string().optional() }),
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
