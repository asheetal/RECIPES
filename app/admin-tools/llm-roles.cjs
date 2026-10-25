'use strict';
const fs=require('node:fs');
const app=require('node:module').createRequire('/app/package.json');
const ROLES=Object.freeze([
 'LLM_TRIAGE','LLM_SURGERY','LLM_OPD','LLM_BILLING','LLM_ERP','LLM_DIRECTOR'
]);
const collection=()=>app('mongoose').connection.db.collection('lab_llm_role_settings');
async function catalog(){return require('./model-access.cjs').catalog();}
async function read(){
 const saved=await collection().findOne({_id:'assignments'});
 return Object.fromEntries(ROLES.map(role=>[role,saved?.assignments?.[role]||null]));
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
   roles:ROLES,models:await catalog(),assignments:await read(),workflow:await readWorkflow()
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
   const existing=await read();
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
   assignments,workflow,updatedAt:new Date(),updatedBy:String(req.user.id||req.user._id)
  }},{upsert:true});
  res.json({assignments,workflow});
 }catch(e){
  console.error('[LLMRoleSettings] Save failed',e);
  res.status(500).json({message:'Unable to save LLM assignments'});
 }
}
module.exports={ROLES,read,readWorkflow,resolve,get,save};
