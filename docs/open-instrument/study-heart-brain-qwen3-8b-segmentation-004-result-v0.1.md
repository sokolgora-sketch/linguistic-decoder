# Open Instrument Study Segmentation 004 Heart-to-Brain Qwen3 8B Prototype Result v0.1

Date: 2026-06-04

Status: internal development prototype only.

This document records the controlled Open Instrument Heart-to-Brain prototype artifact for `study.segmentation.004`.

This is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not proof that any candidate is true, and not proof that any language is origin.

---

## 1. Purpose

The purpose is to test the next approved `study` segmentation after the successful `study.segmentation.002` v0.2 prototype review.

This is not a multi-word smoke.

This is not a public claim.

---

## 2. Context

Previous controlled prototypes:

* PR #1169 — `study.segmentation.003` / `SHTU + DI` passed structurally.
* PR #1174 — `study.segmentation.002` / `STU + DI` v0.2 passed structurally.
* PR #1175 — review approved `study.segmentation.004` / `S + TU + DI`.

Reason for this target:

* tests a more granular embryo split;
* separates `TU` from `DI`;
* increases false-positive pressure;
* tests validator and null-candidate behavior under shorter chunks;
* stays inside one word before multi-word protocol.

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

    study.segmentation.004

Embryo/chunk split:

    S + TU + DI

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

* create segmentation;
* change chunks;
* change vowel path;
* invent transforms;
* claim origin;
* treat resonance as proof;
* hide null candidates.

Explicit null candidates were required for every Heart-approved chunk with no credible candidate.

Enum fields were required to be scalar strings, never arrays.

---

## 6. Result

Parse success:

    true

Validation ok:

    false

Attempt used:

    1

Validation summary:

    checkedCandidates: 3
    checkedNullCandidates: 3
    chunksCovered: S, TU, DI
    missingChunks: -

Validation issue count:

    2

---

## 7. Candidate summary

| Kind | Chunk | Language | Form | Meaning | Candidate type | Evidence type | False-friend risk | Null |
|---|---|---|---|---|---|---|---|---|
| chunkCandidates | S | Germanic | S | container | weak_resonance | doctrine_alignment | medium | false |
| chunkCandidates | TU | Latin | tu | you | weak_resonance | phonetic_only | high | false |
| chunkCandidates | DI | Greek | di | to give | weak_resonance | phonetic_only | medium | false |
| nullCandidates | S | Sanskrit | S | null | null_candidate | none | none | true |
| nullCandidates | TU | Chinese | TU | null | null_candidate | none | none | true |
| nullCandidates | DI | Arabic | DI | null | null_candidate | none | none | true |

---

## 8. Validation issues

| Severity | Code | Path | Message |
|---|---|---|---|
| error | MISSING_FIELD | nullCandidates.2.segmentationId | candidate missing required field: segmentationId |
| error | SEGMENTATION_ID_MISMATCH | nullCandidates.2.segmentationId | candidate segmentationId must match Heart input segmentationId. |

---

## 9. Comparison with segmentation 002 v0.2

Segmentation 002 v0.2:

    STU + DI
    validation ok: true
    issue count: 0

Segmentation 004:

    S + TU + DI
    validation ok: false
    issue count: 2

Reading:

Segmentation 004 failed while segmentation 002 v0.2 passed, so segmentation 004 exposed new structural pressure.

---

## 10. Comparison with study.segmentation.003

Segmentation 003:

    SHTU + DI
    validation ok: true
    issue count: 0

Segmentation 004:

    S + TU + DI
    validation ok: false
    issue count: 2

Reading:

Segmentation 004 failed while segmentation 003 passed, so the more granular split exposed pressure.

This comparison is structural only.

It does not determine candidate truth.

---

## 11. Interpretation

The prototype did not pass deterministic Brain output validation. Treat this as a negative/diagnostic result, not model success.

Even if validation passes, the result remains a development prototype only.

Candidate rows are not origin claims.

Doctrine alignment is not external linguistic evidence.

---

## 12. Claim boundary

This result is:

* development prototype only.

It is not:

* scientific evidence;
* publication evidence;
* eval evidence;
* Cohort evidence;
* proof that any candidate is true;
* proof that any language is origin;
* a reason to change the default provider from `mock`.

---

## 13. Current decision

Review this segmentation 004 prototype before running another segmentation or expanding beyond `study`.

Do not run multi-word protocol yet.

---

## 14. Completion definition

This prototype is complete when:

* Heart input is preserved;
* Brain prompt is preserved;
* raw model output is preserved;
* parsed Brain output is preserved if valid JSON;
* Brain validation result is preserved;
* comparison pointer to `study.segmentation.002` v0.2 is preserved;
* comparison pointer to `study.segmentation.003` is preserved;
* validation issues are listed;
* claim boundary is explicit;
* local validation passes.
