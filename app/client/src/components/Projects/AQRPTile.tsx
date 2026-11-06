import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Check, Download, FileJson, Square, Trash2, Upload } from 'lucide-react';
import { Spinner } from '@librechat/client';
import { useQueryClient } from '@tanstack/react-query';
import { request, apiBaseUrl } from 'librechat-data-provider';
import { cn } from '~/utils';

const FINAL_STEP = 32; // mirrors app/aqrp-feature/steps.cjs

type FileRow = { id: string; name: string; bytes: number };
type RunState = {
  status: 'idle' | 'running' | 'done' | 'failed' | 'killed';
  fileId?: string | null;
  fileName?: string | null;
  currentStep?: number;
  lastStepOk?: number | null;
  progress?: { step: number; done: number; total: number; inFlight?: number; etaSeconds?: number | null } | null;
  error?: string | null;
};

async function getJson(url: string) { return request.get(url); }
async function postJson(url: string, body: unknown) { return request.post(url, body); }
async function delJson(url: string) { return request.delete(url); }

export default function AQRPTile({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<RunState>({ status: 'idle' });
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<FileRow[]>([]);
  const [selected, setSelected] = useState<FileRow | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const pollRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pdfBlobRef = useRef<Blob | null>(null);
  const [pdf, setPdf] = useState<{ status: 'idle' | 'checking' | 'ready' | 'error'; error?: string }>({ status: 'idle' });

  const base = `${apiBaseUrl()}/api/projects/${encodeURIComponent(projectId)}/aqrp`;
  const filesBase = `${apiBaseUrl()}/api/projects/${encodeURIComponent(projectId)}/files`;

  const refresh = useCallback(async () => {
    try {
      const s = await getJson(base);
      setState(s);
      if (s.status === 'running' && pollRef.current == null) {
        pollRef.current = window.setInterval(refresh, 1500);
      } else if (s.status !== 'running' && pollRef.current != null) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
    } catch { /* silent */ }
  }, [base]);

  useEffect(() => {
    refresh();
    return () => { if (pollRef.current != null) window.clearInterval(pollRef.current); };
  }, [refresh]);

  const loadFiles = useCallback(async () => {
    try {
      const rows: FileRow[] = await getJson(filesBase);
      setFiles(rows);
      if (state.fileId) setSelected(rows.find((r) => r.id === state.fileId) ?? null);
    } catch { setFiles([]); }
  }, [filesBase, state.fileId]);

  const openModal = useCallback(() => {
    setOpen(true); setSelected(null); setUploadError(null); loadFiles();
  }, [loadFiles]);

  const upload = useCallback(async (file: File) => {
    setUploading(true); setUploadError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const saved = (await request.postMultiPart(filesBase, fd)) as FileRow | undefined;
      if (!saved) { setUploadError('That file was rejected (JSON only).'); return; }
      await loadFiles();
      if (saved && saved.id) setSelected(saved);
      else setUploadError('Upload succeeded but the server returned no file record.');
    } catch (e) {
      setUploadError((e as Error).message || 'Upload failed.');
    } finally { setUploading(false); }
  }, [filesBase, loadFiles]);

  const start = useCallback(async () => {
    if (!selected) return;
    setOpen(false);
    setPdf({ status: 'idle' });
    pdfBlobRef.current = null;
    setState({ status: 'running', fileId: selected.id, fileName: selected.name, currentStep: 0 });
    try {
      const res = await postJson(`${base}/start`, { fileId: selected.id });
      if (res && res.state) setState(res.state);
    } catch (e) {
      setState({ status: 'failed', error: (e as Error).message });
    }
    refresh();
  }, [selected, base, refresh]);

  const checkPdf = useCallback(async () => {
    setPdf({ status: 'checking' });
    try {
      const blob = (await request.get(`${base}/pdf`, { responseType: 'blob', timeout: 320000 })) as unknown as Blob;
      pdfBlobRef.current = blob;
      setPdf({ status: 'ready' });
    } catch (e) {
      const err = e as { response?: { status?: number; data?: unknown }; message?: string };
      const code = err?.response?.status;
      let msg = err?.message || 'PDF compile failed';
      const data = err?.response?.data;
      if (data instanceof Blob) {
        try { const text = await data.text(); if (text) msg = text.slice(0, 240); } catch { /* ignore */ }
      } else if (typeof data === 'string') {
        msg = data.slice(0, 240);
      }
      setPdf({ status: 'error', error: code ? `HTTP ${code} — ${msg}` : msg });
      pdfBlobRef.current = null;
    }
  }, [base]);

  const downloadPdf = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const blob = pdfBlobRef.current;
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'aqrp_report.pdf';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    if (state.status === 'done' && state.lastStepOk === FINAL_STEP && pdf.status === 'idle') {
      checkPdf();
    }
  }, [state.status, state.lastStepOk, pdf.status, checkPdf]);

  const download = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    const step = state.lastStepOk ?? 0;
    try {
      if (step === 32) {
        // Server-side /pdf endpoint: returns cached PDF or compiles via
        // asp-runner. Same helper as the bundle route — one compile path.
        const blob = (await request.get(`${base}/pdf`, { responseType: 'blob' })) as unknown as Blob;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'aqrp_report.pdf';
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
        return;
      }
      const blob = (await request.get(`${base}/output/${step}`, { responseType: 'blob' })) as unknown as Blob;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = step === 0 ? (state.fileName || 'corpus.json') : `__aqrp_step${step}_out.json`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch { /* surfaced by tile state */ }
  }, [base, state.lastStepOk, state.fileName]);

  const remove = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    await delJson(base);
    setPdf({ status: 'idle' });
    pdfBlobRef.current = null;
    setState({ status: 'idle' });
    queryClient.invalidateQueries();
  }, [base, queryClient]);

  const kill = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try { await postJson(`${base}/kill`, {}); } catch { /* surfaced by refresh */ }
    refresh();
  }, [base, refresh]);

  const statusLine = () => {
    if (state.status === 'running') {
      const runningStep = Math.min((state.lastStepOk ?? 0) + 1, FINAL_STEP);
      const p = state.progress;
      let tally = '';
      if (
        p &&
        p.step === runningStep &&
        typeof p.done === 'number' &&
        typeof p.total === 'number' &&
        (p.inFlight ?? 0) > 0
      ) {
        const parts: string[] = [`${p.done}/${p.total} coded`, `${p.inFlight} in flight`];
        if (p.etaSeconds != null && p.etaSeconds > 0) {
          parts.push(`~${Math.max(1, Math.round(p.etaSeconds / 60))}m`);
        }
        tally = ` [${parts.join(', ')}]`;
      }
      return (
        <span className="mt-2 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
          <Spinner className="h-4 w-4" /> Running step {runningStep}/{FINAL_STEP}{tally}

          <button
            type="button"
            onClick={kill}
            aria-label="Stop run"
            title="Stop the recipe. Completed steps stay downloadable as a zip."
            className="inline-flex items-center gap-1 rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <Square className="h-3 w-3" /> Stop
          </button>
        </span>
      );
    }
    if (state.status === 'failed') {
      return (
        <span className="mt-2 flex flex-wrap items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertTriangle className="h-4 w-4" /> Step {(state.lastStepOk ?? 0) + 1} failed
          {state.error && <span className="max-w-full truncate text-xs text-text-secondary" title={state.error}>{state.error}</span>}

          <button type="button" onClick={remove} aria-label="Delete run" className="rounded p-1 hover:bg-surface-hover"><Trash2 className="h-4 w-4" /></button>
        </span>
      );
    }
    if (state.status === 'killed') {
      return (
        <span className="mt-2 flex flex-wrap items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-4 w-4" /> Stopped at step {state.lastStepOk ?? 0}

          <button type="button" onClick={remove} aria-label="Delete run" className="rounded p-1 hover:bg-surface-hover"><Trash2 className="h-4 w-4" /></button>
        </span>
      );
    }
    if (state.status === 'done') {
      const doneLabel = `Done (step ${state.lastStepOk ?? state.currentStep})`;
      if (pdf.status === 'error') {
        return (
          <span className="mt-2 flex flex-wrap items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertTriangle className="h-4 w-4" /> PDF failed
            {pdf.error && <span className="max-w-full truncate text-xs" title={pdf.error}>{pdf.error}</span>}
            <button type="button" onClick={(e) => { e.stopPropagation(); checkPdf(); }} aria-label="Retry PDF compile" className="rounded border border-border-medium px-2 py-1 text-xs font-medium text-text-primary hover:bg-surface-hover">Retry</button>
            <button type="button" onClick={remove} aria-label="Delete run" className="rounded p-1 hover:bg-surface-hover"><Trash2 className="h-4 w-4" /></button>
          </span>
        );
      }
      if (pdf.status !== 'ready') {
        return (
          <span className="mt-2 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
            <Spinner className="h-4 w-4" /> {doneLabel} — compiling PDF…
            <button type="button" onClick={remove} aria-label="Delete run" className="rounded p-1 hover:bg-surface-hover"><Trash2 className="h-4 w-4" /></button>
          </span>
        );
      }
      return (
        <span className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <Check className="h-4 w-4" /> {doneLabel}
          <button type="button" onClick={downloadPdf} aria-label="Download PDF report" className="ml-1 rounded p-1 hover:bg-surface-hover"><Download className="h-4 w-4" /></button>
          <button type="button" onClick={remove} aria-label="Delete run" className="rounded p-1 hover:bg-surface-hover"><Trash2 className="h-4 w-4" /></button>
        </span>
      );
    }
    if (state.currentStep != null && state.currentStep > 0) {
      return (
        <span className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
          Step {state.currentStep} complete
          <button type="button" onClick={download} aria-label="Download last step output" className="rounded p-1 hover:bg-surface-hover"><Download className="h-4 w-4" /></button>
          <button type="button" onClick={remove} aria-label="Delete run" className="rounded p-1 hover:bg-surface-hover"><Trash2 className="h-4 w-4" /></button>
        </span>
      );
    }
    return <span className="mt-2 line-clamp-2 text-sm text-text-secondary">Upload a JSON corpus and run the qualitative pipeline one step at a time.</span>;
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => { if (state.status !== 'running') openModal(); }}
        onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && state.status !== 'running') { e.preventDefault(); openModal(); } }}
        data-testid="recipe-tile-aqrp"
        aria-label="Automated Qualitative Research Pipeline"
        className={cn(
          'group/recipe flex min-h-[6.5rem] flex-col rounded-xl border border-border-medium bg-surface-secondary p-4 text-left transition-colors',
          'hover:border-border-heavy hover:bg-surface-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-primary',
          state.status === 'running' && 'opacity-80',
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <FileJson className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
          <span className="truncate text-base font-semibold text-text-primary">Automated Qualitative Research Pipeline</span>
        </span>
        {statusLine()}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Automated Qualitative Research Pipeline"
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div className="w-11/12 max-w-lg rounded-xl border border-border-medium bg-surface-primary p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-2 text-lg font-semibold text-text-primary">Automated Qualitative Research Pipeline</h2>
            <p className="mb-4 text-sm text-text-secondary">Choose a JSON corpus from this project's Files, or upload a new one.</p>
            <div className="max-h-64 overflow-y-auto rounded-lg border border-border-light">
              {files.length === 0 && <div className="p-4 text-sm text-text-secondary">No files in this project yet.</div>}
              {files.map((f) => (
                <button key={f.id} type="button" onClick={() => setSelected(f)} className={cn('flex w-full items-center justify-between gap-2 border-b border-border-light px-3 py-2 text-left text-sm last:border-b-0 hover:bg-surface-hover', selected?.id === f.id && 'bg-surface-active-alt')}>
                  <span className="truncate text-text-primary">{f.name}</span>
                  <span className="shrink-0 text-xs text-text-secondary">{Math.round(f.bytes / 1024)} KB</span>
                </button>
              ))}
            </div>
            <div className="mt-3">
              <input ref={inputRef} type="file" accept=".json,application/json" className="hidden" onChange={(e) => { const fl = e.target.files?.[0]; if (fl) upload(fl); }} />
              <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 rounded-lg border border-border-medium px-3 py-2 text-sm text-text-primary hover:bg-surface-hover disabled:opacity-50">
                {uploading ? <Spinner className="h-4 w-4" /> : <Upload className="h-4 w-4" />} Upload new JSON
              </button>
            </div>
            {selected && <p className="mt-3 text-sm text-text-primary">Selected: <span className="font-medium">{selected.name}</span></p>}
            {uploadError && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{uploadError}</p>}
            <div className="mt-5 flex items-center justify-end gap-2">
              <button type="button" className="rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover" onClick={() => setOpen(false)}>Cancel</button>
              <button type="button" onClick={start} disabled={!selected} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                Start AQRP
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
