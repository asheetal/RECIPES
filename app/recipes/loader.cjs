'use strict';
const path = require('node:path');
const fs = require('node:fs');

const RECIPE_DIR = '/app/recipes';
const cache = new Map();

function load(recipeId) {
  if (!recipeId) return null;
  if (cache.has(recipeId)) return cache.get(recipeId);
  if (!/^[a-z0-9_]+$/.test(recipeId)) return null;
  const p = path.join(RECIPE_DIR, `${recipeId}.cjs`);
  if (!fs.existsSync(p)) return null;
  const rec = require(p);
  cache.set(recipeId, rec);
  return rec;
}

async function attach(req, _res, next) {
  try {
    const convId = req?.body?.conversationId;
    if (convId && convId !== 'new') {
      const mongoose = require('mongoose');
      const convo = await mongoose.connection.db
        .collection('conversations')
        .findOne({ conversationId: convId }, { projection: { recipeId: 1, chatProjectId: 1 } });
      const rec = load(convo?.recipeId);
      if (rec) {
        req.__recipe = rec;
        if (convo.chatProjectId) req.__helloWorldProjectId = convo.chatProjectId;
      }
    }
  } catch (_) { /* never block */ }
  next();
}

module.exports = { load, attach };
