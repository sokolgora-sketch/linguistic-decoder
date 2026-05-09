# ZË-RO Cohort 02 Pressure Redesign Plan v0.2

Status: REDESIGN PLAN ONLY
Created: 2026-05-09
Cohort: Cohort 02
Scope: Romanian `/ă/` and Portuguese `/â/`
Base repo state: `277814d`

Depends on:
- `docs/evals/cohort-02-design-v0.1.md`
- `docs/evals/cohort-02-token-curation-instructions-v0.1.md`
- `docs/evals/cohort-02-first-subset-summary-v0.1.md`
- `docs/evals/cohort-02-second-subset-summary-v0.1.md`
- `docs/evals/portuguese-turkish-pressure-review-v0.1.md`
- `docs/evals/cohort-battery-workflow-v0.1.md`

This document defines a v0.2 redesign plan before any new token generation, scoring, evidence-pack export, archive work, or publication work.

This is not a token list.

This is not an eval run.

This is not a publication package.

This does not update Zenodo, LingBuzz, README, or Cohort 01.

---

## 1. Why this plan exists

Cohort 02 has two clean pressure cases that should not be rerun randomly:

| Case | Latest researcher result | Current status |
|---|---|---|
| Romanian `/ă/` | V3-V4 candidate failed; V2-V4 controls also pressured/collapsed | unresolved pressure |
| Portuguese `/â/` | V1-V4 candidate collapsed high; V2-V4 controls also failed | unresolved / edge-stressed pressure |

The point of v0.2 is to test whether a redesigned bracket can stabilize either case, not to force support.

Clean negative results must remain acceptable.

---

## 2. Relationship to earlier pressure review

Existing prior review:

- `docs/evals/portuguese-turkish-pressure-review-v0.1.md`

That document was written for earlier paper-facing interpretation. It treated Portuguese `/â/` as provisional / edge-stressed V1-V4 support and Turkish `/ı/` as unresolved high-region pressure.

Cohort 02 researcher-reviewed replication changed the Portuguese situation:

- Portuguese `/â/` no longer has clean V1-V4 support under researcher-reviewed replication.
- V1-V4 candidate runs collapsed high.
- V2-V4 controls also failed.
- Portuguese should now be treated as unresolved / edge-stressed pressure for Cohort 02 until a v0.2 redesign is tested.

This plan does not edit or delete the old pressure review.

This plan records the next Cohort 02 action.

---

## 3. Not in scope

Do not do any of the following in this milestone:

- generate final token buckets;
- paste JSON into `/evals`;
- export evidence packs;
- update Zenodo;
- update LingBuzz;
- update README;
- revise Cohort 01;
- change Battery registry labels;
- claim Romanian or Portuguese support.

---

## 4. Shared v0.2 rules

For both Romanian and Portuguese v0.2:

| Field | Value |
|---|---|
| provider | `openai` |
| model | `chatgpt-assisted-researcher-reviewed` |
| sourceEngineId | blank |
| sourceEngineVersion | blank |
| sourceEngineBuild | blank |

Rules:

- Token buckets must be researcher-reviewed before scoring.
- Each bucket must contain exactly 30 unique single-token entries.
- No duplicates across buckets.
- Target-vowel bucket must contain the vowel under test.
- Anchor buckets must not contain the vowel under test.
- Do not use `sourceEngine*` unless the scored JSON came from an upstream ZË-RO engine/export.
- Do not reuse the failed v0.1 token sets unchanged.
- Do not interpret one clean run as support; require both candidate main and candidate alt to stabilize.

---

## 5. Romanian `/ă/` v0.2 redesign

### 5.1 v0.1 result being redesigned

Previous series:

- `t5-ro-a-breve-v3-v4-researcher-v0.1`

Previous result:

| Run type | Bracket | Result |
|---|---|---|
| candidate main | V3-V4 | EXCEEDS_LOW |
| candidate alt | V3-V4 | EXCEEDS_LOW |
| control main | V2-V4 | EXCEEDS_LOW |
| control alt | V2-V4 | COLLAPSED_HIGH |

Interpretation:

Romanian `/ă/` did not stabilize as V3-V4. It remained unresolved pressure.

### 5.2 Romanian redesign hypothesis

Romanian `/ă/` should be treated as a central-vowel pressure case.

The v0.1 V3-V4 bracket may have been too narrow and unstable. v0.2 should widen the candidate bracket around the central region instead of repeating V3-V4.

### 5.3 Romanian planned v0.2 series

Series label:

- `t5-ro-a-breve-v2-v5-researcher-v0.2`

Candidate bracket:

- V2-V5

Control bracket:

- V3-V4

Reason:

- V2-V5 tests whether Romanian `/ă/` behaves as a wider central interval case.
- V3-V4 is kept as the direct failed v0.1 bracket control.
- If V2-V5 fails, classify Romanian `/ă/` as unresolved central pressure requiring model-level review.

### 5.4 Romanian planned run IDs

