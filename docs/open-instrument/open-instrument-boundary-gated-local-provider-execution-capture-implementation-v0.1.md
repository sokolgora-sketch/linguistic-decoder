# Open Instrument boundary-gated local-provider execution capture implementation v0.1

Status: implementation
Scope: static boundary-gated local-provider execution capture contract machinery

## Implementation decision

Implemented with restrictions.

This implementation adds static local-provider execution capture contract machinery.

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

Execution capture design:

* PR #1407
* merge SHA: `dce2d303830afa828598925c0cd7d33f9e880d1f`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-execution-capture-lane-design-v0.1.md`

Execution capture design review:

* PR #1408
* merge SHA: `2eeef7d120b737bfbfb444804514b3f3625e6de4`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-execution-capture-lane-design-review-v0.1.md`

Execution capture implementation authorization:

* PR #1409
* merge SHA: `9d261b1a9623518281361f9876c6414f50739afc`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-execution-capture-implementation-authorization-v0.1.md`

Prompt-response capture closure assessment:

* PR #1406
* merge SHA: `b2f91943d2e092d48e3ba3dda1a01ee25c9c3493`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-prompt-response-capture-lane-closure-assessment-v0.1.md`

Prior controlled execution response SHA-256:

* `a049322ed9cd37d5aa3916423c2b6c62671a0131685dfd0945ef363ad43cb40f`

## Added files

Schema:

* `docs/open-instrument/schemas/execution-capture/open-instrument-boundary-gated-local-provider-execution-capture-schema-v0.1.json`

Static fixture:

* `docs/open-instrument/fixtures/execution-capture/open-instrument-boundary-gated-local-provider-execution-capture-static-fixture-v0.1.json`

Validation helper:

* `scripts/openInstrumentBoundaryGatedLocalProviderExecutionCaptureValidation.v0.1.mjs`

Tests:

* `tests/openInstrument.boundaryGatedLocalProviderExecutionCaptureValidation.v0.1.spec.ts`
* `tests/openInstrument.boundaryGatedLocalProviderExecutionCaptureIntegrationGate.v0.1.spec.ts`

## Implemented contract posture

The schema records mandatory execution-capture fields.

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

The static fixture requires local endpoint proof for future execution.

## Granted class

The static fixture grants only:

* `local_provider_execution_capture_contract_static`

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

## Default state

The static fixture defaults to:

* `execution_not_authorized`

The static fixture does not activate:

* `execution_authorized_pending_capture`

## Final decision

The static fixture records final execution capture decision:

* `execution_capture_contract_static_only`

## Helper behavior

The validation helper validates the schema markers and fixture.

The helper validates Git merge SHA fields as Git SHAs.

The helper validates prompt SHA-256 as SHA-256.

The helper validates request body SHA-256 as SHA-256.

The helper validates response SHA-256 as SHA-256.

The helper fails closed when prompt SHA-256 is missing.

The helper fails closed when request body SHA-256 is missing.

The helper fails closed when response SHA-256 is missing.

The helper fails closed when actual provider execution authorization is true.

The helper fails closed when local endpoint proof is not required.

The helper fails closed when remote endpoint use is true.

The helper fails closed when network calls appear.

The helper fails closed when runtime/API/UI wiring authorization is true.

The helper fails closed when `execution_authorized_pending_capture` is active.

The helper fails closed when a blocked evidence class is granted.

The helper fails closed when a candidate-only class is granted.

The helper fails closed when a blocked evidence class lacks a denial reason.

The helper fails closed when untracked mutation appears.

The helper fails closed when hidden rerun appears.

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

This implementation requires review before any closure or next execution-adjacent lane.

The review should verify that this is static contract machinery only.

The review should verify that the fixture grants only `local_provider_execution_capture_contract_static`.

The review should verify that future execution capture classes are candidates only.

The review should verify that local endpoint proof is required for future execution.

The review should verify that prompt SHA-256, request body SHA-256, and response SHA-256 are mandatory.

The review should verify that no provider execution, model call, runtime/API/UI wiring, or evidence promotion occurred.

## Next accepted task

`docs(open-instrument): review boundary-gated local-provider execution capture implementation v0.1`
