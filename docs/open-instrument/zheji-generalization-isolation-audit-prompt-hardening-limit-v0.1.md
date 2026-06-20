# Isolation Audit Prompt Hardening for `limit` Generalization v0.1

Status: ISOLATION_AUDIT_PROMPT_HARDENING_DEFINED.

Project lane: Open Instrument / ZËRO.

Definition date: 2026-06-20.

Definition base:

* Short SHA: `1500d6c2`
* Full SHA: `1500d6c2c56bf2b38735751e6316fe4a5412d2f7`

Prerequisite chain:

* `docs/open-instrument/zheji-generalization-verification-extraction-audit-v0.1.md`
* `docs/open-instrument/reviews/zheji-generalization-verification-extraction-audit-design-review-v0.1.md`
* `docs/open-instrument/zheji-generalization-heart-extraction-semantics-audit-v0.1.md`
* `docs/open-instrument/reviews/zheji-generalization-heart-extraction-semantics-audit-review-v0.1.md`
* `docs/open-instrument/zheji-generalization-second-word-selection-mixed-heart-extraction-v0.1.md`
* `docs/open-instrument/reviews/zheji-generalization-second-word-selection-mixed-heart-extraction-review-v0.1.md`

## Definition decision

This document defines the Isolation Audit prompt-hardening requirement for the future `limit` generalization replay.

Selected extraction status:

`EXTRACTION_MIXED`

Selected stage:

`MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`

Selected word:

`limit`

This definition is docs-only.

This definition does not modify prompt source.

This definition does not modify helper source.

This definition does not modify schema.

This definition does not replay Zheji.

This definition does not authorize runtime/API/UI/provider/model-switch work.

## Purpose

The Isolation Audit prevents convenient carrier selection.

Before a candidate can be labeled `atomic`, the model must provide an isolated standalone definition in `sourceNote`.

The goal is to test whether a candidate exists independently, not merely because it helps the `limit` segmentation story.

## Required prompt block

A future implementation PR may add a dry prompt block equivalent to:

```text
<ISOLATION_AUDIT>
Before marking any candidate as atomic, prove the candidate can stand alone outside the target word.

For every candidate marked atomic:
1. sourceNote must include the isolated standalone form.
2. sourceNote must include a plain standalone definition or gloss.
3. sourceNote must distinguish standalone meaning from contextual interpretation inside the target word.
4. sourceNote must not use metaphor, symbolic resonance, or target-word convenience as proof.
5. sourceNote must not claim origin, ownership, publication evidence, or model-quality evidence.

If the isolated standalone definition is unavailable, do not mark the candidate atomic.

Use one of these fallback classifications instead:
- metaphorical
- derived
- opaque
- null

If the candidate is null, include null_reason.
</ISOLATION_AUDIT>
```

## Required behavior

The future prompt-hardening implementation must require:

* `atomic` requires isolated standalone definition.
* `atomic` requires a standalone form separate from the target word.
* `atomic` cannot be justified by resonance language alone.
* `atomic` cannot be justified by the target word's desired decomposition.
* lack of isolated definition must downgrade or null the candidate.
* null candidates must keep `null_reason`.

## `limit`-specific application

For the future `limit` replay, the Isolation Audit must apply to all proposed chunks.

Allowed future segmentation hypotheses remain:

* whole form: `LIMIT`
* coarse chunks: `LI + MIT`
* backup coarse chunks: `LIM + IT`

For any chunk candidate, the model must prove isolated standalone meaning before `atomic`.

Examples of required proof posture:

* `LI` cannot be accepted as atomic unless it has a standalone form and standalone definition.
* `MIT` cannot be accepted as atomic unless it has a standalone form and standalone definition.
* `LIM` cannot be accepted as atomic unless it has a standalone form and standalone definition.
* `IT` cannot be accepted as atomic unless it has a standalone form and standalone definition.
* `LIMIT` whole-form candidates must distinguish attested form from decomposition claim.

These are examples of required posture, not accepted candidates.

## Classification rule

Allowed classifications after Isolation Audit:

| Classification | Requirement |
| --- | --- |
| `atomic` | isolated standalone form and definition present |
| `derived` | plausible derived relation but not standalone atomic |
| `metaphorical` | relation is interpretive and not standalone atomic |
| `opaque` | candidate exists but relation is unclear |
| `null` | no acceptable candidate; must include `null_reason` |

If the current schema cannot represent one of these classifications, the future implementation must either:

* use the closest existing allowed enum without schema change, or
* stop and define a separate schema-change lane before implementation.

No schema change is authorized by this definition.

## Source-note rule

`sourceNote` must stay factual and dry.

Allowed:

* isolated standalone definition
* language/source label
* reason candidate is downgraded
* null refusal reason

Forbidden:

* origin proof
* ownership proof
* publication proof
* model-quality proof
* provider-only proof as strong evidence
* metaphor as atomic proof
* resonance as atomic proof
* target-word convenience as atomic proof

## Validator expectation

The existing passive Zheji validator already rejects missing `sourceNote` in static fixture cases.

A future implementation PR should inspect whether the current validator covers the exact Isolation Audit rule.

If it does not, that implementation PR must remain within its authorized scope and state whether validator changes are required.

This definition does not authorize validator changes.

## Future implementation boundary

A future implementation PR may be proposed only after this definition is reviewed.

That future implementation must state exactly which file is modified.

Expected possible target family:

* prompt text only
* prompt guard test only
* validator test only if review authorizes it

No implementation is authorized here.

## Replay boundary

No replay is authorized by this document.

A future replay requires a separate explicit authorization PR after Isolation Audit hardening is implemented and reviewed.

That future replay PR must state:

* selected word: `limit`
* selected stage: `MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`
* prompt version
* segmentation hypothesis
* validator command
* test command
* output path
* rejection criteria
* rollback plan

## Rejection criteria for future implementation

Reject a future Isolation Audit implementation if it:

* changes runtime behavior without authorization
* changes API output without authorization
* changes UI output without authorization
* changes package metadata
* changes CI
* authorizes provider execution
* authorizes Zheji replay
* switches model
* weakens `sourceNote`
* allows metaphor as atomic proof
* allows target-word convenience as atomic proof
* skips null reasons
* claims candidate truth
* claims origin evidence
* claims ownership evidence
* claims publication evidence

## What remains unauthorized

This definition does not authorize:

* prompt source modification
* helper source modification
* schema modification
* validator modification
* Zheji replay
* provider execution
* OpenAI execution
* remote endpoint execution
* localhost/Ollama execution
* model switching
* DeepSeek switching
* runtime wiring
* API output changes
* UI output changes
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

The review of this definition must run:

* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`
* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

## Hard boundaries

Hard boundaries preserved:

* No provider execution.
* No Zheji replay.
* No runtime/API/UI behavior changes.
* No package metadata changes.
* No CI changes.
* No evidence promotion.
* No publication framing.
* No VoiceLab work.

## Current next task

`docs(open-instrument): review Isolation Audit prompt hardening for limit generalization v0.1`
