# Open Instrument first controlled local-provider execution run authorization implementation v0.1

Status: implementation
Scope: first controlled local-provider execution run authorization static implementation

## Implementation decision

Implemented.

This implementation adds static first controlled local-provider execution run authorization contract machinery.

This implementation is static only.

Actual provider execution remains unauthorized.

Model calls remain unauthorized.

Paid OpenAI API use remains unauthorized.

Remote provider endpoints remain unauthorized.

Localhost provider calls remain unauthorized.

Ollama calls remain unauthorized.

OpenAI-compatible endpoint calls remain unauthorized.

Secrets remain unauthorized.

Runtime/API/UI wiring remains unauthorized.

Artifact creation remains unauthorized.

Evidence-pack creation remains unauthorized.

Publication framing remains unauthorized.

Provider-output scoring remains unauthorized.

Candidate ranking remains unauthorized.

Evidence promotion remains unauthorized.

## Source authorization

First controlled local-provider execution run authorization implementation authorization:

* PR #1433
* merge SHA: `4e40c983a130236f38ae4a3906db89d70b7b89e3`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-run-authorization-implementation-authorization-v0.1.md`

First controlled local-provider execution run authorization lane design review:

* PR #1432
* merge SHA: `1be4b8263141986bed63770a0ac464c84e37d9be`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-run-authorization-lane-design-review-v0.1.md`

First controlled local-provider execution run authorization lane design:

* PR #1431
* merge SHA: `b96dafa21e0ed485ff97dade2f2512e96d5d5347`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-run-authorization-lane-design-v0.1.md`

First controlled local-provider execution run readiness assessment:

* PR #1430
* merge SHA: `c36d9296e946c6727a99050b4d5123428be81f37`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-run-readiness-assessment-v0.1.md`

First controlled local-provider execution authorization lane closure assessment:

