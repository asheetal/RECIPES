#!/usr/bin/env Rscript
suppressPackageStartupMessages({ library(readxl); library(jsonlite); library(data.table); library(stats) })
source("json_utils.R")
args <- commandArgs(trailingOnly = TRUE)
input_json <- if (length(args) > 0) fromJSON(args[1]) else fromJSON(readLines("stdin", warn = FALSE))
file_path        <- path.expand(input_json$file_path)
data_sheet       <- input_json$data_sheet
header_row_index <- ifelse(!is.null(input_json$header_row_index), as.integer(input_json$header_row_index), 0)
candidate_models <- input_json$candidate_models
taxonomy_dt      <- as.data.table(input_json$taxonomy)
controls         <- input_json$controls
min_dr2          <- ifelse(!is.null(input_json$min_delta_r2), as.numeric(input_json$min_delta_r2), 0.015)
min_imm          <- ifelse(!is.null(input_json$min_imm), as.numeric(input_json$min_imm), 0.010)
p_contrast_floor <- ifelse(!is.null(input_json$divergence_p_contrast_floor), as.numeric(input_json$divergence_p_contrast_floor), 0.10)
df_raw <- as.data.table(suppressMessages(read_excel(file_path, sheet = data_sheet, skip = header_row_index)))
if (is.data.frame(candidate_models)) {
  models_list <- lapply(seq_len(nrow(candidate_models)), function(i) as.list(candidate_models[i, ]))
} else if (is.list(candidate_models)) {
  models_list <- candidate_models
} else { stop("candidate_models must be a data.frame or list") }
survivors <- list()
for (m_row in models_list) {
  x <- m_row$x; w <- m_row$w; m <- m_row$m; y <- m_row$y
  y_fam <- taxonomy_dt[code == y, family][1]
  sibling_dvs <- taxonomy_dt[family == y_fam & role == "DV" & code != y, code]
  if (length(sibling_dvs) == 0) sibling_dvs <- taxonomy_dt[role == "DV" & code != y, code]
  needed <- unique(c(x, w, m, y, sibling_dvs, controls))
  d_sub <- na.omit(df_raw[, ..needed])
  d_sub[, X_c := get(x) - mean(get(x))]
  d_sub[, W_c := get(w) - mean(get(w))]
  d_sub[, X_W := X_c * W_c]
  f1_b <- as.formula(paste(m, "~ X_c + W_c +", paste(controls, collapse = " + ")))
  f1_f <- as.formula(paste(m, "~ X_c + W_c + X_W +", paste(controls, collapse = " + ")))
  fit_b <- lm(f1_b, data = d_sub)
  fit_f <- lm(f1_f, data = d_sub)
  delta_r2 <- summary(fit_f)$r.squared - summary(fit_b)$r.squared
  imm <- m_row$a3 * m_row$b1
  if (delta_r2 < min_dr2 || abs(imm) < min_imm) next
  divergent <- FALSE
  best_sib <- NA_character_; best_p <- NA_real_; best_eta <- NA_real_
  if (length(sibling_dvs) > 0) {
    for (sib in sibling_dvs) {
      f_sib <- as.formula(paste(sib, "~", m, "+ X_c +", paste(controls, collapse = " + ")))
      fit_sib <- tryCatch(lm(f_sib, data = d_sub), error = function(e) NULL)
      if (is.null(fit_sib)) next
      sib_coef <- summary(fit_sib)$coefficients
      if (!(m %in% rownames(sib_coef))) next
      p_sib <- sib_coef[m, "Pr(>|t|)"]
      if (!is.na(p_sib) && p_sib >= p_contrast_floor) {
        divergent <- TRUE; best_sib <- sib; best_p <- p_sib
        best_eta <- sib_coef[m, "Estimate"]; break
      }
    }
  }
  if (divergent) {
    survivor <- m_row
    survivor$delta_r2     <- round(delta_r2, 4)
    survivor$imm          <- round(imm, 4)
    survivor$sibling_dv   <- best_sib
    survivor$p_sibling_dv <- round(best_p, 4)
    survivor$eta_sibling  <- round(best_eta, 4)
    survivor$divergent    <- TRUE
    survivors[[length(survivors) + 1]] <- survivor
  }
}
out <- list(
  status = "FILTER_COMPLETE",
  survivors_count = length(survivors),
  survivors = survivors,
  file_path = input_json$file_path, data_sheet = input_json$data_sheet,
  header_row_index = input_json$header_row_index, controls = controls,
  taxonomy = input_json$taxonomy, claims = input_json$claims,
  retrieval_log = input_json$retrieval_log, decision_log = input_json$decision_log
)
cat(write_step_json(out))
quit(status = 0)
