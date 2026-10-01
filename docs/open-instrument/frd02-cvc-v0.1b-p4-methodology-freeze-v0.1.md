# Open Instrument — FRD-02 CVC v0.1b P4 Methodology Freeze

```text
CONTRACT_ID=OPEN_INSTRUMENT_FRD02_CVC_V0_1B_P4_METHODOLOGY_V0_1
VERSION=v0.1
STATUS=FROZEN_P4_METHODOLOGY_CALIBRATION_NOT_EXECUTED
```

This is an additive child methodology contract for the preserved FRD-02
v0.1b infrastructure. It freezes the synthetic calibration inputs and
acceptance rules required by the next P4 runner lane. It does not implement
the runner and does not execute calibration.

## 1. Boundary

This contract preserves the parent FRD-02 choices:

- CVC frame and ordered two-sided configuration;
- the parent conditioning/control structure;
- structural-zero eligibility `C_L != C_R`;
- exact group-stratum weighting and marginal preservation;
- exact structural-zero profile bijection, matching, and counting;
- uint128/BigInt arithmetic;
- existing Gate A semantics and statistic;
- existing finite-null branches and outcome hierarchy.

This artifact makes no claim about lexical function, semantics, historical
origin, real-data behavior, consonant meaning, or production behavior.

```text
P4_RUNNER_IMPLEMENTED=NO
P4_CALIBRATION_EXECUTED=NO
REAL_DATA_EXECUTION_AUTHORIZED=NO
SEMANTIC_INTERPRETATION_AUTHORIZED=NO
PRODUCTION_AUTHORITY=NO
NEW_P4_SCIENTIFIC_CHOICES_REQUIRED_BEFORE_IMPLEMENTATION=NO
```

The final field means that this frozen P4 version is implementable and
executable without another methodological decision. It does not mean that
FRD-02 can never require a later scientific decision.

## 2. Authority bindings

The parent and P3 artifacts are hash-bound as recorded by the closure
artifact. The historical `/tmp` files are not recreated by this lane.

| Artifact | Path | SHA-256 | Bytes |
|---|---|---|---:|
| Parent contract | `/tmp/open-instrument-frd02-cvc-experimental-contract-v0-1b-20260927.md` | `3c6e2d64769d3138d47f50b5e758a40080a6b502a6c9c6cb9db30ce1a0b4de94` | 14074 |
| Parent machine contract | `/tmp/open-instrument-frd02-cvc-experimental-contract-v0-1b-20260927.json` | `dbca018b9ccfbc5462c65993c5090cd864c5eff457eee38f10cfbd187224c563` | 14241 |
| P3 amendment | `/tmp/open-instrument-frd02-cvc-p3-contract-seam-amendment-v0-1b-20260927.json` | `77038ccc5406da0f6970fab2c667ea131955057abc1907f0f59e61180e306129` | 5857 |
| Synthetic generator contract | `/tmp/open-instrument-frd02-cvc-v0-1b-synthetic-generator-contract-20260927.json` | `571ef6f139442b086887fb847097aff13edb53dea835b64c97b0b1fbf46a7a8d` | 25837 |
| Synthetic analyzer contract | `/tmp/open-instrument-frd02-cvc-v0-1b-synthetic-analyzer-contract-20260927.json` | `3cf7076b5f9685990891ad6333a89b75aa8823d977664f2c9bffe2364d63608e` | 18613 |

The current executable bindings are:

- `src/shared/openInstrument/frd02CvcUint128.v0_1b.ts`
- `src/shared/openInstrument/frd02CvcExactNull.v0_1b.ts`
- `src/shared/openInstrument/frd02CvcSyntheticCalibration.v0_1b.ts`

## 3. Common synthetic record construction

The next runner MUST materialize records using the existing
`SyntheticStructuralRecordV0_1B` shape. No analyzer-only truth field may be
added.

The base fixture has 96 independence groups, `g000` through `g095`, and one
record for each group-stratum pair. The frozen stratum order is the current
`STRATA_V0_1B` order:

