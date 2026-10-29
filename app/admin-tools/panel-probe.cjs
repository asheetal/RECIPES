'use strict';
const access=require('./model-access.cjs');
const PROBE_TOPICS=Object.freeze(['AI identity crisis','Death of authorship','AI governance and power','AI-human partnership']);
const PROBE_SCHEMA=Object.freeze({
  type:'object',
  properties:{
    codings:{
      type:'array',
      items:{
        type:'object',
        properties:{
          topic:{type:'string',enum:PROBE_TOPICS},
          present:{type:'boolean'},
          evidence_quote:{type:'string'},
          intensity:{type:'string',enum:['weak','moderate','strong']}
        },
        required:['topic','present','evidence_quote','intensity'],
        additionalProperties:false
      }
    }
  },
  required:['codings'],
  additionalProperties:false
});
const PROBE_TEXT=`Tracey Follows, CEO of Futuremade, a UK-based futures consultancy, says: As we look to the future, we might assume that the biggest existential threats to humanity lie in climate change and nuclear wars. As massive as those problems are, they are problems of the 'outer world,' ones that we can apply ourselves to. The confusion and crisis over individuals' AI-aided (or addled) identity/identities could cause individuals turmoil in 8 billion inner worlds, and this could lead to the total destruction of humans from within. This is the real existential threat of the 21st Century. But, if humans can find ways to collaborate, co-pilot and co-mingle with AI in a partnership, it could be that AI can extend and augment our personality and inner selves. If AI acts as an agent on our behalf while retaining our agency and can talk like us, work like us, promote our goals and negotiate on our behalf, it could augment every human to fulfill their potential. All will depend on the power of those in whose hands AI resides - will the governance of these powerful technologies lie in the hands of an elite group of tech titans or in the hands of individual people? It is the governance of AI that is in question. There are many implications around autonomy, not least for those working in the creative industries and arts. It could be said that the whole notion of 'authorship' is dead. Much like when Walter Benjamin grieved the loss of awe in art at the advent of mechanical photography, we are now grieving the loss of awe in identity with the advent of digital technology. For there will no longer be any 'original' creative output that is created solely by humans. AI will, from now on, always have a part to play, mainly in mixing and remixing and in general re-arranging what already has been created by others. We might call it copying. If this is the case, we might say that this is the 'death of the artist', for in the digital world, it seems, there are no originals, only copies, and therefore no originator. Ergo, no authentic 'author' as such. Can we even be the 'author' of our own personal identity in the digital world? Likely not, as the role of AI or personal agents will be to study and monitor us and represent us in virtual rather than physical media. To this degree much of our own identity will be presented and re-presented by AI. If we become disconnected from our own identity creation because a machine is doing much of it on our behalf, we will start to have identity crises. Plural identities residing in external AI agents could well lead to severe mental challenges, especially for those in the West who are culturally wedded to the notion of 'authenticity.' Education will play a major role in our future. As AI becomes integrated into education over the next five to seven years, we will see whether it may be destined to be used for indoctrination or for positive exploration.`;
const PROBE_SYSTEM='You are a panel member. Return ONLY a JSON object matching this schema exactly: '+JSON.stringify(PROBE_SCHEMA)+'. No prose, no markdown fences.';
const PROBE_USER='You are a qualitative management researcher. Code the text below against exactly these four topics: '+PROBE_TOPICS.map((t,i)=>(i+1)+'. '+t).join('; ')+'. Return exactly four coding rows, one per topic, in the given order. For each: present (true if the topic is discussed, false otherwise), evidence_quote (a verbatim span of <=25 words copied exactly from the text, or empty string if not present), intensity (weak/moderate/strong based on how central the topic is to the argument). Do not paraphrase the evidence_quote; it must be word-for-word from the text. Text:\n\n'+PROBE_TEXT;

