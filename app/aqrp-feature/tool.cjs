'use strict';
const NAME = 'aqrp_step_run';
const FINAL_STEP = 1;
const def = {
  name: NAME,
  description: `AQRP step dispatcher. Run exactly one step per call, in order. Steps implemented: 1 (load JSON corpus). Step 1 input: {file_id}. Returns {status:'step_complete', step, output}.`,
};
async function resolveProjectId(req) {
  if (req?.__aqrpProjectId) return req.__aqrpProjectId;
  const convId = req?.body?.conversationId;
  if (!convId || convId === 'new') return null;
  const mongoose = require('mongoose');
  const convo = await mongoose.connection.db.collection('conversations').findOne({ conversationId: convId }, { projection: { chatProjectId: 1 } });
  return convo?.chatProjectId || null;
}
async function invoke(req, args) {
  const gateway = require('/app/admin-tools/role-gateway.cjs');
  const step = Number(args.step);
  gateway.audit(req, 'LLM_SURGERY', 'tool_call', { tool: NAME, step });
  try {
    if (!Number.isInteger(step) || step < 1 || step > FINAL_STEP) throw new Error(`step must be 1..${FINAL_STEP}`);
    const projectId = await resolveProjectId(req);
    if (!projectId) throw new Error('AQRP requires a project scope');
    const projectFiles = require('/app/project-files-feature/project-files.cjs').service();
    const s = { user: String(req.user.id || req.user._id), tenant: String(req.user.tenantId || ''), projectId };
    const stateSvc = require('/app/aqrp-feature/aqrp.cjs').service();
    const currentState = await stateSvc.getState(s);
    if (currentState.status !== 'running') throw new Error(`no active run (status=${currentState.status})`);
    if (step === 1) {
      let fileId = args.file_id || args.fileId || args.projectFileId;
      if (!fileId && currentState.fileId) fileId = currentState.fileId;
      if (!fileId) throw new Error('file_id required for step 1');
      const { file, buffer } = await projectFiles.read(s, fileId);
      const os = require('node:os'); const path = require('node:path'); const fs = require('node:fs');
      const tmp = path.join(os.tmpdir(), `aqrp-${currentState.runId}-${Date.now()}.json`);
      fs.writeFileSync(tmp, buffer);
      const pipeline = require('/app/aqrp-feature/pipeline.cjs');
      let result;
      try { result = await pipeline.runStep({ step, filePath: tmp }); }
      finally { try { fs.unlinkSync(tmp); } catch (_) {} }
      await stateSvc.completeStep(s, step, result.output, null);
      gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, step, status: 'ok' });
      return JSON.stringify({ status: 'step_complete', step, output: result.output });
    }
    throw new Error(`step ${step} not routed`);
  } catch (e) {
    if (e && e.detail) {
      try {
        const pid = await resolveProjectId(req);
        if (pid) {
          const s = { user: String(req.user.id || req.user._id), tenant: String(req.user.tenantId || ''), projectId: pid };
          await require('/app/aqrp-feature/aqrp.cjs').service().failRun(s, e.message);
        }
      } catch (_) {}
    }
    gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, step, status: 'error', error: e.message });
    throw e;
  }
}
function makeTool(req) {
  const { DynamicStructuredTool } = require('@librechat/agents/langchain/tools');
  const { z } = require('zod');
  return new DynamicStructuredTool({
    name: NAME, description: def.description,
    schema: z.object({ plan: z.any().optional(), step: z.coerce.number().int(), file_id: z.string().optional(), fileId: z.string().optional(), projectFileId: z.string().optional(), payload: z.union([z.record(z.any()), z.string()]).optional() }).strip(),
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
