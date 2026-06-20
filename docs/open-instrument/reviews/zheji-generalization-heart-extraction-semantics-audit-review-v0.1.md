# Zheji Generalization Heart Extraction Semantics Audit v0.1 — Review

Status: EXTRACTION_AUDIT_REVIEWED_ACCEPTED.

Project lane: Open Instrument / ZËRO.

Review date: 2026-06-20.

Reviewed base:

* Short SHA: `59e0f194`
* Full SHA: `59e0f1949bb7e326080551b5f795dd202eaa1852`

Reviewed audit:

* `docs/open-instrument/zheji-generalization-heart-extraction-semantics-audit-v0.1.md`

Prerequisite design:

* `docs/open-instrument/zheji-generalization-verification-extraction-audit-v0.1.md`
* `docs/open-instrument/reviews/zheji-generalization-verification-extraction-audit-design-review-v0.1.md`

## Review decision

The Heart extraction semantics audit is accepted.

The reviewed extraction status is:

`EXTRACTION_MIXED`

The audit is docs-only.

The audit does not select the final second word.

The audit does not replay Zheji.

The audit does not authorize runtime/API/UI/provider/model-switch work.

## What was reviewed

The review inspected the audit for:

* status marker
* audited base
* extraction decision
* evidence summary
* evidence excerpt
* interpretation
* candidate implication
* unauthorized behavior list
* validation proof
* hard boundaries
* current next task

## Accepted extraction interpretation

The audit classification `EXTRACTION_MIXED` is accepted for the next planning step.

This means the repository contains both:

* orthographic vowel extraction evidence
* phonetic / IPA / carrier extraction evidence

The review does not treat `EXTRACTION_MIXED` as a single runtime call contract.

The review treats it as a repository-level extraction posture that must be narrowed before replay.

## Candidate implication review

Because extraction is mixed, the final second word is still not selected.

The next step must define which stage is being tested:

* orthographic written-vowel stage
* phonetic / IPA / carrier-vowel stage
* explicit mixed-stage comparison

The current candidate posture remains:

| Candidate | Review posture | Reason |
| --- | --- | --- |
| `comic` | preferred | good written O -> I test and velar C/K context, but final selection depends on selected extraction stage |
| `limit` | backup | cleaner repeated written I and lower known-answer bias |
| `mind` | deferred | written I conflicts with spoken /aɪ/ unless an orthographic-only test is explicitly selected |

## Required next decision

The next PR must define second-word selection under mixed extraction semantics.

That PR must answer:

1. Which extraction stage is being tested?
2. Is the first replay orthographic-only, phonetic-only, or mixed-stage?
3. Is `comic` still the selected target under that stage?
4. What segmentation hypothesis is allowed?
5. What remains forbidden before the authorized replay?

## Isolation Audit implication

The Isolation Audit prompt-hardening step remains required before replay.

This review does not implement the Isolation Audit.

This review does not authorize the replay.

## Replay boundary review

No replay occurred in this audit.

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

The audit answered the first core question: extraction is not purely orthographic and not purely phonetic at the repository level.

Because the status is mixed, the next milestone must narrow the test stage before selecting the final second word.

Runtime readiness remains premature.

Provider/model switching remains unauthorized.

## Current next task

`docs(open-instrument): define second-word selection under mixed Heart extraction semantics v0.1`
