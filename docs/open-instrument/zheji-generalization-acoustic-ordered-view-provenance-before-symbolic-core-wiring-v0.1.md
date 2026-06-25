# Acoustic ordered-view provenance before symbolic core wiring v0.1

Date: 2026-06-25

Status: ACOUSTIC_ORDERED_VIEW_PROVENANCE_DEFINED_PENDING_REVIEW.

## Purpose

This document defines the provenance boundary for acousticVoiceLabOrder before symbolic core consumers are wired to symbolicMathOrder.

The goal is to prevent a false implication that the current acousticVoiceLabOrder is derived from measured F1 or aperture evidence.

## Current ordered views

The seven-voice SSOT currently exposes three named ordered views:

* symbolicMathOrder: A, E, I, O, U, Y, Ë
* acousticVoiceLabOrder: A, O, E, Ë, U, Y, I
* evalBucketOrder: V1, V2, V3, V4, V5, V6, V7

## Provenance decision

acousticVoiceLabOrder is accepted as the current VoiceLab/eval display order and expected-aperture order.

It is not accepted as a measured formant-derived order.

It is hand-specified unless and until a future derivation lane proves otherwise from versioned measurement evidence.

## What this means

The name acousticVoiceLabOrder currently means:

* current VoiceLab/eval display order
* current eval chart voice-coloring order
* current expected-aperture presentation order
* stable display/order contract for existing UI and tests

The name does not currently mean:

* sorted from measured F1
* sorted from measured aperture
* derived from Parselmouth output
* derived from Colab output
* empirical proof of acoustic hierarchy
* falsification or confirmation of symbolicMathOrder

## Future measured order rule

If a measured order is added later, it must use a separate named view.

Acceptable future names include:

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

No measured order may reuse acousticVoiceLabOrder without a separate review and migration.

## Symbolic order remains separate

symbolicMathOrder remains the order for Math7, symbolic doctrine, rings, principles, color/gender/path semantics, and word-analysis Heart output.

The symbolic core wiring lane must wire symbolic consumers to symbolicMathOrder, not to acousticVoiceLabOrder.

## Eval bucket order remains separate

evalBucketOrder remains an opaque bucket-label order.

V1..V7 must not be treated as vowels unless a future explicit mapping defines that relation.

## Word regression boundary

Future word runs such as study, damage, mystery, and one fresh word must be framed as regression proof only when used after SSOT wiring.

That regression proves the wiring preserved Math7/Heart behavior.

It does not prove unresolved etymology claims.

In particular, a regression pass for damage does not prove any unresolved da, dëm, ndarje, or mythic-register decomposition.

## Current implementation posture

The current safe consumer wiring may remain in place:

* eval bucket TypeScript spec uses evalBucketOrder
* eval chart UI uses acousticVoiceLabOrder
* eval chart guard uses acousticVoiceLabOrder

This document clarifies the provenance of that usage.

## Blocked until review

Do not proceed to symbolic core consumer wiring until this provenance definition is reviewed and accepted.

## Next accepted task

docs(open-instrument): review acoustic ordered-view provenance before symbolic core consumer wiring v0.1
