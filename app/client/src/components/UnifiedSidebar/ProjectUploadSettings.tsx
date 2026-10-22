import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { request, apiBaseUrl } from 'librechat-data-provider';
import { Button } from '@librechat/client';
import { useLocalize } from '~/hooks';

type Policy = { maxFiles: number; maxFileBytes: number; revision: number };
export default function ProjectUploadSettings() {
  const localize = useLocalize();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [count, setCount] = useState('');
  const [size, setSize] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const root = `${apiBaseUrl()}/api/admin/users/project-upload`;
  const fail = (e: unknown) => setNotice(
    isAxiosError<{ message?: string }>(e) && e.response?.data?.message
      ? e.response.data.message : localize('com_ui_project_upload_error'),
  );
  async function load() {
    setBusy(true); setNotice('');
    try {
      const next = await request.get<Policy>(root);
      setPolicy(next); setCount(String(next.maxFiles));
      setSize(String(next.maxFileBytes / 1048576));
    } catch (e) { fail(e); }
    finally { setBusy(false); }
  }
  useEffect(() => { void load(); }, [root]);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!policy || busy) return;
    setBusy(true); setNotice('');
    try {
      const next = await request.post(root, {
        maxFiles: Number(count), maxFileBytes: Math.round(Number(size) * 1048576),
        revision: policy.revision,
      }) as Policy;
      setPolicy(next);
      setNotice(localize('com_ui_project_upload_saved'));
    } catch (e) { fail(e); }
    finally { setBusy(false); }
  }
  const field = 'w-full rounded-lg border border-border-medium bg-surface-primary px-3 py-2 text-text-primary';
  return <section aria-label={localize('com_ui_project_upload_settings')}>
    <h3 className="font-semibold">{localize('com_ui_project_upload_settings')}</h3>
    {policy && <form onSubmit={save} className="mt-4 space-y-3">
      <div>
        <label htmlFor="project-upload-max-files">{localize('com_ui_project_upload_max_files')}</label>
        <input id="project-upload-max-files" type="number" min="1" max="1000" step="1"
          required disabled={busy} value={count} onChange={e => setCount(e.target.value)}
          className={field} />
      </div>
      <div>
        <label htmlFor="project-upload-max-size">{localize('com_ui_project_upload_max_size')}</label>
        <input id="project-upload-max-size" type="number" min="0.001" max="100" step="0.001"
          required disabled={busy} value={size} onChange={e => setSize(e.target.value)}
          className={field} />
      </div>
      <p className="text-xs text-text-secondary">{localize('com_ui_project_upload_admin_note')}</p>
      <Button type="submit" disabled={busy}>{localize('com_ui_save')}</Button>
    </form>}
    <Button type="button" variant="ghost" disabled={busy} onClick={() => void load()}>
      {localize('com_ui_project_upload_reload')}
    </Button>
    {notice && <p role="status" className="mt-3 text-sm">{notice}</p>}
  </section>;
}
