# Open Instrument boundary-gated local-provider execution capture lane design v0.1

Status: design
Scope: boundary-gated local-provider execution capture design

## Design decision

The boundary-gated local-provider execution capture lane v0.1 is designed.

This lane is design-only.

This lane does not authorize provider execution.

This lane does not run a provider.

This lane does not call a model.

This lane does not use paid OpenAI API.

This lane does not use remote provider endpoints.

This lane does not use secrets.

This lane does not add runtime/API/UI wiring.

This lane does not create artifacts.

This lane does not create evidence packs.

This lane does not create publication framing.

This lane does not score provider output.

This lane does not rank candidates.

This lane does not create candidate-truth evidence.

This lane does not create origin evidence.

This lane does not create model-quality evidence.

This lane does not create publication evidence.

This lane does not create execution-safety evidence.

## Source chain

Prompt-response capture design:

* PR #1400
* merge SHA: `92def9c87a5ebe53417af4e8da5b83b40be00ac3`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-prompt-response-capture-lane-design-v0.1.md`

Prompt-response capture design review:

* PR #1401
* merge SHA: `84e91cde438b5f0214bb10d1f2d3736ec72e5ada`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-prompt-response-capture-lane-design-review-v0.1.md`

Prompt-response capture implementation authorization:

* PR #1402
* merge SHA: `782308f362fa1d468da0db2c77661e971c820055`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-prompt-response-capture-implementation-authorization-v0.1.md`

Prompt-response capture implementation:

* PR #1403
* merge SHA: `a032d2dbc6d930ff4eae7f3a4550fd7256a111b2`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-prompt-response-capture-implementation-v0.1.md`

Prompt-response capture implementation review:

* PR #1404
* merge SHA: `560e6579e0fb1dde2fe3c81230fd97ef696eb4d6`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-prompt-response-capture-implementation-review-v0.1.md`

Prompt-response capture lane closure:

* PR #1405
* merge SHA: `ef6674a3dd1cc3e424f359ba58654d40a64fd6a9`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-prompt-response-capture-lane-close-v0.1.md`

Prompt-response capture lane closure assessment:

