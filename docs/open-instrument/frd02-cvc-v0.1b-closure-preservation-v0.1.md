# Open Instrument — FRD-02 CVC v0.1b Closure / Preservation

Status: FRD02_V0_1B_CALIBRATION_ATTEMPT=STOPPED_BEFORE_CALIBRATION.

This is a closure-only preservation document. It records the validated P1/P2/P3
research infrastructure and the hard stop before P4 calibration. It does not
authorize calibration, real-data execution, semantic reveal, production
promotion, or a new FRD-02 design cycle.

## Closure state

```text
IMPLEMENTATION_STATUS=P1/P2/P3_COMPLETE
CALIBRATION_STATUS=NOT_EXECUTED
CLOSURE_REASON=CALIBRATION_SPEC_INCOMPLETE
SCIENTIFIC_RESULT=NOT_ESTABLISHED
P4_IMPLEMENTED=NO
REAL_DATA_EXECUTED=NO
SEMANTIC_REVEAL=NO
PRODUCTION_PROMOTION=NO
LEGACY_CALIBRATION_MATRIX_RECOVERY=PARTIAL_RECOVERY
NEW_SCIENTIFIC_CHOICES_REQUIRED=YES
```

## Preserved research infrastructure

The six preserved files are research infrastructure, not production behavior.
Their dependency chain is:

```text
P1 exact uint128 arithmetic → P2 exact structural-zero NULL → P3 synthetic analyzer/fixture adapter
```

### P1

- `src/shared/openInstrument/frd02CvcUint128.v0_1b.ts`
- `tests/openInstrument.frd02CvcUint128.v0_1b.spec.ts`

P1 provides exact unsigned 128-bit arithmetic for FRD-02 exact-null component
counts. Its focused suite passed 12 tests.

### P2

- `src/shared/openInstrument/frd02CvcExactNull.v0_1b.ts`
- `tests/openInstrument.frd02CvcExactNull.v0_1b.spec.ts`

P2 provides exact structural-zero NULL machinery, including admissibility,
matching, reduction, component handling, exact counting, and exact-uniform
sampling. Its focused suite passed 25 tests.

### P3

- `src/shared/openInstrument/frd02CvcSyntheticCalibration.v0_1b.ts`
- `tests/openInstrument.frd02CvcSyntheticCalibration.v0_1b.spec.ts`

P3 provides the synthetic structural-record validator, normalization, group
weighting, Gate A, profile/signature adapter, statistic, P2 integration,
finite-null mapping, deterministic seed binding, and outcome classification.
Its focused suite passed 31 tests.

The P3 suite exercised the bounded exact 10,000-draw path in approximately
25–26 seconds. That is focused implementation/performance evidence only. It is
not synthetic calibration evidence.

Current reachability is:

```text
PRODUCTION_REACHABILITY=NONE
API_REACHABILITY=NONE
CHAT_REACHABILITY=NONE
```

No production, API, chat, or runtime module imports these six files.

## Why calibration stopped

P1, P2, and P3 were implemented and focused-tested. P4 was not implemented,
and the full v0.1b synthetic calibration was not executed. No real-data
FRD-02 execution occurred, no semantic reveal occurred, and no scientific
SUPPORT or scientific NULL result was established.

The legacy-evidence recovery audit recovered substantial historical v0.1a
generator, analyzer, runner, contract, result, audit, and method-review
material. It recovered only:

```text
CALIBRATION_MATRIX_RECOVERY=PARTIAL_RECOVERY
```

The complete v0.1b calibration program was not mechanically recoverable.
Remaining choices included, at minimum:

- v0.1b-compatible fixture construction;
- `clusterAdjacent` truth in generated records;
- a Gate-A-compatible positive-control scaffold;
- exact N11 ordered and order-destroyed construction;
- exact C0–C9 structural/P2 fixtures;
- the complete v0.1b replicate schedule;
- complete per-fixture and aggregate acceptance criteria.

