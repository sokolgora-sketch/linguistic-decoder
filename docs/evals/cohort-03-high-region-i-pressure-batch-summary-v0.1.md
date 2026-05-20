# Cohort 03 High-Region `/i/` Pressure Batch Summary v0.1

Status: recorded batch summary
Scope: documentation only
Date recorded: 2026-05-20

## 1. Purpose

This document records the combined result of the post-Arm-C high-region diagnostic batch.

The batch was created after Hindi `/i/` Arm C showed that high-anchor contamination reduction did not rescue the collapse pattern.

The batch question was:

> Is the observed high-region pressure global to all high-region targets, language-family-specific, or concentrated around `/i/` under the current lens?

This is not a support document. It is a diagnostic-pressure summary.

## 2. Batch scope

This summary covers these exported evidence packs:

| Case | Series label | Evidence pack SHA256 | Result |
|---|---|---|---|
| Hindi `/i/` anchor-sensitivity matrix | `cohort03-hi-i-anchor-sensitivity-matrix-v0.1` | `5dc1a4265575309d2227ec5b5f1321ada8633b58dcc60027a301c159d7a865fd` | all runs `COLLAPSED_HIGH` |
| Hindi `/i/` target-bucket split audit | `cohort03-hi-i-target-bucket-split-audit-v0.1` | `054c3b43138db13e33d5341ff9a8f61601ea7bc50b827cbc755f3e597a52503c` | all runs `COLLAPSED_HIGH` |
| Hindi `/i/` low-anchor sensitivity audit | `cohort03-hi-i-low-anchor-sensitivity-audit-v0.1` | `ced4e2f334192900fd3ef97ac65a496f3152cef5336af0a69953995835c075a9` | all runs `COLLAPSED_HIGH` |
| Persian `/i/` cleaned-anchor replication | `cohort03-fa-i-cleaned-anchor-replication-v0.1` | `015973f2c8660196872294c7b47beca1c481a506fcd45dff0cf638dc21edabbb` | all runs `COLLAPSED_HIGH` |
| Finnish `/y/` cleaned-anchor comparison | `cohort03-fi-y-cleaned-anchor-comparison-v0.1` | `f89db2a79b2742951bf43443c27ff49c4cd1ab0aec2522b2482c2b226918e3b2` | all runs `INTERMEDIATE` |
| Arabic `/i/` cleaned-anchor comparison | `cohort03-ar-i-cleaned-anchor-comparison-v0.1` | `8a618b0004635280f98334deed140d2f56f8310ba7dc3ec38f5eee55d5e6795b` | all runs `COLLAPSED_HIGH` |
| Hebrew `/i/` cleaned-anchor comparison | `cohort03-he-i-cleaned-anchor-comparison-v0.1` | `e72ae26f59c7c3027ceb69b99b9515db2c201723cc96caebd022add922532f7c` | all runs `COLLAPSED_HIGH` |
| Turkish `/ı/` cleaned-anchor comparison | `cohort03-tr-ii-cleaned-anchor-comparison-v0.1` | `8e7bdb48a14f5aeab8e347691b9063b9ea6e1d6a1714b3c8fc47e98914baaf8a` | mostly `INTERMEDIATE`; one mixed candidate `EXCEEDS_LOW` |

Each exported pack included:

- `series-diagnostics.json`
- per-run `report.json`
- per-run `report.md`
- per-run `report.pdf`
- per-run `workbook.xlsx`
- per-run `summary.csv`
- per-run `notes.md`

## 3. Prior anchor: Hindi `/i/` Arm C

Hindi `/i/` Arm C is recorded separately in:

- `docs/evals/cohort-03-high-region-hindi-i-arm-c-result-v0.1.md`

Arm C showed:

- candidate `V5-V7` main: `COLLAPSED_HIGH`
- candidate `V5-V7` alt: `COLLAPSED_HIGH`
- control `V4-V7` main: `COLLAPSED_HIGH`
- control `V4-V7` alt: `COLLAPSED_HIGH`

Arm C interpretation:

> Hindi `/i/` still collapsed high after high-anchor contamination reduction.

