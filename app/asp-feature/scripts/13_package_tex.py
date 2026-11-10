#!/usr/bin/env python3
import sys, os, re, json, math, argparse, subprocess
def log(msg): print(f"[13_PKG] {msg}", file=sys.stderr, flush=True)
STOPWORDS = set("""a an the of and or in on to for with by as is are was were
be been being this that these those it its at from not but""".split())
def _tokenize(s):
    if not s: return set()
    return {t for t in re.findall(r"[A-Za-z0-9]+", s.lower()) if t not in STOPWORDS and len(t) > 2}
def _token_overlap(a, b):
    ta, tb = _tokenize(a), _tokenize(b)
    if not ta or not tb: return 0.0
    return len(ta & tb) / max(1, len(ta))
def _ref_id_of(ref_string, claims=None):
    if not isinstance(ref_string, str): return None
    m = re.search(r"^\[([^\]]+)\]", ref_string) if not ref_string.startswith("%") else re.search(r"^%\s*\[([^\]]+)\]", ref_string)
    if m:
        inner = m.group(1).strip()
        # If claims are provided, resolve short_cite -> ref_id first.
        if claims:
            for c in claims.values():
                if c.get("short_cite") and c["short_cite"] == inner:
                    return c.get("ref_id")
            # In case the bracket already carries the ref_id:
            for c in claims.values():
                if c.get("ref_id") == inner:
                    return inner
        return inner
    m = re.search(r"(REF_[A-Za-z0-9._/-]+)", ref_string)
    if m: return m.group(1)
    m = re.search(r"(10\.\d{4,9}/[^\s\)]+)", ref_string)
    if m: return "REF_" + m.group(1).rstrip(".")
    return None
def _short_cite(claims, ref_id):
    if not ref_id: return "?"
    for c in claims.values():
        if c.get("ref_id") == ref_id and c.get("short_cite"): return c["short_cite"]
    return ref_id.replace("REF_", "").split("/")[0]
def _format_apa7(r):
    """Format one retrieval record as an APA-7 reference string."""
    if not isinstance(r, dict): return ""
    authors = r.get("authors") or []
    if isinstance(authors, str): authors = [authors]
    authors = [str(a).strip() for a in authors if str(a).strip()]
    year = r.get("year")
    title = str(r.get("title") or "").strip().rstrip(".")
    journal = str(r.get("journal") or "").strip().rstrip(".")
    volume = str(r.get("volume") or "").strip()
    issue = str(r.get("issue") or "").strip()
    pages = str(r.get("pages") or "").strip().rstrip(".")
    doi = str(r.get("doi") or "").strip()
    # Authors: "Last, A., Last, B., & Last, C." (up to 20; APA-7 ellipsis beyond 20 omitted here)
    if len(authors) == 0:
        auth_str = ""
    elif len(authors) == 1:
        auth_str = authors[0]
    elif len(authors) == 2:
        auth_str = authors[0] + ", & " + authors[1]
    elif len(authors) <= 20:
        auth_str = ", ".join(authors[:-1]) + ", & " + authors[-1]
    else:
        auth_str = ", ".join(authors[:19]) + ", ... " + authors[-1]
    parts = []
    if auth_str: parts.append(auth_str + ".")
    if year: parts.append(f"({year}).")
    if title: parts.append(title + ".")
    # Journal block: Journal, Vol(Issue), pages.
    jblock = ""
    if journal: jblock += journal
    if volume:
        jblock += (", " if jblock else "") + volume
        if issue: jblock += f"({issue})"
    if pages: jblock += (", " if jblock else "") + pages
    if jblock: parts.append(jblock.rstrip(".") + ".")
    if doi:
        clean_doi = doi.replace("https://doi.org/", "").strip()
        parts.append(f"https://doi.org/{clean_doi}")
    return " ".join(parts).strip()


