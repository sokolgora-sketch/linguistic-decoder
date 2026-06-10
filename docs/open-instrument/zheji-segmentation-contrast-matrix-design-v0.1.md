# Zheji Segmentation Contrast Matrix Design v0.1

This document designs a reusable contrast matrix for comparing Zheji segmentation lanes inside the Open Instrument Heart-Brain prototype.

This is a design document only.

It does not run a model.

It does not create a comparison result.

It does not create an artifact.

It does not change source code.

It does not change validator behavior.

It does not authorize reruns.

## Background

The immediate input to this design is the accepted PR #1263 review of the `study.segmentation.002`, `study.segmentation.003`, and `study.segmentation.004` comparison worksheet.

Accepted comparison state:

- `study.segmentation.002 / STU + DI` remains historically useful but report-backed in the currently inspected evidence set.
- `study.segmentation.003 / SHTU + DI` is the stable clean reinforced Zheji baseline.
- `study.segmentation.004 / S + TU + DI` is the clean fine-grained segmentation-traceability-hardened hard-case.
- `.004` creates more null-candidate pressure than `.003`.
- `.004` gives finer traceability into smaller embryo units.
- Clean structure remains schema/traceability evidence, not candidate-truth evidence.

## Purpose

The segmentation contrast matrix exists to make future segmentation comparisons repeatable, auditable, and bounded.

It should prevent ad hoc conclusions such as:

- this segmentation is the true origin
- this segmentation is the winner
- this language owns the word
- this model proved the candidates
- provider default should change from `mock`
- a clean artifact is publication evidence

The matrix compares contract behavior and interpretive pressure.

It does not compare historical truth.

## Required boundary line

Every future matrix or matrix-derived review should carry this boundary:

This artifact records which segmentation lanes are structurally cleaner, more traceable, or more pressure-bearing inside the Open Instrument meaning/function motivation prototype. It does not claim origin, history, winner status, linguistic ownership, candidate truth, or model quality proof.

## Source policy

The matrix must use repo evidence only.

Allowed source types:

- archived artifact JSON files
- companion result markdown reports
- review markdown documents
- design documents that explain lane intent
- preflight documents that lock target constraints

Forbidden source types:

- chat memory alone
- assistant memory alone
- uncited interpretation
- new model calls
- fresh reruns
- external web claims
- language-history speculation

If a value is not present in inspected repo evidence, the matrix must say:

- `not available in inspected evidence`

It must not invent missing fields.

## Matrix rows

Each row represents one segmentation lane.

For the current `study` comparison, rows are:

- `study.segmentation.002 / STU + DI`
- `study.segmentation.003 / SHTU + DI`
- `study.segmentation.004 / S + TU + DI`

Future rows may include other segmentations only after their own artifact and review chain exists.

## Required matrix columns

The contrast matrix must include these columns.

### segmentationId

Exact segmentation identifier.

Example:

- `study.segmentation.004`

### chunk split

Exact Heart-approved chunk split.

Example:

- `S + TU + DI`

### chunk count

Number of chunks in the split.

Example:

- `.003 / SHTU + DI` has `2`
- `.004 / S + TU + DI` has `3`

### evidence source

The artifact, report, or review document used for the row.

This must be a repo path, not a memory statement.

### evidence status

Allowed values:

- `artifact-backed`
- `report-backed`
- `review-backed`
- `design-only`
- `not comparable`

### run classification

Classification from artifact/report where available.

Examples:

- `CLEAN_ZHEJI_REINFORCED_REPLAY`
- `CLEAN_ZHEJI_SEGMENTATION_TRACEABILITY_HARDENED_REPLAY`
- `captured_with_issues`
- `not available in inspected evidence`

### run status

Allowed values:

- `clean`
- `captured_with_issues`
- `failed_validation`
- `timeout`
- `not run`
- `not available in inspected evidence`

### structural issue count

Use exact numeric count when available.

If absent, use:

- `not available in inspected evidence`

### enrichment warning count

Use exact numeric count when available.

If absent, use:

- `not available in inspected evidence`

### candidate count

Use exact numeric count when available.

If absent, use:

- `not available in inspected evidence`

### null candidate count

Use exact numeric count when available.

If absent, use:

- `not available in inspected evidence`

### skeleton survival

Record whether the required top-level Brain skeleton survived.

Fields to check:

- `chunkCandidates`
- `nullCandidates`
- `warnings`
- `claimBoundary`

Allowed values:

- `yes`
- `no`
- `partial`
- `not available in inspected evidence`

### forbidden field absence

Record whether forbidden Brain-authored fields were absent.

