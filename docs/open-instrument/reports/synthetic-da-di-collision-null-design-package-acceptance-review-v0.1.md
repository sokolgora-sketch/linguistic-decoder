# Synthetic DA/DI Collision and Null Design-Package Acceptance Review v0.1

Status: `ACCEPTANCE_REVIEW_DECISION_ONLY`

Project: ZË-RO / Open Instrument
Date recorded: 2026-07-16

Repository base:

- `322592099d609512f5b62a5352fc80f228cfec7c`

Reviewed merged package:

- `docs/open-instrument/reports/synthetic-da-di-collision-null-design-package-v0.1.md`
- `tests/syntheticDaDiCollisionNullDesignPackage.contract.v0_1.spec.ts`

## Decision

Inspection decision input:

- `SYNTHETIC_DA_DI_COLLISION_NULL_DESIGN_PACKAGE_ACCEPTABLE_FOR_IMPLEMENTATION_PROPOSAL`

Acceptance-review result:

- `SYNTHETIC_DA_DI_COLLISION_NULL_DESIGN_PACKAGE_ACCEPTED_FOR_IMPLEMENTATION_PROPOSAL`

Next accepted lane:

- `DESIGN_SYNTHETIC_DA_DI_COLLISION_NULL_IMPLEMENTATION_PROPOSAL_V0_1`

Explicitly not authorized:

- `SYNTHETIC_DA_DI_COLLISION_NULL_RUNTIME_OR_BASELINE_IMPLEMENTATION`
- `DIRECT_SYNTHETIC_PROBE_IMPLEMENTATION`
- `CANONICAL_OPERATOR_REUSE_MATRIX_EXTENSION`
- `REVIEWED_VOCABULARY_EXPANSION`

This decision accepts the exact merged design package as sufficiently specified
for a separate design-only implementation proposal.

It does not implement a corpus owner, alter discovery, extend the current reuse
matrix, change canonical profiles, or authorize any probe as lexical evidence.

## Accepted package identity

Canonical surfaces:

- `da`
- `di`

Canonical operators:

- `DA`
- `DI`

Probe posture:

- `SYNTHETIC_BOUNDARY_PROBE_ONLY`
- `NO_LEXICAL_CLAIM`
- `NO_SEMANTIC_CLAIM`
- `NO_FUNCTIONAL_EMBRYO_CLAIM`

Canonical vowel posture:

- `A`
- `E`
- `I`
- `O`
- `U`
- `Y`
- `Ë`
- `Y_IS_A_CANONICAL_VOWEL`
- `NO_CONSONANTAL_Y_MODE`

## Acceptance basis

The merged package is accepted for an implementation-proposal design because
the dedicated inspection established:

- parsed probes: `24`
- unique probes: `24`
- embedded candidate-only probes: `8`
- embedded exact-surface Null probes: `0`
- one-edit operation Null probes: `8`
- broad synthetic Null probes: `8`
- accepted candidate-only probes: `8`
- accepted Null probes: `16`
- reviewed-evidence leaks: `0`
- canonical-profile ownership collisions: `0`
- reuse-matrix ownership collisions: `0`
- determinism failures: `0`
- expectation mismatches: `0`
- acceptance failures: `0`

The inspection also confirmed:

- canonical profiles remain exactly `DA` and `DI`;
- both profiles remain `canon_locked`;
- the live reuse baseline remains `19` cases and `12` categories;
- no canonical-profile mutation occurred;
- no discovery-runtime mutation occurred;
- no reuse-matrix mutation occurred.

## Accepted control classes

### Embedded candidate-only controls

Accepted count:

- `8`

Required behavior:

- each control may expose only its recorded unreviewed DA or DI candidate;
- every control must retain zero reviewed-evidence eligibility;
- no control may become a positive proof word;
- no control may authorize lexical runtime projection.

### Embedded exact-surface Null controls

Accepted count:

- `0`

This is an explicit accepted Null set size, not a missing requirement.

The inspected deterministic generation grid produced no safe member for this
control class.

A later proposal must not invent one merely to make the class non-empty.

### One-edit operation Null controls

Accepted count:

- `8`

Required behavior:

- each selected control remains candidate-free;
- substitution, insertion, or deletion distance does not become an evidence
  operation;