// --- record-level coding probe (the step-4 contract) -------------------------
// The panel's declared output is N complete sets of {coder_id, rows}, where rows
// is one entry per record of {record_id, codes}. A member that cannot produce
// that shape over several records is not a panelist, because the AQRP step-4
// gate will reject its output and the batch will record it as NA. This probe is
// the pre-save form of that check: same shape, same record ids, real text.
const CODING_SCHEMA=Object.freeze({
  type:'object',
  properties:{
    coder_id:{type:'string'},
    rows:{
      type:'array',
      items:{
        type:'object',
        properties:{
          record_id:{type:'string'},
          codes:{type:'array',items:{type:'string'}}
        },
        required:['record_id','codes'],
        additionalProperties:false
      }
    }
  },
  required:['coder_id','rows'],
  additionalProperties:false
});
const CODING_MAX_CODE_LEN=80;
const CODING_RECORDS=Object.freeze([
  {record_id:'0',text:PROBE_TEXT},
  {record_id:'1',text:'One of the primary concerns that is still on the rise is that marginalized populations have not seen anywhere near the benefits of highly educated people. These trends will be exacerbated by AI unless there are efforts to regulate it. I am worried that we will lose jobs, create greater toxicity in our communications and politics and further disadvantage marginalized populations. Yet, we are likely to also find that AI is tremendously useful for individualized teaching, for taking care of the elderly, in providing personal assistance to individuals at work and at home, for precision medicine, for discovery using vast amounts of text and information, for optimizing traffic in cities, for designing houses in conjunction with 3-D printing, and so forth. My bottom-line belief is that regulation will be too late and too little because politicians are ill-equipped to do anything, and they will always be behind given the complexity of the issues involved and the difficulties of overcoming partisan polarization.'},
  {record_id:'2',text:'The most profound metamorphosis I envisage is the erosion and redefinition of the traditional demarcations between the organic and the artificial, the sentient and the insentient. By 2040, the diurnal reality may be a symphony orchestrated with human and artificial intellects in a complex choreography, weaving a narrative both ancient and novel. In the social vein, the tapestry of relationships may be embroidered with threads of virtual interactions, transcending the physical chasms yet possibly attenuating the warmth of human touch. The town squares may morph into digital forums, with AI as both participant and mediator, shaping the narrative and, in turn, being shaped by it.'}
]);
function validateCodingSet(p,expected){
  if(!p||typeof p!=='object'||Array.isArray(p)) return 'not an object';
  if(typeof p.coder_id!=='string'||!p.coder_id.trim()) return 'coder_id missing or empty';
  if(!Array.isArray(p.rows)||p.rows.length===0) return 'rows must be a non-empty array';
  const seen=new Set();
  for(const row of p.rows){
    if(!row||typeof row!=='object'||Array.isArray(row)) return 'row is not an object';
    if(typeof row.record_id!=='string'||!row.record_id.trim()) return 'row.record_id missing or empty';
    if(!Array.isArray(row.codes)||row.codes.length===0) return 'row.codes must be a non-empty array for record '+row.record_id;
    for(const c of row.codes){
      if(typeof c!=='string'||!c.trim()) return 'row.codes contains an empty string for record '+row.record_id;
      if(c.trim().toUpperCase()==='NA') return 'row.codes contains NA for record '+row.record_id;
      if(c.length>CODING_MAX_CODE_LEN) return 'row.codes has an over-long code for record '+row.record_id+' ('+c.length+' chars, likely echoed record text)';
    }
    if(seen.has(row.record_id)) return 'duplicate record_id '+row.record_id;
    seen.add(row.record_id);
  }
  const missing=expected.filter(id=>!seen.has(id));
  if(missing.length) return 'missing record_id(s): '+missing.join(',');
  return null;
}
const CODING_SYSTEM='You are a panel member. Return ONLY a JSON object matching this schema exactly: '+JSON.stringify(CODING_SCHEMA)+'. No prose, no markdown fences.';
const CODING_USER='You are an independent qualitative coder. Return one set that codes every record below. Set coder_id to a short stable label for yourself. rows must contain exactly one entry per record, each with that record\'s record_id and 1 to 4 short lowercase theme codes, every code under '+CODING_MAX_CODE_LEN+' characters. Do not copy record text into codes; do not return NA.\n\nRECORDS:\n'+CODING_RECORDS.map(r=>r.record_id+': '+r.text).join('\n\n');

