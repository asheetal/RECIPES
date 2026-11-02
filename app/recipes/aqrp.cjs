'use strict';
const PROMPT = `SEARCH_MODE: academic. AQRP is a stepwise qualitative pipeline. Execute the steps named in the request, in order, one aqrp_step_run per step.

payload is a NATIVE JSON object — do NOT pass it as a stringified JSON string. Emit payload:{...} directly inside aqrp_step_run arguments, NOT as a quoted string.

RDF RECORD = {rdf_id, stage, type:'SURGEON', options (>=2 strings), chosen (one of options), rationale, citations_used (DOIs that MUST appear in the declared pool_id's top_k — cross-pool citations are forbidden except in R3a where P00 permits methodology DOIs 10.1177/1094428112452151, 10.1191/1478088706qp063oa, 10.5465/amr.2009.0486), pool_id, citation_status ('pool_selected'|'partial'|'none_gut_feeling'), gut_rationale (string or null; required when none_gut_feeling)}.
POOL = {pool_id, query, n_returned, top_k:[{authors (string array), year (int), title, journal, doi ('10.'-prefixed), __key (string)}], ranking_rule:'0.6*relevance + 0.3*log(1+citations) + 0.1*recency'}.

CITATION KEYS: Every record returned by the search tool carries a __key field. When you copy a record into P01/P02/P03/P04/P05/P06/P07/P08/P09/P10/P11/P12/P13.top_k, preserve __key unchanged. In submission_paper_tex, every \citep{...} and \citet{...} must use the record's __key verbatim — do NOT use author-year, DOI, or any other identifier as a cite key.

STEP 1 (tool): aqrp_step_run({step:1, file_id:"<attached file_id>"}).

STEP 2 (surgeon->tool): This step REQUIRES TWO tool calls, in order. (a) FIRST, call the search tool with SEARCH_MODE academic on the topical domains you named from step 1's sample_records (2-5 plain-noun topics such as 'AI futures', 'identity', 'governance'). Retrieve real DOIs from the search results — you may NOT invent DOIs. (b) SECOND, call aqrp_step_run({step:2, payload:{topics:[...], P01:{pool_id:'P01', query:'<the query you passed to search>', n_returned:<integer from search result>, top_k:[{authors:[...], year:<int>, title:'...', journal:'...', doi:'10.xxxx/...'}, ...], ranking_rule:'0.6*relevance + 0.3*log(1+citations) + 0.1*recency'}}}). Do NOT call aqrp_step_run({step:2}) alone — payload is MANDATORY; calling with only {plan, step:2} will abort the run via OPD with 'Received tool input did not match expected schema'.

STEP 3 (surgeon): From steps 1-2 write notes (a >=600-character familiarization memo: what the corpus is about, contrasts, tensions, uncertainties, questions) and coding_brief {code_for: NON-EMPTY array of non-blank strings (e.g. ['governance','identity','amplification']), ignore: array of strings, flag: array of strings, granularity: string}. Emit exactly two RDF records, each with ALL fields: {rdf_id, stage, type:'SURGEON', options (>=2 strings), chosen (one of options), rationale (non-empty string), citations_used (array), pool_id, citation_status, gut_rationale}. R3 = {rdf_id:'R3', stage:'familiarization', type:'SURGEON', options:[>=2], chosen, rationale, citations_used:[subset of DOIs from P01.top_k that informed the scope — MUST be a subset of P01.top_k[].doi; do NOT cite any DOI not in P01.top_k], pool_id:'P01', citation_status:'pool_selected', gut_rationale:null}. R3a = {rdf_id:'R3a', stage:'familiarization', type:'SURGEON', options:[>=2], chosen, rationale, citations_used:[exactly one of 10.1177/1094428112452151, 10.1191/1478088706qp063oa, 10.5465/amr.2009.0486], pool_id:'P00', citation_status:'pool_selected', gut_rationale:null}. Do NOT omit citation_status. aqrp_step_run({step:3, payload:{coding_brief, notes, rdf_records:[R3,R3a]}}).

STEP 4 (surgeon->coder): Call llm_assistant_panel_batch with file_id and coding_brief. Submit aqrp_step_run({step:4, payload:{panel_result:{panel,n,responses}}}).

STEP 5 (surgeon->tool): From code_matrix and disagreements, search the literature for sources that inform memo hunches. aqrp_step_run({step:5, payload:{P02:{...POOL with pool_id 'P02'...}}}).

STEP 6 (surgeon): From code_matrix, disagreements, P02, rank salient hunches (salience_ranking) and write analytical memos (memos). Emit RDF R6 (pool P02). R6.citations_used MUST be a subset of the DOIs in P02.top_k[].doi — do NOT cite any DOI that you did not promote into P02.top_k at step 5, even if it appeared in search results. aqrp_step_run({step:6, payload:{salience_ranking, memos, rdf_records:[R6]}}).

STEP 7 (surgeon->tool): From salience_ranking search the literature for RQ framings. aqrp_step_run({step:7, payload:{P03}}).
STEP 8 (surgeon): From salience_ranking and P03 formulate a research question (rq). Emit RDF R8 (pool P03). R8.citations_used MUST be a subset of the DOIs in P03.top_k[].doi — do NOT cite any DOI that you did not promote into P03.top_k at step 7, even if it appeared in search results. aqrp_step_run({step:8, payload:{rq, rdf_records:[R8]}}).

STEP 9 (surgeon->tool): From rq search the literature to map prior work. lit_map MUST have exactly this shape: {clusters:[{label:string, works:[string]}], gaps:[string]}. Each clusters[].works entry is a DOI (10. prefix) of a paper you promoted into P04.top_k; each clusters[].label is a short thematic label; gaps is a list of strings naming what prior work leaves open. aqrp_step_run({step:9, payload:{lit_map, P04}}).
STEP 10 (surgeon): From rq, lit_map, P04 propose at least 3 candidate theoretical lenses (candidate_lenses). Emit RDF R10 (pool_id='P04', citation_status='pool_selected', gut_rationale=null). R10.citations_used MUST be a subset of the DOIs in P04.top_k[].doi — do NOT cite any DOI that you did not promote into P04.top_k at step 9, even if it appeared in search results. R10 must include all RDF fields: {rdf_id:'R10', stage:'lensing', type:'SURGEON', options (>=2 strings), chosen (one of options), rationale, citations_used (subset of P04.top_k DOIs), pool_id:'P04', citation_status:'pool_selected', gut_rationale:null}. aqrp_step_run({step:10, payload:{candidate_lenses, rdf_records:[R10]}}).

STEP 11 (surgeon->tool): From candidate_lenses search the literature for each lens. aqrp_step_run({step:11, payload:{P05}}).
STEP 12 (surgeon): From candidate_lenses, lit_map, P05 select one framing (chosen_framing) with a comparison table (framing_comparison) scoring coverage x novelty x negative-case fit. Emit RDF R12 (pool P05). R12.citations_used MUST be a subset of the DOIs in P05.top_k[].doi — do NOT cite any DOI that you did not promote into P05.top_k at step 11, even if it appeared in search results. aqrp_step_run({step:12, payload:{chosen_framing, framing_comparison, rdf_records:[R12]}}).

STEP 13 (tool): No payload required. Call aqrp_step_run({step:13}). The tool assembles the merged code matrix from your own step-4 output and writes step13_out.json. Do NOT include payload:{code_matrix} — it will be rejected by the schema refine.

STEP 14 (surgeon->tool): From merge_candidates and chosen_framing search the literature for codebook precedents. aqrp_step_run({step:14, payload:{P06}}).
STEP 15 (surgeon): From merge_candidates, chosen_framing, P06 produce a codebook. Emit RDF R15 (pool P06). R15.citations_used MUST be a subset of the DOIs in P06.top_k[].doi — do NOT cite any DOI that you did not promote into P06.top_k at step 14, even if it appeared in search results. aqrp_step_run({step:15, payload:{codebook, rdf_records:[R15]}}).

STEP 16 (surgeon->coder): Call llm_assistant_panel_batch with schema {type:'object', properties:{record_id:{type:'string'}, narrative:{type:'string'}, codes:{type:'array', items:{type:'string'}}}, required:['record_id','narrative','codes']} and query asking for a 40-80-word within-case narrative per record summarizing what the codebook codes reveal about that record's framing. Each response row MUST have a non-empty narrative field (at least 40 characters) — do NOT pass the step-4 open-coding schema {record_id,codes,quote}; step 16 requires narratives. aqrp_step_run({step:16, payload:{panel_result}}).
STEP 17 (surgeon->coder): Call llm_assistant_panel_batch with within_case to compare across cases (cross_case). aqrp_step_run({step:17, payload:{panel_result}}).

STEP 18 (surgeon->tool): From cross_case and codebook search the literature for themes. aqrp_step_run({step:18, payload:{P07}}).
STEP 19 (surgeon): From cross_case, codebook, P07 cluster into themes at k=5/7/9 (themes_k). Emit RDF R19 (pool P07). R19.citations_used MUST be a subset of the DOIs in P07.top_k[].doi — do NOT cite any DOI that you did not promote into P07.top_k at step 18, even if it appeared in search results. aqrp_step_run({step:19, payload:{themes_k, rdf_records:[R19]}}).

STEP 20 (surgeon->tool): From themes_k search the literature for novelty assessment. aqrp_step_run({step:20, payload:{P08}}).
STEP 21 (surgeon): From themes_k, P08 evaluate novelty per theme (retain / reframe / drop) as novelty_map. Emit RDF R21 (pool P08). R21.citations_used MUST be a subset of the DOIs in P08.top_k[].doi — do NOT cite any DOI that you did not promote into P08.top_k at step 20, even if it appeared in search results. aqrp_step_run({step:21, payload:{novelty_map, rdf_records:[R21]}}).

STEP 22 (surgeon->coder): Call llm_assistant_panel_batch with schema {type:'object', properties:{record_id:{type:'string'}, narrative:{type:'string'}, changes_dimension:{type:'string', enum:['yes','no','downgrade']}, why:{type:'string'}}, required:['record_id','narrative','changes_dimension','why']} and query asking for each record 0-9 to be evaluated against the five themes; if the record contradicts or fails to fit a theme, changes_dimension='yes' (theme needs adding), 'downgrade' (theme needs weakening), or 'no' (no change to theme). narrative explains the record's framing in 40-80 words; why explains the negative-case call. Do NOT pass the step-16 {record_id,narrative,codes} schema — step 22 records a dimension change per negative case, not codes. After the panel returns, forward its panel_result unchanged as payload.panel_result. Then also produce payload.negative_case_resolution as an array of {record_id, changes_dimension, why} summaries drawn from the panel rows. aqrp_step_run({step:22, payload:{panel_result, negative_case_resolution}}).

STEP 23 (surgeon->tool): From themes_k and negative_case_log search the literature for aggregation. aqrp_step_run({step:23, payload:{P09}}).
STEP 24 (surgeon): From themes_k, negative_case_log, P09 aggregate into 2-4 dimensions. Each dimension MUST have: name, mechanism, tension, conditions_for (array of at least 2 strings describing when the mechanism holds), conditions_against (array of at least 1 string describing when it fails or reverses), relationships (array of {from:dimension_name, to:dimension_name, nature:string}), supporting_record_ids (array), opposing_record_ids (array). Emit RDF R24 (pool P09). R24.citations_used MUST be a subset of the DOIs in P09.top_k[].doi — do NOT cite any DOI that you did not promote into P09.top_k at step 23, even if it appeared in search results. aqrp_step_run({step:24, payload:{dimensions, rdf_records:[R24]}}).

STEP 25 (surgeon->tool): From dimensions search the literature for theoretical models. aqrp_step_run({step:25, payload:{P10}}).
STEP 26 (surgeon): From dimensions and P10 draft a grounded model as model_draft. model_draft MUST have: arrows (array of strings), phases (array of strings), tension (string), evidence (array of {arrow:string, supporting_record_ids:array, quotes:array}), alternative_readings (array of {reading:string, why_rejected:string}). Emit RDF R26 (pool P10). R26.citations_used MUST be a subset of the DOIs in P10.top_k[].doi — do NOT cite any DOI that you did not promote into P10.top_k at step 25, even if it appeared in search results. aqrp_step_run({step:26, payload:{model_draft, rdf_records:[R26]}}).

STEP 27 (surgeon->tool): From model_draft and dimensions search the literature for diagram conventions. aqrp_step_run({step:27, payload:{P11}}).
STEP 28 (surgeon): From model_draft, dimensions, P11 produce diagram_script_params (nodes, paths, labels, layout). Emit RDF R28 (pool P11). R28.citations_used MUST be a subset of the DOIs in P11.top_k[].doi — do NOT cite any DOI that you did not promote into P11.top_k at step 27, even if it appeared in search results. aqrp_step_run({step:28, payload:{diagram_script_params, rdf_records:[R28]}}).

STEP 29 (surgeon->tool): From rdf_log and code_matrix search the literature for sufficiency criteria. aqrp_step_run({step:29, payload:{P12}}).
STEP 30 (surgeon): From rdf_log and P12 decide sufficiency (stop / continue) with rationale. sufficiency MUST have: decision ('stop'|'continue'), rationale (string), saturation_estimate ({record_index_at_which_novel_codes_stopped:integer, evidence:string}). Emit RDF R30 (pool P12). R30.citations_used MUST be a subset of the DOIs in P12.top_k[].doi — do NOT cite any DOI that you did not promote into P12.top_k at step 29, even if it appeared in search results. aqrp_step_run({step:30, payload:{sufficiency, rdf_records:[R30]}}).

STEP 31 (surgeon->tool): From model_draft and novelty_map search the literature for reporting conventions. aqrp_step_run({step:31, payload:{P13}}).

STEP 32 (surgeon): Write the paper as LaTeX source and emit RDF R32. Payload MUST be {submission_paper_tex, rdf_records:[R32]} — if you have already drafted the paper, resubmit the same submission_paper_tex plus rdf_records array containing exactly one record: R32 = {rdf_id:'R32', stage:'final_packaging', type:'SURGEON', options:[at least 2], chosen, rationale, citations_used:[from P13], pool_id:'P13', citation_status, gut_rationale:null}. The paper orders RQ -> literature -> methods -> findings, cites P13, and does not mention RDFs. R32 (pool P13) records the ordering and the suppression decision. R32.citations_used MUST be a subset of the DOIs in P13.top_k[].doi — do NOT cite any DOI that you did not promote into P13.top_k at step 31, even if it appeared in search results. aqrp_step_run({step:32, payload:{submission_paper_tex, rdf_records:[R32]}}).

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
