'use strict';
const NAME = 'llm_assistant_panel_batch';
const def = {
  name: NAME,
  description:
    'Advisory multi-agent panel, batched over records. Blackbox: submit {query, schema, records} or {query, schema, file_id}, receive {panel, n, responses} where n is the roster size and responses is n complete sets each carrying coder_id and rows (rows spans all records in input order). With file_id it reads every record from that JSON corpus. Per record, all members run in parallel with up to 5 trials of exponential backoff; a member still failing is reported as a row with codes:["NA"]. Recipe-agnostic. Not a search, research, bash, or computation tool.',
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
  gateway.audit(req, 'LLM_SURGERY', 'tool_call', { tool: NAME });
  try {
    const query = args.query;
    let schema = args.schema;
    let records = args.records;
    const fileId = args.file_id || args.fileId || args.projectFileId;
    if ((!Array.isArray(records) || !records.length) && fileId) {
      const projectId = await resolveProjectId(req);
      if (!projectId) throw new Error('project scope required to read file_id');
      const projectFiles = require('/app/project-files-feature/project-files.cjs').service();
      const s = { user: String(req.user.id || req.user._id), tenant: String(req.user.tenantId || ''), projectId };
      const { buffer } = await projectFiles.read(s, fileId);
      let data;
      try { data = JSON.parse(buffer.toString('utf8')); } catch (e) { throw new Error('file_id is not valid JSON: ' + e.message); }
      if (Array.isArray(data)) records = data;
      else if (data && typeof data === 'object') {
        const k = Object.keys(data).find(k => Array.isArray(data[k]));
        if (!k) throw new Error('file_id JSON has no array of records');
        records = data[k];
      } else throw new Error('file_id JSON has no records');
    }
    if (typeof query !== 'string' || !query.trim()) throw new Error('query required (non-empty string)');
    if (typeof schema === 'string') {
      try { schema = JSON.parse(schema); } catch (e) { throw new Error('schema string is not valid JSON: ' + e.message); }
    }
    if (!schema || typeof schema !== 'object' || Array.isArray(schema)) throw new Error('schema required (JSON Schema object or JSON string)');
    if (!schema.type && schema.properties && typeof schema.properties === 'object') {
      schema = { ...schema, type: 'object' };
    }
    if (typeof records === 'string') {
      try { records = JSON.parse(records); } catch (e) { throw new Error('records string is not valid JSON: ' + e.message); }
    }
    if (!Array.isArray(records) || !records.length) throw new Error('records required (non-empty array)');
    const mod = require('/app/admin-tools/assistant-panel-batch.cjs');
    const projectId2 = await resolveProjectId(req);
    let runId = null; let progressOk = false;
    if (projectId2) {
      try {
        const svc = require('/app/aqrp-feature/aqrp.cjs').service();
        const scope = { user: String(req.user.id || req.user._id), tenant: String(req.user.tenantId || ''), projectId: projectId2 };
        const st = await svc.getState(scope);
        if (st && st.runId) { runId = st.runId; progressOk = true; }
      } catch (e) { progressOk = false; }
    }
    const corpusTotal = records.length;
    let recordsCapped = false;
    if (progressOk) {
      try {
        const maxR = await require('/app/aqrp-feature/aqrp.cjs').service().getMaxBatchRecords();
        if (records.length > maxR) { records = records.slice(0, maxR); recordsCapped = true; }
      } catch (e) {}
    }
    const onRecord = progressOk ? async ({ record_id, total, perCoder }) => {
      const mongoose = require('mongoose');
      const db = mongoose.connection.db;
      const now = new Date();
      await db.collection('aqrp_rows').updateOne({ runId, step: 4, record_id: String(record_id) }, { $set: { runId, step: 4, record_id: String(record_id), perCoder, updatedAt: now } }, { upsert: true });
      const done = await db.collection('aqrp_rows').countDocuments({ runId, step: 4 });
      await db.collection('aqrpruns').updateOne({ projectId: projectId2 }, { $set: { progress: { step: 4, done, total, updatedAt: now }, records_capped: recordsCapped, corpus_total: corpusTotal, lastProgressAt: now } });
    } : undefined;
    const result = await mod.batch({ query, schema, records, onRecord });
    gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, status: 'ok', n: result && result.n, m: records.length, corpus_total: corpusTotal, records_capped: recordsCapped });
    return JSON.stringify(result);
  } catch (e) {
    gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, status: 'error', error: e.message });
    throw e;
  }
}
function makeTool(req) {
  const { DynamicStructuredTool } = require('@librechat/agents/langchain/tools');
  const { z } = require('zod');
  return new DynamicStructuredTool({
    name: NAME,
    description: def.description,
    schema: z.object({ plan: z.any().optional(), query: z.string(), schema: z.union([z.record(z.any()), z.string()]), records: z.union([z.array(z.any()), z.string()]).optional(), file_id: z.string().optional(), fileId: z.string().optional(), projectFileId: z.string().optional() }).strip(),
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
