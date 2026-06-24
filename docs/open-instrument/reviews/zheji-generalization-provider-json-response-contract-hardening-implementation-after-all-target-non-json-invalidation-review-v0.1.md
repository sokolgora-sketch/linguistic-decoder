# Provider JSON response contract hardening implementation review v0.1

Date: 2026-06-24

Status: PROVIDER_JSON_RESPONSE_CONTRACT_HARDENING_IMPLEMENTATION_REVIEWED_ACCEPTED_READY_FOR_RERUN_AUTHORIZATION_DEFINITION.

Reviewed implementation base:

* Short SHA: `eb945b03`
* Full SHA: `eb945b03d02eb93946dd3bd559325fd7536a5d82`
* Subject: `test(open-instrument): implement provider JSON response contract hardening after all-target non-json invalidation v0.1`

Prerequisite next-action review:

* `docs/open-instrument/reviews/zheji-generalization-next-functional-embryo-action-after-repaired-target-grid-rerun-result-review-v0.1.md`

Artifact unchanged:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`
* SHA-256: `5ce461b11f2e8d6811b1ef4d607b189c83ab040003e9a93ea927d12a91d3193a`

## Review verdict

The provider JSON response contract hardening implementation is accepted.

The runner now includes reviewed requestBody JSON-object response hardening.

The runner self-check now verifies the JSON response contract.

The strict prompt-only JSON contract remains present.

The non-JSON fail-closed invalidation path remains present.

No automatic retry was added.

No provider/model execution occurred.

No artifact mutation occurred.

## Accepted implementation behavior

Accepted source markers:

* `PROVIDER_JSON_RESPONSE_CONTRACT_HARDENING_V0_1`
* `response_format`
* `type: "json_object"`
* `every request must require provider JSON object response format`
* `NON_JSON_PROVIDER_RESPONSE_CAPTURE_REPAIR_V0_1`
* `buildProviderNonJsonInvalidatedTargetResult`
* `TARGET_INVALIDATED`

Accepted requestBody behavior:

* every reviewed target request includes `response_format.type == "json_object"`
* every reviewed target request keeps temperature `0`
* every reviewed target request keeps model `llama3.1:8b`

Accepted safety behavior:

* no automatic retry
* no prose-to-candidate parsing
* no relaxation of attestation
* no relaxation of non-circular gloss requirements
* no artifact mutation
* no execution authorization in this PR

## Required next step

A fresh rerun authorization definition is required before any provider/model call.

The next authorization must name this reviewed implementation base.

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

This review is development-only.

It does not prove origin.

It does not prove functional motivation.

It does not prove any candidate true.

It does not crown a winner.

It does not create publication evidence.

It does not promote evidence.

It only accepts the implementation as ready for a separate rerun authorization definition.

## Checks used

The review used:

* implementation base proof
* prerequisite next-action review proof
* source marker proof
* requestBody JSON-contract proof with `--print-reviewed-requests`
* strict prompt proof with `--print-reviewed-requests`
* runner self-check with `--self-check`
* no automatic retry proof
* artifact unchanged SHA proof
* focused regression tests
* `npm run gate:quick`
* `npm run build`
* `git diff --check`

## Next accepted task

`docs(open-instrument): define repaired target-grid rerun authorization after provider JSON response contract hardening v0.1`
