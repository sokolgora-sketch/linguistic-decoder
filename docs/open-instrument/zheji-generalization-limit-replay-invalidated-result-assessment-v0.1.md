# `limit` Replay Invalidated Result Assessment v0.1

Status: LIMIT_REPLAY_INVALIDATED_ASSESSED_DIAGNOSTICS_INSUFFICIENT.

Scope: docs-only assessment of the reviewed invalidated `limit` replay result and selection of one next action.

Assessment date: 2026-06-21.

Assessment base:

* Short SHA: `db79d23f`
* Full SHA: `db79d23fc71bc8c071a447024325014c54a0f095`
* Subject: `docs(open-instrument): review limit generalization replay result v0.1`

Reviewed artifact:

* `docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json`

Reviewed result review:

* `docs/open-instrument/reviews/zheji-generalization-limit-replay-result-review-v0.1.md`

## Assessment decision

The `limit` replay lane reached a real passive artifact.

The artifact is not a successful generalization signal.

The artifact classification is:

`REPLAY_INVALIDATED`

The invalidation reason resolved by the current artifact inspection is:

`UNKNOWN`

The correct next action is:

`test(open-instrument): repair limit replay runner invalidation diagnostics v0.1`

Reason:

The artifact is truth-preserving but not diagnostic enough: it says REPLAY_INVALIDATED while the invalidation reason resolves to UNKNOWN. Before another replay, the runner must emit concrete invalidation diagnostics.

## Artifact summary

    {
      "schemaVersion": "open-instrument.limit-generalization-replay.v0.1",
      "capturePacketId": "open-instrument.limit-generalization-replay.packet.v0.1",
      "outcomeClassification": "REPLAY_INVALIDATED",
      "reviewedExecutionBaseSha": "f03ad84c799be1bbe08756ff9f7fadceb44bfe0e",
      "word": "limit",
      "stage": "MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY",
      "segmentation": "LI + MIT",
      "providerFamily": "local_only_openai_compatible",
      "providerName": "ollama_openai_compat",
      "model": "llama3.1:8b",
      "endpointClass": "localhost_only",
      "baseUrl": "http://127.0.0.1:11434/v1"
    }

## Facts accepted

Selected word:

`limit`

Selected stage:

`MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

Selected segmentation:

`LI + MIT`

Provider:

`ollama_openai_compat`

Model:

`llama3.1:8b`

Endpoint class:

`localhost_only`

Reviewed execution base:

`f03ad84c799be1bbe08756ff9f7fadceb44bfe0e`

Classification:

`REPLAY_INVALIDATED`

Invalidation reason:

`UNKNOWN`

## Interpretation

The replay did not prove ZËRO generalization for `limit`.

The replay did not prove `LI + MIT`.

The replay did not create candidate-truth evidence.

The replay did not create origin evidence.

The replay did not create model-quality evidence.

The replay did not create publication evidence.

The replay did not promote evidence.

The replay did create a passive artifact that preserves the fact of invalidation.

## Why the next action is not a blind rerun

A blind rerun would spend another model call without knowing what failed.

A blind rerun would not tell us whether the issue was:

* provider output shape
* prompt/output contract mismatch
* parser mismatch
* validator mismatch
* claim-boundary enforcement
* artifact-classification logic
* genuine null pressure
* unsuitable word/stage pairing

Therefore the next action must improve diagnostic specificity before any rerun.

## Required next repair direction

The next repair must be narrow.

The next repair must only improve invalidation diagnostics.

The next repair should make future `REPLAY_INVALIDATED` artifacts explain what invalidated the replay.

The next repair should add explicit diagnostic fields such as:

* invalidationCode
* invalidationStage
* invalidationReason
* failedCheck
* expectedShape
* receivedShapeSummary
* parserStatus
* validatorStatus
* providerOutputPresent
* providerOutputParseable
* claimBoundaryStatus

The next repair must preserve the existing claim-boundary policy.

The next repair must not convert invalidated output into evidence.

The next repair must not change selected word, stage, segmentation, provider, model, endpoint class, or output path.

The next repair must not execute replay.

The next repair must not call provider.

The next repair must not call model.

## Explicitly rejected next actions

Do not rerun immediately.

Do not switch to `comic` yet.

Do not treat `limit` as failed linguistically yet.

Do not treat `limit` as a null result yet.

Do not promote the invalidated artifact.

Do not publish.

Do not wire runtime/API/UI.

Do not change model.

Do not use a remote endpoint.

## Source chain reviewed

Runner/provider scope definition:

* `docs/open-instrument/zheji-generalization-limit-replay-runner-provider-scope-v0.1.md`

Runner/provider scope review:

* `docs/open-instrument/reviews/zheji-generalization-limit-replay-runner-provider-scope-review-v0.1.md`

Runner implementation review:

* `docs/open-instrument/reviews/zheji-generalization-limit-replay-runner-implementation-review-v0.1.md`

Runner precheck blocker:

* `docs/open-instrument/zheji-generalization-limit-replay-runner-precheck-contract-blocker-v0.1.md`

Runner execution-base repair review:

* `docs/open-instrument/reviews/zheji-generalization-limit-replay-runner-execution-base-contract-repair-review-v0.1.md`

Current-head artifact-build crash blocker:

* `docs/open-instrument/zheji-generalization-limit-replay-artifact-build-crash-blocker-v0.1.md`

Current-head propagation repair review:

* `docs/open-instrument/reviews/zheji-generalization-limit-replay-runner-artifact-build-current-head-propagation-repair-review-v0.1.md`

Reviewed replay artifact:

* `docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json`

Replay result review:

* `docs/open-instrument/reviews/zheji-generalization-limit-replay-result-review-v0.1.md`

## Review boundary

This assessment does not execute replay.

This assessment does not call provider.

This assessment does not call model.

This assessment does not call localhost or Ollama.

This assessment does not call an OpenAI-compatible endpoint.

This assessment does not mutate the artifact.

This assessment does not create evidence.

This assessment does not promote evidence.

This assessment does not authorize publication framing.

This assessment does not authorize runtime/API/UI wiring.

## Validation proof

The assessment ran:

* `jq . docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json`
* artifact summary extraction
* `node --check scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`
* `npm test -- tests/openInstrument.limitReplayRunnerExecutionBaseContract.v0.1.spec.ts --runInBand`
* `npm test -- tests/openInstrument.brainCandidateSearchPrompt.isolationAudit.guard.v0.1.spec.ts --runInBand`
* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`
* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

All passed before merge.

## Current next task

`test(open-instrument): repair limit replay runner invalidation diagnostics v0.1`
