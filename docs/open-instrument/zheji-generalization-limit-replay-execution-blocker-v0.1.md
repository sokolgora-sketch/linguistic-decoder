# `limit` Generalization Replay Execution Blocker v0.1

Status: LIMIT_GENERALIZATION_REPLAY_EXECUTION_BLOCKED.

Project lane: Open Instrument / ZËRO.

Blocker date: 2026-06-21.

Blocker base:

* Short SHA: `8b593507`
* Full SHA: `8b593507e2c36d5b35bad9c2bd3397ff25c358bb`

Reviewed authorization packet:

* `docs/open-instrument/zheji-generalization-limit-replay-authorization-v0.1.md`

Reviewed authorization review:

* `docs/open-instrument/reviews/zheji-generalization-limit-replay-authorization-review-v0.1.md`

Selected word:

`limit`

Selected stage:

`MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

## Blocker decision

The authorized `limit` replay must not execute yet.

The replay authorization packet is reviewed.

The Isolation Audit prompt hardening is implemented.

The selected word and selected stage are locked.

However, the execution preflight did not establish an exact reviewed replay runner and provider scope.

Therefore the safe action is to block execution and define the exact runner/provider scope before any replay is attempted.

## Preflight result

The execution preflight completed without changing the repository.

The preflight confirmed:

* repo was clean
* main was on the reviewed authorization-review SHA
* `<ISOLATION_AUDIT>` was present
* prompt guard test passed
* passive Zheji validation helper passed
* passive Zheji validation test passed
* `npm run gate:quick` passed
* no replay output was created
* no replay was executed

## Why execution is blocked

Execution is blocked because the preflight did not prove all of these required facts:

* exact runner command
* exact runner file
* exact provider family
* exact provider name
* exact model name
* exact endpoint class
* exact output artifact path
* exact changed-file policy for replay output
* explicit rule for whether the run is provider-backed or fixture-only
* explicit local-only boundary if a local provider is used

The project must not infer these from old smoke docs.

The project must not execute a provider merely because historical local-provider smoke documents exist.

The project must not create a new runner ad hoc inside the execution PR.

## Discovery notes

Discovery found historical local-provider and provider-preflight documents.

Those documents are useful context.

They are not, by themselves, an exact reviewed replay runner for this `limit` generalization replay.

Discovery also found provider-related routes and docs.

Those references are not enough to execute a replay without a reviewed runner packet.

## Required next lane

The next lane must define the exact replay execution runner and provider scope.

That definition must answer:

* Is the `limit` replay provider-backed or fixture-only?
* If provider-backed, what provider family is used?
* If provider-backed, what provider name is used?
* If provider-backed, what model name is used?
* If provider-backed, is the endpoint localhost-only?
* What exact command runs the replay?
* What exact file or route is used?
* What exact artifact path receives output?
* What exact files may change?
* What exact validation runs before execution?
* What exact validation runs after execution?
* What constitutes replay failure?
* What constitutes prompt/model collapse?
* What constitutes a valid null result?

## Execution remains forbidden until runner review

Do not execute the `limit` replay until a future runner/provider-scope definition is reviewed and accepted.

Do not call a provider until provider scope is explicit.

Do not use localhost/Ollama until local-only provider scope is explicit.

Do not use OpenAI, DeepSeek, or any remote endpoint.

Do not modify runtime/API/UI.

Do not modify schema or validator code.

Do not modify package metadata or CI.

## What remains unauthorized

This blocker does not authorize:

* replay execution
* provider execution
* OpenAI execution
* remote endpoint execution
* localhost/Ollama execution
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

## Validation proof required for blocker review

The review of this blocker must run:

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

`docs(open-instrument): define exact limit replay execution runner and provider scope v0.1`
