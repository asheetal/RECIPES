'use strict';
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const filename=process.argv[2];let row,valid=true,deleted=1,deletes=0;
const sandbox={module:{exports:{}},require:(name)=>{
 if(name==='@librechat/api')return {getInvite:async()=>row};
 if(name==='~/models')return {findToken(){},createToken(){},deleteTokens:async()=>{deletes++;return {deletedCount:deleted};}};
 if(name==='~/strategies/validators')return {registerSchema:{safeParse:()=>({success:valid})}};
 throw Error(name);
}};
vm.runInNewContext(fs.readFileSync(filename,'utf8'),sandbox);const check=sandbox.module.exports;
async function call(){let next=false;const req={body:{token:'abc',email:'a@b.com'}},res={code:200,status(n){this.code=n;return this;},json(x){this.body=x;return this;}};await check(req,res,()=>next=true);return {next,req,res};}
(async()=>{
 row={token:'hash',expiresAt:new Date(Date.now()-1000)};assert.equal((await call()).res.code,400);assert.equal(deletes,0);
 row={token:'hash',expiresAt:new Date(Date.now()+10000)};valid=false;assert.equal((await call()).res.code,400);assert.equal(deletes,0);
 valid=true;deleted=0;assert.equal((await call()).res.code,400);
 deleted=1;const ok=await call();assert(ok.next);assert.equal(ok.req.invite.token,'hash');
 console.log('PASS: expired, malformed, reused and valid invitation handling.');
})().catch(e=>{console.error(e);process.exitCode=1;});
