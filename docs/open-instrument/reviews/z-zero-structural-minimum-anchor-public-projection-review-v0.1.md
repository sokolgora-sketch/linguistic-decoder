# ZË-RO structural minimum-anchor and public projection review v0.1

Date: 2026-08-26

Status: Z_ZERO_STRUCTURAL_MINIMUM_ANCHOR_PUBLIC_PROJECTION_REVIEWED_ACCEPTED_READY_FOR_RED_TESTS.

## Review decision

Accepted.

## Evidence motivating the refinement

Corpus inspection showed that the prior two-operation support rule still emitted broad terminals including:

- UDY
- ATH
- ILOSOPHY
- ATHEMAT
- ANGU
- ERR
- IST

The inspected minimum terminal sizes separate these from the current grammar-floor anchors.

Grammar-floor examples:

- ER = 2
- YË = 2
- AM = 2
- AK = 2

Non-floor examples:

- UDY = 3
- ATH = 3
- ERR = 3
- IST = 3
- ANGU = 4
- ATHEMAT = 7
- ILOSOPHY = 8

## Accepted architecture

The review accepts two independent gates.

### Gate 1 — minimum structural family anchor

A family must reach the existing structural grammar floor of two symbols before it becomes an emitted structural hypothesis family.

Larger sibling hypotheses may remain only when the same family has a valid size-2 anchor.

This preserves ER + ERILE for STERILE.

### Gate 2 — public gap-filling projection

An emit-eligible structural family is projected into the public candidate list only when the baseline deterministic result would otherwise be Null.

Stronger reviewed/canonical/RootMap output remains publicly authoritative.

## Important consequence

DAMAGE may internally retain structural AM while its public candidate surface remains unchanged because reviewed DA already owns the result.

GJAK may expose AK if its baseline remains Null because AK reaches the same generic size-2 structural floor.

Neither result assigns lexical meaning.

## Negative-control refinement

The live TERROR test must not require ERR to survive.

The established safety requirement is that TERROR does not leak ER or TER and never performs TERR → TER.

## Claim boundary

Unknown remains valid.

Null remains valid.

No historical origin is claimed.

No candidate truth is claimed.

No reviewed evidence is manufactured.

No single winner is introduced.
