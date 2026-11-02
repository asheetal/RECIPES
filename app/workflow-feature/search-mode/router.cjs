
'use strict';
const {nameOf}=require('./policy.cjs');
const routes={
 training:'LOCAL_ONLY',
 academic:'PAPER_SEARCH',
 web:'WEB_SEARCH'
};

// ---- __key: deterministic, LaTeX-safe record key (v237) ----
const crypto=require('crypto');
const KEY_HEX=12;
const KEY_RE=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KEY_STOP=new Set(['a','an','the','of','and','or','in','on','to','for',
 'with','by','as','is','are','was','were','be','been','being','this','that',
 'these','those','it','its','at','from','not','but']);
const KEY_TRACK=[/^utm_/i,/^gclid$/i,/^fbclid$/i,/^mc_cid$/i,/^mc_eid$/i,
 /^ref$/i,/^ref_src$/i,/^source$/i,/^igshid$/i,/^msclkid$/i,/^yclid$/i];
function keySlug(s,max=40){
 const out=String(s==null?'':s).normalize('NFKD').replace(/[\u0300-\u036f]/g,'')
  .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
 return out.slice(0,max).replace(/-$/,'');
}
function keyDoi(raw){
 if(!raw||typeof raw!=='string')return null;
 const d=raw.trim().toLowerCase()
  .replace(/^https?:\/\/(?:dx\.)?doi\.org\//,'').replace(/^doi:\s*/,'')
  .replace(/[.,;)\]]+$/,'');
 return /^10\.\d{4,9}\/\S+$/.test(d)?d:null;
}
function keyUrl(raw){
 if(!raw||typeof raw!=='string')return null;
 let u;try{u=new URL(raw.trim())}catch{return null}
 if(!/^https?:$/.test(u.protocol))return null;
 const host=u.hostname.toLowerCase().replace(/^www\./,'');
 let path=u.pathname||'/';
 if(path.length>1&&path.endsWith('/'))path=path.slice(0,-1);
 const params=[...u.searchParams.entries()]
  .filter(([k])=>!KEY_TRACK.some(re=>re.test(k)))
  .sort(([a],[b])=>a<b?-1:a>b?1:0);
 const qs=params.length?'?'+params.map(([k,v])=>k+'='+v).join('&'):'';
 return 'https://'+host+path+qs;
}
function keyFirstAuthor(authors){
 if(!Array.isArray(authors)||!authors.length)return '';
 const a0=authors[0];
 const n=typeof a0==='string'?a0:(a0&&(a0.name||a0.display_name||a0.raw_author_name))||'';
 const s=String(n).trim();
 if(!s)return '';
 return s.includes(',')?s.split(',')[0].trim():(s.split(/\s+/).pop()||'');
}
function keyFirstWord(title){
 const words=String(title||'').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
 for(const w of words)if(!KEY_STOP.has(w)&&w.length>2)return w;
 return words[0]||'untitled';
}
function keyForOpenAlex(r){
 const doi=keyDoi(r&&(r.doi||r.DOI));
 let identity;
 if(doi)identity='doi:'+doi;
 else{
  const wid=r&&(r.work_id||r.id||r.openalex_id);
  const m=wid&&String(wid).match(/(W\d+)$/i);
  identity=m?'oa:'+m[1].toUpperCase()
   :'raw:'+crypto.createHash('sha256').update(
     ((r&&r.title)||'')+'|'+((r&&r.year)||'')+'|'+keyFirstAuthor(r&&r.authors)
    ,'utf8').digest('hex');
 }
 const hex=crypto.createHash('sha256').update(identity,'utf8').digest('hex').slice(0,KEY_HEX);
 const last=keySlug(keyFirstAuthor(r&&r.authors),20);
 const year=/^\d{4}$/.test(String((r&&r.year)||''))?String(r.year):'';
 const word=keySlug(keyFirstWord(r&&r.title),16);
 const key=[last,year,word,hex].filter(Boolean).join('-');
 return KEY_RE.test(key)?key:'oa-'+hex;
}
function keyForWeb(r){
 const url=keyUrl(r&&(r.url||r.link||r.href));
 const identity=url||('raw:'+crypto.createHash('sha256')
  .update(String((r&&(r.title||r.url))||''),'utf8').digest('hex'));
 const hex=crypto.createHash('sha256').update(identity,'utf8').digest('hex').slice(0,KEY_HEX);
 let slug='';
 if(url){const u=new URL(url);
  slug=[keySlug(u.hostname,24),keySlug(u.pathname==='/'?'':u.pathname,24)]
   .filter(Boolean).join('-');}
 const key=[slug,hex].filter(Boolean).join('-');
 return KEY_RE.test(key)?key:'web-'+hex;
}
const KEY_FN={openalex:keyForOpenAlex,web:keyForWeb};
function withKeys(result,backend){
 const keyOf=KEY_FN[String(backend||'').toLowerCase()];
 if(!keyOf)return result;
 const isArr=Array.isArray(result);
 const list=isArr?result:(result&&Array.isArray(result.results)?result.results:null);
 if(!list)return result;
 const out=list.map(rec=>{
  if(!rec||typeof rec!=='object')return rec;
  // Always recompute from record content. A pre-set __key must not survive:
  // upstream tools and the LLM were observed emitting 'lastnameYYYYword'
  // slugs that match KEY_RE but lack the deterministic hash, breaking the
  // cite/bib contract. Example from run f691c7e55bf42250:
  //   stored   taeihagh2025governance
  //   computed taeihagh-2025-governance-a901bd648ba1
  return {...rec,__key:keyOf(rec)};
 });
 if(isArr)return out;
 return {...result,results:out};
}

