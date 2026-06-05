# Open Instrument Study Segmentation 004 Reduced-Language Llama Result Review v0.1
Status: internal development structural review only.

This document reviews the reduced-language `llama3.1:8b` result for `study.segmentation.004`.
It classifies the result as a structural Brain-output / validation-contract failure.
No model call is performed by this review.
No code changes are made by this review.
No artifact JSON is modified by this review.
No result doc is modified by this review.
This review is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not model-quality evidence, not candidate-truth evidence, and not language-origin evidence.

---

## 1. Purpose
The purpose is to classify the reduced-language llama result after Qwen3 8B timed out on the same target.

The key distinction is that llama returned parseable Brain output, but deterministic validation rejected it.

---

## 2. Source files
Llama artifact:

`docs/open-instrument/artifacts/heart-brain-prototype/2026-06-05-study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-v0.1.json`

Llama result doc:

`docs/open-instrument/study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-result-v0.1.md`

Qwen reduced-language timeout artifact:

`docs/open-instrument/artifacts/model-capture-failure/2026-06-05-study-segmentation-004-ollama-qwen3-8b-reduced-language-timeout-v0.1.json`

Qwen reduced-language timeout review:

`docs/open-instrument/study-segmentation-004-reduced-language-timeout-review-v0.1.md`

Qwen full-prompt timeout artifact:

`docs/open-instrument/artifacts/model-capture-failure/2026-06-04-study-segmentation-004-ollama-qwen3-8b-timeout-v0.1.json`

Timeout policy:

`docs/open-instrument/local-model-timeout-budget-policy-v0.1.md`

Previous segmentation 004 v0.1 artifact:

`docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-004-v0.1.json`

Previous segmentation 004 failure review:

`docs/open-instrument/study-segmentation-004-prototype-failure-review-v0.1.md`

Successful segmentation 002 v0.2 artifact:

`docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.2.json`

Successful segmentation 003 artifact:

`docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-003-v0.1.json`

---

## 3. Llama result summary
Artifact type:

`open-instrument-heart-brain-prototype`

Target:

`study.segmentation.004`

Chunks:

`S + TU + DI`

Model:

`llama3.1:8b`

Reduced languages:

- Albanian
- Latin
- Chinese
- Germanic

Outcome:

`model_response`

Parse ok:

`true`

Validation ok:

`false`

Validation issue count:

`8`

Checked candidates:

`4`

Checked null candidates:

`4`

Covered chunks:

`S`, `TU`, `DI`

Missing chunks:

`none`

---

## 4. Validation issue table
| Severity | Code | Path | Message |
| --- | --- | --- | --- |
| error | MISSING_FIELD | word | Brain output missing required field: word |
| error | MISSING_FIELD | segmentationId | Brain output missing required field: segmentationId |
| error | WORD_MISMATCH | word | Brain output word must match Heart input word. |
| error | SEGMENTATION_ID_MISMATCH | segmentationId | Brain output segmentationId must match Heart input segmentationId. |
| error | INVALID_NULL_CANDIDATE | nullCandidates.0.sourceNote | null candidate must explain absence in sourceNote or notes. |
| error | INVALID_NULL_CANDIDATE | nullCandidates.1.sourceNote | null candidate must explain absence in sourceNote or notes. |
| error | INVALID_NULL_CANDIDATE | nullCandidates.2.sourceNote | null candidate must explain absence in sourceNote or notes. |
| error | INVALID_NULL_CANDIDATE | nullCandidates.3.sourceNote | null candidate must explain absence in sourceNote or notes. |

---

## 5. Failure classification
This is a structural Brain-output / validation-contract failure.

It is not:

- operational timeout;
- provider failure;
- parser failure;
- chunk coverage failure;
- candidate truth failure;
- model-quality evidence.

The model returned parseable JSON.
The validator rejected the output.
All chunks were covered.
Missing chunks were none.

---

## 6. Specific structural misses
The artifact and result show these structural misses:

- top-level `word` missing;
- top-level `segmentationId` missing;
- all four `nullCandidates` missing explanation fields.

