# Open Instrument Study Segmentation 004 Prototype Failure Review v0.1
Date: 2026-06-04

Status: internal development diagnostic review only.

This document reviews the failed/negative Open Instrument Heart-to-Brain prototype artifact for `study.segmentation.004`.

No new model call is performed by this review.

No code changes are made by this review.

This review is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not proof that any candidate is true, and not proof that any language is origin.

---

## 1. Purpose

The purpose is to diagnose why the `study.segmentation.004` / `S + TU + DI` prototype failed deterministic Brain output validation.

The goal is not to rescue the result.

The goal is to record the failure mode before changing prompts or rerunning the model.

---

## 2. Source files

Artifact:

    docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-004-v0.1.json

Result doc:

    docs/open-instrument/study-heart-brain-qwen3-8b-segmentation-004-result-v0.1.md

Successful segmentation 002 v0.2 artifact:

    docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.2.json

Successful segmentation 002 v0.2 review:

    docs/open-instrument/study-segmentation-002-v0.2-prototype-review-v0.1.md

Successful segmentation 003 artifact:

    docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-003-v0.1.json

Successful segmentation 003 review:

    docs/open-instrument/study-heart-brain-prototype-review-v0.1.md

---

## 3. Prototype summary

Prototype:

- word: `study`
- Heart segmentation: `study.segmentation.004`
- embryo/chunk split: `S + TU + DI`
- model: `qwen3:8b`
- parse ok: `true`
- validation ok: `false`
- checked candidates: `3`
- checked null candidates: `3`
- covered chunks: `S, TU, DI`
- missing chunks: `none`
- validation issue count: `2`

---

## 4. Candidate table

| Kind | Chunk | Language | Form | Meaning | Candidate type | Evidence type | False-friend risk | Null | segmentationId |
|---|---|---|---|---|---|---|---|---|---|
| candidate | S | Germanic | S | container | weak_resonance | doctrine_alignment | medium | false | study.segmentation.004 |
| candidate | TU | Latin | tu | you | weak_resonance | phonetic_only | high | false | study.segmentation.004 |
| candidate | DI | Greek | di | to give | weak_resonance | phonetic_only | medium | false | study.segmentation.004 |
| null | S | Sanskrit | S | null | null_candidate | none | none | true | study.segmentation.004 |
| null | TU | Chinese | TU | null | null_candidate | none | none | true | study.segmentation.004 |
| null | DI | Arabic | DI | null | null_candidate | none | none | true | - |

---

## 5. Validation issue table

| Severity | Code | Path | Message |
|---|---|---|---|
| error | MISSING_FIELD | nullCandidates.2.segmentationId | candidate missing required field: segmentationId |
| error | SEGMENTATION_ID_MISMATCH | nullCandidates.2.segmentationId | candidate segmentationId must match Heart input segmentationId. |

---

## 6. Failure classification

This is a narrow null-candidate traceability failure.

It is not:

- parser failure;
- Heart segmentation failure;
- chunk coverage failure;
- broad candidate-search failure.

Important facts:

- Brain output parsed as JSON.
- Brain covered all Heart-approved chunks: `S, TU, DI`.
- Missing chunks: `none`.
- Validation failed with `2` issues.
- Both issues are located at `nullCandidates.2.segmentationId`.

This is a valid negative/diagnostic artifact.

The validator did its job.

---

## 7. Null-candidate traceability analysis

Failing traceability issue:

- MISSING_FIELD at nullCandidates.2.segmentationId: candidate missing required field: segmentationId
- SEGMENTATION_ID_MISMATCH at nullCandidates.2.segmentationId: candidate segmentationId must match Heart input segmentationId.

Null candidates are evidence.

Because null candidates record absence, they must remain traceable to:

- the exact Heart-approved segmentation;
- the exact Heart-approved chunk;
- the artifact that produced them;
- the validation result.

If a null candidate omits or changes `segmentationId`, the negative evidence becomes hard to audit.

That is why this failure should be fixed through a focused prompt contract patch, not ignored.

---

## 8. Comparison with study.segmentation.002 v0.2

Segmentation 002 v0.2:

- segmentation: `study.segmentation.002`
- embryo/chunk split: `STU + DI`
- parse ok: `true`
- validation ok: `true`
- validation issue count: `0`

Segmentation 004:

- segmentation: `study.segmentation.004`
- embryo/chunk split: `S + TU + DI`
- parse ok: `true`
- validation ok: `false`
- validation issue count: `2`

Reading:

- `study.segmentation.002` v0.2 passed structurally.
- `study.segmentation.004` failed narrowly.
- Segmentation 004 creates higher pressure because it has more chunks and likely more null candidates.
- The failure does not prove `S + TU + DI` is bad.

---

## 9. Comparison with study.segmentation.003

Segmentation 003:

- segmentation: `study.segmentation.003`
- embryo/chunk split: `SHTU + DI`
- parse ok: `true`
- validation ok: `true`
- validation issue count: `0`

Segmentation 004:

- segmentation: `study.segmentation.004`
- embryo/chunk split: `S + TU + DI`
- parse ok: `true`
- validation ok: `false`
- validation issue count: `2`

Reading:

- `study.segmentation.003` passed structurally.
- `study.segmentation.004` failure does not invalidate segmentation 004.
- It exposes null-candidate traceability pressure under a more granular split.

---

## 10. Interpretation

This is a negative/diagnostic artifact.

The model mostly obeyed the contract:

- JSON parsed;
- all chunks were covered;
- only two structural issues were recorded.

The failure is narrow and actionable.

A broad prompt rewrite is not needed.

The next change should specifically reinforce null-candidate `segmentationId` traceability.

---

## 11. Recommended next action

Do not rerun immediately.

Recommended next PR:

fix(open-instrument): reinforce null candidate traceability contract

That PR should:

- strengthen Brain prompt wording around `nullCandidates[].segmentationId`;
- state that null candidates follow the same traceability rules as chunk candidates;
- state that `segmentationId` must be copied exactly into every null candidate;
- state that missing or different `segmentationId` makes the output invalid;
- add focused guard tests for the prompt contract.

After that, rerun `study.segmentation.004`.

---

## 12. Claim boundary

This review is:

- development diagnostic review only.

It is not:

- scientific evidence;
- publication evidence;
- eval evidence;
- Cohort evidence;
- proof that any candidate is true;
- proof that any language is origin;
- a reason to change the default provider from `mock`.

---

## 13. Completion definition

This review is complete when:

- source artifact path is recorded;
- source result doc path is recorded;
- prototype summary is recorded;
- candidate table is recorded;
- validation issue table is recorded;
- failure classification is explicit;
- null-candidate traceability analysis is recorded;
- comparison with `study.segmentation.002` v0.2 is recorded;
- comparison with `study.segmentation.003` is recorded;
- next action is selected;
- claim boundary is explicit;
- no code changes are made;
- no new model call is made;
- local validation passes.
