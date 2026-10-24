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
      const mongoose = require('mongoose');
      const conversationId = new mongoose.Types.ObjectId().toString();
      const now = new Date();
      await mongoose.connection.db.collection('conversations').insertOne({
        conversationId,
        title: 'Hello World',
        user: s.user,
        tenant: s.tenant,
        chatProjectId: s.projectId,
        recipeId: recipe.recipeId,
        recipeName: recipe.name,
        createdAt: now,
        updatedAt: now,
      });
      await mongoose.connection.db.collection('messages').insertOne({
        messageId: new mongoose.Types.ObjectId().toString(),
        conversationId,
        user: s.user,
        isCreatedByUser: true,
        sender: 'User',
        text: recipe.promptTemplate,
        createdAt: now,
        updatedAt: now,
      });

      console.error('[HELLO_WORLD] start', { hasAuth: !!req.headers.authorization, hasCookie: !!req.headers.cookie, conversationId });
      const base = `http://127.0.0.1:${process.env.PORT || 3080}`;
      const payload = {
        conversationId,
        text: recipe.promptTemplate,
        parentMessageId: null,
        endpoint: 'agents',
        files: [{ file_id: fileId, projectFileId: fileId, filename: file.name }],
      };
      fetch(`${base}/api/agents/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization || '',
          Cookie: req.headers.cookie || '',
        },
        body: JSON.stringify(payload),
      }).then(async (r) => {
        if (!r.ok) {
          const t = await r.text().catch(() => '');
          console.error('[HELLO_WORLD] chat submit failed', r.status, t.slice(0, 500));
          await svc.failRun(s, `chat submit ${r.status}: ${t.slice(0, 200)}`);
        }
      }).catch(async (e) => {
        console.error('[HELLO_WORLD] chat submit error', e.message);
        await svc.failRun(s, e.message);
      });

      res.json({ status: 'started', conversationId, state: await svc.getState(s) });
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
