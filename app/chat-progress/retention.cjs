'use strict';
const DAY=86400000, DAYS=60;
let running=false;
function oldEnough(conversation,lastMessage,now=Date.now()){
 const values=[conversation.updatedAt,conversation.createdAt,lastMessage?.updatedAt,lastMessage?.createdAt].filter(Boolean).map(x=>new Date(x).getTime());
 return values.length>0&&values.every(Number.isFinite)&&Math.max(...values)<now-DAYS*DAY;
}
function mentions(value,file){const s=JSON.stringify(value);return [file.file_id,file.filepath,file.metadata?.codeEnvRef?.file_id].filter(Boolean).some(v=>s.includes(JSON.stringify(v)));}
async function touch(user,conversationId){
 if(!conversationId||conversationId==='new')return;
 const mongoose=require('mongoose');const c=mongoose.connection.db.collection('conversations');
 const r=await c.updateOne({user:String(user),conversationId,labExpiryClaim:{$exists:false}},{$set:{updatedAt:new Date()}});
 if(!r.matchedCount&&await c.findOne({user:String(user),conversationId,labExpiryClaim:{$exists:true}}))throw Error('This conversation has expired after 60 days of inactivity. Start a new chat.');
}
async function protectedFile(db,file,conversationId){
 const alternatives=[{filepath:file.filepath}];
 if(file.metadata?.codeEnvRef?.file_id)alternatives.push({'metadata.codeEnvRef.file_id':file.metadata.codeEnvRef.file_id,'metadata.codeEnvRef.storage_session_id':file.metadata.codeEnvRef.storage_session_id});
 if(await db.collection('files').findOne({file_id:{$ne:file.file_id},$or:alternatives}))return true;
 if(await db.collection('projectfiles').findOne({attachmentIds:file.file_id}))return true;
 // Check other conversations, saved agents and all message fields, including file references embedded in tool output.
 for(const [name,query] of [['messages',{conversationId:{$ne:conversationId}}],['conversations',{conversationId:{$ne:conversationId}}],['agents',{}],['projectfiles',{}]]){
  for await(const row of db.collection(name).find(query))if(mentions(row,file))return true;
 }
 return false;
}
async function finishJob(job){
 const mongoose=require('mongoose'),db=mongoose.connection.db;
 const user=await mongoose.models.User.findById(job.user).lean();if(!user)throw Error('Owner unavailable; cleanup paused');
 const config=await require('~/server/services/Config').getAppConfig({role:user.role,userId:String(user._id),tenantId:user.tenantId});
 const req={user:{...user,id:String(user._id)},body:{},config,headers:{}};
 const files=await require('~/models').getFiles({user:String(user._id),file_id:{$in:job.fileIds}});
 for(const file of files){
  if(await protectedFile(db,file,job.conversationId))continue;
  const result=await require('~/server/services/Files/process').processDeleteRequest({req,files:[file]});
  if(result.failedFileIds?.length)throw Error('File cleanup pending retry');
 }
 await db.collection('lab_retention_jobs').deleteOne({_id:job._id});
}
async function sweep({dryRun=false}={}){
 const mongoose=require('mongoose');if(mongoose.connection.readyState!==1)return {ready:false};
 const db=mongoose.connection.db,cutoff=new Date(Date.now()-DAYS*DAY);let eligible=0,deleted=0;
 if(!dryRun)for await(const job of db.collection('lab_retention_jobs').find({chatDeleted:true}).limit(100)){
  try{await finishJob(job);}catch(e){console.warn('[ChatRetention] File cleanup deferred:',e.message);}
 }
 for await(const c of db.collection('conversations').find({updatedAt:{$lt:cutoff}}).limit(100)){
  const latest=await db.collection('messages').find({user:c.user,conversationId:c.conversationId}).sort({updatedAt:-1,createdAt:-1}).limit(1).next();
  if(!oldEnough(c,latest))continue;eligible++;if(dryRun)continue;
  // Claim and touch use complementary atomic filters: new chat activity wins or is rejected before deletion starts.
  const claim=await db.collection('conversations').updateOne({_id:c._id,updatedAt:c.updatedAt,labExpiryClaim:{$exists:false}},{$set:{labExpiryClaim:true}});
  if(!claim.modifiedCount&&!c.labExpiryClaim)continue;
  try{
   const latestNow=await db.collection('messages').find({user:c.user,conversationId:c.conversationId}).sort({updatedAt:-1,createdAt:-1}).limit(1).next();
   if(!oldEnough(c,latestNow)){await db.collection('conversations').updateOne({_id:c._id},{$unset:{labExpiryClaim:''}});continue;}
   const messages=await db.collection('messages').find({user:c.user,conversationId:c.conversationId}).toArray();
   const ids=new Set();for(const m of messages)for(const f of [...(m.files||[]),...(m.attachments||[])])if(f?.file_id)ids.add(f.file_id);
   const files=await require('~/models').getFiles({user:c.user,$or:[{conversationId:c.conversationId},{file_id:{$in:[...ids]}}]});
   const job={_id:String(c._id),user:c.user,conversationId:c.conversationId,fileIds:files.map(f=>f.file_id),chatDeleted:false};
   await db.collection('lab_retention_jobs').updateOne({_id:job._id},{$set:job},{upsert:true});
   await require('@librechat/api').deleteConvoSharedLinksWithCleanup(c.user,c.conversationId);
   await require('~/models').deleteToolCalls(c.user,c.conversationId);
   await require('~/models').deleteConvos(c.user,{conversationId:c.conversationId,labExpiryClaim:true});
   await db.collection('lab_retention_jobs').updateOne({_id:job._id},{$set:{chatDeleted:true}});deleted++;
   await finishJob({...job,chatDeleted:true});
  }catch(e){console.warn('[ChatRetention] Cleanup deferred:',e.message);}
 }
 // Recover a process exit after chat deletion but before its cleanup flag was saved.
 if(!dryRun)for await(const j of db.collection('lab_retention_jobs').find({chatDeleted:false}).limit(100)){
  if(!await db.collection('conversations').findOne({conversationId:j.conversationId,user:j.user}))await db.collection('lab_retention_jobs').updateOne({_id:j._id},{$set:{chatDeleted:true}});
 }
 return {days:DAYS,eligible,deleted,dryRun};
}
function start(){
 const key=Symbol.for('lab.chatRetention');if(global[key])return;global[key]=true;
 const tick=async()=>{if(running)return;running=true;try{console.log('[ChatRetention]',JSON.stringify(await require('@librechat/data-schemas').runAsSystem(()=>sweep())));}catch(e){console.warn('[ChatRetention]',e.message);}finally{running=false;}};
 setTimeout(async()=>{try{console.log('[ChatRetention] Preview',JSON.stringify(await require('@librechat/data-schemas').runAsSystem(()=>sweep({dryRun:true}))));}catch(e){console.warn('[ChatRetention] Preview failed:',e.message);}},60000).unref();
 setInterval(tick,DAY).unref();
}
module.exports={oldEnough,mentions,touch,sweep,start};
