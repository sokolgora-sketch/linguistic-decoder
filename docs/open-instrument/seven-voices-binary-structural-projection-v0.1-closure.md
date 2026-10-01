# Open Instrument — Seven Voices Binary Structural Projection v0.1 Closure

Status: `SEVEN_VOICES_BINARY_PROJECTION_V0_1=CLOSED_REDUNDANT_RESULT_PRESERVED`

This is a docs-only closure and reconciliation record. It does not rerun the
experiment, change its preregistration or result, authorize production binary
semantics, alter the Seven-Voices canon, or activate Diachronic Binary
Transition Experiment v0.2.

## Closed evidence chain

The preregistration and execution are preserved on `main` in this order:

| Artifact | Path | Commit | SHA-256 |
|---|---|---|---|
| Preregistration | `docs/open-instrument/research-artifacts/seven-voices-binary-structural-projection-v0-1/preregistration.json` | `cea2b5d90686a0ff579bc296062ebf50c6f62583` (`#2017`) | `240e7af20ff90122b254db31eaa407053c922b937ad93489a8f6c085a95d412f` |
| Persisted result | `docs/open-instrument/research-artifacts/seven-voices-binary-structural-projection-v0-1/result.json` | `2a93ae84ea6a73842ec94b8f86bfc504745551b3` (`#2018`) | `4203a9f049e220e3a4ff10d761ad2b04d39833d7cda3a90baca0307df26c1af3` |

PR #2018 has PR #2017 as its direct parent. The preregistration status is
`PREREGISTERED_BEFORE_EXPERIMENT`; its base SHA is
`e04f5b96299e0f170b59dcdb8ed9d0ac8aad4e26`. The persisted result binds the
preregistration hash and canonical structural-input fingerprint
`d0450375a862a994c359fab7f30479e06fef51f50449ab452eafc0040818f481`.

## Frozen contract and execution conformance

- Experiment: `SEVEN_VOICES_BINARY_STRUCTURAL_PROJECTION_EXPERIMENT_V0_1`
- Question: whether `STRUCTURAL_V0_1` supplies structural information not
  already determined by canonical order/ring/mirror geometry.
- Mapping: `STRUCTURAL_V0_1`; fixed sentinel `000`; universe `7! = 5040`.
- Primary metric: `ADDITIONAL_STRUCTURAL_INVARIANT_COUNT`.
- Baseline/control: exhaustive fixed-sentinel controls, including
  `EXACT_RING_PRESERVING`, `CENTERED_MIRROR_EDGE`, and `UNRESTRICTED`.
- Decision rule: zero surviving nontrivial invariants is `REDUNDANT`.
- Exclusions: no semantic, linguistic, phonetic, historical, or production
  interpretation; no runtime/API/UI/canon mutation.

The persisted execution matches the frozen experiment identity, metric,
mapping, input fingerprint, control-family counts, comparison rule, decision
rule, and exclusions. The verifier is preserved at
`scripts/openInstrumentSevenVoicesBinaryStructuralProjectionExperimentVerification.v0_1.mjs`
and the focused test is preserved at
`tests/openInstrument.sevenVoicesBinaryStructuralProjectionExperiment.v0_1.spec.ts`.

## Result preserved exactly

```text
RESULT_CLASSIFICATION=REDUNDANT
PRIMARY_METRIC=ADDITIONAL_STRUCTURAL_INVARIANT_COUNT
PRIMARY_METRIC_VALUE=0
BY_CONSTRUCTION_COUNT=7
SYMMETRY_ARTIFACT_COUNT=9
SURVIVING_ADDITIONAL_INVARIANTS=[]
MAPPING_UNIVERSE_SIZE=5040
SEMANTIC_CLAIMS_MADE=false
LINGUISTIC_CLAIMS_MADE=false
PRODUCTION_AUTHORITY_CHANGED=false
```

The result's internal canonical-content hash is
`301d9185b36804309246887ef3437a392083b9822bb98a8cb8c3127d2391207b`.
The persisted JSON file hash is the SHA-256 recorded above. This closure does
not reinterpret `REDUNDANT` as support, failure, linguistic evidence, or
negative evidence about the Seven Voices.

## Closure decision

All required closure conditions are satisfied by the preserved repository
chain: frozen preregistration, preregistration-before-execution ordering,
matching execution, persisted result, frozen decision-rule classification,
preserved integrity tests, and no missing artifact required for verification.
The current synchronized main contains the complete chain and no local
evidence of an invalidating review finding. GitHub review metadata was not
available during this reconciliation; no remote review claim is made here.

```text
CLOSURE_ELIGIBILITY=ELIGIBLE
SEVEN_VOICES_BINARY_PROJECTION_V0_1=CLOSED_REDUNDANT_RESULT_PRESERVED
```

## Lifecycle boundary

The existing Linear milestone may be reconciled as completed with the
`REDUNDANT` result and primary metric `0` preserved. Diachronic Binary
Transition Experiment v0.2's prerequisite is thereby satisfied, but v0.2 is
not activated, designed, or executed by this closure.

No production, API, chat, UI, Seven-Voices-canon, Math7, semantic, linguistic,
or provider state is changed by this document.
