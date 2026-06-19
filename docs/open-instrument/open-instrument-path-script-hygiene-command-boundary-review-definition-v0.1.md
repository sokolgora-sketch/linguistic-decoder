# Open Instrument path-script hygiene and command-boundary review definition v0.1

Status: definition
Scope: path-script hygiene and command-boundary review definition

## Definition decision

The Open Instrument path-script hygiene and command-boundary review is defined.

This definition is docs-only.

This definition does not perform the review.

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

## Accepted source

Plan review:

* PR #1453
* merge SHA: `6610643094956ab73d514a62540fa49c8008c4d5`
* document: `docs/open-instrument/open-instrument-next-safety-follow-up-plan-review-v0.1.md`

Plan:

* PR #1452
* merge SHA: `546d83d9c08641b7f2f3fd281b8656320134efcb`
* document: `docs/open-instrument/open-instrument-next-safety-follow-up-plan-v0.1.md`

Lifecycle summary:

* PR #1446
* merge SHA: `13ff1dc861ad127c4d3162b14051d3c2fc2da837`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-lifecycle-summary-v0.1.md`

Repo hygiene fix:

* PR #1447
* merge SHA: `6d21911710c9f88fea15176845646b9615eba9eb`
* corrected `genkit:watch` from `srcai/dev.ts` to `src/ai/dev.ts`

## Baseline retained

The first controlled local-provider execution lifecycle remains complete.

The one-shot authorization remains consumed.

No active one-shot authorization remains.

No future execution is authorized.

The result remains candidate-only.

Evidence promotion remains blocked.

The `genkit:watch` path defect remains fixed.

Any future provider execution requires a new reviewed authorization.

## Execution facts retained

Execution outcome:

* `first_controlled_execution_post_run_review_required`

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

Execution count:

* `1`

Request count:

* `1`

Response capture count:

* `1`

Retry count:

* `0`

Rerun count:

* `0`

## Review objective

The objective is to review path-script hygiene and command-boundary posture across Open Instrument after the first controlled local-provider lifecycle.

The review should identify whether scripts, docs, tests, package commands, helper names, and command examples preserve the closed safety posture.

The review should verify that the corrected `genkit:watch` path remains fixed.

The review should verify that future provider execution remains unauthorized.

The review should verify that evidence promotion remains blocked.

The review should verify that command examples do not accidentally create a live execution path.

## Review inputs

The review should inspect:

* `package.json`
* Open Instrument docs under `docs/open-instrument`
* Open Instrument scripts under `scripts/openInstrument*.mjs`
* Open Instrument tests under `tests/openInstrument*.spec.ts`
* prompt-response capture validation helpers
* local-provider execution capture validation helpers
* evidence-boundary validation helpers
* run authorization validation helpers
* preflight fixture validation helpers
* mapping coverage audit helpers
* GitHub workflow references that could affect Open Instrument
* command examples in Open Instrument docs
* endpoint references in Open Instrument docs and helpers
* localhost references in Open Instrument docs and helpers
* Ollama references in Open Instrument docs and helpers
* OpenAI-compatible endpoint references in Open Instrument docs and helpers

## Review questions

The review should answer these questions:

* Are package script paths valid?
* Do package scripts point to existing files?
* Do Open Instrument command examples stay docs-only unless explicitly authorized?
* Do Open Instrument helpers remain static validation helpers unless explicitly authorized?
* Do Open Instrument tests avoid executing providers?
* Do Open Instrument tests avoid calling models?
* Do Open Instrument tests avoid localhost/Ollama/OpenAI-compatible endpoint calls?
* Do Open Instrument docs preserve the consumed one-shot authorization state?
* Do Open Instrument docs preserve no active one-shot authorization remains?
* Do Open Instrument docs preserve no future execution is authorized?
* Do Open Instrument docs preserve candidate-only status?
* Do Open Instrument docs preserve blocked evidence classes?
* Do Open Instrument docs avoid publication framing?
* Do Open Instrument docs avoid provider-output scoring?
* Do Open Instrument docs avoid candidate ranking?
* Do Open Instrument docs avoid evidence promotion?
* Are command-boundary statements consistent across lifecycle, plan, and review docs?

## Review method

The review should use static inspection.

The review may use grep, file listing, package parsing, TypeScript parsing, helper smoke checks, and Jest tests.

The review must not call providers.

The review must not call models.

The review must not call localhost.

The review must not call Ollama.

The review must not call OpenAI-compatible endpoints.

The review must not use secrets.

The review must not add runtime/API/UI wiring.

The review must not create artifacts.

The review must not create evidence packs.

The review must not promote evidence.

## Required static checks for the future review

The future review should include:

* package script path inspection
* `genkit:watch` fixed-path verification
* `src/ai/dev.ts` existence verification
* Open Instrument docs endpoint-reference inspection
* Open Instrument docs command-example inspection
* Open Instrument helper script syntax checks
* Open Instrument focused Jest checks
* evidence boundary helper smoke
* execution capture helper smoke
* prompt-response capture helper smoke
* run authorization helper smoke
* `npm run gate:quick`
* `npm run build`
* `git diff --check`

## Expected review output

The future review should create one docs-only review document.

The review document should classify findings as:

* accepted
* advisory
* blocked
* requires separate implementation authorization

The review document should not fix findings unless a separate implementation authorization exists.

The review document should not change package scripts.

The review document should not change source files.

The review document should not change tests.

The review document should not change helpers.

The review document should not change schemas.

The review document should not change fixtures.

The review document should not change CI.

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

The path-script hygiene and command-boundary review is defined.

The next safe move is to review this definition.

No future provider execution is authorized.

No evidence promotion is authorized.

## Next accepted task

`docs(open-instrument): review path-script hygiene and command-boundary review definition v0.1`
