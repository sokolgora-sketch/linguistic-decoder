# Study Segmentation 004 Zheji Segmentation-Traceability-Hardened Rerun Preflight v0.1

## Purpose

This document records the preflight before one future controlled segmentation-traceability-hardened Zheji `.004 / S + TU + DI` rerun.

No model call is made in this preflight PR.

No replay artifact is created in this preflight PR.

No replay report is created in this preflight PR.

## Prior chain

PR #1255 designed segmentation traceability hardening.

PR #1256 implemented prompt/helper/test hardening.

PR #1257 reviewed and accepted the implementation.

The next allowed action after this preflight lands is one controlled local model call in a separate artifact PR.

## Fixed target

- word: `study`
- segmentationId: `study.segmentation.004`
- chunks: `S + TU + DI`
- word-level voice path: `U → I`
- provider: `openai_compat`
- model: `llama3.1:8b`
- endpoint: `http://localhost:11434/v1/chat/completions`
- provider default: `mock`

## Target output files

Target artifact:

- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-09-study-heart-brain-llama3-1-8b-segmentation-004-zheji-segmentation-traceability-hardened-rerun-v0.1.json`

Target report:

- `docs/open-instrument/study-segmentation-004-zheji-segmentation-traceability-hardened-rerun-result-v0.1.md`

Both files were confirmed absent before this preflight document was created.

## Prompt contract proof

The merged prompt contract now requires:

- every `chunkCandidates[]` object must include `segmentationId`
- every `chunkCandidates[].segmentationId` must exactly equal the Heart input segmentation ID
- every `nullCandidates[]` object must include `segmentationId`
- every `nullCandidates[].segmentationId` must exactly equal the Heart input segmentation ID
- candidate-level `segmentationId` must not be empty
- candidate-level `segmentationId` must not be inferred, shortened, translated, normalized, or invented
- Brain must copy `segmentationId` exactly from Heart-approved input
- missing or mismatched candidate-level `segmentationId` remains structural failure
- Brain remains forbidden from returning `transparencyContrast`
- Brain remains forbidden from returning `transparencyContrastNote`

## Local provider proof

Local provider target:

- Ollama local server
- OpenAI-compatible endpoint: `http://localhost:11434/v1/models`
- required model: `llama3.1:8b`

Preflight confirmed:

- `llama3.1:8b` is present in `ollama list`
- OpenAI-compatible `/v1/models` endpoint responds
- `/v1/models` response includes `llama3.1:8b`

## Checks

Preflight checks completed:

- target artifact absent
- target report absent
- merged prompt contract proof
- local Ollama model availability check
- OpenAI-compatible models endpoint check
- focused Zheji tests
- `npm run build`
- `npm run gate:quick`
- scope checks
- no markdown fence check
- `git diff --check`

## Scope

This PR is docs preflight only.

It does not:

- call a model
- create a replay artifact
- create a replay report
- change prompts
- change validators
- change source implementation
- change runtime/API/UI wiring
- change provider default
- use OpenAI API
- rerun `.004`

## Claim boundary

This preflight does not make any linguistic claim.

It does not claim origin.

It does not claim history.

It does not claim candidate truth.

It does not claim model quality.

It does not claim language superiority.

It is only a readiness check for one future controlled local model call.

## Final preflight decision

The segmentation-traceability-hardened `.004 / S + TU + DI` rerun preflight is clean.

After this preflight PR is reviewed and merged, one controlled local model call may be made in a separate artifact PR.

No model call is made in this preflight PR.
