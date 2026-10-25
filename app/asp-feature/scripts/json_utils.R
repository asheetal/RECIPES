# json_utils.R — array-shape invariant enforced post-serialization.
ARRAY_KEYS <- c(
  "claims","retrieved_for_claims","counterfactual_forks",
  "exact_prior_records","component_records","search_provenance",
  "descriptives","missingness","correlations","alpha_table",
  "variables","items","controls","models","survivors","candidates",
  "shortlisted_models","evaluation","bootstrap_results","rendered_diagrams",
  "waves_detected","unmapped_dropped","references","sheets","columns",
  "sample_values","gates","checks"
)
force_arrays <- function(x, keys = ARRAY_KEYS) x
write_step_json <- function(out, keys = ARRAY_KEYS) {
  json_str <- jsonlite::toJSON(out, auto_unbox = TRUE, pretty = TRUE)
  for (key in keys) {
    pat <- paste0('("', key, '"\\s*:\\s*)"([^"\\[{][^"]*)"')
    rep <- '\\1["\\2"]'
    json_str <- gsub(pat, rep, json_str, perl = TRUE)
  }
  json_str
}
