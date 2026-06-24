# Repaired target-grid rerun authorization after provider JSON response contract hardening v0.1

Date: 2026-06-24

Status: REPAIRED_TARGET_GRID_RERUN_AUTHORIZATION_AFTER_PROVIDER_JSON_RESPONSE_CONTRACT_HARDENING_DEFINED_PENDING_REVIEW.

Authorization definition base:

* Short SHA: `3f77c756`
* Full SHA: `3f77c75638607fce3ec5150933a3afc43830f969`
* Subject: `docs(open-instrument): review provider JSON response contract hardening implementation after all-target non-json invalidation v0.1`

Reviewed implementation base authorized for future execution:

* Short SHA: `eb945b03`
* Full SHA: `eb945b03d02eb93946dd3bd559325fd7536a5d82`
* Subject: `test(open-instrument): implement provider JSON response contract hardening after all-target non-json invalidation v0.1`

Prerequisite implementation review:

* `docs/open-instrument/reviews/zheji-generalization-provider-json-response-contract-hardening-implementation-after-all-target-non-json-invalidation-review-v0.1.md`

Artifact before rerun:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`
* SHA-256: `5ce461b11f2e8d6811b1ef4d607b189c83ab040003e9a93ea927d12a91d3193a`

## Purpose

This document defines fresh rerun authorization conditions after provider JSON response contract hardening.

The previous rerun produced all-target non-JSON invalidation.

The runner has since been hardened so every reviewed target request includes `response_format.type == "json_object"`.

## Authorization state

This document defines authorization conditions only.

This document does not itself authorize execution.

Execution remains blocked until this authorization definition is reviewed and accepted in a separate PR.

Exactly one future controlled local-only execution PR may be authorized after that review.

## Critical audit caveats before execution

The reviewed rerun authorization remains scoped to the exact English target `comic`.

The current single-call replay helper `sourceLanguageForRequest` is not accepted as a general source-language resolver.

That helper currently resolves the reviewed `comic` path to English, which is mechanically safe for this exact rerun.

A clean `comic` rerun must not be cited as proof that source-language anti-tautology generalizes to non-English source targets.

Before any non-English source target, broad replay generalization, or source-language anti-tautology generalization claim, a separate reviewed PR must do one of the following:

* collapse the relevant replay lane to explicit English-only scope, with dead conditional logic removed or documented
* implement real reviewed source-language resolution for non-English source targets

The current normal Jest gate also has a known discovery caveat: files ending in `.test.ts` are not guaranteed by the existing `tests/**/*.spec.ts(x)` convention.

Before broader milestone closure or RootMap/selection-logic trust claims, a separate reviewed PR must either:

* rename the undiscovered `.test.ts` files to `.spec.ts`
* or explicitly document intentional exclusion if any such files are not meant to run in gate

These audit caveats do not authorize code changes in this PR.

These audit caveats do not authorize provider/model execution in this PR.

These audit caveats do not block the exact future one-shot `comic` rerun after separate authorization review, because the target word is English by reviewed scope.

## Authorized execution base

A future execution PR must use this exact reviewed implementation base:

* `eb945b03d02eb93946dd3bd559325fd7536a5d82`

The future execution PR must verify this base before any provider/model call.

The future execution PR must not execute from this documentation commit.

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
  --reviewed-execution-base-sha eb945b03d02eb93946dd3bd559325fd7536a5d82 \
  --provider-family local_only_openai_compatible \
  --provider-name ollama_openai_compat \
  --model llama3.1:8b \
  --endpoint-class localhost_only \
  --base-url http://127.0.0.1:11434/v1 \
  --output docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json
Required pre-execution proof

Before any provider/model call, the future execution PR must prove:

current branch is exactly the authorized execution base
runner source contains PROVIDER_JSON_RESPONSE_CONTRACT_HARDENING_V0_1
runner source contains response_format
runner source contains type: "json_object"
every reviewed target request includes response_format.type == "json_object"
runner source contains NON_JSON_PROVIDER_RESPONSE_CAPTURE_REPAIR_V0_1
runner source contains buildProviderNonJsonInvalidatedTargetResult
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

If the provider returns valid strict JSON objects, the runner must validate them under the existing functional-embryo contract.

If the provider still returns non-JSON message content, the runner must capture affected targets as TARGET_INVALIDATED.

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

docs(open-instrument): review repaired target-grid rerun authorization after provider JSON response contract hardening v0.1