- each selected control remains outside reviewed vocabulary.

### Broad synthetic Null controls

Accepted count:

- `8`

Required behavior:

- each selected control remains candidate-free;
- Null remains a valid result;
- no accidental resemblance to a natural-language word creates authority.

## Current machine truth

Canonical profiles:

- DA: `canon_locked`
- DI: `canon_locked`

Frozen operators:

- JO
- PO

Current reuse baseline:

- cases: `19`
- categories: `12`

Current reviewed vocabulary:

- unchanged

Current runtime discovery:

- unchanged

Current API and UI:

- unchanged

## Requirements for the implementation proposal

The next lane must remain design-only.

It must define the exact proposed architecture for:

1. a separate synthetic-probe corpus owner;
2. immutable probe identity and generation metadata;
3. deterministic candidate-only and Null expectation representation;
4. fail-closed evaluation;
5. machine-readable metrics;
6. separation from the live 19-case reuse matrix;
7. separation from canonical profile proof and control words;
8. separation from reviewed source rows and evidence authorization;
9. exact focused tests;
10. exact full-gate requirements;
11. rollback behavior;
12. future acceptance requirements before implementation.

The proposal must identify exact files that would change.

The proposal must not perform those changes.

## Required implementation boundaries

A future implementation proposal must preserve all of the following:

- no mutation of `src/shared/canonicalOperatorProfile.v0_1.ts`;
- no mutation of `src/shared/canonicalOperatorDiscovery.v0_1.ts`;
- no mutation of `src/shared/canonicalOperatorReuseMatrix.v0_1.ts`;
- no addition to positive proof words;
- no addition to negative control words;
- no reviewed source-row mutation;
- no evidence-operation mutation;
- no carrier-policy mutation;
- no DeepRoot mutation;
- no analysis-adapter mutation;
- no API mutation;
- no UI mutation;
- no live-smoke mutation unless separately authorized;
- no JO or PO work;
- no consonantal-Y interpretation.

## Fail-closed requirements

Any future synthetic-probe evaluator must reject or fail when:

- a probe enters canonical profile ownership;
- a probe enters the live reuse matrix unexpectedly;
- reviewed evidence becomes eligible;
- a candidate-only expectation changes;
- a Null expectation gains a candidate;
- repeated discovery becomes nondeterministic;
- selected probe identity changes without a new version;
- probe generation metadata is incomplete;
- lexical or semantic claims become active;
- prohibited runtime scope appears.

## Claim boundaries

Locked:

- `NO_LEXICAL_CLAIM`
- `NO_SEMANTIC_CLAIM`
- `NO_FUNCTIONAL_EMBRYO_CLAIM`
- `NO_HISTORICAL_ORIGIN_CLAIM`
- `NO_HISTORICAL_TRANSMISSION_CLAIM`
- `NO_BORROWING_DIRECTION_CLAIM`
- `NO_WINNER_CLAIM`
- `NO_LANGUAGE_SUPERIORITY_CLAIM`
- `NO_LINGUISTIC_OWNERSHIP_CLAIM`
- `NO_CANDIDATE_TRUTH_CLAIM`
- `NO_PUBLICATION_EVIDENCE_CLAIM`
- `NO_SCIENTIFIC_EVIDENCE_CLAIM`
- `USER_DECIDES`

Synthetic controls are test instruments only.

Accidental resemblance to a real word does not create lexical, functional,
semantic, historical, ownership, or candidate-truth authority.

## Prohibited changes in this lane

This acceptance-review lane does not modify:

- canonical operator profiles;
- canonical discovery;
- the 19-case reuse matrix;
- profile-driven reuse generation;
- reviewed source-row registries;
- operation or carrier policies;
- DeepRoot runtime;
- analysis adapters;
- API routes;
- UI components;
- live-smoke cases;
- language/variety runtime wiring;
- legacy compatibility owners;
- JO or PO state.

## Scope conclusion

The exact merged synthetic DA/DI collision and Null design package is accepted
as input to a separate implementation-proposal design.

Acceptance does not equal implementation authorization.

Null remains valid.

The user remains the decision-maker.

## Next

`DESIGN_SYNTHETIC_DA_DI_COLLISION_NULL_IMPLEMENTATION_PROPOSAL_V0_1`