Fields to check:

- top-level `candidates`
- `transparencyContrast`
- `transparencyContrastNote`

Allowed values:

- `yes`
- `no`
- `partial`
- `not available in inspected evidence`

### candidate payload survival

Record whether required non-null candidate payload fields survived.

Fields to check:

- `language`
- `candidateForm`
- `meaning`
- `sourceNote`

Allowed values:

- `yes`
- `no`
- `partial`
- `not available in inspected evidence`

### segmentation traceability survival

Record whether candidate-level segmentation IDs survived.

Fields to check:

- `chunkCandidates[].segmentationId`
- `nullCandidates[].segmentationId`

Allowed values:

- `yes`
- `no`
- `partial`
- `not available in inspected evidence`

### null pressure

Interpretive pressure caused by null candidates.

Allowed values:

- `none`
- `low`
- `medium`
- `high`
- `not available in inspected evidence`

Rule:

- More null candidates do not mean failure by themselves.
- Null candidates can be a sign of honesty.
- Null pressure becomes useful only when compared with structural cleanliness.

### granularity pressure

Pressure caused by segmentation granularity.

Allowed values:

- `coarse`
- `medium`
- `fine`
- `not available in inspected evidence`

Example:

- `.003 / SHTU + DI` is less granular than `.004 / S + TU + DI`.
- `.004 / S + TU + DI` isolates smaller embryo units and therefore increases traceability and null-candidate pressure.

### interpretive value

Short bounded interpretation.

Allowed examples:

- stable clean baseline
- fine-grained hard-case
- report-backed historical comparison point
- diagnostic structural failure
- timeout-only operational evidence

Forbidden examples:

- true segmentation
- winning segmentation
- origin proof
- language ownership proof
- publication-ready finding

### limitation

Short bounded limitation.

Allowed examples:

- less granular than `.004`
- creates more null-candidate pressure
- not directly comparable from inspected JSON summary
- clean structure does not equal candidate truth

## Required matrix footer

Every contrast matrix must include a footer with these statements:

- This is not an etymology result.
- This is not an origin result.
- This is not a winner result.
- This is not language superiority evidence.
- This is not model quality proof.
- This is not provider default change evidence.
- This is not publication framing.
- This is Open Instrument meaning/function motivation evidence only.

## Interpretation rules

### Rule 1: clean does not mean true

A clean row means the output respected the structural contract.

It does not mean candidates are true.

It does not mean the segmentation is historically correct.

### Rule 2: null candidates are not automatic failures

A null candidate is acceptable when it honestly records that no credible candidate was emitted.

For fine-grained segmentations, more null candidates may be expected.

### Rule 3: finer segmentation increases pressure

Smaller chunks increase traceability but also increase model burden.

The matrix should explicitly separate:

- structural cleanliness
- semantic usefulness
- null pressure
- traceability pressure

### Rule 4: no winner declaration

The matrix may say:

- stable clean baseline
- harder fine-grained stress target
- more traceable
- more pressure-bearing

The matrix must not say:

- best segmentation
- true segmentation
- final segmentation
- origin segmentation
- winner

### Rule 5: compare evidence, not vibes

Every comparison cell must be grounded in repo evidence.

If evidence is missing, say so.

Do not fill gaps from memory.

## Current intended first use

The first matrix implementation should compare:

| segmentationId | chunk split | expected lane role |
|---|---:|---|
| `study.segmentation.002` | `STU + DI` | report-backed historical comparison point |
| `study.segmentation.003` | `SHTU + DI` | stable clean reinforced baseline |
| `study.segmentation.004` | `S + TU + DI` | clean fine-grained hard-case |

The first implementation must be docs-only.

It must use existing archived evidence only.

It must not run a model.

## Required review after implementation

After the first contrast matrix is created, a separate docs-only review PR must land.

Suggested title:

`docs(open-instrument): review zheji segmentation contrast matrix`

That review should decide whether the matrix is usable for future segmentation comparisons.

It must not authorize a model call by itself.

## Out of scope

This design does not include:

- model calls
- reruns
- new artifacts
- source code changes
- validator changes
- prompt changes
- UI changes
- API changes
- provider default changes
- OpenAI API use
- publication framing
- candidate scoring
- segmentation winner selection
- historical origin claims

## Final design decision

The Zheji segmentation contrast matrix should become the reusable documentation tool for comparing segmentation lanes.

It should compare structural behavior, traceability behavior, null pressure, and interpretation boundaries.

It must preserve the Open Instrument meaning/function motivation boundary.

It must not turn clean schema behavior into origin, winner, or candidate-truth claims.
