# Open Instrument controlled local-provider execution authorization lane design review v0.1

Status: review
Scope: controlled local-provider execution authorization lane design review

## Review decision

Accepted.

This review accepts the controlled local-provider execution authorization lane design.

The reviewed lane remains design-only.

The reviewed design does not authorize actual provider execution.

The reviewed design does not run a provider.

The reviewed design does not call a model.

The reviewed design does not use paid OpenAI API.

The reviewed design does not use remote provider endpoints.

The reviewed design does not use secrets.

The reviewed design does not add runtime/API/UI wiring.

The reviewed design does not create artifacts.

The reviewed design does not create evidence packs.

The reviewed design does not create publication framing.

The reviewed design does not score provider output.

The reviewed design does not rank candidates.

The reviewed design does not create provider-output evidence.

The reviewed design does not create parser-compatibility evidence.

The reviewed design does not create reproducibility evidence.

The reviewed design does not create candidate-truth evidence.

The reviewed design does not create origin evidence.

The reviewed design does not create model-quality evidence.

The reviewed design does not create publication evidence.

The reviewed design does not create execution-safety evidence.

## Reviewed design

Design:

* PR #1415
* merge SHA: `d3e5ef8ce4aef4deeab3d5e852dcd857758c447d`
* document: `docs/open-instrument/open-instrument-controlled-local-provider-execution-authorization-lane-design-v0.1.md`

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

## Review findings

The design correctly distinguishes readiness from execution.

The design correctly states that the project is ready to design an authorization lane.

The design correctly states that the project is not ready to execute.

The design correctly identifies authorization drift as the risk.

The design correctly creates an authorization envelope without granting execution.

The design correctly depends on the readiness assessment.

The design correctly depends on the prompt-response capture closure assessment.

The design correctly depends on the execution capture closure assessment.

The design correctly keeps the prior controlled execution response as local smoke transcript only.

## Accepted authorization states

The design states are accepted:

* `authorization_design_only`
* `execution_authorization_not_granted`
* `execution_authorization_review_required`
* `controlled_local_execution_authorization_candidate`
* `controlled_local_execution_authorization_granted_static_scope`
* `controlled_local_execution_authorization_failed_closed`

The default must remain:

* `execution_authorization_not_granted`

The following state must remain inactive unless a later reviewed authorization lane explicitly grants it:

* `controlled_local_execution_authorization_granted_static_scope`

## Accepted authorization envelope requirements

The future authorization envelope must include:

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

## Accepted provider and model constraints

The design correctly requires provider identity.

The design correctly requires model identity.

The design correctly requires local-only endpoint posture.

The design correctly requires local endpoint proof.

The design correctly forbids paid OpenAI API use.

The design correctly forbids remote provider endpoint use.

The design correctly forbids secrets use.

The design correctly forbids hidden provider fallback.

The design correctly forbids automatic retries unless explicitly authorized.

The design correctly forbids hidden reruns.

## Accepted prompt, request, and response constraints

The design correctly requires a reviewed prompt source.

The design correctly requires deterministic prompt canonicalization.

The design correctly requires prompt SHA-256 before execution.

The design correctly requires deterministic request body canonicalization.

The design correctly requires request body SHA-256 before execution.

The design correctly requires deterministic response capture.

The design correctly requires response SHA-256 after execution.

The design correctly requires response retention policy.

The design correctly requires response mutation policy.

The design correctly forbids untracked prompt mutation.

The design correctly forbids untracked request body mutation.

The design correctly forbids untracked response mutation.

The design correctly forbids silent response overwrite.

The design correctly requires post-execution review before evidence class changes.

## Accepted execution-count constraints

The design correctly requires narrow execution scope.

The default maximum execution count should remain:

* `1`

The default maximum request count should remain:

* `1`

The default maximum response count should remain:

* `1`

Any higher count must require explicit reviewed authorization.

## Accepted evidence posture

The future authorization lane may design these as candidate-only classes:

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

## Accepted fail-closed requirements

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

## Boundary posture after review

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

## Review conclusion

The controlled local-provider execution authorization lane design is accepted.

The next lane may authorize static implementation of the authorization envelope.

The next lane must still not authorize actual provider execution.

The next lane must still not run a provider.

The next lane must still not call a model.

## Next accepted task

`docs(open-instrument): authorize controlled local-provider execution authorization implementation v0.1`