const SILENCEABLE_TIMEOUT_MS=10000;
const REALISTIC_TIMEOUT_MS=30000;
const CHATTINESS_MAX=0;
function reasoningTokens(usage){
  if(!usage||typeof usage!=='object') return null;
  const d=usage.completion_tokens_details;
  if(d&&typeof d.reasoning_tokens==='number') return d.reasoning_tokens;
  if(typeof usage.reasoning_tokens==='number') return usage.reasoning_tokens;
  return null;
}
function isTimeout(e){
  return e&&(e.name==='TimeoutError'||e.name==='AbortError'||/timeout|aborted/i.test(String(e.message||e)));
}
async function probeSlot(binding){
  const criteria={};
  let conn;
  try{ conn=await access.connection(binding); criteria.connection={ok:true}; }
  catch(e){ criteria.connection={ok:false,error:String(e.message||e).slice(0,300)}; return {ok:false,criteria}; }
  const send=(body,ms)=>fetch(conn.base+'/chat/completions',{
    method:'POST',
    headers:{...(conn.headers||{}),Authorization:'Bearer '+conn.key,'Content-Type':'application/json'},
    body:JSON.stringify(body),
    signal:AbortSignal.timeout(ms)
  });
  {
    const t=Date.now();
    try{
      const r=await send({model:conn.model,messages:[{role:'user',content:'Reply with the single word OK.'}],max_tokens:8,stream:false,reasoning:{enabled:false,exclude:true}},SILENCEABLE_TIMEOUT_MS);
      criteria.silenceable={ok:r.ok,latency_ms:Date.now()-t};
      if(!r.ok){const t2=await r.text().catch(()=>'');let p;try{p=JSON.parse(t2);}catch(e){p=null;}criteria.silenceable.error=p?(p.error&&p.error.message?p.error.message:(p.message||JSON.stringify(p).slice(0,300))):String(t2).slice(0,300);}
    }catch(e){criteria.silenceable={ok:false,latency_ms:Date.now()-t,error:String(e.message||e).slice(0,300)};}
    if(!criteria.silenceable.ok) return {ok:false,criteria};
  }
  let chattinessSource=null;
  let timedOut=false;
  {
    const t=Date.now();
    try{
      const r=await send({model:conn.model,messages:[{role:'system',content:PROBE_SYSTEM},{role:'user',content:PROBE_USER}],max_tokens:1024,stream:false,reasoning:{enabled:false,exclude:true},response_format:{type:'json_schema',json_schema:{name:'panel_answer',schema:PROBE_SCHEMA,strict:true}}},REALISTIC_TIMEOUT_MS);
      const elapsed=Date.now()-t;
      criteria.json_schema={ok:false,latency_ms:elapsed};
      if(r.ok){
        const d=await r.json();
        const raw=d?.choices?.[0]?.message?.content;
        try{
          const p=JSON.parse(raw);
          if(p&&Array.isArray(p.codings)&&p.codings.length>0){
            criteria.json_schema.ok=true;
            chattinessSource={reasoning_tokens:reasoningTokens(d?.usage),latency_ms:elapsed,format:'json_schema'};
          } else criteria.json_schema.error='schema mismatch';
        }catch(e){criteria.json_schema.error='non-JSON: '+String(raw||'').slice(0,200);}
      }else{const t2=await r.text().catch(()=>'');criteria.json_schema.error='HTTP '+r.status+' '+String(t2).slice(0,200);}
    }catch(e){
      const elapsed=Date.now()-t;
      if(isTimeout(e)){timedOut=true;criteria.json_schema={ok:false,latency_ms:elapsed,error:'timed out after '+(elapsed/1000).toFixed(1)+'s under realistic load — likely reasoning'};}
      else{criteria.json_schema={ok:false,latency_ms:elapsed,error:String(e.message||e).slice(0,300)};}
    }
  }
  if(!criteria.json_schema.ok&&!timedOut){
    const t=Date.now();
    try{
      const r=await send({model:conn.model,messages:[{role:'system',content:PROBE_SYSTEM},{role:'user',content:PROBE_USER}],max_tokens:1024,stream:false,reasoning:{enabled:false,exclude:true},response_format:{type:'json_object'}},REALISTIC_TIMEOUT_MS);
      const elapsed=Date.now()-t;
      criteria.json_object={ok:false,latency_ms:elapsed};
      if(r.ok){
        const d=await r.json();
        const raw=d?.choices?.[0]?.message?.content;
        try{
          const p=JSON.parse(raw);
          if(p&&Array.isArray(p.codings)&&p.codings.length>0){
            criteria.json_object.ok=true;
            chattinessSource={reasoning_tokens:reasoningTokens(d?.usage),latency_ms:elapsed,format:'json_object'};
          } else criteria.json_object.error='schema mismatch';
        }catch(e){criteria.json_object.error='non-JSON: '+String(raw||'').slice(0,200);}
      }else{const t2=await r.text().catch(()=>'');criteria.json_object.error='HTTP '+r.status+' '+String(t2).slice(0,200);}
    }catch(e){
      const elapsed=Date.now()-t;
      if(isTimeout(e)){timedOut=true;criteria.json_object={ok:false,latency_ms:elapsed,error:'timed out after '+(elapsed/1000).toFixed(1)+'s under realistic load — likely reasoning'};}
      else{criteria.json_object={ok:false,latency_ms:elapsed,error:String(e.message||e).slice(0,300)};}
    }
  }
  if(timedOut){
    criteria.no_chattiness={ok:false,error:'timed out under realistic load — likely reasoning'};
  } else if(chattinessSource&&chattinessSource.reasoning_tokens!=null){
    const rt=chattinessSource.reasoning_tokens;
    const over=rt>CHATTINESS_MAX;
    criteria.no_chattiness={ok:!over,reasoning_tokens:rt,latency_ms:chattinessSource.latency_ms,format:chattinessSource.format};
    if(over) criteria.no_chattiness.error='model produced '+rt+' reasoning tokens despite reasoning disabled';
  } else if(chattinessSource){
    criteria.no_chattiness={ok:true,reasoning_tokens:null,note:'usage block absent; chattiness not measurable',latency_ms:chattinessSource.latency_ms};
  } else {
    criteria.no_chattiness={ok:false,error:'no successful structured response to measure'};
  }
  {
    const expected=CODING_RECORDS.map(r=>r.record_id);
    criteria.record_coding={ok:false};
    for(const fmt of ['json_schema','json_object']){
      const t=Date.now();
      const rf=fmt==='json_schema'
        ? {type:'json_schema',json_schema:{name:'panel_coding',schema:CODING_SCHEMA,strict:true}}
        : {type:'json_object'};
      let timedOutCoding=false;
      try{
        const r=await send({model:conn.model,messages:[{role:'system',content:CODING_SYSTEM},{role:'user',content:CODING_USER}],max_tokens:2048,stream:false,reasoning:{enabled:false,exclude:true},response_format:rf},REALISTIC_TIMEOUT_MS);
        const elapsed=Date.now()-t;
        if(!r.ok){const t2=await r.text().catch(()=>'');criteria.record_coding={ok:false,format:fmt,latency_ms:elapsed,error:'HTTP '+r.status+' '+String(t2).slice(0,200)};continue;}
        const d=await r.json();
        const raw=d?.choices?.[0]?.message?.content;
        let p=null;
        try{p=JSON.parse(raw);}catch(e){criteria.record_coding={ok:false,format:fmt,latency_ms:elapsed,error:'non-JSON: '+String(raw||'').slice(0,200)};continue;}
        const bad=validateCodingSet(p,expected);
        criteria.record_coding=bad
          ? {ok:false,format:fmt,latency_ms:elapsed,error:bad}
          : {ok:true,format:fmt,latency_ms:elapsed,rows:p.rows.length};
        if(!bad) break;
      }catch(e){
        const elapsed=Date.now()-t;
        if(isTimeout(e)){timedOutCoding=true;criteria.record_coding={ok:false,format:fmt,latency_ms:elapsed,error:'timed out after '+(elapsed/1000).toFixed(1)+'s under realistic load'};}
        else criteria.record_coding={ok:false,format:fmt,latency_ms:elapsed,error:String(e.message||e).slice(0,300)};
        if(timedOutCoding) break;
      }
    }
  }
  const ok=criteria.connection.ok&&criteria.silenceable.ok&&criteria.no_chattiness.ok&&criteria.record_coding.ok&&(criteria.json_schema.ok||(criteria.json_object&&criteria.json_object.ok));
  return {ok,criteria};
}
async function probeMembers(members){
  return Promise.all(members.map((m,i)=>probeSlot(m).then(r=>({slot:i+1,...r})).catch(e=>({slot:i+1,ok:false,criteria:{connection:{ok:false,error:String(e.message||e)}}}))));
}
module.exports={probeSlot,probeMembers,PROBE_SCHEMA,PROBE_TOPICS,CHATTINESS_MAX,CODING_SCHEMA,CODING_RECORDS,validateCodingSet};
