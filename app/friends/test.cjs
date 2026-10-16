'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),crypto=require('node:crypto');
const core=require('./core.cjs');
assert.equal(core.sixMonths('2026-08-31T12:30:00Z').toISOString(),'2027-02-28T12:30:00.000Z');
assert.equal(core.sixMonths('2027-08-31T12:30:00Z').toISOString(),'2028-02-29T12:30:00.000Z');
const now=Date.now();assert(core.allowed(null));assert(!core.allowed({state:'active',expiresAt:new Date(now)},now));assert(core.due({state:'active',expiresAt:new Date(now+14*core.DAY)},now));assert(!core.due({state:'active',expiresAt:new Date(now+15*core.DAY)},now));
const c=core.newCode();assert.equal(core.codeHash(c),core.codeHash(c.toLowerCase()));assert.equal(core.codeHash('guess'),null);
const data={users:[],lab_friends:[],lab_friend_codes:[]};
function match(row,q){return Object.entries(q).every(([k,v])=>{if(k==='$or')return v.some(x=>match(row,x));const a=row[k];if(v&&typeof v==='object'&&!(v instanceof Date)&&!(v instanceof ObjectId)){return Object.entries(v).every(([op,b])=>op==='$gt'?a>b:op==='$gte'?a>=b:op==='$lte'?a<=b:op==='$lt'?a<b:op==='$exists'?(a!==undefined)===b:op==='$in'?b.includes(a):false);}return String(a)===String(v);});}
function collection(name){const rows=data[name]??(data[name]=[]);return {
 async findOne(q){return rows.find(x=>match(x,q))||null;},
 find(q){let found=rows.filter(x=>match(x,q));return {sort(){return this;},limit(n){found=found.slice(0,n);return this;},async toArray(){return found.map(x=>({...x}));}};},
 async insertOne(x){if(rows.some(r=>String(r._id)===String(x._id)))throw Error('duplicate');rows.push({...x});},
 async findOneAndUpdate(q,u){const r=rows.find(x=>match(x,q));if(!r)return null;Object.assign(r,u.$set||{});for(const k of Object.keys(u.$unset||{}))delete r[k];return {...r};},
 async updateOne(q,u){return {matchedCount:(await this.findOneAndUpdate(q,u))?1:0};},
 async deleteOne(q){const i=rows.findIndex(x=>match(x,q));if(i<0)return {deletedCount:0};rows.splice(i,1);return {deletedCount:1};},
 async deleteMany(q){for(let i=rows.length-1;i>=0;i--)if(match(rows[i],q))rows.splice(i,1);},async createIndex(){}
};}
class ObjectId{constructor(s){this.s=s||crypto.randomBytes(12).toString('hex');}toString(){return this.s;}}
let mailed=0,deleted=0,failDelete=false,failMail=false;
const mocks={
 './core.cjs':core,mongoose:{Types:{ObjectId},connection:{readyState:1,collection}},
 '~/models':{deleteAllUserSessions:async()=>{}},
 '@librechat/api':{GenerationJobManager:{getActiveJobIdsForUser:async()=>[],abortJob:async()=>{}}},
 '~/server/services/Config':{getAppConfig:async()=>({})},
 '~/strategies/validators':{registerSchema:{safeParse:x=>({success:Boolean(x.email&&x.password),data:x})}},
 '~/server/services/AuthService':{registerUser:async(x,extra)=>{await collection('users').insertOne({...x,...extra});return {status:200,message:'Verify email'};}},
 '~/server/utils':{sendEmail:async()=>{if(failMail)throw Error('SMTP offline');mailed++;}},
 '~/server/controllers/UserController':{deleteAdminUserController:async(req,res)=>{if(failDelete)return res.status(500).json({});await collection('users').deleteOne({_id:req.user._id});deleted++;return res.status(200).send({});}},
};
const moduleObject={exports:{}};
vm.runInNewContext(fs.readFileSync(__dirname+'/runtime.cjs','utf8'),{module:moduleObject,require:n=>mocks[n]||require(n),console,process:{env:{DOMAIN_CLIENT:'https://tryfind.me/ai'}},Date,URL,setInterval,Buffer},{filename:'runtime.cjs'});
const api=moduleObject.exports;
function res(){return {code:200,status(n){this.code=n;return this;},json(x){this.body=x;return this;},send(x){this.body=x;return this;}};}
(async()=>{
 let r=res();await api.generate({user:{id:'a'.repeat(24)}},r);assert(r.body.registrationURL==='https://tryfind.me/ai/register?friend=1');const code=r.body.code;
 assert.equal(+new Date(r.body.expiresAt)-+data.lab_friend_codes[0].createdAt,7*core.DAY);assert(!JSON.stringify(data.lab_friend_codes).includes(code));
 const request={body:{token:code,email:'friend@example.test',password:'password',name:'Friend'}};
 const a=res(),b=res();await Promise.all([api.register(request,a,()=>{}),api.register(request,b,()=>{})]);assert.equal([a,b].filter(x=>x.code===200).length,1);assert.equal(data.users.length,1);assert.equal(data.lab_friends[0].state,'active');assert.equal(data.users[0].role,'USER');
 const id=data.lab_friends[0]._id;let passed=false;await api.gate({user:{id}},res(),()=>passed=true);assert(passed);
 data.lab_friends[0].expiresAt=new Date(Date.now()-1);r=res();await api.gate({user:{id}},r,()=>assert.fail('expired admitted'));assert.equal(r.code,403);
 data.lab_friends[0].expiresAt=new Date(Date.now()+13*core.DAY);failMail=true;await api.sweep();assert.equal(data.lab_friends[0].remindedAt,undefined);failMail=false;await api.sweep();await api.sweep();assert.equal(mailed,1);
 r=res();await api.convert({params:{id}},r);assert.equal(r.code,200);assert.equal(data.lab_friends.length,0);await api.sweep();assert.equal(deleted,0);
 await collection('lab_friends').insertOne({_id:id,state:'deleting',deleteAfter:new Date(0)});r=res();await api.convert({params:{id}},r);assert.equal(r.code,409);
 failDelete=true;await api.sweep();assert.equal(data.users.length,1);assert.equal(data.lab_friends.length,1);failDelete=false;await api.sweep();assert.equal(data.users.length,0);assert.equal(data.lab_friends.length,0);
 r=res();await api.admin({user:{id}},r,()=>assert.fail('nonadmin admitted'));assert.equal(r.code,403);
 let next=false;await api.register({body:{}},res(),()=>next=true);assert(next);
 r=res();await api.generate({user:{id}},r);const expired=r.body.code;data.lab_friend_codes[0].expiresAt=new Date(0);r=res();await api.register({body:{token:expired,email:'new@example.test',password:'password'}},r,()=>assert.fail());assert.equal(r.code,400);
 assert.equal(mailed,1);console.log('PASS: single-use redemption, seven-day expiry, calendar months, access blocking, reminder deduplication, conversion, cleanup retry and admin checks (mock database/mail).');
})().catch(e=>{console.error(e);process.exitCode=1;});
