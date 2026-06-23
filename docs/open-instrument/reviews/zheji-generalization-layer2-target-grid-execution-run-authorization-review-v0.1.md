# Layer 2 Target-Grid Execution Run Authorization Review v0.1

Status: LAYER2_TARGET_GRID_EXECUTION_RUN_AUTHORIZATION_REVIEWED_ACCEPTED_READY_FOR_ONE_CONTROLLED_FUNCTIONAL_MOTIVATION_RUN.

Review date: 2026-06-23.

Reviewed base:

* Short SHA: `07c049f8`
* Full SHA: `07c049f859d39004560b15d7b85fbca029e028db`
* Subject: `docs(open-instrument): define Layer 2 target-grid execution run authorization v0.1`

Reviewed authorization definition:

* `docs/open-instrument/zheji-generalization-layer2-target-grid-execution-run-authorization-v0.1.md`

Reviewed runner:

* `scripts/openInstrumentLayer2TargetGridExecutionRunner.v0.1.mjs`
* `tests/openInstrument.layer2TargetGridExecutionRunner.v0.1.spec.ts`

Future artifact path:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`

## Review decision

The Layer 2 target-grid execution run authorization is reviewed and accepted.

This review grants permission for exactly one future controlled local-only target-grid run.

The run is for functional motivation observation only.

The run is not for origin proof.

The run is not for publication evidence.

The run is not for winner-crowning.

The run is not for scientific discovery claims.

## Correct ZËRO frame

The purpose of the future run is to test whether the word `comic` can be meaning-functionally motivated through embryo-level decomposition.

The target surface is:

* `comic`

The reviewed segmentation is:

* `COM + IC`

The desired observation type is:

* functional embryo / morpheme-like carrier candidate
* meaning-function explanation
* null if no clean motivation is found

The desired observation type is not:

* origin proof
* etymology proof
* final truth claim
* publication-ready evidence

## Execution base rule

The exact reviewed execution base for the future run is the post-merge main SHA of this authorization review PR.

The future execution script must:

* sync `main`
* print the current full SHA
* assert it equals the reviewed post-review main SHA
* pass that exact SHA to `--reviewed-execution-base-sha`
* run from a clean repo
* fail closed if `HEAD` differs

## Accepted future command shape

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

Accepted target grid

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

Accepted provider identity

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

Accepted output artifact

The future execution may write exactly one artifact:

docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json

No other repo file may be changed by the execution PR.

Accepted execution limits

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

Accepted output classifications

The future artifact may report exactly one of:

TARGET_GRID_SIGNAL_PRESENT
TARGET_GRID_ALL_NULL_ACCEPTED
TARGET_GRID_DEGENERATE_BLOCKED
TARGET_GRID_PARTIAL_INVALIDATED
TARGET_GRID_EXECUTION_BLOCKED

A signal means only that one or more functional-motivation candidates passed the current development contract.

A null means only that no clean functional motivation was found under the current target grid.

A blocked or invalidated result means repair is required before interpretation.

Evidence boundary

Provider output is development-only functional motivation observation.

Provider output is not origin evidence.

Provider output is not candidate-truth evidence.

Provider output is not publication evidence.

Provider output is not ownership evidence.

Provider output is not model-quality evidence.

Provider output is not execution-safety evidence.

Post-run review is required before any interpretation beyond development-only functional motivation observation.

Boundary proof for this PR

No target-grid execution occurred in this review PR.

No provider execution occurred in this review PR.

No model call occurred in this review PR.

No localhost/Ollama call occurred in this review PR.

No remote endpoint use occurred in this review PR.

No hosted OpenAI endpoint use occurred in this review PR.

No DeepSeek endpoint use occurred in this review PR.

No artifact mutation occurred in this review PR.

No source/runtime/API/UI behavior change occurred in this review PR.

No schema/package/CI change occurred in this review PR.

No evidence promotion occurred in this review PR.

No publication framing occurred in this review PR.

No winner-crowning occurred in this review PR.

Next accepted task

test(open-instrument): execute reviewed Layer 2 target-grid functional motivation replay v0.1
