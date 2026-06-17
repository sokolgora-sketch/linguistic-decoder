# Open Instrument controlled local-provider execution authorization implementation authorization v0.1

Status: authorization
Scope: controlled local-provider execution authorization implementation authorization

## Authorization decision

Authorized with restrictions.

Static implementation of the controlled local-provider execution authorization envelope is authorized.

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

Provider-output evidence is not authorized.

Parser-compatibility evidence is not authorized.

Reproducibility evidence is not authorized.

Candidate-truth evidence is not authorized.

Origin evidence is not authorized.

Model-quality evidence is not authorized.

Publication evidence is not authorized.

Execution-safety evidence is not authorized.

## Authorized source chain

Controlled local-provider execution authorization lane design:

* PR #1415
* merge SHA: `d3e5ef8ce4aef4deeab3d5e852dcd857758c447d`
* document: `docs/open-instrument/open-instrument-controlled-local-provider-execution-authorization-lane-design-v0.1.md`

Controlled local-provider execution authorization lane design review:

* PR #1416
* merge SHA: `1c7666ecb44687dfed9ce016dec19c437e8d0675`
* document: `docs/open-instrument/open-instrument-controlled-local-provider-execution-authorization-lane-design-review-v0.1.md`

Controlled local-provider execution readiness assessment:

* PR #1414
* merge SHA: `d0e38f7a9af7254cf15236c838ed9d0193907ea7`
* document: `docs/open-instrument/open-instrument-controlled-local-provider-execution-readiness-assessment-v0.1.md`

Prompt-response capture closure assessment:

* PR #1406
* merge SHA: `b2f91943d2e092d48e3ba3dda1a01ee25c9c3493`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-prompt-response-capture-lane-closure-assessment-v0.1.md`

Execution capture closure assessment:

* PR #1413
* merge SHA: `d2efd37edc0e7c1da052c407a23c40a3b369f2e8`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-execution-capture-lane-closure-assessment-v0.1.md`

Prior controlled execution response SHA-256:

* `a049322ed9cd37d5aa3916423c2b6c62671a0131685dfd0945ef363ad43cb40f`

## Authorized implementation scope

The next implementation may add static contract machinery for the controlled local-provider execution authorization envelope.

Authorized additions:

* one implementation document
* one static schema for controlled execution authorization packets
* one static fixture representing non-executing authorization-envelope readiness
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

The implementation must not promote evidence.

## Required relation to existing contracts

The implementation must depend on the prompt-response capture closure assessment from PR #1406.

The implementation must depend on the execution capture closure assessment from PR #1413.

The implementation must depend on the readiness assessment from PR #1414.

The implementation must depend on the controlled local-provider execution authorization design review from PR #1416.

The implementation must preserve mandatory hash requirements:

* prompt SHA-256
* request body SHA-256
* response SHA-256

The implementation must preserve mandatory identity requirements:

* provider identity
* model identity
* local endpoint proof

The implementation must preserve non-promotion posture.

## Required schema posture

The future schema must require:

* schema version
* authorization packet id
* source readiness assessment PR
* source readiness assessment merge SHA
* prompt-response capture closure assessment PR
* prompt-response capture closure assessment merge SHA
* execution capture closure assessment PR
* execution capture closure assessment merge SHA
* design review PR
* design review merge SHA
* provider family
* provider name
* model name
* provider version policy
* endpoint class
* endpoint URL class
* local endpoint proof
* local-only network declaration
* paid OpenAI API use flag
* remote provider endpoint use flag
* secrets use flag
* operator declaration
* execution environment declaration
* prompt source path
* prompt source review status
* prompt canonicalization method
* prompt SHA-256 requirement
* request body canonicalization method
* request body SHA-256 requirement
* response capture method
* response SHA-256 requirement
* response retention policy
* response mutation policy
* rerun policy
* parser compatibility policy
* maximum execution count
* maximum request count
* maximum response count
* allowed command class
* forbidden command classes
* evidence class requested
* evidence class granted
* evidence class denied
* denial reasons
* final authorization decision
* non-promotion declaration
* post-execution review requirement
* non-execution declaration for static fixtures

