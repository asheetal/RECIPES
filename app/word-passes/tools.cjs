'use strict';
const fs=require('fs');
const NAME='manuscript_word';
const {CODE_EXECUTION_TOOLS}=require('/app/node_modules/@librechat/agents/dist/cjs/common/enum.cjs');
if(!(CODE_EXECUTION_TOOLS instanceof Set))throw Error('Code tool registry unavailable');
CODE_EXECUTION_TOOLS.add(NAME);

const description='Read an entire Word manuscript with stable paragraph IDs, accepted tracked-change text, comments and auxiliary text; apply a planned whole-document revision pass with tracked edits. Read whole document first, formulate one coherent plan, then conduct sequential passes and review the whole saved output. Never repeatedly reconstruct DOCX XML. Protected spans return explicit limitations.';
const parameters={"type":"object","properties":{"action":{"type":"string","enum":["read","apply"]},"input":{"type":"string"},"output":{"type":"string"},"sha256":{"type":"string"},"plan":{"type":"string"},"pass_name":{"type":"string"},"start":{"type":"integer","minimum":0},"limit":{"type":"integer","minimum":1},"edits":{"type":"array","minItems":1,"items":{"type":"object","properties":{"id":{"type":"string"},"old":{"type":"string"},"new":{"type":"string"}},"required":["id","old","new"],"additionalProperties":false}}},"required":["action","input"],"additionalProperties":false};
const def={name:NAME,description,parameters};
function make(bash){
 const {DynamicStructuredTool}=require('@librechat/agents/langchain/tools');const {z}=require('zod');
 return new DynamicStructuredTool({name:NAME,description,responseFormat:'content_and_artifact',schema:z.preprocess(normalizeTyped,typedSchema(z,parameters).catch(ctx=>({__inputError:ctx.error.issues.map(e=>e.path.join('.')+': '+e.message).join('; ')}))),func:async (args,manager,config)=>{
  const a=args;const invalid=argumentError(a);if(invalid)return repairResult(invalid);
  const source=fs.readFileSync('/app/word-passes/word_passes.py');
  const payload=Buffer.from(JSON.stringify(a)).toString('base64');
  const py="import base64,json;ns={'__name__':'word_passes'};exec(base64.b64decode('"+source.toString('base64')+"'),ns);print(json.dumps(ns['main'](json.loads(base64.b64decode('"+payload+"'))),ensure_ascii=False))";
  const command='/usr/bin/python3 -c '+"'"+py.replaceAll("'","'\\''")+"'";
  
  const context=config?.toolCall ?? {};
  const result=await bash.invoke({
    ...context,
    type:'tool_call',
    id:context.id || 'manuscript-word-execution',
    name:'bash_tool',
    args:{command}
  },config);
  if(!result || typeof result!=='object' || !('content' in result))
    throw Error('Code executor returned no ToolMessage');
  if(result.status==='error')
    throw Error(typeof result.content==='string' ? result.content : JSON.stringify(result.content));
  return [result.content,result.artifact];

 }});
}
const instructions="manuscript_word reads DOCX paragraphs and applies tracked edits. Continue paginated reads using next_start until null. Use returned paragraph IDs and editable ranges. For partial results, report rejected edits and use the actual saved output path. Preserve existing revisions and comments."; 
function wrapLoad(load){return async p=>{const r=await load(p);if(!r||!p.req?.user?.id||!p.agent?.tools?.includes('execute_code'))return r;
 r.toolContextMap={...r.toolContextMap,manuscript_word:instructions};
 r.toolDefinitions=[...(r.toolDefinitions||[]).filter(t=>t.name!==NAME),def];
 r.toolRegistry=new Map(r.toolRegistry||[]);r.toolRegistry.set(NAME,def);
 if(p.definitionsOnly===false){const bash=r.tools?.find(t=>t.name==='bash_tool');if(bash)r.tools.push(make(bash));}
 return r;};}
function wrapExecution(load){return async p=>{const wanted=p.toolNames.includes(NAME);if(wanted&&(!p.req?.user?.id||!p.agent?.tools?.includes('execute_code')))throw Error('Code execution permission required');const names=p.toolNames.filter(n=>n!==NAME);if(wanted&&!names.includes('bash_tool'))names.push('bash_tool');const r=await load({...p,toolNames:names});if(wanted){const bash=r.loadedTools.find(t=>t.name==='bash_tool');if(!bash)throw Error('Existing bash tool unavailable');const t=make(bash);r.loadedTools.push(t);r.configurable?.ptcToolMap?.set(NAME,t);}return r;};}
module.exports={wrapLoad,wrapExecution,make,def};


function normalizeTyped(raw){
 try{
  let a=typeof raw==='string'?JSON.parse(raw):raw;
  if(a&&typeof a==='object'&&!Array.isArray(a)&&a.request!==undefined){if(Object.keys(a).length!==1)throw Error('Do not combine request wrapper with other fields');a=typeof a.request==='string'?JSON.parse(a.request):a.request;}
  if(a&&typeof a.action==='string'&&a.action.trim().startsWith('{')){const inner=JSON.parse(a.action);for(const k of Object.keys(a))if(k!=='action'&&JSON.stringify(a[k])!==JSON.stringify(inner[k]))throw Error('Conflicting action wrapper');a=inner;}
  if(!a||typeof a!=='object'||Array.isArray(a))throw Error('Expected an object');
  a={...a};for(const k of ['names','edits'])if(typeof a[k]==='string')a[k]=JSON.parse(a[k]);
  return a;
 }catch(e){return {__inputError:e.message};}
}
function typedSchema(z,s){
 let v;
 if(s.type==='object'){const shape={};for(const [k,p] of Object.entries(s.properties))shape[k]=(s.required||[]).includes(k)?typedSchema(z,p):typedSchema(z,p).optional();v=z.object(shape).strict();}
 else if(s.type==='array'){v=z.array(typedSchema(z,s.items));if(s.minItems)v=v.min(s.minItems);}
 else if(s.type==='boolean')v=z.boolean();
 else if(s.type==='integer'){v=z.number().int();if(s.minimum!==undefined)v=v.min(s.minimum);}
 else v=s.enum?z.enum(s.enum):z.string();
 return v;
}
function argumentError(a){
 if(a.__inputError)return a.__inputError;
 const required=a.action==='edit_text'?['input','sha256','edits']:a.action==='apply'?['input','output','sha256','plan','pass_name','edits']:['deliver','verify'].includes(a.action)?['names']:[];
 for(const k of required)if(a[k]===undefined||a[k]===''||Array.isArray(a[k])&&!a[k].length)return 'Missing required field: '+k;
 if(a.sha256!==undefined&&!/^[a-f0-9]{64}$/i.test(a.sha256))return 'sha256 must be the 64-character hash returned by reading the current file';
 if(a.names?.some(n=>!n.trim()))return 'names must contain nonempty filenames';
 if(['apply','edit_text'].includes(a.action)&&a.edits?.some(e=>!e.old||e.id!==undefined&&!e.id.trim()))return 'Each edit needs nonempty old text and, for Word, a paragraph id';
 return null;
}
function repairResult(error){return [JSON.stringify({status:'invalid_arguments',retryable:true,error,instruction:'Correct the typed tool arguments and retry. No files were changed.'}),{}];}

module.exports.schemaContract={parameters,normalizeTyped,typedSchema,argumentError};
