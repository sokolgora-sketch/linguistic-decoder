# Canonical Principles Output Contract v0.1.1

## Goal
Lock a single canonical vocabulary for Seven Principles across the codebase:

- **Contract / engine surfaces use IDs** (machine-stable):
  - TRUTH, EXPANSION, INSIGHT, BALANCE, UNITY, REFLECTION, EVOLUTION
- **UI surfaces display Labels** (human-friendly), derived from:
  - `src/v1/principles.vocab.v0.1.ts`

## Why
We must avoid contract ambiguity (sometimes "Truth", sometimes "TRUTH") which breaks:
- snapshot stability
- public contract expectations
- downstream parsing / future integrations

## Rules
1. **Canonical ID set** is defined ONLY in `src/v1/principles.vocab.v0.1.ts`.
2. **Public contract examples** must use IDs, not Title-Case labels.
3. UI may show labels, but only via normalization:
   - `normalizePrinciplesToLabels()` in the UI contract adapter.

## Changes in v0.1.1
- Update contract examples (notably `src/shared/engineShape.ts`) to use IDs.
- Update tests that model contract payloads to use IDs.
- Add a test lock to prevent reintroducing Title-Case principle strings in contract surfaces.

## DONE criteria
- `npm run gate:quick` passes.
- `rg` shows no Title-Case principle strings in contract examples/tests, except:
  - `src/v1/principles.vocab.v0.1.ts`
  - UI-facing descriptive text (traits / marketing copy), if explicitly intended.
- Contract lock test present:
  - `tests/contracts/principlesPath.ids.lock.v0_1_1.spec.ts`

## Evidence
- CI: `npm run gate:quick`
- Lock test: `tests/contracts/principlesPath.ids.lock.v0_1_1.spec.ts`
