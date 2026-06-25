# Seven-voice ordered views safe consumer wiring implementation review v0.1

Date: 2026-06-25

Status: SEVEN_VOICE_ORDERED_VIEWS_SAFE_CONSUMER_WIRING_IMPLEMENTATION_REVIEWED_ACCEPTED_READY_FOR_SYMBOLIC_CORE_CONSUMER_WIRING.

Reviewed implementation:

* Short SHA: 7c848e89
* Full SHA: 7c848e896fb5a2984e08694686b527babb5d5f12
* Subject: test(open-instrument): wire seven-voice ordered views SSOT into safe consumers v0.1

Reviewed changed files:

* src/shared/evals/spec.v0.1.ts
* src/ui/evals/EvalsPageClient.v0.1.tsx
* tests/evals/evals.chart.canonical-dot-colors.guard.v0.1.spec.ts
* tests/openInstrument.sevenVoiceOrderedViewsSsot.v0.1.spec.ts
* tests/openInstrument.sevenVoiceOrderedViewsConsumerWiring.v0.1.spec.ts

Reviewed artifact:

* docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json
* SHA-256: 51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65

## Review verdict

The safe consumer wiring implementation is accepted.

The implementation correctly wires the first low-risk TypeScript consumers to the seven-voice ordered-views SSOT.

## Accepted changes

The eval bucket TypeScript spec now imports and uses evalBucketOrder.

The eval chart UI now imports and uses acousticVoiceLabOrder.

The eval chart guard now imports acousticVoiceLabOrder and confirms the expected acoustic order.

The ordered-views SSOT test now accepts either literal ordered views or safe SSOT references.

The new consumer-wiring test proves the safe wiring boundary.

## Confirmed unchanged boundaries

JSON fixtures remain unwired.

Reviewed replay artifact remains unchanged.

Source-language guard remains unchanged.

Candidate-language guard remains unchanged.

No provider or model replay occurred.

No candidate scoring behavior changed.

No candidate selection behavior changed.

No evidence promotion changed.

No publication posture changed.

## Accepted implementation scope

Accepted TypeScript wiring:

* src/shared/evals/spec.v0.1.ts -> evalBucketOrder
* src/ui/evals/EvalsPageClient.v0.1.tsx -> acousticVoiceLabOrder
* tests/evals/evals.chart.canonical-dot-colors.guard.v0.1.spec.ts -> acousticVoiceLabOrder

Accepted test updates:

* tests/openInstrument.sevenVoiceOrderedViewsSsot.v0.1.spec.ts
* tests/openInstrument.sevenVoiceOrderedViewsConsumerWiring.v0.1.spec.ts

Rejected/blocked from this lane:

* JSON fixture imports
* replay artifact mutation
* source-language expansion
* candidate-language expansion
* symbolic/core consumer wiring

## Validation

The review reran:

* ordered-views SSOT focused test
* consumer-wiring focused test
* eval chart guard focused test
* npm run gate:quick
* artifact SHA proof

All passed.

## Next accepted task

test(open-instrument): wire seven-voice ordered views SSOT into symbolic core consumers v0.1
