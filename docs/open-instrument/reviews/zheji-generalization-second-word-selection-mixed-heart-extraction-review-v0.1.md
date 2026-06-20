# Zheji Generalization Second-Word Selection Under Mixed Heart Extraction v0.1 — Review

Status: SECOND_WORD_SELECTION_REVIEWED_ACCEPTED.

Project lane: Open Instrument / ZËRO.

Review date: 2026-06-20.

Reviewed base:

* Short SHA: `2554684d`
* Full SHA: `2554684d70681262da3be5f0c70e811a0b61e2e5`

Reviewed selection:

* `docs/open-instrument/zheji-generalization-second-word-selection-mixed-heart-extraction-v0.1.md`

Prerequisite chain:

* `docs/open-instrument/zheji-generalization-verification-extraction-audit-v0.1.md`
* `docs/open-instrument/reviews/zheji-generalization-verification-extraction-audit-design-review-v0.1.md`
* `docs/open-instrument/zheji-generalization-heart-extraction-semantics-audit-v0.1.md`
* `docs/open-instrument/reviews/zheji-generalization-heart-extraction-semantics-audit-review-v0.1.md`

## Review decision

The second-word selection under mixed Heart extraction semantics is accepted.

Accepted extraction status:

`EXTRACTION_MIXED`

Accepted first replay stage:

`MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

Accepted selected word:

`limit`

Accepted backup word:

`comic`

Accepted deferred word:

`mind`

This review is docs-only.

This review does not replay Zheji.

This review does not implement Isolation Audit prompt hardening.

This review does not authorize runtime/API/UI/provider/model-switch work.

## What was reviewed

The review inspected the selection for:

* status marker
* prerequisite chain
* extraction status
* selected replay stage
* selected second word
* backup word
* deferred word
* `limit` rationale
* `comic` rationale
* `mind` deferral rationale
* segmentation posture
* candidate-anchor posture
* Isolation Audit requirement
* replay boundary
* rejection criteria
* hard boundaries
* current next task

## Accepted stage

The review accepts:

`MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

This means the first replay should test the written-vowel Heart path as the primary stage, while retaining phonetic sanity checks to avoid obvious spelling/pronunciation traps.

This is the correct response to `EXTRACTION_MIXED`.

It does not pretend the repository is purely orthographic.

It does not pretend the repository is purely phonetic.

## Accepted word

The review accepts `limit` as the first generalization word.

Accepted reasons:

* written vowel pattern is simple
* common spoken pronunciation does not introduce a diphthong target
* no silent-letter trap
* no rhotic-ending trap
* no full reuse of the `ST` cluster from `study`
* introduces lateral `L` and nasal `M`
* lower known-answer bias than `mind`

## Backup and deferred words

The review accepts `comic` as the backup word.

`comic` remains useful later because it tests O -> I and velar C/K context.

The review accepts `mind` as deferred.

`mind` should be reserved for a deliberate spelling/pronunciation divergence test, not the first generalization replay.

## Segmentation review

The review accepts the allowed future segmentation posture:

* whole form: `LIMIT`
* coarse chunks: `LI + MIT`
* backup coarse chunks: `LIM + IT`

The future replay must state its chosen segmentation before execution.

The future replay must not tune the prompt specifically to make `limit` succeed.

## Candidate-anchor review

The review accepts the candidate-anchor posture as hypothesis-only.

No candidate may be accepted as:

* true origin evidence
* ownership evidence
* publication evidence
* model-quality evidence

The future replay must preserve candidate-truth uncertainty.

## Isolation Audit review

The review accepts that Isolation Audit prompt hardening remains required before replay.

This review does not implement that hardening.

The next task should define the Isolation Audit prompt hardening for `limit` generalization.

## Replay boundary review

No replay occurred in this selection.

No replay is authorized by this review.

A future replay still requires a separate explicit authorization step.

## Validation proof

The review ran:

* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`
* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

All passed before merge.

## Boundary review

Hard boundaries preserved:

* No provider execution.
* No Zheji replay.
* No runtime/API/UI behavior changes.
* No package metadata changes.
* No CI changes.
* No evidence promotion.
* No publication framing.
* No VoiceLab work.

## Review notes

The first empirical generalization word is now selected, but the instrument is not yet replay-authorized.

The next correct step is Isolation Audit prompt hardening.

Runtime readiness remains premature.

Provider execution and model switching remain unauthorized.

## Current next task

`docs(open-instrument): define Isolation Audit prompt hardening for limit generalization v0.1`
