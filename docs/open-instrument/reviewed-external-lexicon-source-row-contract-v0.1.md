# Reviewed external lexicon source row contract v0.1

Status: REVIEWED_EXTERNAL_LEXICON_SOURCE_ROW_CONTRACT_V0_1_DEFINED_PENDING_REVIEW.

Defined on: 2026-06-28.

## Purpose

This document defines the reviewed external lexicon source row contract for Open Instrument embryo-first source validation.

This contract exists because the validator now exists, but live reviewed source rows and live reviewed citations are not wired yet.

This contract defines the shape, claim boundaries, review states, and blocking posture for future source rows.

This document does not add source rows.

This document does not add citations.

This document does not validate `DA`.

This document does not validate `DI`.

This document does not change analyze-v1 behavior.

This document does not change UI/VM behavior.

## Prerequisites

Accepted prerequisite implementation review:

* `docs/open-instrument/reviews/reviewed-external-lexicon-evidence-gate-validator-implementation-review-v0.1.md`

Reviewed validator implementation:

* `src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1.ts`

Reviewed validator contract test:

* `tests/apiAnalyzeV1.reviewedExternalLexiconEvidenceGate.validatorContract.v0_1.spec.ts`

Implementation review status:

`REVIEWED_EXTERNAL_LEXICON_EVIDENCE_GATE_VALIDATOR_V0_1_REVIEWED_ACCEPTED_READY_FOR_REVIEWED_SOURCE_ROW_CONTRACT`

## Contract boundary

A reviewed external lexicon source row is a curated row that can be passed into the reviewed external lexicon evidence gate validator.

A row by itself is not proof.

A row becomes source-validation eligible only when the validator accepts it.

A row must not claim:

* historical origin
* winner status
* language ownership
* language superiority
* candidate truth
* scientific publication proof
* user decision

The user remains the decision maker.

## Source row object

A source row must expose these fields:

* `sourceId`
* `sourceKind`
* `sourceStatus`
* `candidateId`
* `displayForm`
* `candidateLanguage`
* `embryo`
* `isolatedStandaloneForm`
* `plainStandaloneGloss`
* `sourceNote`
* `semanticBridge`
* `originClaim`
* `historicalTransmissionClaim`
* `winnerClaim`
* `languageSuperiorityClaim`
* `candidateTruthClaim`
* `publicationEvidenceClaim`
* `scientificEvidenceClaim`
* `userDecisionPosture`
* `externalCitations`

## Required claim-boundary values

A source row must set:

* `originClaim: false`
* `historicalTransmissionClaim: false`
* `winnerClaim: false`
* `languageSuperiorityClaim: false`
* `candidateTruthClaim: false`
* `publicationEvidenceClaim: false`
* `scientificEvidenceClaim: false`
* `userDecisionPosture: user_decides`

Any future row that cannot honestly satisfy these boundaries must remain non-validating.

## Source status enum

Allowed source statuses:

* `missing_source`
* `draft_source`
* `review_pending`
* `reviewed_accepted`
* `reviewed_rejected`
* `superseded`

Only `reviewed_accepted` can be eligible for source validation.

All other statuses block source validation.

## Source kind enum

Allowed source kinds:

### Validating source kinds

These source kinds may validate only when the full row and citation gate passes:

* `reviewed_static_source`
* `reviewed_dictionary_source`
* `reviewed_lexical_source`
* `reviewed_human_curation_source`
* `reviewed_provider_capture_source`

### Non-validating source kinds

These source kinds cannot validate:

* `SEED`
* `EXAMPLE`
* `FIXTURE_ONLY`
* `MODEL_OUTPUT_UNREVIEWED`
* `SYMBOLIC_RESONANCE_ONLY`
* `HISTORICAL_CONTEXT_ONLY`

A source row with a non-validating source kind may be kept as context only.

It must not become source-validation eligible.

## External citation object

Each source row must expose `externalCitations` as an array.

Each citation must expose these fields:

* `citationId`
* `citationStatus`
* `citationType`
* `sourceTitle`
* `sourceAuthorOrEditor`
* `sourcePublisherOrHost`
* `sourceDateOrVersion`
* `sourceUrlOrArchiveRef`
* `entryLocator`
* `attestedForm`
* `attestedGloss`
* `attestedGrammarNote`
* `reviewedBy`
* `reviewedAt`
* `reviewNote`
* `sourceHashOrArchiveHash`

