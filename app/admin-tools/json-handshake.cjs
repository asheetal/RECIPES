
'use strict';
const VERSION=1;
const KEYS=['contractVersion','tool','status','result','files','savedFiles',
 'delivery','stdout','stderr'];
function canonical(value){
 return JSON.parse(JSON.stringify(value));
}
function payload(content){
 if(typeof content!=='string')return {result:canonical(content??null),stdout:'',stderr:''};
 try{return {result:JSON.parse(content),stdout:'',stderr:''};}catch{}
 if(!content.startsWith('stdout:')){
  if(/^\s*[\[{]/.test(content))throw Error('Malformed JSON tool response');
  return {result:null,stdout:content,stderr:''};
 }
 let stdout=content.slice(7).replace(/^\s*\n/,'');
 let stderr='';
 const at=stdout.indexOf('\nstderr:');
 if(at>=0){stderr=stdout.slice(at+8);stdout=stdout.slice(0,at);}
 stdout=stdout.split(/\nGenerated files:/)[0].trim();
 let result=null;
 if(/^[\[{]/.test(stdout)){
  try{result=JSON.parse(stdout);}
  catch{result=null;}
 }
 return {result,stdout,stderr};
}
function check(r){
 if(!r||Array.isArray(r)||typeof r!=='object')throw Error('Tool receipt must be an object');
 if(Object.keys(r).some(k=>!KEYS.includes(k))||KEYS.some(k=>!Object.hasOwn(r,k)))
  throw Error('Unexpected or missing tool receipt fields');
 if(r.contractVersion!==VERSION||typeof r.tool!=='string'||
    !['ok','error'].includes(r.status)||typeof r.stdout!=='string'||
    typeof r.stderr!=='string'||!Array.isArray(r.files)||!Array.isArray(r.savedFiles))
  throw Error('Invalid tool receipt types');
 if(!r.delivery||!['none','registered'].includes(r.delivery.status)||
    !Array.isArray(r.delivery.files))
  throw Error('Invalid delivery receipt');
 for(const f of [...r.files,...r.savedFiles,...r.delivery.files])
  if(!f||typeof f.name!=='string'||!f.name)throw Error('Invalid receipt filename');
 for(const f of r.savedFiles)
  if(!/^[a-f0-9]{64}$/.test(f.sha256)||f.verified!==true)
   throw Error('Invalid verified-save receipt');
 return r;
}
function receipt(content,artifact,tool,messageStatus){
 const p=payload(content);
 if(p.result?.contractVersion===VERSION&&p.result?.tool){
  const existing=check(p.result);
  return check({...existing,tool});
 }
 let value=p.result;
 const failed=messageStatus==='error'||Boolean(value?.error)||
  ['error','invalid_arguments','failed'].includes(value?.status)||
  value?.code==='SEARCH_FAILED'||/Traceback \(most recent call last\):/.test(p.stdout+p.stderr);
 const savedFiles=[];
 if(value?.output&&value?.verified==='Exact replacements; same filename; saved bytes verified'){
  if(typeof value.output!=='string'||!/^[a-f0-9]{64}$/.test(value.sha256||''))
   throw Error('Invalid save verification evidence');
  savedFiles.push({
   name:value.output.split('/').pop(),path:value.output,
   sha256:value.sha256,verified:true
  });
 }
 const inventoryOnly=value?.inventory_only===true;
 const delivered=savedFiles.length>0;
 const registered=(inventoryOnly||!delivered)?[]:(artifact?.files||[]).map(f=>({
  name:f.name||f.filename
 }));
 if(inventoryOnly&&value&&Array.isArray(value.files)){
  value={...value,files:[],inventory_count:value.files.length,
    inventory_note:'File list is in the ## Project files manifest of the system prompt'};
 }
 const seen=new Set();
 const rows=[
  ...(Array.isArray(value?.files)?value.files:[]),
  ...(Array.isArray(value?.verified_files)?value.verified_files:[])
 ].filter(f=>f&&typeof f.name==='string'&&!seen.has(f.name)&&seen.add(f.name)).map(f=>({
  name:f.name,...(f.id?{id:f.id}:{}),
  ...(f.sha256?{sha256:f.sha256}:{}),
  ...(Number.isSafeInteger(f.bytes)?{bytes:f.bytes}:{})
 }));
 for(const f of savedFiles){
  const existing=rows.find(x=>x.name===f.name);
  if(existing)existing.sha256=f.sha256;
  else rows.push({name:f.name,sha256:f.sha256});
 }
 const resultHasFiles=Array.isArray(value?.files)&&value.files.length>0;
 return check({
  contractVersion:VERSION,tool,status:failed?'error':'ok',
  result:value,files:resultHasFiles?[]:rows,savedFiles,
  delivery:{status:registered.length?'registered':'none',files:registered},
  stdout:p.stdout,stderr:p.stderr
 });
}
const wrapped=new WeakSet();
function wrapTools(tools){
 for(const tool of tools||[]){
  if(!tool||typeof tool.invoke!=='function'||wrapped.has(tool))continue;
  wrapped.add(tool);
  const invoke=tool.invoke;
  tool.invoke=async function(...args){
   const result=await invoke.apply(this,args);
   if(result&&typeof result==='object'&&Object.hasOwn(result,'content')){
    const r=receipt(result.content,result.artifact,tool.name||'tool',result.status);
    result.content=JSON.stringify(r);
    if(r.status==='error')result.status='error';
    return result;
   }
   return JSON.stringify(receipt(result,null,tool.name||'tool'));
  };
 }
 return tools;
}
function handoff(value){
 const r=canonical({...value,contractVersion:VERSION,
  error:value.error??null,progress:value.progress??null});
 const keys=['contractVersion','status','error','errors','draft','tools','files','progress'];
 if(Object.keys(r).some(k=>!keys.includes(k))||keys.some(k=>!Object.hasOwn(r,k)))
  throw Error('Invalid Surgeon handoff fields');
 if(!['returned','needs_resolution','paused'].includes(r.status)||
    typeof r.draft!=='string'||!Array.isArray(r.errors)||
    !Array.isArray(r.tools)||!Array.isArray(r.files))
  throw Error('Invalid Surgeon handoff types');
 for(const row of [...r.tools,...r.files])
  if(!row||typeof row!=='object'||Array.isArray(row))
   throw Error('Invalid Surgeon handoff record');
 for(const item of [r.error,r.progress])
  if(item!==null&&(typeof item!=='object'||Array.isArray(item)))
   throw Error('Invalid Surgeon handoff state');
 return r;
}
module.exports={receipt,check,wrapTools,handoff};