The batch summarized here extends that result across anchor design, target-bucket design, language family, and high-region control targets.

## 4. Hindi `/i/` follow-up diagnostics

### 4.1 Anchor-sensitivity matrix

Series:

- `cohort03-hi-i-anchor-sensitivity-matrix-v0.1`

Result:

| Anchor design | Bracket | Verdict |
|---|---|---|
| current lexical high anchor | `V5-V7` | `COLLAPSED_HIGH` |
| cleaned non-target high anchor | `V5-V7` | `COLLAPSED_HIGH` |
| shape/boundary high anchor | `V5-V7` | `COLLAPSED_HIGH` |
| cleaned widened control | `V4-V7` | `COLLAPSED_HIGH` |

Interpretation:

> Hindi `/i/` collapse is robust across tested high-anchor designs.

### 4.2 Target-bucket split audit

Series:

- `cohort03-hi-i-target-bucket-split-audit-v0.1`

Result:

| Target bucket | Bracket | Verdict |
|---|---|---|
| core/short `/i/` | `V5-V7` | `COLLAPSED_HIGH` |
| mixed `/i/` | `V5-V7` | `COLLAPSED_HIGH` |
| core/short `/i/` control | `V4-V7` | `COLLAPSED_HIGH` |
| mixed `/i/` control | `V4-V7` | `COLLAPSED_HIGH` |

Interpretation:

> Target-bucket split does not rescue Hindi `/i/`.

### 4.3 Low-anchor sensitivity audit

Series:

- `cohort03-hi-i-low-anchor-sensitivity-audit-v0.1`

Result:

| Low-anchor design | Bracket | Verdict |
|---|---|---|
| current `V5` low anchor | `V5-V7` | `COLLAPSED_HIGH` |
| alternate `V5` low anchor | `V5-V7` | `COLLAPSED_HIGH` |
| standard `V4` low anchor | `V4-V7` | `COLLAPSED_HIGH` |
| alternate `V4` low anchor | `V4-V7` | `COLLAPSED_HIGH` |

Interpretation:

> Low-anchor variation does not rescue Hindi `/i/`.

## 5. Cross-language `/i/` replications

### 5.1 Persian `/i/`

Series:

- `cohort03-fa-i-cleaned-anchor-replication-v0.1`

Result:

| Target bucket | Bracket | Verdict |
|---|---|---|
| core `/i/` | `V5-V7` | `COLLAPSED_HIGH` |
| mixed `/i/` | `V5-V7` | `COLLAPSED_HIGH` |
| core `/i/` control | `V4-V7` | `COLLAPSED_HIGH` |
| mixed `/i/` control | `V4-V7` | `COLLAPSED_HIGH` |

Interpretation:

> Persian `/i/` repeats the Hindi high-collapse pattern under cleaned anchors.

### 5.2 Arabic `/i/`

Series:

- `cohort03-ar-i-cleaned-anchor-comparison-v0.1`

Result:

| Target bucket | Bracket | Verdict |
|---|---|---|
| core `/i/` | `V5-V7` | `COLLAPSED_HIGH` |
| mixed `/i/` | `V5-V7` | `COLLAPSED_HIGH` |
| core `/i/` control | `V4-V7` | `COLLAPSED_HIGH` |
| mixed `/i/` control | `V4-V7` | `COLLAPSED_HIGH` |

Interpretation:

> Arabic `/i/` repeats the Hindi/Persian pressure pattern.

### 5.3 Hebrew `/i/`

Series:

- `cohort03-he-i-cleaned-anchor-comparison-v0.1`

Result:

| Target bucket | Bracket | Verdict |
|---|---|---|
| core `/i/` | `V5-V7` | `COLLAPSED_HIGH` |
| mixed `/i/` | `V5-V7` | `COLLAPSED_HIGH` |
| core `/i/` control | `V4-V7` | `COLLAPSED_HIGH` |
| mixed `/i/` control | `V4-V7` | `COLLAPSED_HIGH` |

Interpretation:

> Hebrew `/i/` repeats Arabic `/i/`; Semitic `/i/` pressure is robust under cleaned anchors.

## 6. High-region non-`/i/` controls

