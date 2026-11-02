'use strict';
const cache=new Map(),pending=new Map();let cooldown=0;
function abstract(index){if(!index||typeof index!=='object')return null;const words=[];for(const [word,positions] of Object.entries(index))for(const i of Array.isArray(positions)?positions:[])if(Number.isInteger(i)&&i>=0&&i<30000)words[i]=word;return words.length?words.map(w=>w||'').join(' '):null;}
function paper(w){return {paperId:w.id,title:w.title||w.display_name||'',authors:(w.authorships||[]).map(a=>({authorId:a.author?.id,name:a.author?.display_name})),year:w.publication_year,abstract:abstract(w.abstract_inverted_index),externalIds:{DOI:w.doi?.replace(/^https?:\/\/doi\.org\//i,'')||null},url:w.doi||w.primary_location?.landing_page_url||w.id,venue:w.primary_location?.source?.display_name||null,citationCount:w.cited_by_count??null,openAccessPdf:w.best_oa_location?.pdf_url?{url:w.best_oa_location.pdf_url}:w.primary_location?.pdf_url?{url:w.primary_location.pdf_url}:null,volume:w.biblio?.volume??null,issue:w.biblio?.issue??null,first_page:w.biblio?.first_page??null,last_page:w.biblio?.last_page??null};}
async function lookup(query){
 const key=process.env.OPENALEX_API_KEY;if(!key)throw Error('OpenAlex API key is not configured.');
 const url=new URL('https://api.openalex.org/works');url.searchParams.set('search',query);url.searchParams.set('per_page','8');url.searchParams.set('filter','primary_location.source.type:journal,primary_location.source.2yr_mean_citedness:>2.0');url.searchParams.set('filter','primary_location.source.type:journal');
 if(url.href.length>3900)throw Error('Search query too long. Use a shorter academic search query.');
 let r;try{r=await fetch(url,{headers:{Authorization:'Bearer '+key,'User-Agent':'TryfindResearchSearch/3.0'},signal:AbortSignal.timeout(20000),redirect:'error'});}catch{throw Error('OpenAlex connection failed or timed out. General web fallback is disabled.');}
 if(!r.ok){if(r.status===429){const raw=r.headers.get('retry-after');const seconds=Number(raw);const until=raw&&!Number.isFinite(seconds)?Date.parse(raw):Date.now()+Math.max(60,Number.isFinite(seconds)?seconds:60)*1000;cooldown=Number.isFinite(until)?Math.max(Date.now()+60000,until):Date.now()+60000;}throw Error('OpenAlex HTTP '+r.status+'; general web fallback is disabled.');}
 let data;try{data=await r.json();}catch{throw Error('OpenAlex returned invalid JSON.');}
 if(!Array.isArray(data.results))throw Error('OpenAlex response is missing results.');
 return {source:'openalex',total:data.meta?.count??null,results:data.results.map(paper)};
}
async function search({query,mode='academic'}={}){
 if(mode!=='academic')throw Error('Use the Web Search toggle for general web searches.');
 if(typeof query!=='string'||!query.trim())throw Error('A search query is required.');
 query=query.trim();const hit=cache.get(query);if(hit&&hit.expires>Date.now())return hit.value;
 if(Date.now()<cooldown)throw Error('OpenAlex rate limit reached. Retry after '+Math.ceil((cooldown-Date.now())/1000)+' seconds.');
 if(pending.has(query))return pending.get(query);
 const task=lookup(query).then(value=>{if(cache.size>=100)cache.delete(cache.keys().next().value);cache.set(query,{value,expires:Date.now()+600000});return value;}).finally(()=>pending.delete(query));pending.set(query,task);return task;
}
module.exports={search,paper,abstract};
