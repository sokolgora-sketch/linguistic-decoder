# Open Instrument Candidate Metadata Boundary Closeout v0.1

## Milestone

- ID: `OPEN_INSTRUMENT_CANDIDATE_METADATA_BOUNDARY_CLOSEOUT_V0_1`
- Status: `DONE`
- Closure marker: `OPEN_INSTRUMENT_CANDIDATE_METADATA_BOUNDARY_CLOSEOUT_V0_1_2026_09_10`
- Base before implementation: `d67cea6ddce1ced3c107febf8f496872702db78f`
- Implementation PR: #1883
- Implementation commit: `edca06fd37c40e148b0a1627b91eae76caf7a5c8`
- Implementation merge SHA: `f2231eceef83b43d48b6a01016c8711439db01da`

## Closed Scope

PR #1883 preserved candidate metadata across the public telemetry boundary.
The merged implementation scope was exactly six files:

1. `src/ui/candidates/candidateModel.ts`
2. `src/ui/instrument/contractAdapter.ts`
3. `src/ui/telemetry/types.ts`
4. `tests/__snapshots__/ui.telemetry.vm.v0_1.contract.spec.ts.snap`
5. `tests/__snapshots__/ui.telemetry.vm.v0_1_1.candidates.contract.spec.ts.snap`
6. `tests/ui.instrument.candidateMetadataBoundary.v0_1.spec.ts`

The closed production behavior is:

- Public candidate `status`, `confidenceTag`, and `fitTag` are preserved through telemetry.
- Supported public candidate evaluation statuses remain `pass`, `fail`, and `unknown`.
- Malformed metadata fails closed.
- Missing metadata remains missing or `null` rather than being manufactured.
- `candidateModel` no longer discards valid public status metadata.

The API schema, candidate ranking and ordering, `evidenceRefs`, provenance,
`originClaim`, and research/provider behavior were not changed.

## Status Taxonomy Reconciliation

The engine and public UI intentionally have different status boundaries:

- Engine `Candidate.status` supports `pass`, `fail`, `experimental`, and
  `deprecated` in `src/shared/engineShape.ts`.
- Public `CandidateUI.status` supports `pass`, `fail`, and `unknown` in
  `src/shared/resultsUI.ts`.
- `adaptAnalyzeV1ToUI` normalizes unsupported engine values to public
  `unknown` before the `/api/analyze-v1` response reaches the live `/chat`
  surface.

Engine `experimental` and `deprecated` are valid engine vocabulary. PR #1883
did not change their semantics and did not claim that they are invalid. It
preserved the existing public contract through telemetry.

## Post-Merge Review Reconciliation

Review thread `3974509745` was reconciled and resolved. Its classification is
`PARTIALLY_CORRECT_WRONG_LAYER`.

The review correctly identified that the telemetry parser is intentionally
limited to the public `CandidateUI` status contract if an engine-shaped object
is passed directly. It did not identify a defect in the merged six-file patch:

- `src/shared/analyzeV1Adapter.ts` maps engine `pass`, `fail`, and `unknown` to
  the public values and maps other engine statuses to `unknown`.
- `app/api/analyze-v1/route.ts` applies the engine-to-public adapter before
  returning the API payload.
- `src/components/ZroChatPage.tsx` passes that public payload to
  `InstrumentPanel`.
- No non-test production caller was found that sends raw engine candidates
  directly to `adaptAnalysisToTelemetryVM`.

Whether engine lifecycle values should later receive a separately named public
field is an upstream contract decision, not part of this metadata-preservation
closeout.

## Truth Boundaries

The following guarantees remain unchanged:

- `candidateTruthClaim` remains `not_claimed`.
- `userDecisionPosture` remains `user_decides`.
- Historical origin, transmission, winner, and language-superiority claims
  remain unclaimed.
- `originClaim` and `no_single_winner` posture are preserved.
- `Null` remains valid.
- `evidenceRefs` and provenance remain unchanged.
- No evidence promotion occurred.
- Provider, calibration, research, security, and natural-completion lanes were
  not changed.

## Validation

Validation for the merged implementation and post-merge proof:

- Focused validation: 5 suites, 19 tests, 2 snapshots: PASS.
- `typecheck:full`: PASS.
- `typecheck:contracts`: PASS.
- `gate:quick`: PASS; 647 suites passed, 3 skipped; 2,951 tests passed, 4
  skipped; 149 snapshots; integration 2 suites and 5 tests; production build
  passed.
- Post-merge focused validation: 1 suite, 6 tests: PASS.
- CI checks: `lint-test-build`, `contracts`, CodeQL Actions analysis, and
  CodeQL JavaScript/TypeScript analysis: SUCCESS.
- Provider calls during implementation and closeout: 0.
- JO stash: unchanged.

## Closure

This report formally closes the candidate metadata boundary milestone after
the implementation merge and review reconciliation. No new provider run,
authorization, evidence promotion, or follow-up lifecycle taxonomy change is
included in this closure.

OPEN_INSTRUMENT_CANDIDATE_METADATA_BOUNDARY_CLOSEOUT_V0_1_2026_09_10
