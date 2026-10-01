# Open Instrument FRD-02 CVC v0.1b P4 fixture-truth correction v0.1.1

Status: `FROZEN_P4_FIXTURE_TRUTH_CORRECTION_IMPLEMENTATION_NOT_EXECUTED`

Contract ID: `OPEN_INSTRUMENT_FRD02_CVC_V0_1B_P4_FIXTURE_TRUTH_CORRECTION_V0_1_1`

## 1. Purpose and provenance

This is a narrow correction to the merged P4 methodology freeze. It resolves
one construction contradiction discovered after PR #2056 and before P4
implementation or calibration. It does not redesign FRD-02, implement the P4
runner, execute calibration, execute real data, or interpret a result.

The historical P4 freeze remains immutable historical fact:

- Human artifact: `docs/open-instrument/frd02-cvc-v0.1b-p4-methodology-freeze-v0.1.md`
- Human SHA-256: `798278dbe0d3077700300dd9ad0c531dab422d3a46a7f488fc274b00ba74d5c9`
- Machine artifact: `docs/open-instrument/research-artifacts/frd02-cvc-v0.1b-p4-methodology-freeze-v0.1/preregistration.json`
- Machine SHA-256: `168ed4803d2a33690e88caf2d9bd138c0f0cd96bebd25248c0e1e63ab2927bea`

The contradiction was identified before implementation and before calibration.
No calibration result, real-data execution, semantic interpretation, or
result-informed/post-hoc tuning exists.

## 2. Reproduced contradiction

The historical common construction specified, for `cycle = g mod 4`:

```text
C_L = L0 for cycle 0 or 1; L1 for cycle 2 or 3
C_R = R0 for cycle 0 or 1; R1 for cycle 2 or 3
```

The same historical artifact specified `N11_ORDERED` as:

```text
left  = L0,L0,L1,L1
right = R0,R0,R1,R1
```

The existing P3 statistic consumes `C_L`/`C_R` co-occurrence. Therefore the
common construction and `N11_ORDERED` had the same statistic-relevant ordered
joint structure, despite the historical contract requiring common controls to
be null/no-interaction and `N11_ORDERED` to be the sole positive control.

## 3. Minimal correction

Only the common/default right-identity construction is corrected. The left
construction is unchanged:

```text
cycle = g mod 4
C_L   = L0 for cycle 0 or 1; L1 for cycle 2 or 3
C_R   = R0 for cycle 0 or 2; R1 for cycle 1 or 3
```

This is the orthogonal two-by-two identity cycle. For each stratum across the
96 groups, its joint table is:

| | R0 | R1 |
|---|---:|---:|
| L0 | 24 | 24 |
| L1 | 24 | 24 |

This corrected common construction is used by `N0` and the controls that
inherit the common baseline. Their existing purposes, Gate A/P2 expectations,
allowed outcomes, and invalidating conditions remain unchanged.

## 4. N11 constructions

`N11_ORDERED` is unchanged:

```text
left  = L0,L0,L1,L1
right = R0,R0,R1,R1
```

Its per-stratum joint table is:

| | R0 | R1 |
|---|---:|---:|
| L0 | 48 | 0 |
| L1 | 0 | 48 |

`N11_ORDER_DESTROYED` is unchanged:

```text
left  = L0,L0,L1,L1
right = R0,R1,R1,R0
```

Its per-stratum joint table is:

| | R0 | R1 |
|---|---:|---:|
| L0 | 24 | 24 |
| L1 | 24 | 24 |

The corrected common control and `N11_ORDER_DESTROYED` therefore share the
null joint structure, while `N11_ORDERED` differs in the ordered co-occurrence
relationship. All three retain 96 groups, 12 strata, one record per
group-stratum, equal left/right marginals, equal weights, equal eligibility,
equal structural-zero conditions, and equal Voice/position coverage.

The positive-control expectation remains: `N11_ORDERED` has greater statistic
than `N11_ORDER_DESTROYED` and is the expected support construction;
`N11_ORDER_DESTROYED` is not support.

## 5. Fixture impact

The corrected common construction applies to:

```text
N0 N1 N2 N3 N4 N5 N6 N7 N8 N9 N10
E1
C0 C1 C2 C3 C4 C5 C6 C7 C8 C9
```

The following construction definitions are unchanged:

```text
N11_ORDERED N11_ORDER_DESTROYED N12 N13 E2 E3
```

No fixture purpose, expected Gate A/P2 behavior, allowed outcome, or
invalidating condition is changed. The 29-fixture family, eight replicates per
fixture, 232 scheduled evaluations, seeds, acceptance framework, and
`clusterAdjacent` semantics remain unchanged.

## 6. Unchanged boundaries

This correction does not change:

- `clusterAdjacent` generated-truth semantics or filter order;
- P1, P2, or P3 arithmetic, matching, weighting, Gate A, statistic, or null
  semantics;
- replicate IDs `0` through `7`;
- `canonicalSeedTupleV0_1B` or `seedWordsV0_1B`;
- `CALIBRATION_PASS`, `CALIBRATION_FAIL`, or `CALIBRATION_INVALID`;
- adaptive/replacement policy, which remains forbidden;
- production, API, chat, Albanian, One-Embryo, Diachronic, provider, or
  semantic behavior.

## 7. Validation boundary

This correction adds only contract-level construction metadata and a focused
regression test proving the corrected joint tables and preserved controls. It
does not add the P4 runner and does not execute the 232-evaluation calibration.

After this correction, the next lane is:

```text
FRD02_P4_IMPLEMENTATION_AND_VALIDATION
```
