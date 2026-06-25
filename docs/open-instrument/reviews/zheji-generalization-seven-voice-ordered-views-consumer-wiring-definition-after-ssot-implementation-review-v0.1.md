# Seven-voice ordered views consumer wiring definition review v0.1

Date: 2026-06-25

Status: SEVEN_VOICE_ORDERED_VIEWS_CONSUMER_WIRING_DEFINITION_REVIEWED_ACCEPTED_READY_FOR_SAFE_CONSUMER_WIRING_IMPLEMENTATION.

Reviewed base:

* Short SHA: `585ea9dd`
* Full SHA: `585ea9dd635240bb35b663b082e91a00c70dda0d`
* Subject: `docs(open-instrument): define seven-voice ordered views consumer wiring after SSOT implementation review v0.1`

Reviewed definition:

* `docs/open-instrument/zheji-generalization-seven-voice-ordered-views-consumer-wiring-after-ssot-implementation-review-v0.1.md`

Reviewed SSOT files:

* `src/shared/sevenVoiceOrderedViews.v0.1.ts`
* `tests/openInstrument.sevenVoiceOrderedViewsSsot.v0.1.spec.ts`

Reviewed comic artifact:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`
* SHA-256: `51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65`

## Review verdict

The consumer-wiring definition is accepted.

The next implementation may wire safe TypeScript consumers to the ordered-views SSOT, but must not mutate JSON fixtures or reviewed artifacts.

The implementation must remain narrow and must preserve existing behavior.

## Accepted wiring lanes

### symbolic/core consumers

Accepted candidate files:

* `src/shared/math7.core.ts`
* `src/core/sevenVowelsCore.ts`
* `src/shared/doctrine/voiceDoctrine.v0.1.ts`
* `src/shared/sevenPrinciples.v1.ts`

Accepted wiring:

* these files may import `symbolicMathOrder`
* registry lookup helpers may be used only if current symbolic values remain unchanged
* duplicated symbolic literal arrays may be replaced only when tests prove no behavior drift

### acoustic/VoiceLab/eval display consumers

Accepted candidate files:

* `src/components/landing/LandingPage.v0.2.tsx`
* `src/ui/evals/EvalsPageClient.v0.1.tsx`
* `tests/evals/evals.chart.canonical-dot-colors.guard.v0.1.spec.ts`

Accepted wiring:

* these files may import `acousticVoiceLabOrder`
* display/chart order must remain A, O, E, Ë, U, Y, I
* labels and chart semantics must remain unchanged

### eval bucket TypeScript consumers

Accepted candidate file:

* `src/shared/evals/spec.v0.1.ts`

Accepted wiring:

* this file may import `evalBucketOrder`
* V1..V7 must remain bucket labels
* this lane must not map buckets to vowels

## Explicit non-wiring targets

Do not wire TypeScript constants into:

* `tests/fixtures/voicelab/sgi-seed-locked-2026-03-28.v0.2.json`
* `tests/evals/evals.spec.v0.1.json`
* reviewed replay artifact JSON files

These files remain fixtures/contracts/artifacts and must be protected by tests, not imports.

## Required implementation proof

The implementation PR must prove:

* changed files are limited to accepted TypeScript consumers and tests
* symbolic consumers use `symbolicMathOrder`
* acoustic consumers use `acousticVoiceLabOrder`
* eval bucket TypeScript consumer uses `evalBucketOrder` if wired
* JSON fixtures remain unchanged
* reviewed comic artifact SHA remains unchanged
* source-language guard remains English-source-only
* candidate-language SSOT remains Albanian, Latin, Greek, Sanskrit
* focused ordered-views SSOT test passes
* full Jest passes
* integration tests pass
* production build passes

## Scope guardrails

The implementation PR must not:

* run a provider
* run a model
* execute replay
* mutate reviewed artifact JSON
* mutate fixture JSON
* change origin/evidence claims
* change candidate scoring
* change candidate selection
* change Firestore behavior
* broaden source-language scope
* broaden candidate-language scope
* introduce publication framing
* perform broad refactors

## Preferred implementation shape

Start with the lowest-risk TypeScript constants.

Do not wire ambiguous consumers in the first implementation.

Keep the first implementation small enough that a failure identifies exactly which consumer drifted.

## Next accepted task

`test(open-instrument): wire seven-voice ordered views SSOT into safe consumers v0.1`
