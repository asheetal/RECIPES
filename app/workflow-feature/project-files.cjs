'use strict';
const { makeService, MAX_FILE } = require('./core.cjs');
const { Readable } = require('node:stream');
let instance;
function service() {
  if (instance) return instance;
  const mongoose = require('mongoose');
  const db = require('~/models');
  const database = () => mongoose.connection.db;
  const files = () => database().collection('projectfiles');
  const states = () => database().collection('projectfilestates');
  const bucket = () => new mongoose.mongo.GridFSBucket(database(), { bucketName: 'projectfilebytes' });
  const filter = s => ({ user: s.user, tenant: s.tenant, projectId: s.projectId });
  const repo = {
    list: s => files().find(filter(s)).sort({ name: 1 }).toArray(),
    get: (s, id) => files().findOne({ ...filter(s), id }),
    put: (s, f) => files().replaceOne({ ...filter(s), id: f.id }, f, { upsert: true }),
    remove: (s, id) => files().deleteOne({ ...filter(s), id }),
    isDeleting: async s => Boolean((await states().findOne(filter(s)))?.deleting),
    setDeleting: (s, deleting) => states().updateOne(filter(s), { $set: { ...filter(s), deleting } }, { upsert: true }),
    upload: (s, name, buffer) => new Promise((resolve, reject) => {
      const out = bucket().openUploadStream(name, { metadata: filter(s) });
      out.once('error', reject); out.once('finish', () => resolve(out.id)); out.end(buffer);
    }),
    read: id => new Promise((resolve, reject) => {
      const chunks = []; const stream = bucket().openDownloadStream(id);
      stream.on('data', c => chunks.push(c)); stream.once('error', reject);
      stream.once('end', () => resolve(Buffer.concat(chunks)));
    }),
    removeBlob: async id => {
      try { await bucket().delete(id); } catch (e) { if (!/File not found/i.test(e.message)) throw e; }
    },
  };
  const crud = () => require('~/server/services/Files/Code/crud');
  const code = () => require('~/server/services/Files/Code/process');
  instance = makeService(repo, {
    getProject: db.getChatProject,
    getConversation: db.getConvo,
    uploadCode: (req, filename, buffer) => crud().uploadCodeEnvFile({ req, filename, stream: Readable.from(buffer), kind: 'user', id: String(req.user.id) }),
    isCodeRefActive: async (req, ref) => {
      const date = await code().getSessionInfo(ref, req);
      return date && code().checkIfActive(date);
    },
    deleteCodeRef: (req, ref) => crud().deleteCodeEnvFile(req, { metadata: { codeEnvRef: ref } }),
    deleteProjectChatFiles: async (req, s) => {
      const conversations = await mongoose.models.Conversation.find({ user: s.user, chatProjectId: s.projectId }).select('conversationId').lean();
      const ids = conversations.map(c => c.conversationId);
      if (!ids.length) return;
      const messages = await mongoose.models.Message.find({ user: s.user, conversationId: { $in: ids } }).select('files attachments').lean();
      const linked = [...new Set(messages.flatMap(m => [...(m.files || []), ...(m.attachments || [])]).map(f => f.file_id).filter(Boolean))];
      const docs = await db.getFiles({ $or: [{ conversationId: { $in: ids } }, { file_id: { $in: linked } }], user: s.user, ...(req.user.tenantId ? { tenantId: req.user.tenantId } : {}) });
      if (!docs?.length) return;
      const result = await require('~/server/services/Files/process').processDeleteRequest({ req, files: docs });
      if (result.failedFileIds?.length) throw new Error('Project chat file cleanup failed; retry deletion');
    },
    deleteAttachments: async (req, ids) => {
      if (!ids.length) return;
      const docs = await db.getFiles({ file_id: { $in: ids }, user: String(req.user.id), tenantId: req.user.tenantId });
      if (!docs?.length) return;
      const result = await require('~/server/services/Files/process').processDeleteRequest({ req, files: docs });
      if (result.failedFileIds?.length) throw new Error('Project attachment cleanup failed; retry deletion');
    },
  });
  return instance;
}
function endpoint(fn) {
  return (req, res) => Promise.resolve(fn(req, res)).catch(e => {
    require('@librechat/data-schemas').logger.error('[ProjectFiles] request failed', { message: e.message });
    if (!res.headersSent) res.status(e.status || 500).json({ message: e.status ? e.message : 'Project file operation failed' });
  });
}
function registerRoutes(router) {
  require('./chat-files.cjs').register(router);
  const multer = require('multer');
  const { configMiddleware, checkBan, createFileLimiters } = require('~/server/middleware');
  const { restoreTenantContextFromReq } = require('@librechat/api');
  const { fileUploadIpLimiter, fileUploadUserLimiter } = createFileLimiters();
  router.use('/:projectId/files', configMiddleware, checkBan);
  const verify = (req, res, next) => service().scope(req, req.params.projectId).then(s => { req.projectFileScope = s; next(); }).catch(e => res.status(e.status || 500).json({ message: e.status ? e.message : 'Project lookup failed' }));
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_FILE, files: 1 } }).single('file');
  router.get('/:projectId/files', verify, endpoint(async (req, res) => res.json(await service().list(req.projectFileScope))));
  router.post('/:projectId/files', fileUploadIpLimiter, fileUploadUserLimiter, verify, (req, res, next) => upload(req, res, e => e ? res.status(413).json({ message: 'Upload failed; maximum file size is 25 MB' }) : next()), restoreTenantContextFromReq, endpoint(async (req, res) => {
    if (!req.file) { res.status(400).json({ message: 'Choose a file' }); return; }
    res.status(201).json(await service().save(req.projectFileScope, req.file.originalname, req.file.buffer));
  }));
  router.get('/:projectId/files/:fileId/download', verify, endpoint(async (req, res) => {
    const { file, buffer } = await service().read(req.projectFileScope, req.params.fileId);
    res.set('Cache-Control', 'private, no-store'); res.set('X-Content-Type-Options', 'nosniff');
    res.type('application/octet-stream'); res.attachment(file.name.split('/').pop()); res.send(buffer);
  }));
  router.delete('/:projectId/files/:fileId', configMiddleware, verify, endpoint(async (req, res) => {
    await service().remove(req, req.projectFileScope, req.params.fileId); res.json({ deleted: true });
  }));
  // Ensure the native project-delete handler has storage configuration available.
  router.delete('/:projectId', configMiddleware);
}
function deletionHandler(nativeDelete) {
  return endpoint(async (req, res) => {
    const user = String(req.user.id || req.user._id);
    const result = await service().deleteProject(req, user, req.params.projectId, nativeDelete);
    res.json(result);
  });
}
const workflow = require('./workflow-files.cjs');
const def = {
  name: 'project_files',
  description: 'Manage project masters. Use research_files to read chat working copies. save_chat transfers a saved chat artifact byte-for-byte to the project after user-requested merge. Never regenerate full file text for transfer.',
  parameters: { type: 'object', properties: { action: { type: 'string', enum: ['list', 'read', 'save_chat'] }, name: { type: 'string' }, file_id: { type: 'string' }, sha256: { type: 'string' } }, required: ['action'] },
};
async function invoke(req, args) {
  const s = await service().chatScope(req);
  if (!s) throw new Error('This chat has no project');
  if (args.action === 'list') return JSON.stringify(await service().list(s));
  if (args.action === 'save_chat') return workflow.saveChat(req,service(),s,args);
  if (args.action === 'read') {
    const files = await service().list(s); const file = files.find(f => f.name === args.name);
    if (!file) throw new Error('File not found in this project');
    const { buffer } = await service().read(s, file.id);
    if (buffer.length > 512 * 1024 || buffer.includes(0)) throw new Error('Use bash_tool for binary or large files');
    return JSON.stringify({ name: file.name, content: buffer.toString('utf8') });
  }
  throw new Error('Unknown project file action');
}
function makeTool(req) {
  const { DynamicStructuredTool } = require('@librechat/agents/langchain/tools');
  const { z } = require('zod');
  return new DynamicStructuredTool({ name: def.name, description: def.description,
    schema: z.object({ action: z.enum(['list', 'read', 'save_chat']), name: z.string().optional(), file_id: z.string().optional(), sha256: z.string().optional() }),
    func: args => invoke(req, args),
  });
}
async function augment(params, result) {
  const s = await service().chatScope(params.req);
  if (!s) return result;
  params.req.__projectFilesScope = s;
  result = result || {};
  const files = await service().list(s);
  const context = '## Project masters\nChat working copies take priority; edits stay in the chat. Use research_files read_all for full manuscript context. Use project_files save_chat only for a user-requested merge into project masters. Never regenerate file contents to save them.\n' + JSON.stringify(files);
  result.toolContextMap = { ...(result.toolContextMap || {}), project_files: context };
  result.toolDefinitions = [...(result.toolDefinitions || []).filter(d => d.name !== def.name), def];
  result.toolRegistry = new Map(result.toolRegistry || []); result.toolRegistry.set(def.name, def);
  if (params.definitionsOnly === false) result.tools = [...(result.tools || []), makeTool(params.req)];
  if (params.agent?.tools?.includes('execute_code') && files.length) {
    const warnings = await workflow.prepare(params.req,service(),s,result);
    result.dynamicToolContextMap = { ...(result.dynamicToolContextMap || {}), project_files: context+'\n'+warnings.join('\n') };
  }
  return result;
}
function wrapLoad(nativeLoad) { return async params => augment(params, await nativeLoad(params)); }
function wrapExecution(nativeLoad) {
  return async params => {
    const use = params.toolNames.includes(def.name);
    const result = await nativeLoad({ ...params, toolNames: params.toolNames.filter(n => n !== def.name) });
    if (use) {
      const s = await service().chatScope(params.req);
      if (!s) throw new Error('Project access lost');
      result.loadedTools.push(makeTool(params.req));
      if (result.configurable?.ptcToolMap) result.configurable.ptcToolMap.set(def.name, result.loadedTools.at(-1));
    }
    return result;
  };
}
async function capture(req, name, buffer, attachmentId, codeRef) {
  // Chat outputs must never silently replace project masters.
  return;
}

module.exports = { registerRoutes, deletionHandler, wrapLoad, wrapExecution, capture, service, definition: def };
