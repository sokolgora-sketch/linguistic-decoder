# Study Segmentation 004 Zheji Enum-Hardened Rerun Preflight v0.1

## Purpose

This document records the preflight before one future controlled enum-hardened Zheji `.004 / S + TU + DI` rerun.

It follows PR #1246.

It does not call the model.

It does not create a replay artifact.

It does not create a replay report.

It does not modify prompts.

It does not modify validators.

It does not change provider defaults.

## Previous chain

- PR #1242 archived the first `.004 / S + TU + DI` reinforced replay artifact.
- PR #1243 reviewed that replay as a useful diagnostic structural failure.
- PR #1244 designed enum/enrichment hardening.
- PR #1245 implemented prompt/helper/test hardening.
- PR #1246 reviewed and accepted the implementation.

## Fixed future rerun target

- word: `study`
- segmentationId: `study.segmentation.004`
- chunks: `S + TU + DI`
- word-level voice path: `U → I`

## Future provider path

- provider: `openai_compat`
- model: `llama3.1:8b`
- endpoint: `http://localhost:11434/v1/chat/completions`
- OpenAI API use: `false`
- provider default change: `false`

## Future artifact/report paths

Future artifact path:

- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-09-study-heart-brain-llama3-1-8b-segmentation-004-zheji-enum-hardened-rerun-v0.1.json`

Future report path:

- `docs/open-instrument/study-segmentation-004-zheji-enum-hardened-rerun-result-v0.1.md`

Both target paths were confirmed absent before any future capture.

## Merged prompt contract confirmed

The merged prompt contract includes:

- `nullCandidates[].candidateType` must be exactly `null_candidate`
- `opaque` must not be used as `nullCandidates[].candidateType`
- `opaque` is for non-null candidate transparency only
- `semanticTransparency.level` must be one of `atomic`, `metaphorical`, `opaque`
- uncertain non-null candidates must use `opaque`
- `semanticTransparency.level` must not be empty or null
- Open Instrument is meaning/function motivation, not origin/etymology
- functional identity card language is present
- free operator language is present
- Code F and Code E language is present
- Brain remains forbidden from returning `transparencyContrastNote`
- Brain remains forbidden from returning `transparencyContrast`

## Forbidden drift check

The preflight checked for forbidden lane drift:

- no `polarInversion` field
- no vector-conservation schema

## Local provider preflight

The local Ollama provider was checked before any model call.

Required local model:

- `llama3.1:8b`

The OpenAI-compatible models endpoint was checked:

- `http://localhost:11434/v1/models`

This was provider readiness only.

No chat completion call was made.

## Checks

Completed before this document:

- target artifact/report absence check
- merged prompt contract proof
- forbidden drift proof
- local Ollama model availability check
- OpenAI-compatible models endpoint JSON parse
- focused Zheji tests
- `npm run build`
- `npm run gate:quick`

## Claim boundary

This preflight is development-only.

It is not external origin/truth evidence.

It is not historical origin proof.

It is not candidate truth proof.

It is not model-quality evidence.

It is not language superiority evidence.

It is not a reason to change provider default from `mock`.

It does not declare a winner.

It does not declare origin.

It does not mutate `candidateType`.

## Final decision

The enum-hardened `.004 / S + TU + DI` rerun preflight is clean.

After this preflight PR is reviewed and merged, one controlled local model call may be made in a separate artifact PR.

No model call is made in this preflight PR.
