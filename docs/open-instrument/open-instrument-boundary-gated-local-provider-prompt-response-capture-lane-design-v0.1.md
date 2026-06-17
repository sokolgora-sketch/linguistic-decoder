# Open Instrument boundary-gated local-provider prompt-response capture lane design v0.1

Status: design
Scope: boundary-gated local-provider prompt-response capture design

## Design decision

The boundary-gated local-provider prompt-response capture lane v0.1 is designed.

This lane is design-only.

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

## Source boundary

This design follows the closed and assessed controlled local-provider evidence boundary lane.

Boundary assessment:

* PR #1398
* merge SHA: `e574e916b97141c133c42ad79ee90a231429a343`
* document: `docs/open-instrument/open-instrument-next-controlled-local-provider-evidence-boundary-lane-closure-assessment-v0.1.md`

Boundary closure:

* PR #1397
* merge SHA: `86f2ca41c3941c95f017125e298346999f2b3fba`
* document: `docs/open-instrument/open-instrument-next-controlled-local-provider-evidence-boundary-lane-close-v0.1.md`

Boundary implementation:

* PR #1395
* merge SHA: `829ce77bb5b17b723eaa0fd925ab51a837bdc53e`
* document: `docs/open-instrument/open-instrument-next-controlled-local-provider-evidence-boundary-implementation-v0.1.md`

Boundary artifacts:

* schema: `docs/open-instrument/schemas/controlled-local-provider-evidence-boundary/open-instrument-controlled-local-provider-evidence-boundary-schema-v0.1.json`
* fixture: `docs/open-instrument/fixtures/controlled-local-provider-evidence-boundary/open-instrument-controlled-local-provider-evidence-boundary-static-fixture-v0.1.json`
* helper: `scripts/openInstrumentControlledLocalProviderEvidenceBoundaryValidation.v0.1.mjs`
* tests: `tests/openInstrument.controlledLocalProviderEvidenceBoundaryValidation.v0.1.spec.ts`
* tests: `tests/openInstrument.controlledLocalProviderEvidenceBoundaryIntegrationGate.v0.1.spec.ts`

Prior controlled execution response SHA-256:

* `a049322ed9cd37d5aa3916423c2b6c62671a0131685dfd0945ef363ad43cb40f`

## Problem being solved

The previous boundary correctly kept the prior local-provider response as:

* `local_smoke_transcript_only`

That was correct because the prior lane did not have a full prompt-response capture contract.

The prior lane had a response SHA-256, but the prompt SHA-256 was unavailable.

That missing prompt SHA-256 correctly blocked promotion beyond local smoke transcript.

The next safe step is to design a prompt-response capture lane that ensures future local-provider runs have complete identity, hash, retention, and boundary data before any execution is attempted.

## Intended achievement

The intended achievement is not higher-grade evidence yet.

The intended achievement is a capture contract.

A future implementation of this design should make each future local-provider run traceable enough to decide what evidence class is allowed.

The design preserves the current rule:

* local-provider output may not silently become candidate-truth, origin, model-quality, publication, or execution-safety evidence.

## Designed capture packet

A future prompt-response capture packet should include:

* schema version
* capture packet id
* source lane id
* source PR
* source merge SHA
* capture authorization PR
* capture authorization merge SHA
* provider family
* provider name
* model name
* endpoint type
* endpoint URL class
* local endpoint proof policy
* paid OpenAI API use flag
* remote provider endpoint use flag
* secrets use flag
* prompt source path
* prompt source status
* prompt canonicalization method
* prompt SHA-256
* prompt length
* prompt mutation policy
* request body canonicalization method
* request body SHA-256
* response capture method
* response SHA-256
* response retention policy
* response mutation policy
* rerun authorization state
* parser compatibility authorization state
* evidence class requested
* evidence class granted
* evidence class denied
* denial reasons
* final capture decision
* non-execution declaration for design lanes
* execution declaration for future authorized execution lanes

## Required capture gates

A future implementation should require these gates before any prompt-response capture can be considered complete:

* prompt source exists
* prompt source is reviewed
* prompt canonicalization is deterministic
* prompt SHA-256 is present
* request body canonicalization is deterministic
* request body SHA-256 is present
* provider identity is explicit
* model identity is explicit
* endpoint class is explicit
* endpoint class is local-only
* paid OpenAI API flag is false
* remote provider endpoint flag is false
* secrets flag is false
* response capture method is explicit
* response SHA-256 is present
* response retention policy is explicit
* evidence class requested is explicit
* evidence class granted is explicit
* evidence class denied is explicit
* denial reasons are explicit
* final capture decision is explicit

## Capture states

The future capture lane should support these states:

* `design_only`
* `capture_contract_ready`
* `execution_not_authorized`
* `execution_authorized_pending_capture`
* `capture_recorded_static_only`
* `capture_record_failed_closed`
* `capture_record_review_required`

The default state must be:

* `execution_not_authorized`

## Evidence class policy

The capture lane may design records for these low-grade classes:

* `local_smoke_transcript`
* `prompt_response_capture_record`
* `provider_output_observation_candidate`
* `parser_compatibility_observation_candidate`
* `reproducibility_observation_candidate`

The word candidate is intentional.

These are not automatically granted.

They are future review targets only.

The following classes must remain blocked unless a future reviewed lane explicitly authorizes them:

* `candidate_truth_evidence`
* `origin_evidence`
* `model_quality_evidence`
* `publication_evidence`
* `execution_safety_evidence`

## Fail-closed requirements

The future capture lane must fail closed if:

* prompt SHA-256 is missing
* request body SHA-256 is missing
* response SHA-256 is missing
* provider identity is missing
* model identity is missing
* endpoint class is missing
* endpoint class is remote
* paid OpenAI API use is true
* secrets use is true
* hidden rerun is detected
* prompt mutation is untracked
* request body mutation is untracked
* response mutation is untracked
* retention policy is missing
* runtime/API/UI wiring appears
* artifact creation appears without authorization
* evidence-pack creation appears without authorization
* candidate-truth evidence is granted
* origin evidence is granted
* model-quality evidence is granted
* publication evidence is granted
* execution-safety evidence is granted

## Non-goals

This design does not implement the capture packet.

This design does not implement a schema.

This design does not implement a fixture.

This design does not implement a helper.

This design does not implement tests.

This design does not run a provider.

This design does not call a model.

This design does not capture a new response.

This design does not promote the prior response.

This design does not change runtime/API/UI behavior.

## Review checklist for the next lane

The design review should verify:

* the lane is design-only
* the design follows the assessed boundary
* prompt SHA-256 is mandatory
* response SHA-256 is mandatory
* paid OpenAI API use remains blocked
* remote provider endpoints remain blocked
* secrets remain blocked
* runtime/API/UI wiring remains blocked
* candidate-truth evidence remains blocked
* origin evidence remains blocked
* model-quality evidence remains blocked
* publication evidence remains blocked
* execution-safety evidence remains blocked
* future low-grade capture classes are marked as candidates, not granted evidence
* the next implementation remains unauthorized until a separate authorization PR exists

## Achievement path

We are already on the achievement path.

The completed boundary lane created trust infrastructure.

This design prepares the next achievement: a future prompt-response capture contract that makes local-provider runs hash-complete before they can be reviewed.

The project should not attempt another provider execution until this design is reviewed, authorized, implemented, and reviewed.

## Next accepted task

`docs(open-instrument): review boundary-gated local-provider prompt-response capture lane design v0.1`
