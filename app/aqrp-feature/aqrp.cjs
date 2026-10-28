'use strict';
const { makeService } = require('./core.cjs');
let instance;
function service() {
  if (instance) return instance;
  const mongoose = require('mongoose');
  const db = require('~/models');
  const database = () => mongoose.connection.db;
  const runs = () => database().collection('aqrpruns');
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

  router.get('/:projectId/aqrp', async (req, res, next) => {
    try { const s = await svc.scope(req, req.params.projectId); res.json(await svc.getState(s)); } catch (e) { next(e); }
  });

  router.post('/:projectId/aqrp/start', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      const { fileId } = req.body || {};
      if (!fileId) return res.status(400).json({ error: 'fileId required' });
      const pfScope = { user: s.user, tenant: s.tenant, projectId: s.projectId };
      const { file, buffer } = await projectFilesService.read(pfScope, fileId);
      if (!/\.json$/i.test(file.name)) return res.status(415).json({ error: 'AQRP accepts JSON only' });
      const started = await svc.startRun(s, fileId, file.name, buffer);
      res.json({ status: 'started', state: await svc.getState(s) });

      const jwt = require('jsonwebtoken');
      const mongoose = require('mongoose');
      const db = mongoose.connection.db;
      const conversationId = new mongoose.Types.ObjectId().toString();
      const now = new Date();
      const recipe = require('/app/recipes/aqrp.cjs');
      await db.collection('conversations').insertOne({ conversationId, title: recipe.name, user: s.user, tenant: s.tenant, chatProjectId: s.projectId, recipeId: recipe.recipeId, recipeName: recipe.name, createdAt: now, updatedAt: now });
      await db.collection('messages').insertOne({ messageId: new mongoose.Types.ObjectId().toString(), conversationId, user: s.user, isCreatedByUser: true, sender: 'User', text: recipe.prompt, createdAt: now, updatedAt: now });
      const token = jwt.sign({ id: s.user }, process.env.JWT_SECRET, { expiresIn: '10m' });
      const base = `http://127.0.0.1:${process.env.PORT || 3080}`;
      console.error('[AQRP] dispatching to chat', conversationId);
      fetch(`${base}/api/agents/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'User-Agent': req.headers['user-agent'] || 'LibreChat/0.8.7' },
        body: JSON.stringify({ conversationId, text: recipe.prompt + '\n\nCorpus file_id: ' + fileId, parentMessageId: null, tools: recipe.tools || [], files: [{ file_id: fileId, projectFileId: fileId, filename: file.name }], recipeWorkflow: recipe.workflow || null }),
        signal: AbortSignal.timeout(600000),
      }).then(async (r) => {
        const body = await r.text().catch(() => '');
        console.error('[AQRP] chat response', r.status, body.slice(0, 2000));
        if (!r.ok) await svc.failRun(s, `chat ${r.status}: ${body.slice(0, 200)}`);
      }).catch(async (e) => { console.error('[AQRP] chat fetch error', e.message); await svc.failRun(s, e.message); });
    } catch (e) { next(e); }
  });

  router.post('/:projectId/aqrp/next', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      const st = await svc.getState(s);
      if (st.status !== 'running') return res.status(409).json({ error: `no active run (status=${st.status})` });
      const nextStep = (st.lastStepOk || 0) + 1;
      res.json({ status: 'dispatched', nextStep, state: st });

      const jwt = require('jsonwebtoken');
      const mongoose = require('mongoose');
      const db = mongoose.connection.db;
      const conversation = await db.collection('conversations').findOne({ user: s.user, tenant: s.tenant, chatProjectId: s.projectId, recipeId: 'aqrp' }, { sort: { createdAt: -1 } });
      if (!conversation) return;
      const recipe = require('/app/recipes/aqrp.cjs');
      const token = jwt.sign({ id: s.user }, process.env.JWT_SECRET, { expiresIn: '10m' });
      const base = `http://127.0.0.1:${process.env.PORT || 3080}`;
      await db.collection('messages').insertOne({ messageId: new mongoose.Types.ObjectId().toString(), conversationId: conversation.conversationId, user: s.user, isCreatedByUser: true, sender: 'User', text: `Run step ${nextStep}.`, createdAt: new Date(), updatedAt: new Date() });
      fetch(`${base}/api/agents/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'User-Agent': req.headers['user-agent'] || 'LibreChat/0.8.7' },
        body: JSON.stringify({ conversationId: conversation.conversationId, text: `Run step ${nextStep} only. Call aqrp_step_run({step:${nextStep}}) exactly once and stop.`, parentMessageId: null, tools: recipe.tools || [], recipeWorkflow: recipe.workflow || null }),
        signal: AbortSignal.timeout(600000),
      }).then(async (r) => {
        const body = await r.text().catch(() => '');
        if (!r.ok) await svc.failRun(s, `chat ${r.status}: ${body.slice(0, 200)}`);
      }).catch(async (e) => { await svc.failRun(s, e.message); });
    } catch (e) { next(e); }
  });

  router.get('/:projectId/aqrp/output/:step', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      const step = String(req.params.step);
      const output = await svc.getOutput(s, step);
      if (output) {
        res.set('Content-Type', 'application/json');
        res.set('Content-Disposition', `attachment; filename="aqrp_step${step}_out.json"`);
        return res.send(JSON.stringify(output, null, 2));
      }
      const st = await svc.getState(s);
      if (step === '0' || step === 'input') {
        const pfScope = { user: s.user, tenant: s.tenant, projectId: s.projectId };
        const { file, buffer } = await projectFilesService.read(pfScope, st.fileId);
        res.set('Content-Type', 'application/json');
        res.set('Content-Disposition', `attachment; filename="${file.name}"`);
        return res.send(buffer);
      }
      return res.status(404).json({ error: 'step output not found' });
    } catch (e) { next(e); }
  });

  router.delete('/:projectId/aqrp', async (req, res, next) => {
    try { const s = await svc.scope(req, req.params.projectId); res.json(await svc.deleteRun(s)); } catch (e) { next(e); }
  });
}
module.exports = { registerRoutes, service };
