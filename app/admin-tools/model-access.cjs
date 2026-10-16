
'use strict';
const fs=require('node:fs'),crypto=require('node:crypto');
const app=require('node:module').createRequire('/app/package.json');
const coll=()=>app('mongoose').connection.db.collection('lab_model_access');
const roles=()=>app('mongoose').connection.db.collection('lab_llm_role_settings');
const keyPath='/app/admin-tools/model-access.key';
const secrets=new Set();
const contract=require('./json-contract.cjs');
let initializing;
function yaml(){let parse;try{parse=app('js-yaml').load;}catch(e){if(e.code!=='MODULE_NOT_FOUND')throw e;parse=app('yaml').parse;}return parse(fs.readFileSync('/app/librechat.yaml','utf8'));}
const expand=x=>String(x||'').replace(/\$\{([^}]+)\}/g,(_,k)=>process.env[k]||'');
function encrypt(value){const iv=crypto.randomBytes(12),c=crypto.createCipheriv('aes-256-gcm',fs.readFileSync(keyPath),iv);const data=Buffer.concat([c.update(JSON.stringify(value),'utf8'),c.final()]);return {iv:iv.toString('base64'),tag:c.getAuthTag().toString('base64'),data:data.toString('base64')};}
function decrypt(value){const d=crypto.createDecipheriv('aes-256-gcm',fs.readFileSync(keyPath),Buffer.from(value.iv,'base64'));d.setAuthTag(Buffer.from(value.tag,'base64'));const obj=JSON.parse(Buffer.concat([d.update(Buffer.from(value.data,'base64')),d.final()]).toString());for(const s of [obj.apiKey,...Object.values(obj.headers||{})])if(typeof s==='string'&&s.length>8)secrets.add(s);return obj;}
function url(value){const u=new URL(String(value||'').trim());if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash)throw Error('Use an HTTPS API base URL without credentials or query parameters');return u.toString().replace(/\/+$/,'');}
function name(value,label){if(typeof value!=='string'||!value.trim()||value.length>200||/[\r\n\0]/.test(value))throw Error('Enter a valid '+label);return value.trim();}
async function request(api,path,body){const c=decrypt(api.credentials);let r;try{r=await fetch(api.baseURL+path,{method:body?'POST':'GET',headers:{...c.headers,Authorization:'Bearer '+c.apiKey,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),redirect:'error',signal:AbortSignal.timeout(30000)});}catch{throw Error('API connection failed or timed out');}if(!r.ok)throw Error('API test returned HTTP '+r.status);try{return await r.json();}catch{throw Error('API test did not return JSON');}}
function modelList(data){const rows=Array.isArray(data.data)?data.data:Array.isArray(data.models)?data.models:null;if(!rows)throw Error('API must support the OpenAI-compatible /models endpoint');return rows;}
function context(row){for(const v of [row?.context_window,row?.context_length,row?.max_context_tokens,row?.max_input_tokens,row?.contextWindow])if(Number.isSafeInteger(v)&&v>0)return v;}
async function read(){let d=await coll().findOne({_id:'catalog'});if(d)return d;initializing??=seed().finally(()=>{initializing=null;});await initializing;return coll().findOne({_id:'catalog'});}
async function seed(){
 const config=yaml(),apis=[],models=[];
 const saved=await roles().findOne({_id:'assignments'});
 const surgery=saved?.assignments?.LLM_SURGERY;
 const spec=(config.modelSpecs?.list||[]).find(s=>s.preset?.endpoint===surgery?.endpoint&&s.preset?.model===surgery?.model);
 for(const e of config.endpoints?.custom||[]){
  const apiKey=expand(e.apiKey);if(!apiKey||apiKey==='user_provided')continue;
  const headers=Object.fromEntries(Object.entries(e.headers||{}).map(([k,v])=>[k,expand(v)]));
  const api={id:crypto.randomUUID(),name:e.name,baseURL:url(expand(e.baseURL)),credentials:encrypt({apiKey,headers}),source:'existing',config:{...e}};
  delete api.config.apiKey;delete api.config.headers;delete api.config.baseURL;apis.push(api);
  const specs=(config.modelSpecs?.list||[]).filter(s=>s.preset?.endpoint===e.name);
  for(const m of new Set([...(e.models?.default||[]),...specs.map(s=>s.preset.model),...Object.values(saved?.assignments||{}).filter(v=>v?.endpoint===e.name).map(v=>v.model)])){
   const s=specs.find(s=>s.preset.model===m);
   models.push({id:crypto.randomUUID(),apiId:api.id,name:m,label:s?.label||e.name+' / '+m,...(s?.preset?.maxContextTokens?{maxContextTokens:s.preset.maxContextTokens}:{}),source:'existing'});
  }
 }
 await coll().updateOne({_id:'catalog'},{$setOnInsert:{apis,models,version:0,surgeryTools:{mcp:spec?.mcpServers||[],execute_code:spec?.executeCode!==false,web_search:spec?.webSearch===true,file_search:spec?.fileSearch===true},createdAt:new Date()}},{upsert:true});
}
function publicData(d){return {apis:d.apis.map(a=>({id:a.id,name:a.name,baseURL:a.baseURL,hasKey:true})),models:d.models.map(m=>{
 const api=d.apis.find(a=>a.id===m.apiId);
 const status=!m.capabilityTest?'untested':
  m.capabilityTest.contractVersion!==contract.VERSION||
  m.capabilityTest.apiRevision!==(api?.revision||0)?'outdated':'tested';
 return {...m,endpoint:api?.name,capabilityStatus:status};
}),version:d.version};}
async function write(d,fields){const result=await coll().updateOne({_id:'catalog',version:d.version},{$set:{...fields,updatedAt:new Date()},$inc:{version:1}});if(result.matchedCount!==1)throw Error('Settings changed while testing; reload and save again');}
const respond=fn=>async(req,res)=>{res.set('Cache-Control','no-store');try{res.json(await fn(req));}catch(e){res.status(400).json({message:e.message});}};
const get=respond(async()=>publicData(await read()));
const saveAPI=respond(async req=>{
 const d=await read(),input=req.body||{},existing=input.id?d.apis.find(a=>a.id===input.id):null;
 if(input.id&&!existing)throw Error('API no longer exists');
 const apiName=name(input.name,'API name');
 if(d.apis.some(a=>a.name.toLowerCase()===apiName.toLowerCase()&&a.id!==existing?.id))throw Error('API name already exists');
 if(existing&&existing.name!==apiName)throw Error('Keep the existing API name when changing its URL or key');
 const apiKey=input.apiKey?name(input.apiKey,'API key'):existing?decrypt(existing.credentials).apiKey:null;
 if(!apiKey)throw Error('API key is required');
 const api={...existing,revision:(existing?.revision||0)+1,id:existing?.id||crypto.randomUUID(),name:apiName,baseURL:url(input.baseURL),credentials:encrypt({apiKey,headers:existing?decrypt(existing.credentials).headers:{}})};
 const available=modelList(await request(api,'/models'));
 const names=available.map(m=>typeof m==='string'?m:m.id||m.name).filter(Boolean);
 const probe=names.find(n=>/^(?:openai\/)?gpt-4\.1-(?:nano|mini)$/.test(n))||names[0];
 if(!probe)throw Error('API returned no models to test');
 const checked=await request(api,'/chat/completions',{model:probe,messages:[{role:'user',content:'OK'}],max_tokens:1,stream:false});
 if(!checked.choices?.length)throw Error('API authentication test returned no completion');
 await write(d,{apis:[...d.apis.filter(a=>a.id!==api.id),api]});
 return {...publicData(await read()),message:'API tested and saved.'};
});

