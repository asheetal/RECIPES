import ProjectUploadSettings from './ProjectUploadSettings';
import ModelAccessSettings from './ModelAccessSettings';

import LLMRoleSettings from './LLMRoleSettings';
import FriendsAdmin from './FriendsAdmin';
import CompressionSettings from './CompressionSettings';
import React, { useEffect, useState } from 'react';
import { Shield, Trash2 } from 'lucide-react';
import { Button, OGDialog, OGDialogContent, OGDialogTitle, TooltipAnchor } from '@librechat/client';
import { request, apiBaseUrl } from 'librechat-data-provider';
import { useAuthContext } from '~/hooks/AuthContext';

type Person = { id: string; name: string; email: string; role: string };
type Group = 'apis' | 'pool' | 'users' | 'models' | 'workflow' | 'friends' | 'compression' | 'uploads';
const groups: { id: Group; label: string }[] = [
 { id: 'users', label: 'Users' },
 { id: 'apis', label: 'API access' },
 { id: 'pool', label: 'Model access' },
 { id: 'models', label: 'LLM assignments' },
 { id: 'workflow', label: 'Workflow' },
 { id: 'friends', label: 'Friends' },
 { id: 'compression', label: 'Compression' },
 { id: 'uploads', label: 'Project files' },
];
const base = () => `${apiBaseUrl()}/api/admin/users`;
const errorText = (e: any) =>
 e?.response?.data?.message || e?.response?.data?.error || 'Request failed. Please try again.';

