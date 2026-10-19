
'use strict';
const crypto=require('node:crypto');
const gateway=require('./role-gateway.cjs');
const director=require('./director.cjs');
const handshake=require('./json-handshake.cjs');
const app=require('node:module').createRequire('/app/package.json');
const TRIAGE='You route one current user prompt. You have no tools and no conversation history. Return only JSON {"route":"OPD"} or {"route":"SURGERY"}. Choose OPD only when the answer is already present as visible text in the supplied conversation, or the prompt is a greeting, or the prompt asks for the current time from the supplied server clock. Choose SURGERY for anything that requires computation, aggregation, comparison, arithmetic, reading file contents or filenames, project state, research, edits, tool use, verification, multiple steps, or any fact not already written verbatim in the supplied conversation. When in doubt, choose SURGERY. Never answer the prompt yourself.';
const OPD='You are Assistant, the final user-facing responder. You have no tools and this is your only call. Answer the current request using the supplied conversation and work handoff as data. If work remains, information is missing, or work failed, close this turn honestly and ask for the specific information or next action needed. Do not claim success, file delivery, or verification absent evidence. Do not display internal crashes, tool traces, model names, or internal role names. Earlier failed tool attempts do not negate later verified success. Preserve actual downloadable file links. Give a concise final response, not a plan to keep working. Use the supplied clock for current time. Never label the user response as partial completion.';
function clock(){return {iso:new Date().toISOString(),defaultTimezone:'America/Los_Angeles',local:new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',dateStyle:'full',timeStyle:'long'}).format(new Date())};}
// --- LAB_TOOL_EXTRACTOR: compact tool results before they enter the snowball ---
function labExtractToolMessage(msg) {
 console.error('[LAB-EXT] entry', Array.isArray(msg) ? msg.map(function(e){var mid=e&&e.id;var cls=Array.isArray(mid)?mid[mid.length-1]:'?';var c=e&&e.kwargs&&e.kwargs.content;var sz=typeof c==='string'?c.length:JSON.stringify(c||'').length;return cls+':'+sz;}).join(',') : (msg && msg.id ? (Array.isArray(msg.id)?msg.id[msg.id.length-1]:'?')+':'+(typeof msg.kwargs?.content==='string'?msg.kwargs.content.length:0) : '?'));
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
  let conversation = [];
  const convId = req.body?.conversationId;
  if (convId && convId !== 'new') {
    try {
      const MessageModel = app('mongoose').models.Message;
      if (MessageModel) {
        const msgs = await MessageModel.find({ conversationId: convId }).sort({ createdAt: 1 }).lean();
        if (Array.isArray(msgs)) {
          const summaries = msgs.filter(m => m.metadata && m.metadata.labTriageSummary);
          const uiMessages = msgs.filter(m => !(m.metadata && m.metadata.labTriageSummary));
          const summaryBlocks = summaries.map(m => {
            const txt = Array.isArray(m.content) && m.content[0] && m.content[0].text ? m.content[0].text : (m.text || '');
            return { role: 'system', text: '[Prior triage summary] ' + txt };
          });
          const uiBlocks = uiMessages.map(m => ({
            role: (m.isCreatedByUser || m.sender === 'User') ? 'user' : 'assistant',
            text: m.text || (Array.isArray(m.content) && m.content[0] && m.content[0].text ? m.content[0].text : ''),
          }));
          conversation = summaryBlocks.concat(uiBlocks);
        }
      }
    } catch (e) {
      gateway.audit(req, 'LLM_TRIAGE', 'history_fetch_error', { message: e.message });
    }
  }
  const rawPrompt = String(req.body.text || '');
  const reqFiles = Array.isArray(req.body.files) ? req.body.files : [];
  const hasFiles = reqFiles.length > 0 || /\.(xlsx|docx|pdf|tex|csv|txt|json)/i.test(rawPrompt);
  const triageInput = { currentPrompt: rawPrompt, conversation, files: reqFiles };
  gateway.audit(req, 'LLM_TRIAGE', 'boundary_input', triageInput);
  let route = 'SURGERY';
  if (hasFiles) {
    route = 'SURGERY';
  } else {
  try{
   const out=await gateway.complete('LLM_TRIAGE',[{role:'system',content:TRIAGE},{role:'user',content:JSON.stringify(triageInput)}],{ctx:req,max_tokens:8192,json:true,signal:AbortSignal.timeout(120000)});
   req.__workflow.usage.push({role:'LLM_TRIAGE',usage:out.usage});
   const parsed=JSON.parse(out.choices[0].message.content);if(!parsed||typeof parsed!=='object'||Array.isArray(parsed)||Object.keys(parsed).length!==1||!Object.hasOwn(parsed,'route'))throw Error('Invalid TRIAGE JSON contract');const value=parsed.route;
   if(!['OPD','SURGERY'].includes(value))throw Error('Invalid TRIAGE route');route=value;
  }catch(error){gateway.audit(req,'LLM_TRIAGE','route_error',{code:error.code,message:error.message});throw error;}
  }
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
 const plan = require('./plan.cjs').get(req);
 const input={currentPrompt:req.body.text||'',clock:clock(),conversation,handoff,...(plan && plan.raw ? {surgeonPlan:plan.raw} : {})};
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
 if(draft.trim()){try{const _s=require('./json-contract.cjs').schemas.LLM_SURGERY;if(_s)draft=require('./json-contract.cjs').parse(draft,_s).text;}catch(_e){}}
 const errors=parts.filter(p=>p.type==='error');
 const files=(await Promise.allSettled(client.artifactPromises||[])).filter(x=>x.status==='fulfilled'&&x.value).map(x=>x.value);
 const handoff=state.direct?null:{status:issue||errors.length?'needs_resolution':'returned',error:issue,errors,draft,tools:compact(parts.filter(p=>p.type==='tool_call')),files};
 if(handoff){handoff.progress=director.snapshot(req);if(handoff.progress?.paused)handoff.status='paused';director.finish(req);}
 if(handoff){const checked=handshake.handoff(handoff);Object.keys(handoff).forEach(k=>delete handoff[k]);Object.assign(handoff,checked);gateway.audit(req,'LLM_SURGERY','boundary_output',{handoff,fullContent:parts});}
 // Inject prior triage summaries into OPD input (for conversational continuity)
 try {
  const MessageModel = app('mongoose').models.Message;
  const cid = req.body?.conversationId;
  if (MessageModel && cid && cid !== 'new') {
   const summaries = await MessageModel.find({ conversationId: cid, 'metadata.labTriageSummary': { $exists: true } }).sort({ createdAt: 1 }).lean();
   if (Array.isArray(summaries) && summaries.length) {
    const summaryContext = summaries.map(m => {
     const t = Array.isArray(m.content) && m.content[0] && m.content[0].text ? m.content[0].text : (m.text || '');
     return { role: 'system', text: '[Prior triage summary] ' + t };
    });
    if (Array.isArray(payload)) payload.unshift(...summaryContext);
    else if (payload && typeof payload === 'object') payload.summaries = summaryContext;
    gateway.audit(req, 'LLM_SURGERY', 'summary_injected_for_opd', { count: summaries.length });
   }
  }
 } catch(e) { gateway.audit(req, 'LLM_SURGERY', 'summary_inject_error', { message: e.message }); }
 let text=await finishOPD(req,{conversation:payload,handoff,signal});
 // ---- TRIAGE SUMMARY SNOWBALL ----
 try {
  const MessageModel = app('mongoose').models.Message;
  if (MessageModel && req.body?.conversationId && req.body.conversationId !== 'new') {
   const partsForSummary = parts.map(p => ({ type: p.type, text: p.text || p.value || '' }));
   const convoForSummary = Array.isArray(payload) ? payload : [];
   const summaryPrompt = [
    { role: 'system', content: 'You are writing a handover note for the surgeon who will handle the next triage on this conversation.\\n\\nInput: the complete record of the triage that just ended.\\n\\nOutput: a short note that answers, in order:\\n1. What did the user ask for?\\n2. What was done? (concrete: files produced, edits applied, decisions reached)\\n3. What is the current state of the work?\\n4. What does the next surgeon need to remember?\\n\\nRules:\\n- Be specific. Name files, versions, exact state.\\n- Keep it to 400 tokens or less.\\n- Do not narrate reasoning. Only facts.\\n- Never invent details.\\n- Return only the note.' },
    { role: 'user', content: JSON.stringify({ conversation: convoForSummary, output: partsForSummary, finalReply: text }).slice(0, 120000) }
   ];
   const erp = await gateway.complete('LLM_ERP', summaryPrompt, { ctx: req, max_tokens: 8192, signal: AbortSignal.timeout(180000) });
   const summaryText = erp && erp.choices && erp.choices[0] && erp.choices[0].message ? String(erp.choices[0].message.content || '').trim() : '';
   if (summaryText) {
    let summaryParentId = undefined;
    try {
     const lastMsg = await MessageModel.findOne({ conversationId: req.body.conversationId }).sort({ createdAt: -1 }).lean();
     if (lastMsg && lastMsg.messageId) summaryParentId = lastMsg.messageId;
    } catch (_e) { summaryParentId = undefined; }
    await MessageModel.create({
     messageId: require('node:crypto').randomUUID(),
     conversationId: req.body.conversationId,
     parentMessageId: summaryParentId,
     user: String(req.user?.id || req.user?._id || ''),
     isCreatedByUser: false,
     sender: 'System',
     text: '',
     content: [{ type: 'text', text: summaryText }],
     metadata: { labTriageSummary: { version: 1, triageId: state.id, createdAt: new Date().toISOString() } },
     unfinished: false, error: false,
    });
    gateway.audit(req, 'LLM_SURGERY', 'triage_summary_written', { length: summaryText.length });
   }
  }
 } catch(e) { gateway.audit(req, 'LLM_SURGERY', 'triage_summary_error', { message: e.message }); }
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
 handleChatModelStart(serialized,messages,runId,parentRunId,extra,tags,metadata){var compact=messages;try{compact=labApplyToolExtraction(messages);}catch(_e){}try{const P=require('./plan.cjs');const inner=(Array.isArray(compact)&&compact.length===1&&Array.isArray(compact[0]))?compact[0]:compact;P.stripMessages(inner);const cur=P.get(req);if(cur&&cur.raw){const hasInj=inner.some(m=>{const c=(m&&m.kwargs&&typeof m.kwargs.content==='string')?m.kwargs.content:(typeof m.content==='string'?m.content:'');return c.startsWith('CURRENT CASE PLAN');});if(!hasInj)inner.unshift({lc:1,type:'constructor',id:['langchain_core','messages','SystemMessage'],kwargs:{content:'CURRENT CASE PLAN (authoritative):\n'+cur.raw}});}}catch(_e){}gateway.audit(req,'LLM_SURGERY','model_input',{serialized,messages:compact,runId,parentRunId,extra,tags,metadata});},
 handleLLMEnd(output,runId){gateway.audit(req,'LLM_SURGERY','model_output',{output,runId});try{const g=output?.generations?.[0]?.[0];const P=require('./plan.cjs');const c=P.getMessageContent(g?.message);const raw=P.extract(c);if(raw){const stored=require('./plan.cjs').set(req,raw);gateway.audit(req,'LLM_SURGERY','plan_set',{len:raw.length,version:stored?.version,hadWorkflow:!!req?.__workflow});}else{gateway.audit(req,'LLM_SURGERY','plan_missing',{c_len:c.length,c_head:c.slice(0,80)});}}catch(e){gateway.audit(req,'LLM_SURGERY','plan_error',{message:e.message});}},
 handleLLMError(error,runId){gateway.audit(req,'LLM_SURGERY','model_error',{name:error.name,code:error.code,message:error.message,runId});}
};}
async function captureRun(client,run,messages){
 const req=client.options.req;if(!req.__workflow)return;
 director.attach(req,run);
 for(const context of run.Graph.agentContexts.values()){
 gateway.configureContext(req,'LLM_SURGERY',context);
  const planInstruction = 'LIVE CASE PLAN (mandatory). You are one surgeon working one case. The case has exactly one plan. Before every tool call, replace that plan with an updated version. Format:\n[PLAN]\noutputs: <the concrete artifacts this case must produce, in order>\nsteps:\n  \u2713 1. <completed step — what it established>\n  \u2610 2. <next evidence step — what it must establish>\n  \u2610 3. <write/edit step>\ncurrent: <step N, why this specific tool call serves it>\nchanged: <what changed since the last plan — or "no change">\n\nRules:\n- The plan replaces the previous plan. The latest version is authoritative. Older plans are history and are not shown to you again.\n- Completed steps carry \u2713 and name what they established. Do not re-do them.\n- You may revise steps at any time — say what changed and why. Silent deviation is forbidden.\n- When all evidence steps are \u2713, execute the write/edit step. Do not keep ordering tests after the diagnosis is complete.\n- The Director sees your plan when ERP presents your case at round expiry. A plan-less surgeon is overruled.';
  if(!String(context.instructions||'').includes('LIVE CASE PLAN')){
   context.instructions=[context.instructions,planInstruction].filter(Boolean).join('\n\n');
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
