# Study Segmentation 004 Zheji Candidate Payload Completion Hardening Design v0.1

## Purpose

This document designs the next hardening step after the PR #1248 enum-hardened `.004 / S + TU + DI` rerun and the PR #1249 review.

It is a design document only.

It does not change prompts.

It does not change validators.

It does not change runtime code.

It does not create an artifact.

It does not run the model.

It does not change provider defaults.

## Reviewed basis

PR #1248 archived the enum-hardened `.004 / S + TU + DI` rerun artifact.

PR #1249 reviewed that artifact.

PR #1249 decision:

- the artifact is accepted as a useful diagnostic structural failure
- enum/enrichment hardening improved the previous failure boundary
- the next active weakness is candidate payload completion
- no rerun before candidate payload completion hardening is designed and reviewed

## Fixed target lane

Future work remains fixed to:

- word: `study`
- segmentationId: `study.segmentation.004`
- chunks: `S + TU + DI`
- word-level voice path: `U → I`
- provider path: `openai_compat`
- local model: `llama3.1:8b`
- provider default: `mock`

## Current failure

The enum-hardened `.004` rerun produced:

- classification: `ZHEJI_STUDY004_ENUM_HARDENED_STRUCTURAL_FAILURE`
- status: `captured_with_issues`
- structural issue count: `14`
- enrichment warning count: `0`
- valid transparency candidate count: `3`
- missing transparency count: `0`

The top-level Brain skeleton survived:

- `chunkCandidates` present
- `nullCandidates` present
- `warnings` present
- `claimBoundary` present
- top-level `candidates` absent

The enum/enrichment hardening worked:

- `semanticTransparency.level` values were present
- enrichment warning count was `0`
- `nullCandidates` existed
- `opaque` was not used as `nullCandidates[].candidateType`

The remaining failure is empty non-null candidate payload fields:

- `language`
- `candidateForm`
- `meaning`
- `sourceNote`

## Design goal

The next hardening must prevent empty non-null candidate payloads without encouraging invented candidates.

The target behavior is:

- If Brain has a credible candidate, it must fill the required payload fields.
- If Brain cannot fill the required payload fields, it must not emit a fake non-null candidate.
- If no credible candidate exists for a chunk, Brain must use `nullCandidates`.
- Empty candidate identity/content fields remain structural failures.

## Required non-null candidate payload fields

Every object in `chunkCandidates` must include non-empty values for:

- `language`
- `candidateForm`
- `meaning`
- `sourceNote`

These fields must not be empty strings.

These fields must not be null.

These fields must not be placeholder strings such as:

- `unknown`
- `n/a`
- `none`
- `tbd`
- `unavailable`
- `not sure`
- `unspecified`

## Field meanings

### language

`language` identifies the candidate language or language-family label used for the candidate.

It must be a human-readable language label or repo-accepted language-family label.

It must not be empty.

It must not be changed only to satisfy validation.

It must not be used as an origin claim.

### candidateForm

`candidateForm` identifies the smallest meaningful candidate form being proposed for the chunk.

It should be the visible or reconstructable form that motivates the chunk.

It must not be empty.

It must not be a generic explanation.

It must not be a full sentence.

### meaning

`meaning` states the candidate’s functional meaning.

It should answer what the candidate form does, not where the whole word came from.

It must not be empty.

It must not claim origin.

It must not declare ownership.

### sourceNote

`sourceNote` explains why the candidate was returned.

It should state the evidence, lexical cue, uncertainty, or false-friend risk.

It must be non-empty even for weak, uncertain, metaphorical, or opaque candidates.

It must make the candidate auditable.

It must not be replaced by only `meaning`, `notes`, `candidateType`, or `evidenceType`.

## Null candidate fallback

If Brain cannot fill all required non-null candidate payload fields for a chunk, it must not emit a blank non-null candidate.

Instead, it should use `nullCandidates`.

A valid `nullCandidates` object must include:

- `chunk`
- `segmentationId`
- `candidateType`
- `nullCandidate`
- `sourceNote`

Rules:

- `candidateType` must be exactly `null_candidate`
- `nullCandidate` must be `true`
- `sourceNote` must explain why no credible candidate was emitted
- `opaque` must not be used as `nullCandidates[].candidateType`

## Non-null candidate versus opaque candidate

`null_candidate` and `opaque` remain separate.

`null_candidate` means:

- no credible candidate was found for the chunk
- candidate identity/content cannot be responsibly filled
- the object belongs in `nullCandidates`

