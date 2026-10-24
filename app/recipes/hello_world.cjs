'use strict';
module.exports = {
  recipeId: 'hello_world',
  name: 'Hello World',
  interactive: false,
  tools: ['hello_world_run'],
  prompt:
    'Use the hello_world_run tool to process the attached Excel workbook. ' +
    'Pass its file_id. Do not use research_files or bash_tool. Then report the pdf_url.',
};
