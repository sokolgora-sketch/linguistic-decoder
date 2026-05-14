# Milestone: Instrument RootMap Card v0.1 — DONE

## Purpose
Make RootMap visible in the Scientific Instrument UI as a VM-driven readout (no raw payload reads in render), with defensive handling for missing/malformed data.

## Delivered

### UI (Instrument)
- RootMap card/panel renders from Telemetry VM only.
- State is explicit:
  - PRESENT when RootMap exists
  - NONE / not_emitted when RootMap is absent
  - MALFORMED when RootMap is present but invalid
- Displays tokens, supported keys/explainers, constructed reading (hypothesis), and map/spans debug (when emitted).

### Telemetry VM
- RootMap VM adapter v0.1 is defensive (never throws).
- Optional arrays/fields are handled safely.

## Proof

### Tests
- `tests/ui.telemetry.rootMapVM.v0.1.spec.ts`
- `tests/ui.rootMap.vm.v0.1.spec.ts`
- `tests/ui.instrument.rootMap.rendersFromVM.spec.tsx`
- `tests/ui.instrument.rootMap.vmOnly.guard.spec.tsx`
- `tests/apiAnalyzeV1.rootMap.emits.spec.ts`
- `tests/deepRoot.rootMap.builder.v1.spec.ts`

### Gates
- `npm run gate:quick` passes (lint + unit + integration + build).

## Cleanup
- Removed temporary RootMap test shim; tests now import the real module: `../src/ui/telemetry/rootMapVM.v0.1`.

## Patch notes

### v0.1.1 — NONE explanation via VM missing detail
- RootMap VM distinguishes `not_emitted` (NONE) vs `malformed` more explicitly and can carry a stable missing `note`.
- RootMap instrument panel renders the missing detail note (still VM-only).
- Proof: existing RootMap VM + instrument tests remain green; `npm run gate:quick` passes.
