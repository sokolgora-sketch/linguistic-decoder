# Live analyze-v1 embryo-first candidate output contract implementation v0.1 — Review

Status: LIVE_ANALYZE_V1_EMBRYO_FIRST_CANDIDATE_OUTPUT_CONTRACT_IMPLEMENTATION_REVIEWED_ACCEPTED_READY_FOR_EXAMPLES.

Reviewed on: 2026-06-26.

Reviewed implementation PR:

* #1621 — `test(open-instrument): implement live analyze-v1 embryo-first candidate output contract v0.1`

Reviewed main:

* Short SHA: `0c187306`
* Full SHA: `0c187306d6b7a428bf2336d44fc662235bd06c9d`

Source implementation status:

* LIVE_ANALYZE_V1_EMBRYO_FIRST_CANDIDATE_OUTPUT_CONTRACT_IMPLEMENTED_PENDING_REVIEW

## Review decision

The live analyze-v1 embryo-first candidate output contract implementation v0.1 is accepted.

The implementation is accepted as the first deterministic live/API implementation of the reviewed embryo-first candidate output contract.

The implementation is accepted because it is additive, bounded, tested, and does not convert historical origin into the ranking center.

The implementation is accepted because SEED candidates remain blocked from becoming validated functional motivations without isolation proof.

The implementation is accepted because missing `isolatedStandaloneForm`, `plainStandaloneGloss`, and `sourceNote` block full functional validation.

The implementation is accepted because `originClaim` defaults to `not_claimed` and `userDecisionPosture` defaults to `user_decides`.

The implementation is accepted because public output now carries the reviewed embryo-first fields while preserving old candidate fields for backward compatibility.

## Files reviewed

Implementation files reviewed:

* `src/shared/analysisAdapter.ts`
* `src/shared/analyzeV1Adapter.ts`
* `tests/apiAnalyzeV1.embryoFirstCandidate.contract.spec.ts`
* `tests/__snapshots__/apiAnalyzeV1.corpus.gold.spec.ts.snap`

## What was implemented

The implementation adds a deterministic embryo-first projection at the live analyze-v1 candidate seam.

The projection adds the reviewed candidate fields:

* `candidateId`
* `displayForm`
* `candidateLanguage`
* `claimType`
* `originClaim`
* `historicalRelation`
* `embryo`
* `embryoSize`
* `embryoLanguage`
* `isolatedStandaloneForm`
* `plainStandaloneGloss`
* `sourceNote`
* `segmentation`
* `semanticBridge`
* `expansionChain`
* `validationOutcome`
* `validationReasons`
* `rankGroup`
* `rankScore`
* `rankReason`
* `claimBoundary`
* `userDecisionPosture`

## Adapter review

The implementation preserves the reviewed embryo-first fields through `adaptAnalyzeV1ToUI`.

The implementation does not preserve a broad raw candidate dump through the adapted public candidate list.

The implementation intentionally preserves only the reviewed embryo-first fields alongside existing public candidate fields.

This preserves compatibility while making the embryo-first contract visible to live analyze-v1 consumers.

## Snapshot review

The corpus gold snapshot update is accepted.

The snapshot change is accepted because live `/api/analyze-v1` public candidate output intentionally gained additive embryo-first fields.

The snapshot change is accepted because it records the new public contract surface.

The snapshot change is not accepted as evidence of historical origin.

The snapshot change is not accepted as evidence of validated functional motivation.

It is contract-shape evidence only.

## SEED boundary review

The implementation preserves the SEED boundary.

`sourceKind: SEED` does not imply validation.

SEED candidates without isolation proof remain `surfaceOrSeedOnly` or blocked from full functional validation.

The review accepts this as aligned with the embryo-first functional motivation milestone.

## Origin-claim boundary review

The implementation preserves no-origin-claim posture.

`originClaim` defaults to `not_claimed`.

The output does not claim Albanian origin.

The output does not disprove Latin transmission.

The output does not declare a single winner.

The user remains the final interpreter.

## Validation review

The implementation PR proved:

* `npm test -- tests/apiAnalyzeV1.embryoFirstCandidate.contract.spec.ts --runInBand` passed.
* `npm test -- tests/apiAnalyzeV1.corpus.gold.spec.ts --runInBand` passed.
* `npm test -- tests/analyzeV1.adapter.contract.spec.ts --runInBand` passed.
* `npm test -- tests/apiAnalyzeV1.contract.spec.ts --runInBand` passed.
* `npm run gate:quick` passed before PR.
* GitHub PR checks passed.
* `npm run gate:quick` passed after merge.
* Production build passed.
* TypeScript passed.
* Integration smoke tests passed.
* Post-merge file proof matched the expected implementation files only.
* Repo remained clean.

## Boundaries preserved

This implementation review confirms:

* No UI rendering change.
* No VM rendering change.
* No route schema tightening.
* No replay execution.
* No provider/model execution.
* No VoiceLab work.
* No eval/seven-voice-order work.
* No historical-origin winner claim.
* No publication claim.
* No evidence-promotion claim.

## Accepted limitations

This implementation is not the final embryo-search system.

This implementation does not validate real isolated standalone forms for `damage` or `study`.

This implementation does not yet add focused example pages or example fixtures for `damage` and `study`.

This implementation does not yet rank validated functional embryos ahead of surface/seed-only candidates using real external evidence.

Those are intentionally deferred to the next explicit lane.

## Review outcome

Accepted.

The implementation status is now:

`LIVE_ANALYZE_V1_EMBRYO_FIRST_CANDIDATE_OUTPUT_CONTRACT_IMPLEMENTATION_REVIEWED_ACCEPTED_READY_FOR_EXAMPLES`

The next accepted task is:

`test(open-instrument): add embryo-first candidate examples for damage and study v0.1`
