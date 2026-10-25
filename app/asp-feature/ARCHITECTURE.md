# ASP — four-layer control flow

Established contract. Any change must preserve this layering.
Each layer is sealed from the one outside it; every handshake is strict JSON
in, strict JSON out. If a layer needs more data from a deeper layer, the change
belongs in the tool (layer 1), not in the triage (layer 4).

## Layer 4 — In-triage
Container: `librechat` (Node), inside `LLM_TRIAGE` → `LLM_SURGERY` graph → `LLM_OPD`,
with `LLM_ERP`/`LLM_DIRECTOR` gating additional iteration sets.
Inputs: recipe prompt (as user text), tool descriptions & schemas.
Tools visible: `search`, `verify_references`, `project_files`, `research_files`,
`asp_step_run`, plus the general toolbelt.
Sees: NOTHING of scripts, step schemas, pipeline state, workdir, or prior step JSON.
Enforces: iteration-set budget; no recipe can bypass triage; no triage change is
ever made to support a recipe.

## Layer 3 — In-LLM cognitive steps
Container: `librechat`, inside `LLM_SURGERY` reasoning.
Steps: 2, 3, 5, 7, 10, 12 (see app/recipes/automated_sem.cjs).
Grounds: via `search({query})` → OpenAlex (academic mode pinned at dispatch) and
`verify_references({references})` → Crossref.
Emits: strict `payload` object, included in `asp_step_run({step:N, payload:{...}})`.
Enforces (validators in tool.cjs, run before persistence):
  - `validateCognitive(step, payload)` — step 2 status/join_key/mappings; step 3
    role/valence enums and family_summary shape.
  - `validateStep7(payload)` — novelty_verdict rules, >=3 search_provenance,
    decision_type enum, prior-record shape.
  - `validateEvidence(step, payload)` — non-empty claims at every cognitive step;
    retrieval_log non-empty when citations_required; SUPPORTED claims carry
    ref_id + justifying_excerpt; step 12 references and {{ref:CLAIM_ID}} resolve.
  - `validatePayloadSchema(step, merged)` — per-step strict zod builder
    (PAYLOAD_SCHEMAS map); first failing path reported.

## Layer 1 — In-Node tool steps
Container: `librechat` (Node process).
Entry: `asp_step_run` in app/asp-feature/tool.cjs; envelope is
  z.object({ plan?, step, file_id?, payload? }).strict().
Dispatch:
  - Tool steps (1,4,6,8,9,11,13) → app/asp-feature/pipeline.cjs → HTTP POST to
    asp-runner:8091/run.
  - Cognitive steps (2,3,5,7,10,12) → readStep(prior) via HTTP GET to
    asp-runner:8091/read → mergePassthrough (inherit large fields) → validators
    → pipeline.runStep (writes stepN_out.json on disk) → completeStep (Mongo).
Reads/writes: aspruns collection in Mongo; workdir per-run on runner.
Emits: JSON string back to LLM_SURGERY.

## Layer 2 — In-runner script steps
Container: `asp-runner` (Debian glibc, rocker/verse:4.3.3 + TeX Live + lmodern;
built as asp-runner:1 from app/asp-feature/Dockerfile).
Server: app/asp-feature/runner-server.py (Python HTTP).
Scripts executed (unchanged; strict JSON in as args[1] / stdin, strict JSON out to
stdout):
  1  01_preview_workbook.R
  4  04_combinatorial_search.R
  6  06_filter_substantive.R
  8  08_bootstrap_imm.R
  9  09_descriptive_tables.R
 11  11_render_diagram.R
 13  13_package_tex.py   (also zips artifacts into base64 response)
Shared helper: json_utils.R — array-shape invariant applied via write_step_json().
Enforces (script-level):
  - Single-Producer Invariance: step N writes only stepN_out.json.
  - Array-shape invariant: every collection field is a JSON array, never scalar.
  - Exit codes: 11 emits exit 7 on fatal; 13 emits exit 8 (bad input),
    exit 9 (citation gate), exit 10 (replication parse/semantic gate).
  - Warning Discipline: stderr is silent on success; 13's log() goes to stderr.
Sandbox: only sees the workbook and the prior stepN_out.json in its workdir.

## What must never change
- Triage files untouched by any recipe work.
- Any change that requires the recipe to see scripts, pipeline state, or step
  contracts belongs in the tool (layer 1), never in the recipe or triage.
- Every layer's in/out is strict JSON. Adding free text, notes, or commentary
  inside a JSON body is a violation; the layer that receives it must reject and
  name the failing position.
