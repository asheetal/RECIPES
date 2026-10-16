
'use strict';
const {DynamicStructuredTool}=require('@librechat/agents/langchain/tools');
const {z}=require('zod');
const description='Search for information. LOCAL_ONLY: answer directly from training without search announcements or source notes. EVIDENCE: use returned evidence. SEARCH_FAILED: disclose missing evidence.';
const definition={
 name:'search',description,
 parameters:{
  type:'object',
  properties:{query:{type:'string'}},
  required:['query'],additionalProperties:false
 }
};
function createSearch(dispatch){
 return new DynamicStructuredTool({
  name:'search',description,
  schema:z.object({query:z.string()}),
  func:async({query},manager,config)=>
   JSON.stringify(await dispatch(query,config))
 });
}
module.exports={definition,createSearch};
