# Open Instrument next implementation lane selection v0.1

Status: selected
Scope: next Open Instrument implementation lane selection

## Selection decision

The next Open Instrument implementation lane is selected.

Selected lane:

* static provider-result import quarantine lane v0.1

This selection is docs-only.

This selection does not implement the selected lane.

This selection does not authorize provider execution.

This selection does not authorize model calls.

This selection does not authorize paid OpenAI API use.

This selection does not authorize remote provider endpoints.

This selection does not authorize localhost provider calls.

This selection does not authorize Ollama calls.

This selection does not authorize OpenAI-compatible endpoint calls.

This selection does not authorize secrets.

This selection does not authorize runtime/API/UI wiring.

This selection does not authorize artifact creation.

This selection does not authorize evidence-pack creation.

This selection does not authorize publication framing.

This selection does not authorize provider-output scoring.

This selection does not authorize candidate ranking.

This selection does not authorize evidence promotion.

## Source chain

Path-script hygiene command-boundary lane summary:

* PR #1459
* merge SHA: `adda5a9dc90e6112070ca172759d5daa4a5d7f63`
* document: `docs/open-instrument/open-instrument-path-script-hygiene-command-boundary-review-lane-summary-v0.1.md`

Path-script hygiene command-boundary lane close:

* PR #1458
* merge SHA: `a5cb799fa38ad855cbb9f25d26c45fbfad238cbf`
* document: `docs/open-instrument/open-instrument-path-script-hygiene-command-boundary-review-lane-close-v0.1.md`

Path-script hygiene command-boundary results assessment:

* PR #1457
* merge SHA: `ee95e14830d7e8da724bb1db08ea2b39a6923106`
* document: `docs/open-instrument/open-instrument-path-script-hygiene-command-boundary-review-results-assessment-v0.1.md`

Path-script hygiene command-boundary execution:

* PR #1456
* merge SHA: `9c160bed5c2c7c8505399396fb8be9a3e147d26b`
* document: `docs/open-instrument/open-instrument-path-script-hygiene-command-boundary-review-execution-v0.1.md`

First controlled local-provider lifecycle summary:

* PR #1446
* merge SHA: `13ff1dc861ad127c4d3162b14051d3c2fc2da837`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-lifecycle-summary-v0.1.md`

Repo hygiene fix:

* PR #1447
* merge SHA: `6d21911710c9f88fea15176845646b9615eba9eb`
* corrected `genkit:watch` from `srcai/dev.ts` to `src/ai/dev.ts`

## Current baseline

The first controlled local-provider execution lifecycle remains complete.

The path-script hygiene and command-boundary review lane is complete and closed.

The active `genkit:watch` path remains fixed:

* `genkit start -- tsx --watch src/ai/dev.ts`

No active one-shot authorization remains.

No future execution is authorized.

The first controlled local-provider result remains candidate-only.

Evidence promotion remains blocked.

Open Instrument command-boundary posture remains closed.

Future package/source/helper/test/schema/fixture/CI/runtime fixes require separate implementation authorization.

## Retained execution facts

Provider:

* `ollama`

Model:

* `llama3.1:8b`

Endpoint:

* `http://127.0.0.1:11434/api/generate`

Response SHA-256:

* `4ed28de890a82de2106400038b5115ef34a1bf11e6df273f7eac0ed51983ebda`

These facts remain historical record facts.

These facts do not authorize new execution.

These facts do not authorize localhost calls.

These facts do not authorize Ollama calls.

These facts do not authorize OpenAI-compatible endpoint calls.

These facts do not promote evidence.

## Selected lane purpose

The selected implementation lane should define a static quarantine boundary for importing a previously recorded provider result into Open Instrument records.

The purpose is to make any future handling of provider-result text safe before it touches parser logic, evidence logic, scoring logic, UI logic, artifact logic, or publication logic.

The selected lane should focus on quarantine metadata, status labels, and blocked promotion states.

The selected lane should not create evidence.

The selected lane should not score content.

The selected lane should not rank candidates.

The selected lane should not publish content.

The selected lane should not execute providers.

## Why this lane is next

This lane is the lowest-risk next implementation lane because:

* the first controlled local-provider result already exists as a historical record
* no new provider execution is needed
* the result remains candidate-only
* evidence promotion remains blocked
* command-boundary posture is closed
* import quarantine can be defined statically
* downstream parser/evidence/UI/artifact work should not begin before quarantine rules are explicit

## Selected lane expected deliverables

The selected lane should eventually produce, after separate definition and review:

* a static quarantine record shape
* a status vocabulary for provider-result import state
* blocked evidence-promotion fields
* blocked publication fields
* blocked scoring fields
* blocked candidate-ranking fields
* retained hash anchors
* retained provider/model/endpoint labels
* explicit non-execution posture
* explicit no-secrets posture
* tests proving quarantine does not promote evidence
* docs explaining the quarantine boundary

## Explicitly not selected

The following lanes are not selected now:

* live provider execution lane
* second provider execution lane
* parser execution lane
* evidence promotion lane
* provider-output scoring lane
* candidate-ranking lane
* publication lane
* artifact/evidence-pack lane
* UI runtime wiring lane
* remote endpoint lane
* OpenAI-compatible endpoint lane
* localhost/Ollama execution lane

## Required future authorization boundary

Before implementation begins, the selected lane still requires a separate definition and review.

The definition must state exact allowed files.

The review must approve exact allowed files.

Implementation must stay inside the reviewed boundary.

No provider execution may occur during implementation.

No model call may occur during implementation.

No evidence promotion may occur during implementation.

No runtime/API/UI wiring may occur unless separately authorized.

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

No evidence promotion is authorized by this selection.

## Non-execution selection statement

This selection did not execute the provider.

This selection did not call a model.

This selection did not use paid OpenAI API.

This selection did not use a remote endpoint.

This selection did not call localhost.

This selection did not call Ollama.

This selection did not call an OpenAI-compatible endpoint.

This selection did not use secrets.

This selection did not add runtime/API/UI wiring.

This selection did not create artifacts.

This selection did not create evidence packs.

This selection did not publish anything.

This selection did not score provider output.

This selection did not rank candidates.

This selection did not promote evidence.

## Selection conclusion

The next Open Instrument implementation lane is selected.

Selected lane:

* static provider-result import quarantine lane v0.1

The next safe move is to define the selected lane before implementation.

No future provider execution is authorized.

Evidence promotion remains blocked.

## Next accepted task

`docs(open-instrument): define static provider-result import quarantine lane v0.1`
