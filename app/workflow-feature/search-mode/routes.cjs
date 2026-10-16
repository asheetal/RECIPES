'use strict';
const {modes}=require('./policy.cjs');
const store=require('./store.cjs');
const {identity}=require('./prompt.cjs');
function register(router){
 const {requireJwtAuth}=require('~/server/middleware');
 router.get('/chat/search-mode',requireJwtAuth,async(req,res,next)=>{try{
  res.set('Cache-Control','no-store').json({mode:await store.read(identity(req))});
 }catch(e){next(e);}});
 router.post('/chat/search-mode',requireJwtAuth,async(req,res,next)=>{try{
  const mode=req.body?.mode;if(!modes.includes(mode))return res.status(400).json({message:'Unknown search mode'});
  await store.write(identity(req),mode);res.json({mode});
 }catch(e){next(e);}});
}
module.exports={register};
