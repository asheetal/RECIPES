'use strict';
const crypto = require('node:crypto');
function fail(status, message) { const e = new Error(message); e.status = status; throw e; }
function owner(req) {
  const user = String(req.user?.id || req.user?._id || '');
  if (!user) fail(401, 'Sign in required');
  return { user, tenant: String(req.user?.tenantId || '') };
}
function sha256(buf) { return crypto.createHash('sha256').update(buf).digest('hex'); }
function makeService(repo, deps) {
  async function scope(req, projectId) {
    const who = owner(req);
    if (typeof projectId !== 'string' || !/^[a-f0-9]{24}$/i.test(projectId)) fail(404, 'Project not found');
    if (!await deps.getProject(who.user, projectId)) fail(404, 'Project not found');
    return { ...who, projectId };
  }
  async function getState(s) {
    const r = await repo.getRun(s);
    if (!r) return { status: 'idle', steps: {} };
    const summary = {};
    for (const [k, v] of Object.entries(r.steps || {})) summary[k] = { ok: !!(v && v.ok) };
    return { status: r.status, sha256: r.sha256 || null, fileId: r.fileId || null, fileName: r.fileName || null, runId: r.runId || null, steps: summary, error: r.error || null, startedAt: r.startedAt || null, finishedAt: r.finishedAt || null };
  }
  async function startRun(s, fileId, fileName, buffer) {
    const existing = await repo.getRun(s);
    const hash = sha256(buffer);
    if (existing && existing.sha256 === hash && existing.status === 'done') return { status: 'no_new_run', state: await getState(s) };
    const runId = crypto.randomBytes(8).toString('hex');
    const record = { user: s.user, tenant: s.tenant, projectId: s.projectId, runId, fileId, fileName, sha256: hash, status: 'running', steps: {}, startedAt: new Date(), finishedAt: null, error: null };
    await repo.putRun(s, record);
    return { status: 'started', state: await getState(s) };
  }
  async function completeStep(s, step, output) {
    const r = await repo.getRun(s);
    if (!r) fail(404, 'No active run');
    r.steps = { ...(r.steps || {}), [String(step)]: { ok: true, output } };
    r.status = step === 1 ? 'done' : r.status;
    if (step === 1) r.finishedAt = new Date();
    await repo.putRun(s, r);
    return await getState(s);
  }
  async function failRun(s, message) {
    const r = await repo.getRun(s);
    if (!r) return;
    r.status = 'failed'; r.error = String(message).slice(0, 500); r.finishedAt = new Date();
    await repo.putRun(s, r);
  }
  async function deleteRun(s) { await repo.delRun(s); return { status: 'idle' }; }
  async function getOutput(s, step) {
    const r = await repo.getRun(s);
    if (!r || !r.steps || !r.steps[String(step)]) return null;
    return r.steps[String(step)].output;
  }
  return { scope, getState, startRun, completeStep, failRun, deleteRun, getOutput };
}
module.exports = { makeService, sha256 };
