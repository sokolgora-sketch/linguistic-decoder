# Layer 2 Target-Grid Execution Run Authorization v0.1

Status: LAYER2_TARGET_GRID_EXECUTION_RUN_AUTHORIZATION_DEFINED_PENDING_REVIEW.

Definition date: 2026-06-23.

Definition base:

* Short SHA: `c6bbe1b1`
* Full SHA: `c6bbe1b1498aec439d48cad03662dd243e70ce75`
* Subject: `docs(open-instrument): review Layer 2 target-grid execution runner implementation v0.1`

Reviewed runner:

* `scripts/openInstrumentLayer2TargetGridExecutionRunner.v0.1.mjs`
* `tests/openInstrument.layer2TargetGridExecutionRunner.v0.1.spec.ts`

Future artifact path:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`

## Purpose

This document defines the exact Layer 2 target-grid execution run authorization shape.

This document does not execute the target grid.

This document does not call a provider.

This document does not call a model.

This document does not mutate an artifact.

Execution is not granted by this definition alone.

A separate authorization review PR must merge before the execution run may occur.

## Authorization state

Current authorization state:

* `defined_pending_review`

Provider execution authorization:

* not yet granted

Model call authorization:

* not yet granted

Artifact write authorization:

* not yet granted

Evidence promotion authorization:

* not granted

Publication framing authorization:

* not granted

Winner-crowning authorization:

* not granted

## Future execution base rule

The reviewed execution base for the actual run must be the post-merge main SHA of the future authorization review PR.

That future exact SHA is intentionally not guessed in this definition PR.

The future execution script must:

* sync `main`
* print the current full SHA
* assert it equals the reviewed execution base from the authorization review
* pass that exact SHA to `--reviewed-execution-base-sha`
* run from a clean repo
* fail closed if `HEAD` differs

## Exact future command shape

The future execution command must have this shape:

```bash
node scripts/openInstrumentLayer2TargetGridExecutionRunner.v0.1.mjs \
  --execute-reviewed-layer2-target-grid \
  --reviewed-execution-base-sha <POST_AUTHORIZATION_REVIEW_MAIN_SHA> \
  --provider-family local_only_openai_compatible \
  --provider-name ollama_openai_compat \
  --model llama3.1:8b \
  --endpoint-class localhost_only \
  --base-url http://127.0.0.1:11434/v1 \
  --output docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json

No --api-key argument is allowed.

No Authorization header is allowed.

No Bearer token is allowed.

No hosted OpenAI endpoint is allowed.

No DeepSeek endpoint is allowed.

No remote provider endpoint is allowed.

Exact target grid

The future execution must run exactly these targets:

comic::COM::Albanian
comic::COM::Latin
comic::COM::Greek
comic::COM::Sanskrit
comic::IC::Albanian
comic::IC::Latin
comic::IC::Greek
comic::IC::Sanskrit

No target may be added.

No target may be removed.

Do not expand to all allowlisted languages yet.

Exact provider identity

The future execution must use:

providerFamily: local_only_openai_compatible
providerName: ollama_openai_compat
model: llama3.1:8b
endpointClass: localhost_only
baseUrl: http://127.0.0.1:11434/v1

No fallback provider is allowed.

No fallback model is allowed.

No automatic provider selection is allowed.

No silent rerun is allowed.

Exact output artifact

The future execution may write exactly one artifact:

docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json

The future execution may not write any other artifact.

The future execution may not modify source files.

The future execution may not modify tests.

The future execution may not modify docs.

The future execution may not modify package, schema, CI, API, runtime, or UI files.

Execution limits

Maximum execution count:

1

Maximum retry count:

0

Maximum rerun count:

0

Maximum provider fallback count:

0

Maximum model fallback count:

0

Maximum target expansion count:

0

The future execution must stop after one target-grid pass.

Required pre-run checks

The future execution script must prove:

repo path
branch is main
repo is clean
main is synced with origin/main
current HEAD equals the reviewed execution base
runner file exists
runner test exists
runner syntax passes
runner self-check passes
runner reviewed request print passes
output artifact path is either absent or unchanged before execution
no credential marker exists in the runner
no remote provider marker exists in the runner
Required post-run checks

The future execution script must prove:

runner exit status
output artifact exists
output artifact validates as JSON
artifact schema version
reviewed execution base SHA
provider identity
endpoint identity
target count is exactly 8
all target ids match the reviewed target grid
aggregate classification is one of the reviewed allowed classifications
claim boundary exists
no source/runtime/API/UI file changed
no test file changed
no docs file changed except DF_BRAIN after merge
output artifact is the only repo file changed in the execution PR
Allowed aggregate classifications

The future artifact may report exactly one of:

TARGET_GRID_SIGNAL_PRESENT
TARGET_GRID_ALL_NULL_ACCEPTED
TARGET_GRID_DEGENERATE_BLOCKED
TARGET_GRID_PARTIAL_INVALIDATED
TARGET_GRID_EXECUTION_BLOCKED

No classification may be converted into origin proof.

No classification may be converted into publication evidence.

No classification may crown a winner.

Evidence boundary

Provider output is development-only observation.

Provider output is not origin evidence.

Provider output is not candidate-truth evidence.

Provider output is not publication evidence.

Provider output is not ownership evidence.

Provider output is not model-quality evidence.

Provider output is not execution-safety evidence.

Post-run review is required before any interpretation beyond development-only observation.

Required next review

The next PR must review this authorization definition.

That review must either:

accept this authorization and name the exact post-review execution base workflow, or
reject it and require another docs-only repair.

No execution is allowed before that review merges.

Boundary proof for this PR

No target-grid execution occurred in this definition PR.

No provider execution occurred in this definition PR.

No model call occurred in this definition PR.

No localhost/Ollama call occurred in this definition PR.

No remote endpoint use occurred in this definition PR.

No hosted OpenAI endpoint use occurred in this definition PR.

No DeepSeek endpoint use occurred in this definition PR.

No artifact mutation occurred in this definition PR.

No source/runtime/API/UI behavior change occurred in this definition PR.

No schema/package/CI change occurred in this definition PR.

No evidence promotion occurred in this definition PR.

No publication framing occurred in this definition PR.

No winner-crowning occurred in this definition PR.

Next accepted task

docs(open-instrument): review Layer 2 target-grid execution run authorization v0.1
