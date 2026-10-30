'use strict';
const NAME = 'aqrp_step_run';
const { FINAL_STEP } = require('./steps.cjs');
const PANEL_STEPS = new Set([4, 16, 17, 22]);
const def = {
  name: NAME,
  description: `AQRP step dispatcher. Run one step per call, in order. Step 1 input: {file_id}. Panel steps (4, 16, 17, 22) input: {payload:{panel_result:{panel,n,responses}}}. All other steps input: {payload:{...step-specific fields, rdf_records when SURGEON}}. Step 32 input: {payload:{submission_paper_tex, rdf_records:[R32]}}. Returns {status:'step_complete', step, output}.`,
};
async function resolveProjectId(req) {
  if (req?.__aqrpProjectId) return req.__aqrpProjectId;
  const convId = req?.body?.conversationId;
  if (!convId || convId === 'new') return null;
  const mongoose = require('mongoose');
  const convo = await mongoose.connection.db.collection('conversations').findOne({ conversationId: convId }, { projection: { chatProjectId: 1 } });
  return convo?.chatProjectId || null;
}
async function collectPools(s, stateSvc) {
  const out = await stateSvc.getAllStepOutputs(s);
  const pools = {};
  for (const stepOut of Object.values(out)) {
    if (!stepOut || typeof stepOut !== 'object') continue;
    for (const [k, v] of Object.entries(stepOut)) {
      if (/^P\d+$/.test(k) && v && typeof v === 'object' && v.pool_id === k) pools[k] = v;
    }
  }
  return pools;
}
async function collectAllRdfs(s, stateSvc) {
  const out = await stateSvc.getAllStepOutputs(s);
  const all = [];
  const keys = Object.keys(out).sort((a, b) => Number(a) - Number(b));
  for (const k of keys) {
    const stepOut = out[k];
    if (stepOut && Array.isArray(stepOut.rdf_records)) all.push(...stepOut.rdf_records);
  }
  return all;
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
    const pipeline = require('/app/aqrp-feature/pipeline.cjs');
    const os = require('node:os'); const path = require('node:path'); const fs = require('node:fs');

    if (step === 1) {
      let fileId = args.file_id || args.fileId || args.projectFileId;
      if (!fileId && currentState.fileId) fileId = currentState.fileId;
      if (!fileId) throw new Error('file_id required for step 1');
      const { file, buffer } = await projectFiles.read(s, fileId);
      const tmp = path.join(os.tmpdir(), `aqrp-step1-${currentState.runId}-${Date.now()}.json`);
      fs.writeFileSync(tmp, buffer);
      let result;
      try { result = await pipeline.runStep({ step: 1, filePath: tmp }); }
      finally { try { fs.unlinkSync(tmp); } catch (_) {} }
      await stateSvc.completeStep(s, 1, result.output, null);
      gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, step: 1, status: 'ok' });
      return JSON.stringify({ status: 'step_complete', step: 1, output: result.output });
    }

    if (PANEL_STEPS.has(step)) {
      let payload = args.payload;
      let p4 = payload ? (typeof payload === 'string' ? JSON.parse(payload) : payload) : null;
      const pr = p4 && p4.panel_result;
      if (!pr || !Array.isArray(pr.responses) || pr.responses.length === 0) {
        if (step === 4) {
          const env = await stateSvc.assembleStep4Envelope(s);
          if (env) p4 = { panel_result: env };
          else throw new Error('payload required for step 4 (no panel_result and no complete tally for this corpus)');
        } else throw new Error(`payload required for step ${step}`);
      }
      const tmp = path.join(os.tmpdir(), `aqrp-step${step}-${Date.now()}.json`);
      fs.writeFileSync(tmp, JSON.stringify(p4));
      let expectedRecordIds = null;
      if (step === 4) {
        const s1 = await stateSvc.getStepOutput(s, 1) || {};
        expectedRecordIds = Array.isArray(s1.record_ids) ? s1.record_ids : (Number.isInteger(s1.n_elements) ? Array.from({ length: s1.n_elements }, (_, i) => String(i)) : []);
        const maxBatch = await stateSvc.getMaxBatchRecords();
        if (Array.isArray(expectedRecordIds) && expectedRecordIds.length > maxBatch) expectedRecordIds = expectedRecordIds.slice(0, maxBatch);
      }
      let result;
      try { result = await pipeline.runStep({ step, filePath: tmp, expectedRecordIds }); }
      finally { try { fs.unlinkSync(tmp); } catch (_) {} }
      await stateSvc.completeStep(s, step, result.output, null);
      gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, step, status: 'ok' });
      return JSON.stringify({ status: 'step_complete', step, output: result.output });
    }

    const payload = args.payload;
    if (!payload && step !== 13) throw new Error(`payload required for step ${step}`);
    const p = payload ? (typeof payload === 'string' ? JSON.parse(payload) : payload) : {};
    const tmp = path.join(os.tmpdir(), `aqrp-step${step}-${Date.now()}.json`);
    fs.writeFileSync(tmp, JSON.stringify(p));
    const pools = await collectPools(s, stateSvc);
    const allRdfs = step === 32 ? await collectAllRdfs(s, stateSvc) : null;
    let result;
    try {
      result = await pipeline.runStep({ step, filePath: tmp, pools, allRdfs, runId: currentState.runId });
      if (result && result.output && [4, 16, 17, 22, 32].includes(step)) {
        try {
          const prev = await stateSvc.getAllStepOutputs(s);
          const norm = (x) => String(x).toLowerCase().replace(/[_\-\s]+/g, "").trim();
          const isMatch = (c, list) => {
            const x = norm(c);
            return list.some(y => { const ny = norm(y); return ny && (x === ny || x.includes(ny) || ny.includes(x)); });
          };
          const w = [];
          if (step === 4) {
            const brief = (prev["3"] && prev["3"].coding_brief) || {};
            const bc = (brief.code_for || []).map(x => String(x));
            const fc = (brief.flag || []).map(x => String(x));
            const byRec = {};
            for (const row of (result.output.code_matrix || [])) {
              if (!byRec[row.record_id]) byRec[row.record_id] = [];
              byRec[row.record_id].push(row);
            }
            for (const rid of Object.keys(byRec)) {
              const rows = byRec[rid];
              const na = rows.filter(r => r.codes && r.codes.length === 1 && String(r.codes[0]).toUpperCase() === "NA").length;
              if (na === rows.length) w.push({ step: 4, kind: "ALL_MEMBERS_NA", blame: "admin roster", record_id: rid, total: rows.length });
              else if (na > 0) w.push({ step: 4, kind: "SOME_MEMBERS_NA", blame: "admin roster", record_id: rid, na_cells: na, total: rows.length });
            }
            for (const row of (result.output.code_matrix || [])) {
              for (const c of (row.codes || [])) {
                const lc = String(c).toLowerCase().trim();
                if (lc === "na" || lc === "") continue;
                if (fc.length && isMatch(lc, fc)) w.push({ step: 4, kind: "FLAG_ITEM_CODED", blame: "step-3 surgeon", coder_id: row.coder_id, record_id: row.record_id, code: String(c) });
                else if (bc.length && !isMatch(lc, bc)) w.push({ step: 4, kind: "CODE_NOT_IN_BRIEF", blame: "step-3 surgeon", coder_id: row.coder_id, record_id: row.record_id, code: String(c) });
              }
            }
          }
          if ([16, 17, 22].includes(step)) {
            const pr = result.output.panel_result || {};
            for (const r of (pr.responses || [])) {
              const rows = r.rows || [];
              const na = rows.filter(x => x.codes && x.codes.length === 1 && String(x.codes[0]).toUpperCase() === "NA").length;
              if (na > 0) w.push({ step, kind: "PANEL_MEMBER_NA", blame: "admin roster", coder_id: r.coder_id, na_cells: na, total: rows.length });
            }
          }
          if (step === 32) {
            if (typeof result.output.submission_paper_tex !== "string") w.push({ step: 32, kind: "MISSING_ARTIFACT", blame: "step-32 surgeon", name: "submission_paper_tex" });
            if (typeof result.output.supplementary_rdf_tex !== "string") w.push({ step: 32, kind: "MISSING_ARTIFACT", blame: "step-32 surgeon", name: "supplementary_rdf_tex" });
            if (!result.output.aqrp_report) w.push({ step: 32, kind: "MISSING_ARTIFACT", blame: "step-32 surgeon", name: "aqrp_report" });
          }
          if (w.length) result.output.warnings = w;
        } catch (e) { /* best-effort; warnings never block */ }
      }
    }
    finally { try { fs.unlinkSync(tmp); } catch (_) {} }
    await stateSvc.completeStep(s, step, result.output, null);
    gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, step, status: 'ok' });
    return JSON.stringify({ status: 'step_complete', step, output: result.output });
  } catch (e) {
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
    schema: z.object({ plan: z.any().optional(), step: z.coerce.number().int(), file_id: z.string().optional(), fileId: z.string().optional(), projectFileId: z.string().optional(), payload: z.union([z.record(z.any()), z.string()]).optional() }).strip(),
    func: (a) => invoke(req, a),
  });
}
function wrapLoad(load) {
  return async (p) => {
    const r = await load(p);
    if (!r || !p.req?.user?.id) return r;
    r.toolDefinitions = [...(r.toolDefinitions || []).filter(t => t.name !== NAME), def];
    r.toolRegistry = new Map(r.toolRegistry || []);
    r.toolRegistry.set(NAME, def);
    if (p.definitionsOnly === false) r.tools = [...(r.tools || []), makeTool(p.req)];
    return r;
  };
}
function wrapExecution(load) {
  return async (p) => {
    const names = p.toolNames.filter(n => n !== NAME);
    const r = await load({ ...p, toolNames: names });
    if (!r.loadedTools) r.loadedTools = [];
    if (!r.loadedTools.some(t => t.name === NAME)) r.loadedTools.push(makeTool(p.req));
    return r;
  };
}
module.exports = { NAME, def, wrapLoad, wrapExecution, invoke };
