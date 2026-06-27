# Live embryo-first isolation evidence source for damage and study v0.1

Status: LIVE_EMBRYO_FIRST_ISOLATION_EVIDENCE_SOURCE_DAMAGE_STUDY_V0_1_DEFINED_PENDING_REVIEW.

Defined on: 2026-06-27.

Base reviewed main:

* Short SHA: `b4c7d352`
* Full SHA: `b4c7d352ca48aa392c41b5abcca975fe592aa9e0`
* Subject: `docs(open-instrument): review embryo-first candidate examples for damage and study v0.1`

Source review input:

* `docs/open-instrument/reviews/embryo-first-candidate-examples-damage-study-review-v0.1.md`
* `tests/apiAnalyzeV1.embryoFirstCandidate.examples.v0_1.spec.ts`
* `docs/open-instrument/live-analyze-v1-embryo-first-candidate-output-contract-v0.1.md`

## Purpose

This document defines the future live isolation-evidence source required before `damage` or `study` candidates can be promoted from bounded example posture into live `validatedFunctionalMotivation` output.

This document does not implement runtime promotion.

This document does not change analyze-v1 behavior.

This document does not change UI/VM rendering.

This document does not tighten the candidate schema.

This document does not execute a provider, model, replay, or fixture import.

This document defines the source contract only.

## Problem

The current examples prove the intended embryo-first posture, but the examples are not live evidence.

The current live output for `damage` and `study` remains bounded because live candidates do not yet have a reviewed isolation-evidence source.

A future live candidate must not become `validatedFunctionalMotivation` merely because it appears in a seed list, example fixture, model output, or symbolic resonance pattern.

A future live candidate may become eligible for `validatedFunctionalMotivation` only if a reviewed isolation-evidence source supplies the required standalone and bridge fields.

## Non-goals

This source contract does not:

* prove historical origin
* declare a single winner
* claim Albanian origin
* reject Latin historical context
* promote SEED candidates automatically
* run a model or provider
* import fixture output as truth
* publish external evidence
* change the default provider
* change `CandidateUI`
* change the VM row type
* add candidate-card rendering
* tighten `candidates: z.array(z.unknown())`
* change `src/shared/analysisAdapter.ts`
* change `src/shared/analyzeV1Adapter.ts`
* change `src/shared/resultsUI.ts`
* change `src/ui/instrument/contractAdapter.ts`
* change `src/ui/telemetry/types.ts`
* change `src/ui/candidates/candidateModel.ts`
* change `src/ui/candidates/CandidatesAccordion.tsx`

## Source identity

A live isolation-evidence source must expose stable source identity.

Required source identity fields:

* `sourceId`
* `sourceVersion`
* `sourceKind`
* `sourceLabel`
* `sourceStatus`
* `sourceCreatedAt`
* `sourceReviewedAt`
* `sourceOwner`
* `sourcePath`
* `sourceHash`

Allowed `sourceKind` values:

* `reviewed_static_source`
* `reviewed_dictionary_source`
* `reviewed_lexical_source`
* `reviewed_human_curation_source`
* `reviewed_provider_capture_source`

Disallowed `sourceKind` values for validation:

* `SEED`
* `EXAMPLE`
* `FIXTURE_ONLY`
* `MODEL_OUTPUT_UNREVIEWED`
* `SYMBOLIC_RESONANCE_ONLY`
* `HISTORICAL_CONTEXT_ONLY`

Allowed `sourceStatus` values:

* `missing_source`
* `draft_source`
* `review_pending`
* `reviewed_accepted`
* `reviewed_rejected`
* `superseded`

Only `reviewed_accepted` can be used for live validation eligibility.

## Candidate identity

Each source row must bind to one candidate identity.

Required candidate identity fields:

* `word`
* `candidateId`
* `displayForm`
* `candidateLanguage`
* `embryo`
* `embryoSize`
* `embryoLanguage`
* `segmentation`
* `expansionChain`

The row must not rely on display text alone.

The row must not infer identity from rank order.

The row must not infer identity from language alone.

The row must not infer identity from source path alone.

## Required isolation fields

Each validation-eligible source row must provide:

* `isolatedStandaloneForm`
* `plainStandaloneGloss`
* `sourceNote`
* `semanticBridge`

These four fields are mandatory.

If any of these four fields are missing, null, empty, or only symbolic, the candidate is not eligible for live `validatedFunctionalMotivation`.

## isolatedStandaloneForm

`isolatedStandaloneForm` must be a scalar string.

It must name the smallest standalone form being claimed as isolated.

It must be independent from the target word.

It must not be the full target word unless the candidate is explicitly whole-word only.

It must not be a display chain.

It must not be a metaphor.

It must not be symbolic resonance.

For `damage`, a future row may propose `da` only if the row separately proves `da` can stand alone.

