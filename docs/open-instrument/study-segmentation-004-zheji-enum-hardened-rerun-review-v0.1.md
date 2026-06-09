# Study Segmentation 004 Zheji Enum-Hardened Rerun Review v0.1

## Purpose

This document reviews the PR #1248 enum-hardened Zheji `.004 / S + TU + DI` rerun artifact.

It is a docs-only review.

It does not rerun the model.

It does not create a new artifact.

It does not change prompts.

It does not change validators.

It does not change provider defaults.

## Reviewed PR

PR #1248:

- `docs(open-instrument): archive zheji study004 enum hardened rerun artifact`

Merge SHA:

- `91c5801`

Reviewed files:

- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-09-study-heart-brain-llama3-1-8b-segmentation-004-zheji-enum-hardened-rerun-v0.1.json`
- `docs/open-instrument/study-segmentation-004-zheji-enum-hardened-rerun-result-v0.1.md`

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

## Result

Classification:

- `ZHEJI_STUDY004_ENUM_HARDENED_STRUCTURAL_FAILURE`

Status:

- `captured_with_issues`

Validation summary:

- raw parse ok: `true`
- forbidden raw field found: `false`
- structural ok: `false`
- structural issue count: `14`
- enrichment ok: `true`
- enrichment warning count: `0`
- valid transparency candidate count: `3`
- missing transparency count: `0`
- candidate count: `3`
- null candidate count: `1`

## What improved

The enum/enrichment hardening worked for the previous failure boundary.

The PR #1242 artifact failed with:

- null-candidate enum pressure
- empty `semanticTransparency.level`
- enrichment warning count above zero

The PR #1248 artifact improved that boundary:

- `semanticTransparency.level` values were present
- enrichment warning count was `0`
- `nullCandidates` existed
- `opaque` was not used as `nullCandidates[].candidateType`
- forbidden top-level `candidates` was absent
- top-level `chunkCandidates` survived
- top-level `nullCandidates` survived
- top-level `warnings` survived
- top-level `claimBoundary` survived

This means PR #1245 hardening had a real positive effect.

## Remaining failure

The new active failure is candidate payload completion pressure.

The non-null `chunkCandidates` entries had valid transparency structure but empty payload fields.

Observed missing payload fields:

- `language`
- `candidateForm`
- `meaning`
- `sourceNote`

This is narrower than the previous failure.

The top-level Brain skeleton did not collapse.

The enum/enrichment layer did not collapse.

The remaining issue is that the model filled the candidate objects structurally but failed to populate required candidate identity/content fields.

## Interpretation

The PR #1248 artifact is accepted as a useful diagnostic structural failure.

It is not a bad run to discard.

It shows progress:

- reinforced Brain skeleton still holds
- enum hardening holds
- transparency level fallback holds
- candidate payload completion remains weak under `.004 / S + TU + DI` pressure

This should be treated as the next engineering boundary.

## Open Instrument framing

This artifact remains inside Open Instrument’s meaning/function motivation scope.

Open Instrument is not an etymology engine.

It does not find origin.

It does not declare a winner.

It records which language candidates can motivate the meaning/function of embryo morphemes through a language's own smallest meaningful units.

## Not evidence for

This artifact is not:

- origin proof
- historical proof
- candidate truth proof
- model-quality proof
- language superiority evidence
- a reason to change provider default from `mock`
- a reason to expand languages
- a reason to switch model
- a reason to publish a claim
- a reason to rerun immediately

## Next required design

The next PR should be:

`docs(open-instrument): design zheji study004 candidate payload completion hardening`

That design should address:

- non-empty `language`
- non-empty `candidateForm`
- non-empty `meaning`
- non-empty `sourceNote`
- whether empty payload fields remain structural failures
- whether null candidates should be used when payload identity cannot be filled
- whether prompt skeleton needs stronger example payloads for each chunk
- whether one candidate per chunk should be required or optional
- how to avoid invented candidates while still requiring non-empty fields
- how to preserve meaning/function motivation framing
- how to keep no-origin/no-winner boundaries
- how to keep provider default `mock`

## Stop rule

No rerun before the candidate payload completion hardening design is reviewed and merged.

No prompt implementation before that design.

No model expansion.

No language expansion.

No publication framing.

## Final review outcome

The PR #1248 enum-hardened `.004 / S + TU + DI` rerun artifact is accepted as a useful diagnostic structural failure.

The previous enum/enrichment issue improved.

The next weakness is candidate payload completion.

The next required action is a design PR for candidate payload completion hardening.

No rerun before that design is reviewed and merged.
