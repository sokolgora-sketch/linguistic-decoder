# Seven-voice ordered views symbolic core consumer wiring implementation review v0.1

Date: 2026-06-25

Status: SEVEN_VOICE_ORDERED_VIEWS_SYMBOLIC_CORE_CONSUMER_WIRING_REVIEWED_ACCEPTED_READY_FOR_WORD_REGRESSION.

Reviewed implementation:

* Short SHA: 05f3d1a9
* Full SHA: 05f3d1a98ecb820016bdcd361c89d3867626017d
* Subject: test(open-instrument): wire seven-voice ordered views SSOT into symbolic core consumers v0.1

Reviewed files:

* src/shared/math7.core.ts
* src/core/sevenVowelsCore.ts
* src/shared/doctrine/voiceDoctrine.v0.1.ts
* tests/openInstrument.sevenVoiceOrderedViewsSymbolicCoreWiring.v0.1.spec.ts

Reviewed artifact boundary:

* docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json
* SHA-256: 51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65

## Review verdict

The symbolic core consumer wiring implementation is accepted.

## Accepted wiring

The implementation wires direct symbolic core source consumers to symbolicMathOrder:

* math7 core uses symbolicMathOrder for SEVEN_VOWELS.
* core seven vowels uses symbolicMathOrder for VOWELS.
* voice doctrine uses symbolicMathOrder for VOICES_V0_1.

The implementation keeps sevenPrinciples as an indirect symbolic consumer through the core aliases.

This is accepted because sevenPrinciples already imports VOWELS from core/sevenVowelsCore and SEVEN_VOWELS from shared/math7.core.

## Accepted non-wiring boundary

The implementation does not wire symbolic consumers to acousticVoiceLabOrder.

The implementation does not change acousticVoiceLabOrder provenance.

The implementation does not treat acousticVoiceLabOrder as measured formant-derived truth.

The implementation does not treat evalBucketOrder V1..V7 as vowels.

## Accepted test coverage

The symbolic-core wiring invariant test is accepted.

It proves:

* symbolicMathOrder stays A, E, I, O, U, Y, Ë.
* direct symbolic core sources import and expose symbolicMathOrder.
* sevenPrinciples remains an indirect symbolic consumer through core aliases.
* direct symbolic literal arrays are removed from the wired direct source consumers.
* the reviewed replay artifact remains unchanged.
* source and candidate replay guards remain unchanged.

## Confirmed unchanged boundaries

* No replay execution.
* No provider or model execution.
* No artifact mutation.
* No fixture JSON mutation.
* No candidate scoring change.
* No candidate-selection change.
* No evidence promotion.
* No publication posture change.

## Word-regression boundary

The next word run is now allowed.

The run must be framed as regression proof only.

It proves the SSOT wiring preserved Math7, Heart, and API behavior.

It does not prove unresolved etymology claims.

A regression pass for damage does not prove any unresolved da, dëm, ndarje, or mythic-register decomposition.

## Validation

The review reran:

* ordered-views SSOT focused test
* safe consumer-wiring focused test
* symbolic-core wiring focused test
* npm run gate:quick
* artifact SHA proof

All passed.

## Next accepted task

test(open-instrument): run post-SSOT word regression pack for study damage mystery and fresh word v0.1
