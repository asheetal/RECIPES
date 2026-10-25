
- **ASP step 11 exits 7.** Live run 2026-10-25: steps 1–10 completed; step 11
  `[11_RENDER] FATAL:` (exit 7). Cause not yet diagnosed. Blocks steps 12–13.
  Deferred; step 2 verification is unaffected.

- **ASP step 13 exits 9 (citation gate).** Live run 2026-10-25: steps 1–12
  completed, step 13 aborted on `CITATION_GATE_FAILED`. Root cause: recipe
  does not invoke the research literature tool, so claims[] remain empty and
  step 12's references cannot link to SUPPORTED claim ids. Deferred; step 4
  verification is unaffected.

- **ASP step 6: `t_b1` becomes `"NA"` string on survivor M_027.** Step 4/5 carried `t_b1: 2.6688` (number); step 6 output has `t_b1: "NA"`. Origin: `06_filter_substantive.R` copies `m_row$t_b1` from step5's `candidate_models`; the field was lost somewhere between step 5 write and step 6 read. Not blocking; step 12 report may print `t = NA`. Deferred.
