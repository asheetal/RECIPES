'use strict';
const NAME = 'aqrp_step_run';
const { FINAL_STEP } = require('./steps.cjs');
const def = {
  name: NAME,
  description: `AQRP step dispatcher. Run exactly one step per call, in order. Steps implemented: 1 (load JSON corpus), 2 (topical search), 3 (familiarization), 4 (open coding). Step 1 input: {file_id}. Step 2 input: {payload:{topics,P01}}. Step 3 input: {payload:{coding_brief,notes,rdf_records}} where rdf_records is an array (R3 scope, P01 pool; R3a granularity, P00 methods pool). Returns {status:'step_complete', step, output}.`,
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
    if (step === 4) {
      const payload = args.payload;
      if (!payload) throw new Error('payload required for step 4');
      const p4 = typeof payload === 'string' ? JSON.parse(payload) : payload;
      const os4 = require('node:os'); const path4 = require('node:path'); const fs4 = require('node:fs');
      const tmp4 = path4.join(os4.tmpdir(), 'aqrp-step4-' + Date.now() + '.json');
      fs4.writeFileSync(tmp4, JSON.stringify(p4));
      const pipeline4 = require('/app/aqrp-feature/pipeline.cjs');
      const s1 = (((currentState.steps || {})["1"] || {}).output) || {};
      let expectedRecordIds = Array.isArray(s1.record_ids) ? s1.record_ids : (Number.isInteger(s1.n_elements) ? Array.from({ length: s1.n_elements }, (_, i) => String(i)) : []);
      const maxBatch = await stateSvc.getMaxBatchRecords();
      if (expectedRecordIds.length > maxBatch) expectedRecordIds = expectedRecordIds.slice(0, maxBatch);
      let result4;
      try { result4 = await pipeline4.runStep({ step, filePath: tmp4, expectedRecordIds }); }
      finally { try { fs4.unlinkSync(tmp4); } catch (_) {} }
      await stateSvc.completeStep(s, step, result4.output, null);
      gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, step, status: 'ok' });
      return JSON.stringify({ status: 'step_complete', step, output: result4.output });
    }
    if (step === 3) {
      const payload = args.payload;
      if (!payload) throw new Error('payload required for step 3');
      const p3 = typeof payload === 'string' ? JSON.parse(payload) : payload;
      const os3 = require('node:os'); const path3 = require('node:path'); const fs3 = require('node:fs');
      const tmp3 = path3.join(os3.tmpdir(), 'aqrp-step3-' + Date.now() + '.json');
      fs3.writeFileSync(tmp3, JSON.stringify(p3));
      const pipeline3 = require('/app/aqrp-feature/pipeline.cjs');
      let result3;
      try { result3 = await pipeline3.runStep({ step, filePath: tmp3 }); }
      finally { try { fs3.unlinkSync(tmp3); } catch (_) {} }
      await stateSvc.completeStep(s, step, result3.output, null);
      gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, step, status: 'ok' });
      const s2 = await stateSvc.getOutput(s, '2');
      const pool = (s2 && s2.P01 && Array.isArray(s2.P01.top_k)) ? s2.P01.top_k : [];
      const norm = (d) => String(d || '').replace(/^https?:\/\/doi\.org\//i, '').trim();
      const poolDois = new Set(pool.map(k => norm(k.doi)));
      const METHODS_NORMS = new Set(['10.1177/1094428112452151','10.1191/1478088706qp063oa','10.5465/amr.2009.0486']);
      const rdfs = result3.output.rdf_records || [];
      for (const r of rdfs) {
        const cites = Array.isArray(r.citations_used) ? r.citations_used : [];
        if ((r.citation_status === 'pool_selected' || r.citation_status === 'partial') && cites.length === 0) {
          throw new Error('Step 3: ' + r.rdf_id + '.citations_used must be non-empty when citation_status is ' + r.citation_status);
        }
        if (r.pool_id === 'P01') {
          const bad = cites.filter(d => !poolDois.has(norm(d)));
          if (bad.length) throw new Error('Step 3: ' + r.rdf_id + ' cites DOIs not in P01.top_k: ' + bad.join(', '));
        } else if (r.pool_id === 'P00') {
          const bad = cites.filter(d => !METHODS_NORMS.has(norm(d)));
          if (bad.length) throw new Error('Step 3: ' + r.rdf_id + ' cites DOIs not in P00 methods allowlist: ' + bad.join(', '));
        }
      }
      return JSON.stringify({ status: 'step_complete', step, output: result3.output });
    }
    if (step === 2) {
      const payload = args.payload;
      if (!payload) throw new Error('payload required for step 2');
      const p2 = typeof payload === 'string' ? JSON.parse(payload) : payload;
      const os2 = require('node:os'); const path2 = require('node:path'); const fs2 = require('node:fs');
      const tmp2 = path2.join(os2.tmpdir(), 'aqrp-step2-' + Date.now() + '.json');
      fs2.writeFileSync(tmp2, JSON.stringify(p2));
      const pipeline2 = require('/app/aqrp-feature/pipeline.cjs');
      let result2;
      try { result2 = await pipeline2.runStep({ step, filePath: tmp2 }); }
      finally { try { fs2.unlinkSync(tmp2); } catch (_) {} }
      await stateSvc.completeStep(s, step, result2.output, null);
      gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, step, status: 'ok' });
      return JSON.stringify({ status: 'step_complete', step, output: result2.output });
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
