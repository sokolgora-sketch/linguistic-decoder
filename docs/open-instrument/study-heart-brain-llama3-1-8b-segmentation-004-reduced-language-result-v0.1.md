# Open Instrument Study Segmentation 004 Reduced-Language Heart-to-Brain Llama 3.1 8B Result v0.1
Date: 2026-06-05

Status: internal development prototype only.

This document records the reduced-language llama retry for study.segmentation.004.

---

## 1. Purpose

The purpose is to test whether installed llama3.1:8b can complete the same reduced-language study.segmentation.004 target that timed out with Qwen3 8B.

---

## 2. Context

PR #1185 decided to use installed llama3.1:8b before chunk-splitting.

This run changes one variable only:

model: qwen3:8b -> llama3.1:8b

---

## 3. Target

Word: study
Segmentation: study.segmentation.004
Chunks: S + TU + DI

---

## 4. Reduced language set

* Albanian
* Latin
* Chinese
* Germanic

---

## 5. Model

Model: llama3.1:8b
Runtime: Ollama local
Provider: openai_compat

---

## 6. Timeout policy used

Preflight timeout: 30000 ms
First capture timeout: 180000 ms
Retry timeout: 300000 ms
Maximum retries: 1

---

## 7. Result

Parse success: true
Validation ok: false
Failure classification: validation_failure
Checked candidates: 4
Checked null candidates: 4
Covered chunks: S, TU, DI
Missing chunks: -
Validation issue count: 8

---

## 8. Candidate summary

| Kind | Chunk | Language | Form | Meaning | Candidate type | Evidence type | False-friend risk | Null | segmentationId |
|---|---|---|---|---|---|---|---|---|---|
| chunkCandidates | S | Albanian | - | - | null_candidate | none | none | false | study.segmentation.004 |
| chunkCandidates | TU | Latin | - | - | null_candidate | none | none | false | study.segmentation.004 |
| chunkCandidates | DI | Chinese | - | - | null_candidate | none | none | false | study.segmentation.004 |
| chunkCandidates | DI | Germanic | - | - | null_candidate | none | none | false | study.segmentation.004 |
| nullCandidates | S | Albanian | - | - | null_candidate | none | none | true | study.segmentation.004 |
| nullCandidates | TU | Latin | - | - | null_candidate | none | none | true | study.segmentation.004 |
| nullCandidates | DI | Chinese | - | - | null_candidate | none | none | true | study.segmentation.004 |
| nullCandidates | DI | Germanic | - | - | null_candidate | none | none | true | study.segmentation.004 |

---

## 9. Validation issues

| Severity | Code | Path | Message |
|---|---|---|---|
| error | MISSING_FIELD | word | Brain output missing required field: word |
| error | MISSING_FIELD | segmentationId | Brain output missing required field: segmentationId |
| error | WORD_MISMATCH | word | Brain output word must match Heart input word. |
| error | SEGMENTATION_ID_MISMATCH | segmentationId | Brain output segmentationId must match Heart input segmentationId. |
| error | INVALID_NULL_CANDIDATE | nullCandidates.0.sourceNote | null candidate must explain absence in sourceNote or notes. |
| error | INVALID_NULL_CANDIDATE | nullCandidates.1.sourceNote | null candidate must explain absence in sourceNote or notes. |
| error | INVALID_NULL_CANDIDATE | nullCandidates.2.sourceNote | null candidate must explain absence in sourceNote or notes. |
| error | INVALID_NULL_CANDIDATE | nullCandidates.3.sourceNote | null candidate must explain absence in sourceNote or notes. |

---

## 10. Comparison

Compared against:

* full-prompt Qwen3 timeout artifact from PR #1181
* reduced-language Qwen3 timeout artifact from PR #1184
* study.segmentation.004 v0.1 validation failure from PR #1176
* successful study.segmentation.002 v0.2
* successful study.segmentation.003

This is a reduced-language result only.
It is a one-variable model-switch comparison.
It is not equivalent to a full-language capture.

---

## 11. Interpretation

This is a reduced-language development prototype only.

It is not candidate truth.

It is not origin proof.

---

## 12. Claim boundary

This result is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not model-quality evidence, not candidate-truth evidence, and not language-origin evidence.

It is not a reason to change default provider from mock.

---

## 13. Current decision

Review this reduced-language llama result before expanding languages, switching model, or splitting by chunk.

---

## 14. Completion definition

This record is complete when the artifact and result doc are committed with local validation passing.
