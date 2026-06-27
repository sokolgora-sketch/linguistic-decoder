# Live embryo-first isolation evidence source for damage and study v0.1 — Review

Status: LIVE_EMBRYO_FIRST_ISOLATION_EVIDENCE_SOURCE_DAMAGE_STUDY_V0_1_REVIEWED_ACCEPTED_READY_FOR_VALIDATOR_CONTRACT.

Reviewed on: 2026-06-27.

Reviewed source definition:

* `docs/open-instrument/live-embryo-first-isolation-evidence-source-damage-study-v0.1.md`

Reviewed source-definition commit:

* Short SHA: `6813e58a`
* Full SHA: `6813e58a84eddc0a91df76cda134643aaf23c20e`
* Subject: `docs(open-instrument): define live embryo-first isolation evidence source for damage and study v0.1`

Source definition internal base:

* `b4c7d352ca48aa392c41b5abcca975fe592aa9e0`

Source status:

* LIVE_EMBRYO_FIRST_ISOLATION_EVIDENCE_SOURCE_DAMAGE_STUDY_V0_1_DEFINED_PENDING_REVIEW

## Review decision

Accepted.

The live embryo-first isolation-evidence source definition for `damage` and `study` is accepted as the next source-contract boundary.

The definition is accepted because it defines the evidence requirements before any live `validatedFunctionalMotivation` promotion is allowed.

The definition is accepted because it preserves the truth wall between examples, seed/context candidates, symbolic resonance, historical context, model output, and reviewed live evidence.

The definition is accepted because it does not implement runtime promotion.

## Accepted source purpose

The source contract defines what a future reviewed evidence source must provide before live `damage` or `study` candidates can become eligible for `validatedFunctionalMotivation`.

The source contract is not evidence by itself.

The source contract is not runtime wiring.

The source contract is not a validator implementation.

The source contract is not a UI feature.

The source contract is not a schema tightening.

## Accepted required fields

A future validation-eligible source row must provide:

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
* `word`
* `candidateId`
* `displayForm`
* `candidateLanguage`
* `embryo`
* `embryoSize`
* `embryoLanguage`
* `isolatedStandaloneForm`
* `plainStandaloneGloss`
* `sourceNote`
* `segmentation`
* `semanticBridge`
* `expansionChain`
* reviewed `evidenceRefs`
* explicit `claimBoundary`

This is accepted as the minimum live source boundary.

## Accepted isolation requirements

The review accepts these required isolation fields:

* `isolatedStandaloneForm`
* `plainStandaloneGloss`
* `sourceNote`
* `semanticBridge`

If any of these are missing, null, empty, unreviewed, or only symbolic, a candidate must not become live `validatedFunctionalMotivation`.

The source definition correctly preserves the existing missing-field blocking posture already used by analyze-v1 candidate projection.

## Accepted evidence requirements

The review accepts the evidence reference requirement.

A future source row must provide at least one reviewed evidence reference.

Accepted evidence posture:

* evidence refs must be explicit
* evidence refs must have stable identity
* evidence refs must include path or trace
* evidence refs must include status
* only `reviewed_accepted` evidence can satisfy live validation eligibility

This prevents examples, seed rows, or model answers from becoming evidence by implication.

## Accepted source status requirements

The review accepts the source-status gate.

Only `sourceStatus: reviewed_accepted` can permit live validation eligibility.

The following statuses must block validation:

* `missing_source`
* `draft_source`
* `review_pending`
* `reviewed_rejected`
* `superseded`

This keeps source review separate from runtime promotion.

## Accepted SEED boundary

The review accepts that `sourceKind: SEED` is not validation.

SEED can provide context.

SEED cannot satisfy live validation eligibility.

SEED cannot bypass the truth wall.

SEED cannot produce an origin claim.

SEED cannot create a historical winner.

## Accepted claim boundaries

The source definition correctly requires explicit false claim boundaries:

* `originClaim: false`
* `historicalTransmissionClaim: false`
* `winnerClaim: false`
* `languageSuperiorityClaim: false`
* `candidateTruthClaim: false`
* `publicationEvidenceClaim: false`
* `scientificEvidenceClaim: false`
* `userDecisionPosture: user_decides`

The review accepts that these fields must remain bounded even when a candidate becomes eligible for functional motivation validation.

Functional motivation remains separate from historical transmission.

Functional motivation remains separate from origin proof.

Functional motivation remains user-decidable.

## Accepted target candidates

The review accepts the first future target candidates.

For `damage`:

* `candidateId: albanian-da-dam-damage-functional`
* `displayForm: DA → DAM → DAMAGE`
* `candidateLanguage: Albanian`
* `embryo: DA`
* `embryoLanguage: Albanian`

For `study`:

* `candidateId: albanian-shtu-di-study-functional`
* `displayForm: SHTU + DI → STUDY`
* `candidateLanguage: Albanian`
* `embryo: DI`
* `embryoLanguage: Albanian`

These are accepted as first source targets only.

They are not historical-origin winners.

They are not live validated candidates until future source rows and validator tests exist.

## Accepted blocking reasons

The review accepts the blocking reason set, including:

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

This is accepted because it makes blocked validation explicit and auditable.

## Accepted runtime seam

The review accepts that the future runtime seam should remain near:

* `src/shared/analysisAdapter.ts`
* `projectEmbryoFirstCandidateForAnalyzeV1(...)`

The review rejects moving this lane into UI/VM.

The review rejects tightening the public candidate schema in this lane.

The review rejects treating docs examples as live evidence.

## Scope review

This PR is accepted only as a docs-only review.

Accepted scope:

* review of the source-definition doc
* review of required source fields
* review of blocking reasons
* review of claim boundaries
* review of future target candidates
* review of future validator direction

Rejected for this lane:

* runtime changes
* API behavior changes
* strict candidate schema changes
* UI rendering changes
* VM type changes
* provider/model/replay execution
* fixture promotion into evidence
* eval work
* VoiceLab work
* seven-voice-order work

## Validation reviewed

The source-definition lane preserved:

* no runtime change
* no API behavior change
* no UI/VM change
* no schema tightening
* no provider/model/replay execution
* no fixture promotion into evidence
* no eval/VoiceLab/seven-voice-order work

The source-definition lane produced:

* `docs/open-instrument/live-embryo-first-isolation-evidence-source-damage-study-v0.1.md`

The source-definition lane status was:

* LIVE_EMBRYO_FIRST_ISOLATION_EVIDENCE_SOURCE_DAMAGE_STUDY_V0_1_DEFINED_PENDING_REVIEW

## Accepted limitations

The source definition is not the validator.

The source definition is not live evidence.

The source definition is not the reviewed source rows.

The source definition does not promote `damage` or `study`.

The source definition does not make examples live.

The source definition does not make SEED validation.

The source definition does not display new fields in the UI.

## Review outcome

Accepted.

The source definition status is now:

`LIVE_EMBRYO_FIRST_ISOLATION_EVIDENCE_SOURCE_DAMAGE_STUDY_V0_1_REVIEWED_ACCEPTED_READY_FOR_VALIDATOR_CONTRACT`

The next accepted task is:

`test(open-instrument): add live embryo-first isolation evidence source validator contract v0.1`
