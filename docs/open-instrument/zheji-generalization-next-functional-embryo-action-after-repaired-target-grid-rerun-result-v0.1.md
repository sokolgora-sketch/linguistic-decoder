# Next functional-embryo action after repaired target-grid rerun result v0.1

Date: 2026-06-24

Status: NEXT_FUNCTIONAL_EMBRYO_ACTION_AFTER_REPAIRED_TARGET_GRID_RERUN_RESULT_DEFINED_PENDING_REVIEW.

Result review base:

* Short SHA: `31959389`
* Full SHA: `319593896ec47ba0e5c296d11649567d70a548f0`
* Subject: `docs(open-instrument): review functional embryo repaired target-grid rerun after non-json capture repair result v0.1`

Reviewed result document:

* `docs/open-instrument/reviews/zheji-generalization-functional-embryo-repaired-target-grid-rerun-after-non-json-capture-repair-result-review-v0.1.md`

Reviewed artifact:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`
* SHA-256: `5ce461b11f2e8d6811b1ef4d607b189c83ab040003e9a93ea927d12a91d3193a`

## Result facts

The repaired target-grid rerun produced no interpretable functional-embryo candidate result.

Observed aggregate:

* `TARGET_GRID_PARTIAL_INVALIDATED`

Observed target counts:

* signal present: `0`
* null accepted: `0`
* invalidated: `8`
* degenerate blocked: `0`
* non-JSON invalidated: `8`

All eight targets were invalidated because provider message content was not one strict JSON object.

## Decision

The next action is provider JSON response contract hardening.

Do not rerun the same target grid again without a JSON-contract hardening implementation.

Do not review candidates because there are no compliant candidates.

Do not promote any result.

Do not interpret all-target non-JSON invalidation as a linguistic finding.

## Required next implementation lane after review

If this next-action definition is reviewed and accepted, the next implementation PR may be:

`test(open-instrument): implement provider JSON response contract hardening after all-target non-json invalidation v0.1`

That implementation may update only the target-grid runner and its tests to strengthen the request-side JSON contract.

## Allowed future implementation scope

Allowed files after review:

* `scripts/openInstrumentLayer2TargetGridExecutionRunner.v0.1.mjs`
* `tests/openInstrument.layer2TargetGridExecutionRunner.v0.1.spec.ts`
* optionally `tests/openInstrument.functionalEmbryoPromptDeliveryAttestationRepair.v0.1.spec.ts` if requestBody prompt proof must be updated

Allowed implementation behavior after review:

* add a deterministic OpenAI-compatible JSON-object response-format request hint if implemented directly in requestBody
* prove requestBody includes the JSON-contract hardening field or equivalent reviewed hardening marker
* prove strict prompt-only JSON contract remains present
* prove local-only provider identity remains unchanged
* prove no automatic retry is added
* prove no artifact mutation occurs in the implementation PR
* prove no provider/model call occurs in the implementation PR

Not allowed without a separate review:

* provider/model execution
* artifact mutation
* schema changes
* package changes
* CI changes
* UI/runtime/API changes
* evidence promotion
* publication framing
* candidate review
* candidate promotion
* origin claim
* winner-crowning

## Required hardening boundary

The hardening must remain fail-closed.

If a future provider still returns non-JSON message content, the runner must continue to produce `TARGET_INVALIDATED`.

The hardening must not parse prose into candidates.

The hardening must not infer candidates from malformed output.

The hardening must not automatically retry.

The hardening must not relax attested-standalone-form rules.

The hardening must not relax non-circular gloss rules.

## Current PR scope

This PR is docs-only.

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

## Claim boundary

This document is development-only.

It does not prove origin.

It does not prove functional motivation.

It does not prove any candidate true.

It does not crown a winner.

It does not create publication evidence.

It does not promote evidence.

It only defines the next repair lane after an all-target non-JSON invalidated result.

## Next accepted task

`docs(open-instrument): review next functional-embryo action after repaired target-grid rerun result v0.1`
