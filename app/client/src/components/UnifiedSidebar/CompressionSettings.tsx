import React,{useEffect,useState} from 'react';
import {Button} from '@librechat/client';
import {request,apiBaseUrl} from 'librechat-data-provider';
type Policy={triggerMode:'tokens';triggerValue:number;targetRatio:number;revision:number};
const url=()=>`${apiBaseUrl()}/api/admin/users/compression`;
export default function CompressionSettings(){
 const [policy,setPolicy]=useState<Policy|null>(null),[trigger,setTrigger]=useState(''),[target,setTarget]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 useEffect(()=>{let active=true;request.get<Policy>(url()).then(p=>{if(active){setPolicy(p);setTrigger(String(p.triggerValue/1000));setTarget(String(p.targetRatio));}}).catch(()=>{if(active)setMessage('Could not load compression settings.');});return()=>{active=false;};},[]);
 async function save(){if(!policy)return;setBusy(true);setMessage('');try{const p=await request.post(url(),{...policy,triggerValue:Math.round(Number(trigger)*1000),targetRatio:Number(target)});setPolicy(p);setMessage('Saved. Applies from the next message.');}catch(e:any){setMessage(e?.response?.data?.message||'Could not save settings.');}finally{setBusy(false);}}
 const field='w-full rounded-lg border border-border-medium bg-surface-primary px-3 py-2 text-text-primary';
 return <section className="mt-5 space-y-2 border-t border-border-light pt-3"><h3 className="font-semibold">Chat compression</h3>{policy&&<>
 <label htmlFor="compression-trigger" className="block text-sm">Compression trigger</label><div className="flex items-center gap-2"><input id="compression-trigger" type="number" className={field} value={trigger} onChange={e=>setTrigger(e.target.value)} disabled={busy} min="1" max="10000" step="0.001"/><span className="shrink-0">K tokens</span></div>
 <label htmlFor="compression-target" className="block text-sm">Compression ratio of the chat</label><input id="compression-target" type="number" min="0.01" max="0.99" step="0.01" className={field} value={target} onChange={e=>setTarget(e.target.value)} disabled={busy}/>
 <p className="text-xs text-text-secondary">A ratio of 0.5 compresses a 510K chat to approximately 255K. Instructions and the latest turn are preserved.</p>
 <Button onClick={save} disabled={busy||!trigger||!target}>Save compression settings</Button></>}{message&&<p role="status" className="text-sm">{message}</p>}</section>;
}
