# Cohort 03 Hindi `/i/` Length-Matched Main-Target Result v0.1

Status: inspected result summary  
Scope: documentation only  
Date recorded: 2026-05-21

## 1. Purpose

This document records the inspected result of the Cohort 03 Hindi `/i/` length-matched main-target follow-up.

This result follows:

1. `docs/evals/cohort-03-hi-i-length-matched-main-target-run-design-v0.1.md`
2. `docs/evals/cohort-03-hi-i-length-matched-main-target-curation-result-v0.1.md`

The series tested whether the original Hindi `/i/` main-target high-boundary collapse persists when the target bucket is length-matched to the short-`i` high anchor.

This document records exported evidence only. It does not change scorer math, anchor doctrine, UI behavior, API behavior, or evidence-pack export behavior.

## 2. Evidence pack

Evidence pack inspected:

- `evals.series-evidence-pack.cohort03-hi-i-length-matched-main-target-v0.1.v0.1.zip`

Observed SHA256:

- `4ef3e437635393643d61bf5c90dec87c3a5839bc1c4537fc9aec98f463fbcb27`

Export metadata:

| Field | Value |
|---|---|
| evidencePackVersion | `evals.evidencePack.v0.1` |
| exportedAtUtc | `2026-05-21T14:08:41.017Z` |
| seriesId | `2a125d10-4ce2-4a75-aee6-e0cb9f55d0cd` |
| seriesLabel | `cohort03-hi-i-length-matched-main-target-v0.1` |
| targetCount | `3` |
| scoredRunCount | `3` |

## 3. Evidence-pack completeness

Present:

- `00_README.md`
- `01_RUN_INDEX.md`
- `series-summary.csv`
- all 3 `input.json`
- all 3 `report.json`
- all 3 `report.md`
- all 3 `report.pdf`
- all 3 `workbook.xlsx`
- all 3 `summary.csv`
- all 3 `notes.md`

Absent:

- `series-diagnostics.json`

Reading:

> `series-diagnostics.json` is absent in this pack. The pack README marks it as optional and present only when supplied. Therefore, this result summary uses `01_RUN_INDEX.md`, `series-summary.csv`, and the per-run `summary.csv` / `notes.md` files as the source of truth.

## 4. Provenance metadata

Exported per-run provenance:

| Field | Value |
|---|---|
| provider | `openai` |
| model | `chatgpt-assisted-researcher-reviewed` |
| sourceEngineId | `not set` |
| sourceEngineVersion | `not set` |
| sourceEngineBuild | `not set` |

Note:

> The exported pack records `provider=openai` and `model=chatgpt-assisted-researcher-reviewed`. This document records the exported provenance exactly.

## 5. Run set

Series label:

- `cohort03-hi-i-length-matched-main-target-v0.1`

Runs:

| Ordinal | Run ID | Role |
|---:|---|---|
| 1 | `cohort03-hi-i-original-main-short-i-anchor-reference-r01` | original main target reference |
| 2 | `cohort03-hi-i-length-matched-main-short-i-anchor-candidate-r01` | length-matched main target candidate |
| 3 | `cohort03-hi-i-alt-short-i-anchor-reference-r01` | alternate target reference |

Common task configuration:

| Field | Value |
|---|---|
| taskId | `T5_INTERMEDIATE_V0_1` |
| inputShape | `intermediate_triple` |
| languageHint | `hi` |
| vowelUnderTest | `i` |
| anchorLow | `V6` |
| anchorHigh | `V7` |

## 6. Run results

| # | Run ID | Role | Verdict | normalizedPosition | gap_low | gap_high | mean_anchor_low | mean_x_vowel | mean_anchor_high | Flags |
|---:|---|---|---|---:|---:|---:|---:|---:|---:|---|
| 1 | `cohort03-hi-i-original-main-short-i-anchor-reference-r01` | original main reference | `COLLAPSED_HIGH` | `1.018116` | `0.468333` | `-0.008333` | `0.83` | `0.361667` | `0.37` | `BOUNDARY_UNCERTAIN_HIGH` |
| 2 | `cohort03-hi-i-length-matched-main-short-i-anchor-candidate-r01` | length-matched candidate | `INTERMEDIATE` | `0.706522` | `0.325` | `0.135` | `0.83` | `0.505` | `0.37` | `BOUNDARY_UNCERTAIN_HIGH` |
| 3 | `cohort03-hi-i-alt-short-i-anchor-reference-r01` | alternate reference | `INTERMEDIATE` | `0.608696` | `0.28` | `0.18` | `0.83` | `0.55` | `0.37` | none |

