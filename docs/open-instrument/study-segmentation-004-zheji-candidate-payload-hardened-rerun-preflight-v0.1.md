# Study Segmentation 004 Zheji Candidate-Payload-Hardened Rerun Preflight v0.1

## Purpose

This document records the preflight before one future controlled candidate-payload-hardened Zheji `.004 / S + TU + DI` rerun.

It follows PR #1252.

It is a preflight document only.

It does not run the model.

It does not create a replay artifact.

It does not create a replay report.

It does not change prompts.

It does not change validators.

It does not change runtime/API/UI wiring.

It does not change provider defaults.

It does not use OpenAI API.

## Prior chain

- PR #1250 designed candidate payload completion hardening.
- PR #1251 implemented candidate payload prompt hardening.
- PR #1252 reviewed and accepted the implementation.

## Fixed target

- word: `study`
- segmentationId: `study.segmentation.004`
- chunks: `S + TU + DI`
- word-level voice path: `U → I`
- provider: `openai_compat`
- model: `llama3.1:8b`
- endpoint: `http://localhost:11434/v1/chat/completions`
- provider default: `mock`

## Target paths

Future artifact path:

- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-09-study-heart-brain-llama3-1-8b-segmentation-004-zheji-candidate-payload-hardened-rerun-v0.1.json`

Future report path:

- `docs/open-instrument/study-segmentation-004-zheji-candidate-payload-hardened-rerun-result-v0.1.md`

Preflight confirmed both target paths were absent before any future capture.

## Merged prompt contract proof

The merged prompt contract includes candidate payload hardening:

- non-null `chunkCandidates[]` must include non-empty `language`
- non-null `chunkCandidates[]` must include non-empty `candidateForm`
- non-null `chunkCandidates[]` must include non-empty `meaning`
- non-null `chunkCandidates[]` must include non-empty `sourceNote`
- if candidate payload fields cannot be filled honestly, Brain must use `nullCandidates`
- `nullCandidates[].candidateType` must be `null_candidate`
- blank non-null candidates are blocked
- placeholder payload values are blocked
- invented candidates are blocked
- `null_candidate` remains separate from `opaque`
- `opaque` remains a non-null `semanticTransparency.level`
- Brain remains forbidden from returning `transparencyContrast`
- Brain remains forbidden from returning `transparencyContrastNote`

## Forbidden drift proof

Preflight checked for forbidden drift.

Forbidden scope remains blocked:

- no origin verdict
- no winner claim
- no language superiority claim
- no provider default change
- no `polarInversion` schema
- no vector-conservation schema

## Local provider preflight

Local provider availability was checked.

Required model:

- `llama3.1:8b`

Required endpoint:

- `http://localhost:11434/v1/models`

Preflight confirms:

- `llama3.1:8b` is present locally
- OpenAI-compatible `/v1/models` endpoint responds
- models endpoint JSON parses

## Checks

Preflight checks passed:

- target artifact absent
- target report absent
- merged PR #1251 prompt contract present
- forbidden drift proof checked
- local `llama3.1:8b` present
- OpenAI-compatible `/v1/models` endpoint JSON parse passed
- focused Zheji tests passed
- `npm run build` passed
- `npm run gate:quick` passed

## Claim boundary

This remains development evidence for embryo morpheme meaning/function motivation analysis.

It is not origin proof.

It is not historical proof.

It is not candidate truth proof.

It is not model-quality evidence.

It is not language superiority evidence.

It is not a reason to change provider default from `mock`.

It does not declare a winner.

It does not declare origin.

It does not mutate `candidateType`.

## Final decision

The candidate-payload-hardened `.004 / S + TU + DI` rerun preflight is clean.

After this preflight PR is reviewed and merged, one controlled local model call may be made in a separate artifact PR.

No model call is made in this preflight PR.
