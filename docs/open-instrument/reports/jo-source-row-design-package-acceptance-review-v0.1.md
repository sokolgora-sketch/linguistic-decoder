# JO source-row design-package acceptance review v0.1

Status: `ACCEPTANCE_REVIEW_DECISION_ONLY`.

Repository base:

- `b2c10c693f63afbb7a0dd0d9645f443ee234c8f8`

Reviewed merged package:

- `tests/fixtures/joSourceRowDesignPackage.v0_1.ts`
- `tests/joSourceRowDesignPackage.contract.v0_1.spec.ts`

## Decision

Result:

- `JO_SOURCE_ROW_DESIGN_PACKAGE_ACCEPTED_FOR_TRANSITION_PROPOSAL`

Next accepted lane:

- `DESIGN_DEDICATED_JO_SOURCE_ROW_TRANSITION_PROPOSAL`

Explicitly not authorized:

- `JO_PRODUCTION_REGISTRY_OR_RUNTIME_IMPLEMENTATION`

This decision means that the exact merged design package is sufficiently
specified to serve as the input to a dedicated, design-only transition
proposal.

It does not register, authorize, admit, project, profile or canon-lock JO.

## Accepted package identity

Proposed source ID:

- `reviewed.external.jo.refusal.candidate.v0_1`

Candidate ID:

- `albanian-jo-standalone-refusal-functional`

Language:

- `sq`

Embryo:

- `JO`

Isolated form:

- `jo`

Bounded functional scope:

- `standalone_refusal_or_explicit_rejection`

Proposed operation:

- `exact`

Proposed carrier:

- `jo`

## Accepted source identity

Exact source article:

- `JO part.`

DPEWA post ID:

- `25210`

Stable locator:

- `https://www.dpwa.gwi.uni-muenchen.de/dictionary/?lemmaid=25210`

Accepted source snapshot SHA-256:

- `f482a54f8f5648803b1eb7c91bed1b2013becf894e4d32f80e06f8f134a66a9e`

Article authors:

- Bardhyl Demiraj
- Olav Hackstein

First publication:

- `2024`

Modern dictionary reference:

- `FGJSSH 745f.`

Source identity classification:

- `EXACT_ATTESTED_HEADWORD_ARTICLE`

Reconstructed:

- false

Historical attestations and historical source material remain contextual only.

## Acceptance basis

The package is accepted for transition-proposal design because it:

1. satisfies the current
   `ReviewedExternalLexiconCandidateSourceRowV0_1` TypeScript schema;
2. preserves complete candidate-specific JO citation metadata;
3. passes its candidate-specific validator;
4. passes generic functional readiness;
5. passes the generic promotion and citation-packaging checklist;
6. passes the direct authoritative locator/archive requirement;
7. passes production-safe row-shape inspection;
8. remains machine-unauthorized;
9. remains outside production membership;
10. produces no runtime projection;
11. preserves exact-only operation and jo-only carrier posture;
12. preserves the single positive form and all negative controls;
13. preserves all claim boundaries and `user_decides`.

Acceptance of the package does not equal acceptance into production.

## Current generic-machine result

Structural readiness:

- `PASSES_GENERIC_READINESS`

Promotion-package readiness:

- `PASSES_GENERIC_CITATION_PACKAGING`

Production-safe row shape:

- `PASSES_PRODUCTION_SAFE_SHAPE_CHECK`

Machine authorization:

- `NOT_AUTHORIZED`

Authorization reason:

- `source_id_not_authorized`

Production membership:

- `NOT_ADMITTED`

Runtime projection:

- `NOT_PROJECTED`

Expected projector result:

- `null`

## Current production machine truth

Current reviewed source rows:

- DA
- DI

Current functionally authorized source IDs:

- DA
- DI

Current production membership:

- DA
- DI

Current runtime projection:

- DA
- DI

Current canonical profiles:

- DA
- DI

Current operation and carrier policies:

- DA
- DI

Current canon-lock admission:

- DA
- DI

Lifecycle:

- DA: `canon_locked`
- DI: `canon_locked`

Current admitted scope:

- `bounded_functional_lexical_projection`

JO remains absent from every production and governance owner.

## Accepted positive and negative controls

Direct positive:

| Control | Input | Segment | Operation | Carrier | Expected JO |
|---|---|---|---|---|---|
| `JO-P01` | `jo` | `jo` | `exact` | `jo` | present |

Cross-operator negatives:

| Control | Input | Expected JO |
|---|---|---|
| `JO-N01` | `po` | absent |
| `JO-N02` | `da` | absent |
| `JO-N03` | `di` | absent |

Collision negatives:

| Control | Input | Rejection reason |
|---|---|---|
| `JO-N04` | `major` | internal substring |
| `JO-N05` | `enjoy` | suffix-like substring |
| `JO-N06` | `joke` | prefix-like letters |
| `JO-N07` | `joint` | prefix-like letters |
| `JO-N08` | `banjo` | suffix-like material |
| `JO-N09` | `judo` | separated or altered letters |

Excluded scopes:

- `general_sentence_level_negation`
- `unrestricted_negative_polarity`
- `symbolic_po_jo_opposition`
- `prefix_behavior`
- `suffix_behavior`
- `substring_projection`
- transformed carriers
- reconstructed carriers

## Accepted candidate-specific rejection rules

A transition proposal must continue to reject:

- missing or incorrect DPEWA post ID;
- incorrect article head;
- generic portal-only evidence;
- reconstructed substitution;
- PO citation leakage;
- DA citation leakage;
- DI citation leakage;
- changed source snapshots without reassessment;
- unrelated attested forms;
- broader sentence-level-negation substitution;
- incomplete review identity;
- missing review date;
- prohibited claim activation;
- non-user-decidable posture.

## Nullability posture

The accepted validator normalizes these nullable schema fields before string
operations:

- `entryLocator`
- `attestedGloss`
- `reviewedBy`

Null or missing values normalize to empty strings and therefore fail the
candidate-specific requirements.

The validator remains fail-closed.

## Requirements for the dedicated transition proposal

The next lane must remain design-only.

It must enumerate the exact proposed changes, in dependency order, for:

1. source-row candidate registry placement;
2. production-membership placement;
3. functional runtime authorization;
4. canonical profile registration;
5. evidence-operation policy;
6. carrier policy;
7. runtime projection eligibility;
8. profile-backed live-smoke coverage;
9. canon-lock admission.

The transition proposal must also define:

- exact files that would change;
- exact tests required before each lifecycle transition;
- rollback and fail-closed behavior;
- current-state and proposed-state matrices;
- the point at which the source row becomes candidate-visible;
- the separate point at which it becomes production-live;
- the separate point at which it becomes canon-lock eligible;
- preservation of exact-only operation;
- preservation of jo-only carrier;
- preservation of the direct positive and all negatives;
- preservation of all claim boundaries;
- preservation of `user_decides`.

The proposal must not perform any of these changes.

## Prohibited changes in this acceptance-review lane

This lane does not modify:

- the source-row candidate registry;
- production membership;
- functional runtime authorization;
- runtime projection;
- canonical profiles;
- evidence-operation policies;
- carrier policies;
- RootMap;
- analyze-v1;
- UI;
- live smoke;
- canon-lock admission;
- Evals;
- VoiceLab.

## Claim boundaries

This review does not establish:

- historical origin;
- historical transmission;
- borrowing direction;
- earliest absolute origin;
- linguistic ownership;
- winner status;
- language superiority;
- candidate truth;
- scientific proof;
- publication-grade Open Instrument proof;
- ownership of general grammatical negation.

Historical source material remains contextual only.

User-decision posture remains:

- `user_decides`

## Final result

- `JO_SOURCE_ROW_DESIGN_PACKAGE_ACCEPTED_FOR_TRANSITION_PROPOSAL`

Next:

- `DESIGN_DEDICATED_JO_SOURCE_ROW_TRANSITION_PROPOSAL`

Not authorized:

- `JO_PRODUCTION_REGISTRY_OR_RUNTIME_IMPLEMENTATION`
