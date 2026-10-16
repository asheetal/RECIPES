export function textOf(p) { return typeof p?.text === 'string' ? p.text : p?.text?.value || ''; }
function argsOf(t) {
 try { const a=typeof t.args==='string'?JSON.parse(t.args):t.args||{};return typeof a.request==='string'?JSON.parse(a.request):a; } catch { return {}; }
}
function outputOf(t) {return typeof t.output==='string'?t.output:JSON.stringify(t.output??'');}
export function toolProblem(t) {
 if(['error','failed'].includes(t.status)||t.isError===true)return true;
 const s=outputOf(t);
 // Source-code text can itself contain error strings; it is not an execution result.
 if(t.name==='project_files'&&argsOf(t).action==='read'){
  try{const v=JSON.parse(s);if(typeof v.content==='string'&&!v.error)return false;}catch{}
 }
 if(/Traceback \(most recent call last\)|\[sandbox\] stdout length exceeded|^Error:|^.*HTTP (?:4\d\d|5\d\d)\b/m.test(s))return true;
 // Never scan manuscript prose for error/partial keywords.
 if(t.name==='manuscript_word'&&argsOf(t).action==='read')return false;
 try{
  const v=JSON.parse(s.replace(/^stdout:\s*/, '').split(/\n\s*(?:Generated files:|stderr:)/)[0].trim());
  return Boolean(v.error)||v.status==='partial'||v.status==='error'||v.status==='failed'||v.rejected_edits?.length>0;
 }catch{return /^\s*(?:Error|ValueError|RuntimeError|PermissionError):/m.test(s)||/"status"\s*:\s*"partial"/.test(s);}
}
function label(t) {
 const a=argsOf(t),name=t.name||'';
 if(name==='manuscript_word'){
  if(a.action==='apply')return 'Applying tracked edits…';
  if(a.action==='read')return /pass\d|copyedit|revised|_final/i.test(a.input||'')?'Checking revised document…':'Reading manuscript…';
 }
 if(/verify_references/.test(name))return 'Checking references…';
 if(/research_search|web_search|search/i.test(name))return 'Searching sources…';
 if(/read_file/.test(name))return 'Reading file…';
 if(/project_files/.test(name))return 'Working with project files…';
 if(/bash|execute_code/.test(name))return 'Running document tools…';
 if(/write|edit|create/.test(name))return 'Updating files…';
 return 'Calling tools…';
}
export function progressState(content=[],attachments=[],messageError=false,unfinished=false){
 const parts=content.filter(Boolean);const calls=parts.map((p,i)=>({t:p.tool_call,i})).filter(x=>x.t);
 const last=calls.at(-1)?.i??-1;
 const finalParts=parts.map((part,idx)=>({part,idx})).filter(({part,idx})=>idx>last&&!['think','reasoning'].includes(part.type));
 const finalText=finalParts.map(({part})=>textOf(part)).join('\n');
 const problem=Boolean(messageError||unfinished||parts.some(p=>p.type==='error')||calls.some(({t})=>toolProblem(t))||/\b(?:could not|couldn’t|couldn't|unable to)\b.{0,100}\b(?:verify|edit|save|attach|complete)\b/i.test(finalText));
 const meaningful=parts.map((p,i)=>({p,i})).filter(({p})=>p.tool_call||(p.type==='text'&&textOf(p).trim()));
 const recent=meaningful.at(-1)?.p;
 const status=recent?.tool_call?label(recent.tool_call):recent?textOf(recent).replace(/\s+/g,' ').slice(0,220):'Working…';
 let finalFiles=attachments.filter(f=>f.filename&&finalText.includes(f.filename));
 if(!finalFiles.length){
  // Prefer the most recent explicit output artifact, even when the model says only "attached".
  for(const {t} of [...calls].reverse()){
   const a=argsOf(t);const filename=typeof a.output==='string'?a.output.split('/').pop():null;
   const matches=filename?attachments.filter(f=>f.filename===filename):[];
   if(matches.length){finalFiles=matches;break;}
  }
 }
 if(!finalFiles.length&&attachments.length){
  const ids=new Set(attachments.map(f=>f.toolCallId).filter(Boolean));
  const latest=[...calls].reverse().find(({t})=>ids.has(t.id));
  if(latest)finalFiles=attachments.filter(f=>f.toolCallId===latest.t.id);
  else finalFiles=[attachments.at(-1)];
 }
 return {parts,finalParts,finalFiles,status,problem,lastTool:last};
}

export function diagnosticSummary(content=[],messageError=false,unfinished=false){
 const parts=content.filter(Boolean);
 const calls=parts.map((p,index)=>({t:p.tool_call,index})).filter(x=>x.t);
 const last=calls.at(-1)?.index??-1;
 const hasFinalResponse=parts.some((p,i)=>i>last&&p.type==='text'&&textOf(p).trim());
 const fatal=Boolean(messageError||parts.some(p=>p.type==='error'));
 const toolErrors=calls.filter(({t})=>toolProblem(t)).map(({t,index})=>({contentIndex:index,toolCallId:t.id,tool:t.name,status:t.status??null,output:outputOf(t)}));
 const outcome=fatal?'failed':unfinished?'interrupted':hasFinalResponse?'response_completed':'no_final_response';
 const title=fatal?'Task failed — diagnostic log':unfinished?'Task interrupted — diagnostic log':hasFinalResponse?'Response completed with reported problems — diagnostic log':'Task needs review — diagnostic log';
 return {outcome,title,hasFinalResponse,fatal,toolErrors,toolCallCount:calls.length};
}
export function buildDiagnostic({messageId,conversationId,content=[],attachments=[],messageError=false,unfinished=false,metadata={}}){
 const summary=diagnosticSummary(content,messageError,unfinished);
 return {schemaVersion:2,exportedAt:new Date().toISOString(),messageId,conversationId,
  metadata,error:messageError??false,unfinished:Boolean(unfinished),...summary,
  limitations:['Provider request IDs, HTTP status and per-call timing are not available in this browser export unless present in the saved error content.','A final response does not verify the correctness or delivery of its files.'],
  attachments:attachments.map(f=>({file_id:f.file_id,filename:f.filename,bytes:f.bytes,source:f.source,toolCallId:f.toolCallId})),
  toolCalls:content.map((p,index)=>({t:p?.tool_call,index})).filter(x=>x.t).map(({t,index})=>({contentIndex:index,id:t.id,name:t.name,status:t.status??null,progress:t.progress??null,hasOutput:t.output!==undefined,argsCharacters:typeof t.args==='string'?t.args.length:JSON.stringify(t.args??{}).length,outputCharacters:outputOf(t).length,reportedError:toolProblem(t)})),content};
}
