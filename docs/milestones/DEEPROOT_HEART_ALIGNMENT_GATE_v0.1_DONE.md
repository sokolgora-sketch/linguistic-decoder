# DeepRoot–Heart Alignment Gate v0.1 — DONE

## Purpose
Expose an auditable “alignment gate” per candidate that checks whether the **DeepRoot output** is consistent with the **Heart vowel-path expectations**, and make the result visible in UI + snapshots.

This is **not** a rejection system (yet). It is a deterministic signal + explanation attached to each candidate.

## Where it lives
### Core compute
- `src/shared/deepRootHeartGate.v0.1.compute.ts`
- `src/shared/deepRootHeartGate.v0.1.ts`

### UI wiring
- `src/ui/instrument/contractAdapter.ts`
  - Computes and attaches `deepRootHeartGate: PresentOrMissing<DeepRootHeartGateV01>` per candidate.

### UI presentation
- `src/ui/candidates/candidateModel.ts`
  - Derives:
    - `deepRootHeartGateStatus`
    - `deepRootHeartGateReasons`
    - `deepRootHeartGateEvidenceRefs`
- `src/ui/candidates/CandidatesAccordion.tsx`
  - Renders `Gate: <status>`
  - Shows `Evidence: ...` if present
  - Shows reason codes for `misaligned`

- `src/ui/instrument/DeepRootHeartGateSummaryCard.tsx`
  - Aggregates per-candidate gate statuses into totals + top misalignment reasons.
- `src/ui/instrument/InstrumentPanel.tsx`
  - Renders the Gate Summary card from VM-derived candidate rows (no raw payload access).
- Test: `tests/ui.instrument.deepRootHeartGate.summaryCard.spec.tsx`


## Contract shape
- Candidate field:
  - `candidates[i].deepRootHeartGate: PresentOrMissing<DeepRootHeartGateV01>`
- `DeepRootHeartGateV01` includes at minimum:
  - `status` (observed: `aligned` | `misaligned` | (possible) `insufficient`)
  - `reasonCodes` (e.g. `TERMINAL_VOWEL_CONFLICT`)
  - `evidenceRefs` (stable strings that point to supporting fields)

## DONE criteria (v0.1)
1) Contract adapter attaches `deepRootHeartGate` per candidate.
2) UI renders the gate status from VM (no raw payload reads).
3) Misalignment reasons are visible when status is `misaligned`.
4) Contract snapshots include the field (Telemetry VM v0.1 / v0.1.1).
5) Guard rails: fallback behavior is tested for missing/legacy payload shapes.

## Tests proving it
- `tests/deepRootHeartGate.v0.1.spec.ts`
- `tests/ui.instrument.deepRootHeartGate.vm.spec.ts`
- `tests/ui.candidates.deepRootHeartGate.rendersFromVM.spec.tsx`
- `tests/ui.telemetry.deepRootHeartGate.fallback.v0.1.spec.ts`
- Snapshots:
  - `tests/__snapshots__/ui.telemetry.vm.v0_1.contract.spec.ts.snap`
  - `tests/__snapshots__/ui.telemetry.vm.v0_1_1.candidates.contract.spec.ts.snap`

## Proof (tests)
Run these as the “DONE proof set”:
- `tests/deepRootHeartGate.v0.1.spec.ts`
- `tests/ui.instrument.deepRootHeartGate.vm.spec.ts`
- `tests/ui.candidates.deepRootHeartGate.rendersFromVM.spec.tsx`
- `tests/ui.telemetry.deepRootHeartGate.fallback.v0.1.spec.ts`
- `tests/ui.instrument.deepRootHeartGate.summaryCard.spec.tsx`
