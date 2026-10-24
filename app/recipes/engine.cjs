'use strict';
// The single triage engine. Recipes are UX shells; they supply prompt, files,
// policy, and an operate() that runs the surgeon. Roles are resolved only by
// the admin-bound gateway.
const crypto = require('node:crypto');
const gateway = require('/app/admin-tools/role-gateway.cjs');
const triage = require('/app/admin-tools/triage.cjs');

async function runRecipe({ req, prompt, files, policy, operate }) {
  const state = req.__workflow;
  const p = triage.normalizePolicy(policy);
  gateway.audit(req, 'LLM_TRIAGE', 'boundary_input', { currentPrompt: prompt, files });
  const decision = await triage.route({ gateway, req, prompt, files, conversation: [], policy: p });
  if (decision.usage) state.usage.push({ role: 'LLM_TRIAGE', usage: decision.usage });
  state.route = decision.route;
  state.direct = decision.route === 'OPD';
  state.stage = state.direct ? 'LLM_OPD' : 'LLM_SURGERY';
  await gateway.bindRequest(req, state.stage);
  gateway.audit(req, 'LLM_TRIAGE', 'boundary_output', { route: decision.route, source: decision.source });

  let handoff = null;
  if (!state.direct) {
    gateway.audit(req, 'LLM_SURGERY', 'boundary_input', { prompt });
    try {
      const result = await operate(req, state);
      handoff = { status: 'returned', result };
    } catch (e) {
      handoff = { status: 'needs_resolution', error: { code: e.code || 'EXECUTION_FAILED', message: e.message } };
    }
    gateway.audit(req, 'LLM_SURGERY', 'boundary_output', { handoff });
  }

  const opd = await gateway.complete(
    'LLM_OPD',
    [
      { role: 'system', content: 'You are Assistant, the final user-facing responder. You have no tools. Close the turn honestly and concisely.' },
      { role: 'user', content: JSON.stringify({ handoff }) },
    ],
    { ctx: req },
  );
  const text = opd?.choices?.[0]?.message?.content || '';
  gateway.audit(req, 'LLM_OPD', 'boundary_output', { text });
  return { decision, handoff, text };
}

function makeCtx(user) {
  return {
    user,
    body: {},
    __workflow: { id: crypto.randomUUID(), stage: 'LLM_TRIAGE', opdCalls: 0, route: null, usage: [] },
  };
}

module.exports = { runRecipe, makeCtx };
