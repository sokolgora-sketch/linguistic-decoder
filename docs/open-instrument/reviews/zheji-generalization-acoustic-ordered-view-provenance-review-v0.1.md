# Acoustic ordered-view provenance review v0.1

Date: 2026-06-25

Status: ACOUSTIC_ORDERED_VIEW_PROVENANCE_REVIEWED_ACCEPTED_READY_FOR_SYMBOLIC_CORE_CONSUMER_WIRING.

Reviewed definition:

* Short SHA: 63c45b40
* Full SHA: 63c45b40cd98832c66e388a50c1fdd07c6a2e68c
* Subject: docs(open-instrument): define acoustic ordered-view provenance before symbolic core consumer wiring v0.1
* Definition doc: docs/open-instrument/zheji-generalization-acoustic-ordered-view-provenance-before-symbolic-core-wiring-v0.1.md

Reviewed artifact:

* docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json
* SHA-256: 51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65

## Review verdict

The acoustic ordered-view provenance definition is accepted.

## Accepted provenance boundary

acousticVoiceLabOrder is accepted as the current VoiceLab/eval display order and expected-aperture order.

It is not accepted as a measured formant-derived order.

It is hand-specified unless and until a future derivation lane proves otherwise from versioned measurement evidence.

## Accepted future measured-order rule

A future measured order must use a separate named view.

Acceptable future view names include:

* measuredFormantOrder
* measuredApertureOrder
* voiceLabMeasuredF1Order

A measured order must cite:

* source fixture or dataset
* measurement field used for sorting
* sort direction
* derivation script or deterministic derivation function
* expected output order
* test proving the derivation

## Accepted symbolic-core consequence

Symbolic core wiring may proceed after this review.

The symbolic core wiring lane must wire symbolic consumers to symbolicMathOrder.

It must not wire symbolic consumers to acousticVoiceLabOrder.

## Accepted word-regression boundary

Future word runs such as study, damage, mystery, and one fresh word must be framed as regression proof only when used after SSOT wiring.

A regression pass proves the wiring preserved Math7/Heart behavior.

It does not prove unresolved etymology claims.

A regression pass for damage does not prove any unresolved da, dëm, ndarje, or mythic-register decomposition.

## Confirmed unchanged boundaries

* No code wiring in this review.
* No replay execution.
* No provider or model execution.
* No artifact mutation.
* No fixture JSON mutation.
* No evidence promotion.
* No publication posture change.

## Validation

The review reran:

* ordered-views SSOT focused test
* safe consumer-wiring focused test
* eval chart guard focused test
* npm run gate:quick
* artifact SHA proof

All passed.

## Next accepted task

test(open-instrument): wire seven-voice ordered views SSOT into symbolic core consumers v0.1
