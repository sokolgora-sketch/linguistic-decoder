# Seven-voice ordered views SSOT implementation review v0.1

Date: 2026-06-25

Status: SEVEN_VOICE_ORDERED_VIEWS_SSOT_IMPLEMENTATION_REVIEWED_ACCEPTED_READY_FOR_CONSUMER_WIRING_DEFINITION.

Reviewed implementation base:

* Short SHA: 3d892d31
* Full SHA: 3d892d3183d1fbcf2858e48c05126072c4192f5c
* Subject: test(open-instrument): implement seven-voice metadata ordered views SSOT for core VoiceLab and evals v0.1

Reviewed files:

* src/shared/sevenVoiceOrderedViews.v0.1.ts
* tests/openInstrument.sevenVoiceOrderedViewsSsot.v0.1.spec.ts

Reviewed artifact:

* docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json
* SHA-256: 51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65

## Review verdict

The seven-voice ordered views SSOT implementation is accepted.

The implementation correctly establishes one shared seven-voice registry with multiple named ordered views.

The implementation preserves symbolic and acoustic order as separate views instead of collapsing them into one ambiguous canonical order.

## Accepted ordered views

symbolicMathOrder:

* A
* E
* I
* O
* U
* Y
* Ë

acousticVoiceLabOrder:

* A
* O
* E
* Ë
* U
* Y
* I

evalBucketOrder:

* V1
* V2
* V3
* V4
* V5
* V6
* V7

## Accepted registry posture

The registry is accepted as the v0.1 shared metadata source.

Accepted metadata includes:

* stable voice key
* display label
* symbolic math index
* Math7 value
* symbolic level
* symbolic ring
* symbolic color
* gender polarity
* principle label placeholder
* acoustic label
* acoustic height
* acoustic backness

The accepted acoustic labels are:

* A: open central
* O: mid back
* E: mid front
* Ë: mid central
* U: close back
* Y: close front
* I: close front

## Accepted test posture

The test suite proves:

* symbolicMathOrder is stable
* acousticVoiceLabOrder is stable
* evalBucketOrder is separate
* symbolicMathOrder and acousticVoiceLabOrder contain the same seven voices
* symbolicMathOrder and acousticVoiceLabOrder are intentionally different
* registry lookups work
* current Math7 and core files still expose symbolic order
* current VoiceLab and eval files still expose acoustic order
* eval bucket labels remain separate from voice order
* replay source-language and candidate-language boundaries remain unchanged
* reviewed comic artifact SHA remains unchanged

## Important limitation

This PR adds the SSOT and guards the current surfaces.

It does not yet wire every existing consumer to import the SSOT.

The next lane must define the consumer wiring boundary before code changes.

That future lane should decide which existing files can safely import:

* symbolicMathOrder
* acousticVoiceLabOrder
* evalBucketOrder
* lookupSevenVoice
* orderedRegistryEntriesForView

## Scope confirmation

This review confirms that the implementation did not:

* execute a replay
* call a provider
* call a model
* mutate an artifact
* change candidate scoring
* change candidate selection
* change origin evidence
* change evidence promotion
* change publication posture
* change Firestore behavior
* change UI behavior
* change VoiceLab behavior
* change eval runtime behavior

## Validation

The review re-ran:

* focused ordered-views SSOT test
* full Jest
* integration tests
* production build
* replay script syntax check
* artifact SHA proof

All passed.

## Next accepted task

docs(open-instrument): define seven-voice ordered views consumer wiring after SSOT implementation review v0.1
