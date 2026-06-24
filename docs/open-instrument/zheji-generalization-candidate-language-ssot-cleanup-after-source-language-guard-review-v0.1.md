# Candidate-language single source of truth cleanup after source-language guard review v0.1

Date: 2026-06-24

Status: CANDIDATE_LANGUAGE_SSOT_CLEANUP_AFTER_SOURCE_LANGUAGE_GUARD_REVIEW_DEFINED_PENDING_REVIEW.

Definition base:

* Short SHA: `78784d3d`
* Full SHA: `78784d3df0aaf93ac0460cb9d7f82cfb2a2b26f6`
* Subject: `docs(open-instrument): review source-language scope guard implementation for generalization replay v0.1`

Reviewed source-language guard review:

* `docs/open-instrument/reviews/zheji-generalization-source-language-scope-guard-implementation-review-v0.1.md`

Relevant replay script:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

Reviewed comic artifact:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`
* SHA-256: `51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65`

## Context

The exact English `comic` lane is now closed through:

* JSON hardening
* repaired local-only target-grid rerun
* all-null result review
* test-discovery gap closure
* source-language English-only scope decision
* source-language fail-closed guard implementation and review

The current normal gate includes the previously hidden tests.

The current normal unit gate is:

* `432 passed, 432 of 435 total`

The next cleanup target is candidate-language configuration drift.

## Problem

The replay path currently depends on candidate-language / target-language knowledge that can be scattered across runner logic, docs, artifacts, and tests.

The current comic target grid used:

* Albanian
* Latin
* Greek
* Sanskrit

Those languages must not become duplicated magic strings across the replay path.

A future maintainer must not need to inspect multiple files to determine:

* which candidate languages are supported for the current replay
* which candidate languages are active for the comic target-grid lane
* what display labels are expected
* what stable language ids are expected
* whether a language is source language or candidate/target language
* whether a future language addition is a contract change

## Decision

Create one candidate-language single source of truth for the current generalization replay path.

The SSOT must be explicit, versioned, and test-covered.

It must distinguish:

* source language scope
* candidate language set
* active target-grid candidate language set
* stable language ids
* display labels
* status/policy for unsupported candidate languages

The SSOT must not weaken the English-source-only guard.

The SSOT must not authorize any model/provider replay.

The SSOT must not mutate the reviewed comic artifact.

## Required candidate-language SSOT v0.1 shape

The implementation lane should define a small, stable policy object or registry with at least:

* `schemaVersion`
* `supportedCandidateLanguages`
* `activeTargetGridCandidateLanguages`
* stable id per language
* display label per language
* fail-closed unsupported-candidate-language status
* explicit distinction from source-language scope

The initial active target-grid set should remain:

* Albanian
* Latin
* Greek
* Sanskrit

Stable ids should be deterministic and lower-case, for example:

* `albanian`
* `latin`
* `greek`
* `sanskrit`

The implementation may choose exact file placement based on existing runner structure, but must keep the scope narrow.

## Required tests for implementation lane

The next implementation PR should add tests proving:

* the active target-grid candidate-language set is exactly Albanian, Latin, Greek, Sanskrit
* each active language has a stable id
* each active language has a display label
* there are no duplicate active language ids
* unsupported candidate-language inputs fail closed or are not accepted silently
* source-language scope remains English-only
* the reviewed comic artifact is not changed
* no provider/model execution is required

## Required implementation boundaries

The next implementation PR must not:

* execute a replay
* call a provider
* call a model
* mutate an artifact
* change candidate selection logic
* change scoring logic
* change origin/evidence promotion logic
* change seven-voice metadata
* change UI/runtime/API behavior
* change Firestore behavior
* perform broader cleanup

The next implementation PR may:

* add or extract a candidate-language registry/policy for the replay path
* route the replay path to use that registry/policy
* add tests around the registry/policy
* add guard behavior for unsupported candidate languages if the current path accepts such inputs
* update comments/docstrings to clarify candidate-language vs source-language scope

## Claim boundary

This cleanup is development-only.

It does not make an etymology claim.

It does not make an origin claim.

It does not make a functional motivation claim.

It does not change the reviewed all-null result for exact English `comic`.

It only reduces configuration drift risk.

## Deferred lanes

Still deferred:

* seven-voice metadata single source of truth
* VM-only UI boundary cleanup
* Firestore read/write/rules alignment
* stale docs and legacy file cleanup
* any new model/provider replay
* any broader candidate review
* any new word or language expansion

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

## First implementation after review

`test(open-instrument): implement candidate-language single source of truth for generalization replay v0.1`

## Next accepted task

`docs(open-instrument): review candidate-language single source of truth cleanup definition after source-language guard review v0.1`
