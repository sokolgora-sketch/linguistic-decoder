# Milestone: Seven Principles Canonical Vocabulary v0.1

## Problem
We currently have multiple representations of “principles” across the system:
- Heart math7 uses Title Case labels (e.g., "Unity", "Insight")
- Instrument telemetry uses ALL CAPS IDs (e.g., "UNITY", "REFLECTION")
This creates drift risk (example: the accidental "NETWORK_INTEGRITY" string).

## Goal
Lock a single canonical vocabulary for the Seven Principles and make every layer explicitly use it.

## Canonical rules (v0.1)
1) **PrincipleId is the only allowed ID form in code and payloads**
   - Format: ALL_CAPS enum strings
   - Allowed set (exactly 7):
     - TRUTH (A)
     - EXPANSION (E)
     - INSIGHT (I)
     - BALANCE (O)
     - UNITY (U)
     - REFLECTION (Y)
     - EVOLUTION (Ë)

2) **Labels are derived, not authored ad-hoc**
   - Any UI display label must be derived from PrincipleId via a single mapping.
   - Example: UNITY → "Unity"

3) **Payload fields**
   - If a field is named `principlesPath`, it must be `PrincipleId[]`.
   - If we need labels, they must be separate (e.g. `principlesPathLabels`) and always derived.

## Scope
### In-scope
- Define canonical types + mappings in one place.
- Update engine + adapters to emit PrincipleId[] consistently.
- Update UI to render labels via mapping (never raw strings).
- Update fixtures + snapshots to assert allowed values.

### Out-of-scope (v0.1)
- Deep “traits” expansion (music notes, gender, ring, etc.) unless needed to remove drift.
- Reworking semantics of principles themselves.

## Tasks
1) Create a new canonical module:
   - `src/v1/principles.core.v1.ts` (or consolidate if already exists)
   - Export:
     - `PrincipleId`
     - `principleFromVowel(v: SevenVowel): PrincipleId`
     - `principleLabel(id: PrincipleId): string`
     - `principlesPathFromVowels(vowels: SevenVowel[]): PrincipleId[]`

2) Replace any ad-hoc principle strings in emitters/adapters with PrincipleId.
3) Ensure `heartInstrumentV1.principlesPath` is `PrincipleId[]`.
4) Ensure `heart.math7.primary.principlesPath` is either:
   - migrated to `PrincipleId[]`, or
   - explicitly renamed if it remains labels (preferred: migrate to ids).
5) Update UI components to render labels using `principleLabel()`.
6) Update fixtures + snapshots:
   - prove `NETWORK_INTEGRITY` can never appear again
   - assert `principlesPath` is always one of the 7 allowed values

## DONE Criteria
- Repo-wide grep confirms there are **no** principle strings outside the canonical mapping:
  - No stray `"Unity"` / `"Insight"` etc. in emitters (allowed in UI labels only if derived).
  - No stray uppercase ids outside `PrincipleId` usage.
- Contract/snapshot tests updated and passing:
  - `tests/ui.telemetry.vm.v0_1.contract.spec.ts`
  - `tests/ui.telemetry.vm.v0_1_1.candidates.contract.spec.ts`
  - any additional tests added for canonical vocabulary lock
- Live API sanity:
  - `heartInstrumentV1.principlesPath` returns `PrincipleId[]` only
  - UI renders human labels derived from ids
