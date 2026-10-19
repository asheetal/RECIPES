'use strict';
const fs=require('fs');
const NAME='research_files';
const diag=require('./diagnostics.cjs');
const handshake=require('/app/admin-tools/json-handshake.cjs');
const {CODE_EXECUTION_TOOLS}=require('/app/node_modules/@librechat/agents/dist/cjs/common/enum.cjs');
if(!(CODE_EXECUTION_TOOLS instanceof Set))throw Error('Code tool registry unavailable');
CODE_EXECUTION_TOOLS.add(NAME);
CODE_EXECUTION_TOOLS.add('edit_file');

const description="List or read files, apply exact edits, verify saves, or deliver files. For action edit_text you MUST supply input, sha256, and edits. Copy sha256 from the latest read of that exact input file; never omit or invent it. If the file changed, reread it before editing.";
const parameters={"type":"object","properties":{"action":{"type":"string","enum":["read_all","edit_text","verify","deliver","catalog","describe","query","fetch"],"description":"For edit_text, input, sha256, and edits are all required. Read the exact file first."},"names":{"type":"array","items":{"type":"string"}},"name":{"type":"string","description":"Single file handle (alias for names=[<file>]). Accepted by all actions."},"input":{"type":"string","description":"Required for edit_text: the exact file handle to edit."},"sha256":{"type":"string","description":"Required for edit_text: copy this exact 64-character SHA256 from the latest read of input. Never omit, invent, or calculate a replacement hash."},"edits":{"type":"array","minItems":1,"items":{"type":"object","properties":{"old":{"type":"string"},"new":{"type":"string"},"context_before":{"type":"string"},"context_after":{"type":"string"}},"required":["old","new"],"additionalProperties":false},"description":"Required for edit_text: exact old/new replacements. Also supply input and its latest reader-returned sha256."},"allow_structure_change":{"type":"boolean"},"reread_reason":{"type":"string"},"sheet":{"type":"string","description":"For describe/query/fetch: sheet name; default first sheet."},"rows":{"type":"integer","description":"For describe: sample rows (default 5)."},"cols":{"type":"integer","description":"For describe: sample columns (default 10)."},"row_label":{"type":"string","description":"For query: filter by a value in column A (e.g. field name in a transposed sheet)."},"column_label":{"type":"string","description":"For query: filter by a value in row 1 (e.g. column header in a normal sheet)."},"equals":{"type":"string","description":"For query: exact-match cell value."},"contains":{"type":"string","description":"For query: keep only cells whose text contains this substring (case-insensitive). Use this instead of equals when cells hold paragraphs and you want records matching a keyword."},"contains_any":{"type":"array","items":{"type":"string"},"description":"For query: keep only cells whose text contains ANY of these substrings (case-insensitive). Use this when you need the union of several keyword variants — e.g. [\"belief\",\"tauhid\",\"monotheism\",\"one god\"] — instead of issuing several separate contains queries."},"in_values":{"type":"array","items":{"type":"string"},"description":"For query: keep only cells whose value equals one of these exact strings."},"regex":{"type":"string","description":"For query: keep only cells whose text matches this regular expression (case-insensitive). Use sparingly — prefer contains_any for keyword unions."},"aggregate":{"type":"string","enum":["count","sum","avg","min","max"],"description":"For query: instead of returning matched cells, return an aggregate over them. Combine with group_by=value to count cells per distinct value (a GROUP BY). Use this to obtain denominators: e.g. row_label=p1_present, aggregate=count, group_by=value returns {groups:[{value,\"count\"}], total}."},"group_by":{"type":"string","enum":["value"],"description":"For query with aggregate: group matches by their cell value before aggregating. Backend-neutral (SQL GROUP BY)."},"field":{"type":"string","description":"For query with aggregate: optional cell field to aggregate over (e.g. a numeric column when aggregating sum/avg/min/max). Not needed for count."},"count_only":{"type":"boolean","description":"For query: return only the match count, no per-row matches."},"limit":{"type":"integer","description":"For query: max matches to return."},"start":{"type":"string","description":"For fetch: start cell, e.g. A1."},"end":{"type":"string","description":"For fetch: end cell, e.g. M120."},"max_chars":{"type":"integer","description":"For fetch: cap on returned text (default 100000)."},"plan":{"type":"object","description":"REQUIRED from your second tool call onward (first call may omit). Your current case plan.","properties":{"outputs":{"type":"string","description":"What this case must produce."},"steps":{"type":"array","minItems":1,"items":{"type":"object","properties":{"n":{"type":"integer","minimum":1},"text":{"type":"string"},"done":{"type":"boolean"},"established":{"type":"string","description":"Required when done=true: what this step established."}},"required":["n","text","done"],"additionalProperties":false}},"current":{"type":"integer","minimum":1,"description":"The step number this specific tool call serves."},"changed":{"type":"string","description":"What changed since the last plan, or \"no change\"."}},"required":["outputs","steps","current","changed"],"additionalProperties":false}},"required":["action"],"additionalProperties":false};
const def={name:NAME,description,parameters};
function make(bash,req){
 const {DynamicStructuredTool}=require('@librechat/agents/langchain/tools');const {z}=require('zod');
 return new DynamicStructuredTool({name:NAME,description,responseFormat:'content_and_artifact',schema:z.preprocess(normalizeTyped,typedSchema(z,parameters).catch(ctx=>({__inputError:ctx.error.issues.map(e=>e.path.join('.')+': '+e.message).join('; ')}))),func:async (args,manager,config)=>{
  const a=args;const invalid=argumentError(a);if(invalid)return repairResult(invalid);const planErr=planError(a,req);if(planErr)return repairResult(planErr);if(a.plan){try{const P=require('/app/admin-tools/plan.cjs');P.set(req,P.formatFromStructured(a.plan));}catch(_e){}}
  if(a.action==='deliver'){
   const wf=require('/app/project-files-feature/workflow-files.cjs');
   return require('/app/file-redeliver.cjs').deliver(req,a.names,{chatFiles:wf.chatFiles,bytes:wf.bytes,upload:require('~/server/services/Files/Code/crud').uploadCodeEnvFile});
  }
  if(!require('/app/admin-tools/director.cjs').active(req) && Number(config?.metadata?.langgraph_step)>=46 && a.action!=='verify'){
   const remaining=[a.action==='edit_text'?'Apply '+(Array.isArray(a.edits)?a.edits.length:'the pending')+' remaining exact replacements to '+String(a.input||'the current chat file'):'Complete the pending '+a.action+' operation'];
   return [JSON.stringify({status:'paused',workflow_pause:{version:1,reason:'step_limit',remaining},instruction:'The execution budget is ending. Preserve saved work. Return the latest saved files and an explicit unfinished-work checklist. Begin the final response with Paused: work remaining. Do not claim completion or retry this edit in this run.'}),{}];
  }
   const source=Buffer.concat([require('/app/file-layer/index.cjs').readerSource(),Buffer.from('\n'),fs.readFileSync('/app/workflow-feature/research_files.py')]);
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
  if(result.status==='error')return [result.content,result.artifact||{}];
  if(a.action==='read_all'){
   const f=result.artifact?.files?.find(f=>f.name===bundleName);
   if(!f){const detail=typeof result.content==='string'?result.content:JSON.stringify(result.content);throw Error('Research reader failed before delivery: '+detail.slice(-3500));}
   let envelope;
   try {
     const response = await require("~/server/services/Files/Code/crud").getCodeOutputDownloadStream(
       encodeURIComponent(f.storage_session_id || result.artifact.session_id) + "/" + encodeURIComponent(f.id),
       { kind: "user", id: String(req.user.id) },
       req
     );
     const chunks = []; let size = 0;
     for await (const b of response.data) {
       size += b.length;
       if (size > 12000000) { response.data.destroy(); throw Error("Research bundle too large"); }
       chunks.push(b);
     }
     envelope = JSON.parse(Buffer.concat(chunks).toString("utf8"));
   } catch (dlErr) {
     const readRes = await bash.invoke({
       type: "tool_call",
       id: "read-bundle-fallback-" + Date.now(),
       name: "bash_tool",
       args: { command: "cat /mnt/data/" + bundleName }
     }, config);
     const rawContent = typeof readRes.content === "string" ? readRes.content : JSON.stringify(readRes.content);
     envelope = JSON.parse(rawContent.trim());
   }const raw=envelope.zlib_base64?require('zlib').inflateSync(Buffer.from(envelope.zlib_base64,'base64'),{maxOutputLength:12000000}).toString('utf8'):JSON.stringify(envelope);JSON.parse(raw);
   const parsed=JSON.parse(raw);if(parsed.error)throw Error('Research reader: '+parsed.error);
   const warnings=req.__workflowWarnings||[];
   return [JSON.stringify({warnings,...diag.reads(req,JSON.parse(raw),a.reread_reason)}),{...result.artifact,files:result.artifact.files.filter(x=>x.name!==bundleName)}];
  }
  return [result.content,result.artifact];

 }});
}
const instructions=require('/app/file-layer/index.cjs').instructions;
const watched=new WeakSet();
function observe(bash,req){
 if(!bash||!req||watched.has(bash))return;watched.add(bash);
 diag.observe(bash,req);
}
function wrapLoad(load){return async p=>{const r=await load(p);if(!r||!p.req?.user?.id)return r;
 r.toolContextMap={...r.toolContextMap,research_files:instructions};
 r.toolDefinitions=[...(r.toolDefinitions||[]).filter(t=>t.name!==NAME),def];
 r.toolRegistry=new Map(r.toolRegistry||[]);r.toolRegistry.set(NAME,def);
 if(p.definitionsOnly===false){const bash=r.tools?.find(t=>t.name==='bash_tool');if(bash){observe(bash,p.req);r.tools.push(make(bash,p.req));}}
 return r;};}
