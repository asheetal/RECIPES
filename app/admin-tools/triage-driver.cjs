'use strict';
// Generic triage driver. Roles are resolved by the admin-bound gateway only;
// callers supply prompt, files, policy, and an operate() that runs the surgeon.
const crypto = require('node:crypto');
const gateway = require('./role-gateway.cjs');
const triage = require('./triage.cjs');

function makeCtx({ user, workflowId, routeTag }) {
  return {
    user,
    body: {},
    __workflow: { id: workflowId || crypto.randomUUID(), stage: 'LLM_TRIAGE', opdCalls: 0, route: null, usage: [] },
    __routeTag: routeTag || null,
  };
}

async function runTriage({ req, prompt, files, policy, operate }) {
  const state = req.__workflow;
  const p = triage.normalizePolicy(policy);
  const decision = await triage.route({ gateway, req, prompt, files, conversation: [], policy: p });
  if (decision.usage) state.usage.push({ role: 'LLM_TRIAGE', usage: decision.usage });
  state.route = decision.route;
  state.direct = decision.route === 'OPD';
  state.stage = state.direct ? 'LLM_OPD' : 'LLM_SURGERY';
  await gateway.bindRequest(req, state.stage);
  gateway.audit(req, 'LLM_TRIAGE', 'boundary_output', { route: decision.route, source: decision.source });

  let result = null;
  if (!state.direct) {
    gateway.audit(req, 'LLM_SURGERY', 'boundary_input', { prompt });
    result = await operate(req, state);
  }
  return { decision, result };
}

module.exports = { makeCtx, runTriage };
