# Exact `comic` Generalization Replay Scope v0.1

Status: EXACT_COMIC_GENERALIZATION_REPLAY_SCOPE_DEFINED.

Scope date: 2026-06-22.

Scope type: docs-only definition of exact `comic` replay scope.

Scope base:

* Short SHA: `57f1e50d`
* Full SHA: `57f1e50d5d85b8bf8151089893467c2f5152122a`
* Subject: `docs(open-instrument): select next generalization candidate after limit null closure v0.1`

Candidate selection source:

* `docs/open-instrument/zheji-generalization-next-candidate-after-limit-null-closure-v0.1.md`

Prior closed loop:

* `docs/open-instrument/zheji-generalization-limit-loop-null-accepted-closure-v0.1.md`

Prior closed artifact:

* `docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json`

## Selected replay target

Word:

`comic`

Stage:

`MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

Segmentation:

`COM + IC`

## Provider scope

Provider family:

`local_only_openai_compatible`

Provider name:

`ollama_openai_compat`

Model:

`llama3.1:8b`

Endpoint class:

`localhost_only`

Base URL:

`http://127.0.0.1:11434/v1`

Provider fallback allowed:

`false`

Automatic provider selection allowed:

`false`

Provider default mutation allowed:

`false`

## Output artifact

Future output artifact path:

`docs/open-instrument/artifacts/zheji-generalization/comic-generalization-replay-v0.1.json`

The artifact must remain development-only.

The artifact must not be treated as evidence promotion.

The artifact must not be publication framing.

## Candidate-response contract

The future provider response must validate against the same claim-boundary posture used by the `limit` replay.

The candidate-response object must include:

* `word`
* `stage`
* `segmentation`
* `candidate`
* `nullAccepted`
* `claimBoundary`

Required exact values:

* `word`: `comic`
* `stage`: `MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`
* `segmentation`: `COM + IC`

If `candidate` is null:

* `nullAccepted` must be `true`

If `candidate` is present:

* `candidate` must be an object
* `candidate.isolatedStandaloneForm` must be a non-empty string
* `candidate.plainStandaloneDefinitionGloss` must be a non-empty string
* `nullAccepted` must be `false`

## Claim boundary

The claim boundary must preserve:

* `developmentOnly: true`
* `publicationEvidence: false`
* `originEvidence: false`
* `ownershipEvidence: false`
* `modelQualityEvidence: false`
* `providerOutputCorrectnessEvidence: false`
* `candidateTruthEvidence: false`
* `evidencePromotion: false`
* `winnerCrowned: false`

## Runner readiness warning

The current checked runner path is:

`scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

That runner was originally built around the exact `limit` replay.

This scope does not assume the current runner is already safe for `comic`.

Before any `comic` execution, a separate reviewed step must confirm one of these:

* the existing runner is safely parameterized for `comic`
* or a reviewed generic/comic-specific runner repair is required

No `comic` replay execution is authorized by this scope-definition PR.

## Expected next review decision

The next PR must review this scope before implementation or execution.

The review must confirm whether this exact scope is accepted.

The review must also preserve that execution is still blocked until runner readiness is inspected or repaired.

## Boundary status

No replay execution occurred in this scope PR.

No provider execution occurred in this scope PR.

No model call occurred in this scope PR.

No localhost/Ollama call occurred in this scope PR.

No OpenAI-compatible endpoint call occurred in this scope PR.

No remote endpoint use occurred in this scope PR.

No hosted OpenAI execution occurred in this scope PR.

No DeepSeek execution occurred in this scope PR.

No model switching occurred in this scope PR.

No prompt change occurred in this scope PR.

No validator weakening occurred in this scope PR.

No runtime/API/UI behavior changes occurred in this scope PR.

No source behavior changes occurred in this scope PR.

No schema changes occurred in this scope PR.

No package metadata changes occurred in this scope PR.

No CI changes occurred in this scope PR.

No artifact mutation occurred in this scope PR.

No evidence promotion occurred in this scope PR.

No publication framing occurred in this scope PR.

No VoiceLab work occurred in this scope PR.

## Next accepted task

`docs(open-instrument): review exact comic generalization replay scope v0.1`

## Validation proof

The scope definition ran:

* selection doc proof
* closure doc proof
* prior `limit` artifact proof
* current runner specificity inspection
* `node --check scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`
* `npm test -- tests/openInstrument.limitReplayRunnerExecutionBaseContract.v0.1.spec.ts --runInBand`
* `npm test -- tests/openInstrument.brainCandidateSearchPrompt.isolationAudit.guard.v0.1.spec.ts --runInBand`
* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`
* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

All passed before merge.
