
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const app=require('node:module').createRequire('/app/package.json');
const settings=require('./llm-roles.cjs');
const access=require('./model-access.cjs');
const contract=require('./json-contract.cjs');
const ROOT=path.join(__dirname,'prompt-dumps');
function clean(value){
 const secrets=[...access.secretValues(),...Object.entries(process.env).filter(([k,v])=>/KEY|SECRET|TOKEN|PASSWORD/i.test(k)&&v&&v.length>8).map(([,v])=>v)];
 const seen=new WeakSet();
 return JSON.parse(JSON.stringify(value,(k,v)=>{
  if(/^(authorization|apiKey|openAIApiKey|key|password|secret|access_token|refresh_token)$/i.test(k))return '[REDACTED]';
  if(typeof v==='string'){for(const s of secrets)v=v.split(s).join('[REDACTED]');return v.replace(/Bearer\s+[^\s"\\]+/gi,'Bearer [REDACTED]');}
  if(typeof v==='bigint')return String(v);
  if(v&&typeof v==='object'){if(seen.has(v))return '[Repeated object]';seen.add(v);}
  return v;
 }));
}
function audit(ctx,role,event,data){
 const trace=ctx?.__workflow?.id||ctx?.traceId||crypto.randomUUID();
 const dir=path.join(ROOT,trace.replace(/[^a-zA-Z0-9_-]/g,''));
 fs.mkdirSync(dir,{recursive:true,mode:0o700});
 const record={version:1,time:new Date().toISOString(),traceId:trace,role,event,
  userId:ctx?.user?.id||ctx?.userId,conversationId:ctx?.body?.conversationId||ctx?.conversationId,data:clean(data)};
 fs.writeFileSync(path.join(dir,Date.now()+'-'+crypto.randomUUID()+'.json'),JSON.stringify(record,null,2),{mode:0o600});
 return trace;
}
async function selection(role,ctx){
 const choices=ctx?.__llmBindings;
 const b=choices?choices[role]:await settings.resolve(role);
 if(!b)throw Error(role+' is not assigned');
 return b;
}
async function connection(role,ctx){return access.connection(await selection(role,ctx));}
function tracedFetch(role,ctx){
 ctx=ctx?.__workflow?.id?ctx:{...ctx,traceId:ctx?.traceId||crypto.randomUUID()};
 return async(url,options={})=>{
 const started=Date.now();let body=options.body;
 try{body=JSON.parse(body);}catch{}
 audit(ctx,role,'api_request',{url,method:options.method,body});
 try{
  const response=await fetch(url,options);
  const text=await response.clone().text();let output=text;try{output=JSON.parse(text);}catch{}
  audit(ctx,role,'api_response',{status:response.status,durationMs:Date.now()-started,output});
  return response;
 }catch(error){audit(ctx,role,'api_error',{name:error.name,code:error.code,message:error.message,durationMs:Date.now()-started});throw error;}
};}
async function complete(role,messages,{ctx,max_tokens=4096,json=false,signal}={}){
 const c=await connection(role,ctx);
 const schema=contract.schemas[role];
 if(schema){
  const guidance='Return only a JSON object matching this schema. No Markdown or surrounding prose. '+JSON.stringify(schema);
  const index=messages.findIndex(m=>m.role==='system');
  messages=messages.map((m,i)=>i===index?{...m,content:m.content+'\n'+guidance}:m);
  if(index<0)messages=[{role:'system',content:guidance},...messages];
 }
 const timeout=AbortSignal.timeout(120000);
 const response=await tracedFetch(role,ctx)(c.base+'/chat/completions',{
  method:'POST',headers:{...c.headers,Authorization:'Bearer '+c.key,'Content-Type':'application/json'},
  body:JSON.stringify({model:c.model,messages,max_tokens,stream:false,...(schema?{response_format:role==='LLM_DIRECTOR'?{type:'json_object'}:contract.format(role.toLowerCase(),schema)}:json?{response_format:{type:'json_object'}}:{}),...(role==='LLM_DIRECTOR'||role==='LLM_TRIAGE'?{thinking:{type:'disabled'}}:{})}),
  signal:signal?AbortSignal.any([signal,timeout]):timeout
 });
 if(!response.ok){const e=Error(role+' HTTP '+response.status);e.code='HTTP_'+response.status;throw e;}
 const out=await response.json(),choice=out.choices?.[0];
 if(choice?.message?.tool_calls?.length)throw Error(role+' returned forbidden tool calls');
 if(choice?.finish_reason==='length')throw Error(role+' output truncated');
 if(typeof choice?.message?.content!=='string'||!choice.message.content.trim())throw Error(role+' returned no text');
 if(schema){
  const parsed=contract.parse(choice.message.content,schema);
  if(role==='LLM_OPD')choice.message.content=parsed.text;
 }
 return out;
}
async function snapshot(req){req.__llmBindings=await settings.read();}

function configuredContextLimit(binding){
 let parse;
 try{parse=app('js-yaml').load;}
 catch(e){if(e.code!=='MODULE_NOT_FOUND')throw e;parse=app('yaml').parse;}
 const config=parse(fs.readFileSync('/app/librechat.yaml','utf8'));
 const limits=new Set();
 for(const spec of config.modelSpecs?.list||[]){
  const p=spec.preset||{};
  if(p.endpoint!==binding.endpoint||p.model!==binding.model)continue;
  if(p.maxContextTokens==null)continue;
  if(!Number.isSafeInteger(p.maxContextTokens)||p.maxContextTokens<=0)
   throw Error('Invalid configured model context limit');
  limits.add(p.maxContextTokens);
 }
 if(limits.size>1)throw Error('Conflicting configured model context limits');
 return limits.size?[...limits][0]:undefined;
}


function configuredModelSpec(binding){
 let parse;
 try{parse=app('js-yaml').load;}
 catch(e){if(e.code!=='MODULE_NOT_FOUND')throw e;parse=app('yaml').parse;}
 const config=parse(fs.readFileSync('/app/librechat.yaml','utf8'));
 const matches=(config.modelSpecs?.list||[]).filter(spec=>
  spec.preset?.endpoint===binding.endpoint&&
  spec.preset?.model===binding.model);
 if(matches.length>1)throw Error('Ambiguous assigned model configuration');
 if(matches.length&&!matches[0].name)throw Error('Assigned model spec has no name');
 return matches[0];
}

async function bindRequest(req,role){
 const b=await selection(role,req);
 req.config=await access.overlay(req.config);
 const maxContextTokens=(await access.model(b))?.maxContextTokens??configuredContextLimit(b);
 for(const key of ['spec','preset','agent_id','assistant_id','addedConvo','promptPrefix','modelLabel','greeting','iconURL','model_parameters','temperature','top_p','max_tokens','maxTokens','maxContextTokens','maxOutputTokens','reasoning_effort'])delete req.body[key];
 req.body.endpoint=b.endpoint;req.body.endpointType='custom';req.body.model=b.model;req.body.modelLabel='Assistant';
 if(maxContextTokens!==undefined)req.body.maxContextTokens=maxContextTokens;
 const assignedSpec=role==='LLM_SURGERY'?configuredModelSpec(b):undefined;
 if(assignedSpec)req.body.spec=assignedSpec.name;
 req.body.ephemeralAgent=role==='LLM_SURGERY'?{...await access.surgeryTools(),execute_code:true,skills:req.body.ephemeralAgent?.skills===true}:{};
 req.config={...req.config,modelSpecs:{...req.config?.modelSpecs,enforce:false}};
 audit(req,role,'binding',{endpoint:b.endpoint,model:b.model,maxContextTokens,configuredSpec:assignedSpec?.name,mcpServers:assignedSpec?.mcpServers||[]});
}
async function title(role,config){const b=await selection(role);return {...config,titleEndpoint:b.endpoint,titleModel:b.model};}
async function summarization(role,config){
 const b=await selection(role),parameters={...config?.parameters};
 for(const k of ['model','modelName','provider','apiKey','openAIApiKey','baseURL','configuration','clientOptions','defaultHeaders','headers'])delete parameters[k];
 return {...config,provider:b.endpoint,model:b.model,parameters};
}
async function available(role,ctx){
 try{await connection(role,ctx);return true;}
 catch{console.warn('['+role+'] provider configuration unavailable');return false;}
}
module.exports={audit,selection,available,connection,complete,tracedFetch,snapshot,bindRequest,title,summarization};

function configureContext(ctx,role,context){
 if(role!=='LLM_SURGERY')throw Error('Unsupported workflow handle');
 const schema=contract.schemas[role];
 if(!schema)return;
 context.clientOptions={...context.clientOptions,modelKwargs:{
  ...context.clientOptions?.modelKwargs,
  response_format:contract.format(role.toLowerCase(),schema)
 }};
 audit(ctx,role,'structured_output_configuration',{responseFormat:'json_schema',strict:true});
}
module.exports.configureContext=configureContext;
