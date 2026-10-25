'use strict';
const PROMPT = `Automated SEM Pipeline: 13-step recipe. Call tool asp_step_run once per step, in order, no skips. Stop after step 13 returns done.

Sequence: 1 tool, 2 cognitive, 3 cognitive, 4 tool, 5 cognitive, 6 tool, 7 cognitive, 8 tool, 9 tool, 10 cognitive, 11 tool, 12 cognitive, 13 tool.

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
Payload keys: status:"RESOLVED"; file_path (basename); data_sheet; metadata_sheet (or null); header_row_index:0; data_start_row_index:1; n_variables_mapped:int; quorum_passed:true; survey_design:{multi_wave:bool, waves_detected:[...], wave_1_count:int, wave_2_count:int}; join_key:{codebook_column:"Variable in Dataset", codebook_column_index:3, match_type:"exact_token", match_coverage:"37/37 (100%)"}; variable_mappings:[{codebook_name, column_name, column_index:int, wave, codebook_role:"IV"|"MOD"|"MED"|"DV"|"Control", data_type:"numeric"|"string"}]; unmapped_dropped:[]; claims:[]; retrieval_log:[]; decision_log:[{step:2, stage_name:"Semantic Schema & Sheet Layout Resolver", decision_id:"DEC_SCH_001", decision_type:"SCHEMA_DISAMBIGUATION", choice_made, counterfactual_forks:[...], epistemic_rationale, downstream_impact, claims:[]}].
HARD PINS: variable_mappings[i].codebook_name = human-readable Variable Name from metadata sheet (e.g. "Organizational tenure"), NEVER the code token. variable_mappings[i].column_name = code token (e.g. "OrTe"). join_key.match_coverage = STRING, e.g. "37/37 (100%)", NEVER a number. header_row_index=0. data_start_row_index=1.
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

STEP 7 (cognitive): Shortlist top survivors from step6. Payload keys: status:"THEORETICAL_REVIEW_COMPLETE"; file_path; data_sheet; header_row_index:0; controls; survivors_count; survivors (verbatim from step6.survivors); shortlisted_count; shortlisted_models:[{id, rank, x, w, m, y, theoretical_framework, recommended_role, novelty_verdict:{status:"EXACT_PRIOR_TEST_FOUND"|"COMPONENT_PRIOR_TESTS_FOUND"|"NO_PRIOR_TEST_IDENTIFIED", exact_prior_records:[], component_records:[], search_provenance:[{query, database, date, n_results_reviewed}]}}]; evaluations:[{id, theoretical_framework, tension_resolution_score, anti_tautology_score, divergence_rationale, overall_novelty_rank}]; taxonomy; claims (verbatim + new); retrieval_log (verbatim + new); decision_log (verbatim + new).

STEP 8 (tool): asp_step_run({step:8}). 5000-resample bootstrap of a3*b1 per shortlisted model.

STEP 9 (tool): asp_step_run({step:9}). Descriptives, missingness, correlations, alpha.

STEP 10 (cognitive): Topology arbiter. Pick the model with excludes_zero=true as winning. Emit payload: status:"ARBITRATED"; winning_model_id:"M_XXX"; topology_type:"FIRST_STAGE_MODERATED_MEDIATION_FULL"; file_path; data_sheet; header_row_index:0; controls; models:[{model_idx:1, model_id, x, w, m, y, output_image:"sem_model_diagram_1.png", role:"Focal Hypothesis Model", delta_r2, novelty_verdict (verbatim), nodes:[{id:"X"|"W"|"M"|"Y", code, label (human-readable), grid_pos:[x,y]}], paths:[{from, to (or "X->M" stem), b, p, type:"solid"|"dashed_arc", label}], footnote:{controls:[...], N, sig_key, imm:{point,ci_low,ci_high}, prior_art}}]; plus verbatim passthrough of bootstrap_results, survivors, shortlisted_models, taxonomy, descriptives, missingness, correlations, alpha_table, n_total, variables, claims, retrieval_log, decision_log.

STEP 11 (tool): asp_step_run({step:11}). Renders ggplot diagram PNG.

STEP 12 (cognitive): Author report. Payload keys: status:"STEP_12_REPORT_AUTHORED"; output_filename:"Automated_SEM_Recipe_Report.tex"; diagram_path:"sem_model_diagram_1.png"; sections:{title, garden_of_forking_paths (<=200 words, uses {{ref:CLAIM_ID}} placeholders), sem_report (APA-7 full prose with b/SE/t/p/95%CI/R2/dR2/simple slopes/IMM, uses {{ref:CLAIM_ID}} placeholders), references:[APA-7 strings], replication_script:"materialized by step 13"}; plus verbatim passthrough of models, bootstrap_results, taxonomy, descriptives, missingness, correlations, claims, retrieval_log, decision_log, etc. Do not write raw author-year strings; use {{ref:CLAIM_ID}} only. Every {{ref:X}} must correspond to a SUPPORTED claim in claims[].

STEP 13 (tool): asp_step_run({step:13}). Packages LaTeX + PDF + replication scripts. Returns done. STOP after step 13.

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
