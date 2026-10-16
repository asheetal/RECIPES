
'use strict';
const VERSION=2;
const text={type:'string'};
const object=properties=>({
 type:'object',properties,required:Object.keys(properties),additionalProperties:false
});
const schemas={
 LLM_TRIAGE:object({route:{type:'string',enum:['OPD','SURGERY']}}),
 LLM_DIRECTOR:object({grant:{type:'boolean'}}),
 LLM_OPD:object({text}),
 LLM_ERP:object({
  taskBrief:text,beginningState:text,
  iterationStates:{type:'array',items:object({
   iteration:{type:'integer',minimum:1},progress:text
  })},
  usefulProgress:text,repeatedWork:text,blockers:text,completionEvidence:text
 })
};
function validate(value,schema,path='$'){
 if(schema.enum&&!schema.enum.includes(value))throw Error(path+': invalid enum');
 switch(schema.type){
 case 'object':
  if(!value||typeof value!=='object'||Array.isArray(value))
   throw Error(path+': object required');
  for(const k of schema.required||[])
   if(!Object.hasOwn(value,k))throw Error(path+': missing '+k);
  for(const k of Object.keys(value)){
   if(!Object.hasOwn(schema.properties,k))throw Error(path+': unexpected '+k);
   validate(value[k],schema.properties[k],path+'.'+k);
  } break;
 case 'array':
  if(!Array.isArray(value))throw Error(path+': array required');
  value.forEach((v,i)=>validate(v,schema.items,path+'['+i+']'));break;
 case 'integer':
  if(!Number.isSafeInteger(value))throw Error(path+': integer required');
  if(schema.minimum!==undefined&&value<schema.minimum)
   throw Error(path+': below minimum');break;
 default:
  if(typeof value!==schema.type)throw Error(path+': '+schema.type+' required');
 }
 return value;
}
function parse(content,schema){
 if(typeof content!=='string')throw Error('JSON content must be a string');
 return validate(JSON.parse(content),schema);
}
function format(name,schema){
 return {type:'json_schema',json_schema:{name,strict:true,schema}};
}
function completion(result){
 const c=result?.choices?.[0];
 if(!c||c.finish_reason==='length'||c.finish_reason==='content_filter'||
    c.message?.refusal)throw Error('Incomplete or refused model response');
 return c;
}

async function testModel(send,model){
 const nonce=require('node:crypto').randomUUID();
 const expected={token:nonce,ready:true};
 const probe=object({
  token:{type:'string',enum:[nonce]},ready:{type:'boolean',enum:[true]}
 });
 const first=completion(await send({
  model,messages:[{role:'user',content:'Reply only READY.'}],
  max_tokens:4096,stream:false
 }));
 if(first.message?.tool_calls?.length||
    typeof first.message?.content!=='string'||!first.message.content.trim())
  throw Error('Gateway connectivity/text test failed');
 const modes={},errors={};
 for(const mode of ['json_schema','json_object']){
  try{
   const choice=completion(await send({
    model,messages:[{role:'user',content:'Return exactly '+JSON.stringify(expected)}],
    response_format:mode==='json_schema'?format('capability_probe',probe):{type:'json_object'},
    max_tokens:4096,stream:false
   }));
   if(choice.message?.tool_calls?.length)throw Error('Unexpected tool call');
   parse(choice.message?.content,probe);
   modes[mode]=true;
  }catch(e){modes[mode]=false;errors[mode]=e.message;}
 }
 if(!modes.json_schema&&!modes.json_object)
  throw Error('Required structured JSON tests failed in both supported request formats');
 let toolCalling=false;
 try{
  const choice=completion(await send({
   model,messages:[{role:'user',content:'Call capability_probe with token '+nonce}],
   tools:[{type:'function',function:{
    name:'capability_probe',description:'Capability test; no operation is executed.',
    strict:true,parameters:object({token:{type:'string',enum:[nonce]}})
   }}],
   tool_choice:{type:'function',function:{name:'capability_probe'}},
   max_tokens:4096,stream:false
  }));
  const calls=choice.message?.tool_calls;
  if(!Array.isArray(calls)||calls.length!==1||
     calls[0].type!=='function'||calls[0].function?.name!=='capability_probe')
   throw Error('Expected one capability test tool call');
  parse(calls[0].function.arguments,object({token:{type:'string',enum:[nonce]}}));
  toolCalling=true;
 }catch(e){errors.toolCalling=e.message;}
 return {
  contractVersion:VERSION,testedAt:new Date().toISOString(),
  capabilities:{
   gatewayConnectivity:true,textOutput:true,structuredJsonOutputs:true,
   jsonSchema:modes.json_schema,jsonObject:modes.json_object,toolCalling
  },
  tests:{gateway:'passed',
   jsonSchema:modes.json_schema?'passed':'failed',
   jsonObject:modes.json_object?'passed':'failed',
   toolCalling:toolCalling?'passed':'failed',errors}
 };
}
function requireRole(model,role){
 const p=model?.capabilityTest;
 if(p?.contractVersion!==VERSION||
    p.capabilities?.gatewayConnectivity!==true||
    p.capabilities?.textOutput!==true||
    p.capabilities?.structuredJsonOutputs!==true)
  throw Error('Test this model in Admin before assigning it');
 if(['LLM_TRIAGE','LLM_ERP','LLM_OPD'].includes(role)&&p.capabilities.jsonSchema!==true)
  throw Error(role+' requires a passed JSON Schema test');
 if(role==='LLM_DIRECTOR'&&p.capabilities.jsonObject!==true)
  throw Error('Director requires a passed JSON mode test');
 if(role==='LLM_SURGERY'&&p.capabilities.toolCalling!==true)
  throw Error('Surgeon requires a passed tool-calling test');
}
module.exports={VERSION,schemas,validate,parse,format,completion,testModel,requireRole};
