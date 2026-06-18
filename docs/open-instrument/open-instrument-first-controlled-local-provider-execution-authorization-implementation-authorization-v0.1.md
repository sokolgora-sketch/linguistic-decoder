# Open Instrument first controlled local-provider execution authorization implementation authorization v0.1

Status: authorization
Scope: first controlled local-provider execution authorization static implementation authorization

## Authorization decision

Authorized with restrictions.

Static implementation of the first controlled local-provider execution authorization packet is authorized.

Actual provider execution is not authorized.

A model call is not authorized.

Paid OpenAI API use is not authorized.

Remote provider endpoints are not authorized.

Localhost provider calls are not authorized.

Ollama calls are not authorized.

OpenAI-compatible endpoint calls are not authorized.

Secrets are not authorized.

Runtime/API/UI wiring is not authorized.

Artifact creation is not authorized.

Evidence-pack creation is not authorized.

Publication framing is not authorized.

Provider-output scoring is not authorized.

Candidate ranking is not authorized.

Evidence promotion is not authorized.

This authorization permits static contract implementation only.

## Authorized implementation scope

The next implementation lane may add static first controlled local-provider execution authorization machinery.

Authorized static implementation files may include:

* one implementation document
* one JSON schema for the first controlled local-provider execution authorization packet
* one static fixture for the first controlled local-provider execution authorization packet
* one validation helper for the static fixture
* focused validation tests
* focused integration gate tests

The next implementation lane may not run a provider.

The next implementation lane may not call a model.

The next implementation lane may not use paid OpenAI API.

The next implementation lane may not use remote provider endpoints.

The next implementation lane may not use localhost provider calls.

The next implementation lane may not use Ollama.

The next implementation lane may not use OpenAI-compatible endpoints.

The next implementation lane may not use secrets.

The next implementation lane may not add runtime/API/UI wiring.

The next implementation lane may not create artifacts.

The next implementation lane may not create evidence packs.

The next implementation lane may not promote evidence.

## Source design review

First controlled local-provider execution authorization lane design review:

* PR #1424
* merge SHA: `b1c5d43651242879c23ed32e2b1b91b8880a7d3f`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-authorization-lane-design-review-v0.1.md`

First controlled local-provider execution authorization lane design:

* PR #1423
* merge SHA: `f1c2600b6eace1a28482888760612ec1fffd3eb2`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-authorization-lane-design-v0.1.md`

First controlled local-provider execution authorization readiness assessment:

