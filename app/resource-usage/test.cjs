'use strict';
const assert=require('assert'),fs=require('fs'),os=require('os'),path=require('path'),http=require('http');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'resource-test-'));process.env.RESOURCE_USAGE_DIR=dir;
const preload=require('./preload.cjs'),{aggregate,route}=require('./runtime.cjs');
(async()=>{
let denied;await route({user:{role:'USER'}},{status(n){denied=n;return this;},json(){}});assert.equal(denied,403);
const server=http.createServer((q,r)=>{r.statusCode=q.url.startsWith('/fail')?503:200;r.end('ok');});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port;
try{
 await(await fetch(base+'/v1/test?api_key=TOP_SECRET')).text();
 await new Promise((resolve,reject)=>http.get(base+'/v1/native',r=>{r.resume();r.on('end',resolve);}).on('error',reject));
 await(await fetch(base+'/fail')).text();
 const child=require('child_process').spawn(process.execPath,['-e',`fetch(${JSON.stringify(base+'/v1/child')}).then(r=>r.text()).catch(()=>process.exitCode=1)`],{env:{PATH:process.env.PATH},stdio:'pipe'});
 let stderr='';child.stderr.on('data',b=>stderr+=b);const code=await new Promise(r=>child.on('close',r));assert.equal(code,0,stderr);
 const rows=fs.readdirSync(dir).flatMap(n=>fs.readFileSync(path.join(dir,n),'utf8').trim().split('\n').map(JSON.parse));
 assert.equal(rows.filter(e=>e.kind==='start').length,4,'fetch/http/child requests count once each');
 assert(!JSON.stringify(rows).includes('TOP_SECRET'));assert(!JSON.stringify(rows).includes('/v1/'));
 const r=await aggregate(dir,Date.now(),preload.session,new Map([[base,{origin:base,name:'Test API'}]]));assert.equal(r.apis[0].calls24h,4);assert.equal(r.apis[0].calls30d,4);
 const second=fs.mkdtempSync(path.join(os.tmpdir(),'resource-windows-')),now=Date.now(),D=86400000;
 const fixtures=[{t:now-2*D,session:'old',origin:'https://active.test',kind:'start'},{t:now-1000,session:'old',origin:'https://removed.test',kind:'start',api:true},{t:now-1000,session:'new',origin:'https://new.test',kind:'start',api:true},{t:now-1000,session:'new',origin:'https://active.test',kind:'start'}];
 for(const e of fixtures)fs.appendFileSync(path.join(second,'calls-'+new Date(e.t).toISOString().slice(0,10)+'.jsonl'),JSON.stringify(e)+'\n');
 const a=await aggregate(second,now,'new',new Map([['https://active.test',{origin:'https://active.test',name:'Active'}]]));
 assert.equal(a.apis.length,2);const active=a.apis.find(x=>x.name==='Active');assert.equal(active.calls24h,1);assert.equal(active.calls30d,2);assert(!a.apis.some(x=>x.origin==='https://removed.test'));
 fs.rmSync(second,{recursive:true});
 console.log('PASS: admin access, fetch/native HTTP/isolated MCP child counting, no double counts, no credentials, rolling windows, removed and newly active APIs');
}finally{await new Promise(r=>server.close(r));fs.rmSync(dir,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
