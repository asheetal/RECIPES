
- **ASP step 11 exits 7.** Live run 2026-10-25: steps 1–10 completed; step 11
  `[11_RENDER] FATAL:` (exit 7). Cause not yet diagnosed. Blocks steps 12–13.
  Deferred; step 2 verification is unaffected.

- **ASP step 13 exits 9 (citation gate).** Live run 2026-10-25: steps 1–12
  completed, step 13 aborted on `CITATION_GATE_FAILED`. Root cause: recipe
  does not invoke the research literature tool, so claims[] remain empty and
  step 12's references cannot link to SUPPORTED claim ids. Deferred; step 4
  verification is unaffected.
