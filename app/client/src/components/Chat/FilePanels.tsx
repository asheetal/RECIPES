import MoveToProject from './MoveToProject';
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import store from '~/store';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FolderOpen, Files, X, Download, FolderPlus, Trash2 } from 'lucide-react';
import { TooltipAnchor } from '@librechat/client';
import { apiBaseUrl, request } from 'librechat-data-provider';
import { useChatContext } from '~/Providers';
import ProjectFilesPanel from './ProjectFilesPanel';
import type { ReactNode } from 'react';

type Mode = 'project' | 'chat' | null;
const Context = createContext<{
  mode: Mode; toggle: (mode: Exclude<Mode, null>) => void; close: () => void;
  projectId?: string; conversationId?: string;
} | null>(null);
export function FilePanelsProvider({ children, projectId }: { children: ReactNode; projectId?: string }) {
  const { conversation } = useChatContext();
  const conversationId = conversation?.conversationId ?? undefined;
  const currentProject = conversation?.chatProjectId ?? projectId;
  const [mode, setMode] = useState<Mode>(null);
  const setArtifactsVisible = useSetRecoilState(store.artifactsVisibility);
  useEffect(() => setMode(null), [conversationId, currentProject]);
  return <Context.Provider value={{ mode, projectId: currentProject ?? undefined, conversationId,
    toggle: next => { setArtifactsVisible(false); setMode(prev => prev === next ? null : next); }, close: () => setMode(null) }}>{children}</Context.Provider>;
}
export function FilePanelButtons() {
  const c = useContext(Context);
  if (!c) return null;
  return <div className="flex shrink-0 items-center gap-1">
    {!c.projectId && <MoveToProject key={c.conversationId} conversationId={c.conversationId} />}
    {(['project', 'chat'] as const).map(mode => {
      if (mode === 'project' && !c.projectId) return null;
      const Icon = mode === 'project' ? FolderOpen : Files;
      const disabled = mode === 'project' && !c.projectId;
      const label = mode === 'project'
        ? (disabled ? 'Open a chat in a project to view project files' : 'Project files — shared across chats in this project')
        : 'Chat files — uploaded or created in this chat';
      return <TooltipAnchor key={mode} description={label} render={<button type="button"
        title={label} aria-label={label} aria-expanded={c.mode === mode} aria-controls="lab-file-panel"
        aria-disabled={disabled} onClick={() => { if (!disabled) c.toggle(mode); }}
        className={`flex size-9 items-center justify-center rounded-lg hover:bg-surface-hover ${disabled ? 'opacity-40' : ''} ${c.mode === mode ? 'bg-surface-hover' : ''}`}>
        <Icon size={19} aria-hidden="true" /></button>} />;
    })}
  </div>;
}
type ChatFile = { id: string; name: string; bytes: number; downloadPath: string; updatedAt?: string };
function ChatFiles({ conversationId, projectId }: { conversationId?: string; projectId?: string }) {
  const cache = useQueryClient();
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');
  const saved = !!conversationId && conversationId !== 'new';
  const root = apiBaseUrl();
  const { data, isLoading, isError } = useQuery<{ projectId: string | null; files: ChatFile[] }>(
    ['lab-chat-files', conversationId], () => request.get(`${root}/api/projects/chat-files/${encodeURIComponent(conversationId!)}`),
    { enabled: saved, refetchInterval: 5000, refetchOnMount: "always", refetchOnWindowFocus: true });
  const targetProject = data?.projectId ?? projectId;
  async function act(file: ChatFile, promote: boolean) {
    setBusy(file.id); setNotice('');
    try {
      if (promote && !targetProject) throw Error('Open this chat in a project first.');
      if (promote && file.bytes > 25 * 1024 * 1024) throw Error('Project files are limited to 25 MB.');
      if (promote) {
        const existing = await request.get<{ name: string }[]>(`${root}/api/projects/${targetProject}/files`);
        if (existing.some(x => x.name === file.name) && !window.confirm(`Replace ${file.name} in the project?`)) return;
      }
      const blob = await request.get<Blob>(root + file.downloadPath, { responseType: 'blob' });
      if (promote) {
        const form = new FormData(); form.append('file', blob, file.name);
        await request.postMultiPart(`${root}/api/projects/${targetProject}/files`, form);
        await cache.invalidateQueries(['project-files', targetProject]);
        setNotice('Saved to project.');
      } else {
        const url = URL.createObjectURL(blob); const link = document.createElement('a');
        link.href = url; link.download = file.name; document.body.appendChild(link); link.click(); link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 60000);
      }
    } catch (e) { setNotice(e instanceof Error && !('response' in e) ? e.message : 'File unavailable or operation failed. Please retry.'); }
    finally { setBusy(''); }
  }

  async function remove(file: ChatFile) {
    if (!window.confirm(`Permanently delete ${file.name}?`)) return;
    setBusy(file.id); setNotice('');
    try {
      await request.post(
        `${root}/api/projects/chat-files/${encodeURIComponent(conversationId!)}/delete`,
        { fileId: file.id }
      );
      await cache.invalidateQueries(['lab-chat-files', conversationId]);
      await cache.invalidateQueries(['files']);
    } catch (e: any) {
      setNotice(e?.response?.data?.message || 'File deletion failed.');
    } finally { setBusy(''); }
  }
  return <div className="p-4">
    <div className="mb-3 flex items-center justify-between gap-2"><p className="text-xs text-text-secondary">Files uploaded or created in this chat. Save a copy to the project to share it across chats.</p>
