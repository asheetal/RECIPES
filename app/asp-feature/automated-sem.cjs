'use strict';
const { makeService } = require('./core.cjs');
let instance;
function service() {
  if (instance) return instance;
  const mongoose = require('mongoose');
  const db = require('~/models');
  const database = () => mongoose.connection.db;
  const runs = () => database().collection('aspruns');
  const filter = (s) => ({ user: s.user, tenant: s.tenant, projectId: s.projectId });
  const repo = {
    getRun: (s) => runs().findOne(filter(s)),
    putRun: (s, r) => runs().replaceOne(filter(s), r, { upsert: true }),
    delRun: (s) => runs().deleteOne(filter(s)),
  };
  instance = makeService(repo, { getProject: db.getChatProject });
  return instance;
}
function registerRoutes(router, projectFilesService) {
  const svc = service();
  router.get('/:projectId/automated-sem', async (req, res, next) => {
    try { const s = await svc.scope(req, req.params.projectId); res.json(await svc.getState(s)); } catch (e) { next(e); }
  });
  router.post('/:projectId/automated-sem/start', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      const { fileId } = req.body || {};
      if (!fileId) return res.status(400).json({ error: 'fileId required' });
      const pfScope = { user: s.user, tenant: s.tenant, projectId: s.projectId };
      const { file, buffer } = await projectFilesService.read(pfScope, fileId);
      const started = await svc.startRun(s, fileId, file.name, buffer);
      await require('mongoose').connection.db.collection('searchmodes').updateOne({ user: s.user, tenant: s.tenant || null }, { $set: { mode: 'academic' } }, { upsert: true });
      if (started.status === 'no_new_run') return res.json(started);
      res.json({ status: 'started', state: await svc.getState(s) });
      const jwt = require('jsonwebtoken');
      const mongoose = require('mongoose');
      const db = mongoose.connection.db;
      const conversationId = new mongoose.Types.ObjectId().toString();
      const now = new Date();
      const recipe = require('/app/recipes/automated_sem.cjs');
      await db.collection('conversations').insertOne({ conversationId, title: recipe.name, user: s.user, tenant: s.tenant, chatProjectId: s.projectId, recipeId: recipe.recipeId, recipeName: recipe.name, createdAt: now, updatedAt: now });
      await db.collection('messages').insertOne({ messageId: new mongoose.Types.ObjectId().toString(), conversationId, user: s.user, isCreatedByUser: true, sender: 'User', text: recipe.prompt, createdAt: now, updatedAt: now });
      const token = jwt.sign({ id: s.user }, process.env.JWT_SECRET, { expiresIn: '10m' });
      const base = `http://127.0.0.1:${process.env.PORT || 3080}`;
      console.error('[ASP] dispatching to chat', conversationId);
      fetch(`${base}/api/agents/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'User-Agent': req.headers['user-agent'] || 'LibreChat/0.8.7' },
        body: JSON.stringify({ conversationId, text: recipe.prompt + '\n\nWorkbook file_id: ' + fileId, parentMessageId: null, tools: recipe.tools || [], files: [{ file_id: fileId, projectFileId: fileId, filename: file.name }] }),
        signal: AbortSignal.timeout(1800000),
      }).then(async (r) => {
        const body = await r.text().catch(() => '');
        console.error('[ASP] chat response', r.status, body.slice(0, 2000));
        if (!r.ok) await svc.failRun(s, `chat ${r.status}: ${body.slice(0, 200)}`);
      }).catch(async (e) => { console.error('[ASP] chat fetch error', e.message); await svc.failRun(s, e.message); });
    } catch (e) { next(e); }
  });
  router.get('/:projectId/automated-sem/output/:step', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      const output = await svc.getOutput(s, String(req.params.step));
      if (!output) return res.status(404).json({ error: 'step output not found' });
      const content = JSON.stringify(output, null, 2);
      res.set('Content-Type', 'application/json');
      res.set('Content-Disposition', `attachment; filename="step${req.params.step}_out.json"`);
      res.send(content);
    } catch (e) { next(e); }
  });
  router.get('/:projectId/automated-sem/artifacts', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      const extra = await svc.getExtra(s, '13');
      if (!extra || !extra.artifacts_b64) return res.status(404).json({ error: 'artifacts not available' });
      const buf = Buffer.from(extra.artifacts_b64, 'base64');
      res.set('Content-Type', 'application/zip');
      res.set('Content-Disposition', 'attachment; filename="asp_artifacts.zip"');
      res.send(buf);
    } catch (e) { next(e); }
  });
  router.delete('/:projectId/automated-sem', async (req, res, next) => {
    try { const s = await svc.scope(req, req.params.projectId); res.json(await svc.deleteRun(s)); } catch (e) { next(e); }
  });
}
module.exports = { registerRoutes, service };
