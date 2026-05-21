# Cohort 03 Hindi `/i/` Short-`i` vs Long-`ee` High-Anchor Result v0.1

Status: inspected result summary  
Scope: documentation only  
Date recorded: 2026-05-21

## 1. Purpose

This document records the inspected result of the Cohort 03 Hindi `/i/` short-`i` versus long-`ee` high-anchor probe.

This is a result summary for the saved `/evals` series:

- `cohort03-hi-i-short-i-vs-long-ee-high-anchor-v0.1`

It follows the run-design document:

- `docs/evals/cohort-03-hi-i-short-i-vs-long-ee-high-anchor-run-design-v0.1.md`

This document does not introduce new runs, new scoring, new export behavior, new UI behavior, or new anchor doctrine.

## 2. Mechanism question

The probe tested one narrow confound:

> Does Hindi `/i/` remain `COLLAPSED_HIGH` when the `V6-V7` high anchor uses short-`i` geometry instead of long-`ee` geometry?

Background:

- Prior Hindi `/i/` `V6-V7` high-anchor geometry used long-`ee` transliteration markers.
- The previous token-geometry inspection found that the Hindi `V6-V7` high anchor had `0` short-`i` markers and `10` `ee` markers.
- Arabic `/i/` stabilized under a short-`i` high anchor, while Hindi `/i/` remained high-collapsed under a long-`ee` high anchor.
- This probe tests whether the Hindi collapse is sensitive to that high-anchor geometry difference.

## 3. Evidence pack

Evidence pack inspected:

- `evals.series-evidence-pack.cohort03-hi-i-short-i-vs-long-ee-high-anchor-v0.1.v0.1.zip`

Observed SHA256:

- `838fb7c5095094b3d01c82b8d34b322d38ce0623d619846e59f6c598532ee235`

The ZIP includes:

- `00_README.md`
- `01_RUN_INDEX.md`
- `series-summary.csv`
- `series-diagnostics.json`
- all 4 run folders
- all 4 `input.json`
- all 4 `report.json`
- all 4 `report.md`
- all 4 `report.pdf`
- all 4 `workbook.xlsx`
- all 4 `summary.csv`
- all 4 `notes.md`

## 4. Series metadata

Series label:

- `cohort03-hi-i-short-i-vs-long-ee-high-anchor-v0.1`

Common run configuration:

- `taskId`: `T5_INTERMEDIATE_V0_1`
- `inputShape`: `intermediate_triple`
- `languageHint`: `hi`
- `vowelUnderTest`: `i`
- bracket: `V6-V7`

Run set design:

| Role | Count | High-anchor type |
|---|---:|---|
| control | 2 | long-`ee` high anchor |
| candidate | 2 | short-`i` high anchor |

Candidate run IDs:

- `cohort03-hi-i-main-short-i-high-anchor-candidate-r01`
- `cohort03-hi-i-alt-short-i-high-anchor-candidate-r01`

Control run IDs:

- `cohort03-hi-i-main-long-ee-high-anchor-control-r01`
- `cohort03-hi-i-alt-long-ee-high-anchor-control-r01`

## 5. Diagnostics artifact status

`series-diagnostics.json` is present.

Series diagnostics:

| Field | Value |
|---|---|
| artifactVersion | `highRegionSeriesDiagnosticsArtifact.v0.1` |
| helper | `diagnoseHighRegionCollapseV0_1` |
| seriesHelper | `diagnoseHighRegionCollapseSeriesV0_1` |
| collapseMode | `BOUNDARY_OVERPRESSURE` |
| secondary | empty |
| diagnosticBasis | `widerControlCollapsedHigh`, `boundaryFlagsPresent` |

Important reading:

> The diagnostics artifact labels the series as `BOUNDARY_OVERPRESSURE` because the long-`ee` control side collapsed high and one short-`i` candidate carried a high-boundary uncertainty flag. This label should not be read as bracket support or as a solved `/i/` result.

## 6. Run results

| # | Run ID | Target bucket | High anchor | Role | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---|---|---:|---:|---:|---|
| 1 | `cohort03-hi-i-main-long-ee-high-anchor-control-r01` | main | long-`ee` | control | `COLLAPSED_HIGH` | `3.602564` | `0.468333` | `-0.338333` | none |
| 2 | `cohort03-hi-i-main-short-i-high-anchor-candidate-r01` | main | short-`i` | candidate | `COLLAPSED_HIGH` | `1.018116` | `0.468333` | `-0.008333` | `BOUNDARY_UNCERTAIN_HIGH` |
| 3 | `cohort03-hi-i-alt-long-ee-high-anchor-control-r01` | alternate | long-`ee` | control | `COLLAPSED_HIGH` | `2.153846` | `0.280000` | `-0.150000` | none |
| 4 | `cohort03-hi-i-alt-short-i-high-anchor-candidate-r01` | alternate | short-`i` | candidate | `INTERMEDIATE` | `0.608696` | `0.280000` | `0.180000` | none |

