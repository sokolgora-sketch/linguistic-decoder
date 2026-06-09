# Study Segmentation 004 Zheji Candidate-Payload-Hardened Rerun Review v0.1

## Purpose

This document reviews the candidate-payload-hardened Zheji `.004 / S + TU + DI` rerun artifact.

It also records a workflow exception: the artifact was committed directly to `main` instead of being merged through an artifact PR.

This review restores the normal review gate.

No model call is made in this review.

No artifact is created in this review.

No source, runtime, validator, provider, prompt, API, UI, Cohort, eval, or VoiceLab code is changed.

## Workflow exception

The artifact capture was intended to become a separate artifact PR.

Instead, the artifact/report commit was pushed directly to `main`.

Direct main artifact push:

- `c693ae0` short SHA

This is accepted as a one-off workflow exception because:

- the changed files were artifact/report only
- the model call was already completed exactly once
- the artifact JSON parses
- the report exists
- focused Zheji tests passed
- `npm run build` passed
- `npm run gate:quick` passed
- no source/runtime/provider files changed

This exception must not become the workflow norm.

Future artifact captures must return to PR-only discipline.

## Reviewed artifact

Artifact JSON:

- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-09-study-heart-brain-llama3-1-8b-segmentation-004-zheji-candidate-payload-hardened-rerun-v0.1.json`

Report:

- `docs/open-instrument/study-segmentation-004-zheji-candidate-payload-hardened-rerun-result-v0.1.md`

## Fixed input

- word: `study`
- segmentationId: `study.segmentation.004`
- chunks: `S + TU + DI`
- word-level voice path: `U → I`
- provider: `openai_compat`
- model: `llama3.1:8b`
- endpoint: `http://localhost:11434/v1/chat/completions`
- provider default: `mock`

## Artifact result

Classification:

- `ZHEJI_STUDY004_CANDIDATE_PAYLOAD_HARDENED_STRUCTURAL_FAILURE`

Status:

- `captured_with_issues`

Execution:

- model call made: `true`
- attempt count: `1`
- provider HTTP status: `200`
- OpenAI API used: `false`
- provider default changed: `false`

Validation:

- raw parse ok: `true`
- forbidden raw field found: `false`
- structural ok: `false`
- structural issue count: `6`
- enrichment ok: `true`
- enrichment warning count: `0`
- valid transparency candidate count: `3`
- missing transparency count: `0`

## What improved

The reinforced top-level Brain skeleton survived:

- `chunkCandidates` present
- `nullCandidates` present
- `warnings` present
- `claimBoundary` present
- top-level `candidates` absent
- raw Brain `transparencyContrast` absent
- raw Brain `transparencyContrastNote` absent

Candidate payload hardening improved the previous failure:

- `language` present
- `candidateForm` present
- `meaning` present
- `sourceNote` present
- enrichment warning count stayed `0`
- valid transparency candidate count was `3`

## Active failure

The new active structural failure is candidate-level segmentation traceability.

The six structural issues were:

- `chunkCandidates.0.segmentationId` empty
- `chunkCandidates.0.segmentationId` mismatched
- `chunkCandidates.1.segmentationId` empty
- `chunkCandidates.1.segmentationId` mismatched
- `chunkCandidates.2.segmentationId` empty
- `chunkCandidates.2.segmentationId` mismatched

The failure is narrower than the previous candidate payload failure.

The model filled candidate identity fields, but did not preserve candidate-level `segmentationId`.

## Interpretation

This is a useful diagnostic structural failure.

The `.004 / S + TU + DI` hard-case split still pressures the local model.

The previous payload-completion weakness improved.

The next weakness is traceability-field preservation.

The next hardening lane should target candidate-level `segmentationId` preservation, not semantic expansion.

## Gemini note

Gemini’s warning about the “functional identity card” metaphor is valid for future prompt design.

However, it is not the immediate blocker in this captured artifact.

The immediate blocker is mechanical:

- missing candidate-level `segmentationId`

The semantic-transparency design lane should be queued after this traceability hardening lane, unless a later artifact shows semantic metaphor drift as the active validator failure.

## Claim boundary

This artifact remains inside Open Instrument’s meaning/function motivation scope.

It is not an etymology claim.

It does not find origin.

It does not declare a winner.

It does not prove historical derivation.

It does not prove candidate truth.

It does not prove model quality.

It does not claim language superiority.

It does not justify provider default changes.

It records which language candidates can motivate the meaning/function of embryo morphemes through a language's own smallest meaningful units.

## Scope review

This review PR is docs-only.

It does not:

- run a model call
- create a new artifact
- create a new replay report
- change prompts
- change validators
- change runtime/API/UI wiring
- change provider default
- use OpenAI API
- rerun `.004`
- expand languages
- add schema fields
- add `polarInversion`
- add vector-conservation schema

## Next required design

Next PR should be:

`docs(open-instrument): design zheji study004 segmentation traceability hardening`

It should address:

- non-empty `chunkCandidates[].segmentationId`
- exact match to top-level `segmentationId`
- non-empty `nullCandidates[].segmentationId`
- exact match for null candidates
- whether missing candidate-level `segmentationId` remains structural failure
- whether the prompt should repeat segmentationId inside every candidate instruction
- whether the output skeleton should show every chunk candidate with explicit `segmentationId`
- preserving current no-origin/no-winner boundary
- preserving provider default `mock`
- preserving artifact/report-only capture discipline

## Final review outcome

The candidate-payload-hardened `.004 / S + TU + DI` artifact is accepted as a useful diagnostic structural failure.

The candidate payload hardening improved the previous failure.

The next active weakness is candidate-level segmentation traceability.

No rerun before segmentation traceability hardening design, implementation, review, and preflight are complete.
