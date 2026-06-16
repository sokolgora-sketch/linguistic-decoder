# Open Instrument first actual controlled local-provider execution lane design v0.1

Status: design

Scope: docs-only design

## Design decision

This document designs a future first actual controlled local-provider execution lane.

This document is docs-only.

This document is design-only.

This document does not execute a provider.

This document does not call a model.

This document does not use OpenAI API.

This document does not use network access.

This document does not use localhost.

This document does not use Ollama.

This document does not use OpenAI-compatible endpoint access.

This document does not use secrets.

This document does not add runtime/API/UI wiring.

This document does not change source files.

This document does not change tests.

This document does not change helper scripts.

This document does not change fixtures.

This document does not change schemas.

This document does not change package metadata.

This document does not change CI.

This document does not create artifacts.

This document does not create reports.

This document does not create evidence packs.

This document does not create publication framing.

This document does not create provider-output evidence.

This document does not create candidate-truth evidence.

This document does not create origin evidence.

This document does not create model-quality evidence.

This document does not create publication evidence.

This document does not create execution-safety evidence.

Provider execution remains blocked.

## Design purpose

The purpose is to define requirements for a future actual controlled local-provider execution lane.

The future lane must be separately authorized before any execution.

The future lane must be locally bounded.

The future lane must be explicit-only.

The future lane must fail closed.

The future lane must expose provider, model, endpoint, environment, network, secret, input, output, artifact, and evidence boundaries before execution.

The future lane must distinguish authorization from execution.

The future lane must distinguish execution logs from evidence claims.

The future lane must prevent fallback providers.

The future lane must prevent fallback models.

The future lane must prevent hidden endpoint use.

The future lane must prevent silent reruns.

The future lane must prevent publication and evidence claims unless separately authorized.

## Proposed future lane sequence

The future actual controlled local-provider execution lane should proceed only through separate PRs:

1. design first actual controlled local-provider execution lane v0.1
2. review first actual controlled local-provider execution lane design v0.1
3. authorize first actual controlled local-provider execution lane implementation v0.1
4. implement first actual controlled local-provider execution lane v0.1
5. review first actual controlled local-provider execution lane implementation v0.1
6. authorize first actual controlled local-provider execution dry-run v0.1
7. perform first actual controlled local-provider execution dry-run v0.1
8. review first actual controlled local-provider execution dry-run v0.1
9. close first actual controlled local-provider execution lane v0.1

This design PR only performs step 1.

## Execution identity design

The future lane must define all of these before any execution can happen:

- provider family
- provider name
- provider version, if available
- provider binary or runtime identity, if applicable
- provider installation source, if applicable
- provider local/remote classification
- model family
- model name
- model version or digest, if available
- model local/remote classification
- endpoint type
- endpoint URL or explicit none
- localhost use
- Ollama use
- OpenAI-compatible endpoint use
- OpenAI API use
- network access class
- environment variables
- secret variables
- credential acceptance policy
- endpoint variable acceptance policy
- model variable acceptance policy
- fallback provider policy
- fallback model policy
- hidden endpoint policy
- rerun policy

## Execution authorization gates design

The future lane must include explicit booleans for:

- provider execution authorized
- model call authorized
- OpenAI API use authorized
- network access authorized
- localhost access authorized
- Ollama access authorized
- OpenAI-compatible endpoint access authorized
- secrets authorized
- runtime/API/UI wiring authorized
- artifact creation authorized
- report creation authorized
- evidence-pack creation authorized
- publication framing authorized
- provider-output evidence authorized
- candidate-truth evidence authorized
- origin evidence authorized
- model-quality evidence authorized
- publication evidence authorized
- execution-safety evidence authorized

All of these remain false in this design PR.

## Input and prompt boundary design

The future lane must define before execution:

- input source
- input text or fixture path
- prompt source
- prompt hash or explicit no-hash reason
- prompt mutability policy
- manual prompt override policy
- hidden prompt policy
- system/developer/user prompt boundary
- deterministic input replay policy
- candidate-generation relationship
- eval/cohort relationship
- publication relationship

This design PR does not create a prompt and does not authorize a prompt.

## Output and capture boundary design

The future lane must define before execution:

- output capture path
- stdout/stderr capture policy
- provider raw output storage policy
- provider normalized output policy
- redaction policy
- secret leakage check
- endpoint leakage check
- model identity leakage check
- artifact creation policy
- report creation policy
- evidence-pack creation policy
- publication claim policy
- deletion/rollback policy

This design PR does not create output capture, artifacts, reports, evidence packs, or publication framing.

## Failure and stop-condition design

The future lane must stop if:

