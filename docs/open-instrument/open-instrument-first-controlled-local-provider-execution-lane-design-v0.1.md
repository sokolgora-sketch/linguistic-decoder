# Open Instrument first controlled local-provider execution lane design v0.1

Status: design
Scope: first controlled local-provider execution lane design

## Design decision

The first controlled local-provider execution lane is designed.

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

The purpose of this design is to define the final future one-shot local-only execution lane before execution authorization.

## Source readiness

First controlled local-provider execution readiness assessment:

* PR #1438
* merge SHA: `307996a6051651e02d46fddf1f752bf636c2a7c3`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-readiness-assessment-v0.1.md`

Run authorization closure assessment:

* PR #1437
* merge SHA: `6d48be15c5cacd9dacec19cc0de4a79844c85d53`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-run-authorization-lane-closure-assessment-v0.1.md`

Run authorization lane close:

* PR #1436
* merge SHA: `32c24f1eb131b5131c6cae31c8ec6b7b58d30b92`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-run-authorization-lane-close-v0.1.md`

Run authorization implementation review:

* PR #1435
* merge SHA: `f113beb29a54d64c48f716adfdce2d753c0bfd77`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-run-authorization-implementation-review-v0.1.md`

Run authorization implementation:

* PR #1434
* merge SHA: `d379e1523f02927dce9ee8ad60fd18bdde0a83d1`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-run-authorization-implementation-v0.1.md`

Run authorization implementation authorization:

* PR #1433
* merge SHA: `4e40c983a130236f38ae4a3906db89d70b7b89e3`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-run-authorization-implementation-authorization-v0.1.md`

Run authorization design review:

* PR #1432
* merge SHA: `1be4b8263141986bed63770a0ac464c84e37d9be`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-run-authorization-lane-design-review-v0.1.md`

Run authorization design:

* PR #1431
* merge SHA: `b96dafa21e0ed485ff97dade2f2512e96d5d5347`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-run-authorization-lane-design-v0.1.md`

Authorization closure assessment:

