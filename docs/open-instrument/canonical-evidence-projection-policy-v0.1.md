# Open Instrument — Canonical Evidence Projection Policy v0.1

## Status

Definition contract only.

This document defines the boundary between:

1. token discovery;
2. canonical operator identity;
3. reviewed evidence projection;
4. canonical lifecycle status.

This document does not implement the runtime policy.

## Problem statement

The current RootMap projection path can discover a canonical operator through
multiple carrier operations.

Examples include:

- exact or untransformed matching;
- `final_swap`;
- `vowel_swap`;
- `y_to_i`;
- other bounded carrier operations.

The current runtime attachment seam associates reviewed functional evidence with
an embryo identity.

That means a transformed RootMap token may currently receive the same reviewed
evidence text as an exact or directly supported match.

The canonical framework must distinguish:

- finding an operator-shaped token;
- proving that the current match is allowed to carry reviewed evidence.

Token discovery is not reviewed-evidence authorization.

## Core invariant

A RootMap token may remain visible even when reviewed evidence projection is
withheld.

The required separation is:

- token present does not automatically mean reviewed evidence projected;
- reviewed evidence projected does not establish historical origin;
- canon lifecycle does not authorize every carrier operation;
- canon lock does not bypass the evidence-operation policy.

## Policy owner

The evidence-operation policy must be owned by reviewed source truth or by a
machine-readable owner derived directly from reviewed source truth.

The RootMap builder must not contain DA-specific, DI-specific, or future
operator-specific branches.

The runtime must evaluate a generic policy.

A reviewed source must explicitly declare which carrier operations may project
its reviewed functional evidence.

The intended machine-readable concept is:

- `allowedEvidenceOps`.

The final implementation may use an equivalent precise name, but it must retain
the same ownership and fail-closed semantics.

## Fail-closed rule

Reviewed evidence must not project when:

- no operation policy exists;
- the observed operation is missing or cannot be classified;
- the observed operation is not explicitly allowed;
- the source row does not resolve;
- runtime authorization fails;
- production membership fails;
- the runtime projection is absent;
- source or embryo identity does not match.

An unknown operation must not inherit reviewed evidence by default.

## Operation classification

The implementation must distinguish at least:

- exact or untransformed evidence-bearing matches;
- explicitly admitted normalized matches;
- weak transformed matches;
- unsupported or unknown matches.

An operation being valid for token discovery does not automatically make it
valid for reviewed evidence projection.

## DA boundary

DA currently has reviewed bounded functional evidence for the isolated form:

- `da`

with split, divide, cut, or separate functional motivation.

The current positive proof set remains:

- `da`;
- `dam`;
- `damage`.

The later implementation lane must classify the evidence-bearing path for each
positive proof word.

The later implementation must explicitly prevent reviewed DA evidence from
projecting through disallowed weak operations, including:

- `final_swap`;
- `vowel_swap`.

Known transformed probes include:

- `mode`;
- `made`;
- `dome`.

These words may retain a DA-shaped RootMap token if the token-discovery engine
continues to produce one.

They must not receive reviewed DA evidence unless a reviewed source policy
explicitly permits the observed operation.

## DI boundary

DI remains:

- `runtime_verified`.

This policy does not promote DI to:

- `canon_locked`.

The current `study` path must be inspected and represented explicitly during
implementation.

If `y_to_i` remains evidence-bearing for DI, that permission must be declared by
the DI reviewed source policy.

It must not be inferred from a global exception.

## Damage boundary

The implementation lane must determine the exact carrier-operation
classification for:

- `damage`.

The current positive result must not be silently removed.

If the path is exact or untransformed, that classification must be explicit.

If the path is a bounded derived operation, that operation must be explicitly
authorized by the reviewed DA source policy.

## Negative-control semantics

Canonical operator controls must distinguish:

1. token-absence controls;
2. reviewed-evidence-absence controls.

For an evidence-absence control:

- the operator token may remain present;
- the exact reviewed source-specific evidence text must be absent.

The later implementation lane should add DA evidence-absence controls covering:

- `mode`;
- `made`;
- `dome`.

## Stale contract

The current test:

- `tests/apiAnalyzeV1.reviewedDaRuntimeProjection.wiring.v0_1.spec.ts`

uses:

- `mode`

as a positive reviewed-DA-evidence case.

That test accurately records the current runtime contract.

The later implementation PR must intentionally supersede that assertion.

It must not silently delete the test or conceal the behavior change.

The replacement contract must include:

- a true DA evidence-positive case;
- transformed DA token-presence proof where applicable;
- reviewed DA evidence-absence proof for disallowed operations.

## Status dimensions

The following dimensions remain separate:

### RootMap token status

Describes the token or carrier representation selected by RootMap.

### Reviewed evidence status

Describes whether reviewed source evidence exists and whether policy permits it
to project for the observed operation.

### Canon lifecycle status

Describes operator governance, including:

- `runtime_verified`;
- `canon_locked`.

A canon-locked operator may still have reviewed evidence withheld for a
disallowed carrier operation.

## Claim boundaries

This policy preserves:

- historical origin not claimed;
- historical transmission not claimed;
- earliest-attestation priority not claimed;
- linguistic ownership not claimed;
- winner status not claimed;
- language superiority not claimed;
- candidate truth not claimed;
- `user_decides`.

Withholding reviewed evidence does not reject the token hypothesis.

Projecting reviewed evidence does not establish historical derivation.

## Implementation sequence

A later implementation PR must:

1. add a machine-readable evidence-operation policy owner;
2. declare DA allowed evidence operations;
3. declare DI allowed evidence operations;
4. enforce the policy generically in RootMap evidence attachment;
5. fail closed for missing or unsupported operations;
6. preserve transformed token discovery;
7. supersede the stale `mode` positive-evidence contract;
8. add transformed-operation evidence-absence assertions;
9. preserve DA as `canon_locked`;
10. preserve DI as `runtime_verified`;
11. run focused contracts;
12. run production live smoke;
13. run the full repository gate.

## Scope boundary

This definition lane does not change:

- reviewed source rows;
- evidence text;
- citations;
- RootMap construction;
- carrier matching;
- operation generation;
- runtime projection;
- canonical profiles;
- readiness;
- authorization;
- production membership;
- lifecycle values;
- API output;
- UI behavior;
- live-smoke execution;
- proof-word lists;
- negative-control lists.

## Acceptance criteria

This policy definition is accepted when:

- token discovery and reviewed evidence projection are explicitly separated;
- evidence-operation ownership is source-driven;
- unknown or unsupported operations fail closed;
- the runtime implementation is required to remain generic;
- DA `final_swap` and `vowel_swap` evidence inheritance is identified for
  later correction;
- DI `y_to_i` treatment remains an explicit implementation decision;
- `damage` classification remains an explicit implementation requirement;
- stale `mode` evidence-positive behavior is documented for intentional
  supersession;
- status dimensions remain separate;
- DA remains `canon_locked`;
- DI remains `runtime_verified`;
- no runtime behavior changes in this PR.
