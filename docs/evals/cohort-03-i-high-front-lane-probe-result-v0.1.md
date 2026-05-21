# Cohort 03 `/i/` High-Front Lane Probe Result v0.1

Status: inspected result summary
Scope: documentation only
Date recorded: 2026-05-20

## 1. Purpose

This document records the inspected result of the Cohort 03 `/i/` high-front lane probe.

This is a result summary for the saved `/evals` series:

- `cohort03-i-high-front-lane-probe-v0.1`

It follows the run-design document:

- `docs/evals/cohort-03-i-high-front-lane-probe-run-design-v0.1.md`

This document does not introduce new runs, new scoring, new export behavior, or new claims beyond the inspected evidence pack.

## 2. Evidence pack

Corrected evidence pack inspected:

- `evals.series-evidence-pack.cohort03-i-high-front-lane-probe-v0.1.v0.1 (2).zip`

SHA256:

- `fcf3c5bc49489be579e3b2a0e8777b4e7872b1c40633e4fe51e126dabc0408ab`

The corrected ZIP includes:

- `00_README.md`
- `01_RUN_INDEX.md`
- `series-summary.csv`
- `series-diagnostics.json`
- all 8 run folders
- all 8 `input.json`
- all 8 `report.json`
- all 8 `report.md`
- all 8 `report.pdf`
- all 8 `workbook.xlsx`
- all 8 `summary.csv`
- all 8 `notes.md`

## 3. Diagnostics artifact status

`series-diagnostics.json` is present.

Series metadata:

| Field | Value |
|---|---|
| seriesLabel | `cohort03-i-high-front-lane-probe-v0.1` |
| cohort | `cohort03` |
| phase | `series-evidence-pack` |
| languageHint | `mixed` |
| vowelUnderTest | `mixed` |
| taskId | `T5_INTERMEDIATE_V0_1` |
| inputShape | `intermediate_triple` |

Run set summary:

| Role | Count | Brackets |
|---|---:|---|
| candidate | 2 | `V6-V7` |
| control | 6 | `V5-V7`, `V6-V7` |

Candidate run IDs:

- `cohort03-hi-i-high-front-lane-v6-v7-candidate-r01`
- `cohort03-ar-i-high-front-lane-v6-v7-candidate-r01`

Control run IDs:

- `cohort03-hi-i-high-front-lane-prior-v5-v7-control-r01`
- `cohort03-ar-i-high-front-lane-prior-v5-v7-control-r01`
- `cohort03-fi-y-high-front-lane-prior-v5-v7-control-r01`
- `cohort03-fi-y-high-front-lane-v6-v7-control-r01`
- `cohort03-tr-ii-high-front-lane-prior-v6-v7-control-r01`
- `cohort03-tr-ii-high-front-lane-v5-v7-control-r01`

Diagnostics label:

| Field | Value |
|---|---|
| collapseMode | `BOUNDARY_OVERPRESSURE` |
| diagnosticBasis | `boundaryFlagsPresent` |
| secondary | empty |

Important reading:

> The diagnostics artifact labels the series as `BOUNDARY_OVERPRESSURE` because boundary flags are present in the control side of the series. This label should not be read as a clean candidate-only collapse diagnosis.

## 4. Run results

| # | Run ID | Target | Bracket | Role | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---|---|---:|---:|---:|---|
| 1 | `cohort03-hi-i-high-front-lane-prior-v5-v7-control-r01` | Hindi `/i/` | `V5-V7` | control | `COLLAPSED_HIGH` | `2.230159` | `0.468333` | `-0.258333` | none |
| 2 | `cohort03-hi-i-high-front-lane-v6-v7-candidate-r01` | Hindi `/i/` | `V6-V7` | candidate | `COLLAPSED_HIGH` | `3.602564` | `0.468333` | `-0.338333` | none |
| 3 | `cohort03-ar-i-high-front-lane-prior-v5-v7-control-r01` | Arabic `/i/` | `V5-V7` | control | `COLLAPSED_HIGH` | `-12.875000` | `0.515000` | `-0.555000` | none |
| 4 | `cohort03-ar-i-high-front-lane-v6-v7-candidate-r01` | Arabic `/i/` | `V6-V7` | candidate | `INTERMEDIATE` | `0.656051` | `0.515000` | `0.270000` | none |
| 5 | `cohort03-fi-y-high-front-lane-prior-v5-v7-control-r01` | Finnish `/y/` | `V5-V7` | control | `INTERMEDIATE` | `0.018868` | `0.005000` | `0.260000` | `NEAR_COLLAPSE_LOW`, `BOUNDARY_UNCERTAIN_LOW` |
| 6 | `cohort03-fi-y-high-front-lane-v6-v7-control-r01` | Finnish `/y/` | `V6-V7` | control | `INTERMEDIATE` | `0.018868` | `0.005000` | `0.260000` | `NEAR_COLLAPSE_LOW`, `BOUNDARY_UNCERTAIN_LOW` |
| 7 | `cohort03-tr-ii-high-front-lane-prior-v6-v7-control-r01` | Turkish `/ı/` | `V6-V7` | control | `INTERMEDIATE` | `0.685185` | `0.185000` | `0.085000` | `BOUNDARY_UNCERTAIN_HIGH` |
| 8 | `cohort03-tr-ii-high-front-lane-v5-v7-control-r01` | Turkish `/ı/` | `V5-V7` | control | `INTERMEDIATE` | `0.867187` | `0.555000` | `0.085000` | `BOUNDARY_UNCERTAIN_HIGH` |

