# Milestones (Engineering)

This file is the canonical “DONE criteria” ledger for UI milestones.

---

## RootMap Evidence–Ledger Alignment v0.1.4

**Goal**
- RootMap becomes an auditable “instrument artifact” by rendering emitted evidence/ops and handling malformed fields without inventing proof.

**Scope**
1) RootMapCard renders per-key:
   - `keys[].evidence[]` (string list)
   - `keys[].ops[]` (string list, chips OK)
2) Rendering is defensive:
   - If evidence/ops are missing: show "—" (or omit section) without repeating “not_emitted”.
   - If evidence/ops are malformed (non-array / non-string items): do not render as `[object Object]`; treat as missing/malformed.
3) VM-only:
   - UI must read `vm.rootMap` only; no raw payload access in render.

**DONE criteria**
- New/updated tests prove:
  - RootMap evidence + ops render from VM and never display `[object Object]`.
  - Malformed rootMap evidence/ops is handled as missing/malformed (no crash).
- `npm run gate:quick` passes.

**Proof (when complete)**
- Tests:
  - `tests/ui.instrument.rootmap.render.spec.tsx`
  - `tests/ui.instrument.rootmap.vm.spec.ts`

## RootMap Evidence–Ledger Alignment v0.1.4 — DONE

**Proof (when complete)**
- Tests:
  - tests/ui.instrument.rootmap.vm.spec.ts
  - tests/ui.instrument.rootmap.render.spec.tsx
- Gate:
  - npm run gate:quick ✅

---

## RootMap Spans Highlight Gate v0.1.5

**Goal**
- RootMap “Normalized word map” highlights are reliable and fail-visible.
- Spans never crash render; malformed spans never produce highlights.

**Scope**
1) Validation (no guessing):
   - `start/end` must be numbers
   - bounds: `0 <= start <= end <= normalizedWord.length`
2) Rendering:
   - If spans valid: render highlights with `<mark>` segments
   - If spans missing: show STATE `NONE` + note “no spans were provided”
   - If spans malformed: show STATE `MALFORMED` + note “failed bounds validation”
3) Tests:
   - PRESENT: renders at least one `<mark>` and includes expected substring
   - NONE: renders note and no `<mark>`
   - MALFORMED: renders note and no `<mark>`

**DONE criteria**
- New tests prove: present highlights, none/malformed never highlight, no crashes.
- `npm run gate:quick` passes.

**Proof (when complete)**
- Tests:
  - tests/ui.instrument.rootmap.spans.spec.tsx
- Gate:
  - npm run gate:quick ✅

## Mind obeys HeartInstrumentV1 surface math v0.1.1 — DONE
- Spec/proof: `docs/milestones/MIND_OBEYS_HEARTINSTRUMENT_SURFACE_MATH_v0.1.1.md`
- ✅ `npm run gate:quick`
- ✅ GET+POST sanity: `study` strict returns `mind.dominantPrincipleId = BALANCE` when surface total1to7 = 4

## RootMap Spans Highlight Gate v0.1.5 — DONE

**Proof**
- Tests:
  - `tests/ui.instrument.rootmap.spans.spec.tsx`
- Gate:
  - `npm run gate:quick` ✅
- Behavior:
  - PRESENT spans render `<mark>` segments
  - NONE/MALFORMED spans render fail-visible state and never highlight


## Milestone: DeepRoot–Heart Gate — No Global Fallback (v0.1.2)

### Problem
The per-candidate DeepRoot–Heart gate could incorrectly report `aligned` by falling back to a global DeepRoot path (e.g. `deepRoot.functionalRoots[0].vowelPath`) when a candidate’s own `vowelPath` was missing or different. This breaks the “instrument truth” principle: a candidate gate must describe *that candidate’s evidence only*.

### Contract / Rule
For each candidate, the gate must be computed using **per-candidate** data only:

- `candidateResolvedPath` is derived from `candidates[i].vowelPath` only.
- If `candidates[i].vowelPath` is missing → gate must surface `insufficient_data` (no global fallback).
- Evidence references must reflect the real source:
  - `candidates[i].vowelPath` if present
  - `candidatePath.missing` if absent
- DeepRoot global path (`deepRoot.functionalRoots[0].vowelPath`) is **not allowed** as a fallback for candidate gating.

### Implementation
- Updated gate wiring in `src/ui/instrument/contractAdapter.ts` to remove global fallback and emit accurate `evidenceRefs`.

### Proof (DONE criteria)
This milestone is DONE when:

- `npm run gate:quick` passes
- `npm run build` passes
- Candidate UI gate continues to render from VM only (no raw inference):
  - `tests/ui.candidates.deepRootHeartGate.rendersFromVM.spec.tsx` passes
- Telemetry VM contract snapshots match the new evidence refs:
  - `tests/ui.telemetry.vm.v0_1.contract.spec.ts` snapshot updated
  - `tests/ui.telemetry.vm.v0_1_1.candidates.contract.spec.ts` snapshot updated

### PR
- PR #331 — `fix(deeproot-heart-gate-no-global-fallback-v0.1.2)` (code)
- PR #332 — `docs(milestones): add DeepRoot–Heart gate no-global-fallback v0.1.2` (docs)

