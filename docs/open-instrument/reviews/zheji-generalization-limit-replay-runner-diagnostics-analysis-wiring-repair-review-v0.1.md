# `limit` Replay Runner Diagnostics Analysis Wiring Repair v0.1 — Review

Status: LIMIT_REPLAY_RUNNER_DIAGNOSTICS_ANALYSIS_WIRING_REPAIR_REVIEWED_ACCEPTED.

Scope: docs-only review of diagnostics analysis wiring repair.

Review date: 2026-06-21.

Reviewed repair base:

* Short SHA: `e930ba3d`
* Full SHA: `e930ba3d58af0ea091fe3167844e8fdfed89c5ca`
* Subject: `test(open-instrument): repair limit replay runner diagnostics analysis wiring v0.1`

Reviewed runner:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

Reviewed static contract test:

* `tests/openInstrument.limitReplayRunnerExecutionBaseContract.v0.1.spec.ts`

Existing passive artifact:

* `docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json`

## Review decision

The diagnostics analysis wiring repair is accepted.

The previous failed diagnostic attempt exposed a real contradiction:

* artifact classification was `REPLAY_INVALIDATED`
* diagnostic code was `NOT_INVALIDATED`
* validator status was `UNKNOWN`

The repair is accepted because diagnostics now read from the actual analysis object and the captured provider payload.

## Accepted runner wiring

The runner diagnostics now read:

* `analysis?.outcomeClassification`
* `rawProviderResponse ?? rawErrorText`
* `capturedText`
* `analysis`
* `analysis?.normalizedCandidatePayload`
* `analysis?.validationOutcome`
* `analysis?.validationOutcome?.errors`
* `analysis?.parseError ?? null`

## Accepted test guard

The static contract test now confirms the repaired wiring.

The static contract test also keeps the stale string only inside a negative assertion:

`expect(source).not.toContain('outcomeClassification: typeof outcomeClassification === "undefined"');`

That string must not appear in the runner.

It may appear in the test only as a negative guard.

## What this review means

The diagnostics repair lane is now ready for a new separate diagnostic replay execution.

The next replay should use the repaired diagnostics wiring.

If the replay invalidates again, it should no longer produce the contradiction `REPLAY_INVALIDATED` plus `NOT_INVALIDATED`.

## What this review does not mean

This review does not execute replay.

This review does not call provider.

This review does not call model.

This review does not call localhost or Ollama.

This review does not call an OpenAI-compatible endpoint.

This review does not mutate the artifact.

This review does not promote evidence.

This review does not authorize publication framing.

This review does not authorize runtime/API/UI wiring.

## Required next execution posture

The next separate PR must still be exactly one reviewed local-only diagnostic `limit` replay.

It must preserve:

* word: `limit`
* stage: `MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`
* segmentation: `LI + MIT`
* provider: `ollama_openai_compat`
* model: `llama3.1:8b`
* endpoint class: `localhost_only`
* passive artifact boundary
* no evidence promotion
* no publication framing

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

`test(open-instrument): execute reviewed limit replay with repaired diagnostics wiring v0.1`
