import { useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { request, apiBaseUrl } from 'librechat-data-provider';
import { Download, Trash2, Upload } from 'lucide-react';

type ProjectFile = { id: string; name: string; bytes: number; updatedAt: string };
export default function ProjectFiles({ projectId }: { projectId: string }) {
  const picker = useRef<HTMLInputElement>(null);
  const cache = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const root = `${apiBaseUrl()}/api/projects/${encodeURIComponent(projectId)}/files`;
  const key = ['project-files', projectId];
  const { data: files = [], isLoading, isError } = useQuery<ProjectFile[]>(key, () => request.get(root), { refetchInterval: 10000 });
  const report = (e: unknown) => {
    const response = e as { response?: { data?: { message?: string } } };
    setError(response.response?.data?.message || (e instanceof Error && e.message === 'File exceeds 25 MB' ? e.message : 'File operation failed. Please retry.'));
  };
  async function upload(selected: FileList | null) {
    if (!selected?.length) return;
    setBusy(true); setError('');
    try {
      for (const file of Array.from(selected)) {
        if (file.size > 25 * 1024 * 1024) throw new Error('File exceeds 25 MB');
        if (files.some(existing => existing.name === file.name) && !window.confirm(`Replace ${file.name} in the project?`)) continue;
        const form = new FormData(); form.append('file', file, file.name);
        await request.postMultiPart(root, form);
      }
    } catch (e) { report(e); }
    finally { await cache.invalidateQueries(key); setBusy(false); if (picker.current) picker.current.value = ''; }
  }
  async function download(file: ProjectFile) {
    setError('');
    try {
      // Use the application's authenticated request client; never a bare public URL.
      const blob = await request.get<Blob>(`${root}/${file.id}/download`, { responseType: 'blob' });
      const url = URL.createObjectURL(blob); const link = document.createElement('a');
      link.href = url; link.download = file.name.split('/').pop() || file.name;
      document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) { report(e); }
  }
  async function remove(file: ProjectFile) {
    if (!window.confirm(`Delete ${file.name} from this project?`)) return;
    setBusy(true); setError('');
    try { await request.delete(`${root}/${file.id}`); }
    catch (e) { report(e); }
    finally { await cache.invalidateQueries(key); setBusy(false); }
  }
  return (
    <section className="p-4" aria-label="Project files">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium">Project files <span className="text-text-secondary">{files.length}</span></h2>
        <button type="button" disabled={busy} onClick={() => picker.current?.click()} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-surface-hover disabled:opacity-50">
          <Upload size={16} aria-hidden="true" />{busy ? 'Working…' : 'Upload files'}
        </button>
        <input ref={picker} type="file" multiple className="hidden" onChange={e => void upload(e.target.files)} aria-label="Choose project files" />
      </div>
      <p className="mb-3 text-xs text-text-secondary">Available in every chat in this project. Upload the same filename to replace a file. Deleting the project deletes its files.</p>
      {(error || isError) && <p role="alert" className="mb-3 text-sm text-red-500">{error || 'Could not load project files.'}</p>}
      {isLoading ? <p className="text-sm text-text-secondary">Loading files…</p> : !files.length ? <p className="text-sm text-text-secondary">Upload your source files, documents, or images here.</p> :
        <ul className="divide-y divide-border-light">{files.map(file => <li key={file.id} className="flex items-center gap-3 py-2">
          <span className="min-w-0 flex-1 break-all text-sm">{file.name}<span className="ml-2 text-xs text-text-secondary">{Math.max(1, Math.ceil(file.bytes / 1024))} KB</span></span>
          <button type="button" onClick={() => void download(file)} title={`Download ${file.name}`} aria-label={`Download ${file.name}`} className="rounded-lg p-2 hover:bg-surface-hover"><Download size={16} /></button>
          <button type="button" disabled={busy} onClick={() => void remove(file)} title={`Delete ${file.name}`} aria-label={`Delete ${file.name}`} className="rounded-lg p-2 hover:bg-surface-hover disabled:opacity-50"><Trash2 size={16} /></button>
        </li>)}</ul>}
    </section>
  );
}
