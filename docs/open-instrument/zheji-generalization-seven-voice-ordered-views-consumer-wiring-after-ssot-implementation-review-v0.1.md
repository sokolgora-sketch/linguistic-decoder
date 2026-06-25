# Seven-voice ordered views consumer wiring after SSOT implementation review v0.1

Date: 2026-06-25

Status: SEVEN_VOICE_ORDERED_VIEWS_CONSUMER_WIRING_AFTER_SSOT_REVIEW_DEFINED_PENDING_REVIEW.

Reviewed base:

* Short SHA: `d996e0a2`
* Full SHA: `d996e0a230e5c8a8e05a061e309d11cd20d47d29`
* Subject: `docs(open-instrument): review seven-voice metadata ordered views SSOT implementation for core VoiceLab and evals v0.1`

Reviewed SSOT files:

* `src/shared/sevenVoiceOrderedViews.v0.1.ts`
* `tests/openInstrument.sevenVoiceOrderedViewsSsot.v0.1.spec.ts`

Accepted SSOT implementation review:

* `docs/open-instrument/reviews/zheji-generalization-seven-voice-ordered-views-ssot-implementation-for-core-voicelab-and-evals-review-v0.1.md`

Reviewed comic artifact:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`
* SHA-256: `51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65`

## Definition verdict

Consumer wiring must be defined before implementation.

The SSOT is accepted, but existing consumers are not yet required to import it.

This lane defines which consumers may be wired, which consumers must remain guarded fixtures, and which changes are out of scope.

## Ordered views that must remain separate

### symbolicMathOrder

Order:

* A
* E
* I
* O
* U
* Y
* Ë

Safe consumer category:

* Math7/core symbolic files
* symbolic doctrine files
* symbolic/rainbow/principle files
* engine symbolic readout helpers, only if already using the symbolic order

### acousticVoiceLabOrder

Order:

* A
* O
* E
* Ë
* U
* Y
* I

Safe consumer category:

* VoiceLab display helpers
* eval chart display helpers
* acoustic/aperture helper files
* acoustic guard tests

### evalBucketOrder

Order:

* V1
* V2
* V3
* V4
* V5
* V6
* V7

Safe consumer category:

* eval spec helpers where V1..V7 are actual bucket labels
* eval bucket tests

Important boundary:

* evalBucketOrder is not a vowel order unless a future explicit mapping is defined.

## Candidate wiring targets

### Phase 1: symbolic/core consumers

Allowed candidate files:

* `src/shared/math7.core.ts`
* `src/core/sevenVowelsCore.ts`
* `src/shared/doctrine/voiceDoctrine.v0.1.ts`
* `src/shared/sevenPrinciples.v1.ts`

Allowed wiring:

* import `symbolicMathOrder`
* import registry lookup helpers if they preserve current values
* replace duplicated literal symbolic order only where tests prove behavior is unchanged

Required tests:

* current Math7 tests remain green
* existing symbolic/core invariant tests remain green
* ordered-views SSOT test remains green

### Phase 2: acoustic/VoiceLab/eval display consumers

Allowed candidate files:

* `src/components/landing/LandingPage.v0.2.tsx`
* `src/ui/evals/EvalsPageClient.v0.1.tsx`
* `tests/evals/evals.chart.canonical-dot-colors.guard.v0.1.spec.ts`

Allowed wiring:

* import `acousticVoiceLabOrder`
* use the acoustic order for display/charts only
* preserve current labels and chart order exactly

Required tests:

* eval chart guard remains green
* ordered-views SSOT test remains green
* no UI behavior drift unless snapshots/tests explicitly prove no semantic change

### Phase 3: eval bucket consumers

Allowed candidate files:

* `src/shared/evals/spec.v0.1.ts`

Allowed wiring:

* import `evalBucketOrder` only if the runtime contract currently represents V1..V7 as bucket labels
* do not map V1..V7 to vowels in this lane

Required tests:

* eval spec tests remain green
* ordered-views SSOT test remains green

## Do not wire these directly

JSON fixtures and artifact files should not import TypeScript SSOT.

They must remain guarded by tests instead.

Do not directly wire:

* `tests/fixtures/voicelab/sgi-seed-locked-2026-03-28.v0.2.json`
* `tests/evals/evals.spec.v0.1.json`
* reviewed replay artifact JSON files

Reason:

* JSON fixtures are historical/contract evidence.
* They cannot safely import TypeScript constants.
* They should be protected by invariant tests and artifact SHA checks.

## Implementation acceptance criteria

The future implementation PR must prove:

* files changed are limited to safe consumer files and tests
* symbolic consumers use `symbolicMathOrder`
* acoustic consumers use `acousticVoiceLabOrder`
* eval bucket consumers use `evalBucketOrder`, if wired
* JSON fixtures remain unchanged
* reviewed comic artifact SHA remains unchanged
* source-language guard remains English-source-only
* candidate-language SSOT remains Albanian, Latin, Greek, Sanskrit
* no provider/model replay occurs
* no candidate scoring behavior changes
* no candidate selection behavior changes
* no evidence promotion changes
* no UI semantic drift occurs

## Out of scope

The consumer wiring implementation must not:

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

## Preferred implementation sequence

The next implementation should be narrow:

1. wire symbolic/core consumers first if low risk
2. add tests proving no symbolic behavior changed
3. wire acoustic display/eval consumers only where literal duplication is clear
4. add tests proving acoustic order remains A, O, E, Ë, U, Y, I
5. wire eval bucket helper only if it is a TypeScript source file, not JSON
6. leave JSON fixtures unchanged and guarded

If a consumer is ambiguous, do not wire it in the first implementation.

## Next implementation after review

`test(open-instrument): wire seven-voice ordered views SSOT into safe consumers v0.1`

## Next accepted task

`docs(open-instrument): review seven-voice ordered views consumer wiring definition after SSOT implementation review v0.1`
