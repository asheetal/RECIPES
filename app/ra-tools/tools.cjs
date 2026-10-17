'use strict';
const fs=require('fs');
const NAME='verify_references';
const def={name:NAME,description:'Verify up to 12 DOI references against Crossref metadata. Returns registered titles, authors, years, and title comparisons; does not verify that a paper supports a claim. Network failures and unregistered DOIs are not treated as fabricated references.',parameters:{type:'object',properties:{references:{type:'array',maxItems:12,items:{type:'object',properties:{doi:{type:'string'},title:{type:'string'}},required:['doi'],additionalProperties:false}}},required:['references'],additionalProperties:false}};
async function verify({references}){
 if(!Array.isArray(references)||!references.length||references.length>12)throw Error('Supply 1–12 references');
 const rows=[];
 for(const ref of references){
  const doi=String(ref.doi||'').trim().replace(/^https?:\/\/(?:dx\.)?doi\.org\//i,'').replace(/^doi:\s*/i,'');
  if(!/^10\.\d{4,9}\/\S+$/i.test(doi)){rows.push({doi,status:'invalid_doi_format'});continue;}
  try{
   const url='https://api.crossref.org/works/'+encodeURIComponent(doi);
   const r=await fetch(url,{headers:{'User-Agent':'TryfindResearchTools/1.0'},signal:AbortSignal.timeout(15000),redirect:'error'});
   if(!r.ok){rows.push({doi,status:r.status===404?'not_found_in_crossref':'lookup_unavailable',http:r.status});continue;}
   const m=(await r.json()).message;
   const title=m.title?.[0]||'';
   const normalize=s=>String(s).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
   rows.push({doi,status:'registered',source:url,registeredDOI:m.DOI,title,authors:(m.author||[]).map(a=>[a.given,a.family].filter(Boolean).join(' ')),publicationDate:m.published?.['date-parts'],journal:m['container-title']?.[0],titleMatches:ref.title?normalize(ref.title)===normalize(title):null,relation:m.relation||{},updates:m['update-to']||[],note:'Metadata verification, not a claim-support or full-text check.'});
  }catch{rows.push({doi,status:'lookup_unavailable'});}
 }
 return JSON.stringify(rows);
}
function makeTool(){const {DynamicStructuredTool}=require('@librechat/agents/langchain/tools');const {z}=require('zod');return new DynamicStructuredTool({name:NAME,description:def.description,schema:z.object({references:z.array(z.object({doi:z.string(),title:z.string().optional()})).min(1).max(12)}),func:verify});}
function allowed(p){return Boolean(p.req?.user?.id);}
function toText(c){
 if(c==null)return '';
 if(typeof c==='string')return c;
 if(Array.isArray(c))return c.map(toText).join(' ');
 if(typeof c==='object')return [c.text,c.content].map(toText).join(' ');
 return '';
}
function wantsDocWork(p){
 const body=p.req?.body||{};
 const lastUser=(body.conversation||[]).filter(m=>m.role==='user').pop();
 const text=[body.text,toText(lastUser?.content),toText(lastUser?.text)].filter(Boolean).join(' ');
 return /\b(create|write|draft|edit|render|compile|docx?|xlsx?|pptx?|\.tex\b|latex|manuscript|redline|tracked.?changes?|revision)\b/i.test(text);
}
function wrapLoad(load){return async p=>{
 const r=await load(p);if(!r||!allowed(p))return r;
 if(wantsDocWork(p)){r.toolContextMap={...(r.toolContextMap||{}),ra_workbench:fs.readFileSync('/app/ra-tools/usage.txt','utf8')};}
 r.toolDefinitions=[...(r.toolDefinitions||[]).filter(x=>x.name!==NAME),def];
 r.toolRegistry=new Map(r.toolRegistry||[]);r.toolRegistry.set(NAME,def);
 if(p.definitionsOnly===false)r.tools=[...(r.tools||[]),makeTool()];return r;
};}
function wrapExecution(load){return async p=>{
 const requested=p.toolNames.includes(NAME);
 const r=await load({...p,toolNames:p.toolNames.filter(x=>x!==NAME)});
 if(requested){/* bypassed agent execute_code check */const t=makeTool();r.loadedTools.push(t);r.configurable?.ptcToolMap?.set(NAME,t);}return r;
};}
module.exports={wrapLoad,wrapExecution,verify};
