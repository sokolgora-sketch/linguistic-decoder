# Functional Embryo Attestation and Non-Circularity Repair After Partial Invalidated Replay v0.1

Status: FUNCTIONAL_EMBRYO_ATTESTATION_NONCIRCULARITY_REPAIR_DEFINED_PENDING_REVIEW.

Definition date: 2026-06-23.

Definition base:

* Short SHA: `c3927f5d`
* Full SHA: `c3927f5dabf67bacd3f6adcbabe16ad4defd92d1`
* Subject: `docs(open-instrument): review Layer 2 target-grid functional motivation replay result v0.1`

Prior result review:

* `docs/open-instrument/reviews/zheji-generalization-layer2-target-grid-functional-motivation-replay-result-review-v0.1.md`

Prior artifact:

* Path: `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`
* SHA-256: `3cef1eea4aeb79ead7aa7d0977e26d53ea9fcff3a2d45d1aab6a34288f9072b8`
* Classification: `TARGET_GRID_PARTIAL_INVALIDATED`

## Purpose

This document defines the repair required after the Layer 2 target-grid functional motivation replay returned `TARGET_GRID_PARTIAL_INVALIDATED`.

The replay artifact remains accepted as an execution record.

The replay result remains not accepted as a functional motivation signal.

No rerun is authorized by this repair definition.

No provider execution is authorized by this repair definition.

No model call is authorized by this repair definition.

## Correct frame

The goal is motivated meaning decomposition.

The goal is to test whether a word can be decomposed into small, attested, functional embryo carriers that motivate the meaning.

The goal is not origin proof.

The goal is not etymology proof.

The goal is not publication evidence.

The goal is not winner-crowning.

The `study` target shape remains valid as a pattern:

* `SHTU` as a small functional carrier
* `DI` as a small functional carrier
* composed meaning-function explanation

But future candidates must not be accepted by backward-fitting glosses.

A pleasing explanation is not enough.

A plausible explanation is not enough.

A reasonably inferred embryo is not enough.

## Root cause summary

The prior execution produced `TARGET_GRID_PARTIAL_INVALIDATED`.

The observed invalidation pattern included:

* invalid JSON object in some target responses
* missing `response.word`
* missing `response.stage`
* missing `response.segmentation`
* missing `response.chunk`
* missing `response.candidateLanguage`
* missing `response.nullAccepted`
* missing `response.claimBoundary`
* missing candidate/null shape
* missing claim-boundary booleans

Therefore the next implementation repair must address both:

* strict output-shape obedience
* stricter functional-embryo acceptance criteria

## Required response contract repair

Every target response must include:

* `word`
* `stage`
* `segmentation`
* `chunk`
* `candidateLanguage`
* `nullAccepted`
* `claimBoundary`
* `candidate`

The target response must echo the reviewed target exactly:

* `word === target.word`
* `stage === target.stage`
* `segmentation === target.segmentation`
* `chunk === target.chunk`
* `candidateLanguage === target.candidateLanguage`

If no valid candidate exists, the response must use:

* `nullAccepted: true`
* `candidate: null`

If a candidate exists, the response must use:

* `nullAccepted: false`
* `candidate: object`

## Required claim boundary

Every response must include `claimBoundary`.

Required values:

* `developmentOnly: true`
* `publicationEvidence: false`
* `originEvidence: false`
* `ownershipEvidence: false`
* `modelQualityEvidence: false`
* `providerOutputCorrectnessEvidence: false`
* `candidateTruthEvidence: false`
* `evidencePromotion: false`
* `winnerCrowned: false`

Missing claim-boundary fields must invalidate the target.

Wrong claim-boundary values must invalidate the target.

## Required non-null candidate shape

Every non-null functional embryo candidate must include:

* `chunk`
* `candidateLanguage`
* `standaloneForm`
* `standaloneFormScript`
* `plainStandaloneGloss`
* `functionalEmbryoGloss`
* `attestationStatus`
* `attestationType`
* `attestationNote`
* `sourceRequirement`
* `wholeWordCircularityCheck`
* `fullWordDefinitionOverlap`
* `composedMeaningFunction`
* `rejectionReasons`

The candidate must echo:

* `candidate.chunk === response.chunk`
* `candidate.candidateLanguage === response.candidateLanguage`

## Attested standalone embryo requirement

Every non-null functional embryo candidate must provide an attested isolated standalone form in the carrier language.

Accepted `attestationStatus`:

