# Study Segmentation 004 Zheji Candidate-Payload-Hardened Rerun Result v0.1

## Status

Classification: ZHEJI_STUDY004_CANDIDATE_PAYLOAD_HARDENED_STRUCTURAL_FAILURE

Status: captured_with_issues

This artifact records which language candidates can motivate the meaning and function of the target word's embryo morphemes.

It does not claim origin, history, or linguistic ownership.

It is not model-quality evidence.

It is not a reason to change provider default from `mock`.

## Fixed input

- word: `study`
- segmentationId: `study.segmentation.004`
- chunks: `S + TU + DI`
- word-level voice path: `U → I`

## Provider

- provider: `openai_compat`
- model: `llama3.1:8b`
- endpoint: `http://localhost:11434/v1/chat/completions`
- model call count: `1`
- provider HTTP status: `200`
- OpenAI API used: `false`
- provider default changed: `false`

## Prompt contract

- forbids top-level candidates: `true`
- forces chunkCandidates: `true`
- forces nullCandidates: `true`
- forces warnings: `true`
- forces claimBoundary: `true`
- hardens candidate payload: `true`

## Validation

- raw parse ok: `true`
- parse extraction: `sliced_json`
- forbidden raw field found: `false`
- forbidden raw fields: `none`
- structural ok: `false`
- structural issue count: `6`
- enrichment ok: `true`
- enrichment warning count: `0`
- valid transparency candidate count: `3`
- missing transparency count: `0`

## Structural issue preview

- EMPTY_CANDIDATE_FIELD at chunkCandidates.0.segmentationId: segmentationId must be non-empty for non-null candidates.
- CANDIDATE_SEGMENTATION_MISMATCH at chunkCandidates.0.segmentationId: Candidate segmentationId mismatch.
- EMPTY_CANDIDATE_FIELD at chunkCandidates.1.segmentationId: segmentationId must be non-empty for non-null candidates.
- CANDIDATE_SEGMENTATION_MISMATCH at chunkCandidates.1.segmentationId: Candidate segmentationId mismatch.
- EMPTY_CANDIDATE_FIELD at chunkCandidates.2.segmentationId: segmentationId must be non-empty for non-null candidates.
- CANDIDATE_SEGMENTATION_MISMATCH at chunkCandidates.2.segmentationId: Candidate segmentationId mismatch.

## Enrichment warning preview

- none

## Derived contrast

Derived contrast is computed after raw parse and validation.

It does not declare a winner.

It does not infer origin.

It does not mutate `candidateType`.

- hasContrast: `true`
- partial: `false`
- unavailable reason: `none`

## Claim boundary

This result is limited to semantic/function motivation inspection.

It does not declare winner, history, origin, language superiority, or candidate truth.

## Next action

Review this candidate-payload-hardened `.004` artifact in a separate review PR before any repeat, expansion, or publication framing.
