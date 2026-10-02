# Open Instrument — FRD-02 CVC P4 v0.1c successor definition and freeze

```text
CONTRACT_ID=OPEN_INSTRUMENT_FRD02_CVC_V0_1C_P4_METHODOLOGY_V0_1
VERSION=v0.1
STATUS=FROZEN_P4_V0_1C_SUCCESSOR_AUTHORITY_IMPLEMENTATION_NOT_EXECUTED
```

This is a separately versioned successor authority for the preserved FRD-02
CVC P4 v0.1b methodology. It corrects exactly the three independently
diagnosed P4 defects below and nothing else:

1. the E3 expected-resource-control contradiction at aggregate acceptance;
2. the C7 construction that removed an entire V×P stratum;
3. the C8 rare-identity construction that did not cross the frozen sparse
   threshold.

The v0.1b methodology, its correction artifacts, its implementation, and its
authoritative invalid calibration result remain immutable. This document does
not implement a runner, execute a synthetic calibration, execute real data,
or establish an FRD-02 scientific result.

```text
V0_1_RESULT_PRESERVED=YES
V0_1_RERUN_AUTHORIZED=NO
SUCCESSOR_EXECUTION_IS_FRESH=YES
SUCCESSOR_IMPLEMENTATION_STARTED=NO
SUCCESSOR_CALIBRATION_EXECUTED=NO
REAL_DATA_EXECUTED=NO
PRODUCTION_AUTHORITY=NO
```

## 1. Immutable predecessor and authority stack

The predecessor result is preserved exactly:

| Artifact | Path | SHA-256 | Bytes |
|---|---|---|---:|
| v0.1b result | `docs/open-instrument/research-artifacts/frd02-cvc-v0.1b-p4-synthetic-calibration-v0.1/result.json` | `20c1ad43e95a59912908334ad7fb2bf7f98765aa85b4f5a4f569ac1dea5fdf02` | 382231 |
| doctrine record | `docs/open-instrument/zhero-doctrine-record-v0.1.md` | `b72c23d659d010b5c2a53058cc2f6223e0cbba9b32e351d17009b6545fc05f93` | 9562 |

The preserved authority stack is:

| Layer | Active repository evidence |
|---|---|
| Parent / closure | `docs/open-instrument/frd02-cvc-v0.1b-closure-preservation-v0.1.md` |
| P1 | `src/shared/openInstrument/frd02CvcUint128.v0_1b.ts` and its focused tests |
| P2 | `src/shared/openInstrument/frd02CvcExactNull.v0_1b.ts` and its focused tests |
| P3 | `src/shared/openInstrument/frd02CvcSyntheticCalibration.v0_1b.ts` and its focused tests |
| P4 v0.1b | `docs/open-instrument/frd02-cvc-v0.1b-p4-methodology-freeze-v0.1.md` and its machine companion |
| Fixture correction | `docs/open-instrument/frd02-cvc-v0.1b-p4-fixture-truth-correction-v0.1.1.md` and its machine companion |
| P1/P2 compatibility | `docs/open-instrument/frd02-cvc-v0.1b-p1-p2-exact-null-arithmetic-compatibility-correction-v0.1.md` and its machine companion |
| Subcase allocation | `docs/open-instrument/frd02-cvc-v0.1b-p4-c6-c7-c8-subcase-allocation-correction-v0.1.md` and its machine companion |
| v0.1 result | the hash-bound result above |

The v0.1b execution attempted the frozen 232-entry schedule once and produced
`CALIBRATION_INVALID`. Its 26 accepted fixtures, two failed controls (C7 and
C8), and eight E3 invalid resource replicates are historical result facts;
they do not authorize a rerun or post-result repair of v0.1b.

## 2. Successor boundary

The successor retains the following without alteration:

- the CVC frame, ordered two-sided configuration, and parent conditioning;
- `clusterAdjacent` exclusion, repeated-frame exclusion, group-stratum
  weighting, structural-zero eligibility, exact matching, and counting;
