
'use strict';
const {category,nameOf}=require('./policy.cjs');
const {snapshot,queryFor}=require('./prompt.cjs');
const {definition,createSearch}=require('./interface.cjs');
const {bind}=require('./router.cjs');

const isSearch=name=>name==='search'||Boolean(category(name));
function withoutSearch(map){
 if(map instanceof Map)
  return new Map([...map].filter(([name])=>!isSearch(name)));
 if(map&&typeof map==='object')
  return Object.fromEntries(Object.entries(map)
   .filter(([name])=>!isSearch(name)));
 return map;
}
function expose(backend,search){
 const result={...backend};
 for(const field of ['tools','loadedTools','additionalTools','toolDefinitions']){
  if(Array.isArray(backend[field]))
   result[field]=backend[field].filter(t=>!isSearch(nameOf(t)));
 }
 result.tools=[...(result.tools||[]),search];
 result.toolDefinitions=[...(result.toolDefinitions||[]),definition];
 result.toolRegistry=withoutSearch(backend.toolRegistry)||new Map();
 if(result.toolRegistry instanceof Map)
  result.toolRegistry.set('search',definition);
 else result.toolRegistry.search=definition;
 for(const field of ['toolContextMap','dynamicToolContextMap'])
  result[field]=withoutSearch(backend[field]);
 if(backend.mcpAvailableTools)
  result.mcpAvailableTools=Object.fromEntries(
   Object.entries(backend.mcpAvailableTools)
    .map(([server,tools])=>[server,withoutSearch(tools)])
  );
 if(backend.configurable){
  result.configurable={...backend.configurable};
  result.configurable.toolRegistry=result.toolRegistry;
  if(backend.configurable.ptcToolMap){
   result.configurable.ptcToolMap=withoutSearch(
    backend.configurable.ptcToolMap);
   result.configurable.ptcToolMap?.set?.('search',search);
  }
 }
 return result;
}
function wrapLoad(load,execute){return async params=>{
 const selection=await snapshot(params.req);
 const tools=[...(params.agent.tools||[])];
 if(selection==='web'&&!tools.some(t=>nameOf(t)==='web_search'))
  tools.push('web_search');
 const internal={...params,agent:{...params.agent,tools}};
 const backend=await load(internal);
 if(!backend)return backend;
 const dispatch=bind(selection,internal,backend,execute);
 const search=createSearch(dispatch);
 params.req._unifiedSearch={dispatch,search};
 const result=expose(backend,search);
 return result;
};}
function wrapExecution(execute){return async params=>{
 const names=params.toolNames||[];
 const ordinary=names.filter(name=>!isSearch(name));
 const result=ordinary.length
  ?await execute({...params,toolNames:ordinary,
     toolRegistry:withoutSearch(params.toolRegistry)})
  :{loadedTools:[],configurable:{}};
 result.loadedTools=result.loadedTools||[];
 result.configurable=result.configurable||{};
 if(names.includes('search')){
  const search=params.req._unifiedSearch?.search;
  if(!search)throw Error('Search interface was not initialized');
  result.loadedTools.push(search);
  result.configurable.ptcToolMap?.set('search',search);
 }
 for(const name of names){
  if(name!=='search'&&isSearch(name))
   throw Error('Unknown tool; use search(query)');
 }
 return result;
};}
module.exports={wrapLoad,wrapExecution};
