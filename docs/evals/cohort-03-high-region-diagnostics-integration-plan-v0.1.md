# Cohort 03 High-Region Diagnostics Integration Plan v0.1

Status: PLAN ONLY
Project: ZË-RO
Milestone: Cohort 03
Date recorded: 2026-05-20

This document defines the safe integration path for high-region collapse diagnostics.

It follows:

- `docs/evals/cohort-03-high-region-anchor-review-v0.1.md`
- `docs/evals/cohort-03-high-region-audit-protocol-v0.1.md`
- `docs/evals/cohort-03-high-region-audit-design-v0.1.md`
- `docs/evals/cohort-03-high-region-hindi-i-audit-result-v0.1.md`
- `docs/evals/cohort-03-high-region-collapse-diagnostics-design-v0.1.md`
- `src/shared/evals/highRegionCollapseDiagnostics.v0.1.ts`

It does not change code.
It does not wire diagnostics into scoring.
It does not change API output.
It does not change report rendering.
It does not change evidence-pack export.
It does not change UI rendering.
It does not run evaluations.
It does not claim the high-region issue is solved.

## 1. Current state

PR #1044 added a pure, unwired helper:

- `src/shared/evals/highRegionCollapseDiagnostics.v0.1.ts`
- `tests/evals/highRegionCollapseDiagnostics.v0.1.spec.ts`

The helper is intentionally post-score.

It does not:

- score buckets;
- change verdicts;
- change `gap_low`;
- change `gap_high`;
- change `normalizedPosition`;
- change existing `diagnosticFlags`;
- change score result shape;
- change snapshots;
- change exports.

## 2. Main integration decision

Do not wire high-region diagnostics directly into `/api/evals/score` yet.

Reason:

A single scored run does not contain enough context to assign the new labels safely.

The helper needs series-level context:

- candidate runs;
- control runs;
- whether Arm A collapsed;
- whether Arm B collapsed;
- whether function-matched audit failed to stabilize;
- whether pressure repeated across independent packs;
- whether high-anchor contamination is suspected.

A single `scoreEvalRunBundleV0_1` call sees one run. It should not infer series-level research conclusions.

## 3. Correct integration level

The first integration should be series-level, not single-run scorer-level.

Recommended next implementation target:

- `src/shared/evals/highRegionCollapseSeriesDiagnostics.v0.1.ts`
- `tests/evals/highRegionCollapseSeriesDiagnostics.v0.1.spec.ts`

Purpose:

- consume already-scored run reports;
- group candidate/control runs;
- call `diagnoseHighRegionCollapseV0_1`;
- return a separate diagnostics block;
- remain unwired at first.

This preserves the scorer as the source of numeric truth while allowing research diagnostics to operate on complete audit evidence.

## 4. Boundary map

| Area | Current decision | Reason |
|---|---|---|
| `src/shared/evals/scoreEvalRun.v0.1.ts` | Do not touch yet | Verdict/gap math must remain unchanged |
| `src/shared/evals/report.v0.1.ts` | Do not change yet | Adding report fields can affect API/snapshots/export |
| `/api/evals/score` | Do not change yet | Single-run endpoint lacks series context |
| `renderEvalReportMd.v0.1.ts` | Do not change yet | Report text should not show incomplete diagnostics |
| `evalsEvidencePackExport.v0.1.ts` | Possible later | Series evidence pack is the right eventual surface |
| `/evals` UI | Do not change yet | UI should not render research diagnostics until backend contract is stable |
| helper tests | Safe | Pure tests protect the diagnostic classifier |

## 5. Recommended implementation sequence

### Step 1 — series helper only

Add a pure series-level helper.

Inputs:

- series label;
- scored candidate reports;
- scored control reports;
- optional audit metadata:
  - `functionMixedArmCollapsedHigh`;
  - `functionMatchedArmCollapsedHigh`;
  - `repeatedAcrossIndependentPacks`;
  - `highAnchorContaminationSuspected`.

Output:

- `collapseMode`;
- `secondary`;
- `diagnosticBasis`;
- `seriesBasis`.

No wiring.

No API change.

No export change.

### Step 2 — contract tests

Add focused tests that reconstruct the Hindi `/i` Arm A + Arm B pattern from already-known run summaries.

Required test cases:

1. Arm A + Arm B both collapse high with no flags.
2. Boundary flags override suction.
3. Incomplete candidate/control set does not invent a collapse mode.
4. Contamination suspicion appears only when explicitly supplied.

### Step 3 — optional report contract design

Only after Step 1 is merged, decide whether the output should appear as:

- standalone series diagnostic report;
- evidence-pack companion JSON;
- markdown note in series export;
- UI-only research readout.

Do not choose this before Step 1 exists.

### Step 4 — possible export integration

The safest eventual surface is the series evidence pack, not the single-run score response.

Reason:

- evidence packs already represent multi-run series;
- high-region diagnostics need multi-run evidence;
- export can include a separate `series-diagnostics.json` without changing individual run reports.

## 6. Blocked changes

The next implementation PR must not:

- edit `scoreEvalRun.v0.1.ts`;
- edit `/api/evals/score`;
- edit `report.v0.1.ts`;
- edit `renderEvalReportMd.v0.1.ts`;
- edit evidence-pack export;
- edit `/evals` UI;
- change existing snapshots;
- change verdict math;
- change gap math;
- change `normalizedPosition`;
- change existing `diagnosticFlags`.

## 7. Risk analysis

### Low risk

A pure series helper with focused tests.

Reason:

- no live path uses it;
- rollback is one commit;
- existing scorer remains untouched.

### Medium risk

Adding optional diagnostics to evidence-pack export.

Reason:

- export contract changes;
- downstream archive tooling may need updates.

### High risk

Adding diagnostics directly to `scoreEvalRunBundleV0_1`.

Reason:

- single-run scorer lacks required context;
- report snapshots may change;
- API clients may see new fields;
- diagnostics could be mistaken for run-level truth.

## 8. Rollback plan

Before merge:

- delete the branch;
- delete the PR.

After merge:

- revert the squash commit.

No data migration is needed for a docs-only integration plan.

For future helper-only PRs, rollback remains simple because no live scoring path is touched.

## 9. Claim boundaries

Allowed:

- The integration plan is recorded.
- Diagnostics should remain series-level first.
- The current helper should remain unwired until a series helper exists.
- `/api/evals/score` should not receive diagnostics yet.

Blocked:

- Do not claim diagnostics are integrated.
- Do not claim scorer behavior changed.
- Do not claim the high-region issue is solved.
- Do not claim Hindi `/i` supports any bracket.
- Do not claim `V5-V7` is supported for high/front `/i`-type cases.
- Do not update README from this plan alone.
- Do not publish this plan as a result.

## 10. Next step

Create the pure series-level helper:

- `src/shared/evals/highRegionCollapseSeriesDiagnostics.v0.1.ts`
- `tests/evals/highRegionCollapseSeriesDiagnostics.v0.1.spec.ts`

The helper must stay unwired.