- the P1/P2/P3 implementations and their semantics;
- all 29 fixture identifiers, fixture order, 96 groups, 12 strata, and eight
  decimal replicate identities `0` through `7`;
- the common/default joint table `24,24,24,24`;
- `N11_ORDERED` joint table `48,0,0,48` and the distinct
  `N11_ORDER_DESTROYED` null structure;
- the existing seed tuple, seed-word, permutation-stream, canonical
  serialization, state-limit, and transition-limit authorities;
- the thresholds, including `C8_SPARSE_THRESHOLD=0.25`;
- the existing outcome set `CALIBRATION_PASS`, `CALIBRATION_FAIL`, and
  `CALIBRATION_INVALID`.

The successor changes no threshold, no null mathematics, no P3 statistic, no
replicate count, no adaptive behavior, no acceptance family, and no
production behavior.

## 3. E3 expected-resource-control correction

### 3.1 Existing authority and diagnosed contradiction

The existing E3 authority is an edge control for a valid profile that reaches
the existing P2 computational/resource boundary. Its expected per-replicate
behavior is already frozen:

```text
Gate A = PASS
P2 = FAILURE
P2 reason = EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED
P2 domain = RESOURCE
scientific outcome = INSUFFICIENT_EVIDENCE
```

The v0.1b implementation correctly preserves that per-replicate resource
failure, but its aggregate rule treats every invalid replicate as aggregate
invalid. Therefore the E3 control is structurally unable to coexist with an
aggregate `CALIBRATION_PASS` even when it behaves exactly as pre-registered.
No existing expected-invalid aggregate category or control precedent was
found. This successor resolves only that diagnosed contradiction.

### 3.2 Successor E3 role

E3 is an `EXPECTED_INVALID_CONTROL`. This is an aggregate acceptance
classification, not a new per-replicate scientific outcome and not a new P2
failure reason.

The successor requires exactly eight E3 evaluations with replicate IDs
`0,1,2,3,4,5,6,7`. Every E3 replicate must satisfy all of these conditions:

- schema, fixture identity, replicate identity, seed identity, input hash, and
  deterministic serialization are valid;
- Gate A passes;
- P2 returns `FAILURE` with reason
  `EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED` and domain `RESOURCE`;
- the scientific outcome is `INSUFFICIENT_EVIDENCE`;
- the replicate is marked invalid at the per-replicate result boundary only
  because the expected resource failure prevents an exact null result.

The expected E3 invalid replicates are counted in diagnostic-control
completeness and in the full 232-entry schedule. They are excluded from the
all-remaining-fixtures-valid denominator. The successor therefore requires
all 28 non-E3 fixture slots to be valid and accepted, including C7 and C8 as
valid failure controls after their construction corrections. E3 contributes
no support claim and no real-data claim.

### 3.3 Aggregate treatment

The successor uses the existing three top-level outcomes:

| Condition | Aggregate result |
|---|---|
| All 28 non-E3 fixtures are valid and satisfy their frozen acceptance rules; all 8 E3 replicates satisfy the exact expected-invalid pattern; schedule, seeds, hashes, replay, and control invariants are valid | `CALIBRATION_PASS` |
| All 28 non-E3 results are valid, the exact E3 expected-invalid pattern passes, and a fixture produces an unexpected scientific/control outcome, including an unexpected support result | `CALIBRATION_FAIL` |
| Any schema/identity/seed/hash/runtime/resource invalidity outside the exact E3 expected pattern; missing/extra E3 replicates; an E3 Gate A/P2/outcome mismatch; schedule or replay mismatch | `CALIBRATION_INVALID` |
| Any E3 expected resource failure is silently converted to support or otherwise treated as a positive result | `CALIBRATION_INVALID` and the control is rejected |

