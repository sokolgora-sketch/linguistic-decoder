# Open Instrument — Reviewed Evidence Carrier-Scope Policy v0.1

Status: IMPLEMENTED_PENDING_REVIEW.

Project lane: Open Instrument / ZË-RO.

## Purpose

Reviewed source evidence may be attached only when both of these independent
conditions pass:

1. the matcher operation is explicitly admitted;
2. the selected carrier form is explicitly covered by the reviewed source.

An exact matcher operation does not prove that every exact proto-carrier form
was reviewed.

## Source-derived ownership

The existing machine-readable owner remains:

- `reviewedExternalLexiconEvidenceOperationPoliciesV0_1`

Each production source policy records:

- source ID;
- embryo;
- allowed evidence operations;
- allowed evidence carrier forms.

RootMap consumes the generic evaluation result.

RootMap does not contain DA-specific or DI-specific carrier conditions.

## Current DI carrier scope

Reviewed DI evidence is currently supported only through selected carrier:

- `di`

Permitted operations for that carrier are:

- `exact`;
- `y_to_i`.

Current evidence-positive runtime cases are:

- `di`;
- `study`;
- `studim`.

In all three cases, the selected carrier is `di`.

## Deferred or evidence-negative DI carriers

The following carriers may remain visible as token or carrier diagnostics, but
do not inherit the reviewed `di` citation:

- `dij`;
- `dije`;
- `dit`.

`dij` and `dije` require explicit source-backed classification before reviewed
evidence may be projected through those forms.

`dit` remains a weak carrier with possible semantic drift and is an explicit
reviewed-evidence absence control.

## DA preservation

Reviewed DA evidence remains limited to carrier:

- `da`

with operation:

- `exact`.

The bounded `damage` empty-operation path remains exact-equivalent only when
normalized segment and carrier form are both `da`.

## Fail-closed conditions

Reviewed evidence is withheld when:

- no source policy exists;
- the policy embryo differs from the requested embryo;
- the operation is missing and cannot be classified;
- the operation is unsupported;
- the operation is not admitted;
- the carrier form is missing;
- the carrier form is not admitted.

Token discovery is preserved when reviewed evidence is withheld.

## Lifecycle boundary

DA remains:

- `canon_locked`.

DI remains:

- `runtime_verified`.

This policy does not admit DI to canon lock.

A separate reassessment is required after carrier-scope behavior is merged and
verified.

## Claim boundary

This policy does not establish:

- historical origin;
- historical transmission;
- earliest attestation;
- linguistic ownership;
- candidate truth;
- winner status;
- language superiority;
- scientific evidence;
- publication evidence.

The user-decision posture remains:

- `user_decides`.
