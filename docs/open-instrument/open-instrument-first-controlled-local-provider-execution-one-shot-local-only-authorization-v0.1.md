# Open Instrument first controlled local-provider execution one-shot local-only authorization v0.1

Status: authorization
Scope: first controlled local-provider execution one-shot local-only authorization

## Authorization decision

Authorized with restrictions.

A single first controlled local-provider execution is authorized only after this PR is merged.

This authorization is local-only.

This authorization is one-shot.

This authorization does not execute the provider in this PR.

This authorization does not call a model in this PR.

This authorization does not use paid OpenAI API.

This authorization does not authorize remote provider endpoints.

This authorization does not authorize secrets.

This authorization does not authorize runtime/API/UI wiring.

This authorization does not authorize artifact creation.

This authorization does not authorize evidence-pack creation.

This authorization does not authorize publication framing.

This authorization does not authorize provider-output scoring.

This authorization does not authorize candidate ranking.

This authorization does not authorize evidence promotion.

This authorization allows the next lane to perform exactly one local-only provider execution under the constraints below.

## Authorized execution class

The next execution lane may activate:

* `first_controlled_execution_authorized_one_shot_local_only`

The execution lane must begin from:

* `first_controlled_execution_not_authorized`

The execution lane must end in one of:

* `first_controlled_execution_consumed`
* `first_controlled_execution_failed_closed`
* `first_controlled_execution_expired`
* `first_controlled_execution_post_run_review_required`

The one-shot authorization must be marked consumed after the authorized execution attempt.

The one-shot authorization must fail closed if reused.

The one-shot authorization must fail closed if rerun.

The one-shot authorization must fail closed if retry is attempted.

## Source review chain

Execution lane design review:

* PR #1440
* merge SHA: `7146138301a3e92102cb62aebd46b03707cc542a`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-lane-design-review-v0.1.md`

Execution lane design:

* PR #1439
* merge SHA: `1425f9f8e3d6b004ce545dbdc4177b9499397160`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-lane-design-v0.1.md`

Execution readiness assessment:

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

Prior controlled execution response SHA-256:

* `a049322ed9cd37d5aa3916423c2b6c62671a0131685dfd0945ef363ad43cb40f`

## Static run authorization artifacts

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

## Strict one-shot limits

The next execution lane is limited to:

* maximum execution count: `1`
* maximum request count: `1`
* maximum response count: `1`
* maximum retry count: `0`
* maximum rerun count: `0`

No retry is authorized.

No rerun is authorized.

No second request is authorized.

No second response is authorized.

No hidden retry is authorized.

No hidden rerun is authorized.

No automatic fallback is authorized.

## Local-only boundary

The next execution lane must be local-only.

Remote provider endpoints are forbidden.

Paid OpenAI API use is forbidden.

Secrets are forbidden.

Provider fallback is forbidden.

Model fallback is forbidden.

Endpoint discovery is forbidden.

Automatic provider selection is forbidden.

Automatic model selection is forbidden.

Hidden retry is forbidden.

Hidden rerun is forbidden.

The next execution lane must prove the selected endpoint is local.

The next execution lane must prove the selected provider is local.

The next execution lane must prove the selected model is local.

## Required proof before execution

Before the one-shot execution command runs, the next execution lane must record:

* source authorization document path
* source authorization PR
* source authorization merge SHA
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
* localhost-only proof if endpoint class is localhost
* Ollama-local proof if endpoint class is Ollama
* local OpenAI-compatible endpoint proof if endpoint class is OpenAI-compatible local
* prompt source path
* prompt source review status
* prompt canonicalization method
* prompt SHA-256
* request body canonicalization method
* request body SHA-256
* request secrets policy
* response capture method
* response SHA-256 requirement
* response retention policy
* response mutation policy
* execution count limit
* request count limit
* response count limit
* retry count limit
* rerun count limit
* consumption policy
* expiration policy
* post-run review requirement

## Required execution behavior

The next execution lane must run one local-only command or one local-only request.

The next execution lane must capture exactly one response.

The next execution lane must compute response SHA-256.

The next execution lane must record whether execution succeeded or failed.

The next execution lane must mark the one-shot authorization consumed after the attempt.

The next execution lane must not retry.

The next execution lane must not rerun.

The next execution lane must not call any remote endpoint.

The next execution lane must not use paid OpenAI API.

The next execution lane must not read secrets.

The next execution lane must not create runtime/API/UI wiring.

The next execution lane must not create artifacts unless separately reviewed.

The next execution lane must not create evidence packs unless separately reviewed.

The next execution lane must not promote evidence.

## Candidate-only result boundary

The execution result may be recorded only as candidate-only material.

Allowed candidate-only classes after the next execution:

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

The next execution lane must keep these blocked:

* `provider_output_evidence`
* `parser_compatibility_evidence`
* `reproducibility_evidence`
* `candidate_truth_evidence`
* `origin_evidence`
* `model_quality_evidence`
* `publication_evidence`
* `execution_safety_evidence`

No evidence promotion is authorized by this authorization.

No candidate truth is authorized by this authorization.

No origin evidence is authorized by this authorization.

No model-quality evidence is authorized by this authorization.

No publication evidence is authorized by this authorization.

No execution-safety evidence is authorized by this authorization.

## Fail-closed requirements

The next execution lane must fail closed if:

* this authorization document is missing
* this authorization PR is not merged
* this authorization merge SHA is missing
* execution lane design review is missing
* run authorization closure assessment is missing
* static run authorization fixture is missing
* static run authorization helper proof is missing
* provider family is missing
* provider name is missing
* model family is missing
* model name is missing
* endpoint class is missing
* endpoint identity is missing
* local endpoint proof is missing
* prompt SHA-256 is missing
* request body SHA-256 is missing
* response SHA-256 requirement is missing
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
* artifact creation appears without separate review
* evidence-pack creation appears without separate review
* evidence promotion appears

## Non-execution statement for this PR

No provider run occurs in this authorization PR.

No model call occurs in this authorization PR.

No paid OpenAI API use occurs in this authorization PR.

No remote endpoint use occurs in this authorization PR.

No localhost provider call occurs in this authorization PR.

No Ollama call occurs in this authorization PR.

No OpenAI-compatible endpoint call occurs in this authorization PR.

No secrets use occurs in this authorization PR.

No runtime/API/UI wiring occurs in this authorization PR.

No artifact creation occurs in this authorization PR.

No evidence-pack creation occurs in this authorization PR.

No publication framing occurs in this authorization PR.

No provider-output scoring occurs in this authorization PR.

No candidate ranking occurs in this authorization PR.

No evidence promotion occurs in this authorization PR.

## Authorization conclusion

One future local-only execution is authorized after this PR is merged.

The next lane may execute exactly one local-only provider request under this authorization.

The next lane must consume this authorization after one attempt.

The next lane must capture response SHA-256.

The next lane must keep all output candidate-only.

The next lane must not promote evidence.

The next lane must proceed to post-run review afterward.

## Next accepted task

`docs(open-instrument): execute first controlled local-provider one-shot local-only v0.1`
