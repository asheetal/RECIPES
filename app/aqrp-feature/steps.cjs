'use strict';
// ============================================================
// AQRP step registry — SINGLE SOURCE OF TRUTH for FINAL_STEP.
//
// HOW TO ADD STEP N (all five must change together, in this order):
//   1. Bump FINAL_STEP below.
//   2. Add the step to IMPLEMENTED below.
//   3. Add the if (step === N) branch to pipeline.cjs.
//   4. Add the if (step === N) branch to tool.cjs (write + completeStep).
//   5. Add prose for step N to app/recipes/aqrp.cjs (the PROMPT constant).
//
// Never define FINAL_STEP anywhere else. tool.cjs and core.cjs require it
// from here so a single bump is enough and the "run closed after step 1"
// failure mode cannot recur.
// ============================================================
const FINAL_STEP = 4;

const IMPLEMENTED = {
  1: { name: 'Load',           type: 'tool' },
  2: { name: 'Topical search', type: 'surgeon->tool' },
  3: { name: 'Familiarization', type: 'surgeon' },
  4: { name: 'Open coding', type: 'surgeon->coder' },
};

module.exports = { FINAL_STEP, IMPLEMENTED };
