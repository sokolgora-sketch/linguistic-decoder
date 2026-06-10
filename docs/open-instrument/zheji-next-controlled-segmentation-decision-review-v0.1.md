# Zheji Next Controlled Segmentation Decision Review v0.1

## Status

Type: decision review

This document reviews PR #1271:

- `docs(open-instrument): record zheji next controlled segmentation decision`

No model call is made.

No rerun is made.

No artifact JSON is created.

No source, runtime, API, UI, prompt, validator, provider, or schema behavior is changed.

## Reviewed source

Reviewed decision record:

- `docs/open-instrument/zheji-next-controlled-segmentation-decision-v0.1.md`

Decision design:

- `docs/open-instrument/zheji-next-controlled-segmentation-decision-design-v0.1.md`

## Review decision

The PR #1271 decision record is accepted.

The selected option was correct:

- Option B — surface directly comparable `.002` JSON evidence

Reason:

- The project needed to resolve whether `.002 / STU + DI` was only report-backed or whether direct JSON evidence existed.
- A model call would have been the wrong response to an evidence-indexing question.
- The decision preserved documentation-first discipline.
- The decision did not authorize reruns, new artifacts, provider-default changes, source changes, or publication framing.

## Direct .002 JSON artifact review

Direct .002 JSON artifact count: 2

- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.1.json`
  - parse: ok
  - classification: not available in inspected evidence
  - status: `candidate_structure`
  - structural issue count: not available in inspected evidence
  - enrichment warning count: not available in inspected evidence
  - candidate count: not available in inspected evidence
  - null candidate count: not available in inspected evidence
  - exact segmentationId hit count: `10`
  - non-exact segmentationId hits:
    - `comparisonBaseline.segmentationId` = `study.segmentation.003`
    - `brainPrompt.requiredOutputSchema.segmentationId` = `string`
    - `brainPrompt.requiredOutputSchema.chunkCandidates.0.segmentationId` = `string`
    - `brainPrompt.requiredOutputSchema.nullCandidates.0.segmentationId` = `string`
    - `parsedBrainOutput.value.chunkCandidates.2.segmentationId` = `study.segment,002`
- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.2.json`
  - parse: ok
  - classification: not available in inspected evidence
  - status: `candidate_structure`
  - structural issue count: not available in inspected evidence
  - enrichment warning count: not available in inspected evidence
  - candidate count: not available in inspected evidence
  - null candidate count: not available in inspected evidence
  - exact segmentationId hit count: `10`
  - non-exact segmentationId hits:
    - `comparison.baseline003.segmentationId` = `study.segmentation.003`
    - `brainPrompt.requiredOutputSchema.segmentationId` = `string`
    - `brainPrompt.requiredOutputSchema.chunkCandidates.0.segmentationId` = `string`
    - `brainPrompt.requiredOutputSchema.nullCandidates.0.segmentationId` = `string`

## Indirect .002 reference review

Indirect or related .002 references found by repository text search:

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
- `docs/open-instrument/zheji-next-controlled-segmentation-decision-v0.1.md`
- `docs/open-instrument/zheji-segmentation-contrast-interpretation-note-design-v0.1.md`
- `docs/open-instrument/zheji-segmentation-contrast-interpretation-note-review-v0.1.md`
- `docs/open-instrument/zheji-segmentation-contrast-interpretation-note-v0.1.md`
- `docs/open-instrument/zheji-segmentation-contrast-matrix-design-v0.1.md`
- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-review-v0.1.md`
- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-v0.1.md`

## Important evidence distinction

The PR #1271 direct JSON match count is useful, but it must not be read naively.

The review separates:

1. Direct `.002` artifacts.
2. Indirect `.002` references inside later `.004` artifacts or comparison fields.
3. Existing known bad candidate-level segmentation ID drift in the `.002` v0.1 lane.

The known drift is:

- `study.segment,002`

That value is not equal to:

- `study.segmentation.002`

Therefore `.002` must not be promoted to clean parity just because direct JSON evidence exists.

## Current lane status after review

| Lane | Split | Status after this review |
| --- | --- | --- |
| `study.segmentation.002` | `STU + DI` | direct JSON evidence exists, but requires artifact-specific review before parity claims |
| `study.segmentation.003` | `SHTU + DI` | stable clean reinforced baseline |
| `study.segmentation.004` | `S + TU + DI` | clean fine-grained hard-case |

## Accepted findings

The review accepts these findings:

- Direct `.002` JSON artifacts exist.
- Indirect `.002` baseline/comparison references also exist.
- The direct and indirect evidence categories must stay separated.
- `.002` v0.1 includes at least one non-exact candidate-level segmentation ID.
- `.002` cannot be described as clean parity until v0.1 and v0.2 are reviewed directly.
- `.003 / SHTU + DI` remains the stable clean reinforced baseline.
- `.004 / S + TU + DI` remains the clean fine-grained hard-case.
- Clean structure remains schema/traceability evidence, not candidate-truth evidence.

## Rejected claims

This review rejects these claims:

- Direct `.002` JSON existence proves `.002` clean parity.
- Direct `.002` JSON existence proves `.002` is better than `.003` or `.004`.
- Lower null pressure means superiority.
- Finer segmentation means truth.
- Clean schema behavior means candidate truth.
- Any segmentation lane proves origin.
- Any segmentation lane is the winner.

## Boundary

This review forbids:

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
- publication framing
- origin claim
- historical proof claim
- winner claim
- candidate-truth claim
- language superiority claim
- model-quality proof

## Next required step

The next PR should be docs-only:

- `docs(open-instrument): review zheji study002 direct json evidence`

That PR should review the direct `.002` artifacts specifically:

- `2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.1.json`
- `2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.2.json`

It must determine:

- whether v0.1 is a structural failure, structural warning, or repair predecessor
- whether v0.2 is structurally clean
- whether v0.2 repairs the `study.segment,002` drift
- whether `.002` can move from report-backed to direct-artifact-backed
- whether `.002` can be compared cleanly against `.003` and `.004`

## Forbidden next step

The next step must not be:

- model call
- rerun
- new artifact capture
- prompt change
- validator change
- source implementation
- provider default change
- publication framing

## Final decision

The PR #1271 next controlled segmentation decision is accepted.

Option B was the correct controlled decision.

Direct `.002` JSON evidence exists, but it requires direct artifact review before any parity claim.

Clean structure remains schema/traceability evidence, not candidate-truth evidence.

No model call is authorized by this review.

No rerun is authorized by this review.
