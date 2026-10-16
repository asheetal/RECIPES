'use strict';
const DEFAULTS = Object.freeze({maxFiles:50,maxFileBytes:25*1024*1024,revision:0});
const supportedTypes = Object.freeze(['text','PDF','XLSX','PPTX','DOCX','JSON','XML']);
function validate(value) {
 if(!value || !Number.isSafeInteger(value.maxFiles) || value.maxFiles<1 || value.maxFiles>1000)
  throw Error('Maximum files must be a whole number between 1 and 1000.');
 if(!Number.isSafeInteger(value.maxFileBytes) || value.maxFileBytes<1 || value.maxFileBytes>100*1024*1024)
  throw Error('Maximum file size must be above zero and at most 100 MB.');
 if(!Number.isSafeInteger(value.revision) || value.revision<0)
  throw Error('Reload settings before saving.');
 return {maxFiles:value.maxFiles,maxFileBytes:value.maxFileBytes,revision:value.revision};
}
function collection(){
 return require('mongoose').connection.db.collection('projectuploadpolicies');
}
function key(req){return {_id:'project-upload:'+String(req.user?.tenantId||'')};}
async function read(req){
 const row=await collection().findOne(key(req));
 return row?validate(row):{...DEFAULTS};
}
async function get(req,res){
 try{res.json({...await read(req),maxProjectBytes:100*1024*1024,supportedTypes});}
 catch{res.status(503).json({message:'Unable to read project upload settings.'});}
}
async function save(req,res){
 let next;
 try{next=validate(req.body);}
 catch(e){return res.status(400).json({message:e.message});}
 try{
  const selector=key(req);
  await collection().updateOne(selector,{$setOnInsert:DEFAULTS},{upsert:true});
  const result=await collection().updateOne(
   {...selector,revision:next.revision},
   {$set:{maxFiles:next.maxFiles,maxFileBytes:next.maxFileBytes},$inc:{revision:1}});
  if(result.matchedCount!==1)
   return res.status(409).json({message:'Settings changed. Reload before saving.'});
  res.json({...next,revision:next.revision+1,maxProjectBytes:100*1024*1024,supportedTypes});
 }catch{res.status(503).json({message:'Could not save project upload settings.'});}
}
module.exports={DEFAULTS,validate,read,get,save,supportedTypes};
