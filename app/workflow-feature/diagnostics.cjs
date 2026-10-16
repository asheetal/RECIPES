'use strict';
const crypto=require('crypto');
function state(req){return req.__researchDiagnostics??={id:crypto.randomUUID(),reads:new Map(),failures:new Map(),failedResults:new Map(),saved:new Set(),calls:0,sinceSave:0};}
function log(req,event,extra={}){require('/app/crash-admin/runtime.cjs').trace(req,event,extra);console.log('[ResearchWorkflow] '+JSON.stringify({event,requestId:state(req).id,conversationId:req.body?.conversationId,...extra}));}
function text(r){return typeof r?.content==='string'?r.content:JSON.stringify(r?.content??'');}
function failure(r){const receipt=require('/app/admin-tools/json-handshake.cjs').receipt(r?.content,r?.artifact,r?.name||'bash_tool',r?.status);if(receipt.status==='error')return 'tool_error';
 if(r?.status==='error'||r?.artifact?.artifact_delivery?.status==='failed')return 'tool_error';
 const code=r?.artifact?.run?.code??r?.run?.code;
 if(typeof code==='number'&&code!==0)return 'nonzero_exit';
 const s=text(r);
 if(/Traceback \(most recent call last\):/.test(s))return 'python_exception';
 if(/(?:^|\n)(?:[^\n]*: )?(?:command not found|Permission denied|No such file or directory)\s*$/m.test(s))return 'command_failure';
 if(/^\s*\{"error"\s*:/m.test(s))return 'reported_error';
 return null;
}
function reads(req,data,reason){
 const st=state(req),repeated=[];
 for(const f of data.files||[]){if(!f.sha256||typeof f.text!=='string')continue;
  const old=st.reads.get(f.name);const n=old?.hash===f.sha256?old.n+1:1;
  st.reads.set(f.name,{hash:f.sha256,n});if(n>=3&&!reason)repeated.push(f.name);
 }
 if(repeated.length){log(req,'repeated_read',{count:repeated.length});data.workflow_notice='These unchanged files have already been returned in full repeatedly: '+repeated.join(', ')+'. Use the earlier content and perform the requested work. If context was lost or a targeted reread is necessary, repeat with reread_reason explaining why.';
  data.files=data.files.map(f=>repeated.includes(f.name)?{name:f.name,sha256:f.sha256,already_read:true,text_omitted:true}:f);
 }
 return data;
}
function observe(bash,req){
 const invoke=bash.invoke.bind(bash);
 bash.invoke=async(...args)=>{
 const st=state(req),n=++st.calls,start=Date.now();
 const command=args[0]?.args?.command??args[0]?.command??'';

 // Tool-result citations are not executable data or shell substitutions.
 if(/\{\{\s*tool\d+turn\d+\s*\}\}/.test(command)){
  log(req,'invalid_tool_reference',{tool:'bash_tool',call:n});
  const content=JSON.stringify({status:'invalid_arguments',code:'unresolved_tool_reference',executed:false,
   instruction:'This command contains a literal tool-result placeholder, which cannot be parsed as JSON. Read the actual current file with pathlib.Path("/mnt/data/<exact filename>").read_text(), or call research_files read_all with explicit names. Do not insert tool-result citations into executable code. No command ran and no files changed.'});
  const id=args[0]?.id??args[0]?.tool_call_id;
  if(id)return new (require('@langchain/core/messages').ToolMessage)({content,tool_call_id:id,name:'bash_tool',status:'error'});
  return content;
 }
 const key=crypto.createHash('sha256').update(command).digest('hex');
 if((st.failures.get(key)||0)>=2){log(req,'repeated_failure_blocked',{call:n});const previous=st.failedResults.get(key);return Object.assign(Object.create(Object.getPrototypeOf(previous)),previous,{content:'WORKFLOW ERROR: This identical command has failed twice. Correct the command or use successful research_files results; do not repeat the same failure.',status:'error'});}
 log(req,'tool_start',{tool:'bash_tool',call:n,commandHash:key});
 try{const r=await invoke(...args),err=failure(r);st.sinceSave++;
 if(err){require('/app/crash-admin/runtime.cjs').report(req,'tool_failure',new Error(err),{tool:'bash_tool',call:n,command,output:text(r)},st.id+':tool:'+n);st.failures.set(key,(st.failures.get(key)||0)+1);st.failedResults.set(key,r);r.status='error';annotate(r,'Command failed ('+err+'). Successful transport is not successful execution. Use the error above to correct the next action.');}
 else {st.failures.delete(key);st.failedResults.delete(key);saved(req,r);}
 log(req,'tool_end',{tool:'bash_tool',call:n,elapsedMs:Date.now()-start,status:r.status==='error'?'error':'success',errorType:err});
 if(st.sinceSave>=6&&st.sinceSave%3===0)annotate(r,'No confirmed manuscript save in the last '+st.sinceSave+' tool calls. Reuse successful reads. For an editing request, apply the edit and deliver it; for research-only work continue necessary research. State any specific blocker instead of repeating inspection.');
 return r;
 }catch(e){require('/app/crash-admin/runtime.cjs').report(req,'tool_failure',e,{tool:'bash_tool',call:n,command},st.id+':tool:'+n);log(req,'tool_error',{call:n,elapsedMs:Date.now()-start,errorType:e?.name});throw e;}
 };
}
function stKey(req,id){return state(req).id+':model:'+id;}
const userStops=new WeakSet();
function markUserStop(signal){if(signal && !signal.aborted)userStops.add(signal);}
function isUserStop(signal){return Boolean(signal?.aborted && userStops.has(signal));}
function abortDetails(err,signal){
 const chain=[];const seen=new Set();let e=err;
 while(e && typeof e==='object' && !seen.has(e) && chain.length<5){seen.add(e);chain.push({name:e.name,code:e.code,message:String(e.message||'').slice(0,500)});e=e.cause;}
 const abort=chain.some(e=>e.name==='AbortError'||e.code==='ABORT_ERR'||/AbortError|\bwas aborted\b/i.test(e.message));
 const timeout=chain.some(e=>/timeout/i.test(e.name||'')||/timeout/i.test(e.code||''))||signal?.reason?.name==='TimeoutError';
 return {kind:isUserStop(signal)?'user_cancelled':timeout?'request_timeout':signal?.aborted?'local_request_aborted':abort?'stream_aborted_unknown':'provider_failure',signalAborted:Boolean(signal?.aborted),signalReasonName:signal?.reason?.name||null,signalReasonCode:signal?.reason?.code||null,errorChain:chain};
}
function timedConfig(config,req,requestSignal){
 const signal=requestSignal??config.signal;
 const starts=new Map();
 const cb={name:'research-workflow-timing',
 handleChatModelStart(_llm,_messages,id){starts.set(String(id),Date.now());log(req,'model_start',{runId:String(id)});},
 handleLLMStart(_llm,_prompts,id){if(!starts.has(String(id))){starts.set(String(id),Date.now());log(req,'model_start',{runId:String(id)});}},
 handleLLMEnd(_output,id){const t=starts.get(String(id));log(req,'model_end',{runId:String(id),elapsedMs:t==null?null:Date.now()-t});starts.delete(String(id));},
 handleLLMError(err,id){const t=starts.get(String(id));const detail={runId:String(id),elapsedMs:t==null?null:Date.now()-t,...abortDetails(err,signal)};log(req,detail.kind==='user_cancelled'?'model_cancelled':'model_error',detail);if(detail.kind!=='user_cancelled')require('/app/crash-admin/runtime.cjs').report(req,detail.kind,err,detail,stKey(req,id));starts.delete(String(id));}};
 let callbacks=config.callbacks;
 if(Array.isArray(callbacks)||callbacks==null)callbacks=[...(callbacks||[]),cb];
 else if(typeof callbacks.copy==='function'){callbacks=callbacks.copy();callbacks.addHandler(cb,true);}
 else {log(req,'timing_unavailable',{reason:'unsupported_callback_manager'});return config;}
 return {...config,callbacks};
}
module.exports={state,log,failure,reads,saved,observe,timedConfig,markUserStop,isUserStop,abortDetails};
function annotate(r,msg){
 if(!r||typeof r!=='object')return r;
 const h=require('/app/admin-tools/json-handshake.cjs');
 const receipt=h.receipt(r.content,r.artifact,r.name||'bash_tool',r.status);
 const value=receipt.result;
 receipt.result=value&&typeof value==='object'&&!Array.isArray(value)?{...value}:{value};
 receipt.result.workflow_notices=[...(Array.isArray(value?.workflow_notices)?value.workflow_notices:[]),msg];
 h.check(receipt);r.content=JSON.stringify(receipt);return r;
}
function saved(req,result){
 const h=require('/app/admin-tools/json-handshake.cjs');
 const receipt=h.receipt(result.content,result.artifact,result.name||'bash_tool',result.status);
 result.content=JSON.stringify(receipt);
 if(receipt.status==='error'){result.status='error';return;}
 const registered=receipt.delivery.files;
 const missing=[];
 for(const file of receipt.savedFiles){
  const persisted=registered.some(f=>f.name===file.name&&f.id&&f.storageSessionId);
  if(!persisted){missing.push(file.name);continue;}
  log(req,'file_delivery',{status:'persisted',filename:file.name,sha256:file.sha256});
  state(req).saved.add(file.name);state(req).sinceSave=0;
 }
 if(missing.length){
  receipt.status='error';
  receipt.savedFiles=receipt.savedFiles.filter(f=>!missing.includes(f.name));
  receipt.result={...(receipt.result&&typeof receipt.result==='object'?receipt.result:{value:receipt.result}),error:{code:'SAVE_DELIVERY_UNCONFIRMED',files:missing}};
  h.check(receipt);result.status='error';result.content=JSON.stringify(receipt);
 }
}
