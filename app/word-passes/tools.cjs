'use strict';
const fs=require('fs');
const NAME='manuscript_word';
const {CODE_EXECUTION_TOOLS}=require('/app/node_modules/@librechat/agents/dist/cjs/common/enum.cjs');
if(!(CODE_EXECUTION_TOOLS instanceof Set))throw Error('Code tool registry unavailable');
CODE_EXECUTION_TOOLS.add(NAME);

const description='Read an entire Word manuscript with stable paragraph IDs, accepted tracked-change text, comments and auxiliary text; apply a planned whole-document revision pass with tracked edits. Read whole document first, formulate one coherent plan, then conduct sequential passes and review the whole saved output. Never repeatedly reconstruct DOCX XML. Protected spans return explicit limitations.';
const parameters={type:'object',properties:{request:{type:'string',description:'JSON object. read: {action:"read",input:"file.docx"}; returns full text, IDs and sha256. apply: {action:"apply",input:"file.docx",output:"pass1.docx",sha256:"from read",plan:"whole-manuscript plan",pass_name:"copyediting",edits:[{id:"p000001",old:"exact unique phrase",new:"replacement"}]}. One edit per paragraph per pass. Existing revisions, fields, hyperlinks, comment boundaries and mixed formatting are protected. Each pass creates a new file; never overwrite originals. Optional start/limit for read only if tool output truncates; complete all ranges before editing.'}},required:['request'],additionalProperties:false};
const def={name:NAME,description,parameters};
function make(bash){
 const {DynamicStructuredTool}=require('@librechat/agents/langchain/tools');const {z}=require('zod');
 return new DynamicStructuredTool({name:NAME,description,responseFormat:'content_and_artifact',schema:z.object({request:z.string()}),func:async (args,manager,config)=>{
  const a=JSON.parse(args.request);if(!['read','apply'].includes(a.action))throw Error('Invalid manuscript action');
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
const instructions="Read manuscript pages using next_start exactly until null; never skip ahead based on truncated text. Preserve whole-document context for each editorial pass. If a requested output filename exists, manuscript_word selects a new filename and returns its actual output path. For HTTP 429 search errors, do not repeat searches immediately; report reference verification unavailable. " + "WORD EDITING UPDATE: manuscript_word always enables Word Track Changes and records replacements as revisions. read returns editable_ranges as character offsets to avoid protected/mixed-format spans. apply may return status partial and rejected_edits; safe edits are saved. Do not retry the entire pass or fall back to rewriting XML. Review the saved output and disclose blocked edits. Preserve one coherent whole-manuscript plan. Use manuscript_word for DOCX editing; never switch tracking off. " + 'WORD MANUSCRIPTS: use manuscript_word instead of ad hoc Python/XML extraction or repeated read_file dumps. Read all manuscript paragraphs and auxiliary text before deciding revisions. Maintain one coherent plan, perform sequential whole-document passes appropriate to the user request, then read the full final document and assess coherence. A tool call can submit many paragraph edits together without splitting editorial context. Reuse the saved pass output and hash as checkpoints. Do not repeat identical reads; if a protected edit fails, remove that edit, report its limitation, and complete the safe edits. Never claim every edit succeeded when any were excluded. Do not accept or erase existing revisions/comments. No fixed number of cosmetic passes is required. Deliver the verified DOCX through the existing file attachment mechanism.';
function wrapLoad(load){return async p=>{const r=await load(p);if(!r||!p.req?.user?.id||!p.agent?.tools?.includes('execute_code'))return r;
 r.toolContextMap={...r.toolContextMap,manuscript_word:instructions};
 r.toolDefinitions=[...(r.toolDefinitions||[]).filter(t=>t.name!==NAME),def];
 r.toolRegistry=new Map(r.toolRegistry||[]);r.toolRegistry.set(NAME,def);
 if(p.definitionsOnly===false){const bash=r.tools?.find(t=>t.name==='bash_tool');if(bash)r.tools.push(make(bash));}
 return r;};}
function wrapExecution(load){return async p=>{const wanted=p.toolNames.includes(NAME);if(wanted&&(!p.req?.user?.id||!p.agent?.tools?.includes('execute_code')))throw Error('Code execution permission required');const names=p.toolNames.filter(n=>n!==NAME);if(wanted&&!names.includes('bash_tool'))names.push('bash_tool');const r=await load({...p,toolNames:names});if(wanted){const bash=r.loadedTools.find(t=>t.name==='bash_tool');if(!bash)throw Error('Existing bash tool unavailable');const t=make(bash);r.loadedTools.push(t);r.configurable?.ptcToolMap?.set(NAME,t);}return r;};}
module.exports={wrapLoad,wrapExecution,make,def};
