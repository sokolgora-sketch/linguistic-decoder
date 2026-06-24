# Functional embryo repaired target-grid rerun authorization after non-JSON capture repair review v0.1

Date: 2026-06-24

Status: FUNCTIONAL_EMBRYO_REPAIRED_TARGET_GRID_RERUN_AUTHORIZATION_AFTER_NON_JSON_CAPTURE_REPAIR_REVIEWED_ACCEPTED_READY_FOR_ONE_CONTROLLED_LOCAL_EXECUTION.

Reviewed authorization definition:

* `docs/open-instrument/zheji-generalization-functional-embryo-repaired-target-grid-rerun-authorization-after-non-json-capture-repair-v0.1.md`

Authorization definition base:

* Short SHA: `4be635ec`
* Full SHA: `4be635ec6a71fd7aab57aafc360c454c88a36a72`
* Subject: `docs(open-instrument): define functional embryo repaired target-grid rerun authorization after non-json capture repair v0.1`

Authorized execution base:

* `6f52bb6b1a506ec82d40ce7cfe22c6a15e2286d3`

## Review verdict

The rerun authorization after non-JSON provider response capture repair is accepted.

Exactly one future controlled local-only execution PR is authorized.

The future execution PR must execute from the authorized execution base, not from this review commit.

This review does not itself execute the rerun.

This review does not call a provider or model.

## Authorized provider identity

The future execution PR must use exactly:

* providerFamily: `local_only_openai_compatible`
* providerName: `ollama_openai_compat`
* model: `llama3.1:8b`
* endpointClass: `localhost_only`
* baseUrl: `http://127.0.0.1:11434/v1`

No API key is allowed.

No Authorization header is allowed.

No Bearer token is allowed.

No hosted OpenAI endpoint is allowed.

No DeepSeek endpoint is allowed.

No remote provider endpoint is allowed.

## Authorized artifact path

The future execution PR may mutate exactly one artifact:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`

No runner code changes are authorized in the execution PR.

No test changes are authorized in the execution PR.

No schema/package/CI changes are authorized in the execution PR.

## Required future execution command shape

```bash
node scripts/openInstrumentLayer2TargetGridExecutionRunner.v0.1.mjs \
  --execute-reviewed-layer2-target-grid \
  --reviewed-execution-base-sha 6f52bb6b1a506ec82d40ce7cfe22c6a15e2286d3 \
  --provider-family local_only_openai_compatible \
  --provider-name ollama_openai_compat \
  --model llama3.1:8b \
  --endpoint-class localhost_only \
  --base-url http://127.0.0.1:11434/v1 \
  --output docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json
Required pre-execution checks

Before any provider/model call, the future execution PR must prove:

current branch is exactly 6f52bb6b1a506ec82d40ce7cfe22c6a15e2286d3
runner source contains NON_JSON_PROVIDER_RESPONSE_CAPTURE_REPAIR_V0_1
runner source contains buildProviderNonJsonInvalidatedTargetResult
runner source contains PROVIDER_MESSAGE_CONTENT_JSON_OBJECT_ERROR
runner source contains TARGET_INVALIDATED
runner source has no retry surface
runner self-check passes with --self-check
actual Layer 2 requestBody prompt proof passes
prompt-delivery attestation regression test passes
Layer 2 runner test passes
Layer 2 scaffold test passes
local-only provider identity matches exactly
target artifact path matches exactly
Expected behavior during execution

If provider message content is not one strict JSON object, the runner must capture the affected target as TARGET_INVALIDATED.

Non-JSON provider output must not become a candidate.

Non-JSON provider output must not become null-accepted.

Automatic retry remains blocked.

If deterministic artifact construction remains possible, the artifact must still be written.

Review checks used

The review used:

authorization definition status proof
authorized execution base proof
provider identity proof
output artifact path proof
runner source marker proof
no automatic retry proof against runner source
runner self-check with --self-check
actual Layer 2 requestBody prompt proof
focused tests
npm run gate:quick
npm run build
git diff --check
Claim boundary

This review is development-only.

It does not prove origin.

It does not prove functional motivation.

It does not prove any candidate true.

It does not crown a winner.

It does not create publication evidence.

It does not promote evidence.

It only authorizes one future controlled local-only rerun under the reviewed conditions.

Current PR scope

This PR is docs-only.

This PR does not:

execute a replay
call a provider
call a model
mutate an artifact
change runner code
change tests
change schema
change package files
change CI
promote evidence
frame results for publication
Next accepted task

test(open-instrument): execute reviewed functional embryo repaired target-grid rerun after non-json capture repair v0.1