* PR #1406
* merge SHA: `b2f91943d2e092d48e3ba3dda1a01ee25c9c3493`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-prompt-response-capture-lane-closure-assessment-v0.1.md`

Prior controlled execution response SHA-256:

* `a049322ed9cd37d5aa3916423c2b6c62671a0131685dfd0945ef363ad43cb40f`

## Required prerequisite artifacts

Prompt-response capture schema:

* `docs/open-instrument/schemas/prompt-response-capture/open-instrument-boundary-gated-local-provider-prompt-response-capture-schema-v0.1.json`

Prompt-response capture static fixture:

* `docs/open-instrument/fixtures/prompt-response-capture/open-instrument-boundary-gated-local-provider-prompt-response-capture-static-fixture-v0.1.json`

Prompt-response capture validation helper:

* `scripts/openInstrumentBoundaryGatedPromptResponseCaptureValidation.v0.1.mjs`

Prompt-response capture tests:

* `tests/openInstrument.boundaryGatedPromptResponseCaptureValidation.v0.1.spec.ts`
* `tests/openInstrument.boundaryGatedPromptResponseCaptureIntegrationGate.v0.1.spec.ts`

## Problem being solved

The project now has static prompt-response capture contract machinery.

That machinery makes prompt SHA-256, request body SHA-256, and response SHA-256 mandatory.

The next risk is execution-capture drift.

Execution-capture drift means a future local-provider run could be performed without a reviewed execution packet, without local-only endpoint proof, or without clear evidence-class denial rules.

This design prevents that by defining what a future execution-capture lane must require before any provider run is attempted.

## Intended achievement

The intended achievement is not execution.

The intended achievement is a design contract for future execution capture.

The design should make the next execution-adjacent lane safer by requiring:

* reviewed authorization before execution
* local-only endpoint proof
* deterministic prompt canonicalization
* deterministic request body canonicalization
* deterministic response capture
* prompt SHA-256
* request body SHA-256
* response SHA-256
* explicit evidence-class request, grant, denial, and final decision
* explicit non-promotion posture

## Future execution capture packet design

A future boundary-gated local-provider execution capture packet should include:

* schema version
* execution capture packet id
* source lane id
* source PR
* source merge SHA
* execution authorization PR
* execution authorization merge SHA
* execution operator declaration
* execution environment class
* provider family
* provider name
* model name
* endpoint type
* endpoint URL class
* local endpoint proof
* network boundary declaration
* paid OpenAI API use flag
* remote provider endpoint use flag
* secrets use flag
* prompt source path
* prompt source status
* prompt canonicalization method
* prompt SHA-256
* prompt length
* request body canonicalization method
* request body SHA-256
* request body preview policy
* execution command class
* execution timestamp policy
* response capture method
* response SHA-256
* response retention policy
* response mutation policy
* rerun policy
* parser compatibility policy
* evidence class requested
* evidence class granted
* evidence class denied
* denial reasons
* final execution capture decision
* non-promotion declaration

## Required execution capture gates

A future execution-capture lane must require these gates before execution:

* execution authorization exists
* execution authorization is reviewed
* execution scope is local-only
* provider identity is explicit
* model identity is explicit
* endpoint class is explicit
* endpoint class is local-only
* local endpoint proof is present
* paid OpenAI API flag is false
* remote provider endpoint flag is false
* secrets flag is false
* prompt source exists
* prompt source is reviewed
* prompt canonicalization is deterministic
* prompt SHA-256 is present
* request body canonicalization is deterministic
* request body SHA-256 is present
* response capture method is deterministic
* response SHA-256 is required after execution
* response retention policy is explicit
* response mutation policy is explicit
* evidence class requested is explicit
* evidence class granted is explicit
* evidence class denied is explicit
* denial reasons are explicit
* final execution capture decision is explicit

## Designed execution states

The future execution capture lane should support these states:

* `design_only`
* `execution_contract_ready`
* `execution_not_authorized`
* `execution_authorized_pending_capture`
* `execution_captured_static_record_only`
* `execution_capture_failed_closed`
* `execution_capture_review_required`
* `execution_capture_reviewed_local_observation_only`

The default state must be:

* `execution_not_authorized`

This design does not activate:

* `execution_authorized_pending_capture`

That state may only become active after a future execution authorization PR exists.

## Evidence class policy

A future execution capture lane may design records for these low-grade classes:

* `local_smoke_transcript`
* `prompt_response_capture_record`
* `local_provider_execution_capture_record`
* `provider_output_observation_candidate`
* `parser_compatibility_observation_candidate`
* `reproducibility_observation_candidate`

The word candidate is intentional.

Candidate means not granted.

The following evidence classes must remain blocked unless a later reviewed lane explicitly authorizes them:

* `provider_output_evidence`
* `parser_compatibility_evidence`
* `reproducibility_evidence`
* `candidate_truth_evidence`
* `origin_evidence`
* `model_quality_evidence`
* `publication_evidence`
* `execution_safety_evidence`

## Fail-closed requirements

The future execution capture lane must fail closed if:

* execution authorization is missing
* execution authorization is not reviewed
* provider identity is missing
* model identity is missing
* endpoint class is missing
* endpoint class is remote
* local endpoint proof is missing
* paid OpenAI API use is true
* remote provider endpoint use is true
* secrets use is true
* prompt SHA-256 is missing
* request body SHA-256 is missing
* response SHA-256 is missing after execution
* prompt mutation is untracked
* request body mutation is untracked
* response mutation is untracked
* retention policy is missing
* hidden rerun is detected
* runtime/API/UI wiring appears
* artifact creation appears without authorization
* evidence-pack creation appears without authorization
* provider-output evidence is granted
* parser-compatibility evidence is granted
* reproducibility evidence is granted
* candidate-truth evidence is granted
* origin evidence is granted
* model-quality evidence is granted
* publication evidence is granted
* execution-safety evidence is granted

## Required relation to prompt-response capture contract

The future execution-capture lane must depend on the prompt-response capture contract from PR #1403.

It must reuse the mandatory hash posture:

* prompt SHA-256
* request body SHA-256
* response SHA-256

It must preserve the fixture rule from the prompt-response capture lane:

* `prompt_response_capture_contract_static` is a static contract grant only

It must not treat the prompt-response capture contract as provider-output evidence.

It must not treat the prompt-response capture contract as parser-compatibility evidence.

It must not treat the prompt-response capture contract as reproducibility evidence.

It must not treat the prompt-response capture contract as truth evidence.

It must not treat the prompt-response capture contract as origin evidence.

## Non-goals

This design does not implement an execution capture schema.

This design does not implement an execution capture fixture.

This design does not implement an execution capture helper.

This design does not implement execution capture tests.

This design does not run a provider.

This design does not call a model.

This design does not capture a new provider response.

This design does not promote the prior controlled execution response.

This design does not change runtime/API/UI behavior.

This design does not create artifacts.

This design does not create evidence packs.

## Review checklist for next lane

The design review should verify:

* the lane is design-only
* no provider execution is authorized
* no model call is authorized
* no paid OpenAI API use is authorized
* no remote provider endpoint is authorized
* no secrets are authorized
* no runtime/API/UI wiring is authorized
* prompt SHA-256 remains mandatory
* request body SHA-256 remains mandatory
* response SHA-256 remains mandatory
* local endpoint proof is required for future execution
* execution authorization is required before future execution
* candidate-truth evidence remains blocked
* origin evidence remains blocked
* model-quality evidence remains blocked
* publication evidence remains blocked
* execution-safety evidence remains blocked
* low-grade execution capture classes are candidate-only unless explicitly reviewed later

## Achievement path

We are on an achievement path.

The prompt-response capture lane created the static capture contract.

This execution-capture design prepares the next achievement: a future reviewed execution-capture boundary that can govern a local provider run without silently promoting evidence.

The project should not run another provider until this execution-capture design is reviewed, authorized, implemented, and reviewed.

## Next accepted task

`docs(open-instrument): review boundary-gated local-provider execution capture lane design v0.1`
