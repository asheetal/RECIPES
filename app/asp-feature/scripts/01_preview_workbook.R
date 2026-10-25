#!/usr/bin/env Rscript
suppressPackageStartupMessages({ library(readxl); library(jsonlite) })
args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 1) stop("Usage: 01_preview_workbook.R <file_path>")
file_path <- path.expand(args[1]); max_rows <- 5
sheets <- excel_sheets(file_path)
out <- lapply(sheets, function(s) {
  df_peek <- suppressMessages(read_excel(file_path, sheet = s, col_names = FALSE, n_max = 1))
  is_meta <- ncol(df_peek) <= 6
  n_to_read <- if (is_meta) Inf else max_rows
  df <- suppressMessages(read_excel(file_path, sheet = s, col_names = FALSE, n_max = n_to_read))
  cols_payload <- lapply(seq_len(ncol(df)), function(j) list(col_idx = j - 1, sample_values = as.character(df[[j]])))
  list(sheet_name = s, n_cols = ncol(df), columns = cols_payload)
})
cat(toJSON(list(file_path = basename(file_path), sheets = out), auto_unbox = TRUE, pretty = TRUE))
quit(status = 0)
