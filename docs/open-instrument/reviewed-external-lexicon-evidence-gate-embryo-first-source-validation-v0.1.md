# Reviewed external lexicon evidence gate for embryo-first source validation v0.1

Status: REVIEWED_EXTERNAL_LEXICON_EVIDENCE_GATE_EMBRYO_FIRST_SOURCE_VALIDATION_V0_1_DEFINED_PENDING_REVIEW.

Created on: 2026-06-27.

Base:

* Short SHA: `dcc51d9c`
* Full SHA: `dcc51d9c970181b7bed96d0bcfc8c6dc020fb1f0`
* Subject: `docs(open-instrument): review live embryo-first isolation evidence source for damage and study v0.1`

Prerequisite review:

* `docs/open-instrument/reviews/live-embryo-first-isolation-evidence-source-damage-study-review-v0.1.md`

Prerequisite source definition:

* `docs/open-instrument/live-embryo-first-isolation-evidence-source-damage-study-v0.1.md`

## Purpose

This document defines the reviewed external lexicon evidence gate that must exist before the next validator-contract lane.

The gate prevents live embryo-first validation from relying on project-internal assertions, examples, fixtures, snapshots, seed rows, model output, or symbolic resonance.

The gate requires externally reviewable lexical evidence before a candidate can become eligible for live `validatedFunctionalMotivation`.

## Review reason

The current source-definition review correctly requires reviewed evidence references.

However, the current repo still contains internal assertions that are not the same as external lexical evidence.

The current repo also contains a dangerous internal mismatch for `DA`:

* `src/shared/protoRoots.v1.ts` defines `id: "DA"`.
* That entry has root gloss `divide / cut / separate`.
* That same entry lists carrier `da` with gloss `gave (aorist/part)`.
* That same entry lists `ndaj` with gloss `divide / share`.
* That same entry lists `ndarë` with gloss `divided`.

This means `DA = split/divide` cannot be promoted as an isolated two-letter embryo without reviewed external evidence.

The internal table is useful for inspection.

The internal table is not sufficient for live validation.

## Non-goals

This document does not implement runtime validation.

This document does not modify `src/shared/protoRoots.v1.ts`.

This document does not modify examples.

This document does not modify analyze-v1 behavior.

This document does not modify API behavior.

This document does not modify UI/VM behavior.

This document does not tighten the public candidate schema.

This document does not add source rows.

This document does not execute provider/model/replay work.

This document does not touch eval work.

This document does not touch VoiceLab work.

This document does not touch seven-voice-order work.

This document does not make an origin claim.

This document does not create a historical winner.

## Definitions

### External lexical citation

An external lexical citation is a reviewed source outside this repository that directly attests the standalone form, gloss, or grammatical status needed by a candidate.

Allowed external citation types:

* dictionary entry
* grammar entry
* corpus line
* academic lexical reference
* reviewed scanned source with stable locator
* reviewed archive copy of a lexical source

A native-speaker note can be supplementary context.

A native-speaker note cannot be the sole external lexical citation for live validation.

### Internal source

The following are internal sources:

* project docs
* project review docs
* project tests
* project fixtures
* project snapshots
* project seed rows
* project comments
* project raw JSON captures
* model/provider output stored by the project
* DF_BRAIN notes

Internal sources can explain project intent.

Internal sources cannot satisfy the external lexical citation gate.

### Reviewed citation

A reviewed citation is an external lexical citation that has been checked by a human reviewer and marked `reviewed_accepted`.

Unreviewed citation metadata is not enough.

A URL by itself is not enough.

A model statement by itself is not enough.

A copied gloss without locator is not enough.

## Required external citation fields

A validation-eligible source row must carry at least one reviewed external lexical citation with:

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

Allowed `citationStatus` values:

* `missing`
* `present_unreviewed`
* `reviewed_accepted`
* `reviewed_rejected`
* `superseded`

Only `reviewed_accepted` can satisfy the live validation gate.

## Forbidden validation evidence

The following must never satisfy live external lexical evidence:

* `sourceKind: SEED`
* example fixtures
* tests
* snapshots
* project docs
* project review docs
* internal comments
* model output
* provider output
* symbolic resonance
* historical context only
* user preference only
* assistant confidence
* candidate rank
* compactness of embryo
* surface resemblance
* transliteration convenience

## Required candidate gate

A future validator must require both source-shape validity and external citation validity.

Shape validity alone is insufficient.

A candidate is not validation-eligible unless:

* source row exists
* source row identity matches candidate identity
* `sourceStatus: reviewed_accepted`
* required source fields are present
* `isolatedStandaloneForm` is present
* `plainStandaloneGloss` is present
* `sourceNote` is present
* `semanticBridge` is present
* at least one external lexical citation exists
* at least one external lexical citation has `citationStatus: reviewed_accepted`
* external citation attests the standalone form or the exact grammatical relation used by the claim
* claim boundaries are explicitly false
* `userDecisionPosture: user_decides`

## Blocking reasons

