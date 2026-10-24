'use strict';
module.exports = {
  recipeId: 'hello_world',
  name: 'Hello World',
  interactive: false,
  promptSource: 'recipe',
  prompt:
    'Call the tool hello_world_run exactly once with the attached workbook file_id. ' +
    'Do not call any other tool. Do not ask questions. Then report the pdf_url.',
  policy: {
    systemPrompt:
      'You are the triage router. Read the prompt and the attached files, then reply with exactly {"route":"SURGERY"} when the request needs file work, or {"route":"OPD"} when it does not.',
    allowedRoutes: ['SURGERY', 'OPD'],
    failureMode: 'throw',
  },
};
