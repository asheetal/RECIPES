'use strict';
const IT_KINDS=new Set([
 'system_error','service_error','container_crash',
 'server_exception','frontend_crash'
]);
function isTriage(record){
 return !!record &&
  typeof record.workflowTraceId==='string' &&
  record.workflowTraceId.length>0 &&
  record.source==='librechat' &&
  !IT_KINDS.has(record.kind);
}
module.exports={isTriage};
