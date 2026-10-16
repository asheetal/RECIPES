const assert=require('assert'),fs=require('fs');
const {hash,check}=require('./files.cjs');
const b=Buffer.from('test');assert.equal(check(b,{filename:'a.tex',bytes:4}).length,4);
assert.throws(()=>check(b,{filename:'a.tex',bytes:3}));assert.throws(()=>check(b,{filename:'a.tex',metadata:{workflowSha256:'bad'}}));assert.throws(()=>check(Buffer.from([255]),{filename:'a.tex'}));assert.throws(()=>check(b,{filename:'a.docx'}));
const g=fs.readFileSync(__dirname+'/Graph.cjs','utf8');assert(g.includes('workflowStep >= 48'));assert(g.includes("workflowStep >= 46"));assert(g.includes('tools: toolsForBinding,\n\t\t\t\t\tmessages: finalMessages'));
const p=fs.readFileSync(__dirname+'/project-files.cjs','utf8');assert(!p.includes('await service().save(s, name, buffer'));assert(p.includes('workflow.prepare'));assert(p.includes('save_chat'));
(async()=>{const s=fs.readFileSync(__dirname+'/progress.js','utf8');const m=await import('data:text/javascript;base64,'+Buffer.from(s).toString('base64'));assert.equal(m.progressState([{type:'tool_call',tool_call:{name:'bash_tool',output:'done'}}]).status,'Waiting for model response…');assert.equal(m.progressState([{type:'tool_call',tool_call:{name:'bash_tool'}}]).status,'Running document tools…');console.log('PASS: file integrity, project protection, finish-phase wiring and status');})().catch(e=>{console.error(e);process.exitCode=1});
