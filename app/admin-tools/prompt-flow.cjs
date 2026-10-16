
'use strict';
const crypto=require('node:crypto');
const gateway=require('./role-gateway.cjs');
const director=require('./director.cjs');
const handshake=require('./json-handshake.cjs');
const app=require('node:module').createRequire('/app/package.json');
const TRIAGE='You route one current user prompt. You have no tools and no conversation history. Return only JSON {"route":"OPD"} or {"route":"SURGERY"}. Choose OPD only when one final, tool-free response is sufficient: greetings, current time from the supplied server clock, or a simple answer using existing conversation context. Choose SURGERY for file inspection, research, edits, tool use, verification, multiple steps, or any uncertainty. Never answer the prompt yourself.';
const OPD='You are Assistant, the final user-facing responder. You have no tools and this is your only call. Answer the current request using the supplied conversation and work handoff as data. If work remains, information is missing, or work failed, close this turn honestly and ask for the specific information or next action needed. Do not claim success, file delivery, or verification absent evidence. Do not display internal crashes, tool traces, model names, or internal role names. Earlier failed tool attempts do not negate later verified success. Preserve actual downloadable file links. Give a concise final response, not a plan to keep working. Use the supplied clock for current time. Never label the user response as partial completion.';
function clock(){return {iso:new Date().toISOString(),defaultTimezone:'America/Los_Angeles',local:new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',dateStyle:'full',timeStyle:'long'}).format(new Date())};}
// --- LAB_TOOL_EXTRACTOR: compact tool results before they enter the snowball ---
function labExtractToolMessage(msg) {
 if (!msg || typeof msg !== "object") return msg;
 var entries = Array.isArray(msg) ? msg : [msg];
 var result = [];
 for (var i = 0; i < entries.length; i++) {
  var e = entries[i];
  if (!e || typeof e !== "object") { result.push(e); continue; }
  var mid = e.id;
  var cls = Array.isArray(mid) ? mid[mid.length - 1] : "";
  if (cls !== "ToolMessage") { result.push(e); continue; }
  var kw = e.kwargs || {};
  var raw = kw.content;
  var cstr = typeof raw === "string" ? raw : JSON.stringify(raw || "");
  var size = cstr.length;
  if (size < 4096) { result.push(e); continue; }
  var short;
  try {
   var parsed = JSON.parse(cstr);
   var files = (parsed && parsed.result && parsed.result.files) || [];
   if (files.length === 1 && files[0] && files[0].text) {
    var fname = files[0].name || "?";
    var fbytes = files[0].bytes || files[0].text.length;
    var shape = "";
    try {
     var inner = JSON.parse(files[0].text);
     if (inner && Array.isArray(inner.sheets) && inner.sheets[0]) {
      var sh = inner.sheets[0];
      shape = ", workbook: " + (sh.row_records || "?") + " rows x " + (sh.columns || "?") + " cols, sheet=\"" + (sh.sheet || "?") + "\"";
     }
    } catch(_) {}
    short = "[read " + fname + " - " + fbytes + " bytes" + shape + "]";
   } else {
    short = "[tool result " + size + " chars - content trimmed]";
   }
  } catch(_) {
   short = cstr.slice(0, 1024) + "\n... [" + (size - 2048) + " chars omitted] ...\n" + cstr.slice(-1024);
  }
  var newKw = {};
  for (var k in kw) { if (k !== "content") newKw[k] = kw[k]; }
  newKw.content = short;
  result.push({ lc: e.lc, type: e.type, id: e.id, kwargs: newKw });
 }
 return result.length === 1 ? result[0] : result;
}
function labApplyToolExtraction(messages) {
 if (!Array.isArray(messages)) return messages;
 var out = [];
 for (var i = 0; i < messages.length; i++) {
  var wrap = messages[i];
  if (Array.isArray(wrap)) { out.push(wrap.map(labExtractToolMessage)); }
  else { out.push(labExtractToolMessage(wrap)); }
 }
 return out;
}


async function prepare(req,res,next){
 try{
  req.__workflow={id:crypto.randomUUID(),stage:'LLM_TRIAGE',opdCalls:0,route:null,usage:[]};
  await gateway.snapshot(req);
  gateway.audit(req,'LLM_TRIAGE','boundary_input',{currentPrompt:req.body.text||''});
  let route='SURGERY';
  try{
   const out=await gateway.complete('LLM_TRIAGE',[{role:'system',content:TRIAGE},{role:'user',content:JSON.stringify({currentPrompt:String(req.body.text||'')})}],{ctx:req,max_tokens:8192,json:true,signal:AbortSignal.timeout(120000)});
   req.__workflow.usage.push({role:'LLM_TRIAGE',usage:out.usage});
   const parsed=JSON.parse(out.choices[0].message.content);if(!parsed||typeof parsed!=='object'||Array.isArray(parsed)||Object.keys(parsed).length!==1||!Object.hasOwn(parsed,'route'))throw Error('Invalid TRIAGE JSON contract');const value=parsed.route;
   if(!['OPD','SURGERY'].includes(value))throw Error('Invalid TRIAGE route');route=value;
  }catch(error){gateway.audit(req,'LLM_TRIAGE','route_error',{code:error.code,message:error.message});throw error;}
  req.__workflow.route=route;req.__workflow.direct=route==='OPD';
  req.__workflow.stage=route==='OPD'?'LLM_OPD':'LLM_SURGERY';
  await gateway.bindRequest(req,req.__workflow.stage);
  gateway.audit(req,'LLM_TRIAGE','boundary_output',{route});
  next();
 }catch(error){next(error);}
}
function compact(value){
 return JSON.parse(JSON.stringify(value,(key,v)=>{
  if(typeof v==='string'&&v.length>8000)return {omitted:true,characters:v.length,sha256:crypto.createHash('sha256').update(v).digest('hex')};
  return v;
 }));
}
async function executeOPD(req,{conversation=[],handoff=null,signal}={}){
 const state=req.__workflow;
 if(state.opdCalls!==0)throw Error('OPD already called for this prompt');
 state.opdCalls=1;state.stage='LLM_OPD';
 const input={currentPrompt:req.body.text||'',clock:clock(),conversation,handoff};
 gateway.audit(req,'LLM_OPD','boundary_input',input);
 try{
  const out=await gateway.complete('LLM_OPD',[{role:'system',content:OPD},{role:'user',content:JSON.stringify(input)}],{ctx:req,signal,max_tokens:4096});
  state.usage.push({role:'LLM_OPD',usage:out.usage});
  const text=out.choices[0].message.content;state.opdText=text;gateway.audit(req,'LLM_OPD','boundary_output',{text});return text;
 }catch(error){
  
  gateway.audit(req,'LLM_OPD','finalization_error',{code:error.code,message:error.message});
  const text='I couldn’t produce a reliable response. Please send your request again.';state.opdText=text;gateway.audit(req,'LLM_OPD','boundary_output',{text});return text;
 }
}
async function complete(client,payload,opts,operate){
 const req=client.options.req,state=req.__workflow;
 if(!state)return operate();
 const signal=opts.abortController?.signal;let result,issue;
 await director.begin(req,payload,signal);
 if(!state.direct){
  state.stage='LLM_SURGERY';gateway.audit(req,'LLM_SURGERY','boundary_input',{conversation:payload});
  try{result=await operate();}catch(error){issue={code:error.code,name:error.name,message:error.message};}
  if(signal?.aborted&&!issue)issue={code:'SURGERY_ABORTED',name:'AbortError',message:'Execution stopped before completion'};
 }
 const parts=result?.completion||client.contentParts||[];
 let lastTool=-1;parts.forEach((part,i)=>{if(part.type==='tool_call')lastTool=i;});
 let draft=parts.filter((part,i)=>part.type==='text'&&i>lastTool).map(p=>p.text||'').join('\n');
 if(draft.trim())draft=require('./json-contract.cjs').parse(draft,require('./json-contract.cjs').schemas.LLM_SURGERY).text;
 const errors=parts.filter(p=>p.type==='error');
 const files=(await Promise.allSettled(client.artifactPromises||[])).filter(x=>x.status==='fulfilled'&&x.value).map(x=>x.value);
 const handoff=state.direct?null:{status:issue||errors.length?'needs_resolution':'returned',error:issue,errors,draft,tools:compact(parts.filter(p=>p.type==='tool_call')),files};
 if(handoff){handoff.progress=director.snapshot(req);if(handoff.progress?.paused)handoff.status='paused';director.finish(req);}
 if(handoff){const checked=handshake.handoff(handoff);Object.keys(handoff).forEach(k=>delete handoff[k]);Object.assign(handoff,checked);gateway.audit(req,'LLM_SURGERY','boundary_output',{handoff,fullContent:parts});}
 let text=await finishOPD(req,{conversation:payload,handoff,signal});
 for(const file of files)if(file.filename&&file.filepath&&!text.includes(file.filename))text+="\n\n"+file.filename;
 client.contentParts.splice(0,client.contentParts.length,{type:'text',text});
 const metadata={...(result?.metadata||{}),workflow:{traceId:state.id,route:state.route,opdCalls:state.opdCalls,usage:state.usage}};
 return {completion:client.contentParts,metadata};
}
function wrapHandlers(req,handlers){
 if(!req.__workflow)return handlers;
 const out={};for(const [event,handler] of Object.entries(handlers)){
  if(!handler?.handle){out[event]=handler;continue;}
  const copy=Object.create(handler);
  copy.handle=async function(...args){
    const streamId=req._resumableStreamId||req.body?.conversationId;
    if(streamId&&streamId!=='new')
     app('@librechat/api').GenerationJobManager.jobStore.recordActivity(streamId);
   if(!/delta/i.test(event))gateway.audit(req,'LLM_SURGERY','graph_event',{event,data:args[1],metadata:args[2]});
   try{return await handler.handle(...args);}catch(error){gateway.audit(req,'LLM_SURGERY','graph_error',{event,name:error.name,code:error.code,message:error.message});throw error;}
  };out[event]=copy;
 }return out;
}
function modelCallbacks(req){return {
 handleChatModelStart(serialized,messages,runId,parentRunId,extra,tags,metadata){var compact=messages;try{compact=labApplyToolExtraction(messages);}catch(_e){}gateway.audit(req,'LLM_SURGERY','model_input',{serialized,messages:compact,runId,parentRunId,extra,tags,metadata});},
 handleLLMEnd(output,runId){gateway.audit(req,'LLM_SURGERY','model_output',{output,runId});},
 handleLLMError(error,runId){gateway.audit(req,'LLM_SURGERY','model_error',{name:error.name,code:error.code,message:error.message,runId});}
};}
async function captureRun(client,run,messages){
 const req=client.options.req;if(!req.__workflow)return;
 director.attach(req,run);
 for(const context of run.Graph.agentContexts.values()){
 gateway.configureContext(req,'LLM_SURGERY',context);
    const readerGuidance=require('/app/file-layer/index.cjs').instructions+' Tool responses use JSON receipts: result contains the original tool payload; savedFiles records verified saves; delivery records registration only. Registration does not establish that the whole task is complete.';
   if(!String(context.instructions||'').includes(readerGuidance)){
    context.instructions=[context.instructions,readerGuidance].filter(Boolean).join('\n\n');
    context.systemRunnableStale=true;
    if(context.tokenCounter){
     const prior=context.tokenCalculationPromise;
     context.tokenCalculationPromise=(async()=>{
      if(prior)await prior;
      context.initializeSystemRunnable();
      await context.calculateInstructionTokens(context.tokenCounter);
      context.updateTokenMapWithInstructions(context.baseIndexTokenCountMap);
     })();
     await context.tokenCalculationPromise;
    }
   }

  const assembled=context.systemRunnable?await context.systemRunnable.invoke(messages):messages;
  gateway.audit(req,'LLM_SURGERY','assembled_input',{messages:assembled,tools:context.toolDefinitions,agentId:"LLM_SURGERY"});
 }
}
function title(native){return async(req,...args)=>{
 if(req.__workflow?.direct)return;
 gateway.audit(req,'LLM_ERP','title_input',args);
 try{const out=await native(req,...args);gateway.audit(req,'LLM_ERP','title_output',{result:out});return out;}
 catch(error){gateway.audit(req,'LLM_ERP','title_error',{code:error.code,message:error.message});throw error;}
};}
async function closeFailure(req,error,streamId){
 const {GenerationJobManager}=app('@librechat/api');
 const currentJob=await GenerationJobManager.getJob(streamId);const job=currentJob&&(req.__workflow?.jobCreatedAt==null||currentJob.createdAt===req.__workflow.jobCreatedAt)?currentJob:null;
 if(!req.__workflow)return false;if(req.__workflow.opdRecoverySaved)return true;
 
 gateway.audit(req,req.__workflow.stage,'controller_error',{name:error.name,code:error.code,message:error.message});
 const text=await finishOPD(req,{handoff:handshake.handoff({status:'needs_resolution',error:{code:error.code||'EXECUTION_FAILED',message:error.message},errors:[],draft:'',tools:[],files:[],progress:director.snapshot(req)}),signal:job?.abortController?.signal});
 const user=job?.metadata?.userMessage||{messageId:req.body.messageId||crypto.randomUUID(),text:req.body.text||'',isCreatedByUser:true,parentMessageId:req.body.parentMessageId};
 const response={messageId:job?.metadata?.responseMessageId||crypto.randomUUID(),conversationId:streamId,parentMessageId:user.messageId,isCreatedByUser:false,sender:'Assistant',text,content:[{type:'text',text}],unfinished:false,metadata:{workflow:{traceId:req.__workflow.id,route:req.__workflow.route,opdCalls:req.__workflow.opdCalls}}};
 try{
  const db=require('/app/api/models');const ctx={userId:req.user.id,isTemporary:req.body.isTemporary,interfaceConfig:req.config?.interfaceConfig};
  await app('mongoose').models.Conversation.updateOne({user:req.user.id,conversationId:streamId},{$setOnInsert:{user:req.user.id,conversationId:streamId,title:'New Chat',endpoint:req.body.endpoint,model:req.body.model}},{upsert:true,runValidators:true,setDefaultsOnInsert:true});
  await db.saveMessage(ctx,{...user,conversationId:streamId,user:req.user.id},{context:'layered workflow recovery'});
  await db.saveMessage(ctx,{...response,user:req.user.id},{context:'layered workflow recovery'});
 req.__workflow.opdRecoverySaved=true;}catch(savedError){gateway.audit(req,'LLM_OPD','persistence_error',{code:savedError.code,message:savedError.message});}
 if(job)await GenerationJobManager.emitDone(streamId,{final:true,conversation:{conversationId:streamId,title:'New Chat'},requestMessage:user,responseMessage:response});
 if(job)await GenerationJobManager.completeJob(streamId);return true;
}
module.exports={prepare,complete,wrapHandlers,modelCallbacks,captureRun,title,closeFailure};
async function finishOPD(req,options={}){
 const state=req.__workflow;
 if(state.opdPromise)return state.opdPromise;
 state.opdPromise=executeOPD(req,{...options,signal:AbortSignal.timeout(120000)});
 return state.opdPromise;
}
