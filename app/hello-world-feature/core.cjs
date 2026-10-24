'use strict';
const crypto = require('node:crypto');
const SHEET_PEEK_ROWS = 5;

function fail(status, message) { const e = new Error(message); e.status = status; throw e; }

function owner(req) {
  const user = String(req.user?.id || req.user?._id || '');
  if (!user) fail(401, 'Sign in required');
  return { user, tenant: String(req.user?.tenantId || '') };
}

function sha256(buffer) { return crypto.createHash('sha256').update(buffer).digest('hex'); }

function makeService(repo, deps) {
  async function scope(req, projectId) {
    const who = owner(req);
    if (typeof projectId !== 'string' || !/^[a-f0-9]{24}$/i.test(projectId)) fail(404, 'Project not found');
    if (!await deps.getProject(who.user, projectId)) fail(404, 'Project not found');
    return { ...who, projectId };
  }

  async function getState(s) {
    const r = await repo.getRun(s);
    if (!r) return { status: 'idle' };
    return {
      status: r.status,
      sha256: r.sha256 || null,
      fileId: r.fileId || null,
      fileName: r.fileName || null,
      pdfId: r.pdfId || null,
      error: r.error || null,
      startedAt: r.startedAt || null,
      finishedAt: r.finishedAt || null,
    };
  }

  async function startRun(s, fileId, fileName, buffer) {
    const existing = await repo.getRun(s);
    const hash = sha256(buffer);
    if (existing && existing.sha256 === hash && existing.status === 'done' && existing.pdfId) {
      return { status: 'no_new_run', state: await getState(s) };
    }
    if (existing && existing.status === 'running') fail(409, 'A run is already in progress');
    const run = {
      ...s, sha256: hash, fileId, fileName,
      status: 'running', pdfId: null, error: null,
      startedAt: new Date(), finishedAt: null,
    };
    await repo.putRun(s, run);
    return { status: 'started', state: await getState(s) };
  }

  async function completeRun(s, pdfBuffer) {
    const run = await repo.getRun(s);
    if (!run) fail(404, 'No active run');
    const pdfId = await repo.uploadPdf(s, 'hello-world.pdf', pdfBuffer);
    if (run.pdfId) await repo.removePdf(run.pdfId);
    const next = { ...run, status: 'done', pdfId, error: null, finishedAt: new Date() };
    await repo.putRun(s, next);
    return getState(s);
  }

  async function failRun(s, message) {
    const run = await repo.getRun(s);
    if (!run) return;
    await repo.putRun(s, { ...run, status: 'failed', error: String(message || 'Unknown error'), finishedAt: new Date() });
  }

  async function deleteRun(s) {
    const run = await repo.getRun(s);
    if (!run) return { deleted: false };
    if (run.pdfId) await repo.removePdf(run.pdfId);
    await repo.delRun(s);
    return { deleted: true };
  }

  async function readPdf(s) {
    const run = await repo.getRun(s);
    if (!run || !run.pdfId) fail(404, 'No PDF for this project');
    return { run, buffer: await repo.readPdf(run.pdfId) };
  }

  return { scope, getState, startRun, completeRun, failRun, deleteRun, readPdf };
}

module.exports = { makeService, sha256, owner, fail, SHEET_PEEK_ROWS };