### 6.1 Finnish `/y/`

Series:

- `cohort03-fi-y-cleaned-anchor-comparison-v0.1`

Result:

| Target bucket | Bracket | Verdict | Notes |
|---|---|---|---|
| core `/y/` | `V5-V7` | `INTERMEDIATE` | low-edge stressed |
| mixed `/y/` | `V5-V7` | `INTERMEDIATE` | low-edge stressed |
| core `/y/` control | `V4-V7` | `INTERMEDIATE` | clean |
| mixed `/y/` control | `V4-V7` | `INTERMEDIATE` | clean |

Series diagnostics:

- `collapseMode`: `BOUNDARY_OVERPRESSURE`
- basis: `boundaryFlagsPresent`

Interpretation:

> Finnish `/y/` does not repeat the Hindi/Persian/Arabic/Hebrew high-collapse pattern.

### 6.2 Turkish `/ı/`

Series:

- `cohort03-tr-ii-cleaned-anchor-comparison-v0.1`

Result:

| Target bucket | Bracket | Verdict | Notes |
|---|---|---|---|
| core `/ı/` | `V6-V7` | `INTERMEDIATE` | high-boundary uncertain |
| mixed `/ı/` | `V6-V7` | `EXCEEDS_LOW` | low-side deviation |
| core `/ı/` control | `V5-V7` | `INTERMEDIATE` | high-boundary uncertain |
| mixed `/ı/` control | `V5-V7` | `INTERMEDIATE` | clean |

Series diagnostics:

- `collapseMode`: `BOUNDARY_OVERPRESSURE`
- basis: `boundaryFlagsPresent`

Interpretation:

> Turkish `/ı/` behaves closer to Finnish `/y/` than to the collapsing `/i/` cases.

## 7. Batch-level interpretation

The batch changes the working interpretation.

Before this batch, one plausible concern was:

> The high-region lens may be globally broken, causing all high-region targets to collapse.

After this batch, that interpretation is too broad.

Observed pattern:

- Hindi `/i/`: robust high collapse
- Persian `/i/`: robust high collapse
- Arabic `/i/`: robust high collapse
- Hebrew `/i/`: robust high collapse
- Finnish `/y/`: `INTERMEDIATE`
- Turkish `/ı/`: mostly `INTERMEDIATE`, with one `EXCEEDS_LOW`

Current best wording:

> The pressure is concentrated around `/i/` under the current high-region lens. It is not a global high-region failure.

More precise wording:

> Cross-family `/i/` shows repeated high-collapse pressure under cleaned anchors and widened controls, while non-`/i/` high-region controls do not repeat the same high-collapse pattern.

## 8. Scientific consequence

Allowed:

- The batch records robust `/i/` high-region pressure across Indo-Iranian and Semitic cases.
- Hindi, Persian, Arabic, and Hebrew `/i/` collapsed high under cleaned-anchor comparisons.
- Finnish `/y/` remained `INTERMEDIATE`.
- Turkish `/ı/` mostly remained `INTERMEDIATE`, with one mixed-target `EXCEEDS_LOW` run.
- The current evidence argues against a global high-region failure.
- The current evidence points toward a sharper `/i/` pressure zone.

Blocked:

- Do not claim `/i/` supports `V5-V7`.
- Do not claim the high-region model is solved.
- Do not claim all high-region vowels collapse.
- Do not claim Finnish `/y/` proves the full model.
- Do not claim Turkish `/ı/` proves the full model.
- Do not change scorer math from this batch alone.
- Do not update README from this batch alone.
- Do not publish this as a final proof claim.

## 9. Next work

Recommended next step:

- stop expanding the run battery until the `/i/` pressure mechanism is stated as a design question.

Possible next diagnostic directions:

1. inspect why `/i/` repeatedly crosses high-side collapse while `/y/` and `/ı/` do not;
2. compare `/i/` against a narrower `V6-V7` bracket in selected languages;
3. test whether `/i/` needs a distinct high-front diagnostic lane;
4. review whether the current anchor definitions over-compress front high vowels.

Do not run additional high-region support tests before choosing one of these diagnostic directions.
