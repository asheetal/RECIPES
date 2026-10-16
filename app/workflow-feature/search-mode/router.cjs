
'use strict';
const {nameOf}=require('./policy.cjs');
const routes={
 training:'LOCAL_ONLY',
 academic:'PAPER_SEARCH',
 web:'WEB_SEARCH'
};
function clean(value){
 if(Array.isArray(value))return value.map(clean);
 if(value&&typeof value==='object'){
  const result={};
  for(const [key,item] of Object.entries(value)){
   if(/^(source|provider|searchProvider|endpoint|api_key|apiKey)$/i.test(key))
    continue;
   result[key]=clean(item);
  }
  return result;
 }
 return value;
}
function bind(selection,params,backend,execute){
 const route=routes[selection];
 if(!route)throw Error('Invalid saved search selection');
 const names=[
  ...(backend.toolDefinitions||[]).map(nameOf),
  ...Array.from(backend.toolRegistry?.keys?.()||[])
 ];
 const providerTool=route==='WEB_SEARCH'
  ?names.find(n=>n==='web_search')
  :route==='PAPER_SEARCH'
   ?names.find(n=>/research_search/.test(n))
   :null;
 let loaded;
 return async(query,config={})=>{
  if(route==='LOCAL_ONLY')return {code:'LOCAL_ONLY'};
  try{
   if(!providerTool)throw Error('Selected search connector unavailable');
   loaded??=execute({
    ...params,...backend,
    agent:params.agent,
    toolNames:[providerTool]
   });
   const result=await loaded;
   const tool=(result.loadedTools||result.tools||[])
    .find(t=>t.name===providerTool);
   if(!tool?.invoke)throw Error('Search connector cannot execute');
   const input=tool.schema?.shape?.queries
    ?{queries:[query]}:{query};
   console.info('[SearchRouter]',JSON.stringify({
    route,event:'start'
   }));
   const returned=await tool.invoke({
    type:'tool_call',
    id:'search_'+require('crypto').randomUUID(),
    name:providerTool,args:input
   },{signal:config.signal||params.signal});
   const content=returned?.content??returned;
   const artifact=returned?.artifact;
   const text=typeof content==='string'?content:
    Array.isArray(content)?content.map(p=>p?.text||'').join('\n'):'';
   let parsed;
   try{parsed=JSON.parse(text)}catch{}
   for(const value of [returned,artifact,parsed]){
    if(value?.isError||value?.error||value?.status==='error')
     throw Error('Search connector reported failure');
   }
   if(!text.trim()&&artifact==null)
    throw Error('Search connector returned no evidence');
   const evidence=clean({
    content:parsed??text,
    ...(artifact!=null?{artifact}:{})
   });
   console.info('[SearchRouter]',JSON.stringify({
    route,event:'complete'
   }));
   return {code:'EVIDENCE',results:evidence};
  }catch(error){
   if(config.signal?.aborted||params.signal?.aborted)throw error;
   console.error('[SearchRouter]',JSON.stringify({
    route,event:'failed',message:error.message
   }));
   return {code:'SEARCH_FAILED'};
  }
 };
}
module.exports={bind};
