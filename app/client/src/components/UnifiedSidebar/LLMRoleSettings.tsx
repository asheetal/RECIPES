import { useEffect, useState } from 'react';
import { Button } from '@librechat/client';
import { request, apiBaseUrl } from 'librechat-data-provider';

type Model = { endpoint: string; model: string; label: string };
type Assignment = { endpoint: string; model: string } | null;
type Workflow = { uninterruptedIterations: number; maxDirectorIterations: number };
type Criterion = { ok: boolean; latency_ms?: number; error?: string; used?: string };
type SlotTest = {
  slot: number;
  ok: boolean;
  criteria: {
    connection?: Criterion;
    silenceable?: Criterion;
    json_schema?: Criterion;
    json_object?: Criterion;
  };
};
type Settings = {
  workflow: Workflow;
  roles: string[];
  models: Model[];
  assignments: Record<string, Assignment>;
  panelMembers: Assignment[];
};
const PANEL_MAX = 10;
const url = () => `${apiBaseUrl()}/api/admin/users/llm-roles`;
const key = (m: Assignment) => m ? JSON.stringify([m.endpoint, m.model]) : '';
const errorText = (e: any) =>
  e?.response?.data?.message || 'Unable to update LLM assignments';
const slotTestFrom = (e: any): SlotTest[] | null => {
  const slots = e?.response?.data?.panelTest?.slots;
  return Array.isArray(slots) ? slots : null;
};
const criterionLabel = (label: string, c?: Criterion) => {
  if (!c) return null;
  const state = c.ok ? 'pass' : 'FAIL';
  const tail = c.ok
    ? (c.latency_ms != null ? ` (${c.latency_ms} ms, ${c.used ?? 'ok'})` : ` (${c.used ?? 'ok'})`)
    : ` — ${c.error ?? 'failed'}`;
  return { label, state, text: `${label}: ${state}${tail}`, ok: c.ok };
};

