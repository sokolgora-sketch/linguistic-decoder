# Open Instrument first controlled local-provider execution one-shot local-only record v0.1

Status: execution-record
Scope: first controlled local-provider execution one-shot local-only record

## Execution decision

The authorized one-shot local-only execution was attempted.

Execution outcome:

* `first_controlled_execution_post_run_review_required`

The one-shot authorization is consumed by this attempt.

No retry occurred.

No rerun occurred.

No second request occurred.

No second response occurred.

No paid OpenAI API use occurred.

No remote provider endpoint use occurred.

No secrets use occurred.

No runtime/API/UI wiring occurred.

No artifact creation occurred.

No evidence-pack creation occurred.

No publication framing occurred.

No provider-output scoring occurred.

No candidate ranking occurred.

No evidence promotion occurred.

## Authorization source

One-shot local-only authorization:

* PR #1441
* merge SHA: `aa972b500fa2e36e2f74b2d999d16c15e71603f3`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-one-shot-local-only-authorization-v0.1.md`

Execution lane design review:

* PR #1440
* merge SHA: `7146138301a3e92102cb62aebd46b03707cc542a`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-lane-design-review-v0.1.md`

Execution lane design:

* PR #1439
* merge SHA: `1425f9f8e3d6b004ce545dbdc4177b9499397160`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-lane-design-v0.1.md`

Execution readiness assessment:

* PR #1438
* merge SHA: `307996a6051651e02d46fddf1f752bf636c2a7c3`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-readiness-assessment-v0.1.md`

Run authorization closure assessment:

* PR #1437
* merge SHA: `6d48be15c5cacd9dacec19cc0de4a79844c85d53`
* document: `docs/open-instrument/open-instrument-first-controlled-local-provider-execution-run-authorization-lane-closure-assessment-v0.1.md`

Prior controlled execution response SHA-256:

* `a049322ed9cd37d5aa3916423c2b6c62671a0131685dfd0945ef363ad43cb40f`

## Provider and model identity

Provider family:

* `local`

Provider name:

* `ollama`

Provider version proof:

* `ollama version is 0.30.8 `

Model family:

* `ollama-local`

Model name:

* `llama3.1:8b`

Model identity proof:

* `ollama show llama3.1:8b` succeeded before execution.

Endpoint class:

* `ollama_local_http`

Endpoint URL class:

* `loopback_http`

Endpoint identity:

* `http://127.0.0.1:11434/api/generate`

Local endpoint proof SHA-256:

* `6e82b917ab7a55d0b9a9f22e6d02f9ce7a843643a276726722bf6a0ee0a3b033`

Local endpoint proof method:

* `curl --noproxy '*' --max-time 5 http://127.0.0.1:11434/api/version`

## Prompt, request, and response hashes

Prompt canonicalization method:

* checked-in execution script writes UTF-8 prompt file with trailing newline

Prompt SHA-256:

* `c423e701b6c9c5868b0fb0d2bae3760aaf39db0c06a89b664293d35a37df347b`

Request body canonicalization method:

* checked-in execution script writes pretty JSON with stable key order

Request body SHA-256:

* `cf1c5c6662d008f0af78cdbc89936875b6dae6515d74cca9b2fa725c7f53ad37`

Response capture method:

* `curl --noproxy '*' --max-time 120 -sS -H 'Content-Type: application/json' -X POST http://127.0.0.1:11434/api/generate --data-binary @request.json`

Response SHA-256:

* `4ed28de890a82de2106400038b5115ef34a1bf11e6df273f7eac0ed51983ebda`

Response stderr SHA-256:

* `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

Response bytes:

* `525`

Response stderr bytes:

* `0`

Curl exit code:

* `0`

Execution started at:

* `2026-06-19T03:13:37Z`

Execution finished at:

* `2026-06-19T03:13:43Z`

## Response preview

Response JSON preview:

* "{\"model\":\"llama3.1:8b\",\"created_at\":\"2026-06-19T03:13:42.995479Z\",\"response\":\"OPEN_INSTRUMENT_LOCAL_SMOKE_OK\",\"done\":true,\"done_reason\":\"stop\",\"context\":[128006,882,128007,271,5109,43405,2254,16603,1296,13,3494,832,2875,1584,8649,1193,25,30941,2207,6805,18380,29499,1117,10754,3472,8540,198,128009,128006,78191,128007,271,32033,2207,6805,18380,29499,1117,10754,3472,8540],\"total_duration\":5950083167,\"load_duration\":5056960250,\"prompt_eval_count\":33,\"prompt_eval_duration\":383330000,\"eval_count\":10,\"eval_duration\":499871000}"

Response text preview:

* "OPEN_INSTRUMENT_LOCAL_SMOKE_OK"

Response stderr preview:

* ""

## One-shot limit proof

Maximum execution count:

* `1`

Maximum request count:

* `1`

Maximum response count:

* `1`

Maximum retry count:

* `0`

Maximum rerun count:

* `0`

Actual execution count:

* `1`

Actual request count:

* `1`

Actual response capture count:

* `1`

Actual retry count:

* `0`

Actual rerun count:

* `0`

## Consumption proof

The one-shot authorization is consumed.

The consumed state is recorded after the attempt.

Future reuse is not authorized.

Future retry is not authorized.

Future rerun is not authorized.

A new reviewed authorization is required for any future execution.

## Candidate-only result boundary

The execution result is candidate-only.

Allowed class:

* `local_provider_execution_capture_record`

Allowed companion classes:

* `local_smoke_transcript`
* `prompt_response_capture_record`
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

## Blocked evidence classes

The following remain blocked:

* `provider_output_evidence`
* `parser_compatibility_evidence`
* `reproducibility_evidence`
* `candidate_truth_evidence`
* `origin_evidence`
* `model_quality_evidence`
* `publication_evidence`
* `execution_safety_evidence`

No evidence promotion occurred.

No candidate truth was granted.

No origin evidence was granted.

No model-quality evidence was granted.

No publication evidence was granted.

No execution-safety evidence was granted.

## Non-promotion statement

The provider output is not evidence.

The provider output is not candidate truth.

The provider output is not origin evidence.

The provider output is not model-quality evidence.

The provider output is not publication evidence.

The provider output is not execution-safety evidence.

The provider output is not promoted.

## Execution conclusion

The one-shot local-only execution authorization is consumed.

The execution record is complete.

The result remains candidate-only.

Post-run review is required before any further classification.

## Next accepted task

`docs(open-instrument): review first controlled local-provider one-shot execution result v0.1`
