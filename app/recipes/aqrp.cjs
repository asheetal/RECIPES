'use strict';
const PROMPT = `SEARCH_MODE: academic. AQRP is a stepwise qualitative pipeline. Execute the steps named in the request, in order, one aqrp_step_run per step.

RDF RECORD = {rdf_id, stage, type:'SURGEON', options (>=2 strings), chosen (one of options), rationale, citations_used (DOIs), pool_id, citation_status ('pool_selected'|'partial'|'none_gut_feeling'), gut_rationale (string or null; required when none_gut_feeling)}.
POOL = {pool_id, query, n_returned, top_k:[{authors (string array), year (int), title, journal, doi ('10.'-prefixed)}], ranking_rule:'0.6*relevance + 0.3*log(1+citations) + 0.1*recency'}.

STEP 1 (tool): aqrp_step_run({step:1, file_id:"<attached file_id>"}).

STEP 2 (surgeon->tool): From step 1's sample_records, name 2-5 topical domains (plain nouns). Search the literature for those domains. aqrp_step_run({step:2, payload:{topics:[...], P01:{pool_id:'P01', query, n_returned, top_k, ranking_rule}}}).

STEP 3 (surgeon): From steps 1-2 write notes (a >=600-character familiarization memo: what the corpus is about, contrasts, tensions, uncertainties, questions) and coding_brief {code_for: NON-EMPTY array of non-blank strings (e.g. ['governance','identity','amplification']), ignore: array of strings, flag: array of strings, granularity: string}. Emit RDF R3 (scope, pool P01) and R3a (granularity, pool P00, must cite one of: 10.1177/1094428112452151, 10.1191/1478088706qp063oa, 10.5465/amr.2009.0486). aqrp_step_run({step:3, payload:{coding_brief, notes, rdf_records:[R3,R3a]}}).

STEP 4 (surgeon->coder): Call llm_assistant_panel_batch with file_id and coding_brief. Submit aqrp_step_run({step:4, payload:{panel_result:{panel,n,responses}}}).

STEP 5 (surgeon->tool): From code_matrix and disagreements, search the literature for sources that inform memo hunches. aqrp_step_run({step:5, payload:{P02:{...POOL with pool_id 'P02'...}}}).

STEP 6 (surgeon): From code_matrix, disagreements, P02, rank salient hunches (salience_ranking) and write analytical memos (memos). Emit RDF R6 (pool P02). aqrp_step_run({step:6, payload:{salience_ranking, memos, rdf_records:[R6]}}).

STEP 7 (surgeon->tool): From salience_ranking search the literature for RQ framings. aqrp_step_run({step:7, payload:{P03}}).
STEP 8 (surgeon): From salience_ranking and P03 formulate a research question (rq). Emit RDF R8 (pool P03). aqrp_step_run({step:8, payload:{rq, rdf_records:[R8]}}).

STEP 9 (surgeon->tool): From rq search the literature to map prior work. aqrp_step_run({step:9, payload:{lit_map, P04}}).
STEP 10 (surgeon): From rq, lit_map, P04 propose >=3 candidate theoretical lenses (candidate_lenses). Emit RDF R10 (pool P04). aqrp_step_run({step:10, payload:{candidate_lenses, rdf_records:[R10]}}).

STEP 11 (surgeon->tool): From candidate_lenses search the literature for each lens. aqrp_step_run({step:11, payload:{P05}}).
STEP 12 (surgeon): From candidate_lenses, lit_map, P05 select one framing (chosen_framing) with a comparison table (framing_comparison) scoring coverage x novelty x negative-case fit. Emit RDF R12 (pool P05). aqrp_step_run({step:12, payload:{chosen_framing, framing_comparison, rdf_records:[R12]}}).

STEP 13 (tool): aqrp_step_run({step:13, payload:{code_matrix}}).

STEP 14 (surgeon->tool): From merge_candidates and chosen_framing search the literature for codebook precedents. aqrp_step_run({step:14, payload:{P06}}).
STEP 15 (surgeon): From merge_candidates, chosen_framing, P06 produce a codebook. Emit RDF R15 (pool P06). aqrp_step_run({step:15, payload:{codebook, rdf_records:[R15]}}).

STEP 16 (surgeon->coder): Call llm_assistant_panel_batch with corpus and codebook to code each case as a narrative (within_case). aqrp_step_run({step:16, payload:{panel_result}}).
STEP 17 (surgeon->coder): Call llm_assistant_panel_batch with within_case to compare across cases (cross_case). aqrp_step_run({step:17, payload:{panel_result}}).

STEP 18 (surgeon->tool): From cross_case and codebook search the literature for themes. aqrp_step_run({step:18, payload:{P07}}).
STEP 19 (surgeon): From cross_case, codebook, P07 cluster into themes at k=5/7/9 (themes_k). Emit RDF R19 (pool P07). aqrp_step_run({step:19, payload:{themes_k, rdf_records:[R19]}}).

STEP 20 (surgeon->tool): From themes_k search the literature for novelty assessment. aqrp_step_run({step:20, payload:{P08}}).
STEP 21 (surgeon): From themes_k, P08 evaluate novelty per theme (retain / reframe / drop) as novelty_map. Emit RDF R21 (pool P08). aqrp_step_run({step:21, payload:{novelty_map, rdf_records:[R21]}}).

STEP 22 (surgeon->coder): Call llm_assistant_panel_batch with themes_k and novelty_map to log negative cases (negative_case_log). After the panel returns, also produce negative_case_resolution: for each negative case, {record_id, changes_dimension:'yes'|'no'|'downgrade', why}. aqrp_step_run({step:22, payload:{panel_result, negative_case_resolution}}).

STEP 23 (surgeon->tool): From themes_k and negative_case_log search the literature for aggregation. aqrp_step_run({step:23, payload:{P09}}).
STEP 24 (surgeon): From themes_k, negative_case_log, P09 aggregate into 2-4 dimensions. Each dimension MUST have: name, mechanism, tension, conditions_for (array of at least 2 strings describing when the mechanism holds), conditions_against (array of at least 1 string describing when it fails or reverses), relationships (array of {from:dimension_name, to:dimension_name, nature:string}), supporting_record_ids (array), opposing_record_ids (array). Emit RDF R24 (pool P09). aqrp_step_run({step:24, payload:{dimensions, rdf_records:[R24]}}).

STEP 25 (surgeon->tool): From dimensions search the literature for theoretical models. aqrp_step_run({step:25, payload:{P10}}).
STEP 26 (surgeon): From dimensions and P10 draft a grounded model as model_draft. model_draft MUST have: arrows (array of strings), phases (array of strings), tension (string), evidence (array of {arrow:string, supporting_record_ids:array, quotes:array}), alternative_readings (array of {reading:string, why_rejected:string}). Emit RDF R26 (pool P10). aqrp_step_run({step:26, payload:{model_draft, rdf_records:[R26]}}).

STEP 27 (surgeon->tool): From model_draft and dimensions search the literature for diagram conventions. aqrp_step_run({step:27, payload:{P11}}).
STEP 28 (surgeon): From model_draft, dimensions, P11 produce diagram_script_params (nodes, paths, labels, layout). Emit RDF R28 (pool P11). aqrp_step_run({step:28, payload:{diagram_script_params, rdf_records:[R28]}}).

STEP 29 (surgeon->tool): From rdf_log and code_matrix search the literature for sufficiency criteria. aqrp_step_run({step:29, payload:{P12}}).
STEP 30 (surgeon): From rdf_log and P12 decide sufficiency (stop / continue) with rationale. sufficiency MUST have: decision ('stop'|'continue'), rationale (string), saturation_estimate ({record_index_at_which_novel_codes_stopped:integer, evidence:string}). Emit RDF R30 (pool P12). aqrp_step_run({step:30, payload:{sufficiency, rdf_records:[R30]}}).

STEP 31 (surgeon->tool): From model_draft and novelty_map search the literature for reporting conventions. aqrp_step_run({step:31, payload:{P13}}).

STEP 32 (surgeon): Write the paper as LaTeX source and emit RDF R32. Payload MUST be {submission_paper_tex, rdf_records:[R32]} — if you have already drafted the paper, resubmit the same submission_paper_tex plus rdf_records array containing exactly one record: R32 = {rdf_id:'R32', stage:'final_packaging', type:'SURGEON', options:[at least 2], chosen, rationale, citations_used:[from P13], pool_id:'P13', citation_status, gut_rationale:null}. The paper orders RQ -> literature -> methods -> findings, cites P13, and does not mention RDFs. R32 (pool P13) records the ordering and the suppression decision. aqrp_step_run({step:32, payload:{submission_paper_tex, rdf_records:[R32]}}).

AFTER THE LAST STEP NAMED IN THE REQUEST: reply with a list of completed steps and their output file names (__aqrp_stepN_out.json).
`;
module.exports = {
  recipeId: 'aqrp',
  name: 'Automated Qualitative Research Pipeline',
  interactive: false,
  tools: ['aqrp_step_run'],
  prompt: PROMPT,
  policy: { systemPrompt: 'Route to SURGERY any request carrying a JSON corpus.', fileRouting: 'surgery', fileExtensions: ['json'], allowedRoutes: ['SURGERY'], maxTokens: 65536, timeoutMs: 300000, failureMode: 'throw' },
  workflow: { uninterruptedIterations: 200, maxDirectorIterations: 1 },
};
