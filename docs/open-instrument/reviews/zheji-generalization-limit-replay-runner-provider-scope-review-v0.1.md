# Exact `limit` Replay Execution Runner and Provider Scope v0.1 — Review

Status: LIMIT_REPLAY_RUNNER_PROVIDER_SCOPE_REVIEWED_ACCEPTED.

Scope: docs-only review of exact `limit` replay runner/provider scope.

## Review decision

Runner/provider scope accepted.

Future runner file accepted: `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

Future output file accepted: `docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json`

Selected word accepted: `limit`

Selected stage accepted: `MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

Selected segmentation accepted: `LI + MIT`

Local-only provider family accepted: `local_only_openai_compatible`

Provider name accepted: `ollama_openai_compat`

Model accepted: `llama3.1:8b`

Endpoint class accepted: `localhost_only`

Base URL accepted: `http://127.0.0.1:11434/v1`

Dummy API key value accepted: `ollama`

Future implementation PR may add the exact runner file.

Future implementation PR must not execute the runner.

Future implementation PR must not call provider.

Future implementation PR must not call localhost/Ollama.

Execution remains blocked until runner implementation and review.

This review is docs-only.

This review does not execute replay.

This review does not call provider.

This review does not call localhost/Ollama.

This review does not authorize runtime/API/UI changes.

This review does not authorize schema or validator changes.

This review does not authorize package metadata or CI changes.

This review does not grant evidence status.

## Reviewed source chain

* PR #1492 — `docs/open-instrument/zheji-generalization-second-word-selection-mixed-heart-extraction-v0.1.md` — `2554684d70681262da3be5f0c70e811a0b61e2e5`
* PR #1493 — `docs/open-instrument/reviews/zheji-generalization-second-word-selection-mixed-heart-extraction-review-v0.1.md` — `1500d6c2c56bf2b38735751e6316fe4a5412d2f7`
* PR #1494 — `docs/open-instrument/zheji-generalization-isolation-audit-prompt-hardening-limit-v0.1.md` — `49a8e66b0efaac597536b530c8e52b00a4614902`
* PR #1495 — `docs/open-instrument/reviews/zheji-generalization-isolation-audit-prompt-hardening-limit-review-v0.1.md` — `f1fa3b82e64d5d53a564ef06ed6b3bef099972a0`
* PR #1496 — `src/shared/openInstrument/brainCandidateSearchPrompt.v0.1.ts` and `tests/openInstrument.brainCandidateSearchPrompt.isolationAudit.guard.v0.1.spec.ts` — `44ea4ffc6c4b4851c9687d637d514340503a3bdf`
* PR #1497 — `docs/open-instrument/reviews/zheji-generalization-isolation-audit-prompt-hardening-implementation-limit-review-v0.1.md` — `4c26f73a750cad2c141f03d54511474f8766b65f`
* PR #1498 — `docs/open-instrument/zheji-generalization-limit-replay-authorization-v0.1.md` — `76d2251ac7af683a38cb6103e16c81185faeaea2`
* PR #1499 — `docs/open-instrument/reviews/zheji-generalization-limit-replay-authorization-review-v0.1.md` — `8b593507e2c36d5b35bad9c2bd3397ff25c358bb`
* PR #1500 — `docs/open-instrument/zheji-generalization-limit-replay-execution-blocker-v0.1.md` — `79e5f861867f276bcb29b36305bffb60cec7a61d`
* PR #1501 — `docs/open-instrument/zheji-generalization-limit-replay-runner-provider-scope-v0.1.md` — `14f56269381c2ed9045ba4202d02f6c5e652f463`

## Scope definition review

The scope definition doc is reviewed and accepted.

It correctly defines:

* exact runner file
* exact runner command
* exact provider family
* exact provider name
* exact model
* exact endpoint class
* exact base URL
* exact API key dummy value
* exact output path
* exact word
* exact stage
* exact segmentation
* required runner behavior
* required artifact boundary
* required failure classifications
* implementation boundary
* execution boundary
* unauthorized boundary

