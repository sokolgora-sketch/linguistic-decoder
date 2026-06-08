# Zheji Study003 Reinforced Stability Review v0.1

## Purpose

This document reviews the two clean reinforced Zheji `study.segmentation.003` artifacts.

It compares:

- PR #1237: first clean reinforced `.003 / SHTU + DI` replay
- PR #1238: repeat-002 clean reinforced `.003 / SHTU + DI` replay

This review decides whether `.003 / SHTU + DI` is structurally stable under the reinforced output skeleton.

This is a docs-only review.

It does not run a model.

It does not create a new artifact.

It does not change source code.

It does not change provider defaults.

It does not start `.004`.

## Reviewed artifacts

### PR #1237 artifact

PR:

- #1237
- `docs(open-instrument): archive zheji study003 reinforced replay artifact`

Merge SHA:

- `56ee06e`

Artifact:

- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-08-study-heart-brain-llama3-1-8b-segmentation-003-zheji-reinforced-replay-v0.1.json`

Report:

- `docs/open-instrument/study-segmentation-003-zheji-reinforced-replay-result-v0.1.md`

Classification:

- `CLEAN_ZHEJI_REINFORCED_REPLAY`

Status:

- `clean`

### PR #1238 artifact

PR:

- #1238
- `docs(open-instrument): archive zheji study003 reinforced repeat artifact`

Merge SHA:

- `903d1dc`

Artifact:

- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-08-study-heart-brain-llama3-1-8b-segmentation-003-zheji-reinforced-repeat-002-v0.1.json`

Report:

- `docs/open-instrument/study-segmentation-003-zheji-reinforced-repeat-002-result-v0.1.md`

Classification:

- `CLEAN_ZHEJI_REINFORCED_REPEAT`

Status:

- `clean`

Repeat result:

- `repeatStableWithBase: true`

## Fixed target

Both artifacts use the same Heart-approved target.

Word:

- `study`

Segmentation:

- `study.segmentation.003`

Chunks:

- `SHTU + DI`

Voice path:

- `U → I`

Provider path:

- provider: `openai_compat`
- model: `llama3.1:8b`
- endpoint: `http://localhost:11434/v1/chat/completions`

Provider default:

- remained `mock`

## Why the repeat was required

PR #1237 proved the reinforced output skeleton could produce one clean Zheji `.003 / SHTU + DI` replay.

One clean run was not enough to treat the reinforcement as stable.

The repeat was required to test whether the clean result was reproducible under:

- same fixed Heart input;
- same reinforced prompt/output skeleton;
- same local provider path;
- same local model;
- exactly one additional model call;
- separate artifact archive.

PR #1238 supplied that repeat.

## Comparison table

| Field | PR #1237 | PR #1238 |
|---|---|---|
| classification | `CLEAN_ZHEJI_REINFORCED_REPLAY` | `CLEAN_ZHEJI_REINFORCED_REPEAT` |
| status | `clean` | `clean` |
| raw parse ok | `true` | `true` |
| provider HTTP status | `200` | `200` |
| model call count | `1` | `1` |
| OpenAI API used | `false` | `false` |
| provider default changed | `false` | `false` |
| structural ok | `true` | `true` |
| structural issue count | `0` | `0` |
| enrichment ok | `true` | `true` |
| enrichment warning count | `0` | `0` |
| candidate count | `2` | `2` |
| null candidate count | `0` | `0` |
| derived contrast partial | `false` | `false` |
| top-level `chunkCandidates` present | `true` | `true` |
| top-level `nullCandidates` present | `true` | `true` |
| top-level `warnings` present | `true` | `true` |
| top-level `claimBoundary` present | `true` | `true` |
| top-level `candidates` absent | `true` | `true` |

## Reinforced skeleton behavior

Both clean runs confirm the reinforced output skeleton is working for `.003 / SHTU + DI`.

The reinforced prompt/output skeleton includes:

