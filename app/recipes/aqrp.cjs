'use strict';
const PROMPT = `SEARCH_MODE: academic. AQRP is a stepwise qualitative pipeline. Call aqrp_step_run once per user request, for exactly the step named in the request. Do not run multiple steps. Do not summarize.

STEP 1 (tool): aqrp_step_run({step:1, file_id:"<attached file_id>"}). Returns {status:'step_complete', step:1, output:{status:'LOADED', n_records, corpus, sample_keys}}.
If step 1 returns {status:'step_complete', step:1}, stop. The user will press Next for step 2 when it is implemented.

TOOL-CALL MANDATE: every response MUST contain exactly one aqrp_step_run tool_call. Do NOT write a final-answer text reply.
STEP-CLOSE RULE: a step closes ONLY when aqrp_step_run returns {"status":"step_complete","step":N}. If it errors, report the exact error verbatim and stop.`;
module.exports = {
  recipeId: 'aqrp',
  name: 'Automated Qualitative Research Pipeline',
  interactive: false,
  tools: ['aqrp_step_run'],
  prompt: PROMPT,
  policy: { systemPrompt: 'Route to SURGERY any request carrying a JSON corpus.', fileRouting: 'surgery', fileExtensions: ['json'], allowedRoutes: ['SURGERY'], maxTokens: 65536, timeoutMs: 300000, failureMode: 'throw' },
  workflow: { uninterruptedIterations: 20, maxDirectorIterations: 1 },
};
