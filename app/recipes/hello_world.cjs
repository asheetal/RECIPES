'use strict';
// Recipe definition for Hello World.
// Source code (this file) lives in git; per-project run state lives in Mongo.
const recipeId = 'hello_world';

const promptTemplate = [
  'Run the Hello World recipe for this project.',
  'Call the tool hello_world_run exactly once, with file_id set to the attached workbook.',
  'Do not call any other tool. Do not ask questions.',
  'When the tool returns status "done", reply with one line: the pdf_url value.',
].join(' ');

const triagePolicy = {
  systemPrompt: promptTemplate,
  fileRouting: 'surgery',
  fileExtensions: ['xlsx'],
  allowedRoutes: ['SURGERY'],
  maxTokens: 8192,
  timeoutMs: 120000,
  failureMode: 'throw',
};

const inputContract = { maxFiles: 1, extensions: ['xlsx'] };

module.exports = { recipeId, name: 'Hello World', promptTemplate, triagePolicy, inputContract, interactive: false };
