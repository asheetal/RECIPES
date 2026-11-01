'use strict';
const {createRequire}=require('node:module');
const app=createRequire('/app/package.json');
const {createHash,randomUUID}=require('node:crypto');
const {setTimeout:pause}=require('node:timers/promises');
const {persistentView}=require('./persistent-view.cjs');
const {PromptManager,initialState}=require('./prompt/prompt-manager.cjs');
const {ChatStateRepository,CheckpointRepository}=require('./storage/mongo-repositories.cjs');
const {ModelClient}=require('./llm/model-client.cjs');
const {CompressionFlow}=require('./flow/compression-flow.cjs');
const {Tokenizer}=app('@librechat/api');
let tokenEncoding;
const encodingReady=()=>tokenEncoding??=Tokenizer.initEncoding('o200k_base');
function countTokens(text=''){
 return Tokenizer.getTokenCount(text,'o200k_base');
}
const database=()=>app('mongoose').connection.db;
const messages=()=>database().collection('messages');
const owner=randomUUID();
const workers=new Map();
let repository,manager,checkpoints;
const key=s=>JSON.stringify([s.tenantId||null,s.userId,s.conversationId]);
const identity=m=>m.messageId??m.id;
function digest(m){return createHash('sha256').update(JSON.stringify([m.messageId,m.parentMessageId,m.text,m.content,m.files,m.quotes])).digest('hex');}
function scope(req,user,chat){
 if(!req?.user||String(req.user.id||req.user._id)!==String(user))throw Error('Compression ownership missing');
 return {userId:String(user),conversationId:String(chat),tenantId:req.user.tenantId?String(req.user.tenantId):null};
}
function initialize(){
 if(manager)return;
 const authorize=async s=>{if(!s.userId||!s.conversationId)throw Error('Compression scope missing');};
 repository=new ChatStateRepository({collection:database().collection('chatcompressionstates'),authorize,
  createState:async()=>{const p=require('./policy.cjs').read();return initialState({threshold:p.triggerValue,ratio:p.targetRatio});}});
 checkpoints=new CheckpointRepository({collection:database().collection('chatcompressioncheckpoints'),authorize});
 manager=new PromptManager(repository);
}
async function branch(s,head){
 if(!head||head===app('librechat-data-provider').Constants.NO_PARENT)return [];
 const rows=await messages().find({user:s.userId,conversationId:s.conversationId}).toArray();
 const byId=new Map(rows.map(m=>[identity(m),m])), seen=new Set(), ordered=[];
 let current=byId.get(head);
 if(!current)throw Error('Saved conversation head is missing');
 while(current){
  const id=identity(current);if(seen.has(id))throw Error('Conversation contains a parent cycle');
  seen.add(id);ordered.unshift(current);current=byId.get(current.parentMessageId);
 }
 return ordered;
}
function validSources(sources,rows){
 const index=new Map(rows.map(m=>[identity(m),m]));
 return Array.isArray(sources)&&sources.length>0&&sources.every(x=>index.has(x.id)&&digest(index.get(x.id))===x.hash);
}
function project(rows,context){
 const candidates=[context,...rows.slice().reverse().map(m=>m.metadata?.labPromptCompression)];
 for(const candidate of candidates){
  if(candidate?.retentionVersion!==1||!candidate.summary||!validSources(candidate.sources,rows))continue;
  const last=rows.findIndex(m=>identity(m)===candidate.sources.at(-1).id);
  const first=(candidate.keptIds||[])[0];
  const start=first?rows.findIndex(m=>identity(m)===first):last+1;
  if(last>=0&&start>last)return {rows:rows.slice(start),summary:candidate.summary,boundary:candidate.headMessageId};
 }
 for(let i=rows.length-1;i>=0;i--){
  const r=rows[i].metadata?.labAfterCompression;
  if(r?.retentionVersion!==1||r.version!==1||!r.text||!validSources(r.sources,rows))continue;
  const start=rows.findIndex(m=>identity(m)===r.keepFromId);
  if(start>=0)return {rows:rows.slice(start),summary:r.text,boundary:identity(rows[i])};
 }
 return {rows,summary:'',boundary:null};
}
function unitsFor(projection){
 const units=[];
 if(projection.summary)units.push({id:'@summary:'+projection.boundary,text:projection.summary,retainable:false});
 for(const original of projection.rows){
  const m=persistentView(original);
  if(m.isCreatedByUser||!units.length||units.at(-1).retainable===false)units.push({id:identity(m),text:''});
  const content=Array.isArray(m.content)&&m.content.length?m.content:m.text||'';
  units.at(-1).text+=JSON.stringify({role:m.isCreatedByUser?'user':'assistant',content,files:m.files||[],quotes:m.quotes||[]})+'\n';
 }
 return units;
}
const measure=units=>countTokens(units.map(u=>u.text).join('\n\n'));
async function beforeJob(user,chat,req){
  if(req?.body?.recipeWorkflow)return;  // recipe runs have no inter-triage snowball — compression cannot fire
 await require('/app/workflow-feature/search-mode/prompt.cjs').snapshot(req);
 if(req?.body?.isTemporary)return;
 await encodingReady();initialize();const s=scope(req,user,chat);
 let state=await repository.read(s);
 if(state.deleted)throw Error('Chat was deleted');
 if(req.body?.isEdited&&['compressing','recovery_failed'].includes(state.phase))throw Error('Editing is disabled during compression');
 // Requests held by a previous Node process cannot still be executing.
 if((state.active&&state.active.owner!==owner)||state.queue.some(p=>p.owner!==owner)){
  await repository.change(s,x=>{
   x.queue=x.queue.filter(p=>p.owner===owner);
   if(x.active&&x.active.owner!==owner){x.active=null;if(['running','cancelling'].includes(x.phase))x.phase='idle';}
  });state=await repository.read(s);
 }
 if(state.phase==='idle'&&!state.active&&!state.queue.length){
  const rows=await branch(s,req.body?.parentMessageId);
  const tokens=measure(unitsFor(project(rows,state.context)));
  const p=require('./policy.cjs').read();
  await repository.change(s,x=>{if(x.phase==='idle'&&!x.active&&!x.queue.length){x.tokens=tokens;x.policy={threshold:p.triggerValue,ratio:p.targetRatio};}});
 }
 const ticket={id:randomUUID(),owner};req._compressionTicket={scope:s,id:ticket.id};
 await manager.enqueue(s,ticket);
 // Do not replace the preceding generation's stream while its final response is being saved.
 while((state=await repository.read(s)).active){
  if(req.aborted){await manager.cancel(s,ticket.id);throw Error('Request aborted');}
  await pause(100);
 }
 if(state.phase==='idle')await manager.takeNext(s);
 kick(s);
}
async function wait(user,chat,signal,req){
 if(!req?._compressionTicket)return;
 if(req?.body?.isTemporary)return;
 initialize();const ticket=req?._compressionTicket;
 if(!ticket)throw Error('Prompt queue ticket missing');
 try{
  for(;;){
   signal?.throwIfAborted();
   const state=await repository.read(ticket.scope);
   if(state.deleted)throw Error('Chat was deleted');
   if(state.active?.id===ticket.id)return;
   if(!state.queue.some(p=>p.id===ticket.id))throw Error('Queued prompt was cancelled');
   if(state.phase==='idle')await manager.takeNext(ticket.scope);
   else kick(ticket.scope);
   await pause(250,undefined,{signal});
  }
 }catch(error){
  await manager.cancel(ticket.scope,ticket.id);
  if(signal?.aborted){const aborted=new Error('Request aborted');aborted.name='AbortError';throw aborted;}
  throw error;
 }
}
async function finishPrompt(req){
 if(!req?._compressionTicket)return;
 const ticket=req?._compressionTicket;if(!ticket||req._compressionDelivered)return;
 initialize();await manager.cancel(ticket.scope,ticket.id);
 await manager.finishCancellation(ticket.scope,ticket.id);
}
function installCapture(_client,run){
 // SDK execution preserves the active prompt; only the prompt manager starts compression.
 for(const context of run.Graph.agentContexts.values()){
  context._labAfterResponseMode=true;
  context.summarizationEnabled=false;
 }
}
function prepare(_client,req,response){
 const ticket=req._compressionTicket;
 if(!ticket||req._compressionDelivered||req.aborted||req.body?.isTemporary||response.unfinished||response.error||response.content?.some(p=>p.type==='error'))return null;
 let delivered;
 return {
  delivered(){
   return delivered??=(async()=>{
     try {
    await encodingReady();
    const rows=await branch(ticket.scope,response.messageId);
    if(rows.at(-1)?.unfinished)throw Error('Response is unfinished');
    const state=await repository.read(ticket.scope);
    const total=measure(unitsFor(project(rows,state.context)));
    await manager.complete(ticket.scope,{promptId:ticket.id,
     deltaTokens:Math.max(0,total-state.active.baseTokens),
     snapshot:{headMessageId:response.messageId,sources:rows.map(m=>({id:identity(m),hash:digest(m)}))}});
     } catch (__e) {
       console.error('[ChatCompression] delivered() failed (triage unaffected): ' + (__e && __e.message ? __e.message : __e));
     } finally {
       req._compressionDelivered=true;
     }
   })();
  },
  async start(){if(delivered)await delivered;kick(ticket.scope);},
  cancel(){/* Request cleanup does not own compression cancellation. */},
 };
}
function kick(s){
 const k=key(s);if(workers.has(k))return;
 const controller=new AbortController();workers.set(k,controller);
 controller.done=(async()=>{
  await encodingReady();
  let state=await repository.read(s);
  if(state.deleted||!['compressing','recovery_failed'].includes(state.phase))return;
  if(state.job?.retryAt>Date.now())return;
  if(state.phase==='recovery_failed'){await manager.resumeCompression(s);state=await repository.read(s);}
  const job=state.job;if(!job)return;
  try{
   const rows=await branch(s,job.snapshot.headMessageId);
   if(!validSources(job.snapshot.sources,rows))throw Error('Compression source changed');
   const connection=await require('/app/admin-tools/role-gateway.cjs').connection('LLM_ERP', s);
   const model=new ModelClient({resolveConnection:async()=>connection,fetchImpl:require('/app/admin-tools/role-gateway.cjs').tracedFetch('LLM_ERP', s)});
   const flow=new CompressionFlow({model,checkpoints,countTokens});
   const result=await flow.run({scope:s,job,units:unitsFor(project(rows,state.context)),signal:controller.signal});
   const fresh=await branch(s,job.snapshot.headMessageId);
   if(!validSources(job.snapshot.sources,fresh))throw Error('Compression source changed');
   controller.signal.throwIfAborted();
   const first=result.context.keptIds[0];
   const boundary=first?rows.findIndex(m=>identity(m)===first):rows.length;
   if(boundary<1)throw Error('Compressed history boundary is missing');
   result.context.retentionVersion=1;
   result.context.sources=job.snapshot.sources.slice(0,boundary);
   const head=rows.at(-1),usage=head.metadata?.contextUsage;
   const fields={'metadata.labPromptCompression':result.context,
    'metadata.summaryUsedTokens':Math.max(1,result.tokens-(head.tokenCount||0))};
   if(usage?.breakdown){
    const fixed=usage.effectiveInstructionTokens??usage.breakdown.instructionTokens??0;
    const budget=usage.contextBudget??usage.breakdown.maxContextTokens;
    if(Number.isFinite(budget))fields['metadata.contextUsage']={...usage,
     remainingContextTokens:budget-result.tokens-fixed,completedOutputTokens:0,
     prePruneContextTokens:result.tokens,breakdown:{...usage.breakdown,messageTokens:result.tokens}};
   }
   const stored=await messages().updateOne({user:s.userId,conversationId:s.conversationId,
    messageId:job.snapshot.headMessageId,content:head.content},{$set:fields});
   if(stored.matchedCount!==1)throw Error('Saved response changed during compression');
   controller.signal.throwIfAborted();
   if(await manager.commitCompression(s,job.id,result)){
    console.info('[ChatCompression] Committed',JSON.stringify({conversationId:s.conversationId,before:job.beforeTokens,after:result.tokens}));
    try{await checkpoints.removeJob(s,job.id);}catch(error){console.warn('[ChatCompression] Checkpoint cleanup pending',error.message);}
   }
  }catch(error){
   if(controller.signal.aborted)return;
   await manager.failCompression(s,job.id,error.code||error.message);
   await repository.change(s,x=>{if(x.job?.id===job.id)x.job.retryAt=Date.now()+60000;});
   console.error('[ChatCompression] Compression failed; saved history retained',
    {conversationId:s.conversationId,jobId:job.id,code:error.code||error.name,status:error.status,stack:error.stack});
   const timer=setTimeout(()=>kick(s),60000);timer.unref?.();
  }
 })().catch(error=>console.error('[ChatCompression] Background error',error))
 .finally(()=>{if(workers.get(k)===controller)workers.delete(k);});
}
async function restore(client,payload,map){
 await encodingReady();initialize();const req=client.options.req,chat=client.conversationId;
 if(req.body?.isTemporary||!chat||!payload.length)return {payload,map};
 const s=scope(req,req.user.id||req.user._id,chat),state=await repository.read(s);
 const payloadIds=payload.map(identity).filter(Boolean);
 const stored=await messages().find({user:s.userId,conversationId:chat,messageId:{$in:payloadIds}}).project({messageId:1}).toArray();
 const storedIds=new Set(stored.map(identity));
 const head=payloadIds.slice().reverse().find(id=>storedIds.has(id));
 if(!head)return {payload,map};
 const rows=await branch(s,head);
 const projection=project(rows,state.context);
 if(!projection.summary)return {payload,map};
 const ids=new Set(projection.rows.map(identity));
 const selected=[],next={};
 for(let i=0;i<payload.length;i++)if(ids.has(identity(payload[i]))||!storedIds.has(identity(payload[i]))){
  if(map?.[i]!=null)next[selected.length]=map[i];
  const m=payload[i];selected.push({...m,...(Array.isArray(m.content)?{content:m.content.filter(p=>p.type!=='summary')}:{})});
 }
 return {payload:selected,map:next,summary:{text:projection.summary,tokenCount:countTokens(projection.summary)}};
}
async function status(req,res){
 initialize();const s=scope(req,req.user.id||req.user._id,req.params.conversationId);
 const state=await repository.read(s);kick(s);
 const active=!state.deleted&&['compressing','recovery_failed'].includes(state.phase);
 res.set('Cache-Control','no-store').json({active,waiting:active&&state.queue.length>0,canEdit:!state.deleted&&!active,state:state.phase,tokens:state.tokens});
}
async function cancelChat(req,chat){
 initialize();const s=scope(req,req.user.id||req.user._id,chat);
 const state=await repository.read(s);
 await manager.deleteChat(s);const worker=workers.get(key(s));worker?.abort();await worker?.done;
 if(state.job)await checkpoints.removeJob(s,state.job.id);
 await app('@librechat/api').GenerationJobManager.abortJob(s.conversationId);
}
async function deleteConvos(req,filter,nativeDelete){
 const rows=await app('mongoose').models.Conversation.find({...filter,user:String(req.user.id||req.user._id)}).select('conversationId').lean();
 const result=await nativeDelete();
 for(const row of rows)await cancelChat(req,row.conversationId);
 return result;
}
async function deleteProject(req,projectId,nativeDelete){
 const rows=await app('mongoose').models.Conversation.find({user:String(req.user.id||req.user._id),chatProjectId:projectId}).select('conversationId').lean();
 const result=await nativeDelete();
 for(const row of rows)await cancelChat(req,row.conversationId);
 return result;
}
module.exports={beforeJob,wait,finishPrompt,installCapture,prepare,restore,status,cancelChat,deleteConvos,deleteProject,digest};
