# Exact `limit` Replay Execution Runner v0.1 — Review

Status: LIMIT_REPLAY_EXECUTION_RUNNER_IMPLEMENTATION_REVIEWED_ACCEPTED.

Scope: docs-only review of exact `limit` replay execution runner implementation.

Review date: 2026-06-21.

Reviewed base:

* Short SHA: `2a5a9830`
* Full SHA: `2a5a98305efb5ccda8d8947cf0f759e287c4c762`

Reviewed implementation subject:

* `test(open-instrument): implement exact limit replay execution runner v0.1`

Reviewed implementation files from HEAD:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

## Review decision

The exact `limit` replay execution runner implementation is accepted.

Future runner file accepted:

`scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

Future output file accepted:

`docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json`

Selected word accepted:

`limit`

Selected stage accepted:

`MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

Selected segmentation accepted:

`LI + MIT`

Local-only provider family accepted:

`local_only_openai_compatible`

Provider name accepted:

`ollama_openai_compat`

Model accepted:

`llama3.1:8b`

Endpoint class accepted:

`localhost_only`

Base URL accepted:

`http://127.0.0.1:11434/v1`

Dummy API key value accepted:

`ollama`

The implementation review accepts the runner as ready for a separate future execution PR.

Execution remains blocked until a separate execution PR runs the reviewed command.

This review is docs-only.

This review does not execute replay.

This review does not call provider.

This review does not call localhost or Ollama.

This review does not call an OpenAI-compatible endpoint.

This review does not authorize runtime/API/UI changes.

This review does not authorize schema or validator changes.

This review does not authorize package metadata or CI changes.

This review does not grant evidence status.

## Reviewed source chain

Second-word selection under mixed Heart extraction semantics:

* PR #1492
* main SHA: `2554684d70681262da3be5f0c70e811a0b61e2e5`
* doc: `docs/open-instrument/zheji-generalization-second-word-selection-mixed-heart-extraction-v0.1.md`

Second-word selection review:

* PR #1493
* main SHA: `1500d6c2c56bf2b38735751e6316fe4a5412d2f7`
* doc: `docs/open-instrument/reviews/zheji-generalization-second-word-selection-mixed-heart-extraction-review-v0.1.md`

Isolation Audit prompt hardening definition:

* PR #1494
* main SHA: `49a8e66b0efaac597536b530c8e52b00a4614902`
* doc: `docs/open-instrument/zheji-generalization-isolation-audit-prompt-hardening-limit-v0.1.md`

Isolation Audit prompt hardening review:

* PR #1495
* main SHA: `f1fa3b82e64d5d53a564ef06ed6b3bef099972a0`
* doc: `docs/open-instrument/reviews/zheji-generalization-isolation-audit-prompt-hardening-limit-review-v0.1.md`

Isolation Audit prompt hardening implementation:

* PR #1496
* main SHA: `44ea4ffc6c4b4851c9687d637d514340503a3bdf`
* files:
  * `src/shared/openInstrument/brainCandidateSearchPrompt.v0.1.ts`
  * `tests/openInstrument.brainCandidateSearchPrompt.isolationAudit.guard.v0.1.spec.ts`

Isolation Audit prompt hardening implementation review:

* PR #1497
* main SHA: `4c26f73a750cad2c141f03d54511474f8766b65f`
* doc: `docs/open-instrument/reviews/zheji-generalization-isolation-audit-prompt-hardening-implementation-limit-review-v0.1.md`

Limit replay authorization:

* PR #1498
* main SHA: `76d2251ac7af683a38cb6103e16c81185faeaea2`
* doc: `docs/open-instrument/zheji-generalization-limit-replay-authorization-v0.1.md`

Limit replay authorization review:

* PR #1499
* main SHA: `8b593507e2c36d5b35bad9c2bd3397ff25c358bb`
* doc: `docs/open-instrument/reviews/zheji-generalization-limit-replay-authorization-review-v0.1.md`

Limit replay blocker:

