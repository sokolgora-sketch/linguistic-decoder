# Isolation Audit Prompt Hardening for `limit` Generalization v0.1 — Review

Status: ISOLATION_AUDIT_PROMPT_HARDENING_REVIEWED_ACCEPTED.

Project lane: Open Instrument / ZËRO.

Review date: 2026-06-21.

Reviewed base:

* Short SHA: `49a8e66b`
* Full SHA: `49a8e66b0efaac597536b530c8e52b00a4614902`

Reviewed definition:

* `docs/open-instrument/zheji-generalization-isolation-audit-prompt-hardening-limit-v0.1.md`

Prerequisite chain:

* `docs/open-instrument/zheji-generalization-verification-extraction-audit-v0.1.md`
* `docs/open-instrument/reviews/zheji-generalization-verification-extraction-audit-design-review-v0.1.md`
* `docs/open-instrument/zheji-generalization-heart-extraction-semantics-audit-v0.1.md`
* `docs/open-instrument/reviews/zheji-generalization-heart-extraction-semantics-audit-review-v0.1.md`
* `docs/open-instrument/zheji-generalization-second-word-selection-mixed-heart-extraction-v0.1.md`
* `docs/open-instrument/reviews/zheji-generalization-second-word-selection-mixed-heart-extraction-review-v0.1.md`

## Review decision

The Isolation Audit prompt-hardening definition is accepted.

Selected word:

`limit`

Selected stage:

`MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

Accepted requirement:

* A candidate cannot be marked `atomic` unless `sourceNote` includes an isolated standalone form and isolated standalone definition.

This review is docs-only.

This review does not modify prompt source.

This review does not modify helper source.

This review does not modify schema.

This review does not modify validator code.

This review does not replay Zheji.

This review does not authorize runtime/API/UI/provider/model-switch work.

## What was reviewed

The review inspected the definition for:

* status marker
* prerequisite chain
* selected word
* selected stage
* required prompt block
* required behavior
* `limit`-specific application
* classification rule
* `sourceNote` rule
* validator expectation
* future implementation boundary
* replay boundary
* rejection criteria
* hard boundaries
* current next task

## Accepted hardening rule

The review accepts that `atomic` must require:

* isolated standalone form
* isolated standalone definition
* separation between standalone meaning and target-word interpretation
* no metaphor as atomic proof
* no resonance as atomic proof
* no target-word convenience as atomic proof
* no origin, ownership, publication, or model-quality claim

If isolated standalone proof is unavailable, the candidate must be downgraded or nulled.

## Accepted classification posture

The review accepts the classification posture:

| Classification | Review decision |
| --- | --- |
| `atomic` | allowed only with isolated standalone form and definition |
| `derived` | allowed only if schema/enum supports it or future lane authorizes representation |
| `metaphorical` | allowed for interpretive relation, not atomic proof |
| `opaque` | allowed when candidate exists but relation is unclear |
| `null` | allowed and must include `null_reason` |

If the current schema cannot represent `derived`, the implementation must not silently add schema support.

It must either use an existing allowed representation or stop for a separate schema-change lane.

## Accepted `limit` application

The review accepts applying the hardening to all future `limit` chunk hypotheses:

* `LIMIT`
* `LI + MIT`
* `LIM + IT`

No chunk is pre-accepted by this review.

Every chunk remains hypothesis-only until replay and review.

## Implementation boundary

A future implementation PR is now allowed to be proposed.

That implementation must stay within the reviewed boundary:

* prompt source modification may be allowed if it is the exact prompt contract implementing this hardening
* tests may be allowed if they lock the prompt hardening behavior
* schema changes remain unauthorized unless a separate lane authorizes them
* validator changes remain unauthorized unless the implementation PR proves and scopes the need
* runtime/API/UI changes remain unauthorized
* provider execution remains unauthorized
* Zheji replay remains unauthorized

## Replay boundary

No replay occurred in this review.

No replay is authorized by this review.

A future replay still requires a separate explicit authorization PR after implementation and review.

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

The hardening definition is sufficient to move to a scoped implementation PR.

The implementation should inspect the existing prompt source first.

The implementation should not guess the target file.

The implementation must prove changed files exactly.

Runtime readiness remains premature.

## Current next task

`test(open-instrument): implement Isolation Audit prompt hardening for limit generalization v0.1`
