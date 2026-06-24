# Seven-voice metadata SSOT cleanup definition after candidate-language SSOT review v0.1

Date: 2026-06-24

Status: SEVEN_VOICE_METADATA_SSOT_CLEANUP_DEFINITION_REVIEWED_ACCEPTED_READY_FOR_SEVEN_VOICE_METADATA_SSOT_IMPLEMENTATION.

Reviewed definition base:

* Short SHA: `666d29e7`
* Full SHA: `666d29e7500ddde1823cc943dffa54cf14de2cb4`
* Subject: `docs(open-instrument): define seven-voice metadata single source of truth cleanup after candidate-language SSOT review v0.1`

Reviewed definition document:

* `docs/open-instrument/zheji-generalization-seven-voice-metadata-ssot-cleanup-after-candidate-language-ssot-review-v0.1.md`

Reviewed candidate-language SSOT review:

* `docs/open-instrument/reviews/zheji-generalization-candidate-language-ssot-implementation-review-v0.1.md`

Relevant replay script:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

Reviewed comic artifact:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`
* SHA-256: `51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65`

## Review verdict

The seven-voice metadata single source of truth cleanup definition is accepted.

The next implementation lane is authorized to create a narrow, versioned seven-voice metadata SSOT for core and instrument surfaces.

The canonical voice order must remain exactly:

* A
* E
* I
* O
* U
* Y
* Ë

The implementation must preserve known metadata:

* A: high, ring 3, red, male
* E: high, ring 2, orange, female
* I: high, ring 1, yellow, male
* O: mid, ring 0, green, androgynous
* U: low, ring 1, blue, female
* Y: low, ring 2, indigo, male
* Ë: low, ring 3, violet, female

The implementation must keep source-language scope separate from seven-voice metadata.

The source-language English-only guard must remain preserved.

The candidate-language SSOT must remain preserved with Albanian, Latin, Greek, Sanskrit.

The implementation must not authorize provider/model replay.

The implementation must not mutate the reviewed comic artifact.

## Required implementation acceptance criteria

The implementation should expose a small seven-voice metadata registry or policy with:

* schema version
* canonical ordered voices
* normalized key per voice
* display label per voice
* index or position per voice
* Math7 value per voice if applicable
* level per voice
* ring per voice
* color per voice
* gender or polarity per voice
* principle label per voice
* helper for ordered voices
* helper for lookup by voice key

## Required implementation tests

The implementation must include tests proving:

* canonical order is exactly A, E, I, O, U, Y, Ë
* all seven voices are present exactly once
* every voice has a stable normalized key
* every voice has display label, level, ring, color, gender/polarity, and principle label
* O remains the center / mediator with ring 0
* A, E, I are high
* O is mid
* U, Y, Ë are low
* color mapping remains red, orange, yellow, green, blue, indigo, violet
* gender/polarity mapping remains male, female, male, androgynous, female, male, female
* existing Math7 tests still pass
* source-language guard remains English-source-only
* candidate-language SSOT remains Albanian, Latin, Greek, Sanskrit
* reviewed comic artifact is not changed

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
* add comments clarifying that this is metadata consolidation, not theory expansion

## Claim boundary

This review is development-only.

It accepts a cleanup lane, not a linguistic claim.

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

## Next accepted task

`test(open-instrument): implement seven-voice metadata single source of truth for core and instrument surfaces v0.1`