For `study`, a future row may propose `di` only if the row separately proves `di` can stand alone.

## plainStandaloneGloss

`plainStandaloneGloss` must be a scalar string.

It must give a plain-language standalone meaning.

It must be readable without the target word.

It must distinguish standalone meaning from contextual function inside the target word.

It must not depend on the target word to make sense.

It must not claim origin.

It must not claim publication proof.

It must not claim scientific proof.

## sourceNote

`sourceNote` must be a scalar string.

It must explain why the row was accepted.

It must state what evidence class supports the row.

It must state what remains limited.

It must include enough detail for audit.

It must not use `sourceKind: SEED` as validation.

It must not treat a model answer as truth.

It must not treat resonance as proof.

It must not claim origin, ownership, or language superiority.

## semanticBridge

`semanticBridge` must be a scalar string.

It must explain how the isolated standalone form can motivate the target-word function.

It must distinguish functional motivation from historical transmission.

It must stay user-decidable.

It must not declare a winner.

Accepted bridge posture:

* `damage`: what is split, broken, impaired, or divided can motivate a harm/damage function.
* `study`: knowledge/knowing made internal can motivate a study/learning function.

These bridges are functional-motivation bridges only.

They are not historical-origin claims.

## Evidence references

Each source row must include at least one evidence reference.

Required evidence reference fields:

* `evidenceRefId`
* `evidenceKind`
* `evidenceLabel`
* `evidencePath`
* `evidenceQuoteOrExcerpt`
* `evidenceNote`
* `evidenceStatus`

Allowed `evidenceKind` values:

* `dictionary_entry`
* `lexical_entry`
* `reviewed_curation_note`
* `reviewed_provider_capture`
* `reviewed_human_audit`

Allowed `evidenceStatus` values:

* `missing`
* `present_unreviewed`
* `reviewed_accepted`
* `reviewed_rejected`
* `superseded`

Only `reviewed_accepted` evidence can satisfy live validation eligibility.

## Claim boundaries

Every source row must include claim-boundary fields.

Required claim-boundary fields:

* `originClaim`
* `historicalTransmissionClaim`
* `winnerClaim`
* `languageSuperiorityClaim`
* `candidateTruthClaim`
* `publicationEvidenceClaim`
* `scientificEvidenceClaim`
* `userDecisionPosture`

Required default values:

* `originClaim: false`
* `historicalTransmissionClaim: false`
* `winnerClaim: false`
* `languageSuperiorityClaim: false`
* `candidateTruthClaim: false`
* `publicationEvidenceClaim: false`
* `scientificEvidenceClaim: false`
* `userDecisionPosture: user_decides`

These fields must remain false even when a candidate becomes validation-eligible as functional motivation.

Functional motivation is not historical transmission.

Functional motivation is not origin proof.

Functional motivation is not a single winner.

## Validation eligibility

A candidate is eligible for live `validatedFunctionalMotivation` only when all of the following are true:

* source row exists
* `sourceStatus: reviewed_accepted`
* `isolatedStandaloneForm` is present
* `plainStandaloneGloss` is present
* `sourceNote` is present
* `semanticBridge` is present
* at least one evidence reference has `evidenceStatus: reviewed_accepted`
* claim boundaries are explicitly false
* `userDecisionPosture: user_decides`
* candidate identity matches the live candidate
* source version is stable
* source hash is stable

If any required item is missing, the candidate must remain blocked or partial.

## Blocking reasons

A future implementation must preserve explicit blocking reasons.

Required blocking reasons:

* `missing_source`
* `source_not_reviewed_accepted`
* `missing_isolatedStandaloneForm`
* `missing_plainStandaloneGloss`
* `missing_sourceNote`
* `missing_semanticBridge`
* `missing_reviewed_evidenceRef`
* `claim_boundary_not_false`
* `user_decision_posture_missing`
* `candidate_identity_mismatch`
* `source_hash_missing`
* `source_version_missing`
* `sourceKind_seed_not_validation`
* `symbolic_resonance_not_validation`
* `historical_context_not_validation`

These reasons must be visible in diagnostics before any promotion is allowed.

## Promotion output mapping

If the source validates a candidate, the live candidate may map:

* `claimType: functionalMotivation`
* `validationOutcome: validated`
* `rankGroup: validatedFunctionalMotivation`
* `originClaim: not_claimed`
* `historicalRelation: not_evaluated` or `context_only`
* `userDecisionPosture: user_decides`

If the source does not validate a candidate, the live candidate must remain:

* `validationOutcome: blocked`, `partial`, or `not_evaluated`
* not `validatedFunctionalMotivation`
* not historical origin
* not a winner

## Damage source target

The first future `damage` source row must target:

