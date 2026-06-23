# Functional Embryo Attestation and Non-Circularity Repair Definition Review v0.1

Status: FUNCTIONAL_EMBRYO_ATTESTATION_NONCIRCULARITY_REPAIR_DEFINITION_REVIEWED_ACCEPTED_WITH_PROMPT_DELIVERY_IMPLEMENTATION_REQUIRED.

Review date: 2026-06-23.

Reviewed base:

* Short SHA: `b1d6e36f`
* Full SHA: `b1d6e36fa3c1fe6c1d31428774f4bfad30ddc986`
* Subject: `docs(open-instrument): define functional embryo attestation and non-circularity repair after partial invalidated replay v0.1`

Reviewed repair definition:

* `docs/open-instrument/zheji-generalization-functional-embryo-attestation-noncircularity-repair-after-partial-invalidated-replay-v0.1.md`

Prior result review:

* `docs/open-instrument/reviews/zheji-generalization-layer2-target-grid-functional-motivation-replay-result-review-v0.1.md`

Prior artifact:

* Path: `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`
* SHA-256: `3cef1eea4aeb79ead7aa7d0977e26d53ea9fcff3a2d45d1aab6a34288f9072b8`
* Classification: `TARGET_GRID_PARTIAL_INVALIDATED`

## Review decision

The repair definition is accepted.

The repair definition correctly requires:

* attested standalone embryo form
* rejection of reasonably inferred only
* non-circular functional gloss checks
* mandatory response envelope
* mandatory `nullAccepted`
* mandatory `claimBoundary`
* no rerun before implementation and review

However, the implementation task must not only add fields.

The implementation task must prove the audit instructions are present in the actual prompt sent by each runner.

## Critical prompt-delivery finding

The shared prompt file contains the `<ISOLATION_AUDIT>` block:

* `src/shared/openInstrument/brainCandidateSearchPrompt.v0.1.ts`

But the single-call runner currently builds its own prompt locally:

* `scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs`

The shared prompt file is referenced as a path/string dependency, not imported as the prompt builder used for execution.

Therefore a guard test that only checks the shared prompt file is insufficient.

A future implementation must test the actual built prompt string used by the execution runner.

## Layer 2 prompt-completeness finding

The prior Layer 2 replay artifact failed structurally before semantic content could be trusted.

The target-grid review recorded missing or invalid:

* `response.word`
* `response.stage`
* `response.segmentation`
* `response.chunk`
* `response.candidateLanguage`
* `response.nullAccepted`
* `response.claimBoundary`
* `response.candidate`
* valid JSON object shape

Therefore the next implementation must repair prompt completeness for Layer 2 as well.

The actual Layer 2 prompt must explicitly require:

* one JSON object only
* no markdown
* exact identity echo: `word`, `stage`, `segmentation`, `chunk`, `candidateLanguage`
* mandatory `nullAccepted`
* mandatory `claimBoundary`
* mandatory candidate/null shape
* mandatory attestation fields for non-null candidates
* null if attested standalone form is unavailable

## Required actual-prompt guard tests

The next implementation must add tests that inspect the prompt actually sent to the model.

These tests must not merely grep an adjacent shared file.

Required assertions for the actual single-call prompt:

* contains `<ISOLATION_AUDIT>`
* contains `attested_standalone_form`
* contains rejection of `reasonably_inferred`
* contains `claimBoundary`
* contains `nullAccepted`
* contains candidate/null shape
* contains chunk/language requirements
* contains non-circularity instruction

Required assertions for the actual Layer 2 target-grid prompt:

* contains exact target identity fields
* contains `word`
* contains `stage`
* contains `segmentation`
* contains `chunk`
* contains `candidateLanguage`
* contains `nullAccepted`
* contains `claimBoundary`
* contains `attestationStatus`
* contains `attested_standalone_form`
* contains rejection of `reasonably_inferred`
* contains no-origin/no-publication/no-winner boundary

## Required validator repair

The next implementation must enforce mechanically:

* invalid JSON is invalidated
* missing response envelope fields are invalidated
* missing `nullAccepted` is invalidated
* missing `claimBoundary` is invalidated
* non-null candidate missing `attestationStatus` is rejected
* non-null candidate with `attestationStatus != attested_standalone_form` is rejected
* reasonably inferred only is rejected
* missing standalone form is rejected
* missing standalone gloss is rejected
* circular gloss overlap is rejected
* null remains valid

## Carrier-language SSOT finding

The language-list single source of truth is not complete yet.

The single-call path and Layer 2 path currently use separately defined lists.

This must be repaired before comparing single-call and Layer 2 behavior.

The next implementation should either:

* introduce a shared reviewed candidate/carrier language constant, or
* explicitly document why the Layer 2 grid is a reviewed subset while validator allowlist remains broader

Silent mismatch is not acceptable.

## Source-language finding

`sourceLanguageForRequest()` currently returns `English` for current inputs.

That is acceptable for `comic`, but unsafe for future non-English inputs.

The future implementation should prepare for explicit source language, or at minimum document that current execution scope is English-only.

Do not silently reuse English for non-English inputs in later phases.

## Correct milestone effect

Phase 0 is not closed until:

* actual prompt delivery is tested
* actual Layer 2 prompt completeness is tested
* attestation status is validator-enforced
* non-circularity remains validator-enforced
* no rerun is performed before review

The current result remains useful as a plumbing diagnostic.

The current result is not a functional motivation result.

## Boundary

This review changes docs only.

This review does not execute the model.

This review does not call a provider.

This review does not mutate the artifact.

This review does not change runtime/API/UI behavior.

This review does not change schema/package/CI.

This review does not authorize a rerun.

This review does not promote evidence.

This review does not frame output as publication evidence.

This review does not crown a winner.

## Next accepted task

`test(open-instrument): implement functional embryo prompt-delivery attestation and non-circularity repair v0.1`
