#!/usr/bin/env Rscript
# Renders a model diagram PNG from step 28 diagram_script_params.
# Usage: 32_render_diagram.R <out_png> < diagram_params.json
`%||%` <- function(a, b) if (is.null(a)) b else a
args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 1) stop("usage: 32_render_diagram.R <out_png>")
out_path <- args[1]
suppressPackageStartupMessages({ library(jsonlite); library(ggplot2) })
raw <- paste(readLines(file("stdin")), collapse = "\n")
spec <- jsonlite::fromJSON(raw, simplifyVector = FALSE)
nodes <- do.call(rbind, lapply(spec$nodes, function(n) data.frame(id = n$id %||% NA_character_, x = n$x %||% 0, y = n$y %||% 0, label = n$label %||% (n$id %||% ""), stringsAsFactors = FALSE)))
if (!nrow(nodes)) stop("no nodes")
paths <- if (is.null(spec$paths) || length(spec$paths) == 0) data.frame() else do.call(rbind, lapply(spec$paths, function(p) data.frame(from = p$from %||% NA_character_, to = p$to %||% NA_character_, stringsAsFactors = FALSE)))
node_by_id <- setNames(seq_len(nrow(nodes)), nodes$id)
p <- ggplot() +
  geom_point(data = nodes, aes(x = x, y = y), size = 3, color = "#14325F") +
  geom_text(data = nodes, aes(x = x, y = y - 0.4, label = label), size = 3.5, fontface = "bold")
if (nrow(paths)) p <- p + geom_segment(data = transform(paths, x = nodes$x[node_by_id[from]], y = nodes$y[node_by_id[from]], xend = nodes$x[node_by_id[to]], yend = nodes$y[node_by_id[to]]), aes(x = x, y = y, xend = xend, yend = yend), arrow = arrow(length = unit(0.2, "cm")), color = "#333333")
p <- p + theme_void() + coord_equal()
ggsave(out_path, p, width = 8, height = 5, dpi = 300)
cat("wrote", out_path, "\n")