An invalid E3 replicate is therefore not an aggregate invalidity when, and only
when, it matches the exact expected control pattern above. An invalid result
outside that pattern remains aggregate-invalid. No replacement replicate,
adaptive replication, majority vote, or post-result exception is permitted.

`E3_CONTRADICTION_RESOLVED_BY_AUTHORITY=YES`.

## 4. C7 exact successor constructions

C7 retains its existing two-to-four replicate allocation:

```text
replicate IDs 0,1,2,3 -> missing-voice coverage
replicate IDs 4,5,6,7 -> missing-position coverage
```

Both subcases start from the existing corrected common construction: 96
independence groups, 12 strata, one record per group-stratum, 1152 eligible
records, and the existing identities, geometry, token-length class, topology,
cluster flag, and structural-zero properties.

### 4.1 Missing-voice subcase

For each group index `g` from `4` through `95`, remove only the record whose
stratum is `S3` (`V3,P0`). Retain the `S3` record for group indices `0`
through `3`, and retain every record in all other strata.

The deterministic construction therefore removes `92` records and leaves
`1060` eligible records, `96` eligible groups, and all `12` V×P strata.
`S3` remains represented by four groups, satisfying the existing
`MIN_GROUPS_PER_INCLUDED_STRATUM=4` threshold, while `V3` occurs in four
groups, below the existing `MIN_GROUPS_PER_VOICE=8` threshold. Every position
still occurs in at least eight groups. No other record property changes.

The first applicable Gate A reason is
`VOICE_COVERAGE_MINIMUM_NOT_MET`; P2 is `NOT_RUN`; the scientific outcome is
`INSUFFICIENT_EVIDENCE`; and the replicate is a valid, accepted expected
failure control.

### 4.2 Missing-position subcase

For each group index `g` from `4` through `95`, remove only the record whose
stratum is `S4` (`V0,P1`). Retain the `S4` record for group indices `0`
through `3`, and retain every record in all other strata.

The deterministic construction again removes `92` records and leaves `1060`
eligible records, `96` eligible groups, and all `12` V×P strata. `S4` remains
represented by four groups, while `P1` occurs in four groups, below the
existing `MIN_GROUPS_PER_POSITION=8` threshold. Every voice still occurs in
at least eight groups. No other record property changes.

The first applicable Gate A reason is
`POSITION_COVERAGE_MINIMUM_NOT_MET`; P2 is `NOT_RUN`; the scientific outcome
is `INSUFFICIENT_EVIDENCE`; and the replicate is a valid, accepted expected
failure control.

```text
C7_ALL_12_STRATA_PRESERVED=YES
C7_RESULT_INFORMED_TUNING=NO
```

This construction corrects the predecessor's error of deleting an entire
stratum. It does not reinterpret a missing stratum as a coverage failure.

## 5. C8 exact successor construction

C8 retains its existing concentration subcase for replicate IDs `0` through
`3` unchanged. Only the rare-identity subcase for replicate IDs `4` through
`7` is corrected.

For group indices `0` through `32`, and for every one of the 12 strata,
replace only `C_R` with the deterministic identity
`RARE_R_gNNN`, where `gNNN` is the zero-padded group ID. The identity is
constant across the 12 strata of that group and does not occur in any other
group. Preserve `C_L`, `V`, `P`, `stratumId`, `stableSlotId`, token-length,
geometry, topology, cluster truth, record count, and record ordering.

This affects `33 × 12 = 396` group-stratum records. There remain `96` groups,
`12` strata, and `1152` group-stratum units. The 33 rare right identities
each occur in exactly one independence group, so all 396 affected units are
rare units under the existing `<3 groups` definition:

```text
rareIdentityWeight = 396 / 1152 = 0.34375
0.34375 > 0.25
```

The existing sparse criterion therefore fires deterministically. The
concentration ratio remains `1/96`, all strata and voice/position coverage
remain present, the minimum group and identity-diversity checks remain
satisfied, and the weighted group-stratum mass remains one per unit. The
right-identity distribution is intentionally changed only by the declared
rare-identity diagnostic; left identities and all non-identity structural
properties are preserved. The structural-zero condition `C_L != C_R` remains
true for every record.