* `word: damage`
* `candidateId: albanian-da-dam-damage-functional`
* `displayForm: DA → DAM → DAMAGE`
* `candidateLanguage: Albanian`
* `embryo: DA`
* `embryoLanguage: Albanian`

Required proof posture:

* prove `DA` or selected embryo can stand alone
* give plain standalone gloss
* distinguish standalone meaning from damage-context bridge
* provide reviewed evidence references
* preserve no-origin-claim posture

## Study source target

The first future `study` source row must target:

* `word: study`
* `candidateId: albanian-shtu-di-study-functional`
* `displayForm: SHTU + DI → STUDY`
* `candidateLanguage: Albanian`
* `embryo: DI`
* `embryoLanguage: Albanian`

Required proof posture:

* prove `DI` or selected embryo can stand alone
* give plain standalone gloss
* distinguish standalone meaning from study-context bridge
* provide reviewed evidence references
* preserve no-origin-claim posture

## Source row shape

A future source row should use this shape:

```json
{
  "sourceId": "open-instrument.live-isolation-evidence.damage-study.v0.1",
  "sourceVersion": "0.1",
  "sourceKind": "reviewed_human_curation_source",
  "sourceLabel": "Live embryo-first isolation evidence for damage/study v0.1",
  "sourceStatus": "reviewed_accepted",
  "sourceCreatedAt": "YYYY-MM-DD",
  "sourceReviewedAt": "YYYY-MM-DD",
  "sourceOwner": "Open Instrument",
  "sourcePath": "docs/open-instrument/artifacts/live-isolation-evidence/example.json",
  "sourceHash": "sha256:...",
  "word": "damage",
  "candidateId": "albanian-da-dam-damage-functional",
  "displayForm": "DA → DAM → DAMAGE",
  "candidateLanguage": "Albanian",
  "embryo": "DA",
  "embryoSize": 2,
  "embryoLanguage": "Albanian",
  "isolatedStandaloneForm": "da",
  "plainStandaloneGloss": "plain standalone gloss here",
  "sourceNote": "reviewed source note here",
  "segmentation": {
    "embryo": "DA",
    "expansion": ["DA", "DAM", "DAMAGE"]
  },
  "semanticBridge": "functional bridge here",
  "expansionChain": ["DA", "DAM", "DAMAGE"],
  "evidenceRefs": [
    {
      "evidenceRefId": "damage.da.lexical.001",
      "evidenceKind": "reviewed_human_audit",
      "evidenceLabel": "reviewed standalone-form audit",
      "evidencePath": "path/to/evidence",
      "evidenceQuoteOrExcerpt": "short reviewed excerpt or note",
      "evidenceNote": "audit note",
      "evidenceStatus": "reviewed_accepted"
    }
  ],
  "claimBoundary": {
    "originClaim": false,
    "historicalTransmissionClaim": false,
    "winnerClaim": false,
    "languageSuperiorityClaim": false,
    "candidateTruthClaim": false,
    "publicationEvidenceClaim": false,
    "scientificEvidenceClaim": false,
    "userDecisionPosture": "user_decides"
  }
}
```

This shape is a source-row contract, not a runtime implementation.

## Minimum future tests

Before runtime promotion, add tests that prove:

* missing source blocks validation
* draft source blocks validation
* unreviewed evidence blocks validation
* missing `isolatedStandaloneForm` blocks validation
* missing `plainStandaloneGloss` blocks validation
* missing `sourceNote` blocks validation
* missing `semanticBridge` blocks validation
* `sourceKind: SEED` blocks validation
* false claim boundary is required
* `userDecisionPosture: user_decides` is required
* reviewed source can make an example eligible for `validatedFunctionalMotivation`
* eligibility does not create historical-origin claim
* eligibility does not update UI/VM unless explicitly implemented in a later lane

## Runtime implementation boundary

The future runtime seam should remain near:

* `src/shared/analysisAdapter.ts`
* `projectEmbryoFirstCandidateForAnalyzeV1(...)`

Do not move this lane into UI/VM.

Do not widen rendered candidate cards in the source-definition lane.

Do not tighten the public candidate schema in the source-definition lane.

Do not treat docs examples as live evidence.

## Acceptance criteria for this definition

This definition is accepted when:

* the source contract is documented
* required fields are explicit
* blocking reasons are explicit
* claim boundaries are explicit
* damage and study source targets are explicit
* future test requirements are explicit
* no runtime code changes are made
* no schema changes are made
* no UI/VM changes are made
* no provider/model/replay execution occurs
* no origin/winner claim is introduced

## Review status

This source definition is ready for review when this status appears in repo:

`LIVE_EMBRYO_FIRST_ISOLATION_EVIDENCE_SOURCE_DAMAGE_STUDY_V0_1_DEFINED_PENDING_REVIEW`

The next accepted task is:

`docs(open-instrument): review live embryo-first isolation evidence source for damage and study v0.1`
