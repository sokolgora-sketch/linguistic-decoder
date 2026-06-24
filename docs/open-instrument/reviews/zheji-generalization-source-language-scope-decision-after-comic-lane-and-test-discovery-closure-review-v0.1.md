# Source-language scope decision after comic lane and test-discovery closure review v0.1

Date: 2026-06-24

Status: SOURCE_LANGUAGE_SCOPE_DECISION_AFTER_COMIC_LANE_AND_TEST_DISCOVERY_CLOSURE_REVIEWED_ACCEPTED_READY_FOR_SOURCE_LANGUAGE_SCOPE_GUARD_IMPLEMENTATION.

Reviewed decision base:

* Short SHA: `1be9785d`
* Full SHA: `1be9785d0fa6d8fd4cef8b298b7f6360d176e588`
* Subject: `docs(open-instrument): define source-language scope decision after comic lane and test-discovery closure v0.1`

Reviewed decision document:

* `docs/open-instrument/zheji-generalization-source-language-scope-decision-after-comic-lane-and-test-discovery-closure-v0.1.md`

Reviewed replay script:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

Reviewed artifact:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`
* SHA-256: `51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65`

## Review verdict

The source-language scope decision is accepted.

The current comic lane is formally English-source-only.

The current `sourceLanguageForRequest` behavior must not be treated as a real general source-language resolver.

The current replay path must not authorize non-English source targets until a reviewed guard or a real resolver is implemented.

The clean all-null comic result remains limited to exact English `comic`.

No provider/model replay is authorized by this review.

## Accepted implementation direction

The next implementation lane should add a source-language scope guard for the current generalization replay path.

Next accepted task:

`test(open-instrument): implement source-language scope guard for generalization replay v0.1`

The implementation should:

* make English-source-only scope explicit
* keep exact English `comic` allowed
* fail closed for unsupported non-English source targets
* prevent the current English fallback from being mistaken for general resolver support
* avoid provider/model execution
* avoid replay execution
* avoid artifact mutation
* avoid candidate-language single-source-of-truth work in the same PR
* avoid seven-voice metadata single-source-of-truth work in the same PR

## Scope confirmation

This review does not:

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

It accepts a scope boundary, not a linguistic claim.

It does not make an etymology claim.

It does not make an origin claim.

It does not make a functional motivation claim.

It does not reject future work on `comic`.

It only prevents the current English-only resolver behavior from being mistaken for general source-language support.

## Deferred lanes

Still deferred to separate narrow lanes:

* candidate-language single source of truth
* seven-voice metadata single source of truth
* VM-only UI boundary cleanup
* Firestore read/write/rules alignment
* stale docs and legacy file cleanup
* any new model/provider replay
* any broader candidate review

## Checks used

The review used:

* source-decision base proof
* source-decision document proof
* current resolver proof
* artifact SHA proof
* artifact JSON query proof
* full Jest suite with longer timeout
* integration tests
* production build
* `git diff --check`

## Next accepted task

`test(open-instrument): implement source-language scope guard for generalization replay v0.1`
