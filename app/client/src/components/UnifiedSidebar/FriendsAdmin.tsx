import React,{useEffect,useState} from 'react';
import {Button} from '@librechat/client';
import {Trash2} from 'lucide-react';
import {request,apiBaseUrl} from 'librechat-data-provider';
type Friend={id:string;name:string;email:string;state:string;expiresAt:string};
type Code={id:string;label:string;expiresAt:string};
const base=()=>`${apiBaseUrl()}/api/admin/users/friends`;
const date=(s:string)=>new Date(s).toLocaleDateString('en-US',{timeZone:'America/Los_Angeles',year:'numeric',month:'short',day:'numeric'});
const error=(e:any)=>e?.response?.data?.message||'Request failed. Please retry.';
export default function FriendsAdmin(){
 const [friends,setFriends]=useState<Friend[]>([]),[codes,setCodes]=useState<Code[]>([]),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false),[invitation,setInvitation]=useState<{code:string;registrationURL:string;expiresAt:string}|null>(null),[selected,setSelected]=useState<Friend|null>(null),[confirm,setConfirm]=useState('');
 async function load(){const r=await request.get<{friends:Friend[];codes:Code[]}>(base());setFriends(r.friends);setCodes(r.codes);}
 useEffect(()=>{load().catch(e=>setNotice(error(e)));},[]);
 async function action(work:()=>Promise<void>){setBusy(true);setNotice('');try{await work();await load();}catch(e){setNotice(error(e));}finally{setBusy(false);}}
 const field='w-full rounded-lg border border-border-medium bg-surface-primary px-3 py-2 text-text-primary';
 return <section className="mt-5 space-y-3 border-t border-border-light pt-3"><h3 className="font-semibold">FRIENDS</h3>
 <Button disabled={busy} onClick={()=>action(async()=>{setInvitation(await request.post(base()+'/codes',{}));})}>Generate registration code</Button>
 {invitation&&<div className="space-y-2 rounded-lg bg-surface-secondary p-3 text-sm"><div className="break-all font-mono select-all">{invitation.code}</div><div>Single use · Expires {date(invitation.expiresAt)}</div><Button disabled={busy} onClick={()=>navigator.clipboard.writeText(`Register at ${invitation.registrationURL}\nYour single-use code: ${invitation.code}\nUse it by ${date(invitation.expiresAt)}. Your access lasts six months from registration.`).then(()=>setNotice('Copied for WhatsApp.')).catch(()=>setNotice('Select and copy the code above.'))}>Copy invitation</Button><a className="block break-all underline" href={invitation.registrationURL} target="_blank" rel="noreferrer">{invitation.registrationURL}</a></div>}
 {codes.length>0&&<details><summary className="cursor-pointer text-sm">Unused codes ({codes.length})</summary>{codes.map(c=><div key={c.id} className="flex items-center justify-between py-1 text-sm"><span>…{c.label} · {date(c.expiresAt)}</span><Button variant="ghost" disabled={busy} onClick={()=>action(async()=>{await request.post(base()+'/codes/'+c.id+'/revoke',{});setInvitation(null);})}>Revoke</Button></div>)}</details>}
 <div className="max-h-72 overflow-y-auto">{friends.length===0?<p className="text-sm text-text-secondary">No FRIENDS registered yet.</p>:friends.map(f=><div key={f.id} className="space-y-1 border-b border-border-light py-2"><div className="break-words text-sm">{f.email}</div><div className="text-xs text-text-secondary">{f.state==='deleting'?'Deletion in progress':`Expires ${date(f.expiresAt)}`}</div><div className="flex gap-2"><Button variant="ghost" disabled={busy||f.state!=='active'} onClick={()=>action(async()=>{await request.post(base()+'/'+f.id+'/convert',{});setNotice('Converted to a regular user.');})}>Make regular user</Button><Button variant="ghost" size="icon" aria-label={`Delete ${f.email}`} disabled={busy||f.state==='deleting'} onClick={()=>{setSelected(f);setConfirm('');}}><Trash2 className="h-4 w-4"/></Button></div></div>)}</div>
 {selected&&<div className="space-y-2"><p className="text-sm">Delete {selected.email} and all their data? Type their email to confirm.</p><input aria-label="Confirm email" className={field} value={confirm} onChange={e=>setConfirm(e.target.value)}/><Button variant="destructive" disabled={busy||confirm.trim().toLowerCase()!==selected.email.toLowerCase()} onClick={()=>action(async()=>{await request.post(base()+'/'+selected.id+'/delete',{confirmEmail:confirm});setSelected(null);setNotice('Account blocked; deletion scheduled.');})}>Delete account</Button><Button variant="ghost" disabled={busy} onClick={()=>setSelected(null)}>Cancel</Button></div>}
 {notice&&<p role="status" className="text-sm">{notice}</p>}
 </section>;
}