These are contract-compliance issues.
They should be fixed through targeted prompt/helper reinforcement, not through validator loosening.

---

## 7. Comparison with Qwen reduced-language timeout
Qwen reduced-language timeout:

- artifact type: `open-instrument-model-capture-failure`
- target: `study.segmentation.004`
- model: `qwen3:8b`
- failure kind: `timeout`
- raw response available: `false`
- parsed Brain output available: `false`
- validation available: `false`

Llama reduced-language result:

- model: `llama3.1:8b`
- parse ok: `true`
- validation ok: `false`
- validation issue count: `8`

Reading:

- Qwen timed out.
- Llama returned parseable JSON.
- Llama is operationally better for this target.
- This is not a model-quality claim.

---

## 8. Comparison with full-prompt Qwen timeout
Full-prompt Qwen timeout:

- artifact type: `open-instrument-model-capture-failure`
- target: `study.segmentation.004`
- model: `qwen3:8b`
- failure kind: `timeout`
- raw response available: `false`
- parsed Brain output available: `false`
- validation available: `false`

Reading:

- full-prompt Qwen timed out;
- reduced-language Qwen timed out;
- reduced-language llama returned output.

---

## 9. Comparison with study.segmentation.004 v0.1
Segmentation 004 v0.1:

- segmentation: `study.segmentation.004`
- chunks: `S + TU + DI`
- parse ok: `true`
- validation ok: `false`
- checked candidates: `3`
- checked null candidates: `3`
- validation issue count: `2`

Llama reduced-language:

- parse ok: `true`
- validation ok: `false`
- checked candidates: `4`
- checked null candidates: `4`
- validation issue count: `8`

Reading:

- v0.1 had Brain output and validation failure.
- llama also had Brain output and validation failure.
- Failure types differ:
  - v0.1: null-candidate traceability;
  - llama: top-level identity plus null-candidate explanation fields.

---

## 10. Comparison with successful baselines
Segmentation 002 v0.2:

- segmentation: `study.segmentation.002`
- chunks: `STU + DI`
- validation ok: `true`
- validation issue count: `0`

Segmentation 003:

- segmentation: `study.segmentation.003`
- chunks: `SHTU + DI`
- validation ok: `true`
- validation issue count: `0`

Reading:

- `study.segmentation.002` / `STU + DI` v0.2 passed structurally.
- `study.segmentation.003` / `SHTU + DI` passed structurally.
- The llama result does not affect those baselines.

---

## 11. Interpretation
Llama solved the operational timeout problem for this reduced-language target.

The next issue is structural output contract compliance.

Do not chunk-split yet.
Do not switch model yet.
Patch the exact missing contract fields first.

---

## 12. Decision
Next PR should reinforce Brain output identity and null-candidate explanation contract.

Recommended next title:

`fix(open-instrument): reinforce brain output identity contract`

---

## 13. Required next fix scope
The next fix should ensure:

- prompt explicitly requires top-level `word`;
- prompt explicitly requires top-level `segmentationId`;
- top-level `word` and `segmentationId` must exactly match Heart input;
- every null candidate includes the validator-required explanation fields;
- null candidates are auditable, not silent placeholders;
- tests prove prompt includes these rules;
- validator is not loosened.

---

## 14. Claim boundary
This review is structural review only.

It is not:

- scientific evidence;
- publication evidence;
- eval evidence;
- Cohort evidence;
- model-quality evidence;
- candidate-truth evidence;
- language-origin evidence;
- validator failure;
- a reason to change the default provider from `mock`.

---

## 15. Completion definition
This review is complete when:

- the llama artifact path is recorded;
- the llama result doc path is recorded;
- the result summary is recorded;
- the validation issue table is recorded;
- the failure classification is explicit;
- the Qwen timeout comparison is recorded;
- the v0.1 comparison is recorded;
- the successful baseline comparison is recorded;
- the next decision is explicit;
- the required next fix scope is recorded;
- the claim boundary is explicit;
- no model call is made;
- no code changes are made;
- local validation passes.
