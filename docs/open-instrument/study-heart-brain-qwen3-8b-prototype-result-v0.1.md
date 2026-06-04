# Open Instrument Study Heart-to-Brain Qwen3 8B Prototype Result v0.1

Date: 2026-06-04

Status: internal development prototype only.

This document records the first controlled Open Instrument Heart-to-Brain prototype artifact for `study.segmentation.003`.

This is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not proof that any candidate is true, and not proof that any language is origin.

---

## 1. Purpose

The purpose is to test the full pre-prototype stack:

    Heart segmentation helper → Brain prompt helper → Qwen3 8B Brain output → Brain output validator

This is not a multi-word smoke.

This is not a public claim.

---

## 2. Context

Prerequisite stack:

- PR #1162 — Heart-to-Brain Candidate Search Protocol.
- PR #1163 — Heart chunk segmentation policy.
- PR #1164 — Heart chunk segmentation helper.
- PR #1165 — Brain candidate search schema.
- PR #1166 — Brain candidate search prompt helper.
- PR #1167 — embryo morpheme terminology alignment.
- PR #1168 — Brain candidate validation helper.

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

    study.segmentation.003

Embryo/chunk split:

    SHTU + DI

Voice path:

    U → I

Legal transforms:

    S_TO_SH
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

    true

Attempt used:

    1

Validation summary:

    checkedCandidates: 4
    checkedNullCandidates: 1
    chunksCovered: SHTU, DI
    missingChunks: -

---

## 7. Candidate summary

| Kind | Chunk | Language | Form | Meaning | Candidate type | Evidence type | False-friend risk | Null |
|---|---|---|---|---|---|---|---|---|
| chunkCandidates | SHTU | Albanian | shtrirë | spread, extend | weak_resonance | phonetic_only | low | false |
| chunkCandidates | DI | Greek | dianoia | thought, intellect | historical_match | historical_etymology | medium | false |
| chunkCandidates | DI | Sanskrit | dhi | thought, mind | historical_match | dictionary_attested | medium | false |
| chunkCandidates | DI | Chinese | 知 (zhī) | to know, knowledge | weak_resonance | phonetic_only | high | false |
| nullCandidates | SHTU | Latin | stet | stood | null_candidate | none | none | true |

---

## 8. Validation issues

| Severity | Code | Path | Message |
|---|---|---|---|
| - | - | - | no validation issues |

---

## 9. Interpretation

The prototype pipeline is structurally viable for `study.segmentation.003`. This does not prove candidate truth or origin.

Even if validation passes, the result remains a development prototype only.

Candidate rows are not origin claims.

Doctrine alignment is not external linguistic evidence.

---

## 10. Claim boundary

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

## 11. Current decision

Review this prototype before expanding to more segmentations or words.

Do not run a multi-word Heart-to-Brain protocol until the study prototype is reviewed.

---

## 12. Completion definition

This prototype is complete when:

- Heart input is preserved;
- Brain prompt is preserved;
- raw model output is preserved;
- parsed Brain output is preserved if valid JSON;
- Brain validation result is preserved;
- null candidates are preserved if returned;
- validation issues are listed;
- claim boundary is explicit;
- local validation passes.
