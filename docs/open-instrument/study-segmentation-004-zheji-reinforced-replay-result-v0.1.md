# Study Segmentation 004 Zheji Reinforced Replay Result v0.1

## Status

Classification: ZHEJI_STUDY004_REINFORCED_STRUCTURAL_FAILURE

Status: captured_with_issues

This is a development artifact for embryo morpheme meaning/function motivation analysis.

It is not external origin/truth evidence.

It is not historical origin proof.

It is not candidate truth proof.

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

## Reinforced prompt contract

- has STRUCTURAL_CONTRACT: `true`
- has LINGUISTIC_EVALUATION_RULES: `true`
- has OUTPUT_JSON_SKELETON: `true`
- output skeleton at bottom: `true`
- forbids top-level candidates: `true`
- forces chunkCandidates: `true`
- forces nullCandidates: `true`
- forces warnings: `true`
- forces claimBoundary: `true`

## Validation

- raw parse ok: `true`
- parse extraction: `direct_json`
- forbidden raw field found: `false`
- forbidden raw fields: `none`
- structural ok: `false`
- structural issue count: `3`
- enrichment ok: `false`
- enrichment warning count: `3`
- valid transparency candidate count: `0`

## Structural issue preview

- INVALID_NULL_CANDIDATE_TYPE at nullCandidates.0.candidateType: Null candidate candidateType must equal null_candidate.
- INVALID_NULL_CANDIDATE_TYPE at nullCandidates.1.candidateType: Null candidate candidateType must equal null_candidate.
- INVALID_NULL_CANDIDATE_TYPE at nullCandidates.2.candidateType: Null candidate candidateType must equal null_candidate.

## Enrichment warning preview

- INVALID_TRANSPARENCY_LEVEL at chunkCandidates.0.semanticTransparency.level: semanticTransparency.level should be a non-empty string.
- INVALID_TRANSPARENCY_LEVEL at chunkCandidates.1.semanticTransparency.level: semanticTransparency.level should be a non-empty string.
- INVALID_TRANSPARENCY_LEVEL at chunkCandidates.2.semanticTransparency.level: semanticTransparency.level should be a non-empty string.

## Derived contrast

Derived contrast is computed after raw parse and validation.

It does not declare a winner.

It does not infer origin.

It does not mutate `candidateType`.

- hasContrast: `false`
- partial: `true`
- unavailable reason: `no_valid_semantic_transparency`

## Claim boundary

This result is limited to semantic/function motivation inspection.

It does not declare winner, history, origin, language superiority, or candidate truth.

## Next action

Review this `.004` artifact in a separate review PR before any repeat, expansion, or publication framing.
