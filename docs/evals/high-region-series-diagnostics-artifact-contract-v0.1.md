# High-Region Series Diagnostics Artifact Contract v0.1

Status: CONTRACT ONLY
Project: ZË-RO
Milestone: Cohort 03
Artifact name: `series-diagnostics.json`
Date recorded: 2026-05-20

This document defines the future `series-diagnostics.json` companion artifact for high-region series diagnostics.

It follows:

- `docs/evals/cohort-03-high-region-collapse-diagnostics-design-v0.1.md`
- `docs/evals/cohort-03-high-region-diagnostics-integration-plan-v0.1.md`
- `docs/evals/cohort-03-high-region-diagnostics-exposure-plan-v0.1.md`
- `src/shared/evals/highRegionCollapseDiagnostics.v0.1.ts`
- `src/shared/evals/highRegionCollapseSeriesDiagnostics.v0.1.ts`

It does not add code.
It does not expose diagnostics.
It does not wire evidence-pack export.
It does not modify scoring.
It does not modify `/api/evals/score`.
It does not modify single-run reports.
It does not modify UI.
It does not run evaluations.

## 1. Purpose

`series-diagnostics.json` is a series-level companion artifact.

It records post-score diagnostic interpretation for a complete high-region series.

It is not a single-run score result.

It exists to preserve:

- source run IDs;
- candidate/control bracket structure;
- already-computed verdict summaries;
- diagnostic output from the series helper;
- claim boundaries.

## 2. Placement

Future intended placement:

- inside a series evidence pack;
- beside `01_RUN_INDEX.md`;
- beside `series-summary.csv`;
- separate from individual run reports.

Blocked placement:

- not inside `/api/evals/score`;
- not inside single-run report markdown;
- not inside individual run JSON;
- not in README or public paper text.

## 3. Artifact filename

Required filename:

- `series-diagnostics.json`

If a future evidence pack contains more than one diagnostic family, this artifact may later become:

- `series-diagnostics.high-region.v0.1.json`

For v0.1, use the simple name only.

## 4. Required top-level fields

The artifact must include these keys in stable order:

1. `artifactVersion`
2. `generatedBy`
3. `series`
4. `source`
5. `runSets`
6. `runSummaries`
7. `diagnostics`
8. `claimBoundaries`

No optional top-level key may be added without a contract bump or an explicit additive-contract note.

## 5. Field contract

### 5.1 `artifactVersion`

Required string.

Fixed value for this contract:

- `highRegionSeriesDiagnosticsArtifact.v0.1`

### 5.2 `generatedBy`

Required object.

Fields:

- `helper`: string
- `helperVersion`: string
- `seriesHelper`: string
- `seriesHelperVersion`: string

Expected values:

- `helper`: `diagnoseHighRegionCollapseV0_1`
- `helperVersion`: `v0.1`
- `seriesHelper`: `diagnoseHighRegionCollapseSeriesV0_1`
- `seriesHelperVersion`: `v0.1`

### 5.3 `series`

Required object.

Fields:

- `seriesLabel`: string
- `cohort`: string
- `phase`: string
- `languageHint`: string
- `vowelUnderTest`: string
- `taskId`: string
- `inputShape`: string

Rules:

- `seriesLabel` must be stable and match the evidence-pack series label.
- `taskId` must match the scored task, usually `T5_INTERMEDIATE_V0_1`.
- `inputShape` must match the scored shape, usually `intermediate_triple`.

### 5.4 `source`

Required object.

Fields:

- `sourceType`: string
- `sourceEvidencePack`: string or null
- `sourceRunIndex`: string or null
- `notes`: string array

Rules:

- `sourceType` should be `series_evidence_pack` once export wiring exists.
- Before export wiring exists, builder tests may use `manual_test_fixture`.
- `notes` must be present, even when empty.

### 5.5 `runSets`

Required object.

Fields:

- `candidate`: object
- `control`: object

Each run set object includes:

- `brackets`: string array
- `runIds`: string array
- `count`: number

Rules:

- Candidate and control sets must be separate.
- Bracket names must be deterministic strings such as `V5-V7` or `V4-V7`.
- Run IDs must preserve evidence-pack order unless the series helper defines a stricter stable order.

### 5.6 `runSummaries`

Required array.

Each item includes:

- `runId`: string
- `role`: `candidate` or `control`
- `bracket`: string
- `verdict`: string
- `gap_low`: number or null
- `gap_high`: number or null
- `normalizedPosition`: number or null
- `diagnosticFlags`: string array

Rules:

- Summaries must be copied from already-scored run outputs.
- The artifact builder must not recompute verdicts.
- The artifact builder must not recompute gaps.
- `diagnosticFlags` must be present, even when empty.

### 5.7 `diagnostics`

Required object.

Fields:

- `collapseMode`: string or null
- `secondary`: string array
- `diagnosticBasis`: string array
- `seriesBasis`: object

Allowed `collapseMode` / `secondary` labels:

- `BOUNDARY_OVERPRESSURE`
- `TARGET_FUNCTION_MISMATCH_UNLIKELY`
- `HIGH_ANCHOR_CONTAMINATION_SUSPECT`
- `HIGH_ANCHOR_SUCTION`
- `BRACKET_GEOMETRY_SUSPECT`
- `HARD_HIGH_REGION_PRESSURE`

Rules:

- `diagnostics` must come from `diagnoseHighRegionCollapseSeriesV0_1`.
- No artifact builder may invent a diagnostic label outside the allowed list.
- If evidence is incomplete, `collapseMode` may be null.
- `secondary` must be present, even when empty.
- `diagnosticBasis` must be present, even when empty.

### 5.8 `claimBoundaries`

Required string array.

Must include at least:

