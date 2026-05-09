# ZË-RO Cohort 02 Pressure Redesign Results v0.2

Status: INTERNAL EVIDENCE SUMMARY ONLY
Created: 2026-05-09
Cohort: Cohort 02
Scope: Romanian `/ă/` and Portuguese `/â/`
Summary branch base: `fc7c481`
Design plan: `docs/evals/cohort-02-pressure-redesign-plan-v0.2.md`

Depends on:
- `docs/evals/cohort-02-pressure-redesign-plan-v0.2.md`
- `docs/evals/cohort-02-first-subset-summary-v0.1.md`
- `docs/evals/cohort-02-second-subset-summary-v0.1.md`
- `docs/evals/cohort-02-design-v0.1.md`
- `docs/evals/cohort-02-token-curation-instructions-v0.1.md`
- `docs/evals/cohort-battery-workflow-v0.1.md`

This document summarizes the Romanian `/ă/` and Portuguese `/â/` v0.2 pressure-redesign results.

This is not a paper.

This is not a publication package.

This does not update Zenodo, LingBuzz, README, registry labels, or Cohort 01.

---

## 1. Scope

v0.2 pressure redesign subset:

| Case | Language | Vowel | Candidate bracket | Control bracket | Series |
|---|---|---|---|---|---|
| Romanian central-vowel redesign | Romanian | `/ă/` | V2-V5 | V3-V4 | `t5-ro-a-breve-v2-v5-researcher-v0.2` |
| Portuguese edge-stress redesign | Portuguese | `/â/` | V1-V5 | V1-V4 | `t5-pt-aa-v1-v5-researcher-v0.2` |

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
| `t5-ro-a-breve-v2-v5-researcher-v0.2` | `evals.series-evidence-pack.t5-ro-a-breve-v2-v5-researcher-v0.2.v0.1.zip` |
| `t5-pt-aa-v1-v5-researcher-v0.2` | `evals.series-evidence-pack.t5-pt-aa-v1-v5-researcher-v0.2.v0.1.zip` |

Each inspected evidence pack contained:

- `01_RUN_INDEX.md`
- `series-summary.csv`
- four scored runs
- run-level reports and exports

This summary records the extracted run-index and series-summary values.

---

## 3. Romanian `/ă/` v0.2 — central-vowel redesign

Series:

- `t5-ro-a-breve-v2-v5-researcher-v0.2`

Design goal:

- Test whether Romanian `/ă/` behaves as a wider central interval case after V3-V4 failed in v0.1.

Candidate bracket:

- V2-V5

Control bracket:

- V3-V4

Result table:

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `t5.ro.a-breve.v2-v5.researcher.main.r01` | V2-V5 | EXCEEDS_LOW | -0.288566 | -0.088333 | 0.394444 | none |
| 2 | `t5.ro.a-breve.v2-v5.researcher.alt.r02` | V2-V5 | INTERMEDIATE | 0.107258 | 0.036944 | 0.307500 | NEAR_COLLAPSE_LOW, BOUNDARY_UNCERTAIN_LOW |
| 3 | `t5.ro.a-breve.v3-v4.researcher.ctrl.r03` | V3-V4 | EXCEEDS_LOW | 1.483283 | -0.271111 | 0.088333 | none |
| 4 | `t5.ro.a-breve.v3-v4.researcher.ctrl-alt.r04` | V3-V4 | EXCEEDS_LOW | 0.960256 | -0.208056 | -0.008611 | BOUNDARY_UNCERTAIN_HIGH |

Interpretation:

Romanian `/ă/` v0.2 did not meet the redesign success criteria.

The widened V2-V5 candidate bracket improved one alt run to INTERMEDIATE, but the main candidate still failed as EXCEEDS_LOW.

The alt candidate also remained near low collapse with boundary uncertainty.

The V3-V4 controls also failed.

Status:

- cleaner candidate bracket: none confirmed
- result class: unresolved central-vowel pressure
- caution: do not rerun immediately; more Romanian token tweaking now risks fishing

Decision:

Romanian `/ă/` should remain unresolved after v0.1 and v0.2.

---

## 4. Portuguese `/â/` v0.2 — edge-stress redesign

Series:

- `t5-pt-aa-v1-v5-researcher-v0.2`

Design goal:

