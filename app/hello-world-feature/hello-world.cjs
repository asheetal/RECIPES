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
      res.json({ status: 'started', state: await svc.getState(s) });

      const jwt = require('jsonwebtoken');
      const mongoose = require('mongoose');
      const db = mongoose.connection.db;
      const conversationId = new mongoose.Types.ObjectId().toString();
      const now = new Date();
      const recipe = require('/app/recipes/hello_world.cjs');
      await db.collection('conversations').insertOne({
        conversationId, title: 'Hello World', user: s.user, tenant: s.tenant,
        chatProjectId: s.projectId, recipeId: recipe.recipeId, recipeName: recipe.name,
        endpoint: 'agents', createdAt: now, updatedAt: now,
      });
      await db.collection('messages').insertOne({
        messageId: new mongoose.Types.ObjectId().toString(), conversationId,
        user: s.user, isCreatedByUser: true, sender: 'User',
        text: recipe.prompt, createdAt: now, updatedAt: now,
      });
      const token = jwt.sign({ id: s.user }, process.env.JWT_SECRET, { expiresIn: '10m' });
      const base = `http://127.0.0.1:${process.env.PORT || 3080}`;
      console.error('[HELLO_WORLD] dispatching to chat', conversationId);
      fetch(`${base}/api/agents/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          conversationId, text: recipe.prompt, parentMessageId: null,
          endpoint: 'agents', files: [{ file_id: fileId, projectFileId: fileId, filename: file.name }],
        }),
        signal: AbortSignal.timeout(180000),
      }).then(async (r) => {
        const body = await r.text().catch(() => '');
        console.error('[HELLO_WORLD] chat response', r.status, body.slice(0, 3000));
        if (!r.ok) {
          await svc.failRun(s, `chat ${r.status}: ${body.slice(0, 200)}`);
        }
      }).catch(async (e) => {
        console.error('[HELLO_WORLD] chat fetch error', e.message);
        await svc.failRun(s, e.message);
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
