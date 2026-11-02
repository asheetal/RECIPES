#!/usr/bin/env Rscript
# Packages AQRP deliverables from step 32 payload. Optionally compiles PDFs.
# Usage: 32_package.R <out_dir> < step32_payload.json
`%||%` <- function(a, b) if (is.null(a)) b else a
args <- commandArgs(trailingOnly = TRUE)
out_dir <- if (length(args) >= 1) args[1] else "."
dir.create(out_dir, showWarnings = FALSE, recursive = TRUE)
suppressPackageStartupMessages(library(jsonlite))
raw <- paste(readLines(file("stdin")), collapse = "\n")
spec <- jsonlite::fromJSON(raw, simplifyVector = FALSE)
writeLines(spec$supplementary_rdf_tex %||% "", file.path(out_dir, "supplementary_rdf.tex"))
writeLines(jsonlite::toJSON(spec$aqrp_report, auto_unbox = TRUE, pretty = TRUE), file.path(out_dir, "aqrp_report.rdf"))
if (nzchar(Sys.which("pdflatex"))) {
  for (f in c("submission_paper", "supplementary_rdf")) {
    tex <- file.path(out_dir, paste0(f, ".tex"))
    if (file.exists(tex)) system2("pdflatex", c("-interaction=nonstopmode", "-halt-on-error", "-output-directory", out_dir, tex), stdout = TRUE, stderr = TRUE)
  }
}
cat("packaged to", out_dir, "\n")