function wrapExecution(load){return async p=>{
  const wanted = p.toolNames.includes(NAME);
  const wantsBash = p.toolNames.includes("bash_tool");
  if((wanted || wantsBash) && (!p.req?.user?.id)) throw Error("Code execution permission required");
  const names = p.toolNames.filter(n => n !== NAME && n !== "bash_tool");
  const r = await load({ ...p, toolNames: names });
  if(!r.loadedTools) r.loadedTools = [];
  let bash = r.loadedTools.find(t => t.name === "bash_tool");
  if((wanted || wantsBash) && !bash){
    try {
      const { createBashExecutionTool } = require("@librechat/agents");
      const { getCodeApiAuthHeaders } = require("@librechat/api");
      bash = createBashExecutionTool({
        authHeaders: () => getCodeApiAuthHeaders(p.req),
      });
      r.loadedTools.push(bash);
      if(r.configurable?.ptcToolMap) r.configurable.ptcToolMap.set("bash_tool", bash);
    } catch(err) {
      throw Error("Existing bash tool unavailable: " + err.message);
    }
  }
  observe(bash, p.req);
  if(wanted){
    const t = make(bash, p.req);
    r.loadedTools.push(t);
    if(r.configurable?.ptcToolMap) r.configurable.ptcToolMap.set(NAME, t);
  }
  const policyBash = r.loadedTools?.find(t => t.name === "bash_tool");
  if(policyBash) wrapProjectWorkbookReads(policyBash, r.loadedTools.find(t => t.name === NAME) || make(policyBash, p.req));
  handshake.wrapTools(r.loadedTools);
  return r;
};}
module.exports={wrapLoad,wrapExecution,make,def};


