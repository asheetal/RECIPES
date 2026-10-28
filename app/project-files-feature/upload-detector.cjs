'use strict';
const {spawn}=require('node:child_process');
const {FileHandle}=require(process.env.PROJECT_UPLOAD_READER || '/app/file-layer/index.cjs');
function systemMime(bytes){
 return new Promise((resolve,reject)=>{
  const child=spawn('file',['--brief','--mime-type','-'],{stdio:['pipe','pipe','pipe']});
  const chunks=[];let length=0,settled=false;
  const timer=setTimeout(()=>{child.kill();finish(Error('File detector timed out.'));},10000);
  function finish(error,result){
   if(settled)return;settled=true;clearTimeout(timer);
   if(error){error.status=503;reject(error);}else resolve(result);
  }
  child.on('error',()=>finish(Error('File detector is unavailable.')));
  child.stdin.on('error',(e)=>{if(e.code!=='EPIPE')finish(Error('File detector could not read the upload.'));});
  child.stdout.on('data',chunk=>{
   length+=chunk.length;
   if(length>4096){child.kill();finish(Error('Invalid file detector response.'));}
   else chunks.push(chunk);
  });
  child.on('close',code=>{
   if(code!==0)return finish(Error('File detector failed.'));
   const mime=Buffer.concat(chunks).toString('utf8').trim().toLowerCase();
   if(!/^[a-z0-9.+-]+\/[a-z0-9.+-]+$/.test(mime))
    return finish(Error('Invalid file detector response.'));
   finish(null,mime);
  });
  child.stdin.end(bytes);
 });
}
async function inspect(bytes){
 if(!Buffer.isBuffer(bytes)||bytes.length===0)return null;
 const detected=await systemMime(bytes);
 const candidates=new Set([
  'application/pdf','application/json','application/xml',
  'application/zip','application/x-zip','application/x-zip-compressed',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
 ]);
 if(!detected.startsWith('text/')&&!candidates.has(detected))return null;
 try{return await new FileHandle('',bytes).inspect();}
 catch(e){if(e.status===415)return null;throw e;}
}
async function validateUpload(req,res,next){
 try{
  if(!req.file)return res.status(400).json({message:'Choose a file.'});
  const result=await inspect(req.file.buffer);
  if(!result)return res.status(204).end();
  req.file.mimetype=result.mime;next();
 }catch(e){
  res.status(e.status||503).json({message:'Unable to check file contents. Please retry.'});
 }
}
module.exports={inspect,systemMime,validateUpload};
