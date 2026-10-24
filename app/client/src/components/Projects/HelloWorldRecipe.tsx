import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Check, Download, FileSpreadsheet, Trash2, Upload } from 'lucide-react';
import { Spinner } from '@librechat/client';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import type { TFile } from 'librechat-data-provider';
import { useLocalize, useNewConvo } from '~/hooks';
import { cn } from '~/utils';
import store from '~/store';

type FileRow = { id: string; name: string; bytes: number };
type RunState = {
  status: 'idle' | 'running' | 'done' | 'failed';
  fileId?: string | null;
  fileName?: string | null;
  pdfId?: string | null;
  error?: string | null;
};

async function getJson(url: string) {
  const r = await fetch(url, { credentials: 'include' });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json();
}
async function postJson(url: string, body: unknown) {
  const r = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error((await r.text()) || `${r.status}`);
  return r.json();
}
async function delJson(url: string) {
  const r = await fetch(url, { method: 'DELETE', credentials: 'include' });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export default function HelloWorldRecipe({ projectId }: { projectId: string }) {
  const localize = useLocalize();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [state, setState] = useState<RunState>({ status: 'idle' });
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<FileRow[]>([]);
  const [selected, setSelected] = useState<FileRow | null>(null);
  const [uploading, setUploading] = useState(false);
  const pollRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [, setFilesAtom] = useRecoilState(store.filesByIndex(0));
  const [, setText] = useRecoilState(store.text);
  const { newConversation } = useNewConvo();

  const base = `/api/projects/${projectId}/hello-world`;
  const filesBase = `/api/projects/${projectId}/files`;

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
    } catch {
      /* silent */
    }
  }, [base]);

  useEffect(() => {
    refresh();
    return () => {
      if (pollRef.current != null) window.clearInterval(pollRef.current);
    };
  }, [refresh]);

  const loadFiles = useCallback(async () => {
    try {
      const rows: FileRow[] = await getJson(filesBase);
      setFiles(rows);
      if (state.fileId) {
        setSelected(rows.find((r) => r.id === state.fileId) ?? null);
      }
    } catch {
      setFiles([]);
    }
  }, [filesBase, state.fileId]);

  const openModal = useCallback(() => {
    setOpen(true);
    setSelected(null);
    loadFiles();
  }, [loadFiles]);

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append('file', file);
        const r = await fetch(filesBase, { method: 'POST', credentials: 'include', body: fd });
        if (!r.ok) throw new Error(await r.text());
        const saved = await r.json();
        await loadFiles();
        setSelected(saved);
      } finally {
        setUploading(false);
      }
    },
    [filesBase, loadFiles],
  );

  const run = useCallback(async () => {
    if (!selected) return;
    const seed =
      `Run the Hello World recipe. Use bash_tool: python3 /app/hello-world-feature/worker.py ` +
      `"<absolute path to ${selected.name} in project files>" /tmp/hello-world.pdf, then return the PDF.`;
    const f: TFile = {
      file_id: selected.id,
      filename: selected.name,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      bytes: selected.bytes,
      projectFileId: selected.id,
      source: 'project' as any,
      temp_file_id: selected.id,
    } as unknown as TFile;
    setFilesAtom(new Map([[selected.id, f]]));
    setText(seed);
    setOpen(false);
    newConversation({ template: { chatProjectId: projectId, recipeId: 'hello_world', recipeName: 'Hello World' } as any });
    navigate(`/c/new`);
  }, [selected, setFilesAtom, setText, newConversation, navigate, projectId]);

  const download = useCallback(() => {
    window.open(`${base}/pdf`, '_blank');
  }, [base]);

  const remove = useCallback(async () => {
    await delJson(base);
    setState({ status: 'idle' });
    queryClient.invalidateQueries();
  }, [base, queryClient]);

  const statusLine = () => {
    if (state.status === 'running') {
      return (
        <span className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
          <Spinner className="h-4 w-4" /> Running…
        </span>
      );
    }
    if (state.status === 'failed') {
      return (
        <span
          className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
          title={state.error ?? 'Failed'}
        >
          <AlertTriangle className="h-4 w-4" /> Failed — fix the workbook
        </span>
      );
    }
    if (state.status === 'done') {
      return (
        <span className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <Check className="h-4 w-4" /> Done
          <button type="button" onClick={(e) => { e.stopPropagation(); download(); }} aria-label="Download PDF" className="ml-1 rounded p-1 hover:bg-surface-hover"><Download className="h-4 w-4" /></button>
          <button type="button" onClick={(e) => { e.stopPropagation(); remove(); }} aria-label="Delete run" className="rounded p-1 hover:bg-surface-hover"><Trash2 className="h-4 w-4" /></button>
        </span>
      );
    }
    return <span className="mt-2 line-clamp-2 text-sm text-text-secondary">Upload an Excel workbook and produce a Hello World PDF.</span>;
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        data-testid="recipe-tile-hello-world"
        aria-label="Hello World recipe"
        disabled={state.status === 'running'}
        className={cn(
          'group/recipe flex min-h-[6.5rem] flex-col rounded-xl border border-border-medium bg-surface-secondary p-4 text-left transition-colors',
          'hover:border-border-heavy hover:bg-surface-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-primary',
          state.status === 'running' && 'opacity-60',
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
          <span className="truncate text-base font-semibold text-text-primary">Hello World</span>
        </span>
        {statusLine()}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Hello World recipe"
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div className="w-11/12 max-w-lg rounded-xl border border-border-medium bg-surface-primary p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-2 text-lg font-semibold text-text-primary">Hello World</h2>
            <p className="mb-4 text-sm text-text-secondary">Choose a workbook from this project's Files, or upload a new one.</p>
            <div className="max-h-64 overflow-y-auto rounded-lg border border-border-light">
              {files.length === 0 && <div className="p-4 text-sm text-text-secondary">No files in this project yet.</div>}
              {files.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelected(f)}
                  className={cn('flex w-full items-center justify-between gap-2 border-b border-border-light px-3 py-2 text-left text-sm last:border-b-0 hover:bg-surface-hover', selected?.id === f.id && 'bg-surface-active-alt')}
                >
                  <span className="truncate text-text-primary">{f.name}</span>
                  <span className="shrink-0 text-xs text-text-secondary">{Math.round(f.bytes / 1024)} KB</span>
                </button>
              ))}
            </div>
            <div className="mt-3">
              <input ref={inputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => { const fl = e.target.files?.[0]; if (fl) upload(fl); }} />
              <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 rounded-lg border border-border-medium px-3 py-2 text-sm text-text-primary hover:bg-surface-hover disabled:opacity-50">
                {uploading ? <Spinner className="h-4 w-4" /> : <Upload className="h-4 w-4" />} Upload new file
              </button>
            </div>
            {selected && <p className="mt-3 text-sm text-text-primary">Selected: <span className="font-medium">{selected.name}</span></p>}
            <div className="mt-5 flex items-center justify-end gap-2">
              <button type="button" className="rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover" onClick={() => setOpen(false)}>Cancel</button>
              {state.status === 'done' && (
                <button type="button" onClick={download} className="rounded-lg border border-border-medium px-3 py-2 text-sm text-text-primary hover:bg-surface-hover">Download PDF</button>
              )}
              <button type="button" onClick={run} disabled={!selected} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                Run Hello World
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
