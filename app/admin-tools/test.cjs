'use strict';
const assert=require('node:assert/strict');
const {makeHandlers}=require('./core.cjs');
const A='aaaaaaaaaaaaaaaaaaaaaaaa',U='bbbbbbbbbbbbbbbbbbbbbbbb';
const users={[A]:{_id:A,role:'ADMIN',email:'admin@example.com'},[U]:{_id:U,role:'USER',email:'user@example.com'}};
let removed=0,sends=0,link='',revoked=0;
const h=makeHandlers({getUser:async id=>users[id],findUser:async e=>e==='user@example.com',createInvite:async()=>encodeURIComponent('abc+/='),domain:()=> 'https://tryfind.me/ai/',send:async(e,l)=>{sends++;link=l;},revoke:async()=>{revoked++;},remove:async(req,res,t)=>{removed++;assert.equal(t._id,U);res.json({message:'deleted'});}});
function res(){return {code:200,body:null,status(c){this.code=c;return this;},json(x){this.body=x;return this;}};}
(async()=>{
 let r=res(),next=false;await h.admin({user:{id:U}},r,()=>next=true);assert.equal(r.code,403);assert.equal(next,false);
 r=res();await h.admin({user:{id:'cccccccccccccccccccccccc',role:'ADMIN'}},r,()=>next=true);assert.equal(r.code,403);
 const req={user:{id:A}};r=res();await h.admin(req,r,()=>next=true);assert(next);assert.equal(req.labAdmin._id,A);
 r=res();await h.invite({body:{email:'new@example.com'}},r);assert.equal(r.code,200);assert.equal(sends,1);assert.equal(new URL(link).pathname,'/ai/register');assert.equal(new URL(link).searchParams.get('token'),'abc+/=');
 r=res();await h.invite({body:{email:'new@example.com'}},r);assert.equal(r.code,429);
 r=res();await h.invite({body:{email:'user@example.com'}},r);assert.equal(r.code,409);
 r=res();await h.invite({body:{email:'bad\n@example.com'}},r);assert.equal(r.code,400);
 for(const [id,confirmEmail,status] of [[A,'admin@example.com',403],[U,'wrong@example.com',400],['bad','x',400]]){r=res();await h.remove({...req,params:{id},body:{confirmEmail}},r);assert.equal(r.code,status);}
 assert.equal(removed,0);r=res();await h.remove({...req,params:{id:U},body:{confirmEmail:'user@example.com'}},r);assert.equal(r.code,200);assert.equal(removed,1);
 const fail=makeHandlers({findUser:async()=>null,createInvite:async()=> 'abc',domain:()=> 'https://tryfind.me/ai',send:async()=>{throw Error('smtp secret');},revoke:async()=>revoked++});r=res();await fail.invite({body:{email:'other@example.com'}},r);assert.equal(r.code,502);assert.equal(revoked,1);assert(!JSON.stringify(r.body).includes('smtp secret'));
 console.log('PASS: admin authorization, invitation URL, duplicate/rate guards, mail failure, protected admins, deletion confirmation.');
})().catch(e=>{console.error(e);process.exitCode=1;});