`opaque` means:

- a non-null candidate exists
- the candidate payload fields are filled
- the candidate cannot clearly motivate the function
- the object belongs in `chunkCandidates`
- `semanticTransparency.level` may be `opaque`

The prompt must not conflate these.

## One candidate per chunk

The design should not force one non-null candidate per chunk.

For each chunk, Brain may return either:

- one or more valid non-null candidates in `chunkCandidates`, or
- a valid null candidate in `nullCandidates`

The hard requirement is coverage, not forced non-null invention.

Coverage means every fixed chunk should be represented by at least one of:

- `chunkCandidates[].chunk`
- `nullCandidates[].chunk`

For `.004`, the fixed chunks are:

- `S`
- `TU`
- `DI`

## Anti-invention rule

The next prompt hardening must explicitly say:

- Do not invent a candidate only to avoid `null_candidate`.
- Do not emit a non-null candidate with blank identity fields.
- Do not use generic filler to satisfy required fields.
- Use `null_candidate` when the payload cannot be filled honestly.

This is important because Open Instrument is a meaning/function motivation instrument, not an origin engine.

It must prefer auditable null candidates over invented non-null candidates.

## Prompt hardening requirements

The next implementation PR should update the relevant prompt/helper text to include these rules:

- Every non-null `chunkCandidates[]` object must include non-empty `language`.
- Every non-null `chunkCandidates[]` object must include non-empty `candidateForm`.
- Every non-null `chunkCandidates[]` object must include non-empty `meaning`.
- Every non-null `chunkCandidates[]` object must include non-empty `sourceNote`.
- If any required payload field cannot be filled honestly, emit a `nullCandidates[]` object instead.
- Do not emit blank non-null candidates.
- Do not use placeholder values.
- Do not invent a candidate only to satisfy schema.
- Keep `null_candidate` separate from `opaque`.
- Keep `semanticTransparency.level` as `atomic`, `metaphorical`, or `opaque`.
- Keep Brain forbidden from returning `transparencyContrast` or `transparencyContrastNote`.
- Keep top-level `candidates` forbidden.
- Keep top-level `chunkCandidates`, `nullCandidates`, `warnings`, and `claimBoundary` required.

## Test requirements

The implementation PR must add or update focused guard tests proving:

- prompt text requires non-empty `language`
- prompt text requires non-empty `candidateForm`
- prompt text requires non-empty `meaning`
- prompt text requires non-empty `sourceNote`
- prompt text says to use `null_candidate` if payload cannot be filled honestly
- prompt text blocks blank non-null candidates
- prompt text blocks placeholder payload values
- prompt text blocks invented candidates
- prompt text keeps `null_candidate` separate from `opaque`
- prompt text still forbids top-level `candidates`
- prompt text still forbids `transparencyContrast`
- prompt text still forbids `transparencyContrastNote`

## Validator posture

This design does not weaken the validator.

Empty payload fields should remain structural failures.

The current artifact’s structural failure is useful because it exposed the boundary.

The next implementation should improve Brain obedience, not loosen validation.

## Report interpretation rule

If a future rerun still returns empty non-null payload fields, classify it as structural failure.

If it uses valid null candidates instead of blank non-null candidates, that is not automatically a failure.

A null candidate is acceptable when it is explicit, traceable, and honest.

## Open Instrument framing

Open Instrument is not an etymology engine.

It does not find origin.

It does not declare a winner.

It does not prove historical derivation.

It records which language candidates can motivate the meaning/function of embryo morphemes through a language's own smallest meaningful units.

Candidate payload completion must support that framing.

The payload fields exist to make functional motivation auditable, not to claim origin.

## Forbidden scope

This design does not approve:

- a model rerun
- a repeat run
- a prompt implementation
- a validator change
- a schema expansion
- a provider default change
- an OpenAI API call
- language expansion
- model switching
- publication framing
- origin claims
- winner claims
- language superiority claims

## Next implementation PR

After this design is reviewed and merged, the next PR should be:

`feat(open-instrument): harden zheji study004 candidate payload prompt`

That PR should be implementation-only:

- prompt/helper/test hardening
- no model call
- no artifact creation
- no provider default change
- no validator weakening

## Final design decision

Candidate payload completion hardening is required before any `.004 / S + TU + DI` rerun.

The hardening should prefer honest `null_candidate` records over blank or invented non-null candidates.

The next rerun remains blocked until this design and the follow-up implementation/review/preflight sequence land.