## 7. Main result

The probe produced a mixed mechanism result.

Observed pattern:

| Comparison | Long-`ee` high anchor | Short-`i` high anchor | Result |
|---|---|---|---|
| Main target bucket | `COLLAPSED_HIGH` | `COLLAPSED_HIGH` with `BOUNDARY_UNCERTAIN_HIGH` | improved but not rescued |
| Alternate target bucket | `COLLAPSED_HIGH` | `INTERMEDIATE` | rescued / stabilized |

Primary reading:

> Hindi `/i/` collapse is sensitive to high-anchor geometry, but the long-`ee` high anchor does not fully explain the pressure by itself.

Secondary reading:

> Replacing the long-`ee` high anchor with a short-`i` high anchor reduces high-collapse pressure, but the main target bucket remains near the high boundary and still returns `COLLAPSED_HIGH`.

## 8. Relationship to the run-design outcomes

The run-design defined four broad outcome classes:

- Outcome A: short-`i` high anchor stabilizes Hindi.
- Outcome B: Hindi remains collapsed under both high anchors.
- Outcome C: both high-anchor types stabilize.
- Outcome D: short-`i` anchor worsens or creates boundary artifacts.

This result does not fit one clean outcome class.

It is closest to a split between:

- Outcome A for the alternate target bucket: short-`i` high anchor stabilizes Hindi.
- Outcome B for the main target bucket: Hindi remains collapsed under both high anchors, but the short-`i` candidate is only barely high-collapsed and carries `BOUNDARY_UNCERTAIN_HIGH`.

Correct classification:

> Partial stabilization / anchor-geometry sensitivity.

## 9. Mechanism interpretation

The result supports a narrow mechanism interpretation:

1. The long-`ee` high anchor is a real pressure source.
2. The short-`i` high anchor changes the geometry enough to rescue the alternate target bucket.
3. The main target bucket still collapses high under the short-`i` high anchor, but only at the high boundary.
4. Therefore, Hindi `/i/` pressure is not fully reducible to the long-`ee` anchor confound.

This keeps the prior Hindi `/i/` interpretation intact but sharper:

> Hindi `/i/` remains a persistent high-region pressure case, with measurable sensitivity to high-anchor token geometry.

## 10. Claim boundaries

Allowed:

- The evidence pack is complete and includes `series-diagnostics.json`.
- The long-`ee` controls both returned `COLLAPSED_HIGH`.
- One short-`i` candidate returned near-boundary `COLLAPSED_HIGH` with `BOUNDARY_UNCERTAIN_HIGH`.
- One short-`i` candidate returned `INTERMEDIATE`.
- The series diagnostic is `BOUNDARY_OVERPRESSURE`.
- The result shows partial stabilization under short-`i` high-anchor geometry.
- Hindi `/i/` collapse is sensitive to high-anchor geometry.
- The long-`ee` high anchor is a likely pressure source.

Blocked:

- Do not claim `V6-V7` solves `/i/`.
- Do not claim Hindi `/i/` supports `V6-V7`.
- Do not claim Hindi `/i/` falsifies the model from this probe alone.
- Do not claim the long-`ee` confound fully explains Hindi `/i/` collapse.
- Do not claim the short-`i` high anchor is a new doctrine/anchor definition.
- Do not change scorer math from this result alone.
- Do not change anchor doctrine from this result alone.
- Do not update README from this result.
- Do not publish this as final evidence.

## 11. Next mechanism question

The next question is no longer:

> Is Hindi `/i/` collapse only caused by long-`ee` high-anchor geometry?

The answer is no.

The sharper next question is:

> Why does the main Hindi `/i/` target bucket still collapse at the high boundary under a short-`i` high anchor, while the alternate target bucket stabilizes?

Recommended next investigation direction:

1. Inspect target-bucket internal geometry for the main versus alternate Hindi `/i/` buckets.
2. Compare short-`i` high anchor against both target buckets using token-geometry inspection, not new scoring first.
3. Check whether the short-`i` high anchor is too target-like or whether the main target bucket carries additional pressure.
4. Avoid broad language expansion until this target-bucket split is understood.

## 12. Publication status

This result is not publication-ready by itself.

It is repo-ready as an inspected diagnostic result.

Publication would require:

- replication of the short-`i` versus long-`ee` effect;
- a predeclared target-bucket geometry inspection;
- explicit explanation of the main/alternate target split;
- stable archive packaging if included in a paper bundle.