## Required default state

The future implementation must default to:

* `execution_authorization_not_granted`

Allowed static states:

* `authorization_design_only`
* `execution_authorization_not_granted`
* `execution_authorization_review_required`
* `controlled_local_execution_authorization_candidate`
* `controlled_local_execution_authorization_failed_closed`

The implementation may define but must not activate:

* `controlled_local_execution_authorization_granted_static_scope`

That state may only become active in a later reviewed authorization lane.

This implementation authorization does not grant that state.

## Required fixture posture

The future fixture must be static.

The future fixture must represent authorization-envelope readiness, not execution authorization.

The future fixture must not grant provider execution.

The future fixture must not represent a provider run.

The future fixture must not represent a model call.

The future fixture must not contain a live provider response.

The future fixture must not contain secrets.

The future fixture must not contain remote endpoint URLs.

The future fixture must require provider identity as a future authorization field.

The future fixture must require model identity as a future authorization field.

The future fixture must require local endpoint proof as a future authorization field.

The future fixture must require prompt SHA-256.

The future fixture must require request body SHA-256.

The future fixture must require response SHA-256.

The future fixture must keep maximum execution count at one unless explicitly reviewed.

The future fixture must keep maximum request count at one unless explicitly reviewed.

The future fixture must keep maximum response count at one unless explicitly reviewed.

## Required evidence posture

The fixture may grant only a static contract class such as:

* `controlled_local_provider_execution_authorization_contract_static`

The fixture may list these future classes as candidates only:

* `local_smoke_transcript`
* `prompt_response_capture_record`
* `local_provider_execution_capture_record`
* `provider_output_observation_candidate`
* `parser_compatibility_observation_candidate`
* `reproducibility_observation_candidate`

Candidate-only means not granted.

The fixture must deny:

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

* readiness assessment is missing
* prompt-response capture closure assessment is missing
* execution capture closure assessment is missing
* design review is missing
* provider identity requirement is missing
* model identity requirement is missing
* local endpoint proof requirement is missing
* endpoint class is remote
* paid OpenAI API use is true
* remote provider endpoint use is true
* secrets use is true
* prompt source review status is missing
* prompt SHA-256 is not required
* request body SHA-256 is not required
* response SHA-256 is not required
* maximum execution count is missing
* maximum execution count is greater than one
* maximum request count is missing
* maximum request count is greater than one
* maximum response count is missing
* maximum response count is greater than one
* hidden rerun is allowed
* untracked mutation is allowed
* runtime/API/UI wiring appears
* artifact creation appears without explicit authorization
* evidence-pack creation appears without explicit authorization
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

## Boundary posture after authorization

Actual provider execution remains unauthorized.

Model calls remain unauthorized.

Paid OpenAI API use remains unauthorized.

Remote provider endpoints remain unauthorized.

Secrets remain unauthorized.

Runtime/API/UI wiring remains unauthorized.

Artifact creation remains unauthorized.

Evidence-pack creation remains unauthorized.

Publication framing remains unauthorized.

Provider-output scoring remains unauthorized.

Candidate ranking remains unauthorized.

Provider-output evidence remains blocked.

Parser-compatibility evidence remains blocked.

Reproducibility evidence remains blocked.

Candidate-truth evidence remains blocked.

Origin evidence remains blocked.

Model-quality evidence remains blocked.

Publication evidence remains blocked.

Execution-safety evidence remains blocked.

The prior controlled execution response remains local smoke transcript only.

## Authorization conclusion

Static implementation of the controlled local-provider execution authorization envelope is authorized.

Actual controlled local-provider execution is not authorized.

The next implementation may create schema, fixture, helper, tests, and documentation only.

## Next accepted task

`docs(open-instrument): implement controlled local-provider execution authorization v0.1`
