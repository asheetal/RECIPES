#!/usr/bin/env Rscript
suppressPackageStartupMessages({ library(readxl); library(jsonlite); library(data.table); library(stats) })
source("json_utils.R")
args <- commandArgs(trailingOnly = TRUE)
input_json <- if (length(args) > 0) fromJSON(args[1]) else fromJSON(readLines("stdin", warn = FALSE))
file_path        <- path.expand(input_json$file_path)
data_sheet       <- input_json$data_sheet
header_row_index <- ifelse(!is.null(input_json$header_row_index), as.integer(input_json$header_row_index), 0)
taxonomy_dt      <- as.data.table(input_json$taxonomy)
controls         <- input_json$controls
df <- as.data.table(suppressMessages(read_excel(file_path, sheet = data_sheet, skip = header_row_index)))
var_codes <- unique(c(taxonomy_dt$code, controls))
var_codes <- var_codes[var_codes %in% names(df)]
n_total <- nrow(df)
missingness <- lapply(var_codes, function(v) {
  n_miss <- sum(is.na(df[[v]]))
  list(code = v, n_missing = n_miss, pct_missing = round(100 * n_miss / n_total, 2))
})
descriptives <- lapply(var_codes, function(v) {
  xv <- df[[v]]; if (!is.numeric(xv)) return(NULL)
  xc <- xv[!is.na(xv)]
  list(code = v, role = taxonomy_dt[code == v, role][1], family = taxonomy_dt[code == v, family][1],
       n = length(xc), mean = round(mean(xc), 3), sd = round(sd(xc), 3),
       min = round(min(xc), 3), max = round(max(xc), 3), median = round(median(xc), 3))
})
descriptives <- Filter(Negate(is.null), descriptives)
num_codes <- var_codes[sapply(var_codes, function(v) is.numeric(df[[v]]))]
cor_list <- list()
if (length(num_codes) >= 2) {
  cor_mat <- suppressWarnings(cor(df[, ..num_codes], use = "pairwise.complete.obs"))
  for (i in seq_along(num_codes)) {
    row_i <- list(code = num_codes[i])
    for (j in seq_along(num_codes)) {
      val <- cor_mat[i, j]
      row_i[[num_codes[j]]] <- if (is.na(val)) NA else round(val, 3)
    }
    cor_list[[i]] <- row_i
  }
}
item_groups <- list()
for (v in var_codes) {
  p1 <- grep(paste0("^", v, "_[0-9]+$"), names(df), value = TRUE)
  p2 <- grep(paste0("^", v, "[a-z]$"), names(df), value = TRUE)
  cand <- c(p1, p2); if (length(cand) >= 2) item_groups[[v]] <- cand
}
alpha_table <- list()
for (v in names(item_groups)) {
  items <- item_groups[[v]]
  items_num <- items[sapply(items, function(k) is.numeric(df[[k]]))]
  if (length(items_num) < 2) next
  m_items <- as.matrix(df[, ..items_num])
  m_ok <- m_items[complete.cases(m_items), , drop = FALSE]
  k <- ncol(m_ok); if (k < 2 || nrow(m_ok) < 3) next
  item_vars <- apply(m_ok, 2, var); total_var <- var(rowSums(m_ok))
  if (total_var <= 0) next
  alpha <- (k / (k - 1)) * (1 - sum(item_vars) / total_var)
  alpha_table[[length(alpha_table) + 1]] <- list(
    composite = v, items = items_num, n_items = k,
    n_complete = nrow(m_ok), alpha = round(alpha, 3)
  )
}
out <- input_json
out$status        <- "DESCRIPTIVES_COMPLETE"
out$n_total       <- n_total
out$variables     <- var_codes
out$descriptives  <- descriptives
out$missingness   <- missingness
out$correlations  <- cor_list
out$alpha_table   <- alpha_table
cat(write_step_json(out))
quit(status = 0)
