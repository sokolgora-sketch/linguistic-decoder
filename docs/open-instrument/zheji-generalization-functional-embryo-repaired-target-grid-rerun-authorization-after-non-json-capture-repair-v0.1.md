# Functional embryo repaired target-grid rerun authorization after non-JSON capture repair v0.1

Date: 2026-06-24

Status: FUNCTIONAL_EMBRYO_REPAIRED_TARGET_GRID_RERUN_AUTHORIZATION_AFTER_NON_JSON_CAPTURE_REPAIR_DEFINED_PENDING_REVIEW.

Authorization definition base:

* Short SHA: `fd2f899b`
* Full SHA: `fd2f899b55ddcc2dd4d1a6d74c07fb61cc487f9f`
* Subject: `docs(open-instrument): review non-json provider response capture repair implementation for target-grid runner v0.1`

Reviewed implementation base authorized for future execution:

* Short SHA: `6f52bb6b`
* Full SHA: `6f52bb6b1a506ec82d40ce7cfe22c6a15e2286d3`
* Subject: `test(open-instrument): implement non-json provider response capture repair for target-grid runner v0.1`

Prerequisite implementation review:

* `docs/open-instrument/reviews/zheji-generalization-non-json-provider-response-capture-repair-target-grid-runner-implementation-review-v0.1.md`

## Purpose

This document defines a fresh rerun authorization after the non-JSON provider response capture repair was implemented and reviewed.

The prior repaired target-grid rerun authorization was consumed by a controlled local provider attempt that aborted on non-JSON provider output.

A new authorization must be defined and reviewed before any new provider/model call.

## Authorization state

This document defines authorization conditions only.

This document does not itself authorize execution.

Execution remains blocked until this authorization definition is reviewed and accepted in a separate PR.

Exactly one future controlled local-only execution PR may be authorized after that review.

## Authorized execution base

A future execution PR must use this exact reviewed implementation base:

* `6f52bb6b1a506ec82d40ce7cfe22c6a15e2286d3`

The execution PR must verify the base before any provider/model call.

The execution PR must not execute from this documentation commit.

## Provider identity

A future execution PR must use exactly this provider identity:

* providerFamily: `local_only_openai_compatible`
* providerName: `ollama_openai_compat`
* model: `llama3.1:8b`
* endpointClass: `localhost_only`
* baseUrl: `http://127.0.0.1:11434/v1`

No API key is allowed.

No Authorization header is allowed.

No Bearer token is allowed.

No remote hosted endpoint is allowed.

No DeepSeek endpoint is allowed.

No OpenAI hosted endpoint is allowed.

## Execution command shape for future review

A future reviewed execution PR may use this command shape only after this authorization is reviewed:

```bash
node scripts/openInstrumentLayer2TargetGridExecutionRunner.v0.1.mjs \
  --execute-reviewed-layer2-target-grid \
  --reviewed-execution-base-sha 6f52bb6b1a506ec82d40ce7cfe22c6a15e2286d3 \
  --provider-family local_only_openai_compatible \
  --provider-name ollama_openai_compat \
  --model llama3.1:8b \
  --endpoint-class localhost_only \
  --base-url http://127.0.0.1:11434/v1 \
  --output docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json
Required pre-execution proof

Before any provider/model call, the future execution PR must prove:

current branch is exactly the authorized execution base
runner source contains NON_JSON_PROVIDER_RESPONSE_CAPTURE_REPAIR_V0_1
runner source contains buildProviderNonJsonInvalidatedTargetResult
runner source contains PROVIDER_MESSAGE_CONTENT_JSON_OBJECT_ERROR
runner source contains TARGET_INVALIDATED
runner source has no retry surface
runner self-check passes with --self-check
actual Layer 2 requestBody prompt proof still passes
prompt-delivery attestation regression test passes
Layer 2 runner test passes
Layer 2 scaffold test passes
local-only provider identity matches exactly
target artifact path matches exactly
Expected artifact behavior

The future execution PR must write only:

docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json

If the provider returns non-JSON message content for one or more targets, the runner must capture those targets as TARGET_INVALIDATED.

The artifact must still be written when deterministic artifact construction remains possible.

Non-JSON provider output must not become a candidate.

Non-JSON provider output must not become null-accepted.

Automatic retry remains blocked.

Allowed future execution PR scope

Allowed:

exactly one provider/model execution
exactly one artifact mutation
post-execution validation
PR merge of the artifact only if checks pass

Not allowed:

runner code changes
test changes
schema changes
package changes
CI changes
UI/runtime/API changes
evidence promotion
publication framing
origin evidence claim
candidate-truth evidence claim
winner-crowning
Claim boundary

This authorization is development-only.

It does not prove origin.

It does not prove functional motivation.

It does not prove any candidate true.

It does not crown a winner.

It does not create publication evidence.

It does not promote evidence.

It only defines the conditions under which a future reviewed local-only rerun may be executed.

Current PR scope

This PR is docs-only.

This PR does not:

execute a replay
call a provider
call a model
mutate an artifact
change runner code
change tests
change schema
change package files
change CI
promote evidence
frame results for publication
Next accepted task

docs(open-instrument): review functional embryo repaired target-grid rerun authorization after non-json capture repair v0.1
