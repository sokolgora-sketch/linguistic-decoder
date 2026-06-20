# `limit` Generalization Replay Authorization v0.1

Status: LIMIT_GENERALIZATION_REPLAY_AUTHORIZATION_DEFINED.

Project lane: Open Instrument / ZËRO.

Authorization date: 2026-06-21.

Authorization base:

* Short SHA: `4c26f73a`
* Full SHA: `4c26f73a750cad2c141f03d54511474f8766b65f`

Reviewed prerequisites:

* `docs/open-instrument/zheji-generalization-second-word-selection-mixed-heart-extraction-v0.1.md`
* `docs/open-instrument/reviews/zheji-generalization-second-word-selection-mixed-heart-extraction-review-v0.1.md`
* `docs/open-instrument/zheji-generalization-isolation-audit-prompt-hardening-limit-v0.1.md`
* `docs/open-instrument/reviews/zheji-generalization-isolation-audit-prompt-hardening-limit-review-v0.1.md`
* `docs/open-instrument/reviews/zheji-generalization-isolation-audit-prompt-hardening-implementation-limit-review-v0.1.md`

Implementation prerequisites:

* `src/shared/openInstrument/brainCandidateSearchPrompt.v0.1.ts`
* `tests/openInstrument.brainCandidateSearchPrompt.isolationAudit.guard.v0.1.spec.ts`

## Authorization decision

This document defines the authorization packet for a future single-word `limit` generalization replay.

Selected word:

`limit`

Selected stage:

`MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

This authorization document is docs-only.

No replay is executed in this PR.

No provider execution is performed in this PR.

No runtime/API/UI change is performed in this PR.

No model switch is performed in this PR.

The replay execution remains blocked until this authorization packet is reviewed and accepted.

## Replay packet

The future replay packet is limited to:

* one selected word: `limit`
* one selected stage: `MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`
* prompt source containing `<ISOLATION_AUDIT>`
* no prompt edits during execution
* no segmentation edits during execution
* no provider/model switching during execution
* no runtime/API/UI wiring
* no schema mutation
* no validator mutation
* no package metadata mutation
* no CI mutation

## Allowed segmentation hypotheses

The future replay may use only these segmentation hypotheses:

* whole form: `LIMIT`
* coarse chunks: `LI + MIT`
* backup coarse chunks: `LIM + IT`

The future replay must state the chosen segmentation before execution.

The future replay must not tune the prompt to make `limit` succeed.

## Extraction stage

The future replay must use:

`MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

This means:

* written-vowel Heart path is primary
* phonetic sanity check remains active
* spelling/pronunciation traps must be called out
* no claim that the repository is purely orthographic
* no claim that the repository is purely phonetic

## Isolation Audit requirement

The future replay must use the implemented `<ISOLATION_AUDIT>` prompt hardening.

Any candidate described as `atomic` must include:

* isolated standalone form
* plain standalone definition or gloss
* separation between standalone meaning and target-word interpretation

Forbidden as atomic proof:

* metaphor
* symbolic resonance
* target-word convenience

Forbidden claims:

* origin proof
* ownership proof
* publication evidence
* model-quality evidence

## Candidate-output expectations

Candidate output remains hypothesis-only.

Allowed future outcomes:

* credible candidate found
* weak candidate found
* likely false friend
* null candidate
* prompt/model collapse
* extraction-contract failure
* validation failure

The future replay must not crown a winner.

The future replay must preserve candidate uncertainty.

The future replay must preserve null as valid truth.

## Required pre-execution checks for the future replay

Before the future replay can execute, the operator must prove:

* repo is on the reviewed replay-authorization main SHA
* repo is clean
* `<ISOLATION_AUDIT>` exists in `src/shared/openInstrument/brainCandidateSearchPrompt.v0.1.ts`
* `npm test -- tests/openInstrument.brainCandidateSearchPrompt.isolationAudit.guard.v0.1.spec.ts --runInBand` passes
* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs` passes
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand` passes
* `npm run gate:quick` passes
* exact output path is declared
* exact changed-file policy is declared

## Output policy for the future replay

The future replay must write output only to a declared passive artifact path.

The future replay must not modify:

* source files
* tests
* schema files
* validator files
* package files
* CI files
* runtime/API/UI files

The future replay output must be treated as development-only.

## Review requirement after future replay

After the future replay, a separate review PR must classify the result.

Allowed review classifications:

* `GENERALIZATION_SIGNAL_PRESENT`
* `GENERALIZATION_NULL_ACCEPTED`
* `PROMPT_COLLAPSE`
* `MODEL_COLLAPSE`
* `EXTRACTION_CONTRACT_FAILURE`
* `VALIDATION_FAILURE`
* `REPLAY_INVALIDATED`

No result may become publication evidence without a separate future lane.

## Rejection criteria

Reject replay execution if any of these are true:

* prompt hardening is missing
* prompt guard test fails
* Zheji validation fails before replay
* `gate:quick` fails before replay
* repo is dirty
* selected word is not `limit`
* selected stage is not `MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`
* segmentation is not one of the allowed hypotheses
* execution would require prompt tuning
* execution would require source changes
* execution would require schema changes
* execution would require validator changes
* execution would require package metadata changes
* execution would require CI changes
* execution would require runtime/API/UI changes
* execution would require provider or model switching beyond separately reviewed scope

## What remains unauthorized in this PR

This PR does not authorize:

* executing the replay
* provider execution in this PR
* OpenAI execution
* remote endpoint execution
* localhost/Ollama execution
* model switching
* DeepSeek switching
* runtime wiring
* API output changes
* UI output changes
* source behavior changes
* schema changes
* validator changes
* package metadata changes
* CI changes
* evidence packs
* publication framing
* candidate-truth claims
* origin claims
* ownership claims
* model-quality claims
* VoiceLab work

## Validation proof required for review

The review of this authorization packet must run:

* `npm test -- tests/openInstrument.brainCandidateSearchPrompt.isolationAudit.guard.v0.1.spec.ts --runInBand`
* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`
* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

## Hard boundaries

Hard boundaries preserved:

* No replay execution in this PR.
* No provider execution in this PR.
* No runtime/API/UI behavior changes.
* No source behavior changes.
* No schema changes.
* No validator changes.
* No package metadata changes.
* No CI changes.
* No evidence promotion.
* No publication framing.
* No VoiceLab work.

## Current next task

`docs(open-instrument): review limit generalization replay authorization v0.1`
