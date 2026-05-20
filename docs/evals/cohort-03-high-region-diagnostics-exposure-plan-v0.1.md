# Cohort 03 High-Region Diagnostics Exposure Plan v0.1

Status: PLAN ONLY
Project: ZË-RO
Milestone: Cohort 03
Date recorded: 2026-05-20

This document decides the first safe exposure surface for high-region series diagnostics.

It follows:

- `docs/evals/cohort-03-high-region-collapse-diagnostics-design-v0.1.md`
- `docs/evals/cohort-03-high-region-diagnostics-integration-plan-v0.1.md`
- `src/shared/evals/highRegionCollapseDiagnostics.v0.1.ts`
- `src/shared/evals/highRegionCollapseSeriesDiagnostics.v0.1.ts`

It does not change code.
It does not expose diagnostics yet.
It does not modify scoring.
It does not modify `/api/evals/score`.
It does not modify report rendering.
It does not modify evidence-pack export.
It does not modify UI.
It does not run evaluations.

## 1. Current state

The repo now has two pure, unwired helpers:

- base helper: `src/shared/evals/highRegionCollapseDiagnostics.v0.1.ts`
- series helper: `src/shared/evals/highRegionCollapseSeriesDiagnostics.v0.1.ts`

Both helpers consume already-scored summaries.

They do not:

- score buckets;
- change verdicts;
- change `gap_low`;
- change `gap_high`;
- change `normalizedPosition`;
- change existing `diagnosticFlags`;
- change API response shape;
- change report output;
- change export output;
- change UI rendering.

## 2. Exposure decision

The first exposure surface should be a series-level companion artifact.

Recommended first artifact:

- `series-diagnostics.json`

Recommended eventual location:

- inside a series evidence pack;
- alongside existing run index and series summary files;
- not inside individual run reports.

Reason:

High-region diagnostics are series-level interpretations. They require candidate/control context, Arm A / Arm B knowledge, function-matched audit knowledge, repeated-pack knowledge, and optional contamination suspicion.

A single run cannot safely carry these conclusions.

## 3. Blocked surfaces

### 3.1 `/api/evals/score`

Blocked for now.

Reason:

- it scores one run;
- it lacks series context;
- adding diagnostics there would make series-level research conclusions look like run-level truth.

### 3.2 Single-run report markdown

Blocked for now.

Reason:

- single-run reports should describe only that run;
- high-region labels such as `HIGH_ANCHOR_SUCTION` need candidate/control comparison.

### 3.3 UI research readout

Blocked for now.

Reason:

- UI should not render diagnostics before artifact contract is stable;
- UI needs a stable VM contract and missing-state rules before display.

### 3.4 README/public paper wording

Blocked for now.

Reason:

- diagnostics are not yet emitted as a stable artifact;
- no publication or README claim should be updated from helper-only code.

## 4. Preferred exposure sequence

### Step 1 — docs-only exposure plan

This document.

No code changes.

### Step 2 — standalone artifact contract

Add a contract document for `series-diagnostics.json`.

It should define:

- top-level version;
- series label;
- source run IDs;
- candidate/control bracket summary;
- diagnostic output;
- claim boundaries;
- generated-by helper version.

No runtime wiring yet.

### Step 3 — pure artifact builder

Add a pure builder:

- `src/shared/evals/highRegionSeriesDiagnosticsArtifact.v0.1.ts`
- `tests/evals/highRegionSeriesDiagnosticsArtifact.v0.1.spec.ts`

Input:

- series label;
- already-scored run summaries;
- audit metadata.

Output:

- deterministic `series-diagnostics.json` object.

Still no export wiring.

### Step 4 — evidence-pack export wiring

Only after Step 3 passes:

- add optional `series-diagnostics.json` to evidence-pack export;
- do not alter existing run reports;
- do not change score result shape;
- do not change `/api/evals/score`.

### Step 5 — UI readout later

Only after evidence-pack artifact is stable:

- add optional UI readout;
- read from exported/series-level VM only;
- keep visible missing-state semantics.

## 5. Future `series-diagnostics.json` sketch

Example shape, not implemented yet:

- `artifactVersion`: `highRegionSeriesDiagnostics.v0.1`
- `seriesLabel`: series identifier
- `source`: task/language/vowel metadata
- `runSets.candidate`: candidate bracket and run IDs
- `runSets.control`: control bracket and run IDs
- `diagnostics.collapseMode`: primary diagnostic label
- `diagnostics.secondary`: secondary labels
- `diagnostics.diagnosticBasis`: evidence basis codes
- `claimBoundaries`: explicit blocked claims

This is only a future contract sketch.

## 6. Non-breaking rule

Any future artifact must be additive.

It must not change:

- existing score result shape;
- existing report markdown;
- existing evidence pack files;
- existing saved run loading;
- existing UI rendering;
- existing tests/snapshots unrelated to the new artifact.

## 7. Risk classification

Low risk:

- docs-only plan;
- pure artifact builder;
- focused artifact tests.

Medium risk:

- evidence-pack export addition.

Reason:

- export contract expands;
- downstream archive checks may need updates.

High risk:

- adding diagnostics to `/api/evals/score`;
- adding diagnostics to single-run reports;
- rendering diagnostics in UI before artifact contract stabilizes.

## 8. Claim boundaries

Allowed:

- high-region diagnostics helpers exist;
- helpers are unwired;
- the preferred first exposure surface is a series-level companion artifact;
- `/api/evals/score` remains blocked for diagnostics;
- evidence-pack export is the likely later surface.

Blocked:

- Do not claim diagnostics are exposed.
- Do not claim diagnostics are integrated.
- Do not claim scorer behavior changed.
- Do not claim the high-region issue is solved.
- Do not claim Hindi `/i` supports any bracket.
- Do not claim `V5-V7` is supported for high/front `/i`-type cases.
- Do not update README from this plan alone.
- Do not publish this plan as a result.

## 9. Next step

Create a docs-only contract for `series-diagnostics.json`.

Recommended file:

- `docs/evals/high-region-series-diagnostics-artifact-contract-v0.1.md`

No code should be wired before that contract exists.
