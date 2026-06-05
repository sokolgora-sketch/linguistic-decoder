# Open Instrument Study Segmentation 004 Reduced-Language Llama 3.1 8B Result v0.3
Date: 2026-06-05

Status: internal development prototype only.

This document records the reduced-language llama retry for `study.segmentation.004` after PR #1198 reinforced the candidate `sourceNote` contract.

---

## 1. Purpose

The purpose is to test whether installed `llama3.1:8b` can complete the same reduced-language `study.segmentation.004` target after the PR #1198 prompt contract reinforcement.

---

## 2. Context

PR #1196 diagnosed the earlier reduced-language llama result as a remaining `chunkCandidates.*.sourceNote` failure.
PR #1198 reinforced the candidate `sourceNote` contract.

This run changes one condition only relative to PR #1194:
- same model: `llama3.1:8b`
- same target: `study.segmentation.004`
- same chunks: `S + TU + DI`
- same reduced languages: Albanian, Latin, Chinese, Germanic
- same timeout policy: PR #1183
- changed condition: candidate `sourceNote` contract was reinforced by PR #1198

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

## 6. Contract reinforcement tested

* top-level `word`;
* top-level `segmentationId`;
* null-candidate explanation/audit fields;
* chunk-candidate `sourceNote`.

---

## 7. Timeout policy used

Preflight timeout: 30000 ms
First capture timeout: 180000 ms
Retry timeout: 300000 ms
Maximum retries: 1

---

## 8. Result

Parse success: true
Validation ok: false
Issue count: 4
Checked candidates: 4
Checked null candidates: 4
Covered chunks: S, TU, DI
Missing chunks: -

---

## 9. Prior miss-check

Top-level word present: true
Top-level word matches Heart input: true
Top-level segmentationId present: true
Top-level segmentationId matches Heart input: true
Null candidates with explanation/audit field: 4
Null candidates total: 4
Chunk candidates with sourceNote: 4
Chunk candidates total: 4

The earlier `chunkCandidates.*.sourceNote` miss is no longer the active failure boundary in this run.
The remaining validator misses are top-level `warnings` / `claimBoundary` contract failures.

---

## 10. Candidate summary

| Kind | Chunk | Language | Form | Meaning | Candidate type | Evidence type | False-friend risk | Null | segmentationId |
|---|---|---|---|---|---|---|---|---|---|
| chunkCandidates | S | Albanian | S |  | null_candidate | none | none | true | study.segmentation.004 |
| chunkCandidates | TU | Latin | TU |  | null_candidate | none | none | true | study.segmentation.004 |
| chunkCandidates | DI | Chinese | DI |  | null_candidate | none | none | true | study.segmentation.004 |
| chunkCandidates | DI | Germanic | DY |  | null_candidate | none | none | true | study.segmentation.004 |
| nullCandidates | S | Albanian |  |  | null_candidate | none | none | true | study.segmentation.004 |
| nullCandidates | TU | Latin |  |  | null_candidate | none | none | true | study.segmentation.004 |
| nullCandidates | DI | Chinese |  |  | null_candidate | none | none | true | study.segmentation.004 |
| nullCandidates | DI | Germanic |  |  | null_candidate | none | none | true | study.segmentation.004 |

---

## 11. Validation issues

| Severity | Code | Path | Message |
|---|---|---|---|
| error | MISSING_FIELD | warnings | Brain output missing required field: warnings |
| error | MISSING_FIELD | claimBoundary | Brain output missing required field: claimBoundary |
| error | MISSING_FIELD | warnings | warnings must be an array. |
| error | INVALID_CLAIM_BOUNDARY | claimBoundary | claimBoundary must be an object. |

---

## 12. Failure classification

validation_failure

---

## 13. Comparison

Compared against:

* PR #1187 reduced-language llama v0.1 retry artifact
* PR #1189 reduced-language llama v0.1 result review
* PR #1192 Brain output identity contract reinforcement
* PR #1194 reduced-language llama v0.2 retry artifact
* PR #1196 reduced-language llama v0.2 result review
* PR #1198 candidate `sourceNote` reinforcement
* Qwen reduced-language timeout artifact
* successful `study.segmentation.002` v0.2
* successful `study.segmentation.003`

---

## 14. Interpretation

This is a reduced-language result only.
It is not equivalent to a full-language capture.
It is not candidate truth.
It is not origin proof.

---

## 15. Claim boundary

This result is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not model-quality evidence, not candidate-truth evidence, and not language-origin evidence.

It is not a reason to change default provider from `mock`.

---

## 16. Current decision

Review the reduced-language llama v0.3 result before expanding languages, switching model, or splitting by chunk.

---

## 17. Completion definition

This record is complete when the artifact and result doc are committed with local validation passing.