```text
S0=V0/P0  S1=V1/P0  S2=V2/P0  S3=V3/P0
S4=V0/P1  S5=V0/P2  S6=V0/P3  S7=V4/P4
S8=V5/P5  S9=V6/P5  S10=V1/P2 S11=V2/P4
```

For a group index `g` and stratum index `s`:

```text
groupId           = g000 ... g095, zero-padded to width 3
replicateId       = the scheduled canonical decimal replicate ID
recordId          = <fixtureId>-<replicateId>-<groupId>-<stratumId>-slot-0
independenceGroup = <groupId>
stableSlotId      = slot-0
tokenLengthClass  = 4-6
geometryClass     = shared unless the fixture explicitly changes it
```

The default balanced identity construction is:

```text
cycle = g mod 4
C_L   = L0 for cycle 0 or 1; L1 for cycle 2 or 3
C_R   = R0 for cycle 0 or 1; R1 for cycle 2 or 3
```

All fixture transforms are applied before canonical UTF-8 ordering, group
stratum weighting, structural-zero filtering, Gate A, and P2. The runner may
not derive synthetic truth from the analyzer output.

## 4. `clusterAdjacent` definition

`clusterAdjacent` is generated truth, not a linguistic inference and not a
heuristic derived from neighboring records.

For every generated record, the generator emits the boolean field explicitly.
It is `true` if and only if the fixture recipe marks that record as belonging
to the synthetic adjacency-exclusion set; otherwise it is `false`. The
recipe may also emit `topology="cluster-adjacent"` for an explicitly marked
record, but the analyzer consumes the boolean field and never derives it from
`topology`, identities, positions, geometry, token length, or record order.

Boundary behavior:

1. missing or non-boolean value: schema invalid;
2. `true`: record is excluded before repeated-frame masking and weighting;
3. `false`: record remains eligible for the parent `C_L != C_R` mask;
4. the field has no independent weighting or grouping effect after filtering;
5. a fixture with too many marked records fails the predeclared Gate A
   expectation; no records are unmarked after execution.

Only `C1` and `E1` use marked records. Every other fixture emits
`clusterAdjacent=false` for every record.

Synthetic `clusterAdjacent` behavior is an implementation calibration target;
it establishes no empirical linguistic adjacency rule.

## 5. Positive control and N11 pair

`N11_ORDERED` is the sole positive-control construction. It uses the common
96-group, 12-stratum layout and one slot per group-stratum.

For every stratum, groups are read in canonical group order. With `cycle=g mod
4`, the left sequence is `L0,L0,L1,L1` and the ordered right sequence is
`R0,R0,R1,R1`. This creates a known joint interaction while preserving two
left identities, two right identities, all group-stratum masses, all strata,
all Voice/position coverage, and the structural-zero mask.

`N11_ORDER_DESTROYED` uses the identical groups, strata, positions, voices,
left sequence, record count, geometry, token-length class, and right marginal
counts. Its right sequence is `R0,R1,R1,R0`. Within each stratum this gives
one `R0` and one `R1` for each left identity, removing the ordered
co-occurrence while preserving the required one-sided marginals.

The ordered/destroyed comparison therefore changes only the predeclared
left-right ordering relation. It does not violate eligibility, weighting,
Gate A, or exact-null assumptions.

Expected behavior:

- both fixtures: Gate A `PASS`;
- both fixtures: P2 reaches a valid `READY` branch or an explicitly reported
  predeclared computational/resource invalidity;
- `N11_ORDERED`: statistic direction is greater than its destroyed control and
  the primary outcome is expected to be `CVC_CONFIGURATIONAL_SUPPORT`;
- `N11_ORDER_DESTROYED`: it must not be classified as
  `CVC_CONFIGURATIONAL_SUPPORT`;
- any violation is a calibration failure, not a reason to tune the fixture.

## 6. Neutral and edge fixture families

The existing executable fixture identifiers are retained exactly:

```text
N0 N1 N2 N3 N4 N5 N6 N7 N8 N9 N10 N11
N11_ORDERED N11_ORDER_DESTROYED N12 N13
E1 E2 E3
C0 C1 C2 C3 C4 C5 C6 C7 C8 C9
```

