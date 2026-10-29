'use strict';
const NAME = 'llm_assistant_panel_batch';
const def = {
  name: NAME,
  description:
    'Advisory multi-agent panel, batched over records. Blackbox: submit {query, schema, records}, receive the identical envelope as llm_assistant_panel: {panel, n, responses} where n is the roster size and responses is n complete sets each carrying coder_id and rows (rows spans all records in input order). Per record, all members run in parallel with up to 5 trials of exponential backoff; a member still failing is reported as a row with codes:["NA"]. Use this instead of llm_assistant_panel only when the corpus does not fit one member context budget; the choice depends on token size, never on record count. Recipe-agnostic. Not a search, file, research, bash, or computation tool.',
};
async function invoke(req, args) {
  const gateway = require('/app/admin-tools/role-gateway.cjs');
  gateway.audit(req, 'LLM_SURGERY', 'tool_call', { tool: NAME });
  try {
    const query = args.query;
    let schema = args.schema;
    const records = args.records;
    if (typeof query !== 'string' || !query.trim()) throw new Error('query required (non-empty string)');
    if (typeof schema === 'string') {
      try { schema = JSON.parse(schema); } catch (e) { throw new Error('schema string is not valid JSON: ' + e.message); }
    }
    if (!schema || typeof schema !== 'object' || Array.isArray(schema)) throw new Error('schema required (JSON Schema object or JSON string)');
    if (!Array.isArray(records) || !records.length) throw new Error('records required (non-empty array)');
    const mod = require('/app/admin-tools/assistant-panel-batch.cjs');
    const result = await mod.batch({ query, schema, records });
    gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, status: 'ok', n: result && result.n, m: records.length });
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
    schema: z.object({ plan: z.any().optional(), query: z.string(), schema: z.union([z.record(z.any()), z.string()]), records: z.array(z.any()) }).strip(),
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
