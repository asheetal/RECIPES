'use strict';
const fs=require('fs'),path=require('path'),readline=require('readline');
const {createRequire}=require('module');const app=createRequire('/app/package.json');
const telemetry=require('./preload.cjs');
const DAY=86400000;let busy=null;
function normalized(value){const origin=telemetry.originOf(value);if(!origin)return null;const u=new URL(origin);return u.origin;}
function resolved(v){return String(v??'').replace(/\$\{([^}]+)\}/g,(_,k)=>process.env[k]||'');}
function catalog(){
 let load;try{load=app('js-yaml').load;}catch{load=app('yaml').parse;}
 const config=load(fs.readFileSync('/app/librechat.yaml','utf8'))||{},apis=new Map();
 const add=(url,name)=>{const o=normalized(resolved(url));if(o)apis.set(o,{origin:o,name:name||new URL(o).hostname});};
 for(const endpoint of config.endpoints?.custom||[])add(endpoint.baseURL,endpoint.name);
 const envURLs=Object.entries(process.env).filter(([k])=>/(?:API|ENDPOINT|BASE|RAG).*(?:URL|HOST)$/.test(k)&&!/(?:DOMAIN|PROXY)/.test(k));
 for(const [key,value] of envURLs)if(/^https?:\/\//.test(value))add(value,key.replace(/_/g,' ').replace(/ URL$/,''));
 // Inspect active local tool entrypoints and their literal relative imports, not backup files.
 const roots=new Set(Object.keys(require.cache).filter(p=>p.startsWith('/app/')&&!p.includes('/node_modules/')&&/\/(?:ra-tools|lab-research-tools|workflow-feature|word-passes)\//.test(p)));
 for(const server of Object.values(config.mcpServers||{})){if(server.disabled===true)continue;if(server.url)add(server.url);for(const a of server.args||[])if(typeof a==='string'&&a.startsWith('/app/')&&/\.[cm]?js$/.test(a))roots.add(a);}
 const seen=new Set();function scan(p){if(seen.has(p)||seen.size>=100||!p.startsWith('/app/'))return;seen.add(p);let s;try{s=fs.readFileSync(p,'utf8');}catch{return;}
  for(const m of s.matchAll(/(?:new URL\(|fetch\(|(?:const|let)\s+(?:url|baseURL|baseUrl|base)\s*=)\s*['"`](https?:\/\/[^'"`\s]+)/g))add(m[1]);
  for(const m of s.matchAll(/require\(['"](\.[^'"]+)['"]\)/g)){let f=path.resolve(path.dirname(p),m[1]);if(!path.extname(f))f+='.js';scan(f);}
 }
 for(const p of roots)scan(p);
 return apis;
}
async function aggregate(root,now,currentSession,configured){
 const map=new Map([...configured].map(([o,c])=>[o,{...c,calls24h:0,calls30d:0,status:'No calls yet',last:0,active:true}]));
 const entries=await fs.promises.readdir(root);let invalid=0;
 for(const name of entries.sort()){
  if(!/^calls-\d{4}-\d{2}-\d{2}\.jsonl$/.test(name))continue;
  const date=Date.parse(name.slice(6,16)+'T00:00:00Z');
  if(date+DAY<now-31*DAY){await fs.promises.unlink(path.join(root,name));continue;}
  if(date+DAY<now-30*DAY)continue;
  const stream=fs.createReadStream(path.join(root,name),{encoding:'utf8'});const lines=readline.createInterface({input:stream,crlfDelay:Infinity});
  for await(const line of lines){let e;try{e=JSON.parse(line);}catch{invalid++;continue;}
   if(!e.origin||!Number.isFinite(e.t)||e.t<now-30*DAY||e.t>now+60000)continue;
   let r=map.get(e.origin);if(!r){r={origin:e.origin,name:new URL(e.origin).hostname,calls24h:0,calls30d:0,status:'No calls yet',last:0,active:false};map.set(e.origin,r);}
   if(e.kind==='start'){
    r.calls30d++;if(e.t>=now-DAY)r.calls24h++;
    if(e.t>=r.last){r.last=e.t;r.status='Waiting for response';}
    if(e.session===currentSession&&e.api)r.active=true;
   }
   if(e.kind==='result'&&e.t>=r.last){r.last=e.t;r.status=e.error?'Connection error':e.status>=400?'HTTP '+e.status:e.status?'Responding':'Connection error';}
  }
 }
 return {apis:[...map.values()].filter(r=>r.active).map(({last,active,...r})=>r).sort((a,b)=>a.name.localeCompare(b.name)),invalid};
}
async function snapshot(){
 const host=JSON.parse(await fs.promises.readFile('/app/resource-host/status.json','utf8'));
 if(Date.now()-host.sampledAt>180000)host.warning='Server status collector is delayed';
 delete host.sampledAt;
 const usage=await aggregate(telemetry.root,Date.now(),telemetry.session,catalog());
 let ux=null;
 try {
   ux = JSON.parse(await fs.promises.readFile('/app/resource-usage-data/ux_performance.json', 'utf8'));
 } catch (_) {}
 return {server:host,apis:usage.apis,uxPerformance:ux,recordingWarning:telemetry.state.error?'API recording error: '+telemetry.state.error:usage.invalid?'An incomplete telemetry record was ignored':null};
}
async function route(req,res){
 if(req.user?.role!=='ADMIN')return res.status(403).json({message:'Admin access required'});
 res.set('Cache-Control','no-store');
 try{if(!busy)busy=snapshot().finally(()=>{busy=null;});res.json(await busy);}catch(e){console.error('[ResourceUsage]',e.code||e.name);res.status(503).json({message:'Resource status could not be read. Check the server collector.'});}
}
const retention=setInterval(async()=>{try{for(const name of await fs.promises.readdir(telemetry.root)){if(!/^calls-\d{4}-\d{2}-\d{2}\.jsonl$/.test(name))continue;const d=Date.parse(name.slice(6,16)+'T00:00:00Z');if(d+DAY<Date.now()-31*DAY)await fs.promises.unlink(path.join(telemetry.root,name));}}catch(e){console.error('[ResourceUsage] Retention:',e.code||e.name);}},DAY);retention.unref();
module.exports={route,aggregate,catalog};
