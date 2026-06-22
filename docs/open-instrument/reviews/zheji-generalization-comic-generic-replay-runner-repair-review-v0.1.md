# Generic `comic` Replay Runner Repair Review v0.1

Status: COMIC_GENERIC_REPLAY_RUNNER_REPAIR_REVIEWED_ACCEPTED_READY_FOR_ONE_EXECUTION.

Review date: 2026-06-22.

Review scope: docs-only review of PR #1531 runner repair.

Reviewed base:

* Short SHA: `91ff03fb`
* Full SHA: `91ff03fb2904d6d676ad84bc2ac2ae6cf2122f66`
* Subject: `test(open-instrument): repair limit replay runner into reviewed generic replay runner for comic v0.1`

Reviewed files:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`
* `tests/openInstrument.limitReplayRunnerExecutionBaseContract.v0.1.spec.ts`

Reviewed `comic` scope:

* `docs/open-instrument/zheji-generalization-comic-replay-scope-v0.1.md`

Reviewed `comic` scope review:

* `docs/open-instrument/reviews/zheji-generalization-comic-replay-scope-review-v0.1.md`

Runner readiness inspection:

* `docs/open-instrument/zheji-generalization-comic-replay-runner-readiness-inspection-v0.1.md`

## Review decision

The generic runner repair is accepted.

The runner is ready for exactly one reviewed local-only `comic` replay execution in the next PR.

No execution happened in this review PR.

## Accepted execution target for next PR

Word:

`comic`

Stage:

`MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

Segmentation:

`COM + IC`

Output artifact:

`docs/open-instrument/artifacts/zheji-generalization/comic-generalization-replay-v0.1.json`

Reviewed execution base for the next execution must be the full SHA of this review PR after merge.

## Accepted repair properties

The reviewed repair provides:

* request-scoped word, stage, and segmentation
* request-scoped output artifact path under the reviewed artifact root
* provider output validation against request context
* generic reviewed replay schema identifiers
* preserved local-only provider safeguards
* preserved OpenAI-compatible message-content extraction
* preserved claim-boundary protections
* `comic` representability coverage for `COM + IC`

## Required execution boundary for next PR

The next PR may perform exactly one local-only `comic` replay execution.

The next PR must use:

* `OPENAI_API_KEY=ollama`
* `OPENAI_BASE_URL=http://127.0.0.1:11434/v1`
* provider family: `local_only_openai_compatible`
* provider name: `ollama_openai_compat`
* model: `llama3.1:8b`
* endpoint class: `localhost_only`
* word: `comic`
* stage: `MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`
* segmentation: `COM + IC`
* output: `docs/open-instrument/artifacts/zheji-generalization/comic-generalization-replay-v0.1.json`

The next PR must not change prompt source.

The next PR must not weaken validation.

The next PR must not use remote provider endpoints.

The next PR must not use hosted OpenAI endpoints.

The next PR must not use DeepSeek endpoints.

The next PR must not promote evidence.

The next PR must not add publication framing.

## Review proof

The review confirmed:

* `GENERIC_REPLAY_SCOPE_V0_1`
* `ARTIFACT_OUTPUT_ROOT`
* `outputPath: args.output`
* `word: args.word`
* `stage: args.stage`
* `segmentation: args.segmentation`
* `requestContext.word`
* `requestContext.stage`
* `requestContext.segmentation`
* `open-instrument.reviewed-generalization-replay.v0.1`
* OpenAI-compatible message-content extraction
* local-only provider constants
* `comic` test coverage for `COM + IC`

The review also confirmed stale `limit`-only target gates were removed.

## Boundary proof for this review PR

No replay execution occurred in this review PR.

No provider execution occurred in this review PR.

No model call occurred in this review PR.

No localhost/Ollama call occurred in this review PR.

No OpenAI-compatible endpoint call occurred in this review PR.

No remote endpoint use occurred in this review PR.

No hosted OpenAI execution occurred in this review PR.

No DeepSeek execution occurred in this review PR.

No model switching occurred in this review PR.

No prompt change occurred in this review PR.

No validator weakening occurred in this review PR.

No runtime/API/UI behavior changes occurred in this review PR.

No source behavior changes occurred in this review PR.

No schema changes occurred in this review PR.

No package metadata changes occurred in this review PR.

No CI changes occurred in this review PR.

No artifact mutation occurred in this review PR.

No evidence promotion occurred in this review PR.

No publication framing occurred in this review PR.

No VoiceLab work occurred in this review PR.

## Next accepted task

`test(open-instrument): execute reviewed comic generalization replay v0.1`
