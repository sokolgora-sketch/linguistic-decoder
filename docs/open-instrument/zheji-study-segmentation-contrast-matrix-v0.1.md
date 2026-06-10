# Zheji Study Segmentation Contrast Matrix v0.1

## Status

Type: documentation matrix

Scope: existing archived evidence only

Model call made: false

Artifact created: false

Provider default changed: false

OpenAI API used: false

This matrix compares existing Zheji `study` segmentation lanes.

It compares structural behavior, traceability behavior, null pressure, granularity pressure, and interpretation boundaries.

It is not an etymology result.

It is not an origin result.

It is not a winner result.

It is not candidate-truth evidence.

Clean structure remains schema/traceability evidence only.

## Source chain

This matrix follows the accepted reusable design:

- `docs/open-instrument/zheji-segmentation-contrast-matrix-design-v0.1.md`

It also follows the accepted comparison chain:

- `docs/open-instrument/study002-study003-study004-zheji-segmentation-comparison-design-v0.1.md`
- `docs/open-instrument/study002-study003-study004-zheji-segmentation-comparison-v0.1.md`
- `docs/open-instrument/study002-study003-study004-zheji-segmentation-comparison-review-v0.1.md`

The matrix uses existing archived evidence only.

It does not rely on chat memory.

It does not create a new model run.

## Compared segmentation lanes

| Lane | Segmentation | Role in matrix |
|---|---|---|
| `study.segmentation.002` | `STU + DI` | report-backed historical comparison point |
| `study.segmentation.003` | `SHTU + DI` | stable clean reinforced baseline |
| `study.segmentation.004` | `S + TU + DI` | clean fine-grained segmentation-traceability-hardened hard-case |

## Matrix

| Field | `study.segmentation.002 / STU + DI` | `study.segmentation.003 / SHTU + DI` | `study.segmentation.004 / S + TU + DI` |
|---|---|---|---|
| Evidence status | report-backed in current inspected evidence set | artifact/report-backed clean reinforced Zheji baseline | artifact/report-backed clean hardened hard-case |
| Run classification | not available in inspected JSON summary | `CLEAN_ZHEJI_REINFORCED_REPLAY` / `CLEAN_ZHEJI_REINFORCED_REPEAT` | `CLEAN_ZHEJI_SEGMENTATION_TRACEABILITY_HARDENED_REPLAY` |
| Run status | reported as structurally repaired in later docs | clean | clean |
| Structural issue count | not fully comparable from inspected JSON summary | `0` in clean report | `0` |
| Enrichment warning count | not fully comparable from inspected JSON summary | `0` in clean report | `0` |
| Candidate count | not available in inspected JSON summary | `2` | `3` |
| Null candidate count | not available in inspected JSON summary | `0` | `3` |
| Skeleton survival | reported as structurally repaired in later docs | yes | yes |
| Forbidden field absence | not fully comparable from inspected JSON summary | yes | yes |
| Candidate payload survival | not fully comparable from inspected JSON summary | yes | yes |
| Segmentation traceability survival | not fully comparable from inspected JSON summary | yes for reinforced schema lane | yes |
| Null pressure | not fully comparable from inspected JSON summary | low | high |
| Granularity pressure | medium | medium-low | high |
| Interpretive value | earlier spelling-close segmentation; useful as historical comparison | stable clean baseline; larger `SHTU` chunk reduces null pressure | fine-grained stress target; isolates `S`, `TU`, and `DI` |
| Limitation | less directly comparable unless directly summarized JSON artifact is surfaced | less granular than `.004`; does not isolate `S` and `TU` | clean structure does not prove candidate truth; higher null pressure is expected |

## Lane notes

### `study.segmentation.002 / STU + DI`

This lane remains useful as an earlier spelling-close segmentation.

In the current inspected evidence set, it is treated as report-backed rather than directly JSON-summary-backed.

This matrix does not invent missing JSON fields for `.002`.

The lane should not be used to declare that `STU + DI` is better, truer, older, or historically primary.

### `study.segmentation.003 / SHTU + DI`

This lane remains the stable clean reinforced Zheji baseline.

It uses a larger first chunk, `SHTU`, and therefore reduces chunk granularity pressure.

It has lower null pressure than `.004`.

Its clean status is important schema evidence.

It does not prove candidate truth.

It does not prove historical origin.

### `study.segmentation.004 / S + TU + DI`

This lane is the fine-grained hard-case split.

It now passes after enum, candidate payload, and segmentation traceability hardening.

It creates more null-candidate pressure than `.003`.

That null pressure is expected because `S`, `TU`, and `DI` are smaller embryo units.

The clean result is schema/traceability evidence.

It is not evidence that `.004` is the winning segmentation.

## Contrast interpretation

### Structural behavior

The `.003` and `.004` lanes now both show clean structural behavior in their accepted clean evidence paths.

The `.004` lane required more hardening before it reached clean status.

That difference is useful engineering evidence.

It does not mean `.004` is linguistically truer than `.003`.

### Traceability behavior

The `.004` lane has stronger traceability pressure because each smaller embryo unit must preserve:

- candidate payload fields
- candidate-level `segmentationId`
- null-candidate identity
- claim boundary

This pressure made `.004` a useful hard-case validation lane.

### Null pressure

The `.004` lane produces more null candidates than `.003`.

That is not an automatic failure.

In this matrix, null candidates are evidence of honest absence or unresolved candidate support.

Null candidates are better than invented candidates.

### Granularity pressure

Finer segmentation increases auditability but also increases failure surface.

The `.004 / S + TU + DI` lane isolates more units than `.003 / SHTU + DI`.

That makes `.004` useful as a stress target.

It does not make `.004` the winner.

## Boundary

This matrix does not claim:

- origin
- historical proof
- winning segmentation
- candidate truth
- language superiority
- model quality proof
- provider default change
- publication readiness

This matrix does not authorize:

- a model call
- a rerun
- a language expansion
- a provider switch
- a validator change
- a prompt change
- a publication claim

## Matrix decision

The first Zheji segmentation contrast matrix is accepted as a documentation comparison tool.

It shows:

- `.003 / SHTU + DI` remains the stable clean reinforced baseline.
- `.004 / S + TU + DI` is the clean fine-grained hard-case.
- `.004` creates more null pressure and more traceability pressure than `.003`.
- `.002 / STU + DI` remains historically useful but report-backed in the current inspected evidence set.
- clean structure remains schema/traceability evidence, not candidate-truth evidence.

## Next required step

Create a docs-only review PR:

`docs(open-instrument): review zheji segmentation contrast matrix`

No model call is allowed before that review lands.
