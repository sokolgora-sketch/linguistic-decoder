# Undiscovered test files gate exposure implementation review v0.1

Date: 2026-06-24

Status: UNDISCOVERED_TEST_FILES_GATE_EXPOSURE_IMPLEMENTATION_REVIEWED_ACCEPTED_READY_FOR_SOURCE_LANGUAGE_SCOPE_DECISION.

Reviewed implementation base:

* Short SHA: `b09140d3`
* Full SHA: `b09140d321368ed3210fb19194b76df94f429b61`
* Subject: `test(open-instrument): expose undiscovered test files to gate or document intentional exclusions v0.1`

## Review verdict

The undiscovered test files gate exposure implementation is accepted.

The normal Jest gate now discovers the previously hidden tests.

The test count increased from the prior gate baseline:

* before this lane: `428 passed, 428 of 431 total`
* after this lane: `431 passed, 431 of 434 total`

This is the expected result of exposing three previously undiscovered test files.

## Files exposed

Previously hidden files:

* `tests/deepRoot.rootMap.builder.v1.test.ts`
* `tests/engine.smoke.test.ts`
* `tests/heart-study-core.test.ts`

Gate-visible files after implementation:

* `tests/deepRoot.rootMap.builder.v1.exposed.spec.ts`
* `tests/engine.smoke.spec.ts`
* `tests/heart-study-core.spec.ts`

## RootMap hidden failure surfaced and repaired

The normal gate surfaced a previously hidden RootMap test failure:

* `ReferenceError: buildRootMapV1 is not defined`

That failure was repaired in the exposed RootMap test by adding the required import.

This was a test repair, not an engine behavior change.

## Scope confirmation

No model/provider/replay logic changed.

No artifact changed.

No runtime API changed.

No UI changed.

No schema changed.

No package file changed.

No CI file changed.

No evidence was promoted.

No publication framing was introduced.

## Gate trust result

The `.test.ts` discovery caveat is closed for files under `tests/`.

No hidden `.test.ts` or `.test.tsx` files remain under `tests/`.

The exposed files are visible in `jest --listTests`.

The full Jest suite now includes the exposed tests.

## Remaining caveats

This review does not close every architecture debt.

Still deferred to separate narrow lanes:

* source-language scope decision for `sourceLanguageForRequest`
* candidate-language single source of truth
* seven-voice metadata single source of truth
* VM-only UI boundary cleanup
* Firestore read/write/rules alignment
* stale docs and legacy file cleanup

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

## Checks used

The review used:

* implementation base proof
* changed-file/name-status proof
* old hidden file absence proof
* new exposed file presence proof
* no hidden `.test.ts` / `.test.tsx` under `tests/` proof
* `jest --listTests` proof
* focused exposed tests
* full Jest suite with longer timeout
* integration tests
* production build
* `git diff --check`

## Next accepted task

`docs(open-instrument): define source-language scope decision after comic lane and test-discovery closure v0.1`
