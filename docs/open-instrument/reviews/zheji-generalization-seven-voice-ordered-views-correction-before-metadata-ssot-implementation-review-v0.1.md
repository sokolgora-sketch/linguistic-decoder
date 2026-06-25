# Seven-voice ordered-views correction before metadata SSOT implementation review v0.1

Date: 2026-06-25

Status: SEVEN_VOICE_ORDERED_VIEWS_CORRECTION_REVIEWED_ACCEPTED_READY_FOR_ORDERED_VIEWS_SSOT_IMPLEMENTATION.

Reviewed correction base:

* Short SHA: `d64e6078`
* Full SHA: `d64e60789cace052c3a0cbe594b39cfdb8adb7b2`
* Subject: `docs(open-instrument): define seven-voice ordered-views correction before metadata SSOT implementation v0.1`

Reviewed correction document:

* `docs/open-instrument/zheji-generalization-seven-voice-ordered-views-correction-before-metadata-ssot-implementation-v0.1.md`

Previously incomplete docs:

* `docs/open-instrument/zheji-generalization-seven-voice-metadata-ssot-cleanup-after-candidate-language-ssot-review-v0.1.md`
* `docs/open-instrument/reviews/zheji-generalization-seven-voice-metadata-ssot-cleanup-definition-after-candidate-language-ssot-review-v0.1.md`

Relevant replay script:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

Reviewed comic artifact:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`
* SHA-256: `51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65`

## Review verdict

The seven-voice ordered-views correction is accepted.

The previous seven-voice SSOT definition and review are superseded where they imply that `A, E, I, O, U, Y, Ë` is the only canonical order for all surfaces.

The corrected architecture must use one seven-voice registry with multiple named ordered views.

## Accepted ordered views

### symbolicMathOrder

Purpose:

* Math7
* symbolic doctrine
* rainbow/color doctrine
* symbolic ring/path logic
* engine/instrument symbolic readouts

Order:

* A
* E
* I
* O
* U
* Y
* Ë

### acousticVoiceLabOrder

Purpose:

* VoiceLab
* eval chart display
* acoustic/aperture ordering
* open-to-close vowel ordering
* phonetic/acoustic bridge surfaces

Order:

* A
* O
* E
* Ë
* U
* Y
* I

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
* not a voice order unless an explicit mapping exists

Order:

* V1
* V2
* V3
* V4
* V5
* V6
* V7

## Corrected implementation acceptance criteria

The next implementation PR must expose:

* one seven-voice registry
* `symbolicMathOrder`
* `acousticVoiceLabOrder`
* optional `evalBucketOrder` or explicit eval bucket contract if currently distinct
* lookup by voice key
* invariant tests for all ordered views
* proof that both main ordered views contain the same seven voices
* proof that symbolicMathOrder and acousticVoiceLabOrder are intentionally different

The implementation must prove:

* Math7/core symbolic surfaces use symbolicMathOrder
* VoiceLab/eval acoustic surfaces use acousticVoiceLabOrder
* eval bucket labels are not silently conflated with a voice order

## Scope confirmation

This review does not:

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

## Guardrails for implementation

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
* change Firestore behavior
* perform broader cleanup

The next implementation PR may:

* add a seven-voice registry
* add named ordered-view helpers
* route existing core helpers to symbolicMathOrder if safe and covered
* route VoiceLab/eval display helpers to acousticVoiceLabOrder if safe and covered
* add invariant tests around both ordered views
* add comments clarifying symbolic order vs acoustic order

## Claim boundary

This correction review is development-only.

It does not make an etymology claim.

It does not make an origin claim.

It does not make a functional motivation claim.

It does not change the reviewed all-null result for exact English `comic`.

It only prevents seven-voice metadata SSOT from collapsing two different ordered views into one ambiguous canonical order.

## Next accepted task

`test(open-instrument): implement seven-voice metadata ordered views SSOT for core VoiceLab and evals v0.1`