### Neutral controls

`N0` is the balanced no-interaction baseline using the common construction.
`N1` through `N10` are representation/order invariance controls: each applies
exactly one deterministic permutation or bijective relabeling to the N0
records while preserving the constructed no-interaction truth, all required
marginals, and the parent structural profile. The transformations are,
respectively: record order, group order, stratum order, stable-slot labels,
geometry label, token-length label, explicit neutral topology label,
left-label bijection, right-label bijection, and a balanced orthogonal
two-by-two identity cycle.

`N12` is the exact-null boundary control with a generated profile whose
admissible null count is exactly `10,000`; it must use the existing
`EXHAUSTIVE` branch. `N13` is the corresponding count `10,001` control and
must use the existing `MONTE_CARLO` branch with exactly 10,000 draws.

For N0-N10, N12, and N13, the constructed truth is no ordered interaction;
unexpected `CVC_CONFIGURATIONAL_SUPPORT` is a fixture failure. Gate A is
expected to pass for N0-N10, N12, and N13. N12/N13 additionally test their
declared P2 branch.

### Edge controls

| ID | Purpose | Construction | Expected result |
|---|---|---|---|
| `E1` | adjacency exclusion | Add one marked adjacency record in an otherwise valid extra group; remove it before masking | baseline Gate A metrics unchanged; exclusion is recorded |
| `E2` | finite-null failure handling | Generate the smallest valid profile with only the observed admissible realization | existing `ONLY_OBSERVED_REALIZATION` branch; no support claim |
| `E3` | P2 computational/resource handling | Generate a valid profile that exceeds the existing exact-count resource ceiling without changing parent arithmetic | existing resource/computational failure reason; calibration invalid for that replicate |

### C0-C9 preserved failure-mode controls

| ID | Purpose and construction | Gate A / P2 expectation | Allowed outcome |
|---|---|---|---|
| `C0` | Valid balanced no-interaction baseline | Gate A `PASS`; P2 `READY` | `NULL` |
| `C1` | One `clusterAdjacent=true` row is filtered before analysis | Gate A remains the N0 result | N0-equivalent outcome |
| `C2` | Add a repeated frame with `C_L=C_R` | repeated row excluded before weighting | N0-equivalent outcome |
| `C3` | Use 79 eligible groups | `MINIMUM_ELIGIBLE_GROUPS_NOT_MET` | `INSUFFICIENT_EVIDENCE` |
| `C4` | Omit one of the 12 V×P strata | `MINIMUM_VXP_STRATA_NOT_MET` | `INSUFFICIENT_EVIDENCE` |
| `C5` | Retain only three groups in one included stratum | `MINIMUM_GROUPS_PER_STRATUM_NOT_MET` | `INSUFFICIENT_EVIDENCE` |
| `C6` | Run left-identity and right-identity single-value subcases | `MINIMUM_DISTINCT_LEFT_IDENTITIES_NOT_MET` or `MINIMUM_DISTINCT_RIGHT_IDENTITIES_NOT_MET` | `INSUFFICIENT_EVIDENCE` |
| `C7` | Run missing-voice and missing-position coverage subcases | `VOICE_COVERAGE_MINIMUM_NOT_MET` or `POSITION_COVERAGE_MINIMUM_NOT_MET` | `INSUFFICIENT_EVIDENCE` |
| `C8` | Run rare-identity and concentration subcases | `RARE_IDENTITY_SPARSE_THRESHOLD_EXCEEDED` or `CONCENTRATION_CONFOUND_THRESHOLD_EXCEEDED` | no support claim |
| `C9` | Use an exchangeability pool of 29 groups | `EXCHANGEABILITY_MINIMUM_NOT_MET` | `INSUFFICIENT_EVIDENCE` |

No C fixture may be repaired after observing a result. The expected reason is
part of the fixture definition.

## 7. Replicate schedule

```text
MASTER_SEED=FRD02_CVC_V0_1B_P4_MASTER_0
REPLICATE_IDS=0,1,2,3,4,5,6,7
REPLICATES_PER_FIXTURE=8
FIXTURE_ORDER=FIXTURE_IDS_V0_1B order above
TOTAL_REPLICATE_EVALUATIONS=232
```

