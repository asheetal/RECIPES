'use strict';
const access=require('./model-access.cjs');
const PROBE_SCHEMA=Object.freeze({type:'object',properties:{ok:{type:'boolean'}},required:['ok'],additionalProperties:false});
const PROBE_SYSTEM='Return ONLY a JSON object matching this schema: '+JSON.stringify(PROBE_SCHEMA)+'. No prose.';
const PROBE_USER='Return {"ok":true}.';
const PROBE_TIMEOUT_MS=20000;
function extractError(obj){
  if(!obj) return 'unknown error';
  if(typeof obj==='string') return obj;
  if(obj.error&&typeof obj.error==='string') return obj.error;
  if(obj.error&&obj.error.message) return obj.error.message;
  if(obj.message) return obj.message;
  return JSON.stringify(obj).slice(0,300);
}
async function probeSlot(binding){
  const criteria={};
  let conn;
  try{ conn=await access.connection(binding); criteria.connection={ok:true}; }
  catch(e){ criteria.connection={ok:false,error:String(e.message||e).slice(0,300)}; return {ok:false,criteria}; }
  const send=(body,ms)=>fetch(conn.base+'/chat/completions',{
    method:'POST',
    headers:{...(conn.headers||{}),Authorization:'Bearer '+conn.key,'Content-Type':'application/json'},
    body:JSON.stringify(body),
    signal:AbortSignal.timeout(ms)
  });
  {
    const t=Date.now();
    try{
      const r=await send({model:conn.model,messages:[{role:'user',content:'Reply with the single word OK.'}],max_tokens:8,stream:false,reasoning:{enabled:false,exclude:true}},PROBE_TIMEOUT_MS);
      criteria.silenceable={ok:r.ok,latency_ms:Date.now()-t};
      if(!r.ok){const t2=await r.text().catch(()=>'');let p;try{p=JSON.parse(t2);}catch(e){p=null;}criteria.silenceable.error=p?extractError(p):String(t2).slice(0,300);}
    }catch(e){criteria.silenceable={ok:false,latency_ms:Date.now()-t,error:String(e.message||e).slice(0,300)};}
    if(!criteria.silenceable.ok) return {ok:false,criteria};
  }
  {
    const t=Date.now();
    try{
      const r=await send({model:conn.model,messages:[{role:'system',content:PROBE_SYSTEM},{role:'user',content:PROBE_USER}],max_tokens:64,stream:false,reasoning:{enabled:false,exclude:true},response_format:{type:'json_schema',json_schema:{name:'probe',schema:PROBE_SCHEMA,strict:true}}},PROBE_TIMEOUT_MS);
      criteria.json_schema={ok:false,latency_ms:Date.now()-t};
      if(r.ok){
        const d=await r.json(); const raw=d?.choices?.[0]?.message?.content;
        try{const p=JSON.parse(raw);if(p&&typeof p.ok==='boolean'){criteria.json_schema.ok=true;criteria.json_schema.used='json_schema';}else criteria.json_schema.error='schema mismatch';}
        catch(e){criteria.json_schema.error='non-JSON: '+String(raw||'').slice(0,200);}
      }else{const t2=await r.text().catch(()=>'');criteria.json_schema.error='HTTP '+r.status+' '+String(t2).slice(0,200);}
    }catch(e){criteria.json_schema={ok:false,latency_ms:Date.now()-t,error:String(e.message||e).slice(0,300)};}
  }
  if(!criteria.json_schema.ok){
    const t=Date.now();
    try{
      const r=await send({model:conn.model,messages:[{role:'system',content:PROBE_SYSTEM},{role:'user',content:PROBE_USER}],max_tokens:64,stream:false,reasoning:{enabled:false,exclude:true},response_format:{type:'json_object'}},PROBE_TIMEOUT_MS);
      criteria.json_object={ok:false,latency_ms:Date.now()-t};
      if(r.ok){
        const d=await r.json(); const raw=d?.choices?.[0]?.message?.content;
        try{const p=JSON.parse(raw);if(p&&typeof p.ok==='boolean'){criteria.json_object.ok=true;criteria.json_object.used='json_object';}else criteria.json_object.error='schema mismatch';}
        catch(e){criteria.json_object.error='non-JSON: '+String(raw||'').slice(0,200);}
      }else{const t2=await r.text().catch(()=>'');criteria.json_object.error='HTTP '+r.status+' '+String(t2).slice(0,200);}
    }catch(e){criteria.json_object={ok:false,latency_ms:Date.now()-t,error:String(e.message||e).slice(0,300)};}
  }
  const ok=criteria.connection.ok&&criteria.silenceable.ok&&(criteria.json_schema.ok||(criteria.json_object&&criteria.json_object.ok));
  return {ok,criteria};
}
async function probeMembers(members){
  return Promise.all(members.map((m,i)=>probeSlot(m).then(r=>({slot:i+1,...r})).catch(e=>({slot:i+1,ok:false,criteria:{connection:{ok:false,error:String(e.message||e)}}}))));
}
module.exports={probeSlot,probeMembers,PROBE_SCHEMA};
