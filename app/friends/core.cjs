'use strict';
const crypto=require('node:crypto');
const DAY=86400000;
function sixMonths(date){const d=new Date(date),day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+6);const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(day,last));return d;}
function newCode(){return 'FRIEND-'+crypto.randomBytes(16).toString('hex').toUpperCase().match(/.{1,4}/g).join('-');}
function normalize(code){return typeof code==='string'?code.trim().toUpperCase().replace(/[-\s]/g,''):'';}
function codeHash(code){const n=normalize(code);if(!/^FRIEND[A-F0-9]{32}$/.test(n))return null;return crypto.createHash('sha256').update(n).digest('hex');}
function allowed(row,now=Date.now()){return !row||(row.state==='active'&&new Date(row.expiresAt).getTime()>now);}
function due(row,now=Date.now()){return row.state==='active'&&!row.remindedAt&&new Date(row.expiresAt).getTime()>now&&new Date(row.expiresAt).getTime()-now<=14*DAY;}
module.exports={DAY,sixMonths,newCode,codeHash,allowed,due};