| Ordinal | Run ID | Bracket | Purpose |
|---:|---|---|---|
| 1 | `t5.ro.a-breve.v2-v5.researcher.main.r01` | V2-V5 | candidate main |
| 2 | `t5.ro.a-breve.v2-v5.researcher.alt.r02` | V2-V5 | candidate alt |
| 3 | `t5.ro.a-breve.v3-v4.researcher.ctrl.r03` | V3-V4 | failed-bracket control main |
| 4 | `t5.ro.a-breve.v3-v4.researcher.ctrl-alt.r04` | V3-V4 | failed-bracket control alt |

### 5.5 Romanian success criteria

Romanian v0.2 can be considered improved only if:

1. both V2-V5 candidate runs return INTERMEDIATE;
2. both candidate runs have no diagnostic flags;
3. candidate margins are stronger than V3-V4 controls;
4. V3-V4 controls remain weaker, pressured, or failed.

Romanian v0.2 must remain unresolved if:

- either candidate run collapses;
- candidate runs split strongly;
- controls perform equally well;
- boundary uncertainty remains dominant.

---

## 6. Portuguese `/â/` v0.2 redesign

### 6.1 v0.1 result being redesigned

Previous Cohort 02 researcher series:

- `t5-pt-aa-v1-v4-researcher-v0.1`

Previous result:

| Run type | Bracket | Result |
|---|---|---|
| candidate main | V1-V4 | COLLAPSED_HIGH |
| candidate alt | V1-V4 | COLLAPSED_HIGH |
| control main | V2-V4 | EXCEEDS_LOW |
| control alt | V2-V4 | EXCEEDS_LOW |

Interpretation:

Portuguese `/â/` did not support V1-V4 under researcher-reviewed replication. Both candidate runs collapsed high, and both controls also failed.

### 6.2 Portuguese redesign hypothesis

Portuguese `/â/` is an edge-stressed case. The v0.1 researcher token sets placed `/â/` too close to the high side of V1-V4.

The v0.2 test should not repeat V1-V4 unchanged.

The next useful diagnostic is to test whether widening upward to V1-V5 improves stability or confirms that Portuguese `/â/` remains unresolved pressure.

This is a diagnostic redesign, not a support claim.

### 6.3 Portuguese planned v0.2 series

Series label:

- `t5-pt-aa-v1-v5-researcher-v0.2`

Candidate bracket:

- V1-V5

Control bracket:

- V1-V4

Reason:

- V1-V5 tests whether the high-side collapse in V1-V4 reflects an overly narrow upper anchor.
- V1-V4 is kept as the failed researcher baseline control.
- Earlier review warned that V1-V5 can worsen high-boundary pressure; this v0.2 test must treat that possibility as a valid negative outcome.

### 6.4 Portuguese planned run IDs

| Ordinal | Run ID | Bracket | Purpose |
|---:|---|---|---|
| 1 | `t5.pt.aa.v1-v5.researcher.main.r01` | V1-V5 | candidate main |
| 2 | `t5.pt.aa.v1-v5.researcher.alt.r02` | V1-V5 | candidate alt |
| 3 | `t5.pt.aa.v1-v4.researcher.ctrl.r03` | V1-V4 | failed-bracket control main |
| 4 | `t5.pt.aa.v1-v4.researcher.ctrl-alt.r04` | V1-V4 | failed-bracket control alt |

### 6.5 Portuguese success criteria

Portuguese v0.2 can be considered improved only if:

1. both V1-V5 candidate runs return INTERMEDIATE;
2. both candidate runs have no diagnostic flags;
3. candidate normalized positions move away from high collapse;
4. candidate margins are stronger than V1-V4 controls.

Portuguese v0.2 must remain unresolved / edge-stressed pressure if:

- V1-V5 candidates collapse high;
- V1-V5 candidates show high-boundary uncertainty;
- V1-V4 controls perform equally well;
- candidate/control separation remains weak.

---

## 7. Combined decision rule

After Romanian and Portuguese v0.2 are scored:

| Outcome | Interpretation |
|---|---|
| candidate stabilizes and controls fail | bracket redesign improvement |
| candidate stabilizes but controls also stabilize | weak / inconclusive |
| candidate fails and controls fail | unresolved pressure |
| candidate fails worse than controls | reject redesign bracket |
| candidate/control split by run | unstable; do not claim support |

No support claim is allowed unless both candidate main and candidate alt stabilize.

---

## 8. Planned archive behavior

If v0.2 scoring happens later:

1. export each series evidence pack;
2. inspect `01_RUN_INDEX.md`;
3. inspect `series-summary.csv`;
4. create a repo-tracked v0.2 summary doc;
5. then create local archive ZIPs;
6. only then decide whether any public Cohort 02 package is justified.

Do not update public files directly from raw `/evals` runs.

---

## 9. Completion criteria for this plan doc

This plan doc is complete when:

1. Romanian `/ă/` v0.2 bracket plan is defined;
2. Portuguese `/â/` v0.2 bracket plan is defined;
3. planned series labels and run IDs are listed;
4. success/failure criteria are explicit;
5. no token JSON is included;
6. no publication claim is made;
7. repo gates pass;
8. PR is merged.
