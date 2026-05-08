# ZË-RO Cohort 02 First-Subset Evidence Summary v0.1

Status: INTERNAL EVIDENCE SUMMARY ONLY
Created: 2026-05-08
Cohort: Cohort 02
Subset: first researcher-reviewed subset
Base commit for scoring/export: `e6331ca`

Depends on:
- `docs/evals/cohort-02-design-v0.1.md`
- `docs/evals/cohort-02-token-curation-instructions-v0.1.md`
- `docs/evals/cohort-battery-workflow-v0.1.md`

This document summarizes the first Cohort 02 researcher-reviewed evidence subset.

This is not a paper.

This is not a publication package.

This does not update Zenodo, LingBuzz, README, or Cohort 01.

---

## 1. Scope

First subset:

| Case | Language | Vowel | Candidate bracket | Control bracket | Series |
|---|---|---|---|---|---|
| Norwegian `/ø/` replication | Norwegian | `/ø/` | V1-V3 | V2-V5 | `t5-no-oe-v1-v3-researcher-v0.1` |
| Danish `/ø/` replication | Danish | `/ø/` | V1-V3 | V2-V5 | `t5-da-oe-v1-v3-researcher-v0.1` |
| Turkish `/ı/` redesign | Turkish | `/ı/` | V4-V7 | V5-V7 | `t5-tr-ii-v4-v7-researcher-v0.1` |
| Romanian `/ă/` redesign | Romanian | `/ă/` | V3-V4 | V2-V4 | `t5-ro-a-breve-v3-v4-researcher-v0.1` |

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
| `t5-no-oe-v1-v3-researcher-v0.1` | `evals.series-evidence-pack.t5-no-oe-v1-v3-researcher-v0.1.v0.1.zip` |
| `t5-da-oe-v1-v3-researcher-v0.1` | `evals.series-evidence-pack.t5-da-oe-v1-v3-researcher-v0.1.v0.1.zip` |
| `t5-tr-ii-v4-v7-researcher-v0.1` | `evals.series-evidence-pack.t5-tr-ii-v4-v7-researcher-v0.1.v0.1.zip` |
| `t5-ro-a-breve-v3-v4-researcher-v0.1` | `evals.series-evidence-pack.t5-ro-a-breve-v3-v4-researcher-v0.1.v0.1.zip` |

Each inspected evidence pack contained:

- `01_RUN_INDEX.md`
- `series-summary.csv`
- four scored runs
- run-level reports and exports

This summary records the extracted run-index and series-summary values.

---

## 3. Norwegian `/ø/` — researcher replication

Series:

- `t5-no-oe-v1-v3-researcher-v0.1`

Result table:

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `t5.no.oe.v1-v3.researcher.main.r01` | V1-V3 | INTERMEDIATE | 0.316312 | 0.247778 | 0.535556 | none |
| 2 | `t5.no.oe.v1-v3.researcher.alt.r02` | V1-V3 | INTERMEDIATE | 0.357333 | 0.297778 | 0.535556 | none |
| 3 | `t5.no.oe.v2-v5.researcher.ctrl.r03` | V2-V5 | INTERMEDIATE | 0.221289 | 0.087778 | 0.308889 | none |
| 4 | `t5.no.oe.v2-v5.researcher.ctrl-alt.r04` | V2-V5 | INTERMEDIATE | 0.294032 | 0.112222 | 0.269444 | none |

Interpretation:

Norwegian `/ø/` replicated the Cohort 01 direction under researcher-reviewed curation.

Both V1-V3 candidate runs remained clean INTERMEDIATE with stronger margins than V2-V5 controls.

The V2-V5 controls also returned INTERMEDIATE, so this should be framed as cleaner provisional support for V1-V3, not absolute falsification of V2-V5.

Status:

- cleaner candidate bracket: V1-V3
- result class: supportive replication
- caution: controls remain INTERMEDIATE

---

## 4. Danish `/ø/` — researcher replication

Series:

- `t5-da-oe-v1-v3-researcher-v0.1`

Result table:

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `t5.da.oe.v1-v3.researcher.main.r01` | V1-V3 | INTERMEDIATE | 0.286334 | 0.220000 | 0.548333 | none |
| 2 | `t5.da.oe.v1-v3.researcher.alt.r02` | V1-V3 | INTERMEDIATE | 0.325820 | 0.265000 | 0.548333 | none |
| 3 | `t5.da.oe.v2-v5.researcher.ctrl.r03` | V2-V5 | INTERMEDIATE | 0.209402 | 0.081667 | 0.308333 | none |
| 4 | `t5.da.oe.v2-v5.researcher.ctrl-alt.r04` | V2-V5 | INTERMEDIATE | 0.270742 | 0.103333 | 0.278333 | none |

Interpretation:

Danish `/ø/` replicated the Cohort 01 direction under researcher-reviewed curation.

Both V1-V3 candidate runs remained clean INTERMEDIATE with stronger margins than V2-V5 controls.

Like Norwegian, V2-V5 controls did not fully collapse, so the correct framing is cleaner provisional support for V1-V3.

Status:

- cleaner candidate bracket: V1-V3
- result class: supportive replication
- caution: controls remain INTERMEDIATE

---

