'use strict';
function snapshot(now=new Date()){
 const timeZone=process.env.TZ||Intl.DateTimeFormat().resolvedOptions().timeZone;
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23',timeZoneName:'longOffset'}).formatToParts(now).map(p=>[p.type,p.value]));
 const offset=parts.timeZoneName==='GMT'?'+00:00':parts.timeZoneName.replace('GMT','');
 return {timeZone,epochMs:now.getTime(),iso:now.toISOString(),localISO:`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}${offset}`};
}
function middleware(req,res,next){
 if(req.method==='GET'&&req.path==='/api/server-clock'){
  res.set('Cache-Control','no-store');return res.json(snapshot());
 }
 if(req.body&&typeof req.body==='object'&&!Array.isArray(req.body)&&
   /^\/(?:api\/(?:agents|ask|assistants)(?:\/|$)|v1\/(?:chat|responses)(?:\/|$))/.test(req.path)){
   const c=snapshot();req.body.timezone=c.timeZone;req.body.clientTimestamp=c.localISO;
   req.serverRequestTime=c.iso;
 }
 next();
}
module.exports={snapshot,middleware};
