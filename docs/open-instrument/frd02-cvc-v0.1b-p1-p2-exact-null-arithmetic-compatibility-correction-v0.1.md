# Open Instrument — FRD-02 CVC v0.1b P1/P2 exact-null arithmetic compatibility correction

```text
CONTRACT_ID=OPEN_INSTRUMENT_FRD02_CVC_V0_1B_P1_P2_EXACT_NULL_ARITHMETIC_COMPATIBILITY_V0_1
VERSION=v0.1
STATUS=FROZEN_P1_P2_EXACT_NULL_ARITHMETIC_COMPATIBILITY_CORRECTION
```

This is a narrow authority correction to the preserved FRD-02 v0.1b P1/P2
exact-null infrastructure. It makes the already-frozen P4 96-member raw
signature classes representable without changing the exact-null mathematics,
the P4 fixture truth, or the P3 statistic.

It does not implement the P4 runner and does not execute calibration.

## 1. Boundary and trigger

The P4 methodology freezes 96 independence groups, 12 strata, one record per
group-stratum, and the corrected common/N11 joint constructions. The prior P2
implementation rejected a raw signature class larger than 30 before graph
counting. That rejection was a count-capacity limit, not a property of the
P2 graph or recurrence. The frozen 96-member cases remain within the existing
exact-state and exact-transition resource limits.

The correction is therefore representational/resource-authority expansion,
not a new null model.

## 2. Superseded and active authority

The historical P1/P2 implementation used `Uint128V0_1B` for component-count
memoization and treated raw class size above 30 as
`EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED`.

The active correction removes the fixed raw-class magnitude gate and stores
exact component counts as JavaScript `bigint` values. The existing graph
construction, perfect matching, forced-edge reduction, component factoring,
recurrence, branch thresholds, and deterministic sampler remain unchanged.

`src/shared/openInstrument/frd02CvcUint128.v0_1b.ts` remains preserved as
historical P1 arithmetic evidence and regression coverage. It is no longer
the authoritative storage representation for active P2 exact-null counts.

## 3. Exact arithmetic authority

Active exact-null counts MUST:

- use arbitrary-precision integer arithmetic;
- remain exact for every addition and multiplicative recurrence step;
- never pass through JavaScript `number` arithmetic;
- never use floating-point approximation, truncation, modulo reduction, or
  lossy conversion;
- remain `bigint` values at runtime result boundaries.

The existing state and transition estimates remain numeric computational
resource gates. Count magnitude alone is not a failure when the exact integer
can be represented.

## 4. Resource gates

The correction freezes this separation:

```text
COUNT_MAGNITUDE != COMPUTATIONAL_COMPLEXITY
```

The following limits remain binding and unchanged:

```text
MAX_EXACT_STATES_V0_1B=1048576
MAX_EXACT_TRANSITIONS_V0_1B=16777216
```

There is no replacement arbitrary raw-class-size constant. A class is
accepted past the historical 30-member boundary only if graph validation and
the existing state/transition estimates remain within their frozen limits.
Cases exceeding those limits still fail closed with the existing
`EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED` reason.

The E3 resource-control behavior remains intentional: a profile with distinct
donor types that exceeds the state/transition ceiling remains a computational
failure even though count magnitude is no longer capped at 128 bits.

## 5. Canonical persistence representation

Runtime `bigint` values are not JSON serializable. At persistence boundaries,
exact counts MUST use canonical unsigned decimal strings:

- `0` is the only zero form;
- positive values have no leading zero;
- no leading plus sign;
- no exponent notation;
- no locale formatting;
- parsing and serialization are lossless.

The executable helpers are
`serializeExactNullCountV0_1B` and `parseExactNullCountV0_1B`.

## 6. Mathematical invariants

This correction MUST NOT change:

- the admissible null realization set;
- matching semantics;
- graph or recurrence semantics;
- forced-edge reduction;
- component factoring;
- weighting;
- finite-null branch thresholds;
- deterministic sampling semantics;
- P3 statistic semantics;
- P4 fixture truth.

For existing valid classes at or below 30 members, exact results remain
identical. For the frozen P4 96-member classes, the correction makes the same
mathematical count reachable rather than rejecting it for Uint128 capacity.

## 7. Compatibility evidence

The focused compatibility proof covers:

- 30!, 31!, and 96! exactness;
- canonical decimal serialization round trips;
- existing small exact-null results;
- deterministic sampling;
- preserved state and transition resource failures;
- N0 and both N11 constructions;
- E1/C1/C2 normalization-preserved P2 readiness;
- N12/N13 exhaustive-versus-Monte-Carlo boundaries;
- E2 finite-null behavior;
- E3 computational resource failure;
- all 29 frozen P4 fixture identifiers without running calibration.

## 8. Calibration firewall

```text
P4_RUNNER_IMPLEMENTED=NO
FULL_232_CALIBRATION_EXECUTED=NO
CALIBRATION_RESULT_CREATED=NO
REAL_DATA_EXECUTED=NO
P3_SEMANTICS_CHANGED=NO
PRODUCTION_CHANGED=NO
```

This correction only makes the P4 P1/P2 precondition reachable. The next
authorized lane is the separate P4 implementation and validation lane.

## 9. Freeze declaration

```text
EXACT_NULL_MATHEMATICS_CHANGED=NO
P4_CHANGED=NO
ARBITRARY_PRECISION_EXACT_COUNTS=ESTABLISHED
EXISTING_LE30_RESULTS_PRESERVED=YES
P4_96_MEMBER_CLASSES_SUPPORTED=YES
STATE_RESOURCE_LIMIT_PRESERVED=YES
TRANSITION_RESOURCE_LIMIT_PRESERVED=YES
NEXT_LANE=FRD02_P4_IMPLEMENTATION_AND_VALIDATION
```
