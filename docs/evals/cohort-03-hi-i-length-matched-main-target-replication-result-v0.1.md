# Cohort 03 Hindi `/i/` Length-Matched Main-Target Replication Result v0.1

Status: inspected replication result summary  
Scope: documentation only  
Date recorded: 2026-05-21

## 1. Purpose

This document records the inspected result of the Cohort 03 Hindi `/i/` length-matched main-target replication series.

It follows:

1. `docs/evals/cohort-03-hi-i-length-matched-main-target-result-v0.1.md`
2. `docs/evals/cohort-03-hi-i-length-matched-main-target-replication-curation-result-v0.1.md`

The replication tested whether the Hindi `/i/` length-matching stabilization observed in the first length-matched series repeats with a second independently curated length-matched target bucket.

This document records exported evidence only. It does not change scorer math, anchor doctrine, UI behavior, API behavior, or evidence-pack export behavior.

## 2. Evidence pack

Evidence pack inspected:

- `evals.series-evidence-pack.cohort03-hi-i-length-matched-main-target-replication-v0.1.v0.1.zip`

Observed SHA256:

- `8aae1cabd1170a21538c19b70c57f11e332ee9cbed5490989e87ce6145fc005e`

Export metadata:

| Field | Value |
|---|---|
| evidencePackVersion | `evals.evidencePack.v0.1` |
| exportedAtUtc | `2026-05-21T15:25:39.157Z` |
| seriesId | `b93f4ffa-90d2-479d-81d8-3ef90706d4fd` |
| seriesLabel | `cohort03-hi-i-length-matched-main-target-replication-v0.1` |
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

- `cohort03-hi-i-length-matched-main-target-replication-v0.1`

Runs:

| Ordinal | Run ID | Role |
|---:|---|---|
| 1 | `cohort03-hi-i-repl-original-main-short-i-anchor-reference-r01` | original main target reference |
| 2 | `cohort03-hi-i-repl-length-matched-main-short-i-anchor-candidate-r01` | revised length-matched replication candidate |
| 3 | `cohort03-hi-i-repl-alt-short-i-anchor-reference-r01` | alternate target reference |

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
| 1 | `cohort03-hi-i-repl-original-main-short-i-anchor-reference-r01` | original main reference | `COLLAPSED_HIGH` | `1.018116` | `0.468333` | `-0.008333` | `0.83` | `0.361667` | `0.37` | `BOUNDARY_UNCERTAIN_HIGH` |
| 2 | `cohort03-hi-i-repl-length-matched-main-short-i-anchor-candidate-r01` | revised length-matched candidate | `INTERMEDIATE` | `0.938406` | `0.431667` | `0.028333` | `0.83` | `0.398333` | `0.37` | `NEAR_COLLAPSE_HIGH`, `BOUNDARY_UNCERTAIN_HIGH` |
| 3 | `cohort03-hi-i-repl-alt-short-i-anchor-reference-r01` | alternate reference | `INTERMEDIATE` | `0.608696` | `0.28` | `0.18` | `0.83` | `0.55` | `0.37` | none |

## 7. Primary result

The replication produced a partial stabilization pattern.

Observed pattern:

| Target lane | Verdict | Boundary status |
|---|---|---|
| original main target | `COLLAPSED_HIGH` | high-boundary collapse with `BOUNDARY_UNCERTAIN_HIGH` |
| revised length-matched candidate | `INTERMEDIATE` | very high-edge intermediate with `NEAR_COLLAPSE_HIGH` and `BOUNDARY_UNCERTAIN_HIGH` |
| alternate target | `INTERMEDIATE` | clean intermediate with no flags |

Primary reading:

> The second length-matched candidate again avoided full high collapse, but it landed very close to the high boundary.

Secondary reading:

> Length matching remains a major stabilizing mechanism, but it does not fully remove Hindi `/i/` high-region pressure.

## 8. Relationship to the first length-matched result

First length-matched result:

| Lane | Verdict | normalizedPosition | Flags |
|---|---|---:|---|
| original main reference | `COLLAPSED_HIGH` | `1.018116` | `BOUNDARY_UNCERTAIN_HIGH` |
| first length-matched candidate | `INTERMEDIATE` | `0.706522` | `BOUNDARY_UNCERTAIN_HIGH` |
| alternate reference | `INTERMEDIATE` | `0.608696` | none |

Replication result:

| Lane | Verdict | normalizedPosition | Flags |
|---|---|---:|---|
| original main reference | `COLLAPSED_HIGH` | `1.018116` | `BOUNDARY_UNCERTAIN_HIGH` |
| second length-matched candidate | `INTERMEDIATE` | `0.938406` | `NEAR_COLLAPSE_HIGH`, `BOUNDARY_UNCERTAIN_HIGH` |
| alternate reference | `INTERMEDIATE` | `0.608696` | none |

Comparison:

> Both length-matched candidates returned `INTERMEDIATE`, so the anti-collapse effect replicates at the verdict level.

Important caveat:

> The replication candidate is much closer to high collapse than the first candidate. Therefore, the replication is not a clean/stable resolution of the Hindi `/i/` lane.

## 9. Mechanism interpretation

The mechanism interpretation is now narrower:

1. The original main target repeatedly returns near-boundary `COLLAPSED_HIGH`.
2. The alternate target repeatedly returns clean `INTERMEDIATE`.
3. Two independently curated length-matched candidates return `INTERMEDIATE`.
4. The first length-matched candidate is moderately inside the bracket.
5. The second length-matched candidate is near high collapse.

Interpretation:

> Length matching is a real stabilizing factor for the Hindi `/i/` lane, but the lane remains sensitive to additional target-internal lexical/shape variables.

This result supports a cautious mechanism claim:

> Hindi `/i/` pressure is not explained by anchor geometry alone and is not explained by token length alone. Target/high-anchor shape mismatch is a major contributor, but not the whole mechanism.

## 10. Caveats

This result is useful, but it increases caution.

Caveats:

- The replication candidate still carries `BOUNDARY_UNCERTAIN_HIGH`.
- The replication candidate also carries `NEAR_COLLAPSE_HIGH`.
- The replication candidate is only `0.028333` away from the high boundary.
- `series-diagnostics.json` is absent.
- The exported provenance is `openai` / `chatgpt-assisted-researcher-reviewed`.
- This does not prove token length is the only active mechanism.
- This does not prove the Hindi `/i/` lane is solved.

## 11. Claim boundaries

Allowed:

- The evidence pack is complete enough for result recording.
- `series-diagnostics.json` is absent but optional.
- The original main reference repeated near-boundary `COLLAPSED_HIGH`.
- The revised length-matched candidate returned `INTERMEDIATE`.
- The alternate reference returned `INTERMEDIATE`.
- Verdict-level stabilization replicated.
- The replication candidate was high-edge and boundary-stressed.
- Length matching is a major stabilizing factor.
- Additional lexical/shape variables remain active.

Blocked:

- Do not claim length matching solves Hindi `/i/`.
- Do not claim `V6-V7` supports Hindi `/i/`.
- Do not claim the model is falsified or confirmed from this result.
- Do not claim token length is the only mechanism.
- Do not claim replication is clean/stable.
- Do not change scorer math.
- Do not change anchor doctrine.
- Do not update README.
- Do not publish this as final evidence.

## 12. Next work

Recommended next step:

> Write a cautious Cohort 03 Hindi `/i/` mechanism synthesis that records the sequence of evidence and clearly marks Hindi `/i/` as length-sensitive but still high-boundary stressed.

Do not run another ad hoc bucket before synthesis unless a specific new mechanism question is predeclared.
