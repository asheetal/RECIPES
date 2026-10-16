'use strict';
const store=require('./store.cjs');
const identity=req=>({user:String(req.user.id||req.user._id),tenant:req.user.tenantId?String(req.user.tenantId):null});
async function snapshot(req){if(!req._searchModePromise)req._searchModePromise=store.read(identity(req));return req._searchModePromise;}
function queryFor(req){
 const b=req.body||{};
 const text=typeof b.text==='string'?b.text:typeof b.message==='string'?b.message:
  typeof b.userMessage?.text==='string'?b.userMessage.text:'';
 const content=Array.isArray(b.content)?b.content.map(p=>p.text||'').join('\n'):'';
 const query=(text||content).trim();
 if(!query)throw Error('Search mode needs prompt text');
 return query.slice(0,1000);
}
module.exports={identity,snapshot,queryFor};
