# Non-JSON provider response capture repair definition review v0.1

Date: 2026-06-23

Status: NON_JSON_PROVIDER_RESPONSE_CAPTURE_REPAIR_DEFINITION_REVIEWED_ACCEPTED_READY_FOR_IMPLEMENTATION.

Reviewed repair definition:

* `docs/open-instrument/zheji-generalization-non-json-provider-response-capture-repair-target-grid-runner-v0.1.md`

Reviewed base:

* Short SHA: `b8a3a306`
* Full SHA: `b8a3a30691cd5db0b68348f9c8b36046129333ed`
* Subject: `docs(open-instrument): define non-json provider response capture repair for target-grid runner v0.1`

## Review verdict

The non-JSON provider response capture repair definition is accepted.

The next implementation PR may update the target-grid runner so that provider non-JSON message content becomes a deterministic target-level invalidation instead of aborting the whole artifact.

This review does not authorize a rerun.

This review does not call a provider or model.

## Accepted repair requirements

The accepted implementation requirements are:

* Preserve the strict JSON-only prompt contract.
* Preserve non-JSON provider output as invalid.
* Do not accept non-JSON as valid.
* Do not infer a candidate from malformed provider text.
* Do not convert provider prose into a candidate.
* Do not automatically retry the provider call.
* Capture provider non-JSON output at target level.
* Produce `TARGET_INVALIDATED` for the affected target.
* Include `provider message content must be one JSON object` in validation errors.
* Preserve prompt hash and request body hash.
* Preserve provider raw payload hash when available.
* Preserve response text hash when available.
* Preserve development-only `claimBoundary`.
* Continue writing an aggregate artifact when deterministic artifact construction is possible.
* Keep existing aggregate classification semantics.
* Do not add a new aggregate classification in this repair.

## Accepted implementation scope

Allowed files for the implementation PR:

* `scripts/openInstrumentLayer2TargetGridExecutionRunner.v0.1.mjs`
* `tests/openInstrument.layer2TargetGridExecutionRunner.v0.1.spec.ts`

Optional only if the implementation naturally belongs there:

* `tests/openInstrument.functionalEmbryoPromptDeliveryAttestationRepair.v0.1.spec.ts`

Not allowed without a separate review:

* target-grid artifact mutation
* scaffold contract mutation
* schema changes
* package changes
* CI changes
* UI/runtime/API changes
* evidence promotion
* publication framing

## Required tests for implementation

The implementation PR must prove:

* non-JSON provider message becomes a `TARGET_INVALIDATED` target result
* the runner writes an aggregate artifact when a provider message is non-JSON
* the invalidated target result includes the parser error
* non-JSON output does not become a candidate
* no automatic retry is performed
* strict JSON-only prompt text remains present
* local-only provider constraints remain enforced
* existing prompt-delivery attestation tests still pass
* existing Layer 2 scaffold tests still pass
* existing Layer 2 runner tests still pass

## Claim boundary

This review is development-only.

It does not prove origin.

It does not prove functional motivation.

It does not prove any candidate true.

It does not crown a winner.

It does not create publication evidence.

It does not promote evidence.

It only accepts the repair definition for implementation.

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

## Review checks

The review used:

* repair definition status proof
* abort-record phrase proof
* target-level invalidation requirement proof
* `node --check` for current runner/scaffold files
* prompt-delivery attestation regression test
* current Layer 2 runner test
* current Layer 2 scaffold test
* `npm run gate:quick`
* `npm run build`

## Next accepted task

`test(open-instrument): implement non-json provider response capture repair for target-grid runner v0.1`
