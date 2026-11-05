'use strict';
const NAME = 'aqrp_step_run';
const { FINAL_STEP } = require('./steps.cjs');
const PANEL_STEPS = new Set([4, 16, 17, 22]);
const { z } = require('zod');

const baseProperties = {
  plan: z.any().optional(),
  file_id: z.string().optional(),
  fileId: z.string().optional(),
  projectFileId: z.string().optional(),
};

const STEP_SCHEMA = z.object({
  ...baseProperties,
  step: z.preprocess((val) => (val !== undefined && val !== null ? Number(val) : undefined), z.number().int().optional()),
  payload: z.union([z.record(z.any()), z.string()]).optional(),
}).passthrough();

const STEP_PARAMETERS = {
  type: 'object',
  properties: {
    plan: { type: 'object', description: 'Execution plan' },
    step: {
      type: 'integer',
      minimum: 1,
      maximum: FINAL_STEP,
      description: 'Pipeline step number 1..32',
    },
    file_id: { type: 'string', description: 'Corpus file ID (required for step 1)' },
    fileId: { type: 'string' },
    projectFileId: { type: 'string' },
    payload: {
      type: 'object',
      description: 'Step payload. Strictly required for steps 2..12 and 14..32 per schema/*.schema contracts.',
    },
  },
  required: ['step'],
  oneOf: [
    {
      description: 'Tool-only steps: 1 and 13',
      properties: {
        step: { enum: [1, 13] },
      },
    },
    {
      description: 'Cognitive steps: steps 2-12 and 14-32 strictly require payload',
      properties: {
        step: {
          not: { enum: [1, 13] },
        },
      },
      required: ['payload'],
    },
  ],
  additionalProperties: false,
};

const schemaLoader = require('./schema-loader.cjs');
const STEP_CONTRACTS = schemaLoader.getAllContracts();

const STEP_CONTRACT_SUMMARY = Object.entries(STEP_CONTRACTS)
  .map(([s, c]) => `Step ${s}: ${c}`)
  .join('; ');

