# Zheji Study Segmentation Contrast Matrix Review v0.1

## Status

Type: documentation review

Reviewed PR: PR #1265

Reviewed merge SHA:

- `0d1a47c0`

Reviewed file:

- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-v0.1.md`

No model call is made.

No artifact is created.

No source, runtime, API, UI, prompt, validator, or provider default is changed.

## Review decision

The PR #1265 Zheji study segmentation contrast matrix is accepted.

It is a useful documentation matrix for comparing existing segmentation evidence.

It stays inside the Open Instrument meaning/function motivation boundary.

It does not claim origin.

It does not declare a winning segmentation.

It does not prove candidate truth.

It does not justify provider default change.

It does not create publication framing.

## What PR #1265 added

PR #1265 added:

- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-v0.1.md`

The matrix compares:

- `study.segmentation.002 / STU + DI`
- `study.segmentation.003 / SHTU + DI`
- `study.segmentation.004 / S + TU + DI`

The matrix uses existing archived evidence only.

It does not rely on chat memory.

It does not create a new model run.

## Accepted interpretation

### `.002 / STU + DI`

The `.002 / STU + DI` lane is correctly treated as report-backed in the current inspected evidence set.

The matrix does not invent missing `.002` JSON fields.

The matrix does not treat `.002` as directly equivalent to the later Zheji-hardened lanes unless directly summarized comparable JSON evidence is surfaced.

### `.003 / SHTU + DI`

The `.003 / SHTU + DI` lane is correctly treated as the stable clean reinforced baseline.

It has lower granularity pressure than `.004`.

It has lower null pressure than `.004`.

Its clean state is useful schema evidence.

It is not candidate-truth evidence.

### `.004 / S + TU + DI`

The `.004 / S + TU + DI` lane is correctly treated as the clean fine-grained hard-case.

It creates more null pressure than `.003`.

It creates more traceability pressure than `.003`.

This is expected because `.004` isolates smaller embryo units.

Its clean state is useful schema/traceability evidence.

It is not a winning-segmentation claim.

## Matrix quality check

The matrix correctly compares:

- evidence status
- run classification
- run status
- structural issue count
- enrichment warning count
- candidate count
- null candidate count
- skeleton survival
- forbidden field absence
- candidate payload survival
- segmentation traceability survival
- null pressure
- granularity pressure
- interpretive value
- limitation

The matrix correctly preserves missing-value discipline.

It uses `not available in inspected JSON summary` where the current evidence does not support a direct value.

That is the correct behavior.

Do not backfill missing values from memory.

Do not infer missing artifact fields.

Do not treat report-backed values as direct JSON-summary-backed values.

## Boundary check

The matrix does not authorize:

- model call
- rerun
- language expansion
- provider switch
- validator change
- prompt change
- runtime/API/UI wiring
- publication framing

The matrix does not claim:

- origin
- historical proof
- winning segmentation
- candidate truth
- language superiority
- model quality proof
- provider default change

## Review result

The PR #1265 matrix is accepted.

The reusable Zheji segmentation contrast matrix workflow is now established:

1. design matrix format
2. create matrix from existing evidence
3. review matrix before any derived action

## Next allowed action

Create a docs-only design PR for the next derived documentation layer:

`docs(open-instrument): design zheji segmentation contrast interpretation note`

No model call is authorized by this review.

No rerun is authorized by this review.

No publication framing is authorized by this review.
