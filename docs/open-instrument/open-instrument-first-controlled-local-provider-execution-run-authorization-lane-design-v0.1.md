# Open Instrument first controlled local-provider execution run authorization lane design v0.1

Status: design
Scope: first controlled local-provider execution run authorization lane design

## Design decision

The first controlled local-provider execution run authorization lane is designed.

This lane is design-only.

This lane does not authorize actual provider execution.

This lane does not authorize a model call.

This lane does not authorize paid OpenAI API use.

This lane does not authorize remote provider endpoints.

This lane does not authorize localhost provider calls.

This lane does not authorize Ollama calls.

This lane does not authorize OpenAI-compatible endpoint calls.

This lane does not authorize secrets.

This lane does not authorize runtime/API/UI wiring.

This lane does not authorize artifact creation.

This lane does not authorize evidence-pack creation.

This lane does not authorize publication framing.

This lane does not authorize provider-output scoring.

This lane does not authorize candidate ranking.

This lane does not authorize evidence promotion.

The purpose of this design is to define the exact future run authorization shape for one tightly bounded local-only execution.

The next lane must review this design before any run authorization implementation or execution authorization.

## Source chain

First controlled local-provider execution run readiness assessment:

* PR #1430
* merge SHA: `c36d9296e946c6727a99050b4d5123428be81f37`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-run-readiness-assessment-v0.1.md`

First controlled local-provider execution authorization lane closure assessment:

* PR #1429
* merge SHA: `02c06d2df30ade9f356057c67c694f6883262afc`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-authorization-lane-closure-assessment-v0.1.md`

First controlled local-provider execution authorization lane close:

* PR #1428
* merge SHA: `d56f5d87e97706dc2882945f5136c2d5d5b6090d`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-authorization-lane-close-v0.1.md`

First controlled local-provider execution authorization implementation review:

* PR #1427
* merge SHA: `9ad91b77b7e5234f4320bb64b41163903c6aa6c2`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-authorization-implementation-review-v0.1.md`

First controlled local-provider execution authorization implementation:

* PR #1426
* merge SHA: `1ed5e5dd88377eafcf19ef84f6172b8eebb5dcf9`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-authorization-implementation-v0.1.md`

First controlled local-provider execution authorization implementation authorization:

* PR #1425
* merge SHA: `0121b9d42f03e04ec13ae49d30155dd49be9c579`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-authorization-implementation-authorization-v0.1.md`

First controlled local-provider execution authorization lane design review:

* PR #1424
* merge SHA: `b1c5d43651242879c23ed32e2b1b91b8880a7d3f`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-authorization-lane-design-review-v0.1.md`

First controlled local-provider execution authorization lane design:

* PR #1423
* merge SHA: `f1c2600b6eace1a28482888760612ec1fffd3eb2`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-authorization-lane-design-v0.1.md`

First controlled local-provider execution authorization readiness assessment:

