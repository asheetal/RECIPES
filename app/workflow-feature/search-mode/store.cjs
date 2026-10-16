'use strict';
const {modes}=require('./policy.cjs');
const table=()=>require('mongoose').connection.db.collection('searchmodes');
async function read(identity){const row=await table().findOne(identity);return modes.includes(row?.mode)?row.mode:'training';}
async function write(identity,mode){
 if(!modes.includes(mode))throw Error('Unknown search mode');
 await table().updateOne(identity,{$set:{mode}},{upsert:true});
}
module.exports={read,write};