Expected behavior is:

```text
Gate A = RARE_IDENTITY_SPARSE_THRESHOLD_EXCEEDED
P2 = NOT_RUN
diagnostic = SPARSE
scientific outcome = SPARSE
fixture acceptance = valid expected failure control
```

The sparse threshold remains exactly `0.25`. No threshold was selected by
looking at the v0.1 result; the construction crosses the already-frozen
criterion by deterministic arithmetic.

```text
C8_SPARSE_THRESHOLD=0.25
C8_THRESHOLD_CHANGED=NO
C8_RESULT_INFORMED_TUNING=NO
C8_UNRELATED_INVARIANTS_PRESERVED=YES
```

## 6. Definition-time all-29 compatibility audit

The successor keeps exactly 29 fixture identifiers. Exactly three definitions
change and exactly 26 remain byte/semantic inputs from the predecessor
authority. No fixture is added, removed, renamed, or silently reinterpreted.

| Fixture set | Construction authority | Gate A / P2 precondition | Resource compatibility | Acceptance role | Affected |
|---|---|---|---|---|---|
| `N0–N10` | existing common/default or existing per-fixture neutral construction | existing PASS; existing P2 branches | existing limits | neutral no-support controls | NO |
| `N11` | existing ordered/destroyed pair | existing PASS; pair branch | existing limits | ordered-vs-destroyed positive-control comparison | NO |
| `N11_ORDERED`, `N11_ORDER_DESTROYED` | existing pair constructions | existing PASS; Monte Carlo | existing limits | paired positive/null control | NO |
| `N12` | existing exact boundary construction | existing PASS; exhaustive | existing limits | finite-null boundary | NO |
| `N13` | existing exact boundary construction | existing PASS; Monte Carlo | existing limits | finite-null boundary | NO |
| `E1` | existing cluster-adjacent control | existing PASS; Monte Carlo | existing limits | normalization/exclusion control | NO |
| `E2` | existing observed-realization boundary | existing PASS; finite `ONLY_OBSERVED_REALIZATION` failure | existing limits | finite-null control | NO |
| `E3` | existing valid resource-control construction; successor aggregate classification only | Gate A PASS; P2 expected RESOURCE failure | existing P1/P2 resource limits unchanged | expected-invalid resource control | YES |
| `C0–C2` | existing balanced/normalization control constructions | Gate A PASS; P2 MONTE_CARLO | existing limits | valid failure-mode controls | NO |
| `C3–C6` | existing coverage/identity failure-control constructions and frozen subcase allocation | existing declared Gate A failure; P2 NOT_RUN | existing limits | Gate-A failure-mode controls | NO |
| `C7` | successor partial-stratum-per-group construction above | coverage Gate A failure; P2 NOT_RUN | existing limits | missing-voice and missing-position controls | YES |
| `C8` | existing concentration construction plus successor rare-identity replacement above | sparse/confounded Gate A failure; P2 NOT_RUN | existing limits | concentration and rare-identity controls | YES |
| `C9` | existing exchangeability-pool construction | exchangeability Gate A failure; P2 NOT_RUN | existing limits | exchangeability control | NO |

```text
FIXTURE_COUNT=29
CHANGED_FIXTURES=E3,C7,C8
UNCHANGED_FIXTURE_COUNT=26
UNACCOUNTED_FIXTURES=0
ALL29_DEFINITION_COMPATIBILITY=PASS
```

The all-29 audit is definition-time only. It does not run the successor
schedule, enumerate permutations, calculate P2, or preview a result.

## 7. P1/P2/P3 compatibility

No successor correction changes P1 mathematics, P2 exact-null mathematics, or
P3 semantics. The following remain binding:

