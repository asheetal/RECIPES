'use strict';
const { makeService } = require('./core.cjs');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const execFileP = promisify(execFile);

let instance;
function service() {
  if (instance) return instance;
  const mongoose = require('mongoose');
  const db = require('~/models');
  const database = () => mongoose.connection.db;
  const runs = () => database().collection('helloworldruns');
  const bucket = () => new mongoose.mongo.GridFSBucket(database(), { bucketName: 'helloworldpdfs' });
  const filter = s => ({ user: s.user, tenant: s.tenant, projectId: s.projectId });
  const repo = {
    getRun: s => runs().findOne(filter(s)),
    putRun: (s, r) => runs().replaceOne(filter(s), r, { upsert: true }),
    delRun: s => runs().deleteOne(filter(s)),
    uploadPdf: (s, name, buffer) => new Promise((resolve, reject) => {
      const out = bucket().openUploadStream(name, { metadata: filter(s) });
      out.once('error', reject); out.once('finish', () => resolve(out.id)); out.end(buffer);
    }),
    readPdf: id => new Promise((resolve, reject) => {
      const chunks = []; const stream = bucket().openDownloadStream(id);
      stream.on('data', c => chunks.push(c)); stream.once('error', reject);
      stream.once('end', () => resolve(Buffer.concat(chunks)));
    }),
    removePdf: async id => { try { await bucket().delete(id); } catch (e) { if (!/File not found/i.test(e.message)) throw e; } },
  };
  instance = makeService(repo, { getProject: db.getChatProject });
  return instance;
}

async function runWorker(xlsxBuffer, fileName) {
  const td = await fs.mkdtemp(path.join(os.tmpdir(), 'hw-'));
  try {
    const xlsxPath = path.join(td, fileName || 'input.xlsx');
    const pdfPath = path.join(td, 'out.pdf');
    await fs.writeFile(xlsxPath, xlsxBuffer);
    const { stdout } = await execFileP('python3', ['/app/hello-world-feature/worker.py', xlsxPath, pdfPath], {
      env: { ...process.env, PYTHONPATH: '/app/pylibs' },
      maxBuffer: 10 * 1024 * 1024,
    });
    const parsed = JSON.parse(stdout.trim().split('\n').pop());
    if (!parsed.ok) throw new Error(parsed.error || 'worker failed');
    const pdf = await fs.readFile(pdfPath);
    return pdf;
  } finally {
    await fs.rm(td, { recursive: true, force: true });
  }
}

function registerRoutes(router, projectFilesService) {
  const svc = service();

  router.get('/:projectId/hello-world', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      res.json(await svc.getState(s));
    } catch (e) { next(e); }
  });

  router.post('/:projectId/hello-world/run', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      const { fileId } = req.body || {};
      if (!fileId) return res.status(400).json({ error: 'fileId required' });
      const pfScope = { user: s.user, tenant: s.tenant, projectId: s.projectId };
      const { file, buffer } = await projectFilesService.read(pfScope, fileId);
      const started = await svc.startRun(s, fileId, file.name, buffer);
      if (started.status === 'no_new_run') return res.json(started);
      res.json(started);
      // Background run
      setImmediate(async () => {
        try {
          const pdf = await runWorker(buffer, file.name);
          await svc.completeRun(s, pdf);
        } catch (e) {
          await svc.failRun(s, e.message || String(e));
        }
      });
    } catch (e) { next(e); }
  });

  router.get('/:projectId/hello-world/pdf', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      const { buffer } = await svc.readPdf(s);
      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition', 'inline; filename="hello-world.pdf"');
      res.send(buffer);
    } catch (e) { next(e); }
  });

  router.delete('/:projectId/hello-world', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      res.json(await svc.deleteRun(s));
    } catch (e) { next(e); }
  });
}

module.exports = { registerRoutes, service };
