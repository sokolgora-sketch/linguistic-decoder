# Open Instrument boundary-gated local-provider prompt-response capture lane design review v0.1

Status: review
Scope: boundary-gated local-provider prompt-response capture design review

## Review decision

Accepted.

The boundary-gated local-provider prompt-response capture lane design v0.1 is accepted.

This review accepts the design as a design-only capture-contract lane.

This review does not authorize implementation.

This review does not authorize:

- provider execution
- model calls
- paid OpenAI API use
- remote provider endpoints
- secrets
- runtime/API/UI wiring
- artifact creation
- evidence-pack creation
- publication framing
- provider-output scoring
- candidate ranking
- candidate-truth evidence
- origin evidence
- model-quality evidence
- publication evidence
- execution-safety evidence

## Reviewed design

- PR #1400
- merge SHA: `92def9c87a5ebe53417af4e8da5b83b40be00ac3`
- document: `docs/open-instrument/open-instrument-boundary-gated-local-provider-prompt-response-capture-lane-design-v0.1.md`

## Source boundary

This review follows the closed and assessed controlled local-provider evidence boundary lane.

Boundary assessment:

- PR #1398
- merge SHA: `e574e916b97141c133c42ad79ee90a231429a343`
- document: `docs/open-instrument/open-instrument-next-controlled-local-provider-evidence-boundary-lane-closure-assessment-v0.1.md`

Boundary closure:

- PR #1397
- merge SHA: `86f2ca41c3941c95f017125e298346999f2b3fba`
- document: `docs/open-instrument/open-instrument-next-controlled-local-provider-evidence-boundary-lane-close-v0.1.md`

Boundary implementation:

- PR #1395
- merge SHA: `829ce77bb5b17b723eaa0fd925ab51a837bdc53e`
- document: `docs/open-instrument/open-instrument-next-controlled-local-provider-evidence-boundary-implementation-v0.1.md`

Boundary artifacts:

- schema: `docs/open-instrument/schemas/controlled-local-provider-evidence-boundary/open-instrument-controlled-local-provider-evidence-boundary-schema-v0.1.json`
- fixture: `docs/open-instrument/fixtures/controlled-local-provider-evidence-boundary/open-instrument-controlled-local-provider-evidence-boundary-static-fixture-v0.1.json`
- helper: `scripts/openInstrumentControlledLocalProviderEvidenceBoundaryValidation.v0.1.mjs`
- tests: `tests/openInstrument.controlledLocalProviderEvidenceBoundaryValidation.v0.1.spec.ts`
- tests: `tests/openInstrument.controlledLocalProviderEvidenceBoundaryIntegrationGate.v0.1.spec.ts`

Prior controlled execution response SHA-256:

- `a049322ed9cd37d5aa3916423c2b6c62671a0131685dfd0945ef363ad43cb40f`

## Review findings

The design correctly follows the assessed boundary.

The design remains design-only.

The design treats the prior controlled local-provider output as `local_smoke_transcript_only`.

The design correctly identifies the missing prompt SHA-256 as a blocker for promotion beyond local smoke transcript.

The design requires future prompt SHA-256.

The design requires future request body SHA-256.

The design requires future response SHA-256.

The design requires explicit provider identity.

The design requires explicit model identity.

The design requires explicit endpoint class.

The design requires local-only endpoint classification.

The design keeps paid OpenAI API use blocked.

The design keeps remote provider endpoints blocked.

The design keeps secrets blocked.

The design keeps runtime/API/UI wiring blocked.

The design defines future low-grade capture classes as candidates only.

The design keeps higher-grade evidence classes blocked.

## Low-grade candidate classes review

This design may describe these future classes as candidates only:

- `local_smoke_transcript`
- `prompt_response_capture_record`
- `provider_output_observation_candidate`
- `parser_compatibility_observation_candidate`
- `reproducibility_observation_candidate`

Candidate means not automatically granted.

## Blocked evidence class review

The following remain blocked unless a future reviewed lane explicitly authorizes them:

- `candidate_truth_evidence`
- `origin_evidence`
- `model_quality_evidence`
- `publication_evidence`
- `execution_safety_evidence`

## Capture packet review

The designed capture packet is sufficient for a future implementation authorization lane because it includes:

- source lane identity
- source PR identity
- source merge SHA
- capture authorization identity
- provider identity
- model identity
- endpoint identity
- local endpoint proof policy
- paid OpenAI API use flag
- remote endpoint use flag
- secrets use flag
- prompt source path
- prompt source status
- prompt canonicalization method
- prompt SHA-256
- request body canonicalization method
- request body SHA-256
- response capture method
- response SHA-256
- response retention policy
- response mutation policy
- rerun authorization state
- parser compatibility authorization state
- evidence class requested
- evidence class granted
- evidence class denied
- denial reasons
- final capture decision

## Gate review

A future implementation must fail closed if:

- prompt SHA-256 is missing
- request body SHA-256 is missing
- response SHA-256 is missing
- provider identity is missing
- model identity is missing
- endpoint class is missing
- endpoint class is remote
- paid OpenAI API use is true
- secrets use is true
- hidden rerun is detected
- prompt mutation is untracked
- request body mutation is untracked
- response mutation is untracked
- retention policy is missing
- runtime/API/UI wiring appears
- artifact creation appears without authorization
- evidence-pack creation appears without authorization
- candidate-truth evidence is granted
- origin evidence is granted
- model-quality evidence is granted
- publication evidence is granted
- execution-safety evidence is granted

## State review

Accepted states:

- `design_only`
- `capture_contract_ready`
- `execution_not_authorized`
- `execution_authorized_pending_capture`
- `capture_recorded_static_only`
- `capture_record_failed_closed`
- `capture_record_review_required`

Default state:

- `execution_not_authorized`

## Non-goal review

The design correctly avoids implementation scope.

The design does not implement the capture packet.

The design does not implement a schema.

The design does not implement a fixture.

The design does not implement a helper.

The design does not implement tests.

The design does not run a provider.

The design does not call a model.

The design does not capture a new response.

The design does not promote the prior response.

The design does not change runtime/API/UI behavior.

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

The prior controlled local-provider response remains a local smoke transcript only.

## Implementation authorization posture

Implementation is not authorized by this review.

A future authorization lane may authorize static implementation only.

That future authorization lane may authorize:

- schema
- fixture
- helper
- tests

for the prompt-response capture contract.

That future authorization lane must not authorize:

- provider execution
- model calls
- runtime/API/UI wiring
- evidence promotion

## Achievement path

The design review confirms the project is still on the achievement path.

The completed evidence-boundary lane created reviewed static trust infrastructure.

The reviewed prompt-response capture design prepares the next achievement: a hash-complete local-provider capture contract.

No new provider execution should occur until the capture contract is authorized, implemented, reviewed, and separately used by a future execution lane.

## Review conclusion

The boundary-gated local-provider prompt-response capture lane design is accepted.

The safe next step is implementation authorization for static prompt-response capture contract machinery only.

## Next accepted task

`docs(open-instrument): authorize boundary-gated local-provider prompt-response capture lane implementation v0.1`
