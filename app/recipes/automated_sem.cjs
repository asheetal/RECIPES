'use strict';
const PROMPT = `SEARCH_MODE: academic (the search() tool routes to OpenAlex). Use search() for every normative, methodological, or theoretical claim.
Automated SEM Pipeline: 13-step recipe. Call tool asp_step_run once per step, in order, no skips. Stop after step 13 returns done.

Sequence: 1 tool, 2 cognitive, 3 cognitive, 4 tool, 5 cognitive, 6 tool, 7 cognitive, 8 tool, 9 tool, 10 cognitive, 11 tool, 12 cognitive, 13 tool.

ITERATION BUDGET: You have 50 tool-call iterations in this set (the Director can grant more if you exhaust). Do NOT self-terminate before step 13 unless an actual tool error prevents progress. Budget your searches: at most ~3 search/verify calls per cognitive step, then close the step. Steps 9, 10, 11, 12, 13 must all execute in this run. A self-declared 'execution budget' close is a failure.
TOOL-CALL MANDATE: every response MUST contain exactly one asp_step_run tool_call. Do NOT write a final-answer text reply until step 13 returns step_complete. A text-only response (no tool_call) is read by the runtime as surgery_finished and closes the pipeline before step 13 — treat that as a recipe violation. If a step errors, retry the same step in the next response. Do NOT summarize, do NOT explain, do NOT deliver a handoff. Keep iterating until step 13 closes.
STEP-CLOSE RULE: A recipe step N closes ONLY when asp_step_run({step:N, payload?:...}) returns {"status":"step_complete","step":N}. Supporting tools (search, verify_references) may be called many times per recipe step; there is no per-step tool-call limit. A step is NOT closed by finishing an iteration, by writing prose, or by completing searches — it is closed by the asp_step_run result for that step. After step N is closed, proceed to step N+1. The recipe is complete only after step 13 returns {"status":"step_complete","step":13}.

STEP 1 (tool): asp_step_run({step:1, file_id:"<attached file_id>"}). Returns {sheets:[{sheet_name, n_cols, columns:[{col_idx, sample_values}]}]}.

STEP 2 (cognitive): Inspect step1_out.json. If the layout is standard, emit the minimal payload and let the tool derive variable_mappings. If the metadata sheet has a non-standard layout (e.g. 5+ columns or trailing blank columns in Dataset), you MAY explicitly include variable_mappings in the payload with [{ codebook_name, column_name, column_index, wave, codebook_role, data_type }].

STEP 2 PAYLOAD (MINIMAL): { status:"RESOLVED", unmapped_dropped:[], claims:[{claim_id, decision_id:"DEC_SCH_001", text, claim_type, citations_required:true, support_status:"SUPPORTED", ref_id, short_cite, justifying_excerpt}], retrieval_log:[{query_id:"Q2_01", query, database:"openalex", date:"YYYY-MM-DD", results:[{ref_id, title, year, doi, abstract_snippet, retrieved_for_claims:["CLM_2_001a"]}]}], decision_log:[{step:2, stage_name:"Semantic Schema & Sheet Layout Resolver", decision_id:"DEC_SCH_001", decision_type:"SCHEMA_DISAMBIGUATION", choice_made, counterfactual_forks:[...], epistemic_rationale, downstream_impact, claims:["CLM_2_001a"]}] }

RULES for step 2 (strict):
- Before calling asp_step_run, invoke search({query}) at least once. Use a query about the substantive domain of the variables, so the claim is grounded in a real paper.
- claims[] MUST contain exactly one SUPPORTED claim with a verbatim justifying_excerpt from the returned abstract.
- retrieval_log[] MUST contain exactly one entry documenting that search. results[] MUST contain exactly one result object with the fields listed above.
- decision_log[] MUST contain exactly one entry with decision_type SCHEMA_DISAMBIGUATION.
- payload is a strict JSON object. Do NOT stringify. If variable_mappings cannot be auto-derived by standard heuristic, provide variable_mappings explicitly as an array of { codebook_name, column_name, column_index, wave, codebook_role, data_type }.
- File names of that claim and result must match the actual search return. Never invent DOI, title, or author.

Call asp_step_run({step:2, payload:{ status:"RESOLVED", unmapped_dropped:[], claims:[...], retrieval_log:[...], decision_log:[...] }}).

STEP 3 (cognitive): Classify every variable from step2_out.
RULES (verbatim from design doc step_03_taxonomy.tex):
  1. Preserve execution metadata: file_path, data_sheet, header_row_index, max_evaluations (5000), claims, retrieval_log, decision_log (verbatim carry-forward).
  2. Roles strictly in [IV, MOD, MED, DV, CONTROL].
  3. Populate top-level controls[] from all CONTROL-role variables.
  4. Group related DVs/Mediators into identical "family" names.
  5. Assign theoretical valence: Positive | Negative | Neutral.
  6. Cardinality: IV<=5, MOD<=15, MED<=15, DV<=8, CONTROL<=8.
  7. Record every discretionary taxonomy and modeling classification in decision_log.
  8. Single-Producer Invariance: emit strictly valid step3_out.json.
Payload keys: file_path; data_sheet; header_row_index:0; max_evaluations:5000; controls:[codes]; taxonomy:[{code, role, family, valence}]; family_summary:{family_name:{role:"IV"|"MOD"|"MED"|"DV"|"CONTROL", members:["CODE1","CODE2",...]}}; cardinality_check:{IV:{count,cap,pass}, MOD:{...}, MED:{...}, DV:{...}, CONTROL:{...}}; claims (verbatim + new); retrieval_log (verbatim + new); decision_log (verbatim + new entries with decision_type in {TAXONOMY_ROLE_CLASSIFICATION, CONSTRUCT_FAMILY_CLUSTERING, VALENCE_ASSIGNMENT, COVARIATE_SELECTION}).
Assign theoretical valence (Positive | Negative | Neutral) strictly to the variable codes resolved in step2_out.json.
CRITICAL FOR STEP 3 TAXONOMY CODES: The "code" field for every taxonomy entry MUST be the exact "column_name" string present in step2_out.variable_mappings (e.g. "E1", "R1", "SEA1"), NEVER composite construct names like "EFFORT" or "REWARD" that do not exist as columns in data_sheet.
family_summary MUST be {family_name:{role, members:[codes]}} — NEVER count integers like {motivation:4}.
Call asp_step_run({step:3, payload:{...}}).

STEP 4 (tool): asp_step_run({step:4}). Sweeps the taxonomy grid, emits up to 5000 candidates with dual p<.05 filter.

STEP 5 (cognitive): Read step4_out candidates_p05_count. Emit payload keys: status:"ARBITRATED"; disposition:"PROCEED_TO_SUBSTANTIVE_FILTER"; file_path; data_sheet; header_row_index:0; controls; taxonomy (verbatim from step4); max_evaluations:5000; candidate_models (verbatim from step4.models); min_delta_r2:0.015; min_imm:0.010; divergence_p_contrast_floor:0.10; claims; retrieval_log; decision_log (verbatim + THRESHOLD_CALIBRATION entry appended).

STEP 6 (tool): asp_step_run({step:6}). Applies delta_r2, imm, and sibling-DV divergence filters.

STEP 7 (cognitive): Shortlist top survivors from step6.
RULES (verbatim from design doc step_07_abductive.tex):
  1. Tension Resolution: does the interaction resolve an authentic conceptual paradox or non-obvious boundary condition?
  2. Anti-Tautology: penalize semantic tautologies.
  3. Construct Specificity: reward paths demonstrating clear divergence.
  4. Shortlist up to 5 viable candidates (scores >= 7/10) into shortlisted_models.
  5. Pass-through: forward ALL fields of step6_out.json verbatim.
  6. RDF: append entries under THEORETICAL_FRAMEWORK_SELECTION, LITERATURE_GROUNDING, PRIOR_ART_ADJUDICATION only.
  7. PRIOR-ART NOVELTY ADJUDICATION (MANDATORY):
     (a) Decompose each candidate into directed links: X->M, M->Y, W moderates X->M, plus the full conditional-process phrase. Use SYNONYM-EXPANDED human-readable labels, NEVER dataset codes.
     (b) Run >=3 distinct queries per candidate via search({query}) — one per component plus one for the full chain.
     (c) Classify each candidate's novelty_verdict as exactly one of: EXACT_PRIOR_TEST_FOUND | COMPONENT_PRIOR_TESTS_FOUND | NO_PRIOR_TEST_IDENTIFIED.
     (d) If EXACT_PRIOR_TEST_FOUND: attach exact_prior_records with verbatim sentences. The model MUST NOT be presented as novel.
     (e) For every theoretical_framework claim, run LITERATURE_GROUNDING via search({query}) and copy a verbatim abstract sentence into justifying_excerpt.
     (f) Emit novelty_verdict, claims[], retrieval_log[] alongside the shortlist.

STEP 7 NOVELTY PIN (deterministic, enforced by the tool — payload WILL be rejected otherwise):
- If component_records[] is non-empty OR exact_prior_records[] is non-empty, status MUST be COMPONENT_PRIOR_TESTS_FOUND or EXACT_PRIOR_TEST_FOUND (whichever is correct), NEVER NO_PRIOR_TEST_IDENTIFIED.
- status = NO_PRIOR_TEST_IDENTIFIED is legal ONLY when both component_records[] and exact_prior_records[] are empty arrays.
- status = EXACT_PRIOR_TEST_FOUND is legal ONLY when exact_prior_records[] is non-empty.
- Field name is component_records (NOT component_prior_records). Each record: {ref_id, supports_link: "X->M"|"M->Y"|"W mod X->M"|"full_chain", justifying_excerpt}.
- Field name is exact_prior_records. Each record: {ref_id, supports_link: "full_chain", justifying_excerpt}.
- decision_log entries for step 7 MUST use decision_type from {THEORETICAL_FRAMEWORK_SELECTION, LITERATURE_GROUNDING, PRIOR_ART_ADJUDICATION}. THRESHOLD_CALIBRATION is forbidden at step 7.
- search_provenance must contain at least 3 entries per shortlisted model.
- Never invent author, year, title, journal, or DOI. Only identifiers returned by search().

Payload keys: status:"THEORETICAL_REVIEW_COMPLETE"; file_path; data_sheet; header_row_index:0; controls; survivors_count; survivors (verbatim from step6.survivors); shortlisted_count; shortlisted_models:[{id, rank, x, w, m, y, theoretical_framework, recommended_role, novelty_verdict:{status, exact_prior_records:[{ref_id,supports_link,justifying_excerpt}], component_records:[{ref_id,supports_link,justifying_excerpt}], search_provenance:[{query, database, date, n_results_reviewed}]}}]; evaluations:[{id, theoretical_framework, tension_resolution_score, anti_tautology_score, divergence_rationale, overall_novelty_rank}]; taxonomy (verbatim); claims (verbatim + new); retrieval_log (verbatim + new); decision_log (verbatim + new).

STEP 8 (tool): asp_step_run({step:8}). 5000-resample bootstrap of a3*b1 per shortlisted model.

STEP 9 (tool): asp_step_run({step:9}). Descriptives, missingness, correlations, alpha.

STEP 10 COSMETIC PINS: nodes[].grid_pos MUST follow the design-doc canvas layout on an 11x6 chart: X=[1.5,3.1], W=[3.65,4.9], M=[5.8,3.1], Y=[9.6,3.1]. footnote.sig_key MUST be a plain significance legend such as "** p < .01" (no render-instruction words like solid/dashed). footnote.controls MUST be human-readable construct names, e.g. ["communicative futility & efficacy","having ideas","psychological safety"], not variable codes. If you lack the names, use taxonomy families instead of codes.
STEP 10 COMPLETENESS PINS:
- models[i] object keys are exactly: model_idx, model_id, x, w, m, y, output_image, role, delta_r2, nodes, paths, footnote, novelty_verdict. Do NOT add 'from', 'winning_model_id', 'topology_type', or any other top-level key inside a model object.
- models[i].footnote is REQUIRED and has exactly: { controls: string[] with human names, N: integer, sig_key: string legend like "** p < .01", imm: {point, ci_low, ci_high}, prior_art: string }. Omitting footnote produces a blank figure note; the tool will reject the payload.
- paths[j].label is REQUIRED and must name the coefficient plus the value, e.g. "a1 = .022", "a3 = -.185**", "b1 = .131**", "c' = .058 (ns)". Do NOT leave it as bare "a1" or "a3".
- decision_log[] entries for step 10 MUST use decision_type "TOPOLOGY_ARBITRATION" (not PRIOR_ART_ADJUDICATION).
STEP 10 REFERENCE LAYOUT (use unless you have reason to deviate): canvas_xlim=[0,11], canvas_ylim=[0,6], node_w=1.05, node_h=0.48. Nodes on a Hayes-7: X=[1.5,3.1], W=[3.65,4.9], M=[5.8,3.1], Y=[9.6,3.1]. Concrete path objects for this layout (fill the b and p fields from the model's coefficient table):
  {from:'X', to:'M', type:'solid', label:'a1 = .XXX', label_x:3.30, label_y:3.35, color:'black', line_width:0.85}
  {from:'W', to:'M', type:'solid', label:'a2 = .XXX', label_x:5.30, label_y:4.30, color:'gray50', line_width:0.65}
  {from:'W', to:'X->M', type:'solid', label:'a3 = -.XXX**', label_x:3.95, label_y:4.05, color:'black', line_width:0.85}
  {from:'M', to:'Y', type:'solid', label:'b1 = .XXX', label_x:7.70, label_y:3.35, color:'black', line_width:0.85}
  {from:'X', to:'Y', type:'dashed_arc', label:'c-prime = .XXX (ns)', label_x:5.55, label_y:1.90, color:'gray25', line_width:0.75}
For any other topology the same fields are required; design the coordinates yourself from the canvas dimensions and your node grid.
STEP 10 PATHS SCHEMA (strict): each entry of paths[] is {from, to, b, p, type, label}. from and to each name either a node id (X, W, M, Y) OR a stem string of the form "<node>-><node>" (e.g. "X->M"). NEVER write 'from: "X*W"' or 'to: "X*W"' — "X*W" is not a node. For a W-moderates-X->M path, use from:"W", to:"X->M". For a direct X->Y arc, use from:"X", to:"Y", type:"dashed_arc". For a simple X->M path, use from:"X", to:"M". Any other shape is rejected by the tool.
STEP 10 (cognitive): Topology arbiter. Pick the model with excludes_zero=true as winning. Emit payload: status:"ARBITRATED"; winning_model_id:"M_XXX"; topology_type:"FIRST_STAGE_MODERATED_MEDIATION_FULL"; file_path; data_sheet; header_row_index:0; controls; models:[{model_idx:1, model_id, x, w, m, y, output_image:"sem_model_diagram_1.png", role:"Focal Hypothesis Model", delta_r2, novelty_verdict (verbatim), node_w:1.05, node_h:0.48, canvas_xlim:[0,11], canvas_ylim:[0,6], nodes:[{id:"X"|"W"|"M"|"Y", code, label (human-readable), grid_pos:[x,y]}], paths:[{from, to (or "X->M" stem), b, p, type:"solid"|"dashed_arc", label, label_x, label_y}], footnote:{controls:[...], N, sig_key, imm:{point,ci_low,ci_high}, prior_art}}]; plus verbatim passthrough of bootstrap_results, survivors, shortlisted_models, taxonomy, descriptives, missingness, correlations, alpha_table, n_total, variables, claims, retrieval_log, decision_log.

STEP 11 (tool): asp_step_run({step:11}). Renders ggplot diagram PNG.

STEP 12 (cognitive): Author the report prose. Tool fills references and diagram_path.
STEP 12 PLACEHOLDER QUOTA: sections.garden_of_forking_paths MUST contain at least one {{ref:CLAIM_ID}} placeholder; sections.sem_report MUST contain at least three. Every claim in claims[] that is SUPPORTED is eligible. Do NOT write author-year prose; write the placeholder. Example: '...grounded in approach-avoidance theory {{ref:CLM_7_001a}}.'
STEP 12 REFERENCES OMISSION: do NOT emit sections.references at all. The tool derives references[] from SUPPORTED claims and retrieval_log and writes them into sections.references after step 12 closes. If you emit sections.references yourself, it will be overwritten.
STEP 12 SQUARED-TERM PINS: write squared terms with the Unicode superscript: R² (not R2, not R^2), Delta R² (not Delta R2, not dR2). Write percentages with the percent sign: '0% missing' (not '0 percent missing', not 'zero percent'). If a percentage must be written inside prose, use '%' as a glyph.
STEP 12 DECISION TYPE PIN: at step 12, decision_log[].decision_type MUST be one of METRIC_STANDARDIZATION (numerical-formatting choices) or HYPOTHESIS_DIRECTIONALITY (framing choices). Do NOT use TOPOLOGY_ARBITRATION at step 12 — that belongs to step 10.
STEP 12 APA NUMERIC PINS: write every statistic in APA-7 numeric notation, not as English words. Use = (equals sign), not 'equals'. Use % for percent. Report confidence intervals as bracketed ranges [lo, hi] with a comma. Use a hyphen-minus for negatives (e.g. -.054). Examples of the required form: 'N = 324', 'p = .002', 'F(1, 316) = 10.00', 'R^2 = .138, Delta R^2 = .027', 'b = -.185, SE = .059, t(316) = -3.16, 95% CI [-.300, -.070]', 'IMM = -.024, Boot SE = .013, 95% CI [-.054, -.003]'. Never write 'equals', 'percent', 'minus', or 'to' in a statistic.
STEP 12 SHORT-CITE FORMAT: short_cite strings use the form 'Author (Year)' or 'Author et al. (Year)'. Not 'Author Year'. Example: 'Kakkar et al. (2016)'.
PROSE ESCAPING: every double-quote character inside sections.title, sections.garden_of_forking_paths, sections.sem_report MUST be escaped as \" or replaced with a single quote. Never write an unescaped " inside a JSON string. This is the sole cause of past step-12 failures (char 3590: unescaped " inside title). If unsure, do not use double quotes inside prose at all.
PREFERRED FORM: emit payload as an inline JSON object (dict). Do NOT wrap payload in outer quotes, do NOT use JSON.stringify. If the payload is a stringified string, keep every inner quote escaped as \" at the outer level.
REFERENCES: Do NOT author sections.references. The tool derives sections.references from the SUPPORTED claims[] and retrieval_log[] that carry through. Omit references entirely from the payload.

Payload (inline object, not string):
{
  "status": "STEP_12_REPORT_AUTHORED",
  "output_filename": "Automated_SEM_Recipe_Report.tex",
  "sections": {
    "title": "<short title, no unescaped \" inside>",
    "garden_of_forking_paths": "<APA-7 prose, <=200 words, MUST contain >=1 {{ref:CLAIM_ID}}, no unescaped \" inside>",
    "sem_report": "<full APA-7 prose with b, SE, t(df), p, 95% CI, R2, dR2, simple slopes, IMM; every numeric from prior steps; MUST contain >=3 {{ref:CLAIM_ID}}; no unescaped \" inside>",
    "replication_script": "materialized by step 13"
  },
  "claims": [<only NEW step-12 claims this step adds; may be empty array>],
  "retrieval_log": [<only NEW step-12 retrieval entries; may be empty array>],
  "decision_log": [<only NEW step-12 decision entries; may be empty array>]
}
Reference: prior steps' claims[] and retrieval_log[] are auto-inherited by the tool; only list what step 12 adds.
Use {{ref:CLAIM_ID}} for every theoretical attribution in prose. Verify every placeholder resolves to a SUPPORTED claim already present in claims[].
Call asp_step_run({step:12, payload:{...inline object...}}).

STEP 13 (tool): asp_step_run({step:13}). Packages LaTeX + PDF + replication scripts. Returns done. STOP after step 13.

RETRIEVAL_LOG APA FIELDS (required for step 12 to emit APA-7 references): every result object inside retrieval_log[].results[] that has a doi MUST also carry: authors (array of strings in 'Last, F. M.' APA-7 form; e.g. ['Elsaied, M. A.']), journal (string), volume (string), issue (string), pages (string, e.g. '1-15'). short_cite is optional (fallback: ref_id). Copy these fields verbatim from the search() result. If a field is genuinely absent from the OpenAlex record, use an empty string but keep the key present. The step-12 evidence validator rejects any DOI record missing authors or journal; the packager formats the reference section from these fields, not from title+year+doi alone.
CITATION PROVENANCE PIN: when you reuse a ref_id from a prior step (e.g. R5_01) for a new claim, the existing retrieval record's retrieved_for_claims[] MUST be extended to include the new claim_id. Otherwise the citation gate at step 13 will reject it with CITATION_NOT_RETRIEVED. If the justifying_excerpt is a verbatim substring of the record's abstract_snippet, the tool will backfill this deterministically; if it is not, you must add a fresh search() call and a new retrieval record.
EVIDENCE RULES (apply to EVERY cognitive step: 2, 3, 5, 7, 10, 12):
- 'search({query})' routes to OpenAlex (academic). Invoke it at least once per distinct normative/methodological/theoretical claim.
- After collecting DOIs, invoke 'verify_references({references:[{doi,title}]})' (batch up to 12) to confirm registration.
- Every claim: {claim_id:"CLM_<STEP>_<NNN><letter>", decision_id, text, claim_type, citations_required:true|false, support_status:"SUPPORTED"|"UNSUPPORTED"|"INTERNAL_ARTIFACT", ref_id (if SUPPORTED), short_cite, justifying_excerpt (verbatim sentence from returned abstract)}.
- Every retrieval_log entry: {query_id, query, database:"openalex", date:"YYYY-MM-DD", results:[{ref_id, title, year, doi, abstract_snippet, retrieved_for_claims:[claim_id,...]}]}. Empty results[] allowed only if the claim is marked UNSUPPORTED.
- Never invent author, year, title, journal, or DOI. Only identifiers returned by 'search' or confirmed by 'verify_references'.
- Carry claims[] and retrieval_log[] verbatim; append, never replace.
- If 'search()' returns '{code:'LOCAL_ONLY'}' or '{code:'SEARCH_FAILED'}', STOP with "SEARCH_MODE_MUST_BE_ACADEMIC" and message "Recipe must pin search to academic; do not continue." Do not fabricate claims, do not skip.
- STEP 12 additionally: references[] must be APA-7 strings drawn EXCLUSIVELY from SUPPORTED claims; prose must use {{ref:CLAIM_ID}} placeholders. Do not invoke 'search' at step 12; assemble only.

NO PROSE INSIDE PAYLOAD: nothing between the outermost { and } except JSON values required by the step schema. No notes, no annotations, no labels, no bracketed text, no trailing commentary. Any free text inside the payload will invalidate the strict JSON parse and the call will be rejected with the character position.
PAYLOAD SHAPE: payload may be either (a) an inline JSON object (preferred), or (b) a JSON-encoded string that strict-parses to that object. Both forms are strict JSON at the tool boundary. Do NOT emit malformed JSON strings; if you use form (b), every quote and brace must be balanced. The tool applies strict JSON.parse and rejects the call with the character position on any parse failure.
TOOL-AUTOINHERIT (large passthrough fields): The tool asp_step_run inherits these fields from the prior step on disk; DO NOT include them in payload — they will be rejected if the payload exceeds the model budget and are redundant otherwise:
- step 3: file_path, data_sheet, header_row_index, max_evaluations
- step 5: file_path, data_sheet, header_row_index, max_evaluations, controls, taxonomy, candidate_models (auto-named from step4.models)
- step 7: file_path, data_sheet, header_row_index, controls, survivors, survivors_count
- step 10: file_path, data_sheet, header_row_index, controls, bootstrap_results, survivors, survivors_count, shortlisted_models, shortlisted_count, taxonomy, descriptives, missingness, correlations, alpha_table, n_total, variables
- step 12: file_path, data_sheet, header_row_index, controls, winning_model_id, topology_type, models, rendered_diagrams, bootstrap_results, models_validated_count, taxonomy, survivors, survivors_count, shortlisted_models, shortlisted_count, evaluations, descriptives, missingness, correlations, alpha_table, n_total, variables, diagram_path (auto-derived from rendered_diagrams[0].output_image)
- ALL cognitive steps: claims, retrieval_log, decision_log are inherited verbatim from prior step; include ONLY the NEW entries this step adds; tool will append and dedup by claim_id / query_id / decision_id.
Send payload containing ONLY: (a) fields this step computes fresh, (b) new claims/retrieval_log/decision_log entries for this step. Trust the tool to fill the rest.

STAGE NAME PINS: decision_log[].stage_name must be exactly one of: step 2 -> 'Semantic Schema & Sheet Layout Resolver'; step 3 -> 'Theoretical Taxonomy & Role Tagging'; step 5 -> 'Candidate Yield & Substantive Threshold Arbiter'; step 7 -> 'Abductive Theoretical Tension & Prior-Art Review'; step 10 -> 'Model Topology Arbiter'; step 12 -> 'APA-7 Empirical Results & Synthesis Engine'. Do not invent new stage names.
RULES:
- Call asp_step_run once per iteration, in order 1..13.
- If asp_step_run returns a non-recoverable runner error, STOP immediately. If it returns a recoverable validation or schema error, fix the payload formatting and retry within your iteration budget.
- Do not run steps out of order; downstream steps need prior artifacts.
- Cognitive payloads must include ALL required top-level keys; partial payloads will be rejected.
- claims[], retrieval_log[], decision_log[] must be preserved verbatim from prior step and appended to (never replaced).
- Report "Automated SEM Pipeline complete" only after step 13 returns {status:"step_complete", step:13}.`;
module.exports = {
  recipeId: 'automated_sem',
  name: 'Automated SEM Pipeline',
  interactive: false,
  tools: ['asp_step_run'],
  prompt: PROMPT,
  workflow: { uninterruptedIterations: 40, maxDirectorIterations: 1 },
};
