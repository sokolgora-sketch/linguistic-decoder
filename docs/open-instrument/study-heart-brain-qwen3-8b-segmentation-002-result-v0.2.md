# Open Instrument Study Segmentation 002 Heart-to-Brain Qwen3 8B Prototype Result v0.2

Date: 2026-06-04

Status: internal development prototype only.

This document records the controlled Open Instrument Heart-to-Brain prototype artifact for `study.segmentation.002` after Brain enum/segmentationId prompt reinforcement.

This is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not proof that any candidate is true, and not proof that any language is origin.

---

## 1. Purpose

The purpose is to rerun the same `study.segmentation.002` / `STU + DI` target after PR #1173 reinforced the Brain candidate enum/segmentationId contract.

This is not a multi-word smoke.

This is not a public claim.

---

## 2. Context

Previous v0.1 prototype:

- PR #1171 — `study.segmentation.002` / `STU + DI`.
- parse ok: `true`
- validation ok: `false`
- validation issue count: `13`

Failure review:

- PR #1172 — diagnosed Brain contract drift.
- enum fields came back as arrays instead of scalar strings.
- one candidate-level `SEGMENTATION_ID_MISMATCH`.

Prompt reinforcement:

- PR #1173 — reinforced scalar enum and exact `segmentationId` contract.

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

Enum fields were required to be scalar strings, never arrays.

---

## 6. Result

Parse success:

    true

Validation ok:

    true

Attempt used:

    1

Validation summary:

    checkedCandidates: 2
    checkedNullCandidates: 2
    chunksCovered: STU, DI
    missingChunks: -

Validation issue count:

    0

---

## 7. Candidate summary

| Kind | Chunk | Language | Form | Meaning | Candidate type | Evidence type | False-friend risk | Null |
|---|---|---|---|---|---|---|---|---|
| chunkCandidates | STU | Latin | studium | a place of learning | historical_match | historical_etymology | low | false |
| chunkCandidates | DI | Greek | dē | through, across | phonetic_resonance | phonetic_only | medium | false |
| nullCandidates | STU | Chinese | study | study (loanword) | null_candidate | none | none | true |
| nullCandidates | DI | Finnish | di | not applicable | null_candidate | none | none | true |

---

## 8. Validation issues

| Severity | Code | Path | Message |
|---|---|---|---|
| - | - | - | no validation issues |

---

## 9. Comparison with segmentation 002 v0.1

Previous:

    study.segmentation.002 v0.1

Current:

    study.segmentation.002 v0.2

Reading:

Validation improved from failed in v0.1 to passed in v0.2 after prompt reinforcement.

v0.1 failed because of enum/segmentation contract drift.

v0.2 used the reinforced prompt contract from PR #1173.

---

## 10. Comparison with study.segmentation.003

Baseline:

    study.segmentation.003
    SHTU + DI

Baseline validation ok:

    true

Reading:

Segmentation 003 remains a passed structural baseline.

This comparison is structural only.

It does not determine candidate truth.

---

## 11. Interpretation

The reinforced contract fixed the structural validation problem for this run. This does not prove candidate truth or origin.

Even if validation passes, the result remains a development prototype only.

Candidate rows are not origin claims.

Doctrine alignment is not external linguistic evidence.

---

## 12. Claim boundary

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

## 13. Current decision

Review this v0.2 prototype before running another segmentation.

Do not run multi-word protocol yet.

---

## 14. Completion definition

This prototype is complete when:

- Heart input is preserved;
- Brain prompt is preserved;
- raw model output is preserved;
- parsed Brain output is preserved if valid JSON;
- Brain validation result is preserved;
- comparison pointer to `study.segmentation.002` v0.1 is preserved;
- comparison pointer to `study.segmentation.003` is preserved;
- validation issues are listed;
- claim boundary is explicit;
- local validation passes.
