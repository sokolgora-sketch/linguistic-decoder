# Zheji Study Segmentation Contrast Matrix v0.2

## Status

Type: documentation matrix update

This document updates the accepted Zheji study segmentation contrast matrix after direct `.002 / STU + DI` JSON evidence review.

No model call is made.

No rerun is made.

No artifact JSON is created.

No source, runtime, API, UI, prompt, validator, provider, or schema behavior is changed.

## Update reason

The v0.1 matrix treated `.002 / STU + DI` conservatively as report-backed in the then-inspected evidence set.

PR #1273 reviewed direct `.002` JSON evidence.

Therefore, this v0.2 matrix updates the `.002` evidence status from merely report-backed to direct-artifact-backed for the reviewed v0.1 and v0.2 artifacts.

This update does not create clean-parity proof.

This update does not create candidate-truth proof.

This update does not create origin or winner evidence.

## Source chain

Matrix v0.1:

- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-v0.1.md`

Matrix review:

- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-review-v0.1.md`

Interpretation note:

- `docs/open-instrument/zheji-segmentation-contrast-interpretation-note-v0.1.md`

Interpretation review:

- `docs/open-instrument/zheji-segmentation-contrast-interpretation-note-review-v0.1.md`

Next controlled decision review:

- `docs/open-instrument/zheji-next-controlled-segmentation-decision-review-v0.1.md`

Direct `.002` JSON evidence review:

- `docs/open-instrument/study-segmentation-002-zheji-direct-json-evidence-review-v0.1.md`

Direct `.002` artifacts reviewed:

- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.1.json`
- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.2.json`

## Matrix scope

This matrix compares these study segmentation lanes:

- `study.segmentation.002 / STU + DI`
- `study.segmentation.003 / SHTU + DI`
- `study.segmentation.004 / S + TU + DI`

It compares:

- evidence status
- segmentation split
- structural behavior
- enrichment behavior
- candidate count
- null candidate count
- candidate payload survival
- segmentation traceability survival
- null pressure
- granularity pressure
- interpretation value
- limitations

It does not compare:

- historical origin
- linguistic truth
- candidate truth
- language superiority
- model quality
- publication readiness

## Updated lane summary

| Lane | Split | Updated evidence status |
| --- | --- | --- |
| `study.segmentation.002` | `STU + DI` | direct-artifact-backed for reviewed v0.1 and v0.2 artifacts; v0.1 remains repair predecessor; v0.2 is reviewed direct evidence without clean-parity overclaim |
| `study.segmentation.003` | `SHTU + DI` | stable clean reinforced baseline |
| `study.segmentation.004` | `S + TU + DI` | clean fine-grained segmentation-traceability-hardened hard-case |

## Updated contrast matrix

| Field | `study.segmentation.002 / STU + DI` | `study.segmentation.003 / SHTU + DI` | `study.segmentation.004 / S + TU + DI` |
| --- | --- | --- | --- |
| Evidence status | direct-artifact-backed after PR #1273 review | clean reinforced Zheji baseline evidence | clean segmentation-traceability-hardened hard-case evidence |
| Main artifact basis | direct v0.1 and v0.2 `.002` JSON artifacts | `2026-06-08-study-heart-brain-llama3-1-8b-segmentation-003-zheji-reinforced-replay-v0.1.json` and reinforced repeat evidence | `2026-06-09-study-heart-brain-llama3-1-8b-segmentation-004-zheji-segmentation-traceability-hardened-rerun-v0.1.json` |
| Split | `STU + DI` | `SHTU + DI` | `S + TU + DI` |
| Granularity | coarser than `.004`; spelling-close split | medium granularity; stable baseline | finest reviewed split; hard-case stress target |
| Run classification | direct artifact evidence reviewed, but clean-parity not claimed from inspected fields | `CLEAN_ZHEJI_REINFORCED_REPLAY` / `CLEAN_ZHEJI_REINFORCED_REPEAT` | `CLEAN_ZHEJI_SEGMENTATION_TRACEABILITY_HARDENED_REPLAY` |
| Run status | `candidate_structure` in reviewed `.002` evidence | clean | clean |
| Structural issue count | not promoted to clean parity from inspected direct fields | `0` in clean report | `0` |
| Enrichment warning count | not promoted to clean parity from inspected direct fields | `0` in clean report | `0` |
| Candidate count | v0.1: `5`; v0.2: `3` in reviewed direct evidence | `2` | `3` |
| Null candidate count | v0.1: `3`; v0.2: `3` in reviewed direct evidence | `0` | `3` |
| Candidate payload survival | reviewed directly; v0.1 includes repair-predecessor drift; v0.2 reviewed as direct evidence | yes | yes |
| Segmentation traceability survival | v0.1 has known candidate-level drift `study.segment,002`; v0.2 has no same candidate-level drift in PR #1273 review, but not promoted to full clean parity | yes | yes |
| Forbidden field absence | not promoted beyond PR #1273 reviewed evidence | yes | yes |
| Null pressure | present; `3` null candidates in reviewed direct evidence | lower; `0` null candidates | higher; `3` null candidates |
| Granularity pressure | lower than `.004` because `STU` is coarser than `S + TU` | lower than `.004` because `SHTU` is a larger first chunk | highest among the three reviewed lanes |
| Interpretive value | direct evidence now exists for earlier spelling-close segmentation; useful for repair-history and contrast work | stable clean reinforced baseline | fine-grained stress target for traceability and null-pressure behavior |
| Limitation | direct artifact-backed does not equal clean parity; v0.1 drift must remain visible; v0.2 must not be overclaimed | less granular than `.004`; does not isolate `S` and `TU` | clean structure does not prove candidate truth; higher null pressure is diagnostic stress, not failure |

