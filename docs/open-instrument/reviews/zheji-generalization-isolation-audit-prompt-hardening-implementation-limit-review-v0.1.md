# Isolation Audit Prompt Hardening Implementation for `limit` Generalization v0.1 — Review

Status: ISOLATION_AUDIT_PROMPT_HARDENING_IMPLEMENTATION_REVIEWED_ACCEPTED.

Project lane: Open Instrument / ZËRO.

Review date: 2026-06-21.

Reviewed base:

* Short SHA: `44ea4ffc`
* Full SHA: `44ea4ffc6c4b4851c9687d637d514340503a3bdf`

Reviewed implementation commit subject:

* `test(open-instrument): implement Isolation Audit prompt hardening for limit generalization v0.1`

Reviewed changed files:

* `src/shared/openInstrument/brainCandidateSearchPrompt.v0.1.ts`
* `tests/openInstrument.brainCandidateSearchPrompt.isolationAudit.guard.v0.1.spec.ts`

Prerequisite docs:

* `docs/open-instrument/zheji-generalization-isolation-audit-prompt-hardening-limit-v0.1.md`
* `docs/open-instrument/reviews/zheji-generalization-isolation-audit-prompt-hardening-limit-review-v0.1.md`

## Review decision

The Isolation Audit prompt-hardening implementation is accepted.

Selected word:

`limit`

Selected stage:

`MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

The implementation correctly adds `<ISOLATION_AUDIT>` to the Brain candidate-search system prompt.

The implementation correctly preserves the current `candidateType` enum contract.

The implementation correctly adds prompt guard tests.

This review is docs-only.

This review does not replay Zheji.

This review does not authorize provider execution.

This review does not authorize runtime/API/UI work.

This review does not authorize model switching.

## What was reviewed

The review inspected:

* prompt target file
* guard test file
* `<ISOLATION_AUDIT>` opening marker
* `</ISOLATION_AUDIT>` closing marker
* isolated standalone form requirement
* plain standalone definition/gloss requirement
* standalone-versus-contextual distinction
* metaphor/resonance/target-word-convenience ban for atomic proof
* current `candidateType` enum preservation
* fallback labels restricted to `sourceNote` or `notes`
* null-candidate auditability requirement
* exact changed-file proof
* validation output

## Accepted implementation behavior

The prompt now requires that any candidate described as atomic must include:

* isolated standalone form
* plain standalone definition or gloss
* distinction between standalone meaning and target-word interpretation

The prompt now forbids using these as atomic proof:

* metaphor
* symbolic resonance
* target-word convenience

The prompt also forbids claiming:

* origin
* ownership
* publication evidence
* model-quality evidence

## Enum-contract review

The implementation correctly does not add unsupported `candidateType` values.

Fallback labels such as `metaphorical`, `derived`, `opaque`, or `null` are restricted to `sourceNote` or `notes`.

Allowed `candidateType` values remain governed by the existing prompt/schema contract.

## Test review

The guard test locks:

* Isolation Audit block presence
* isolated standalone proof requirement
* metaphor/resonance/target-word-convenience rejection
* current `candidateType` enum preservation
* fallback labels in `sourceNote` or `notes`
* null-candidate explanation behavior

## Boundary review

The implementation did not change:

* runtime behavior
* API output
* UI output
* schema
* validator source
* package metadata
* CI

The implementation did not execute:

* provider calls
* OpenAI calls
* remote endpoint calls
* localhost/Ollama calls
* Zheji replay

## Replay boundary

No replay occurred in this implementation.

No replay is authorized by this review.

A future replay still requires a separate explicit authorization PR.

## Validation proof

The review ran:

* `npm test -- tests/openInstrument.brainCandidateSearchPrompt.isolationAudit.guard.v0.1.spec.ts --runInBand`
* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`
* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

All passed before merge.

## Review notes

The Isolation Audit hardening is now implementation-complete.

The next lane may authorize a single `limit` generalization replay.

That replay must still be separately authorized.

Runtime readiness remains premature.

Provider execution and model switching remain unauthorized.

## Current next task

`docs(open-instrument): authorize limit generalization replay v0.1`
