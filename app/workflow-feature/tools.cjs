'use strict';
const fs=require('fs');
const NAME='research_files';
const diag=require('./diagnostics.cjs');
const {CODE_EXECUTION_TOOLS}=require('/app/node_modules/@librechat/agents/dist/cjs/common/enum.cjs');
if(!(CODE_EXECUTION_TOOLS instanceof Set))throw Error('Code tool registry unavailable');
CODE_EXECUTION_TOOLS.add(NAME);
CODE_EXECUTION_TOOLS.add('edit_file');

const description='Read all research source files together for a coherent whole-manuscript plan; perform exact, hash-checked text edits and verify deliverables. Chat versions take priority. Never regenerate an entire file to transfer it to a project.';
const parameters={type:'object',properties:{request:{type:'string',description:'JSON: {action:"read_all",names:["body.tex","refs.bib"]} (omit names for inventory; reread_reason allows necessary repeated reads); {action:"edit_text",input:"body.tex",sha256:"from read",edits:[{old:"exact unique passage",new:"replacement",context_before:"optional exact preceding text",context_after:"optional exact following text"}],allow_structure_change:false}; {action:"verify",names:["body.tex"]}. Without names read_all lists files only. With names it returns full text, XLSX/XLSM cells with addresses, hashes, and explicit omissions. Use manuscript_word for tracked DOCX edits.'}},required:['request'],additionalProperties:false};
const def={name:NAME,description,parameters};
function make(bash,req){
 const {DynamicStructuredTool}=require('@librechat/agents/langchain/tools');const {z}=require('zod');
 return new DynamicStructuredTool({name:NAME,description,responseFormat:'content_and_artifact',schema:z.object({request:z.string()}),func:async (args,manager,config)=>{
  const a=JSON.parse(args.request);if(!['read_all','edit_text','verify'].includes(a.action))throw Error('Invalid manuscript action');
  if(Number(config?.metadata?.langgraph_step)>=46 && a.action!=='verify')throw Error('Final verification phase: only verify is allowed');
  const source=fs.readFileSync('/app/workflow-feature/research_files.py');
  const bundleName='research-read-'+require('crypto').randomUUID()+'.json';
  const payload=Buffer.from(JSON.stringify(a)).toString('base64');
  const program="import base64,json,zlib,traceback\nns={'__name__':'word_passes'}\ntry:\n exec(base64.b64decode('"+source.toString('base64')+"'),ns)\n result=ns['main'](json.loads(base64.b64decode('"+payload+"')))\nexcept Exception as e:\n result={'error':type(e).__name__+': '+str(e),'complete':False}\n"+(a.action==='read_all'?"packed=base64.b64encode(zlib.compress(json.dumps(result,ensure_ascii=False).encode())).decode()\nopen('/mnt/data/"+bundleName+"','w').write(json.dumps({'zlib_base64':packed}))\nprint('Research bundle prepared')":"print(json.dumps(result,ensure_ascii=False))");
  const py="import base64;exec(base64.b64decode('"+Buffer.from(program).toString('base64')+"'))";
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
  if(a.action==='read_all'){
   const f=result.artifact?.files?.find(f=>f.name===bundleName);
   if(!f){const detail=typeof result.content==='string'?result.content:JSON.stringify(result.content);throw Error('Research reader failed before delivery: '+detail.slice(-3500));}
   const response=await require('~/server/services/Files/Code/crud').getCodeOutputDownloadStream(encodeURIComponent(f.storage_session_id||result.artifact.session_id)+'/'+encodeURIComponent(f.id),{kind:'user',id:String(req.user.id)},req);
   const chunks=[];let size=0;for await(const b of response.data){size+=b.length;if(size>12000000){response.data.destroy();throw Error('Research bundle too large');}chunks.push(b);}
   const envelope=JSON.parse(Buffer.concat(chunks).toString('utf8'));const raw=envelope.zlib_base64?require('zlib').inflateSync(Buffer.from(envelope.zlib_base64,'base64'),{maxOutputLength:12000000}).toString('utf8'):JSON.stringify(envelope);JSON.parse(raw);
   const parsed=JSON.parse(raw);if(parsed.error)throw Error('Research reader: '+parsed.error);
   const warnings=req.__workflowWarnings||[];
   return [JSON.stringify({warnings,...diag.reads(req,JSON.parse(raw),a.reread_reason)}),{...result.artifact,files:result.artifact.files.filter(x=>x.name!==bundleName)}];
  }
  return [result.content,result.artifact];

 }});
}
const instructions='RESEARCH WORKFLOW: Edit existing chat text/LaTeX files in place under the SAME filename. Do not create revised, v2, pass or other suffix copies. Use research_files edit_text; omit output. Use /mnt/data/work for necessary cross-call scratch files, recreate the directory with mkdir before writing, and use supported .json/.txt/.py extensions. Hidden directories and /tmp do NOT persist. Do not create scratch files when an in-memory operation suffices. An editing task is not completed by returning a code block or replacement text. Save the requested edits using edit_text and deliver the resulting file; if saving fails, report that failure explicitly. Deliver only the requested updated file(s), identifying their exact original filenames. Verification here means successful saving, readable file bytes and delivery, not an unsolicited manuscript-accuracy audit. User performs the scholarly review. For spreadsheets use research_files read_all: it reads actual cells despite incorrect worksheet dimensions or missing drawings. Do not debug openpyxl or reimplement workbook extraction. Do not audit every count unless the user explicitly requested that audit. After sufficient reading, perform the requested edits rather than repeatedly announcing or checking them. Use research_files read_all with explicit names to read the relevant research files together and retain whole-manuscript context. Use one coherent revision plan. Multiple academic searches are allowed; reuse already verified facts where useful. Use research_files edit_text for hash-checked exact replacements in text/LaTeX; use manuscript_word for tracked DOCX edits. Prefer current chat files over project masters. Edits remain chat artifacts; project_files save_chat transfers exact saved bytes only when a project update is requested. Never regenerate file contents for saving. Report recovery warnings explicitly and tell users to review and merge changes into Project Files. Work within 50 graph steps: finish changes before step 46; reserve the final phase for verification and delivery, disclosing any incomplete work.';
const watched=new WeakSet();
function observe(bash,req){
 if(!bash||!req||watched.has(bash))return;watched.add(bash);
 diag.observe(bash,req);
}
function wrapLoad(load){return async p=>{const r=await load(p);if(!r||!p.req?.user?.id||!p.agent?.tools?.includes('execute_code'))return r;
 r.toolContextMap={...r.toolContextMap,research_files:instructions};
 r.toolDefinitions=[...(r.toolDefinitions||[]).filter(t=>t.name!==NAME),def];
 r.toolRegistry=new Map(r.toolRegistry||[]);r.toolRegistry.set(NAME,def);
 if(p.definitionsOnly===false){const bash=r.tools?.find(t=>t.name==='bash_tool');if(bash){observe(bash,p.req);r.tools.push(make(bash,p.req));}}
 return r;};}
function wrapExecution(load){return async p=>{const wanted=p.toolNames.includes(NAME);if(wanted&&(!p.req?.user?.id||!p.agent?.tools?.includes('execute_code')))throw Error('Code execution permission required');const names=p.toolNames.filter(n=>n!==NAME);if(wanted&&!names.includes('bash_tool'))names.push('bash_tool');const r=await load({...p,toolNames:names});observe(r.loadedTools?.find(t=>t.name==='bash_tool'),p.req);if(wanted){const bash=r.loadedTools.find(t=>t.name==='bash_tool');if(!bash)throw Error('Existing bash tool unavailable');const t=make(bash,p.req);r.loadedTools.push(t);r.configurable?.ptcToolMap?.set(NAME,t);}return r;};}
module.exports={wrapLoad,wrapExecution,make,def};