* PR #1429
* merge SHA: `02c06d2df30ade9f356057c67c694f6883262afc`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-authorization-lane-closure-assessment-v0.1.md`

Prior controlled execution response SHA-256:

* `a049322ed9cd37d5aa3916423c2b6c62671a0131685dfd0945ef363ad43cb40f`

## Implemented files

Schema:

* `docs/open-instrument/schemas/first-controlled-execution-run-authorization/open-instrument-first-controlled-local-provider-execution-run-authorization-schema-v0.1.json`

Static fixture:

* `docs/open-instrument/fixtures/first-controlled-execution-run-authorization/open-instrument-first-controlled-local-provider-execution-run-authorization-static-fixture-v0.1.json`

Validation helper:

* `scripts/openInstrumentFirstControlledLocalProviderExecutionRunAuthorizationValidation.v0.1.mjs`

Focused tests:

* `tests/openInstrument.firstControlledLocalProviderExecutionRunAuthorizationValidation.v0.1.spec.ts`
* `tests/openInstrument.firstControlledLocalProviderExecutionRunAuthorizationIntegrationGate.v0.1.spec.ts`

## Static contract class

The fixture grants only:

* `first_controlled_local_provider_execution_run_authorization_contract_static`

This class is a static contract class.

This class is not provider execution.

This class is not a model call.

This class is not paid OpenAI API use.

This class is not remote endpoint use.

This class is not localhost provider use.

This class is not Ollama use.

This class is not OpenAI-compatible endpoint use.

This class is not runtime/API/UI wiring.

This class is not evidence promotion.

## State implementation

Implemented states:

* `first_controlled_execution_run_authorization_design_only`
* `first_controlled_execution_run_authorization_review_required`
* `first_controlled_execution_run_authorization_not_granted`
* `first_controlled_execution_run_authorization_candidate`
* `first_controlled_execution_run_authorization_granted_one_shot_local_only`
* `first_controlled_execution_run_authorization_failed_closed`
* `first_controlled_execution_run_authorization_consumed`
* `first_controlled_execution_run_authorization_expired`

Default state:

* `first_controlled_execution_run_authorization_not_granted`

Active fixture state:

* `first_controlled_execution_run_authorization_not_granted`

Inactive future grant state:

* `first_controlled_execution_run_authorization_granted_one_shot_local_only`

The one-shot run grant is not active.

## One-shot limits

The fixture encodes:

* maximum execution count: `1`
* maximum request count: `1`
* maximum response count: `1`
* maximum retry count: `0`
* maximum rerun count: `0`

The helper fails closed if these widen.

## Lifecycle policy

The fixture requires consumption policy.

The fixture requires expiration policy.

The fixture forbids reuse.

The fixture forbids rerun without a new authorization.

The fixture requires consumption after one-shot run.

The fixture requires fail-closed behavior if consumed.

The fixture requires fail-closed behavior if expired.

## Identity and endpoint requirements

The fixture requires:

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

Provider fallback is forbidden.

Model fallback is forbidden.

Endpoint discovery is forbidden.

Automatic provider selection is forbidden.

Automatic model selection is forbidden.

Hidden retry is forbidden.

Hidden rerun is forbidden.

## API, endpoint, and secret prohibitions

The fixture keeps false:

* actual provider execution authorization
* model call authorization
* paid OpenAI API use authorization
* remote provider endpoint use authorization
* localhost provider call authorization
* Ollama call authorization
* OpenAI-compatible endpoint call authorization
* secrets authorization
* runtime/API/UI wiring authorization
* artifact creation authorization
* evidence-pack creation authorization
* evidence promotion authorization

## Prompt, request, and response requirements

The fixture requires:

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

The helper fails closed when prompt SHA-256 is not required.

The helper fails closed when request body SHA-256 is not required.

The helper fails closed when response SHA-256 is not required.

## Candidate-only classes

The fixture keeps these as candidate-only:

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

The fixture keeps these blocked:

* `provider_output_evidence`
* `parser_compatibility_evidence`
* `reproducibility_evidence`
* `candidate_truth_evidence`
* `origin_evidence`
* `model_quality_evidence`
* `publication_evidence`
* `execution_safety_evidence`

The fixture grants no evidence classes.

## Helper behavior

The helper validates the checked-in static fixture.

The helper fails closed on provider execution authorization drift.

The helper fails closed on model call authorization drift.

The helper fails closed on paid OpenAI API authorization drift.

The helper fails closed on remote endpoint authorization drift.

The helper fails closed on localhost provider call authorization drift.

The helper fails closed on Ollama authorization drift.

The helper fails closed on OpenAI-compatible endpoint authorization drift.

The helper fails closed on secrets authorization drift.

The helper fails closed on missing provider identity requirement.

The helper fails closed on missing model identity requirement.

The helper fails closed on missing endpoint identity requirement.

The helper fails closed on missing local endpoint proof requirement.

The helper fails closed on missing prompt SHA-256 requirement.

The helper fails closed on missing request body SHA-256 requirement.

The helper fails closed on missing response SHA-256 requirement.

The helper fails closed on maximum execution count drift.

The helper fails closed on maximum request count drift.

The helper fails closed on maximum response count drift.

The helper fails closed on retry count drift.

The helper fails closed on rerun count drift.

The helper fails closed on missing consumption policy.

The helper fails closed on missing expiration policy.

The helper fails closed on active one-shot run grant drift.

The helper fails closed on evidence promotion drift.

The helper fails closed on candidate-only class promotion drift.

The helper fails closed on missing post-run review requirement.

## Test behavior

Focused validation tests cover the checked-in fixture and drift failures.

Focused integration gate tests verify the helper remains static.

Focused integration gate tests verify the helper does not import runtime, provider, network, or secret modules.

Focused integration gate tests verify the fixture remains non-executing.

Focused integration gate tests verify the one-shot run grant remains inactive.

Focused integration gate tests verify consumption and expiration remain mandatory.

Focused integration gate tests verify evidence promotion remains blocked.

## Non-execution declaration

No provider run occurred.

No model call occurred.

No paid OpenAI API use occurred.

No remote endpoint use occurred.

No localhost provider call occurred.

No Ollama call occurred.

No OpenAI-compatible endpoint call occurred.

No secrets use occurred.

No runtime/API/UI wiring occurred.

No artifact creation occurred.

No evidence-pack creation occurred.

No publication framing occurred.

No provider-output scoring occurred.

No candidate ranking occurred.

No evidence promotion occurred.

## Implementation conclusion

Static first controlled local-provider execution run authorization contract machinery is implemented.

Actual execution remains unauthorized.

The future one-shot local-only run grant remains inactive.

The prior controlled execution response remains local smoke transcript only.

## Next accepted task

`docs(open-instrument): review first controlled local-provider execution run authorization implementation v0.1`