* PR #1429
* merge SHA: `02c06d2df30ade9f356057c67c694f6883262afc`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-authorization-lane-closure-assessment-v0.1.md`

Prior controlled execution response SHA-256:

* `a049322ed9cd37d5aa3916423c2b6c62671a0131685dfd0945ef363ad43cb40f`

## Existing static run authorization artifacts

Schema:

* `docs/open-instrument/schemas/first-controlled-execution-run-authorization/open-instrument-first-controlled-local-provider-execution-run-authorization-schema-v0.1.json`

Static fixture:

* `docs/open-instrument/fixtures/first-controlled-execution-run-authorization/open-instrument-first-controlled-local-provider-execution-run-authorization-static-fixture-v0.1.json`

Validation helper:

* `scripts/openInstrumentFirstControlledLocalProviderExecutionRunAuthorizationValidation.v0.1.mjs`

Focused validation test:

* `tests/openInstrument.firstControlledLocalProviderExecutionRunAuthorizationValidation.v0.1.spec.ts`

Focused integration gate test:

* `tests/openInstrument.firstControlledLocalProviderExecutionRunAuthorizationIntegrationGate.v0.1.spec.ts`

## Execution lane design posture

The execution lane design depends on the closed static run authorization contract.

The execution lane design must not bypass that contract.

The execution lane design must not activate the one-shot local-only run grant.

The execution lane design must not consume the one-shot local-only run grant.

The execution lane design must not call a provider.

The execution lane design must not call a model.

The execution lane design must not use paid OpenAI API.

The execution lane design must not use a remote endpoint.

The execution lane design must not use localhost.

The execution lane design must not use Ollama.

The execution lane design must not use an OpenAI-compatible endpoint.

The execution lane design must not use secrets.

The execution lane design must not create runtime/API/UI wiring.

The execution lane design must not create artifacts.

The execution lane design must not create evidence packs.

The execution lane design must not promote evidence.

## Future execution lane purpose

The future execution lane may define a single local-only execution envelope.

The future execution lane may define the exact operator checklist.

The future execution lane may define the exact local endpoint proof required before authorization.

The future execution lane may define the exact provider identity proof required before authorization.

The future execution lane may define the exact model identity proof required before authorization.

The future execution lane may define the exact prompt source and prompt SHA-256 requirements.

The future execution lane may define the exact request body and request body SHA-256 requirements.

The future execution lane may define the exact response capture and response SHA-256 requirements.

The future execution lane may define the exact consumption marker.

The future execution lane may define the exact expiration marker.

The future execution lane may define the exact post-run review boundary.

The future execution lane may define how a local smoke transcript remains candidate-only.

## Required future execution lane packet

A future first controlled local-provider execution lane packet must include:

* execution lane packet id
* source execution readiness assessment PR
* source execution readiness assessment merge SHA
* source execution readiness assessment document path
* source run authorization closure assessment PR
* source run authorization closure assessment merge SHA
* source run authorization closure assessment document path
* source run authorization fixture path
* source run authorization helper path
* source run authorization validation test path
* source run authorization integration gate test path
* operator declaration
* execution environment declaration
* local-only declaration
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
* localhost-only proof
* paid OpenAI API use flag
* remote provider endpoint use flag
* localhost provider call flag
* Ollama call flag
* OpenAI-compatible endpoint call flag
* secrets use flag
* environment variable allowlist
* environment variable denylist
* prompt source path
* prompt source review status
* prompt canonicalization method
* prompt SHA-256
* request body canonicalization method
* request body SHA-256
* request preview policy
* request secrets policy
* response capture method
* response SHA-256
* response retention policy
* response mutation policy
* maximum execution count
* maximum request count
* maximum response count
* maximum retry count
* maximum rerun count
* consumption policy
* expiration policy
* post-run review requirement
* candidate-only declaration
* evidence non-promotion declaration
* final execution design decision

## Future execution lane states

The future execution lane may define these states:

* `first_controlled_execution_lane_design_only`
* `first_controlled_execution_lane_review_required`
* `first_controlled_execution_not_authorized`
* `first_controlled_execution_authorization_candidate`
* `first_controlled_execution_authorized_one_shot_local_only`
* `first_controlled_execution_in_progress`
* `first_controlled_execution_consumed`
* `first_controlled_execution_expired`
* `first_controlled_execution_failed_closed`
* `first_controlled_execution_post_run_review_required`

Default state must be:

* `first_controlled_execution_not_authorized`

This design lane active state is:

* `first_controlled_execution_lane_design_only`

This design does not activate:

* `first_controlled_execution_authorized_one_shot_local_only`

## Future one-shot local-only limits

The future execution lane must preserve:

* maximum execution count: `1`
* maximum request count: `1`
* maximum response count: `1`
* maximum retry count: `0`
* maximum rerun count: `0`

Any widening requires separate reviewed authorization.

Any rerun requires a new reviewed authorization.

Any retry requires a new reviewed authorization.

The one-shot authorization must expire after use.

The one-shot authorization must be marked consumed after use.

The one-shot authorization must fail closed if reused.

The one-shot authorization must fail closed if expired.

## Future local endpoint boundary

The future execution lane must require local endpoint proof.

The future execution lane must require provider identity proof.

The future execution lane must require model identity proof.

The future execution lane must require endpoint identity proof.

The future execution lane must require localhost-only proof if localhost is the selected local endpoint class.

The future execution lane must require Ollama-local proof if Ollama is the selected local endpoint class.

The future execution lane must require local OpenAI-compatible endpoint proof if an OpenAI-compatible local endpoint is the selected endpoint class.

The future execution lane must forbid remote provider endpoints.

The future execution lane must forbid paid OpenAI API use.

The future execution lane must forbid secrets.

The future execution lane must forbid provider fallback.

The future execution lane must forbid model fallback.

The future execution lane must forbid endpoint discovery.

The future execution lane must forbid automatic provider selection.

The future execution lane must forbid automatic model selection.

The future execution lane must forbid hidden retry.

The future execution lane must forbid hidden rerun.

No endpoint call is authorized by this design.

## Future prompt and request boundary

The future execution lane must require a reviewed prompt source.

The future execution lane must require deterministic prompt canonicalization.

The future execution lane must require prompt SHA-256 before execution authorization.

The future execution lane must require deterministic request body canonicalization.

The future execution lane must require request body SHA-256 before execution authorization.

The future execution lane must require a no-secrets request policy.

The future execution lane must forbid hidden prompt mutation.

The future execution lane must forbid hidden request mutation.

The future execution lane must fail closed if prompt SHA-256 is missing.

The future execution lane must fail closed if request body SHA-256 is missing.

## Future response boundary

The future execution lane must require deterministic response capture.

The future execution lane must require response SHA-256.

The future execution lane must forbid silent response overwrite.

The future execution lane must require response retention policy.

The future execution lane must require response mutation policy.

The future execution lane must require post-run review before any evidence-class change.

The future execution lane must not treat the response as evidence by default.

## Candidate-only result boundary

The following may remain candidate-only after a future execution:

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

## Blocked evidence classes

The following remain blocked:

* `provider_output_evidence`
* `parser_compatibility_evidence`
* `reproducibility_evidence`
* `candidate_truth_evidence`
* `origin_evidence`
* `model_quality_evidence`
* `publication_evidence`
* `execution_safety_evidence`

No evidence classes are granted by this design.

No evidence promotion is authorized by this design.

## Future execution lane fail-closed requirements

The future execution lane must fail closed if:

* execution readiness assessment is missing
* run authorization closure assessment is missing
* static run authorization fixture is missing
* static run authorization helper proof is missing
* one-shot authorization is missing
* one-shot authorization is already consumed
* one-shot authorization is expired
* provider family is missing
* provider name is missing
* model family is missing
* model name is missing
* endpoint class is missing
* endpoint identity is missing
* local endpoint proof is missing
* prompt SHA-256 is missing
* request body SHA-256 is missing
* response SHA-256 capture requirement is missing
* maximum execution count exceeds one
* maximum request count exceeds one
* maximum response count exceeds one
* retry count exceeds zero
* rerun count exceeds zero
* paid OpenAI API use is true
* remote provider endpoint use is true
* secrets use is true
* provider fallback is allowed
* model fallback is allowed
* endpoint discovery is allowed
* hidden retry is allowed
* hidden rerun is allowed
* runtime/API/UI wiring appears
* artifact creation appears
* evidence-pack creation appears
* evidence promotion appears

## Non-goals

This design does not authorize execution.

This design does not implement execution.

This design does not call a provider.

This design does not call a model.

This design does not create a prompt.

This design does not create a request body.

This design does not capture a response.

This design does not consume authorization.

This design does not use localhost.

This design does not use Ollama.

This design does not use an OpenAI-compatible endpoint.

This design does not use paid OpenAI API.

This design does not create artifacts.

This design does not create evidence packs.

This design does not promote evidence.

## Progress statement

The static authorization chain is complete.

The static run authorization chain is complete.

The first controlled local-provider execution lane is now designed.

The project is close to the first controlled local-only execution.

The project still needs design review, one-shot authorization, one local-only execution, and post-run review.

## Design conclusion

Ready for design review.

Not ready to execute.

Actual provider execution remains unauthorized.

The future one-shot local-only run grant remains inactive.

Evidence promotion remains blocked.

The prior controlled execution response remains local smoke transcript only.

## Next accepted task

`docs(open-instrument): review first controlled local-provider execution lane design v0.1`