## Accepted runner scope

Future runner file:

`scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

Future runner command accepted as equivalent to:

`OPENAI_API_KEY=ollama`

`OPENAI_BASE_URL=http://127.0.0.1:11434/v1`

`node scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

`  --word limit`

`  --stage MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

`  --segmentation "LI + MIT"`

`  --provider-family local_only_openai_compatible`

`  --provider-name ollama_openai_compat`

`  --model "llama3.1:8b"`

`  --endpoint-class localhost_only`

`  --output docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json`

The exact command shape is accepted.

## Accepted provider scope

* provider family: `local_only_openai_compatible`
* provider name: `ollama_openai_compat`
* model: `llama3.1:8b`
* endpoint class: `localhost_only`
* base URL: `http://127.0.0.1:11434/v1`
* API key value: `ollama`
* API key value is local dummy value only
* remote endpoints are out of scope
* OpenAI hosted execution is out of scope
* DeepSeek execution is out of scope
* provider fallback is out of scope
* automatic provider selection is out of scope
* provider default mutation is out of scope

## Accepted local-only boundary

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

## Accepted output scope

* output directory: `docs/open-instrument/artifacts/zheji-generalization`
* output file: `docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json`
* future execution PR may create only the declared output file
* future execution PR must not modify source files
* future execution PR must not modify tests
* future execution PR must not modify schema files
* future execution PR must not modify validator files
* future execution PR must not modify package files
* future execution PR must not modify CI files
* future execution PR must not modify runtime/API/UI files

## Accepted runner behavior

The future runner must:

* verify repo cleanliness before execution
* verify main SHA is reviewed execution base
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

## Accepted artifact boundary

The future artifact must mark:

* development-only: true
* publication evidence: false
* origin evidence: false
* ownership evidence: false
* model-quality evidence: false
* provider-output correctness evidence: false
* candidate-truth evidence: false

Null remains valid truth.

No winner is crowned.

No evidence promotion is granted.

## Accepted failure classifications

Accepted future runner classifications:

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

A future implementation PR may add exactly:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

A future implementation PR may not change:

* package metadata
* CI
* runtime/API/UI
* schema
* validator
* prompt source
* prompt guard tests

If implementation proves a package script is required, it must stop and define a separate package-metadata lane.

## Future execution boundary

Execution remains blocked until:

1. this runner/provider scope review is merged
2. the runner file is implemented and reviewed
3. a new execution PR runs the reviewed command

This review does not execute replay.

This review does not grant evidence status to any future output.

## Non-execution review

* this review did not execute replay
* this review did not call provider
* this review did not call model
* this review did not use paid OpenAI API
* this review did not use remote endpoint
* this review did not call localhost
* this review did not call Ollama
* this review did not call OpenAI-compatible endpoint
* this review did not use secrets
* this review did not add runtime/API/UI wiring
* this review did not create artifacts
* this review did not create evidence packs
* this review did not publish anything
* this review did not score provider output
* this review did not rank candidates
* this review did not promote evidence

## What this review does not mean

* does not mean replay execution is authorized yet
* does not mean provider execution happened
* does not mean localhost/Ollama remains open
* does not mean model switching is allowed
* does not mean remote endpoints are allowed
* does not mean hosted OpenAI is allowed
* does not mean DeepSeek is allowed
* does not mean provider output is evidence
* does not mean provider output is truth
* does not mean origin evidence exists
* does not mean model-quality evidence exists
* does not mean publication evidence exists
* does not mean execution-safety evidence exists
* does not mean runtime/API/UI wiring is authorized
* does not mean package metadata or CI changes are authorized

## Review conclusion

* exact `limit` replay runner/provider scope accepted
* future runner file path accepted
* future provider scope accepted as local-only
* future output path accepted
* selected word/stage/segmentation accepted
* implementation may proceed next, but execution remains blocked
* no provider call happened in this review
* no replay happened in this review

## Next accepted task

`test(open-instrument): implement exact limit replay execution runner v0.1`