- `Does not change scorer output.`
- `Does not change run verdicts.`
- `Does not claim the high-region issue is solved.`
- `Does not claim bracket support.`
- `Does not claim framework proof.`

Rules:

- Claim boundaries are part of the artifact, not just documentation.
- They must travel with the diagnostic result.

## 6. Example artifact

Example only. Not generated by code yet.

{
  "artifactVersion": "highRegionSeriesDiagnosticsArtifact.v0.1",
  "generatedBy": {
    "helper": "diagnoseHighRegionCollapseV0_1",
    "helperVersion": "v0.1",
    "seriesHelper": "diagnoseHighRegionCollapseSeriesV0_1",
    "seriesHelperVersion": "v0.1"
  },
  "series": {
    "seriesLabel": "cohort03-hi-i-highregion-audit-arm-b-function-matched-v0.1",
    "cohort": "cohort03",
    "phase": "high-region-audit",
    "languageHint": "hi",
    "vowelUnderTest": "i",
    "taskId": "T5_INTERMEDIATE_V0_1",
    "inputShape": "intermediate_triple"
  },
  "source": {
    "sourceType": "manual_test_fixture",
    "sourceEvidencePack": null,
    "sourceRunIndex": null,
    "notes": []
  },
  "runSets": {
    "candidate": {
      "brackets": ["V5-V7"],
      "runIds": [
        "cohort03-hi-i-audit-b-v5-v7-main-r01",
        "cohort03-hi-i-audit-b-v5-v7-alt-r01"
      ],
      "count": 2
    },
    "control": {
      "brackets": ["V4-V7"],
      "runIds": [
        "cohort03-hi-i-audit-b-v4-v7-control-main-r01",
        "cohort03-hi-i-audit-b-v4-v7-control-alt-r01"
      ],
      "count": 2
    }
  },
  "runSummaries": [
    {
      "runId": "cohort03-hi-i-audit-b-v5-v7-main-r01",
      "role": "candidate",
      "bracket": "V5-V7",
      "verdict": "COLLAPSED_HIGH",
      "gap_low": 0.505,
      "gap_high": -0.31,
      "normalizedPosition": null,
      "diagnosticFlags": []
    }
  ],
  "diagnostics": {
    "collapseMode": "HIGH_ANCHOR_SUCTION",
    "secondary": [
      "TARGET_FUNCTION_MISMATCH_UNLIKELY",
      "BRACKET_GEOMETRY_SUSPECT",
      "HARD_HIGH_REGION_PRESSURE"
    ],
    "diagnosticBasis": [
      "candidateCollapsedHigh",
      "widerControlCollapsedHigh",
      "highSideGapNegative",
      "functionMixedArmCollapsedHigh",
      "functionMatchedAuditCollapsedHigh",
      "repeatedAcrossIndependentPacks"
    ],
    "seriesBasis": {
      "seriesLabel": "cohort03-hi-i-highregion-audit-arm-b-function-matched-v0.1",
      "runCount": 4,
      "candidateRunCount": 2,
      "controlRunCount": 2,
      "candidateRunIds": [
        "cohort03-hi-i-audit-b-v5-v7-main-r01",
        "cohort03-hi-i-audit-b-v5-v7-alt-r01"
      ],
      "controlRunIds": [
        "cohort03-hi-i-audit-b-v4-v7-control-main-r01",
        "cohort03-hi-i-audit-b-v4-v7-control-alt-r01"
      ],
      "candidateBrackets": ["V5-V7"],
      "controlBrackets": ["V4-V7"]
    }
  },
  "claimBoundaries": [
    "Does not change scorer output.",
    "Does not change run verdicts.",
    "Does not claim the high-region issue is solved.",
    "Does not claim bracket support.",
    "Does not claim framework proof."
  ]
}

## 7. Builder requirements for future PR

Future builder target:

- `src/shared/evals/highRegionSeriesDiagnosticsArtifact.v0.1.ts`
- `tests/evals/highRegionSeriesDiagnosticsArtifact.v0.1.spec.ts`

Builder rules:

- Pure function only.
- No file-system writes.
- No API wiring.
- No evidence-pack export wiring.
- No UI rendering.
- Deterministic key order.
- JSON-safe output.
- No `undefined` fields.
- Preserve run order unless explicitly sorted by stable rule.
- Use `diagnoseHighRegionCollapseSeriesV0_1`.

## 8. Non-breaking rule

Future implementation must be additive.

It must not change:

- `/api/evals/score`;
- score result shape;
- run verdicts;
- `gap_low`;
- `gap_high`;
- `normalizedPosition`;
- existing `diagnosticFlags`;
- existing report markdown;
- existing evidence-pack files;
- saved run loading;
- UI rendering;
- unrelated snapshots.

## 9. Required tests for future builder

Minimum tests:

1. Builds expected artifact for a complete Hindi `/i` Arm B-style series.
2. Preserves candidate/control separation.
3. Emits required claim boundaries.
4. Rejects or normalizes missing optional numeric fields to null.
5. Does not emit `undefined`.
6. Does not invent labels outside the allowed diagnostic label set.
7. Produces deterministic JSON for repeated identical input.

## 10. Claim boundaries

Allowed after this contract lands:

- The artifact contract is recorded.
- Future diagnostics artifact shape is defined.
- Diagnostics are still not exposed.
- No scoring behavior changed.

Blocked:

- Do not claim `series-diagnostics.json` is generated.
- Do not claim diagnostics are exposed.
- Do not claim diagnostics are integrated.
- Do not claim scorer behavior changed.
- Do not claim the high-region issue is solved.
- Do not claim Hindi `/i` supports any bracket.
- Do not update README from this contract alone.
- Do not publish this contract as a result.

## 11. Next step

Create the pure artifact builder and focused tests.

Do not wire the builder into evidence-pack export yet.
