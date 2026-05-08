# ZË-RO Cohort 02 Second-Subset Evidence Summary v0.1

Status: INTERNAL EVIDENCE SUMMARY ONLY
Created: 2026-05-08
Cohort: Cohort 02
Subset: second researcher-reviewed subset
Base commit for scoring/export: `ad5ae36`

Depends on:
- `docs/evals/cohort-02-design-v0.1.md`
- `docs/evals/cohort-02-token-curation-instructions-v0.1.md`
- `docs/evals/cohort-02-first-subset-summary-v0.1.md`
- `docs/evals/cohort-battery-workflow-v0.1.md`

This document summarizes the second Cohort 02 researcher-reviewed evidence subset.

This is not a paper.

This is not a publication package.

This does not update Zenodo, LingBuzz, README, or Cohort 01.

---

## 1. Scope

Second subset:

| Case | Language | Vowel | Candidate bracket | Control bracket | Series |
|---|---|---|---|---|---|
| French `/ø~œ/` high-edge audit | French | `/ø~œ/` | V5-V7 | V2-V5 | `t5-fr-euoe-v5-v7-researcher-v0.1` |
| Portuguese `/â/` edge-stress replication | Portuguese | `/â/` | V1-V4 | V2-V4 | `t5-pt-aa-v1-v4-researcher-v0.1` |

Curation convention:

| Field | Value |
|---|---|
| provider | `openai` |
| model | `chatgpt-assisted-researcher-reviewed` |
| sourceEngineId | blank |
| sourceEngineVersion | blank |
| sourceEngineBuild | blank |

Reason:

- token buckets were ChatGPT-assisted and researcher-reviewed;
- task JSON was hand-pasted into `/evals`;
- the scored JSON did not come from an upstream ZË-RO engine/export.

---

## 2. Evidence packs inspected

Local evidence packs inspected:

| Series | Local ZIP filename |
|---|---|
| `t5-fr-euoe-v5-v7-researcher-v0.1` | `evals.series-evidence-pack.t5-fr-euoe-v5-v7-researcher-v0.1.v0.1.zip` |
| `t5-pt-aa-v1-v4-researcher-v0.1` | `evals.series-evidence-pack.t5-pt-aa-v1-v4-researcher-v0.1.v0.1.zip` |

Each inspected evidence pack contained:

- `01_RUN_INDEX.md`
- `series-summary.csv`
- four scored runs
- run-level reports and exports

This summary records the extracted run-index and series-summary values.

---

## 3. French `/ø~œ/` — researcher high-edge audit

Series:

- `t5-fr-euoe-v5-v7-researcher-v0.1`

Result table:

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `t5.fr.euoe.v5-v7.researcher.main.r01` | V5-V7 | INTERMEDIATE | 0.315371 | 0.099167 | 0.215278 | none |
| 2 | `t5.fr.euoe.v5-v7.researcher.alt.r02` | V5-V7 | INTERMEDIATE | 0.238625 | 0.065556 | 0.209167 | none |
| 3 | `t5.fr.euoe.v2-v5.researcher.ctrl.r03` | V2-V5 | COLLAPSED_HIGH | 2.081818 | 0.190833 | -0.099167 | none |
| 4 | `t5.fr.euoe.v2-v5.researcher.ctrl-alt.r04` | V2-V5 | COLLAPSED_HIGH | 1.621670 | 0.253611 | -0.097222 | none |

Interpretation:

French `/ø~œ/` supports V5-V7 as the cleaner high-edge researcher bracket.

Both V5-V7 candidate runs returned INTERMEDIATE with no diagnostic flags.

Both V2-V5 controls returned COLLAPSED_HIGH.

This is stronger separation than the Norwegian and Danish first-subset cases because the controls failed rather than merely returning weaker INTERMEDIATE results.

Status:

- cleaner candidate bracket: V5-V7
- result class: supportive high-edge audit
- caution: still researcher-reviewed subset only; not publication-ready alone

---

## 4. Portuguese `/â/` — researcher edge-stress replication

Series:

- `t5-pt-aa-v1-v4-researcher-v0.1`

