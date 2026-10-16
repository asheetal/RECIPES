'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const location=process.env.LAB_COMPRESSION_SETTINGS || '/app/compression-admin/settings/policy.json';
function validate(p){
 if(!p||p.triggerMode!=='tokens'||!Number.isSafeInteger(p.triggerValue)||p.triggerValue<1000||p.triggerValue>10000000)throw Error('Enter a trigger between 1 and 10,000 K tokens.');
 if(typeof p.targetRatio!=='number'||!Number.isFinite(p.targetRatio)||p.targetRatio<=0||p.targetRatio>=1)throw Error('Compression ratio must be above 0 and below 1.');
 return {triggerMode:'tokens',triggerValue:p.triggerValue,targetRatio:p.targetRatio,revision:Number.isSafeInteger(p.revision)?p.revision:0};
}
function read(){return validate(JSON.parse(fs.readFileSync(location,'utf8')));}
function attach(ctx){
 const p=read();ctx._labCompressionPolicy=p;
 ctx.summarizationConfig={...(ctx.summarizationConfig||{}),trigger:{type:'token_ratio',value:p.triggerValue/Math.max(1,Number(ctx.maxContextTokens)||1)}};
}
function target(ctx,messages){
 const p=ctx._labCompressionPolicy||read();
 const usage=ctx.projectContextUsage(messages);
 const used=usage?.prePruneContextTokens + (usage?.effectiveInstructionTokens ?? ctx.instructionTokens ?? 0);
 if(!Number.isFinite(used)||used<0)throw Error('Cannot measure chat size for compression.');
 const calibration=Number(usage.calibrationRatio)||1;
 return {tokens:Math.floor(used*p.targetRatio),rawTokens:Math.floor(used*p.targetRatio/calibration)};
}
function tailBudget(ctx,messages,summaryReserve){
 const goal=target(ctx,messages);
 // instructionTokens already includes tools and the prior summary.
 const fixed=Math.max(0,Number(ctx.instructionTokens||0)-Number(ctx.summaryTokenCount||0));
 return Math.max(1,goal.rawTokens-fixed-summaryReserve-1000);
}
function get(req,res){try{res.json(read());}catch{res.status(503).json({message:'Unable to read compression settings.'});}}
function save(req,res){
 let next;try{next=validate(req.body);}catch(e){return res.status(400).json({message:e.message});}
 let tmp;
 try{const current=read();if(next.revision!==current.revision)return res.status(409).json({message:'Settings changed. Close and reopen Admin before saving.'});
 next.revision++;tmp=path.join(path.dirname(location),'.policy-'+crypto.randomUUID());
 fs.writeFileSync(tmp,JSON.stringify(next,null,2)+'\n',{flag:'wx',mode:0o600});fs.renameSync(tmp,location);res.json(next);
 }catch{res.status(500).json({message:'Could not save compression settings.'});}finally{if(tmp&&fs.existsSync(tmp))fs.unlinkSync(tmp);}
}
module.exports={validate,read,attach,target,tailBudget,get,save};
