# Candidate-language SSOT implementation review v0.1

Date: 2026-06-24

Status: CANDIDATE_LANGUAGE_SSOT_IMPLEMENTATION_REVIEWED_ACCEPTED_READY_FOR_SEVEN_VOICE_METADATA_SSOT_CLEANUP_DEFINITION.

Reviewed implementation base:

* Short SHA: `8b6f7771`
* Full SHA: `8b6f77710b581a1d40492e41e2ea3c596aed87db`
* Subject: `test(open-instrument): implement candidate-language single source of truth for generalization replay v0.1`

Reviewed definition source:

* `docs/open-instrument/reviews/zheji-generalization-candidate-language-ssot-cleanup-definition-after-source-language-guard-review-v0.1.md`

Reviewed implementation files:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`
* `tests/openInstrument.candidateLanguageSsot.v0.1.spec.ts`

Reviewed comic artifact:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`
* SHA-256: `51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65`

## Review verdict

The candidate-language single source of truth implementation is accepted.

The current generalization replay path now has a versioned candidate-language policy:

* `GENERALIZATION_REPLAY_CANDIDATE_LANGUAGE_POLICY_V0_1`

The active target-grid candidate-language set remains exactly:

* Albanian
* Latin
* Greek
* Sanskrit

The stable active ids are exactly:

* `albanian`
* `latin`
* `greek`
* `sanskrit`

The implementation keeps candidate-language scope separate from source-language scope.

The source-language English-only guard remains present and separate.

Unsupported candidate-language behavior is fail-closed by contract through:

* `UNSUPPORTED_CANDIDATE_LANGUAGE_FOR_CURRENT_GENERALIZATION_REPLAY`

## Accepted implementation details

The implementation added:

* `GENERALIZATION_REPLAY_CANDIDATE_LANGUAGE_POLICY_V0_1`
* `supportedCandidateLanguagesForReplay`
* `assertSupportedCandidateLanguageForReplay`
* `activeTargetGridCandidateLanguagesForReplay`
* `activeTargetGridCandidateLanguageLabelsForReplay`
* candidate-language SSOT tests

The replay path now routes target-grid language labels through the SSOT helper.

## Validation result

Validation passed:

* focused candidate-language SSOT test passed
* full Jest suite passed with `433 passed, 433 of 436 total`
* integration tests passed
* production build passed

## Scope confirmation

No provider/model replay occurred.

No replay execution occurred.

No artifact mutation occurred.

The reviewed comic artifact SHA remains:

* `51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65`

No candidate scoring change was included.

No candidate-selection semantic change was included.

No seven-voice metadata cleanup was included.

No UI/runtime/API change was included.

No Firestore change was included.

No evidence was promoted.

No publication framing was introduced.

## Claim boundary

This review is development-only.

It accepts a candidate-language configuration cleanup, not a linguistic claim.

It does not make an etymology claim.

It does not make an origin claim.

It does not make a functional motivation claim.

It does not change the reviewed all-null result for exact English `comic`.

It only reduces candidate-language configuration drift risk.

## Remaining caveats

The candidate-language SSOT closes the immediate target-grid language duplication risk for the current replay path.

Remaining separate cleanup lanes:

* seven-voice metadata single source of truth
* VM-only UI boundary cleanup
* Firestore read/write/rules alignment
* stale docs and legacy file cleanup
* any new model/provider replay
* any broader candidate review

## Next accepted task

`docs(open-instrument): define seven-voice metadata single source of truth cleanup after candidate-language SSOT review v0.1`