const def = {
  name: NAME,
  description: `AQRP step dispatcher. Run one step per call, in order. Returns {status:'step_complete', step, output}. IMPORTANT: payload is required for every step except step 1 and step 13. Every step MUST strictly match its contract: ${STEP_CONTRACT_SUMMARY}. Every RDF record in rdf_records MUST have { rdf_id, pool_id, stage, type: 'SURGEON', options: [>=2], chosen, rationale, citations_used: [__key], citation_status: 'pool_selected'|'partial'|'none_gut_feeling', gut_rationale: null }. PLAN RULES: The plan JSON MUST be passed under the top-level plan key, never spread at root.`,
  parameters: STEP_PARAMETERS,
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
  let step = args.step !== undefined && args.step !== null ? Number(args.step) : null;
  gateway.audit(req, 'LLM_SURGERY', 'tool_call', { tool: NAME, step, rawArgs: Object.keys(args || {}) });
  let currentState = null;
  try {
    const projectId = await resolveProjectId(req);
    if (!projectId) throw new Error('AQRP requires a project scope');
    const projectFiles = require('/app/project-files-feature/project-files.cjs').service();
    const s = { user: String(req.user.id || req.user._id), tenant: String(req.user.tenantId || ''), projectId };
    const stateSvc = require('/app/aqrp-feature/aqrp.cjs').service();
    currentState = await stateSvc.getState(s);
    if (currentState.status !== 'running') throw new Error(`no active run (status=${currentState.status})`);
    if (!Number.isInteger(step) || step < 1 || step > FINAL_STEP) {
      step = (currentState.lastStepOk || 0) + 1;
    }
    if (!Number.isInteger(step) || step < 1 || step > FINAL_STEP) throw new Error(`step must be 1..${FINAL_STEP}`);
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
      await stateSvc.completeStep(s, 1, result.output, (() => { try { if (typeof req !== 'undefined' && req && req.__workflow && req.__workflow.id) return { traceId: String(req.__workflow.id) }; } catch (_) {} return null; })());
      gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, step: 1, status: 'ok' });
      return JSON.stringify({ status: 'step_complete', step: 1, output: result.output });
    }

    if (PANEL_STEPS.has(step)) {
      // panel_assembler_first_v2 (v246.2.23): assembler wins; skip surgeon payload parse.
      const payload = args.payload;
      let env = null;
      try { env = await stateSvc.assembleStep4Envelope(s, step); } catch (_) {}

      let p4;
      if (step === 22) {
        if (typeof payload === 'string') {
          try { p4 = JSON.parse(payload); }
          catch (_) { p4 = env ? {} : null; }
        } else {
          p4 = payload || (env ? {} : null);
        }
        if (!p4 || typeof p4 !== 'object') {
          if (env) p4 = {};
          else throw new Error('step 22 payload must be an object');
        }
        if (env) {
          p4.panel_result = env;
          gateway.audit(req, 'LLM_SURGERY', 'panel_envelope_source', { step: 22, source: 'assembler-override' });
        } else if (!p4.panel_result) {
          throw new Error('step 22: no panel_result and assembler returned null');
        }
      } else {
        if (env) {
          p4 = { panel_result: env };
          gateway.audit(req, 'LLM_SURGERY', 'panel_envelope_source', { step, source: 'assembler', surgeon_payload_skipped: true });
        } else {
          p4 = payload ? (typeof payload === 'string' ? JSON.parse(payload) : payload) : null;
          if (!p4 || !p4.panel_result || !Array.isArray(p4.panel_result.responses) || p4.panel_result.responses.length === 0) {
            if (step === 4) throw new Error('payload required for step 4 (no panel_result and no complete tally for this corpus)');
            else throw new Error(`payload required for step ${step}`);
          }
        }
      }
      const tmp = path.join(os.tmpdir(), `aqrp-step${step}-${Date.now()}.json`);
      fs.writeFileSync(tmp, JSON.stringify(p4));
      // Every panel step (4, 16, 17, 22) gets the ground-truth record set,
      // not just step 4. Without it, foldPanelEnvelope falls into its
      // 'coders agree with each other' branch and a partial corpus that
      // all three coders cover identically passes silently. Same class of
      // bug as the 67172e7e995d9992 step-4 failure; fixed at the same time.
      const expectedRecordIds = await (async () => {
        const s1 = await stateSvc.getStepOutput(s, 1) || {};
        let ids = Array.isArray(s1.record_ids) ? s1.record_ids : (Number.isInteger(s1.n_elements) ? Array.from({ length: s1.n_elements }, (_, i) => String(i)) : []);
        const maxBatch = await stateSvc.getMaxBatchRecords();
        if (Array.isArray(ids) && ids.length > maxBatch) ids = ids.slice(0, maxBatch);
        return ids;
      })();
      let result;
      try { result = await pipeline.runStep({ step, filePath: tmp, expectedRecordIds }); }
      finally { try { fs.unlinkSync(tmp); } catch (_) {} }
      await stateSvc.completeStep(s, step, result.output, (() => { try { if (typeof req !== 'undefined' && req && req.__workflow && req.__workflow.id) return { traceId: String(req.__workflow.id) }; } catch (_) {} return null; })());
      gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, step, status: 'ok' });
      return JSON.stringify({ status: 'step_complete', step, output: result.output });
    }

    const payload = args.payload;
    if (!payload && step !== 13) throw new Error(`payload required for step ${step}`);
    let p;
    if (!payload) { p = {}; }
    else if (typeof payload === 'string') {
      let raw = payload.trim();
      if (raw.startsWith('```')) {
        raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
      }
      try {
        p = JSON.parse(raw);
      } catch (__e) {
        if (step === 24 || step === 26) {
          let text = raw.trim();
          if (text.startsWith("```")) {
            text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
          }

          let repaired = null;

          // Pattern A (Step 24): premature array closure with orphaned field before rdf_records
          try {
            const p1 = text.replace(
              /\}\s*\]\s*,\s*("(?:tension|mechanism|name)"\s*:\s*"[^"]*")\s*\}\s*\]\s*,\s*("rdf_records")/g,
              ", $1}], $2"
            );
            repaired = JSON.parse(p1);
          } catch (_) {}

          // Pattern B (Step 26): premature double closure (}} or }]) right before rdf_records
          if (!repaired) {
            try {
              const p2 = text.replace(/\}\s*[\}\]]\s*,\s*("rdf_records")/g, "}, $1");
              repaired = JSON.parse(p2);
            } catch (_) {}
          }

          if (repaired) {
            p = repaired;
          } else {
            throw new Error(`step ${step} payload is a string but not valid JSON (repair attempted): ${__e.message}`);
          }
        } else {
          throw new Error(`step ${step} payload is a string but not valid JSON: ${__e.message}`);
        }
      }
    }
    else { p = payload; }
    // step-13: assemble code_matrix from step 4 authoritative state.
    // The prompt says "no payload required" for step 13; the tool must provide
    // code_matrix so pipeline.step13() does not throw. If the surgeon ever
    // provides code_matrix in payload, that takes precedence.
    if (step === 13 && (!Array.isArray(p.code_matrix) || p.code_matrix.length === 0)) {
      const s4 = (await stateSvc.getStepOutput(s, 4)) || {};
      if (Array.isArray(s4.code_matrix) && s4.code_matrix.length > 0) {
        p.code_matrix = s4.code_matrix;
      }
    }
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
            if (typeof result.output.aqrp_report_tex !== 'string') w.push({ step: 32, kind: "MISSING_ARTIFACT", blame: "step-32 surgeon", name: "aqrp_report_tex" });
            if (!result.output.aqrp_report_audit) w.push({ step: 32, kind: "MISSING_ARTIFACT", blame: "step-32 surgeon", name: "aqrp_report_audit" });
          }
          if (w.length) result.output.warnings = w;
        } catch (e) { /* best-effort; warnings never block */ }
      }
    }
    finally { try { fs.unlinkSync(tmp); } catch (_) {} }
    await stateSvc.completeStep(s, step, result.output, (() => { try { if (typeof req !== 'undefined' && req && req.__workflow && req.__workflow.id) return { traceId: String(req.__workflow.id) }; } catch (_) {} return null; })());
    gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, step, status: 'ok' });
    return JSON.stringify({ status: 'step_complete', step, output: result.output });
  } catch (e) {
    gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, step, status: 'error', error: e.message });
    // Evidence retention: preserve surgeon's exact payload + args for post-mortem even if trace is deleted.
    try {
      const __mongoose = require('mongoose');
      const __db = __mongoose.connection.db;
      await __db.collection('aqrp_failed_payloads').insertOne({
        runId: currentState ? currentState.runId : null,
        step: step,
        payload_raw: (args && typeof args.payload !== 'undefined') ? args.payload : null,
        payload_type: (args && typeof args.payload !== 'undefined') ? typeof args.payload : 'absent',
        args_raw: args,
        error: e.message,
        at: new Date()
      });
    } catch (_) {}
    throw e;
  }
}
function makeTool(req) {
  const { DynamicStructuredTool } = require('@librechat/agents/langchain/tools');
  return new DynamicStructuredTool({
    name: NAME,
    description: def.description,
    schema: STEP_SCHEMA,
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
