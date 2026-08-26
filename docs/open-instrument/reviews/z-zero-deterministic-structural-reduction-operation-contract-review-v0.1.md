# ZË-RO deterministic structural reduction operation contract review v0.1

Date: 2026-08-25

Status: Z_ZERO_DETERMINISTIC_STRUCTURAL_REDUCTION_OPERATION_CONTRACT_REVIEWED_ACCEPTED_READY_FOR_RED_TESTS.

## Decision

Accepted for RED contract testing.

## Accepted operations

v0.1 authorizes exactly two structural-discovery operations:

1. `peel_right_vowel_led_expansion`
2. `peel_left_consonant_frame`

No generic delete operation is authorized.

## Core rationale

The right-edge operation is a bounded expansion peel.

The left-edge operation encodes the ZË-RO rule that consonants may shape the structural frame while the canonical vowel path remains authoritative.

Left consonant peeling is valid only when the Seven-Voices sequence before and after is exactly unchanged.

## Seven-Voices authority

The implementation must use `extractSevenVowelsFromString` from `src/shared/math7.core.ts`.

The structural-discovery seam must preserve Y and Ë.

Carrier-matcher normalization is not the authority for this lane.

## Accepted proving posture

The contract may generate:

`STERILE → STER → TER → ER`

only through the generic authorized operations.

`STER → TER → ER` is required as a separate genericity proof.

## Accepted controls

The test lane must lock:

- no `TERR → TER`
- no TERROR → ER leakage
- no ERROR → ER final-R deletion
- no SISTER → ER substring shortcut
- Y/Ë preservation through `SYË → YË`
- deterministic repeat output
- no STERILE-specific implementation branch

## Claim boundary

Successful structural reduction does not establish:

- ER lexical meaning
- ER historical origin
- ER historical transmission
- TER/SHTER origin
- reviewed evidence
- production truth
- candidate truth

## Authorization

This review authorizes RED contract tests.

It does not yet authorize live analyze-v1 wiring.

The next implementation may create only the smallest reusable structural-discovery seam required to satisfy these tests.
