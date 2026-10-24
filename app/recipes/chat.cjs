'use strict';
const { DEFAULT_POLICY } = require('/app/admin-tools/triage.cjs');
module.exports = {
  recipeId: 'chat',
  name: 'Chat',
  interactive: true,
  promptSource: 'user',
  policy: DEFAULT_POLICY,
};