The existing `canonicalSeedTupleV0_1B` and `seedWordsV0_1B` functions remain
the seed authority. Each evaluation uses:

```text
canonicalSeedTupleV0_1B(fixtureId, replicateId, "permutation-primary")
```

and therefore remains bound to the existing amendment, generator, and
analyzer contract hashes. `MASTER_SEED` is the schedule identity and is not a
second unreviewed input to the existing seed tuple.

Fixture ordering, replicate ordering, and canonical record ordering are fixed
and UTF-8 byte ordered. There is no adaptive replication, replacement
replicate, or “run more until stable” rule.

The resource ceiling is 232 fixture-replicate evaluations, with the existing
P2 exact-state/transition limits and existing 10,000-draw Monte Carlo limit
remaining binding. A schema-invalid replicate, seed mismatch, resource
failure, or runtime failure produces `CALIBRATION_INVALID` for the run and
invalidates aggregate acceptance; it is not replaced.

## 8. Acceptance

`CALIBRATION_PASS`, `CALIBRATION_FAIL`, and `CALIBRATION_INVALID` are
methodology-level execution classifications. They do not replace the existing
P3 scientific outcome vocabulary.

Per-fixture acceptance requires:

- valid fixture schema and exact fixture/replicate identity;
- no unauthorized analyzer fields;
- deterministic record and seed serialization;
- expected cluster and repeated-frame exclusions;
- expected Gate A reason/state;
- expected P2 branch or predeclared P2 failure reason;
- expected outcome class and no forbidden support classification;
- for the N11 pair, ordered statistic greater than destroyed statistic and
  destroyed control not classified as support.

The positive-control acceptance is eight of eight valid `N11_ORDERED`
replicates with the expected support outcome and zero of eight
`N11_ORDER_DESTROYED` replicates classified as support. A single invalid
replicate makes the fixture and aggregate invalid rather than triggering a
rerun.

Aggregate `CALIBRATION_PASS` requires:

1. all 232 evaluations are valid;
2. all C0-C9 expected reason/state controls pass;
3. all neutral controls avoid support;
4. N12 uses `EXHAUSTIVE` and N13 uses `MONTE_CARLO` with 10,000 draws;
5. the N11 positive/destroyed acceptance passes;
6. replaying the exact manifest produces identical serialized outputs and
   hashes.

Any valid but unexpected scientific outcome is `CALIBRATION_FAIL`. Any
schema, seed, resource, runtime, or serialization failure is
`CALIBRATION_INVALID`.

These criteria calibrate implementation behavior against constructed truth.
They do not establish or reject the FRD-02 real-world hypothesis.

## 9. Redesign and runner contract

After the first calibration execution begins, fixture definitions, seeds,
replicate counts, expected outcomes, thresholds, and serialization are
immutable for this version. A methodological defect requires a new version
with an explicit invalidation/provenance explanation. A scientifically
inconvenient but valid failure remains a failure.

The machine-readable artifact freezes:

- input record fields and fixture IDs;
- common and per-fixture parameters;
- seed identity and derivation;
- replicate identity and ordering;
- expected Gate A/P2/outcome metadata;
- canonical JSON serialization order;
- output fields required for each replicate and aggregate;
- invalid-run reason categories;
- artifact hash-manifest requirements.

The next lane may choose engineering details that do not alter these
scientific choices. It may not add fixture truth, modify thresholds, or
reinterpret a failure.

## 10. Validation boundary

This lane adds contract-shape validation only. It does not run P4, P2
calibration, real data, providers, API, chat, or production code.

P1/P2/P3 files and tests are unchanged. The next lane is:

```text
FRD02_P4_IMPLEMENTATION_AND_VALIDATION
```

After that implementation lane, a separately authorized lane may execute the
frozen synthetic calibration and accept `CALIBRATION_PASS`,
`CALIBRATION_FAIL`, or `CALIBRATION_INVALID` without redesigning v0.1.
