import {
  buildHighRegionSeriesDiagnosticsArtifactV0_1,
  HIGH_REGION_SERIES_DIAGNOSTICS_ARTIFACT_VERSION_V0_1,
  HIGH_REGION_SERIES_DIAGNOSTICS_CLAIM_BOUNDARIES_V0_1,
  type HighRegionSeriesDiagnosticsArtifactInputV0_1,
} from "@/shared/evals/highRegionSeriesDiagnosticsArtifact.v0.1";
import { HIGH_REGION_COLLAPSE_DIAGNOSTIC_LABELS_V0_1 } from "@/shared/evals/highRegionCollapseDiagnostics.v0.1";

const hindiArmBInput: HighRegionSeriesDiagnosticsArtifactInputV0_1 = {
  series: {
    seriesLabel: "cohort03-hi-i-highregion-audit-arm-b-function-matched-v0.1",
    cohort: "cohort03",
    phase: "high-region-audit",
    languageHint: "hi",
    vowelUnderTest: "i",
    taskId: "T5_INTERMEDIATE_V0_1",
    inputShape: "intermediate_triple",
  },
  sourceType: "manual_test_fixture",
  sourceEvidencePack: null,
  sourceRunIndex: null,
  notes: [],
  runs: [
    {
      runId: "cohort03-hi-i-audit-b-v5-v7-main-r01",
      role: "candidate",
      bracket: "V5-V7",
      verdict: "COLLAPSED_HIGH",
      gap_low: 0.505,
      gap_high: -0.31,
      normalizedPosition: null,
      diagnosticFlags: [],
    },
    {
      runId: "cohort03-hi-i-audit-b-v5-v7-alt-r01",
      role: "candidate",
      bracket: "V5-V7",
      verdict: "COLLAPSED_HIGH",
      gap_low: 0.61,
      gap_high: -0.36,
      normalizedPosition: null,
      diagnosticFlags: [],
    },
    {
      runId: "cohort03-hi-i-audit-b-v4-v7-control-main-r01",
      role: "control",
      bracket: "V4-V7",
      verdict: "COLLAPSED_HIGH",
      gap_low: 0.47,
      gap_high: -0.31,
      normalizedPosition: null,
      diagnosticFlags: [],
    },
    {
      runId: "cohort03-hi-i-audit-b-v4-v7-control-alt-r01",
      role: "control",
      bracket: "V4-V7",
      verdict: "COLLAPSED_HIGH",
      gap_low: 0.685,
      gap_high: -0.36,
      normalizedPosition: null,
      diagnosticFlags: [],
    },
  ],
  functionMixedArmCollapsedHigh: true,
  functionMatchedArmCollapsedHigh: true,
  repeatedAcrossIndependentPacks: true,
};

