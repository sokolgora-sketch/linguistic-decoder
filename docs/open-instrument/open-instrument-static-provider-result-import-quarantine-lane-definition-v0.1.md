# Open Instrument static provider-result import quarantine lane definition v0.1

Status: definition
Scope: static provider-result import quarantine lane definition

## Definition decision

The static provider-result import quarantine lane is defined.

This definition is docs-only.

This definition does not implement the quarantine lane.

This definition does not create schema files.

This definition does not create fixture files.

This definition does not create helper scripts.

This definition does not create tests.

This definition does not authorize provider execution.

This definition does not authorize model calls.

This definition does not authorize paid OpenAI API use.

This definition does not authorize remote provider endpoints.

This definition does not authorize localhost provider calls.

This definition does not authorize Ollama calls.

This definition does not authorize OpenAI-compatible endpoint calls.

This definition does not authorize secrets.

This definition does not authorize runtime/API/UI wiring.

This definition does not authorize artifact creation.

This definition does not authorize evidence-pack creation.

This definition does not authorize publication framing.

This definition does not authorize provider-output scoring.

This definition does not authorize candidate ranking.

This definition does not authorize evidence promotion.

## Source selection

Selection PR:

* PR #1460
* merge SHA: `5a6d32550ade2404f9af75d360a99748663d0d52`
* document: `docs/open-instrument/open-instrument-next-implementation-lane-selection-v0.1.md`

The selected lane is:

* static provider-result import quarantine lane v0.1

The selected lane remains unimplemented pending this definition and a separate review.

## Source chain retained

Path-script hygiene command-boundary review lane summary:

* PR #1459
* merge SHA: `adda5a9dc90e6112070ca172759d5daa4a5d7f63`
* document: `docs/open-instrument/open-instrument-path-script-hygiene-command-boundary-review-lane-summary-v0.1.md`

First controlled local-provider lifecycle summary:

* PR #1446
* merge SHA: `13ff1dc861ad127c4d3162b14051d3c2fc2da837`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-lifecycle-summary-v0.1.md`

Execution result review:

* PR #1443
* merge SHA: `bbf8c2dfee0fd6f0bbc516a0c51e9919ee5e3b84`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-one-shot-execution-result-review-v0.1.md`

Execution record:

* PR #1442
* merge SHA: `0cfc7b6a8520af302f95020638005a2d80c86d15`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-one-shot-local-only-record-v0.1.md`

One-shot authorization:

* PR #1441
* merge SHA: `aa972b500fa2e36e2f74b2d999d16c15e71603f3`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-one-shot-local-only-authorization-v0.1.md`

Repo hygiene fix:

* PR #1447
* merge SHA: `6d21911710c9f88fea15176845646b9615eba9eb`
* corrected `genkit:watch` from `srcai/dev.ts` to `src/ai/dev.ts`

## Current baseline

The first controlled local-provider execution lifecycle remains complete.

The path-script hygiene command-boundary review lane remains complete and closed.

The `genkit:watch` path defect remains fixed.

No active one-shot authorization remains.

No future execution is authorized.

The first controlled local-provider result remains candidate-only.

Evidence promotion remains blocked.

Open Instrument command-boundary posture remains closed.

Future provider execution requires a new reviewed authorization.

## Retained historical execution facts

Provider:

* `ollama`

Model:

* `llama3.1:8b`

Endpoint:

* `http://127.0.0.1:11434/api/generate`

Local endpoint proof SHA-256:

* `6e82b917ab7a55d0b9a9f22e6d02f9ce7a843643a276726722bf6a0ee0a3b033`

Prompt SHA-256:

* `c423e701b6c9c5868b0fb0d2bae3760aaf39db0c06a89b664293d35a37df347b`

Request body SHA-256:

* `cf1c5c6662d008f0af78cdbc89936875b6dae6515d74cca9b2fa725c7f53ad37`

Response SHA-256:

* `4ed28de890a82de2106400038b5115ef34a1bf11e6df273f7eac0ed51983ebda`

These facts remain historical record facts.

These facts do not authorize new execution.

These facts do not authorize localhost calls.

These facts do not authorize Ollama calls.

These facts do not authorize OpenAI-compatible endpoint calls.

These facts do not promote evidence.

## Lane purpose

The lane purpose is to define a static quarantine boundary for importing a previously recorded provider result into Open Instrument records.

The quarantine boundary must prevent provider-result text and provider-result hashes from becoming evidence.

The quarantine boundary must prevent provider-result text from becoming publication material.

The quarantine boundary must prevent provider-result text from becoming scoring material.

The quarantine boundary must prevent provider-result text from becoming candidate-ranking material.

The quarantine boundary must prevent provider-result text from becoming runtime/API/UI material.

The quarantine boundary must keep the first controlled local-provider result candidate-only.

## Quarantine meaning

Quarantine means retained but blocked.

Quarantine means recorded but not promoted.

Quarantine means traceable but not scored.

Quarantine means hash-anchored but not evidence.

Quarantine means historical but not executable.

Quarantine means candidate-only unless a separate reviewed promotion lane exists.

