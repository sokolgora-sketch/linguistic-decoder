# Exact `limit` Replay Execution Runner and Provider Scope v0.1

Status: LIMIT_REPLAY_RUNNER_PROVIDER_SCOPE_DEFINED.

Project lane: Open Instrument / ZËRO.

Definition date: 2026-06-21.

Definition base:

* Short SHA: `79e5f861`
* Full SHA: `79e5f861867f276bcb29b36305bffb60cec7a61d`

Prerequisite blocker:

* `docs/open-instrument/zheji-generalization-limit-replay-execution-blocker-v0.1.md`

Reviewed replay authorization:

* `docs/open-instrument/zheji-generalization-limit-replay-authorization-v0.1.md`
* `docs/open-instrument/reviews/zheji-generalization-limit-replay-authorization-review-v0.1.md`

Selected word:

`limit`

Selected stage:

`MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

## Definition decision

This document defines the exact future runner and provider scope for the blocked `limit` replay.

This definition is docs-only.

This definition does not execute the replay.

This definition does not call a provider.

This definition does not call localhost/Ollama.

This definition does not modify source, runtime, API, UI, schema, validator, package metadata, or CI.

The future runner must be implemented and reviewed before execution.

## Exact runner scope

Future runner file:

`scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

Future runner command:

```bash
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
  --output docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json
```

The future runner must fail closed if any argument differs.

The future runner must fail closed if the output path differs.

The future runner must fail closed if the working tree is dirty before execution.

## Exact provider scope

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

API key value:

`ollama`

The API key value is a local dummy Ollama value only.

Remote endpoints are out of scope.

OpenAI hosted execution is out of scope.

DeepSeek execution is out of scope.

Provider fallback is out of scope.

Automatic provider selection is out of scope.

Provider default mutation is out of scope.

## Local-only boundary

The future runner may only use the localhost OpenAI-compatible endpoint at:

`http://127.0.0.1:11434/v1`

The future runner must reject:

* non-localhost base URLs
* missing provider name
* missing model name
* missing endpoint class
* provider fallback
* remote endpoint use
* OpenAI hosted endpoint use
* DeepSeek endpoint use
* any API key value other than the reviewed local dummy value

## Exact output scope

Future output directory:

`docs/open-instrument/artifacts/zheji-generalization`

Future output file:

`docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json`

The future execution PR may create only the declared output file.

It must not modify:

* source files
* tests
* schema files
* validator files
* package files
* CI files
* runtime/API/UI files

## Exact word and segmentation scope

Selected word:

`limit`

Selected stage:

`MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

Selected segmentation for first execution:

`LI + MIT`

The execution must not try multiple segmentations.

The execution must not tune the prompt after seeing output.

The execution must not change the prompt.

The execution must use the already implemented `<ISOLATION_AUDIT>` prompt hardening.

## Required runner behavior

The future runner must:

* verify repo cleanliness before execution
* verify main SHA is the reviewed execution base
* verify `<ISOLATION_AUDIT>` exists
* verify prompt guard test passes before execution
* verify passive Zheji validation passes before execution
* write exactly one passive artifact
* include provider identity in the artifact
* include model identity in the artifact
* include endpoint class in the artifact
* include selected word in the artifact
* include selected stage in the artifact
* include selected segmentation in the artifact
* include raw provider response or raw error text if available
* include normalized candidate payload if available
* include validation outcome if available
* include failure classification if execution fails
* include claim boundary

## Required artifact boundary

The future artifact must mark:

* development-only: true
* publication evidence: false
* origin evidence: false
* ownership evidence: false
* model-quality evidence: false
* provider-output correctness evidence: false
* candidate-truth evidence: false

The future artifact must preserve null as valid truth.

The future artifact must not crown a winner.

## Required failure classifications

The future runner must produce one of these classifications:

* `GENERALIZATION_SIGNAL_PRESENT`
* `GENERALIZATION_NULL_ACCEPTED`
* `PROMPT_COLLAPSE`
* `MODEL_COLLAPSE`
* `EXTRACTION_CONTRACT_FAILURE`
* `VALIDATION_FAILURE`
* `REPLAY_INVALIDATED`
* `RUNNER_PRECHECK_FAILED`
* `LOCAL_PROVIDER_UNAVAILABLE`

## Future implementation boundary

A future implementation PR may add:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

A future implementation PR may not change:

* package metadata
* CI
* runtime/API/UI
* schema
* validator
* prompt source
* prompt guard tests

If the implementation proves a package script is required, it must stop and define a separate package-metadata lane.

## Future execution boundary

Execution remains blocked until:

1. this runner/provider scope is reviewed and accepted
2. the runner file is implemented and reviewed
3. a new execution PR runs the reviewed command

This document does not execute the replay.

This document does not grant evidence status to any future output.

## What remains unauthorized

This definition does not authorize:

* replay execution
* provider call execution
* localhost/Ollama call execution
* OpenAI execution
* remote endpoint execution
* model switching
* DeepSeek switching
* runtime wiring
* API output changes
* UI output changes
* source behavior changes
* schema changes
* validator changes
* package metadata changes
* CI changes
* evidence packs
* publication framing
* candidate-truth claims
* origin claims
* ownership claims
* model-quality claims
* VoiceLab work

## Validation proof required for review

The review of this runner/provider scope must run:

* `npm test -- tests/openInstrument.brainCandidateSearchPrompt.isolationAudit.guard.v0.1.spec.ts --runInBand`
* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`
* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

## Hard boundaries

Hard boundaries preserved:

* No replay execution.
* No provider execution.
* No localhost/Ollama execution.
* No runtime/API/UI behavior changes.
* No source behavior changes.
* No schema changes.
* No validator changes.
* No package metadata changes.
* No CI changes.
* No evidence promotion.
* No publication framing.
* No VoiceLab work.

## Current next task

`docs(open-instrument): review exact limit replay execution runner and provider scope v0.1`
