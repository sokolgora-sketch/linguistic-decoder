# Study Segmentation 004 Zheji Segmentation Traceability Implementation Review v0.1

## Purpose

This document reviews PR #1256:

`feat(open-instrument): harden zheji study004 segmentation traceability prompt`

This is an implementation review.

No model call is made in this review.

No artifact is created in this review.

No prompt, helper, validator, runtime, API, UI, provider, Cohort, eval, or VoiceLab code is changed in this review.

## Reviewed implementation

PR #1256 merged after PR #1255 designed segmentation traceability hardening.

Merge SHA:

- `a4697de`

Changed files in PR #1256:

- `src/shared/openInstrument/brainCandidateSearchPrompt.v0.1.ts`
- `src/shared/openInstrument/zhejiStudy003ReplayRunner.v0.1.ts`
- `src/shared/openInstrument/zhejiTransparencyPrompt.v0.1.ts`
- `tests/openInstrument.zhejiStudy003ReplayRunner.guard.spec.ts`
- `tests/openInstrument.zhejiTransparencyPrompt.guard.spec.ts`

## Design target from PR #1255

PR #1255 required:

- every `chunkCandidates[]` object must include `segmentationId`
- every `chunkCandidates[].segmentationId` must exactly equal the Heart input segmentation ID
- every `nullCandidates[]` object must include `segmentationId`
- every `nullCandidates[].segmentationId` must exactly equal the Heart input segmentation ID
- candidate-level `segmentationId` must not be empty
- candidate-level `segmentationId` must not be inferred, shortened, translated, normalized, or invented
- missing or mismatched candidate-level `segmentationId` remains structural failure

## Review result

PR #1256 matches the PR #1255 design.

The implementation adds explicit prompt pressure for:

- `chunkCandidates[].segmentationId`
- `nullCandidates[].segmentationId`
- exact copying from Heart-approved input
- no empty candidate-level `segmentationId`
- no inferred, shortened, translated, normalized, or invented `segmentationId`

The implementation strengthens:

- generic Brain candidate-search prompt
- Zheji transparency prompt
- Zheji replay runner prompt
- focused guard tests

## Guard coverage

Focused guard tests now prove that prompt text includes:

- every `chunkCandidates[]` object must include `segmentationId`
- every `chunkCandidates[].segmentationId` must exactly equal the Heart input segmentation ID
- every `nullCandidates[]` object must include `segmentationId`
- every `nullCandidates[].segmentationId` must exactly equal the Heart input segmentation ID
- do not leave candidate-level `segmentationId` empty
- do not infer, shorten, translate, normalize, or invent `segmentationId`
- copy `segmentationId` exactly from Heart-approved input into every candidate and null-candidate object

The `.004` transparency prompt guard confirms the concrete value:

- `study.segmentation.004`

The replay runner guard confirms the current `.003` scaffold value:

- `study.segmentation.003`

## Scope review

PR #1256 stayed inside the approved scope.

It did:

- prompt/helper/test hardening only

It did not:

- call a model
- create artifacts
- change runtime/API/UI wiring
- change provider default
- weaken validators
- add schema fields
- add `polarInversion`
- add vector-conservation schema
- rerun `.004`
- use OpenAI API

## Claim boundary

Open Instrument remains a meaning/function motivation instrument.

It is not an etymology engine.

It does not find origin.

It does not declare a winner.

It does not prove historical derivation.

It does not prove candidate truth.

It does not prove model quality.

It does not claim language superiority.

## Decision

PR #1256 implementation is accepted.

The candidate-level segmentation traceability prompt hardening is in place.

The next allowed step is a docs-only preflight PR for a segmentation-traceability-hardened `.004 / S + TU + DI` rerun.

No model call may happen before that preflight is reviewed and merged.

## Next PR

Next PR should be:

`docs(open-instrument): preflight zheji study004 segmentation traceability hardened rerun`

The preflight must confirm:

- target artifact/report are absent
- PR #1256 prompt contract is present
- candidate-level `segmentationId` traceability instructions are present
- focused Zheji tests pass
- `npm run build` passes
- `npm run gate:quick` passes
- local `llama3.1:8b` is present
- OpenAI-compatible `/v1/models` endpoint responds
- no model call happened
- no artifact/report was created

## Final review outcome

The PR #1256 segmentation traceability prompt hardening implementation is accepted.

The `.004 / S + TU + DI` rerun remains blocked until a clean preflight PR is reviewed and merged.
