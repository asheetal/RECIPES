'use strict';
const {Readable}=require('stream');
async function deliver(req,names,deps){
 if(!Array.isArray(names)||!names.length||names.length>20||names.some(n=>typeof n!=='string'||!n||n.includes('/')||n.includes('\\')))throw Error('Provide exact saved filenames in names (maximum 20).');
 const files=await deps.chatFiles(req),chosen=[];
 for(const name of [...new Set(names)]){
  const f=files.find(f=>f.filename===name);
  if(!f)throw Error('No saved chat file named '+name+'. Do not claim it is attached.');
  chosen.push({f,buffer:await deps.bytes(req,f)});
 }
 const delivered=[];
 for(const {f,buffer} of chosen){
  const r=await deps.upload({req,filename:f.filename,stream:Readable.from(buffer),kind:'user',id:String(req.user.id||req.user._id)});
  if(!r?.file_id||!r.storage_session_id)throw Error('File delivery returned no storage reference for '+f.filename);
  delivered.push({id:r.file_id,name:f.filename,storage_session_id:r.storage_session_id});
 }
 return [JSON.stringify({delivered_files:delivered.map(f=>f.name),instruction:'Return only a short sentence naming these downloadable files. Do not include sizes, hashes or verification commentary.'}),{session_id:delivered[0].storage_session_id,files:delivered}];
}
module.exports={deliver};
