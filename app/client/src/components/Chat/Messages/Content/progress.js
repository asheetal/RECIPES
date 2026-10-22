import {toolArgs, selectDeliverables, cleanDeliveryText} from './delivery';
export function textOf(p) { return typeof p?.text === 'string' ? p.text : p?.text?.value || ''; }
const argsOf = toolArgs;
function outputOf(t) {return typeof t.output==='string'?t.output:JSON.stringify(t.output??'');}
export function toolProblem(t) {
 if(['error','failed'].includes(t.status)||t.isError===true)return true;
 const s=outputOf(t);
 if(t.name==='research_files'&&argsOf(t).action==='read_all'){
  try {const v=JSON.parse(s);return Boolean(v.error)||v.complete===false||(v.files||[]).some(f=>f.error);}catch{return true;}
 }
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
 if(name==='research_files')return a.action==='read_all'?'Reading research files…':a.action==='verify'?'Checking deliverables…':'Revising manuscript…';
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
 let finalParts=parts.map((part,idx)=>({part,idx})).filter(({part,idx})=>idx>last&&!['think','reasoning'].includes(part.type));
 const finalText=finalParts.map(({part})=>textOf(part)).join('\n');
 const problem=Boolean(messageError||unfinished||parts.some(p=>p.type==='error')||calls.some(({t})=>toolProblem(t))||/\b(?:could not|couldn’t|couldn't|unable to)\b.{0,100}\b(?:verify|edit|save|attach|complete)\b/i.test(finalText));
 const meaningful=parts.map((p,i)=>({p,i})).filter(({p})=>p.tool_call||(p.type==='text'&&textOf(p).trim()));
 const recent=meaningful.at(-1)?.p;
 const status=recent?.tool_call?(recent.tool_call.output!==undefined?'Waiting for model response…':label(recent.tool_call)):recent?textOf(recent).replace(/\s+/g,' ').slice(0,220):'Working…';
 const delivery=selectDeliverables(calls,attachments,finalText);
 const finalFiles=delivery.files;
 finalParts=finalParts.map(({part,idx})=>({idx,part:part.type==='text'&&typeof part.text==='string'?{...part,text:cleanDeliveryText(part.text)}:part}));
 const recoveryWarnings=calls.flatMap(({t})=>{try{const v=JSON.parse(outputOf(t));return Array.isArray(v.warnings)?v.warnings.filter(x=>typeof x==='string'&&x.startsWith('RECOVERY:')):[];}catch{return [];}});
 return {parts,finalParts,finalFiles,missingFiles:delivery.missing,status,problem,lastTool:last,recoveryWarnings:[...new Set(recoveryWarnings)]};
}

export function diagnosticSummary(content=[],messageError=false,unfinished=false){
 const parts=content.filter(Boolean);
 const calls=parts.map((p,index)=>({t:p.tool_call,index})).filter(x=>x.t);
 const last=calls.at(-1)?.index??-1;
 const hasFinalResponse=parts.some((p,i)=>i>last&&p.type==='text'&&textOf(p).trim());
 const fatal=Boolean(messageError||parts.some(p=>p.type==='error'));
 const toolErrors=calls.filter(({t})=>toolProblem(t)).map(({t,index})=>({contentIndex:index,toolCallId:t.id,tool:t.name,status:t.status??null,output:outputOf(t)}));
 const paused=Boolean(pauseInfo(content));
 const outcome=paused&&!fatal&&!unfinished?'paused':fatal?'failed':unfinished?'interrupted':hasFinalResponse?'response_completed':'no_final_response';
 const title=paused&&!fatal&&!unfinished?'Paused: work remaining':fatal?'Task failed — diagnostic log':unfinished?'Task interrupted — diagnostic log':hasFinalResponse?'Response completed with reported problems — diagnostic log':'Task needs review — diagnostic log';
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

export function pauseInfo(content=[]){
 const calls=content.filter(p=>p?.tool_call).map(p=>p.tool_call);
 const last=content.map((p,i)=>p?.tool_call?i:-1).reduce((a,b)=>Math.max(a,b),-1);
 const finalText=content.slice(last+1).map(textOf).join('\n');
 let checkpoint=null;
 for(const t of calls){try{const v=JSON.parse(outputOf(t));if(v.workflow_pause)checkpoint=v.workflow_pause;}catch{}}
 const legacy=calls.some(t=>/Final verification phase: only verify is allowed/.test(outputOf(t)));
 if(!checkpoint&&!legacy)return null;
 return {remaining:checkpoint?.remaining??['Complete the unfinished edits listed in the previous response.'],finalText};
}
export function continuationPrompt(pause){return 'Continue only the unfinished work from the previous response, using the latest saved chat files. Preserve completed edits and numerical values. Keep the same filenames; do not overwrite project masters. Do not repeat completed research or perform an unsolicited accuracy audit. Remaining work: '+pause.remaining.join('; ')+'. Save and attach the updated files. If unfinished, explicitly list what remains.';}