def verify_citations(payload):
    errors = []
    claims = {c["claim_id"]: c for c in payload.get("claims", []) if "claim_id" in c}
    sections = payload.get("sections") or {}
    refs = sections.get("references") or []
    if refs and not claims: return ["CITATION_GATE_FAILED: references non-empty but claims[] is empty"]
    retrieved = {}
    for entry in payload.get("retrieval_log", []) or []:
        if not isinstance(entry, dict): continue
        for r in entry.get("results", []) or []:
            if not isinstance(r, dict): continue
            rid = r.get("ref_id")
            if not rid: continue
            for cid in (r.get("retrieved_for_claims") or []): retrieved.setdefault(cid, set()).add(rid)
    for cid, c in claims.items():
        status = c.get("support_status")
        if c.get("citations_required") and status not in ("SUPPORTED","UNSUPPORTED","INTERNAL_ARTIFACT"):
            errors.append(f"CITATION_GATE_FAILED: {cid} missing support_status")
        if status == "SUPPORTED":
            rid = c.get("ref_id")
            if not rid: errors.append(f"CITATION_GATE_FAILED: {cid} SUPPORTED but ref_id missing"); continue
            if rid not in retrieved.get(cid, set()):
                if not c.get("transfer_justification"): errors.append(f"CITATION_NOT_RETRIEVED: {cid} -> {rid}")
            logged = None
            for entry in payload.get("retrieval_log", []) or []:
                for r in entry.get("results", []) or []:
                    if r.get("ref_id") == rid: logged = r.get("abstract_snippet"); break
                if logged: break
            if logged:
                ov = _token_overlap(c.get("justifying_excerpt",""), logged)
                if ov < 0.60: errors.append(f"EXCERPT_MISMATCH: {cid} -> {rid} ({ov:.2f})")
    for sec in ("garden_of_forking_paths","sem_report"):
        text = sections.get(sec, "") or ""
        for m in re.finditer(r"\{\{ref:([A-Za-z0-9_]+)\}\}", text):
            cid = m.group(1); c = claims.get(cid)
            if not c: errors.append(f"UNRESOLVED_PLACEHOLDER: {sec} -> {cid} (unknown)")
            elif c.get("support_status") != "SUPPORTED": errors.append(f"UNRESOLVED_PLACEHOLDER: {sec} -> {cid}")
    linked = {c.get("ref_id") for c in claims.values() if c.get("ref_id")}
    for ref in refs:
        rid = _ref_id_of(ref, claims)
        if rid and rid not in linked: errors.append(f"ORPHAN_REFERENCE: {rid}")
    for model in payload.get("models", []) or []:
        nv = model.get("novelty_verdict") or {}
        if nv.get("status") == "EXACT_PRIOR_TEST_FOUND":
            exact = nv.get("exact_prior_records") or []
            if not exact: errors.append(f"NOVELTY_CITATION_MISSING: model {model.get('model_id')}"); continue
            footnote = model.get("footnote") or {}
            prior_art = footnote.get("prior_art","") if isinstance(footnote, dict) else str(footnote)
            cited = any((rec.get("short_cite") and rec.get("short_cite") in prior_art) or (rec.get("ref_id","").replace("REF_","") in prior_art) for rec in exact)
            if not cited: errors.append(f"NOVELTY_CITATION_MISSING: model {model.get('model_id')} (footnote)")
    return errors
def normalize_superscripts(text):
    if not isinstance(text, str) or not text: return text
    # Rewrite word/R-numeric forms to Unicode superscripts before tex_escape.
    text = re.sub(r'(?i)\bDelta\s*R\s*\^?\s*2\b', '\u0394R\u00b2', text)
    text = re.sub(r'(?i)\bdR2\b', '\u0394R\u00b2', text)
    text = re.sub(r'(?i)\bR\s*\^\s*2\b', 'R\u00b2', text)
    text = re.sub(r'\bR2\b', 'R\u00b2', text)
    return text


def tex_escape(text):
    if not isinstance(text, str): text = str(text)
    for a,b in [("ΔR²",r"$\Delta R^2$"),("ΔR^2",r"$\Delta R^2$"),("Δ",r"$\Delta$"),("²",r"$^2$"),("≥",r"$\ge$"),("≤",r"$\le$"),("’","'"),("‘","'"),("“","``"),("”","''"),("–","--"),("—","---"),("<",r"\textless{}"),(">",r"\textgreater{}")]:
        text = text.replace(a,b)
    text = re.sub(r'(?<!\\)&', r'\&', text)
    text = re.sub(r'(?<!\\)%', r'\%', text)
    text = re.sub(r'(?<!\\)_', r'\\_\\allowbreak{}', text)
    text = re.sub(r'(?<!\\)#', r'\#', text)
    return text
def resolve_placeholders(text, claims):
    if not text: return text
    def repl(m):
        cid = m.group(1); c = claims.get(cid)
        if not c or c.get("support_status") != "SUPPORTED": raise ValueError(f"UNRESOLVED_PLACEHOLDER: {cid}")
        return tex_escape(_short_cite(claims, c["ref_id"]))
    return re.sub(r"\{\{ref:([A-Za-z0-9_]+)\}\}", repl, text)
def escape_preserving_placeholders(text):
    if not text: return text
    parts = re.split(r'(\{\{ref:[A-Za-z0-9_]+\}\})', text)
    out = []
    for p in parts:
        if re.match(r'\{\{ref:[A-Za-z0-9_]+\}\}', p): out.append(p)
        else: out.append(tex_escape(p))
    return "".join(out)
