import { useState } from 'react';
import { FolderInput, Plus } from 'lucide-react';
import { TooltipAnchor, OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle, Button } from '@librechat/client';
import { useQueryClient } from '@tanstack/react-query';
import { useAssignConversationToProjectMutation, useCreateProjectMutation, useProjectsInfiniteQuery } from '~/data-provider';

export default function MoveToProject({ conversationId }: { conversationId?: string }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<{ _id: string; name: string } | null>(null);
  const cache = useQueryClient();
  const projects = useProjectsInfiniteQuery({ sortBy: 'name', sortDirection: 'asc' }, { enabled: open });
  const assign = useAssignConversationToProjectMutation();
  const create = useCreateProjectMutation();
  const saved = !!conversationId && conversationId !== 'new';
  const choices = projects.data?.pages.flatMap(p => p.projects) ?? [];
  const hasMore = projects.data?.pages.at(-1)?.nextCursor != null;
  async function move() {
    if (busy || !saved) return;
    setBusy(true); setError('');
    try {
      let target = selected;
      if (creating) {
        const project = await create.mutateAsync({ name: name.trim() });
        target = project._id;
        // Preserve the created project if assignment fails: Retry never creates a duplicate.
        setCreated(project); setSelected(target); setCreating(false);
      }
      if (!target) throw Error('Choose a project.');
      await assign.mutateAsync({ conversationId: conversationId!, projectId: target });
      void cache.invalidateQueries(['lab-chat-files', conversationId]);
      setOpen(false);
    } catch { setError('Could not move this conversation. Select a project and retry.'); }
    finally { setBusy(false); }
  }
  const label = saved ? 'Move to project — choose or create a project' : 'Send a message before moving this chat to a project';
  return <>
    <TooltipAnchor description={label} render={<button type="button" title={label} aria-label="Move to project"
      aria-disabled={!saved} onClick={() => { if (saved) setOpen(true); }}
      className={`flex size-9 items-center justify-center rounded-lg hover:bg-surface-hover ${saved ? '' : 'opacity-40'}`}>
      <FolderInput size={19} aria-hidden="true" /></button>} />
    <OGDialog open={open} onOpenChange={v => { if (!busy) setOpen(v); }}>
      <OGDialogContent className="w-11/12 max-w-md bg-surface-primary text-text-primary" showCloseButton={!busy}>
        <OGDialogHeader><OGDialogTitle>Move to project</OGDialogTitle></OGDialogHeader>
        {projects.isLoading && <p role="status">Loading projects…</p>}
        {projects.isError && <button onClick={() => void projects.refetch()}>Could not load projects. Retry</button>}
        {!creating && <label className="flex flex-col gap-2 text-sm">Project
          <select value={selected} disabled={busy} onChange={e => setSelected(e.target.value)}
            className="h-10 rounded-lg border border-border-light bg-surface-primary px-3">
            <option value="">Choose a project</option>
            {created && !choices.some(p => p._id === created._id) && <option value={created._id}>{created.name}</option>}
            {choices.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select></label>}
        {!creating && hasMore && <button disabled={busy || projects.isFetchingNextPage}
          onClick={() => void projects.fetchNextPage()} className="text-sm">{projects.isFetchingNextPage ? 'Loading…' : 'Load more projects'}</button>}
        {creating && <label className="flex flex-col gap-2 text-sm">New project name
          <input autoFocus value={name} disabled={busy} onChange={e => setName(e.target.value)} maxLength={100}
            className="h-10 rounded-lg border border-border-light bg-surface-primary px-3" /></label>}
        <button type="button" disabled={busy} onClick={() => setCreating(!creating)} className="flex items-center gap-1 text-sm">
          <Plus size={16} />{creating ? 'Choose an existing project' : 'Create a new project'}
        </button>
        {error && <p role="alert" className="text-sm">{error}</p>}
        <div className="flex justify-end gap-3 pt-3">
          <Button variant="outline" disabled={busy} onClick={() => setOpen(false)}>Cancel</Button>
          <Button disabled={busy || (creating ? !name.trim() : !selected)} onClick={() => void move()}>
            {busy ? 'Moving…' : creating ? 'Create and move' : 'Move'}
          </Button>
        </div>
      </OGDialogContent>
    </OGDialog>
  </>;
}