* PR #1422
* merge SHA: `b38acb3e1f94ade4aff1a91bc682191278a5b82a`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-authorization-readiness-assessment-v0.1.md`

Prior controlled execution response SHA-256:

* `a049322ed9cd37d5aa3916423c2b6c62671a0131685dfd0945ef363ad43cb40f`

## Existing static authorization artifacts

Schema:

* `docs/open-instrument/schemas/first-controlled-execution-authorization/open-instrument-first-controlled-local-provider-execution-authorization-schema-v0.1.json`

Static fixture:

* `docs/open-instrument/fixtures/first-controlled-execution-authorization/open-instrument-first-controlled-local-provider-execution-authorization-static-fixture-v0.1.json`

Validation helper:

* `scripts/openInstrumentFirstControlledLocalProviderExecutionAuthorizationValidation.v0.1.mjs`

Focused validation test:

* `tests/openInstrument.firstControlledLocalProviderExecutionAuthorizationValidation.v0.1.spec.ts`

Focused integration gate test:

* `tests/openInstrument.firstControlledLocalProviderExecutionAuthorizationIntegrationGate.v0.1.spec.ts`

## Problem being solved

The project is ready to design a first controlled local-provider execution run authorization lane.

The project is not ready to execute.

The closed static authorization contract proves that future execution authorization must be explicit, narrow, local-only, hash-complete, one-shot, and non-promoting.

The future run authorization lane needs a reviewed design before any implementation or execution authorization.

This design prevents readiness from drifting into execution.

## Intended achievement

The intended achievement is not provider execution.

The intended achievement is not a model call.

The intended achievement is not paid OpenAI API use.

The intended achievement is not a remote provider endpoint call.

The intended achievement is not a localhost provider call.

The intended achievement is not an Ollama call.

The intended achievement is not an OpenAI-compatible endpoint call.

The intended achievement is not provider-output evidence.

The intended achievement is not candidate-truth evidence.

The intended achievement is not origin evidence.

The intended achievement is not model-quality evidence.

The intended achievement is not publication evidence.

The intended achievement is not execution-safety evidence.

The intended achievement is a future reviewed run authorization packet that can authorize exactly one local-only execution under strict boundaries.

## Designed future run authorization packet

A future first controlled local-provider execution run authorization packet must include:

* schema version
* run authorization packet id
* source run readiness assessment PR
* source run readiness assessment merge SHA
* source run readiness assessment document path
* source authorization closure assessment PR
* source authorization closure assessment merge SHA
* source authorization closure assessment document path
* source static authorization fixture path
* source static authorization helper path
* run authorization design PR
* run authorization design merge SHA
* run authorization design review PR
* run authorization design review merge SHA
* run authorization implementation PR if applicable
* run authorization implementation merge SHA if applicable
* operator declaration
* execution environment declaration
* provider family
* provider name
* provider version if available
* model family
* model name
* model version if available
* endpoint class
* endpoint URL class
* endpoint identity
* local endpoint proof
* localhost-only declaration
* paid OpenAI API use flag
* remote provider endpoint use flag
* localhost provider call flag
* Ollama use flag
* OpenAI-compatible endpoint use flag
* secrets use flag
* environment variable allowlist
* environment variable denylist
* prompt source path
* prompt source review status
* prompt canonicalization method
* prompt SHA-256
* prompt length
* prompt mutation policy
* request body canonicalization method
* request body SHA-256
* request body preview policy
* request secrets policy
* response capture method
* response SHA-256 requirement
* response retention policy
* response mutation policy
* maximum execution count
* maximum request count
* maximum response count
* maximum retry count
* maximum rerun count
* allowed command class
* forbidden command classes
* evidence class requested
* evidence class granted
* evidence class denied
* denial reasons
* final authorization decision
* non-promotion declaration
* post-run review requirement
* consumption policy
* expiration policy

## Designed future run authorization states

The future lane may define these states:

* `first_controlled_execution_run_authorization_design_only`
* `first_controlled_execution_run_authorization_review_required`
* `first_controlled_execution_run_authorization_not_granted`
* `first_controlled_execution_run_authorization_candidate`
* `first_controlled_execution_run_authorization_granted_one_shot_local_only`
* `first_controlled_execution_run_authorization_failed_closed`
* `first_controlled_execution_run_authorization_consumed`
* `first_controlled_execution_run_authorization_expired`

Default state must be:

* `first_controlled_execution_run_authorization_not_granted`

In this design lane, the active state remains:

* `first_controlled_execution_run_authorization_design_only`

This design lane does not activate:

* `first_controlled_execution_run_authorization_granted_one_shot_local_only`

## Designed one-shot limits

The future run authorization packet must default to:

* maximum execution count: `1`
* maximum request count: `1`
* maximum response count: `1`
* maximum retry count: `0`
* maximum rerun count: `0`

Any increase requires separate reviewed authorization.

The future run authorization must expire after use.

The future run authorization must fail closed if reused.

The future run authorization must fail closed if rerun without a new reviewed authorization.

The future run authorization must mark itself consumed after the authorized one-shot run.

## Required local-only run boundary

The future run authorization must require a local-only endpoint class.

The future run authorization must require local endpoint proof.

The future run authorization must forbid remote provider endpoints.

The future run authorization must forbid paid OpenAI API use.

The future run authorization must forbid secrets.

The future run authorization must forbid hidden fallback.

The future run authorization must forbid endpoint discovery.

The future run authorization must forbid automatic provider selection.

The future run authorization must forbid automatic model selection.

The future run authorization must forbid hidden retry.

The future run authorization must forbid hidden rerun.

The future run authorization must define whether localhost provider calls are in scope.

The future run authorization must define whether Ollama is in scope.

The future run authorization must define whether an OpenAI-compatible local endpoint is in scope.

If localhost provider calls are in scope, they must be explicitly local-only.

If Ollama is in scope, it must be explicitly local-only.

If an OpenAI-compatible endpoint is in scope, it must be explicitly local-only.

No localhost provider call is authorized by this design.

No Ollama call is authorized by this design.

No OpenAI-compatible endpoint call is authorized by this design.

## Required provider and model identity boundary

The future run authorization must require provider family.

The future run authorization must require provider name.

The future run authorization must require provider version if available.

The future run authorization must require model family.

The future run authorization must require model name.

The future run authorization must require model version if available.

The future run authorization must forbid provider fallback.

The future run authorization must forbid model fallback.

The future run authorization must fail closed if provider identity is missing.

The future run authorization must fail closed if model identity is missing.

## Required prompt and request boundary

The future run authorization must require a reviewed prompt source.

The future run authorization must require deterministic prompt canonicalization.

The future run authorization must require prompt SHA-256.

The future run authorization must require prompt length.

The future run authorization must require prompt mutation policy.

The future run authorization must require deterministic request body canonicalization.

The future run authorization must require request body SHA-256.

The future run authorization must require request body preview policy.

The future run authorization must require a no-secrets request policy.

The future run authorization must require that no untracked prompt mutation occurs.

The future run authorization must require that no untracked request body mutation occurs.

## Required response boundary

The future run authorization must require deterministic response capture.

The future run authorization must require response SHA-256.

The future run authorization must require response retention policy.

The future run authorization must require response mutation policy.

The future run authorization must forbid silent response overwrite.

The future run authorization must require post-run review before evidence-class changes.

The future run authorization must not treat the captured response as evidence by default.

## Required fail-closed behavior

The future run authorization must fail closed if:

* source run readiness assessment is missing
* source authorization closure assessment is missing
* static authorization fixture is missing
* run authorization design review is missing
* provider family is missing
* provider name is missing
* model family is missing
* model name is missing
* endpoint class is missing
* endpoint class is remote
* local endpoint proof is missing
* paid OpenAI API use is true
* remote provider endpoint use is true
* secrets use is true
* undeclared environment variable is read
* credential variable is read
* endpoint variable is read without declaration
* prompt source path is missing
* prompt source is unreviewed
* prompt SHA-256 is missing
* request body SHA-256 is missing
* response SHA-256 requirement is missing
* maximum execution count is greater than one
* maximum request count is greater than one
* maximum response count is greater than one
* retry count is greater than zero
* rerun count is greater than zero
* hidden provider fallback is allowed
* hidden model fallback is allowed
* endpoint discovery is allowed
* hidden retry is allowed
* hidden rerun is allowed
* runtime/API/UI wiring appears
* artifact creation appears
* evidence-pack creation appears
* provider-output evidence is granted
* parser-compatibility evidence is granted
* reproducibility evidence is granted
* candidate-truth evidence is granted
* origin evidence is granted
* model-quality evidence is granted
* publication evidence is granted
* execution-safety evidence is granted

## Evidence class policy

The future run authorization may allow these classes as candidate-only observations:

* `local_smoke_transcript`
* `prompt_response_capture_record`
* `local_provider_execution_capture_record`
* `provider_output_observation_candidate`
* `parser_compatibility_observation_candidate`
* `reproducibility_observation_candidate`

Candidate-only means not granted.

Candidate-only does not mean evidence.

Candidate-only does not mean truth.

Candidate-only does not mean origin.

Candidate-only does not mean model quality.

Candidate-only does not mean publication.

Candidate-only does not mean execution safety.

The following evidence classes remain blocked:

* `provider_output_evidence`
* `parser_compatibility_evidence`
* `reproducibility_evidence`
* `candidate_truth_evidence`
* `origin_evidence`
* `model_quality_evidence`
* `publication_evidence`
* `execution_safety_evidence`

No future run authorization design may promote evidence.

## Non-goals

This design does not implement a run authorization packet.

This design does not implement a schema.

This design does not implement a fixture.

This design does not implement a helper.

This design does not implement tests.

This design does not run a provider.

This design does not call a model.

This design does not capture a new response.

This design does not promote the prior response.

This design does not create runtime/API/UI behavior.

This design does not create artifacts.

This design does not create evidence packs.

## Review checklist for next lane

The next review lane should verify:

* this lane is design-only
* no provider run occurred
* no model call occurred
* no paid OpenAI API use occurred
* no remote endpoint use occurred
* no localhost provider call occurred
* no Ollama call occurred
* no OpenAI-compatible endpoint call occurred
* no secrets use occurred
* no runtime/API/UI wiring occurred
* local endpoint proof is mandatory in the future design
* provider identity is mandatory in the future design
* model identity is mandatory in the future design
* prompt SHA-256 is mandatory in the future design
* request body SHA-256 is mandatory in the future design
* response SHA-256 is mandatory in the future design
* maximum execution count remains one
* maximum request count remains one
* maximum response count remains one
* retry count remains zero
* rerun count remains zero
* evidence promotion remains blocked
* candidate-only observation classes remain candidates only
* blocked evidence classes remain blocked
* future one-shot grant remains inactive

## Achievement path

We are now past static first controlled execution authorization closure.

The next achievement is not execution.

The next achievement is a reviewed design for the first tightly bounded local-only run authorization.

After this design is reviewed, a later lane may authorize static implementation of the first controlled execution run authorization packet.

Actual execution must still wait for a separate reviewed authorization and must remain one-shot, local-only, hash-complete, and non-promoting.

## Next accepted task

`docs(open-instrument): review first controlled local-provider execution run authorization lane design v0.1`