</div>
    {notice && <p role="status" className="mb-3 text-sm">{notice}</p>}
    {!saved ? <p className="text-sm">Send your message to see its uploaded files here.</p> : isLoading ? <p>Loading files…</p> : isError ? <p role="alert">Could not load chat files.</p> : !data?.files.length ? <p className="text-sm">No files in this chat yet.</p> :
      <ul className="divide-y divide-border-light">{data.files.map(file => <li key={file.id} className="py-3">
        <p className="break-all text-sm font-medium">{file.name}</p>
        <p className="text-xs text-text-secondary">
          {Math.ceil(file.bytes / 1024)} KB
          {file.updatedAt && (
            <span className="ml-2 text-text-secondary-alt">
              • {new Date(file.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button disabled={!!busy} onClick={() => void act(file, false)} className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-surface-hover"><Download size={14} />Download</button>
          {targetProject && <button disabled={!!busy} onClick={() => void act(file, true)} className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-surface-hover"><FolderPlus size={14} />Save to project</button>}
          <button type="button" disabled={!!busy}
            onClick={() => void remove(file)}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-surface-hover">
            <Trash2 size={14} />Delete
          </button>
        </div></li>)}</ul>}
  </div>;
}
export function useFilePanel() {
  const c = useContext(Context);
  return c?.mode ? <FilePanel /> : null;
}
function FilePanel() {
  const c = useContext(Context)!;
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeButton.current?.focus(); }, [c.mode]);
  return <aside id="lab-file-panel" aria-label={c.mode === 'project' ? 'Project files' : 'Chat files'}
    className="flex h-full min-w-0 flex-col bg-surface-primary text-text-primary"
    onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); c.close(); } }}>
    <div className="flex items-center justify-between border-b border-border-light p-3"><h2 className="font-semibold">{c.mode === 'project' ? 'Project files' : 'Chat files'}</h2>
      <button ref={closeButton} type="button" title="Close files and expand chat" aria-label="Close files and expand chat" onClick={c.close} className="rounded p-2 hover:bg-surface-hover"><X size={18} /></button></div>
    <div className="min-h-0 flex-1 overflow-y-auto">{c.mode === 'project' && c.projectId ? <ProjectFilesPanel projectId={c.projectId} /> : <ChatFiles key={c.conversationId} conversationId={c.conversationId} projectId={c.projectId} />}</div>
  </aside>;
}
