# Open Instrument boundary-gated local-provider execution capture lane design review v0.1

Status: review
Scope: boundary-gated local-provider execution capture lane design review

## Review decision

Accepted.

This review accepts the boundary-gated local-provider execution capture lane design.

The reviewed lane remains design-only.

The design does not authorize provider execution.

The design does not run a provider.

The design does not call a model.

The design does not use paid OpenAI API.

The design does not use remote provider endpoints.

The design does not use secrets.

The design does not add runtime/API/UI wiring.

The design does not create artifacts.

The design does not create evidence packs.

The design does not create publication framing.

The design does not score provider output.

The design does not rank candidates.

The design does not create candidate-truth evidence.

The design does not create origin evidence.

The design does not create model-quality evidence.

The design does not create publication evidence.

The design does not create execution-safety evidence.

## Reviewed design

Design:

* PR #1407
* merge SHA: `dce2d303830afa828598925c0cd7d33f9e880d1f`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-execution-capture-lane-design-v0.1.md`

Prompt-response capture closure assessment:

* PR #1406
* merge SHA: `b2f91943d2e092d48e3ba3dda1a01ee25c9c3493`
* document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-prompt-response-capture-lane-closure-assessment-v0.1.md`

Prompt-response capture schema:

* `docs/open-instrument/schemas/prompt-response-capture/open-instrument-boundary-gated-local-provider-prompt-response-capture-schema-v0.1.json`

Prompt-response capture static fixture:

* `docs/open-instrument/fixtures/prompt-response-capture/open-instrument-boundary-gated-local-provider-prompt-response-capture-static-fixture-v0.1.json`

Prompt-response capture validation helper:

* `scripts/openInstrumentBoundaryGatedPromptResponseCaptureValidation.v0.1.mjs`

Prior controlled execution response SHA-256:

* `a049322ed9cd37d5aa3916423c2b6c62671a0131685dfd0945ef363ad43cb40f`

## Review findings

The design correctly depends on the closed prompt-response capture lane.

The design correctly requires a reviewed execution authorization before any future provider execution.

The design correctly requires local-only endpoint proof before any future provider execution.

The design correctly requires explicit provider identity.

The design correctly requires explicit model identity.

The design correctly requires explicit endpoint class.

The design correctly requires paid OpenAI API use to remain false unless a later reviewed authorization changes the policy.

The design correctly requires remote provider endpoint use to remain false unless a later reviewed authorization changes the policy.

The design correctly requires secrets use to remain false unless a later reviewed authorization changes the policy.

The design correctly requires deterministic prompt canonicalization.

The design correctly requires deterministic request body canonicalization.

The design correctly requires deterministic response capture.

The design correctly requires prompt SHA-256.

The design correctly requires request body SHA-256.

The design correctly requires response SHA-256.

The design correctly requires explicit evidence request, grant, denial, and final decision fields.

The design correctly keeps `execution_not_authorized` as the default state.

The design correctly does not activate `execution_authorized_pending_capture`.

## Accepted future states

The design states are acceptable:

* `design_only`
* `execution_contract_ready`
* `execution_not_authorized`
* `execution_authorized_pending_capture`
* `execution_captured_static_record_only`
* `execution_capture_failed_closed`
* `execution_capture_review_required`
* `execution_capture_reviewed_local_observation_only`

The default must remain:

* `execution_not_authorized`

The `execution_authorized_pending_capture` state must remain inactive unless a future reviewed execution authorization exists.

## Accepted candidate-only classes

The design may use these low-grade classes as candidates only:

* `local_smoke_transcript`
* `prompt_response_capture_record`
* `local_provider_execution_capture_record`
* `provider_output_observation_candidate`
* `parser_compatibility_observation_candidate`
* `reproducibility_observation_candidate`

Candidate-only means not granted.

## Blocked evidence classes

The design correctly keeps these blocked unless a later reviewed lane explicitly authorizes them:

* `provider_output_evidence`
* `parser_compatibility_evidence`
* `reproducibility_evidence`
* `candidate_truth_evidence`
* `origin_evidence`
* `model_quality_evidence`
* `publication_evidence`
* `execution_safety_evidence`

## Fail-closed review

The design correctly requires fail-closed behavior when:

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

## Boundary posture after review

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

The prior controlled execution response remains local smoke transcript only.

## Review conclusion

The boundary-gated local-provider execution capture lane design is accepted.

The design is a safe next step after the prompt-response capture contract lane.

The next lane may authorize static execution-capture contract implementation.

The next lane must still not authorize actual provider execution.

The next lane must still not run a provider.

## Next accepted task

`docs(open-instrument): authorize boundary-gated local-provider execution capture implementation v0.1`