function normalizeResearchArgs(args){
 if(!args||typeof args!=='object'||Array.isArray(args)||args.request!=null||typeof args.action!=='string'||!args.action.trim().startsWith('{'))return args;
 try{
  const inner=JSON.parse(args.action);
  if(!inner||Array.isArray(inner)||typeof inner!=='object'||!['read_all','edit_text','verify','deliver'].includes(inner.action))return args;
  for(const k of Object.keys(args))
   if(k!=='action'&&JSON.stringify(args[k])!==JSON.stringify(inner[k]))return args;
  return inner;
 }catch{return args;}
}


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
 return s.description?v.describe(s.description):v;
}
function argumentError(a){
 if(a.__inputError)return a.__inputError;
 const required=a.action==='edit_text'?['input','sha256','edits']:a.action==='apply'?['input','output','sha256','plan','pass_name','edits']:['deliver','verify'].includes(a.action)?['names']:[];
 for(const k of required)if(a[k]===undefined||a[k]===''||Array.isArray(a[k])&&!a[k].length)return 'Missing required field: '+k;
 if(['edit_text','apply'].includes(a.action)&&a.sha256!==undefined&&!/^[a-f0-9]{64}$/i.test(a.sha256))return 'sha256 must be the 64-character hash returned by reading the current file';
 if(a.names?.some(n=>!n.trim()))return 'names must contain nonempty filenames';
 if(['edit_text','apply'].includes(a.action)&&a.edits?.some(e=>!e.old||e.id!==undefined&&!e.id.trim()))return 'Each edit needs nonempty old text and, for Word, a paragraph id';
 return null;
}
function repairResult(error){return [JSON.stringify({status:'invalid_arguments',retryable:true,error,instruction:'Correct the typed tool arguments and retry. No files were changed.'}),{}];}
function planError(a,req){
 if(!req?.__workflow)return null;
 let p=a.plan;
 if(p===undefined||p===null)return 'Missing required field: plan. Every tool call (including your first) must carry your current case plan in the plan field. See the LIVE CASE PLAN instruction.';
 if(typeof p==='string'){try{p=JSON.parse(p);a.plan=p;}catch(_e){return 'plan must be an object or a JSON-stringified object';}}
 if(typeof p!=='object'||Array.isArray(p))return 'plan must be an object';
 if(typeof p.outputs!=='string'||!p.outputs.trim())return 'plan.outputs must be a non-empty string';
 if(!Array.isArray(p.steps)||!p.steps.length)return 'plan.steps must be a non-empty array';
 for(const st of p.steps){
  if(!Number.isInteger(st.n)||st.n<1)return 'plan step n must be a positive integer';
  if(typeof st.text!=='string'||!st.text.trim())return 'plan step text must be non-empty';
  if(typeof st.done!=='boolean')return 'plan step done must be boolean';
  if(st.done&&(!st.established||!String(st.established).trim()))return 'Completed plan steps (done=true) must include established text — what the step established';
 }
 if(!Number.isInteger(p.current)||p.current<1)return 'plan.current must be a positive integer';
 if(!p.steps.find(s=>s.n===p.current))return 'plan.current must reference an existing step number';
 if(typeof p.changed!=='string')return 'plan.changed must be a string (use "no change" if nothing changed)';
 return null;
}

