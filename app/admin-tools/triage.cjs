'use strict';
// Triage abstraction layer.
//
// The only module that decides whether a prompt needs the surgery workflow
// (SURGERY) or can be answered directly (OPD).
//
// This module is self-contained: it knows nothing about recipes, plans,
// directors, or the surgery internals. It takes a prompt, attached files,
// prior conversation, and a policy object, and returns { route, source, usage? }.
//
// Different recipes can supply different policies (system prompt, file
// handling, token budget, allowed routes). The default policy reproduces
// the historical behavior for the Chat recipe.

const DEFAULT_SYSTEM_PROMPT =
  'You route one current user prompt. You have no tools and no conversation history. ' +
  'Return only JSON {"route":"OPD"} or {"route":"SURGERY"}. ' +
  'Choose OPD only when the answer is already present as visible text in the supplied conversation, ' +
  'or the prompt is a greeting, or the prompt asks for the current time from the supplied server clock. ' +
  'Choose SURGERY for anything that requires computation, aggregation, comparison, arithmetic, ' +
  'reading file contents or filenames, project state, research, edits, tool use, verification, ' +
  'multiple steps, or any fact not already written verbatim in the supplied conversation. ' +
  'When in doubt, choose SURGERY. Never answer the prompt yourself.';

const DEFAULT_FILE_EXTENSIONS = Object.freeze([
  'xlsx', 'docx', 'pdf', 'tex', 'csv', 'txt', 'json',
]);

const DEFAULT_POLICY = Object.freeze({
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  maxTokens: 8192,
  timeoutMs: 120000,
  fileExtensions: DEFAULT_FILE_EXTENSIONS,
  // 'surgery': a file signal routes straight to SURGERY (no LLM call)
  // 'triage' : a file signal is passed to the model; the model decides
  fileRouting: 'surgery',
  allowedRoutes: Object.freeze(['OPD', 'SURGERY']),
  // 'throw'    : propagate triage failures (current behavior)
  // 'fallback' : return fallbackRoute instead of throwing
  failureMode: 'throw',
  fallbackRoute: 'SURGERY',
});

function normalizePolicy(input) {
  const merged = { ...DEFAULT_POLICY, ...(input || {}) };

  if (typeof merged.systemPrompt !== 'string' || !merged.systemPrompt.trim()) {
    throw Error('Triage policy: systemPrompt must be a non-empty string');
  }
  if (!Number.isInteger(merged.maxTokens) || merged.maxTokens < 64 || merged.maxTokens > 65536) {
    throw Error('Triage policy: maxTokens must be an integer from 64 to 65536');
  }
  if (!Number.isInteger(merged.timeoutMs) || merged.timeoutMs < 1000) {
    throw Error('Triage policy: timeoutMs must be an integer >= 1000');
  }
  if (!Array.isArray(merged.fileExtensions)) {
    throw Error('Triage policy: fileExtensions must be an array of strings');
  }
  for (const ext of merged.fileExtensions) {
    if (typeof ext !== 'string' || !ext.trim()) {
      throw Error('Triage policy: fileExtensions entries must be non-empty strings');
    }
  }
  if (!['surgery', 'triage'].includes(merged.fileRouting)) {
    throw Error("Triage policy: fileRouting must be 'surgery' or 'triage'");
  }
  if (!Array.isArray(merged.allowedRoutes) || merged.allowedRoutes.length === 0) {
    throw Error('Triage policy: allowedRoutes must be a non-empty array');
  }
  for (const route of merged.allowedRoutes) {
    if (typeof route !== 'string' || !route.trim()) {
      throw Error('Triage policy: allowedRoutes entries must be non-empty strings');
    }
  }
  if (!['throw', 'fallback'].includes(merged.failureMode)) {
    throw Error("Triage policy: failureMode must be 'throw' or 'fallback'");
  }
  if (!merged.allowedRoutes.includes(merged.fallbackRoute)) {
    throw Error('Triage policy: fallbackRoute must be one of allowedRoutes');
  }

  return Object.freeze({
    ...merged,
    fileExtensions: Object.freeze([...merged.fileExtensions]),
    allowedRoutes: Object.freeze([...merged.allowedRoutes]),
  });
}

function detectFileSignal({ prompt, files, policy }) {
  if (Array.isArray(files) && files.length > 0) return true;
  if (!policy.fileExtensions.length) return false;
  const pattern = new RegExp('\\.(' + policy.fileExtensions.join('|') + ')\\b', 'i');
  return pattern.test(String(prompt || ''));
}

async function route({ gateway, req, prompt, files, conversation, policy }) {
  const p = normalizePolicy(policy);

  const input = { currentPrompt: prompt, conversation, files };
  gateway.audit(req, 'LLM_TRIAGE', 'boundary_input', input);

  if (p.fileRouting === 'surgery' && detectFileSignal({ prompt, files, policy: p })) {
    return { route: 'SURGERY', source: 'file_signal' };
  }

  try {
    const out = await gateway.complete(
      'LLM_TRIAGE',
      [
        { role: 'system', content: p.systemPrompt },
        { role: 'user', content: JSON.stringify(input) },
      ],
      { ctx: req, max_tokens: p.maxTokens, json: true, signal: AbortSignal.timeout(p.timeoutMs) },
    );

    let parsed;
    try {
      parsed = JSON.parse(out.choices[0].message.content);
    } catch (parseError) {
      throw Error('Invalid TRIAGE JSON contract: not valid JSON');
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw Error('Invalid TRIAGE JSON contract: not an object');
    }
    const keys = Object.keys(parsed);
    if (keys.length !== 1 || keys[0] !== 'route') {
      throw Error('Invalid TRIAGE JSON contract: expected exactly {"route": ...}');
    }
    if (!p.allowedRoutes.includes(parsed.route)) {
      throw Error('Invalid TRIAGE route: ' + JSON.stringify(parsed.route));
    }

    return { route: parsed.route, source: 'model', usage: out.usage };
  } catch (error) {
    gateway.audit(req, 'LLM_TRIAGE', 'route_error', { code: error.code, message: error.message });
    if (p.failureMode === 'fallback') {
      return {
        route: p.fallbackRoute,
        source: 'fallback',
        error: { code: error.code, message: error.message },
      };
    }
    throw error;
  }
}

module.exports = {
  DEFAULT_POLICY,
  DEFAULT_SYSTEM_PROMPT,
  normalizePolicy,
  detectFileSignal,
  route,
};
