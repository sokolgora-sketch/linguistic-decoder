# UI Telemetry Contract v0.1 — DONE


## Current Live Surface Status (2026-07)

This document remains a historical DONE record for UI Telemetry Contract v0.1. It is not the complete current live-surface contract.

Current Open Instrument truth:

- The live user surface is `/chat`.
- `/chat` renders `ZroChatPage`, which calls `/api/analyze-v1`.
- The instrument surface is VM-driven through `src/ui/instrument/contractAdapter.ts`.
- `InstrumentPanel` is tabbed; the old fixed left/right column wording below is historical milestone language.
- Raw JSON is debug/collapsed-oriented and must not be treated as the primary user surface.
- `RootMapCard` renders VM RootMap keys/evidence defensively.
- Reviewed DA functional operator evidence is now visible through `rootMap.keys[].evidence` and EvidencePackage rootMap export.
- DI is production-live for bounded functional lexical projection; direct DPEWA/FGJSH authority remains unresolved only for stronger historical-authority or stronger-source claims.
- Runtime evidence remains functional/operator evidence, not historical-origin, winner, or language-superiority evidence.

This document records the **definition of done that was achieved** for UI Telemetry Contract v0.1.
It is not a task list.

## Scope (locked)

- Instrument UI renders from **Telemetry VM** (adapted), and does not invent meaning/ops/claims.
- Missing fields are shown explicitly as “not_emitted / not available”.
- This milestone does **not** modify engine meaning logic.

## Section order (implemented)

Primary results order in InstrumentPanel:

1. READOUT (always visible)
2. COUNTS / RATIOS (telemetry-only)
3. EVIDENCE LEDGER (falsifiable log)
4. CANDIDATES
5. MATH / LENSES (optional telemetry)
6. ROOT MAP (when emitted)
7. MEANING (VM-driven)
8. ORIGIN CLAIM (computed, auditable)
9. RAW JSON (collapsed; only when raw payload is provided)

Note: RAW JSON is intentionally unavailable in VM-only render mode.

## Proof (tests)

These tests collectively prove VM-only rendering boundaries, ordering stability, and collision-safe assertions:

- UI VM-only guardrails:
  - tests/ui.instrument.vmOnly.guard.spec.tsx
  - tests/ui.instrument.noRawObjectRender.guard.spec.ts
  - tests/ui.instrument.noRawAccess.guard.spec.tsx
  - tests/ui.instrument.rawAccess.onlyContractAdapter.guard.spec.tsx
- OriginClaim + Gates render from VM (scoped queries; stable):
  - tests/ui.instrument.originClaim.rendersFromVM.spec.tsx
  - tests/ui.instrument.originClaimGates.rendersFromVM.spec.tsx

## Acceptance words (manual spot-check)

Recommended smoke words for visible behavior checks:
- xyz (strict) — no voice path, no candidates, lenses hidden/not computed
- yë (strict) — Y→Ë behavior; deterministic output
- study (strict) — detected path + telemetry visible
- damage (strict) — detected path + telemetry visible

---

## DONE — OriginClaim Gates placement + contract order (v0.1)

### Outcome
- OriginClaim Gates panel is rendered from the Telemetry VM and placed in the RIGHT telemetry column.
- InstrumentPanel retains VM-only purity and contract-order rendering for the telemetry stream.

### Acceptance checks
- UI shows: Readout (left), telemetry stream (right) in contract order.
- OriginClaim Gates:
  - Displays Status (ON/OFF) + dev flag hint.
  - Displays candidateCount and reasonCounts from VM.
  - Does not toggle/drive OriginClaim computation; it is observational UI.

### Proof refs
- PR #296: `fix(ui): place OriginClaim Gates in right column; normalize InstrumentPanel JSX`
- Tests:
  - `tests/ui.instrument.originClaimGates.rendersFromVM.spec.tsx`
  - `tests/ui.instrument.originClaim.rendersFromVM.spec.tsx`
  - `tests/ui.instrument.vmOnly.guard.spec.tsx`
  - `tests/ui.instrument.noRawAccess.guard.spec.tsx`


---

## DONE — Evidence Package copy (VM-only) (v0.1)

### Outcome
- InstrumentPanel exposes a **Copy Evidence Package** control (left column).
- Package is built **only from Telemetry VM** (and optional ledgerModel), never from raw payload.
- Copy uses deterministic pretty JSON.

### Acceptance checks
- Button exists under Readout in the left column.
- Copy result includes `version: "evidence_package.v0.1"`.
- No raw payload access is introduced.

### Proof refs
- PR #298: `feat(ui): VM-only Evidence Package copy (v0.1)`
- Tests:
  - `tests/ui.telemetry.evidencePackage.v0.1.spec.ts`
  - `tests/ui.instrument.evidencePackage.vmOnly.guard.spec.tsx`
  - `tests/ui.instrument.vmOnly.guard.spec.tsx`

