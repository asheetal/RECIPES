'use strict';
const PROMPT = `Automated SEM Pipeline: 13-step recipe. Call tool asp_step_run once per step, in order, no skips. Stop after step 13 returns done.

Sequence: 1 tool, 2 cognitive, 3 cognitive, 4 tool, 5 cognitive, 6 tool, 7 cognitive, 8 tool, 9 tool, 10 cognitive, 11 tool, 12 cognitive, 13 tool.

STEP 1 (tool): asp_step_run({step:1, file_id:"<attached file_id>"}). Returns {sheets:[{sheet_name, n_cols, columns:[{col_idx, sample_values}]}]}.

STEP 2 (cognitive): Inspect step1_out.json. Identify numeric data sheet (usually "Dataset") vs codebook sheet (usually "Variable Description"). Emit payload with keys: status:"RESOLVED"; file_path (basename); data_sheet; metadata_sheet (or null); header_row_index:0; data_start_row_index:1; n_variables_mapped (int); quorum_passed:true; survey_design:{multi_wave:bool, waves_detected:[...], wave_1_count:int, wave_2_count:int}; join_key:{codebook_column, codebook_column_index:int, match_type, match_coverage}; variable_mappings:[{codebook_name, column_name, column_index:int, wave, codebook_role:"IV"|"MOD"|"MED"|"DV"|"Control", data_type:"numeric"|"string"}]; unmapped_dropped:[]; claims:[]; retrieval_log:[]; decision_log:[{step:2, stage_name, decision_id:"DEC_SCH_001", decision_type:"SCHEMA_DISAMBIGUATION", choice_made, counterfactual_forks:[...], epistemic_rationale, downstream_impact, claims:[]}]. Call asp_step_run({step:2, payload:{...}}).

STEP 3 (cognitive): Classify every variable in step2_out into a role, family, valence. Payload keys: file_path; data_sheet; header_row_index:0; max_evaluations:5000; controls:[codes]; taxonomy:[{code, role:"IV"|"MOD"|"MED"|"DV"|"CONTROL", family, valence:"Positive"|"Negative"|"Neutral"}]; family_summary:{...}; cardinality_check:{IV:{count,cap,pass}, MOD:{...}, MED:{...}, DV:{...}, CONTROL:{...}}; claims:[]; retrieval_log:[]; decision_log:[{step:3, decision_id, decision_type, choice_made, counterfactual_forks, epistemic_rationale, downstream_impact, claims}]. Cardinality caps: IV<=5, MOD<=15, MED<=15, DV<=8, CONTROL<=8.

STEP 4 (tool): asp_step_run({step:4}). Sweeps the taxonomy grid, emits up to 5000 candidates with dual p<.05 filter.

STEP 5 (cognitive): Read step4_out candidates_p05_count. Emit payload keys: status:"ARBITRATED"; disposition:"PROCEED_TO_SUBSTANTIVE_FILTER"; file_path; data_sheet; header_row_index:0; controls; taxonomy (verbatim from step4); max_evaluations:5000; candidate_models (verbatim from step4.models); min_delta_r2:0.015; min_imm:0.010; divergence_p_contrast_floor:0.10; claims; retrieval_log; decision_log (verbatim + THRESHOLD_CALIBRATION entry appended).

STEP 6 (tool): asp_step_run({step:6}). Applies delta_r2, imm, and sibling-DV divergence filters.

STEP 7 (cognitive): Shortlist top survivors from step6. Payload keys: status:"THEORETICAL_REVIEW_COMPLETE"; file_path; data_sheet; header_row_index:0; controls; survivors_count; survivors (verbatim from step6.survivors); shortlisted_count; shortlisted_models:[{id, rank, x, w, m, y, theoretical_framework, recommended_role, novelty_verdict:{status:"EXACT_PRIOR_TEST_FOUND"|"COMPONENT_PRIOR_TESTS_FOUND"|"NO_PRIOR_TEST_IDENTIFIED", exact_prior_records:[], component_records:[], search_provenance:[{query, database, date, n_results_reviewed}]}}]; evaluations:[{id, theoretical_framework, tension_resolution_score, anti_tautology_score, divergence_rationale, overall_novelty_rank}]; taxonomy; claims (verbatim + new); retrieval_log (verbatim + new); decision_log (verbatim + new).

STEP 8 (tool): asp_step_run({step:8}). 5000-resample bootstrap of a3*b1 per shortlisted model.

STEP 9 (tool): asp_step_run({step:9}). Descriptives, missingness, correlations, alpha.

STEP 10 (cognitive): Topology arbiter. Pick the model with excludes_zero=true as winning. Emit payload: status:"ARBITRATED"; winning_model_id:"M_XXX"; topology_type:"FIRST_STAGE_MODERATED_MEDIATION_FULL"; file_path; data_sheet; header_row_index:0; controls; models:[{model_idx:1, model_id, x, w, m, y, output_image:"sem_model_diagram_1.png", role:"Focal Hypothesis Model", delta_r2, novelty_verdict (verbatim), nodes:[{id:"X"|"W"|"M"|"Y", code, label (human-readable), grid_pos:[x,y]}], paths:[{from, to (or "X->M" stem), b, p, type:"solid"|"dashed_arc", label}], footnote:{controls:[...], N, sig_key, imm:{point,ci_low,ci_high}, prior_art}}]; plus verbatim passthrough of bootstrap_results, survivors, shortlisted_models, taxonomy, descriptives, missingness, correlations, alpha_table, n_total, variables, claims, retrieval_log, decision_log.

STEP 11 (tool): asp_step_run({step:11}). Renders ggplot diagram PNG.

STEP 12 (cognitive): Author report. Payload keys: status:"STEP_12_REPORT_AUTHORED"; output_filename:"Automated_SEM_Recipe_Report.tex"; diagram_path:"sem_model_diagram_1.png"; sections:{title, garden_of_forking_paths (<=200 words, uses {{ref:CLAIM_ID}} placeholders), sem_report (APA-7 full prose with b/SE/t/p/95%CI/R2/dR2/simple slopes/IMM, uses {{ref:CLAIM_ID}} placeholders), references:[APA-7 strings], replication_script:"materialized by step 13"}; plus verbatim passthrough of models, bootstrap_results, taxonomy, descriptives, missingness, correlations, claims, retrieval_log, decision_log, etc. Do not write raw author-year strings; use {{ref:CLAIM_ID}} only. Every {{ref:X}} must correspond to a SUPPORTED claim in claims[].

STEP 13 (tool): asp_step_run({step:13}). Packages LaTeX + PDF + replication scripts. Returns done. STOP after step 13.

RULES:
- Call asp_step_run once per iteration, in order 1..13.
- If a tool returns an error, read it and retry with corrected payload (or report and stop).
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
