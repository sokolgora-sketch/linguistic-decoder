# Zheji Generalization Verification Extraction Audit v0.1 — Design Review

Status: DESIGN_REVIEWED_ACCEPTED.

Project lane: Open Instrument / ZËRO.

Review date: 2026-06-20.

Reviewed base:

* Short SHA: `e6678c35`
* Full SHA: `e6678c358f5576e8b79c6cb04c32b19308a1548d`

Reviewed design:

* `docs/open-instrument/zheji-generalization-verification-extraction-audit-v0.1.md`

Prerequisite governance:

* Passive Artifact Registry v0.1 is closed.
* Passive-to-Runtime Authorization Checklist v0.1 is closed.

## Review decision

The Zheji Generalization Verification Extraction Audit v0.1 design is accepted.

The design is docs-only.

The design correctly requires Heart extraction semantics before selecting the second word.

The design correctly defers `mind` until orthographic versus phonetic extraction is known.

The design correctly ranks `comic` and `limit` as cleaner candidate targets after the audit.

The design does not authorize runtime/API/UI/provider/replay work.

## What was reviewed

The review inspected the design for:

* status marker
* purpose
* extraction-audit-before-word-selection rationale
* selected milestone decision
* scope limits
* extraction audit statuses
* second-word candidate rules
* candidate comparison table
* Isolation Audit prompt-hardening requirements
* replay design rule
* result interpretation gate
* model-switch boundary
* required validation
* hard boundaries
* current next task

## Accepted design properties

The design correctly identifies the empirical question:

Does the Zheji/Open Instrument pipeline generalize beyond `study`, or does it only produce structurally valid nulls?

The design correctly separates this empirical question from runtime readiness.

The design correctly says a validated schema is not the same thing as a working research instrument.

The design correctly requires extraction semantics to be classified as one of:

* EXTRACTION_ORTHOGRAPHIC
* EXTRACTION_PHONETIC
* EXTRACTION_MIXED
* EXTRACTION_UNSPECIFIED

The design correctly blocks replay when extraction status is EXTRACTION_UNSPECIFIED.

## Candidate review

The design correctly treats `study` as a baseline only.

The design correctly defers `mind` because written `I` conflicts with common spoken /aɪ/ unless orthographic extraction is explicitly accepted.

The design correctly ranks:

1. `comic`
2. `limit`

The review accepts this ranking for the next audit stage.

The review does not lock a final second word.

The final second word must be chosen after the extraction audit.

## Isolation Audit review

The design correctly requires a future prompt hardening step before any second-word replay.

The Isolation Audit requirement is accepted:

* candidates marked `atomic` must include standalone isolated definitions in `sourceNote`
* if isolated standalone definition is unavailable, the candidate must not be marked `atomic`
* fallback classifications may include metaphorical, derived, opaque, or null

The review accepts that no schema change is authorized unless inspection proves the current schema cannot represent the audit.

## Replay boundary review

The design correctly forbids replay inside the design PR.

The design correctly requires a later replay to state:

* target word
* extraction status
* segmentation hypothesis
* candidate anchor families
* validator command
* test command
* expected output path
* rejection criteria

The design correctly keeps one-word replay as a future explicit authorization step.

## Model-switch boundary review

The design correctly does not authorize model switching.

The design correctly says a local model collapse is review evidence, not automatic authorization for DeepSeek, Ollama model change, provider execution, or prompt rewrite.

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

The design is accepted as the correct next step after the governance stack.

The milestone remains empirical, not runtime-facing.

The next PR should perform the Heart extraction semantics audit only.

The next PR should not replay Zheji.

The next PR should not choose a final second word unless the audit result is explicit enough to support it.

## Current next task

`docs(open-instrument): audit Heart extraction semantics for Zheji generalization v0.1`
