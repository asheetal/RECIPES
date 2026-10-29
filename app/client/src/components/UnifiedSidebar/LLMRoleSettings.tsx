import { useEffect, useState } from 'react';
import { Button } from '@librechat/client';
import { request, apiBaseUrl } from 'librechat-data-provider';

type Model = { endpoint: string; model: string; label: string };
type Assignment = { endpoint: string; model: string } | null;
type Workflow = { uninterruptedIterations: number; maxDirectorIterations: number };
type Criterion = {
  ok: boolean;
  latency_ms?: number;
  error?: string;
  used?: string;
  reasoning_tokens?: number | null;
  note?: string;
};
type SlotTest = {
  slot: number;
  ok: boolean;
  criteria: {
    connection?: Criterion;
    silenceable?: Criterion;
    no_chattiness?: Criterion;
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
  maxBatchRecords?: number;
  aqrpBatchConcurrency?: number;
};
type SaveResponse = {
  assignments: Record<string, Assignment>;
  panelMembers: Assignment[];
  workflow: Workflow;
  maxBatchRecords?: number;
  panelTest?: { slots: SlotTest[] } | null;
};
const PANEL_MAX = 10;
const LATENCY_WARN_MS = 8000;
const url = () => `${apiBaseUrl()}/api/admin/users/llm-roles`;
const key = (m: Assignment) => m ? JSON.stringify([m.endpoint, m.model]) : '';
const errorText = (e: any) =>
  e?.response?.data?.message || 'Unable to update LLM assignments';
const slotsFrom = (payload: any): SlotTest[] | null => {
  const slots = payload?.panelTest?.slots;
  return Array.isArray(slots) ? slots : null;
};
const renderCriterion = (label: string, c?: Criterion) => {
  if (!c) return null;
  const parts: string[] = [];
  if (c.latency_ms != null) parts.push(`${c.latency_ms} ms`);
  if (c.reasoning_tokens != null) parts.push(`reasoning=${c.reasoning_tokens}`);
  if (c.used) parts.push(c.used);
  const detail = parts.length ? ` (${parts.join(', ')})` : '';
  const state = c.ok ? 'pass' : 'FAIL';
  const tail = c.ok ? detail : ` — ${c.error ?? 'failed'}`;
  const slow = !!(c.ok && c.latency_ms != null && c.latency_ms > LATENCY_WARN_MS);
  return { label, ok: c.ok, slow, text: `${label}: ${state}${tail}` };
};

export default function LLMRoleSettings({ section = 'models' }: { section?: 'models' | 'workflow' }) {
  const [data, setData] = useState<Settings | null>(null);
  const [draft, setDraft] = useState<Record<string, Assignment>>({});
  const [panelMembers, setPanelMembers] = useState<Assignment[]>([]);
  const [workflow, setWorkflow] = useState<Workflow>({ uninterruptedIterations: 20, maxDirectorIterations: 5 });
  const [maxBatchRecords, setMaxBatchRecords] = useState(200);
  const [aqrpBatchConcurrency, setAqrpBatchConcurrency] = useState(4);
  const [panelTest, setPanelTest] = useState<SlotTest[] | null>(null);
  const [panelTestFailed, setPanelTestFailed] = useState(false);
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
        setMaxBatchRecords(result.maxBatchRecords ?? 200);
        setAqrpBatchConcurrency(result.aqrpBatchConcurrency ?? 4);
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
    setPanelTestFailed(false);
    try {
      const result = await request.post<SaveResponse>(url(), { assignments: draft, workflow, panelMembers, maxBatchRecords, aqrpBatchConcurrency });
      setDraft(result.assignments);
      setWorkflow(result.workflow);
      setPanelMembers(result.panelMembers ?? []);
      setMaxBatchRecords(result.maxBatchRecords ?? 200);
      setAqrpBatchConcurrency(result.aqrpBatchConcurrency ?? 4);
      const slots = slotsFrom(result);
      if (slots) { setPanelTest(slots); setPanelTestFailed(false); }
      setNotice('Saved.');
    } catch (e) {
      const slots = slotsFrom(e?.response?.data);
      if (slots) { setPanelTest(slots); setPanelTestFailed(true); }
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
                setPanelTestFailed(false);
              }} />
          </label>
          <p className="text-xs text-text-secondary">
            Only the surgeon can invoke this panel. Each member receives the surgeon&apos;s query and returns a strict JSON report; the report is frozen as advisory evidence. On every save, each agent is probed for silenceability, zero reasoning tokens, and JSON conformance. Re-saving the panel re-runs the probe.
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
                  setPanelTestFailed(false);
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
          <label className="flex items-center justify-between gap-3 text-sm" htmlFor="max-batch-records">
            Max records per batch step
            <input id="max-batch-records" type="number" min={1} max={10000} disabled={busy}
              className="w-24 rounded-lg border border-border-medium bg-surface-primary px-2 py-2 text-text-primary"
              value={maxBatchRecords}
              onChange={e => { setMaxBatchRecords(Math.max(1, Math.min(10000, Number(e.target.value) || 1))); setNotice(''); }} />
          </label>
          <p className="text-xs text-text-secondary">
            Cap on records coded by one batch tool call (default 200). A larger corpus is coded on its first N records only; steps 1&ndash;3 still see the full corpus. Takes effect on the next run.
          </p>
          <label className="flex items-center justify-between gap-3 text-sm" htmlFor="aqrp-batch-concurrency">
            AQRP batch concurrency
            <input id="aqrp-batch-concurrency" type="number" min={1} max={8} disabled={busy}
              className="w-24 rounded-lg border border-border-medium bg-surface-primary px-2 py-2 text-text-primary"
              value={aqrpBatchConcurrency}
              onChange={e => { setAqrpBatchConcurrency(Math.max(1, Math.min(8, Number(e.target.value) || 1))); setNotice(''); }} />
          </label>
          <p className="text-xs text-text-secondary">
            Records coded in parallel per batch call (default 4, max 8). Each record is still coded alone by every panel member. Takes effect on the next run.
          </p>
          {panelTest && panelTest.length > 0 && (
            <div
              role={panelTestFailed ? 'alert' : 'status'}
              className={
                panelTestFailed
                  ? 'rounded-lg border border-red-300 bg-red-50 p-3 text-xs'
                  : 'rounded-lg border border-border-medium bg-surface-secondary p-3 text-xs'
              }
            >
              <p className="mb-2 font-semibold">
                {panelTestFailed
                  ? 'Panel eligibility check failed — nothing was saved.'
                  : 'Panel eligibility check passed.'}
              </p>
              {panelTest.map(slot => (
                <div key={`slot-test-${slot.slot}`} className="mb-2">
                  <p className="font-medium">Slot {slot.slot}: {slot.ok ? 'pass' : 'FAIL'}</p>
                  <ul className="ml-4 list-disc">
                    {[
                      renderCriterion('Connection', slot.criteria.connection),
                      renderCriterion('Silenceable (reasoning off)', slot.criteria.silenceable),
                      renderCriterion('No chattiness', slot.criteria.no_chattiness),
                      renderCriterion('JSON schema conformance', slot.criteria.json_schema),
                      renderCriterion('JSON object fallback', slot.criteria.json_object),
                      renderCriterion('Record coding', (slot.criteria as any).record_coding),
                    ].filter(Boolean).map((row, k) => {
                      const r = row!;
                      const cls = !r.ok
                        ? 'text-red-700'
                        : r.slow
                          ? 'text-amber-700'
                          : 'text-text-secondary';
                      return (
                        <li key={k} className={cls}>
                          {r.text}{r.slow ? ' — slow' : ''}
                        </li>
                      );
                    })}
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
