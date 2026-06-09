# Study Segmentation 004 Zheji Enum-Hardened Rerun Result v0.1

## Status

Classification: ZHEJI_STUDY004_ENUM_HARDENED_STRUCTURAL_FAILURE

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

## Enum/enrichment hardening

- nullCandidates candidateType must be `null_candidate`
- `opaque` is blocked as nullCandidates candidateType
- `opaque` is allowed only as non-null semantic transparency fallback
- semanticTransparency.level allowed values: `atomic`, `metaphorical`, `opaque`
- Open Instrument framing: meaning/function motivation, not origin

## Validation

- raw parse ok: `true`
- parse extraction: `direct_json`
- forbidden raw field found: `false`
- forbidden raw fields: `none`
- structural ok: `false`
- structural issue count: `14`
- enrichment ok: `true`
- enrichment warning count: `0`
- valid transparency candidate count: `3`
- missing transparency count: `0`

## Structural issue preview

- MISSING_LANGUAGE at chunkCandidates.0.language: language must be a non-empty string.
- MISSING_CANDIDATE_FORM at chunkCandidates.0.candidateForm: candidateForm must be a non-empty string.
- MISSING_MEANING at chunkCandidates.0.meaning: meaning must be a non-empty string.
- MISSING_SOURCE_NOTE at chunkCandidates.0.sourceNote: sourceNote must be a non-empty string.
- MISSING_LANGUAGE at chunkCandidates.1.language: language must be a non-empty string.
- MISSING_CANDIDATE_FORM at chunkCandidates.1.candidateForm: candidateForm must be a non-empty string.
- MISSING_MEANING at chunkCandidates.1.meaning: meaning must be a non-empty string.
- MISSING_SOURCE_NOTE at chunkCandidates.1.sourceNote: sourceNote must be a non-empty string.
- MISSING_LANGUAGE at chunkCandidates.2.language: language must be a non-empty string.
- MISSING_CANDIDATE_FORM at chunkCandidates.2.candidateForm: candidateForm must be a non-empty string.
- MISSING_MEANING at chunkCandidates.2.meaning: meaning must be a non-empty string.
- MISSING_SOURCE_NOTE at chunkCandidates.2.sourceNote: sourceNote must be a non-empty string.

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

Review this enum-hardened `.004` artifact in a separate review PR before any repeat, expansion, or publication framing.
