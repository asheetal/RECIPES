'use strict';
// One live plan per triage. Stored in req.__workflow.plan.
// Authoritative version = latest. Prior blocks are stripped from history.
const TOKEN = '[PLAN]';
function extract(content){
 if(typeof content!=='string')return null;
 const i = content.indexOf(TOKEN);
 if(i<0)return null;
 return content.slice(i).trim();
}
function strip(content){
 if(typeof content!=='string')return content;
 const i = content.indexOf(TOKEN);
 if(i<0)return content;
 return content.slice(0,i).trim();
}
function get(req){ return req?.__workflow?.plan || null; }
function set(req, raw){
 if(!req?.__workflow||!raw)return null;
 req.__workflow.plan = {version:(req.__workflow.plan?.version||0)+1, raw, updatedAt:new Date().toISOString()};
 return req.__workflow.plan;
}
function stripMessages(messages){
 if(!Array.isArray(messages))return messages;
 for(const m of messages){
  if(!m||typeof m!=='object')continue;
  if(typeof m.content==='string'){
   const s = strip(m.content);
   if(s!==m.content){ try{ m.content=s; }catch(_e){} }
  }
 }
 return messages;
}
module.exports = { TOKEN, extract, strip, get, set, stripMessages };
