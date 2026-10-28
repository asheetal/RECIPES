'use strict';
const roles=require('./llm-roles.cjs');
const access=require('./model-access.cjs');

async function callMember(binding, idx, query, schema){
  const conn=await access.connection(binding);
  const sys='You are a panel member. Return ONLY a JSON object matching this schema exactly: '+JSON.stringify(schema)+'. No prose, no markdown fences.';
  const base={model:conn.model,messages:[{role:'system',content:sys},{role:'user',content:query}],stream:false,reasoning:{enabled:false,exclude:true}};
  const send=rf=>fetch(conn.base+'/chat/completions',{
    method:'POST',
    headers:{...(conn.headers||{}),Authorization:'Bearer '+conn.key,'Content-Type':'application/json'},
    body:JSON.stringify({...base,response_format:rf}),
    signal:AbortSignal.timeout(60000)
  });
  let r=await send({type:'json_schema',json_schema:{name:'panel_answer',schema,strict:true}});
  if(!r.ok) r=await send({type:'json_object'});
  if(!r.ok){const t=await r.text().catch(()=>'');return {idx,ok:false,error:'HTTP '+r.status+' '+t.slice(0,160)};}
  const d=await r.json();
  const raw=d?.choices?.[0]?.message?.content;
  if(!raw) return {idx,ok:false,error:'empty content'};
  try{return {idx,ok:true,json:JSON.parse(raw)};}
  catch(e){return {idx,ok:false,error:'non-JSON: '+String(raw).slice(0,160)};}
}

function collect(results){
  return results.filter(r=>r.ok&&r.json&&typeof r.json==='object').map(r=>r.json);
}

async function _run(query, schema){
  if(typeof query!=='string'||!query.trim()) throw Error('query is required');
  if(!schema||typeof schema!=='object'||schema.type!=='object'||typeof schema.properties!=='object')
    throw Error('schema must be a JSON Schema object with type=object and properties');
  const members=await roles.readPanelMembers();
  if(!members.length) throw Error('LLM_ASSISTANT_PANEL is not configured');
  if(members.length>roles.PANEL_MAX) throw Error('LLM_ASSISTANT_PANEL exceeds '+roles.PANEL_MAX+' agents');
  const raw=await Promise.all(members.map((m,i)=>callMember(m,i,query,schema).catch(e=>({idx:i,ok:false,error:String(e.message||e)}))));
  const sets=collect(raw);
  return {
    result:{panel:'LLM_ASSISTANT_PANEL', n:sets.length, responses:sets},
    meta:{n:members.length, ok:sets.length, failed:members.length-sets.length},
    raw
  };
}

async function ask({query, schema}){
  const {result}=await _run(query, schema);
  return result;
}

async function askVerbose({query, schema}){
  return _run(query, schema);
}

module.exports={ask, askVerbose};
