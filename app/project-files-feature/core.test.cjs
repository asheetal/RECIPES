'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { makeService, validName, MAX_FILE } = require('./core.cjs');
const A = 'a'.repeat(24), B = 'b'.repeat(24);
function fixture() {
  const records = new Map(), blobs = new Map(), states = new Set(), projects = new Set(['u:' + A, 'u:' + B]);
  const conversations = new Map([['u:c', { chatProjectId: A }]]);
  let sequence = 0;
  const key = s => `${s.tenant}:${s.user}:${s.projectId}`;
  const clone = f => f && structuredClone(f);
  const removed = [];
  const repo = {
    list: async s => [...records.values()].filter(f => key(f) === key(s)).map(clone),
    get: async (s, id) => clone(records.get(key(s) + ':' + id)),
    put: async (s, f) => records.set(key(s) + ':' + f.id, clone(f)),
    remove: async (s, id) => records.delete(key(s) + ':' + id),
    isDeleting: async s => states.has(key(s)),
    setDeleting: async (s, val) => val ? states.add(key(s)) : states.delete(key(s)),
    upload: async (_s, _name, buf) => { const id = String(++sequence); blobs.set(id, Buffer.from(buf)); return id; },
    read: async id => Buffer.from(blobs.get(id)),
    removeBlob: async id => blobs.delete(id),
  };
  const deps = {
    getProject: async (user, id) => projects.has(user + ':' + id) && { _id: id },
    getConversation: async (user, id) => conversations.get(user + ':' + id),
    uploadCode: async (_req, name, buffer) => ({ storage_session_id: 's' + sequence, file_id: name + buffer.length }),
    isCodeRefActive: async () => true,
    deleteCodeRef: async (_req, ref) => removed.push('code:' + ref.file_id),
    deleteAttachments: async (_req, ids) => removed.push(...ids.map(id => 'attachment:' + id)),
  };
  const req = { user: { id: 'u' }, body: { conversationId: 'c' } };
  const service = makeService(repo, deps);
  const nativeDelete = async (user, id) => { projects.delete(user + ':' + id); return { deletedCount: 1 }; };
  return { service, repo, deps, req, records, blobs, projects, removed, nativeDelete };
}
test('original names, exact bytes and replacement persist across project chats', async () => {
  const f = fixture(), s = await f.service.scope(f.req, A);
  const tex = await f.service.save(s, 'abhishek.tex', Buffer.from('hello'));
  const make = await f.service.save(s, 'Makefile', Buffer.from('all:\n\txelatex abhishek.tex\n'));
  await f.service.save(s, 'paper.bib', Buffer.from('@article{key}'));
  assert.equal((await f.service.list(s)).length, 3);
  assert.equal((await f.service.read(s, tex.id)).buffer.toString(), 'hello');
  const replaced = await f.service.save(s, 'abhishek.tex', Buffer.from('edited'));
  assert.equal(replaced.id, tex.id); assert.equal(f.blobs.size, 3);
  assert.equal((await f.service.read(s, make.id)).file.name, 'Makefile');
  const another = await f.service.chatScope({ ...f.req, body: { chatProjectId: A } });
  assert.equal((await f.service.read(another, tex.id)).buffer.toString(), 'edited');
});
test('other users, tenants and projects cannot list/read a file', async () => {
  const f = fixture(), s = await f.service.scope(f.req, A);
  const file = await f.service.save(s, 'Makefile', Buffer.from('secret'));
  await assert.rejects(f.service.scope({ user: { id: 'outsider' } }, A), e => e.status === 404);
  const other = await f.service.scope(f.req, B);
  await assert.rejects(f.service.read(other, file.id), e => e.status === 404);
  await assert.rejects(f.service.read({ ...s, tenant: 'other' }, file.id), e => e.status === 404);
  assert.deepEqual(await f.service.list(other), []);
});
test('existing chat uses server project and rejects a forged different project', async () => {
  const f = fixture();
  assert.equal((await f.service.chatScope(f.req)).projectId, A);
  await assert.rejects(f.service.chatScope({ ...f.req, body: { conversationId: 'c', chatProjectId: B } }), e => e.status === 403);
  assert.equal(await f.service.chatScope({ ...f.req, body: {} }), null);
});
test('code priming uses the correct project files and reuses live uploaded refs', async () => {
  const f = fixture(), s = await f.service.scope(f.req, A);
  await f.service.save(s, 'abhishek.tex', Buffer.from('hello'));
  await f.service.save(s, 'Makefile', Buffer.from('all:'));
  const one = await f.service.prime(f.req, s), two = await f.service.prime(f.req, s);
  assert.equal(one.length, 2); assert.deepEqual(one, two);
  assert(one.every(x => x.kind === 'user' && x.resource_id === 'u' && x.storage_session_id));
  assert.deepEqual(await f.service.prime(f.req, await f.service.scope(f.req, B)), []);
});
test('project deletion deletes bytes, cached code uploads and emitted attachments only in that project', async () => {
  const f = fixture(), s = await f.service.scope(f.req, A), other = await f.service.scope(f.req, B);
  await f.service.save(s, 'paper.bib', Buffer.from('bib'), { attachmentId: 'generated', codeRef: { file_id: 'output' } });
  const kept = await f.service.save(other, 'keep.txt', Buffer.from('keep'));
  await f.service.prime(f.req, s);
  await f.service.deleteProject(f.req, 'u', A, f.nativeDelete);
  assert.equal(f.blobs.size, 1); assert.equal(f.records.size, 1);
  assert(f.removed.includes('attachment:generated')); assert(f.removed.includes('code:output'));
  assert.equal((await f.service.read(other, kept.id)).buffer.toString(), 'keep');
  await assert.rejects(f.service.scope(f.req, A), e => e.status === 404);
  await assert.rejects(f.service.save(s, 'new.txt', Buffer.from('bad')), e => e.status === 409);
});
test('failed storage cleanup retains project and file metadata for retry', async () => {
  const f = fixture(); f.deps.deleteCodeRef = async () => { throw new Error('storage unavailable'); };
  const s = await f.service.scope(f.req, A);
  await f.service.save(s, 'file.txt', Buffer.from('hello'), { codeRef: { file_id: 'x' } });
  await assert.rejects(f.service.deleteProject(f.req, 'u', A, f.nativeDelete), /storage unavailable/);
  assert(f.projects.has('u:' + A)); assert.equal(f.records.size, 1); assert.equal(f.blobs.size, 1);
});
test('path traversal and oversized uploads are rejected before persistence', async () => {
  for (const name of ['../x', '/x', 'a/../x', 'x\\y', 'x\n', 'a//b']) assert.throws(() => validName(name));
  assert.equal(validName('subdir/paper.tex'), 'subdir/paper.tex');
  const f = fixture(), s = await f.service.scope(f.req, A);
  await assert.rejects(f.service.save(s, 'big', Buffer.alloc(MAX_FILE + 1)), e => e.status === 413);
  assert.equal(f.blobs.size, 0);
});
test('concurrent writes leave one metadata record and one byte object per filename', async () => {
  const f = fixture(), s = await f.service.scope(f.req, A);
  await Promise.all(Array.from({ length: 12 }, (_, i) => f.service.save(s, 'Makefile', Buffer.from(String(i)))));
  assert.equal(f.records.size, 1); assert.equal(f.blobs.size, 1);
});
