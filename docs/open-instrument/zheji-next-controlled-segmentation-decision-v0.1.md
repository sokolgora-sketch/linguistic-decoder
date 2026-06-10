# Zheji Next Controlled Segmentation Decision v0.1

## Status

Type: decision record

This document records the next controlled Zheji segmentation decision after PR #1270.

No model call is made.

No rerun is made.

No artifact JSON is created.

No source, runtime, API, UI, prompt, validator, provider, or schema behavior is changed.

## Source design

This decision follows:

- PR #1270: `docs(open-instrument): design zheji next controlled segmentation decision`

Source documents:

- `docs/open-instrument/zheji-next-controlled-segmentation-decision-design-v0.1.md`
- `docs/open-instrument/zheji-segmentation-contrast-interpretation-note-review-v0.1.md`
- `docs/open-instrument/zheji-segmentation-contrast-interpretation-note-v0.1.md`
- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-v0.1.md`
- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-review-v0.1.md`

## Selected option

Selected option:

- Option B — surface directly comparable `.002` JSON evidence

Reason:

- The largest remaining comparison weakness is `.002` evidence parity.
- `.002 / STU + DI` is currently report-backed in the inspected evidence set.
- The project should not run a new model call to solve a documentation-evidence problem.
- The project should first inspect whether directly comparable `.002` JSON evidence already exists in the repository.
- Missing evidence must stay marked as `not available in inspected evidence`.

## Current segmentation lanes

| Lane | Split | Current status |
| --- | --- | --- |
| `study.segmentation.002` | `STU + DI` | report-backed unless direct JSON evidence is surfaced |
| `study.segmentation.003` | `SHTU + DI` | stable clean reinforced baseline |
| `study.segmentation.004` | `S + TU + DI` | clean fine-grained hard-case |

## Direct .002 JSON inspection result

Direct JSON match count:

- `8`

Decision result:

- Direct .002 JSON evidence was surfaced by the repository JSON inspection. The decision records that evidence for review before any rerun or new comparison.

Surfaced direct JSON evidence:


- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.1.json`
  - contains `study.segmentation.002`: true
  - segmentationId hits: `target.segmentationId=study.segmentation.002`, `heart.segmentation.segmentationId=study.segmentation.002`, `heart.inputJson.segmentationId=study.segmentation.002`, `brainPrompt.inputJson.segmentationId=study.segmentation.002`, `parsedBrainOutput.value.segmentationId=study.segmentation.002`, `parsedBrainOutput.value.chunkCandidates.0.segmentationId=study.segmentation.002`, `parsedBrainOutput.value.chunkCandidates.1.segmentationId=study.segmentation.002`, `parsedBrainOutput.value.chunkCandidates.2.segmentationId=study.segment,002`, `parsedBrainOutput.value.chunkCandidates.3.segmentationId=study.segmentation.002`, `parsedBrainOutput.value.nullCandidates.0.segmentationId=study.segmentation.002`, `parsedBrainOutput.value.nullCandidates.1.segmentationId=study.segmentation.002`
  - classification: not available in inspected evidence
  - status: `candidate_structure`
  - structural issue count: not available in inspected evidence
  - enrichment warning count: not available in inspected evidence
  - candidate count: not available in inspected evidence
  - null candidate count: not available in inspected evidence
- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.2.json`
  - contains `study.segmentation.002`: true
  - segmentationId hits: `target.segmentationId=study.segmentation.002`, `comparison.previous002.segmentationId=study.segmentation.002`, `heart.segmentation.segmentationId=study.segmentation.002`, `heart.inputJson.segmentationId=study.segmentation.002`, `brainPrompt.inputJson.segmentationId=study.segmentation.002`, `parsedBrainOutput.value.segmentationId=study.segmentation.002`, `parsedBrainOutput.value.chunkCandidates.0.segmentationId=study.segmentation.002`, `parsedBrainOutput.value.chunkCandidates.1.segmentationId=study.segmentation.002`, `parsedBrainOutput.value.nullCandidates.0.segmentationId=study.segmentation.002`, `parsedBrainOutput.value.nullCandidates.1.segmentationId=study.segmentation.002`
  - classification: not available in inspected evidence
  - status: `candidate_structure`
  - structural issue count: not available in inspected evidence
  - enrichment warning count: not available in inspected evidence
  - candidate count: not available in inspected evidence
  - null candidate count: not available in inspected evidence
- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-004-v0.1.json`
  - contains `study.segmentation.002`: true
  - segmentationId hits: `comparison.baseline002.segmentationId=study.segmentation.002`
  - classification: not available in inspected evidence
  - status: `candidate_structure`
  - structural issue count: not available in inspected evidence
  - enrichment warning count: not available in inspected evidence
  - candidate count: not available in inspected evidence
  - null candidate count: not available in inspected evidence
- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-05-study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-v0.1.json`
  - contains `study.segmentation.002`: true
  - segmentationId hits: `comparison.baseline002.segmentationId=study.segmentation.002`
  - classification: not available in inspected evidence
  - status: `candidate_structure`
  - structural issue count: not available in inspected evidence
  - enrichment warning count: not available in inspected evidence
  - candidate count: not available in inspected evidence
  - null candidate count: not available in inspected evidence
- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-05-study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-v0.2.json`
  - contains `study.segmentation.002`: true
  - segmentationId hits: `comparison.baseline002.segmentationId=study.segmentation.002`
  - classification: not available in inspected evidence
  - status: `candidate_structure`
  - structural issue count: not available in inspected evidence
  - enrichment warning count: not available in inspected evidence
  - candidate count: not available in inspected evidence
  - null candidate count: not available in inspected evidence
- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-05-study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-v0.3.json`
  - contains `study.segmentation.002`: true
  - segmentationId hits: `comparison.baseline002.segmentationId=study.segmentation.002`
  - classification: not available in inspected evidence
  - status: `candidate_structure`
  - structural issue count: not available in inspected evidence
  - enrichment warning count: not available in inspected evidence
  - candidate count: not available in inspected evidence
  - null candidate count: not available in inspected evidence
- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-05-study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-v0.4.json`
  - contains `study.segmentation.002`: true
  - segmentationId hits: `comparison.baseline002.segmentationId=study.segmentation.002`
  - classification: not available in inspected evidence
  - status: `candidate_structure`
  - structural issue count: not available in inspected evidence
  - enrichment warning count: not available in inspected evidence
  - candidate count: not available in inspected evidence
  - null candidate count: not available in inspected evidence
- `docs/open-instrument/artifacts/model-capture-failure/2026-06-05-study-segmentation-004-ollama-qwen3-8b-reduced-language-timeout-v0.1.json`
  - contains `study.segmentation.002`: true
  - segmentationId hits: `comparison.baseline002.segmentationId=study.segmentation.002`
  - classification: not available in inspected evidence
  - status: not available in inspected evidence
  - structural issue count: not available in inspected evidence
  - enrichment warning count: not available in inspected evidence
  - candidate count: not available in inspected evidence
  - null candidate count: not available in inspected evidence

## Related .002 repository evidence

Related repository evidence found by text search:

- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.1.json`
- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.2.json`
- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-004-v0.1.json`
- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-05-study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-v0.1.json`
- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-05-study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-v0.2.json`
- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-05-study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-v0.3.json`
- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-05-study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-v0.4.json`
- `docs/open-instrument/artifacts/model-capture-failure/2026-06-05-study-segmentation-004-ollama-qwen3-8b-reduced-language-timeout-v0.1.json`
- `docs/open-instrument/heart-brain-candidate-search-protocol-v0.1.md`
- `docs/open-instrument/heart-chunk-segmentation-policy-v0.1.md`
- `docs/open-instrument/model-capture-failure-artifact-design-v0.1.md`
- `docs/open-instrument/study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-result-v0.1.md`
- `docs/open-instrument/study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-result-v0.2.md`
- `docs/open-instrument/study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-result-v0.3.md`
- `docs/open-instrument/study-heart-brain-milestone-summary-v0.1.md`
- `docs/open-instrument/study-heart-brain-prototype-review-v0.1.md`
- `docs/open-instrument/study-heart-brain-qwen3-8b-segmentation-002-result-v0.1.md`
- `docs/open-instrument/study-heart-brain-qwen3-8b-segmentation-002-result-v0.2.md`
- `docs/open-instrument/study-heart-brain-qwen3-8b-segmentation-004-result-v0.1.md`
- `docs/open-instrument/study-segmentation-002-prototype-failure-review-v0.1.md`
- `docs/open-instrument/study-segmentation-002-v0.2-prototype-review-v0.1.md`
- `docs/open-instrument/study-segmentation-004-capture-timeout-review-v0.1.md`
- `docs/open-instrument/study-segmentation-004-controlled-llama-retry-after-enum-repair-v0.1.md`
- `docs/open-instrument/study-segmentation-004-prototype-failure-review-v0.1.md`
- `docs/open-instrument/study-segmentation-004-qwen3-8b-reduced-language-capture-failure-v0.1.md`
- `docs/open-instrument/study-segmentation-004-reduced-language-llama-result-review-v0.1.md`
- `docs/open-instrument/study-segmentation-004-reduced-language-llama-v0.2-result-review-v0.1.md`
- `docs/open-instrument/study-segmentation-004-reduced-language-llama-v0.3-result-review-v0.1.md`
- `docs/open-instrument/study-segmentation-004-reduced-language-llama-v0.4-result-review-v0.1.md`
- `docs/open-instrument/study-segmentation-004-reduced-language-timeout-review-v0.1.md`
- `docs/open-instrument/study-segmentation-004-zheji-segmentation-traceability-hardened-rerun-review-v0.1.md`
- `docs/open-instrument/study-segmentation-prototype-comparison-v0.1.md`
- `docs/open-instrument/study002-study003-study004-zheji-segmentation-comparison-design-v0.1.md`
- `docs/open-instrument/study002-study003-study004-zheji-segmentation-comparison-review-v0.1.md`
- `docs/open-instrument/study002-study003-study004-zheji-segmentation-comparison-v0.1.md`
- `docs/open-instrument/zheji-next-controlled-segmentation-decision-design-v0.1.md`
- `docs/open-instrument/zheji-segmentation-contrast-interpretation-note-design-v0.1.md`
- `docs/open-instrument/zheji-segmentation-contrast-interpretation-note-review-v0.1.md`
- `docs/open-instrument/zheji-segmentation-contrast-interpretation-note-v0.1.md`
- `docs/open-instrument/zheji-segmentation-contrast-matrix-design-v0.1.md`
- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-review-v0.1.md`
- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-v0.1.md`

