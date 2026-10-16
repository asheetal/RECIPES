'use strict';
const {DAY,sixMonths,newCode,codeHash,allowed,due}=require('./core.cjs');
const mongoose=require('mongoose');
const crypto=require('node:crypto');
const fs=require('node:fs/promises');
const path=require('node:path');
const users=()=>mongoose.connection.collection('users');
const members=()=>mongoose.connection.collection('lab_friends');
const codes=()=>mongoose.connection.collection('lab_friend_codes');
const idOf=u=>String(u?.id||u?._id||'');
const validId=id=>/^[a-f0-9]{24}$/i.test(id||'');
function result(r){return r?.value===undefined?r:r.value;}
function fail(res,status,message){return res.status(status).json({message});}
async function gate(req,res,next){
 try{const id=idOf(req.user);if(!id)return next();const row=await members().findOne({_id:id});if(!allowed(row))return fail(res,403,'Your FRIENDS access has expired or is being removed. Contact Abhishek.');next();}
 catch(e){console.error('[Friends] Access check failed:',e.name);return fail(res,503,'Account access could not be checked. Please retry.');}
}
async function admin(req,res,next){
 try{const id=idOf(req.user);const u=validId(id)?await users().findOne({_id:new mongoose.Types.ObjectId(id)},{projection:{role:1}}):null;
 if(u?.role!=='ADMIN')return fail(res,403,'Administrator access required.');next();}
 catch{return fail(res,503,'Cannot verify administrator access.');}
}
async function generate(req,res){
 const code=newCode(),now=new Date(),expiresAt=new Date(now.getTime()+7*DAY);
 await codes().insertOne({_id:codeHash(code),label:code.slice(-4),createdAt:now,expiresAt,state:'unused',createdBy:idOf(req.user)});
 const url=new URL(process.env.DOMAIN_CLIENT);url.pathname=url.pathname.replace(/\/+$/,'')+'/register';url.search='?friend=1';url.hash='';
 res.json({code,expiresAt,registrationURL:url.toString()});
}
async function list(req,res){
 const rows=await members().find({}).sort({expiresAt:1}).toArray();
 const data=[];for(const r of rows){const u=await users().findOne({_id:new mongoose.Types.ObjectId(r._id)},{projection:{name:1,email:1,role:1}});if(u)data.push({id:r._id,name:u.name,email:u.email,state:r.state,expiresAt:r.expiresAt,registeredAt:r.registeredAt,remindedAt:r.remindedAt});}
 const pending=await codes().find({state:'unused',expiresAt:{$gt:new Date()}},{projection:{label:1,expiresAt:1}}).sort({expiresAt:1}).limit(100).toArray();
 res.json({friends:data,codes:pending.map(c=>({id:c._id,label:c.label,expiresAt:c.expiresAt}))});
}
async function revoke(req,res){await codes().deleteOne({_id:req.params.codeId,state:'unused'});res.json({message:'Code revoked.'});}
async function convert(req,res){
 if(!validId(req.params.id))return fail(res,400,'Invalid account.');
 // The same atomic state predicate is used by the deletion claim: only one wins.
 const changed=await members().deleteOne({_id:req.params.id,state:'active'});
 if(!changed.deletedCount)return fail(res,409,'Account unavailable or deletion already started.');
 await codes().deleteMany({userId:req.params.id});
 res.json({message:'Converted to a regular user. Expiration canceled.'});
}
async function remove(req,res){
 const id=req.params.id;if(!validId(id))return fail(res,400,'Invalid account.');
 const u=await users().findOne({_id:new mongoose.Types.ObjectId(id)});
 if(!u||u.role==='ADMIN')return fail(res,403,'Account cannot be deleted here.');
 if(String(req.body?.confirmEmail||'').trim().toLowerCase()!==u.email.toLowerCase())return fail(res,400,'Type the account email to confirm deletion.');
 const row=result(await members().findOneAndUpdate({_id:id,state:{$in:['active','pending']}},{$set:{state:'deleting',deleteAfter:new Date(Date.now()+60000)}},{returnDocument:'after'}));
 if(!row)return fail(res,409,'Account is already being removed or is not a FRIENDS account.');
 await require('~/models').deleteAllUserSessions({userId:id});
 await abortJobs(id);
 res.json({message:'Account blocked. Its data will be deleted automatically.'});
 void sweep();
}
async function routeDelete(req,res,next){if(await members().findOne({_id:req.params.id}))return remove(req,res);return next();}
async function register(req,res,next){
 const token=req.body?.token;
 if(typeof token!=='string'||!token.trim().toUpperCase().startsWith('FRIEND'))return next();
 const hash=codeHash(token);if(!hash)return fail(res,400,'Invalid or expired registration code.');
 const {registerSchema}=require('~/strategies/validators');
 const parsed=registerSchema.safeParse(req.body);if(!parsed.success)return fail(res,400,'Check your name, email and password.');
 const data={...parsed.data,email:parsed.data.email.trim().toLowerCase()};
 if(await users().findOne({email:data.email},{projection:{_id:1}}))return fail(res,409,'This email already has an account.');
 const oid=new mongoose.Types.ObjectId(),userId=String(oid),now=new Date();
 const code=result(await codes().findOneAndUpdate({_id:hash,state:'unused',expiresAt:{$gt:now}},{$set:{state:'used',userId,usedAt:now}},{returnDocument:'after'}));
 if(!code)return fail(res,400,'Invalid, used or expired registration code.');
 // Persist restriction BEFORE creating the account; no unrestricted login window.
 await members().insertOne({_id:userId,state:'pending',registeredAt:now,expiresAt:sixMonths(now)});
 const answer=await require('~/server/services/AuthService').registerUser(data,{_id:oid,role:'USER'});
 const created=await users().findOne({_id:oid},{projection:{_id:1,role:1}});
 if(answer.status===200&&created?.role==='USER'){
  await members().updateOne({_id:userId,state:'pending'},{$set:{state:'active'}});
  return res.status(200).json({message:answer.message});
 }
 // Never turn a half-created restricted account into an unrestricted account.
 if(created)await members().updateOne({_id:userId},{$set:{state:'deleting',deleteAfter:new Date()}});
 else await members().deleteOne({_id:userId});
 return fail(res,400,'Registration did not complete. Ask Abhishek for a new code.');
}
async function abortJobs(id){const {GenerationJobManager}=require('@librechat/api');for(const job of await GenerationJobManager.getActiveJobIdsForUser(id))await GenerationJobManager.abortJob(job);}
async function erase(row){
 const id=row._id,u=await users().findOne({_id:new mongoose.Types.ObjectId(id)});
 if(u?.role==='ADMIN')throw Error('Administrator deletion blocked');
 if(!u){await members().deleteOne({_id:id,state:'deleting'});await codes().deleteMany({userId:id});return;}
 await abortJobs(id);
 const {getAppConfig}=require('~/server/services/Config');
 const req={user:{...u,id,_id:u._id},body:{},params:{},headers:{},config:await getAppConfig({role:u.role,userId:id}),_labFriendsDelete:true};
 let status=200,completed=false;
 const res={status(n){status=n;return this;},send(){completed=true;return this;},json(){completed=true;return this;},clearCookie(){return this;}};
 await require('~/server/controllers/UserController').deleteAdminUserController(req,res);
 if(!completed||status!==200)throw Error('Account cleanup incomplete');
 await codes().deleteMany({userId:id});await members().deleteOne({_id:id,state:'deleting'});
}
async function deleteLocalFiles(id){
 if(!validId(id))throw Error('Invalid cleanup owner');
 // Account-owned upload directory only; never follow a link into another directory.
 const target=path.join('/app/uploads',id);await fs.rm(target,{recursive:true,force:true});
 await mongoose.connection.collection('lab_retention_jobs').deleteMany({user:id});
}
let running=false;
async function sweep(){
 if(running||mongoose.connection.readyState!==1)return;running=true;
 try{
  const now=new Date();
  // Pending enrollments recover safely after a process restart.
  for(const r of await members().find({state:'pending',registeredAt:{$lt:new Date(+now-10*60000)}}).toArray()){
   const u=await users().findOne({_id:new mongoose.Types.ObjectId(r._id)},{projection:{role:1}});
   if(u?.role==='USER')await members().updateOne({_id:r._id,state:'pending'},{$set:{state:'active'}});
   else if(!u)await members().deleteOne({_id:r._id,state:'pending'});
  }
  for(const r of await members().find({state:'active',expiresAt:{$lte:now}}).toArray()){
   const claimed=result(await members().findOneAndUpdate({_id:r._id,state:'active'},{$set:{state:'deleting',deleteAfter:new Date(+now+60000)}},{returnDocument:'after'}));
   if(claimed){await require('~/models').deleteAllUserSessions({userId:r._id});await abortJobs(r._id);}
  }
  for(const r of await members().find({state:'deleting',deleteAfter:{$lte:now}}).toArray()){
   // Durable per-account lease; cleanup failures retry rather than discard file records.
   const lock=crypto.randomUUID();const claimed=result(await members().findOneAndUpdate({_id:r._id,state:'deleting',$or:[{leaseUntil:{$exists:false}},{leaseUntil:{$lt:now}}]},{$set:{lease:lock,leaseUntil:new Date(+now+10*60000)}},{returnDocument:'after'}));
   if(!claimed)continue;
   try{await erase(claimed);}catch(e){console.error('[Friends] Cleanup retry needed:',r._id,e.name);await members().updateOne({_id:r._id,lease:lock},{$unset:{lease:1,leaseUntil:1}});}
  }
  for(const r of await members().find({state:'active',remindedAt:{$exists:false},expiresAt:{$gt:now,$lte:new Date(+now+14*DAY)}}).toArray()){
   if(!due(r,+now))continue;const lock=crypto.randomUUID();
   const claimed=result(await members().findOneAndUpdate({_id:r._id,state:'active',remindedAt:{$exists:false},$or:[{reminderLease:{$exists:false}},{reminderLease:{$lt:now}}]},{$set:{reminderLease:new Date(+now+10*60000),reminderOwner:lock}},{returnDocument:'after'}));
   if(!claimed)continue;
   try{
    const u=await users().findOne({_id:new mongoose.Types.ObjectId(r._id)},{projection:{email:1,name:1}});
    if(!u)continue;
    if(!await members().findOne({_id:r._id,state:'active',reminderOwner:lock}))continue;
    const expires=new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',dateStyle:'long',timeStyle:'short'}).format(r.expiresAt);
    await require('~/server/utils').sendEmail({email:u.email,subject:'Your Tryfind.Me FRIENDS access expires in two weeks',template:'friendsExpiry.handlebars',payload:{name:u.name||u.email,expires}});
    await members().updateOne({_id:r._id,state:'active',reminderOwner:lock},{$set:{remindedAt:new Date()},$unset:{reminderLease:1,reminderOwner:1}});
   }catch(e){console.error('[Friends] Reminder will retry:',e.name);await members().updateOne({_id:r._id,reminderOwner:lock},{$unset:{reminderLease:1,reminderOwner:1}});}
  }
 }catch(e){console.error('[Friends] Scheduled check failed:',e.name);}finally{running=false;}
}
let timer;
async function start(){
 if(timer)return;
 await codes().createIndex({expiresAt:1},{expireAfterSeconds:0});await members().createIndex({state:1,expiresAt:1});
 timer=setInterval(()=>void sweep(),60000);timer.unref();void sweep();
}
const wrap=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(e=>{console.error('[Friends] Request failed:',e.name);if(!res.headersSent)fail(res,503,'Request could not be completed. Please retry.');});
module.exports={routeDelete:wrap(routeDelete),gate:wrap(gate),admin:wrap(admin),generate:wrap(generate),list:wrap(list),revoke:wrap(revoke),convert:wrap(convert),remove:wrap(remove),register:wrap(register),start,sweep,deleteLocalFiles};
