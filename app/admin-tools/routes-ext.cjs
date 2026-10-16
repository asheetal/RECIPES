"use strict";
const fs = require("fs");
const path = "/app/admin-tools/state.json";
function load(){ try { return JSON.parse(fs.readFileSync(path, "utf8")); } catch { return {}; } }
function save(d){ fs.writeFileSync(path, JSON.stringify(d, null, 2)); }
const friends = require("/app/friends/runtime.cjs");
module.exports = {
  modelAccess: require("/app/admin-tools/model-access.cjs"),
  llmRoles: require("/app/admin-tools/llm-roles.cjs"),
  friends,
  compression: {
    get: async (req,res) => res.json(load().compression || { triggerMode: "tokens", triggerValue: 100000, targetRatio: 0.5, revision: 1 }),
    save: async (req,res) => { const d = load(); d.compression = { ...d.compression, ...req.body, revision: (d.compression?.revision || 0) + 1 }; save(d); res.json(d.compression); }
  },
  projectUpload: {
    get: async (req,res) => res.json(load().projectUpload || { maxFiles: 20, maxFileBytes: 26214400, revision: 1 }),
    save: async (req,res) => { const d = load(); d.projectUpload = { ...d.projectUpload, ...req.body, revision: (d.projectUpload?.revision || 0) + 1 }; save(d); res.json(d.projectUpload); }
  },
};
