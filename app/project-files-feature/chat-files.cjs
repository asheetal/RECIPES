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
      return { id: f.file_id, name: f.filename || 'File', bytes: f.bytes || 0, updatedAt: f.updatedAt || f.createdAt, downloadPath };
    }) };
}
function register(router) {
  const { configMiddleware, checkBan } = require('~/server/middleware');

  router.post('/chat-files/:conversationId/delete', configMiddleware, checkBan, async (req, res) => {
    try {
      const db = require('~/models');
      const mongoose = require('mongoose');
      const user = String(req.user.id || req.user._id);
      const fileId = req.body?.fileId;
      if (typeof fileId !== 'string' || !fileId)
        return res.status(400).json({message:'A file is required'});
      const listing = await listForChat(req, {
        getConvo: db.getConvo,
        messages: (user, conversationId) => mongoose.models.Message
          .find({user, conversationId}).select('files attachments').lean(),
        files: filter => db.getFiles(filter, null, {text:0}),
      });
      if (!listing.files.some(f => f.id === fileId))
        return res.status(404).json({message:'File not found in this chat'});
      const files = await db.getFiles({
        user, file_id:fileId,
        ...(req.user.tenantId ? {tenantId:req.user.tenantId} : {}),
      });
      if (files.length !== 1)
        return res.status(404).json({message:'File not found'});
      const {processDeleteRequest} = require('~/server/services/Files/process');
      const result = await processDeleteRequest({req, files});
      if (!result?.deletedFileIds?.includes(fileId))
        return res.status(502).json({message:'Storage deletion was not confirmed'});
      res.set('Cache-Control','no-store').json({deleted:true, fileId});
    } catch (e) {
      console.error('[ChatFiles] Delete failed', e);
      res.status(e.status || 500).json({
        message:e.status ? e.message : 'File deletion failed',
      });
    }
  });

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
