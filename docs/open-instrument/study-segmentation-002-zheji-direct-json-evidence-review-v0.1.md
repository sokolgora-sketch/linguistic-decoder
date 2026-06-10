# Study Segmentation 002 Zheji Direct JSON Evidence Review v0.1

## Status

Type: direct artifact evidence review

This document reviews the direct `.002 / STU + DI` JSON artifacts surfaced by PR #1271 and accepted for review by PR #1272.

No model call is made.

No rerun is made.

No artifact JSON is created.

No source, runtime, API, UI, prompt, validator, provider, or schema behavior is changed.

## Source decision chain

Decision record:

- `docs/open-instrument/zheji-next-controlled-segmentation-decision-v0.1.md`

Decision review:

- `docs/open-instrument/zheji-next-controlled-segmentation-decision-review-v0.1.md`

The accepted next action was:

- `docs(open-instrument): review zheji study002 direct json evidence`

## Direct artifacts under review

The direct `.002` JSON artifacts reviewed here are:

- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.1.json`
- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.2.json`

These are direct `.002` artifacts.

They are not indirect `.004` baseline/comparison references.

## Automated direct JSON inspection

## Automated direct JSON inspection

Target segmentation ID: `study.segmentation.002`

### docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.1.json

- parse: ok
- classification: not available in inspected artifact
- status: `candidate_structure`
- structural ok: not available in inspected artifact
- structural issue count: not available in inspected artifact
- enrichment ok: not available in inspected artifact
- enrichment warning count: not available in inspected artifact
- model call made: not available in inspected artifact
- OpenAI API used: not available in inspected artifact
- provider default changed: not available in inspected artifact
- chunk candidate count from arrays: `5`
- null candidate count from arrays: `3`
- segmentationId hit count: `15`
- exact segmentationId hit count: `10`
- non-exact segmentationId hit count: `5`
- non-exact segmentationId hits:
  - `comparisonBaseline.segmentationId` = `study.segmentation.003`
  - `brainPrompt.requiredOutputSchema.segmentationId` = `string`
  - `brainPrompt.requiredOutputSchema.chunkCandidates.0.segmentationId` = `string`
  - `brainPrompt.requiredOutputSchema.nullCandidates.0.segmentationId` = `string`
  - `parsedBrainOutput.value.chunkCandidates.2.segmentationId` = `study.segment,002`

### docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.2.json

- parse: ok
- classification: not available in inspected artifact
- status: `candidate_structure`
- structural ok: not available in inspected artifact
- structural issue count: not available in inspected artifact
- enrichment ok: not available in inspected artifact
- enrichment warning count: not available in inspected artifact
- model call made: not available in inspected artifact
- OpenAI API used: not available in inspected artifact
- provider default changed: not available in inspected artifact
- chunk candidate count from arrays: `3`
- null candidate count from arrays: `3`
- segmentationId hit count: `14`
- exact segmentationId hit count: `10`
- non-exact segmentationId hit count: `4`
- non-exact segmentationId hits:
  - `comparison.baseline003.segmentationId` = `study.segmentation.003`
  - `brainPrompt.requiredOutputSchema.segmentationId` = `string`
  - `brainPrompt.requiredOutputSchema.chunkCandidates.0.segmentationId` = `string`
  - `brainPrompt.requiredOutputSchema.nullCandidates.0.segmentationId` = `string`

## Automated review conclusion

- v0.1 is a repair predecessor for segmentation traceability because at least one non-exact candidate-level segmentationId is present.
- v0.2 does not fully repair segmentationId traceability in this inspection.
- v0.2 structural issue count zero was not confirmed from inspected artifact fields.
- v0.2 enrichment warning count zero was not confirmed from inspected artifact fields.
- This is direct artifact-backed evidence, not origin evidence, not winner evidence, and not candidate-truth evidence.

## Evidence decision

The direct `.002` evidence review accepts these points:

- Direct `.002` JSON artifacts exist.
- `.002 / STU + DI` can now be described as direct-artifact-backed, not merely report-backed.
- v0.1 remains a repair predecessor for segmentation traceability if the non-exact `study.segment,002` value is present.
- v0.2 is the relevant repaired direct `.002` artifact for segmentationId traceability if its inspection shows no non-exact segmentationId hits.
- This review does not make a historical origin claim.
- This review does not make a winning segmentation claim.
- This review does not make a candidate-truth claim.

## Lane status after direct .002 review

| Lane | Split | Status after this review |
| --- | --- | --- |
| `study.segmentation.002` | `STU + DI` | direct-artifact-backed after reviewing v0.1 and v0.2; v0.1 remains repair predecessor if drift is present; v0.2 is the repaired direct artifact if non-exact segmentationId hits are absent |
| `study.segmentation.003` | `SHTU + DI` | stable clean reinforced baseline |
| `study.segmentation.004` | `S + TU + DI` | clean fine-grained hard-case |

## What changes in the comparison record

Before this review:

- `.002 / STU + DI` was treated conservatively as report-backed in the current inspected evidence set.

After this review:

- `.002 / STU + DI` may be treated as direct-artifact-backed for the reviewed v0.1 and v0.2 artifacts.
- The v0.1 drift remains part of the evidence history.
- v0.2 is the relevant artifact for repaired segmentationId traceability if the inspection confirms exact candidate-level segmentationId survival.

This does not mean `.002` is the winner.

This does not mean `.002` is historically primary.

This does not mean `.002` candidates are true.

## Accepted interpretation

The accepted interpretation is:

- `.002 / STU + DI` is now direct-artifact-backed.
- v0.1 documents a repair predecessor if `study.segment,002` is present.
- v0.2 is the repaired direct artifact for segmentationId traceability if no non-exact segmentationId hits are present.
- `.003 / SHTU + DI` remains the stable clean reinforced baseline.
- `.004 / S + TU + DI` remains the clean fine-grained hard-case.
- Clean structure remains schema/traceability evidence, not candidate-truth evidence.

## Rejected interpretation

This review rejects:

- `.002` is the origin.
- `.002` is the winner.
- `.002` is better because it has fewer chunks.
- `.002` is better because it may have lower null pressure.
- `.003` is worse because it is less granular than `.004`.
- `.004` is better because it is more granular.
- Clean schema behavior proves candidate truth.
- Direct artifact evidence proves historical truth.

## Boundary

This review forbids:

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

- `docs(open-instrument): update zheji segmentation contrast matrix with study002 direct evidence`

That update should:

- change `.002` from report-backed to direct-artifact-backed where appropriate
- preserve the v0.1 repair-predecessor note
- preserve the v0.2 repaired traceability note
- keep `.003` as stable clean reinforced baseline
- keep `.004` as clean fine-grained hard-case
- preserve all anti-overclaim boundaries

## Final decision

The direct `.002` JSON evidence review is accepted.

The `.002 / STU + DI` lane is no longer merely report-backed after this review.

It is direct-artifact-backed with an important repair history:

- v0.1 contains or may contain the known `study.segment,002` drift.
- v0.2 is the relevant repaired direct artifact if the inspection confirms exact segmentationId survival.

Clean structure remains schema/traceability evidence, not candidate-truth evidence.

No model call is authorized by this review.

No rerun is authorized by this review.
