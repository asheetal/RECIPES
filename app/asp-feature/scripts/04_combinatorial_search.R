#!/usr/bin/env Rscript
suppressPackageStartupMessages({
  library(readxl); library(jsonlite); library(data.table); library(stats)
})
source("json_utils.R")
args <- commandArgs(trailingOnly = TRUE)
input_json <- if (length(args) > 0) fromJSON(args[1]) else fromJSON(readLines("stdin", warn = FALSE))
file_path        <- path.expand(input_json$file_path)
data_sheet       <- input_json$data_sheet
header_row_index <- ifelse(!is.null(input_json$header_row_index), as.integer(input_json$header_row_index), 0)
controls         <- input_json$controls
max_evals        <- ifelse(!is.null(input_json$max_evaluations), as.integer(input_json$max_evaluations), 5000)
taxonomy_dt      <- as.data.table(input_json$taxonomy)
df_raw <- as.data.table(suppressMessages(read_excel(file_path, sheet = data_sheet, skip = header_row_index)))
iv_pool  <- taxonomy_dt[role == "IV", code]
mod_pool <- taxonomy_dt[role == "MOD", code]
med_pool <- taxonomy_dt[role == "MED", code]
dv_pool  <- taxonomy_dt[role == "DV", code]
start_time <- Sys.time()
candidates <- list()
eval_count <- 0
for (x in iv_pool) { for (w in mod_pool) { for (m in med_pool) { for (y in dv_pool) {
  eval_count <- eval_count + 1
  if (eval_count > max_evals) break
  needed <- unique(c(x, w, m, y, controls))
  d_sub <- na.omit(df_raw[, ..needed])
  if (nrow(d_sub) < 30) next
  d_sub[, X_c := get(x) - mean(get(x))]
  d_sub[, W_c := get(w) - mean(get(w))]
  d_sub[, X_W := X_c * W_c]
  f1_b <- as.formula(paste(m, "~ X_c + W_c +", paste(controls, collapse = " + ")))
  f1_f <- as.formula(paste(m, "~ X_c + W_c + X_W +", paste(controls, collapse = " + ")))
  fit1_b <- tryCatch(lm(f1_b, data = d_sub), error = function(e) NULL)
  fit1   <- tryCatch(lm(f1_f, data = d_sub), error = function(e) NULL)
  if (is.null(fit1) || is.null(fit1_b)) next
  s1 <- summary(fit1)$coefficients
  if (!"X_W" %in% rownames(s1)) next
  p_xw <- s1["X_W", "Pr(>|t|)"]
  if (is.na(p_xw) || p_xw >= 0.05) next
  f2 <- as.formula(paste(y, "~", m, "+ X_c +", paste(controls, collapse = " + ")))
  fit2 <- tryCatch(lm(f2, data = d_sub), error = function(e) NULL)
  if (is.null(fit2)) next
  s2 <- summary(fit2)$coefficients
  if (!m %in% rownames(s2)) next
  p_my <- s2[m, "Pr(>|t|)"]
  if (is.na(p_my) || p_my >= 0.05) next
  r2_b <- summary(fit1_b)$r.squared
  r2_f <- summary(fit1)$r.squared
  dr2  <- r2_f - r2_b
  df1_change <- 1
  df2_resid  <- fit1$df.residual
  f_change <- (dr2 / df1_change) / ((1 - r2_f) / df2_resid)
  p_f <- pf(f_change, df1_change, df2_resid, lower.tail = FALSE)
  sd_x <- sd(d_sub[[x]]); sd_w <- sd(d_sub[[w]])
  sd_m <- sd(d_sub[[m]]); sd_y <- sd(d_sub[[y]])
  cand_id <- sprintf("M_%03d", length(candidates) + 1)
  candidates[[length(candidates) + 1]] <- list(
    id = cand_id, x = x, w = w, m = m, y = y,
    a1 = round(s1["X_c", "Estimate"], 4), se_a1 = round(s1["X_c", "Std. Error"], 4),
    t_a1 = round(s1["X_c", "t value"], 4), p_a1 = round(s1["X_c", "Pr(>|t|)"], 4),
    a2 = round(s1["W_c", "Estimate"], 4), se_a2 = round(s1["W_c", "Std. Error"], 4),
    t_a2 = round(s1["W_c", "t value"], 4), p_a2 = round(s1["W_c", "Pr(>|t|)"], 4),
    a3 = round(s1["X_W", "Estimate"], 4), se_a3 = round(s1["X_W", "Std. Error"], 4),
    t_a3 = round(s1["X_W", "t value"], 4), p_a3 = round(p_xw, 4),
    r2_s1 = round(r2_f, 4), delta_r2 = round(dr2, 4),
    f_change = round(f_change, 4), df1_change = df1_change,
    df2_resid_s1 = df2_resid, p_f_change = round(p_f, 6),
    b1 = round(s2[m, "Estimate"], 4), se_b1 = round(s2[m, "Std. Error"], 4),
    t_b1 = round(s2[m, "t value"], 4), p_b1 = round(p_my, 4),
    c_prime = round(s2["X_c", "Estimate"], 4), se_cp = round(s2["X_c", "Std. Error"], 4),
    t_cp = round(s2["X_c", "t value"], 4), p_cp = round(s2["X_c", "Pr(>|t|)"], 4),
    r2_s2 = round(summary(fit2)$r.squared, 4), df2_resid_s2 = fit2$df.residual,
    beta_a1 = round(s1["X_c", "Estimate"] * sd_x / sd_m, 4),
    beta_a2 = round(s1["W_c", "Estimate"] * sd_w / sd_m, 4),
    beta_a3 = round(s1["X_W", "Estimate"] * (sd_x * sd_w) / sd_m, 4),
    beta_b1 = round(s2[m, "Estimate"] * sd_m / sd_y, 4),
    beta_cp = round(s2["X_c", "Estimate"] * sd_x / sd_y, 4),
    n = nrow(d_sub),
    mean_x = round(mean(d_sub[[x]]), 4), sd_x = round(sd_x, 4),
    mean_w = round(mean(d_sub[[w]]), 4), sd_w = round(sd_w, 4),
    mean_m = round(mean(d_sub[[m]]), 4), sd_m = round(sd_m, 4),
    mean_y = round(mean(d_sub[[y]]), 4), sd_y = round(sd_y, 4)
  )
} } } }
end_time <- Sys.time()
out <- list(
  status = "SEARCH_COMPLETE",
  total_evaluated = eval_count,
  execution_time_seconds = round(as.numeric(difftime(end_time, start_time, units = "secs")), 2),
  candidates_p05_count = length(candidates),
  file_path = input_json$file_path, data_sheet = data_sheet,
  header_row_index = header_row_index, controls = controls,
  taxonomy = input_json$taxonomy, models = candidates,
  claims = input_json$claims, retrieval_log = input_json$retrieval_log, decision_log = input_json$decision_log
)
cat(write_step_json(out))
quit(status = 0)