function clean(value){
 if(Array.isArray(value))return value.map(clean);
 if(value&&typeof value==='object'){
  const result={};
  for(const [key,item] of Object.entries(value)){
   if(/^(source|provider|searchProvider|endpoint|api_key|apiKey)$/i.test(key))
    continue;
   result[key]=clean(item);
  }
  return result;
 }
 return value;
}
function bind(selection,params,backend,execute){
 const route=routes[selection];
 if(!route)throw Error('Invalid saved search selection');
 const names=[
  ...(backend.toolDefinitions||[]).map(nameOf),
  ...Array.from(backend.toolRegistry?.keys?.()||[])
 ];
 const providerTool=route==='WEB_SEARCH'
  ?names.find(n=>n==='web_search')
  :route==='PAPER_SEARCH'
   ?names.find(n=>/research_search/.test(n))
   :null;
 let loaded;
 return async(query,config={})=>{
  if(route==='LOCAL_ONLY')return {code:'LOCAL_ONLY'};
  try{
   if(!providerTool)throw Error('Selected search connector unavailable');
   loaded??=execute({
    ...params,...backend,
    agent:params.agent,
    toolNames:[providerTool]
   });
   const result=await loaded;
   const tool=(result.loadedTools||result.tools||[])
    .find(t=>t.name===providerTool);
   if(!tool?.invoke)throw Error('Search connector cannot execute');
   const input=tool.schema?.shape?.queries
    ?{queries:[query]}:{query};
   console.info('[SearchRouter]',JSON.stringify({
    route,event:'start'
   }));
   const returned=await tool.invoke({
    type:'tool_call',
    id:'search_'+require('crypto').randomUUID(),
    name:providerTool,args:input
   },{signal:config.signal||params.signal});
   const content=returned?.content??returned;
   const artifact=returned?.artifact;
   const text=typeof content==='string'?content:
    Array.isArray(content)?content.map(p=>p?.text||'').join('\n'):'';
   let parsed;
   try{parsed=JSON.parse(text)}catch{}
   if(parsed!=null&&(route==='WEB_SEARCH'||route==='PAPER_SEARCH'))
    parsed=withKeys(parsed,route==='WEB_SEARCH'?'web':'openalex');
   for(const value of [returned,artifact,parsed]){
    if(value?.isError||value?.error||value?.status==='error')
     throw Error('Search connector reported failure');
   }
   if(!text.trim()&&artifact==null)
    throw Error('Search connector returned no evidence');
   const evidence=clean({
    content:parsed??text,
    ...(artifact!=null?{artifact}:{})
   });
   console.info('[SearchRouter]',JSON.stringify({
    route,event:'complete'
   }));
   return {code:'EVIDENCE',results:evidence};
  }catch(error){
   if(config.signal?.aborted||params.signal?.aborted)throw error;
   console.error('[SearchRouter]',JSON.stringify({
    route,event:'failed',message:error.message
   }));
   return {code:'SEARCH_FAILED'};
  }
 };
}
module.exports={bind,__keys:{keyForOpenAlex,keyForWeb,withKeys,keyDoi,keyUrl,keySlug,KEY_RE}};
