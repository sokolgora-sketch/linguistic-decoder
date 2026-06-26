# Live analyze-v1 Embryo-First Candidate Output Contract v0.1 — Review

Status: LIVE_ANALYZE_V1_EMBRYO_FIRST_CANDIDATE_OUTPUT_CONTRACT_REVIEWED_ACCEPTED_READY_FOR_IMPLEMENTATION.

Project lane: Open Instrument / ZËRO.

Reviewed on: 2026-06-26.

Reviewed contract:

* `docs/open-instrument/live-analyze-v1-embryo-first-candidate-output-contract-v0.1.md`

Reviewed from main:

* Short SHA: `b10c6c8e`
* Full SHA: `b10c6c8e2bb315da90820393e03061a1df75a0ea`

## Review decision

Accepted.

The live `/api/analyze-v1` embryo-first candidate output contract v0.1 is accepted as the implementation target for the next Open Instrument lane.

The contract correctly moves candidate output away from old ambiguous `strong/pass`-style display and toward explicit claim typing, validation posture, rank grouping, and claim boundaries.

## Why this review accepts the contract

The contract preserves the accepted embryo-first milestone:

* ZËRO does not rank historical origin.
* ZËRO does not declare a single winner.
* ZËRO performs embryo surgery on a word.
* Candidate ordering is based on smallest validated functional embryo and clearest motivation chain.
* Historical transmission and functional motivation remain separate axes.
* Known or suspected loanword status is context only.
* User interpretation remains final.

## Accepted output fields

The review accepts these required candidate-facing fields as the v0.1 implementation target:

* `candidateId`
* `displayForm`
* `candidateLanguage`
* `claimType`
* `originClaim`
* `historicalRelation`
* `embryo`
* `embryoSize`
* `embryoLanguage`
* `isolatedStandaloneForm`
* `plainStandaloneGloss`
* `sourceNote`
* `segmentation`
* `semanticBridge`
* `expansionChain`
* `validationOutcome`
* `validationReasons`
* `rankGroup`
* `rankScore`
* `rankReason`
* `claimBoundary`
* `userDecisionPosture`

## Accepted claim-type posture

The accepted `claimType` posture is:

* `functionalMotivation`
* `historicalTransmission`
* `surfaceResonance`
* `seedPairing`
* `unresolved`
* `notEvaluated`

This prevents candidate display from collapsing different kinds of findings into one misleading confidence label.

## Accepted origin posture

The accepted default origin posture for live embryo-first candidates is:

* `originClaim: "not_claimed"`

Historical information may be exposed as context, but it must not become the rank center unless a future explicit historical-transmission lane provides evidence and claim boundaries.

## Accepted rank order

The accepted rank-group order is:

1. `validatedFunctionalMotivation`
2. `partialFunctionalMotivation`
3. `surfaceOrSeedOnly`
4. `historicalContextOnly`
5. `unresolved`

Historical origin must not outrank functional motivation.

Known borrowing must not disqualify functional motivation.

A smaller embryo with no isolation proof must not outrank a larger embryo with strong isolation proof.

## Accepted SEED boundary

Accepted.

SEED candidates must not bypass the truth wall.

A `sourceKind: SEED` candidate is not automatically validated.

A SEED candidate without `isolatedStandaloneForm` and `sourceNote` cannot be fully validated as `functionalMotivation`.

## Accepted damage boundary

Accepted.

Damage output must not merely show Latin `damnum` and Albanian `dëm` as `strong/pass`.

Damage may expose embryo-first possibilities such as `DA`, `DAM`, and `DAMAGE`, but full functional validation requires isolated standalone embryo evidence and a source note.

This does not prove Albanian origin.

This does not disprove Latin transmission.

This does not make a winner claim.

## Accepted study boundary

Accepted.

Study output must not only show Latin `studium` and Albanian `studim` as `strong/pass`.

Study must expose the smallest meaningful embryo and expansion path when available.

A candidate that explains a smaller functional unit with clear isolation proof may rank above a larger opaque form.

No origin winner is claimed.

## Implementation boundary

This review does not implement the contract.

This review does not change API behavior.

This review does not change engine behavior.

This review does not change UI behavior.

This review does not mutate fixtures.

This review does not execute providers or model calls.

This review only accepts the contract and clears the next implementation lane.

## Validation proof

The review lane must preserve the reviewed regression harnesses:

* `npm test -- tests/openInstrument.analyzeV1StableFingerprintFixtureRegression.v0.1.spec.ts --runInBand`
* `npm test -- tests/openInstrument.analyzeV1StableRegressionFingerprintHarness.v0.1.spec.ts --runInBand`
* `npm test -- tests/openInstrument.postSsotWordRegressionPack.v0.1.spec.ts --runInBand`
* `npm run gate:quick`

## Final review posture

The contract is reviewed.

The contract is accepted.

The contract is ready for implementation.

## Next accepted task

`test(open-instrument): implement live analyze-v1 embryo-first candidate output contract v0.1`
