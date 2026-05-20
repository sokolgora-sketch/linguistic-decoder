# Cohort 03 High-Region Audit — Hindi `/i/` Arm C Result v0.1

Status: recorded result
Scope: documentation only
Date recorded: 2026-05-20

## 1. Purpose

This document records the result of the Hindi `/i/` high-anchor contamination audit, Arm C.

The audit question was:

> Does Hindi `/i/` still collapse high when the high-anchor bucket is cleaned to reduce obvious `/i/`, `ee`, and `ii` target contamination?

This was not designed as a support test. It was a diagnostic audit after repeated high-region collapse in Hindi `/i/` and related Indo-Iranian high-region tests.

## 2. Evidence pack

Exported series evidence pack:

- `evals.series-evidence-pack.cohort03-hi-i-high-anchor-contamination-audit-arm-c-v0.1.v0.1.zip`

Observed SHA256:

- `dac888accddb9bf5ec76f576975563eaec77f195f362c73086397173f3da665c`

The exported evidence pack included the series-level diagnostics artifact:

- `series-diagnostics.json`

## 3. Series metadata

Series label:

- `cohort03-hi-i-high-anchor-contamination-audit-arm-c-v0.1`

Common run configuration:

- `taskId`: `T5_INTERMEDIATE_V0_1`
- `inputShape`: `intermediate_triple`
- `languageHint`: `hi`
- `vowelUnderTest`: `i`
- candidate bracket: `V5-V7`
- control bracket: `V4-V7`

Design intent:

- preserve Hindi `/i/` target bucket behavior;
- reduce obvious target-vowel contamination in the high-anchor bucket;
- test whether prior high collapse was mainly an artifact of high-anchor contamination.

## 4. Run results

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high |
|---:|---|---|---|---:|---:|---:|
| 1 | `cohort03-hi-i-arm-c-v5-v7-candidate-main-r01` | `V5-V7` | `COLLAPSED_HIGH` | `2.230159` | `0.468333` | `-0.258333` |
| 2 | `cohort03-hi-i-arm-c-v5-v7-candidate-alt-r01` | `V5-V7` | `COLLAPSED_HIGH` | `3.121212` | `0.343333` | `-0.233333` |
| 3 | `cohort03-hi-i-arm-c-v4-v7-control-main-r01` | `V4-V7` | `COLLAPSED_HIGH` | `1.679825` | `0.638333` | `-0.258333` |
| 4 | `cohort03-hi-i-arm-c-v4-v7-control-alt-r01` | `V4-V7` | `COLLAPSED_HIGH` | `1.833333` | `0.513333` | `-0.233333` |

All four runs collapsed high.

## 5. Series diagnostics artifact

The exported `series-diagnostics.json` reported:

- `artifactVersion`: `highRegionSeriesDiagnosticsArtifact.v0.1`
- `seriesLabel`: `cohort03-hi-i-high-anchor-contamination-audit-arm-c-v0.1`
- `languageHint`: `hi`
- `vowelUnderTest`: `i`
- `candidate count`: `2`
- `control count`: `2`
- `collapseMode`: `null`
- `secondary`: `BRACKET_GEOMETRY_SUSPECT`

Diagnostic basis:

- `candidateCollapsedHigh`
- `widerControlCollapsedHigh`
- `highSideGapNegative`

Claim boundary count:

- `5`

## 6. Interpretation

Arm C did not rescue Hindi `/i/`.

The result is:

> Hindi `/i/` still collapses high after high-anchor contamination reduction.

Interpretation:

- high-region pressure persists;
- the collapse is not primarily explained by obvious high-anchor target contamination;
- `V5-V7` remains unsupported for Hindi `/i/` under this audit;
- widening to `V4-V7` also did not stabilize the series;
- the result strengthens the bracket-geometry / high-region model-pressure interpretation.

This result should be treated as diagnostic pressure, not framework support.

## 7. Relationship to prior Hindi `/i/` results

Prior Hindi `/i/` high-region work had already shown repeated high collapse across candidate and control brackets.

Arm C adds one specific constraint:

> Even after reducing obvious high-anchor target contamination, collapse persists.

Therefore, the strongest current Hindi `/i/` reading is:

> Hindi `/i/` is a persistent high-region pressure case. The current high-region bracket model remains unstable for this target, and contamination alone does not explain the collapse.

## 8. Claim boundaries

Allowed:

- Hindi `/i/` Arm C is recorded.
- Arm C produced four `COLLAPSED_HIGH` runs.
- Both `V5-V7` candidate runs collapsed high.
- Both `V4-V7` control runs collapsed high.
- The exported evidence pack included `series-diagnostics.json`.
- The series diagnostics artifact reported `BRACKET_GEOMETRY_SUSPECT`.
- High-anchor contamination reduction did not stabilize this Hindi `/i/` series.
- Hindi `/i/` remains a high-region pressure case.

Blocked:

- Do not claim Hindi `/i/` supports `V5-V7`.
- Do not claim Hindi `/i/` supports `V4-V7`.
- Do not claim the high-region issue is solved.
- Do not claim high-anchor contamination is irrelevant in all cases.
- Do not claim this result proves or disproves the full framework.
- Do not update README from this result alone.
- Do not publish this as a final proof claim.
- Do not change scorer math from this result alone.

## 9. Next work

Recommended next step:

- stop running more high-region support tests until a sharper diagnostic question is chosen.

Possible next diagnostic direction:

1. compare same target bucket against multiple alternative high anchors;
2. build a small anchor-sensitivity matrix for Hindi `/i/`;
3. test whether the issue is target-internal, anchor-internal, or bracket-geometry-wide.

Do not proceed to publication claims from Arm C alone.
