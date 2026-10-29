'use strict';
const NAME = 'llm_assistant_panel';
const def = {
  name: NAME,
  description: 'Advisory multi-agent panel. Blackbox: submit {query, schema}, receive {panel, n, responses} where responses is an array of n complete sets conforming to schema. The panel fans out to its configured members; the caller reconciles the sets. Recipe-agnostic. Not a search, file, research, bash, or computation tool.',
};
async function invoke(req, args) {
  const gateway = require('/app/admin-tools/role-gateway.cjs');
  gateway.audit(req, 'LLM_SURGERY', 'tool_call', { tool: NAME });
  try {
    const query = args.query;
    let schema = args.schema;
    if (typeof query !== 'string' || !query.trim()) throw new Error('query required (non-empty string)');
    if (typeof schema === 'string') { try { schema = JSON.parse(schema); } catch (e) { throw new Error('schema string is not valid JSON: ' + e.message); } }
    if (!schema || typeof schema !== 'object' || Array.isArray(schema)) throw new Error('schema required (JSON Schema object or JSON string)');
    const panel = require('/app/admin-tools/assistant-panel.cjs');
    const result = await panel.ask({ query, schema });
    gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, status: 'ok', n: result && result.n });
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
    name: NAME, description: def.description,
    schema: z.object({ plan: z.any().optional(), query: z.string(), schema: z.union([z.record(z.any()), z.string()]) }).strip(),
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
