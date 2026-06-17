# Open Instrument controlled local-provider execution authorization lane design v0.1

Status: design
Scope: controlled local-provider execution authorization lane design

## Design decision

The controlled local-provider execution authorization lane is designed.

This lane is design-only.

This lane does not authorize actual provider execution.

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

This lane does not create provider-output evidence.

This lane does not create parser-compatibility evidence.

This lane does not create reproducibility evidence.

This lane does not create candidate-truth evidence.

This lane does not create origin evidence.

This lane does not create model-quality evidence.

This lane does not create publication evidence.

This lane does not create execution-safety evidence.

## Readiness source

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

## Existing contract inputs

Prompt-response capture contract artifacts:

* `docs/open-instrument/schemas/prompt-response-capture/open-instrument-boundary-gated-local-provider-prompt-response-capture-schema-v0.1.json`
* `docs/open-instrument/fixtures/prompt-response-capture/open-instrument-boundary-gated-local-provider-prompt-response-capture-static-fixture-v0.1.json`
* `scripts/openInstrumentBoundaryGatedPromptResponseCaptureValidation.v0.1.mjs`
* `tests/openInstrument.boundaryGatedPromptResponseCaptureValidation.v0.1.spec.ts`
* `tests/openInstrument.boundaryGatedPromptResponseCaptureIntegrationGate.v0.1.spec.ts`

Execution capture contract artifacts:

* `docs/open-instrument/schemas/execution-capture/open-instrument-boundary-gated-local-provider-execution-capture-schema-v0.1.json`
* `docs/open-instrument/fixtures/execution-capture/open-instrument-boundary-gated-local-provider-execution-capture-static-fixture-v0.1.json`
* `scripts/openInstrumentBoundaryGatedLocalProviderExecutionCaptureValidation.v0.1.mjs`
* `tests/openInstrument.boundaryGatedLocalProviderExecutionCaptureValidation.v0.1.spec.ts`
* `tests/openInstrument.boundaryGatedLocalProviderExecutionCaptureIntegrationGate.v0.1.spec.ts`

## Problem being solved

The project is ready to design controlled local-provider execution authorization.

The project is not ready to execute.

The problem is authorization drift.

Authorization drift means a future lane could accidentally move from readiness into execution without a reviewed authorization envelope.

This design prevents authorization drift by defining the exact contents of a future controlled local-provider execution authorization lane before that lane exists.

## Authorization design objective

The objective is to design the authorization envelope.

The objective is not execution.

The future authorization envelope should decide whether a narrowly scoped local-provider run may be authorized.

The future authorization envelope must be explicit about what is authorized and what remains blocked.

The future authorization envelope must still keep evidence promotion blocked unless a separate reviewed lane grants it.

## Designed authorization states

The future authorization lane should support these states:

* `authorization_design_only`
* `execution_authorization_not_granted`
* `execution_authorization_review_required`
* `controlled_local_execution_authorization_candidate`
* `controlled_local_execution_authorization_granted_static_scope`
* `controlled_local_execution_authorization_failed_closed`

The default state must be:

* `execution_authorization_not_granted`

This design does not activate:

* `controlled_local_execution_authorization_granted_static_scope`

That state may only become active in a later reviewed authorization lane.

## Minimum authorization envelope

A future controlled local-provider execution authorization must include:

* authorization packet id
* source readiness assessment PR
* source readiness assessment merge SHA
* prompt-response capture closure assessment PR
* prompt-response capture closure assessment merge SHA
* execution capture closure assessment PR
* execution capture closure assessment merge SHA
* provider family
* provider name
* model name
* provider version if available
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
* explicit evidence class requested
* explicit evidence class granted
* explicit evidence class denied
* denial reasons
* final authorization decision
* non-promotion declaration
* post-execution review requirement

## Provider and model constraints

A future authorization must require provider identity.

A future authorization must require model identity.

A future authorization must require a local-only endpoint.

A future authorization must require local endpoint proof.

A future authorization must forbid paid OpenAI API use.

A future authorization must forbid remote provider endpoint use.

A future authorization must forbid secrets use.

A future authorization must forbid hidden provider fallback.

A future authorization must forbid automatic retries unless explicitly authorized.

A future authorization must forbid hidden reruns.

## Prompt and request constraints

A future authorization must require a reviewed prompt source.

A future authorization must require deterministic prompt canonicalization.

