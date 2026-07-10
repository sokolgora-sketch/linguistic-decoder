# Open Instrument — Canonical Operator Shared Assertions Contract v0.1

Status: IMPLEMENTED_PENDING_REVIEW.

Project lane: Open Instrument / ZË-RO.

## Purpose

This contract defines the guarantees that every canonical operator profile must
satisfy through one shared parameterized test.

The first profiles covered are:

- DA;
- DI.

This lane proves that the reusable canonical profile introduced in PR #1726 can
support common verification without replacing operator-specific evidence tests.

## Shared contract owner

The shared test is:

- `tests/canonicalOperatorSharedContract.v0_1.spec.ts`.

It is driven by:

- `canonicalOperatorProfilesV0_1`;
- `getResolvedCanonicalOperatorProfilesV0_1`.

The test does not maintain a separate DA/DI registry.

## Shared assertions

Every canonical operator profile must:

1. reference exactly one existing reviewed source row;
2. match that source row’s embryo and language;
3. pass functional lexical readiness;
4. pass machine-readable runtime authorization;
5. match the configured bounded authorization scope;
6. hold explicit production membership;
7. emit a non-null runtime projection;
8. preserve source ID, candidate ID, embryo, and isolated form identity;
9. preserve bounded claim boundaries;
10. remain `runtime_verified`;
11. remain outside `canon_locked` until the later review lane;
12. define non-empty positive proof words;
13. define non-empty negative control words;
14. avoid overlap between its positive and negative proof lists;
15. prevent cross-operator citation leakage.

## Claim-boundary lock

Each runtime projection must retain:

- `historicalOriginClaim=not_claimed`;
- `winnerClaim=not_claimed`;
- `languageSuperiorityClaim=not_claimed`;
- `userDecisionPosture=user_decides`.

The shared contract does not claim:

- historical derivation;
- borrowing direction;
- earliest origin;
- language ownership;
- language superiority;
- a single winner;
- candidate truth;
- publication proof;
- scientific proof.

## Cross-operator isolation

DA projection must contain DA citation identity and must not contain DI citation
identity.

DI projection must contain DI citation identity and must not contain DA citation
identity.

The shared contract validates source isolation at the runtime-projection layer.

Live API and RootMap isolation remain covered by the existing operator-specific
tests.

## Operator-specific tests remain authoritative

The following details remain intentionally specialized.

### DA-specific proof

Existing DA tests continue to own:

- Dedvukaj and Ndoci citation details;
- DOI identity;
- Example (4) locator;
- `da`, `dam`, and `damage` behavior;
- bounded DA `minRoots` behavior;
- DA RootMap evidence behavior.

### DI-specific proof

Existing DI tests continue to own:

- Albanian DI locator;
- know / knowledge wording;
- `study` RootMap behavior;
- absence of DA DOI;
- unresolved direct DPEWA/FGJSH stronger-authority boundary;
- DI absence on unrelated inputs.

No existing specialized test is deleted or weakened in this PR.

## Why there is no shared helper yet

The current duplication is small enough for one direct parameterized Jest
contract.

A helper abstraction is deferred because:

- the current shared behavior fits in one test file;
- a helper would add another test API before a third operator exists;
- direct assertions remain easier to inspect;
- the third-operator lane can determine whether a helper is justified.

## Runtime boundary

This PR changes tests and documentation only.

It does not modify:

- canonical profile data;
- reviewed source rows;
- citations;
- functional readiness;
- runtime authorization;
- production membership;
- runtime projection;
- RootMap;
- API output;
- UI behavior;
- live-smoke execution;
- candidate ranking;
- historical-origin policy.

## Canon lifecycle boundary

DA and DI remain:

- `runtime_verified`.

They are not promoted to:

- `canon_locked`.

The later data-driven smoke and canon-review lanes must close before that
promotion can be considered.

## Acceptance criteria

This contract is accepted when:

- one shared parameterized test covers all registered canonical profiles;
- the test derives truth through the existing profile resolver;
- no duplicate source registry is introduced;
- readiness, authorization, membership, and projection are verified;
- claim boundaries are verified;
- cross-operator citation leakage is rejected;
- positive and negative proof metadata is validated;
- existing specialized DA/DI tests remain unchanged;
- no production files change;
- the full repository gate passes.
