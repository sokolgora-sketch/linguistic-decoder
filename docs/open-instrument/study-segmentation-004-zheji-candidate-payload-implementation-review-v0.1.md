# Study Segmentation 004 Zheji Candidate Payload Implementation Review v0.1

## Purpose

This document reviews PR #1251:

`feat(open-instrument): harden zheji study004 candidate payload prompt`

This is a docs-only implementation review.

It does not change prompts.

It does not change validators.

It does not change runtime code.

It does not create artifacts.

It does not run the model.

It does not change provider defaults.

It does not rerun `.004`.

## Reviewed implementation

PR #1251 merged candidate payload completion prompt hardening after PR #1250.

Merge SHA:

- `f3a9159`

Changed files:

- `src/shared/openInstrument/brainCandidateSearchPrompt.v0.1.ts`
- `src/shared/openInstrument/zhejiStudy003ReplayRunner.v0.1.ts`
- `src/shared/openInstrument/zhejiTransparencyPrompt.v0.1.ts`
- `tests/openInstrument.zhejiStudy003ReplayRunner.guard.spec.ts`
- `tests/openInstrument.zhejiTransparencyPrompt.guard.spec.ts`

## Design basis

PR #1250 designed candidate payload completion hardening.

That design required:

- non-null `chunkCandidates` must have non-empty `language`
- non-null `chunkCandidates` must have non-empty `candidateForm`
- non-null `chunkCandidates` must have non-empty `meaning`
- non-null `chunkCandidates` must have non-empty `sourceNote`
- if payload fields cannot be filled honestly, Brain should use `nullCandidates`
- placeholder payload values are forbidden
- invented candidates are forbidden
- `null_candidate` remains separate from `opaque`
- empty payload fields remain structural failures

## Implementation result

PR #1251 matches the design.

It adds prompt/helper pressure requiring non-null `chunkCandidates` to include:

- `language`
- `candidateForm`
- `meaning`
- `sourceNote`

It instructs Brain that if candidate payload fields cannot be filled honestly, it must use `nullCandidates` with:

- `candidateType: null_candidate`

It blocks:

- blank non-null candidates
- placeholder payload values
- invented candidates used only to satisfy required fields

It preserves:

- `null_candidate` as the honest fallback for missing candidate identity/content
- `opaque` as a `semanticTransparency.level` for non-null candidates only
- top-level `chunkCandidates`
- top-level `nullCandidates`
- top-level `warnings`
- top-level `claimBoundary`
- forbidden top-level `candidates`
- forbidden Brain-authored `transparencyContrast`
- forbidden Brain-authored `transparencyContrastNote`

## Scope review

PR #1251 stayed inside the approved implementation scope.

Allowed:

- prompt/helper hardening
- focused guard tests

Not changed:

- validator behavior
- runtime/API/UI wiring
- provider default
- schema fields
- artifact files
- replay reports
- model execution

## Determinism and safety review

The implementation improves deterministic downstream behavior because it narrows ambiguity in non-null candidate payloads.

Before this hardening, the enum-hardened `.004` rerun could produce non-null candidates with valid transparency fields but empty candidate identity/content.

After this hardening, Brain is explicitly told:

- fill required candidate payload fields honestly, or
- use `null_candidate`

This preserves auditability.

It does not encourage invented candidates.

It does not weaken validation.

It does not promote `.004` as stable.

## Open Instrument framing

Open Instrument remains a meaning/function motivation instrument.

It is not an etymology engine.

It does not find origin.

It does not declare a winner.

It does not prove historical derivation.

It records which language candidates can motivate the meaning/function of embryo morphemes through a language's own smallest meaningful units.

The candidate payload fields exist to make that motivation auditable.

## Checks reviewed

The implementation was tested before merge.

Confirmed:

- focused Zheji tests passed: 4 suites / 23 tests
- `npm run build` passed
- `npm run gate:quick` passed
- plan-only runner confirmed no model call
- GitHub checks passed:
  - `lint-test-build`
  - `contracts`
  - `Analyze (actions)`
  - `Analyze (javascript-typescript)`
  - `CodeQL`

## Review decision

PR #1251 implementation is accepted.

Candidate payload prompt hardening is in place.

The next allowed step is a preflight PR for an enum-hardened plus candidate-payload-hardened `.004 / S + TU + DI` rerun.

No model call may happen before that preflight is reviewed and merged.

## Next required action

Create a docs-only preflight PR.

Suggested title:

`docs(open-instrument): preflight zheji study004 candidate payload hardened rerun`

The preflight must confirm:

- target artifact/report paths are absent
- PR #1251 prompt contract is present
- no forbidden drift occurred
- local `llama3.1:8b` is available
- OpenAI-compatible `/v1/models` endpoint responds
- focused Zheji tests pass
- `npm run build` passes
- `npm run gate:quick` passes

## Forbidden next actions

Do not run `.004` yet.

Do not create replay artifacts yet.

Do not create replay reports yet.

Do not change provider default.

Do not change validator behavior.

Do not expand scope.

Do not switch model.

Do not use OpenAI API.

## Final review outcome

The PR #1251 candidate payload prompt hardening implementation is accepted.

The `.004 / S + TU + DI` rerun remains blocked until a clean preflight PR is reviewed and merged.
