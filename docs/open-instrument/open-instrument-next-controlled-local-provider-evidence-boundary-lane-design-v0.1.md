# Open Instrument next controlled local-provider evidence boundary lane design v0.1

Status: design
Scope: evidence boundary design

## Design decision

The next controlled local-provider evidence boundary lane v0.1 is designed.

This design follows the completed first actual controlled local-provider execution lane.

This design does not run a provider.

This design does not call a model.

This design does not use paid OpenAI API.

This design does not use remote provider endpoints.

This design does not use secrets.

This design does not add runtime/API/UI wiring.

This design does not change source files.

This design does not change tests.

This design does not change package metadata.

This design does not change CI.

This design does not change helper scripts.

This design does not mutate fixtures.

This design does not mutate schemas.

This design does not create artifacts.

This design does not create reports.

This design does not create evidence packs.

This design does not create publication framing.

## Source chain

Closure assessment PR:

* PR #1391 — `docs(open-instrument): assess first actual controlled local-provider execution lane closure v0.1`
* merge SHA: `6c51eab0132ad707baae024b5c3a80236281611e`
* document: `docs/open-instrument/open-instrument-first-actual-controlled-local-provider-execution-lane-closure-assessment-v0.1.md`

Prior chain:

* PR #1388 — controlled execution
* PR #1389 — controlled execution review
* PR #1390 — lane closure

Prior controlled execution response SHA-256:

* `a049322ed9cd37d5aa3916423c2b6c62671a0131685dfd0945ef363ad43cb40f`

## Problem statement

The first controlled local-provider execution proved that a local OpenAI-compatible provider path can be reached under a bounded lane.

That prior transcript remains a local smoke transcript only.

The next problem is not more execution.

The next problem is evidence classification.

A future local-provider response must not silently become candidate-truth evidence, origin evidence, model-quality evidence, publication evidence, or execution-safety evidence.

## Evidence classes

The lane must distinguish these evidence classes:

* local_smoke_transcript
* provider_output_observation
* provider_output_reproducibility_observation
* prompt_response_shape_observation
* parser_compatibility_observation
* candidate_truth_evidence
* origin_evidence
* model_quality_evidence
* publication_evidence
* execution_safety_evidence

Allowed at design stage:

* local_smoke_transcript
* provider_output_observation as design target only
* provider_output_reproducibility_observation as design target only
* prompt_response_shape_observation as design target only
* parser_compatibility_observation as design target only

Blocked at design stage:

* candidate_truth_evidence
* origin_evidence
* model_quality_evidence
* publication_evidence
* execution_safety_evidence

## Required future boundary fields

Any future evidence-boundary implementation must explicitly record:

* boundary version
* source lane
* provider family
* provider name
* model name
* endpoint type
* endpoint URL class
* prompt identity
* prompt SHA-256
* response SHA-256
* response capture method
* response retention policy
* evidence class requested
* evidence class granted
* evidence class denied
* denial reasons
* rerun authorization state
* parser authorization state
* publication authorization state
* candidate-truth authorization state
* origin authorization state
* model-quality authorization state
* execution-safety authorization state
* final boundary decision

## Required denial reasons

Future boundary logic must deny evidence promotion when any of these conditions appear:

* paid OpenAI API use
* remote provider endpoint use
* missing provider identity
* missing model identity
* missing endpoint class
* missing prompt hash
* missing response hash
* hidden rerun
* untracked prompt mutation
* untracked response mutation
* parser mutation without authorization
* runtime/API/UI wiring without authorization
* candidate-truth claim without authorization
* origin claim without authorization
* model-quality claim without authorization
* publication claim without authorization
* execution-safety claim without authorization
* secrets used
* artifact creation without authorization
* evidence-pack creation without authorization

## Future review gates

Before any future provider output can be promoted beyond local smoke transcript, the repo must contain a reviewed boundary record proving:

* exact source lane
* exact prompt identity
* exact response identity
* exact evidence class requested
* exact evidence class granted
* exact denial reasons for blocked classes
* no hidden rerun
* no secret use
* no paid OpenAI API use
* no remote provider endpoint use
* no runtime/API/UI wiring
* no candidate-truth claim
* no origin claim
* no model-quality claim
* no publication claim
* no execution-safety claim

## Non-goals

This design does not authorize a second provider run.

This design does not authorize response parsing.

This design does not authorize provider-output scoring.

This design does not authorize candidate ranking.

This design does not authorize origin claims.

This design does not authorize publication claims.

This design does not authorize runtime/API/UI integration.

This design does not authorize evidence-pack creation.

## Design conclusion

The safe next lane is a review of this evidence-boundary design.

No further provider execution should occur until the evidence boundary is reviewed and a separate implementation authorization exists.

## Next accepted task

`docs(open-instrument): review next controlled local-provider evidence boundary lane design v0.1`
