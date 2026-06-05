# Open Instrument Study Segmentation 004 Reduced-Language Timeout Review v0.1
Date: 2026-06-05

Status: internal development operational review only.

This document reviews the reduced-language `study.segmentation.004` Qwen3 8B capture timeout archive from PR #1184.

It does not run a model.

It does not modify the artifact JSON.

It does not modify the companion result doc.

It is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not model-quality evidence, and not a validation result.

---

## 1. Purpose

The purpose is to classify the reduced-language timeout correctly and decide what to do next.

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

Reduced-language timeout artifact:

    docs/open-instrument/artifacts/model-capture-failure/2026-06-05-study-segmentation-004-ollama-qwen3-8b-reduced-language-timeout-v0.1.json

Companion result doc:

    docs/open-instrument/study-segmentation-004-qwen3-8b-reduced-language-capture-failure-v0.1.md

Timeout budget policy:

    docs/open-instrument/local-model-timeout-budget-policy-v0.1.md

Earlier timeout review:

    docs/open-instrument/study-segmentation-004-capture-timeout-review-v0.1.md

Earlier Heart-to-Brain prototype artifact:

    docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-004-v0.1.json

Earlier prototype failure review:

    docs/open-instrument/study-segmentation-004-prototype-failure-review-v0.1.md

Successful segmentation 002 v0.2 artifact:

    docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.2.json

Successful segmentation 003 artifact:

    docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-003-v0.1.json

---

## 3. Reduced-language timeout artifact summary

Artifact type:

    open-instrument-model-capture-failure

Target:

    study.segmentation.004

Chunks:

    S + TU + DI

Model:

    qwen3:8b

Reduced languages:

- Albanian
- Latin
- Chinese
- Germanic

Failure kind:

    timeout

Attempts:

    2

The capture timed out twice before a usable Brain output existed.

---

## 4. Timeout policy summary

The capture used the timeout policy from PR #1183.

Policy values:

- preflight: `30000 ms`
- first capture: `180000 ms`
- retry: `300000 ms`
- max retry: `1`

The timeout policy is what turned the retry into a bounded operational record instead of an unbounded rerun.

---

## 5. Availability summary

- Heart input available: `true`
- Brain prompt built: `true`
- raw response available: `false`
- parsed Brain output available: `false`
- validation available: `false`

This is operational capture metadata, not output-quality metadata.

---

## 6. Failure classification

This is a repeated operational capture failure.

It is not:

- parser failure;
- Brain-output failure;
- validation failure;
- model-quality evidence;
- segmentation failure;
- candidate-search failure.

The model call never produced usable output before timeout.
That is the entire failure class.

---

## 7. Comparison with full-prompt Qwen3 timeout

The full-prompt `study.segmentation.004` Qwen3 8B capture already timed out and was archived in PR #1181.

This reduced-language retry also timed out.

Reading:

- reduced language did not rescue the capture;
- the problem is not just the full prompt being too heavy;
- the Qwen3 8B local path is still not completing this target under the current setup.

That makes the reduced-language record a stronger operational signal than the full-prompt timeout alone.

---

## 8. Comparison with study.segmentation.004 v0.1 validation failure

The `study.segmentation.004` v0.1 prototype produced Brain output and a validation result.

That prototype failed narrowly on null-candidate traceability:

- `MISSING_FIELD` at `nullCandidates.2.segmentationId`
- `SEGMENTATION_ID_MISMATCH` at `nullCandidates.2.segmentationId`

The reduced-language timeout is a different failure class.

It produced:

- no Brain output;
- no parsed Brain output;
- no validation result.

These cases must not be conflated.

The v0.1 prototype was a narrow validation failure.
The reduced-language retry was an operational timeout before validation could happen.

---

## 9. Comparison with successful baselines

Successful `study` baselines still stand:

### 9.1 `study.segmentation.002` / `STU + DI` v0.2

- parse ok: `true`
- validation ok: `true`
- checked candidates: `2`
- checked null candidates: `2`
- covered chunks: `STU`, `DI`
- missing chunks: `none`

### 9.2 `study.segmentation.003` / `SHTU + DI`

- parse ok: `true`
- validation ok: `true`
- checked candidates: `4`
- checked null candidates: `1`
- covered chunks: `SHTU`, `DI`
- missing chunks: `none`

The reduced-language timeout does not change those baselines.

---

## 10. Installed local model context

Installed local models observed in this lane:

- `qwen3:8b`
- `llama3.1:8b`

Do not pull a new model without explicit approval.

---

## 11. Interpretation

The most direct reading is operational, not linguistic:

- Qwen3 8B is not currently suitable for this capture path under the current local setup.
- No linguistic conclusion can be drawn.
- No candidate-quality conclusion can be drawn.

The timeout says the capture did not complete.
It does not say the model is linguistically wrong.

---

## 12. Decision

Stop retrying Qwen3 8B for this target for now.

Do not jump to chunk-splitting yet.

The next controlled action should use the other installed local model, `llama3.1:8b`, with the same reduced-language target.

Recommended next title:

`docs/open-instrument: archive study segmentation 004 reduced-language llama retry`

---

## 13. Why llama before chunk split

Use `llama3.1:8b` before chunk splitting because:

- it changes only the model, not the task shape;
- it gives a cleaner operational comparison than changing both model and task shape at once;
- it preserves the same reduced-language target;
- chunk-splitting remains a fallback if `llama3.1:8b` also times out.

Chunk-splitting is still available later, but it is not the next controlled step.

---

## 14. Claim boundary

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

The review says the capture path failed again under the reduced-language budget.
It does not say anything stronger than that.

---

## 15. Completion definition

This review is complete when:

- the reduced-language set is explicit;
- the timeout budget is explicit;
- the attempts are explicit;
- the availability booleans are explicit;
- the comparison to full-prompt timeout is explicit;
- the comparison to v0.1 validation failure is explicit;
- the comparison to successful baselines is explicit;
- the installed local model context is explicit;
- the next decision is explicit;
- the claim boundary is explicit;
- local validation passes.
