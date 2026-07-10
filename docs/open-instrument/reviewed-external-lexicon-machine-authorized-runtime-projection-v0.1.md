# Reviewed External Lexicon Machine-Authorized Runtime Projection v0.1

Status: IMPLEMENTED_CONTRACT.

Project lane: Open Instrument / ZËRO.

## Purpose

This contract migrates reviewed lexical runtime projection away from mutable
promotion prose.

Runtime projection now requires both:

1. explicit production source-ID membership;
2. successful machine-readable functional runtime authorization.

## Removed authorization mechanism

The projection adapter no longer determines authorization by searching source
notes for these strings:

- `Production registry promotion accepted v0.1`
- `Production source row promotion accepted v0.1`

Those phrases may remain in historical source-row metadata, but they are no
longer runtime authorization inputs.

## Machine-readable projection gate

A row may project only when:

- its source ID is an explicit production member;
- functional lexical readiness passes;
- functional runtime authorization passes;
- source status remains reviewed and accepted;
- historical-origin claims remain disabled;
- historical-transmission claims remain disabled;
- winner claims remain disabled;
- language-superiority claims remain disabled;
- candidate-truth claims remain disabled;
- publication-evidence claims remain disabled;
- scientific-evidence claims remain disabled;
- user posture remains `user_decides`.

## DA continuity

The reviewed Gheg DA row remains the only production row.

DA projection output remains unchanged, including:

- source ID;
- candidate ID;
- embryo;
- isolated form;
- bounded gloss;
- source label;
- citation locator;
- DOI;
- claim-boundary text;
- user-decision posture.

Removing or changing DA promotion prose does not remove DA projection because
authorization is now machine-readable.

## DI boundary

DI remains:

- functionally ready;
- machine-authorized;
- outside explicit production membership;
- absent from reviewed runtime projection.

Calling the projection adapter directly with the DI candidate row still returns
`null` because DI is not a production member.

This PR does not make DI live.

## Fail-closed behavior

Projection returns `null` when:

- production membership is absent;
- functional authorization fails;
- lexical readiness fails;
- a candidate-truth claim is introduced;
- any protected claim boundary is violated.

## Runtime boundary

This PR does not:

- add DI to production membership;
- edit the DI source row;
- edit the DA source row;
- change RootMap logic;
- change API routing;
- change UI adapters;
- change public output;
- invent a DPEWA locator;
- reuse DA evidence for DI.

## Next lane

After this migration is merged and verified, the project may inspect the final
bounded DI production-membership lane.

That future lane must explicitly update DI’s stale blocker prose and tests
without turning functional lexical evidence into historical or candidate truth.

## Forbidden shortcuts

Do not:

- add DI to production membership in this PR;
- remove the explicit production-membership gate;
- weaken functional authorization;
- weaken claim-boundary checks;
- change DA evidence output;
- make route or UI adapters consume registry rows directly;
- treat lexical attestation as historical-origin proof.
