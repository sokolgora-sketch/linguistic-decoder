# Milestone: Instrument RootMap Card v0.1 — DONE

## Purpose
Make RootMap visible in the Scientific Instrument UI as a **VM-driven** readout (no raw payload reads in render), with defensive handling for missing/malformed data.

## Delivered

### UI (Instrument)
- RootMap card/panel is rendered from Telemetry VM.
- Displays state:
  - **PRESENT** when RootMap exists
  - **NONE / not_emitted** when RootMap is absent
  - **MALFORMED** when RootMap is present but invalid
- Shows:
  - tokens
  - supported keys/explainers
  - composed meaning
  - map/spans debug (if emitted)

### Telemetry VM
- RootMap VM adapter v0.1 exists and is defensive (never throws).
- Optional arrays/fields are handled safely (no unsafe `.map` on undefined, etc.).

### Contract discipline
- RootMap is exposed through the same VM-only Instrument contract approach used across the UI.

## Proof (tests + gates)

### Automated tests
- VM adapter coverage:
  - `tests/ui.telemetry.rootMapVM.v0.1.spec.ts`
  - `tests/ui.rootMap.vm.v0.1.spec.ts`
- Instrument renders from VM:
  - `tests/ui.instrument.rootMap.rendersFromVM.spec.tsx`
- VM-only guard:
  - `tests/ui.instrument.rootMap.vmOnly.guard.spec.tsx`
- API emission smoke:
  - `tests/apiAnalyzeV1.rootMap.emits.spec.ts`
- RootMap builder coverage:
  - `tests/deepRoot.rootMap.builder.v1.spec.ts`

### CI gates
- `npm run gate:quick` (lint + unit tests + integration + build) passes.

## Notes / cleanup performed
- Temporary RootMap test shim was removed; tests now import the real module directly:
  - `../src/ui/telemetry/rootMapVM.v0.1`
