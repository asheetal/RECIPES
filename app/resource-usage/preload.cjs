'use strict';
// Metadata only: never store URLs with paths, headers, keys, bodies or user IDs.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),dc=require('diagnostics_channel');
const state=globalThis[Symbol.for('tryfind.resources')]??={error:null};
const root=process.env.RESOURCE_USAGE_DIR||'/app/resource-usage-data';
const session=process.env.RESOURCE_USAGE_SESSION||(process.env.RESOURCE_USAGE_SESSION=crypto.randomUUID());
const tracked=new WeakMap();
function originOf(value){try{const u=new URL(String(value));if(!['http:','https:'].includes(u.protocol))return null;return u.origin;}catch{return null;}}
function write(event){try{fs.mkdirSync(root,{recursive:true});const t=Date.now();fs.appendFileSync(path.join(root,'calls-'+new Date(t).toISOString().slice(0,10)+'.jsonl'),JSON.stringify({t,session,...event})+'\n',{mode:0o600});}catch(e){state.error=e.code||'recording_failed';}}
function start(request,origin,pathname=''){
 origin=originOf(origin);if(!origin)return;
 // Self requests and telemetry are not API usage.
 const u=new URL(origin);if(['localhost','127.0.0.1','::1','[::1]'].includes(u.hostname)&&(!u.port||u.port==='3080'))return;
 const id=crypto.randomUUID();tracked.set(request,{id,origin});
 const api=/^api[.-]|[.-]api[.-]|gateway/i.test(u.hostname)||/\/(?:api|v\d+|graphql|works|chat|embeddings|search|generate|rerank|models)(?:\/|$)/i.test(String(pathname).split('?')[0]);
 write({kind:'start',id,origin,api});
}
function finish(request,status,error){const r=tracked.get(request);if(!r)return;write({kind:'result',...r,status:Number(status)||null,error:error?String(error.code||'network_error').slice(0,80):null});}
if(!state.installed){
 state.installed=true;
 // MCP's minimal child environment can omit NODE_OPTIONS. Preserve its
 // deliberate environment isolation while forwarding only telemetry settings.
 const cp=require('child_process'),originalSpawn=cp.spawn;
 cp.spawn=function(command,args,options){
  if(/^(?:node|nodejs|npx|npm)(?:\.exe)?$/.test(path.basename(String(command)))){
   if(!Array.isArray(args)){options=args;args=[];}
   const env={...(options?.env??process.env)};
   const preload='--require='+__filename;
   if(!(env.NODE_OPTIONS||'').includes(__filename))env.NODE_OPTIONS=((env.NODE_OPTIONS||'')+' '+preload).trim();
   env.RESOURCE_USAGE_SESSION=session;env.RESOURCE_USAGE_DIR=root;
   options={...options,env};
  }
  return originalSpawn.call(this,command,args,options);
 };
 require('module').syncBuiltinESMExports();
 dc.channel('undici:request:create').subscribe(({request})=>{try{start(request,request.origin,request.path);}catch{}});
 dc.channel('undici:request:headers').subscribe(({request,response})=>{try{finish(request,response.statusCode);}catch{}});
 dc.channel('undici:request:error').subscribe(({request,error})=>{try{finish(request,null,error);}catch{}});
 dc.channel('http.client.request.start').subscribe(({request})=>{try{
  start(request,(request.protocol||request.agent?.protocol||'http:')+'//'+request.getHeader('host'),request.path);
  request.once('response',r=>finish(request,r.statusCode));request.once('error',e=>finish(request,null,e));
 }catch{}});
}
module.exports={session,state,root,originOf};
