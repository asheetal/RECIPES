'use strict';
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const ADMIN_IDS = (process.env.PANEL_VAULT_ADMIN_IDS || '').split(',').map(s=>s.trim()).filter(Boolean);
let KEY = null;
function _key() {
  if (KEY) return KEY;
  const b64 = process.env.PANEL_VAULT_KEY;
  if (!b64) throw new Error('vault: PANEL_VAULT_KEY unset');
  const k = Buffer.from(b64, 'base64');
  if (k.length !== 32) throw new Error('vault: key length');
  KEY = k; return KEY;
}
function _encrypt(obj) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', _key(), iv);
  const ct = Buffer.concat([c.update(Buffer.from(JSON.stringify(obj), 'utf8')), c.final()]);
  return { iv: iv.toString('base64'), tag: c.getAuthTag().toString('base64'), ct: ct.toString('base64') };
}
function _decrypt(rec) {
  const d = crypto.createDecipheriv('aes-256-gcm', _key(), Buffer.from(rec.iv,'base64'));
  d.setAuthTag(Buffer.from(rec.tag, 'base64'));
  return JSON.parse(Buffer.concat([d.update(Buffer.from(rec.ct,'base64')), d.final()]).toString('utf8'));
}
const INTERNAL_SYMBOL = Symbol('panel-vault-internal');
function registerInternalConsumer() { return INTERNAL_SYMBOL; }
function _isAdmin(u) {
  if (!u || u.role !== 'ADMIN' || !ADMIN_IDS.length) return false;
  return ADMIN_IDS.includes(String(u.id || u._id || ''));
}
async function _db() {
  const c = new MongoClient(process.env.MONGO_URI); await c.connect();
  return { c, db: c.db() };
}
async function _audit(db, doc) {
  try { await db.collection('panel_access_log').insertOne({ at: new Date(), ...doc }); } catch (_) {}
}
async function getSlotForExecution(slot, ctx) {
  if (!ctx || ctx.token !== INTERNAL_SYMBOL) throw new Error('vault: slot access denied');
  const { c, db } = await _db();
  try {
    const rec = await db.collection('panel_members_private').findOne({ slot: Number(slot) });
    if (!rec) throw new Error('vault: slot ' + slot + ' not configured');
    return _decrypt(rec);
  } finally { await c.close(); }
}
async function getRosterForAdmin(reqUser, ip) {
  const { c, db } = await _db();
  try {
    if (!_isAdmin(reqUser)) {
      await _audit(db, { action:'denied', reason:'not-admin', actor: String((reqUser&&(reqUser.id||reqUser._id))||'anon'), ip: ip||null });
      throw new Error('vault: admin required');
    }
    await _audit(db, { action:'getRosterForAdmin', actor: String(reqUser.id||reqUser._id), role: reqUser.role, ip: ip||null });
    const rows = await db.collection('panel_members_private').find({}).sort({slot:1}).toArray();
    return rows.map(r => ({ slot: r.slot, ..._decrypt(r) }));
  } finally { await c.close(); }
}
async function putSlotForAdmin(slot, plain, reqUser) {
  const { c, db } = await _db();
  try {
    if (!_isAdmin(reqUser)) {
      await _audit(db, { action:'denied', reason:'not-admin-write', actor: String((reqUser&&(reqUser.id||reqUser._id))||'anon'), slot: Number(slot) });
      throw new Error('vault: admin required');
    }
    await db.collection('panel_members_private').updateOne(
      { slot: Number(slot) },
      { $set: { slot: Number(slot), ..._encrypt(plain), updatedAt: new Date() } },
      { upsert: true });
    await _audit(db, { action:'putSlotForAdmin', actor: String(reqUser.id||reqUser._id), slot: Number(slot) });
  } finally { await c.close(); }
}
async function clearSlotsForAdmin(fromSlot, reqUser) {
  const { c, db } = await _db();
  try {
    if (!_isAdmin(reqUser)) {
      await _audit(db, { action:'denied', reason:'not-admin-clear', actor: String((reqUser&&(reqUser.id||reqUser._id))||'anon'), fromSlot: Number(fromSlot) });
      throw new Error('vault: admin required');
    }
    const r = await db.collection('panel_members_private').deleteMany({ slot: { $gte: Number(fromSlot) } });
    await _audit(db, { action:'clearSlotsForAdmin', actor: String(reqUser.id||reqUser._id), fromSlot: Number(fromSlot), removed: r.deletedCount });
    return r.deletedCount;
  } finally { await c.close(); }
}
module.exports = { getSlotForExecution, getRosterForAdmin, putSlotForAdmin, clearSlotsForAdmin, registerInternalConsumer };
