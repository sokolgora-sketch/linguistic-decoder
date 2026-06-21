# `limit` Replay Runner Invalidation Diagnostics Repair v0.1 — Review

Status: LIMIT_REPLAY_RUNNER_INVALIDATION_DIAGNOSTICS_REPAIR_REVIEWED_ACCEPTED.

Scope: docs-only review of the `limit` replay runner invalidation diagnostics repair.

Review date: 2026-06-21.

Reviewed repair base:

* Short SHA: `0efeb87c`
* Full SHA: `0efeb87c313d712d81a026a680a7b4368cec9ef8`
* Subject: `test(open-instrument): repair limit replay runner invalidation diagnostics v0.1`

Reviewed runner:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

Reviewed static contract test:

* `tests/openInstrument.limitReplayRunnerExecutionBaseContract.v0.1.spec.ts`

Existing invalidated artifact:

* `docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json`

Prior assessment:

* `docs/open-instrument/zheji-generalization-limit-replay-invalidated-result-assessment-v0.1.md`

## Review decision

The invalidation diagnostics repair is accepted.

The repair adds diagnostic structure for future `REPLAY_INVALIDATED` artifacts.

The repair does not rerun replay.

The repair does not mutate the existing invalidated artifact.

The repair does not promote evidence.

The repair does not authorize publication framing.

The repair does not authorize runtime/API/UI wiring.

## Accepted diagnostic fields

Future invalidated artifacts can emit:

* `invalidationCode`
* `invalidationStage`
* `invalidationReason`
* `failedCheck`
* `expectedShape`
* `receivedShapeSummary`
* `parserStatus`
* `validatorStatus`
* `providerOutputPresent`
* `providerOutputParseable`
* `claimBoundaryStatus`
* `diagnosticMessages`

## Accepted invalidation code families

The runner now distinguishes at least these invalidation code families:

* `PROVIDER_OUTPUT_MISSING`
* `PROVIDER_OUTPUT_UNPARSEABLE`
* `VALIDATION_FAILED`
* `INVALIDATED_WITHOUT_ATTACHED_CAUSE`

This is enough to make the next diagnostic replay actionable.

## Why this repair is accepted

The previous artifact was truth-preserving but not diagnostic enough.

The previous classification was:

`REPLAY_INVALIDATED`

The previous invalidation reason was:

`UNKNOWN`

The assessment rejected a blind rerun.

The assessment selected a narrow diagnostics repair.

The repair implements that narrow diagnostic path.

## What this review allows next

The next PR may execute exactly one reviewed local-only `limit` replay with the repaired diagnostics runner.

The purpose of that execution is to obtain a diagnostic invalidation reason if the replay invalidates again.

The next PR must still preserve:

* selected word `limit`
* stage `MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`
* segmentation `LI + MIT`
* provider `ollama_openai_compat`
* model `llama3.1:8b`
* endpoint class `localhost_only`
* passive artifact boundary
* no evidence promotion
* no publication framing

## What this review does not allow

This review does not allow blind repeated reruns.

This review does not allow model switching.

This review does not allow switching to `comic`.

This review does not allow changing `limit` segmentation.

This review does not allow runtime/API/UI wiring.

This review does not allow schema mutation.

This review does not allow validator mutation.

This review does not allow prompt mutation.

This review does not allow evidence promotion.

This review does not allow publication framing.

## Source chain reviewed

Runner/provider scope definition:

* `docs/open-instrument/zheji-generalization-limit-replay-runner-provider-scope-v0.1.md`

Runner/provider scope review:

* `docs/open-instrument/reviews/zheji-generalization-limit-replay-runner-provider-scope-review-v0.1.md`

Runner implementation review:

* `docs/open-instrument/reviews/zheji-generalization-limit-replay-runner-implementation-review-v0.1.md`

Execution-base repair review:

* `docs/open-instrument/reviews/zheji-generalization-limit-replay-runner-execution-base-contract-repair-review-v0.1.md`

Current-head propagation repair review:

* `docs/open-instrument/reviews/zheji-generalization-limit-replay-runner-artifact-build-current-head-propagation-repair-review-v0.1.md`

Invalidated replay artifact:

* `docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json`

Invalidated replay result review:

* `docs/open-instrument/reviews/zheji-generalization-limit-replay-result-review-v0.1.md`

Invalidated replay assessment:

* `docs/open-instrument/zheji-generalization-limit-replay-invalidated-result-assessment-v0.1.md`

Diagnostics repair:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`
* `tests/openInstrument.limitReplayRunnerExecutionBaseContract.v0.1.spec.ts`

## Validation proof

The review ran:

* `jq . docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json`
* `node --check scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`
* `npm test -- tests/openInstrument.limitReplayRunnerExecutionBaseContract.v0.1.spec.ts --runInBand`
* `npm test -- tests/openInstrument.brainCandidateSearchPrompt.isolationAudit.guard.v0.1.spec.ts --runInBand`
* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`
* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

All passed before merge.

## Boundary proof

No replay execution occurred in this review PR.

No provider execution occurred in this review PR.

No model call occurred in this review PR.

No localhost/Ollama call occurred in this review PR.

No OpenAI-compatible endpoint call occurred in this review PR.

No remote endpoint use occurred in this review PR.

No hosted OpenAI execution occurred in this review PR.

No DeepSeek execution occurred in this review PR.

No model switching occurred in this review PR.

No runtime/API/UI behavior changes occurred in this review PR.

No source behavior changes occurred in this review PR.

No schema changes occurred in this review PR.

No validator changes occurred in this review PR.

No package metadata changes occurred in this review PR.

No CI changes occurred in this review PR.

No artifact mutation occurred in this review PR.

No evidence promotion occurred in this review PR.

No publication framing occurred in this review PR.

No VoiceLab work occurred in this review PR.

## Current next task

`test(open-instrument): execute reviewed limit replay with invalidation diagnostics v0.1`
