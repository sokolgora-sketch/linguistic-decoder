# Zheji Generalization Second-Word Selection Under Mixed Heart Extraction v0.1

Status: SECOND_WORD_SELECTION_DEFINED.

Project lane: Open Instrument / ZËRO.

Definition date: 2026-06-20.

Definition base:

* Short SHA: `48ef560c`
* Full SHA: `48ef560c5d09f0557028699761e0202057013edc`

Prerequisite chain:

* `docs/open-instrument/zheji-generalization-verification-extraction-audit-v0.1.md`
* `docs/open-instrument/reviews/zheji-generalization-verification-extraction-audit-design-review-v0.1.md`
* `docs/open-instrument/zheji-generalization-heart-extraction-semantics-audit-v0.1.md`
* `docs/open-instrument/reviews/zheji-generalization-heart-extraction-semantics-audit-review-v0.1.md`

## Selection decision

The reviewed Heart extraction posture is:

`EXTRACTION_MIXED`

The first generalization replay should test this stage:

`MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

The selected second word is:

`limit`

The backup word is:

`comic`

The deferred word is:

`mind`

## Why the stage is orthographic-primary with phonetic sanity

The extraction audit found mixed repository-level extraction posture.

That means the first replay must not pretend the repository is purely orthographic or purely phonetic.

The first replay should use the written-vowel Heart path as the primary test stage, while requiring a phonetic sanity check to avoid obvious English-spelling traps.

This keeps the first generalization test narrow.

It also avoids choosing a word whose written form and spoken form pull the analysis in opposite directions.

## Why `limit` is selected

`limit` is selected because it is cleaner than the available alternatives for the first mixed-extraction generalization run.

Properties:

* written vowel pattern: `I-I`
* common spoken English pronunciation: short /ɪ/ then short /ɪ/
* no diphthong target
* no silent letter
* no rhotic ending
* no obvious schwa-reduction trap for the test purpose
* no reuse of the full `ST` cluster from `study`
* introduces lateral `L` and nasal `M`
* lower known-answer bias than `mind`

The first replay should ask whether the instrument generalizes to a clean, conservative word before using more interesting but noisier words.

## Why `comic` is backup

`comic` remains useful because it tests a written `O -> I` path and introduces velar C/K context.

It is not selected first because the first vowel may introduce pronunciation and accent ambiguity.

That ambiguity is useful later but unnecessary for the first generalization replay.

## Why `mind` remains deferred

`mind` remains deferred because written `I` commonly maps to spoken /aɪ/.

That makes `mind` a poor first target under mixed extraction semantics unless a later PR explicitly chooses an orthographic-only test.

`mind` can be useful later as a deliberate spelling/pronunciation divergence test.

It is not the correct first second-word replay.

## Allowed segmentation posture

The future replay may use a conservative segmentation posture for `limit`.

Allowed initial segmentation hypothesis:

* whole form: `LIMIT`
* coarse chunks: `LI + MIT`
* backup coarse chunks: `LIM + IT`

The replay must not tune the prompt specifically to make `limit` succeed.

The replay must state the segmentation hypothesis before execution.

## Candidate-anchor posture

Candidate anchors are hypotheses only.

The future replay may inspect candidate pressure around:

* written `LI`
* written `MIT`
* whole-form `LIMIT`
* Latin/Romance limit-family forms only as candidate pressure
* Albanian or Greek carriers only if the model can provide isolated standalone evidence under the Isolation Audit

No candidate may be accepted as true origin evidence.

No candidate may be treated as ownership evidence.

No candidate may be promoted to publication evidence.

## Isolation Audit requirement

The Isolation Audit remains required before replay.

Before a candidate can be marked `atomic`, it must include an isolated standalone definition in `sourceNote`.

If isolated standalone definition is unavailable, the candidate must not be marked `atomic`.

Allowed fallback classifications include:

* metaphorical
* derived
* opaque
* null

This selection does not implement the Isolation Audit.

This selection does not modify prompts.

## Replay boundary

No replay is authorized by this document.

A future replay requires a separate explicit authorization PR.

That future PR must state:

* selected word: `limit`
* selected extraction stage: `MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`
* segmentation hypothesis
* prompt version
* validator command
* test command
* output path
* rejection criteria
* rollback plan

## Rejection criteria for future replay authorization

A future replay authorization must be rejected if it:

* changes runtime behavior
* changes API output
* changes UI output
* changes package metadata
* changes CI
* authorizes provider execution without a separate explicit provider authorization
* switches model without a separate explicit model-switch authorization
* permits word-specific prompt tuning
* skips Isolation Audit hardening
* claims candidate truth before review
* claims origin evidence before review
* claims ownership evidence before review
* claims publication evidence before review

## What remains unauthorized

This selection does not authorize:

* Zheji replay
* provider execution
* OpenAI execution
* remote endpoint execution
* localhost/Ollama execution
* model switching
* DeepSeek switching
* runtime wiring
* API output changes
* UI output changes
* package metadata changes
* CI changes
* evidence packs
* publication framing
* candidate-truth claims
* origin claims
* ownership claims
* model-quality claims
* VoiceLab work

## Validation proof required for review

The review of this selection must run:

* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`
* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

## Hard boundaries

Hard boundaries preserved:

* No provider execution.
* No Zheji replay.
* No runtime/API/UI behavior changes.
* No package metadata changes.
* No CI changes.
* No evidence promotion.
* No publication framing.
* No VoiceLab work.

## Current next task

`docs(open-instrument): review second-word selection under mixed Heart extraction semantics v0.1`