## 5. Turkish `/ı/` — researcher redesign

Series:

- `t5-tr-ii-v4-v7-researcher-v0.1`

Result table:

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `t5.tr.ii.v4-v7.researcher.main.r01` | V4-V7 | INTERMEDIATE | 0.614663 | 0.400556 | 0.251111 | none |
| 2 | `t5.tr.ii.v4-v7.researcher.alt.r02` | V4-V7 | INTERMEDIATE | 0.474286 | 0.276667 | 0.306667 | none |
| 3 | `t5.tr.ii.v5-v7.researcher.ctrl.r03` | V5-V7 | INTERMEDIATE | 0.192982 | 0.055000 | 0.230000 | BOUNDARY_UNCERTAIN_LOW |
| 4 | `t5.tr.ii.v5-v7.researcher.ctrl-alt.r04` | V5-V7 | EXCEEDS_LOW | -0.063380 | -0.015000 | 0.251667 | BOUNDARY_UNCERTAIN_LOW |

Interpretation:

Turkish `/ı/` improved under the V4-V7 researcher redesign.

Both V4-V7 candidate runs returned clean INTERMEDIATE with no diagnostic flags.

The V5-V7 controls showed low-boundary pressure, including one EXCEEDS_LOW failure.

This supports V4-V7 as a cleaner redesign bracket than V5-V7 for this researcher-reviewed subset.

Caution:

- Turkish `/ı/` should still be treated as a pressure/redesign case.
- Candidate r01 and r02 differ noticeably in normalizedPosition.
- Do not frame this as final headline support without additional replication.

Status:

- cleaner candidate bracket: V4-V7
- result class: redesign improvement
- caution: pressure case remains

---

## 6. Romanian `/ă/` — researcher redesign

Series:

- `t5-ro-a-breve-v3-v4-researcher-v0.1`

Result table:

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `t5.ro.a-breve.v3-v4.researcher.main.r01` | V3-V4 | EXCEEDS_LOW | -4.256410 | -0.276667 | 0.341667 | none |
| 2 | `t5.ro.a-breve.v3-v4.researcher.alt.r02` | V3-V4 | EXCEEDS_LOW | 1.483283 | -0.271111 | 0.088333 | none |
| 3 | `t5.ro.a-breve.v2-v4.researcher.ctrl.r03` | V2-V4 | EXCEEDS_LOW | -2.382979 | -0.062222 | 0.088333 | BOUNDARY_UNCERTAIN_LOW |
| 4 | `t5.ro.a-breve.v2-v4.researcher.ctrl-alt.r04` | V2-V4 | COLLAPSED_HIGH | 1.360577 | 0.078611 | -0.020833 | BOUNDARY_UNCERTAIN_LOW, BOUNDARY_UNCERTAIN_HIGH |

Interpretation:

Romanian `/ă/` remained unstable under researcher-reviewed redesign.

The V3-V4 candidate bracket did not stabilize: both candidate runs returned EXCEEDS_LOW.

The V2-V4 controls also showed pressure, including one COLLAPSED_HIGH run with both low/high boundary uncertainty.

This is clean negative/pressure evidence, not bracket support.

Status:

- cleaner candidate bracket: none confirmed
- result class: unresolved pressure
- caution: redesign needed before any support claim

---

## 7. First-subset summary

| Case | Candidate result | Control result | Summary status |
|---|---|---|---|
| Norwegian `/ø/` | V1-V3 clean INTERMEDIATE x2 | V2-V5 INTERMEDIATE x2, weaker margins | V1-V3 cleaner provisional support |
| Danish `/ø/` | V1-V3 clean INTERMEDIATE x2 | V2-V5 INTERMEDIATE x2, weaker margins | V1-V3 cleaner provisional support |
| Turkish `/ı/` | V4-V7 clean INTERMEDIATE x2 | V5-V7 pressured, one EXCEEDS_LOW | V4-V7 redesign improvement |
| Romanian `/ă/` | V3-V4 EXCEEDS_LOW x2 | V2-V4 pressured / collapsed | unresolved pressure |

First-subset interpretation:

- Norwegian and Danish replicate the low-edge front-rounded direction from Cohort 01.
- Turkish improves under a V4-V7 redesign and should remain in pressure-audit framing.
- Romanian remains unresolved pressure and should not be treated as support.
- No publication claim should be made from this summary alone.

---

## 8. Recommended next steps

Immediate next step:

1. Preserve the four evidence packs safely.
2. Decide whether to run a second researcher subset or create a formal Cohort 02 archive bundle.
3. If continuing testing, prioritize one of:
   - French `/ø~œ/` high-edge researcher audit;
   - Portuguese `/â/` edge-stress researcher replication;
   - Romanian `/ă/` redesign v0.2;
   - Turkish `/ı/` replication v0.2.

Do not:

- update Zenodo yet;
- update LingBuzz yet;
- update README yet;
- claim Cohort 02 publication result yet;
- mix these results into Cohort 01.

---

## 9. Completion criteria for this summary doc

This summary doc is complete when:

1. all four first-subset series are listed;
2. all sixteen run results are listed;
3. interpretation distinguishes support, redesign improvement, and pressure;
4. no public publication claim is made;
5. repo gates pass;
6. PR is merged.
