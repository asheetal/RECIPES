'use strict';
const fs=require('node:fs');
const app=require('node:module').createRequire('/app/package.json');
const ROLES=Object.freeze([
 'LLM_TRIAGE','LLM_SURGERY','LLM_OPD','LLM_BILLING','LLM_ERP','LLM_DIRECTOR'
]);
const PANEL_MAX=10;
const MAX_BATCH_RECORDS_DEFAULT=200;
const MAX_BATCH_RECORDS_LIMIT=10000;
const AQRP_CONCURRENCY_DEFAULT=4;
const AQRP_CONCURRENCY_LIMIT=8;
const collection=()=>app('mongoose').connection.db.collection('lab_llm_role_settings');
async function catalog(){return require('./model-access.cjs').catalog();}
async function read(){
 const saved=await collection().findOne({_id:'assignments'});
 return Object.fromEntries(ROLES.map(role=>[role,saved?.assignments?.[role]||null]));
}
async function readMaxBatchRecords(){
 const saved=await collection().findOne({_id:'assignments'});
 const v=Number(saved?.maxBatchRecords);
 return Number.isInteger(v)&&v>0&&v<=MAX_BATCH_RECORDS_LIMIT?v:MAX_BATCH_RECORDS_DEFAULT;
}
async function readAqrpBatchConcurrency(){
 const saved=await collection().findOne({_id:'assignments'});
 const v=Number(saved?.aqrpBatchConcurrency);
 return Number.isInteger(v)&&v>=1&&v<=AQRP_CONCURRENCY_LIMIT?v:AQRP_CONCURRENCY_DEFAULT;
}
async function readPanelMembers(){
 const saved=await collection().findOne({_id:'assignments'});
 return Array.isArray(saved?.panelMembers)?saved.panelMembers:[];
}
const WORKFLOW_DEFAULTS=Object.freeze({
 uninterruptedIterations:20,maxDirectorIterations:5
});
function normalizeWorkflow(value){
 const result={...WORKFLOW_DEFAULTS,...value};
 if(!Number.isInteger(result.uninterruptedIterations)||
    result.uninterruptedIterations<2||result.uninterruptedIterations>200)
  throw Error('Uninterrupted iterations must be an integer from 2 to 200');
 if(!Number.isInteger(result.maxDirectorIterations)||
    result.maxDirectorIterations<0||result.maxDirectorIterations>20)
  throw Error("Max Director's iterations must be an integer from 0 to 20");
 if(Object.keys(result).some(k=>!Object.hasOwn(WORKFLOW_DEFAULTS,k)))
  throw Error('Unknown workflow setting');
 return result;
}
async function readWorkflow(override){
 const saved=await collection().findOne({_id:'assignments'});
 return normalizeWorkflow({...saved?.workflow,...(override||{})});
}
async function resolve(role){
 if(!ROLES.includes(role))throw Error('Unknown LLM role');
 const assignment=(await read())[role];
 if(!assignment)throw Error(role+' is not assigned');
 return assignment;
}
async function get(req,res){
 try{
  res.set('Cache-Control','no-store').json({
   roles:ROLES,models:await catalog(),assignments:await read(),
   panelMembers:await readPanelMembers(),
   maxBatchRecords:await readMaxBatchRecords(),
   aqrpBatchConcurrency:await readAqrpBatchConcurrency(),
   workflow:await readWorkflow()
  });
 }catch(e){
  console.error('[LLMRoleSettings] Read failed',e);
  res.status(500).json({message:'Unable to load LLM assignments'});
 }
}
async function save(req,res){
 try{
  const input=req.body?.assignments;
  if(!input||typeof input!=='object'||Array.isArray(input))
   return res.status(400).json({message:'Assignments are required'});
  if(Object.keys(input).some(role=>!ROLES.includes(role)))
   return res.status(400).json({message:'Unknown LLM role'});
  const allowed=new Set((await catalog()).map(m=>JSON.stringify([m.endpoint,m.model])));
  let workflow;
   try{
    const value=req.body?.workflow;
    if(value!=null&&(typeof value!=='object'||Array.isArray(value)))
     throw Error('Workflow settings must be an object');
    workflow=normalizeWorkflow({...await readWorkflow(),...value});
   }catch(error){
    return res.status(400).json({message:error.message});
   }
  const existingDoc=await collection().findOne({_id:'assignments'});
  const rawPanel=req.body?.panelMembers;
  if(rawPanel!=null&&!Array.isArray(rawPanel))
   return res.status(400).json({message:'Panel members must be an array'});
  if(Array.isArray(rawPanel)&&rawPanel.length>PANEL_MAX)
   return res.status(400).json({message:'Assistant panel cannot exceed '+PANEL_MAX+' agents'});
  let panelMembers;
  let panelTest=null;
  if(Array.isArray(rawPanel)){
   panelMembers=[];
   for(let i=0;i<rawPanel.length;i++){
    const v=rawPanel[i];
    if(v==null||typeof v!=='object')
     return res.status(400).json({message:'Panel slot '+(i+1)+' is empty'});
    if(!allowed.has(JSON.stringify([v.endpoint,v.model])))
     return res.status(400).json({message:'Panel slot '+(i+1)+': choose an available model'});
    panelMembers.push({endpoint:v.endpoint,model:v.model});
   }
   if(panelMembers.length){
    let probe;
    try{ probe=await require('./panel-probe.cjs').probeMembers(panelMembers); }
    catch(e){ return res.status(500).json({message:'Panel eligibility check failed: '+(e.message||e)}); }
    panelTest={slots:probe};
    const failing=probe.filter(p=>!p.ok);
    if(failing.length){
     return res.status(400).json({
      message:'Assistant panel eligibility check failed for '+(failing.length===1?('slot '+failing[0].slot):(failing.length+' slots')),
      panelTest
     });
    }
   }
  }else{
   panelMembers=Array.isArray(existingDoc?.panelMembers)?existingDoc.panelMembers:[];
  }
  let maxBatchRecords;
  if(req.body?.maxBatchRecords!=null){
   const v=Number(req.body.maxBatchRecords);
   if(!Number.isInteger(v)||v<1||v>MAX_BATCH_RECORDS_LIMIT)
    return res.status(400).json({message:'Max batch records must be an integer between 1 and '+MAX_BATCH_RECORDS_LIMIT});
   maxBatchRecords=v;
  }else{
   maxBatchRecords=await readMaxBatchRecords();
  }
  let aqrpBatchConcurrency;
  if(req.body?.aqrpBatchConcurrency!=null){
   const v=Number(req.body.aqrpBatchConcurrency);
   if(!Number.isInteger(v)||v<1||v>AQRP_CONCURRENCY_LIMIT)
    return res.status(400).json({message:'AQRP batch concurrency must be an integer between 1 and '+AQRP_CONCURRENCY_LIMIT});
   aqrpBatchConcurrency=v;
  }else{
   aqrpBatchConcurrency=await readAqrpBatchConcurrency();
  }
  const existing=Object.fromEntries(ROLES.map(role=>[role,existingDoc?.assignments?.[role]||null]));
  const assignments={};
  for(const role of ROLES){
   const value=Object.hasOwn(input,role)?input[role]:existing[role];
   if(value==null){assignments[role]=null;continue;}
   if(!allowed.has(JSON.stringify([value.endpoint,value.model])))
    return res.status(400).json({message:'Choose an available model for '+role});
   const previous=existing[role];
   if(previous?.endpoint!==value.endpoint||previous?.model!==value.model){
    try{await require('./model-access.cjs').assertRole(value,role);}
    catch(error){return res.status(400).json({message:role+': '+error.message});}
   }
   assignments[role]={endpoint:value.endpoint,model:value.model};
  }
  await collection().updateOne({_id:'assignments'},{$set:{
   assignments,panelMembers,workflow,maxBatchRecords,aqrpBatchConcurrency,updatedAt:new Date(),updatedBy:String(req.user.id||req.user._id)
  }},{upsert:true});
  res.json({assignments,panelMembers,workflow,maxBatchRecords,aqrpBatchConcurrency,panelTest});
 }catch(e){
  console.error('[LLMRoleSettings] Save failed',e);
  res.status(500).json({message:'Unable to save LLM assignments'});
 }
}
module.exports={ROLES,PANEL_MAX,MAX_BATCH_RECORDS_DEFAULT,MAX_BATCH_RECORDS_LIMIT,AQRP_CONCURRENCY_DEFAULT,AQRP_CONCURRENCY_LIMIT,read,readPanelMembers,readMaxBatchRecords,readAqrpBatchConcurrency,readWorkflow,resolve,get,save};
