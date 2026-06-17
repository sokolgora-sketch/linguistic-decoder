# Open Instrument boundary-gated local-provider prompt-response capture implementation v0.1

Status: implementation
Scope: static prompt-response capture contract machinery

## Implementation decision

Implemented with restrictions.

This implementation adds static prompt-response capture contract machinery.

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

This implementation does not create candidate-truth evidence.

This implementation does not create origin evidence.

This implementation does not create model-quality evidence.

This implementation does not create publication evidence.

This implementation does not create execution-safety evidence.

## Implemented from

Design:

* PR #1400
* merge SHA: `92def9c87a5ebe53417af4e8da5b83b40be00ac3`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-prompt-response-capture-lane-design-v0.1.md`

Design review:

* PR #1401
* merge SHA: `84e91cde438b5f0214bb10d1f2d3736ec72e5ada`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-prompt-response-capture-lane-design-review-v0.1.md`

Implementation authorization:

* PR #1402
* merge SHA: `782308f362fa1d468da0db2c77661e971c820055`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-prompt-response-capture-implementation-authorization-v0.1.md`

Boundary assessment:

* PR #1398
* merge SHA: `e574e916b97141c133c42ad79ee90a231429a343`
* document: `docs/open-instrument/open-instrument-next-controlled-local-provider-evidence-boundary-lane-closure-assessment-v0.1.md`

Prior controlled execution response SHA-256:

* `a049322ed9cd37d5aa3916423c2b6c62671a0131685dfd0945ef363ad43cb40f`

## Added files

Schema:

* `docs/open-instrument/schemas/prompt-response-capture/open-instrument-boundary-gated-local-provider-prompt-response-capture-schema-v0.1.json`

Static fixture:

* `docs/open-instrument/fixtures/prompt-response-capture/open-instrument-boundary-gated-local-provider-prompt-response-capture-static-fixture-v0.1.json`

Validation helper:

* `scripts/openInstrumentBoundaryGatedPromptResponseCaptureValidation.v0.1.mjs`

Tests:

* `tests/openInstrument.boundaryGatedPromptResponseCaptureValidation.v0.1.spec.ts`
* `tests/openInstrument.boundaryGatedPromptResponseCaptureIntegrationGate.v0.1.spec.ts`

## Implemented contract posture

The schema records mandatory prompt, request, and response hash fields.

Mandatory hash fields:

* `$.promptIdentity.promptSha256`
* `$.requestIdentity.requestBodySha256`
* `$.responseIdentity.responseSha256`

The static fixture uses empty non-execution sentinel hashes.

The static fixture does not contain a live prompt response.

The static fixture does not represent a provider run.

The static fixture does not represent a model call.

The static fixture does not represent runtime/API/UI wiring.

The static fixture does not represent evidence promotion.

## Granted class

The static fixture grants only:

* `prompt_response_capture_contract_static`

## Candidate-only classes

The static fixture lists these future classes as candidates only:

* `local_smoke_transcript`
* `prompt_response_capture_record`
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

## Default state

The static fixture defaults to:

* `execution_not_authorized`

The static fixture does not activate:

* `execution_authorized_pending_capture`

## Final decision

The static fixture records final capture decision:

* `capture_contract_static_only`

## Helper behavior

The validation helper validates the schema markers and fixture.

The helper fails closed when prompt SHA-256 is missing.

The helper fails closed when request body SHA-256 is missing.

The helper fails closed when response SHA-256 is missing.

The helper fails closed when provider execution authorization is true.

The helper fails closed when model call authorization is true.

The helper fails closed when paid OpenAI API use is true.

The helper fails closed when remote provider endpoint use is true.

The helper fails closed when secrets use is true.

The helper fails closed when runtime/API/UI wiring authorization is true.

The helper fails closed when a blocked evidence class is granted.

The helper fails closed when a blocked evidence class lacks a denial reason.

The helper fails closed when non-execution declarations drift toward execution.

## Boundary posture after implementation

Provider execution remains unauthorized.

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

Candidate-truth evidence remains blocked.

Origin evidence remains blocked.

Model-quality evidence remains blocked.

Publication evidence remains blocked.

Execution-safety evidence remains blocked.

## Review requirement

This implementation requires review before any closure or next execution-adjacent lane.

The review should verify that this is static contract machinery only.

The review should verify that the fixture grants only `prompt_response_capture_contract_static`.

The review should verify that future evidence classes are candidates only.

The review should verify that prompt SHA-256, request body SHA-256, and response SHA-256 are mandatory.

The review should verify that no provider execution, model call, runtime/API/UI wiring, or evidence promotion occurred.

## Next accepted task

`docs(open-instrument): review boundary-gated local-provider prompt-response capture implementation v0.1`