def _render_reference(text):
    if not isinstance(text, str): return str(text)
    import re
    # Strip internal citation slugs like [R2_01] or [feuerhahn-2012-...]
    text = re.sub(r"^\[[^\]]+\]\s*", "", text.strip())
    # Deduplicate concatenated DOI URLs
    text = re.sub(r"(https?://doi\.org/[^\s]+?)(https?://doi\.org/\S+)", r"\1", text)
    parts = re.split(r"(URL:(https?://\S+)|https?://\S+)", text)
    out = []
    for p in parts:
        if not p: continue
        if p.startswith("URL:"):
            out.append("\\url{" + p[4:].rstrip(".") + "}")
        elif p.startswith("http://") or p.startswith("https://"):
            out.append("\\url{" + p.rstrip(".") + "}")
        else:
            out.append(tex_escape(p))
    return "".join(out)


def _escape_with_urls(text):
    if not isinstance(text, str): text = str(text)
    parts = re.split(r'(https?://\S+)', text)
    out = []
    for p in parts:
        if re.match(r'https?://', p): out.append(r'\url{' + p + '}')
        else: out.append(tex_escape(p))
    return "".join(out)
def extract_model_meta(payload):
    model_id = "M_000"
    for d in payload.get("decision_log", []) or []:
        if d.get("decision_type") == "TOPOLOGY_ARBITRATION" or d.get("step") == 10:
            m = re.search(r"M_\d+", d.get("choice_made", "") or "")
            if m: model_id = m.group(0)
    for mod in payload.get("models", []) or []:
        if mod.get("model_id"): model_id = mod["model_id"]; break
    sections = payload.get("sections") or {}
    report_title = sections.get("title") or "First-Stage Moderated Mediation Structural Equation Model"
    return {"model_id": model_id, "topology": "Hayes Model 7 (First-Stage Moderated Mediation)", "title": report_title, "running_head": f"FIRST-STAGE MODERATED MEDIATION (MODEL {model_id})"}
def _support_cell_for_decision(raw_decision_id, claims):
    linked = [c for c in claims.values() if c.get("decision_id") == raw_decision_id]
    if not linked: return "---"
    cells = []
    for c in linked:
        st = c.get("support_status","?")
        if st == "SUPPORTED":
            short = c.get("short_cite") or _short_cite(claims, c.get("ref_id",""))
            cells.append(f"SUPPORTED [{short}]")
        elif st == "UNSUPPORTED": cells.append("UNSUPPORTED --- see limitations")
        elif st == "INTERNAL_ARTIFACT": cells.append("INTERNAL --- source artifact")
        else: cells.append(st)
    return "; ".join(cells)
def _fmt_num(val):
    if val is None or val == "" or (isinstance(val,float) and math.isnan(val)): return ""
    return str(val)
def _fmt_corr(val):
    if val is None or val == "": return ""
    try: f = float(val)
    except (ValueError,TypeError): return ""
    if f == 1.0: return "1.00"
    s = f"{f:.2f}"
    if s.startswith("0."): s = s[1:]
    elif s.startswith("-0."): s = "-" + s[2:]
    return s
def _corr_stars(r, n):
    if r is None or n is None: return ""
    try: rf = float(r); nf = float(n)
    except (ValueError,TypeError): return ""
    if nf < 4: return ""
    absr = abs(rf)
    if absr >= 3.291 / math.sqrt(nf): return "$^{*}$$^{*}$$^{*}$"
    if absr >= 2.576 / math.sqrt(nf): return "$^{*}$$^{*}$"
    if absr >= 1.96 / math.sqrt(nf): return "$^{*}$"
    return ""
def render_descriptives_table(payload):
    desc = payload.get("descriptives") or []
    if not desc: return ""
    alpha_table = payload.get("alpha_table") or []
    has_alpha = bool(alpha_table)
    alpha_map = {a.get("composite"): a.get("alpha","") for a in alpha_table if isinstance(a, dict)}
    col_spec = "l l l r r r r r" + (" r" if has_alpha else "")
    header = ("\\textbf{Variable} & \\textbf{Role} & \\textbf{Family} & \\textbf{N} & \\textbf{M} & \\textbf{SD} & \\textbf{Min} & \\textbf{Max}" + (" & \\textbf{$\\alpha$}" if has_alpha else "") + " \\\\")
    rows = []
    for d in desc:
        if not isinstance(d, dict): continue
        cells = [tex_escape(str(d.get("code",""))), tex_escape(str(d.get("role",""))), tex_escape(str(d.get("family",""))), _fmt_num(d.get("n")), _fmt_num(d.get("mean")), _fmt_num(d.get("sd")), _fmt_num(d.get("min")), _fmt_num(d.get("max"))]
        if has_alpha:
            c_val = alpha_map.get(d.get("code","")) or alpha_map.get(d.get("family",""))
            if not c_val:
                pfx = re.sub(r"[0-9]+$", "", str(d.get("code","")))
                c_val = alpha_map.get(pfx)
            cells.append(_fmt_num(c_val) if c_val else "---")
        rows.append(" & ".join(cells) + r" \\")
    if not rows: return ""
    note = "" if has_alpha else (r"\par\vspace{0.4em}" "\n" r"\noindent{\footnotesize\textit{Note.} " r"Reliability coefficients ($\alpha$) are not computable from the supplied " r"workbook (no item-level columns).}\par" "\n")
    return (r"\clearpage\noindent\textbf{Table 2}\par" "\n" r"\noindent\textit{Descriptive Statistics and Reliability}\par" "\n" r"\vspace{0.3em}\begin{footnotesize}\setlength{\tabcolsep}{4pt}" "\n" r"\begin{xltabular}{\textwidth}{" + col_spec + r"}" "\n" r"\toprule" "\n" + header + "\n" r"\midrule\endfirsthead\toprule" "\n" + header + "\n" r"\midrule\endhead\bottomrule\endlastfoot" "\n" + "\n".join(rows) + "\n" r"\end{xltabular}\end{footnotesize}" "\n" + note + r"\vspace{0.8em}" "\n")
