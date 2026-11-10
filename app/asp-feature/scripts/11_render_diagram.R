#!/usr/bin/env Rscript
suppressPackageStartupMessages({ library(jsonlite); library(ggplot2); library(grid) })
source("json_utils.R")
fail <- function(msg) { message(paste0("[11_RENDER] FATAL: ", msg)); quit(status = 7L) }
args <- commandArgs(trailingOnly = TRUE)
if (length(args) == 0) fail("no input file")
in_path <- args[1]
if (!file.exists(in_path)) fail(paste0("input not found: ", in_path))
input_json <- tryCatch(fromJSON(in_path), error = function(e) fail(paste0("invalid JSON: ", conditionMessage(e))))
if (is.null(input_json$models)) fail("missing required 'models' field")
models_list <- list()
if (is.data.frame(input_json$models)) {
  if (nrow(input_json$models) == 0L) fail("'models' data.frame is empty")
  for (k in seq_len(nrow(input_json$models))) {
    models_list[[k]] <- list(
      model_idx    = if (!is.null(input_json$models$model_idx[k]))    input_json$models$model_idx[k]    else k,
      output_image = if (!is.null(input_json$models$output_image[k])) input_json$models$output_image[k] else sprintf("sem_model_diagram_%d.png", k),
      nodes        = input_json$models$nodes[[k]],
      paths        = input_json$models$paths[[k]],
      footnote     = if (is.data.frame(input_json$models$footnote)) as.list(input_json$models$footnote[k, , drop = FALSE]) else input_json$models$footnote[[k]]
    )
  }
} else if (is.list(input_json$models)) {
  if (length(input_json$models) == 0L) fail("'models' list is empty")
  models_list <- input_json$models
} else fail("'models' neither data.frame nor list")
for (k in seq_along(models_list)) {
  m <- models_list[[k]]
  if (is.null(m$nodes)) fail(sprintf("model [%d] no nodes", k))
  if (is.null(m$paths)) fail(sprintf("model [%d] no paths", k))
  nodes_df <- tryCatch(as.data.frame(m$nodes), error = function(e) NULL)
  if (is.null(nodes_df) || nrow(nodes_df) == 0L) fail(sprintf("model [%d] nodes empty", k))
  paths_df <- tryCatch(as.data.frame(m$paths), error = function(e) NULL)
  if (is.null(paths_df) || nrow(paths_df) == 0L) fail(sprintf("model [%d] paths empty", k))
  if (!all(c("id","label","grid_pos") %in% names(nodes_df))) fail(sprintf("model [%d] nodes missing fields", k))
  if (!all(c("from","to","type","label") %in% names(paths_df))) fail(sprintf("model [%d] paths missing fields", k))
}
build_footnote_text <- function(fn) {
  if (is.null(fn)) return("")
  if (is.character(fn) && length(fn) == 1L) return(fn)
  if (!is.list(fn)) return(as.character(fn)[1])
  parts <- character(0)
  ctrl <- fn$controls
  if (!is.null(ctrl)) { if (is.list(ctrl)) ctrl <- paste(unlist(ctrl), collapse = ", "); ctrl <- as.character(ctrl)[1]; parts <- c(parts, paste0("Controls: ", ctrl)) }
  if (!is.null(fn[["N"]])) parts <- c(parts, paste0("N = ", as.integer(fn[["N"]])))
  if (!is.null(fn$sig_key)) parts <- c(parts, as.character(fn$sig_key)[1])
  if (!is.null(fn$imm)) { pt <- tryCatch(as.numeric(fn$imm$point[1]), error=function(e) NA); lo <- tryCatch(as.numeric(fn$imm$ci_low[1]), error=function(e) NA); hi <- tryCatch(as.numeric(fn$imm$ci_high[1]), error=function(e) NA); if (!is.na(pt) && !is.na(lo) && !is.na(hi)) parts <- c(parts, sprintf("Index of Moderated Mediation = %.3f, 95%% Boot CI [%.3f, %.3f]", pt, lo, hi)) }
  if (!is.null(fn$prior_art)) parts <- c(parts, as.character(fn$prior_art)[1])
  paste(parts, collapse = " | ")
}
rendered_files <- list()
for (m_idx in seq_along(models_list)) {
  m_spec     <- models_list[[m_idx]]
  idx_num    <- if (!is.null(m_spec$model_idx)) as.integer(m_spec$model_idx) else m_idx
  output_img <- if (!is.null(m_spec$output_image)) as.character(m_spec$output_image)[1] else sprintf("sem_model_diagram_%d.png", idx_num)
  nodes_df   <- as.data.frame(m_spec$nodes)
  paths_df   <- as.data.frame(m_spec$paths)
  footnote_text <- build_footnote_text(m_spec$footnote)
  node_coords <- list()
  for (i in seq_len(nrow(nodes_df))) {
    n_id <- nodes_df$id[i]
    pos  <- if (is.matrix(nodes_df$grid_pos)) nodes_df$grid_pos[i, ] else
            if (is.list(nodes_df$grid_pos)) as.numeric(nodes_df$grid_pos[[i]]) else as.numeric(nodes_df$grid_pos[i])
    if (length(pos) < 2L) fail(sprintf("model [%d] node '%s' malformed grid_pos", m_idx, n_id))
    node_coords[[n_id]] <- list(x = pos[1], y = pos[2], label = nodes_df$label[i])
  }
  bw <- if (!is.null(m_spec$node_w)) as.numeric(unlist(m_spec$node_w))[1] else 1.05
  bh <- if (!is.null(m_spec$node_h)) as.numeric(unlist(m_spec$node_h))[1] else 0.48
  xlim_val <- if (!is.null(m_spec$canvas_xlim)) as.numeric(unlist(m_spec$canvas_xlim))[1:2] else c(0, 11)
  ylim_val <- if (!is.null(m_spec$canvas_ylim)) as.numeric(unlist(m_spec$canvas_ylim))[1:2] else c(-0.2, 6.7)
  p <- ggplot() + coord_fixed(ratio = 1, xlim = xlim_val, ylim = ylim_val) + theme_void() +
    theme(plot.background = element_rect(fill = "white", color = NA))
  for (i in seq_len(nrow(paths_df))) {
    from_id <- paths_df$from[i]; to_id <- paths_df$to[i]
    p_type  <- paths_df$type[i]; p_label <- paths_df$label[i]
    p_col   <- if (!is.null(paths_df$color) && !is.na(paths_df$color[i])) as.character(paths_df$color[i]) else "black"
    p_lw    <- if (!is.null(paths_df$line_width) && !is.na(paths_df$line_width[i])) as.numeric(paths_df$line_width[i]) else 0.85
    p_lx    <- if (!is.null(paths_df$label_x) && !is.na(paths_df$label_x[i])) as.numeric(paths_df$label_x[i]) else NA_real_
    p_ly    <- if (!is.null(paths_df$label_y) && !is.na(paths_df$label_y[i])) as.numeric(paths_df$label_y[i]) else NA_real_
    if (!from_id %in% names(node_coords)) fail(sprintf("model [%d] path refs unknown '%s'", m_idx, from_id))
    if (grepl("->", to_id)) {
      parts  <- strsplit(to_id, "->", fixed = TRUE)[[1]]
      t_from <- trimws(parts[1]); t_to <- trimws(parts[2])
      if (!t_from %in% names(node_coords)) fail(sprintf("model [%d] stem refs unknown '%s'", m_idx, t_from))
      if (!t_to   %in% names(node_coords)) fail(sprintf("model [%d] stem refs unknown '%s'", m_idx, t_to))
      x_1 <- node_coords[[t_from]]$x; y_1 <- node_coords[[t_from]]$y
      x_2 <- node_coords[[t_to]]$x;   y_2 <- node_coords[[t_to]]$y
      x_target <- (x_1 + x_2) / 2; y_target <- (y_1 + y_2) / 2
      x_w <- node_coords[[from_id]]$x; y_w <- node_coords[[from_id]]$y
      p <- p + annotate("segment", x = x_w, y = y_w - bh, xend = x_target, yend = y_target + 0.08, arrow = arrow(length = unit(0.28, "cm"), type = "closed"), linewidth = p_lw, color = p_col)
      st_lx <- if (!is.na(p_lx)) p_lx else x_target + 0.65
      st_ly <- if (!is.na(p_ly)) p_ly else (y_w + y_target) / 2 + 0.20
      p <- p + annotate("label", x = st_lx, y = st_ly, label = p_label, hjust = 0.5, size = 3.4, fontface = "bold", color = p_col, fill = "white", label.size = NA, label.padding = unit(0.12, "lines"), family = "sans")
    } else if (identical(p_type, "dashed_arc")) {
      if (!to_id %in% names(node_coords)) fail(sprintf("model [%d] arc refs unknown '%s'", m_idx, to_id))
      x_start <- node_coords[[from_id]]$x + 0.15; y_start <- node_coords[[from_id]]$y - bh
      x_end   <- node_coords[[to_id]]$x   - 0.15; y_end   <- node_coords[[to_id]]$y   - bh
      t_seq  <- seq(0, 1, length.out = 100)
      ctrl_x <- (x_start + x_end) / 2; ctrl_y <- min(y_start, y_end) - 0.95
      arc_x  <- (1 - t_seq)^2 * x_start + 2 * (1 - t_seq) * t_seq * ctrl_x + t_seq^2 * x_end
      arc_y  <- (1 - t_seq)^2 * y_start + 2 * (1 - t_seq) * t_seq * ctrl_y + t_seq^2 * y_end
      arc_df <- data.frame(x = arc_x, y = arc_y)
      arc_col <- if (p_col == "black") "gray25" else p_col
      p <- p + geom_path(data = arc_df, aes(x = x, y = y), linetype = "dashed", linewidth = p_lw, color = arc_col)
      p <- p + annotate("segment", x = arc_x[95], y = arc_y[95], xend = x_end, yend = y_end - 0.02, arrow = arrow(length = unit(0.25, "cm"), type = "closed"), linewidth = p_lw, color = arc_col)
      arc_lx <- if (!is.na(p_lx)) p_lx else ctrl_x
      arc_ly <- if (!is.na(p_ly)) p_ly else min(arc_df$y) - 0.16
      p <- p + annotate("label", x = arc_lx, y = arc_ly, label = p_label, hjust = 0.5, size = 3.2, fontface = "italic", color = arc_col, fill = "white", label.size = NA, label.padding = unit(0.12, "lines"), family = "sans")
    } else {
      if (!to_id %in% names(node_coords)) fail(sprintf("model [%d] path refs unknown '%s'", m_idx, to_id))
      x_from <- node_coords[[from_id]]$x + bw; y_from <- node_coords[[from_id]]$y
      x_to   <- node_coords[[to_id]]$x   - bw; y_to   <- node_coords[[to_id]]$y
      p <- p + annotate("segment", x = x_from, y = y_from, xend = x_to, yend = y_to, arrow = arrow(length = unit(0.28, "cm"), type = "closed"), linewidth = p_lw, color = p_col)
      x_lbl <- if (!is.na(p_lx)) p_lx else (x_from + x_to) / 2
      y_lbl <- if (!is.na(p_ly)) p_ly else y_from + 0.30
      p <- p + annotate("label", x = x_lbl, y = y_lbl, label = p_label, hjust = 0.5, size = 3.4, fontface = "bold", color = p_col, fill = "white", label.size = NA, label.padding = unit(0.12, "lines"), family = "sans")
    }
  }
  for (i in seq_len(nrow(nodes_df))) {
    n_id <- nodes_df$id[i]
    cx <- node_coords[[n_id]]$x; cy <- node_coords[[n_id]]$y; lbl <- node_coords[[n_id]]$label
    p <- p + annotate("rect", xmin = cx - bw, xmax = cx + bw, ymin = cy - bh, ymax = cy + bh, fill = "white", color = "black", linewidth = 0.9)
    p <- p + annotate("text", x = cx, y = cy, label = lbl, size = 3.9, fontface = "bold", hjust = 0.5, vjust = 0.5, family = "sans")
  }
  if (nchar(footnote_text) > 0) {
    wrapped <- paste(strwrap(footnote_text, width = 110), collapse = "\n")
    p <- p + annotate("text", x = 5.5, y = 0.15, label = wrapped, size = 3.1, fontface = "italic", color = "gray25", hjust = 0.5, vjust = 0, family = "sans")
  }
  tryCatch({ ggsave(output_img, plot = p, width = 10.0, height = 5.7, dpi = 300) },
           error = function(e) fail(sprintf("ggsave failed model [%d]: %s", m_idx, conditionMessage(e))))
  rendered_files[[length(rendered_files) + 1L]] <- list(
    model_idx = idx_num, output_image = output_img, resolution = "300 dpi", footnote_rendered = footnote_text
  )
}
out <- input_json
out$status            <- "RENDER_SUCCESS"
out$rendered_diagrams <- rendered_files
cat(write_step_json(out))
quit(status = 0L)