const saveModel=respond(async req=>{
 const d=await read(),input=req.body||{},api=d.apis.find(a=>a.id===input.apiId);
 if(!api)throw Error('Select a saved API');
 const modelName=name(input.name,'model name');
 if(d.models.some(m=>m.apiId===api.id&&m.name===modelName))throw Error('Model already exists');
 const catalog=modelList(await request(api,'/models'));
 const capabilityTest=await contract.testModel(
  body=>request(api,'/chat/completions',body),modelName);
 capabilityTest.apiRevision=api.revision||0;
 const maxContextTokens=context(catalog.find(m=>(m.id||m.name)===modelName));
 const model={
  id:crypto.randomUUID(),apiId:api.id,name:modelName,
  label:api.name+' / '+modelName,
  ...(maxContextTokens?{maxContextTokens}:{}),
  testedAt:new Date(),capabilityTest
 };
 await write(d,{models:[...d.models,model]});
 return {...publicData(await read()),
  message:'Model tested and added. Role assignment checks its required capabilities.'};
});
const retestModel=respond(async req=>{
 const d=await read(),model=d.models.find(m=>m.id===req.params.id);
 if(!model)throw Error('Model no longer exists');
 const api=d.apis.find(a=>a.id===model.apiId);
 if(!api)throw Error('API no longer exists');
 const capabilityTest=await contract.testModel(
  body=>request(api,'/chat/completions',body),model.name);
 capabilityTest.apiRevision=api.revision||0;
 await write(d,{models:d.models.map(m=>m.id===model.id?
  {...m,testedAt:new Date(),capabilityTest}:m)});
 return {...publicData(await read()),message:'Model capability tests completed.'};
});
async function assertRole(binding,role){
 const d=await read(),api=d.apis.find(a=>a.name===binding.endpoint);
 const model=d.models.find(m=>m.apiId===api?.id&&m.name===binding.model);
 if(!model)throw Error('Model is unavailable');
}
const deleteModel=respond(async req=>{
 const d=await read(),m=d.models.find(m=>m.id===req.params.id);
 if(!m)throw Error('Model no longer exists');
 const endpoint=d.apis.find(a=>a.id===m.apiId).name;
 await write(d,{models:d.models.filter(x=>x.id!==m.id)});
 const saved=await roles().findOne({_id:'assignments'});
 for(const [role,v] of Object.entries(saved?.assignments||{}))
  if(v?.endpoint===endpoint&&v.model===m.name)
   await roles().updateOne({_id:'assignments',[`assignments.${role}.endpoint`]:endpoint,[`assignments.${role}.model`]:m.name},{$set:{[`assignments.${role}`]:null}});
 return {...publicData(await read()),message:'Model removed. Roles using it are now unassigned.'};
});
async function catalog(){const d=await read();return d.models.map(m=>({endpoint:d.apis.find(a=>a.id===m.apiId).name,model:m.name,label:m.label})).sort((a,b)=>a.label.localeCompare(b.label));}
async function connection(binding){const d=await read(),api=d.apis.find(a=>a.name===binding.endpoint);if(!api||!d.models.some(m=>m.apiId===api.id&&m.name===binding.model))throw Error('Assigned API or model is unavailable');const c=decrypt(api.credentials);return {...binding,key:c.apiKey,base:api.baseURL,headers:c.headers||{}};}
async function model(binding){const d=await read(),api=d.apis.find(a=>a.name===binding.endpoint);return d.models.find(m=>m.apiId===api?.id&&m.name===binding.model);}
async function surgeryTools(){return (await read()).surgeryTools;}
async function overlay(config){
 const d=await read();
 const custom=d.apis.map(a=>{const c=decrypt(a.credentials);return {...a.config,name:a.name,baseURL:a.baseURL,apiKey:c.apiKey,headers:c.headers,models:{fetch:false,default:d.models.filter(m=>m.apiId===a.id).map(m=>m.name)}};});
 const managed=new Set(custom.map(a=>a.name));
 const endpoints={...config?.endpoints,custom:[...(config?.endpoints?.custom||[]).filter(e=>!managed.has(e.name)),...custom]};
 if(endpoints.agents?.allowedProviders)endpoints.agents={...endpoints.agents,allowedProviders:[...new Set([...endpoints.agents.allowedProviders,...managed])]};
 return {...config,endpoints};
}
async function modelMap(){const d=await read();return Object.fromEntries(d.apis.map(a=>[a.name,d.models.filter(m=>m.apiId===a.id).map(m=>m.name)]));}
module.exports={get,saveAPI,saveModel,retestModel,assertRole,deleteModel,catalog,connection,model,overlay,modelMap,surgeryTools,secretValues:()=>[...secrets]};