Result table:

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `t5.pt.aa.v1-v4.researcher.main.r01` | V1-V4 | COLLAPSED_HIGH | 1.265217 | 0.161667 | -0.033889 | BOUNDARY_UNCERTAIN_HIGH |
| 2 | `t5.pt.aa.v1-v4.researcher.alt.r02` | V1-V4 | COLLAPSED_HIGH | 1.097166 | 0.301111 | -0.026667 | BOUNDARY_UNCERTAIN_HIGH |
| 3 | `t5.pt.aa.v2-v4.researcher.ctrl.r03` | V2-V4 | EXCEEDS_LOW | 0.786340 | -0.124722 | -0.033889 | BOUNDARY_UNCERTAIN_HIGH |
| 4 | `t5.pt.aa.v2-v4.researcher.ctrl-alt.r04` | V2-V4 | EXCEEDS_LOW | 0.014706 | -0.001667 | -0.111667 | BOUNDARY_UNCERTAIN_LOW |

Interpretation:

Portuguese `/â/` did not support V1-V4 under researcher-reviewed replication.

Both V1-V4 candidate runs returned COLLAPSED_HIGH with high-boundary uncertainty.

Both V2-V4 controls also failed, returning EXCEEDS_LOW.

This is clean pressure evidence, not support.

Status:

- cleaner candidate bracket: none confirmed
- result class: unresolved / edge-stressed pressure
- caution: redesign needed before any support claim

---

## 5. Second-subset summary

| Case | Candidate result | Control result | Summary status |
|---|---|---|---|
| French `/ø~œ/` | V5-V7 INTERMEDIATE x2 | V2-V5 COLLAPSED_HIGH x2 | V5-V7 cleaner high-edge support |
| Portuguese `/â/` | V1-V4 COLLAPSED_HIGH x2 | V2-V4 EXCEEDS_LOW x2 | unresolved / edge-stressed pressure |

Second-subset interpretation:

- French `/ø~œ/` strengthens the high-edge front-rounded finding: V5-V7 candidates stabilize while V2-V5 controls collapse high.
- Portuguese `/â/` weakens the previous V1-V4 support story under researcher-reviewed replication.
- Portuguese should remain classified as edge-stressed / unresolved pressure until a better redesign is tested.
- No publication claim should be made from this summary alone.

---

## 6. Combined Cohort 02 subset status so far

First subset:

| Case | Summary status |
|---|---|
| Norwegian `/ø/` | V1-V3 cleaner provisional support |
| Danish `/ø/` | V1-V3 cleaner provisional support |
| Turkish `/ı/` | V4-V7 redesign improvement; still pressure-audit framing |
| Romanian `/ă/` | unresolved pressure |

Second subset:

| Case | Summary status |
|---|---|
| French `/ø~œ/` | V5-V7 cleaner high-edge support |
| Portuguese `/â/` | unresolved / edge-stressed pressure |

Current combined interpretation:

- Front-rounded low-edge cases:
  - Norwegian `/ø/`: supportive
  - Danish `/ø/`: supportive
- Front-rounded high-edge case:
  - French `/ø~œ/`: supportive and stronger than first-subset controls
- High-region pressure case:
  - Turkish `/ı/`: improved under V4-V7 but still pressure-audit
- Central / edge-stressed pressure cases:
  - Romanian `/ă/`: unresolved pressure
  - Portuguese `/â/`: unresolved / edge-stressed pressure

---

## 7. Recommended next steps

Immediate next step:

1. Preserve the French and Portuguese evidence packs safely.
2. Create a local Cohort 02 second-subset archive bundle.
3. After both first and second subset archives exist, decide whether Cohort 02 needs:
   - more researcher replications;
   - a Romanian `/ă/` redesign v0.2;
   - a Portuguese `/â/` redesign v0.2;
   - a public preprint later.

Do not:

- update Zenodo yet;
- update LingBuzz yet;
- update README yet;
- claim Cohort 02 publication result yet;
- mix these results into Cohort 01.

---

## 8. Completion criteria for this summary doc

This summary doc is complete when:

1. both second-subset series are listed;
2. all eight run results are listed;
3. interpretation distinguishes high-edge support from pressure/failure evidence;
4. combined first + second subset status is summarized;
5. no public publication claim is made;
6. repo gates pass;
7. PR is merged.
