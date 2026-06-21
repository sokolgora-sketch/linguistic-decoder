# `limit` Replay Runner Execution-Base Contract Repair v0.1 — Review

Status: LIMIT_REPLAY_RUNNER_EXECUTION_BASE_CONTRACT_REPAIR_REVIEWED_ACCEPTED.

Scope: docs-only review of the `limit` replay runner execution-base contract repair.

Review date: 2026-06-21.

Reviewed repair base:

* Short SHA: `dc8f64e9`
* Full SHA: `dc8f64e9c95f2dd235d1d08a5a165dd61522f8f1`
* Subject: `test(open-instrument): repair limit replay runner execution-base contract v0.1`

Reviewed runner:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

Reviewed static contract test:

* `tests/openInstrument.limitReplayRunnerExecutionBaseContract.v0.1.spec.ts`

Prior blocker:

* `docs/open-instrument/zheji-generalization-limit-replay-runner-precheck-contract-blocker-v0.1.md`

## Review decision

The `limit` replay runner execution-base contract repair is accepted.

The runner repair replaced the stale hardcoded execution-base SHA with an explicit `--reviewed-execution-base` argument.

The runner still fails closed if it is not executed from `main`.

The runner still fails closed if current `main` does not equal the provided reviewed execution base.

The runner still fails closed if the reviewed execution base is not a full 40-character git SHA.

The artifact source now records `reviewedExecutionBaseSha` from the current verified `main` head.

The static contract test is accepted.

The next execution PR may proceed using the repaired reviewed command shape.

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

Runner execution-base repair:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`
* `tests/openInstrument.limitReplayRunnerExecutionBaseContract.v0.1.spec.ts`

## Repair facts accepted

Removed stale hardcoded runner SHA:

`4a4b2dc411b929c486e91ff80923fc728c44bfc6`

Added explicit runner argument:

`--reviewed-execution-base`

Preserved fail-closed main-branch precheck:

`runner must execute from main`

Preserved fail-closed reviewed-base precheck:

`main SHA does not match the reviewed execution base`

Preserved full-SHA validation:

`reviewed-execution-base must be a full 40-character git SHA`

Preserved artifact source field:

`reviewedExecutionBaseSha`

The repaired artifact source field must come from the verified current `main` head, not from a stale hardcoded constant.

## Accepted reviewed command shape for next execution

The next execution PR must execute from `main`.

The next execution PR must pass current `main` full SHA as the reviewed execution base.

The reviewed command shape is:

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

The execution-base repair is accepted.

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
