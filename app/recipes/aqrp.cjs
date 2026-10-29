'use strict';
const PROMPT = `SEARCH_MODE: academic. AQRP is a stepwise qualitative pipeline. For each user request, execute the steps listed in the request, in order, one aqrp_step_run call per step.

STEP 1 (tool): aqrp_step_run({step:1, file_id:"<attached file_id>"}). Returns {status:'step_complete', step:1, output:{status:'LOADED', json_type, top_keys, array_key, n_elements, sample_keys, bytes, sample_records}}.

STEP 2 (surgeon->tool): From step 1's output, read sample_records. Identify 2-5 topical domains the corpus is about; use plain substantive nouns (e.g. 'AGI definition', 'AI ethics frameworks', 'human identity'). Search the literature for those domains in academic mode. For each of the top 5 search hits, supply a citation record with exactly these fields and no others: authors (non-empty array of strings), year (integer), title (string), journal (string), doi (string, starting 10.). Then call aqrp_step_run({step:2, payload:{topics:[<domain1>,<domain2>,...], P01:{pool_id:'P01', query:'<the query you sent>', n_returned:<n>, top_k:[{authors:[...],year:...,title:'...',journal:'...',doi:'10....'}, ...], ranking_rule:'0.6*relevance + 0.3*log(1+citations) + 0.1*recency'}}}).

STEP 3 (surgeon): From steps 1 and 2, write a familiarization memo and two RDF records. coding_brief must contain code_for (array of non-empty strings; what to code), ignore (array; what to skip), flag (array; what to mark), and granularity (string; e.g. 'claim-level'). notes must be at least 600 characters: a familiarization memo (what the corpus is about, the contrasts and tensions you see, what remains uncertain, questions to resolve). rdf_records is an array of exactly two records, R3 and R3a: R3 = the SCOPE decision (which coding brief), pool_id:'P01' (topical), citations_used must be DOIs from step 2's P01.top_k. R3a = the GRANULARITY decision (claim-level vs theme-level vs sentiment), pool_id:'P00' (methods), citations_used must include at least one of these methods DOIs: 10.1177/1094428112452151 (Gioia, Corley & Hamilton 2013), 10.1191/1478088706qp063oa (Braun & Clarke 2006), 10.5465/amr.2009.0486 (Corley & Gioia 2011). Each RDF record has: rdf_id, stage, type:'SURGEON', options (>=2), chosen (one of options), rationale, citations_used (array), pool_id, citation_status ('pool_selected'|'partial'|'none_gut_feeling'), gut_rationale (string or null; required when none_gut_feeling). Call aqrp_step_run({step:3, payload:{coding_brief, notes, rdf_records}}).

STEP 4 (Open coding): Obtain the independent coder sets by calling llm_assistant_panel_batch with the corpus records and the coding_brief. It returns {panel, n, responses}, where responses is n complete sets, each carrying coder_id and rows. Submit the panel output as the step payload: aqrp_step_run({step: 4, payload: {panel_result: <the panel output>}}). The tool folds the sets into code_matrix and disagreements, and returns OPEN_CODING_COMPLETE.

STEP-CLOSE RULE: a step closes only when aqrp_step_run returns {"status":"step_complete","step":N}. If it errors, report the exact error verbatim and stop.

AFTER THE LAST STEP NAMED IN THE REQUEST: write a final reply listing the steps completed and the output file names (__aqrp_stepN_out.json).`;
module.exports = {
  recipeId: 'aqrp',
  name: 'Automated Qualitative Research Pipeline',
  interactive: false,
  tools: ['aqrp_step_run'],
  prompt: PROMPT,
  policy: { systemPrompt: 'Route to SURGERY any request carrying a JSON corpus.', fileRouting: 'surgery', fileExtensions: ['json'], allowedRoutes: ['SURGERY'], maxTokens: 65536, timeoutMs: 300000, failureMode: 'throw' },
  workflow: { uninterruptedIterations: 80, maxDirectorIterations: 1 },
};
