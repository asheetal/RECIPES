'use strict';
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
require('module-alias')({ base: '/app/api' });
require('dotenv').config({ path: '/app/.env', quiet: true });
const mongoose = require('mongoose');
const { createModels, runAsSystem } = require('@librechat/data-schemas');
createModels(mongoose);
const db = require('~/models');
const feature = require('/app/project-files-feature/project-files.cjs');
async function main() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  await runAsSystem(async () => {
    // A synthetic owner prevents touching real users' projects or chats.
    const user = new mongoose.Types.ObjectId().toString();
    const req = { user: { id: user }, body: {}, headers: {}, config: {} };
    const project = await db.createChatProject(user, { name: 'Project files smoke ' + crypto.randomUUID() });
    const projectId = String(project._id);
    req.body.chatProjectId = projectId;
    const svc = feature.service();
    let originalError;
    try {
      const s = await svc.scope(req, projectId);
      const tex = await svc.save(s, 'abhishek.tex', Buffer.from('hello'));
      await svc.save(s, 'Makefile', Buffer.from('all:\n\ttrue\n'));
      assert.equal((await svc.read(s, tex.id)).buffer.toString(), 'hello');
      await assert.rejects(svc.scope({ user: { id: new mongoose.Types.ObjectId().toString() } }, projectId), e => e.status === 404);
      const primed = await svc.prime(req, s);
      assert.equal(primed.length, 2);
      const code = require('~/server/services/Files/Code/process');
      const result = await code.readSandboxFile({ file_path: '/mnt/data/abhishek.tex', files: primed, req });
      assert.equal(result?.content?.trim(), 'hello', 'Project file was not mounted in the execution sandbox');
      const makefile = await code.readSandboxFile({ file_path: '/mnt/data/Makefile', files: primed, req });
      assert.equal(makefile?.content, 'all:\n\ttrue\n', 'Extensionless Makefile was not mounted correctly');
      console.log('PROJECT_FILES_STORAGE_AND_CODE=PASS');
      // Verify the same generated-output capture used by the patched service.
      await feature.capture(req, 'abhishek.tex', Buffer.from('edited'));
      assert.equal((await svc.read(s, tex.id)).buffer.toString(), 'edited');
      console.log('PROJECT_FILE_EDIT_PERSISTENCE=PASS');
    } catch (e) { originalError = e; }
    try {
      await svc.deleteProject(req, user, projectId, db.deleteChatProject);
      const raw = mongoose.connection.db;
      assert.equal(await raw.collection('projectfiles').countDocuments({ user, projectId }), 0);
      assert.equal(await raw.collection('projectfilebytes.files').countDocuments({ 'metadata.user': user, 'metadata.projectId': projectId }), 0);
      console.log('PROJECT_FILE_DELETION=PASS');
    } catch (cleanupError) {
      console.error('Smoke-test cleanup requires retry for project ' + projectId + ': ' + cleanupError.message);
      if (!originalError) originalError = cleanupError;
    }
    await mongoose.connection.db.collection('projectfilestates').deleteMany({ user, projectId });
    if (originalError) throw originalError;
  });
}
main().then(async () => { await mongoose.disconnect(); process.exit(0); }).catch(async e => {
  console.error('PROJECT_FILES_SMOKE=FAIL: ' + e.message);
  await mongoose.disconnect(); process.exit(1);
});
