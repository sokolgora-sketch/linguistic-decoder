# Open Instrument FRD-02 CVC v0.1b P4 C6/C7/C8 subcase allocation correction v0.1

Status: `FROZEN_P4_C6_C7_C8_SUBCASE_ALLOCATION_AUTHORITY_IMPLEMENTATION_NOT_EXECUTED`

Contract ID: `OPEN_INSTRUMENT_FRD02_CVC_V0_1B_P4_C6_C7_C8_SUBCASE_ALLOCATION_CORRECTION_V0_1`

## 1. Purpose and provenance

This is a narrow authority correction discovered after PR #2061 merged and
before calibration. The frozen P4 methodology already requires both named
subcases for C6, C7, and C8, but did not assign those subcases to the eight
frozen replicate IDs. No calibration result, real-data execution, semantic
interpretation, or result-informed tuning exists.

The historical P4 methodology and all prior correction artifacts remain
immutable. This correction freezes only the missing replicate-ID allocation;
it does not alter any subcase construction, fixture purpose, expected Gate A
or P2 behavior, acceptance threshold, seed derivation, fixture count, or
replicate count.

## 2. Existing frozen subcases

The existing P4 authority requires:

| Fixture | Subcase A | Subcase B |
|---|---|---|
| `C6` | left-identity single-value / left-constant | right-identity single-value / right-constant |
| `C7` | missing-voice coverage | missing-position coverage |
| `C8` | concentration | rare-identity |

These subcases are already frozen requirements. Their structural definitions,
Gate A reasons, P2 state, and allowed outcomes remain unchanged.

## 3. Frozen allocation

For each of `C6`, `C7`, and `C8`, the canonical decimal replicate IDs are
allocated as follows:

```text
replicate IDs 0,1,2,3 -> subcase A
replicate IDs 4,5,6,7 -> subcase B
```

Therefore:

```text
C6: 0,1,2,3 -> left-identity; 4,5,6,7 -> right-identity
C7: 0,1,2,3 -> missing-voice; 4,5,6,7 -> missing-position
C8: 0,1,2,3 -> concentration; 4,5,6,7 -> rare-identity
```

The allocation is balanced four-to-four for every fixture. Replicate ordering
is the existing frozen order `0,1,2,3,4,5,6,7`; subcase allocation is a pure
function of that identity and is not derived from seed output, runtime
randomness, calibration output, or desired scientific outcome.

## 4. Preserved authority

This correction preserves:

- the 29 fixture identifiers;
- eight replicates per fixture and 232 total scheduled evaluations;
- existing `canonicalSeedTupleV0_1B` and `seedWordsV0_1B` derivation;
- existing permutation stream identity and serialization/fingerprint rules;
- existing C6/C7/C8 subcase records and expected Gate A/P2/outcome metadata;
- existing P1, P2, P3, N11, cluster-adjacency, weighting, and resource rules;
- `CALIBRATION_PASS`, `CALIBRATION_FAIL`, and `CALIBRATION_INVALID` semantics;
- no adaptive or replacement replication;
- no production, API, chat, Albanian, One-Embryo, Diachronic, provider, or
  semantic behavior.

No result-informed tuning occurred.

## 5. Implementation boundary

This artifact must be finalized and hash-bound before remediation
implementation begins. After implementation begins, this authority artifact
must not be edited. The implementation may only consume this mapping and
repair the four identified post-merge defects.

Calibration remains forbidden in this lane.
