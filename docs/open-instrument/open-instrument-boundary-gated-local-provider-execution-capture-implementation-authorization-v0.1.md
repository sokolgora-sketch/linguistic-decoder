# Open Instrument boundary-gated local-provider execution capture implementation authorization v0.1

Status: authorization
Scope: boundary-gated local-provider execution capture implementation authorization

## Authorization decision

Authorized with restrictions.

Static execution-capture contract implementation is authorized.

Actual provider execution is not authorized.

A model call is not authorized.

Paid OpenAI API use is not authorized.

Remote provider endpoint use is not authorized.

Secrets use is not authorized.

Runtime/API/UI wiring is not authorized.

Artifact creation is not authorized.

Evidence-pack creation is not authorized.

Publication framing is not authorized.

Provider-output scoring is not authorized.

Candidate ranking is not authorized.

Candidate-truth evidence is not authorized.

Origin evidence is not authorized.

Model-quality evidence is not authorized.

Publication evidence is not authorized.

Execution-safety evidence is not authorized.

## Authorized source chain

Execution capture design:

* PR #1407
* merge SHA: `dce2d303830afa828598925c0cd7d33f9e880d1f`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-execution-capture-lane-design-v0.1.md`

Execution capture design review:

* PR #1408
* merge SHA: `2eeef7d120b737bfbfb444804514b3f3625e6de4`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-execution-capture-lane-design-review-v0.1.md`

Prompt-response capture closure assessment:

* PR #1406
* merge SHA: `b2f91943d2e092d48e3ba3dda1a01ee25c9c3493`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-prompt-response-capture-lane-closure-assessment-v0.1.md`

Prior controlled execution response SHA-256:

* `a049322ed9cd37d5aa3916423c2b6c62671a0131685dfd0945ef363ad43cb40f`

## Authorized implementation scope

The next implementation may add static contract machinery for boundary-gated local-provider execution capture.

Authorized additions:

* one implementation document
* one static schema for execution capture records
* one static fixture representing a non-executing execution-capture contract record
* one deterministic validation helper
* focused validation tests
* focused integration gate tests
* package scripts only if needed to expose the new validation helper

The implementation must remain deterministic.

The implementation must remain static.

The implementation must not contact any provider.

The implementation must not call any model.

The implementation must not make network calls.

The implementation must not use paid OpenAI API.

The implementation must not use remote provider endpoints.

The implementation must not read, write, print, or require secrets.

The implementation must not add runtime/API/UI wiring.

The implementation must not mutate the prior controlled execution transcript.

The implementation must not create a new provider response.

The implementation must not create artifacts.

The implementation must not create evidence packs.

## Required relation to prompt-response capture contract

The implementation must depend on the prompt-response capture contract from PR #1406.

The implementation must preserve these mandatory hash requirements:

* prompt SHA-256
* request body SHA-256
* response SHA-256

The implementation must not treat `prompt_response_capture_contract_static` as provider-output evidence.

The implementation must not treat `prompt_response_capture_contract_static` as parser-compatibility evidence.

The implementation must not treat `prompt_response_capture_contract_static` as reproducibility evidence.

The implementation must not treat `prompt_response_capture_contract_static` as candidate-truth evidence.

The implementation must not treat `prompt_response_capture_contract_static` as origin evidence.

The implementation must not treat `prompt_response_capture_contract_static` as model-quality evidence.

The implementation must not treat `prompt_response_capture_contract_static` as publication evidence.

The implementation must not treat `prompt_response_capture_contract_static` as execution-safety evidence.

## Required schema posture

The future schema must require:

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
* non-execution declaration for static fixtures

## Required fixture posture

The future fixture must be static.

The future fixture must represent contract readiness, not execution.

The future fixture must not represent a provider run.

The future fixture must not represent a model call.

The future fixture must not contain a live prompt response.

The future fixture must not contain secrets.

The future fixture must not contain remote endpoint URLs.

The future fixture must not grant provider-output evidence.

The future fixture must not grant parser-compatibility evidence.

The future fixture must not grant reproducibility evidence.

The future fixture must not grant candidate-truth evidence.

The future fixture must not grant origin evidence.

The future fixture must not grant model-quality evidence.

The future fixture must not grant publication evidence.

The future fixture must not grant execution-safety evidence.

The fixture may grant only a contract-level static class such as:

* `local_provider_execution_capture_contract_static`

The fixture may list these future classes as candidates only:

* `local_smoke_transcript`
* `prompt_response_capture_record`
* `local_provider_execution_capture_record`
* `provider_output_observation_candidate`
* `parser_compatibility_observation_candidate`
* `reproducibility_observation_candidate`

Candidate-only means not granted.

## Required default state

The implementation must default to:

* `execution_not_authorized`

Allowed static states:

* `design_only`
* `execution_contract_ready`
* `execution_not_authorized`
* `execution_captured_static_record_only`
* `execution_capture_failed_closed`
* `execution_capture_review_required`

This authorization does not allow active state:

* `execution_authorized_pending_capture`

That state may be designed but must remain inactive unless a later provider-execution authorization PR exists.

## Required blocked evidence classes

The implementation must keep these blocked:

* `provider_output_evidence`
* `parser_compatibility_evidence`
* `reproducibility_evidence`
* `candidate_truth_evidence`
* `origin_evidence`
* `model_quality_evidence`
* `publication_evidence`
* `execution_safety_evidence`

## Required validation posture

The future helper must fail closed when:

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
* response SHA-256 is missing
* prompt mutation is untracked
* request body mutation is untracked
* response mutation is untracked
* retention policy is missing
* hidden rerun appears
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

## Non-goals

Do not run a provider.

Do not call a model.

Do not use paid OpenAI API.

Do not use remote provider endpoints.

Do not use secrets.

Do not add runtime/API/UI wiring.

Do not create a new provider response.

Do not promote the prior response.

Do not create artifacts.

Do not create evidence packs.

Do not create publication framing.

Do not score provider output.

Do not rank candidates.

## Authorization conclusion

The boundary-gated local-provider execution capture implementation is authorized only as static contract machinery.

This authorization prepares implementation of execution-capture schema, fixture, helper, tests, and documentation.

This authorization does not authorize actual provider execution.

This authorization does not authorize any model call.

## Next accepted task

`docs(open-instrument): implement boundary-gated local-provider execution capture v0.1`
