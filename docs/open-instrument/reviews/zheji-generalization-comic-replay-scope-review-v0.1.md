# Exact `comic` Generalization Replay Scope v0.1 — Review

Status: EXACT_COMIC_GENERALIZATION_REPLAY_SCOPE_REVIEWED_ACCEPTED_EXECUTION_BLOCKED_PENDING_RUNNER_READINESS.

Review date: 2026-06-22.

Review scope: docs-only review of exact `comic` replay scope.

Reviewed scope base:

* Short SHA: `6b2a086f`
* Full SHA: `6b2a086f0f7ab35399b21f3771c5435720e5632e`
* Subject: `docs(open-instrument): define exact comic generalization replay scope v0.1`

Reviewed scope doc:

* `docs/open-instrument/zheji-generalization-comic-replay-scope-v0.1.md`

Candidate selection source:

* `docs/open-instrument/zheji-generalization-next-candidate-after-limit-null-closure-v0.1.md`

Prior closed loop:

* `docs/open-instrument/zheji-generalization-limit-loop-null-accepted-closure-v0.1.md`

## Review decision

The exact `comic` replay scope is accepted.

Execution remains blocked.

The next step is runner readiness inspection.

## Accepted replay target

Word:

`comic`

Stage:

`MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

Segmentation:

`COM + IC`

Output artifact:

`docs/open-instrument/artifacts/zheji-generalization/comic-generalization-replay-v0.1.json`

## Accepted provider posture

Provider family:

`local_only_openai_compatible`

Provider name:

`ollama_openai_compat`

Model:

`llama3.1:8b`

Endpoint class:

`localhost_only`

Provider fallback allowed:

`false`

Automatic provider selection allowed:

`false`

Provider default mutation allowed:

`false`

## Accepted validation posture

The future response must include:

* `word`
* `stage`
* `segmentation`
* `candidate`
* `nullAccepted`
* `claimBoundary`

The future response must preserve the exact values:

* `word: comic`
* `stage: MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`
* `segmentation: COM + IC`

If `candidate` is null, `nullAccepted` must be true.

If `candidate` is present, `nullAccepted` must be false and the candidate must include a standalone form plus plain standalone definition gloss.

## Accepted boundary

The claim boundary remains:

* `developmentOnly: true`
* `publicationEvidence: false`
* `originEvidence: false`
* `ownershipEvidence: false`
* `modelQualityEvidence: false`
* `providerOutputCorrectnessEvidence: false`
* `candidateTruthEvidence: false`
* `evidencePromotion: false`
* `winnerCrowned: false`

## Runner readiness decision

This review does not authorize execution.

The current runner was built through the `limit` lane and may still contain `limit`-specific assumptions.

Before any `comic` execution, the runner must be inspected in a separate PR.

That inspection must decide one of these:

* existing runner is safely parameterized for `comic`
* generic runner repair is required
* comic-specific runner repair is required
* execution remains blocked

## Boundary proof

No replay execution occurred in this review PR.

No provider execution occurred in this review PR.

No model call occurred in this review PR.

No localhost/Ollama call occurred in this review PR.

No OpenAI-compatible endpoint call occurred in this review PR.

No remote endpoint use occurred in this review PR.

No hosted OpenAI execution occurred in this review PR.

No DeepSeek execution occurred in this review PR.

No model switching occurred in this review PR.

No prompt change occurred in this review PR.

No validator weakening occurred in this review PR.

No runtime/API/UI behavior changes occurred in this review PR.

No source behavior changes occurred in this review PR.

No schema changes occurred in this review PR.

No package metadata changes occurred in this review PR.

No CI changes occurred in this review PR.

No artifact mutation occurred in this review PR.

No evidence promotion occurred in this review PR.

No publication framing occurred in this review PR.

No VoiceLab work occurred in this review PR.

## Next accepted task

`docs(open-instrument): inspect comic replay runner readiness v0.1`

## Validation proof

The review ran:

* scope doc proof
* candidate selection doc proof
* prior limit closure proof
* prior limit artifact proof
* runner specificity inspection
* `node --check scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`
* `npm test -- tests/openInstrument.limitReplayRunnerExecutionBaseContract.v0.1.spec.ts --runInBand`
* `npm test -- tests/openInstrument.brainCandidateSearchPrompt.isolationAudit.guard.v0.1.spec.ts --runInBand`
* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`
* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

All passed before merge.
