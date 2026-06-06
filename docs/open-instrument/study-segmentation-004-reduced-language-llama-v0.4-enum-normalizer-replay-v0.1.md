# Open Instrument Study Segmentation 004 Reduced-Language Llama Enum Normalizer Replay v0.1
Status: internal development replay only.

This document replays the archived v0.4 Brain output through the deterministic enum normalizer added in PR #1206.
No model call is performed.
No prompt is changed.
No validator is loosened.
No runtime wiring is added.
No provider behavior is changed.
No new artifact source is generated.
This is not origin proof, not candidate truth proof, not publication evidence, not eval evidence, not Cohort evidence, not model-quality evidence, and not a reason to change the default provider from mock.

---

## 1. Purpose

The purpose is to replay the archived reduced-language `llama3.1:8b` v0.4 result for `study.segmentation.004` through the offline enum normalizer and record what happened under the strict validator.

The replay is a development-only post-parse repair check.
It does not replace the archived model output.
It does not rewrite the Brain record.
It only adds a deterministic normalization layer and then reruns the existing strict validator on the normalized object.

---

## 2. Source files

Archived v0.4 artifact:

`/Users/wei/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export/docs/open-instrument/artifacts/heart-brain-prototype/2026-06-05-study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-v0.4.json`

Prior v0.4 review:

`/Users/wei/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export/docs/open-instrument/study-segmentation-004-reduced-language-llama-v0.4-result-review-v0.1.md`

Enum repair policy:

`/Users/wei/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export/docs/open-instrument/brain-candidate-enum-repair-policy-v0.1.md`

Enum repair helper:

`/Users/wei/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export/src/shared/openInstrument/brainCandidateEnumRepair.v0.1.ts`

Strict validator:

`/Users/wei/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export/src/shared/openInstrument/brainCandidateSearchValidation.v0.1.ts`

---

## 3. Replay method

Replay input:

- raw Brain output from `parsedBrainOutput` in the archived v0.4 artifact

Replay step:

- call `normalizeBrainCandidateEnums(rawBrainOutput)`

Replay validation:

- run `validateBrainCandidateSearchOutput` on the normalized Brain output

Replay rule:

- preserve the raw Brain output exactly
- preserve unresolved values as unresolved
- do not invent values
- do not weaken validation

---

## 4. Replay result

Raw validation result:

- ok: false
- issue count: 36

Normalized validation result:

- ok: false
- issue count: 36
- checked candidates: 3
- checked null candidates: 3
- chunks covered: S, TU, DI
- missing chunks: none

Normalization audit:

- repaired: 0
- unchanged: 0
- unresolved: 18

Unresolved mapping rules:

- non_scalar_value: 18

Issue families after replay:

- INVALID_CANDIDATE_TYPE: 6
- INVALID_EVIDENCE_TYPE: 6
- INVALID_FALSE_FRIEND_RISK: 6
- INVALID_NULL_CANDIDATE: 18

---

## 5. Interpretation

The enum normalizer did not improve the v0.4 replay outcome.
It could not repair any enum fields because the archived payload uses non-scalar enum objects rather than scalar alias strings.
As a result, strict validation fails exactly as before the replay.

This is still useful development evidence:
- raw output stays intact
- normalization stays deterministic
- unresolved values remain visible
- the validator remains strict
- the failure mode is now narrowed to shape repair, not alias normalization

---

## 6. Claim boundary

This replay is development-only.
It is not:
- origin proof
- candidate truth proof
- publication evidence
- eval evidence
- Cohort evidence
- model-quality evidence
- a reason to change the default provider from mock

---

## 7. Next action

Do not rerun a model yet.
The next useful lane is to decide whether the candidate-shape drift needs a broader post-parse repair pass or a schema contraction before any further local llama retry.

