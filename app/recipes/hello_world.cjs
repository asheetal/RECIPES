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
      'Route to SURGERY when the request carries a spreadsheet attachment. Reply exactly {"route":"SURGERY"}.',
    fileRouting: 'surgery',
    fileExtensions: ['xlsx'],
    allowedRoutes: ['SURGERY'],
    failureMode: 'throw',
  },
};
