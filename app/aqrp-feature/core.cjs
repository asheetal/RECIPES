'use strict';
const crypto = require('node:crypto');
const { FINAL_STEP } = require('./steps.cjs');
const IDLE_TIMEOUT_MS = 15 * 60 * 1000;
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
    let r = await repo.getRun(s);
    if (!r) return { status: 'idle', steps: {}, currentStep: 0, lastStepOk: null };
    if (r.status === 'running' && r.lastProgressAt) {
      const idle = Date.now() - new Date(r.lastProgressAt).getTime();
      if (idle > IDLE_TIMEOUT_MS) {
        r.status = 'failed';
        r.error = `No progress for ${Math.round(idle/60000)} minutes; last closed step: ${Object.keys(r.steps||{}).length}/${FINAL_STEP}`;
        r.finishedAt = new Date();
        await repo.putRun(s, r);
      }
    }
    const summary = {};
    for (const [k, v] of Object.entries(r.steps || {})) summary[k] = { ok: !!(v && v.ok) };
    const closed = Object.keys(summary).filter(k => summary[k].ok).map(Number).sort((a,b)=>a-b);
    const lastStepOk = closed.length ? closed[closed.length-1] : null;
    return { status: r.status, progress: r.progress || null, sha256: r.sha256 || null, fileId: r.fileId || null, fileName: r.fileName || null, runId: r.runId || null, steps: summary, currentStep: lastStepOk, lastStepOk, error: r.error || null, startedAt: r.startedAt || null, finishedAt: r.finishedAt || null };
  }
  async function startRun(s, fileId, fileName, buffer) {
    const runId = crypto.randomBytes(8).toString('hex');
    const record = { user: s.user, tenant: s.tenant, projectId: s.projectId, runId, fileId, fileName, sha256: sha256(buffer), status: 'running', steps: {}, startedAt: new Date(), lastProgressAt: new Date(), finishedAt: null, error: null };
    await repo.putRun(s, record);
    return { status: 'started', state: await getState(s) };
  }
  async function completeStep(s, step, output, extra) {
    const r = await repo.getRun(s);
    if (!r) fail(404, 'No active run');
    const entry = { ok: true, output };
    if (extra) entry.extra = extra;
    r.steps = { ...(r.steps || {}), [String(step)]: entry };
    r.lastProgressAt = new Date();
    if (Number(step) === FINAL_STEP) { r.status = 'done'; r.finishedAt = new Date(); }
    await repo.putRun(s, r);
    return await getState(s);
  }
  async function failRun(s, message) {
    const r = await repo.getRun(s);
    if (!r) return;
    r.status = 'failed'; r.error = String(message).slice(0, 800); r.finishedAt = new Date();
    await repo.putRun(s, r);
  }
  async function killRun(s, message) {
    const r = await repo.getRun(s);
    if (!r) return { status: 'idle' };
    if (r.status !== 'running') return await getState(s);
    r.status = 'killed'; r.error = String(message || 'killed by user').slice(0, 800); r.finishedAt = new Date();
    await repo.putRun(s, r);
    return await getState(s);
  }
  async function deleteRun(s) { await repo.delRun(s); return { status: 'idle' }; }
  async function getOutput(s, step) {
    const r = await repo.getRun(s);
    if (!r || !r.steps || !r.steps[String(step)]) return null;
    return r.steps[String(step)].output;
  }
  async function getExtra(s, step) {
    const r = await repo.getRun(s);
    if (!r || !r.steps || !r.steps[String(step)]) return null;
    return r.steps[String(step)].extra || null;
  }
  async function getMaxBatchRecords() {
    try {
      const mongoose = require('mongoose');
      const doc = await mongoose.connection.db.collection('lab_llm_role_settings').findOne({ _id: 'assignments' });
      const v = Number(doc && doc.maxBatchRecords);
      if (Number.isInteger(v) && v > 0) return v;
    } catch (e) {}
    return 200;
  }
  return { scope, getState, startRun, completeStep, failRun, killRun, deleteRun, getOutput, getExtra, getMaxBatchRecords };
}
module.exports = { makeService, sha256, FINAL_STEP };