* PR #1422
* merge SHA: `b38acb3e1f94ade4aff1a91bc682191278a5b82a`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-authorization-readiness-assessment-v0.1.md`

Controlled local-provider execution authorization lane closure assessment:

* PR #1421
* merge SHA: `7fa4ca1dc67b1ac524912460011f1b5963768487`
* document: `docs/open-instrument/open-instrument-controlled-local-provider-execution-authorization-lane-closure-assessment-v0.1.md`

Prior controlled execution response SHA-256:

* `a049322ed9cd37d5aa3916423c2b6c62671a0131685dfd0945ef363ad43cb40f`

## Supporting closed authorization chain

Controlled local-provider execution authorization lane close:

* PR #1420
* merge SHA: `da94f1a5cbe3c0d1dcb08b77ca2053338e1fe391`
* document: `docs/open-instrument/open-instrument-controlled-local-provider-execution-authorization-lane-close-v0.1.md`

Controlled local-provider execution authorization implementation review:

* PR #1419
* merge SHA: `8faf710926b456038772631961376c62affc63fe`
* document: `docs/open-instrument/open-instrument-controlled-local-provider-execution-authorization-implementation-review-v0.1.md`

Controlled local-provider execution authorization implementation:

* PR #1418
* merge SHA: `c60e85aa649832c55aa2a27f098add61c27b3870`
* document: `docs/open-instrument/open-instrument-controlled-local-provider-execution-authorization-implementation-v0.1.md`

Controlled local-provider execution authorization implementation authorization:

* PR #1417
* merge SHA: `38b0a52b612720ecf60e84804834a67d8b456c86`
* document: `docs/open-instrument/open-instrument-controlled-local-provider-execution-authorization-implementation-authorization-v0.1.md`

## Existing closed authorization artifacts

Existing schema:

* `docs/open-instrument/schemas/execution-authorization/open-instrument-controlled-local-provider-execution-authorization-schema-v0.1.json`

Existing static fixture:

* `docs/open-instrument/fixtures/execution-authorization/open-instrument-controlled-local-provider-execution-authorization-static-fixture-v0.1.json`

Existing validation helper:

* `scripts/openInstrumentControlledLocalProviderExecutionAuthorizationValidation.v0.1.mjs`

Existing focused tests:

* `tests/openInstrument.controlledLocalProviderExecutionAuthorizationValidation.v0.1.spec.ts`
* `tests/openInstrument.controlledLocalProviderExecutionAuthorizationIntegrationGate.v0.1.spec.ts`

## Required implementation posture

The implementation must remain static.

The implementation must remain non-executing.

The implementation must be fail-closed.

The implementation must grant no live provider capability.

The implementation must grant no model-call capability.

The implementation must grant no paid OpenAI API capability.

The implementation must grant no remote endpoint capability.

The implementation must grant no localhost provider-call capability.

The implementation must grant no Ollama-call capability.

The implementation must grant no OpenAI-compatible endpoint-call capability.

The implementation must grant no secrets capability.

The implementation must grant no runtime/API/UI wiring capability.

The implementation must grant no artifact creation capability.

The implementation must grant no evidence-pack creation capability.

The implementation must grant no evidence promotion capability.

## Required authorization packet states

The static implementation must encode these states:

* `first_controlled_execution_authorization_design_only`
* `first_controlled_execution_authorization_review_required`
* `first_controlled_execution_authorization_not_granted`
* `first_controlled_execution_authorization_candidate`
* `first_controlled_execution_authorization_granted_one_shot_local_only`
* `first_controlled_execution_authorization_failed_closed`
* `first_controlled_execution_authorization_consumed`
* `first_controlled_execution_authorization_expired`

The required default state is:

* `first_controlled_execution_authorization_not_granted`

The implementation fixture must keep the active state non-executing unless a later reviewed lane explicitly grants otherwise.

This authorization does not activate:

* `first_controlled_execution_authorization_granted_one_shot_local_only`

## Required one-shot limits

The static implementation must encode:

* maximum execution count: `1`
* maximum request count: `1`
* maximum response count: `1`
* maximum retry count: `0`
* maximum rerun count: `0`

The implementation must fail closed if any maximum count is widened.

The implementation must fail closed if retry count is widened.

The implementation must fail closed if rerun count is widened.

## Required identity fields

The static implementation must require:

* provider family
* provider name
* provider version if available
* model family
* model name
* model version if available
* endpoint class
* endpoint URL class
* endpoint identity
* local endpoint proof
* localhost-only declaration

Provider fallback must be forbidden.

Model fallback must be forbidden.

Endpoint discovery must be forbidden.

Automatic provider selection must be forbidden.

Automatic model selection must be forbidden.

## Required API and endpoint prohibitions

The static implementation must require:

* paid OpenAI API use flag set to false
* remote provider endpoint use flag set to false
* secrets use flag set to false

The static implementation must represent localhost provider call authorization as false.

The static implementation must represent Ollama call authorization as false unless a later reviewed lane explicitly grants local-only scope.

The static implementation must represent OpenAI-compatible endpoint call authorization as false unless a later reviewed lane explicitly grants local-only scope.

This implementation authorization does not grant localhost, Ollama, or OpenAI-compatible endpoint calls.

## Required prompt/request/response fields

The static implementation must require:

* prompt source path
* prompt source review status
* prompt canonicalization method
* prompt SHA-256
* prompt length
* prompt mutation policy
* request body canonicalization method
* request body SHA-256
* request body preview policy
* request secrets policy
* response capture method
* response SHA-256 requirement
* response retention policy
* response mutation policy

The implementation must fail closed when prompt SHA-256 is missing.

The implementation must fail closed when request body SHA-256 is missing.

The implementation must fail closed when response SHA-256 requirement is missing.

## Required evidence class policy

The static implementation may include these candidate-only classes:

* `local_smoke_transcript`
* `prompt_response_capture_record`
* `local_provider_execution_capture_record`
* `provider_output_observation_candidate`
* `parser_compatibility_observation_candidate`
* `reproducibility_observation_candidate`

Candidate-only means not granted.

Candidate-only does not mean evidence.

Candidate-only does not mean truth.

Candidate-only does not mean origin.

Candidate-only does not mean model quality.

Candidate-only does not mean publication.

Candidate-only does not mean execution safety.

The static implementation must keep these evidence classes blocked:

* `provider_output_evidence`
* `parser_compatibility_evidence`
* `reproducibility_evidence`
* `candidate_truth_evidence`
* `origin_evidence`
* `model_quality_evidence`
* `publication_evidence`
* `execution_safety_evidence`

## Required helper behavior

The validation helper must pass on the checked-in static fixture.

The validation helper must fail closed on:

* provider execution authorization drift
* model call authorization drift
* paid OpenAI API authorization drift
* remote endpoint authorization drift
* localhost provider call authorization drift
* Ollama call authorization drift
* OpenAI-compatible endpoint authorization drift
* secrets authorization drift
* runtime/API/UI authorization drift
* missing provider family
* missing provider name
* missing model family
* missing model name
* missing endpoint class
* missing endpoint identity
* missing local endpoint proof
* missing prompt SHA-256
* missing request body SHA-256
* missing response SHA-256 requirement
* maximum execution count drift
* maximum request count drift
* maximum response count drift
* retry count drift
* rerun count drift
* active one-shot execution grant drift
* evidence promotion drift
* candidate-only class promotion drift
* post-execution review requirement drift

## Required tests

Focused validation tests must cover:

* checked-in fixture pass
* provider execution authorization drift
* model call authorization drift
* paid OpenAI API authorization drift
* remote endpoint authorization drift
* localhost provider call authorization drift
* Ollama call authorization drift
* OpenAI-compatible endpoint authorization drift
* secrets authorization drift
* missing provider identity
* missing model identity
* missing endpoint identity
* missing local endpoint proof
* missing prompt SHA-256
* missing request body SHA-256
* missing response SHA-256 requirement
* maximum execution count drift
* maximum request count drift
* maximum response count drift
* retry count drift
* rerun count drift
* active one-shot grant drift
* evidence promotion drift
* candidate-only class promotion drift

Focused integration gate tests must verify:

* helper remains static
* helper does not import runtime/API/UI/provider clients
* helper does not import network clients
* helper does not import secrets code
* fixture remains non-executing
* fixture keeps the one-shot grant inactive
* fixture keeps evidence promotion blocked

## Non-authorization statement

This authorization is not provider execution.

This authorization is not a model call.

This authorization is not paid OpenAI API use.

This authorization is not remote endpoint use.

This authorization is not localhost provider use.

This authorization is not Ollama use.

This authorization is not OpenAI-compatible endpoint use.

This authorization is not secrets use.

This authorization is not runtime/API/UI wiring.

This authorization is not artifact creation.

This authorization is not evidence-pack creation.

This authorization is not publication framing.

This authorization is not evidence promotion.

This authorization does not upgrade the prior controlled execution response.

The prior controlled execution response remains local smoke transcript only.

## Authorization conclusion

Static implementation is authorized with restrictions.

Actual execution remains unauthorized.

The next implementation must create static contract machinery only.

The next implementation must not execute a provider or call a model.

## Next accepted task

`docs(open-instrument): implement first controlled local-provider execution authorization v0.1`
