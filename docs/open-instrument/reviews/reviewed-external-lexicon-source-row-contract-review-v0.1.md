# Reviewed external lexicon source row contract review v0.1

Status: REVIEWED_EXTERNAL_LEXICON_SOURCE_ROW_CONTRACT_V0_1_REVIEWED_ACCEPTED_READY_FOR_SOURCE_ROW_FIXTURE_CONTRACT.

Reviewed on: 2026-06-29.

## Reviewed artifact

Reviewed contract:

* `docs/open-instrument/reviewed-external-lexicon-source-row-contract-v0.1.md`

Base commit:

* Short SHA: `503511b5`
* Full SHA: `503511b51c848aa83322d849119dfc365cb8b9ab`
* Subject: `docs(open-instrument): define reviewed external lexicon source row contract v0.1`

## Review decision

Accepted.

The reviewed external lexicon source row contract v0.1 is accepted as the boundary for the next source-row fixture contract lane.

The contract correctly preserves the current Open Instrument posture:

* no live source rows
* no live citations
* no `DA` promotion
* no `DI` promotion
* no origin claim
* no winner claim
* no language superiority claim
* no user-decision override

## Why accepted

The contract is accepted because it defines the missing source-row boundary without pretending that source evidence already exists.

It keeps the correct separation between:

* candidate examples
* internal project notes
* model output
* symbolic resonance
* reviewed external lexical evidence
* reviewed semantic bridge evidence

That separation is required before any fixture or registry can be added safely.

## Contract checks reviewed

The contract defines required source row fields:

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
* claim-boundary fields
* `userDecisionPosture`
* `externalCitations`

The contract defines required citation fields:

* `citationId`
* `citationStatus`
* `citationType`
* source metadata
* locator
* attested form
* attested gloss
* reviewer metadata
* review note
* archive/hash reference

The contract locks claim boundaries:

* `originClaim: false`
* `historicalTransmissionClaim: false`
* `winnerClaim: false`
* `languageSuperiorityClaim: false`
* `candidateTruthClaim: false`
* `publicationEvidenceClaim: false`
* `scientificEvidenceClaim: false`
* `userDecisionPosture: user_decides`

These boundaries match the reviewed validator posture.

## Source status review

Accepted source status enum:

* `missing_source`
* `draft_source`
* `review_pending`
* `reviewed_accepted`
* `reviewed_rejected`
* `superseded`

Review finding:

Only `reviewed_accepted` may be source-validation eligible.

All other source statuses correctly block validation.

## Source kind review

Accepted validating source kinds:

* `reviewed_static_source`
* `reviewed_dictionary_source`
* `reviewed_lexical_source`
* `reviewed_human_curation_source`
* `reviewed_provider_capture_source`

Accepted non-validating source kinds:

* `SEED`
* `EXAMPLE`
* `FIXTURE_ONLY`
* `MODEL_OUTPUT_UNREVIEWED`
* `SYMBOLIC_RESONANCE_ONLY`
* `HISTORICAL_CONTEXT_ONLY`

Review finding:

The contract correctly prevents seeds, examples, fixtures, model output, resonance, and historical context from becoming external lexical proof.

## Citation review

Accepted citation status enum:

* `missing`
* `present_unreviewed`
* `reviewed_accepted`
* `reviewed_rejected`
* `superseded`

Accepted validating citation types:

* `dictionary_entry`
* `grammar_entry`
* `corpus_line`
* `academic_lexical_reference`
* `reviewed_scanned_source`
* `reviewed_archive_copy`

Accepted non-validating citation types:

* `project_doc`
* `project_fixture`
* `project_snapshot`
* `seed_row`
* `model_output`

Review finding:

The contract correctly states that internal project material can explain why a row exists but cannot satisfy the external lexical citation gate.

## DA quarantine review

Accepted.

The contract correctly keeps:

`albanian-da-dam-damage-functional`

quarantined.

It correctly requires reviewed exact external citation evidence for isolated `da` as split/divide before `DA` can validate.

It correctly rejects:

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

Review finding:

This preserves the earlier validator review requirement. It prevents false promotion from derivative or homophone evidence.

## DI posture review

Accepted.

The contract correctly keeps:

`albanian-shtu-di-study-functional`

citation-pending until reviewed source rows exist.

It correctly requires:

* reviewed accepted citation for `di` as know/knowledge
* locator
* attested form
* attested gloss
* validating source kind
* `reviewed_accepted` source status
* semantic bridge
* false claim-boundary fields
* `user_decides`

Review finding:

This preserves the distinction between lexical attestation and functional composition. A citation for `di = know` does not automatically prove `SHTU + DI → STUDY`.

## Non-invention rule review

Accepted.

The contract correctly locks:

* no invented citations
* no examples as evidence
* no internal notes as external lexical proof
* no reviewed metadata means non-validating row

Review finding:

This is the most important boundary in this lane. The next fixture contract must preserve it.

## Live behavior review

Accepted.

The contract correctly states:

* no live behavior change
* no analyze-v1 change
* no UI/VM change
* no live `DA` promotion
* no live `DI` promotion

Review finding:

The contract is documentation-only and does not create evidence by declaration.

## Issues found

No blocking issues found.

No runtime risk found because the lane is docs-only.

No API risk found because no API files changed.

No UI/VM risk found because no UI/VM files changed.

No source-evidence risk found because no source rows or citations were added.

## Required next boundary

The next accepted task may add a source-row fixture contract only if it preserves the non-invention rule.

A synthetic fixture may be used for contract tests only if it is clearly marked non-live and cannot be mistaken for production evidence.

A live row must require reviewed external citation metadata.

The next accepted task is:

`test(open-instrument): add reviewed external lexicon source row fixture contract v0.1`
