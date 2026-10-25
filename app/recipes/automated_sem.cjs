'use strict';
module.exports = {
  recipeId: 'automated_sem',
  name: 'Automated SEM Pipeline',
  interactive: false,
  tools: ['asp_step_run'],
  prompt:
    'Execute Step 1 of the Automated SEM Pipeline on the attached Excel workbook. ' +
    'Call the asp_step_run tool exactly once with step=1 and the workbook file_id given below. ' +
    'Do NOT attempt any other step. Do NOT use bash_tool. Then report that step 1 completed.',
};
