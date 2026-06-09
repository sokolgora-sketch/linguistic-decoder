# Study Segmentation 004 Zheji Reinforced Replay Review v0.1

## Purpose

This document reviews the archived Zheji `study.segmentation.004` reinforced replay artifact from PR #1242.

The review decides what the captured structural failure means before any repeat, prompt modification, enum repair, or publication framing.

This review does not run a model.

This review does not create a new artifact.

This review does not change source code.

This review does not change provider defaults.

This review does not rerun `.004`.

## Reviewed artifact

PR:

- PR #1242: `docs(open-instrument): archive zheji study004 reinforced replay artifact`

Merge SHA:

- `1167eca`

Artifact:

- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-08-study-heart-brain-llama3-1-8b-segmentation-004-zheji-reinforced-replay-v0.1.json`

Report:

- `docs/open-instrument/study-segmentation-004-zheji-reinforced-replay-result-v0.1.md`

## Fixed input

- word: `study`
- segmentationId: `study.segmentation.004`
- chunks: `S + TU + DI`
- word-level voice path: `U → I`

## Provider path

- provider: `openai_compat`
- model: `llama3.1:8b`
- endpoint: `http://localhost:11434/v1/chat/completions`
- provider default: `mock`
- model call count: `1`
- OpenAI API used: `false`

## Classification

The artifact classification is accepted as:

- `ZHEJI_STUDY004_REINFORCED_STRUCTURAL_FAILURE`

Status:

- `captured_with_issues`

This classification is correct.

The artifact is not clean, but it is valid evidence because the one-call rule held and the failure was archived without rerun.

## What worked

The reinforced top-level Brain skeleton survived the harder `.004 / S + TU + DI` split.

The raw Brain output preserved:

- top-level `chunkCandidates`
- top-level `nullCandidates`
- top-level `warnings`
- top-level `claimBoundary`

The raw Brain output did not use forbidden top-level `candidates`.

This means PR #1236 successfully prevented the previous Zheji failure mode where the model collapsed the Brain skeleton into top-level `candidates`.

## What failed structurally

The structural failure narrowed to null-candidate enum obedience.

Structural issue count:

- `3`

Issues:

- `nullCandidates.0.candidateType` was not `null_candidate`
- `nullCandidates.1.candidateType` was not `null_candidate`
- `nullCandidates.2.candidateType` was not `null_candidate`

The problem is not top-level skeleton collapse.

The problem is the null-candidate enum contract under `.004` chunk pressure.

## What failed as enrichment

Enrichment warning count:

- `3`

Warnings:

- `chunkCandidates.0.semanticTransparency.level` was empty
- `chunkCandidates.1.semanticTransparency.level` was empty
- `chunkCandidates.2.semanticTransparency.level` was empty

Valid transparency candidate count:

- `0`

Derived contrast:

- partial: `true`
- unavailable reason: `no_valid_semantic_transparency`

This means derived contrast could not provide a useful language-level transparency matrix for this run.

## Interpretation

The `.004 / S + TU + DI` split increased pressure compared with stable `.003 / SHTU + DI`.

The model did not collapse the whole reinforced Brain skeleton.

Instead, it failed at a narrower layer:

- null-candidate enum obedience;
- semantic transparency level completion.

That is useful diagnostic evidence.

The replay should not be treated as a failed workflow.

It should be treated as a successful capture of the next weak point.

## Comparison with `.003`

Stable `.003` baseline:

- segmentationId: `study.segmentation.003`
- chunks: `SHTU + DI`
- reinforced clean replay: passed
- reinforced repeat replay: passed
- structural issue count: `0`
- enrichment warning count: `0`

Hard `.004` target:

- segmentationId: `study.segmentation.004`
- chunks: `S + TU + DI`
- reinforced replay: captured structural failure
- structural issue count: `3`
- enrichment warning count: `3`

Conclusion:

- `.003 / SHTU + DI` remains the stable baseline.
- `.004 / S + TU + DI` remains the hard-case stress target.
- `.004` should not be promoted as stable.
- `.004` should not be repeated blindly.

## Decision

The PR #1242 artifact is accepted as a valid captured diagnostic failure.

No rerun should happen before the failure is addressed in design.

No prompt change should happen before the failure is reviewed.

No enum repair should happen inside this review.

No provider default change is justified.

No publication framing is allowed from this artifact.

## Required next design

Before another `.004` replay, create a design PR for `.004` enum/enrichment hardening.

Suggested PR title:

`docs(open-instrument): design zheji study004 enum and enrichment hardening`

The design should address:

- null-candidate `candidateType` enum obedience;
- explicit fallback for null candidate `candidateType: null_candidate`;
- non-empty `semanticTransparency.level` fallback;
- whether allowed levels should be explicitly constrained to `atomic`, `metaphorical`, or `opaque`;
- whether missing or empty transparency level remains an enrichment warning;
- whether null candidates should be excluded from transparency validation and derived contrast;
- whether non-null candidates with empty transparency level should remain warning-only or block clean classification;
- how to preserve the reinforced top-level skeleton while adding enum/enrichment pressure.

## Forbidden next actions

Do not rerun `.004` immediately.

Do not run `.004` repeat-002 yet.

Do not modify prompt helper yet.

Do not modify validator yet.

Do not add enum repair yet.

Do not change provider default.

Do not use OpenAI API.

Do not expand to another word.

Do not frame this as evidence for origin, truth, superiority, or model quality.

## Claim boundary

This review is development-only.

It is not external origin/truth evidence.

It is not historical origin proof.

It is not candidate truth proof.

It is not model-quality evidence.

It is not language superiority evidence.

It is not a reason to change provider default from `mock`.

It does not declare a winner.

It does not declare origin.

It does not mutate `candidateType`.

## Final review outcome

The `.004 / S + TU + DI` reinforced replay artifact is accepted as a useful diagnostic structural failure.

The reinforced top-level Brain skeleton survived.

The next weakness is null-candidate enum obedience and transparency-level completion.

The next required action is a design PR for `.004` enum and enrichment hardening.

No rerun before that design is reviewed and merged.
