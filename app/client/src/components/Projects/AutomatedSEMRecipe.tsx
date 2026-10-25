import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Download, FileJson, Trash2, Upload } from 'lucide-react';
import { Spinner } from '@librechat/client';
import { useQueryClient } from '@tanstack/react-query';
import { request, apiBaseUrl } from 'librechat-data-provider';
import { cn } from '~/utils';

type FileRow = { id: string; name: string; bytes: number };
const STEP_LABELS = ['Preview workbook','Schema resolve','Taxonomy','Search grid','Thresholds','Filter','Theory review','Bootstrap','Descriptives','Topology','Render diagram','Report','Package'];
type StepInfo = { ok: boolean };
type RunState = { status: 'idle' | 'running' | 'done' | 'failed'; fileId?: string | null; fileName?: string | null; steps?: Record<string, StepInfo>; error?: string | null };

async function getJson(u: string) { return request.get(u); }
async function postJson(u: string, b: unknown) { return request.post(u, b); }
async function delJson(u: string) { return request.delete(u); }

export default function AutomatedSEMRecipe({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<RunState>({ status: 'idle' });
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<FileRow[]>([]);
  const [selected, setSelected] = useState<FileRow | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const pollRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const base = `${apiBaseUrl()}/api/projects/${encodeURIComponent(projectId)}/automated-sem`;
  const filesBase = `${apiBaseUrl()}/api/projects/${encodeURIComponent(projectId)}/files`;

  const refresh = useCallback(async () => {
    try {
      const s: RunState = await getJson(base);
      setState(s);
      if (s.status === 'running' && pollRef.current == null) pollRef.current = window.setInterval(refresh, 2000);
      else if (s.status !== 'running' && pollRef.current != null) { window.clearInterval(pollRef.current); pollRef.current = null; }
    } catch { /* silent */ }
  }, [base]);

  useEffect(() => { refresh(); return () => { if (pollRef.current != null) window.clearInterval(pollRef.current); }; }, [refresh]);

  const loadFiles = useCallback(async () => {
    try { const rows: FileRow[] = await getJson(filesBase); setFiles(rows); if (state.fileId) setSelected(rows.find(r => r.id === state.fileId) ?? null); }
    catch { setFiles([]); }
  }, [filesBase, state.fileId]);

  const openModal = useCallback(() => { setOpen(true); setSelected(null); setUploadError(null); loadFiles(); }, [loadFiles]);

  const upload = useCallback(async (file: File) => {
    setUploading(true); setUploadError(null);
    try {
      const fd = new FormData(); fd.append('file', file);
      const saved = (await request.postMultiPart(filesBase, fd)) as FileRow | undefined;
      if (!saved) { setUploadError('Rejected.'); return; }
      await loadFiles(); if (saved?.id) setSelected(saved);
    } catch (e) { setUploadError((e as Error).message || 'Upload failed.'); }
    finally { setUploading(false); }
  }, [filesBase, loadFiles]);

  const run = useCallback(async () => {
    if (!selected) return;
    setOpen(false);
    setState({ status: 'running', fileId: selected.id, fileName: selected.name });
    try { const res = await postJson(`${base}/start`, { fileId: selected.id }); if (res && res.state) setState(res.state); }
    catch (e) { setState({ status: 'failed', error: (e as Error).message }); }
    refresh();
  }, [selected, base, refresh]);

  const latestStep = (): number => {
    let max = 0;
    for (const k of Object.keys(state.steps || {})) if (state.steps[k]?.ok) { const n = Number(k); if (n > max) max = n; }
    return max;
  };

  const download = useCallback(async () => {
    const n = 1;
    if (latestStep() < 1) return;
    try {
      const blob = (await request.get(`${base}/output/${n}`, { responseType: 'blob' })) as unknown as Blob;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `step${n}_out.json`;
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    } catch { /* state surfaces it */ }
  }, [base, state.steps]);

  const remove = useCallback(async () => { await delJson(base); setState({ status: 'idle' }); queryClient.invalidateQueries(); }, [base, queryClient]);

  const have = latestStep() > 0;

  return (
    <>
      <button type="button" onClick={openModal} data-testid="recipe-tile-automated-sem" aria-label="Automated SEM Pipeline recipe" disabled={state.status === 'running'}
        className={cn('group/recipe flex min-h-[6.5rem] flex-col rounded-xl border border-border-medium bg-surface-secondary p-4 text-left transition-colors', 'hover:border-border-heavy hover:bg-surface-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-primary', state.status === 'running' && 'opacity-60')}>
        <span className="flex min-w-0 items-center gap-2"><FileJson className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" /><span className="truncate text-base font-semibold text-text-primary">Automated SEM Pipeline</span></span>
        <span className="mt-2 flex items-center gap-2 text-sm">
          {state.status === 'running' && <Spinner className="h-4 w-4" />}
          {state.status === 'running' && <span className="text-text-secondary">{(() => { const done = latestStep(); const cur = done >= 13 ? 13 : done + 1; const lbl = STEP_LABELS[cur - 1] || ''; return `Step ${cur}/13 · ${lbl}`; })()}</span>}
          {state.status === 'failed' && <span className="text-red-600 dark:text-red-400" title={state.error ?? 'Failed'}>{state.error ? state.error.slice(0, 80) : 'Failed'}</span>}
          {state.status === 'done' && <Check className="h-4 w-4 text-green-600 dark:text-green-400" />}
          {state.status === 'done' && <span className="text-text-secondary">13/13 · complete</span>}
          {state.status === 'idle' && <span className="text-text-secondary">Upload an Excel file with codebook and survey data</span>}
          {have && state.status !== 'running' && (
            <button type="button" onClick={(e) => { e.stopPropagation(); download(); }} aria-label="Download step JSON" className="rounded p-1 hover:bg-surface-hover"><Download className="h-4 w-4" /></button>
          )}
          {(state.status === 'done' || have) && state.status !== 'running' && (
            <button type="button" onClick={(e) => { e.stopPropagation(); remove(); }} aria-label="Delete run" className="rounded p-1 hover:bg-surface-hover"><Trash2 className="h-4 w-4" /></button>
          )}
        </span>
      </button>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Automated SEM Pipeline recipe" className="fixed inset-0 z-[130] flex items-center justify-center bg-black/40" onClick={() => setOpen(false)}>
          <div className="w-11/12 max-w-lg rounded-xl border border-border-medium bg-surface-primary p-5" onClick={(e) => e.stopPropagation()}>
            <div className="max-h-64 overflow-y-auto rounded-lg border border-border-light">
              {files.length === 0 && <div className="p-4 text-sm text-text-secondary">No files yet.</div>}
              {files.map((f) => (
                <button key={f.id} type="button" onClick={() => setSelected(f)} className={cn('flex w-full items-center justify-between gap-2 border-b border-border-light px-3 py-2 text-left text-sm last:border-b-0 hover:bg-surface-hover', selected?.id === f.id && 'bg-surface-active-alt')}>
                  <span className="truncate text-text-primary">{f.name}</span><span className="shrink-0 text-xs text-text-secondary">{Math.round(f.bytes / 1024)} KB</span>
                </button>
              ))}
            </div>
            <div className="mt-3">
              <input ref={inputRef} type="file" accept=".xlsx" className="hidden" onChange={(e) => { const fl = e.target.files?.[0]; if (fl) upload(fl); }} />
              <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 rounded-lg border border-border-medium px-3 py-2 text-sm text-text-primary hover:bg-surface-hover disabled:opacity-50">
                {uploading ? <Spinner className="h-4 w-4" /> : <Upload className="h-4 w-4" />} Upload
              </button>
            </div>
            {uploadError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{uploadError}</p>}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button type="button" className="rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover" onClick={() => setOpen(false)}>Cancel</button>
              <button type="button" onClick={run} disabled={!selected} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Run</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
