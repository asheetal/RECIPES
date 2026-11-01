'use strict';
const NAME = 'llm_assistant_panel_batch';
const def = {
  name: NAME,
  description:
    'Advisory multi-agent panel over records. Submit {query, schema, records} or {query, schema, file_id}; schema MUST be a JSON Schema object with keys type, properties, and required (type value must be the string object) — NOT a JSON string, NOT a plain object without type/properties; with file_id it reads every record of that JSON corpus. Returns {panel, n, responses}: n complete sets, each with coder_id and rows, rows spanning the input records in order. Recipe-agnostic. Not a search, research, bash, or computation tool.',
};
async function resolveProjectId(req) {
  if (req?.__aqrpProjectId) return req.__aqrpProjectId;
  const convId = req?.body?.conversationId;
  if (!convId || convId === 'new') return null;
  const mongoose = require('mongoose');
  const convo = await mongoose.connection.db.collection('conversations').findOne({ conversationId: convId }, { projection: { chatProjectId: 1 } });
  return convo?.chatProjectId || null;
}
async function invoke(req, args) {
  const gateway = require('/app/admin-tools/role-gateway.cjs');
  gateway.audit(req, 'LLM_SURGERY', 'tool_call', { tool: NAME });
  try {
    const query = args.query;
    let schema = args.schema;
    let records = args.records;
    const fileId = args.file_id || args.fileId || args.projectFileId;
    if ((!Array.isArray(records) || !records.length) && fileId) {
      const projectId = await resolveProjectId(req);
      if (!projectId) throw new Error('project scope required to read file_id');
      const projectFiles = require('/app/project-files-feature/project-files.cjs').service();
      const s = { user: String(req.user.id || req.user._id), tenant: String(req.user.tenantId || ''), projectId };
      const { buffer } = await projectFiles.read(s, fileId);
      let data;
      try { data = JSON.parse(buffer.toString('utf8')); } catch (e) { throw new Error('file_id is not valid JSON: ' + e.message); }
      if (Array.isArray(data)) records = data;
      else if (data && typeof data === 'object') {
        const k = Object.keys(data).find(k => Array.isArray(data[k]));
        if (!k) throw new Error('file_id JSON has no array of records');
        records = data[k];
      } else throw new Error('file_id JSON has no records');
    }
    if (typeof query !== 'string' || !query.trim()) throw new Error('query required (non-empty string)');
    if (typeof schema === 'string') {
      try { schema = JSON.parse(schema); } catch (e) { throw new Error('schema string is not valid JSON: ' + e.message); }
    }
    if (!schema || typeof schema !== 'object' || Array.isArray(schema)) throw new Error('schema required (JSON Schema object or JSON string)');
    // Aligned with mod.batch()'s strict check — the boundary must reject exactly what mod.batch would reject.
    // Previously: added type='object' if properties existed (lenient). Now: require BOTH type='object' AND properties object.
    if (!schema.type && schema.properties && typeof schema.properties === 'object') {
      schema = { ...schema, type: 'object' };
    }
    if (schema.type !== 'object' || !schema.properties || typeof schema.properties !== 'object') {
      throw new Error('schema must be a JSON Schema object with type=object and properties');
    }
    if (typeof records === 'string') {
      try { records = JSON.parse(records); } catch (e) { throw new Error('records string is not valid JSON: ' + e.message); }
    }
    if (!Array.isArray(records) || !records.length) throw new Error('records required (non-empty array)');
    const mod = require('/app/admin-tools/assistant-panel-batch.cjs');
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    const projectId2 = await resolveProjectId(req);
    let runId = null; let progressOk = false; let concurrency = 4; let skipIds = []; let currentStepForBatch = null;
    if (projectId2) {
      try {
        const svc = require('/app/aqrp-feature/aqrp.cjs').service();
        const scope = { user: String(req.user.id || req.user._id), tenant: String(req.user.tenantId || ''), projectId: projectId2 };
        const st = await svc.getState(scope);
        if (st && st.runId) {
          runId = st.runId;
          if (typeof st.lastStepOk === 'number') currentStepForBatch = st.lastStepOk + 1;
          if (typeof svc.getBatchConcurrency === 'function') concurrency = await svc.getBatchConcurrency();
          progressOk = true;
        }
      } catch (e) { progressOk = false; }
    }
    let storeRunId = runId;
    if (progressOk) {
      try {
        const runDoc = await db.collection('aqrpruns').findOne({ projectId: projectId2 });
        if (runDoc) {
          const siblings = await db.collection('aqrpruns').find({ projectId: projectId2, fileId: runDoc.fileId, sha256: runDoc.sha256 }).toArray();
          for (const cand of siblings) {
            const p = await db.collection('aqrp_progress').findOne({ runId: cand.runId, step: 4 });
            if (p && Number.isInteger(p.total) && p.total > 0 && Number.isInteger(p.done) && p.done === p.total && Number.isInteger(p.n)) {
              storeRunId = cand.runId;
              break;
            }
          }
        }
      } catch (e) {}
    }
    const corpusTotal = records.length;
    let recordsCapped = false;
    if (progressOk) {
      try {
        const svc = require('/app/aqrp-feature/aqrp.cjs').service();
        if (typeof svc.getMaxBatchRecords === 'function') {
          const maxR = await svc.getMaxBatchRecords();
          if (records.length > maxR) { records = records.slice(0, maxR); recordsCapped = true; }
        }
      } catch (e) {}
    }
    console.log('[batch] storeRunId=' + storeRunId + ' currentStepForBatch=' + currentStepForBatch + ' progressOk=' + progressOk + ' records=' + records.length);
    // Compute step once — used by both tally and marker write below
    let __markerStep = currentStepForBatch;
    if (!__markerStep && storeRunId) {
      try {
        const latestRun = await db.collection('aqrpruns').findOne({ runId: storeRunId });
        if (latestRun) {
          const closedSteps = Object.keys(latestRun.steps || {}).filter(k => /^\d+$/.test(k)).map(Number);
          __markerStep = Math.max(0, ...closedSteps) + 1;
        }
      } catch (e) {}
    }
    const tally = progressOk ? makeTally(db, storeRunId, projectId2, __markerStep) : null;
    if (tally) {
      skipIds = await tally.ensure(records.length, concurrency);
      await db.collection('aqrpruns').updateOne({ projectId: projectId2 }, { $set: { records_capped: recordsCapped, corpus_total: corpusTotal, lastProgressAt: new Date() } });
      if (skipIds.length >= records.length) {
        const built = await tally.envelope(records, mod.recordId);
        if (built) {
          const __rCells = Array.isArray(built.responses) ? built.responses.flatMap(r => Array.isArray(r.rows) ? r.rows : []) : [];
          const __rAllNA = __rCells.length > 0 && __rCells.every(row => !Array.isArray(row.codes) || row.codes.length === 0 || row.codes.every(c => String(c).toUpperCase() === 'NA'));
          if (__rAllNA) throw new Error('[llm_assistant_panel_batch] resume envelope is all-NA — refusing to return a fabricated success');
          gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, status: 'ok', resumed: true, n: built.n, m: records.length });
          return JSON.stringify(built);
        }
      }
    }
    // ── FATAL retry guard ── (moved: only fires when a batch was actually ATTEMPTED)
    // Validation errors do NOT count as attempts — they are handled above.
    if (__markerStep && [4, 16, 17, 22].includes(__markerStep) && storeRunId) {
      let __prior = null;
      try {
        const __upRes = await db.collection('aqrp_batch_calls').updateOne(
          { runId: storeRunId, step: __markerStep },
          { $setOnInsert: {
              runId: storeRunId, step: __markerStep, firstAttemptAt: new Date(),
              recordCount: records.length, status: 'attempt'
          } },
          { upsert: true }
        );
        if (__upRes.upsertedCount === 0) {
          __prior = await db.collection('aqrp_batch_calls').findOne({ runId: storeRunId, step: __markerStep });
        }
      } catch (e) {
        console.error('[batch] retry-guard marker write failed:', e && e.message ? e.message : e);
      }
      if (__prior) {
        const __st = __prior.status || 'unknown';
        const __errPart = __prior.error ? ' — first call error: ' + String(__prior.error).slice(0, 300) : '';
        throw new Error('FATAL_BATCH_RETRY: llm_assistant_panel_batch called more than once for step ' + __markerStep +
          ' in run ' + String(storeRunId).slice(-8) + '. First call status: ' + __st + __errPart +
          '. Investigate the first call input/output in /app/admin-tools/prompt-dumps/ before retrying. Do NOT call the batch again for this step.');
      }
      try {
        const __runDoc = await db.collection('aqrpruns').findOne({ runId: storeRunId });
        if (__runDoc && __runDoc.steps && __runDoc.steps[String(__markerStep)]) {
          throw new Error('FATAL_STEP_ALREADY_CLOSED: step ' + __markerStep +
            ' has already closed in run ' + String(storeRunId).slice(-8) +
            '. Do not call llm_assistant_panel_batch again for a completed step.');
        }
      } catch (e) { if (String(e.message).startsWith('FATAL_')) throw e; }
    }

    const onProgress = tally ? async (ev) => { try { await tally.onEvent(ev); } catch (e) { console.error('[tally] onEvent failed (record=' + (ev && ev.record_id) + '):', e && e.message ? e.message : e); } } : undefined;
    let result = null;
    try {
      result = await mod.batch({ query, schema, records, onProgress, skipIds, concurrency });
    } catch (__err) {
      if (__markerStep && [4, 16, 17, 22].includes(__markerStep) && storeRunId) {
        try {
          await db.collection('aqrp_batch_calls').updateOne(
            { runId: storeRunId, step: __markerStep },
            { $set: { status: 'failed', error: String(__err && __err.message ? __err.message : __err).slice(0, 500), failedAt: new Date() } }
          );
        } catch (e) { console.error('[batch] failed-marker write failed:', e && e.message ? e.message : e); }
      }
      throw __err;
    } finally {
      if (tally) { try { const built = await tally.envelope(records, mod.recordId); if (built) result = built; } catch (e) {} }
    }
    const __isEmptyOrNA = (codes) => !Array.isArray(codes) || codes.length === 0 || codes.every(c => String(c).toUpperCase() === 'NA');
    if (result && Array.isArray(result.responses)) {
      const __allCells = result.responses.flatMap(r => Array.isArray(r.rows) ? r.rows : []);
      if (__allCells.length > 0 && __allCells.every(row => __isEmptyOrNA(row.codes))) {
        throw new Error('[llm_assistant_panel_batch] all ' + __allCells.length + ' cells returned NA or empty — panel is not producing usable codes; the batch cannot succeed');
      }
    }
    // NA-normalize each row: individual empty/non-array codes become ['NA']
    // per design §15.7. The all-cells-NA check above still rejects the
    // whole batch if every cell failed; a mixed batch passes with NA rows.
    if (result && Array.isArray(result.responses)) {
      for (const __r of result.responses) {
        if (Array.isArray(__r.rows)) {
          for (const __row of __r.rows) {
            if (!Array.isArray(__row.codes) || __row.codes.length === 0) __row.codes = ['NA'];
          }
        }
      }
    }
    if (__markerStep && [4,16,17,22].includes(__markerStep) && storeRunId) {
      try {
        await db.collection('aqrp_batch_calls').updateOne(
          { runId: storeRunId, step: __markerStep },
          { $set: { runId: storeRunId, step: __markerStep, calledAt: new Date(), recordCount: records.length, n: result && result.n, status: 'ok' } },
          { upsert: true }
        );
        console.log('[batch] marker written: runId=' + storeRunId + ' step=' + __markerStep + ' n=' + (result && result.n));
      } catch (e) { console.error('[batch] marker write FAILED:', e && e.message ? e.message : e); }
    } else {
      console.error('[batch] marker SKIPPED: storeRunId=' + storeRunId + ' currentStepForBatch=' + currentStepForBatch);
    }
    gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, status: 'ok', n: result && result.n, m: records.length, corpus_total: corpusTotal, records_capped: recordsCapped });
    return JSON.stringify(result);
  } catch (e) {
    gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, status: 'error', error: e.message });
    throw e;
  }
}
function makeTally(db, runId, projectId, tallyStep) {
  const step = Number(tallyStep) || 4;
  const col = db.collection('aqrp_progress');
  const rows = db.collection('aqrp_rows');
  const runs = db.collection('aqrpruns');
  async function sync() {
    const doc = await col.findOne({ runId, step });
    if (!doc) return;
    const now = new Date();
    await runs.updateOne({ projectId }, { $set: { progress: { step, done: doc.done || 0, total: doc.total || 0, inFlight: Math.max(0, doc.inFlight || 0), etaSeconds: doc.etaSeconds == null ? null : doc.etaSeconds, updatedAt: now }, lastProgressAt: now } });
  }
  return {
    async ensure(total, concurrency) {
      const done = await rows.find({ runId, step }, { projection: { record_id: 1, _id: 0 } }).toArray();
      const skipIds = done.map(r => String(r.record_id));
      await col.updateOne(
        { runId, step },
        { $max: { total }, $set: { done: skipIds.length, inFlight: 0, concurrency, updatedAt: new Date() }, $setOnInsert: { startedAt: new Date(), etaSeconds: null, n: null } },
        { upsert: true }
      );
      await sync();
      return skipIds;
    },
    async onEvent(ev) {
      const now = new Date();
      if (ev.event === 'start') { await col.updateOne({ runId, step }, { $inc: { inFlight: 1 }, $set: { updatedAt: now } }); await sync(); return; }
      if (ev.event === 'error') { await col.updateOne({ runId, step }, { $inc: { inFlight: -1 }, $set: { updatedAt: now } }); await sync(); return; }
      if (ev.event !== 'done') return;
      const res = await rows.updateOne(
        { runId, step, record_id: String(ev.record_id) },
        { $set: { runId, step, record_id: String(ev.record_id), perCoder: ev.perCoder, updatedAt: now } },
        { upsert: true }
      );
      const inc = { inFlight: -1 };
      if (res.upsertedCount) inc.done = 1;
      const set = { updatedAt: now };
      if (Array.isArray(ev.perCoder) && ev.perCoder.length > 0) set.n = ev.perCoder.length;
      await col.updateOne({ runId, step }, { $inc: inc, $set: set });
      const doc = await col.findOne({ runId, step });
      const done = doc ? doc.done : 0;
      const total = doc ? doc.total : 0;
      const startedAt = doc && doc.startedAt ? new Date(doc.startedAt).getTime() : now.getTime();
      const elapsed = Math.max(1000, now.getTime() - startedAt);
      const rate = done > 0 ? done / (elapsed / 1000) : 0;
      const etaSeconds = rate > 0 ? Math.max(0, Math.round((total - done) / rate)) : null;
      await col.updateOne({ runId, step }, { $set: { etaSeconds } });
      await sync();
    },
    async envelope(records, recordId) {
      const doc = await col.findOne({ runId, step });
      const n = doc && Number.isInteger(doc.n) ? doc.n : 0;
      if (!n) return null;
      if (doc.done < doc.total) return null;
      const all = await rows.find({ runId, step }).toArray();
      const byId = new Map(all.map(r => [String(r.record_id), r.perCoder]));
      const responses = [];
      for (let s = 0; s < n; s++) responses.push({ coder_id: null, rows: [] });
      for (let i = 0; i < records.length; i++) {
        const id = recordId(records[i], i);
        const per = byId.get(String(id));
        for (let s = 0; s < n; s++) {
          const pc = per && per[s];
          if (!responses[s].coder_id && pc && pc.coder_id) responses[s].coder_id = pc.coder_id;
          responses[s].rows.push({ record_id: String(id), codes: (pc && pc.codes) || ['NA'], quote: (pc && pc.quote) || '' });
        }
      }
      return { panel: 'LLM_ASSISTANT_PANEL_BATCH', n, responses: responses.map((r, s) => ({ coder_id: r.coder_id || ('panel-slot-' + s), rows: r.rows })) };
    },
  };
}
function makeTool(req) {
  const { DynamicStructuredTool } = require('@librechat/agents/langchain/tools');
  const { z } = require('zod');
  return new DynamicStructuredTool({
    name: NAME,
    description: def.description,
    schema: z.object({ plan: z.any().optional(), query: z.string(), schema: z.union([z.record(z.any()), z.string()]), records: z.union([z.array(z.any()), z.string()]).optional(), file_id: z.string().optional(), fileId: z.string().optional(), projectFileId: z.string().optional() }).strip(),
    func: (a) => invoke(req, a),
  });
}
function wrapLoad(load) {
  return async (p) => {
    const r = await load(p);
    if (!r || !p.req?.user?.id) return r;
    r.toolDefinitions = [...(r.toolDefinitions || []).filter((t) => t.name !== NAME), def];
    r.toolRegistry = new Map(r.toolRegistry || []);
    r.toolRegistry.set(NAME, def);
    if (p.definitionsOnly === false) r.tools = [...(r.tools || []), makeTool(p.req)];
    return r;
  };
}
function wrapExecution(load) {
  return async (p) => {
    const names = p.toolNames.filter((n) => n !== NAME);
    const r = await load({ ...p, toolNames: names });
    if (!r.loadedTools) r.loadedTools = [];
    if (!r.loadedTools.some((t) => t.name === NAME)) r.loadedTools.push(makeTool(p.req));
    return r;
  };
}
module.exports = { NAME, def, wrapLoad, wrapExecution, invoke };