## Interpretation

The selected option does not change the accepted interpretation boundary.

Accepted interpretation remains:

- `.002 / STU + DI` remains report-backed unless directly comparable JSON evidence is surfaced and reviewed.
- `.003 / SHTU + DI` remains the stable clean reinforced baseline.
- `.004 / S + TU + DI` remains the clean fine-grained hard-case.
- `.004` higher null pressure is diagnostic stress, not failure.
- `.004` higher traceability pressure is diagnostic stress, not failure.
- Clean structure remains schema/traceability evidence, not candidate-truth evidence.
- Null candidates are not automatic failures.
- Finer segmentation is not automatically truer.
- Lower null pressure is not automatic superiority.

## Rejected options for this decision

### Option A — pause the segmentation lane

Rejected for now.

Reason:

- There is one small evidence-parity question still worth resolving before pausing.

### Option C — design a new controlled segmentation comparison

Rejected for now.

Reason:

- No new segmentation hypothesis has been selected.
- Existing `.002` evidence parity should be inspected first.

### Option D — create a non-model documentation summary

Deferred.

Reason:

- A summary may be useful later, but the immediate decision is evidence parity.

### Option E — defer all reruns and switch lanes

Rejected for now.

Reason:

- The lane is close to a clean documentation stopping point, but the `.002` evidence-status question should be recorded first.

## Boundary

This decision forbids:

- model call
- rerun
- artifact JSON creation
- prompt change
- validator change
- schema change
- source implementation
- runtime/API/UI wiring
- provider default change
- OpenAI API use
- origin claim
- historical proof claim
- winner claim
- candidate-truth claim
- language superiority claim
- model-quality proof
- publication framing

## Allowed next action

Allowed next action:

- Review the surfaced .002 JSON evidence before changing the comparison status.

If direct `.002` JSON evidence was surfaced, the next PR must be docs-only review of that surfaced evidence.

If no direct `.002` JSON evidence was surfaced, the next PR must be docs-only review accepting that `.002` remains report-backed in the current inspected evidence set.

## Forbidden next action

The next action must not be:

- model call
- rerun
- new artifact capture
- prompt change
- validator change
- source implementation
- provider default change
- publication framing

## Final decision

The next controlled Zheji segmentation decision selects Option B.

The project should resolve the `.002` evidence-status question from repository evidence only.

Clean structure remains schema/traceability evidence, not candidate-truth evidence.

No model call is authorized by this decision.

No rerun is authorized by this decision.
