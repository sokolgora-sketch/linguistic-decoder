# Open Instrument — Canonical Operator Canon-Lock Admission Contract v0.1

## Status

Definition contract only.

This document defines the admission, review, transition, revision, revocation,
and deprecation requirements for the canonical operator lifecycle state:

- `canon_locked`.

This document does not change any operator lifecycle value.

DA and DI remain:

- `runtime_verified`.

Neither operator becomes:

- `canon_locked`.

## Purpose

`runtime_verified` and `canon_locked` are different governance states.

`runtime_verified` proves that a reviewed functional operator can safely and
deterministically participate in bounded production runtime behavior.

`canon_locked` means the operator has additionally been accepted as a reusable
implementation reference for future operator scaling.

Canon lock is operational governance inside Open Instrument.

Canon lock does not establish:

- historical origin;
- historical transmission;
- linguistic ownership;
- earliest attestation;
- candidate truth;
- winner status;
- language superiority.

The user-decision posture remains:

- `user_decides`.

## Existing runtime-verified requirements

Before canon lock can be considered, an operator must already:

1. reference exactly one reviewed source row;
2. match the source-row embryo and language;
3. pass functional lexical readiness;
4. pass machine-readable runtime authorization;
5. match the bounded authorization scope;
6. hold explicit production membership;
7. emit a non-null runtime projection;
8. preserve source ID, candidate ID, embryo, and isolated-form identity;
9. preserve bounded claim boundaries;
10. define non-empty positive proof words;
11. define non-empty negative control words;
12. prevent overlap between positive and negative proof words;
13. prevent cross-operator citation leakage;
14. pass focused contracts;
15. pass production live smoke;
16. pass the repository gate.

Satisfying these requirements proves:

- `runtime_verified`.

It does not automatically prove:

- `canon_locked`.

## Canon-lock admitted scope

Every canon-lock decision must state the exact admitted scope.

The current available scope is:

- `bounded_functional_lexical_projection`.

A canon-lock decision under this scope means:

- the operator is accepted as a reusable reference for bounded functional
  lexical projection;
- the operator may be used to guide future implementation architecture;
- the operator remains subject to all not-claimed boundaries.

It does not mean:

- unrestricted historical canon;
- universal etymological truth;
- unrestricted semantic identity across all words;
- permission to infer origin from runtime visibility.

No operator may be canon locked without an explicit admitted scope.

## Additional canon-lock admission requirements

In addition to all `runtime_verified` requirements, canon lock requires the
following reviewed evidence.

### 1. Stable functional identity

The operator must have:

- a stable embryo;
- a stable bounded lexical function;
- a reviewed isolated standalone form;
- a reviewed plain standalone gloss;
- no unresolved identity collision that invalidates the admitted scope.

### 2. Boundary stability

The operator must explicitly preserve applicable boundaries for:

- derivatives;
- inflected or expanded forms;
- homophones;
- false friends;
- carrier-only matches;
- phonetic-only matches;
- unrelated inputs;
- cross-operator matches.

A derivative or related form must not silently become isolated evidence.

A homophone must not inherit evidence from a different lexical function.

### 3. Source authority appropriate to scope

The source authority must be sufficient for the admitted scope.

For bounded functional lexical projection, the source must support:

- the isolated operator form;
- the bounded lexical function;
- a reviewable locator;
- stable citation identity;
- reviewed acceptance.

A stronger historical-authority source is not required unless the admitted
scope includes stronger historical claims.

Unresolved stronger-source limitations must remain documented.

### 4. Runtime stability

The operator must have stable proof that:

- positive proof words expose the expected reviewed evidence;
- negative controls do not expose that evidence;
- runtime projection is deterministic;
- claim boundaries remain unchanged;
- citation identity remains isolated;
- production live smoke passes.

### 5. Coverage sufficiency

A canon-lock review must justify why the current positive and negative proof
sets are sufficient for the admitted scope.

