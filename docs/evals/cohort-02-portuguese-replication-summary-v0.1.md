# ZË-RO Cohort 02 Portuguese /â/ V1-V5 Replication Summary v0.1

Status: INTERNAL EVIDENCE SUMMARY ONLY
Created: 2026-05-09
Cohort: Cohort 02
Scope: Portuguese `/â/`
Series: `t5-pt-aa-v1-v5-researcher-replication-v0.2`
Branch base: `cd2b21c`

Depends on:
- `docs/evals/cohort-02-pressure-redesign-results-v0.2.md`
- `docs/evals/cohort-02-internal-synthesis-v0.1.md`
- `docs/evals/cohort-02-publication-readiness-decision-v0.1.md`

This document records the second Portuguese `/â/` V1-V5 replication required by the Cohort 02 publication-readiness gate.

This is not a paper.

This is not a publication package.

This does not update Zenodo, LingBuzz, README, registry labels, or Cohort 01.

---

## 1. Evidence pack

Evidence pack:

| Item | Value |
|---|---|
| Series | `t5-pt-aa-v1-v5-researcher-replication-v0.2` |
| ZIP | `evals.series-evidence-pack.t5-pt-aa-v1-v5-researcher-replication-v0.2.v0.1.zip` |
| SHA256 | `ec1f800548923114ef08ce582eeb65ba412c6e638aca3c2968df647990ec8352` |
| Status | local internal evidence |

The previous `v0.1` replication export is not valid final evidence because r02 was accidentally scored with `anchorHigh: V4` while its runId claimed V1-V5.

The `v0.2` replication fixes that issue.

---

## 2. Structure check

The `v0.2` replication has the correct four-run structure:

| Ordinal | Run ID | Intended bracket | Actual bracket | Status |
|---:|---|---|---|---|
| 1 | `t5.pt.aa.v1-v5.researcher.rep-main.r01` | V1-V5 candidate main | V1-V5 | valid |
| 2 | `t5.pt.aa.v1-v5.researcher.rep-alt.r02` | V1-V5 candidate alt | V1-V5 | valid |
| 3 | `t5.pt.aa.v1-v4.researcher.rep-ctrl.r03` | V1-V4 control main | V1-V4 | valid |
| 4 | `t5.pt.aa.v1-v4.researcher.rep-ctrl-alt.r04` | V1-V4 control alt | V1-V4 | valid |

Structural status:

- all four runs present;
- r01 and r02 are V1-V5 candidate runs;
- r03 and r04 are V1-V4 control runs;
- no bracket mismatch remains;
- validN: 30 / 30 / 30 for each run;
- invalidN: 0;
- totalInvalidTokenCount: 0.

---

## 3. Result table

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `t5.pt.aa.v1-v5.researcher.rep-main.r01` | V1-V5 | INTERMEDIATE | 0.753676 | 0.284722 | 0.093056 | none |
| 2 | `t5.pt.aa.v1-v5.researcher.rep-alt.r02` | V1-V5 | INTERMEDIATE | 0.875000 | 0.330556 | 0.047222 | NEAR_COLLAPSE_HIGH, BOUNDARY_UNCERTAIN_HIGH |
| 3 | `t5.pt.aa.v1-v4.researcher.rep-ctrl.r03` | V1-V4 | COLLAPSED_HIGH | 1.154279 | 0.284722 | -0.038056 | BOUNDARY_UNCERTAIN_HIGH |
| 4 | `t5.pt.aa.v1-v4.researcher.rep-ctrl-alt.r04` | V1-V4 | COLLAPSED_HIGH | 1.599462 | 0.330556 | -0.123889 | none |

---

## 4. Interpretation

Portuguese `/â/` replicated the V1-V5 redesign improvement.

Both V1-V5 candidate runs returned INTERMEDIATE.

Both V1-V4 control runs collapsed high.

This confirms V1-V5 as the better diagnostic bracket than V1-V4 for Portuguese `/â/` under the current researcher-reviewed Cohort 02 setup.

Caution:

- r02 is high-side leaning;
- r02 carries `NEAR_COLLAPSE_HIGH` and `BOUNDARY_UNCERTAIN_HIGH`;
- this is not strong clean support;
- this is replicated edge-stressed V1-V5 improvement.

---

## 5. Publication-readiness effect

This replication addresses one publication-readiness blocker:

| Requirement | Previous status | Updated status |
|---|---|---|
| Portuguese V1-V5 second replication | required | completed internally |

This does not make Cohort 02 publication-ready by itself.

Remaining publication blockers:

| Requirement | Status |
|---|---|
| Romanian model-level pressure explanation | still required |
| Turkish pressure-audit framing note | still required |
| Public paper outline | still required |
| Public archive manifest | still required |
| Final public checksum table | still required |
| Methods section | still required |
| Limitations section | still required |
| Claim-boundary section | still required |
| Review of all public wording against blocked claims | still required |

---

## 6. Updated Portuguese status

Previous status:

- Portuguese `/â/`: V1-V5 redesign improvement, still edge-stressed.

Updated status:

- Portuguese `/â/`: replicated V1-V5 redesign improvement, still edge-stressed.

Allowed internal claim:

- Portuguese `/â/` replicated V1-V5 improvement over V1-V4 controls.

Blocked public claim:

- Portuguese `/â/` is final headline support.

---

## 7. Recommended next action

Do not run more Portuguese immediately.

Next Cohort 02 work should address remaining publication blockers:

1. Romanian `/ă/` model-level pressure explanation.
2. Turkish `/ı/` pressure-audit framing note.
3. Then update the publication-readiness decision note.

Do not update:

- Zenodo;
- LingBuzz;
- README;
- registry labels;
- Cohort 01.

---

## 8. Completion criteria

This summary is complete when:

1. the corrected v0.2 replication series is recorded;
2. the invalid v0.1 export is explicitly excluded from final evidence;
3. the V1-V5 candidate and V1-V4 control results are listed;
4. the edge-stressed caution is preserved;
5. the publication-readiness effect is stated;
6. no public publication claim is made;
7. repo gates pass;
8. PR is merged.
