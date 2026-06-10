# Zheji Segmentation Contrast Interpretation Note Design v0.1

## Status

Type: design only

No model call is made.

No artifact is created.

No source, runtime, API, UI, prompt, validator, provider, or schema behavior is changed.

## Purpose

This document designs the Zheji segmentation contrast interpretation note.

The interpretation note is a reusable documentation layer that explains how to read a Zheji segmentation contrast matrix without overclaiming.

It translates matrix evidence into bounded interpretation.

It does not select a winner.

It does not claim origin.

It does not prove candidate truth.

It does not create publication framing.

## Immediate input

This design follows the accepted Zheji study segmentation contrast matrix review.

Relevant merged chain:

- PR #1264 designed the reusable matrix.
- PR #1265 created the first matrix.
- PR #1266 reviewed and accepted the matrix.

The reviewed matrix compared:

- `study.segmentation.002 / STU + DI`
- `study.segmentation.003 / SHTU + DI`
- `study.segmentation.004 / S + TU + DI`

The accepted matrix interpretation was:

- `.002 / STU + DI` remains report-backed in the current inspected evidence set.
- `.003 / SHTU + DI` remains the stable clean reinforced baseline.
- `.004 / S + TU + DI` remains the clean fine-grained hard-case.
- `.004` creates more null pressure and traceability pressure than `.003`.
- Clean structure remains schema/traceability evidence, not candidate-truth evidence.

## Problem

A matrix is useful, but it can be misread.

Risky readings include:

- treating clean structure as candidate truth
- treating lower null pressure as superiority
- treating finer segmentation as truth
- treating stable baseline as historical origin
- treating report-backed evidence as direct JSON-summary evidence
- treating one clean run as model quality proof
- turning internal diagnostic language into publication framing

The interpretation note must block these misreadings.

## Design goal

The interpretation note should answer one question:

What can be responsibly inferred from the segmentation contrast matrix?

It should separate:

- structural interpretation
- traceability interpretation
- null-pressure interpretation
- granularity interpretation
- evidence-status interpretation
- limitation interpretation
- forbidden interpretation

## Required note structure

The interpretation note should use this section order:

1. status
2. source matrix
3. interpretation boundary
4. evidence status summary
5. segmentation lane interpretation
6. null-pressure interpretation
7. traceability interpretation
8. granularity interpretation
9. missing-value discipline
10. allowed conclusions
11. forbidden conclusions
12. next allowed action

## Source matrix section

The note must name the matrix it interprets.

Required source:

- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-v0.1.md`

Required review source:

- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-review-v0.1.md`

The note must state that it uses existing archived evidence only.

The note must state that it does not call a model.

## Interpretation boundary

The note must include this boundary:

- This is a structural and traceability interpretation.
- This is not an etymology result.
- This is not an origin result.
- This is not a winner result.
- This is not candidate-truth evidence.
- This is not model-quality proof.
- This is not publication framing.

## Evidence status summary

The note should preserve the matrix evidence status:

- `.002 / STU + DI` is report-backed in the current inspected evidence set.
- `.003 / SHTU + DI` is direct clean reinforced matrix evidence.
- `.004 / S + TU + DI` is direct clean segmentation-traceability-hardened matrix evidence.

The note must not inflate `.002` into directly comparable JSON-summary-backed evidence unless a directly summarized `.002` JSON artifact is surfaced.

## Segmentation lane interpretation

### `.002 / STU + DI`

Allowed interpretation:

- useful historical comparison point
- spelling-close earlier segmentation
- report-backed in current inspected evidence set
- less directly comparable than `.003` and `.004` in the current matrix

Forbidden interpretation:

- `.002` is the origin
- `.002` is the winner
- `.002` is truer
- `.002` is rejected
- `.002` proves or disproves the project

### `.003 / SHTU + DI`

Allowed interpretation:

- stable clean reinforced baseline
- lower granularity pressure than `.004`
- lower null pressure than `.004`
- useful baseline for later comparisons