A future authorization must require prompt SHA-256 before execution.

A future authorization must require deterministic request body canonicalization.

A future authorization must require request body SHA-256 before execution.

A future authorization must require a no-secrets request body policy.

A future authorization must require a stable request preview policy.

A future authorization must forbid untracked prompt mutation.

A future authorization must forbid untracked request body mutation.

## Response and retention constraints

A future authorization must require deterministic response capture.

A future authorization must require response SHA-256 after execution.

A future authorization must require response retention policy.

A future authorization must require response mutation policy.

A future authorization must forbid untracked response mutation.

A future authorization must forbid silent response overwrite.

A future authorization must require post-execution review before any evidence class can change.

## Execution-count constraints

A future authorization must be narrow.

A future authorization should allow at most one controlled execution unless a reviewed authorization says otherwise.

A future authorization should allow at most one request unless a reviewed authorization says otherwise.

A future authorization should allow at most one response capture unless a reviewed authorization says otherwise.

The default maximum execution count should be:

* `1`

The default maximum request count should be:

* `1`

The default maximum response count should be:

* `1`

## Evidence posture

The future authorization lane may design candidate-only low-grade classes:

* `local_smoke_transcript`
* `prompt_response_capture_record`
* `local_provider_execution_capture_record`
* `provider_output_observation_candidate`
* `parser_compatibility_observation_candidate`
* `reproducibility_observation_candidate`

Candidate-only means not granted.

The future authorization lane must keep these blocked:

* `provider_output_evidence`
* `parser_compatibility_evidence`
* `reproducibility_evidence`
* `candidate_truth_evidence`
* `origin_evidence`
* `model_quality_evidence`
* `publication_evidence`
* `execution_safety_evidence`

## Explicit non-promotion declaration

A future authorization must state that a controlled local execution, if later authorized, does not by itself create:

* provider-output evidence
* parser-compatibility evidence
* reproducibility evidence
* candidate-truth evidence
* origin evidence
* model-quality evidence
* publication evidence
* execution-safety evidence

The output of a future execution should remain an observation candidate until a later reviewed evidence lane changes the classification.

## Fail-closed requirements

The future authorization lane must fail closed if:

* readiness assessment is missing
* prompt-response capture closure assessment is missing
* execution capture closure assessment is missing
* provider identity is missing
* model identity is missing
* endpoint class is missing
* local endpoint proof is missing
* endpoint class is remote
* paid OpenAI API use is true
* remote provider endpoint use is true
* secrets use is true
* prompt source is missing
* prompt source is unreviewed
* prompt SHA-256 is missing
* request body SHA-256 is missing
* response SHA-256 is not required
* maximum execution count is missing
* maximum execution count is greater than one without explicit review
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

## Review checklist for next lane

The design review should verify:

* this lane is design-only
* no actual provider execution is authorized
* no model call is authorized
* no paid OpenAI API use is authorized
* no remote provider endpoint is authorized
* no secrets are authorized
* no runtime/API/UI wiring is authorized
* no artifact creation is authorized
* no evidence-pack creation is authorized
* prompt-response capture contract lane is closed and assessed
* execution capture contract lane is closed and assessed
* readiness assessment exists
* local endpoint proof remains mandatory
* provider identity remains mandatory
* model identity remains mandatory
* prompt SHA-256 remains mandatory
* request body SHA-256 remains mandatory
* response SHA-256 remains mandatory
* evidence promotion remains blocked
* prior controlled execution response remains local smoke transcript only

## Prior response posture

The prior controlled execution response remains local smoke transcript only.

The prior response has SHA-256:

* `a049322ed9cd37d5aa3916423c2b6c62671a0131685dfd0945ef363ad43cb40f`

The prior response is not upgraded by this design.

The prior response is not provider-output evidence.

The prior response is not parser-compatibility evidence.

The prior response is not reproducibility evidence.

The prior response is not candidate-truth evidence.

The prior response is not origin evidence.

The prior response is not model-quality evidence.

The prior response is not publication evidence.

The prior response is not execution-safety evidence.

## Current blocked posture

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

## Design conclusion

The controlled local-provider execution authorization lane is designed.

This design creates the next authorization envelope.

It does not authorize execution.

The next project step is review of this authorization-lane design.

## Next accepted task

`docs(open-instrument): review controlled local-provider execution authorization lane design v0.1`
