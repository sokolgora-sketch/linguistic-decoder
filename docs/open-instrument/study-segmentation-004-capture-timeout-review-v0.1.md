# Open Instrument Study Segmentation 004 Capture Timeout Review v0.1

Date: 2026-06-05

Status: internal development operational review only.

This document reviews the Open Instrument model-capture timeout record for `study.segmentation.004`.

It does not run a model.

It does not modify the artifact JSON.

It does not modify the companion result doc.

It is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not model-quality evidence, and not a validation result.

---

## 1. Purpose

The purpose is to classify the `study.segmentation.004` capture timeout correctly and record the next decision.

The timeout must not be conflated with:

- a Heart-to-Brain prototype failure;
- a parser failure;
- a Brain-output failure;
- a validation failure;
- a segmentation failure;
- a candidate-search failure;
- a model-quality judgment.

This review keeps the failure class narrow and explicit.

---

## 2. Source files

Timeout artifact:

    docs/open-instrument/artifacts/model-capture-failure/2026-06-04-study-segmentation-004-ollama-qwen3-8b-timeout-v0.1.json

Companion result doc:

    docs/open-instrument/study-segmentation-004-qwen3-8b-capture-failure-v0.1.md

Design source:

    docs/open-instrument/model-capture-failure-artifact-design-v0.1.md

Diagnostic prototype artifact:

    docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-004-v0.1.json

Diagnostic prototype review:

    docs/open-instrument/study-segmentation-004-prototype-failure-review-v0.1.md

Successful segmentation 002 v0.2 artifact:

    docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.2.json

Successful segmentation 003 artifact:

    docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-003-v0.1.json

---

## 3. Timeout artifact summary

Artifact type:

    open-instrument-model-capture-failure

Target:

    study.segmentation.004

Chunks:

    S + TU + DI

Model:

    qwen3:8b

Failure kind:

    timeout

Attempt 1 timeout:

    120000 ms

Attempt 2 timeout:

    600000 ms

The capture timed out twice before a usable Brain output existed.

---

## 4. Availability summary

- Heart input available: `true`
- Brain prompt built: `true`
- raw response available: `false`
- parsed Brain output available: `false`
- validation available: `false`

This is operational capture failure metadata, not output-quality metadata.

---

## 5. Failure classification

This is an operational capture failure.

It is not:

- parser failure;
- Brain-output failure;
- validation failure;
- model-quality evidence;
- segmentation failure;
- candidate-search failure.

The model call did not produce usable output before timeout. That is the entire failure class.

---

## 6. Comparison with study.segmentation.004 v0.1

The `study.segmentation.004` v0.1 prototype produced Brain output and a validation result.

That prototype failed narrowly on null-candidate traceability:

- `MISSING_FIELD` at `nullCandidates.2.segmentationId`
- `SEGMENTATION_ID_MISMATCH` at `nullCandidates.2.segmentationId`

The timeout record is a different failure class.

It produced:

- no Brain output;
- no parsed Brain output;
- no validation result.

These cases must not be conflated.

The v0.1 prototype was a narrow validation failure.
The v0.2 rerun was an operational timeout before validation could happen.

---

## 7. Comparison with successful baselines

Successful `study` baselines still stand:

### 7.1 `study.segmentation.002` / `STU + DI` v0.2

- parse ok: `true`
- validation ok: `true`
- checked candidates: `2`
- checked null candidates: `2`
- covered chunks: `STU`, `DI`
- missing chunks: `none`

### 7.2 `study.segmentation.003` / `SHTU + DI`

- parse ok: `true`
- validation ok: `true`
- checked candidates: `4`
- checked null candidates: `1`
- covered chunks: `SHTU`, `DI`
- missing chunks: `none`

The timeout does not change those baselines.

---

## 8. Interpretation

The most direct reading is operational, not linguistic:

- Qwen3 8B may be too slow or stuck for the full `study.segmentation.004` prompt under the current local setup.
- No linguistic conclusion can be drawn.
- No candidate-quality conclusion can be drawn.

The timeout is evidence that the capture path did not complete, not evidence that the model is linguistically wrong.

---

## 9. Decision

Do not blindly rerun the full prompt again.

The next useful PR should define local model timeout budget policy before further local captures.

Recommended next title:

`docs/open-instrument: define local model timeout budget policy`

That policy should decide what to do when a local capture times out before any Brain output exists.

---

## 10. Recommended future options after timeout policy

Possible next steps after a timeout policy exists:

- retry Qwen3 8B with reduced target languages;
- retry another installed local model;
- split Brain search by chunk or language group;
- archive any future timeout using the model-capture-failure artifact format.

Those options are future work.
They are not conclusions from this timeout record.

---

## 11. Claim boundary

This review is development operational review only.

It is not:

- scientific evidence;
- publication evidence;
- eval evidence;
- Cohort evidence;
- model-quality evidence;
- candidate-truth evidence;
- language-origin evidence;
- validator failure;
- reason to change the default provider from `mock`.

The timeout says the capture did not complete.
It does not say anything stronger than that.

---

## 12. Completion definition

This review is complete when:

- the timeout artifact path is recorded;
- the companion result doc path is recorded;
- the timeout summary is recorded;
- the availability summary is recorded;
- the failure classification is explicit;
- the comparison with `study.segmentation.004` v0.1 is explicit;
- the comparison with the successful baselines is explicit;
- the decision is explicit;
- the future options are explicit;
- the claim boundary is explicit.