module.exports.schemaContract={parameters,normalizeTyped,typedSchema,argumentError};

const workbookReadGuards=new WeakSet();
function wrapProjectWorkbookReads(bash,reader){
 if(!bash||!reader||workbookReadGuards.has(bash))return;
 workbookReadGuards.add(bash);
 const invoke=bash.invoke.bind(bash);
 bash.invoke=async function(input,config){
  const rawArgs=input?.type==="tool_call"?input.args:input; const args=typeof rawArgs==="string"?JSON.parse(rawArgs):rawArgs; if(!args||typeof args!=="object"||Array.isArray(args))throw Error("Invalid bash arguments: expected JSON object");
  const command=args?.command;
  if(typeof command==="string" && /\/usr\/bin\/ra-workbench\s+--help/.test(command)){
    const sanitizedCommand = command.replace(
      /\/usr\/bin\/ra-workbench\s+--help/g,
      "echo \"ra-workbench accepts JSON on stdin: create_docx, compile_latex, render_docx, compare\""
    );
    const patchedArgs = { ...args, command: sanitizedCommand };
    const patchedInput = input?.type === "tool_call" ? { ...input, args: patchedArgs } : patchedArgs;
    return invoke(patchedInput, config);
  }
  const refs=input?._injected_files||config?.toolCall?._injected_files||[];
  const names=[...new Set(refs.map(f=>f.name).filter(name=>
   typeof name==='string'&&/\.xlsx$/i.test(name)&&
   typeof command==='string'&&command.includes('/mnt/data/'+name)))];
  if(!names.length||!/\bopenpyxl\s*\.\s*load_workbook\s*\(/.test(command))
   return invoke(input,config);
  const message=await reader.invoke({
   ...input,type:'tool_call',id:input?.id||config?.toolCall?.id||require('node:crypto').randomUUID(),name:NAME,
   args:{action:'read_all',names}
  },config);
  if(typeof message?.content!=='string')
   throw Error('File reader returned no structured content');
  const r=handshake.receipt(message.content,message.artifact,NAME,message.status);
  r.tool='bash_tool';
  r.result={...(r.result&&typeof r.result==='object'?r.result:{value:r.result}),
   fileReadPolicy:{requestedTool:'bash_tool',commandExecuted:false,
    reader:NAME,names}};
  r.stdout+=(r.stdout?'\n':'')+
   'Direct workbook command was not executed. The workbook was read through research_files.';
  handshake.check(r);
  message.content=JSON.stringify(r);
  message.name='bash_tool';
  if(r.status==='error')message.status='error';
  return message;
 };
}
module.exports.wrapProjectWorkbookReads=wrapProjectWorkbookReads;
