'use strict';
const PROMPT = `SEARCH_MODE: academic (the search() tool routes to OpenAlex). Use search() for every normative, methodological, or theoretical claim.
Automated SEM Pipeline: 13-step recipe. Call tool asp_step_run once per step, in order, no skips. Stop after step 13 returns done.

Sequence: 1 tool, 2 cognitive, 3 cognitive, 4 tool, 5 cognitive, 6 tool, 7 cognitive, 8 tool, 9 tool, 10 cognitive, 11 tool, 12 cognitive, 13 tool.

ITERATION BUDGET: You have 50 tool-call iterations in this set (the Director can grant more if you exhaust). Do NOT self-terminate before step 13 unless an actual tool error prevents progress. Budget your searches: at most ~3 search/verify calls per cognitive step, then close the step. Steps 9, 10, 11, 12, 13 must all execute in this run. A self-declared 'execution budget' close is a failure.
TOOL-CALL MANDATE: every response MUST contain exactly one asp_step_run tool_call. Do NOT write a final-answer text reply until step 13 returns step_complete. A text-only response (no tool_call) is read by the runtime as surgery_finished and closes the pipeline before step 13 — treat that as a recipe violation. If a step errors, retry the same step in the next response. Do NOT summarize, do NOT explain, do NOT deliver a handoff. Keep iterating until step 13 closes.
STEP-CLOSE RULE: A recipe step N closes ONLY when asp_step_run({step:N, payload?:...}) returns {"status":"step_complete","step":N}. Supporting tools (search, verify_references) may be called many times per recipe step; there is no per-step tool-call limit. A step is NOT closed by finishing an iteration, by writing prose, or by completing searches — it is closed by the asp_step_run result for that step. After step N is closed, proceed to step N+1. The recipe is complete only after step 13 returns {"status":"step_complete","step":13}.

STEP 1 (tool): asp_step_run({step:1, file_id:"<attached file_id>"}). Returns {sheets:[{sheet_name, n_cols, columns:[{col_idx, sample_values}]}]}.

STEP 2 (cognitive): Emit ONLY the fields the tool cannot derive. The tool reads step1_out.json and fills data_sheet, metadata_sheet, header_row_index, data_start_row_index, survey_design, join_key, n_variables_mapped, variable_mappings, quorum_passed, and status. You must NOT include those fields in the payload.

STEP 2 PAYLOAD (MINIMAL): { status:"RESOLVED", unmapped_dropped:[], claims:[{claim_id, decision_id:"DEC_SCH_001", text, claim_type, citations_required:true, support_status:"SUPPORTED", ref_id, short_cite, justifying_excerpt}], retrieval_log:[{query_id:"Q2_01", query, database:"openalex", date:"YYYY-MM-DD", results:[{ref_id, title, year, doi, abstract_snippet, retrieved_for_claims:["CLM_2_001a"]}]}], decision_log:[{step:2, stage_name:"Semantic Schema & Sheet Layout Resolver", decision_id:"DEC_SCH_001", decision_type:"SCHEMA_DISAMBIGUATION", choice_made, counterfactual_forks:[...], epistemic_rationale, downstream_impact, claims:["CLM_2_001a"]}] }

RULES for step 2 (strict):
- Before calling asp_step_run, invoke search({query}) at least once. Use a query about the substantive domain of the variables, so the claim is grounded in a real paper.
- claims[] MUST contain exactly one SUPPORTED claim with a verbatim justifying_excerpt from the returned abstract.
- retrieval_log[] MUST contain exactly one entry documenting that search. results[] MUST contain exactly one result object with the fields listed above.
- decision_log[] MUST contain exactly one entry with decision_type SCHEMA_DISAMBIGUATION.
- payload is a strict JSON object. Do NOT stringify. Do NOT include data_sheet, metadata_sheet, header_row_index, data_start_row_index, survey_design, join_key, n_variables_mapped, variable_mappings, quorum_passed, status — the tool derives them.
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
HARD PINS — valence is FIXED by design doc step3_out.json. Use EXACTLY these per code:
  OrTe:Neutral, PrTe:Neutral, A3:Negative, PAPE:Positive, APMT:Positive, AVMT:Negative, PMFS:Positive, PVFS:Negative, LOTV:Positive, LMX:Positive, FBFA:Positive, POS:Positive, JOAT:Positive, FBFJ:Positive, JOIS:Negative, GN:Positive, SN:Negative, GNS:Positive, PRMT:Positive, INMT:Positive, ORID:Positive, JOIV:Positive, ORCM:Positive, AC:Positive, CC:Negative, NC:Positive, WE:Positive, PV:Positive, AV:Neutral, DV:Negative, PMV:Positive, PHV:Negative, TP:Positive, VOFU:Negative, VOEF:Positive, HAID:Positive, PS:Positive.
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

STEP 10 (cognitive): Topology arbiter. Pick the model with excludes_zero=true as winning. Emit payload: status:"ARBITRATED"; winning_model_id:"M_XXX"; topology_type:"FIRST_STAGE_MODERATED_MEDIATION_FULL"; file_path; data_sheet; header_row_index:0; controls; models:[{model_idx:1, model_id, x, w, m, y, output_image:"sem_model_diagram_1.png", role:"Focal Hypothesis Model", delta_r2, novelty_verdict (verbatim), nodes:[{id:"X"|"W"|"M"|"Y", code, label (human-readable), grid_pos:[x,y]}], paths:[{from, to (or "X->M" stem), b, p, type:"solid"|"dashed_arc", label}], footnote:{controls:[...], N, sig_key, imm:{point,ci_low,ci_high}, prior_art}}]; plus verbatim passthrough of bootstrap_results, survivors, shortlisted_models, taxonomy, descriptives, missingness, correlations, alpha_table, n_total, variables, claims, retrieval_log, decision_log.

STEP 11 (tool): asp_step_run({step:11}). Renders ggplot diagram PNG.

STEP 12 (cognitive): Author the report prose. Tool fills references and diagram_path.
PROSE ESCAPING: every double-quote character inside sections.title, sections.garden_of_forking_paths, sections.sem_report MUST be escaped as \" or replaced with a single quote. Never write an unescaped " inside a JSON string. This is the sole cause of past step-12 failures (char 3590: unescaped " inside title). If unsure, do not use double quotes inside prose at all.
PREFERRED FORM: emit payload as an inline JSON object (dict). Do NOT wrap payload in outer quotes, do NOT use JSON.stringify. If the payload is a stringified string, keep every inner quote escaped as \" at the outer level.
REFERENCES: Do NOT author sections.references. The tool derives sections.references from the SUPPORTED claims[] and retrieval_log[] that carry through. Omit references entirely from the payload.

Payload (inline object, not string):
{
  "status": "STEP_12_REPORT_AUTHORED",
  "output_filename": "Automated_SEM_Recipe_Report.tex",
  "sections": {
    "title": "<short title, no unescaped \" inside>",
    "garden_of_forking_paths": "<APA-7 prose, <=200 words, use {{ref:CLAIM_ID}} placeholders, no unescaped \" inside>",
    "sem_report": "<full APA-7 prose with b, SE, t(df), p, 95% CI, R2, dR2, simple slopes, IMM; every numeric from prior steps; use {{ref:CLAIM_ID}} placeholders; no unescaped \" inside>",
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

RULES:
- Call asp_step_run once per iteration, in order 1..13.
- If ANY asp_step_run call returns an error, STOP immediately. Report the exact error string verbatim. Do NOT retry. Do NOT modify the payload. Do NOT skip the step. A retry is a recipe bug, not a recovery mechanism.
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
  workflow: { uninterruptedIterations: 50, maxDirectorIterations: 1, workflowStepCeiling: 200 },
};
