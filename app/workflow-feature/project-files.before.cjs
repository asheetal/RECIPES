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
const def = {
  name: 'project_files',
  description: 'Access the persistent files of this chat\'s project only. List files, read UTF-8 source files, or save a complete UTF-8 source file. Original names, including Makefile and .bib, are supported. Binary documents are edited using bash_tool; edits to existing project filenames are saved back; new artifacts remain in the chat until saved to the project. Saving text here changes the persistent copy; the sandbox is refreshed at the next message.',
  parameters: { type: 'object', properties: { action: { type: 'string', enum: ['list', 'read', 'save'] }, name: { type: 'string' }, content: { type: 'string' } }, required: ['action'] },
};
async function invoke(req, args) {
  const s = await service().chatScope(req);
  if (!s) throw new Error('This chat has no project');
  if (args.action === 'list') return JSON.stringify(await service().list(s));
  if (args.action === 'save') {
    if (typeof args.content !== 'string') throw new Error('Complete UTF-8 content required');
    return JSON.stringify(await service().save(s, args.name, Buffer.from(args.content, 'utf8')));
  }
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
    schema: z.object({ action: z.enum(['list', 'read', 'save']), name: z.string().optional(), content: z.string().optional() }),
    func: args => invoke(req, args),
  });
}
async function augment(params, result) {
  const s = await service().chatScope(params.req);
  if (!s) return result;
  params.req.__projectFilesScope = s;
  result = result || {};
  const files = await service().list(s);
  const context = '## Current project files\nThese files belong to this project and remain available across its chats and context compaction. Use project_files to read source text without inventing its contents. Code-enabled chats receive the files automatically under /mnt/data/. Use the original filenames. Edits to existing project filenames are saved back. New artifacts stay in the chat until the user saves them to the project. Use project_files save for persistent UTF-8 edits, including Makefile and .bib. Do not claim an edit was saved until a tool confirms it.\n' + JSON.stringify(files);
  result.toolContextMap = { ...(result.toolContextMap || {}), project_files: context };
  result.toolDefinitions = [...(result.toolDefinitions || []).filter(d => d.name !== def.name), def];
  result.toolRegistry = new Map(result.toolRegistry || []); result.toolRegistry.set(def.name, def);
  if (params.definitionsOnly === false) result.tools = [...(result.tools || []), makeTool(params.req)];
  if (params.agent?.tools?.includes('execute_code') && files.length) {
    const projectRefs = await service().prime(params.req, s);
    const names = new Set(projectRefs.map(f => f.name));
    result.primedCodeFiles = [...(result.primedCodeFiles || []).filter(f => !names.has(f.name)), ...projectRefs];
    result.dynamicToolContextMap = { ...(result.dynamicToolContextMap || {}), project_files: 'Project source files are mounted in the code environment at /mnt/data/: ' + files.map(f => f.name).join(', ') };
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
  let s;
  try {
    s = req.__projectFilesScope ? await service().scope(req, req.__projectFilesScope.projectId) : await service().chatScope(req);
    if (!s) return;
    name = name.replace(/^\/mnt\/data\//, '');
    if (!(await service().list(s)).some(f => f.name === name)) return;
    await service().save(s, name, buffer, { attachmentId, codeRef });
  } catch (e) {
    // A project deleted while execution was in flight must not leave a new attachment.
    if (e.status === 404 || e.status === 409) {
      const db = require('~/models');
      const files = await db.getFiles({ file_id: attachmentId, user: String(req.user.id) });
      if (files?.length) await require('~/server/services/Files/process').processDeleteRequest({ req, files });
    }
    throw e;
  }
}
module.exports = { registerRoutes, deletionHandler, wrapLoad, wrapExecution, capture, service, definition: def };
