# Candidate-language SSOT cleanup definition after source-language guard review v0.1

Date: 2026-06-24

Status: CANDIDATE_LANGUAGE_SSOT_CLEANUP_DEFINITION_REVIEWED_ACCEPTED_READY_FOR_CANDIDATE_LANGUAGE_SSOT_IMPLEMENTATION.

Reviewed definition base:

* Short SHA: `1dbedc68`
* Full SHA: `1dbedc68fefd1bce55424a69a5d5eaa6d7779be8`
* Subject: `docs(open-instrument): define candidate-language single source of truth cleanup after source-language guard review v0.1`

Reviewed definition document:

* `docs/open-instrument/zheji-generalization-candidate-language-ssot-cleanup-after-source-language-guard-review-v0.1.md`

Reviewed source-language guard review:

* `docs/open-instrument/reviews/zheji-generalization-source-language-scope-guard-implementation-review-v0.1.md`

Relevant replay script:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

Reviewed comic artifact:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`
* SHA-256: `51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65`

## Review verdict

The candidate-language single source of truth cleanup definition is accepted.

The next implementation lane is authorized to create a narrow, versioned candidate-language SSOT for the current generalization replay path.

The active comic target-grid candidate-language set must remain exactly:

* Albanian
* Latin
* Greek
* Sanskrit

The implementation must keep source-language scope separate from candidate-language scope.

The implementation must preserve the current English-source-only source guard.

The implementation must not authorize provider/model replay.

The implementation must not mutate the reviewed comic artifact.

## Required implementation acceptance criteria

The implementation should expose a small candidate-language registry or policy with:

* schema version
* supported candidate-language records
* active target-grid candidate-language set
* stable ids
* display labels
* unsupported candidate-language status or equivalent fail-closed behavior
* explicit separation from source-language scope

Stable ids should be deterministic and lower-case.

Expected active ids:

* `albanian`
* `latin`
* `greek`
* `sanskrit`

## Required implementation tests

The implementation must include tests proving:

* active target-grid candidate-language labels are exactly Albanian, Latin, Greek, Sanskrit
* active target-grid candidate-language ids are exactly albanian, latin, greek, sanskrit
* each active candidate language has a display label
* no duplicate active candidate-language ids exist
* unsupported candidate-language input is not accepted silently if such input is accepted by the path
* source-language scope remains English-only
* no artifact mutation occurs

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

## Implementation boundaries

The next implementation PR must not:

* execute a replay
* call a provider
* call a model
* mutate an artifact
* change candidate scoring
* change candidate selection semantics
* change origin/evidence promotion logic
* change seven-voice metadata
* change UI/runtime/API behavior
* change Firestore behavior
* perform broader cleanup

The next implementation PR may:

* add or extract a candidate-language registry/policy for the replay path
* route the replay path to use that registry/policy
* add tests around the registry/policy
* add fail-closed unsupported candidate-language behavior if the current path accepts candidate-language input
* add comments that clarify candidate-language vs source-language scope

## Claim boundary

This review is development-only.

It accepts a cleanup lane, not a linguistic claim.

It does not make an etymology claim.

It does not make an origin claim.

It does not make a functional motivation claim.

It does not change the reviewed all-null result for exact English `comic`.

It only reduces candidate-language configuration drift risk.

## Deferred lanes

Still deferred:

* seven-voice metadata single source of truth
* VM-only UI boundary cleanup
* Firestore read/write/rules alignment
* stale docs and legacy file cleanup
* any new model/provider replay
* any broader candidate review
* any new word or language expansion

## Next accepted task

`test(open-instrument): implement candidate-language single source of truth for generalization replay v0.1`
