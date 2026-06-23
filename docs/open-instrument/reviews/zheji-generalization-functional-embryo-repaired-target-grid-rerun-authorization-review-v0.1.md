# Functional embryo repaired target-grid rerun authorization review v0.1

Date: 2026-06-23

Status: FUNCTIONAL_EMBRYO_REPAIRED_TARGET_GRID_RERUN_AUTHORIZATION_REVIEWED_ACCEPTED_READY_FOR_ONE_CONTROLLED_LOCAL_EXECUTION.

Reviewed authorization definition:

* `docs/open-instrument/zheji-generalization-functional-embryo-repaired-target-grid-rerun-authorization-v0.1.md`

Authorization definition base:

* Short SHA: `baff6dea`
* Full SHA: `baff6deade2e1cf748489ea10746d627763e4053`
* Subject: `docs(open-instrument): define functional embryo repaired target-grid rerun authorization v0.1`

Authorized execution base named by the authorization definition:

* Short SHA: `9ca6dfd5`
* Full SHA: `9ca6dfd592b4109acd96adfb2327cfa613d0c333`
* Subject: `docs(open-instrument): review functional embryo prompt-delivery attestation repair implementation v0.1`

## Review verdict

The repaired target-grid rerun authorization definition is accepted.

This review authorizes exactly one future controlled local-only execution PR using the reviewed Layer 2 target-grid runner and the repaired prompt-delivery / attestation validator base.

This review does not itself execute the rerun.

## Authorized future execution

The next execution PR may run exactly one repaired Layer 2 target-grid replay for:

* word: `comic`
* stage: `MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`
* segmentation: `COM + IC`
* chunks: `COM`, `IC`
* candidate languages: `Albanian`, `Latin`, `Greek`, `Sanskrit`
* target count: `8`

The future execution must use:

* runner: `scripts/openInstrumentLayer2TargetGridExecutionRunner.v0.1.mjs`
* output artifact: `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`
* execution flag: `--execute-reviewed-layer2-target-grid`

## Required execution base

The authorization definition names this required repaired implementation base:

* `9ca6dfd592b4109acd96adfb2327cfa613d0c333`

The future execution script must verify its reviewed execution base before any provider/model call.

## Required provider identity

The future execution is limited to the reviewed local-only provider identity:

* providerFamily: `local_only_openai_compatible`
* providerName: `ollama_openai_compat`
* model: `llama3.1:8b`
* endpointClass: `localhost_only`
* baseUrl: `http://127.0.0.1:11434/v1`

The future execution must not use:

* remote endpoints
* OpenAI-hosted endpoints
* DeepSeek endpoints
* API keys
* Authorization headers
* Bearer tokens

## Required pre-execution checks

The future execution script must prove all of the following before any provider/model call:

* clean working tree
* reviewed execution base SHA is explicitly supplied
* current `HEAD` equals the reviewed execution base SHA
* this authorization review status is present or the execution PR cites this review status
* actual single-call prompt output contains `<ISOLATION_AUDIT>`
* actual single-call prompt output contains `<RESPONSE_ENVELOPE_REQUIRED>`
* actual single-call prompt output contains `<CLAIM_BOUNDARY_REQUIRED>`
* actual single-call prompt output contains `attested_standalone_form`
* actual single-call prompt output rejects `reasonably_inferred`
* actual Layer 2 printed request bodies contain `<ISOLATION_AUDIT>`
* actual Layer 2 printed request bodies contain `<RESPONSE_ENVELOPE_REQUIRED>`
* actual Layer 2 printed request bodies contain `<CLAIM_BOUNDARY_REQUIRED>`
* actual Layer 2 printed request bodies contain `attested_standalone_form`
* actual Layer 2 printed request bodies reject `reasonably_inferred`
* Layer 2 scaffold validator contains attestation rejection logic
* prompt-delivery regression test passes
* Layer 2 runner test passes
* Layer 2 scaffold test passes

## Required execution command shape

The future execution command must include:

* `--execute-reviewed-layer2-target-grid`
* `--reviewed-execution-base-sha 9ca6dfd592b4109acd96adfb2327cfa613d0c333`
* `--provider-family local_only_openai_compatible`
* `--provider-name ollama_openai_compat`
* `--model llama3.1:8b`
* `--endpoint-class localhost_only`
* `--base-url http://127.0.0.1:11434/v1`
* `--output docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`

## Required post-execution handling

The future execution PR must:

* compute the artifact SHA-256
* print aggregate classification
* print each target classification
* verify artifact schema fields
* verify claimBoundary remains development-only
* verify no evidence promotion
* verify no publication framing
* verify no winner-crowning
* verify no origin evidence claim
* verify no candidate-truth evidence claim
* commit only the target-grid replay artifact
* not modify runner code
* not modify tests
* not modify schema
* not modify package files
* not modify CI config

## Allowed outcomes

The future repaired rerun may produce any of these aggregate outcomes:

* `TARGET_GRID_ALL_NULL_ACCEPTED`
* `TARGET_GRID_PARTIAL_INVALIDATED`
* `TARGET_GRID_SIGNAL_PRESENT`

A signal-present result is not truth by execution alone.

Any signal-present result requires a separate result-review PR before interpretation.

## Claim boundary

This review is development-only.

This review does not prove origin.

This review does not prove functional motivation.

This review does not prove a candidate true.

This review does not crown a winner.

This review does not create publication evidence.

This review does not promote evidence.

It only accepts the authorization definition for one future controlled local-only repaired target-grid rerun.

## Current PR scope

This review PR is docs-only.

This PR does not:

* execute a replay
* call a provider
* call a model
* mutate an artifact
* change runner code
* change tests
* change schema
* change package files
* change CI
* promote evidence
* frame results for publication

## Review checks

The review used:

* authorization definition status proof
* local-only provider identity proof
* authorization definition base proof
* authorized execution base proof
* actual single-call prompt proof
* actual Layer 2 requestBody prompt proof
* prompt-delivery regression test
* Layer 2 runner test
* Layer 2 scaffold test
* `npm run gate:quick`
* `npm run build`

## Next accepted task

`test(open-instrument): execute reviewed functional embryo repaired target-grid rerun v0.1`
