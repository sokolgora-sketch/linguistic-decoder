# Open Instrument Study Segmentation 004 Reduced-Language Capture Failure v0.1

Date: 2026-06-05

Status: internal development operational-failure record only.

This document records the failed reduced-language capture attempt for `study.segmentation.004`.

This is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not proof that any candidate is true, and not proof that any language is origin.

---

## 1. Purpose

The purpose is to archive the operational failure honestly when the reduced-language capture does not produce usable Brain output.

---

## 2. Context

PR #1183 required a reduced-language retry after the full-prompt Qwen3 8B timeout.

Reduced language set:

* Albanian
* Latin
* Chinese
* Germanic

Timeout policy used:

* preflight `30000 ms`
* first capture `180000 ms`
* retry `300000 ms`
* max retry `1`

---

## 3. Target

* `study.segmentation.004`
* `S + TU + DI`
* model: `qwen3:8b`

---

## 4. Failure classification

Failure kind:

    timeout

Message:

    local reduced-language model call failed before usable Brain output

Stage:

    model_call

---

## 5. Attempts

| Attempt | Phase | Timeout ms | Result | Error | Start | End |
|---|---|---|---|---|---|---|
| 1 | capture | 180000 | timeout | timeout | 2026-06-05T08:11:59.071Z | 2026-06-05T08:14:59.085Z |
| 2 | capture_retry | 300000 | timeout | timeout | 2026-06-05T08:14:59.088Z | 2026-06-05T08:19:59.150Z |

---

## 6. Availability booleans

* heartInputAvailable: true
* brainPromptBuilt: true
* rawResponseAvailable: false
* parsedBrainOutputAvailable: false
* validationAvailable: false

---

## 7. Comparison

This failure is compared against:

* full-prompt Qwen3 timeout artifact from PR #1181
* `study.segmentation.004` v0.1 validation failure from PR #1176
* successful `study.segmentation.002` v0.2
* successful `study.segmentation.003`

---

## 8. Interpretation

This is an operational capture failure only.

It is not equivalent to a full-language capture.

It is not candidate truth.

It is not origin proof.

---

## 9. Claim boundary

This record is:

* development operational record only.

It is not:

* scientific evidence;
* publication evidence;
* eval evidence;
* Cohort evidence;
* model-quality evidence;
* candidate-truth evidence;
* language-origin evidence;
* reason to change default provider from `mock`.

---

## 10. Current decision

Use the timeout budget policy before any further blind rerun of `study.segmentation.004`.

---

## 11. Completion definition

This failure record is complete when:

* reduced-language set is explicit;
* timeout policy is explicit;
* attempts are explicit;
* availability booleans are explicit;
* comparison pointers are explicit;
* claim boundary is explicit;
* local validation passes.
