# Open Instrument controlled local-provider execution authorization implementation v0.1

Status: implementation
Scope: static controlled local-provider execution authorization envelope

## Implementation decision

Implemented with restrictions.

This implementation adds static controlled local-provider execution authorization envelope machinery.

This implementation does not authorize actual provider execution.

This implementation does not run a provider.

This implementation does not call a model.

This implementation does not use paid OpenAI API.

This implementation does not use remote provider endpoints.

This implementation does not use secrets.

This implementation does not add runtime/API/UI wiring.

This implementation does not create artifacts.

This implementation does not create evidence packs.

This implementation does not create publication framing.

This implementation does not score provider output.

This implementation does not rank candidates.

This implementation does not create provider-output evidence.

This implementation does not create parser-compatibility evidence.

This implementation does not create reproducibility evidence.

This implementation does not create candidate-truth evidence.

This implementation does not create origin evidence.

This implementation does not create model-quality evidence.

This implementation does not create publication evidence.

This implementation does not create execution-safety evidence.

## Implemented from

Controlled local-provider execution authorization lane design:

* PR #1415
* merge SHA: `d3e5ef8ce4aef4deeab3d5e852dcd857758c447d`
* document: `docs/open-instrument/open-instrument-controlled-local-provider-execution-authorization-lane-design-v0.1.md`

Controlled local-provider execution authorization lane design review:

* PR #1416
* merge SHA: `1c7666ecb44687dfed9ce016dec19c437e8d0675`
* document: `docs/open-instrument/open-instrument-controlled-local-provider-execution-authorization-lane-design-review-v0.1.md`

Controlled local-provider execution authorization implementation authorization:

* PR #1417
* merge SHA: `38b0a52b612720ecf60e84804834a67d8b456c86`
* document: `docs/open-instrument/open-instrument-controlled-local-provider-execution-authorization-implementation-authorization-v0.1.md`

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

## Added files

Schema:

* `docs/open-instrument/schemas/execution-authorization/open-instrument-controlled-local-provider-execution-authorization-schema-v0.1.json`

Static fixture:

* `docs/open-instrument/fixtures/execution-authorization/open-instrument-controlled-local-provider-execution-authorization-static-fixture-v0.1.json`

Validation helper:

* `scripts/openInstrumentControlledLocalProviderExecutionAuthorizationValidation.v0.1.mjs`

Tests:

* `tests/openInstrument.controlledLocalProviderExecutionAuthorizationValidation.v0.1.spec.ts`
* `tests/openInstrument.controlledLocalProviderExecutionAuthorizationIntegrationGate.v0.1.spec.ts`

## Implemented authorization posture

The schema records mandatory authorization-envelope fields.

The fixture represents authorization-envelope readiness only.

The fixture does not authorize execution.

The fixture does not represent a provider run.

The fixture does not represent a model call.

The fixture does not represent runtime/API/UI wiring.

The fixture does not represent evidence promotion.

The fixture records default state:

* `execution_authorization_not_granted`

The fixture does not activate:

* `controlled_local_execution_authorization_granted_static_scope`

The fixture records final authorization decision:

* `execution_authorization_contract_static_only`

## Required future authorization fields

The fixture requires future authorization to include:

* provider identity
* model identity
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
* post-execution review requirement

## Narrow count posture

The fixture keeps maximum execution count at:

* `1`

The fixture keeps maximum request count at:

* `1`

The fixture keeps maximum response count at:

* `1`

Any higher count requires explicit reviewed authorization.

## Granted class

The static fixture grants only:

* `controlled_local_provider_execution_authorization_contract_static`

## Candidate-only classes

The static fixture lists these future classes as candidates only:

* `local_smoke_transcript`
* `prompt_response_capture_record`
* `local_provider_execution_capture_record`
* `provider_output_observation_candidate`
* `parser_compatibility_observation_candidate`
* `reproducibility_observation_candidate`

Candidate-only means not granted.

## Denied evidence classes

The static fixture denies:

* `provider_output_evidence`
* `parser_compatibility_evidence`
* `reproducibility_evidence`
* `candidate_truth_evidence`
* `origin_evidence`
* `model_quality_evidence`
* `publication_evidence`
* `execution_safety_evidence`

## Helper behavior

The validation helper validates the schema markers and fixture.

The helper validates Git merge SHA fields as Git SHAs.

The helper validates the prior controlled response SHA-256 as SHA-256.

The helper fails closed when actual provider execution authorization is true.

The helper fails closed when model call authorization is true.

The helper fails closed when provider identity requirement is missing.

The helper fails closed when model identity requirement is missing.

The helper fails closed when local endpoint proof requirement is missing.

The helper fails closed when remote endpoint permission drifts.

The helper fails closed when paid OpenAI API permission drifts.

The helper fails closed when secrets permission drifts.

The helper fails closed when prompt SHA-256 requirement is missing.

The helper fails closed when request body SHA-256 requirement is missing.

The helper fails closed when response SHA-256 requirement is missing.

The helper fails closed when maximum execution count is greater than one.

The helper fails closed when maximum request count is greater than one.

The helper fails closed when maximum response count is greater than one.

The helper fails closed when `controlled_local_execution_authorization_granted_static_scope` is active.

The helper fails closed when candidate-truth evidence is granted.

The helper fails closed when candidate-only observation classes are granted.

The helper fails closed when post-execution review requirement is missing.

The helper fails closed when non-execution declarations drift toward execution.

## Boundary posture after implementation

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

## Review requirement

This implementation requires review before any closure or execution-adjacent lane.

The review should verify that this is static authorization-envelope machinery only.

The review should verify that no execution was authorized.

The review should verify that the fixture grants only `controlled_local_provider_execution_authorization_contract_static`.

The review should verify that future observation classes are candidate-only.

The review should verify that provider identity, model identity, and local endpoint proof are required.

The review should verify that prompt SHA-256, request body SHA-256, and response SHA-256 are required.

The review should verify that maximum execution, request, and response counts remain one.

The review should verify that no provider execution, model call, runtime/API/UI wiring, or evidence promotion occurred.

## Next accepted task

`docs(open-instrument): review controlled local-provider execution authorization implementation v0.1`