export default function AdminTools() {
 const { user } = useAuthContext();
 const [open, setOpen] = useState(false);
 const [group, setGroup] = useState<Group>('users');
 const [email, setEmail] = useState('');
 const [notice, setNotice] = useState('');
 const [people, setPeople] = useState<Person[]>([]);
 const [offset, setOffset] = useState(0);
 const [total, setTotal] = useState(0);
 const [busy, setBusy] = useState(false);
 const [loading, setLoading] = useState(false);
 const [selected, setSelected] = useState<Person | null>(null);
 const [confirm, setConfirm] = useState('');
 const isAdmin = user?.role === 'ADMIN';

 async function load(page: number) {
  setLoading(true);
  try {
   const r = await request.get<{ users: Person[]; total: number }>(
    `${base()}?limit=20&offset=${page}`
   );
   setPeople(r.users);
   setTotal(r.total);
  } catch (e) {
   setNotice(errorText(e));
  } finally {
   setLoading(false);
  }
 }
 useEffect(() => {
  if (open && isAdmin && group === 'users') void load(offset);
 }, [open, isAdmin, offset, group]);

 if (!isAdmin) return null;

 async function send(e: React.FormEvent) {
  e.preventDefault();
  setBusy(true);
  setNotice('');
  try {
   const r = await request.post(`${base()}/invite`, { email });
   setNotice(r.message);
   setEmail('');
  } catch (e) {
   setNotice(errorText(e));
  } finally {
   setBusy(false);
  }
 }
 async function remove() {
  if (!selected) return;
  setBusy(true);
  setNotice('');
  try {
   await request.post(`${base()}/${selected.id}/delete`, { confirmEmail: confirm });
   setSelected(null);
   setConfirm('');
   setNotice('User deleted.');
   await load(offset);
  } catch (e) {
   setNotice(errorText(e));
  } finally {
   setBusy(false);
  }
 }
 const field =
  'w-full rounded-lg border border-border-medium bg-surface-primary px-3 py-2 text-text-primary';

 return <>
  <TooltipAnchor side="right" description="Admin settings" render={
   <Button size="icon" variant="ghost" aria-label="Admin"
    className="h-9 w-9 rounded-lg"
    onClick={() => { setNotice(''); setOpen(true); }}>
    <Shield className="h-5 w-5" aria-hidden="true" />
   </Button>
  } />
  <OGDialog open={open} onOpenChange={v => {
   if (!busy) { setOpen(v); setSelected(null); setConfirm(''); }
  }}>
   <OGDialogContent className="flex max-h-[90vh] w-11/12 max-w-4xl flex-col overflow-hidden">
    <OGDialogTitle>Admin</OGDialogTitle>
    <div className="mt-3 grid min-h-0 flex-1 grid-cols-[110px_minmax(0,1fr)] gap-3 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-5 overflow-hidden">
     <nav aria-label="Admin sections"
      className="space-y-1 overflow-y-auto border-r border-border-medium pr-2 sm:pr-4">
      {groups.map(item =>
       <button key={item.id} type="button" disabled={busy}
        aria-current={group === item.id ? 'page' : undefined}
        aria-controls={`admin-section-${item.id}`}
        onClick={() => setGroup(item.id)}
        className={`w-full rounded-lg px-2 py-2 text-left text-sm disabled:opacity-50 ${
         group === item.id
          ? 'bg-surface-secondary font-semibold text-text-primary'
          : 'text-text-secondary hover:bg-surface-secondary'
        }`}>
        {item.label}
       </button>
      )}
     </nav>
     <div className="min-w-0 overflow-y-auto pr-1">
      <div id="admin-section-users" hidden={group !== 'users'}>
       <h3 className="font-semibold">Users</h3>
       <form onSubmit={send} className="mt-4 space-y-2">
        <label htmlFor="admin-invite-email">Add user email</label>
        <div className="flex flex-wrap gap-2">
         <input id="admin-invite-email" type="email" required maxLength={120}
          value={email} onChange={e => setEmail(e.target.value)}
          className={field} disabled={busy} />
         <Button type="submit" disabled={busy || !email.trim()}>Send</Button>
        </div>
       </form>
       {notice && <p role="status" className="mt-3 text-sm">{notice}</p>}
       <div className="mt-4">
        {loading ? <p>Loading…</p> : people.map(p =>
         <div key={p.id}
          className="flex items-center justify-between gap-2 border-b border-border-light py-2">
          <span className="min-w-0 break-words text-sm">{p.email || p.name}</span>
          {p.role !== 'ADMIN' && p.id !== user?.id &&
           <Button variant="ghost" size="icon" aria-label={`Delete ${p.email}`}
            disabled={busy} onClick={() => { setSelected(p); setConfirm(''); }}>
            <Trash2 className="h-4 w-4" />
           </Button>}
         </div>
        )}
       </div>
       {total > 20 && <div className="mt-2 flex justify-between">
        <Button variant="ghost" disabled={busy || loading || offset === 0}
         onClick={() => setOffset(Math.max(0, offset - 20))}>Previous</Button>
        <Button variant="ghost" disabled={busy || loading || offset + 20 >= total}
         onClick={() => setOffset(offset + 20)}>Next</Button>
       </div>}
       {selected && <div className="mt-4 space-y-2 border-t border-border-medium pt-3">
        <p className="text-sm">
         Permanently delete {selected.email} and their chats, files, projects, and memory?
        </p>
        <label htmlFor="admin-delete-confirm" className="text-sm">
         Type their email to confirm
        </label>
        <input id="admin-delete-confirm" value={confirm}
         onChange={e => setConfirm(e.target.value)} className={field} disabled={busy} />
        <div className="flex gap-2">
         <Button variant="destructive"
          disabled={busy || confirm.trim().toLowerCase() !== selected.email.toLowerCase()}
          onClick={remove}>Delete user</Button>
         <Button variant="ghost" disabled={busy}
          onClick={() => setSelected(null)}>Cancel</Button>
        </div>
       </div>}
      </div>
      <div
       id={group === 'workflow' ? 'admin-section-workflow' : 'admin-section-models'}
       hidden={group !== 'models' && group !== 'workflow'}>
       {open && <LLMRoleSettings section={group === 'workflow' ? 'workflow' : 'models'} />}
      </div>
      {open && (group === 'apis' || group === 'pool') && <div id={`admin-section-${group}`}><ModelAccessSettings section={group} /></div>}
      <div id="admin-section-friends" hidden={group !== 'friends'}>
       {open && <FriendsAdmin />}
      </div>
      <div id="admin-section-compression" hidden={group !== 'compression'}>
       {open && <CompressionSettings />}
       </div>
       <div id="admin-section-uploads" hidden={group !== 'uploads'}>
        {open && group === 'uploads' && <ProjectUploadSettings />}
      </div>
     </div>
    </div>
   </OGDialogContent>
  </OGDialog>
 </>;
}
