# Milestone: DeepRoot–Heart Alignment Gate v0.1 — DONE

## Purpose
Compute a deterministic, auditable gate per candidate that checks whether DeepRoot outputs align with Heart rules (Seven-Voices constraints). Expose it in UI through Telemetry VM so the instrument can show **aligned vs misaligned** with stable reason codes.

## Delivered

### Engine
- Gate compute:
  - `src/shared/deepRootHeartGate.v0.1.compute.ts`
- Gate types + reason codes:
  - `src/shared/deepRootHeartGate.v0.1.ts`

### UI / VM wiring
- Telemetry types include `deepRootHeartGate`.
- Instrument contract adapter computes and emits gate per candidate.
- Candidates UI can display gate status + reasons (VM-derived).

## Contract semantics (v0.1)
- Status values are stable:
  - `aligned` or `misaligned`
- `reasonCodes` is a stable list of enums (no free-text drift).
- `evidenceRefs` exists (even if empty) for traceability.

## Proof

### Tests
- Gate compute:
  - `tests/deepRootHeartGate.v0.1.spec.ts`
- VM attaches per candidate:
  - `tests/ui.instrument.deepRootHeartGate.vm.spec.ts`
- Candidates renders from VM:
  - `tests/ui.candidates.deepRootHeartGate.rendersFromVM.spec.tsx`
- Telemetry contract snapshots include gate:
  - `tests/ui.telemetry.vm.v0_1.contract.spec.ts` (+ snapshots)
  - `tests/ui.telemetry.vm.v0_1_1.candidates.contract.spec.ts` (+ snapshots)

### Gates
- `npm run gate:quick` passes (lint + unit + integration + build).

## Notes
- This milestone is “gate exists + is visible + is tested”, not “perfect linguistic theory”.
- Future versions may add more reason codes and stricter validation, but must remain deterministic and snapshot-locked.
