'use strict';
const RUNNER_URL = 'http://asp-runner:8091';
async function runStep({ step, runId, workbookB64, workbookName, payload }) {
  const body = JSON.stringify({ step: String(step), run_id: runId, workbook_b64: workbookB64 || null, workbook_name: workbookName || null, payload: payload || null });
  let r;
  try { r = await fetch(`${RUNNER_URL}/run`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, signal: AbortSignal.timeout(2000000) }); }
  catch (e) { throw new Error(`asp-runner unreachable: ${e.message}`); }
  const j = await r.json();
  if (!j.ok) { const err = new Error(j.error || 'step failed'); err.detail = j; throw err; }
  return j;
}
module.exports = { runStep, RUNNER_URL };
