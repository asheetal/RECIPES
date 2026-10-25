#!/usr/bin/env Rscript
suppressPackageStartupMessages({ library(readxl); library(jsonlite); library(data.table); library(boot); library(stats) })
source("json_utils.R")
args <- commandArgs(trailingOnly = TRUE)
input_json <- fromJSON(args[1])
file_path        <- path.expand(input_json$file_path)
data_sheet       <- input_json$data_sheet
header_row_index <- as.integer(input_json$header_row_index)
controls         <- input_json$controls
models           <- input_json$shortlisted_models
n_boot           <- ifelse(!is.null(input_json$n_boot), as.integer(input_json$n_boot), 5000)
seed_val         <- ifelse(!is.null(input_json$seed), as.integer(input_json$seed), 42)
set.seed(seed_val)
df_raw <- as.data.table(suppressMessages(read_excel(file_path, sheet = data_sheet, skip = header_row_index)))
if (is.data.frame(models)) {
  models_list <- lapply(seq_len(nrow(models)), function(i) as.list(models[i, ]))
} else { models_list <- models }
results <- list()
for (m_row in models_list) {
  model_id <- m_row$id; x <- m_row$x; w <- m_row$w; m <- m_row$m; y <- m_row$y
  needed <- unique(c(x, w, m, y, controls))
  d_sub  <- na.omit(df_raw[, ..needed])
  d_sub[, X_c := get(x) - mean(get(x))]
  d_sub[, W_c := get(w) - mean(get(w))]
  d_sub[, X_W := X_c * W_c]
  w_sd <- sd(d_sub[[w]]); n_used <- nrow(d_sub)
  f1 <- as.formula(paste(m, "~ X_c + W_c + X_W +", paste(controls, collapse = " + ")))
  f2 <- as.formula(paste(y, "~", m, "+ X_c +", paste(controls, collapse = " + ")))
  fit1_full <- lm(f1, data = d_sub); fit2_full <- lm(f2, data = d_sub)
  s1 <- summary(fit1_full)$coefficients; s2 <- summary(fit2_full)$coefficients
  boot_fn <- function(data, indices) {
    d <- data[indices, ]
    a3 <- coef(lm(f1, data = d))["X_W"]
    b1 <- coef(lm(f2, data = d))[m]
    a3 * b1
  }
  b_res   <- boot(data = d_sub, statistic = boot_fn, R = n_boot)
  ci_calc <- boot.ci(b_res, type = "perc")
  b_X_c <- coef(fit1_full)["X_c"]; b_X_W <- coef(fit1_full)["X_W"]; vcov_m <- vcov(fit1_full)
  slope_low  <- b_X_c + b_X_W * (-w_sd)
  se_low     <- sqrt(vcov_m["X_c","X_c"] + (w_sd^2)*vcov_m["X_W","X_W"] - 2*w_sd*vcov_m["X_c","X_W"])
  t_low      <- slope_low / se_low
  p_low      <- 2 * pt(-abs(t_low), df = fit1_full$df.residual)
  slope_high <- b_X_c + b_X_W * (w_sd)
  se_high    <- sqrt(vcov_m["X_c","X_c"] + (w_sd^2)*vcov_m["X_W","X_W"] + 2*w_sd*vcov_m["X_c","X_W"])
  t_high     <- slope_high / se_high
  p_high     <- 2 * pt(-abs(t_high), df = fit1_full$df.residual)
  results[[length(results) + 1]] <- list(
    model_id = model_id, x = x, w = w, m = m, y = y, n = n_used,
    imm_point = round(b_res$t0, 4), boot_se = round(sd(b_res$t), 4),
    ci_lower = round(ci_calc$percent[4], 4), ci_upper = round(ci_calc$percent[5], 4),
    excludes_zero = !(ci_calc$percent[4] <= 0 && ci_calc$percent[5] >= 0),
    stage1 = list(
      a1 = round(s1["X_c",1],4), se_a1 = round(s1["X_c",2],4), t_a1 = round(s1["X_c",3],4), p_a1 = round(s1["X_c",4],4),
      a2 = round(s1["W_c",1],4), se_a2 = round(s1["W_c",2],4), t_a2 = round(s1["W_c",3],4), p_a2 = round(s1["W_c",4],4),
      a3 = round(s1["X_W",1],4), se_a3 = round(s1["X_W",2],4), t_a3 = round(s1["X_W",3],4), p_a3 = round(s1["X_W",4],4),
      df_resid = fit1_full$df.residual, r2 = round(summary(fit1_full)$r.squared, 4)
    ),
    stage2 = list(
      b1 = round(s2[m,1],4), se_b1 = round(s2[m,2],4), t_b1 = round(s2[m,3],4), p_b1 = round(s2[m,4],4),
      c_prime = round(s2["X_c",1],4), se_cp = round(s2["X_c",2],4), t_cp = round(s2["X_c",3],4), p_cp = round(s2["X_c",4],4),
      df_resid = fit2_full$df.residual, r2 = round(summary(fit2_full)$r.squared, 4)
    ),
    simple_slopes = list(
      low_moderator_neg1sd  = list(slope = round(slope_low,3), se = round(se_low,3), t = round(t_low,2), p = round(p_low,4),
                                    ci_low = round(slope_low - 1.96*se_low,3), ci_high = round(slope_low + 1.96*se_low,3)),
      high_moderator_pos1sd = list(slope = round(slope_high,3), se = round(se_high,3), t = round(t_high,2), p = round(p_high,4),
                                    ci_low = round(slope_high - 1.96*se_high,3), ci_high = round(slope_high + 1.96*se_high,3))
    )
  )
}
out <- input_json
out$status                 <- "BOOTSTRAP_BATCH_COMPLETE"
out$bootstrap_results      <- results
out$models_validated_count <- length(results)
cat(write_step_json(out))
quit(status = 0)
