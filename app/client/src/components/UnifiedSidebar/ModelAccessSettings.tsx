
import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@librechat/client';
import { request, apiBaseUrl } from 'librechat-data-provider';
type API = { id: string; name: string; baseURL: string; hasKey: boolean };
type Model = {
 id: string; apiId: string; name: string; endpoint: string;
 capabilityStatus?: 'untested' | 'outdated' | 'tested';
 capabilityTest?: { capabilities: {
  gatewayConnectivity: boolean; structuredJsonOutputs: boolean;
  jsonSchema: boolean; jsonObject: boolean; toolCalling: boolean;
 } };
};
function capabilityLabel(model: Model) {
 if (model.capabilityStatus !== 'tested')
  return model.capabilityStatus === 'outdated' ? 'Capabilities: retest required' : 'Capabilities: not tested';
 const c = model.capabilityTest?.capabilities;
 const mark = (value?: boolean) => value ? 'passed' : 'unavailable';
 return `Gateway: ${mark(c?.gatewayConnectivity)} · Structured JSON: ${mark(c?.structuredJsonOutputs)} · JSON schema: ${mark(c?.jsonSchema)} · JSON mode: ${mark(c?.jsonObject)} · Tools: ${mark(c?.toolCalling)}`;
}
type Catalog = { apis: API[]; models: Model[] };
const base = () => `${apiBaseUrl()}/api/admin/users/model-access`;
const errorText = (e: any) => e?.response?.data?.message || 'Request failed.';
export default function ModelAccessSettings({ section }: { section: 'apis' | 'pool' }) {
  const [data, setData] = useState<Catalog>({ apis: [], models: [] });
  const [api, setAPI] = useState({ id: '', name: '', baseURL: '', apiKey: '' });
  const [model, setModel] = useState({ name: '', apiId: '' });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    let mounted = true;
    const load = () => request.get<Catalog>(base()).then(x => {
      if (mounted) setData(x);
    }).catch(e => { if (mounted) setNotice(errorText(e)); });
    void load();
    window.addEventListener('llm-access-changed', load);
    return () => { mounted = false; window.removeEventListener('llm-access-changed', load); };
  }, []);
  async function save(e: FormEvent) {
    e.preventDefault(); setBusy(true); setNotice(section === 'pool' ? 'Testing gateway, JSON and tool capabilities…' : 'Testing API access…');
    try {
      const x = await request.post<Catalog & { message: string }>(
        `${base()}/${section === 'apis' ? 'apis' : 'models'}`,
        section === 'apis' ? api : model,
      );
      setData(x); setNotice(x.message);
      if (section === 'apis') setAPI({ id: '', name: '', baseURL: '', apiKey: '' });
      else setModel({ name: '', apiId: '' });
      window.dispatchEvent(new Event('llm-access-changed'));
    } catch (e) { setNotice(errorText(e)); } finally { setBusy(false); }
  }
  async function remove(id: string) {
    setBusy(true); setNotice('');
    try {
      const x = await request.post<Catalog & { message: string }>(`${base()}/models/${id}/delete`, {});
      setData(x); setNotice(x.message);
      window.dispatchEvent(new Event('llm-access-changed'));
    } catch (e) { setNotice(errorText(e)); } finally { setBusy(false); }
  }
  async function retest(id: string) {
    setBusy(true); setNotice('Testing gateway, JSON and tool capabilities…');
    try {
      const x = await request.post<Catalog & { message: string }>(`${base()}/models/${id}/test`, {});
      setData(x); setNotice(x.message);
      window.dispatchEvent(new Event('llm-access-changed'));
    } catch (e) { setNotice(errorText(e)); }
    finally { setBusy(false); }
  }
  const field = 'w-full rounded-lg border border-border-medium bg-surface-primary px-3 py-2 text-text-primary';
  return <section className="space-y-3">
    <h3 className="font-semibold">{section === 'apis' ? 'API access' : 'Model access'}</h3>
    {section === 'pool' && <p className="text-xs text-text-secondary">
      New models must pass gateway and structured JSON tests. Each workflow role checks its required capabilities.
    </p>}
    <form onSubmit={save} className="space-y-3">
      {section === 'apis' ? <>
        <label className="block text-sm">API name
          <input className={field} required maxLength={200} value={api.name} disabled={busy || !!api.id}
            onChange={e => setAPI(x => ({ ...x, name: e.target.value }))} />
        </label>
        <label className="block text-sm">API base URL
          <input className={field} type="url" required value={api.baseURL} disabled={busy}
            placeholder="https://provider.example/v1"
            onChange={e => setAPI(x => ({ ...x, baseURL: e.target.value }))} />
        </label>
        <label className="block text-sm">API key
          <input className={field} type="password" autoComplete="new-password" required={!api.id}
            value={api.apiKey} disabled={busy} placeholder={api.id ? 'Leave blank to keep saved key' : ''}
            onChange={e => setAPI(x => ({ ...x, apiKey: e.target.value }))} />
        </label>
      </> : <>
        <label className="block text-sm">Model name
          <input className={field} required maxLength={200} value={model.name} disabled={busy}
            onChange={e => setModel(x => ({ ...x, name: e.target.value }))} />
        </label>
        <label className="block text-sm">API
          <select className={field} required value={model.apiId} disabled={busy}
            onChange={e => setModel(x => ({ ...x, apiId: e.target.value }))}>
            <option value="">Select API</option>
            {data.apis.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </label>
      </>}
      <div className="flex gap-2">
        <Button type="submit" disabled={busy}>Test and save</Button>
        {section === 'apis' && api.id && <Button type="button" variant="ghost" disabled={busy}
          onClick={() => setAPI({ id: '', name: '', baseURL: '', apiKey: '' })}>Cancel</Button>}
      </div>
    </form>
    {notice && <p role="status" className="text-sm">{notice}</p>}
    <div className="space-y-2">
      {section === 'apis' ? data.apis.map(a => <div key={a.id} className="flex items-center justify-between gap-2 border-t border-border-light py-2">
        <div className="min-w-0"><p className="text-sm font-semibold">{a.name}</p><p className="break-all text-xs text-text-secondary">{a.baseURL}</p></div>
        <Button variant="ghost" disabled={busy} onClick={() => setAPI({ ...a, apiKey: '' })}>Edit</Button>
      </div>) : data.models.map(m => <div key={m.id} className="flex items-center justify-between gap-2 border-t border-border-light py-2">
        <div className="min-w-0"><p className="break-all text-sm">{m.name}</p><p className="text-xs text-text-secondary">{m.endpoint}</p>
          <p className="mt-1 break-words text-xs text-text-secondary">{capabilityLabel(m)}</p></div>
        <div className="flex shrink-0 flex-wrap gap-1">
          <Button type="button" variant="ghost" disabled={busy}
            aria-label={`Retest ${m.name}`} onClick={() => retest(m.id)}>Retest</Button>
          <Button variant="ghost" disabled={busy} onClick={() => remove(m.id)}>Delete</Button>
        </div>
      </div>)}
    </div>
  </section>;
}
