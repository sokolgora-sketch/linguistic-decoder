# Cohort 04 Hindi `/i/` Open-Final / Closed-Final Result v0.1

Status: result recorded  
Scope: internal evidence record  
Date recorded: 2026-05-23

## 1. Purpose

This document records the scored result for the Cohort 04 Hindi `/i/` open-final / closed-final final-shape test.

It follows:

- `docs/evals/cohort-04-hi-i-open-final-closed-final-design-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-closed-final-curation-instructions-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-closed-final-curation-result-v0.1.md`

Research question:

> Does open-final versus closed-final distribution explain high-edge pressure in Hindi `/i/` length-matched buckets?

## 2. Evidence pack

Evidence ZIP:

- `evals.series-evidence-pack.cohort04-hi-i-open-final-closed-final-v0.1.v0.1.zip`

Local path inspected:

- `/Users/wei/Desktop/ZËRO /Dwnlosads /FINAL paper evidence /evals.series-evidence-pack.cohort04-hi-i-open-final-closed-final-v0.1.v0.1.zip`

SHA256:

- `9e6904f18f65a25a505ce92bd8e55bb57dcb95520e0d4322ebf28ea572a287ef`

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

- `cohort04-hi-i-open-final-closed-final-v0.1`

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
| 1 | `cohort04-hi-i-baseline-reference-r01` | baseline reference | `INTERMEDIATE` | 0.706522 | 0.325 | 0.135 | `BOUNDARY_UNCERTAIN_HIGH` |
| 2 | `cohort04-hi-i-open-final-target-r01` | open-final controlled | `INTERMEDIATE` | 0.608696 | 0.28 | 0.18 | none |
| 3 | `cohort04-hi-i-closed-final-target-r01` | closed-final controlled | `INTERMEDIATE` | 0.706522 | 0.325 | 0.135 | `BOUNDARY_UNCERTAIN_HIGH` |
| 4 | `cohort04-hi-i-mixed-final-target-r01` | mixed-final balanced | `INTERMEDIATE` | 0.706522 | 0.325 | 0.135 | `BOUNDARY_UNCERTAIN_HIGH` |

All four runs returned `INTERMEDIATE`.

The open-final controlled lane is the only lane without a high-boundary diagnostic flag.

## 5. Primary interpretation

The result supports a cautious mechanism reading:

> Open-final distribution reduced high-boundary pressure in this Cohort 04 Hindi `/i/` pack.

This is based on the open-final lane moving away from the high boundary:

- open-final normalizedPosition: 0.608696
- open-final gap_high: 0.18
- open-final flags: none

while baseline, closed-final, and mixed-final all repeated:

- normalizedPosition: 0.706522
- gap_high: 0.135
- `BOUNDARY_UNCERTAIN_HIGH`

## 6. Lane-level reading

### 6.1 Baseline reference

Run:

- `cohort04-hi-i-baseline-reference-r01`

Result:

- `INTERMEDIATE`
- `BOUNDARY_UNCERTAIN_HIGH`
- normalizedPosition 0.706522

Reading:

> The prior accepted length-matched reference remains intermediate but high-edge stressed.

### 6.2 Open-final controlled target

Run:

- `cohort04-hi-i-open-final-target-r01`

Result:

- `INTERMEDIATE`
- no flags
- normalizedPosition 0.608696

Reading:

> The open-final controlled lane is the cleanest lane in the four-run pack.

Mechanism implication:

> Open-final shape may soften Hindi `/i/` high-boundary pressure when mean length is kept close.

### 6.3 Closed-final controlled target

Run:

- `cohort04-hi-i-closed-final-target-r01`

Result:

- `INTERMEDIATE`
- `BOUNDARY_UNCERTAIN_HIGH`
- normalizedPosition 0.706522

Reading:

> The closed-final controlled lane repeated the baseline high-boundary pressure pattern.

Mechanism implication:

> Closed-final shape did not reduce high-edge stress in this pack.

### 6.4 Mixed-final balanced target

Run:

- `cohort04-hi-i-mixed-final-target-r01`

Result:

- `INTERMEDIATE`
- `BOUNDARY_UNCERTAIN_HIGH`
- normalizedPosition 0.706522

Reading:

> The mixed-final balanced lane also repeated the baseline high-boundary pressure pattern.

Mechanism implication:

> A 5/5 open-final / closed-final balance was not enough to reproduce the cleaner open-final lane.

## 7. What this allows

Allowed claims:

- Cohort 04 Hindi `/i/` final-shape pack completed 4 scored runs.
- All four runs returned `INTERMEDIATE`.
- Open-final controlled target was cleaner than baseline, closed-final, and mixed-final lanes.
- Open-final distribution reduced high-boundary pressure in this pack.
- Closed-final and mixed-final lanes remained high-boundary stressed.
- Final-shape distribution is a plausible pressure variable for Hindi `/i/`.

## 8. What this blocks

Blocked claims:

- Do not claim open-final distribution solves Hindi `/i/`.
- Do not claim closed-final distribution solves Hindi `/i/`.
- Do not claim mixed-final distribution solves Hindi `/i/`.
- Do not claim Hindi `/i/` supports `V6-V7`.
- Do not claim length matching solves Hindi `/i/`.
- Do not claim this is publication-ready.
- Do not publish this as public evidence.
- Do not update README with Cohort 04 claims.

## 9. Next research question

Recommended next question:

> Does the open-final effect replicate with an independently curated second open-final lane?

Possible next design:

- keep the same low and high anchors;
- keep mean token length near 5.4;
- curate a second independent open-final target;
- compare it against the current open-final lane and the current closed/mixed lanes.

Do not start this next run without a separate design/curation doc.

## 10. Result boundary

This result is internal mechanism evidence.

It does not settle Hindi `/i/`.

It does not make Cohort 04 publication-ready.

It identifies final-shape distribution as a serious variable to test again.
