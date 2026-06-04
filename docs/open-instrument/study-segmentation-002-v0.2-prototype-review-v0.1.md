# Open Instrument Study Segmentation 002 v0.2 Prototype Review v0.1
Date: 2026-06-04

Status: internal development review only.

This document reviews the existing Open Instrument Heart-to-Brain prototype artifact for `study.segmentation.002` v0.2.

No new model call is performed by this review.

No code changes are made by this review.

This review is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not proof that any candidate is true, and not proof that any language is origin.

---

## 1. Purpose

The purpose is to review the `study.segmentation.002` / `STU + DI` v0.2 prototype after PR #1173 reinforced the Brain enum/segmentationId prompt contract.

The review checks whether the repair workflow worked structurally before moving to another segmentation.

---

## 2. Source files

Current v0.2 artifact:

    docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.2.json

Current v0.2 result doc:

    docs/open-instrument/study-heart-brain-qwen3-8b-segmentation-002-result-v0.2.md

Failed v0.1 artifact:

    docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.1.json

Failed v0.1 review:

    docs/open-instrument/study-segmentation-002-prototype-failure-review-v0.1.md

Successful segmentation 003 baseline artifact:

    docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-003-v0.1.json

Successful segmentation 003 review:

    docs/open-instrument/study-heart-brain-prototype-review-v0.1.md

---

## 3. Prototype summary

Prototype:

- word: `study`
- Heart segmentation: `study.segmentation.002`
- embryo/chunk split: `STU + DI`
- model: `qwen3:8b`
- parse ok: `true`
- validation ok: `true`
- checked candidates: `2`
- checked null candidates: `2`
- covered chunks: `STU, DI`
- missing chunks: `none`
- validation issue count: `0`

---

## 4. Candidate table

| Kind | Chunk | Language | Form | Meaning | Candidate type | Evidence type | False-friend risk | Null | Notes/source summary |
|---|---|---|---|---|---|---|---|---|---|
| candidate | STU | Latin | studium | a place of learning | historical_match | historical_etymology | low | false | Historical etymology of Latin `studium`; matches Latin root for scholarly pursuit |
| candidate | DI | Greek | dē | through, across | phonetic_resonance | phonetic_only | medium | false | Phonetic variant DY→DI in Greek prepositions; `DI` aligns with Greek `dē` via Y→I transform |
| null | STU | Chinese | study | study (loanword) | null_candidate | none | none | true | No native Chinese etymology match; loanword lacks segmentation match |
| null | DI | Finnish | di | not applicable | null_candidate | none | none | true | No Finnish word matches DI/DY; no cognate or loanword found |

---

## 5. Candidate quality reading

| Chunk | Language | Form | Candidate type | False-friend risk | Review reading |
|---|---|---|---|---|---|
| STU | Latin | studium | historical_match | low | useful candidate, source-check required |
| DI | Greek | dē | phonetic_resonance | medium | thin candidate |
| STU | Chinese | study | null_candidate | none | null candidate |
| DI | Finnish | di | null_candidate | none | null candidate |

Review rules:

- Useful candidates still require source checking.
- Null candidates are useful negative results.
- Short chunks remain false-positive sensitive.
- Candidate rows are not origin claims.

---

## 6. Validation reading

Validation passed structurally.

Result:

- validation ok: `true`
- validation issue count: `0`

The validator confirms schema/contract compliance only.

It does not prove:

- candidate truth;
- source accuracy;
- historical origin;
- external linguistic consensus.

---

## 7. Comparison with segmentation 002 v0.1

v0.1:

- parse ok: `true`
- validation ok: `false`
- validation issue count: `13`

v0.2:

- parse ok: `true`
- validation ok: `true`
- validation issue count: `0`

Reading:

- v0.1 failed validation with `13` issues.
- v0.2 passed validation with `0` issues.
- PR #1173 prompt reinforcement worked structurally.
- This is not proof of candidate truth.

---

## 8. Comparison with study.segmentation.003

Segmentation 003:

- segmentation: `study.segmentation.003`
- embryo/chunk split: `SHTU + DI`
- parse ok: `true`
- validation ok: `true`
- validation issue count: `0`

Segmentation 002 v0.2:

- segmentation: `study.segmentation.002`
- embryo/chunk split: `STU + DI`
- parse ok: `true`
- validation ok: `true`
- validation issue count: `0`

Structural reading:

- `SHTU + DI` passed validation.
- `STU + DI` now also passed validation after prompt reinforcement.
- This comparison is structural only.
- It does not decide which segmentation is truer.

---

## 9. Segmentation reading

`STU + DI` is closer to visible spelling.

`SHTU + DI` explores the `S_TO_SH` softening path.

Both remain candidate segmentations.

Neither is an origin claim.

---

## 10. Interpretation

v0.2 confirms the repair workflow:

- negative artifact;
- failure review;
- prompt contract reinforcement;
- controlled rerun;
- validation pass.

This is an architecture/workflow win.

It shows that deterministic validation can identify contract drift and guide a targeted repair.

It does not prove candidate truth.

It does not prove language origin.

---

## 11. Decision

Approved next controlled segmentation target:

    study.segmentation.004
    S + TU + DI

Reason:

- it tests a more granular embryo split;
- it separates `TU` from `DI`;
- it increases false-positive pressure;
- it tests whether validator and null-candidate behavior hold under shorter chunks;
- it keeps the work inside one word before any multi-word protocol.

Do not expand to multi-word protocol yet.

Do not run ten-word smoke.

---

## 12. Claim boundary

This review is:

- development review only.

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
- candidate quality reading is recorded;
- validation reading is recorded;
- v0.1 comparison is recorded;
- segmentation 003 comparison is recorded;
- segmentation reading is recorded;
- next controlled target is selected;
- claim boundary is explicit;
- no code changes are made;
- no new model call is made;
- local validation passes.
