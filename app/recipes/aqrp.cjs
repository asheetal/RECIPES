'use strict';
const PROMPT = `SEARCH_MODE: academic. AQRP is a stepwise qualitative pipeline. For each user request, execute the steps listed in the request, in order, one aqrp_step_run call per step. Do NOT stop between steps that the request names. Do NOT repeat a step already returned step_complete. Do NOT summarize.

STEP 1 (tool): aqrp_step_run({step:1, file_id:"<attached file_id>"}). Returns {status:'step_complete', step:1, output:{status:'LOADED', json_type, top_keys, array_key, n_elements, sample_keys, bytes, sample_records}}.

STEP 2 (surgeon->tool): From step 1's output, read sample_records. Identify 2-5 topical domains the corpus is about; use plain substantive nouns (e.g. 'AGI definition', 'AI ethics frameworks', 'human identity'). Do NOT count word frequencies; this is judgment. Call the \`search\` tool exactly once in academic mode with a query spanning those domains. CITATION RECORD RULE: for each of the top 5 search hits, copy the full record VERBATIM from the search result. Each entry must contain EXACTLY these fields and no others: authors (non-empty array of strings), year (integer), title (string), journal (string), doi (string, starting 10.). If the search result lacks a journal or doi for a hit, drop that hit and take the next one; do NOT invent, do NOT abbreviate, do NOT substitute author-year. Then call aqrp_step_run({step:2, payload:{topics:[<domain1>,<domain2>,...], P01:{pool_id:'P01', query:'<the query you sent>', n_returned:<n>, top_k:[{authors:[...],year:...,title:'...',journal:'...',doi:'10....'}, ...], ranking_rule:'0.6*relevance + 0.3*log(1+citations) + 0.1*recency'}}}) exactly once. If aqrp_step_run rejects the payload with a missing-field error, fix the offending entry from the search result and retry. Never invent fields to satisfy the validator.

STEP-CLOSE RULE: a step closes only when aqrp_step_run returns {"status":"step_complete","step":N}. If it errors, report the exact error verbatim and stop.

AFTER THE LAST STEP NAMED IN THE REQUEST: write one short final reply listing the steps completed and the output file names (__aqrp_step1_out.json, __aqrp_step2_out.json).`;
module.exports = {
  recipeId: 'aqrp',
  name: 'Automated Qualitative Research Pipeline',
  interactive: false,
  tools: ['aqrp_step_run'],
  prompt: PROMPT,
  policy: { systemPrompt: 'Route to SURGERY any request carrying a JSON corpus.', fileRouting: 'surgery', fileExtensions: ['json'], allowedRoutes: ['SURGERY'], maxTokens: 65536, timeoutMs: 300000, failureMode: 'throw' },
  workflow: { uninterruptedIterations: 20, maxDirectorIterations: 1 },
};
