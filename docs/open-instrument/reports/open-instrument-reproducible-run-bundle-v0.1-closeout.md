# Open Instrument Reproducible Run Bundle v0.1 Closeout

## Milestone

- ID: `OPEN_INSTRUMENT_REPRODUCIBLE_RUN_BUNDLE_V0_1`
- Status: `DONE`
- Closure marker: `OPEN_INSTRUMENT_REPRODUCIBLE_RUN_BUNDLE_V0_1_CLOSED_2026_09_10`
- Final main: `3c4a236738fe7510963c23f63087571612880f21`

## PR Chain

### Core contract: PR #1885

- Title: `feat(open-instrument): add reproducible run bundle core contract`
- Merge: `f81254531213a0837b4194b6ecec2c686899c920`
- The core contract adds an explicit sanitized public-analysis allowlist,
  stable JSON/SHA-256 identity, fail-closed parsing, fingerprint validation,
  and round-trip coverage.
- PR #1885 initially merged before two later P1 findings were identified.
  This report preserves that history rather than rewriting it.

### P1 reconciliation: PR #1886

- Title: `fix(open-instrument): preserve reproducible run semantics`
- Merge: `b04380dcc99764485261c21741ba0e78550f61c4`
- Corrected the result projection to preserve:
  - `automaticCarrierPronunciationV0_1`;
  - `functionalVoiceNormalizationV0_1`;
  - candidate `discoveryStatus`.
- These fields preserve functional normalization authority, failed-pronunciation
  fail-closed behavior, and structural-hypothesis presentation after reopen.

### UI handoff: PR #1887

- Title: `feat(open-instrument): add reproducible run bundle handoff`
- Merge: `3c4a236738fe7510963c23f63087571612880f21`
- Review correction commit:
  `42a7afa7c3f7cd0186462a651f5f5e37615ba968`.
- Adds local `Download analysis` and `Open saved analysis` controls.
- Export is bound to the last successfully completed or imported snapshot.
- Import validates schema and fingerprint locally, restores the analysis in
  memory, clears stale recurrence research, and performs no re-analysis.
- Handoff controls are disabled while analysis is pending, preventing an older
  request from replacing an imported snapshot.

## Current Implementation Acceptance

The merged implementation satisfies the v0.1 local snapshot/handoff scope:

- explicit sanitized allowlist is used;
- raw, debug, provider, runtime, calibration, and research material is
  excluded;
- functional normalization authority is preserved;
- candidate `discoveryStatus` is preserved;
- deterministic stable JSON/SHA-256 fingerprinting is used;
- `createdAt` is excluded from fingerprint identity;
- semantic result changes affect identity;
- import validates the fingerprint and schema;
- import does not execute the engine;
- import does not call a provider or FVR research endpoint;
- word, optional IPA, and optional target sense are restored;
- stale recurrence research is cleared;
- pending-analysis race protection is present;
- failed import preserves the prior valid analysis;
- Null snapshots reopen correctly;
- candidate order and metadata remain preserved;
- truth boundaries remain unchanged.

Relevant implementation files:

- `src/shared/openInstrument/reproducibleRunBundle.v0_1.ts`
- `src/components/ZroChatPage.tsx`
- `src/ui/instrument/ReproducibleRunBundleControls.v0_1.tsx`
- `src/lib/downloadJson.ts`

## Validation

Merged PR evidence:

- core focused tests: 1 suite / 11 tests: PASS;
- P1 corrective and adjacent tests: 4 suites / 17 tests / 1 snapshot: PASS;
- UI handoff tests: 1 suite / 10 tests: PASS;
- chat regression tests: 5 suites / 10 tests: PASS;
- `npm run typecheck:full`: PASS;
- `npm run typecheck:contracts`: PASS;
- `npm run gate:quick`: PASS, 649 suites passed / 3 skipped, 2,972 tests
  passed / 4 skipped, 149 snapshots, integration 2 suites / 5 tests, and
  production build passed;
- `git diff --check`: PASS;
- GitHub CI for PR #1887: 5/5 checks passed.

## Review Reconciliation

PR #1885 review threads `3975749638` and `3975749642` remain resolved after
the PR #1886 correction. PR #1886 has no unresolved actionable review finding.
PR #1887's two findings concerning completed-run metadata and pending-analysis
import were fixed in `42a7afa7c3f7cd0186462a651f5f5e37615ba968`; both threads
are resolved/outdated after merge. No new post-merge actionable finding was
visible on PR #1887.

## Runtime Smoke

`RUNTIME_SMOKE=UNAVAILABLE` for the complete browser export/open sequence.

The documented mock-safe local app was started on port `3001` with
`PROPOSER_PROVIDER=mock`. The `/chat?debug=1` page loaded, deterministic
`study` analysis completed, and the Instrument result rendered with optional
IPA and target-sense input. The server log showed only local
`/api/analyze-v1` and optional `/api/research/fvr` requests; no provider or
model endpoint was used.

The connected browser did not expose the Blob download through its download
event, and no generated file appeared in the local Downloads directory. The
open-saved-analysis and malformed-file portions therefore were not claimed as
manual runtime passes. The existing focused UI tests and merged CI evidence
remain the acceptance proof for those paths.

## Truth Boundaries

- Fact / Inference / Hypothesis / Unknown remain distinct.
- Null remains valid.
- Canonical voices remain `A E I O U Y Ë`.
- Vowel-driven analysis remains unchanged.
- Embryo-first behavior remains unchanged.
- `candidateTruthClaim` is not promoted.
- `originClaim` is not promoted.
- `no_single_winner` is preserved.
- `user_decides` is preserved.
- Evidence references and provenance remain traceable.
- Provider and research material remain separate from the portable snapshot.
- No evidence promotion occurred.

## Explicit Non-Goals

- history persistence;
- Firebase;
- remote persistence;
- public sharing;
- comparison;
- replay or re-execution;
- provider execution;
- evidence promotion;
- candidate ranking changes;
- status-taxonomy changes;
- API or engine changes.

## Closeout

The reproducible run bundle v0.1 milestone is closed for its defined local
snapshot and in-memory handoff scope. Persistence, sharing, comparison,
replay, and remote storage remain separate future decisions.

Provider calls during implementation, validation, and closeout: `0`.
Protected JO stash: unchanged.

`OPEN_INSTRUMENT_REPRODUCIBLE_RUN_BUNDLE_V0_1_CLOSED_2026_09_10`
