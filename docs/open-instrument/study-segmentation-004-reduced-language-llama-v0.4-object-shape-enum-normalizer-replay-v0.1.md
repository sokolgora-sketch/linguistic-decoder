# Study Segmentation 004 Reduced-Language Llama v0.4 Object-Shape Enum Normalizer Replay v0.1

## Status
- offline replay only
- no model call
- no new Brain output
- no runtime wiring
- no prompt change
- no validator change
- no provider default change
- development evidence only

## Source
- word: study
- segmentation: study.segmentation.004
- chunks: S + TU + DI
- model: llama3.1:8b
- provider: openai_compat
- reduced languages: Albanian, Latin, Chinese, Germanic
- previous replay artifact path: docs/open-instrument/artifacts/heart-brain-prototype/2026-06-06-study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-v0.4-enum-normalizer-replay-v0.1.json
- previous replay review path: docs/open-instrument/study-segmentation-004-reduced-language-llama-v0.4-enum-normalizer-replay-review-v0.1.md
- raw source used: previous_replay_rawBrainOutput

## Baseline
- raw validation issue count: 36
- normalized validation issue count: 36
- repairs: 0
- unresolved enum audits: 18
- all unresolved audits were object-shaped

## Replay method
- raw Brain output was preserved;
- expanded normalizeBrainCandidateEnums was applied;
- object-wrapper enum repair was allowed only for approved enum fields;
- strict validator was run after normalization;
- no validator loosening occurred.

## Result summary
- audit total: 18
- repaired count: 18
- unchanged count: 0
- unresolved count: 0
- object-wrapper repair count: 18
- object-wrapper unresolved count: 0
- validation ok after normalization: true
- validation issue count after normalization: 0
- issue families after normalization: 
- delta from previous normalized issue count: -36
- delta from previous unresolved count: -18

## Interpretation
- The approved object-wrapper helper resolved the object-shaped enum drift in the archived replay.
- This is structural replay evidence only, not candidate truth proof or origin proof.
- Next step is a review PR before any llama rerun.

## Decision
- Next PR: review this replay result.

## Claim boundary
- development-only
- offline replay only
- not a new model run
- not origin proof
- not candidate truth proof
- not publication evidence
- not eval evidence
- not Cohort evidence
- not model-quality evidence
- not reason to change default provider from mock