- provider identity is missing
- model identity is missing
- endpoint identity is missing when required
- endpoint is not explicitly authorized
- OpenAI API use is attempted
- unauthorized network access is attempted
- unauthorized localhost access is attempted
- unauthorized Ollama access is attempted
- unauthorized OpenAI-compatible endpoint access is attempted
- secrets are required
- secrets are read
- fallback provider is selected
- fallback model is selected
- hidden endpoint is used
- hidden prompt is used
- source/runtime/API/UI wiring changes are required
- tests must be changed
- fixtures must be mutated
- schemas must be mutated
- package metadata must change
- CI must change
- artifacts are created without authorization
- reports are created without authorization
- evidence packs are created without authorization
- provider-output evidence is claimed without authorization
- candidate-truth evidence is claimed without authorization
- origin evidence is claimed without authorization
- model-quality evidence is claimed without authorization
- publication evidence is claimed without authorization
- execution-safety evidence is claimed without authorization

## Source chain

Record:

- PR #1375 — docs(open-instrument): clarify controlled local-provider post-assessment next step v0.1
- PR #1376 — docs(open-instrument): design first controlled local-provider execution authorization lane v0.1
- PR #1377 — docs(open-instrument): review first controlled local-provider execution authorization lane design v0.1
- PR #1378 — docs(open-instrument): authorize first controlled local-provider execution authorization lane implementation v0.1
- PR #1379 — docs(open-instrument): implement first controlled local-provider execution authorization lane v0.1
- PR #1380 — docs(open-instrument): review first controlled local-provider execution authorization lane implementation v0.1
- PR #1381 — docs(open-instrument): close first controlled local-provider execution authorization lane v0.1
- this design PR

Record source documents:

- docs/open-instrument/open-instrument-controlled-local-provider-post-assessment-next-step-clarification-v0.1.md
- docs/open-instrument/open-instrument-first-controlled-local-provider-execution-authorization-lane-design-v0.1.md
- docs/open-instrument/open-instrument-first-controlled-local-provider-execution-authorization-lane-design-review-v0.1.md
- docs/open-instrument/open-instrument-first-controlled-local-provider-execution-authorization-lane-implementation-authorization-v0.1.md
- docs/open-instrument/open-instrument-first-controlled-local-provider-execution-authorization-lane-implementation-v0.1.md
- docs/open-instrument/open-instrument-first-controlled-local-provider-execution-authorization-lane-implementation-review-v0.1.md
- docs/open-instrument/open-instrument-first-controlled-local-provider-execution-authorization-lane-close-v0.1.md

Record source merge commits:

- PR #1376 — `7630f9d4787a239846efcadfd037c1d124c1023e`
- PR #1377 — `9fd8b680da8a24d7d9cefc1fcc8204dc673f6c48`
- PR #1378 — `275cf2bf29fe05fdcced26291065dddf36965082`
- PR #1379 — `f1f605398d5571a5ea2f252f29e408925a1be401`
- PR #1380 — `0f1863ce61992044a828ce81bb95e3fd8bb495a4`
- PR #1381 — `db23bb77187f895029b7c8dd8ce5669dce20ecd7`

## Current authorization state

State:

- provider execution authorized: false
- model call authorized: false
- OpenAI API use authorized: false
- network access authorized: false
- localhost access authorized: false
- Ollama access authorized: false
- OpenAI-compatible endpoint access authorized: false
- secrets authorized: false
- runtime/API/UI wiring authorized: false
- artifact creation authorized: false
- report creation authorized: false
- evidence-pack creation authorized: false
- publication framing authorized: false
- provider-output evidence authorized: false
- candidate-truth evidence authorized: false
- origin evidence authorized: false
- model-quality evidence authorized: false
- publication evidence authorized: false
- execution-safety evidence authorized: false

## Non-authorization statement

Repeat:

- this design is not provider execution
- this design is not model execution
- this design is not OpenAI API use
- this design is not network access
- this design is not localhost access
- this design is not Ollama access
- this design is not OpenAI-compatible endpoint access
- this design is not provider-execution readiness
- this design is not model-quality evidence
- this design is not origin evidence
- this design is not candidate-truth evidence
- this design is not publication evidence
- this design is not execution-safety evidence
- this design only defines requirements for a future actual controlled local-provider execution lane

## Next accepted task

docs(open-instrument): review first actual controlled local-provider execution lane design v0.1

That future review must remain docs-only.

That future review must not execute providers or call models.

That future review must not authorize OpenAI API use by itself.

That future review must not authorize network access by itself.

That future review must not authorize localhost access by itself.

That future review must not authorize Ollama access by itself.

That future review must not authorize OpenAI-compatible endpoint access by itself.

That future review must not authorize secrets by itself.