## Future implementation allowed-file boundary

A future implementation PR may only create these files if this definition is reviewed and accepted:

* `docs/open-instrument/schemas/static-provider-result-import-quarantine/open-instrument-static-provider-result-import-quarantine-schema-v0.1.json`
* `docs/open-instrument/fixtures/static-provider-result-import-quarantine/open-instrument-static-provider-result-import-quarantine-static-fixture-v0.1.json`
* `scripts/openInstrumentStaticProviderResultImportQuarantineValidation.v0.1.mjs`
* `tests/openInstrument.staticProviderResultImportQuarantineValidation.v0.1.spec.ts`
* `tests/openInstrument.staticProviderResultImportQuarantineIntegrationGate.v0.1.spec.ts`

No other files are allowed by this definition.

The future implementation may not change `package.json`.

The future implementation may not change runtime source.

The future implementation may not change API source.

The future implementation may not change UI source.

The future implementation may not change CI.

The future implementation may not add secrets.

The future implementation may not create evidence packs.

The future implementation may not add provider execution.

## Future quarantine record shape

The future static quarantine record should include:

* `recordKind`
* `schemaVersion`
* `sourceRecordRef`
* `sourcePr`
* `sourceMergeSha`
* `providerName`
* `modelName`
* `endpointIdentity`
* `localEndpointProofSha256`
* `promptSha256`
* `requestBodySha256`
* `responseSha256`
* `executionCount`
* `requestCount`
* `responseCaptureCount`
* `retryCount`
* `rerunCount`
* `importStatus`
* `quarantineStatus`
* `candidateOnlyStatus`
* `evidencePromotionStatus`
* `publicationStatus`
* `providerOutputScoringStatus`
* `candidateRankingStatus`
* `runtimeApiUiWiringStatus`
* `secretStatus`
* `notes`

## Required future status vocabulary

The future implementation should use explicit status labels.

Import status values:

* `static_import_defined`
* `static_import_validated`
* `static_import_rejected`

Quarantine status values:

* `quarantined_candidate_only`
* `blocked_from_evidence`
* `blocked_from_publication`
* `blocked_from_scoring`
* `blocked_from_ranking`

Promotion status values:

* `evidence_promotion_blocked`
* `publication_blocked`
* `provider_output_scoring_blocked`
* `candidate_ranking_blocked`
* `runtime_api_ui_wiring_blocked`

Execution status values:

* `provider_execution_not_authorized`
* `model_call_not_authorized`
* `retry_not_authorized`
* `rerun_not_authorized`

## Required future validation rules

The future helper must validate that:

* provider execution is not authorized
* model calls are not authorized
* paid OpenAI API use is not authorized
* localhost calls are not authorized
* Ollama calls are not authorized
* OpenAI-compatible endpoint calls are not authorized
* evidence promotion is blocked
* publication is blocked
* provider-output scoring is blocked
* candidate ranking is blocked
* runtime/API/UI wiring is blocked
* secret use is absent
* execution count remains `1`
* request count remains `1`
* response capture count remains `1`
* retry count remains `0`
* rerun count remains `0`
* response hash equals `4ed28de890a82de2106400038b5115ef34a1bf11e6df273f7eac0ed51983ebda`
* provider name equals `ollama`
* model name equals `llama3.1:8b`
* endpoint identity equals `http://127.0.0.1:11434/api/generate`

## Explicitly out of scope

The following are out of scope:

* live provider execution
* second provider execution
* retry
* rerun
* provider-output scoring
* candidate ranking
* evidence promotion
* publication
* artifact creation
* evidence-pack creation
* runtime wiring
* API wiring
* UI wiring
* remote endpoint use
* localhost endpoint use
* Ollama call
* OpenAI-compatible endpoint call
* paid OpenAI API use
* secrets

## Candidate-only posture retained

The following remain candidate-only:

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

## Blocked evidence posture retained

The following remain blocked:

* `provider_output_evidence`
* `parser_compatibility_evidence`
* `reproducibility_evidence`
* `candidate_truth_evidence`
* `origin_evidence`
* `model_quality_evidence`
* `publication_evidence`
* `execution_safety_evidence`

No evidence classes are granted.

No evidence promotion occurred.

No evidence promotion is authorized by this definition.

## Non-execution definition statement

This definition did not execute the provider.

This definition did not call a model.

This definition did not use paid OpenAI API.

This definition did not use a remote endpoint.

This definition did not call localhost.

This definition did not call Ollama.

This definition did not call an OpenAI-compatible endpoint.

This definition did not use secrets.

This definition did not add runtime/API/UI wiring.

This definition did not create artifacts.

This definition did not create evidence packs.

This definition did not publish anything.

This definition did not score provider output.

This definition did not rank candidates.

This definition did not promote evidence.

## Definition conclusion

The static provider-result import quarantine lane is defined.

The lane remains unimplemented.

The next safe move is to review this definition.

No future provider execution is authorized.

Evidence promotion remains blocked.

## Next accepted task

`docs(open-instrument): review static provider-result import quarantine lane definition v0.1`
