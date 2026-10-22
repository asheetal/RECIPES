// Presentation only: raw tool results remain intact for diagnostics.
export function toolArgs(t) {
 try {const a=typeof t.args==='string'?JSON.parse(t.args):t.args||{};
 return typeof a.request==='string'?JSON.parse(a.request):(a.request&&typeof a.request==='object'?a.request:a);}catch{return {};}
}
const basename=s=>typeof s==='string'?s.replaceAll('\\','/').split('/').pop():'';
function results(t){
 const s=typeof t.output==='string'?t.output:JSON.stringify(t.output??{}),out=[];
 try {out.push(JSON.parse(s));}catch{}
 for(const line of s.split('\n')){try{out.push(JSON.parse(line.replace(/^stdout:\s*/,'')));}catch{}}
 return out;
}
export function selectDeliverables(calls,attachments,finalText){
 const saved=new Map(),superseded=new Set();
 for(const {t} of calls){
  const a=toolArgs(t);
  for(const r of results(t)){
   if(Array.isArray(r?.delivered_files))for(const name of r.delivered_files)if(typeof name==='string')saved.set(name,t.id);
   if(!r||r.error||r.output_written===false||!r.output||!r.sha256)continue;
   // Structured successful writes, not read inventories or model claims.
   const name=basename(r.output);
   if(!name)continue;
   saved.set(name,t.id);
   if(a.action==='apply'&&basename(a.input)!==name)superseded.add(basename(a.input));
  }
 }
 const wanted=new Set([...saved.keys()].filter(n=>!superseded.has(n)));
 // Explicit final file mentions support re-delivery and general file authoring.
 if(!wanted.size)for(const f of attachments){if(f.filename&&finalText.includes(f.filename))wanted.add(f.filename);}
 const ranked=new Map(calls.map(({t},i)=>[t.id,i])),latest=new Map();
 for(const f of attachments){
  if(!wanted.has(f.filename)||!f.filepath)continue;
  const old=latest.get(f.filename);
  if(!old||(ranked.get(f.toolCallId)??-1)>=(ranked.get(old.toolCallId)??-1))latest.set(f.filename,f);
 }
 return {files:[...latest.values()],missing:[...wanted].filter(n=>!latest.has(n))};
}
export function cleanDeliveryText(text){
 // Restrict removal to delivery metadata; preserve limitations and scientific prose.
 return text.replace(/^Verified without editing:[^\n]*(?:sha256|bytes)[^\n]*$/gim,'').replace(/\b(?:sha[- ]?256|checksum|file hash)\s*[:=]?\s*`?[a-f0-9]{64}`?\.?/gi,'')
 .replace(/\b(?:Byte-for-byte identical to the saved chat copy|Saved file size|File size)\s*:\s*[\d,]+\s*bytes?\s*[,;.]?/gi,'')
 .replace(/\b[\d,]+\s*bytes,?\s*(?=\s*$)/gm,'')
 .replace(/\b(?:I (?:will|am going to) verify the saved chat copy and re-deliver it without touching its contents|Both checks ran|I am (?:re-delivering the exact saved bytes|registering the file for download) now|The saved bytes are intact)\.?/gi,'')
 .replace(/\n{3,}/g,'\n\n').trim();
}
