# Milestone — Instrument UI: RootMap Card v0.1

Status: DRAFT  
Owner: DF + Sokol  
Scope: UI Telemetry VM + Instrument UI (VM-only) + tests

---

## 0) Goal

Expose `rootMap` in the **Scientific Instrument UI** without touching raw payload at render time.

Outcome:
- Instrument shows RootMap **STATE**, **Tokens**, **Keys**, **ComposedMeaning**.
- UI consumes **TelemetryVM only**.
- Deterministic, defensive, never-throw.

---

## 1) Contract source (read-only)

RootMap lives in `/api/analyze-v1` output at:

- `analysis.rootMap` (top-level)
- mirrors `analysis.raw.rootMap` (raw debug)

We treat `analysis.rootMap` as the public contract for UI.

---

## 2) Work items (one-by-one)

### A) Telemetry VM adds RootMap (required)
File:
- `src/ui/telemetry/adaptAnalysisToTelemetryVM.ts`

Add:
- `RootMapVM` type:
  - `basis?: string`
  - `tokens: { token: string; role: string; vowel_path: string }[]`
  - `keys: { token: string; language: string; gloss: string; status: string; ops: string[]; evidence: string[] }[]`
  - `carriers: { token: string; language: string; carrierForm: string; note?: string }[]`
  - `spans: { token: string; start: number; end: number; source: string; note?: string }[]`
  - `composedMeaning?: string`
- `TelemetryVM.rootMap: Maybe<RootMapVM>`

Adapter rules:
- If `analysis.rootMap` missing → `{ kind:"missing", missing:"not_emitted" }`
- If shape malformed → `{ kind:"missing", missing:"malformed", note:"..." }`
- If present → `{ kind:"present", value: RootMapVM }`
- Never throw. Arrays must default to `[]`.

### B) Instrument UI shows RootMapCard (required)
Files:
- new: `src/ui/instrument/RootMapCard.tsx`
- update: `src/ui/instrument/InstrumentPanel.tsx`

Rules:
- RootMapCard reads `TelemetryVM.rootMap` only.
- Display:
  - STATE: PRESENT / MISSING
  - Tokens: `SHTU | DI` (example)
  - Keys list (supported only or all with status labels)
  - ComposedMeaning line

No raw JSON reads in render.

### C) Tests (required)

1) Adapter test:
- `tests/ui.telemetry.rootMap.vm.spec.ts`
Assertions (canon word `study`):
- `vm.rootMap.kind === "present"`
- tokens include `SHTU` and `DI`
- `DI` key ops include `y_to_i`

2) UI guard test:
- Extend/clone existing “VM-only” guard pattern
- Assert InstrumentPanel does not access `raw.*` (or the raw analysis object) during render.

---

## 3) Acceptance criteria

- `curl /api/analyze-v1?word=study&mode=strict` shows rootMap in JSON.
- UI shows RootMap card for `study` with:
  - Tokens: `SHTU | DI`
  - DI ops includes `y_to_i`
- `npm run gate:quick` passes.
- No new nondeterminism; no invented fields.

---

## 4) Notes / guardrails

- RootMap is “keys vs carriers” — no winner, no ranking.
- This milestone is UI plumbing + scientific presentation only.