Continuing would require new scientific choices. The explicit hard-runway
policy therefore stopped the v0.1b attempt instead of redesigning fixtures
after historical calibration defects had already been observed.

This closure distinguishes implementation validation from synthetic
calibration and from real-data scientific evidence. It does not state or imply
FRD02=NULL, FRD02=SUPPORT, CVC_CONFIGURATIONAL_SUPPORT, CALIBRATION_FAILED,
NO_CONSONANT_FUNCTION, CONSONANTS_HAVE_FUNCTION, WORDS_ARE_ARBITRARY, or
WORDS_ARE_NONARBITRARY.

## Frozen contract identities

The following artifacts remain external `/tmp` research artifacts. This
closure records their provenance but does not recreate or modify them.

| Artifact | Path | Bytes | SHA-256 |
|---|---|---:|---|
| Parent contract MD | `/tmp/open-instrument-frd02-cvc-experimental-contract-v0-1b-20260927.md` | 14074 | `3c6e2d64769d3138d47f50b5e758a40080a6b502a6c9c6cb9db30ce1a0b4de94` |
| Parent contract JSON | `/tmp/open-instrument-frd02-cvc-experimental-contract-v0-1b-20260927.json` | 14241 | `dbca018b9ccfbc5462c65993c5090cd864c5eff457eee38f10cfbd187224c563` |
| P3 amendment MD | `/tmp/open-instrument-frd02-cvc-p3-contract-seam-amendment-v0-1b-20260927.md` | 5391 | `f40d9901d84a96e248804639fa3192a4a6d574c2cbe5afa5a204fa00fdb40394` |
| P3 amendment JSON | `/tmp/open-instrument-frd02-cvc-p3-contract-seam-amendment-v0-1b-20260927.json` | 5857 | `77038ccc5406da0f6970fab2c667ea131955057abc1907f0f59e61180e306129` |
| Synthetic generator contract | `/tmp/open-instrument-frd02-cvc-v0-1b-synthetic-generator-contract-20260927.json` | 25837 | `571ef6f139442b086887fb847097aff13edb53dea835b64c97b0b1fbf46a7a8d` |
| Synthetic analyzer contract | `/tmp/open-instrument-frd02-cvc-v0-1b-synthetic-analyzer-contract-20260927.json` | 18613 | `3cf7076b5f9685990891ad6333a89b75aa8823d977664f2c9bffe2364d63608e` |

Their existence does not mean that the full calibration program was complete.

## Validation proof

The following checks passed before closure:

```text
npm test -- tests/openInstrument.frd02CvcUint128.v0_1b.spec.ts --runInBand
  1 suite, 12 tests passed

npm test -- tests/openInstrument.frd02CvcExactNull.v0_1b.spec.ts --runInBand
  1 suite, 25 tests passed

npm test -- tests/openInstrument.frd02CvcSyntheticCalibration.v0_1b.spec.ts --runInBand
  1 suite, 31 tests passed

npx tsc -p tsconfig.typecheck.full.json --noEmit --incremental false
  PASS

npx tsc -p tsconfig.contracts.json --noEmit --incremental false
  PASS

git diff --check
  PASS
```

No full FRD-02 synthetic calibration was run.

## Boundary status

- P4 calibration runner remains unimplemented.
- Full synthetic calibration remains unexecuted.
- Real-data FRD-02 execution remains unauthorized and unperformed.
- The real-data cluster-adjacency rule remains unresolved.
- No semantic reveal or semantic interpretation occurred.
- No production, API, chat, runtime, package, or CI behavior was changed by
  this closure.
- No scientific result is established by this closure.

## Next authorized lifecycle step

The next step after this closure is the separate closure Git/PR workflow:

```text
FRD02_V0_1B_NARROW_CLOSURE_PATCH=PASS
NEXT_AUTHORIZED_STAGE=FRD02_CVC_V0_1B_CLOSURE_GIT_PR_WORKFLOW
```

No new research lane is selected by this document. Any future lane requires a
separate evidence-based decision after closure commit, PR, CI, merge, main
synchronization, and post-merge proof.