Forbidden interpretation:

- `.003` is the origin
- `.003` is the winning segmentation
- `.003` is candidate truth
- lower null pressure means superiority
- clean structure means historical proof

### `.004 / S + TU + DI`

Allowed interpretation:

- clean fine-grained hard-case
- higher granularity pressure than `.003`
- higher null pressure than `.003`
- stronger stress test for segmentation traceability
- useful for testing smaller embryo-unit behavior

Forbidden interpretation:

- `.004` is the origin
- `.004` is the winner
- `.004` is candidate truth
- finer granularity means truth
- higher null pressure means failure
- clean result means publication-ready proof

## Null-pressure interpretation

Null pressure means the model has more places where honest absence or unresolved support can appear.

Null pressure is not automatic failure.

Higher null pressure can be expected when segmentation is finer.

The interpretation note should say:

- `.004` creates more null pressure than `.003`.
- This is expected because `.004` splits `SHTU` into `S + TU`.
- More null pressure means more diagnostic stress.
- More null pressure does not mean the lane is worse.
- Less null pressure does not mean the lane is better.

## Traceability interpretation

Traceability means the output preserves candidate-level relation to the Heart-approved segmentation.

The note should say:

- `.004` creates higher traceability pressure than `.003`.
- Clean `.004` traceability is important because earlier `.004` runs exposed segmentationId failure.
- Clean traceability proves the prompt/schema contract survived.
- Clean traceability does not prove candidate truth.

## Granularity interpretation

Granularity means how finely the target word is split into embryo units.

The note should say:

- `.003 / SHTU + DI` is less granular.
- `.004 / S + TU + DI` is more granular.
- Finer granularity can expose weaknesses hidden by coarser segmentation.
- Finer granularity is useful as a stress test.
- Finer granularity is not automatically more true.

## Missing-value discipline

The note must preserve missing-value discipline.

Allowed phrase:

- `not available in inspected evidence`

Required discipline:

- do not backfill from chat memory
- do not invent missing values
- do not infer missing JSON fields
- do not convert report-backed evidence into JSON-summary-backed evidence
- do not silently normalize evidence classes

## Allowed conclusions

The interpretation note may conclude:

- `.003` is currently the stable clean reinforced baseline.
- `.004` is currently the clean fine-grained hard-case.
- `.004` creates more null pressure and traceability pressure than `.003`.
- `.004` cleanly survives the hardened prompt/schema contract.
- `.002` remains useful historically but report-backed in the current inspected evidence set.
- The matrix is useful for documentation comparison and future planning.

## Forbidden conclusions

The interpretation note must forbid:

- origin claim
- historical proof claim
- winner claim
- candidate-truth claim
- language superiority claim
- model quality proof
- provider default change
- publication framing
- new model call authorization
- rerun authorization

## Required language style

Use dry operational language.

Do not use metaphor-heavy language.

Do not use poetic terms such as:

- identity card
- embryo truth
- living proof
- sacred root
- hidden origin
- real word source

Allowed phrasing:

- structural behavior
- traceability behavior
- null pressure
- granularity pressure
- evidence status
- inspected evidence
- schema/traceability evidence
- not candidate-truth evidence
- docs-only interpretation

## Output scope

The future interpretation note must be docs-only.

It must not change:

- source files
- tests
- prompts
- validators
- schemas
- runtime
- API
- UI
- provider defaults
- artifact JSON
- existing result reports

## Review requirement

After the interpretation note is created, it must receive its own docs-only review PR.

No model call is allowed before that review lands.

## Next allowed action

After this design lands, create:

`docs(open-instrument): add zheji segmentation contrast interpretation note`

No model call is authorized by this design.

No rerun is authorized by this design.

No publication framing is authorized by this design.

## Final design decision

The Zheji segmentation contrast interpretation note should become the reusable boundary layer for reading contrast matrices.

It should explain what the matrix supports, what it does not support, and what remains blocked.

It must keep clean schema behavior separate from candidate truth, origin, winner, and publication claims.
