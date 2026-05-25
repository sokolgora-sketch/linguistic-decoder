# Cohort 04 Hindi `/i/` Open-Final Replication Result v0.1

Status: result recorded  
Scope: internal evidence record  
Date recorded: 2026-05-23

## 1. Purpose

This document records the scored result for the Cohort 04 Hindi `/i/` open-final replication test.

It follows:

- `docs/evals/cohort-04-hi-i-open-final-replication-design-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-replication-curation-instructions-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-replication-curation-result-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-closed-final-result-v0.1.md`

Replication question:

> Does the open-final effect replicate with independently curated open-final Hindi `/i/` targets?

## 2. Evidence pack

Evidence ZIP:

- `evals.series-evidence-pack.cohort04-hi-i-open-final-replication-v0.1.v0.1.zip`

SHA256:

- `9cd4a2934ca3a1fedd5e50115d4e930813f495775b7acb4ae91a40933bf2a82a`

Pack completeness:

- `00_README.md`
- `01_RUN_INDEX.md`
- `series-summary.csv`
- 4 run folders
- each run folder includes:
  - `input.json`
  - `report.json`
  - `report.md`
  - `report.pdf`
  - `workbook.xlsx`
  - `summary.csv`
  - `notes.md`

## 3. Series metadata

Series label:

- `cohort04-hi-i-open-final-replication-v0.1`

Fixed eval settings:

- `taskId`: `T5_INTERMEDIATE_V0_1`
- `inputShape`: `intermediate_triple`
- `languageHint`: `hi`
- `vowelUnderTest`: `i`
- `anchorLow`: `V6`
- `anchorHigh`: `V7`

Provenance metadata:

- `provider`: `openai`
- `model`: `chatgpt-assisted-researcher-reviewed`
- `sourceEngineId`: blank
- `sourceEngineVersion`: blank
- `sourceEngineBuild`: blank

Run count:

> 4 scored runs

## 4. Result summary

| Ordinal | Run ID | Lane | Verdict | normalizedPosition | gap_low | gap_high | Diagnostic flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `cohort04-hi-i-open-final-reference-r01` | prior open-final reference | `INTERMEDIATE` | 0.608696 | 0.28 | 0.18 | none |
| 2 | `cohort04-hi-i-open-final-replication-a-r01` | independent open-final replication A | `INTERMEDIATE` | 0.626812 | 0.288333 | 0.171667 | none |
| 3 | `cohort04-hi-i-open-final-replication-b-r01` | independent open-final replication B | `INTERMEDIATE` | 0.673913 | 0.31 | 0.15 | none |
| 4 | `cohort04-hi-i-closed-final-reference-r01` | closed-final stress reference | `INTERMEDIATE` | 0.706522 | 0.325 | 0.135 | `BOUNDARY_UNCERTAIN_HIGH` |

All four runs returned `INTERMEDIATE`.

Both independent open-final replication lanes returned `INTERMEDIATE` with no diagnostic flags.

The closed-final stress reference repeated `BOUNDARY_UNCERTAIN_HIGH`.

## 5. Primary interpretation

The result supports the replication reading:

> The open-final pressure-reduction effect replicated in this Cohort 04 Hindi `/i/` pack.

Operational meaning:

- prior open-final reference stayed clean;
- open-final replication A stayed clean;
- open-final replication B stayed clean;
- closed-final reference remained high-boundary stressed.

This supports open-final distribution as a repeatable pressure-reducing variable in this Hindi `/i/` setup.

## 6. Lane-level reading

### 6.1 Prior open-final reference

Run:

- `cohort04-hi-i-open-final-reference-r01`

Result:

- `INTERMEDIATE`
- no flags
- normalizedPosition 0.608696
- gap_high 0.18

Reading:

> The prior clean open-final lane repeated cleanly as the in-series reference.

### 6.2 Open-final replication A

Run:

- `cohort04-hi-i-open-final-replication-a-r01`

Result:

- `INTERMEDIATE`
- no flags
- normalizedPosition 0.626812
- gap_high 0.171667

Reading:

> Independent open-final replication A reproduced the no-flag open-final pattern.

### 6.3 Open-final replication B

Run:

- `cohort04-hi-i-open-final-replication-b-r01`

Result:

- `INTERMEDIATE`
- no flags
- normalizedPosition 0.673913
- gap_high 0.15

Reading:

> Independent open-final replication B also reproduced the no-flag pattern, though it sits closer to the high boundary than reference/A.

### 6.4 Closed-final stress reference

Run:

- `cohort04-hi-i-closed-final-reference-r01`

Result:

- `INTERMEDIATE`
- `BOUNDARY_UNCERTAIN_HIGH`
- normalizedPosition 0.706522
- gap_high 0.135

Reading:

> The closed-final comparator repeated the high-boundary stress pattern.

## 7. What this allows

Allowed claims:

- Cohort 04 Hindi `/i/` open-final replication completed 4 scored runs.
- All four runs returned `INTERMEDIATE`.
- Both independent open-final replication lanes returned `INTERMEDIATE` with no diagnostic flags.
- The closed-final reference repeated `BOUNDARY_UNCERTAIN_HIGH`.
- The open-final pressure-reduction effect replicated in this pack.
- Open-final distribution is a repeatable pressure-reducing variable in this Hindi `/i/` setup.

## 8. What this blocks

Blocked claims:

- Do not claim open-final distribution solves Hindi `/i/`.
- Do not claim Hindi `/i/` supports `V6-V7`.
- Do not claim final-shape distribution is proven globally.
- Do not claim Cohort 04 is publication-ready.
- Do not publish this as public evidence.
- Do not update README with Cohort 04 claims.

## 9. Next research question

Recommended next question:

> Does the replicated open-final effect hold under a different anchor bracket or a different high-region comparator?

Possible next designs:

- use the same open-final replication targets against a revised high-region bracket;
- design a second language/control comparison;
- pause Cohort 04 and write an internal mechanism synthesis before more runs.

Do not start the next run without a separate design/curation doc.

## 10. Result boundary

This result is internal mechanism evidence.

It strengthens the final-shape mechanism reading for Hindi `/i/`.

It does not settle Hindi `/i/`.

It does not make Cohort 04 publication-ready.
