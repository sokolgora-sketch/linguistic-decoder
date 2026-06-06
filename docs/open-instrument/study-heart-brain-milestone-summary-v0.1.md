# Study Heart-Brain Milestone Summary v0.1

## Status
- milestone summary only
- no model call
- no new Brain output
- no artifact modification
- no runtime wiring
- no prompt change
- no validator change
- no provider default change
- development evidence for the embryo morpheme instrument only

This milestone is development evidence for the embryo morpheme instrument. It is not external origin/truth evidence.

## Purpose
This document closes the first `study` Heart-Brain structural lane and records what was proven structurally before moving to the next design layer.

The next design layer may be Petro Zheji-inspired semantic transparency, but this PR does not implement it.

## Scope of the milestone
- word: `study`
- segmentations tested:
  - `study.segmentation.002` = `STU + DI`
  - `study.segmentation.003` = `SHTU + DI`
  - `study.segmentation.004` = `S + TU + DI`
- local-provider work:
  - `llama3.1:8b`
  - `openai_compat`
- reduced language set:
  - Albanian
  - Latin
  - Chinese
  - Germanic
- structural pipeline:
  - Heart-owned segmentation
  - Brain candidate output
  - raw output preservation
  - enum normalization
  - audit trail
  - strict validation after normalization
  - review docs

## Main structural conclusions
1. Heart-Brain separation is viable for the `study` prototype.
2. Heart-owned segmentation prevents Brain from deciding the word structure.
3. Brain output can be useful but shape-drifty.
4. Strict validation is necessary.
5. Normalization is necessary for local-provider output.
6. Object-wrapper enum repair solved the hard `.004` structural blocker.
7. `.004 / S + TU + DI` is the active hard-case structural path.
8. Repair pressure increases as segmentation becomes more granular.
9. The pipeline can produce structurally clean development evidence without OpenAI API or provider-default changes.

## What was proven
- The instrument can generate and validate embryo-morpheme candidate output for `study`.
- The `.004` hard case can pass raw → normalization → strict validation.
- A fresh local llama retry reproduced the archived replay success pattern structurally.
- The pipeline can separate raw Brain output from normalized Brain output.
- The system can preserve auditability.

## What was not proven
- This does not prove `study` historically comes from `S + TU + DI`.
- This does not prove candidate meanings are true.
- This does not prove all words can be decoded this way.
- This does not prove local llama is generally reliable.
- This does not prove the prompt is optimal.
- This does not justify changing default provider from `mock`.

## Evidence map
- `docs/open-instrument/study-segmentation-prototype-comparison-v0.1.md`
  - milestone comparison across `002`, `003`, and `004`.
- `docs/open-instrument/study-segmentation-004-controlled-llama-retry-after-enum-repair-result-v0.1.md`
  - controlled retry result for `.004`.
- `docs/open-instrument/study-segmentation-004-controlled-llama-retry-after-enum-repair-review-v0.1.md`
  - review of the controlled retry result.
- `docs/open-instrument/brain-normalization-runtime-boundary-v0.1.md`
  - runtime boundary for normalization and validation.
- `docs/open-instrument/brain-candidate-enum-object-shape-repair-policy-v0.1.md`
  - enum object-shape repair policy for the replay/repair lane.
- `docs/open-instrument/study-heart-brain-qwen3-8b-prototype-result-v0.1.md`
  - early `study` prototype baseline context.
- `docs/open-instrument/study-heart-brain-qwen3-8b-segmentation-002-result-v0.1.md`
  - `study.segmentation.002` first run diagnostic.
- `docs/open-instrument/study-heart-brain-qwen3-8b-segmentation-002-result-v0.2.md`
  - `study.segmentation.002` clean rerun after prompt reinforcement.
- `docs/open-instrument/study-heart-brain-prototype-review-v0.1.md`
  - `study.segmentation.003` clean baseline review.
- `docs/open-instrument/study-segmentation-004-prototype-failure-review-v0.1.md`
  - `study.segmentation.004` early failure diagnosis.
- `docs/open-instrument/study-segmentation-004-capture-timeout-review-v0.1.md`
  - operational timeout context before the controlled retry lane.

## What this milestone means
- The `study` lane is now structurally complete enough to close as a milestone.
- The instrument has a documented clean baseline, a prompt-reinforced rerun path, and a hard-case normalized recovery path.
- The next step should be a new design layer, not another blind rerun of the same lane.

## What this milestone does not mean
- It does not mean historical origin is solved.
- It does not mean the embryo morpheme theory is proven.
- It does not mean future words will behave the same.
- It does not mean the current prompt is final.
- It does not mean the default provider should change from `mock`.

## Claim boundary
- development evidence for the embryo morpheme instrument only
- milestone summary only
- not external origin/truth evidence
- not scientific evidence
- not publication evidence
- not eval evidence
- not Cohort evidence
- not model-quality evidence
- not reason to change the default provider from `mock`

## Completion definition
This milestone summary is complete when:
- the structural lane comparison is recorded;
- the main structural conclusions are explicit;
- the proof and non-proof boundaries are explicit;
- the evidence map is explicit;
- the next design layer is named but not implemented;
- local validation passes.

