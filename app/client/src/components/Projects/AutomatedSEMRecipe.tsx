import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Check, Download, FileJson, Package, Trash2, Upload } from 'lucide-react';
import { Spinner } from '@librechat/client';
import { useQueryClient } from '@tanstack/react-query';
import { request, apiBaseUrl } from 'librechat-data-provider';
import { cn } from '~/utils';

type FileRow = { id: string; name: string; bytes: number };
type StepInfo = { ok: boolean };
type RunState = { status: 'idle' | 'running' | 'done' | 'failed'; fileId?: string | null; fileName?: string | null; steps?: Record<string, StepInfo>; error?: string | null };

async function getJson(u: string) { return request.get(u); }
async function postJson(u: string, b: unknown) { return request.post(u, b); }
async function delJson(u: string) { return request.delete(u); }

const TOTAL_STEPS = 13;

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
      if (!saved) { setUploadError('That file was rejected as an unsupported or invalid workbook.'); return; }
      await loadFiles(); if (saved?.id) setSelected(saved); else setUploadError('Upload succeeded but no file record returned.');
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

  const downloadStep = useCallback(async (step: number) => {
    try {
      const blob = (await request.get(`${base}/output/${step}`, { responseType: 'blob' })) as unknown as Blob;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `step${step}_out.json`;
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    } catch { /* state surfaces it */ }
  }, [base]);

  const downloadArtifacts = useCallback(async () => {
    try {
      const blob = (await request.get(`${base}/artifacts`, { responseType: 'blob' })) as unknown as Blob;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'asp_artifacts.zip';
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    } catch { /* state surfaces it */ }
  }, [base]);

  const remove = useCallback(async () => { await delJson(base); setState({ status: 'idle' }); queryClient.invalidateQueries(); }, [base, queryClient]);

  const doneSteps = (): number[] => {
    const out: number[] = [];
    for (let n = 1; n <= TOTAL_STEPS; n += 1) if (state.steps?.[String(n)]?.ok) out.push(n);
    return out;
  };

  const statusLine = () => {
    const ds = doneSteps();
    if (state.status === 'running') {
      const last = ds.length > 0 ? ds[ds.length - 1] : 0;
      return (<span className="mt-2 flex items-center gap-2 text-sm text-text-secondary"><Spinner className="h-4 w-4" /> Step {last + 1 > TOTAL_STEPS ? TOTAL_STEPS : last + 1} of {TOTAL_STEPS}…</span>);
    }
    if (state.status === 'failed') return (<span className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400" title={state.error ?? 'Failed'}><AlertTriangle className="h-4 w-4" /> Failed — {state.error ?? 'see server log'}</span>);
    if (state.status === 'done') {
      return (
        <span className="mt-2 flex flex-wrap items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <Check className="h-4 w-4" /> All {TOTAL_STEPS} steps
          <button type="button" onClick={(e) => { e.stopPropagation(); downloadArtifacts(); }} aria-label="Download artifacts zip" className="ml-1 rounded px-2 py-0.5 text-xs border border-green-600/40 hover:bg-surface-hover inline-flex items-center gap-1">
            <Package className="h-3 w-3" />asp_artifacts.zip
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); remove(); }} aria-label="Delete run" className="rounded p-1 hover:bg-surface-hover"><Trash2 className="h-4 w-4" /></button>
        </span>
      );
    }
    if (ds.length > 0) {
      return (
        <span className="mt-2 flex flex-wrap items-center gap-1 text-sm text-text-secondary">
          <AlertTriangle className="h-3 w-3" /> Partial ({ds.length}/{TOTAL_STEPS})
          {ds.map(n => (
            <button key={n} type="button" onClick={(e) => { e.stopPropagation(); downloadStep(n); }} aria-label={`Download step${n}_out.json`} className="rounded px-1.5 py-0.5 text-xs border border-border-medium hover:bg-surface-hover inline-flex items-center gap-1">
              <Download className="h-3 w-3" />{n}
            </button>
          ))}
          <button type="button" onClick={(e) => { e.stopPropagation(); remove(); }} aria-label="Delete run" className="rounded p-1 hover:bg-surface-hover"><Trash2 className="h-4 w-4" /></button>
        </span>
      );
    }
    return <span className="mt-2 line-clamp-2 text-sm text-text-secondary">Upload an Excel workbook and run the 13-step Automated SEM Pipeline.</span>;
  };

  const ds = doneSteps();

  return (
    <>
      <button type="button" onClick={openModal} data-testid="recipe-tile-automated-sem" aria-label="Automated SEM Pipeline recipe" disabled={state.status === 'running'}
        className={cn('group/recipe flex min-h-[6.5rem] flex-col rounded-xl border border-border-medium bg-surface-secondary p-4 text-left transition-colors', 'hover:border-border-heavy hover:bg-surface-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-primary', state.status === 'running' && 'opacity-60')}>
        <span className="flex min-w-0 items-center gap-2"><FileJson className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" /><span className="truncate text-base font-semibold text-text-primary">Automated SEM Pipeline</span></span>
        {statusLine()}
      </button>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Automated SEM Pipeline recipe" className="fixed inset-0 z-[130] flex items-center justify-center bg-black/40" onClick={() => setOpen(false)}>
          <div className="w-11/12 max-w-lg rounded-xl border border-border-medium bg-surface-primary p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-2 text-lg font-semibold text-text-primary">Automated SEM Pipeline</h2>
            <p className="mb-4 text-sm text-text-secondary">Choose a workbook from this project's Files, or upload a new one. Each step's JSON becomes downloadable as it lands; step 13 also produces a zip of the report, diagram, and replication scripts.</p>
            <div className="max-h-64 overflow-y-auto rounded-lg border border-border-light">
              {files.length === 0 && <div className="p-4 text-sm text-text-secondary">No files in this project yet.</div>}
              {files.map((f) => (
                <button key={f.id} type="button" onClick={() => setSelected(f)} className={cn('flex w-full items-center justify-between gap-2 border-b border-border-light px-3 py-2 text-left text-sm last:border-b-0 hover:bg-surface-hover', selected?.id === f.id && 'bg-surface-active-alt')}>
                  <span className="truncate text-text-primary">{f.name}</span><span className="shrink-0 text-xs text-text-secondary">{Math.round(f.bytes / 1024)} KB</span>
                </button>
              ))}
            </div>
            <div className="mt-3">
              <input ref={inputRef} type="file" accept=".xlsx" className="hidden" onChange={(e) => { const fl = e.target.files?.[0]; if (fl) upload(fl); }} />
              <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 rounded-lg border border-border-medium px-3 py-2 text-sm text-text-primary hover:bg-surface-hover disabled:opacity-50">
                {uploading ? <Spinner className="h-4 w-4" /> : <Upload className="h-4 w-4" />} Upload new file
              </button>
            </div>
            {selected && <p className="mt-3 text-sm text-text-primary">Selected: <span className="font-medium">{selected.name}</span></p>}
            {uploadError && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{uploadError}</p>}
            {ds.length > 0 && (
              <div className="mt-3 rounded border border-border-light p-2">
                <p className="mb-1 text-xs font-medium text-text-secondary">Completed steps</p>
                <div className="flex flex-wrap gap-1">
                  {ds.map(n => (
                    <button key={n} type="button" onClick={() => downloadStep(n)} className="rounded px-1.5 py-0.5 text-xs border border-border-medium hover:bg-surface-hover inline-flex items-center gap-1">
                      <Download className="h-3 w-3" />step{n}_out.json
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-5 flex items-center justify-end gap-2">
              <button type="button" className="rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover" onClick={() => setOpen(false)}>Cancel</button>
              {state.status === 'done' && (
                <button type="button" onClick={downloadArtifacts} className="rounded-lg border border-border-medium px-3 py-2 text-sm text-text-primary hover:bg-surface-hover inline-flex items-center gap-1"><Package className="h-4 w-4" />Download zip</button>
              )}
              <button type="button" onClick={run} disabled={!selected || state.status === 'running'} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Run 13-step pipeline</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