* PR #1500
* main SHA: `79e5f861867f276bcb29b36305bffb60cec7a61d`
* doc: `docs/open-instrument/zheji-generalization-limit-replay-execution-blocker-v0.1.md`

Exact limit replay runner/provider scope definition:

* PR #1501
* main SHA: `14f56269381c2ed9045ba4202d02f6c5e652f463`
* doc: `docs/open-instrument/zheji-generalization-limit-replay-runner-provider-scope-v0.1.md`

Exact limit replay runner/provider scope review:

* doc: `docs/open-instrument/reviews/zheji-generalization-limit-replay-runner-provider-scope-review-v0.1.md`

Exact limit replay runner implementation:

* main SHA: `2a5a98305efb5ccda8d8947cf0f759e287c4c762`
* file: `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

## Implementation review

The implementation includes the exact runner file:

`scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

The runner implementation is accepted because it is scoped to the reviewed `limit` replay packet and preserves the fixed runner/provider scope.

The review inspected the runner source without executing it.

The review used `node --check` only for syntax validation.

The review did not call the provider.

The review did not call localhost.

The review did not call Ollama.

The review did not execute the replay.

## Accepted runner scope

Future runner file:

`scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

Future output file:

`docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json`

Future reviewed command:

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

The future execution PR must use this reviewed command shape.

Any deviation must fail closed.

## Accepted provider scope

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

The API key value is a local dummy value only.

Remote endpoints remain out of scope.

OpenAI hosted execution remains out of scope.

DeepSeek execution remains out of scope.

Provider fallback remains out of scope.

Automatic provider selection remains out of scope.

Provider default mutation remains out of scope.

## Accepted local-only boundary

The runner must reject:

* non-localhost base URLs
* missing provider name
* missing model name
* missing endpoint class
* provider fallback
* remote endpoint use
* OpenAI hosted endpoint use
* DeepSeek endpoint use
* any API key value other than the reviewed local dummy value

This review confirms the local-only boundary remains required.

## Accepted output scope

Output directory:

`docs/open-instrument/artifacts/zheji-generalization`

Output file:

`docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json`

The future execution PR may create only the declared output file.

The future execution PR must not modify source files.

The future execution PR must not modify tests.

The future execution PR must not modify schema files.

The future execution PR must not modify validator files.

The future execution PR must not modify package files.

The future execution PR must not modify CI files.

The future execution PR must not modify runtime/API/UI files.

## Accepted runner behavior

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

## Future execution boundary

Execution remains blocked until a separate execution PR runs the reviewed command.

This review does not execute replay.

This review does not grant evidence status to any future output.

The next execution PR must stop if the local provider is unavailable.

The next execution PR must stop if prechecks fail.

The next execution PR must not alter the runner before execution.

## Non-execution review

This review did not execute replay.

This review did not call provider.

This review did not call model.

This review did not use paid OpenAI API.

This review did not use a remote endpoint.

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

## What this review does not mean

This review does not mean provider output is evidence.

This review does not mean provider output is truth.

This review does not mean origin evidence exists.

This review does not mean model-quality evidence exists.

This review does not mean publication evidence exists.

This review does not mean execution-safety evidence exists.

This review does not mean runtime/API/UI wiring is authorized.

This review does not mean package metadata or CI changes are authorized.

This review does not mean remote endpoints are allowed.

This review does not mean hosted OpenAI is allowed.

This review does not mean DeepSeek is allowed.

This review does not mean provider fallback is allowed.

## Review conclusion

The exact `limit` replay execution runner implementation is accepted.

The runner file path is accepted.

The local-only provider scope remains accepted.

The output artifact path remains accepted.

The selected word, stage, and segmentation remain accepted.

A separate execution PR may proceed next using the reviewed command.

No provider call happened in this review.

No replay happened in this review.

## Validation proof

The review ran:

* `node --check scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`
* `npm test -- tests/openInstrument.brainCandidateSearchPrompt.isolationAudit.guard.v0.1.spec.ts --runInBand`
* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`
* dedicated limit replay tests if discovered
* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

All passed before merge.

## Current next task

`test(open-instrument): execute reviewed limit generalization replay v0.1`
