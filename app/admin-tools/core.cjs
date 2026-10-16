'use strict';
const EMAIL=/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
function emailValue(value){return typeof value==='string'?value.trim().toLowerCase():'';}
function makeHandlers(d){
 const inFlight=new Set(); const sent=new Map();
 async function admin(req,res,next){
  try{const actor=await d.getUser(req.user?.id||req.user?._id);
   if(!actor||actor.role!=='ADMIN')return res.status(403).json({message:'Administrator access required.'});
   req.labAdmin=actor;next();
  }catch{res.status(503).json({message:'Unable to verify administrator access.'});}
 }
 async function invite(req,res){
  const email=emailValue(req.body?.email);
  if(!EMAIL.test(email)||email.length>120)return res.status(400).json({message:'Enter a valid email address.'});
  if(inFlight.has(email)||Date.now()-(sent.get(email)||0)<60000)return res.status(429).json({message:'Wait one minute before sending another invitation.'});
  inFlight.add(email); let token;
  try{
   if(await d.findUser(email))return res.status(409).json({message:'This email already has an account.'});
   token=await d.createInvite(email);
   if(typeof token!=='string')throw Error('Invite creation failed');
   const base=new URL(d.domain());
   if(base.protocol!=='https:'||base.username||base.password)throw Error('HTTPS application URL required');
   base.pathname=base.pathname.replace(/\/+$/,'')+'/register';base.search='';base.hash='';
   base.searchParams.set('token',decodeURIComponent(token));base.searchParams.set('email',email);
   await d.send(email,base.toString());
   for(const [k,v] of sent)if(Date.now()-v>60000)sent.delete(k);
   sent.set(email,Date.now());
   res.json({message:'Invitation sent. The link expires in seven days.'});
  }catch{
   if(token&&typeof token==='string')await d.revoke(email,token).catch(()=>{});
   res.status(502).json({message:'Invitation could not be sent. Check the server email configuration and try again.'});
  }finally{inFlight.delete(email);}
 }
 async function remove(req,res){
  const id=req.params.id;
  if(!/^[a-f0-9]{24}$/i.test(id||''))return res.status(400).json({message:'Invalid user.'});
  try{
   const target=await d.getUser(id);
   if(!target)return res.status(404).json({message:'User not found.'});
   if(target.role==='ADMIN'||id===String(req.labAdmin?._id||req.labAdmin?.id))return res.status(403).json({message:'Administrator accounts cannot be deleted here.'});
   if(!target.email||emailValue(req.body?.confirmEmail)!==emailValue(target.email))return res.status(400).json({message:'Type the selected user’s email to confirm deletion.'});
   if(inFlight.has(id))return res.status(409).json({message:'Deletion already in progress.'});
   inFlight.add(id);
   try{await d.remove(req,res,target);}finally{inFlight.delete(id);}
  }catch{if(!res.headersSent)res.status(500).json({message:'Deletion did not finish. Contact the administrator before retrying.'});}
 }
 return {admin,invite,remove};
}
module.exports={makeHandlers};
