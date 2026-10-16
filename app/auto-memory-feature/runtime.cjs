'use strict';
const crypto=require('crypto');
const core=require('./core.cjs');
const mongoose=require('mongoose');
const collection=()=>mongoose.connection.collection('lab_user_memory');
async function state(user){
  const id=core.identity(user);
  try{await collection().updateOne({_id:id},{$setOnInsert:core.fresh(id)},{upsert:true});}
  catch(e){if(e.code!==11000)throw e;}
  for(let n=0;n<12;n++){
    const current=await collection().findOne({_id:id});
    const next=core.maintain({...current,enabled:true});
    if(JSON.stringify(current)===JSON.stringify(next))return current;
    next.revision=current.revision+1;
    const result=await collection().replaceOne({_id:id,epoch:current.epoch,revision:current.revision},next);
    if(result.modifiedCount)return next;
  }
  throw Error('Memory busy; please retry');
}
async function change(user,fn){
  for(let n=0;n<12;n++){
    const s=await state(user),next=fn(s);
    if(!next)return s;
    next.revision=s.revision+1;
    const r=await collection().replaceOne({_id:s._id,epoch:s.epoch,revision:s.revision},next);
    if(r.modifiedCount)return next;
  }
  throw Error('Memory busy; please retry');
}
const policy=require('./policy.cjs');
const instructions=policy.instructions;
let active=0;
const queue=[],owners=new Set();
function schedule(owner,job){queue.push({owner,job});pump();}
function pump(){
 while(active<2){
  const i=queue.findIndex(x=>!owners.has(x.owner));if(i<0)return;
  const {owner,job}=queue.splice(i,1)[0];owners.add(owner);active++;
  Promise.resolve().then(job).catch(e=>console.warn('[MyPersona] Learning unavailable:',e.name))
    .finally(()=>{active--;owners.delete(owner);pump();});
 }
}
async function reserve(user,s,body,text){
 const owner=core.identity(user),c=mongoose.connection.collection('lab_persona_calls');
 for(const _id of policy.claims(owner,s.epoch,body,text)){
  try{await c.insertOne({_id,owner,epoch:s.epoch,createdAt:new Date()});}
  catch(e){if(e.code===11000)return false;throw e;}
 }
 return true;
}
async function learn(user,ticket,text){
  const existing=await state(user);
  if(!core.eligible(existing,ticket))return;
  const data=await require('/app/budget-llm/runtime.cjs').complete([
    {role:'system',content:instructions},
    {role:'user',content:JSON.stringify({new_user_message:text,existing_memory:existing.entries.filter(e=>e.manual||e.personaReviewed).map(({key,value,category})=>({key,value,category}))})}
  ],{json:true,max_tokens:4096});
  if(data.choices?.[0]?.finish_reason==='length'){console.warn('[MyPersona] Extraction exceeded output limit');return;}
  const content=data.choices?.[0]?.message?.content;
  if(typeof content!=='string')return;
  const parsed=JSON.parse(content.replace(/^\s*```(?:json)?\s*/,'').replace(/\s*```\s*$/,''));
  const facts=core.cleanFacts(policy.validFacts(parsed.facts),text);
  console.log('[MyPersona] Valid extracted facts:',facts.length);
  await change(user,s=>core.merge(s,ticket,facts));
}
async function useMemory(client){
  client.processMemory=undefined;
  const req=client.options.req,user=req.user;
  try{
    const s=await state(user);
    const body=req.body||{};
    // Deliberately never read history, summaries, attachments or assistant outputs.
    const text=typeof body.text==='string'?body.text.trim():'';
    if(s.enabled && !policy.skip(body) && text && require('/app/budget-llm/runtime.cjs').available()){
      const ticket={epoch:s.epoch,startedAt:req._labMemoryStartedAt||client._labMemoryStartedAt||Date.now(),
        digest:policy.digest(text)};
      if(core.eligible(s,ticket)&&await reserve(user,s,body,text))
        schedule(core.identity(user),()=>learn(user,ticket,text));
    }
    return body.isTemporary?'':core.context(s);
  }catch(e){console.warn('[MyPersona] Read unavailable:',e.name);return '';}
}
function router(){
 const express=require('express');
 const {requireJwtAuth}=require('~/server/middleware');
 const r=express.Router();r.use(requireJwtAuth);r.use(express.json({limit:'32kb'}));
 const handle=fn=>async(req,res)=>{try{await fn(req,res);}catch(e){res.status(500).json({error:'Memory operation failed; please retry.'});}};
 r.get('/',handle(async(req,res)=>{
  const s=await state(req.user);
  res.set('Cache-Control','no-store');
  res.json({memories:s.entries.filter(e=>e.manual||e.personaReviewed),totalTokens:s.entries.reduce((n,e)=>n+e.tokenCount,0),
    tokenLimit:8000,charLimit:600,usagePercentage:Math.round(s.entries.reduce((n,e)=>n+e.value.length,0)/core.MAX_CHARS*100),
    enabled:s.enabled,resetAt:s.resetAt});
 }));
 r.post('/reset',handle(async(req,res)=>{
  await change(req.user,core.resetState);
  await require('~/models').toggleUserMemories(req.user.id,true);
  // Remove legacy native memories too; the new reader never imports them.
  await require('~/models').deleteAllUserMemories(req.user.id);
  res.json({reset:true});
 }));
 r.patch('/preferences',handle(async(req,res)=>{
  if(typeof req.body?.memories!=='boolean')return res.status(400).json({error:'Boolean required'});
  req.body.memories=true;
  await change(req.user,s=>({...s,enabled:true,epoch:crypto.randomUUID()}));
  await require('~/models').toggleUserMemories(req.user.id,req.body.memories);
  res.json({updated:true,preferences:{memories:req.body.memories}});
 }));
 r.delete('/:key',handle(async(req,res)=>{
  await change(req.user,s=>({...s,epoch:crypto.randomUUID(),entries:s.entries.filter(e=>e.key!==req.params.key),
    candidates:s.candidates.filter(e=>e.key!==req.params.key),blocked:[...new Set([...s.blocked,req.params.key])]}));
  res.json({deleted:true});
 }));
 const write=handle(async(req,res)=>{
  const key=req.body?.key||req.params.key,value=req.body?.value;
  if(typeof key!=='string'||!/^[a-z][a-z0-9_]{0,79}$/.test(key)||typeof value!=='string'||!value.trim()||value.length>600)
    return res.status(400).json({error:'Use a short lowercase key and a value of 1–600 characters.'});
  let memory;
  await change(req.user,s=>{
   memory={key:core.cleanFacts([{key,value,kind:'explicit',category:'preference',evidence:value}],value)[0]?.key||key,value:value.trim(),tokenCount:Math.ceil(value.length/3),updated_at:new Date().toISOString(),lastObservedAt:Date.now(),manual:true,personaReviewed:true,protected:true,category:'preference',strength:100};
   const proposed=s.entries.filter(e=>e.key!==memory.key&&e.key!==req.params.key);proposed.push(memory);
   const entries=core.fit(proposed);
   if(!entries)throw Error('Protected memory capacity reached; edit or delete an existing memory first');
   return {...s,entries,epoch:crypto.randomUUID(),blocked:s.blocked.filter(k=>k!==key&&k!==memory.key)};
  });
  res.json({created:true,updated:true,memory});
 });
 r.post('/',write);r.patch('/:key',write);
 return r;
}
module.exports={useMemory,router,state,change};
