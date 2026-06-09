# Study Segmentation 004 Zheji Segmentation-Traceability-Hardened Rerun Result v0.1

## Status

Classification: CLEAN_ZHEJI_SEGMENTATION_TRACEABILITY_HARDENED_REPLAY

Status: clean

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
- hardens candidate-level segmentation traceability: `true`

## Validation

- raw parse ok: `true`
- parse extraction: `direct_json`
- forbidden raw field found: `false`
- forbidden raw fields: `none`
- structural ok: `true`
- structural issue count: `0`
- enrichment ok: `true`
- enrichment warning count: `0`
- valid transparency candidate count: `3`
- missing transparency count: `0`

## Structural issue preview

- none

## Enrichment warning preview

- none

## Raw Brain key inspection

- top-level candidates absent: `true`
- chunkCandidates present: `true`
- nullCandidates present: `true`
- warnings present: `true`
- claimBoundary present: `true`
- raw Brain transparencyContrast absent: `true`
- raw Brain transparencyContrastNote absent: `true`

## Claim boundary

This result is limited to semantic/function motivation inspection.

It does not declare winner, history, origin, language superiority, or candidate truth.

## Next action

Review this segmentation-traceability-hardened `.004` artifact in a separate review PR before any repeat, expansion, or publication framing.
