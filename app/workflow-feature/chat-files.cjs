'use strict';
function linkedIds(messages) {
  return [...new Set(messages.flatMap(m => [...(m.files || []), ...(m.attachments || [])])
    .map(f => typeof f === 'string' ? f : f?.file_id).filter(x => typeof x === 'string'))];
}
async function listForChat(req, deps) {
  const user = String(req.user.id || req.user._id);
  const id = req.params.conversationId;
  const convo = await deps.getConvo(user, id);
  if (!convo) { const e = Error('Chat not found'); e.status = 404; throw e; }
  const messages = await deps.messages(user, id);
  const linked = linkedIds(messages);
  const files = await deps.files({ user, ...(req.user.tenantId ? { tenantId: req.user.tenantId } : {}),
    $or: [{ conversationId: id }, { file_id: { $in: linked } }] });
  return { projectId: convo.chatProjectId ? String(convo.chatProjectId) : null,
    files: files.map(f => {
      const ref = f.metadata?.codeEnvRef;
      let downloadPath;
      if (ref?.storage_session_id && ref?.file_id) {
        downloadPath = '/api/files/code/download/' + encodeURIComponent(ref.storage_session_id) + '/' + encodeURIComponent(ref.file_id);
      } else {
        downloadPath = '/api/files/download/' + encodeURIComponent(user) + '/' + encodeURIComponent(f.file_id);
      }
      return { id: f.file_id, name: f.filename || 'File', bytes: f.bytes || 0, downloadPath };
    }) };
}
function register(router) {
  const { configMiddleware, checkBan } = require('~/server/middleware');
  router.get('/chat-files/:conversationId', configMiddleware, checkBan, async (req, res) => {
    try {
      const db = require('~/models');
      const mongoose = require('mongoose');
      const result = await listForChat(req, {
        getConvo: db.getConvo,
        messages: (user, conversationId) => mongoose.models.Message.find({ user, conversationId }).select('files attachments').lean(),
        files: filter => db.getFiles(filter, null, { text: 0 }),
      });
      res.set('Cache-Control', 'private, no-store').json(result);
    } catch (e) {
      res.status(e.status || 500).json({ message: e.status ? e.message : 'Could not load chat files' });
    }
  });
}
module.exports = { register, listForChat, linkedIds };
