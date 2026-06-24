# Source-language scope decision after comic lane and test-discovery closure v0.1

Date: 2026-06-24

Status: SOURCE_LANGUAGE_SCOPE_DECISION_AFTER_COMIC_LANE_AND_TEST_DISCOVERY_CLOSURE_DEFINED_PENDING_REVIEW.

Definition base:

* Short SHA: `a4dfaeca`
* Full SHA: `a4dfaeca9040cff35e57d8380938ab9dfdb49337`
* Subject: `docs(open-instrument): review undiscovered test files gate exposure implementation v0.1`

Reviewed inputs:

* Test-discovery review: `docs/open-instrument/reviews/zheji-generalization-undiscovered-test-files-gate-exposure-implementation-review-v0.1.md`
* Comic result review: `docs/open-instrument/reviews/zheji-generalization-repaired-target-grid-rerun-after-provider-json-response-contract-hardening-result-review-v0.1.md`
* Next-action review: `docs/open-instrument/reviews/zheji-generalization-next-action-after-repaired-target-grid-rerun-after-provider-json-response-contract-hardening-result-review-v0.1.md`
* Replay script with current source-language resolver: `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`
* Comic artifact: `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`
* Comic artifact SHA-256: `51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65`

## Context

The exact English `comic` JSON-hardening rerun loop is complete for its current lane.

The reviewed artifact result was:

* aggregate: `TARGET_GRID_ALL_NULL_ACCEPTED`
* target null accepted: `8/8`
* validation passed: `8/8`
* candidates present: `0`
* non-JSON errors: `0`

The test-discovery gap under `tests/` is now reviewed as closed.

The normal unit gate now includes the previously hidden tests and reports:

* `431 passed, 431 of 434 total`

## Current source-language problem

The current generalization replay source-language resolver is not a real resolver.

The known function is:

* `sourceLanguageForRequest`

The current behavior returns English in both branches.

That behavior was safe only by coincidence for the exact English `comic` lane.

It is not safe as a general source-language mechanism.

It must not be used as proof that source-language anti-tautology generalizes to non-English source targets.

## Decision

The current `comic` lane is formally scoped as English-source-only.

All claims derived from this lane are limited to the exact English target word `comic`.

The current all-null result means only:

* the reviewed English `comic` COM/IC x Albanian/Latin/Greek/Sanskrit target grid found no compliant candidate under the current strict contract

It does not mean:

* the word `comic` has no possible functional motivation
* no other segmentation could ever be useful
* no other candidate-language field could ever produce a compliant candidate
* source-language anti-tautology protection generalizes to non-English source targets
* the current resolver is production-general

## Immediate policy

Until a reviewed implementation changes this, the generalization replay must be treated as English-source-only.

No non-English source target may be authorized through this replay path.

No broad source-language claim may be made from the current resolver.

No future rerun may cite the current resolver as a real source-language resolver.

Any future replay request must either:

* explicitly declare English-source-only scope, or
* use a reviewed source-language scope guard that rejects unsupported source languages, or
* use a reviewed real source-language resolver

## Next implementation lane

After review, the next implementation lane should add a source-language scope guard.

First implementation task after this decision review:

`test(open-instrument): implement source-language scope guard for generalization replay v0.1`

Purpose:

* make the English-source-only status explicit in code or replay metadata
* fail closed for unsupported non-English source targets
* prevent the current `return English` behavior from being mistaken for a real resolver
* preserve the reviewed `comic` result and artifact
* avoid provider/model execution
* avoid artifact mutation
* avoid candidate-language or seven-voice SSOT cleanup in the same PR

## Required implementation boundaries for the next lane

The next implementation PR should not:

* execute a replay
* call a provider
* call a model
* mutate the comic artifact
* change candidate selection logic
* change candidate-language registry logic
* change seven-voice metadata logic
* change UI/runtime/API behavior
* change Firestore behavior

The next implementation PR may:

* add a source-language scope constant or policy object
* add a guard that only permits English source targets for the current replay
* add tests proving non-English source targets fail closed
* add tests proving exact English `comic` remains allowed
* add docs/comments that name the limitation clearly

## Deferred lanes

These remain separate and are not authorized here:

* candidate-language single source of truth
* seven-voice metadata single source of truth
* VM-only UI boundary cleanup
* Firestore read/write/rules alignment
* stale docs and legacy file cleanup
* any new model/provider replay
* any broader candidate review

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

This decision is development-only.

It locks a scope boundary.

It does not make an etymology claim.

It does not make an origin claim.

It does not make a functional motivation claim.

It does not reject future work on `comic`.

It only prevents the current English-only resolver behavior from being mistaken for general source-language support.

## Next accepted task

`docs(open-instrument): review source-language scope decision after comic lane and test-discovery closure v0.1`
