# `limit` Replay Runner Artifact Build Current-Head Propagation Repair v0.1 — Review

Status: LIMIT_REPLAY_RUNNER_ARTIFACT_BUILD_CURRENT_HEAD_PROPAGATION_REPAIR_REVIEWED_ACCEPTED.

Scope: docs-only review of the `limit` replay runner artifact-build current-head propagation repair.

Review date: 2026-06-21.

Reviewed repair base:

* Short SHA: `3624d246`
* Full SHA: `3624d24601e00c2b9ce4710bb53170898a80c087`
* Subject: `test(open-instrument): repair limit replay runner artifact build current-head propagation v0.1`

Reviewed runner:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

Reviewed static contract test:

* `tests/openInstrument.limitReplayRunnerExecutionBaseContract.v0.1.spec.ts`

Prior artifact-build crash blocker:

* `docs/open-instrument/zheji-generalization-limit-replay-artifact-build-crash-blocker-v0.1.md`

Prior execution-base repair review:

* `docs/open-instrument/reviews/zheji-generalization-limit-replay-runner-execution-base-contract-repair-review-v0.1.md`

## Review decision

The artifact-build current-head propagation repair is accepted.

The repair passes verified `currentHeadSha` into `buildArtifact`.

The repair removes the leftover `currentHeadSha: EXPECTED_MAIN_SHA` artifact-source defect.

The passive artifact source field remains:

`reviewedExecutionBaseSha: currentHeadSha`

The static contract test now checks that `buildArtifact` receives `currentHeadSha`.

The static contract test now checks that the artifact call passes `currentHeadSha`.

The static contract test now checks that stale `currentHeadSha: EXPECTED_MAIN_SHA` does not return.

The next execution PR may proceed using the reviewed repaired command shape.

This review is docs-only.

This review does not execute replay.

This review does not call provider.

This review does not call model.

This review does not call localhost or Ollama.

This review does not call an OpenAI-compatible endpoint.

This review does not create the output artifact.

This review does not promote evidence.

## Reviewed source chain

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

Artifact-build crash blocker:

* `docs/open-instrument/zheji-generalization-limit-replay-artifact-build-crash-blocker-v0.1.md`

Current-head propagation repair:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`
* `tests/openInstrument.limitReplayRunnerExecutionBaseContract.v0.1.spec.ts`

## Repair facts accepted

Previous observed error:

`ReferenceError: currentHeadSha is not defined`

Previous observed stack site:

`buildArtifact`

Accepted repair fact:

`currentHeadSha` is now included in `buildArtifact` parameter destructuring.

Accepted repair fact:

`currentHeadSha` is now passed into the `buildArtifact` call.

Accepted repair fact:

`reviewedExecutionBaseSha` is sourced from verified `currentHeadSha`.

Accepted repair fact:

`currentHeadSha: EXPECTED_MAIN_SHA` is removed.

## Accepted reviewed command shape for next execution

The next execution PR must execute from `main`.

The next execution PR must pass current `main` full SHA as the reviewed execution base.

The reviewed command shape remains:

OPENAI_API_KEY=ollama \
OPENAI_BASE_URL=http://127.0.0.1:11434/v1 \
node scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs \
  --word limit \
  --stage MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY \
  --segmentation "LI + MIT" \
  --provider-family local_only_openai_compatible \
  --provider-name ollama_openai_compat \
  --model "llama3.1:8b" \
  --endpoint-class localhost_only \
  --output docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json \
  --reviewed-execution-base <CURRENT_REVIEWED_MAIN_FULL_SHA>

The placeholder `<CURRENT_REVIEWED_MAIN_FULL_SHA>` must be replaced by the full SHA of the reviewed `main` commit at execution time.

## Scope preserved

Selected word:

`limit`

Selected stage:

`MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

Selected segmentation:

`LI + MIT`

Provider family:

`local_only_openai_compatible`

Provider name:

`ollama_openai_compat`

Model:

`llama3.1:8b`

Endpoint class:

`localhost_only`

Base URL:

`http://127.0.0.1:11434/v1`

Output artifact:

`docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json`

## What remains blocked until next PR

Replay execution remains blocked in this review PR.

Provider execution remains blocked in this review PR.

Model calls remain blocked in this review PR.

Localhost/Ollama calls remain blocked in this review PR.

OpenAI-compatible endpoint calls remain blocked in this review PR.

Output artifact creation remains blocked in this review PR.

Evidence promotion remains blocked.

Publication framing remains blocked.

## Non-execution proof

This review did not execute replay.

This review did not call provider.

This review did not call model.

This review did not use paid OpenAI API.

This review did not use remote endpoint.

This review did not call localhost.

This review did not call Ollama.

This review did not call an OpenAI-compatible endpoint.

This review did not use secrets.

This review did not add runtime/API/UI wiring.

This review did not create artifacts.

This review did not create evidence packs.

This review did not publish anything.

This review did not score provider output.

This review did not rank candidates.

This review did not promote evidence.

## Accepted test coverage

The static contract test confirms:

* stale hardcoded runner SHA is not present
* `--reviewed-execution-base` is required
* reviewed execution base must be a full git SHA
* main-branch fail-closed precheck remains
* current-HEAD reviewed-base fail-closed precheck remains
* `buildArtifact` receives `currentHeadSha`
* artifact construction receives `currentHeadSha`
* `reviewedExecutionBaseSha` is sourced from `currentHeadSha`
* stale `currentHeadSha: EXPECTED_MAIN_SHA` does not return
* exact word/stage/segmentation scope remains
* exact provider/model/endpoint scope remains
* localhost-only protections remain
* claim-boundary protections remain

## What this review does not mean

This review does not mean replay execution happened.

This review does not mean provider execution happened.

This review does not mean model output exists.

This review does not mean the future artifact exists.

This review does not mean provider output is evidence.

This review does not mean candidate truth exists.

This review does not mean origin evidence exists.

This review does not mean model-quality evidence exists.

This review does not mean publication evidence exists.

This review does not mean runtime/API/UI wiring is authorized.

This review does not mean package metadata or CI changes are authorized.

## Review conclusion

The current-head propagation repair is accepted.

The runner can now be used in the next separate execution PR.

The next execution PR must execute from `main`.

The next execution PR must pass the current reviewed `main` full SHA through `--reviewed-execution-base`.

No replay happened in this review.

No provider call happened in this review.

No artifact was created in this review.

## Validation proof

The review ran:

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

`test(open-instrument): execute reviewed limit generalization replay v0.1`
