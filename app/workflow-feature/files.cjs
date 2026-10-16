'use strict';
const crypto=require('crypto');
const {TextDecoder}=require('util');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function validateZip(b,name){
 const zlib=require('zlib');let total=0;const end=b.lastIndexOf(Buffer.from([80,75,5,6]));
 if(end<0||end+22>b.length)throw Error('Invalid ZIP directory');
 const count=b.readUInt16LE(end+10);let pos=b.readUInt32LE(end+16);const names=[];
 for(let i=0;i<count;i++){
  if(pos+46>b.length||b.readUInt32LE(pos)!==0x02014b50)throw Error('Invalid ZIP entry');
  const method=b.readUInt16LE(pos+10),crc=b.readUInt32LE(pos+16),packed=b.readUInt32LE(pos+20),size=b.readUInt32LE(pos+24),nl=b.readUInt16LE(pos+28),extra=b.readUInt16LE(pos+30),comment=b.readUInt16LE(pos+32),offset=b.readUInt32LE(pos+42);
  total+=size;if(total>100*1024*1024)throw Error('Document expands beyond validation limit');
  if(offset+30>b.length||b.readUInt32LE(offset)!==0x04034b50)throw Error('Invalid ZIP data');
  const start=offset+30+b.readUInt16LE(offset+26)+b.readUInt16LE(offset+28);
  if(start+packed>b.length)throw Error('Truncated ZIP data');
  const raw=b.subarray(start,start+packed);const data=method===0?raw:method===8?zlib.inflateRawSync(raw,{maxOutputLength:100*1024*1024}):null;
  if(!data||data.length!==size)throw Error('Unsupported or damaged ZIP entry');
  let v=0xffffffff;for(const byte of data){v^=byte;for(let bit=0;bit<8;bit++)v=(v>>>1)^((v&1)?0xedb88320:0);}
  if(((v^0xffffffff)>>>0)!==crc)throw Error('ZIP checksum mismatch');
  names.push(b.subarray(pos+46,pos+46+nl).toString());pos+=46+nl+extra+comment;
 }
 if(/\.docx$/i.test(name)&&!names.includes('word/document.xml'))throw Error('DOCX document part missing');
}
function check(buffer,f){
 if(!Buffer.isBuffer(buffer))throw Error('File bytes unavailable');
 if(Number.isFinite(f.bytes)&&buffer.length!==f.bytes)throw Error('Stored size mismatch');
 if(f.metadata?.workflowSha256&&hash(buffer)!==f.metadata.workflowSha256)throw Error('Stored checksum mismatch');
 if(/\.(tex|bib|sty|cls|bst|txt|md|csv|json|py|r)$/i.test(f.filename)||/Makefile$/i.test(f.filename))new TextDecoder('utf-8',{fatal:true}).decode(buffer);
 if(/\.(docx|xlsx|pptx|zip)$/i.test(f.filename))validateZip(buffer,f.filename);
 return buffer;
}
async function chatFiles(req){
 const db=require('~/models'),mongoose=require('mongoose');
 const user=String(req.user.id||req.user._id),conversationId=req.body?.conversationId;
 const existing=conversationId&&conversationId!=='new';
 if(existing&&!await db.getConvo(user,conversationId))throw Error('Chat access denied');
 const messages=existing?await mongoose.models.Message.find({user,conversationId}).select('files attachments').lean():[];
 const direct=[...(req.body?.files||[]),...(req.body?.attachments||[])].map(f=>typeof f==='string'?f:f?.file_id).filter(Boolean);
 const ids=[...require('./chat-files.cjs').linkedIds(messages),...direct];
 const files=await db.getFiles({user,...(req.user.tenantId?{tenantId:req.user.tenantId}:{}),$or:[...(existing?[{conversationId}]:[]),{file_id:{$in:ids}}]},null,{text:0});
 const latest=new Map();
 for(const f of [...files].sort((a,b)=>new Date(a.updatedAt||a.createdAt)-new Date(b.updatedAt||b.createdAt)))latest.set(f.filename,f);
 return [...latest.values()];
}
async function bytes(req,f){
 const {getStrategyFunctions}=require('~/server/services/Files/strategies');
 const stream=await getStrategyFunctions(f.source).getDownloadStream(req,f.filepath);let n=0;const chunks=[];
 for await(const part of stream){const b=Buffer.from(part);n+=b.length;if(n>25*1024*1024){stream.destroy?.();throw Error('File exceeds 25 MB');}chunks.push(b);}
 return check(Buffer.concat(chunks),f);
}
async function prepare(req,svc,s,result){
 const chats=await chatFiles(req),masters=await svc.list(s);const byName=new Map(chats.map(f=>[f.filename,f]));
 const masterRefs=await svc.prime(req,s);const refs=[];const warnings=[];
 // Upload validated latest chat bytes, including files omitted by native priming.
 for(const f of chats){
  try{const buffer=await bytes(req,f);const {Readable}=require('stream');
   const r=await require('~/server/services/Files/Code/crud').uploadCodeEnvFile({req,filename:f.filename,stream:Readable.from(buffer),kind:'user',id:String(req.user.id)});
   refs.push({id:r.file_id,resource_id:String(req.user.id),kind:'user',name:f.filename,storage_session_id:r.storage_session_id});
  }catch(e){
   if(!masters.some(m=>m.name===f.filename))throw Error('Chat file unavailable: '+f.filename+'. '+e.message);
   byName.delete(f.filename);warnings.push('RECOVERY: Chat file '+f.filename+' failed integrity/read checks ('+e.message+'). The project master is being used. Preserve the chat copy and tell the user they must review and merge chat changes with the master in Project Files.');
  }
 }
 const chosen=[...masterRefs.filter(f=>!byName.has(f.name)),...refs];
 const names=new Set(chosen.map(f=>f.name));
 result.primedCodeFiles=[...(result.primedCodeFiles||[]).filter(f=>!names.has(f.name)),...chosen];
 req.__workflowWarnings=warnings;
 return warnings;
}
async function saveChat(req,svc,s,args){
 const f=(await chatFiles(req)).find(f=>f.filename===args.name&&(!args.file_id||f.file_id===args.file_id));
 if(!f)throw Error('No saved chat artifact with that filename; finish the code tool before saving');
 const b=await bytes(req,f);if(args.sha256&&args.sha256!==hash(b))throw Error('Chat artifact changed; save refused');
 const result=await svc.save(s,args.name,b);const saved=await svc.read(s,result.id);
 if(hash(saved.buffer)!==hash(b))throw Error('Project transfer checksum mismatch');
 return JSON.stringify({...result,sha256:hash(b),verified:'Exact chat bytes transferred to project'});
}
module.exports={hash,check,chatFiles,bytes,prepare,saveChat};
