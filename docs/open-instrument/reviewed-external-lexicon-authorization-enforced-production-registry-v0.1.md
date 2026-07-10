# Reviewed External Lexicon Authorization-Enforced Production Registry v0.1

Status: IMPLEMENTED_CONTRACT.

Project lane: Open Instrument / ZËRO.

## Purpose

This contract makes machine-readable functional runtime authorization a
mandatory production-registry admission gate.

A source row may be returned by the production registry only when:

- its source ID is explicitly included in production membership; and
- its machine-readable functional runtime authorization passes.

## Existing DA continuity

The existing reviewed Gheg DA production row is added to the functional
runtime authorization allowlist.

This is necessary before enforcing authorization on production enumeration.

Without that atomic change, enforcing the new gate would accidentally remove
DA from production output.

DA continues to support only bounded functional lexical evidence.

No historical-origin, transmission, winner, superiority, publication,
scientific-evidence or candidate-truth claim is enabled.

## DI boundary

The reviewed DI source ID remains machine-authorized for a future bounded
functional projection lane.

DI remains outside explicit production membership in this PR.

Therefore:

- DI authorization passes;
- DI functional readiness passes;
- DI is not returned by the production registry;
- DI does not enter reviewed runtime projection;
- live output remains unchanged.

## Fail-closed production rule

Production enumeration now requires both:

1. explicit source-ID membership in `PRODUCTION_SOURCE_ROW_IDS_V0_1`;
2. `authorized: true` from the functional runtime authorization contract.

An allowlisted production ID whose authorization fails must not be returned.

## Runtime boundary

This PR does not:

- add DI to production membership;
- edit the DI source row;
- edit the DA source row;
- change runtime projection;
- remove projection prose-marker compatibility;
- change RootMap logic;
- change API or UI behavior;
- change live output.

## Claim boundary

Production authorization does not establish:

- historical derivation;
- borrowing direction;
- earliest origin;
- language ownership;
- language superiority;
- a historical winner;
- publication proof;
- scientific proof;
- candidate truth.

The user continues to decide.

## Next lane

After this contract is merged, the next lane may replace runtime projection
prose-marker dependence with machine-readable bounded authorization.

DI must remain outside production membership during that projection-adapter
migration.

## Forbidden shortcuts

Do not:

- add DI to `PRODUCTION_SOURCE_ROW_IDS_V0_1` in this PR;
- remove the explicit production membership allowlist;
- weaken functional readiness;
- weaken historical or truth guards;
- edit source-row prose to fake authorization;
- invent DPEWA evidence;
- reuse DA evidence for DI;
- change live output.
