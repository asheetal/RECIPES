'use strict';
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const execFileP = promisify(execFile);

const NAME = 'hello_world_run';

const def = {
  name: NAME,
  description:
    'Run the Hello World recipe on one project workbook. Produces a one-page PDF and returns its download URL. Call exactly once per run.',
  parameters: {
    type: 'object',
    properties: {
      file_id: { type: 'string', description: 'Project file id of the workbook' },
    },
    required: ['file_id'],
  },
};

async function runWorker(xlsxBuffer, fileName) {
  const td = await fs.mkdtemp(path.join(os.tmpdir(), 'hw-'));
  try {
    const xlsxPath = path.join(td, fileName || 'input.xlsx');
    const pdfPath = path.join(td, 'out.pdf');
    await fs.writeFile(xlsxPath, xlsxBuffer);
    const { stdout } = await execFileP(
      'python3',
      ['/app/hello-world-feature/worker.py', xlsxPath, pdfPath],
      { env: { ...process.env, PYTHONPATH: '/app/pylibs' }, maxBuffer: 10 * 1024 * 1024 },
    );
    const parsed = JSON.parse(stdout.trim().split('\n').pop());
    if (!parsed.ok) throw new Error(parsed.error || 'worker failed');
    return await fs.readFile(pdfPath);
  } finally {
    await fs.rm(td, { recursive: true, force: true });
  }
}

async function invoke(req, args) {
  const gateway = require('/app/admin-tools/role-gateway.cjs');
  gateway.audit(req, 'LLM_SURGERY', 'tool_call', { tool: NAME, args });
  let projectId = req?.__helloWorldProjectId;
  if (!projectId) {
    const convId = req?.body?.conversationId;
    if (convId && convId !== 'new') {
      const mongoose = require('mongoose');
      const convo = await mongoose.connection.db.collection('conversations')
        .findOne({ conversationId: convId }, { projection: { chatProjectId: 1 } });
      projectId = convo?.chatProjectId;
    }
  }
  if (!projectId) throw new Error('Hello World requires a project scope');
  const projectFiles = require('/app/project-files-feature/project-files.cjs').service();
  const s = { user: String(req.user.id || req.user._id), tenant: String(req.user.tenantId || ''), projectId };
  const { file, buffer } = await projectFiles.read(s, args.file_id);
  const pdf = await runWorker(buffer, file.name);
  const runState = require('/app/hello-world-feature/hello-world.cjs').service();
  await runState.completeRun({ ...s }, pdf);
  const out = {
    status: 'done',
    file: file.name,
    pdf_bytes: pdf.length,
    pdf_url: `/api/projects/${projectId}/hello-world/pdf`,
  };
  gateway.audit(req, 'LLM_SURGERY', 'tool_result', { tool: NAME, result: out });
  return JSON.stringify(out);
}

function makeTool(req) {
  const { DynamicStructuredTool } = require('@librechat/agents/langchain/tools');
  const { z } = require('zod');
  return new DynamicStructuredTool({
    name: NAME,
    description: def.description,
    schema: z.object({ file_id: z.string() }),
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
    const wanted = p.toolNames.includes(NAME);
    const names = p.toolNames.filter((n) => n !== NAME);
    const r = await load({ ...p, toolNames: names });
    if (wanted) {
      if (!r.loadedTools) r.loadedTools = [];
      r.loadedTools.push(makeTool(p.req));
    }
    return r;
  };
}

module.exports = { NAME, def, wrapLoad, wrapExecution, invoke };
