# Seven-voice ordered-views correction before metadata SSOT implementation v0.1

Date: 2026-06-25

Status: SEVEN_VOICE_ORDERED_VIEWS_CORRECTION_DEFINED_PENDING_REVIEW.

Correction base:

* Short SHA: `4df2b800`
* Full SHA: `4df2b8001d469d829be44ab515c19779820a8cde`
* Subject: `docs(open-instrument): review seven-voice metadata single source of truth cleanup definition after candidate-language SSOT review v0.1`

Previously merged seven-voice metadata SSOT definition:

* `docs/open-instrument/zheji-generalization-seven-voice-metadata-ssot-cleanup-after-candidate-language-ssot-review-v0.1.md`

Previously merged seven-voice metadata SSOT definition review:

* `docs/open-instrument/reviews/zheji-generalization-seven-voice-metadata-ssot-cleanup-definition-after-candidate-language-ssot-review-v0.1.md`

Candidate-language SSOT review remains accepted:

* `docs/open-instrument/reviews/zheji-generalization-candidate-language-ssot-implementation-review-v0.1.md`

Relevant replay script:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

Reviewed comic artifact:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`
* SHA-256: `51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65`

## Correction verdict

The previous seven-voice metadata SSOT definition and review are incomplete because they flatten one symbolic order into the phrase "canonical order."

The statement `A, E, I, O, U, Y, Ë` is valid for the symbolic / Math7 / rainbow doctrine layer.

It is not the only order used by the project.

VoiceLab, eval charting, and acoustic/aperture surfaces use a different ordered view:

* `A`
* `O`
* `E`
* `Ë`
* `U`
* `Y`
* `I`

That ordered view is the acoustic / phonetic / aperture order.

The seven-voice metadata SSOT implementation must therefore expose multiple named ordered views instead of one ambiguous canonical order.

## Correct architecture

The seven-voice SSOT should provide one shared voice registry plus named ordered views.

Required ordered views for v0.1:

### symbolicMathOrder

Purpose:

* Math7
* Seven-principles symbolic doctrine
* rainbow/color doctrine
* symbolic ring/path logic
* engine/instrument symbolic readouts

Order:

* `A`
* `E`
* `I`
* `O`
* `U`
* `Y`
* `Ë`

This order must not be described as the only canonical order.

### acousticVoiceLabOrder

Purpose:

* VoiceLab
* eval chart display
* acoustic/aperture ordering
* open-to-close vowel ordering
* phonetic/acoustic bridge surfaces

Order:

* `A`
* `O`
* `E`
* `Ë`
* `U`
* `Y`
* `I`

Known acoustic labels:

* A: open central
* O: mid back
* E: mid front
* Ë: mid central
* U: close back
* Y: close front
* I: close front

### evalBucketOrder

Purpose:

* eval bucket/ladder labels where used as V1 through V7
* not necessarily a voice order unless an explicit mapping exists

Order:

* `V1`
* `V2`
* `V3`
* `V4`
* `V5`
* `V6`
* `V7`

The implementation must not silently conflate eval bucket labels with either symbolicMathOrder or acousticVoiceLabOrder.

## Corrected implementation requirement

The next implementation PR must not implement a single `canonicalOrder` field that hides the mismatch.

Instead it should expose:

* one seven-voice registry
* `symbolicMathOrder`
* `acousticVoiceLabOrder`
* optional `evalBucketOrder` or separate eval bucket contract if currently distinct
* lookup by voice key
* tests that prove both named orders remain stable
* tests that prove VoiceLab/eval display order is not accidentally replaced by Math7 symbolic order
* tests that prove Math7 symbolic order is not accidentally replaced by VoiceLab acoustic order

## Required tests for corrected implementation

The implementation must include tests proving:

* symbolicMathOrder is exactly A, E, I, O, U, Y, Ë
* acousticVoiceLabOrder is exactly A, O, E, Ë, U, Y, I
* every symbolicMathOrder voice exists in the registry
* every acousticVoiceLabOrder voice exists in the registry
* both ordered views contain exactly seven items
* both ordered views contain the same seven voice keys
* symbolicMathOrder and acousticVoiceLabOrder are intentionally different
* VoiceLab/eval acoustic surfaces use acousticVoiceLabOrder
* Math7/core symbolic surfaces use symbolicMathOrder
* O remains the symbolic mediator / center where the symbolic layer requires it
* acoustic labels are preserved for VoiceLab/eval ordering
* source-language guard remains English-source-only
* candidate-language SSOT remains Albanian, Latin, Greek, Sanskrit
* reviewed comic artifact is not changed

## What remains valid from previous docs

The previous docs remain valid only in these narrow parts:

* seven-voice metadata needs a single source of truth
* source-language guard must remain separate
* candidate-language SSOT must remain preserved
* no provider/model replay is authorized
* no artifact mutation is authorized
* no claim change is authorized

The previous docs are superseded where they imply that `A, E, I, O, U, Y, Ë` is the sole canonical order for all surfaces.

## Scope confirmation

This correction PR is docs-only.

This correction PR does not:

* implement the SSOT
* execute a replay
* call a provider
* call a model
* mutate an artifact
* change runner code
* change tests
* change schema
* change package files
* change CI
* change UI behavior
* change VoiceLab behavior
* change eval behavior
* promote evidence
* frame results for publication

## Implementation boundaries after correction review

The corrected implementation PR must not:

* execute a replay
* call a provider
* call a model
* mutate an artifact
* change candidate-language SSOT behavior
* change source-language guard behavior
* change candidate scoring
* change candidate selection semantics
* change origin/evidence promotion logic
* change Firestore behavior
* perform broader cleanup

The corrected implementation PR may:

* add a seven-voice registry
* add named ordered-view helpers
* route existing core helpers to symbolicMathOrder if safe and covered
* route VoiceLab/eval display helpers to acousticVoiceLabOrder if safe and covered
* add invariant tests around both ordered views
* add comments clarifying symbolic order vs acoustic order

## Claim boundary

This correction is development-only.

It does not make an etymology claim.

It does not make an origin claim.

It does not make a functional motivation claim.

It does not change the reviewed all-null result for exact English `comic`.

It only prevents seven-voice metadata SSOT from collapsing two different ordered views into one ambiguous canonical order.

## Next implementation after correction review

`test(open-instrument): implement seven-voice metadata ordered views SSOT for core VoiceLab and evals v0.1`

## Next accepted task

`docs(open-instrument): review seven-voice ordered-views correction before metadata SSOT implementation v0.1`
