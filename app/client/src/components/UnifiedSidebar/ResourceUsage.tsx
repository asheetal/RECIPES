import { useEffect, useState } from 'react';
import { request, apiBaseUrl } from 'librechat-data-provider';
import { Button } from '@librechat/client';
import { useAuthContext } from '~/hooks/AuthContext';
type Snapshot={server:{cpuPercent:number;cpuCount:number;ramTotal:number;ramUsed:number;diskTotal:number;diskUsed:number;diskAvailable:number;failedServices:string[];systemErrors24h:number|null;warnings:string[];warning?:string};apis:{origin:string;name:string;calls24h:number;calls30d:number;status:string}[];recordingWarning:string|null};
const gb=(n:number)=>(n/1073741824).toFixed(1)+' GB';
export default function ResourceUsage(){
 const {user}=useAuthContext();const [data,setData]=useState<Snapshot|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function load(){setBusy(true);setError('');try{setData(await request.get<Snapshot>(`${apiBaseUrl()}/api/admin/users/resources`));}catch(e){setError('Unable to load resource status.');}finally{setBusy(false);}}
 useEffect(()=>{if(user?.role==='ADMIN')void load();},[user?.role]);
 if(user?.role!=='ADMIN')return null;
 return <section className="h-full overflow-y-auto p-3 text-text-primary" aria-label="Resource usage">
  <div className="mb-4 flex items-center justify-between gap-2"><h2 className="font-semibold">Resource usage</h2><Button variant="ghost" disabled={busy} onClick={load}>Refresh</Button></div>
  {error&&<p role="alert" className="mb-3 text-sm">{error}</p>}{busy&&!data&&<p role="status">Loading…</p>}
  {data&&<><h3 className="mb-2 font-medium">Server status</h3><dl className="space-y-2 text-sm">
   <div className="flex justify-between gap-2"><dt>CPU</dt><dd>{data.server.cpuPercent}% · {data.server.cpuCount} cores</dd></div>
   <div className="flex justify-between gap-2"><dt>RAM</dt><dd>{gb(data.server.ramUsed)} / {gb(data.server.ramTotal)}</dd></div>
   <div className="flex justify-between gap-2"><dt>Disk</dt><dd>{gb(data.server.diskUsed)} / {gb(data.server.diskTotal)}</dd></div>
   <div className="flex justify-between gap-2"><dt>Disk available</dt><dd>{gb(data.server.diskAvailable)}</dd></div>
   <div className="flex justify-between gap-2"><dt>System errors · 24h</dt><dd>{data.server.systemErrors24h??'Check journal'}</dd></div>
   <div className="flex justify-between gap-2"><dt>Failed services</dt><dd>{data.server.failedServices.length}</dd></div>
  </dl>
  {data.server.failedServices.map(s=><p key={s} className="mt-1 break-all text-sm">{s}</p>)}
  {[...data.server.warnings,data.server.warning,data.recordingWarning].filter(Boolean).map((s,i)=><p role="alert" key={i} className="mt-2 text-sm">{s}</p>)}
  <h3 className="mb-2 mt-6 font-medium">API status</h3>
  <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-border-medium"><th className="py-2">API</th><th className="px-2 text-right" title="Requests in the last 24 hours; retries count separately">24h</th><th className="text-right" title="Requests in the last 30 days; retries count separately">30 days</th></tr></thead><tbody>
   {data.apis.map(a=><tr key={a.origin} className="border-b border-border-light"><td className="py-3"><div className="break-words" title={a.origin}>{a.name}</div><div className="text-xs text-text-secondary">{a.status}</div></td><td className="px-2 text-right tabular-nums">{a.calls24h.toLocaleString()}</td><td className="text-right tabular-nums">{a.calls30d.toLocaleString()}</td></tr>)}
  </tbody></table></div></>}
 </section>;
}
