'use strict';
const crypto=require('crypto');
function state(req){return req.__researchDiagnostics??={id:crypto.randomUUID(),reads:new Map(),failures:new Map(),failedResults:new Map(),saved:new Set(),calls:0,sinceSave:0};}
function log(req,event,extra={}){console.log('[ResearchWorkflow] '+JSON.stringify({event,requestId:state(req).id,conversationId:req.body?.conversationId,...extra}));}
function text(r){return typeof r?.content==='string'?r.content:JSON.stringify(r?.content??'');}
function failure(r){
 if(r?.status==='error'||r?.artifact?.artifact_delivery?.status==='failed')return 'tool_error';
 const code=r?.artifact?.run?.code??r?.run?.code;
 if(typeof code==='number'&&code!==0)return 'nonzero_exit';
 const s=text(r);
 if(/Traceback \(most recent call last\):/.test(s))return 'python_exception';
 if(/(?:^|\n)(?:[^\n]*: )?(?:command not found|Permission denied|No such file or directory)\s*$/m.test(s))return 'command_failure';
 if(/^\s*\{"error"\s*:/m.test(s))return 'reported_error';
 return null;
}
function annotate(r,msg){if(r&&typeof r.content==='string')r.content+='\nWORKFLOW: '+msg;return r;}
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
function saved(req,result){
 const line=text(result).split('\n').find(x=>x.trim().startsWith('{"output"'));
 if(!line)return;
 let x;try{x=JSON.parse(line);}catch{return;}
 const name=require('path').basename(x.output||'');if(!name)return;
 const delivered=(result.artifact?.files||[]).some(f=>(f.name||f.filename)===name&&(f.id||f.file_id));
 log(req,'file_delivery',{status:delivered?'persisted':'unconfirmed',sha256:x.sha256});
 if(delivered){state(req).saved.add(name);state(req).sinceSave=0;}
 else{result.status='error';annotate(result,'The edit was saved, but final-file persistence is unconfirmed. Do not claim delivery. Recover the saved file without rewriting it.');}
}
function observe(bash,req){
 const invoke=bash.invoke.bind(bash);
 bash.invoke=async(...args)=>{
 const st=state(req),n=++st.calls,start=Date.now();
 const command=args[0]?.args?.command??args[0]?.command??'';
 const key=crypto.createHash('sha256').update(command).digest('hex');
 if((st.failures.get(key)||0)>=2){log(req,'repeated_failure_blocked',{call:n});const previous=st.failedResults.get(key);return Object.assign(Object.create(Object.getPrototypeOf(previous)),previous,{content:'WORKFLOW ERROR: This identical command has failed twice. Correct the command or use successful research_files results; do not repeat the same failure.',status:'error'});}
 log(req,'tool_start',{tool:'bash_tool',call:n});
 try{const r=await invoke(...args),err=failure(r);st.sinceSave++;
 if(err){st.failures.set(key,(st.failures.get(key)||0)+1);st.failedResults.set(key,r);r.status='error';annotate(r,'Command failed ('+err+'). Successful transport is not successful execution. Use the error above to correct the next action.');}
 else {st.failures.clear();st.failedResults.clear();saved(req,r);}
 log(req,'tool_end',{tool:'bash_tool',call:n,elapsedMs:Date.now()-start,status:err?'error':'success',errorType:err});
 if(st.sinceSave>=6&&st.sinceSave%3===0)annotate(r,'No confirmed manuscript save in the last '+st.sinceSave+' tool calls. Reuse successful reads. For an editing request, apply the edit and deliver it; for research-only work continue necessary research. State any specific blocker instead of repeating inspection.');
 return r;
 }catch(e){log(req,'tool_error',{call:n,elapsedMs:Date.now()-start,errorType:e?.name});throw e;}
 };
}
function timedConfig(config,req){
 const starts=new Map();
 const cb={name:'research-workflow-timing',
 handleChatModelStart(_llm,_messages,id){starts.set(String(id),Date.now());log(req,'model_start',{runId:String(id)});},
 handleLLMStart(_llm,_prompts,id){if(!starts.has(String(id))){starts.set(String(id),Date.now());log(req,'model_start',{runId:String(id)});}},
 handleLLMEnd(_output,id){const t=starts.get(String(id));log(req,'model_end',{runId:String(id),elapsedMs:t==null?null:Date.now()-t});starts.delete(String(id));},
 handleLLMError(err,id){const t=starts.get(String(id));log(req,'model_error',{runId:String(id),elapsedMs:t==null?null:Date.now()-t,errorType:err?.name});starts.delete(String(id));}};
 let callbacks=config.callbacks;
 if(Array.isArray(callbacks)||callbacks==null)callbacks=[...(callbacks||[]),cb];
 else if(typeof callbacks.copy==='function'){callbacks=callbacks.copy();callbacks.addHandler(cb,true);}
 else {log(req,'timing_unavailable',{reason:'unsupported_callback_manager'});return config;}
 return {...config,callbacks};
}
module.exports={state,log,failure,reads,saved,observe,timedConfig};
