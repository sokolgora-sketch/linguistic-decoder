# Open Instrument moving-nucleus lifecycle reconciliation v0.1

Status: LIFECYCLE_STATUS_RECONCILIATION_ONLY.

Date: 2026-09-29.

This document reconciles current lifecycle interpretation for three immutable
moving-nucleus contract artifacts. It is non-scientific, non-runtime, and does
not replace or mutate the frozen contracts.

This ledger creates no moving-nucleus authority, no new research result, no
canonicalization policy, and no authorization for another implementation or
research stage.

## Immutable artifact identities

| Artifact | Bytes | SHA-256 | Historical marker | Current reconciled state | Current-state evidence |
| --- | ---: | --- | --- | --- | --- |
| `docs/open-instrument/moving-nucleus-additive-structural-contract-v0.1.md` | 10388 | `99c23091c9007271c9e7c7b52cf804338d0026233b6f5c870ebb7f6db887e4a0` | `FROZEN_CONTRACT_PENDING_REVIEW`; next stage `MOVING_NUCLEUS_ADDITIVE_STRUCTURAL_CONTRACT_REVIEW` | Review completed within bounded PR #2027 scope; additive representation merged | PR #2027 merge `331751e62db919cba23b9c24c90357a8810d12e1` |
| `docs/open-instrument/moving-nucleus-observation-authority-contract-v0.1.md` | 15192 | `76b42a3c825d980c9a0bc68c7bfcd8e094ab892567c454c66609c7910ecb10d3` | `FROZEN_CONTRACT_PENDING_REVIEW` | Review findings addressed within bounded PR #2028 scope; observation-authority implementation merged | PR #2028 merge `ce66c6f8f6223e44729e9e72b6c3c0a13008ebcd`; ZE-8 closure |
| `docs/open-instrument/moving-nucleus-observation-authority-contract-v0.1.1-addendum.md` | 6330 | `68283e37408242e057bc588575f2f50b60ae507ba0b6fb02b3914f1e89522cd3` | `FROZEN_CONTRACT_ADDENDUM_PENDING_IMPLEMENTATION`; original F1/F2/F3 pending scope | Bounded addendum-related repairs merged; artifact remains immutable | PR #2028 repair commits `2839871c` and `3ef3b9ef` |

The original hashes remain the authoritative identities of these artifacts.

## Structural-contract reconciliation

The additive structural artifact's pending-review and next-stage markers record
its pre-review lifecycle state. Git chronology establishes that the bounded
contract review occurred in the PR #2027 sequence and that the additive
structural representation was merged at:

`331751e62db919cba23b9c24c90357a8810d12e1`

No later invalidation, revert, or reopening authority was found. The old
markers must not be interpreted as an outstanding current review gate.

This does not mean that moving-nucleus runtime integration is complete or
authorized.

## Observation-authority reconciliation

The parent observation-authority artifact's pending-review marker records its
pre-review lifecycle state. The PR #2028 sequence addressed the recorded
review findings and merged the implementation at:

`ce66c6f8f6223e44729e9e72b6c3c0a13008ebcd`

The prior repair commits were:

- `2839871ca82093ef1704fcf4c119c8d33bbb5e96`;
- `3ef3b9ef10395dd14ae92228aa4a62d7fc89dcd5`.

ZE-8 subsequently reached Done. No later invalidation was found. The parent
artifact's pending-review marker is therefore historical, not a current
unsatisfied review gate.

## Addendum reconciliation

The addendum's `FROZEN_CONTRACT_ADDENDUM_PENDING_IMPLEMENTATION` marker and
its original F1/F2/F3 implementation-pending scope describe the lifecycle at
the time the addendum was authored. The bounded repairs were subsequently
implemented and merged through the PR #2028 repair sequence above.

This reconciliation does not expand the addendum's scope. It does not create
a complete precedence matrix, canonicalization policy, acoustic threshold,
diphthong or hiatus classifier, automatic Voice mapping, semantic
interpretation, Level-3/Level-4 authority, or production authority.

## F5 disposition

Inspection found no contradiction or ambiguity requiring a change to F5.
The exact F5 wording remains in the immutable addendum. In particular,
`aggregateStatus=SUPPORTED` may coexist with unresolved or unknown
non-supporting dimensions only under the surrounding requirements for a
positive component and no conflicted component. No F5 rewrite is made here.

## Preserved scientific and runtime boundaries

```text
MOVING_NUCLEUS_RESEARCH_ONLY=YES
RUNTIME_WIRING_AUTHORIZED=NO
REAL_OBSERVATION_PROVIDER_CREATED=NO
DIPHTHONG_CLASSIFIER_AUTHORIZED=NO
HIATUS_CLASSIFIER_AUTHORIZED=NO
ACOUSTIC_EXTRACTION_AUTHORIZED=NO
MOVEMENT_THRESHOLD_AUTHORIZED=NO
IPA_TO_VOICE_OBSERVATION_AUTHORITY_CREATED=NO
MOVING_NUCLEUS_CANONICALIZATION_AUTHORIZED=NO
USER_XY_CANONICALIZATION_HYPOTHESIS_IMPLEMENTED=NO
NEW_VOICE_CREATED=NO
LEVEL3_CHANGED=NO
LEVEL4_CHANGED=NO
SEMANTIC_AUTHORITY_CREATED=NO
SBR_CHANGED=NO
FRD02_CHANGED=NO
```

## Current lifecycle conclusion

```text
STRUCTURAL_CONTRACT_REVIEW=COMPLETED_WITHIN_BOUNDED_PR2027_SCOPE
STRUCTURAL_REPRESENTATION_IMPLEMENTATION=MERGED
OBSERVATION_AUTHORITY_REVIEW=COMPLETED_WITHIN_BOUNDED_PR2028_SCOPE
OBSERVATION_AUTHORITY_IMPLEMENTATION=MERGED
ADDENDUM_BOUNDED_REPAIRS=MERGED
MOVING_NUCLEUS_RUNTIME_INTEGRATION=NOT_AUTHORIZED
MOVING_NUCLEUS_CANONICALIZATION=NOT_AUTHORIZED
REPEAT_STRUCTURAL_CONTRACT_REVIEW_REQUIRED=NO
CURRENT_AUTHORIZED_NEXT_MOVING_NUCLEUS_STAGE=NONE
```

This ledger does not select a new technical milestone.