describe("high-region series diagnostics artifact v0.1", () => {
  test("builds the expected artifact for a complete Hindi i Arm B-style series", () => {
    const out = buildHighRegionSeriesDiagnosticsArtifactV0_1(hindiArmBInput);

    expect(out).toEqual({
      artifactVersion: HIGH_REGION_SERIES_DIAGNOSTICS_ARTIFACT_VERSION_V0_1,
      generatedBy: {
        helper: "diagnoseHighRegionCollapseV0_1",
        helperVersion: "v0.1",
        seriesHelper: "diagnoseHighRegionCollapseSeriesV0_1",
        seriesHelperVersion: "v0.1",
      },
      series: hindiArmBInput.series,
      source: {
        sourceType: "manual_test_fixture",
        sourceEvidencePack: null,
        sourceRunIndex: null,
        notes: [],
      },
      runSets: {
        candidate: {
          brackets: ["V5-V7"],
          runIds: [
            "cohort03-hi-i-audit-b-v5-v7-main-r01",
            "cohort03-hi-i-audit-b-v5-v7-alt-r01",
          ],
          count: 2,
        },
        control: {
          brackets: ["V4-V7"],
          runIds: [
            "cohort03-hi-i-audit-b-v4-v7-control-main-r01",
            "cohort03-hi-i-audit-b-v4-v7-control-alt-r01",
          ],
          count: 2,
        },
      },
      runSummaries: hindiArmBInput.runs.map((run) => ({
        runId: run.runId,
        role: run.role,
        bracket: run.bracket,
        verdict: run.verdict,
        gap_low: run.gap_low ?? null,
        gap_high: run.gap_high ?? null,
        normalizedPosition: run.normalizedPosition ?? null,
        diagnosticFlags: [],
      })),
      diagnostics: {
        collapseMode: "HIGH_ANCHOR_SUCTION",
        secondary: [
          "TARGET_FUNCTION_MISMATCH_UNLIKELY",
          "BRACKET_GEOMETRY_SUSPECT",
          "HARD_HIGH_REGION_PRESSURE",
        ],
        diagnosticBasis: [
          "candidateCollapsedHigh",
          "widerControlCollapsedHigh",
          "highSideGapNegative",
          "functionMixedArmCollapsedHigh",
          "functionMatchedAuditCollapsedHigh",
          "repeatedAcrossIndependentPacks",
        ],
        seriesBasis: {
          seriesLabel: "cohort03-hi-i-highregion-audit-arm-b-function-matched-v0.1",
          runCount: 4,
          candidateRunCount: 2,
          controlRunCount: 2,
          candidateRunIds: [
            "cohort03-hi-i-audit-b-v5-v7-main-r01",
            "cohort03-hi-i-audit-b-v5-v7-alt-r01",
          ],
          controlRunIds: [
            "cohort03-hi-i-audit-b-v4-v7-control-main-r01",
            "cohort03-hi-i-audit-b-v4-v7-control-alt-r01",
          ],
          candidateBrackets: ["V5-V7"],
          controlBrackets: ["V4-V7"],
        },
      },
      claimBoundaries: [...HIGH_REGION_SERIES_DIAGNOSTICS_CLAIM_BOUNDARIES_V0_1],
    });
  });

  test("preserves candidate/control separation and run order", () => {
    const out = buildHighRegionSeriesDiagnosticsArtifactV0_1(hindiArmBInput);

    expect(out.runSets.candidate.runIds).toEqual([
      "cohort03-hi-i-audit-b-v5-v7-main-r01",
      "cohort03-hi-i-audit-b-v5-v7-alt-r01",
    ]);
    expect(out.runSets.control.runIds).toEqual([
      "cohort03-hi-i-audit-b-v4-v7-control-main-r01",
      "cohort03-hi-i-audit-b-v4-v7-control-alt-r01",
    ]);
    expect(out.runSummaries.map((run) => run.runId)).toEqual(hindiArmBInput.runs.map((run) => run.runId));
  });

  test("emits required claim boundaries", () => {
    const out = buildHighRegionSeriesDiagnosticsArtifactV0_1(hindiArmBInput);

    expect(out.claimBoundaries).toEqual([
      "Does not change scorer output.",
      "Does not change run verdicts.",
      "Does not claim the high-region issue is solved.",
      "Does not claim bracket support.",
      "Does not claim framework proof.",
    ]);
  });

  test("normalizes missing or non-finite numeric fields to null", () => {
    const out = buildHighRegionSeriesDiagnosticsArtifactV0_1({
      ...hindiArmBInput,
      runs: [
        {
          runId: "candidate-missing",
          role: "candidate",
          bracket: "V5-V7",
          verdict: "COLLAPSED_HIGH",
          gap_low: undefined,
          gap_high: Number.NaN,
          normalizedPosition: undefined,
          diagnosticFlags: null,
        },
        {
          runId: "control-missing",
          role: "control",
          bracket: "V4-V7",
          verdict: "COLLAPSED_HIGH",
          gap_low: Number.POSITIVE_INFINITY,
          gap_high: -0.2,
          normalizedPosition: Number.NEGATIVE_INFINITY,
          diagnosticFlags: undefined,
        },
      ],
    });

    expect(out.runSummaries).toEqual([
      {
        runId: "candidate-missing",
        role: "candidate",
        bracket: "V5-V7",
        verdict: "COLLAPSED_HIGH",
        gap_low: null,
        gap_high: null,
        normalizedPosition: null,
        diagnosticFlags: [],
      },
      {
        runId: "control-missing",
        role: "control",
        bracket: "V4-V7",
        verdict: "COLLAPSED_HIGH",
        gap_low: null,
        gap_high: -0.2,
        normalizedPosition: null,
        diagnosticFlags: [],
      },
    ]);
  });

  test("does not emit undefined values", () => {
    const out = buildHighRegionSeriesDiagnosticsArtifactV0_1({
      ...hindiArmBInput,
      sourceEvidencePack: undefined,
      sourceRunIndex: undefined,
      notes: undefined,
    });

    expect(findUndefinedPaths(out)).toEqual([]);
  });

  test("does not invent labels outside the allowed diagnostic label set", () => {
    const out = buildHighRegionSeriesDiagnosticsArtifactV0_1(hindiArmBInput);
    const allowed = new Set<string>(HIGH_REGION_COLLAPSE_DIAGNOSTIC_LABELS_V0_1);

    const labels = [
      out.diagnostics.collapseMode,
      ...out.diagnostics.secondary,
    ].filter((label): label is string => label !== null);

    expect(labels.every((label) => allowed.has(label))).toBe(true);
  });

  test("produces deterministic JSON for repeated identical input", () => {
    const one = buildHighRegionSeriesDiagnosticsArtifactV0_1(hindiArmBInput);
    const two = buildHighRegionSeriesDiagnosticsArtifactV0_1(hindiArmBInput);

    expect(JSON.stringify(one)).toBe(JSON.stringify(two));
  });
});

function findUndefinedPaths(value: unknown, path = "$"): string[] {
  if (typeof value === "undefined") return [path];
  if (value === null) return [];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => findUndefinedPaths(item, `${path}[${index}]`));
  }
  if (typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => findUndefinedPaths(item, `${path}.${key}`));
  }

  return [];
}
