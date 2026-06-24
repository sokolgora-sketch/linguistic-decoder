# Source-language scope guard implementation review v0.1

Date: 2026-06-24

Status: SOURCE_LANGUAGE_SCOPE_GUARD_IMPLEMENTATION_REVIEWED_ACCEPTED_READY_FOR_CANDIDATE_LANGUAGE_SSOT_CLEANUP_DEFINITION.

Reviewed implementation base:

* Short SHA: `771bea8b`
* Full SHA: `771bea8b95db1e32767e1fdeb5ce0d904cb0236c`
* Subject: `test(open-instrument): implement source-language scope guard for generalization replay v0.1`

Reviewed decision source:

* `docs/open-instrument/reviews/zheji-generalization-source-language-scope-decision-after-comic-lane-and-test-discovery-closure-review-v0.1.md`

Reviewed implementation files:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`
* `tests/openInstrument.sourceLanguageScopeGuard.v0.1.spec.ts`

Reviewed artifact:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`
* SHA-256: `51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65`

## Review verdict

The source-language scope guard implementation is accepted.

The current generalization replay path now has an explicit English-source-only policy.

`sourceLanguageForRequest` is now routed through `assertSupportedSourceLanguageForRequest`.

Unsupported non-English source-language inputs are represented by the fail-closed status:

* `UNSUPPORTED_SOURCE_LANGUAGE_FOR_CURRENT_GENERALIZATION_REPLAY`

The implementation prevents the previous always-English behavior from being mistaken for a real general source-language resolver.

## Accepted implementation details

The implementation added:

* `GENERALIZATION_REPLAY_SOURCE_LANGUAGE_SCOPE_POLICY_V0_1`
* `normalizeSourceLanguageForRequest`
* `assertSupportedSourceLanguageForRequest`
* guarded `sourceLanguageForRequest`
* source-language scope guard tests

The guard policy declares:

* `sourceScope: "english_source_only"`
* `supportedSourceLanguages: ["English"]`
* `failClosed: true`

## Validation result

Validation passed:

* focused source-language scope guard test passed
* full Jest suite passed with `432 passed, 432 of 435 total`
* integration tests passed
* production build passed

## Scope confirmation

No provider/model replay occurred.

No replay execution occurred.

No artifact mutation occurred.

The reviewed comic artifact SHA remains:

* `51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65`

No candidate-language single-source-of-truth cleanup was included.

No seven-voice metadata single-source-of-truth cleanup was included.

No UI/runtime/API change was included.

No Firestore change was included.

No evidence was promoted.

No publication framing was introduced.

## Claim boundary

This review is development-only.

It accepts a source-language scope guard, not a linguistic claim.

It does not make an etymology claim.

It does not make an origin claim.

It does not make a functional motivation claim.

It does not reject future work on `comic`.

It only prevents unsupported source-language use in the current replay path.

## Remaining caveats

The source-language guard closes the immediate English-only replay scope problem.

Remaining separate cleanup lanes:

* candidate-language single source of truth
* seven-voice metadata single source of truth
* VM-only UI boundary cleanup
* Firestore read/write/rules alignment
* stale docs and legacy file cleanup
* any new model/provider replay
* any broader candidate review

## Next accepted task

`docs(open-instrument): define candidate-language single source of truth cleanup after source-language guard review v0.1`