## .002 lane update

### Previous v0.1 matrix status

The previous matrix treated `.002 / STU + DI` as report-backed because the direct JSON evidence had not yet been reviewed inside the current decision chain.

That conservative posture was correct at the time.

### New v0.2 matrix status

The current matrix treats `.002 / STU + DI` as direct-artifact-backed because PR #1273 reviewed the direct v0.1 and v0.2 JSON artifacts.

This is an evidence-status update.

It is not a truth-status update.

It is not a winner-status update.

It is not a clean-parity update.

## .002 repair-history note

The direct `.002` evidence has repair history.

v0.1 remains a repair predecessor because candidate-level segmentationId drift exists:

- `study.segment,002`

The drift must remain visible in the matrix lineage.

The matrix must not flatten v0.1 and v0.2 into one clean lane.

The matrix must not erase repair history just because v0.2 exists.

## .002 v0.2 note

v0.2 is reviewed direct evidence.

PR #1273 records that v0.2 does not carry the same candidate-level `study.segment,002` drift.

However, PR #1273 also preserves the conservative boundary that structural issue count zero and enrichment warning count zero were not confirmed from inspected artifact fields.

Therefore v0.2 may be treated as reviewed direct evidence, not as full clean-parity proof.

## .003 lane status

`.003 / SHTU + DI` remains the stable clean reinforced baseline.

It keeps its matrix role as the stable reference point.

It is less granular than `.004`.

It has lower null pressure than `.004`.

Lower null pressure does not mean superiority.

Stable baseline does not mean origin.

Clean reinforced behavior does not mean candidate truth.

## .004 lane status

`.004 / S + TU + DI` remains the clean fine-grained hard-case.

It isolates smaller embryo units.

It creates more null pressure and traceability pressure than `.003`.

Higher null pressure does not mean failure.

Higher granularity does not mean truth.

Clean traceability behavior does not mean candidate truth.

## Interpretation update

The updated interpretation is:

- `.002 / STU + DI` is direct-artifact-backed after PR #1273.
- `.002` v0.1 remains a repair predecessor because `study.segment,002` drift exists.
- `.002` v0.2 is reviewed direct evidence, but not full clean-parity proof from inspected fields.
- `.003 / SHTU + DI` remains the stable clean reinforced baseline.
- `.004 / S + TU + DI` remains the clean fine-grained hard-case.
- Clean structure remains schema/traceability evidence, not candidate-truth evidence.
- Direct artifact evidence does not prove origin.
- Direct artifact evidence does not prove winner status.
- Direct artifact evidence does not prove candidate truth.

## Rejected overclaims

This matrix update rejects:

- `.002` is the origin.
- `.002` is the winner.
- `.002` is better because it is coarser.
- `.002` has clean parity with `.003` and `.004`.
- `.002` v0.2 erases v0.1 repair history.
- `.003` is historically primary because it is stable.
- `.004` is better because it is more granular.
- `.004` is worse because it has higher null pressure.
- Clean schema behavior proves candidate truth.
- Direct artifact evidence proves historical truth.

## Boundary

This matrix update forbids:

- model call
- rerun
- new artifact JSON capture
- prompt change
- validator change
- schema change
- source implementation
- runtime/API/UI wiring
- provider default change
- OpenAI API use
- publication framing
- origin claim
- winner claim
- candidate-truth claim
- language superiority claim
- model-quality proof

## Next required step

The next PR should be docs-only:

- `docs(open-instrument): review updated zheji segmentation contrast matrix`

That review should verify:

- `.002` was updated from report-backed to direct-artifact-backed where appropriate
- v0.1 repair-predecessor status remains visible
- `study.segment,002` remains visible
- v0.2 is not overclaimed as clean parity
- `.003` remains stable clean reinforced baseline
- `.004` remains clean fine-grained hard-case
- no origin, winner, candidate-truth, publication, or model-quality claims were introduced

## Final decision

The Zheji study segmentation contrast matrix v0.2 accepts the PR #1273 evidence-status update.

`.002 / STU + DI` is now direct-artifact-backed for reviewed evidence.

`.002 / STU + DI` is not promoted to clean parity.

v0.1 remains repair predecessor.

v0.2 remains reviewed direct evidence without overclaim.

Clean structure remains schema/traceability evidence, not candidate-truth evidence.

No model call is authorized by this matrix update.

No rerun is authorized by this matrix update.
