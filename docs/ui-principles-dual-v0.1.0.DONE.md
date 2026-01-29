# UI Dual Principles Display v0.1.0 — DONE

## Goal
Show “dual reality” principles in **MeaningPanel**:
- **Functional principles** derived from `readout.sevenPrinciplesSpectrum.functional.value.vowels`
- **Surface principles** derived from `readout.sevenPrinciplesSpectrum.surface.value.vowels`
While keeping the stable public contract unchanged (no new `TelemetryReadout` fields).

## What changed
- `src/ui/instrument/contractAdapter.ts`
  - Computes `principlesPathSurface` + `principlesPathFunctional` internally.
  - Keeps `readout.principlesPath` contract-stable (functional-preferred fallback).
- `src/ui/instrument/MeaningPanel.tsx`
  - Renders:
    - `Principles (functional): ...`
    - `Principles (surface): ...`
  - Reads spectrum from **readout.sevenPrinciplesSpectrum** (contract-safe).

## Proof (tests / gates)
- `npm run gate:quick` ✅
- `npm run build` ✅
- Integration smokes ✅ (`tests/apiAnalyzeV1.stability.repeat.smoke.spec.ts`, `tests/apiAnalyzeV1.evidence.smoke.curl.spec.ts`)
- Snapshot contracts remain stable:
  - `tests/ui.telemetry.vm.v0_1.contract.spec.ts` ✅
  - `tests/ui.telemetry.vm.v0_1_1.candidates.contract.spec.ts` ✅

## PR
Merged PR #326 into `main`. Local+remote branch cleaned.