```text
MAX_EXACT_STATES=1048576
MAX_EXACT_TRANSITIONS=16777216
EXACT_COUNT_REPRESENTATION=ARBITRARY_PRECISION_BIGINT_WITH_CANONICAL_DECIMAL_PERSISTENCE
P1_CHANGE_REQUIRED=NO
P2_CHANGE_REQUIRED=NO
P3_CHANGE_REQUIRED=NO
```

The E3 resource failure continues to use the existing P2 resource boundary;
the successor changes only whether the already-expected control invalidity is
counted as an aggregate defect.

## 8. Successor execution identity and aggregate rule

The future execution must use these distinct identities:

```text
EXPERIMENT_ID=OPEN_INSTRUMENT_FRD02_CVC_V0_1C_P4_SUCCESSOR
SCHEDULE_VERSION=FRD02_CVC_V0_1C_P4_SCHEDULE_V0_1
FIXTURE_VERSION=FRD02_CVC_V0_1C_P4_FIXTURE_CONSTRUCTION_V0_1
ACCEPTANCE_VERSION=FRD02_CVC_V0_1C_P4_ACCEPTANCE_V0_1
SEED_AUTHORITY=canonicalSeedTupleV0_1B(fixtureId,replicateId,permutation-primary) and seedWordsV0_1B
REPLICATES_PER_FIXTURE=8
REPLICATE_IDS=0,1,2,3,4,5,6,7
FRESH_EXECUTION_REQUIRED=YES
AUTHORITATIVE_EXECUTION_ATTEMPTS_MAX=1
NO_RERUN_UNTIL_PASS=YES
NO_ADAPTIVE_REPLICATION=YES
NO_POST_RESULT_THRESHOLD_CHANGE=YES
NO_POST_RESULT_FIXTURE_CHANGE=YES
NO_POST_RESULT_ACCEPTANCE_CHANGE=YES
```

The seed tuple remains the predecessor seed architecture because the
successor changes fixture definitions and aggregate acceptance, not replicate
identity or randomization authority. The future 232-entry schedule remains
non-adaptive and has no replacement replicates.

The aggregate rule is frozen before implementation:

```text
PASS   = all 28 non-E3 fixture acceptances pass
         AND exact E3 expected-invalid control pattern passes
         AND schedule/identity/seed/hash/replay invariants pass

FAIL   = every evaluated result is methodologically valid
         AND at least one expected scientific/control outcome is unexpected

INVALID = any schema, identity, seed, hash, runtime, or unexpected resource
           invalidity; any missing/extra E3 expected-invalid replicate;
           any E3 pattern mismatch; any schedule/replay mismatch
```

An expected E3 resource failure is not a support claim. The aggregate remains
invalid if it is converted into support or otherwise escapes the exact
expected-control pattern.

## 9. Freeze and execution firewall

The human artifact, machine companion, and hash manifest are frozen before
successor implementation. After implementation starts, these artifacts may
not be edited. The fixed sequence is:

```text
1. successor definition/freeze
2. successor implementation and all-29 compatibility audit
3. fresh successor calibration execution
```

This lane performs only step 1.

```text
SUCCESSOR_AUTHORITY_FROZEN=YES
SUCCESSOR_IMPLEMENTATION_STARTED=NO
SUCCESSOR_CALIBRATION_EXECUTED=NO
REAL_DATA_EXECUTED=NO
PRODUCTION_CHANGED=NO
```

The successor does not authorize semantic interpretation, consonant meaning,
lexical function, historical origin, production authority, API behavior, chat
behavior, Albanian behavior, provider execution, One-Embryo work, or
Diachronic v0.2.

## 10. Freeze declaration

```text
FRD02_P4_V0_1C_SUCCESSOR=FROZEN_READY_FOR_IMPLEMENTATION_AND_ALL29_COMPATIBILITY_AUDIT
NEXT_LANE=FRD02_P4_V0_1C_SUCCESSOR_IMPLEMENTATION_AND_ALL29_COMPATIBILITY_AUDIT
```
