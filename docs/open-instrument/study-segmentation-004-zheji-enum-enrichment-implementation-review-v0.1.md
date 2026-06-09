# Study Segmentation 004 Zheji Enum/Enrichment Implementation Review v0.1

## Purpose

This document reviews the merged PR #1245 implementation before any `.004` rerun.

It confirms whether the prompt/helper/test hardening from PR #1245 matches the design from PR #1244.

It does not run a model.

It does not create an artifact.

It does not modify prompts.

It does not modify validators.

It does not change provider defaults.

It does not rerun `.004`.

## Reviewed PR

PR #1245:

- `feat(open-instrument): harden zheji study004 enum and enrichment prompt`

Merge SHA:

- `a98d800`

Changed files:

- `src/shared/openInstrument/brainCandidateSearchPrompt.v0.1.ts`
- `src/shared/openInstrument/zhejiStudy003ReplayRunner.v0.1.ts`
- `src/shared/openInstrument/zhejiTransparencyPrompt.v0.1.ts`
- `tests/openInstrument.zhejiStudy003ReplayRunner.guard.spec.ts`
- `tests/openInstrument.zhejiTransparencyPrompt.guard.spec.ts`

## Design source

PR #1244:

- `docs(open-instrument): design zheji study004 enum and enrichment hardening`

Design SHA:

- `e0105b6`

## Review result

PR #1245 implementation is accepted as matching the PR #1244 design.

The implementation is prompt/helper/test hardening only.

No model call was made.

No artifact was created.

No validator was weakened.

No schema field was added.

No provider default was changed.

## Confirmed hardening

The merged implementation confirms:

- `nullCandidates[].candidateType` must be exactly `null_candidate`
- `opaque` must not be used as `nullCandidates[].candidateType`
- `null_candidate` means no candidate was found for the chunk
- `opaque` means a non-null candidate exists but cannot clearly motivate function
- `semanticTransparency.level` must be one of `atomic`, `metaphorical`, `opaque`
- uncertain non-null candidates fall back to `opaque`
- `semanticTransparency.level` must not be empty or null
- Brain must not return `transparencyContrast`
- Brain must not return `transparencyContrastNote`

## Framing confirmed

The merged prompt language confirms:

- Open Instrument is not an etymology task
- Open Instrument finds meaning/function motivation, not origin
- the Brain should not find origin
- the Brain should not choose a winner
- candidates are assessed through smallest meaningful units
- functional identity card language is present
- free operator language is present
- Code F and Code E language is present

## Scope confirmed

The PR stayed inside the intended implementation scope:

- prompt/helper/test hardening only
- no model call
- no artifact creation
- no runtime/API/UI wiring
- no provider default change
- no validator weakening
- no new schema fields
- no `polarInversion` field
- no vector-conservation schema
- no `.004` rerun
- no OpenAI API use

## Remaining boundary

This review does not itself approve publication framing.

This review does not prove `.004` will now pass.

This review only confirms that the implementation is ready for one controlled `.004` preflight and then one controlled `.004` local model call in a separate artifact PR.

## Next allowed action

After this review PR is merged, the next allowed action is a `.004` rerun preflight.

That preflight must confirm:

- local `llama3.1:8b` is available
- provider path is `openai_compat`
- provider default remains `mock`
- prompt includes `null_candidate` enum pressure
- prompt blocks `opaque` as `nullCandidates[].candidateType`
- prompt includes semantic transparency fallback to `opaque`
- prompt includes Open Instrument meaning-motivation framing
- top-level `chunkCandidates`, `nullCandidates`, `warnings`, and `claimBoundary` remain required
- top-level `candidates` remains forbidden
- Brain remains forbidden from returning `transparencyContrast`
- Brain remains forbidden from returning `transparencyContrastNote`

## Claim boundary

This review is development-only.

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

PR #1245 implementation is accepted.

Next step after this review lands:

- `.004` rerun preflight

No `.004` model call before that preflight is clean.
