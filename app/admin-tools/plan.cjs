'use strict';
// One live plan per triage. Stored in req.__workflow.plan.
// Authoritative version = latest. Prior blocks are stripped from history.
const TOKEN = '[PLAN]';
function getMessageContent(msg){
 if(!msg||typeof msg!=='object')return '';
 if(typeof msg.content==='string')return msg.content;
 if(msg.kwargs&&typeof msg.kwargs.content==='string')return msg.kwargs.content;
 return '';
}
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
function getContent(m){
 if(!m||typeof m!=='object')return null;
 if(m.kwargs&&typeof m.kwargs.content==='string')return m.kwargs.content;
 if(typeof m.content==='string')return m.content;
 return null;
}
function setContent(m,v){
 if(!m||typeof m!=='object')return;
 if(m.kwargs&&typeof m.kwargs.content==='string'){m.kwargs.content=v;return;}
 if(typeof m.content==='string'){m.content=v;}
}
function isInjectedPlan(m){
 const c=getContent(m);
 return typeof c==='string'&&c.startsWith('CURRENT CASE PLAN');
}
function stripMessages(messages){
 if(!Array.isArray(messages))return messages;
 // Drop any previously injected plan SystemMessages, then strip [PLAN] blocks from remaining messages.
 for(let i=messages.length-1;i>=0;i--){
  if(isInjectedPlan(messages[i]))messages.splice(i,1);
 }
 for(const m of messages){
  const c=getContent(m);
  if(c==null)continue;
  const s=strip(c);
  if(s!==c)setContent(m,s);
 }
 return messages;
}
module.exports = { TOKEN, extract, strip, get, set, stripMessages, getMessageContent };
