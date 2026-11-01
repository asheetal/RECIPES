'use strict';
const { makeService } = require('./core.cjs');
const { FINAL_STEP } = require('./steps.cjs');
const RUN_ABORTS = new Map();
const RUN_ABORT_MS = 6 * 60 * 60 * 1000;
const runKeyOf = (s) => `${s.user}|${s.tenant}|${s.projectId}`;
let instance;
function service() {
  if (instance) return instance;
  const mongoose = require('mongoose');
  const db = require('~/models');
  const database = () => mongoose.connection.db;
  const runs = () => database().collection('aqrpruns');
  const filter = (s) => ({ user: s.user, tenant: s.tenant, projectId: s.projectId });
  const repo = {
    getRun: (s) => runs().findOne(filter(s)),
    putRun: (s, r) => runs().replaceOne(filter(s), r, { upsert: true }),
    delRun: (s) => runs().deleteOne(filter(s)),
  };
  instance = makeService(repo, { getProject: db.getChatProject });
  return instance;
}
function registerRoutes(router, projectFilesService) {
  const svc = service();

  router.get('/:projectId/aqrp', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      let st = await svc.getState(s);
      if (st.status === 'running' && st.runId && !RUN_ABORTS.has(runKeyOf(s))) {
        const idleMs = st.lastProgressAt ? (Date.now() - new Date(st.lastProgressAt).getTime()) : Infinity;
        if (idleMs > 90000) {
          st = await svc.failRun(s, 'dispatcher not alive: chat fetch ended or container restarted. Completed steps and partial step outputs are downloadable.');
        }
      }
      res.json(st);
    } catch (e) { next(e); }
  });

  router.post('/:projectId/aqrp/start', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      const { fileId } = req.body || {};
      if (!fileId) return res.status(400).json({ error: 'fileId required' });
      const pfScope = { user: s.user, tenant: s.tenant, projectId: s.projectId };
      const { file, buffer } = await projectFilesService.read(pfScope, fileId);
      if (!/\.json$/i.test(file.name)) return res.status(415).json({ error: 'AQRP accepts JSON only' });
      const started = await svc.startRun(s, fileId, file.name, buffer);
      const rk = runKeyOf(s);
      const ctl = new AbortController();
      RUN_ABORTS.set(rk, ctl);
      res.json({ status: 'started', state: await svc.getState(s) });

      const jwt = require('jsonwebtoken');
      const mongoose = require('mongoose');
      const db = mongoose.connection.db;
      const conversationId = new mongoose.Types.ObjectId().toString();
      try {
        const __st = await svc.getState(s);
        if (__st && __st.runId) {
          await db.collection('aqrpruns').updateOne({ runId: __st.runId }, { $set: { conversationId } });
        }
      } catch (e) { console.error('[AQRP] conversationId update: ' + (e && e.message ? e.message : e)); }
      const now = new Date();
      const recipe = require('/app/recipes/aqrp.cjs');
      await db.collection('conversations').insertOne({ conversationId, title: recipe.name, user: s.user, tenant: s.tenant, chatProjectId: s.projectId, recipeId: recipe.recipeId, recipeName: recipe.name, createdAt: now, updatedAt: now });
      await db.collection('messages').insertOne({ messageId: new mongoose.Types.ObjectId().toString(), conversationId, user: s.user, isCreatedByUser: true, sender: 'User', text: recipe.prompt, createdAt: now, updatedAt: now });
      const token = jwt.sign({ id: s.user }, process.env.JWT_SECRET, { expiresIn: '10m' });
      const base = `http://127.0.0.1:${process.env.PORT || 3080}`;
      console.error('[AQRP] dispatching to chat', conversationId);
      fetch(`${base}/api/agents/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'User-Agent': req.headers['user-agent'] || 'LibreChat/0.8.7' },
        body: JSON.stringify({ conversationId, text: recipe.prompt + '\n\nCorpus file_id: ' + fileId, parentMessageId: null, tools: recipe.tools || [], files: [{ file_id: fileId, projectFileId: fileId, filename: file.name }], recipeWorkflow: recipe.workflow || null }),
        signal: AbortSignal.any([ctl.signal, AbortSignal.timeout(RUN_ABORT_MS)]),
      }).then(async (r) => {
        const body = await r.text().catch(() => '');
        console.error('[AQRP] chat response', r.status, body.slice(0, 2000));
        if (!r.ok) { const cur = await svc.getState(s); if (cur.status !== 'killed') await svc.failRun(s, `chat ${r.status}: ${body.slice(0, 200)}`); }
      }).catch(async (e) => {
        console.error('[AQRP] chat fetch error', e.message);
        const cur = await svc.getState(s);
        if (cur.status !== 'killed') await svc.failRun(s, e.message);
      }).finally(() => { RUN_ABORTS.delete(rk); });
    } catch (e) { next(e); }
  });

  router.post('/:projectId/aqrp/next', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      const st = await svc.getState(s);
      if (st.status !== 'running') return res.status(409).json({ error: `no active run (status=${st.status})` });
      const nextStep = (st.lastStepOk || 0) + 1;
      res.json({ status: 'dispatched', nextStep, state: st });

      const jwt = require('jsonwebtoken');
      const mongoose = require('mongoose');
      const db = mongoose.connection.db;
      const conversation = await db.collection('conversations').findOne({ user: s.user, tenant: s.tenant, chatProjectId: s.projectId, recipeId: 'aqrp' }, { sort: { createdAt: -1 } });
      if (!conversation) return;
      const recipe = require('/app/recipes/aqrp.cjs');
      const token = jwt.sign({ id: s.user }, process.env.JWT_SECRET, { expiresIn: '10m' });
      const base = `http://127.0.0.1:${process.env.PORT || 3080}`;
      await db.collection('messages').insertOne({ messageId: new mongoose.Types.ObjectId().toString(), conversationId: conversation.conversationId, user: s.user, isCreatedByUser: true, sender: 'User', text: `Run step ${nextStep}.`, createdAt: new Date(), updatedAt: new Date() });
      fetch(`${base}/api/agents/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'User-Agent': req.headers['user-agent'] || 'LibreChat/0.8.7' },
        body: JSON.stringify({ conversationId: conversation.conversationId, text: `Run step ${nextStep}.`, parentMessageId: null, tools: recipe.tools || [], recipeWorkflow: recipe.workflow || null }),
        signal: AbortSignal.timeout(RUN_ABORT_MS),
      }).then(async (r) => {
        const body = await r.text().catch(() => '');
        if (!r.ok) await svc.failRun(s, `chat ${r.status}: ${body.slice(0, 200)}`);
      }).catch(async (e) => { await svc.failRun(s, e.message); });
    } catch (e) { next(e); }
  });

  router.get('/:projectId/aqrp/output/:step', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      const step = String(req.params.step);
      const output = await svc.getOutput(s, step);
      if (output) {
        res.set('Content-Type', 'application/json');
        res.set('Content-Disposition', `attachment; filename="__aqrp_step${step}_out.json"`);
        return res.send(JSON.stringify(output, null, 2));
      }
      const st = await svc.getState(s);
      if (step === '0' || step === 'input') {
        const pfScope = { user: s.user, tenant: s.tenant, projectId: s.projectId };
        const { file, buffer } = await projectFilesService.read(pfScope, st.fileId);
        res.set('Content-Type', 'application/json');
        res.set('Content-Disposition', `attachment; filename="${file.name}"`);
        return res.send(buffer);
      }
      return res.status(404).json({ error: 'step output not found' });
    } catch (e) { next(e); }
  });

  router.post('/:projectId/aqrp/kill', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      const ctl = RUN_ABORTS.get(runKeyOf(s));
      if (ctl) { try { ctl.abort(); } catch (_) {} RUN_ABORTS.delete(runKeyOf(s)); }
      const killed = await svc.killRun(s, 'killed by user');
      try {
        if (killed && killed.runId) {
          const mongoose = require('mongoose');
          await mongoose.connection.db.collection('aqrp_progress').updateOne({ runId: killed.runId, step: 4 }, { $set: { inFlight: 0, updatedAt: new Date() } });
        }
      } catch (e) {}
      res.json(killed);
    } catch (e) { next(e); }
  });

  router.get('/:projectId/aqrp/debug', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      const st = await svc.getState(s);
      const stepKeys = Object.keys(st.steps || {});
      const perStep = {};
      for (const k of stepKeys) {
        const out = await svc.getOutput(s, Number(k));
        perStep[k] = out ? 'present' : 'null';
      }
      const mongoose = require('mongoose');
      const run = await mongoose.connection.db.collection('aqrpruns').findOne({ projectId: s.projectId, user: s.user, tenant: s.tenant });
      res.json({
        scope: { user: s.user, tenant: s.tenant, projectId: s.projectId },
        st_runId: st.runId, st_status: st.status, st_stepKeys: stepKeys, st_lastStepOk: st.lastStepOk,
        perStep,
        runDoc_found: !!run,
        runDoc_runId: run ? run.runId : null,
        runDoc_status: run ? run.status : null,
        runDoc_stepKeys: run ? Object.keys(run.steps || {}) : [],
        runDoc_has_output_per_step: run ? Object.fromEntries(Object.entries(run.steps || {}).map(([k, v]) => [k, !!(v && v.output)])) : {},
      });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // ── Shared PDF compile helper ──
// Used by both GET /pdf and GET /bundle. Compiles via asp-runner if not
// already cached in step-32 output. Caches b64 back to Mongo on success.
async function _ensureReportPdf(db, runDoc) {
  if (!runDoc || !runDoc.steps || !runDoc.steps['32']) return null;
  const s32 = runDoc.steps['32'].output || {};
  if (typeof s32.aqrp_report_pdf_b64 === 'string' && s32.aqrp_report_pdf_b64.length > 0) {
    return { b64: s32.aqrp_report_pdf_b64, source: 'cached' };
  }
  let payload;
  if (typeof s32.aqrp_report_body_tex === 'string' && s32.aqrp_report_body_tex.length > 0) {
    const fs = require('fs');
    let shell = '';
    try { shell = fs.readFileSync('/app/aqrp-feature/latex/aqrp_report.tex', 'utf8'); } catch (e) {}
    if (!shell) { console.error('[pdf] shell read failed'); return null; }
    const files = {
      'aqrp_report.tex': shell,
      'aqrp_report_title.tex': String(s32.aqrp_report_title || 'Untitled'),
      'aqrp_report_abstract.tex': String(s32.aqrp_report_abstract || 'No abstract.'),
      'aqrp_report_body.tex': String(s32.aqrp_report_body_tex),
      'aqrp_appendices.tex': String(s32.aqrp_appendices_tex || ''),
      'aqrp_report.bib': String(s32.aqrp_report_bib || '')
    };
    payload = JSON.stringify({ files, main: 'aqrp_report.tex', bib_backend: 'bibtex', run_id: runDoc.runId || '' });
  } else if (typeof s32.aqrp_report_tex === 'string' && s32.aqrp_report_tex.length > 0) {
    payload = JSON.stringify({ tex: s32.aqrp_report_tex, run_id: runDoc.runId || '' });
  } else {
    return null;
  }
  const http = require('http');
  try {
    const compiled = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'asp-runner', port: 8091, path: '/compile-tex', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
        timeout: 300000
      }, res => {
        let b = ''; res.on('data', c => b += c); res.on('end', () => { try { resolve(JSON.parse(b)); } catch (err) { reject(new Error('bad json')); } });
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(new Error('compile timeout')); });
      req.write(payload); req.end();
    });
    if (!compiled || !compiled.ok || !compiled.pdf_b64) {
      console.error('[pdf] compile failed: ' + (compiled && compiled.error ? compiled.error : 'unknown'));
      return null;
    }
    await db.collection('aqrpruns').updateOne({ _id: runDoc._id }, { $set: {
      'steps.32.output.aqrp_report_pdf_b64': compiled.pdf_b64,
      'steps.32.output.aqrp_report_pdf_source': 'compile-' + new Date().toISOString()
    }});
    return { b64: compiled.pdf_b64, source: 'compiled', bytes: compiled.bytes };
  } catch (err) {
    console.error('[pdf] compile threw: ' + (err && err.message ? err.message : err));
    return null;
  }
}

router.get('/:projectId/aqrp/pdf', async (req, res, next) => {
  try {
    const s = await svc.scope(req, req.params.projectId);
    const st = await svc.getState(s);
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    const runDoc = await db.collection('aqrpruns').findOne({ runId: st.runId });
    if (!runDoc) return res.status(404).json({ error: 'no run' });
    const result = await _ensureReportPdf(db, runDoc);
    if (!result || !result.b64) return res.status(404).json({ error: 'no step 32 output or pdf compile failed' });
    const buf = Buffer.from(result.b64, 'base64');
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', 'attachment; filename="aqrp_report.pdf"');
    return res.send(buf);
  } catch (e) { next(e); }
});

router.get('/:projectId/aqrp/bundle', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      const st = await svc.getState(s);
      const JSZip = require('jszip');
      const zip = new JSZip();
      let count = 0;
      const stepNums = Object.keys(st.steps || {}).map(Number).filter(n => Number.isInteger(n) && n >= 1).sort((a, b) => a - b);
      // Pre-fetch PDF for step 32 via shared helper (uses cache or compiles)
      let __pdf_b64 = null;
      try {
        const mongoose2 = require('mongoose');
        const db2 = mongoose2.connection.db;
        const runDoc2 = await db2.collection('aqrpruns').findOne({ runId: st.runId });
        if (runDoc2) {
          const r = await _ensureReportPdf(db2, runDoc2);
          if (r && r.b64) __pdf_b64 = r.b64;
        }
      } catch (e) { console.error('[bundle] pdf prefetch: ' + (e && e.message ? e.message : e)); }
      for (const n of stepNums) {
        const out = await svc.getOutput(s, n);
        if (out) {
          zip.file(`__aqrp_step${n}_out.json`, JSON.stringify(out, null, 2));
          if (n === 32) {
            let pdf_b64 = __pdf_b64 || out.aqrp_report_pdf_b64 || null;
            if (!pdf_b64 && out.aqrp_report_tex) {
              try {
                const http = require('http');
                pdf_b64 = await new Promise((resolve, reject) => {
                  const payload = JSON.stringify({ tex: out.aqrp_report_tex, run_id: st.runId || '' });
                  const req = http.request({
                    hostname: 'asp-runner', port: 8091, path: '/compile-tex', method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
                    timeout: 90000
                  }, res => {
                    let body = '';
                    res.on('data', c => body += c);
                    res.on('end', () => {
                      try {
                        const j = JSON.parse(body);
                        if (j.ok && j.pdf_b64) resolve(j.pdf_b64);
                        else reject(new Error('runner: ' + JSON.stringify(j).slice(0, 300)));
                      } catch (e) { reject(new Error('runner bad json: ' + body.slice(0, 200))); }
                    });
                  });
                  req.on('error', reject);
                  req.on('timeout', () => { req.destroy(new Error('compile timeout')); });
                  req.write(payload); req.end();
                });
                try {
                  const mongoose = require('mongoose');
                  const db = mongoose.connection.db;
                  const runDoc = await db.collection('aqrpruns').findOne({ runId: st.runId });
                  if (runDoc) {
                    await db.collection('aqrpruns').updateOne(
                      { _id: runDoc._id },
                      { $set: {
                          'steps.32.output.aqrp_report_pdf_b64': pdf_b64,
                          'steps.32.output.aqrp_report_pdf_source': 'asp-runner-' + new Date().toISOString()
                      }}
                    );
                  }
                } catch (_) {}
              } catch (e) {
                console.error('[bundle] asp-runner compile failed: ' + (e && e.message ? e.message : e));
              }
            }
            if (pdf_b64) {
              zip.file('aqrp_report.pdf', Buffer.from(pdf_b64, 'base64'));
              if (out.aqrp_report_audit) zip.file('aqrp_report_audit.json', JSON.stringify(out.aqrp_report_audit, null, 2));
            } else if (out.aqrp_report_tex) {
              zip.file('aqrp_report.tex', out.aqrp_report_tex);
              zip.file('_compile_failed.txt', 'asp-runner compile failed for run ' + (st.runId || '') + '; check docker logs asp-runner');
              if (out.aqrp_report_audit) zip.file('aqrp_report_audit.json', JSON.stringify(out.aqrp_report_audit, null, 2));
            } else if (out.submission_paper_tex) {
              zip.file('submission_paper.tex', out.submission_paper_tex);
              if (out.supplementary_rdf_tex) zip.file('supplementary_rdf.tex', out.supplementary_rdf_tex);
              if (out.aqrp_report) zip.file('aqrp_report.rdf', JSON.stringify(out.aqrp_report, null, 2));
            }
          }
          count++;
        }
      }
      const out4 = await svc.getOutput(s, 4);
      if (!out4) {
        const mongoose = require('mongoose');
        const rowsRaw = await mongoose.connection.db.collection('aqrp_rows').find({ runId: st.runId, step: 4 }).toArray();
        const rows = rowsRaw.sort((a, b) => Number(a.record_id) - Number(b.record_id));
        if (rows.length) {
          const cm = [];
          const byRecord = new Map();
          for (const r of rows) for (const pc of (r.perCoder || [])) {
            cm.push({ record_id: r.record_id, coder_id: pc.coder_id, codes: pc.codes });
            if (!byRecord.has(r.record_id)) byRecord.set(r.record_id, {});
            byRecord.get(r.record_id)[pc.coder_id] = pc.codes;
          }
          const disagreements = [];
          for (const [rid, coders] of byRecord) {
            const sets = Object.values(coders).map(cs => JSON.stringify(cs.slice().sort()));
            if (!sets.every(v => v === sets[0])) disagreements.push({ record_id: rid, coders });
          }
          zip.file('__aqrp_step4_partial.json', JSON.stringify({ status: 'OPEN_CODING_PARTIAL', records_done: rows.length, code_matrix: cm, disagreements }, null, 2));
          count++;
        }
      }
      if (!count) return res.status(404).json({ error: 'no step outputs to bundle' });
      // Aggregate warnings from every closed step, whatever its number.
      const __warnings = [];
      for (const __k of Object.keys(st.steps || {})) {
        const __n = Number(__k);
        if (!Number.isInteger(__n) || __n < 1) continue;
        const __out = (st.steps[__k] || {}).output || {};
        if (Array.isArray(__out.warnings)) {
          for (const __w of __out.warnings) __warnings.push(Object.assign({ step: __n }, __w));
        }
      }
      const __byBlame = {}, __byKind = {};
      for (const __w of __warnings) {
        const __b = __w.blame || 'unknown';
        const __kk = __w.kind || 'unknown';
        __byBlame[__b] = (__byBlame[__b] || 0) + 1;
        __byKind[__kk] = (__byKind[__kk] || 0) + 1;
      }
      zip.file('_errors.json', JSON.stringify({
        runId: st.runId || null,
        generated_at: new Date().toISOString(),
        total: __warnings.length,
        by_blame: __byBlame,
        by_kind: __byKind,
        warnings: __warnings
      }, null, 2));
      const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
      res.set('Content-Type', 'application/zip');
      res.set('Content-Disposition', `attachment; filename="aqrp_${st.runId || 'run'}_steps.zip"`);
      return res.send(buf);
    } catch (e) { next(e); }
  });

  router.delete('/:projectId/aqrp', async (req, res, next) => {
    try {
      const s = await svc.scope(req, req.params.projectId);
      const ctl = RUN_ABORTS.get(runKeyOf(s));
      if (ctl) { try { ctl.abort(); } catch (_) {} RUN_ABORTS.delete(runKeyOf(s)); }
      try {
        const mongoose = require('mongoose');
        const fs = require('fs');
        const db = mongoose.connection.db;
        const cur = await db.collection('aqrpruns').findOne({ user: s.user, tenant: s.tenant, projectId: s.projectId });
        if (cur) {
          if (cur.traceId) {
            const dir = '/app/admin-tools/prompt-dumps/' + cur.traceId;
            if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
          }
          if (cur.runId) {
            await Promise.all([
              db.collection('aqrp_rows').deleteMany({ runId: cur.runId }),
              db.collection('aqrp_progress').deleteMany({ runId: cur.runId }),
              db.collection('aqrp_batch_calls').deleteMany({ runId: cur.runId })
            ]);
          }
        }
      } catch (e) { console.error('[aqrp delete] cleanup: ' + (e && e.message ? e.message : e)); }
      res.json(await svc.deleteRun(s));
    } catch (e) { next(e); }
  });
}
module.exports = { registerRoutes, service };
