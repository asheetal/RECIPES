'use strict';
const schemaLoader = require('../aqrp-feature/schema-loader.cjs');

function getCall(step) {
  return `aqrp_step_run(${schemaLoader.getStepInvocationSignature(step)}) — Schema contract: ${schemaLoader.getStepContract(step)}`;
}

const PROMPT = `SEARCH_MODE: academic. AQRP is a stepwise qualitative pipeline. Execute the steps named in the request, in order, one aqrp_step_run per step.

payload is a NATIVE JSON object — do NOT pass it as a stringified JSON string. Emit payload:{...} directly inside aqrp_step_run arguments, NOT as a quoted string.

RDF RECORD = {rdf_id, stage, type:'SURGEON', options (>=2 strings), chosen (one of options), rationale, citations_used (DOIs that MUST appear in the declared pool_id's top_k — cross-pool citations are forbidden except in R3a where P00 permits methodology DOIs 10.1177/1094428112452151, 10.1191/1478088706qp063oa, 10.5465/amr.2009.0486), pool_id, citation_status ('pool_selected'|'partial'|'none_gut_feeling'), gut_rationale (string or null; required when none_gut_feeling)}.
POOL = {pool_id, query, n_returned, top_k:[{authors (string array), year (int), title, journal, doi ('10.'-prefixed), __key (string)}], ranking_rule:'0.6*relevance + 0.3*log(1+citations) + 0.1*recency'}.

CITATION KEYS: Every record returned by the search tool carries __key (LaTeX-safe, canonical). Copy it into top_k[].__key verbatim. At step 32, cite with __key. Assume present — missing __key is a fatal search-layer bug and the boundary will refuse.

STEP 1 (tool): ${getCall(1)}.

STEP 2 (surgeon->tool): This step REQUIRES TWO tool calls, in order. (a) FIRST, call the search tool with SEARCH_MODE academic on the topical domains you named from step 1's sample_records (2-5 plain-noun topics such as 'AI futures', 'identity', 'governance'). Retrieve real DOIs from the search results — you may NOT invent DOIs. (b) SECOND, call ${getCall(2)}. Do NOT call aqrp_step_run({step:2}) alone — payload is MANDATORY; calling with only {plan, step:2} will abort the run via OPD with 'Received tool input did not match expected schema'.

STEP 3 (surgeon): From steps 1-2 write notes (a >=600-character familiarization memo: what the corpus is about, contrasts, tensions, uncertainties, questions) and coding_brief {code_for: NON-EMPTY array of non-blank strings (e.g. ['governance','identity','amplification']), ignore: array of strings, flag: array of strings, granularity: string}. Emit exactly two RDF records, each with ALL fields: {rdf_id, stage, type:'SURGEON', options (>=2 strings), chosen (one of options), rationale (non-empty string), citations_used (array), pool_id, citation_status, gut_rationale}. R3 = {rdf_id:'R3', stage:'familiarization', type:'SURGEON', options:[>=2], chosen, rationale, citations_used:[subset of DOIs from P01.top_k that informed the scope — MUST be a subset of P01.top_k[].doi; do NOT cite any DOI not in P01.top_k], pool_id:'P01', citation_status:'pool_selected', gut_rationale:null}. R3a = {rdf_id:'R3a', stage:'familiarization', type:'SURGEON', options:[>=2], chosen, rationale, citations_used:[exactly one of 10.1177/1094428112452151, 10.1191/1478088706qp063oa, 10.5465/amr.2009.0486], pool_id:'P00', citation_status:'pool_selected', gut_rationale:null}. Do NOT omit citation_status. ${getCall(3)}.

STEP 4 (surgeon->coder): Call llm_assistant_panel_batch FIRST with schema ${JSON.stringify(schemaLoader.getPanelBatchSchema(4))}. Query asking for 2-5 codes per record drawn from coding_brief.code_for, avoiding ignore items and flagging flag items, plus a verbatim quote from the record as evidence. Submit {query, schema} ONLY — do NOT pass records, do NOT pass file_id; within a run the batch reads run.fileId and ignores caller-supplied records (audited as batch_ignored_records). FORWARD the tool's return verbatim as payload.panel_result. Then call ${getCall(4)}. Do NOT synthesize panel_result from any state.

STEP 5 (surgeon->tool): FIRST, call search() with a specific academic query on your memo hunches. SECOND, build P02 from those fresh search results. Do NOT reuse P01. ${getCall(5)}.

STEP 6 (surgeon): From code_matrix, disagreements, P02, rank salient hunches into salience_ranking (array of {hunch:string, rank:integer, evidence:string}) and write analytical memos into memos (array of {hunch:string, memo:string}). Emit RDF R6 (pool P02). R6.citations_used MUST be a subset of the DOIs in P02.top_k[].doi — do NOT cite any DOI that you did not promote into P02.top_k at step 5, even if it appeared in search results. ${getCall(6)}.

STEP 7 (surgeon->tool): FIRST, call search() with an academic query on RQ framings for the top hunches. SECOND, build P03 from the fresh results. Do NOT reuse prior pools. ${getCall(7)}.
STEP 8 (surgeon): From salience_ranking and P03 formulate a research question into rq (array of {main:string, sub:string[]}). Emit RDF R8 (pool P03). R8.citations_used MUST be a subset of the DOIs in P03.top_k[].doi — do NOT cite any DOI that you did not promote into P03.top_k at step 7, even if it appeared in search results. ${getCall(8)}.

STEP 9 (surgeon->tool): FIRST, call search() with an academic query addressing prior work and theoretical mechanisms for your RQ. SECOND, build P04 from the fresh results. lit_map MUST have exactly this shape: {clusters:[{label:string, works:[string]}], gaps:[string]}. Each clusters[].works entry is a DOI from P04.top_k. Do NOT reuse prior pools. ${getCall(9)}.
STEP 10 (surgeon): From rq, lit_map, P04 propose at least 3 candidate theoretical lenses into candidate_lenses (array of {lens:string, fit:string}). Emit RDF R10 (pool_id='P04', citation_status='pool_selected', gut_rationale=null). R10.citations_used MUST be a subset of the DOIs in P04.top_k[].doi — do NOT cite any DOI that you did not promote into P04.top_k at step 9, even if it appeared in search results. R10 must include all RDF fields: {rdf_id:'R10', stage:'lensing', type:'SURGEON', options (>=2 strings), chosen (one of options), rationale, citations_used (subset of P04.top_k DOIs), pool_id:'P04', citation_status:'pool_selected', gut_rationale:null}. ${getCall(10)}.

STEP 11 (surgeon->tool): FIRST, call search() with an academic query comparing your candidate theoretical lenses. SECOND, build P05 from the fresh results. Do NOT reuse prior pools. ${getCall(11)}.
STEP 12 (surgeon): From candidate_lenses, lit_map, P05 select one framing as chosen_framing (non-empty string) with framing_comparison (array of at least 3 items: {lens:string, coverage:number, novelty:number, negative_case_fit:number, total_score:number}). Emit RDF R12 (pool P05). R12.citations_used MUST be a subset of the DOIs in P05.top_k[].doi — do NOT cite any DOI that you did not promote into P05.top_k at step 11, even if it appeared in search results. ${getCall(12)}.

STEP 13 (tool): No payload required. Call ${getCall(13)}. The tool assembles the merged code matrix from your own step-4 output and writes step13_out.json. Do NOT include payload:{code_matrix} — it will be rejected by the schema refine.

STEP 14 (surgeon->tool): FIRST, call search() with an academic query on qualitative codebooks for your chosen lens. SECOND, build P06 from the fresh results. Do NOT reuse prior pools. ${getCall(14)}.
STEP 15 (surgeon): From merge_candidates, chosen_framing, P06 produce codebook (array of {code:string, definition:string, applies_when:string, example:string}). Emit RDF R15 (pool P06). R15.citations_used MUST be a subset of the DOIs in P06.top_k[].doi — do NOT cite any DOI that you did not promote into P06.top_k at step 14, even if it appeared in search results. ${getCall(15)}.

STEP 16 (surgeon->coder): Call llm_assistant_panel_batch with schema ${JSON.stringify(schemaLoader.getPanelBatchSchema(16))} and query asking for a 40-80-word within-case narrative per record summarizing what the codebook codes reveal about that record's framing. FORWARD the tool's return verbatim as payload.panel_result. Then call ${getCall(16)}.
STEP 17 (surgeon->coder): Call llm_assistant_panel_batch FIRST with schema ${JSON.stringify(schemaLoader.getPanelBatchSchema(17))} and query asking for a 40-80-word cross-case narrative per record comparing that record's framing against the other records' framings. FORWARD the tool's return verbatim as payload.panel_result. Then call ${getCall(17)}. Do NOT synthesize panel_result from within_case_matrix or any other state — _verifyBatchCall rejects any step-17 output whose aqrp_batch_calls marker is missing.

STEP 18 (surgeon->tool): FIRST, call search() with an academic query on thematic dimensions for your domain. SECOND, build P07 from the fresh results. Do NOT reuse prior pools. ${getCall(18)}.
STEP 19 (surgeon): From within_case_matrix, cross_case_matrix, P07 aggregate codes into candidate theme sets at k=5, k=7, k=9 into themes_k conforming strictly to the schema contract (each entry in k5, k7, and k9 must be an object: {name:string, records:string[], evidence:string}). Emit RDF R19 (pool P07). R19.citations_used MUST be a subset of the DOIs in P07.top_k[].doi — do NOT cite any DOI that you did not promote into P07.top_k at step 18, even if it appeared in search results. ${getCall(19)}.

STEP 20 (surgeon->tool): FIRST, call search() with an academic query comparing candidate themes against prior literature. SECOND, build P08 from the fresh results. Do NOT reuse prior pools. ${getCall(20)}.
STEP 21 (surgeon): From themes_k, lit_map, P08 classify each theme's novelty and emit novelty_map (array of {theme:string, decision:'retain'|'reframe'|'drop', rationale:string}). Emit RDF R21 (pool P08). R21.citations_used MUST be a subset of the DOIs in P08.top_k[].doi — do NOT cite any DOI that you did not promote into P08.top_k at step 20, even if it appeared in search results. ${getCall(21)}.

STEP 22 (surgeon->coder): Call llm_assistant_panel_batch with schema ${JSON.stringify(schemaLoader.getPanelBatchSchema(22))} and query asking for negative cases and boundary conditions against the retained themes. FORWARD the tool's return verbatim as payload.panel_result. Then call ${getCall(22)}.

STEP 23 (surgeon->tool): FIRST, call search() with an academic query on theoretical dimensions uniting your retained themes. SECOND, build P09 from the fresh results. Do NOT reuse prior pools. ${getCall(23)}.
STEP 24 (surgeon): From novelty_map, negative_case_matrix, P09 group retained themes into second-order theoretical dimensions into dimensions conforming strictly to the schema contract ({name, mechanism, tension, conditions_for, conditions_against, relationships, supporting_record_ids, opposing_record_ids}[]). Emit RDF R24 (pool P09). R24.citations_used MUST be a subset of the DOIs in P09.top_k[].doi — do NOT cite any DOI that you did not promote into P09.top_k at step 23, even if it appeared in search results. ${getCall(24)}.

STEP 25 (surgeon->tool): FIRST, call search() with an academic query on dynamic process models connecting your dimensions. SECOND, build P10 from the fresh results. Do NOT reuse prior pools. ${getCall(25)}.
STEP 26 (surgeon): From dimensions, negative_case_matrix, P10 construct the process model into model_draft conforming strictly to the schema contract ({name, summary, tension, phases, arrows, propositions, evidence, alternative_readings}). Emit RDF R26 (pool P10). R26.citations_used MUST be a subset of the DOIs in P10.top_k[].doi — do NOT cite any DOI that you did not promote into P10.top_k at step 25, even if it appeared in search results. ${getCall(26)}.

STEP 27 (surgeon->tool): FIRST, call search() with an academic query on visual conventions for process models in your chosen framing. SECOND, build P11 from the fresh results. Do NOT reuse prior pools. ${getCall(27)}.
STEP 28 (surgeon): From model_draft, P11 specify diagram parameters into diagram_script_params conforming strictly to the schema contract ({nodes, labels, paths:[{from, to, nature}], layout}). Emit RDF R28 (pool P11). R28.citations_used MUST be a subset of the DOIs in P11.top_k[].doi — do NOT cite any DOI that you did not promote into P11.top_k at step 27, even if it appeared in search results. ${getCall(28)}.

STEP 29 (surgeon->tool): FIRST, call search() with an academic query on theoretical saturation in your specific qualitative genre. SECOND, build P12 from the fresh results. Do NOT reuse prior pools. ${getCall(29)}.
STEP 30 (surgeon): From model_draft, codebook, within_case_matrix, cross_case_matrix, P12 evaluate saturation into sufficiency ({decision:'stop'|'continue', rationale:string, saturation_estimate:{record_index_at_which_novel_codes_stopped:integer, evidence:string}}). Emit RDF R30 (pool P12). R30.citations_used MUST be a subset of the DOIs in P12.top_k[].doi — do NOT cite any DOI that you did not promote into P12.top_k at step 29, even if it appeared in search results. ${getCall(30)}.

STEP 31 (surgeon->tool): FIRST, call search() with an academic query on final paper positioning in target journals. SECOND, build P13 from the fresh results. Do NOT reuse prior pools. ${getCall(31)}.
STEP 32 (surgeon): Final packaging and artifact generation. Payload MUST be {rdf_records:[R32]} — emit exactly one RDF record: R32 = {rdf_id:'R32', stage:'final_packaging', type:'SURGEON', options:[at least 2], chosen, rationale, citations_used:[from P13], pool_id:'P13', citation_status:'pool_selected', gut_rationale:null}. The backend pipeline automatically synthesizes all upstream steps and citations into the modular LaTeX report (aqrp_report.tex, aqrp_report_body.tex, aqrp_report.bib). R32 records the packaging and structural decisions. R32.citations_used MUST be a subset of the DOIs in P13.top_k[].doi. ${getCall(32)}.

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
