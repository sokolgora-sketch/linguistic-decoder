# Zheji Study003 Reinforced Replay Result v0.1

## Status

Classification: CLEAN_ZHEJI_REINFORCED_REPLAY

Status: clean

This is a development artifact for embryo morpheme meaning/function motivation analysis.

It is not external origin/truth evidence.

It is not historical origin proof.

It is not candidate truth proof.

It is not model-quality evidence.

It is not a reason to change provider default from `mock`.

## Fixed input

- word: `study`
- segmentationId: `study.segmentation.003`
- chunks: `SHTU + DI`
- voice path: `U → I`

## Provider

- provider: `openai_compat`
- model: `llama3.1:8b`
- endpoint: `http://localhost:11434/v1/chat/completions`
- model call count: `1`
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
- structural ok: `true`
- structural issue count: `0`
- enrichment ok: `true`
- enrichment warning count: `0`
- valid transparency candidate count: `2`

## Structural issue preview

- none

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

Review this artifact in a separate review PR before running `.004` or expanding scope.
