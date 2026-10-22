import { useEffect, useState } from 'react';
import { request, apiBaseUrl } from 'librechat-data-provider';
import { Button } from '@librechat/client';
import { useAuthContext } from '~/hooks/AuthContext';
type Group={id:string;label:string;count:number;scope?:string;kinds:Record<string,number>};
type Data={groups:Group[];pending:number;warning:string|null};
export default function CrashAdmin(){
 const {user}=useAuthContext();const [data,setData]=useState<Data|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[confirm,setConfirm]=useState<string|null>(null);
 const base=`${apiBaseUrl()}/api/admin/users/crashes`;
 async function load(){setBusy(true);setError('');try{setData(await request.get<Data>(base));}catch{setError('Unable to load crash reports.');}finally{setBusy(false);}}
 useEffect(()=>{if(user?.role==='ADMIN')void load();},[user?.role]);
 async function download(g:Group){setBusy(true);setError('');try{const x=await request.get<unknown>(`${base}/${g.id}/download`);const url=URL.createObjectURL(new Blob([JSON.stringify(x,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='crashlogs-'+g.id.slice(0,12)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch{setError('Download failed.');}finally{setBusy(false);}}
 async function remove(g:Group){setBusy(true);setError('');try{await request.post(`${base}/${g.id}/delete`,{});setConfirm(null);await load();}catch{setError('Delete failed.');}finally{setBusy(false);}}
 if(user?.role!=='ADMIN')return null;
 return <section className="h-full overflow-y-auto p-3 text-text-primary" aria-label="Crash reports"><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Crash reports</h2><Button variant="ghost" disabled={busy} onClick={load}>Refresh</Button></div>
 <div className="mb-3 flex flex-wrap gap-2"><Button variant="outline" disabled={busy} onClick={()=>download({id:'all',label:'All',count:0,kinds:{}})}>Dump all</Button><Button variant="ghost" disabled={busy} onClick={()=>setConfirm('all')}>Delete all crashlogs</Button></div>
 {confirm==='all'&&<div className="mb-3 text-sm"><p>Delete all current crashlogs and their labels? This cannot be undone.</p><Button disabled={busy} onClick={()=>remove({id:'all',label:'All',count:0,kinds:{}})}>Delete all</Button><Button variant="ghost" onClick={()=>setConfirm(null)}>Cancel</Button></div>}
 {error&&<p role="alert">{error}</p>}{data?.warning&&<p role="alert">{data.warning}</p>}
 {data?.groups.length===0&&<p className="text-sm text-text-secondary">No crash reports.</p>}
 {data?.groups.map(g=><article key={g.id} className="border-b border-border-light py-3"><div className="flex justify-between gap-2"><h3 className="break-words font-medium"><span className="mb-1 block text-xs text-text-secondary">{g.scope==='chat'?'Chat failure':g.scope==='interface'?'Interface error':g.scope==='server'?'Server alert · not linked to a chat':'Mixed sources'}</span>{g.label}</h3><span className="tabular-nums">{g.count}</span></div><p className="mt-1 text-xs text-text-secondary">{Object.entries(g.kinds).map(([k,n])=>`${k.replaceAll('_',' ')}: ${n}`).join(' · ')}</p><div className="mt-2 flex gap-2"><Button variant="outline" disabled={busy} onClick={()=>download(g)}>Download</Button><Button variant="ghost" disabled={busy} onClick={()=>setConfirm(g.id)}>Delete</Button></div>{confirm===g.id&&<div className="mt-2 text-sm"><p>Delete these {g.count} reports? Their label will also be deleted.</p><Button disabled={busy} onClick={()=>remove(g)}>Delete reports</Button><Button variant="ghost" onClick={()=>setConfirm(null)}>Cancel</Button></div>}</article>)}
 </section>;
}
