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
