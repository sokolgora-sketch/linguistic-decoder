# Open Instrument first controlled local-provider execution authorization lane design v0.1

Status: design
Scope: first controlled local-provider execution authorization lane design

## Design decision

The first controlled local-provider execution authorization lane is designed.

This lane is design-only.

This lane does not authorize actual provider execution.

This lane does not authorize a model call.

This lane does not authorize paid OpenAI API use.

This lane does not authorize remote provider endpoints.

This lane does not authorize localhost provider calls.

This lane does not authorize Ollama calls.

This lane does not authorize OpenAI-compatible endpoint calls.

This lane does not authorize secrets.

This lane does not authorize runtime/API/UI wiring.

This lane does not authorize artifact creation.

This lane does not authorize evidence-pack creation.

This lane does not authorize publication framing.

This lane does not authorize provider-output scoring.

This lane does not authorize candidate ranking.

This lane does not authorize evidence promotion.

The purpose of this design is to define the exact future authorization shape for one tightly bounded local-only execution.

The next lane must review this design before any implementation or execution authorization.

## Source chain

First controlled local-provider execution authorization readiness assessment:

* PR #1422
* merge SHA: `b38acb3e1f94ade4aff1a91bc682191278a5b82a`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-authorization-readiness-assessment-v0.1.md`

Controlled local-provider execution authorization lane closure assessment:

* PR #1421
* merge SHA: `7fa4ca1dc67b1ac524912460011f1b5963768487`
* document: `docs/open-instrument/open-instrument-controlled-local-provider-execution-authorization-lane-closure-assessment-v0.1.md`

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

Controlled local-provider execution authorization lane design review:

* PR #1416
* merge SHA: `1c7666ecb44687dfed9ce016dec19c437e8d0675`
* document: `docs/open-instrument/open-instrument-controlled-local-provider-execution-authorization-lane-design-review-v0.1.md`

Controlled local-provider execution authorization lane design:

* PR #1415
* merge SHA: `d3e5ef8ce4aef4deeab3d5e852dcd857758c447d`
* document: `docs/open-instrument/open-instrument-controlled-local-provider-execution-authorization-lane-design-v0.1.md`

Controlled local-provider execution readiness assessment:

* PR #1414
* merge SHA: `d0e38f7a9af7254cf15236c838ed9d0193907ea7`
* document: `docs/open-instrument/open-instrument-controlled-local-provider-execution-readiness-assessment-v0.1.md`

Prior controlled execution response SHA-256:

* `a049322ed9cd37d5aa3916423c2b6c62671a0131685dfd0945ef363ad43cb40f`

## Existing authorization artifacts

Schema:

* `docs/open-instrument/schemas/execution-authorization/open-instrument-controlled-local-provider-execution-authorization-schema-v0.1.json`

Static fixture:

* `docs/open-instrument/fixtures/execution-authorization/open-instrument-controlled-local-provider-execution-authorization-static-fixture-v0.1.json`

Validation helper:

* `scripts/openInstrumentControlledLocalProviderExecutionAuthorizationValidation.v0.1.mjs`

Focused tests:

* `tests/openInstrument.controlledLocalProviderExecutionAuthorizationValidation.v0.1.spec.ts`
* `tests/openInstrument.controlledLocalProviderExecutionAuthorizationIntegrationGate.v0.1.spec.ts`

## Problem being solved

The project is ready to design the first controlled local-provider execution authorization lane.

The project is not ready to execute.

The closed authorization-envelope machinery proves that future execution authorization must be explicit, narrow, local-only, hash-complete, and non-promoting.

The project needs a reviewed design before any later lane can authorize one local-only execution.

This design defines the future one-shot local-only authorization constraints.

This design prevents a drift from readiness into execution.

## Intended achievement

The intended achievement is not provider execution.

The intended achievement is not a model call.

The intended achievement is not provider-output evidence.

The intended achievement is not candidate-truth evidence.

The intended achievement is not origin evidence.

The intended achievement is not model-quality evidence.

The intended achievement is not publication evidence.

The intended achievement is not execution-safety evidence.

The intended achievement is a future reviewed authorization packet that can authorize exactly one local-only execution under strict boundaries.

## Designed future authorization packet

A future first controlled local-provider execution authorization packet must include:

* schema version
* authorization packet id
* source readiness assessment PR
* source readiness assessment merge SHA
* source readiness assessment document path
* source closure assessment PR
* source closure assessment merge SHA
* source closure assessment document path
* execution authorization design PR
* execution authorization design merge SHA
* execution authorization review PR
* execution authorization review merge SHA
* execution authorization implementation PR if applicable
* execution authorization implementation merge SHA if applicable
* operator declaration
* execution environment declaration
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
* paid OpenAI API use flag
* remote provider endpoint use flag
* Ollama use flag
* OpenAI-compatible endpoint use flag
* secrets use flag
* environment variable allowlist
* environment variable denylist
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
* maximum execution count
* maximum request count
* maximum response count
* retry policy
* rerun authorization state
* parser compatibility authorization state
* allowed command class
* forbidden command classes
* evidence class requested
* evidence class granted
* evidence class denied
* denial reasons
* final authorization decision
* non-promotion declaration
* post-execution review requirement

## Designed future authorization states

The future lane may define these states:

* `first_controlled_execution_authorization_design_only`
* `first_controlled_execution_authorization_review_required`
* `first_controlled_execution_authorization_not_granted`
* `first_controlled_execution_authorization_candidate`
* `first_controlled_execution_authorization_granted_one_shot_local_only`
* `first_controlled_execution_authorization_failed_closed`
* `first_controlled_execution_authorization_consumed`
* `first_controlled_execution_authorization_expired`

Default state must be:

* `first_controlled_execution_authorization_not_granted`

In this design lane, the active state remains:

* `first_controlled_execution_authorization_design_only`

This design lane does not activate:

* `first_controlled_execution_authorization_granted_one_shot_local_only`

## Designed one-shot limits

The future authorization packet must default to:

* maximum execution count: `1`
* maximum request count: `1`
* maximum response count: `1`
* maximum retry count: `0`
* maximum rerun count: `0`

Any increase requires separate reviewed authorization.

The future authorization must expire after use.

The future authorization must fail closed if reused.

The future authorization must fail closed if rerun without a new reviewed authorization.

## Required local-only boundary

The future authorization must require a local-only endpoint class.

The future authorization must require local endpoint proof.

The future authorization must forbid remote provider endpoints.

The future authorization must forbid paid OpenAI API use.

The future authorization must forbid secrets.

The future authorization must forbid hidden fallback.

The future authorization must forbid endpoint discovery.

The future authorization must forbid automatic provider selection.

The future authorization must forbid automatic model selection.

The future authorization must forbid hidden retry.

The future authorization must forbid hidden rerun.

The future authorization must define whether Ollama is in scope.

The future authorization must define whether an OpenAI-compatible local endpoint is in scope.

If Ollama is in scope, it must be explicitly local-only.

If an OpenAI-compatible endpoint is in scope, it must be explicitly local-only.

No localhost provider call is authorized by this design.

No Ollama call is authorized by this design.

No OpenAI-compatible endpoint call is authorized by this design.

## Required prompt and request boundary

The future authorization must require a reviewed prompt source.

The future authorization must require deterministic prompt canonicalization.

The future authorization must require prompt SHA-256.

The future authorization must require prompt mutation policy.

The future authorization must require deterministic request body canonicalization.

The future authorization must require request body SHA-256.

The future authorization must require a no-secrets request policy.

The future authorization must require request body preview policy.

The future authorization must require that no untracked prompt mutation occurs.

The future authorization must require that no untracked request body mutation occurs.

## Required response boundary

The future authorization must require deterministic response capture.

The future authorization must require response SHA-256.

The future authorization must require response retention policy.

The future authorization must require response mutation policy.

The future authorization must forbid silent response overwrite.

The future authorization must require post-execution review before evidence-class changes.

The future authorization must not treat the captured response as evidence by default.

## Required fail-closed behavior

The future authorization must fail closed if:

* source readiness assessment is missing
* closure assessment is missing
* authorization design review is missing
* provider family is missing
* provider name is missing
* model family is missing
* model name is missing
* endpoint class is missing
* endpoint class is remote
* local endpoint proof is missing
* paid OpenAI API use is true
* remote provider endpoint use is true
* secrets use is true
* undeclared environment variable is read
* credential variable is read
* endpoint variable is read without declaration
* prompt source path is missing
* prompt source is unreviewed
* prompt SHA-256 is missing
* request body SHA-256 is missing
* response SHA-256 requirement is missing
* maximum execution count is greater than one
* maximum request count is greater than one
* maximum response count is greater than one
* retry count is greater than zero
* rerun count is greater than zero
* hidden provider fallback is allowed
* hidden model fallback is allowed
* endpoint discovery is allowed
* hidden retry is allowed
* hidden rerun is allowed
* runtime/API/UI wiring appears
* artifact creation appears
* evidence-pack creation appears
* provider-output evidence is granted
* parser-compatibility evidence is granted
* reproducibility evidence is granted
* candidate-truth evidence is granted
* origin evidence is granted
* model-quality evidence is granted
* publication evidence is granted
* execution-safety evidence is granted

## Evidence class policy

The future authorization may allow these classes as candidate-only observations:

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

The following evidence classes remain blocked:

* `provider_output_evidence`
* `parser_compatibility_evidence`
* `reproducibility_evidence`
* `candidate_truth_evidence`
* `origin_evidence`
* `model_quality_evidence`
* `publication_evidence`
* `execution_safety_evidence`

## Non-goals

This design does not implement an authorization packet.

This design does not implement a schema.

This design does not implement a fixture.

This design does not implement a helper.

This design does not implement tests.

This design does not run a provider.

This design does not call a model.

This design does not capture a new response.

This design does not promote the prior response.

This design does not create runtime/API/UI behavior.

This design does not create artifacts.

This design does not create evidence packs.

## Review checklist for next lane

The next review lane should verify:

* this lane is design-only
* no provider run occurred
* no model call occurred
* no paid OpenAI API use occurred
* no remote endpoint use occurred
* no localhost provider call occurred
* no Ollama call occurred
* no OpenAI-compatible endpoint call occurred
* no secrets use occurred
* no runtime/API/UI wiring occurred
* local endpoint proof is mandatory in the future design
* provider identity is mandatory in the future design
* model identity is mandatory in the future design
* prompt SHA-256 is mandatory in the future design
* request body SHA-256 is mandatory in the future design
* response SHA-256 is mandatory in the future design
* maximum execution count remains one
* maximum request count remains one
* maximum response count remains one
* retry count remains zero
* rerun count remains zero
* evidence promotion remains blocked
* candidate-only observation classes remain candidates only
* blocked evidence classes remain blocked

## Achievement path

We are now past static authorization-envelope closure.

The next achievement is not execution.

The next achievement is a reviewed design for the first tightly bounded local-only execution authorization.

After this design is reviewed, a later lane may authorize static implementation of the first controlled execution authorization packet.

Actual execution must still wait for a separate reviewed authorization and must remain one-shot, local-only, hash-complete, and non-promoting.

## Next accepted task

`docs(open-instrument): review first controlled local-provider execution authorization lane design v0.1`
