# DI Canon-Lock Transition Review v0.1

Status: IMPLEMENTED_PENDING_REVIEW.

Decision:

- transition DI from `runtime_verified` to `canon_locked`.

Admitted scope:

- `bounded_functional_lexical_projection`.

## Readiness basis

PR #1734 recorded:

- `READY_FOR_DEDICATED_TRANSITION`.

The accepted proof set covers:

- `di` through `exact`;
- `studim` through `exact`;
- `study` through `y_to_i`;
- evidence absence for `dij`, `dije`, and `dit`;
- DA cross-operator isolation;
- unrelated-input isolation;
- citation isolation;
- rollback, revision, supersession, and deprecation requirements.

## Machine implementation

The transition changes exactly two machine-readable governance values:

1. explicit canon-lock admission expands from:
   - `DA`
   to:
   - `DA`;
   - `DI`;

2. DI lifecycle changes from:
   - `runtime_verified`
   to:
   - `canon_locked`.

DA remains `canon_locked`.

## Admission result

The DI admission evaluator must return:

- admission version:
  `canonical-operator-canon-lock-admission.v0_1`;
- operator ID:
  `DI`;
- source ID:
  `reviewed.external.di.knowledge.candidate.v0_1`;
- admitted:
  `true`;
- admitted scope:
  `bounded_functional_lexical_projection`;
- rollback lifecycle:
  `runtime_verified`;
- reasons:
  empty.

## Preserved source and runtime truth

No change is made to:

- reviewed source-row identity;
- citation metadata;
- isolated form:
  `di`;
- bounded function:
  `know / knowledge functional motivation`;
- functional readiness;
- machine runtime authorization;
- production membership;
- runtime projection;
- runtime evidence text.

## Preserved operation and carrier truth

Allowed reviewed-evidence operations remain:

- `exact`;
- `y_to_i`.

Allowed reviewed-evidence carrier forms remain:

- `di`.

Evidence remains withheld for:

- `dij`;
- `dije`;
- `dit`.

The weak-carrier warning for `dit` remains visible.

## Proof metadata continuity

Positive proof words remain:

- `di`;
- `study`;
- `studim`.

Negative controls remain:

- `da`;
- `dam`;
- `damage`;
- `mode`;
- `xyz`;
- `dij`;
- `dije`;
- `dit`.

## Deliberately superseded current-state assertions

Current machine-state contracts are updated where they previously required:

- DI lifecycle:
  `runtime_verified`;
- DI admission:
  false;
- admission reason:
  `operator_not_explicitly_admitted`;
- exactly one `canon_locked` profile.

Historical readiness and transition documents remain historical records.

## Reusable-framework boundary

No DI-specific RootMap branch is added.

No new runtime registry is added.

No evidence-policy exception is added.

The transition uses the same canonical profile, admission evaluator, source
registry, readiness, authorization, membership, runtime projection, and
profile-backed live-smoke pipeline already used by DA.

## Rollback and deprecation

Governance-only rollback returns DI to:

- `runtime_verified`.

Revision, supersession, revocation, and deprecation remain governed by the
existing canon-lock admission contract.

## Claim-boundary preservation

The transition preserves:

- historical origin:
  `not_claimed`;
- winner:
  `not_claimed`;
- language superiority:
  `not_claimed`;
- user decision:
  `user_decides`.

It adds no historical-transmission, borrowing-direction, ownership,
candidate-truth, scientific-evidence, or publication-evidence claim.

## Review status

Before merge, this lane requires:

- exact scoped diff review;
- focused transition tests;
- production live smoke;
- full `npm run gate:quick`;
- GitHub checks;
- one-parent squash merge;
- post-merge focused proof;
- post-merge production live smoke;
- post-merge full gate;
- DF_BRAIN synchronization.
