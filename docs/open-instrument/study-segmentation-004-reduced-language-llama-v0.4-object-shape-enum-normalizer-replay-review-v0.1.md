# Study Segmentation 004 Reduced-Language Llama v0.4 Object-Shape Enum Normalizer Replay Review v0.1

## Status
- review-only
- no model call
- no new Brain output
- no artifact modification
- no runtime wiring
- no prompt change
- no validator change
- no provider default change
- development evidence only

## Source
- PR #1211
- merge SHA: `f68cb57d3a7f0c849f7a0b9d84b6528acc547a91`
- replay artifact path: `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-06-study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-v0.4-object-shape-enum-normalizer-replay-v0.1.json`
- replay report path: `docs/open-instrument/study-segmentation-004-reduced-language-llama-v0.4-object-shape-enum-normalizer-replay-v0.1.md`
- source target:
  - word: `study`
  - segmentation: `study.segmentation.004`
  - chunks: `S + TU + DI`
  - model: `llama3.1:8b`
  - provider: `openai_compat`
  - reduced languages: Albanian, Latin, Chinese, Germanic
- raw source used: `previous_replay_rawBrainOutput`

## Result reviewed
- previous normalized validation issue count: `36`
- new normalized validation issue count: `0`
- repaired count: `18`
- unchanged count: `0`
- unresolved count: `0`
- object-wrapper repair count: `18`
- object-wrapper unresolved count: `0`
- delta from previous normalized issue count: `-36`
- delta from previous unresolved count: `-18`
- remaining issue families: `[]`
- validation ok after normalization: `true`

## What the replay proves
- the archived llama v0.4 Brain output is structurally recoverable after approved object-wrapper enum repair;
- the approved repair class fixed the object-shaped enum drift observed in PR #1208;
- the strict validator passes after normalization;
- raw Brain output was preserved;
- normalized Brain output remained separate;
- no validator loosening occurred;
- no new model output was generated.

## What the replay does not prove
- it does not prove candidate truth;
- it does not prove historical origin;
- it does not prove the embryo morpheme theory;
- it does not prove local llama quality generally;
- it does not prove the prompt is optimal;
- it does not prove runtime is wired;
- it does not justify changing default provider from `mock`;
- it does not count as publication/eval/Cohort evidence.

## Failure/resolution classification
- object-shaped enum drift resolved for archived v0.4 replay

Reasoning:
- PR #1207 replay showed scalar enum repair made `0` repairs and left `18` unresolved object-shaped audits.
- PR #1210 implemented approved object-wrapper repair.
- PR #1211 replay repaired all `18` object-wrapper enum values.
- Validation issues dropped from `36` to `0`.
- Therefore the specific archived v0.4 structural blocker is resolved.

## Decision
- Next PR: review this replay result.
- Do not recommend a llama rerun directly from this review.
- If any follow-up is needed after this review, it should be a separate decision about controlled llama retry, helper revision, or schema/prompt design adjustment.

## Claim boundary
- development-only
- review evidence only
- not a new model run
- not origin proof
- not candidate truth proof
- not publication evidence
- not eval evidence
- not Cohort evidence
- not model-quality evidence
- not reason to change default provider from `mock`
