'use strict';
// Additional app-owned data, scoped only to the selected account.
module.exports=async function cleanup(user){
 const mongoose=require('mongoose'),raw=mongoose.connection.db,id=String(user.id||user._id);
 if(!/^[a-f0-9]{24}$/i.test(id))throw Error('Invalid deletion owner');
 const db=require('~/models');
 const core=require('/app/auto-memory-feature/core.cjs');
 const model=mongoose.models.ChatProject;
 if(!model || typeof core.identity!=='function')throw Error('Account cleanup dependencies missing');
 const bucket=new mongoose.mongo.GridFSBucket(raw,{bucketName:'projectfilebytes'});
 const blobs=await raw.collection('projectfilebytes.files').find({'metadata.user':id},{projection:{_id:1}}).toArray();
 for(const b of blobs)await bucket.delete(b._id);
 await raw.collection('projectfiles').deleteMany({user:id});
 await raw.collection('projectfilestates').deleteMany({user:id});
 await model.deleteMany({user:id});
 await raw.collection('lab_user_memory').deleteOne({_id:core.identity(user)});
 await raw.collection('lab_persona_calls').deleteMany({owner:core.identity(user)});
 if(user.email)await db.deleteTokens({email:user.email});
 const {PrincipalType}=require('librechat-data-provider');
 await db.deleteConfig(PrincipalType.USER,user._id);
};
