# Open Instrument Study Segmentation 002 Heart-to-Brain Qwen3 8B Prototype Result v0.1

Date: 2026-06-04

Status: internal development prototype only.

This document records the controlled Open Instrument Heart-to-Brain prototype artifact for `study.segmentation.002`.

This is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not proof that any candidate is true, and not proof that any language is origin.

---

## 1. Purpose

The purpose is to test the next approved `study` segmentation after the successful `study.segmentation.003` prototype.

This is not a multi-word smoke.

This is not a public claim.

---

## 2. Context

Previous prototype:

- PR #1169 — `study.segmentation.003` / `SHTU + DI`.
- PR #1170 — review approved `study.segmentation.002` / `STU + DI` as the next controlled target.

Reason for this target:

- closer to visible spelling than `SHTU + DI`;
- preserves the `DI` knowledge-candidate test;
- avoids `S_TO_SH` softening pressure too early;
- gives a clean comparison against the successful `SHTU + DI` prototype.

---

## 3. Model

Model:

    qwen3:8b

Runtime:

    Ollama local

Provider path:

    OpenAI-compatible local endpoint

---

## 4. Heart input

Word:

    study

Segmentation:

    study.segmentation.002

Embryo/chunk split:

    STU + DI

Voice path:

    U → I

Legal transforms:

    FINAL_Y_TO_I

Current implementation field:

    chunk

Protocol concept:

    embryo morpheme

---

## 5. Brain task

The Brain was asked to search candidate meanings only.

Brain was not allowed to:

- create segmentation;
- change chunks;
- change vowel path;
- invent transforms;
- claim origin;
- treat resonance as proof;
- hide null candidates.

Explicit null candidates were required.

---

## 6. Result

Parse success:

    true

Validation ok:

    false

Attempt used:

    2

Validation summary:

    checkedCandidates: 4
    checkedNullCandidates: 2
    chunksCovered: STU, DI
    missingChunks: -

---

## 7. Candidate summary

| Kind | Chunk | Language | Form | Meaning | Candidate type | Evidence type | False-friend risk | Null |
|---|---|---|---|---|---|---|---|---|
| chunkCandidates | STU | Latin | studium | study, pursuit of knowledge | historical_match | historical_etymology | low | false |
| chunkCandidates | STU | Germanic | studian | to study | functional_resonance | dictionary_attested | medium | false |
| chunkCandidates | DI | Greek | di | through, via | weak_resonance | phonetic_only | high | false |
| chunkCandidates | DI | Semitic | da | to know | functional_resonance | doctrine_alignment | medium | false |
| nullCandidates | STU | Chinese | study | none | null_candidate | none | none | true |
| nullCandidates | DI | Finnish | di | none | null_candidate | none | none | true |

---

## 8. Validation issues

| Severity | Code | Path | Message |
|---|---|---|---|
| error | INVALID_CANDIDATE_TYPE | chunkCandidates.0.candidateType | candidateType must be one of the allowed Brain candidate types. |
| error | INVALID_EVIDENCE_TYPE | chunkCandidates.0.evidenceType | evidenceType must be one of the allowed Brain evidence types. |
| error | INVALID_FALSE_FRIEND_RISK | chunkCandidates.0.falseFriendRisk | falseFriendRisk must be one of the allowed values. |
| error | INVALID_CANDIDATE_TYPE | chunkCandidates.1.candidateType | candidateType must be one of the allowed Brain candidate types. |
| error | INVALID_EVIDENCE_TYPE | chunkCandidates.1.evidenceType | evidenceType must be one of the allowed Brain evidence types. |
| error | INVALID_FALSE_FRIEND_RISK | chunkCandidates.1.falseFriendRisk | falseFriendRisk must be one of the allowed values. |
| error | SEGMENTATION_ID_MISMATCH | chunkCandidates.2.segmentationId | candidate segmentationId must match Heart input segmentationId. |
| error | INVALID_CANDIDATE_TYPE | chunkCandidates.2.candidateType | candidateType must be one of the allowed Brain candidate types. |
| error | INVALID_EVIDENCE_TYPE | chunkCandidates.2.evidenceType | evidenceType must be one of the allowed Brain evidence types. |
| error | INVALID_FALSE_FRIEND_RISK | chunkCandidates.2.falseFriendRisk | falseFriendRisk must be one of the allowed values. |
| error | INVALID_CANDIDATE_TYPE | chunkCandidates.3.candidateType | candidateType must be one of the allowed Brain candidate types. |
| error | INVALID_EVIDENCE_TYPE | chunkCandidates.3.evidenceType | evidenceType must be one of the allowed Brain evidence types. |
| error | INVALID_FALSE_FRIEND_RISK | chunkCandidates.3.falseFriendRisk | falseFriendRisk must be one of the allowed values. |

---

## 9. Comparison with study.segmentation.003

Previous target:

    study.segmentation.003
    SHTU + DI
    legal transforms: S_TO_SH, FINAL_Y_TO_I

Current target:

    study.segmentation.002
    STU + DI
    legal transforms: FINAL_Y_TO_I

Comparison reading:

Segmentation 002 is structurally weaker than segmentation 003 because validation failed.

The current target is closer to visible spelling because it does not require `S_TO_SH`.

However, cleaner structure does not automatically mean stronger candidate quality.

Candidate quality still requires source review.

---

## 10. Interpretation

The prototype did not pass deterministic Brain output validation. Treat this as a negative/diagnostic prototype result, not model success.

Even if validation passes, the result remains a development prototype only.

Candidate rows are not origin claims.

Doctrine alignment is not external linguistic evidence.

---

## 11. Claim boundary

This result is:

- development prototype only.

It is not:

- scientific evidence;
- publication evidence;
- eval evidence;
- Cohort evidence;
- proof that any candidate is true;
- proof that any language is origin;
- a reason to change the default provider from `mock`.

---

## 12. Current decision

Review this prototype before running another study segmentation.

Do not run multi-word protocol yet.

---

## 13. Completion definition

This prototype is complete when:

- Heart input is preserved;
- Brain prompt is preserved;
- raw model output is preserved;
- parsed Brain output is preserved if valid JSON;
- Brain validation result is preserved;
- comparison pointer to `study.segmentation.003` is preserved;
- null candidates are preserved if returned;
- validation issues are listed;
- claim boundary is explicit;
- local validation passes.
