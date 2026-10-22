import { useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { request, apiBaseUrl } from 'librechat-data-provider';
import { Download, Trash2, Upload } from 'lucide-react';
import { useLocalize } from '~/hooks';

type ProjectFile = { id: string; name: string; bytes: number; updatedAt: string };
type Policy = {
  maxFiles: number; maxFileBytes: number; maxProjectBytes: number;
  supportedTypes: string[]; revision: number;
};
type Props = { projectId: string; embedded?: boolean; confirmReplacement?: boolean };

export default function ProjectUploadFiles({
  projectId, embedded = false, confirmReplacement = false,
}: Props) {
  const localize = useLocalize();
  const picker = useRef<HTMLInputElement>(null);
  const lock = useRef(false);
  const dragDepth = useRef(0);
  const cache = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const root = `${apiBaseUrl()}/api/projects/${encodeURIComponent(projectId)}/files`;
  const key = ['project-files', projectId];
  const policyKey = ['project-upload-policy', projectId];
  const { data: files = [], isLoading, isError } = useQuery<ProjectFile[]>(
    key, () => request.get(root), { refetchInterval: 10000 },
  );
  const policyQuery = useQuery<Policy>(
    policyKey, () => request.get(`${root}/policy`), { refetchInterval: 10000 },
  );
  const policy = policyQuery.data;
  const disabled = busy || !policy || policyQuery.isError;
  const message = (e: unknown) =>
    isAxiosError<{ message?: string }>(e) && e.response?.data?.message
      ? e.response.data.message : localize('com_ui_project_upload_error');

  async function upload(selected: readonly File[]) {
    if (!selected.length || lock.current || disabled) return;
    lock.current = true;
    setBusy(true); setError('');
    let failures = 0;
    let firstError = '';
    try {
      // Refresh limits before each batch; the server remains authoritative.
      const current = await request.get<Policy>(`${root}/policy`);
      cache.setQueryData(policyKey, current);
      const names = new Set(files.map(file => file.name));
      for (let i = 0; i < selected.length; i++) {
        const file = selected[i];
        setProgress({ current: i + 1, total: selected.length });
        try {
          if (file.size > current.maxFileBytes) {
            failures++;
            firstError ||= localize('com_ui_project_upload_size_error');
            continue;
          }
          if (confirmReplacement && names.has(file.name) &&
              !window.confirm(localize('com_ui_project_upload_replace', { name: file.name })))
            continue;
          const form = new FormData();
          form.append('file', file, file.name);
          // No extension filter or browser MIME check. Unsupported content returns 204.
          const result = await request.postMultiPart(root, form) as ProjectFile | undefined;
          if (result?.id) names.add(result.name);
        } catch (e) {
          failures++;
          firstError ||= message(e);
        }
      }
      if (failures)
        setError(localize('com_ui_project_upload_batch_error', {
          count: failures, message: firstError,
        }));
    } catch (e) { setError(message(e)); }
    finally {
      try { await cache.invalidateQueries(key); }
      finally {
        lock.current = false; setBusy(false); setProgress(null);
        if (picker.current) picker.current.value = '';
      }
    }
  }
  async function download(file: ProjectFile) {
    setError('');
    try {
      const blob = await request.get<Blob>(`${root}/${file.id}/download`, { responseType: 'blob' });
      const url = URL.createObjectURL(blob), link = document.createElement('a');
      link.href = url; link.download = file.name.split('/').pop() || file.name;
      document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) { setError(message(e)); }
  }
  async function remove(file: ProjectFile) {
    if (lock.current ||
        !window.confirm(localize('com_ui_project_upload_delete', { name: file.name }))) return;
    lock.current = true; setBusy(true); setError('');
    try { await request.delete(`${root}/${file.id}`); }
    catch (e) { setError(message(e)); }
    finally {
      try { await cache.invalidateQueries(key); }
      finally { lock.current = false; setBusy(false); }
    }
  }
  return (
    <section className={embedded ? 'p-4' : 'mt-6 rounded-xl border border-border-light p-4'}
      aria-label={localize('com_ui_project_upload_title')}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium">
          {localize('com_ui_project_upload_title')}{' '}
          <span className="text-text-secondary">{files.length}</span>
        </h2>
        <button type="button" disabled={disabled} onClick={() => picker.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-surface-hover disabled:opacity-50">
          <Upload size={16} aria-hidden="true" />
          {progress ? localize('com_ui_project_upload_progress', progress)
            : localize('com_ui_project_upload_choose')}
        </button>
        <input ref={picker} type="file" multiple className="hidden" disabled={disabled}
          onChange={e => void upload(Array.from(e.target.files || []))}
          aria-label={localize('com_ui_project_upload_choose')} />
      </div>
      <p className="mb-2 text-xs text-text-secondary">
        {localize('com_ui_project_upload_note')}
      </p>
      {policy && <p className="mb-3 text-xs text-text-secondary">
        {localize('com_ui_project_upload_limits', {
          count: policy.maxFiles,
          size: Number((policy.maxFileBytes / 1048576).toFixed(3)),
          total: Number((policy.maxProjectBytes / 1048576).toFixed(3)),
          types: policy.supportedTypes.join(', '),
        })}
      </p>}
      <div
        className={`mb-3 rounded-xl border border-dashed p-4 text-center text-sm ${
          dragging ? 'border-ring-primary bg-surface-hover' : 'border-border-medium text-text-secondary'
        }`}
        onDragEnter={e => {
          if (!Array.from(e.dataTransfer.types).includes('Files')) return;
          e.preventDefault(); dragDepth.current++;
          if (!disabled) setDragging(true);
        }}
        onDragOver={e => {
          if (!Array.from(e.dataTransfer.types).includes('Files')) return;
          e.preventDefault(); e.dataTransfer.dropEffect = disabled ? 'none' : 'copy';
        }}
        onDragLeave={e => {
          e.preventDefault();
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (!dragDepth.current) setDragging(false);
        }}
        onDrop={e => {
          e.preventDefault(); dragDepth.current = 0; setDragging(false);
          if (!disabled) void upload(Array.from(e.dataTransfer.files));
        }}>
        {localize('com_ui_project_upload_drop')}
      </div>
      <p role="status" aria-live="polite" className="text-xs text-text-secondary">
        {progress ? localize('com_ui_project_upload_progress', progress) : ''}
      </p>
      {(error || isError || policyQuery.isError) &&
        <p role="alert" className="mb-3 text-sm text-red-500">
          {error || localize('com_ui_project_upload_load_error')}
        </p>}
      {isLoading ? <p className="text-sm text-text-secondary">
        {localize('com_ui_project_upload_loading')}
      </p> : !files.length ? <p className="text-sm text-text-secondary">
        {localize('com_ui_project_upload_empty')}
      </p> : <ul className="divide-y divide-border-light">{files.map(file =>
        <li key={file.id} className="flex items-center gap-3 py-2">
          <span className="min-w-0 flex-1 break-all text-sm">{file.name}
            <span className="ml-2 text-xs text-text-secondary">
              {Math.max(1, Math.ceil(file.bytes / 1024))} KB
              {file.updatedAt && (
                <span className="ml-2 text-text-secondary-alt">
                  • {new Date(file.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </span>
          </span>
          <button type="button" onClick={() => void download(file)}
            aria-label={localize('com_ui_project_upload_download', { name: file.name })}
            className="rounded-lg p-2 hover:bg-surface-hover">
            <Download size={16} aria-hidden="true" />
          </button>
          <button type="button" disabled={busy} onClick={() => void remove(file)}
            aria-label={localize('com_ui_project_upload_delete', { name: file.name })}
            className="rounded-lg p-2 hover:bg-surface-hover disabled:opacity-50">
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </li>)}</ul>}
    </section>
  );
}