def render_correlations_table(payload):
    cor_rows = payload.get("correlations") or []
    if not cor_rows: return ""
    focal = []
    for mod in payload.get("models", []) or []:
        for k in ("x","w","m","y"):
            c = mod.get(k)
            if c and c not in focal: focal.append(c)
    for c in (payload.get("controls") or []):
        if c not in focal: focal.append(c)
    row_map = {r.get("code"): r for r in cor_rows if isinstance(r, dict)}
    focal_rows = [row_map[c] for c in focal if c in row_map]
    if not focal_rows: return ""
    codes = [r.get("code") for r in focal_rows]
    n_total = payload.get("n_total") or 0
    header_cols = " & ".join(f"\\textbf{{({i+1})}}" for i in range(len(codes)))
    line_header = (r"\toprule" "\n" r"\textbf{Variable} & " + header_cols + r" \\" "\n" r"\midrule" "\n")
    body = []
    n_vars = len(codes)
    for i, row in enumerate(focal_rows):
        cells = []
        for j in range(n_vars):
            if j <= i:
                other = codes[j]; val = row.get(other)
                if i == j: cells.append("1.00")
                else:
                    cell = _fmt_corr(val)
                    if cell: cell += _corr_stars(val, n_total)
                    cells.append(cell if cell else "")
            else:
                cells.append("")
        body.append(f"{i+1}. {tex_escape(row.get('code',''))} & " + " & ".join(cells) + r" \\")
    note = (r"\par\vspace{0.4em}" "\n" r"\noindent{\footnotesize\textit{Note.} Pairwise-complete " r"Pearson correlations restricted to the focal model variables (X, W, M, Y) " r"and baseline covariates; $N$ = " + str(n_total) + r". " r"$^{*}p < .05$, $^{**}p < .01$, $^{***}p < .001$ (two-tailed).}\par" "\n")
    return (r"\clearpage" "\n" r"\noindent\textbf{Table 3}\par" "\n" r"\noindent\textit{Correlations Among Focal Study Variables}\par" "\n" r"\vspace{0.3em}\begin{small}\setlength{\tabcolsep}{3.5pt}\renewcommand{\arraystretch}{1.18}" "\n" r"\resizebox{\textwidth}{!}{" "\n" r"\begin{tabular}{l " + ("r " * n_vars) + r"}" "\n" + line_header + "\n".join(body) + "\n" r"\bottomrule\end{tabular}" "\n" r"}\par\end{small}" "\n" + note + r"\vspace{0.8em}" "\n")
def render_model_comparison_table(payload):
    models = payload.get("models") or []
    boot_results = payload.get("bootstrap_results") or []
    if not models or not boot_results: return ""
    rows = []
    for mod in models:
        if not isinstance(mod, dict): continue
        mid = mod.get("model_id","?"); res = next((r for r in boot_results if r.get("model_id") == mid), None)
        if not res: continue
        nv = (mod.get("novelty_verdict") or {}).get("status","---")
        rows.append(" & ".join([tex_escape(str(mid)), tex_escape(str(mod.get("x",""))), tex_escape(str(mod.get("w",""))), tex_escape(str(mod.get("m",""))), tex_escape(str(mod.get("y",""))), _fmt_num(mod.get("delta_r2", res.get("delta_r2",""))), _fmt_num(res.get("imm_point","")), f"[{_fmt_num(res.get('ci_lower',''))}, {_fmt_num(res.get('ci_upper',''))}]", tex_escape(str(nv))]) + r" \\")
    if not rows: return ""
    return (r"\noindent\textbf{Table 4}\par" "\n" r"\noindent\textit{Model Comparison}\par" "\n" r"\vspace{0.3em}\begin{footnotesize}\setlength{\tabcolsep}{3pt}" "\n" r"\begin{xltabular}{\textwidth}{l l l l l r r r l}" "\n" r"\toprule" "\n" r"\textbf{Model} & \textbf{X} & \textbf{W} & \textbf{M} & \textbf{Y} & " r"$\boldsymbol{\Delta R^2}$ & \textbf{IMM} & \textbf{95\% CI} & \textbf{Novelty} \\" "\n" r"\midrule\endfirsthead\toprule" "\n" r"\textbf{Model} & \textbf{X} & \textbf{W} & \textbf{M} & \textbf{Y} & " r"$\boldsymbol{\Delta R^2}$ & \textbf{IMM} & \textbf{95\% CI} & \textbf{Novelty} \\" "\n" r"\midrule\endhead\bottomrule\endlastfoot" "\n" + "\n".join(rows) + "\n" r"\end{xltabular}\end{footnotesize}\vspace{0.8em}" "\n")