## Citation status enum

Allowed citation statuses:

* `missing`
* `present_unreviewed`
* `reviewed_accepted`
* `reviewed_rejected`
* `superseded`

Only `reviewed_accepted` can satisfy the external citation gate.

All other statuses block source validation.

## Citation type enum

Allowed citation types:

### External citation types

These may validate only when reviewed accepted and locator/form/gloss are present:

* `dictionary_entry`
* `grammar_entry`
* `corpus_line`
* `academic_lexical_reference`
* `reviewed_scanned_source`
* `reviewed_archive_copy`

### Internal / non-validating citation types

These cannot validate:

* `project_doc`
* `project_fixture`
* `project_snapshot`
* `seed_row`
* `model_output`

Internal sources can explain why a row exists.

Internal sources cannot satisfy the external lexical citation gate.

## Required lexical evidence fields

A validating row must have:

* `isolatedStandaloneForm`
* `plainStandaloneGloss`
* `sourceNote`
* `semanticBridge`
* at least one reviewed accepted external citation
* citation locator
* citation attested form
* citation attested gloss

Missing any of these fields blocks source validation.

## Semantic bridge rule

A reviewed citation can attest a lexical form.

A reviewed citation does not automatically prove the full functional composition.

The `semanticBridge` field must explain how the attested embryo contributes to the candidate's functional motivation.

For `DI`, a reviewed citation for `di = know` is not enough by itself.

The `SHTU + DI → STUDY` composition still requires a reviewed semantic bridge.

## DA quarantine rule

The candidate:

`albanian-da-dam-damage-functional`

remains quarantined.

A future source row must not validate `DA = split/divide` unless it has reviewed exact external citation evidence for isolated `da` as split/divide.

The following do not validate isolated `DA = split/divide`:

* `ndaj`
* `ndarë`
* derivative evidence
* morphology evidence without reviewed bridge
* `da = gave`
* homophone collision
* internal project notes
* seed rows
* examples
* model output
* symbolic resonance
* historical context

A future route may replace the embryo with a reviewed derivative/morphology route, but that is a separate contract lane.

## DI posture rule

The candidate:

`albanian-shtu-di-study-functional`

remains citation-pending until reviewed source rows exist.

A future source row may become source-validation eligible for `DI` only when:

* `di` is attested as know/knowledge by reviewed accepted external citation
* the citation has locator, attested form, and attested gloss
* source row status is `reviewed_accepted`
* source kind is validating
* semantic bridge is present
* claim-boundary fields remain false
* user decision posture is `user_decides`

A reviewed citation for unrelated `di` blocks validation.

A missing semantic bridge blocks validation.

## Non-invention rule

The source-row lane must not invent citations.

The source-row lane must not turn examples into evidence.

The source-row lane must not convert internal notes into external lexical proof.

If reviewed external citation metadata is not available, the row must remain non-validating.

## Live behavior boundary

This contract does not change live behavior.

Current live examples remain bounded.

No `DA` live promotion exists.

No `DI` live promotion exists.

That is expected until reviewed source rows and reviewed citations are wired.

## Product-progress checkpoint

The next meaningful product-progress checkpoint should happen only after reviewed source rows/citations are added or a row fixture is created.

At that checkpoint, prove:

* live `study` remains blocked if no reviewed `DI` source row exists
* live `damage` remains blocked if no reviewed `DA` source row exists
* synthetic reviewed `DI` row can pass the validator
* `DI` without bridge blocks
* `SEED` blocks
* `DA` without exact reviewed citation blocks
* `ndaj` / `ndarë` derivative evidence blocks isolated `DA`
* `DA = gave` homophone collision blocks
* no origin claim is created
* user decision posture remains preserved

## Next implementation boundary

The next implementation after review should create a contract-locked source-row fixture or registry only if it can preserve the non-invention rule.

A fixture may be synthetic for contract testing only if it is clearly marked non-live and not used as production evidence.

A live row must require reviewed external citation metadata.

## Review requirement

This document must be reviewed before any source-row fixture, registry, or live wiring is added.

The next accepted task is:

`docs(open-instrument): review reviewed external lexicon source row contract v0.1`
