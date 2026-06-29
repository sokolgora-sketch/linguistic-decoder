# Reviewed external lexicon source row fixture contract review v0.1

Status: REVIEWED_EXTERNAL_LEXICON_SOURCE_ROW_FIXTURE_CONTRACT_V0_1_REVIEWED_ACCEPTED_READY_FOR_VALIDATOR_FIXTURE_INTEGRATION.

Reviewed on: 2026-06-29.

## Reviewed artifacts

Fixture contract files:

* `tests/fixtures/openInstrument/reviewedExternalLexiconSourceRows.fixture.v0_1.ts`
* `tests/reviewedExternalLexiconSourceRow.fixtureContract.v0_1.spec.ts`

Base commit:

* Short SHA: `19e4ef88`
* Full SHA: `19e4ef88a09b831afc8b300da265d18c9d92ab03`
* Subject: `test(open-instrument): add reviewed external lexicon source row fixture contract v0.1`

Prior contract basis:

* `docs/open-instrument/reviewed-external-lexicon-source-row-contract-v0.1.md`
* `docs/open-instrument/reviews/reviewed-external-lexicon-source-row-contract-review-v0.1.md`

## Review decision

Accepted.

The reviewed external lexicon source row fixture contract v0.1 is accepted as a test-only fixture boundary.

It is ready for the next validator fixture integration lane.

## Why accepted

The fixture contract is accepted because it creates synthetic contract-test-only rows without creating live evidence.

The fixtures are marked as:

* `CONTRACT TEST ONLY`
* `fixture.synthetic.*`
* `fixture://*`

This prevents the fixture rows from being confused with production source rows or live reviewed citations.

## Scope confirmed

This lane added test fixture contract files only.

It did not add:

* runtime source registry
* production source rows
* live citations
* provider output
* model output
* replay output
* API behavior
* UI/VM behavior
* origin claim
* winner claim
* `DA` promotion
* `DI` promotion

## Fixture rows reviewed

The fixture contract defines four synthetic rows:

* `fixture.synthetic.reviewed-di.v0_1`
* `fixture.synthetic.seed-row.v0_1`
* `fixture.synthetic.da-derivative-trap.v0_1`
* `fixture.synthetic.da-homophone-trap.v0_1`

Review finding:

The row set is appropriate for the next validator fixture integration lane because it includes one positive synthetic `DI` row and three boundary/trap rows.

## Shape review

Accepted.

The fixture contract locks exact source row keys.

The fixture contract locks exact citation keys.

The test proves every fixture row exposes exactly one citation.

Review finding:

The fixture shape matches the reviewed source-row contract boundary closely enough for test-only integration.

## Claim-boundary review

Accepted.

Every fixture row preserves:

* `originClaim: false`
* `historicalTransmissionClaim: false`
* `winnerClaim: false`
* `languageSuperiorityClaim: false`
* `candidateTruthClaim: false`
* `publicationEvidenceClaim: false`
* `scientificEvidenceClaim: false`
* `userDecisionPosture: user_decides`

Review finding:

The fixture contract preserves user decision posture and avoids creating origin, winner, scientific, publication, or truth claims.

## Synthetic DI fixture review

Accepted with boundary.

The synthetic reviewed `DI` row is allowed only as contract-test fixture data.

It must not be wired as live evidence.

It may be used in the next lane to prove that the validator can accept a fully reviewed synthetic row with:

* validating source kind
* `reviewed_accepted` source status
* reviewed accepted external citation
* attested form
* attested gloss
* locator
* semantic bridge
* false claim-boundary fields
* `user_decides`

Review finding:

This fixture is useful for proving the positive validator path without claiming that live `DI` evidence exists.

## SEED fixture review

Accepted.

The `SEED` row remains non-validating by:

* source kind: `SEED`
* source status: `review_pending`
* citation status: `present_unreviewed`
* citation type: `seed_row`

Review finding:

This fixture is appropriate for proving that seed rows cannot become external lexical proof.

## DA derivative trap review

Accepted.

The `DA` derivative trap row targets:

`albanian-da-dam-damage-functional`

but uses:

* embryo: `DA`
* isolated standalone form: `ndare`
* gloss: `divided`

Review finding:

This fixture is appropriate for proving that derivative evidence does not validate isolated `DA = split/divide`.

## DA homophone trap review

Accepted.

The `DA` homophone trap row targets:

`albanian-da-dam-damage-functional`

but uses:

* embryo: `DA`
* isolated standalone form: `da`
* gloss: `gave`

Review finding:

This fixture is appropriate for proving that `DA = gave` does not validate `DA = split/divide`.

## Issues found

No blocking issues found.

No runtime risk found because this lane is test-only.

No API risk found because no API files changed.

No UI/VM risk found because no UI/VM files changed.

No live evidence risk found because the rows are synthetic contract fixtures only.

## Required next boundary

The next lane should validate these fixture rows against the reviewed external lexicon evidence gate.

The next lane must prove:

* synthetic reviewed `DI` can pass the validator
* `SEED` blocks
* `DA` derivative trap blocks
* `DA` homophone trap blocks
* false claim-boundary fields are required
* `user_decides` is required
* fixture rows remain non-live
* no production source rows are added
* no live citations are added
* no `DA` promotion occurs
* no `DI` live promotion occurs

The next accepted task is:

`test(open-instrument): validate reviewed external lexicon source row fixtures against evidence gate v0.1`