There is no universal minimum word count.

The review must instead prove coverage of the relevant risks, including:

- direct operator use;
- bounded derived use where applicable;
- cross-operator controls;
- unrelated-input controls;
- known false-positive risks.

### 6. Reusable-process proof

The operator must prove the reusable path:

1. reviewed source row;
2. readiness;
3. machine authorization;
4. production membership;
5. runtime projection;
6. canonical profile;
7. shared canonical assertions;
8. specialized edge assertions;
9. profile-backed live smoke;
10. governance review.

The operator must not depend on bespoke runtime branching that bypasses the
shared canonical framework.

### 7. Revision policy

A canon-locked operator may be revised only through a separate reviewed lane.

A revision must state:

- current profile version;
- proposed profile version;
- exact changed fields;
- evidence that triggered the revision;
- affected proof words;
- affected negative controls;
- affected source rows;
- compatibility impact;
- runtime-output impact;
- required regression tests;
- rollback procedure.

Silent mutation is forbidden.

### 8. Supersession policy

A later source or profile may supersede an earlier one only when the review
records:

- superseding source or profile identity;
- superseded source or profile identity;
- reason for supersession;
- retained historical traceability;
- migration requirements;
- runtime impact;
- claim-boundary impact.

Supersession must not erase prior evidence history.

### 9. Revocation and deprecation policy

Canon lock is reversible.

An operator must be moved away from `canon_locked` when a reviewed finding
shows that the admitted scope is no longer safe or supportable.

Possible transition targets include:

- `runtime_verified`;
- `production_member`;
- `machine_authorized`;
- `functionally_ready`;
- `candidate`;
- `deprecated`.

A revocation or deprecation review must state:

- trigger;
- evidence;
- target lifecycle state;
- production-membership action;
- runtime-projection action;
- proof-word action;
- documentation action;
- rollback or remediation path.

`deprecated` preserves historical traceability but disallows current canonical
use.

### 10. Transition authority

A lifecycle mutation to `canon_locked` requires a dedicated reviewed PR.

That PR must include:

- an operator-specific readiness review;
- an explicit admitted scope;
- all admission evidence;
- exact lifecycle edit;
- contract-test updates;
- live-smoke proof;
- full-gate proof;
- post-merge verification;
- DF_BRAIN update.

A documentation-only review cannot mutate lifecycle state.

## Claim-boundary lock

Canon lock must preserve:

- `historicalOriginClaim = not_claimed`;
- historical transmission not claimed;
- `winnerClaim = not_claimed`;
- `languageSuperiorityClaim = not_claimed`;
- candidate truth not claimed;
- `userDecisionPosture = user_decides`.

Canon lock must never be presented as historical proof.

## Fail-closed admission rule

Canon lock must be rejected when any of the following is absent or unresolved:

- admitted scope;
- runtime-verified prerequisites;
- stable functional identity;
- boundary stability;
- source authority appropriate to scope;
- runtime stability;
- coverage justification;
- reusable-process proof;
- revision policy;
- supersession policy;
- revocation/deprecation policy;
- lifecycle-transition authority;
- claim-boundary preservation.

## DA and DI boundary in this lane

This contract does not decide or mutate final lifecycle status.

The companion readiness review records the evidence presently available for:

- DA;
- DI.

Both remain:

- `runtime_verified`.

Neither is changed to:

- `canon_locked`.

## Acceptance criteria

This definition lane is accepted when:

- `runtime_verified` and `canon_locked` are explicitly distinguished;
- admitted scope is mandatory;
- source-authority requirements are scope-aware;
- functional and boundary stability requirements are explicit;
- runtime and coverage requirements are explicit;
- revision and supersession rules are explicit;
- revocation and deprecation rules are explicit;
- transition authority is explicit;
- all claim boundaries remain locked;
- DA and DI remain unchanged;
- no runtime, API, UI, RootMap, source-row, membership, or projection behavior
  changes.
