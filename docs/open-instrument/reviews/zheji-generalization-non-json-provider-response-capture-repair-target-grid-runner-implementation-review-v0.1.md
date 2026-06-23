# Non-JSON provider response capture repair implementation review v0.1

Date: 2026-06-24

Status: NON_JSON_PROVIDER_RESPONSE_CAPTURE_REPAIR_IMPLEMENTATION_REVIEWED_ACCEPTED_READY_FOR_RERUN_AUTHORIZATION.

Reviewed implementation base:

* Short SHA: `6f52bb6b`
* Full SHA: `6f52bb6b1a506ec82d40ce7cfe22c6a15e2286d3`
* Subject: `test(open-instrument): implement non-json provider response capture repair for target-grid runner v0.1`

Prerequisite definition review:

* `docs/open-instrument/reviews/zheji-generalization-non-json-provider-response-capture-repair-target-grid-runner-definition-review-v0.1.md`

## Review verdict

The non-JSON provider response capture repair implementation is accepted.

The target-grid runner now has a target-level capture path for provider message content that is not one strict JSON object.

This review does not authorize a rerun.

A new execution authorization is required before any provider/model call.

## Accepted implementation behavior

The implementation is accepted because it proves:

* provider message content parse failure is represented by `provider message content must be one JSON object`
* non-JSON provider message content becomes `TARGET_INVALIDATED`
* non-JSON provider message content does not become a candidate
* non-JSON provider message content does not become null-accepted
* provider raw payload hash is preserved when available
* response text hash is preserved when available
* aggregate artifact construction remains covered by runner self-check
* strict JSON-only prompt contract remains intact
* local-only provider constraints remain intact
* automatic retry remains blocked

## Reviewed implementation surfaces

Reviewed files:

* `scripts/openInstrumentLayer2TargetGridExecutionRunner.v0.1.mjs`
* `tests/openInstrument.layer2TargetGridExecutionRunner.v0.1.spec.ts`

Accepted source markers:

* `NON_JSON_PROVIDER_RESPONSE_CAPTURE_REPAIR_V0_1`
* `PROVIDER_MESSAGE_CONTENT_JSON_OBJECT_ERROR`
* `buildProviderNonJsonInvalidatedTargetResult`
* `TARGET_INVALIDATED`
* `allNonJsonInvalidatedArtifact`

## Checks used

The review used:

* implementation base SHA proof
* prerequisite definition review proof
* `node --check scripts/openInstrumentLayer2TargetGridExecutionRunner.v0.1.mjs`
* source marker proof
* no automatic retry proof against runner source
* helper behavior proof without provider call
* runner self-check with `--self-check`
* `npm test -- tests/openInstrument.layer2TargetGridExecutionRunner.v0.1.spec.ts --runInBand`
* `npm test -- tests/openInstrument.functionalEmbryoPromptDeliveryAttestationRepair.v0.1.spec.ts --runInBand`
* `npm test -- tests/openInstrument.layer2ChunkLanguageTargetGrid.scaffold.v0.1.spec.ts --runInBand`
* `npm run gate:quick`
* `npm run build`
* `git diff --check`

## Boundaries

This review is development-only.

It does not:

* execute a replay
* call a provider
* call a model
* mutate an artifact
* authorize rerun
* accept any candidate
* interpret any candidate
* prove functional motivation
* prove origin
* crown a winner
* create publication evidence
* promote evidence

## Required next step

Because the prior rerun authorization was already consumed by an aborted provider-output attempt, a fresh execution authorization must be defined and reviewed before any new rerun.

The new authorization must name this reviewed implementation base.

## Next accepted task

`docs(open-instrument): define functional embryo repaired target-grid rerun authorization after non-json capture repair v0.1`