## 7. Primary result

The length-matched target stabilized relative to the original main target.

Observed pattern:

| Target lane | Target geometry status | Verdict |
|---|---|---|
| original main target | shorter than short-`i` high anchor | `COLLAPSED_HIGH` with `BOUNDARY_UNCERTAIN_HIGH` |
| length-matched main target | length-matched to short-`i` high anchor | `INTERMEDIATE` with `BOUNDARY_UNCERTAIN_HIGH` |
| alternate target | already length-aligned reference | `INTERMEDIATE` with no flags |

Primary reading:

> The original Hindi `/i/` main-target collapse was strongly affected by target/high-anchor shape mismatch, especially token length.

Secondary reading:

> Length matching moved the main-target lane from near-boundary `COLLAPSED_HIGH` to `INTERMEDIATE`, aligning it with the alternate reference lane.

## 8. Mechanism interpretation

This result supports the target-shape mechanism proposed after PR #1063 and PR #1064.

Mechanism chain:

1. The original main target had mean token length `4.4`.
2. The short-`i` high anchor had mean token length `5.4`.
3. The accepted length-matched target had mean token length `5.4`.
4. The original main target returned `COLLAPSED_HIGH` near the high boundary.
5. The length-matched target returned `INTERMEDIATE`.
6. The alternate target reference also returned `INTERMEDIATE`.

Interpretation:

> The prior main-target high collapse was not simply a stable Hindi `/i/` bracket-pressure result. It was materially affected by target/high-anchor shape mismatch.

## 9. Caveats

This result is useful, but not final.

Caveats:

- The length-matched candidate still carries `BOUNDARY_UNCERTAIN_HIGH`.
- The result has one accepted length-matched candidate bucket, not a replicated multi-bucket battery.
- `series-diagnostics.json` is absent.
- The exported provenance is `openai` / `chatgpt-assisted-researcher-reviewed`.
- This does not prove token length is the only active mechanism.
- This does not prove the Hindi `/i/` lane is solved.

## 10. Source-of-truth note

The authoritative verdicts in this document come from:

- `01_RUN_INDEX.md`
- `series-summary.csv`
- per-run `summary.csv`
- per-run `notes.md`

A local regex helper used during inspection searched raw `report.json` text and found the first occurrence of a verdict-like string. For the original-main run, that regex helper printed `INTERMEDIATE`, but the authoritative exported run index, series summary, per-run summary, and notes all record the original-main run as `COLLAPSED_HIGH`.

Therefore, the original-main verdict is recorded here as:

- `COLLAPSED_HIGH`

## 11. Claim boundaries

Allowed:

- The evidence pack is complete enough for result recording.
- `series-diagnostics.json` is absent but optional.
- The original main reference returned near-boundary `COLLAPSED_HIGH`.
- The length-matched candidate returned `INTERMEDIATE`.
- The alternate reference returned `INTERMEDIATE`.
- Length matching stabilized the main-target lane relative to the original main target.
- The original collapse was strongly affected by target/high-anchor shape mismatch.

Blocked:

- Do not claim length matching solves Hindi `/i/`.
- Do not claim `V6-V7` supports Hindi `/i/`.
- Do not claim the model is falsified or confirmed from this result.
- Do not claim token length is the only mechanism.
- Do not change scorer math.
- Do not change anchor doctrine.
- Do not update README.
- Do not publish this as final evidence.

## 12. Next work

Recommended next step:

> Record this as a mechanism result, then decide whether one replication bucket is needed before promoting the Hindi `/i/` length-matching mechanism into a broader Cohort 03 synthesis.

Possible next actions:

1. Curate a second length-matched Hindi `/i/` candidate bucket that passes the gate.
2. Run a replication series with the same original reference, new length-matched candidate, and alternate reference.
3. Only after replication, decide whether to write a Cohort 03 Hindi `/i/` mechanism summary.