The following blocking reasons are required:

* `missing_externalCitation`
* `externalCitation_not_reviewed_accepted`
* `externalCitation_internal_source_only`
* `externalCitation_seed_source_only`
* `externalCitation_example_fixture_only`
* `externalCitation_model_output_only`
* `externalCitation_missing_locator`
* `externalCitation_missing_attestedForm`
* `externalCitation_missing_attestedGloss`
* `externalCitation_form_mismatch`
* `externalCitation_gloss_mismatch`
* `externalCitation_homophone_collision`
* `externalCitation_derivative_not_embryo`
* `externalCitation_claim_too_broad`
* `sourceKind_seed_not_validation`
* `symbolic_resonance_not_validation`
* `historical_context_not_validation`

## DA quarantine

The candidate `albanian-da-dam-damage-functional` is quarantined for live validation.

The quarantine applies to the claim:

`DA = split / divide / separation`

Reason:

* internal repo evidence is self-referential
* example fixture evidence is not live evidence
* `src/shared/protoRoots.v1.ts` currently mixes `DA` as split/divide with carrier `da` glossed as gave
* `ndaj` and `ndarë` carry divide semantics internally, but they are not the same as proving isolated two-letter `da`
* external reviewed citation for `da = split/divide` is not yet present in the repo

Required future options:

1. Provide reviewed external citation that directly attests `da` as a standalone split/divide form.
2. Or replace the embryo with an attested form such as `ndaj` / `ndarë` only if the semantic and morphological bridge is reviewed.
3. Or split homophones into separate reviewed candidates, for example:
   * `DA_SPLIT`
   * `DA_GIVE`
4. Or keep `DA` as surface/seed/context only.

Until one of these occurs, `DA` must not become live `validatedFunctionalMotivation`.

## DI posture

The candidate `albanian-shtu-di-study-functional` is not quarantined in the same way as `DA`, but it is still not live validation-eligible without citation.

The ingredient claim:

`DI = know / knowledge`

may proceed to source-row review only after a reviewed external lexical citation is attached.

The required citation must attest `di` as an Albanian standalone form or grammatical form relevant to `know`.

The composition claim:

`SHTU + DI → STUDY`

requires a separate semantic bridge review.

A real `DI` citation does not automatically prove the full composition.

Until reviewed citation and bridge are present, `DI` remains citation-pending, not live `validatedFunctionalMotivation`.

## Homophone and derivative rule

A short form cannot be validated only because a longer related form has the desired gloss.

A derivative form cannot automatically prove the isolated embryo.

A homophone cannot share evidence across meanings without explicit review.

If a form has multiple possible meanings or grammatical sources, each must be separated.

Required separation examples:

* `DA_SPLIT` and `DA_GIVE` must not be treated as one proof.
* `da`, `ndaj`, and `ndarë` must not be collapsed without explicit reviewed morphology.
* `di`, `dij`, `dije`, and `dit` must not be collapsed without explicit reviewed morphology.

## Future validator contract requirements

The next validator-contract PR must not merely check field presence.

The next validator-contract PR must lock that:

* internal-only evidence blocks validation
* missing external citation blocks validation
* unreviewed external citation blocks validation
* SEED-only evidence blocks validation
* examples-only evidence blocks validation
* homophone collision blocks validation
* derivative-not-embryo evidence blocks validation
* `DA` remains blocked until reviewed external citation exists
* `DI` can only become eligible with reviewed external citation
* source rows must carry reviewed external citation metadata

## Source row shape addition

Future source rows should include:

```json
{
  "externalCitations": [
    {
      "citationId": "string",
      "citationStatus": "reviewed_accepted",
      "citationType": "dictionary_entry",
      "sourceTitle": "string",
      "sourceAuthorOrEditor": "string",
      "sourcePublisherOrHost": "string",
      "sourceDateOrVersion": "string",
      "sourceUrlOrArchiveRef": "string",
      "entryLocator": "string",
      "attestedForm": "string",
      "attestedGloss": "string",
      "attestedGrammarNote": "string",
      "reviewedBy": "string",
      "reviewedAt": "YYYY-MM-DD",
      "reviewNote": "string",
      "sourceHashOrArchiveHash": "string"
    }
  ]
}
```

This shape is additive.

This document does not implement it.

## Claim boundary

External lexical citation can prove that a standalone form exists.

External lexical citation does not prove historical origin.

External lexical citation does not prove language superiority.

External lexical citation does not prove candidate truth.

External lexical citation does not prove final etymology.

External lexical citation does not remove user-decision posture.

Even with external citation, output must preserve:

* `originClaim: not_claimed`
* `winnerClaim: false`
* `historicalTransmissionClaim: false`
* `userDecisionPosture: user_decides`

## Accepted next task override

The previous next accepted task was:

`test(open-instrument): add live embryo-first isolation evidence source validator contract v0.1`

That task is deferred.

The new next accepted task is:

`docs(open-instrument): review reviewed external lexicon evidence gate for embryo-first source validation v0.1`
