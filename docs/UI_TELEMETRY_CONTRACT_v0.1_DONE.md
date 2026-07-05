# UI Telemetry Contract v0.1 — DONE Criteria (Final)

## Current Live Surface Status (2026-07)

This document remains a historical DONE record for UI Telemetry Contract v0.1.
It is not the complete current live-surface contract.

Current Open Instrument truth:

- The live user surface is `/chat`.
- `/chat` renders `ZroChatPage`, which calls `/api/analyze-v1`.
- The instrument surface is VM-driven through `src/ui/instrument/contractAdapter.ts`.
- `InstrumentPanel` is tabbed with top-level sections: `Overview`, `Evidence`, `Candidates`, `Roots / Meaning`, and `Advanced`.
- Raw JSON is audit/debug detail inside the `Advanced` section and must not be treated as the primary user surface.
- Any fixed left/right column wording below is historical milestone language.

## Purpose
The UI Telemetry Contract v0.1 defines the **scientific-instrument boundary** between engine output and UI rendering.  
When this milestone is marked DONE, the UI is guaranteed to be:
- VM-driven
- Deterministic
- Auditable
- Immune to dev flags, URL params, or raw payload access at render time

This document defines the **non-negotiable conditions** under which v0.1 is considered complete.

---

## DONE Criteria

The criteria below record the milestone boundary that was completed.
They should not be misread as the full current top-level navigation model of the live tabbed surface.

### 1) VM-Only Rendering (Hard Invariant)
**Condition**
- UI components must render exclusively from `TelemetryVM`.
- No UI component may read raw engine payloads directly during render.

**Proof (tests)**
- `tests/ui.instrument.vmOnly.guard.spec.tsx`
- `tests/ui.instrument.readout.vmOnly.guard.spec.tsx`
- `tests/ui.instrument.ledger.vmOnly.guard.spec.tsx`
- `tests/ui.instrument.rootMap.vmOnly.guard.spec.tsx`
- `tests/ui.instrument.rawAccess.onlyContractAdapter.guard.spec.tsx`

These tests fail immediately if raw payload access is detected.

---

### 2) Telemetry VM Contract Stability
**Condition**
- Telemetry VM fields are:
  - Defensive (missing-safe)
  - Versioned
  - Deterministic
- UI never infers or reconstructs meaning from partial data.

**Proof (tests)**
- `tests/ui.telemetry.vm.v0_1.contract.spec.ts`
- `tests/ui.telemetry.vm.v0_1_1.candidates.contract.spec.ts`
- `tests/contractAdapter.malformedPayload.spec.ts`
- `tests/contractAdapter.malformedEvidence.missingReasons.spec.ts`

---

### 3) OriginClaim Evidence Anchoring
**Condition**
- OriginClaim candidates must reference **stable, named evidence anchors**.
- Primary voice-path evidence must be explicitly addressable.

**Proof (tests)**
- `tests/originClaim.v1.gold.spec.ts`
- `tests/originClaim.builder.voiceSeq.string.spec.ts`
- Snapshot confirms presence of:
  - `primaryPath.voicePath`
  - `heart.math7.primary`
  - candidate-specific anchors

---

### 4) OriginClaimGates VM Authority
**Condition**
- `originClaimGates.active` is:
  - Always boolean
  - Derived strictly from VM / policy
  - Never overridden by dev flags or URL params
- UI renders ON/OFF exactly as provided by VM.

**Proof (tests)**
- `tests/ui.instrument.originClaimGates.activeBool.spec.ts`
- `tests/ui.instrument.originClaimGates.rendersFromVM.spec.tsx`
- `tests/apiAnalyzeV1.originClaimGates.queryFlag.spec.ts`

---

### 5) Determinism & Repeatability
**Condition**
- Identical inputs produce identical outputs.
- No nondeterministic ordering, timing, or environment influence.

**Proof (tests)**
- `tests/apiAnalyzeV1.stability.repeat.smoke.spec.ts`
- `tests/apiAnalyze.route.gold.spec.ts`
- `tests/engineContract.v1.capture.gold.spec.ts`

---

### 6) Full Gate Verification
**Condition**
- The repository must pass:
  - Unit tests
  - Integration tests
  - Production build
- With no conditional skips or local-only behavior.

**Proof**
- `npm run gate:quick`
  - lint
  - unit tests
  - integration smoke
  - production build

---

## Milestone Status

This milestone remains complete.
The live-surface notes above reconcile the historical DONE record with the current tabbed instrument shell.
✅ **UI Telemetry Contract v0.1 is COMPLETE**

All scientific-instrument invariants are enforced by tests.  
Any regression will surface as a failing guard, snapshot, or smoke test.