* `attested_standalone_form`

Rejected `attestationStatus` values:

* `reasonably_inferred`
* `constructed`
* `reconstructed_only`
* `gloss_only`
* `unattested`
* `unknown`
* missing value

Accepted `attestationType`:

* `lexical_item`
* `particle`
* `morpheme_with_independent_entry`
* `root_with_independent_entry`

Rejected `attestationType`:

* `model_inferred`
* `language_family_handwave`
* `phonetic_similarity_only`
* `semantic_similarity_only`
* `not_supplied`
* missing value

If the carrier language cannot provide an attested standalone form, the target must return null.

## Source requirement

Every non-null candidate must set:

* `sourceRequirement: attested_standalone_form_required`

A non-null candidate must not set:

* `sourceRequirement: reasonably_inferred_allowed`
* `sourceRequirement: model_inference_allowed`
* `sourceRequirement: optional`

The implementation may not require external network lookup during execution, but the response contract must force the model to distinguish attested standalone forms from inferred glosses.

A later human review may still reject an allegedly attested form.

## Non-circular functional gloss requirement

Every non-null candidate must avoid circularity.

Rejected circularity examples:

* gloss repeats the full word definition
* gloss defines `comic` as comedy-related
* gloss defines `comic` as funny
* gloss defines `comic` as humorous
* gloss defines `comic` as comedian
* gloss defines `comic` as comic strip
* gloss only paraphrases the input word
* gloss is selected only because the final word meaning is already known

Required:

* `plainStandaloneGloss` must stand on its own
* `functionalEmbryoGloss` must be smaller than the whole-word meaning
* `composedMeaningFunction` must be built from embryo functions
* the candidate must not merely restate the dictionary definition of `comic`

## Automated circularity check

The future implementation should add a deterministic circularity check.

Minimum blocked full-word definition tokens for `comic`:

* `comic`
* `comedy`
* `comedian`
* `funny`
* `humorous`
* `humor`
* `amusing`
* `joke`
* `cartoon`
* `strip`
* `laughter`
* `laugh`

A candidate should be rejected if `plainStandaloneGloss` or `functionalEmbryoGloss` overlaps the blocked full-word definition token set above the configured threshold.

Initial threshold:

* reject if overlap ratio is greater than or equal to `0.5`

The threshold is a guardrail, not proof of validity.

Passing the threshold does not make a candidate true.

Failing the threshold invalidates or rejects the candidate.

## Existing checks that must remain

The future implementation must preserve:

* chunk required
* candidate language required
* language allowlist
* candidate chunk must match target chunk
* candidate language must match target candidate language
* whole-word anti-tautology
* candidate form must not equal full input word
* no origin claim
* no evidence promotion
* no publication framing
* no winner-crowning
* null remains valid

## Prompt repair requirement

The future prompt must tell the model:

* return one JSON object only
* no markdown
* no commentary outside JSON
* if uncertain, return null
* reasonably inferred is not accepted
* an attested standalone form is required for non-null
* claimBoundary is mandatory
* nullAccepted is mandatory
* candidate must be object or null
* do not define the chunk using the full word meaning
* do not use `comic`, `comedy`, `funny`, or equivalent as the embryo gloss

## Validator repair requirement

The future validator must:

* reject invalid JSON
* reject missing response envelope fields
* reject missing `nullAccepted`
* reject missing `claimBoundary`
* reject missing candidate/null shape
* reject non-null candidate missing attestation fields
* reject `attestationStatus != attested_standalone_form`
* reject reasonably inferred only
* reject missing standalone form
* reject missing standalone gloss
* reject circular gloss overlap
* preserve null acceptance
* preserve partial invalidation classification when only some targets fail

## No rerun until implementation review

No rerun is authorized by this definition.

The required sequence is:

1. Review this repair definition.
2. Implement the repair in tests/runner/validator/prompt.
3. Review the implementation.
4. Define a new execution authorization if needed.
5. Review that authorization.
6. Execute one controlled replay only if authorized.

## Boundary

This repair definition changes docs only.

This repair definition does not execute the model.

This repair definition does not call a provider.

This repair definition does not mutate the artifact.

This repair definition does not change runtime/API/UI behavior.

This repair definition does not change schema/package/CI.

This repair definition does not promote evidence.

This repair definition does not frame any output as publication evidence.

This repair definition does not crown a winner.

## Next accepted task

`docs(open-instrument): review functional embryo attestation and non-circularity repair definition v0.1`
