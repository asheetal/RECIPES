'use strict';
require('module-alias')({ base: '/app/api' });
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

(async () => {
  const [projectId, fileId, userArg] = process.argv.slice(2);
  if (!projectId || !fileId) { console.error('usage: cli-run.js <projectId> <fileId>'); process.exit(2); }
  const db = mongoose.connection.db;
  const run = await db.collection('helloworldruns').findOne({ projectId });
  const userId = userArg || (run && run.user);
  if (!userId) { console.error('no user'); process.exit(2); }
  const recipe = require('/app/recipes/hello_world.cjs');
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const body = {
    conversationId: 'new',
    text: recipe.prompt,
    parentMessageId: null,
    tools: recipe.tools || [],
    files: [{ file_id: fileId, projectFileId: fileId, filename: 'workbook.xlsx' }],
  };
  const r = await fetch(`http://127.0.0.1:${process.env.PORT || 3080}/api/agents/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify(body),
  });
  console.log('[cli] status', r.status);
  const reader = r.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop();
    for (const line of lines) {
      if (line.startsWith('event:') || line.startsWith('data:')) console.log(line.slice(0, 300));
    }
  }
  process.exit(0);
})();
