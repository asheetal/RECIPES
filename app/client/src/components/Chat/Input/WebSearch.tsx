import {memo, useEffect, useState} from 'react';
import {apiBaseUrl, request} from 'librechat-data-provider';
const modes=['training','web','academic'] as const;
const labels=['System 1','System 2 (web search)','System 2 (academic paper search)'];
function WebSearch(){
 const [position,setPosition]=useState(0);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState('');
 const url=`${apiBaseUrl()}/api/agents/chat/search-mode`;
 useEffect(()=>{
  let alive=true;
  request.get<{mode:string}>(url).then(r=>{if(alive){const i=modes.indexOf(r.mode as typeof modes[number]);setPosition(i<0?0:i);}})
   .catch(()=>{if(alive)setError('Unable to load search mode');});
  return()=>{alive=false;};
 },[url]);
 const change=async(next:number)=>{
  setSaving(true);setError('');
  try{await request.post(url,{mode:modes[next]});setPosition(next);}
  catch{setError('Unable to change search mode');}
  finally{setSaving(false);}
 };

 return <div className="inline-flex items-center gap-2 bg-transparent p-0">
  <input id="search-mode-slider" type="range"
   min={0} max={2} step={1} value={position} disabled={saving}
   aria-label="Search mode" aria-valuetext={labels[position]}
   onChange={e=>void change(Number(e.target.value))}
   className="h-4 w-[64px] shrink-0 cursor-pointer appearance-none bg-transparent
    [&::-webkit-slider-runnable-track]:h-[2px]
    [&::-webkit-slider-runnable-track]:rounded-full
    [&::-webkit-slider-runnable-track]:bg-text-secondary
    [&::-webkit-slider-thumb]:-mt-[3px]
    [&::-webkit-slider-thumb]:h-2
    [&::-webkit-slider-thumb]:w-2
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:bg-text-secondary
    [&::-moz-range-track]:h-[2px]
    [&::-moz-range-track]:bg-text-secondary
    [&::-moz-range-thumb]:h-2
    [&::-moz-range-thumb]:w-2
    [&::-moz-range-thumb]:border-0
    [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:bg-text-secondary" />
  <label htmlFor="search-mode-slider"
   className="text-[11px] font-normal italic text-text-secondary">
   {labels[position]}
  </label>
  {error&&<span role="alert" className="text-xs">{error}</span>}
 </div>;

}
export default memo(WebSearch);
