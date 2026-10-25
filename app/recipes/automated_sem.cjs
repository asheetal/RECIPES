'use strict';
const PROMPT = `SEARCH_MODE: academic (the search() tool routes to OpenAlex). Use search() for every normative, methodological, or theoretical claim.
Automated SEM Pipeline: 13-step recipe. Call tool asp_step_run once per step, in order, no skips. Stop after step 13 returns done.

Sequence: 1 tool, 2 cognitive, 3 cognitive, 4 tool, 5 cognitive, 6 tool, 7 cognitive, 8 tool, 9 tool, 10 cognitive, 11 tool, 12 cognitive, 13 tool.

STEP-CLOSE RULE: A recipe step N closes ONLY when asp_step_run({step:N, payload?:...}) returns {"status":"step_complete","step":N}. Supporting tools (search, verify_references) may be called many times per recipe step; there is no per-step tool-call limit. A step is NOT closed by finishing an iteration, by writing prose, or by completing searches — it is closed by the asp_step_run result for that step. After step N is closed, proceed to step N+1. The recipe is complete only after step 13 returns {"status":"step_complete","step":13}.

STEP 1 (tool): asp_step_run({step:1, file_id:"<attached file_id>"}). Returns {sheets:[{sheet_name, n_cols, columns:[{col_idx, sample_values}]}]}.

STEP 2 (cognitive): Read step1_out.json from the prior tool_result in this conversation. Identify numeric data sheet vs codebook sheet.
RULES (verbatim from design doc step_02_schema.tex):
  1. Identify the primary data sheet and metadata/codebook sheet.
  2. Determine 0-based header_row_index and data_start_row_index.
  3. Map codebook entries to data columns, waves, and codebook roles.
  4. Enforce Structural Role Quorum: >=1 IV, MOD, MED, DV each.
  5. Route unresolved non-essential columns to unmapped_dropped.
  6. Record discretionary choices in decision_log as SCHEMA_DISAMBIGUATION.
  7. Emit claims[] and retrieval_log[] alongside decision_log[] (may be empty arrays).
  8. Emit strictly valid step2_out.json.
Payload keys: status:"RESOLVED"; file_path (basename); data_sheet; metadata_sheet (or null); header_row_index:0; data_start_row_index:1; n_variables_mapped:int; quorum_passed:true; survey_design:{multi_wave:bool, waves_detected:[...], wave_1_count:int, wave_2_count:int}; join_key:{codebook_column:"Variable in Dataset", codebook_column_index:3, match_type:"exact_token", match_coverage:"37/37 (100%)"}; variable_mappings:[{codebook_name, column_name, column_index:int, wave, codebook_role:"IV"|"MOD"|"MED"|"DV"|"Control", data_type:"numeric"|"string"}]; unmapped_dropped:[]; claims:[{claim_id:"CLM_2_001a", decision_id:"DEC_SCH_001", text, claim_type:"METHODOLOGICAL_PRECEDENT", citations_required:true, support_status:"SUPPORTED", ref_id, short_cite, justifying_excerpt}]; retrieval_log:[{query_id:"Q2_01", query, database:"openalex", date:"YYYY-MM-DD", results:[{ref_id, title, year, doi, abstract_snippet, retrieved_for_claims:["CLM_2_001a"]}]}]; decision_log:[{step:2, stage_name:"Semantic Schema & Sheet Layout Resolver", decision_id:"DEC_SCH_001", decision_type:"SCHEMA_DISAMBIGUATION", choice_made, counterfactual_forks:[...], epistemic_rationale, downstream_impact, claims:[]}].
HARD PINS: variable_mappings[i].codebook_name = human-readable Variable Name from metadata sheet (e.g. "Organizational tenure"), NEVER the code token. variable_mappings[i].column_name = code token (e.g. "OrTe"). join_key.match_coverage = STRING, e.g. "37/37 (100%)", NEVER a number. header_row_index=0. data_start_row_index=1.
claims[] MUST contain at least one SUPPORTED entry produced by search({query}) with ref_id, short_cite, and justifying_excerpt (verbatim sentence from the returned abstract). retrieval_log[] MUST contain at least one entry documenting that search with query_id, query, database:"openalex", date:"YYYY-MM-DD", and results:[{ref_id, title, year, doi, abstract_snippet, retrieved_for_claims}]. You MUST call search({query}) at least once during step 2 before calling asp_step_run({step:2}).
Call asp_step_run({step:2, payload:{...}}).

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

STEP 12 (cognitive): Author report. Payload keys: status:"STEP_12_REPORT_AUTHORED"; output_filename:"Automated_SEM_Recipe_Report.tex"; diagram_path:"sem_model_diagram_1.png"; sections:{title, garden_of_forking_paths (<=200 words, uses {{ref:CLAIM_ID}} placeholders), sem_report (APA-7 full prose with b/SE/t/p/95%CI/R2/dR2/simple slopes/IMM, uses {{ref:CLAIM_ID}} placeholders), references:[APA-7 strings], replication_script:"materialized by step 13"}; plus verbatim passthrough of models, bootstrap_results, taxonomy, descriptives, missingness, correlations, claims, retrieval_log, decision_log, etc. Do not write raw author-year strings; use {{ref:CLAIM_ID}} only. Every {{ref:X}} must correspond to a SUPPORTED claim in claims[].

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
};