- `STRUCTURAL_CONTRACT`
- `LINGUISTIC_EVALUATION_RULES`
- `OUTPUT_JSON_SKELETON`

The skeleton forces:

- top-level `chunkCandidates`
- top-level `nullCandidates`
- top-level `warnings`
- top-level `claimBoundary`

The skeleton forbids:

- top-level `candidates` as replacement shape
- Brain-authored `transparencyContrast`
- Brain-authored `transparencyContrastNote`
- scoring
- ranking
- winner selection
- origin claims
- `candidateType` mutation

The two clean artifacts show that the model followed the required skeleton twice.

## Relationship to PR #1233 failure

PR #1233 produced useful conceptual Zheji signal, but failed strict schema obedience.

The PR #1233 failure mode was:

- raw parse ok;
- candidate-level `analysisLayers` present;
- candidate-level `semanticTransparency` present;
- top-level `candidates` used instead of required `chunkCandidates`;
- required `nullCandidates`, `warnings`, and `claimBoundary` missing;
- structural validation failed.

That failure was not a conceptual Zheji failure.

It was a schema-obedience failure under prompt pressure.

PR #1236 introduced the reinforced output skeleton.

PR #1237 showed the reinforced skeleton could fix the failure once.

PR #1238 showed the fixed behavior repeated.

## Stability decision

Decision:

- `.003 / SHTU + DI` is structurally stable under the reinforced Zheji output skeleton.

Reason:

- two separate controlled local model calls;
- same fixed target;
- same local model;
- same provider path;
- same reinforced skeleton;
- both clean;
- both structural issue count `0`;
- both enrichment warning count `0`;
- both preserved strict Brain top-level skeleton;
- both preserved additive Zheji enrichment;
- repeat artifact explicitly recorded `repeatStableWithBase: true`.

## What this does not prove

This review does not prove external origin.

It does not prove historical origin.

It does not prove candidate truth.

It does not prove model quality.

It does not prove language superiority.

It does not justify changing provider default from `mock`.

It does not declare a winner.

It does not declare origin.

It does not modify `candidateType`.

It does not mean `.004` is already safe to run.

## Remaining risk

The current stability result applies only to:

- word: `study`
- segmentation: `study.segmentation.003`
- chunks: `SHTU + DI`
- model: local `llama3.1:8b`
- provider path: `openai_compat`
- reinforced skeleton version current at PR #1236

It does not automatically generalize to:

- `.004 / S + TU + DI`
- multi-word batches
- larger language scopes
- other models
- other provider paths
- non-local provider paths

## Gate before `.004`

Do not run `.004` directly after this review.

The next required gate is a segmentation-comparison gate.

The segmentation-comparison gate should compare:

- `.003 / SHTU + DI`
- `.004 / S + TU + DI`

The gate should define:

- why `.004` is being tested;
- what changed from `.003`;
- what counts as success;
- what counts as structural failure;
- how to handle extra chunk pressure;
- whether reduced language scope is required;
- how null candidates must preserve traceability;
- how Zheji enrichment remains additive;
- what artifact/report paths will be used;
- why provider default remains `mock`.

## Recommended next PR

Recommended next PR:

`docs(open-instrument): define zheji study003-to-004 segmentation comparison gate`

Purpose:

- compare stable `.003 / SHTU + DI` against planned `.004 / S + TU + DI`;
- define the safety gate before any `.004` replay;
- preserve no-model-call discipline;
- preserve provider default `mock`;
- avoid treating `.003` stability as origin proof.

The next PR should be docs-only.

It should not run a model.

It should not create an artifact.

It should not modify source code.

It should not change provider defaults.

It should not run `.004`.

## Final review outcome

The reinforced `.003 / SHTU + DI` path is accepted as structurally stable.

The next action is segmentation-comparison gate design.

`.004 / S + TU + DI` remains blocked until that gate is merged.
