# Non-JSON provider response capture repair for target-grid runner v0.1

Date: 2026-06-23

Status: NON_JSON_PROVIDER_RESPONSE_CAPTURE_REPAIR_DEFINED_PENDING_REVIEW.

Reviewed base for this repair definition:

* Short SHA: `87efbd52`
* Full SHA: `87efbd52a6f1f9c7f20afd37a9014195c51ff547`
* Subject: `docs(open-instrument): record functional embryo repaired target-grid rerun non-json provider abort v0.1`

Prerequisite abort record:

* `docs/open-instrument/reviews/zheji-generalization-functional-embryo-repaired-target-grid-rerun-non-json-provider-abort-v0.1.md`

## Problem

The reviewed repaired target-grid rerun reached the local provider/model call and then aborted with:

* `provider message content must be one JSON object`

This abort happened because the provider returned message content that did not satisfy the runner's strict JSON-only parser.

The runner correctly refused to treat the provider text as a valid candidate response.

However, the whole target-grid artifact was not produced.

## Required repair

The Layer 2 target-grid execution runner must be repaired so that provider non-JSON output is captured deterministically as an invalidated target result instead of aborting the whole artifact.

The repair must preserve the strict JSON-only contract.

It must not loosen the prompt.

It must not accept non-JSON as valid.

It must not convert non-JSON prose into a candidate.

It must not infer a candidate from malformed provider text.

It must not retry the provider call automatically.

## Required target-level behavior

For each target, if the provider returns message content that cannot be parsed as exactly one JSON object, the runner must create a deterministic invalidated target result for that target.

The target result must include:

* target id
* target metadata
* prompt hash
* request body hash
* provider raw payload hash when available
* response text hash when available
* outcomeClassification: `TARGET_INVALIDATED`
* validation.status: `failed`
* validation.errors containing `provider message content must be one JSON object`
* response object with the reviewed target identity echoed where possible
* `candidate: null`
* `nullAccepted: false`
* `claimBoundary` preserved as development-only

The invalidated target result must not be counted as a signal.

## Required aggregate behavior

If one or more target results are invalidated because of provider non-JSON output, the aggregate artifact must still be written.

The aggregate classification must follow existing aggregate semantics.

Expected likely aggregate classification for all non-JSON target failures:

* `TARGET_GRID_PARTIAL_INVALIDATED`

The repair must not introduce a new aggregate classification unless a separate schema review authorizes it.

## Required failure handling

The runner may still abort for infrastructure failures that prevent deterministic artifact construction, such as:

* missing output path
* dirty execution base mismatch
* invalid provider identity
* unreachable provider endpoint before a provider payload is available
* file write failure
* schema invariant failure in the runner itself

The runner must not abort merely because a target provider message is non-JSON after a payload was returned.

## Required tests

The implementation PR must add or update tests proving:

* a non-JSON provider message becomes a `TARGET_INVALIDATED` target result
* the runner writes an aggregate artifact when a provider message is non-JSON
* the invalidated target result includes the parser error
* non-JSON output does not become a candidate
* no automatic retry is performed
* the strict JSON-only prompt text remains present
* local-only provider constraints remain enforced
* existing prompt-delivery attestation tests still pass
* existing Layer 2 scaffold tests still pass
* existing Layer 2 runner tests still pass

## Required implementation scope

Allowed files for the implementation PR:

* `scripts/openInstrumentLayer2TargetGridExecutionRunner.v0.1.mjs`
* `tests/openInstrument.layer2TargetGridExecutionRunner.v0.1.spec.ts`

Optional only if the existing test file is the cleaner location:

* `tests/openInstrument.functionalEmbryoPromptDeliveryAttestationRepair.v0.1.spec.ts`

The implementation PR must not modify:

* target-grid artifact
* scaffold contract unless a separate review proves it is necessary
* schema/package/CI files
* UI/runtime/API files
* prompt wording except where required to preserve existing strict JSON-only contract

## Claim boundary

This repair definition is development-only.

It does not prove origin.

It does not prove functional motivation.

It does not prove any candidate true.

It does not crown a winner.

It does not create publication evidence.

It does not promote evidence.

It only defines how the runner must deterministically capture non-JSON provider output at target level.

## Current PR scope

This PR is docs-only.

This PR must not:

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

## Next accepted task

`docs(open-instrument): review non-json provider response capture repair definition for target-grid runner v0.1`
