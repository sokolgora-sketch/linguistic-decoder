# `limit` Replay Artifact Build Crash Blocker v0.1

Status: LIMIT_REPLAY_ARTIFACT_BUILD_CRASH_BLOCKED.

Project lane: Open Instrument / ZËRO.

Blocker date: 2026-06-21.

Blocker base:

* Short SHA: `7b8e666c`
* Full SHA: `7b8e666c5107f3fc764903dac279d181fb3a3790`
* Subject: `docs(open-instrument): review limit replay runner execution-base contract repair v0.1`

Reviewed runner:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

Reviewed static contract test:

* `tests/openInstrument.limitReplayRunnerExecutionBaseContract.v0.1.spec.ts`

Reviewed execution-base repair review:

* `docs/open-instrument/reviews/zheji-generalization-limit-replay-runner-execution-base-contract-repair-review-v0.1.md`

Prior runner precheck blocker:

* `docs/open-instrument/zheji-generalization-limit-replay-runner-precheck-contract-blocker-v0.1.md`

Selected word:

`limit`

Selected stage:

`MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

Selected segmentation:

`LI + MIT`

Provider scope:

* provider family: `local_only_openai_compatible`
* provider name: `ollama_openai_compat`
* model: `llama3.1:8b`
* endpoint class: `localhost_only`
* base URL: `http://127.0.0.1:11434/v1`
* API key value: local dummy `ollama`

## Blocker decision

The reviewed `limit` replay execution is blocked again.

The runner passed the repaired execution-base contract far enough to enter the execution path.

The runner then crashed while building the passive artifact.

No output artifact was created.

No replay result exists.

No candidate result exists.

No evidence is available.

No evidence is promoted.

## Observed failed execution attempt

The reviewed execution command was attempted from `main`.

Reviewed execution base:

`7b8e666c5107f3fc764903dac279d181fb3a3790`

Observed failure:

`ReferenceError: currentHeadSha is not defined`

Observed stack site:

`buildArtifact`

Observed runner exit status:

`1`

Observed artifact result:

* `docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json` was not created.

## Provider/model call status

Provider/model call status is indeterminate from the available terminal excerpt.

The failure occurred inside `buildArtifact`, which is part of the execution path.

Because no passive artifact was produced, the attempt cannot be used as replay evidence.

Do not claim provider output.

Do not claim model output.

Do not claim candidate truth.

Do not claim origin evidence.

Do not claim model-quality evidence.

Do not claim execution-safety evidence.

## Root cause assessment

The runner contains this artifact source field:

`reviewedExecutionBaseSha: currentHeadSha`

The `buildArtifact` function does not receive `currentHeadSha` in its parameter destructuring.

Therefore, `currentHeadSha` is undefined inside `buildArtifact`.

This causes a runtime `ReferenceError` during artifact construction.

The runner must be repaired so the verified current main SHA is passed into `buildArtifact` explicitly.

## Required repair direction

The next repair PR must preserve fail-closed behavior.

The repair PR must not execute replay.

The repair PR must not call provider.

The repair PR must not call model.

The repair PR must not call localhost/Ollama.

The repair PR must not call an OpenAI-compatible endpoint.

The repair PR should pass the verified current main SHA into `buildArtifact` explicitly.

The repair PR should add or extend static contract tests to prevent this undefined variable from returning.

The repair PR must preserve:

* `--reviewed-execution-base`
* main-branch fail-closed precheck
* reviewed-base full SHA validation
* current-HEAD reviewed-base verification
* exact selected word
* exact selected stage
* exact selected segmentation
* local-only provider family
* exact provider name
* exact model
* exact endpoint class
* exact output path
* claim/evidence boundary

## What remains unauthorized

This blocker does not authorize:

* replay execution
* provider execution
* model call
* paid OpenAI API use
* remote endpoint use
* localhost/Ollama call
* OpenAI-compatible endpoint call
* secrets
* runtime/API/UI wiring
* source behavior changes beyond a future explicit runner repair PR
* schema changes
* validator changes
* package metadata changes
* CI changes
* artifacts
* evidence packs
* evidence promotion
* publication framing
* candidate-truth evidence
* origin evidence
* model-quality evidence
* publication evidence
* execution-safety evidence
* VoiceLab work

## Validation proof

This blocker PR must run:

* `node --check scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`
* `npm test -- tests/openInstrument.limitReplayRunnerExecutionBaseContract.v0.1.spec.ts --runInBand`
* `npm test -- tests/openInstrument.brainCandidateSearchPrompt.isolationAudit.guard.v0.1.spec.ts --runInBand`
* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`
* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

## Hard boundaries

Hard boundaries preserved in this blocker PR:

* No replay execution.
* No provider execution.
* No localhost/Ollama execution.
* No OpenAI-compatible endpoint call.
* No model call.
* No paid OpenAI API use.
* No remote endpoint use.
* No secrets.
* No runtime/API/UI behavior changes.
* No source behavior changes in this blocker PR.
* No schema changes.
* No validator changes.
* No package metadata changes.
* No CI changes.
* No artifacts.
* No evidence packs.
* No evidence promotion.
* No publication framing.
* No VoiceLab work.

## Current next task

`test(open-instrument): repair limit replay runner artifact build current-head propagation v0.1`
