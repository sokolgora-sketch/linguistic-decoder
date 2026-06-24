# Seven-voice metadata SSOT cleanup after candidate-language SSOT review v0.1

Date: 2026-06-24

Status: SEVEN_VOICE_METADATA_SSOT_CLEANUP_AFTER_CANDIDATE_LANGUAGE_SSOT_REVIEW_DEFINED_PENDING_REVIEW.

Definition base:

* Short SHA: `d1889527`
* Full SHA: `d1889527a6b2d4a645f18e89522dbeddd4078a3b`
* Subject: `docs(open-instrument): review candidate-language single source of truth implementation for generalization replay v0.1`

Reviewed candidate-language SSOT review:

* `docs/open-instrument/reviews/zheji-generalization-candidate-language-ssot-implementation-review-v0.1.md`

Relevant replay script:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

Reviewed comic artifact:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`
* SHA-256: `51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65`

## Context

The current Open Instrument hardening sequence has closed:

* exact English `comic` target-grid rerun loop
* all-null result review
* hidden test discovery gap
* source-language English-only scope guard
* candidate-language single source of truth for the current replay path

The next cleanup target is seven-voice metadata drift.

## Problem

Seven-voice metadata can drift if the same facts are duplicated across engine, UI, tests, docs, and replay utilities.

The project depends on one stable seven-voice order:

* A
* E
* I
* O
* U
* Y
* Ë

The project also depends on stable metadata associated with these voices, including:

* index / position
* level
* ring
* color
* gender / polarity
* principle label
* Math7 mapping
* display label
* normalized key

When those facts are duplicated, future changes can silently split the instrument.

## Decision

Create one seven-voice metadata single source of truth for core and instrument surfaces.

The SSOT must be explicit, versioned, and test-covered.

It must make the canonical order and metadata available from one authoritative module or policy.

The SSOT must not weaken existing Math7 behavior.

The SSOT must not change the reviewed `comic` all-null result.

The SSOT must not authorize any provider/model replay.

The SSOT must not mutate any artifact.

## Required seven-voice SSOT v0.1 shape

The implementation lane should define a small, stable registry or policy with at least:

* `schemaVersion`
* canonical voice order
* normalized key per voice
* display label per voice
* index / position per voice
* Math7 value per voice if applicable
* level per voice
* ring per voice
* color per voice
* gender / polarity per voice
* principle label per voice
* helper for ordered voices
* helper for lookup by voice key

The canonical order must remain:

* `A`
* `E`
* `I`
* `O`
* `U`
* `Y`
* `Ë`

The known current metadata expectations are:

* A: high, red, male
* E: high, orange, female
* I: high, yellow, male
* O: mid, green, androgynous
* U: low, blue, female
* Y: low, indigo, male
* Ë: low, violet, female

Ring expectations should preserve current engine behavior:

* A: 3
* E: 2
* I: 1
* O: 0
* U: 1
* Y: 2
* Ë: 3

## Required implementation tests

The next implementation PR should add tests proving:

* canonical order is exactly A, E, I, O, U, Y, Ë
* all seven voices are present exactly once
* every voice has a stable normalized key
* every voice has display label, level, ring, color, gender/polarity, and principle label
* O remains the center / mediator with ring 0
* A/E/I are high
* O is mid
* U/Y/Ë are low
* color mapping remains red, orange, yellow, green, blue, indigo, violet
* gender/polarity mapping remains male, female, male, androgynous, female, male, female
* existing Math7 tests still pass
* source-language guard remains English-source-only
* candidate-language SSOT remains Albanian, Latin, Greek, Sanskrit
* reviewed comic artifact is not changed

## Required implementation boundaries

The next implementation PR must not:

* execute a replay
* call a provider
* call a model
* mutate an artifact
* change candidate-language SSOT behavior
* change source-language guard behavior
* change candidate scoring
* change candidate selection semantics
* change origin/evidence promotion logic
* change UI rendering behavior beyond imports/helpers if required
* change Firestore behavior
* perform broader cleanup

The next implementation PR may:

* add a seven-voice metadata registry/policy
* route existing core/instrument helpers to read from the registry
* add tests around metadata invariants
* add comments clarifying that this is metadata consolidation, not a theory expansion

## Claim boundary

This cleanup is development-only.

It does not make an etymology claim.

It does not make an origin claim.

It does not make a functional motivation claim.

It does not change the reviewed all-null result for exact English `comic`.

It only reduces seven-voice metadata drift risk.

## Deferred lanes

Still deferred:

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

`test(open-instrument): implement seven-voice metadata single source of truth for core and instrument surfaces v0.1`

## Next accepted task

`docs(open-instrument): review seven-voice metadata single source of truth cleanup definition after candidate-language SSOT review v0.1`
