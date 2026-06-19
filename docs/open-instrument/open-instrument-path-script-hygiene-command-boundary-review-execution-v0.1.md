# Open Instrument path-script hygiene and command-boundary review execution v0.1

Status: executed review
Scope: path-script hygiene and command-boundary static review

## Review execution decision

The Open Instrument path-script hygiene and command-boundary review was executed as a static inspection.

This review is docs-only.

This review did not authorize provider execution.

This review did not authorize model calls.

This review did not authorize paid OpenAI API use.

This review did not authorize remote provider endpoints.

This review did not authorize localhost provider calls.

This review did not authorize Ollama calls.

This review did not authorize OpenAI-compatible endpoint calls.

This review did not authorize secrets.

This review did not authorize runtime/API/UI wiring.

This review did not authorize artifact creation.

This review did not authorize evidence-pack creation.

This review did not authorize publication framing.

This review did not authorize provider-output scoring.

This review did not authorize candidate ranking.

This review did not authorize evidence promotion.

## Reviewed source

Definition review:

* PR #1455
* merge SHA: `aabea45850db41f686322c3fdc5b3d87295d63e9`
* document: `docs/open-instrument/open-instrument-path-script-hygiene-command-boundary-review-definition-review-v0.1.md`

Definition:

* PR #1454
* merge SHA: `e63800e5cb61a6ba9012ca25d5a98065481183b5`
* document: `docs/open-instrument/open-instrument-path-script-hygiene-command-boundary-review-definition-v0.1.md`

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

## Static inspection method

The review used static inspection only.

The review inspected:

* `package.json`
* `src/ai/dev.ts` existence
* Open Instrument docs under `docs/open-instrument`
* Open Instrument scripts under `scripts/openInstrument*.mjs`
* Open Instrument tests under `tests/openInstrument*.spec.ts`
* command examples in Open Instrument docs
* endpoint references in Open Instrument docs, scripts, and tests
* localhost references in Open Instrument docs, scripts, and tests
* Ollama references in Open Instrument docs, scripts, and tests
* OpenAI-compatible endpoint references in Open Instrument docs, scripts, and tests
* evidence non-promotion language
* candidate-only language
* one-shot authorization language
* package script paths

The review ran static helper smoke checks.

The review ran focused Open Instrument tests.

The review ran `npm run gate:quick`.

The review ran `npm run build`.

## Finding: accepted package script hygiene

Classification: accepted.

The `genkit:watch` path defect is fixed.

Current `genkit:watch` value:

* `genkit start -- tsx --watch src/ai/dev.ts`

The actual file exists:

* `src/ai/dev.ts`

The broken active package path is not present in `package.json`:

* `srcai/dev.ts`

No package script change is required by this review.

## Finding: advisory historical broken-path references

Classification: advisory.

The string `srcai/dev.ts` may remain in Open Instrument docs or DF_BRAIN as historical audit text describing the defect fixed in PR #1447.

That historical reference is acceptable when it is clearly framed as an already-fixed defect.

The active package script path is fixed.

No implementation change is authorized by this review.

## Finding: accepted command-boundary posture

Classification: accepted.

The reviewed Open Instrument chain preserves the closed lifecycle state.

The docs preserve:

* one-shot authorization consumed
* no active one-shot authorization remains
* no future execution is authorized
* result remains candidate-only
* evidence promotion remains blocked

The reviewed helper smoke checks are static validation checks.

The reviewed Jest checks are guardrail checks.

No reviewed check authorizes live provider execution.

## Finding: advisory endpoint references

Classification: advisory.

Open Instrument docs intentionally contain endpoint references including `http://127.0.0.1:11434/api/generate`.

Those references are retained as historical execution-record facts and safety-boundary text.

Those references are not active authorization.

Those references do not reopen localhost, Ollama, or OpenAI-compatible endpoint access.

No implementation change is authorized by this review.

## Finding: blocked future execution

Classification: blocked.

Future provider execution remains blocked unless a new reviewed authorization is created.

The previous one-shot authorization remains consumed.

No active one-shot authorization remains.

This review does not authorize another request.

This review does not authorize another response capture.

This review does not authorize retry.

This review does not authorize rerun.

## Finding: requires separate implementation authorization

Classification: requires separate implementation authorization.

If a future review finds package, source, helper, test, schema, fixture, CI, or runtime defects, those changes require a separate implementation authorization and a separate PR.

This review does not authorize fixes.

This review does not authorize package changes.

This review does not authorize source changes.

This review does not authorize helper changes.

This review does not authorize test changes.

This review does not authorize schema changes.

This review does not authorize fixture changes.

This review does not authorize CI changes.

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

No evidence promotion is authorized by this review.

## Non-execution review statement

This review did not execute the provider.

This review did not call a model.

This review did not use paid OpenAI API.

This review did not use a remote endpoint.

This review did not call localhost.

This review did not call Ollama.

This review did not call an OpenAI-compatible endpoint.

This review did not use secrets.

This review did not add runtime/API/UI wiring.

This review did not create artifacts.

This review did not create evidence packs.

This review did not publish anything.

This review did not score provider output.

This review did not rank candidates.

This review did not promote evidence.

## Review result

The path-script hygiene and command-boundary review is executed.

No active package script path defect was found in the reviewed package script scope.

The `genkit:watch` defect remains fixed.

Open Instrument command-boundary posture remains closed.

No future provider execution is authorized.

No evidence promotion is authorized.

## Next accepted task

`docs(open-instrument): assess path-script hygiene and command-boundary review results v0.1`