export default function LLMRoleSettings({ section = 'models' }: { section?: 'models' | 'workflow' }) {
  const [data, setData] = useState<Settings | null>(null);
  const [draft, setDraft] = useState<Record<string, Assignment>>({});
  const [panelMembers, setPanelMembers] = useState<Assignment[]>([]);
  const [workflow, setWorkflow] = useState<Workflow>({ uninterruptedIterations: 20, maxDirectorIterations: 5 });
  const [panelTest, setPanelTest] = useState<SlotTest[] | null>(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = (refresh = false) => request.get<Settings>(url()).then(result => {
      if (!mounted) return;
      setData(result);
      if (!refresh) {
        setDraft(result.assignments);
        setWorkflow(result.workflow);
        setPanelMembers(result.panelMembers ?? []);
      } else {
        setDraft(previous => Object.fromEntries(result.roles.map(role => {
          const current = previous[role];
          const valid = current && result.models.some(m => key(m) === key(current));
          return [role, valid ? current : result.assignments[role]];
        })));
        setPanelMembers(previous => previous.map(member =>
          member && result.models.some(m => key(m) === key(member)) ? member : null));
      }
    }).catch(e => { if (mounted) setNotice(errorText(e)); });
    void load();
    const refresh = () => { void load(true); };
    window.addEventListener('llm-access-changed', refresh);
    return () => { mounted = false; window.removeEventListener('llm-access-changed', refresh); };
  }, []);

  async function save() {
    setBusy(true);
    setNotice('');
    setPanelTest(null);
    try {
      const result = await request.post(url(), { assignments: draft, workflow, panelMembers });
      setDraft(result.assignments);
      setWorkflow(result.workflow);
      setPanelMembers(result.panelMembers ?? []);
      setNotice('Saved.');
    } catch (e) {
      const slots = slotTestFrom(e);
      if (slots) setPanelTest(slots);
      setNotice(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  const panelIncomplete = section === 'models' && panelMembers.some(m => m === null);

  return (
    <section className="space-y-3">
      <h3 className="font-semibold">{section === 'models' ? 'LLM assignments' : 'Workflow settings'}</h3>
      {!data && !notice && <p className="text-sm">Loading…</p>}
      {section === 'models' && data?.roles.map(role => (
        <div key={role} className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-3">
          <label htmlFor={`assignment-${role}`} className="text-sm">{role}</label>
          <select
            id={`assignment-${role}`}
            value={key(draft[role])}
            disabled={busy}
            className="min-w-0 rounded-lg border border-border-medium bg-surface-primary px-2 py-2 text-sm text-text-primary"
            onChange={e => {
              const selected = data.models.find(m => key(m) === e.target.value);
              setDraft(previous => ({
                ...previous,
                [role]: selected
                  ? { endpoint: selected.endpoint, model: selected.model }
                  : null,
              }));
              setNotice('');
            }}
          >
            <option value="">Not assigned</option>
            {draft[role] && !data.models.some(m => key(m) === key(draft[role])) && (
              <option value={key(draft[role])} disabled>Previously assigned model unavailable</option>
            )}
            {data.models.map(m => (
              <option key={key(m)} value={key(m)}>{m.label}</option>
            ))}
          </select>
          {role === 'LLM_DIRECTOR' && (
            <p className="col-span-2 text-xs text-text-secondary">
              Use a model with reasoning disabled or no reasoning step, and strict JSON Schema support. Recommended: Vercel / openai/gpt-4.1-mini. Director returns only a boolean decision; output limit: 64 tokens.
            </p>
          )}
        </div>
      ))}
      {section === 'models' && data && (
        <div className="space-y-3 border-t border-border-medium pt-3">
          <label className="flex items-center justify-between gap-3 text-sm" htmlFor="panel-size">
            Assistant panel — number of agents
            <input id="panel-size" type="number" min={0} max={PANEL_MAX} disabled={busy}
              className="w-24 rounded-lg border border-border-medium bg-surface-primary px-2 py-2 text-text-primary"
              value={panelMembers.length}
              onChange={e => {
                const n = Math.max(0, Math.min(PANEL_MAX, Number(e.target.value) || 0));
                setPanelMembers(previous => {
                  const next = previous.slice(0, n);
                  while (next.length < n) next.push(null);
                  return next;
                });
                setNotice('');
                setPanelTest(null);
              }} />
          </label>
          <p className="text-xs text-text-secondary">
            Only the surgeon can invoke this panel. Each member receives the surgeon&apos;s query and returns a strict JSON report; the report is frozen as advisory evidence. Each agent is tested for silenceability and JSON conformance on save.
          </p>
          {panelMembers.map((member, i) => (
            <div key={`panel-${i}`} className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-3">
              <label htmlFor={`panel-member-${i}`} className="text-sm">Panel agent {i + 1}</label>
              <select
                id={`panel-member-${i}`}
                value={key(member)}
                disabled={busy}
                className="min-w-0 rounded-lg border border-border-medium bg-surface-primary px-2 py-2 text-sm text-text-primary"
                onChange={e => {
                  const selected = data.models.find(m => key(m) === e.target.value);
                  setPanelMembers(previous => previous.map((p, j) => j === i
                    ? (selected ? { endpoint: selected.endpoint, model: selected.model } : null)
                    : p));
                  setNotice('');
                  setPanelTest(null);
                }}
              >
                <option value="">Not assigned</option>
                {member && !data.models.some(m => key(m) === key(member)) && (
                  <option value={key(member)} disabled>Previously assigned model unavailable</option>
                )}
                {data.models.map(m => (
                  <option key={key(m)} value={key(m)}>{m.label}</option>
                ))}
              </select>
            </div>
          ))}
          {panelTest && panelTest.length > 0 && (
            <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-xs">
              <p className="mb-2 font-semibold">Panel eligibility check failed — nothing was saved.</p>
              {panelTest.map(slot => (
                <div key={`slot-test-${slot.slot}`} className="mb-2">
                  <p className="font-medium">Slot {slot.slot}: {slot.ok ? 'pass' : 'FAIL'}</p>
                  <ul className="ml-4 list-disc">
                    {[
                      criterionLabel('Connection', slot.criteria.connection),
                      criterionLabel('Silenceable (reasoning off)', slot.criteria.silenceable),
                      criterionLabel('JSON schema conformance', slot.criteria.json_schema),
                      criterionLabel('JSON object fallback', slot.criteria.json_object),
                    ].filter(Boolean).map((row, k) => (
                      <li key={k} className={row!.ok ? 'text-text-secondary' : 'text-red-700'}>
                        {row!.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {data && <>
        <div hidden={section !== 'workflow'}>
        <label className="flex items-center justify-between gap-3 text-sm" htmlFor="uninterrupted-iterations">
          Uninterrupted iterations
          <input id="uninterrupted-iterations" type="number" min={2} max={200} disabled={busy}
            className="w-24 rounded-lg border border-border-medium bg-surface-primary px-2 py-2 text-text-primary"
            value={workflow.uninterruptedIterations}
            onChange={e => { setWorkflow(w => ({ ...w, uninterruptedIterations: Number(e.target.value) })); setNotice(''); }} />
        </label>
        <p className="text-xs text-text-secondary">Model and tool steps. A tool batch finishes before a progress review.</p>
        <label className="flex items-center justify-between gap-3 text-sm" htmlFor="director-iterations">
          Max Director&apos;s iterations
          <input id="director-iterations" type="number" min={0} max={20} disabled={busy}
            className="w-24 rounded-lg border border-border-medium bg-surface-primary px-2 py-2 text-text-primary"
            value={workflow.maxDirectorIterations}
            onChange={e => { setWorkflow(w => ({ ...w, maxDirectorIterations: Number(e.target.value) })); setNotice(''); }} />
        </label>
        <p className="text-xs text-text-secondary">Maximum continuation decisions after the initial set. New settings apply to new requests.</p>
        </div>
        <Button disabled={busy || panelIncomplete} onClick={save}>Save {section === 'models' ? 'assignments' : 'workflow settings'}</Button>
      </>}
      {notice && <p role="status" className="text-sm">{notice}</p>}
    </section>
  );
}