- Test whether widening upward from V1-V4 to V1-V5 improves the high-side collapse seen in Cohort 02 researcher v0.1.

Candidate bracket:

- V1-V5

Control bracket:

- V1-V4

Result table:

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `t5.pt.aa.v1-v5.researcher.main.r01` | V1-V5 | INTERMEDIATE | 0.624464 | 0.161667 | 0.097222 | none |
| 2 | `t5.pt.aa.v1-v5.researcher.alt.r02` | V1-V5 | INTERMEDIATE | 0.856083 | 0.320556 | 0.053889 | none |
| 3 | `t5.pt.aa.v1-v4.researcher.ctrl.r03` | V1-V4 | COLLAPSED_HIGH | 1.265217 | 0.161667 | -0.033889 | BOUNDARY_UNCERTAIN_HIGH |
| 4 | `t5.pt.aa.v1-v4.researcher.ctrl-alt.r04` | V1-V4 | COLLAPSED_HIGH | 1.576503 | 0.320556 | -0.117222 | none |

Interpretation:

Portuguese `/â/` v0.2 improved under the widened V1-V5 redesign.

Both V1-V5 candidate runs returned INTERMEDIATE with no diagnostic flags.

Both V1-V4 controls collapsed high.

This supports V1-V5 as a better diagnostic bracket than V1-V4 for the researcher-reviewed v0.2 set.

Caution:

- r02 is still high-side leaning.
- This is redesign improvement, not strong headline support.
- Portuguese should be framed as improved edge-stress redesign evidence, not final settled classification.

Status:

- cleaner candidate bracket: V1-V5
- result class: redesign improvement
- caution: high-side lean remains

---

## 5. v0.2 redesign summary

| Case | Candidate result | Control result | Summary status |
|---|---|---|---|
| Romanian `/ă/` | V2-V5 split: one EXCEEDS_LOW, one INTERMEDIATE with low-boundary flags | V3-V4 EXCEEDS_LOW x2 | unresolved central-vowel pressure |
| Portuguese `/â/` | V1-V5 INTERMEDIATE x2, no flags | V1-V4 COLLAPSED_HIGH x2 | V1-V5 redesign improvement |

Combined v0.2 interpretation:

- Romanian `/ă/` remains unresolved after a wider V2-V5 redesign.
- Portuguese `/â/` improves when widened to V1-V5, while V1-V4 controls collapse high.
- This separates the two pressure cases:
  - Romanian remains unresolved central pressure.
  - Portuguese becomes an edge-stressed redesign-improvement case.
- No public publication claim should be made from this summary alone.

---

## 6. Updated Cohort 02 internal status

Support / cleaner provisional brackets:

| Case | Status |
|---|---|
| Norwegian `/ø/` | V1-V3 cleaner provisional support |
| Danish `/ø/` | V1-V3 cleaner provisional support |
| French `/ø~œ/` | V5-V7 cleaner high-edge support |
| Portuguese `/â/` | V1-V5 redesign improvement, still edge-stressed |

Pressure / unresolved:

| Case | Status |
|---|---|
| Turkish `/ı/` | V4-V7 improved over V5-V7 controls, still pressure-audit |
| Romanian `/ă/` | unresolved central-vowel pressure |

---

## 7. Recommended next steps

Immediate next step:

1. Create a local v0.2 pressure-redesign archive bundle containing:
   - Romanian `/ă/` v0.2 evidence pack;
   - Portuguese `/â/` v0.2 evidence pack;
   - this results summary;
   - the v0.2 redesign plan;
   - current Cohort 02 summary docs;
   - checksums and metadata.
2. Do not score more Romanian immediately.
3. Do not publish Cohort 02 yet.

Possible next scientific work:

- run a second Portuguese V1-V5 replication later;
- create a combined Cohort 02 internal synthesis;
- defer Romanian `/ă/` to model-level review rather than token tweaking.

Do not:

- update Zenodo yet;
- update LingBuzz yet;
- update README yet;
- claim Cohort 02 publication result yet;
- mix these results into Cohort 01.

---

## 8. Completion criteria for this summary doc

This summary doc is complete when:

1. Romanian and Portuguese v0.2 series are listed;
2. all eight run results are listed;
3. interpretation distinguishes Romanian unresolved pressure from Portuguese redesign improvement;
4. no public publication claim is made;
5. repo gates pass;
6. PR is merged.
