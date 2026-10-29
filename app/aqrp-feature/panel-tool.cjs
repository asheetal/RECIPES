'use strict';
const NAME = 'llm_assistant_panel';
const def = {
  name: NAME,
  description: 'Consult LLM_ASSISTANT_PANEL. Submit {query: string, schema: object}. Receives one collated JSON object {panel:"LLM_ASSISTANT_PANEL", n:<N>, responses:[<N complete sets>]}. Each set conforms to the submitted schema. Blackbox: the panel fans out to N tool-free agents and returns all N sets; the caller reconciles them. Do not introspect the panel.',
};
async function invoke(req, args) {
  const gateway = require('/app/admin-tools/role-gateway.cjs');
  gateway.audit(req, 'LLM_SURGERY', 'tool_call', { tool: NAME });
  try {
    const query = args.query;
    const schema = args.schema;
    if (typeof query !== 'string' || !query.trim()) throw new Error('query required (non-empty string)');
    if (!schema || typeof schema !== 'object' || Array.isArray(schema)) throw new Error('schema required (JSON Schema object)');
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
    schema: z.object({ plan: z.any().optional(), query: z.string(), schema: z.record(z.any()) }).strip(),
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