## 5. Main result

The probe produced a mixed mechanism result.

Observed pattern:

| Target | Prior / control bracket | Narrow / comparison bracket | Result |
|---|---|---|---|
| Hindi `/i/` | `COLLAPSED_HIGH` under `V5-V7` | `COLLAPSED_HIGH` under `V6-V7` | not rescued |
| Arabic `/i/` | `COLLAPSED_HIGH` under `V5-V7` | `INTERMEDIATE` under `V6-V7` | rescued / bracket-sensitive |
| Finnish `/y/` | `INTERMEDIATE` under `V5-V7` | `INTERMEDIATE` under `V6-V7` | control stayed non-collapsed, but low-edge stressed |
| Turkish `/ı/` | `INTERMEDIATE` under `V6-V7` | `INTERMEDIATE` under `V5-V7` | control stayed non-collapsed, but high-edge uncertain |

Primary reading:

> `V6-V7` is not a general solution for `/i/` pressure. It helps Arabic `/i/`, but Hindi `/i/` remains high-collapsed and becomes more extreme under the narrower lane.

Secondary reading:

> The lane is not globally destructive because Finnish `/y/` and Turkish `/ı/` remain `INTERMEDIATE`.

## 6. Mechanism interpretation

The result separates `/i/` pressure into at least two classes.

### 6.1 Arabic `/i/`: bracket-sensitive pressure

Arabic `/i/` moved from:

- `COLLAPSED_HIGH` under `V5-V7`

to:

- `INTERMEDIATE` under `V6-V7`

Interpretation:

> Arabic `/i/` is bracket-sensitive under this diagnostic lens. Narrowing the lane changes the verdict from high-collapse to intermediate.

### 6.2 Hindi `/i/`: deeper pressure case

Hindi `/i/` remained:

- `COLLAPSED_HIGH` under `V5-V7`
- `COLLAPSED_HIGH` under `V6-V7`

The normalized position became more extreme under `V6-V7`.

Interpretation:

> Hindi `/i/` is not solved by bracket narrowing alone. It remains the harder `/i/` pressure case.

### 6.3 Finnish `/y/`: non-collapsed control with low-edge stress

Finnish `/y/` remained `INTERMEDIATE` under both comparisons, but carried:

- `NEAR_COLLAPSE_LOW`
- `BOUNDARY_UNCERTAIN_LOW`

Interpretation:

> Finnish `/y/` does not repeat `/i/` high-collapse, but it is not a clean stable control. It is low-edge stressed.

### 6.4 Turkish `/ı/`: non-collapsed control with high-edge uncertainty

Turkish `/ı/` remained `INTERMEDIATE` under both comparisons, but carried:

- `BOUNDARY_UNCERTAIN_HIGH`

Interpretation:

> Turkish `/ı/` does not repeat `/i/` high-collapse, but it remains high-edge uncertain.

## 7. Outcome classification against run-design logic

The run-design expected four broad outcomes.

This result is closest to a split between:

- Outcome A for Arabic `/i/`: `/i/` stabilizes and controls do not collapse.
- Outcome B for Hindi `/i/`: `/i/` remains high-collapsed and controls do not collapse.

Therefore the batch does not fit a single clean outcome class.

Correct classification:

> Mixed mechanism result: Arabic `/i/` is bracket-sensitive; Hindi `/i/` remains unresolved high-pressure; controls remain non-collapsed but boundary-stressed.

## 8. Claim boundaries

Allowed:

- The corrected evidence pack is complete and includes `series-diagnostics.json`.
- The high-front lane probe produced a mixed mechanism result.
- Arabic `/i/` stabilizes under `V6-V7` in this probe.
- Hindi `/i/` remains `COLLAPSED_HIGH` under `V6-V7`.
- Finnish `/y/` and Turkish `/ı/` remain `INTERMEDIATE`.
- Boundary uncertainty exists in the controls and must be kept visible.
- `V6-V7` is a useful diagnostic comparison, not a solved bracket.

Blocked:

- Do not claim `V6-V7` solves `/i/`.
- Do not claim `/i/` supports `V6-V7`.
- Do not claim the high-region model is solved.
- Do not claim this is publication-ready.
- Do not update README from this result.
- Do not change scorer math from this result alone.
- Do not change anchor definitions from this result alone.
- Do not hide the control boundary flags.

## 9. Next mechanism question

The next question is not whether `V6-V7` works globally.

The next question is:

> Why does Arabic `/i/` stabilize under `V6-V7` while Hindi `/i/` remains high-collapsed?

Recommended next investigation direction:

1. Compare Hindi `/i/` and Arabic `/i/` token geometry directly.
2. Inspect whether Hindi target or anchor distributions create an unusually narrow/negative high gap.
3. Avoid more broad language expansion until the Hindi/Arabic split is explained.
4. Keep Finnish `/y/` and Turkish `/ı/` as control references, but do not treat them as clean support cases because both carry boundary uncertainty.

## 10. Publication status

This result is not publication-ready by itself.

It is repo-ready as an inspected diagnostic result.

Publication would require:

- at least one replication of the Hindi/Arabic split;
- a pre-declared follow-up design;
- stronger explanation of why Arabic stabilizes and Hindi does not;
- explicit treatment of Finnish and Turkish boundary flags;
- stable DOI/archive packaging if the result becomes part of a paper bundle.
