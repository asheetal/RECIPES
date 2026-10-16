'use strict';
// Prompt management: tool transcripts belong to their originating prompt.
// Database records remain unchanged for diagnostics and file retrieval.
function persistentView(message) {
 if(message.isCreatedByUser !== false || message.unfinished)
  return message;
 if(!Array.isArray(message.content)) return message;
 const parts=message.content;
 let lastTool=-1;
 for(let i=0;i<parts.length;i++)
  if(parts[i].type==='tool_call') lastTool=i;
 const content=parts.filter((p,i)=>{
  if(p.type==='tool_call'||/^(think|reasoning)$/.test(p.type||''))
   return false;
  if(p.type==='text'&&i<=lastTool) return false;
  return true;
 }).map(p=>{
  if(p.type!=='text'||!p.tool_call_ids) return p;
  const copy={...p}; delete copy.tool_call_ids; return copy;
 });
 if(lastTool<0&&content.length===parts.length) return message;
 return {
  ...message,
  content,
  text:lastTool>=0
   ?content.filter(p=>p.type==='text').map(p=>p.text||'').join('\n')
   :message.text,
  tokenCount:0,
 };
}
module.exports={persistentView};
