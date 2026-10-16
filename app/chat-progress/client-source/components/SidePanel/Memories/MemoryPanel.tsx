import { serverLocale } from '~/utils/serverTime';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { request, apiBaseUrl, QueryKeys } from 'librechat-data-provider';
import { Button, Spinner } from '@librechat/client';
import { useAuthContext } from '~/hooks';

type Entry = { key: string; value: string; updated_at: string };
type MemoryState = { memories: Entry[]; enabled: boolean; resetAt: number };
const root = `${apiBaseUrl().replace(/\/$/, '')}/api/memories`;
export default function MemoryPanel() {
  const { user } = useAuthContext();
  const cache = useQueryClient();
  const queryKey = ['lab-user-memory', user?.id];
  const { data, isLoading, isError } = useQuery<MemoryState>(queryKey,
    () => request.get<MemoryState>(root), { enabled: !!user, refetchInterval: 5000 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [value, setValue] = useState('');
  async function act(fn: () => Promise<unknown>) {
    setBusy(true); setError('');
    try {
      await fn(); setEditing(null);
      await cache.invalidateQueries(queryKey);
      await cache.invalidateQueries([QueryKeys.user]);
    } catch { setError('Could not save the change. Please retry.'); }
    finally { setBusy(false); }
  }
  return <section className="space-y-3 p-3 text-text-primary" aria-label="My Memory" data-testid="my-memory-panel">
    <p className="text-sm text-text-secondary">View, edit or delete what is remembered about you.</p>
    {isLoading && <Spinner />}
    {(error || isError) && <p role="alert" className="text-sm">{error || 'Could not load memory. Please retry.'}</p>}
    {data && <>
      <Button variant="outline" disabled={busy} onClick={() => {
        if(window.confirm('Delete all saved memories and learned patterns? Learning restarts from new messages only. Your chats and files stay intact.'))
          void act(() => request.post(`${root}/reset`, {}));
      }}>Delete all and start fresh</Button>
      {data.resetAt > 0 && <p className="text-xs text-text-secondary">Fresh learning started {serverLocale(new Date(data.resetAt))}. Older messages will not be re-read.</p>}
      {data.memories.length===0 && <p className="text-sm">No saved memories yet. New memories appear here automatically.</p>}
      {data.memories.map(e=>
        <article key={e.key} className="space-y-2 rounded border border-border-light p-3">
          {editing===e.key ? <label className="block text-sm">Edit memory
            <textarea className="mt-1 w-full rounded bg-surface-primary p-2" maxLength={600}
              value={value} onChange={event=>setValue(event.target.value)} />
          </label> : <p className="whitespace-pre-wrap text-sm">{e.value}</p>}
          <div className="flex flex-wrap gap-2">
            {editing===e.key ? <>
              <Button size="sm" disabled={busy||!value.trim()} onClick={()=>act(()=>request.patch(`${root}/${encodeURIComponent(e.key)}`,{value}))}>Save</Button>
              <Button size="sm" variant="outline" disabled={busy} onClick={()=>setEditing(null)}>Cancel</Button>
            </> : <Button size="sm" variant="outline" disabled={busy} onClick={()=>{setEditing(e.key);setValue(e.value);}}>Edit</Button>}
            <Button size="sm" variant="outline" disabled={busy} onClick={()=>{
              if(window.confirm('Delete this memory? This memory key will not be learned again until you start fresh.'))
                void act(()=>request.delete(`${root}/${encodeURIComponent(e.key)}`));
            }}>Delete</Button>
          </div>
        </article>)}
    </>}
  </section>;
}