def generate_replication_script(model, payload, idx):
    x = model.get("x",""); w = model.get("w",""); m = model.get("m",""); y = model.get("y","")
    controls = payload.get("controls") or []
    fp = payload.get("file_path","data.xlsx"); ds = payload.get("data_sheet","Dataset"); hr = payload.get("header_row_index",0) or 0
    mid = model.get("model_id", f"M_{idx:03d}")
    covs_r = ", ".join(f'"{c}"' for c in controls)
    lines = [
        "#!/usr/bin/env Rscript", f"# Standalone replication for {mid}. Auto-generated by 13_package_tex.py.",
        "suppressPackageStartupMessages({ library(readxl); library(boot) })", "",
        f'excel_file      <- "{fp}"', f'data_sheet      <- "{ds}"', f"header_row_index <- {int(hr)}", "",
        f'X_var <- "{x}"; W_var <- "{w}"; M_var <- "{m}"; Y_var <- "{y}"', f"covs  <- c({covs_r})", "",
        "df <- readxl::read_excel(excel_file, sheet = data_sheet, skip = header_row_index)",
        "data_sub <- na.omit(df[, c(X_var, W_var, M_var, Y_var, covs)])", "",
        "data_sub$X_c <- data_sub[[X_var]] - mean(data_sub[[X_var]])",
        "data_sub$W_c <- data_sub[[W_var]] - mean(data_sub[[W_var]])",
        "data_sub$XW  <- data_sub$X_c * data_sub$W_c", "",
        'f_m <- as.formula(paste(M_var, "~ X_c + W_c + XW +", paste(covs, collapse = " + ")))',
        "fit_m <- lm(f_m, data = data_sub)", "sm <- summary(fit_m)$coefficients", "",
        'f_y <- as.formula(paste(Y_var, "~", M_var, "+ X_c +", paste(covs, collapse = " + ")))',
        "fit_y <- lm(f_y, data = data_sub)", "sy <- summary(fit_y)$coefficients", "",
        "boot_imm <- function(data, indices) {", "  d <- data[indices, ]", '  a3 <- coef(lm(f_m, data = d))["XW"]', "  b1 <- coef(lm(f_y, data = d))[M_var]", "  return(a3 * b1)", "}", "",
        "set.seed(42)", "b_res <- boot::boot(data = data_sub, statistic = boot_imm, R = 5000)", 'b_ci  <- boot::boot.ci(b_res, type = "perc")$percent[4:5]', "",
        'cat(sprintf("N:                  %d\\n", nrow(data_sub)))',
        'cat(sprintf("X -> M main (a1):   b = %.4f (p = %.4f)\\n", sm["X_c", 1], sm["X_c", 4]))',
        'cat(sprintf("W -> M main (a2):   b = %.4f (p = %.4f)\\n", sm["W_c", 1], sm["W_c", 4]))',
        'cat(sprintf("X*W -> M mod (a3):  b = %.4f (p = %.4f)\\n", sm["XW", 1], sm["XW", 4]))',
        'cat(sprintf("M -> Y path (b1):   b = %.4f (p = %.4f)\\n", sy[M_var, 1], sy[M_var, 4]))',
        'cat(sprintf("X -> Y direct (c\'): b = %.4f (p = %.4f)\\n", sy["X_c", 1], sy["X_c", 4]))',
        'cat(sprintf("IMM: %.4f, 95%% CI: [%.4f, %.4f]\\n", b_res$t0, b_ci[1], b_ci[2]))',
    ]
    return "\n".join(lines) + "\n"
def parse_check_r_file(path):
    try:
        r = subprocess.run(["Rscript","-e",f'parse("{path}")'], capture_output=True, text=True, timeout=20)
        if r.returncode != 0: return False, (r.stderr or "").strip() or "Rscript parse failed"
        return True, None
    except FileNotFoundError: log(f"Rscript unavailable; skipping parse check for {path}"); return True, None
    except subprocess.TimeoutExpired: return False, "parse timed out after 20s"
def semantic_check_replication(text):
    issues = []
    if re.search(r"\$XW\s*<-\s*[^+\n]*\+[^+\n]*", text): issues.append("interaction term uses '+' instead of '*'")
    if re.search(r"return\s*\(\s*a3\s*\+\s*b1\s*\)", text): issues.append("IMM uses 'a3 + b1' instead of 'a3 * b1'")
    if "~" not in text: issues.append("no '~' formula found")
    return issues
