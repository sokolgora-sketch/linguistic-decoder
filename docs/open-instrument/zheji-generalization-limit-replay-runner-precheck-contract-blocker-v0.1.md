# `limit` Replay Runner Precheck Contract Blocker v0.1

Status: LIMIT_REPLAY_RUNNER_PRECHECK_CONTRACT_BLOCKED.

Project lane: Open Instrument / ZËRO.

Blocker date: 2026-06-21.

Blocker base:

* Short SHA: `ca2b4c2f`
* Full SHA: `ca2b4c2ff23dba46000c41d630a690ca89418ad1`
* Subject: `docs(open-instrument): review exact limit replay execution runner v0.1`

Reviewed runner:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

Reviewed runner implementation review:

* `docs/open-instrument/reviews/zheji-generalization-limit-replay-runner-implementation-review-v0.1.md`

Reviewed runner/provider scope review:

* `docs/open-instrument/reviews/zheji-generalization-limit-replay-runner-provider-scope-review-v0.1.md`

Reviewed runner/provider scope definition:

* `docs/open-instrument/zheji-generalization-limit-replay-runner-provider-scope-v0.1.md`

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

## Blocker decision

The reviewed `limit` replay execution is blocked.

The runner implementation is reviewed.

The runner/provider scope is reviewed.

However, the first execution attempt exposed a runner precheck contract problem.

The execution must not be attempted again until the runner execution-base contract is repaired and reviewed.

## Observed failed execution attempt

The failed attempt created the execution branch before running the runner.

Failed branch:

`test/open-instrument-execute-reviewed-limit-generalization-replay-v0-1`

The runner exited before any provider call.

Observed runner failure:

`runner must execute from main`

No output artifact was created.

No replay result exists.

No provider execution occurred.

No model call occurred.

No localhost/Ollama call occurred.

No OpenAI-compatible endpoint call occurred.

No evidence was promoted.

## Root cause assessment

The runner currently requires execution from `main`.

The failed execution script created a feature branch before invoking the runner.

That ordering is incompatible with the runner precheck.

The runner also embeds this expected main SHA:

`4a4b2dc411b929c486e91ff80923fc728c44bfc6`

The current reviewed execution base is:

`ca2b4c2ff23dba46000c41d630a690ca89418ad1`

Therefore, simply rerunning the runner from `main` is not sufficient.

The runner execution-base contract must be repaired.

## Why execution remains blocked

Execution remains blocked because the runner must verify the reviewed execution base, but the reviewed execution base cannot be safely hardcoded to an older implementation/review SHA.

A hardcoded SHA inside the runner drifts whenever a review or repair PR lands before execution.

The runner needs a repaired execution-base contract that can verify the actual reviewed execution base used by the execution PR without making execution impossible after review merges.

## Required repair direction

The next repair PR must preserve fail-closed behavior.

The repair PR must not execute the replay.

The repair PR must not call provider.

The repair PR must not call localhost/Ollama.

The repair PR must not call model.

The repair PR should repair the execution-base contract by making the reviewed execution base explicit at execution time.

Acceptable repair shape:

* add an explicit reviewed execution base argument or environment value
* verify that value equals current `main` at execution time
* keep the runner on `main` precheck, or replace it with an equivalent safe precheck that still prevents dirty or unreviewed execution
* keep provider scope locked
* keep output path locked
* keep word, stage, and segmentation locked
* keep claim/evidence boundary locked

If the repair changes the reviewed command shape, the repair PR must document the updated reviewed command shape.

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
* execution-safety evidence
* VoiceLab work

## Validation proof

This blocker PR must run:

* `node --check scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`
* `npm test -- tests/openInstrument.brainCandidateSearchPrompt.isolationAudit.guard.v0.1.spec.ts --runInBand`
* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`
* dedicated limit replay tests if discovered
* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

## Hard boundaries

Hard boundaries preserved:

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

`test(open-instrument): repair limit replay runner execution-base contract v0.1`
