# Open Instrument — Canonical Operator Profile Contract v0.1

Status: IMPLEMENTED_PENDING_REVIEW.

Project lane: Open Instrument / ZË-RO.

## Purpose

This contract introduces one reusable canonical operator profile shape for the
first two production reference operators:

- DA;
- DI.

The profile is an aggregation and orchestration layer.

It is not a second lexical registry.

## Source-of-truth rule

The canonical profile stores only stable operator coordination metadata:

- profile version;
- operator ID;
- embryo;
- language;
- reviewed source ID;
- bounded functional label;
- reviewed-evidence expectation;
- canon lifecycle status;
- expected authorization scope;
- positive proof words;
- negative control words.

The profile does not copy:

- citation metadata;
- source status;
- source kind;
- isolated attested form;
- attested gloss;
- runtime evidence text;
- claim-boundary values;
- authorization result;
- production membership result;
- runtime projection result.

## Derived truth

The profile resolver obtains current truth from the existing owners.

### Reviewed source row

Owner:

- `reviewedExternalLexiconSourceRowCandidateRegistryV0_1`.

Lookup key:

- `sourceId`.

### Functional readiness

Owner:

- `buildReviewedExternalLexiconFunctionalReadinessV0_1`.

### Machine-readable runtime authorization

Owner:

- `evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1`.

### Production membership

Owner:

- `isReviewedExternalLexiconSourceIdInProductionMembershipV0_1`.

### Runtime projection

Owner:

- `projectReviewedExternalLexiconProductionRowForRuntimeV0_1`.

The resolver fails closed when the configured source ID does not exist.

## Current profile states

### DA

- operator ID: `DA`;
- source ID:
  `reviewed.external.gheg-da.damage.candidate.v0_1`;
- lifecycle: `canon_locked`;
- admitted scope:
  `bounded_functional_lexical_projection`;
- positive proof words:
  - `da`;
  - `dam`;
  - `damage`;
- negative controls:
  - `study`;
  - `xyz`;
  - `mode`;
  - `made`;
  - `dome`.

### DI

- operator ID: `DI`;
- source ID:
  `reviewed.external.di.knowledge.candidate.v0_1`;
- lifecycle: `runtime_verified`;
- positive proof word:
  - `study`;
- negative controls:
  - `da`;
  - `dam`;
  - `damage`;
  - `mode`;
  - `xyz`.

DA is `canon_locked` under the separately reviewed bounded functional
scope.

DI remains `runtime_verified`.

## Claim boundary

Canonical profile membership does not establish:

- historical derivation;
- historical transmission;
- earliest origin;
- language ownership;
- language superiority;
- a single winner;
- candidate truth;
- scientific proof;
- publication proof.

The existing runtime projection remains bounded functional lexical evidence.

The user decides.

## Proof-word boundary

Positive and negative words in the profile are contract metadata for future
shared testing and data-driven smoke execution.

This PR does not modify the live-smoke runner.

The existing smoke script remains authoritative for executable live-smoke
behavior until a separate reviewed data-driven smoke PR migrates it.

## Scalability boundary

A future operator should be able to add one profile that references:

- one existing reviewed source row;
- existing readiness;
- existing authorization;
- explicit production membership;
- existing runtime projection.

The profile must not require a new runtime branch.

The third-operator scalability proof remains a later lane.

## Scope

This PR adds:

- `src/shared/canonicalOperatorProfile.v0_1.ts`;
- `tests/canonicalOperatorProfile.v0_1.spec.ts`;
- this contract document.

This PR does not modify:

- reviewed source rows;
- citations;
- source-row status;
- functional readiness logic;
- runtime authorization logic;
- production membership;
- runtime projection;
- RootMap;
- API output;
- UI behavior;
- live-smoke execution;
- candidate ranking;
- historical-origin policy.

## Acceptance criteria

The contract is accepted when:

- DA and DI are represented by the same profile type;
- both reference existing source IDs;
- readiness is derived from the existing readiness builder;
- authorization is derived from the existing authorization evaluator;
- production membership is derived from the existing membership function;
- runtime projection is derived from the existing projection function;
- unknown source IDs fail closed;
- profiles contain no duplicated citation or runtime evidence fields;
- DA is `canon_locked` under bounded functional lexical projection;
- DI remains `runtime_verified`;
- the full repository gate passes.
