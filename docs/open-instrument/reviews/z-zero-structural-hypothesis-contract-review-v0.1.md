# ZË-RO structural hypothesis contract review v0.1

Date: 2026-08-25

Status: Z_ZERO_STRUCTURAL_HYPOTHESIS_CONTRACT_REVIEWED_ACCEPTED_READY_FOR_TESTS.

## Decision

Accepted.

The contract correctly separates:

1. deterministic structural discovery
2. functional support
3. reviewed evidence
4. production promotion
5. runtime verification
6. optional canon lock

## Accepted structural-hypothesis boundary

A structural hypothesis may exist before lexical or historical evidence.

A structural hypothesis must not invent an independent standalone meaning.

For the bounded ER posture:

- `embryo = ER`
- `claimType = structuralHypothesis`
- `independentStandaloneMeaning = null`
- `validationOutcome = not_evaluated`
- `rankGroup = structuralHypothesis`
- historical origin remains `not_claimed`
- candidate truth remains `not_claimed`
- user posture remains `user_decides`

## Existing architecture preserved

The review accepts reuse of:

- `analysisAdapter.ts` for candidate projection and ordering
- `analysisStatus.v0_1.ts` for aggregate `structural_unreviewed`
- existing reviewed functional evidence owners
- existing production and authorization owners

The review rejects using any of these as a shortcut:

- `protoRoots.v1.ts`
- canonical operator registration
- reviewed source-row registration

solely to make ER visible.

## Ranking

Accepted ordering:

1. validated functional motivation
2. partial functional motivation
3. deterministic structural hypothesis
4. surface or seed only
5. historical context only
6. unresolved

## Null

A defensible deterministic structural hypothesis must prevent aggregate discovery from collapsing to `null_no_supported_candidate`.

Null remains valid when no structural hypothesis survives.

## STERILE

`STERILE` remains the bounded proving case.

The desired chain:

`STERILE → STER → TER → ER`

is not yet authorized as runtime output.

Every reduction edge still requires a deterministic operation contract.

No STERILE-specific branch is allowed.

## Test authorization

This review authorizes contract tests only.

The tests must lock the structural-hypothesis truth state before the reduction engine is implemented.

Runtime implementation remains unauthorized until the RED contract is inspected.
