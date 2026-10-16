'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
const core=require('./core.cjs'),policy=require('./policy.cjs');
const text='I prefer US English',fact={key:'english_variant',value:'The user prefers US English',kind:'explicit',category:'preference',scope:'lasting',importance:3,evidence:text};
assert.equal(policy.validFacts([{...fact,category:'research'},{...fact,scope:'task'},fact]).length,1);
for(const b of [{isRegenerate:true},{isEdited:true},{_labPersonaSkip:true},{isContinued:true},{editedContent:{}},{isTemporary:true}])assert(policy.skip(b));
assert(!policy.skip({}));assert.equal(policy.digest('hello  world'),policy.digest(' hello world '));
let s=core.fresh('one'),start=Date.now();s=core.merge(s,{epoch:s.epoch,startedAt:start,digest:'1'},core.cleanFacts([fact],text));assert(s.entries[0].protected);assert(s.entries[0].personaReviewed);
s=core.merge(s,{epoch:s.epoch,startedAt:start+1,digest:'2'},[{...fact,value:'The user prefers UK English'}]);assert.equal(s.entries[0].value,'The user prefers UK English');
assert.equal(core.cleanFacts([{...fact,category:'temporary'}],text).length,0);
assert(!core.context({...core.fresh('x'),entries:[{key:'paper',value:'One-off project',category:'research',protected:true}]}).includes('One-off'));
const documents=new Map(),ledger=new Map();let calls=0,payload;
const col={async updateOne(q,u){if(!documents.has(q._id)&&u.$setOnInsert)documents.set(q._id,structuredClone(u.$setOnInsert));return {modifiedCount:1};},async findOne(q){return structuredClone(documents.get(q._id)||null);},async replaceOne(q,n){const old=documents.get(q._id);if(old?.epoch!==q.epoch||old?.revision!==q.revision)return {modifiedCount:0};documents.set(q._id,structuredClone(n));return {modifiedCount:1};}};
const claim={async insertOne(d){if(ledger.has(d._id)){const e=Error('duplicate');e.code=11000;throw e;}ledger.set(d._id,d);}};
const fakeERP={available:()=>true,complete:async(messages)=>{calls++;payload=JSON.parse(messages[1].content);return {choices:[{message:{content:JSON.stringify({facts:[fact]})}}]};}};
function loadRuntime(){const m={exports:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/runtime.cjs','utf8'),{module:m,require:n=>n==='./core.cjs'?core:n==='./policy.cjs'?policy:n==='mongoose'?{connection:{collection:name=>name==='lab_persona_calls'?claim:col}}:n==='/app/admin-tools/role-gateway.cjs'?{complete:(role,...args)=>fakeERP.complete(...args),available:(role,...args)=>fakeERP.available(...args)}:require(n),console,Date,Promise,JSON,process});return m.exports;}
const wait=()=>new Promise(r=>setTimeout(r,20));
function client(t,id='m1',extra={}){return {options:{req:{user:{id:'user1'},_labMemoryStartedAt:Date.now(),body:{text:t,messageId:id,files:[{content:'DO NOT LEARN ATTACHMENTS'}],...extra}}}};}
(async()=>{
 let rt=loadRuntime();await Promise.all([rt.useMemory(client(text)),rt.useMemory(client(text))]);await wait();assert.equal(calls,1);assert.equal(payload.new_user_message,text);assert(!JSON.stringify(payload).includes('ATTACHMENTS'));
 rt=loadRuntime();await rt.useMemory(client(text));await rt.useMemory(client(text+' changed','m1'));await rt.useMemory(client('edited prompt','m2',{_labPersonaSkip:true}));await rt.useMemory(client(text,'m3'));await wait();assert.equal(calls,1);
 await rt.useMemory(client('A new ordinary task','m4'));await wait();assert.equal(calls,2);assert.equal(payload.existing_memory.length,1);
 // A failed provider call is also not repeated by resubmission.
 fakeERP.complete=async()=>{calls++;throw Error('offline');};await rt.useMemory(client('Another new prompt','m5'));await wait();await rt.useMemory(client('Another new prompt','m5'));await wait();assert.equal(calls,3);
 console.log('PASS: weighted preferences, corrections, scope filtering, text-only input, concurrent/restarted/repeated/edited prompt suppression and one attempt after provider failure.');
})().catch(e=>{console.error(e);process.exitCode=1;});