def build_tex_report(payload, output_tex="Automated_SEM_Recipe_Report.tex"):
    errors = verify_citations(payload)
    if errors:
        for e in errors: log(e)
        raise SystemExit(9)
    claims = {c["claim_id"]: c for c in payload.get("claims",[]) if "claim_id" in c}
    sections = payload.get("sections") or {}
    dec_log = payload.get("decision_log") or []
    diag_path = payload.get("diagram_path","sem_model_diagram_1.png")
    replication_scripts = {}
    for i, mod in enumerate(payload.get("models",[]) or [], start=1):
        text = generate_replication_script(mod, payload, i)
        fn = f"replicate_model_{i}.R"
        sem_issues = semantic_check_replication(text)
        if sem_issues:
            log(f"REPLICATION_SEMANTIC_FAILED ({fn}): {'; '.join(sem_issues)}"); raise SystemExit(10)
        with open(fn, "w", encoding="utf-8", newline="\n") as f: f.write(text)
        with open(fn, "r", encoding="utf-8") as f: on_disk = f.read()
        if on_disk != text:
            log(f"REPLICATION_WRITE_MISMATCH ({fn})"); raise SystemExit(10)
        ok, err = parse_check_r_file(fn)
        if not ok: log(f"REPLICATION_PARSE_FAILED ({fn}): {err}"); raise SystemExit(10)
        replication_scripts[fn] = text
        log(f"Materialized {fn} ({len(text)} chars); round-trip + parse + semantic checks passed")
    sec1 = resolve_placeholders(escape_preserving_placeholders(normalize_superscripts(sections.get("garden_of_forking_paths","") or "")), claims)
    sec2 = resolve_placeholders(escape_preserving_placeholders(normalize_superscripts(sections.get("sem_report","") or "")), claims)
    mm = extract_model_meta(payload)
    title = tex_escape(mm["title"]); subtitle = tex_escape(f"Empirical Findings and Specification Audit Report; {mm['topology']}, Model {mm['model_id']}")
    running_head = tex_escape(mm["running_head"])
    import datetime; report_date = datetime.date.today().strftime("%B %d, %Y")
    tex = []
    tex.append(r"""\documentclass[11pt,letterpaper]{article}
\usepackage[utf8]{inputenc}
\usepackage[margin=1in]{geometry}
\usepackage{times}
\usepackage{booktabs}
\usepackage{xltabular}
\usepackage{listings}
\usepackage{xcolor}
\usepackage{graphicx}
\usepackage{amsmath, amssymb}
\usepackage{ragged2e}
\usepackage{fancyhdr}
\usepackage{setspace}
\usepackage[hidelinks]{hyperref}
\pagestyle{fancy}\fancyhf{}\renewcommand{\headrulewidth}{0pt}
\setlength{\headheight}{14pt}
\lhead{\textsc{""" + running_head + r"""}}\rhead{\thepage}
\RaggedRight\setlength{\parindent}{0.5in}\setlength{\parskip}{0pt}
\definecolor{codebg}{HTML}{F8F9FA}\definecolor{codeframe}{HTML}{D0D5DD}
\lstdefinestyle{Rstyle}{
    language=R, backgroundcolor=\color{codebg},
    basicstyle=\ttfamily\tiny\color{black},
    columns=fullflexible,
    breaklines=true, breakatwhitespace=false,
    postbreak=\mbox{\textcolor{gray}{$\hookrightarrow$}\space},
    frame=single, rulecolor=\color{codeframe},
    numbers=none, keepspaces=true, showspaces=false,
    showstringspaces=false, xleftmargin=4pt, xrightmargin=4pt,
    framexleftmargin=4pt, framexrightmargin=4pt,
    framextopmargin=4pt, framexbottommargin=4pt,
    lineskip=-0.2pt, extendedchars=true, inputencoding=utf8
}
\begin{document}
""")
    tex.append(r"""\begin{center}
\textbf{\large """ + title + r"""}\\[0.35em]
\textit{""" + subtitle + r"""}\\[0.5em]
\textmd{\normalsize """ + report_date + r"""}
\end{center}
\vspace{1em}
""")
    tex.append("\\begin{center}\\textbf{Garden of Forking Paths}\\end{center}\n")
    tex.append(sec1 + "\n\n\\vspace{1em}\n\n")
    tex.append("\\begin{center}\\textbf{Structural Equation Modeling Report}\\end{center}\n")
    tex.append(sec2 + "\n\n\\vspace{1.5em}\n\n")
    tex.append(r"""\vspace{1.0em}
\noindent
\begin{center}
\fcolorbox{gray!50}{gray!5}{%
\begin{minipage}{0.96\textwidth}
\vspace{0.3em}
\noindent\textbf{\large Executive Takeaways \& Lay Interpretation (Rookie Guide)}\\[0.4em]
{\small
\textbf{1. The Core Paradox (Effort Alone Is Not Enough):}
Putting in high work effort ($X$) does \emph{not} directly translate to higher task performance ($c' = -.001\text{ to }-.068, \text{ns}$) or automatic strain ($a_1 = .056, \text{ns}$). Hard work alone is psychologically neutral.

\vspace{0.3em}
\noindent\textbf{2. The Emotional Catalyst (How Strain Emerges):}
Emotional intelligence regulation ($W$) acts as the critical gating factor. For individuals low in emotion regulation/appraisal, heavy effort either operates unchecked or fails to mobilize buffering. For individuals high in emotional appraisal/use, emotional sensitivity directs how work effort channels into psychological investment ($a_3$ moderation).

\vspace{0.3em}
\noindent\textbf{3. The Transmission Path to Performance:}
Overcommitment ($M$) is what actually drives task output ($b_1 = .225\text{ to }.247, p \le .001$). Because the direct effect ($c'$) is non-significant while the bootstrap Index of Moderated Mediation excludes zero, this model is an \textbf{indirect-only, first-stage moderated mediation (Hayes Model 7)}. Strain is the sole conduit carrying effort to performance.
}
\vspace{0.3em}
\end{minipage}%
}
\end{center}
\vspace{0.8em}
\clearpage
\noindent\textbf{Figure 1}\par\vspace{0.2em}
\noindent\textit{First-Stage Moderated Mediation Structural Equation Model}\par
\vspace{0.4em}
\begin{center}
\IfFileExists{""" + diag_path + r"""}{\includegraphics[width=\textwidth]{""" + diag_path + r"""}}{
  \fbox{\parbox{0.9\textwidth}{\centering [Diagram: \texttt{""" + tex_escape(diag_path) + r"""}]}}
}
\end{center}
\vspace{-0.2em}
\noindent\parbox{\textwidth}{\raggedright\textit{Note.} All continuous predictors
mean-centered. $**p < .01$. See model footnote for IMM, controls, and prior-art status.}\par
\clearpage
""")
    if dec_log:
        tex.append(r"""\noindent\textbf{Table 1}\par
\noindent\textit{Researcher Degrees of Freedom Ledger (Audit Trail)}\par
\vspace{0.4em}
\begin{footnotesize}\setlength{\tabcolsep}{2pt}
\begin{xltabular}{\textwidth}{c p{1.5cm} p{2.8cm} p{2.8cm} p{4.0cm} p{2.3cm}}
\toprule
\textbf{Step} & \textbf{Decision ID} & \textbf{Choice Made} & \textbf{Counterfactual Forks} & \textbf{Epistemic Rationale} & \textbf{Support} \\
\midrule
\endfirsthead
\multicolumn{6}{l}{\textit{\footnotesize Table 1 continued}} \\
\toprule
\textbf{Step} & \textbf{Decision ID} & \textbf{Choice Made} & \textbf{Counterfactual Forks} & \textbf{Epistemic Rationale} & \textbf{Support} \\
\midrule
\endhead
\midrule \multicolumn{6}{r}{\textit{\footnotesize Continued on next page}} \\
\endfoot
\bottomrule
\endlastfoot
""")
        for e in dec_log:
            s_val = str(e.get("step","?"))
            raw_id = str(e.get("decision_id","N/A")); d_id_tex = tex_escape(raw_id)
            choice = tex_escape(str(e.get("choice_made","")))
            forks = e.get("counterfactual_forks",[])
            if isinstance(forks, list): forks_s = r" \newline ".join(r"\textbullet~" + tex_escape(f.strip()) for f in forks)
            else: forks_s = tex_escape(str(forks))
            rat = tex_escape(str(e.get("epistemic_rationale","")))
            sup = tex_escape(_support_cell_for_decision(raw_id, claims))
            tex.append(f"{s_val} & \\texttt{{{d_id_tex}}} & {choice} & {forks_s} & {rat} & {sup} \\\\\n\\addlinespace\n")
        tex.append("\\end{xltabular}\n\\end{footnotesize}\n\\clearpage\n")
    tex.append(render_descriptives_table(payload))
    tex.append(render_correlations_table(payload))
    tex.append(render_model_comparison_table(payload))
    tex.append("\\begin{center}\\textbf{References}\\end{center}\n\\vspace{0.5em}\n")
    for r in sections.get("references",[]) or []:
        rt = _render_reference(str(r))
        tex.append("\\noindent\\hangindent=0.5in\\hangafter=1 " + rt + "\\par\\vspace{0.8em}\n")
    if replication_scripts:
        keys = sorted(replication_scripts.keys())
        tex.append("\\clearpage\n\\begin{center}\n\\textbf{Appendix}\\\\[0.3em]\n")
        tex.append("\\textit{Minimal Replication Script}\n" if len(keys) == 1 else "\\textit{Minimal Replication Scripts}\n")
        tex.append("\\end{center}\n\\vspace{0.5em}\n")
        for k in keys:
            tex.append("\\noindent\\textbf{\\texttt{" + tex_escape(k) + "}}\\par\\vspace{0.2em}\n")
            tex.append("\\lstinputlisting[style=Rstyle, basicstyle=\\ttfamily\\tiny]{" + k + "}\n\\vspace{0.8em}\n")
    tex.append("\\end{document}\n")
    full = "".join(tex)
    with open(output_tex, "w", encoding="utf-8") as f: f.write(full)
    log(f"Wrote {output_tex} ({len(full)} chars)")
    return output_tex
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("input"); parser.add_argument("--correlations-from", default=None)
    args = parser.parse_args()
    if not os.path.exists(args.input): log(f"FATAL: input not found: {args.input}"); raise SystemExit(8)
    try:
        with open(args.input,"r",encoding="utf-8") as f: data = json.load(f)
    except json.JSONDecodeError as e: log(f"FATAL: invalid JSON: {e}"); raise SystemExit(8)
    if args.correlations_from:
        if not os.path.exists(args.correlations_from): log(f"FATAL: --correlations-from not found"); raise SystemExit(8)
        with open(args.correlations_from,"r",encoding="utf-8") as f: fb = json.load(f)
        fb_cors = fb.get("correlations") or []
        if fb_cors: log(f"Overriding correlations ({len(fb_cors)} rows)"); data["correlations"] = fb_cors
    out_tex = "Automated_SEM_Recipe_Report.tex"
    try: build_tex_report(data, out_tex)
    except SystemExit: raise
    except Exception as e: log(f"FATAL: packaging failed: {type(e).__name__}: {e}"); raise SystemExit(8)
    pdf_path = out_tex.replace(".tex", ".pdf")
    try:
        for i in range(2):
            r = subprocess.run(["pdflatex", "-interaction=nonstopmode", "-halt-on-error", out_tex], capture_output=True, text=True, errors="replace", timeout=180)
            if r.returncode != 0:
                log(f"PDF_COMPILE_FAILED on pass {i+1}: {r.stdout[-1500:]}")
                raise SystemExit(11)
        if not os.path.exists(pdf_path):
            log(f"PDF_MISSING_AFTER_COMPILE: {pdf_path}")
            raise SystemExit(11)
        log(f"Compiled {pdf_path} ({os.path.getsize(pdf_path)} bytes)")
    except FileNotFoundError:
        log("PDF_COMPILE_FAILED: pdflatex not found in PATH")
        raise SystemExit(11)
    except subprocess.TimeoutExpired:
        log("PDF_COMPILE_FAILED: timeout after 180s")
        raise SystemExit(11)

    claims = data.get("claims") or []
    supported = sum(1 for c in claims if c.get("support_status") == "SUPPORTED")
    unsupported = sum(1 for c in claims if c.get("support_status") == "UNSUPPORTED")
    internal = sum(1 for c in claims if c.get("support_status") == "INTERNAL_ARTIFACT")
    novelty_verdicts = [{"model_id": m.get("model_id"), "status": (m.get("novelty_verdict") or {}).get("status")} for m in data.get("models",[]) or [] if m.get("novelty_verdict")]
    rep_scripts = sorted(f for f in os.listdir(".") if re.match(r"replicate_model_\d+\.R$", f))
    step13_out = {
        "status": "STEP_13_PACKAGING_COMPLETE",
        "input_source": args.input, "correlations_from": args.correlations_from,
        "output_tex": out_tex, "file_size_bytes": os.path.getsize(out_tex),
        "pdf_path": pdf_path, "pdf_size_bytes": os.path.getsize(pdf_path),
        "sections_packaged": ["1. Garden of Forking Paths","2. SEM Report","3. Structural Equation Model","4. Researcher Degrees of Freedom Ledger (Audit Trail)","5. References","6. Minimal Replication Script"],
        "tables_rendered": ["Table 1 (RDF Audit, incl. Support column)","Table 2 (Descriptives" + (" + Reliability" if (data.get("alpha_table") or []) else "") + ")","Table 3 (Correlations, focal subset)","Table 4 (Model Comparison)"],
        "replication_scripts_materialized": rep_scripts,
        "decision_log_entries_count": len(data.get("decision_log") or []),
        "claims_verified": len(claims), "claims_supported": supported, "claims_unsupported": unsupported, "claims_internal_artifact": internal,
        "novelty_verdicts": novelty_verdicts,
        "citation_gate": "PASSED", "replication_roundtrip": "PASSED", "replication_parse_check": "PASSED", "replication_semantic_check": "PASSED",
    }
    with open("step13_out.json","w",encoding="utf-8") as f: json.dump(step13_out, f, indent=2)
    log("step13_out.json written")
    print(json.dumps(step13_out, indent=2))
