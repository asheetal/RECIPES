'use strict';
const { makeService } = require('./core.cjs');

let instance;
function service() {
  if (instance) return instance;
  const mongoose = require('mongoose');
  const db = require('~/models');
  const database = () => mongoose.connection.db;
  const runs = () => database().collection('helloworldruns');
  const bucket = () => new mongoose.mongo.GridFSBucket(database(), { bucketName: 'helloworldpdfs' });
  const filter = (s) => ({ user: s.user, tenant: s.tenant, projectId: s.projectId });
  const repo = {
    getRun: (s) => runs().findOne(filter(s)),
    putRun: (s, r) => runs().replaceOne(filter(s), r, { upsert: true }),
    delRun: (s) => runs().deleteOne(filter(s)),
    uploadPdf: (s, name, buffer) =>
      new Promise((resolve, reject) => {
        const out = bucket().openUploadStream(name, { metadata: filter(s) });
        out.once('error', reject);
        out.once('finish', () => resolve(out.id));
        out.end(buffer);
      }),
    readPdf: (id) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        const stream = bucket().openDownloadStream(id);
        stream.on('data', (c) => chunks.push(c));
        stream.once('error', reject);
        stream.once('end', () => resolve(Buffer.concat(chunks)));
      }),
    removePdf: async (id) => {
      try { await bucket().delete(id); } catch (e) { if (!/File not found/i.test(e.message)) throw e; }
    },
  };
  instance = makeService(repo, { getProject: db.getChatProject });
  return instance;
}

function registerRoutes(router, projectFilesService) {
  const svc = service();

  router.get('/:projectId/hello-world', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      res.json(await svc.getState(s));
    } catch (e) { next(e); }
  });

  router.post('/:projectId/hello-world/start', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      const { fileId } = req.body || {};
      if (!fileId) return res.status(400).json({ error: 'fileId required' });

      const pfScope = { user: s.user, tenant: s.tenant, projectId: s.projectId };
      const { file, buffer } = await projectFilesService.read(pfScope, fileId);

      const started = await svc.startRun(s, fileId, file.name, buffer);
      if (started.status === 'no_new_run') return res.json(started);

      const recipe = require('/app/recipes/loader.cjs').load('hello_world');
      res.json({ status: 'started', state: await svc.getState(s) });

      setImmediate(async () => {
        const driver = require('/app/admin-tools/triage-driver.cjs');
        const gateway = require('/app/admin-tools/role-gateway.cjs');
        const ctx = driver.makeCtx({ user: { id: s.user, tenantId: s.tenant }, routeTag: 'hello_world' });
        ctx.__helloWorldProjectId = s.projectId;
        try {
          const { decision } = await driver.runTriage({
            req: ctx,
            prompt: recipe.promptTemplate,
            files: [{ name: file.name, file_id: fileId }],
            policy: recipe.triagePolicy,
            operate: async (r) => {
              const tool = require('/app/hello-world-feature/tool.cjs');
              return await tool.invoke(r, { file_id: fileId });
            },
          });
          const opd = await gateway.complete(
            'LLM_OPD',
            [
              { role: 'system', content: 'You are Assistant, the final user-facing responder. You have no tools. Close the turn honestly and concisely.' },
              { role: 'user', content: JSON.stringify({ recipe: 'Hello World', route: decision.route, result: 'completed' }) },
            ],
            { ctx, max_tokens: 512 },
          );
          gateway.audit(ctx, 'LLM_OPD', 'boundary_output', { text: opd?.choices?.[0]?.message?.content || '' });
        } catch (e) {
          await svc.failRun(s, e.message || String(e));
        }
      });
    } catch (e) { next(e); }
  });

  router.post('/:projectId/hello-world/start', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      const { fileId } = req.body || {};
      if (!fileId) return res.status(400).json({ error: 'fileId required' });

      const pfScope = { user: s.user, tenant: s.tenant, projectId: s.projectId };
      const { file, buffer } = await projectFilesService.read(pfScope, fileId);

      const started = await svc.startRun(s, fileId, file.name, buffer);
      if (started.status === 'no_new_run') return res.json(started);

      const recipe = require('/app/recipes/loader.cjs').load('hello_world');
      res.json({ status: 'started', state: await svc.getState(s) });

      setImmediate(async () => {
        const gateway = require('/app/admin-tools/role-gateway.cjs');
        const triage = require('/app/admin-tools/triage.cjs');
        const ctx = {
          user: { id: s.user, tenantId: s.tenant },
          body: { conversationId: 'recipe:' + s.projectId },
          __workflow: { id: require('node:crypto').randomUUID(), stage: 'LLM_TRIAGE', usage: [] },
          __helloWorldProjectId: s.projectId,
        };
        try {
          const decision = await triage.route({
            gateway,
            req: ctx,
            prompt: recipe.promptTemplate,
            files: [{ name: file.name, file_id: fileId }],
            conversation: [],
            policy: recipe.triagePolicy,
          });
          if (decision.route !== 'SURGERY') throw Error('unexpected route ' + decision.route);
          const tool = require('/app/hello-world-feature/tool.cjs');
          await tool.invoke(ctx, { file_id: fileId });
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
