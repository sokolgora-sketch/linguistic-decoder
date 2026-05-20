import { diagnoseHighRegionCollapseSeriesV0_1 } from "@/shared/evals/highRegionCollapseSeriesDiagnostics.v0.1";

describe("high-region collapse series diagnostics v0.1", () => {
  test("classifies complete Hindi i Arm A/Arm B-style series collapse as high-anchor suction", () => {
    const out = diagnoseHighRegionCollapseSeriesV0_1({
      seriesLabel: "cohort03-hi-i-highregion-audit-arm-b-function-matched-v0.1",
      runs: [
        {
          runId: "cohort03-hi-i-audit-b-v5-v7-main-r01",
          role: "candidate",
          bracket: "V5-V7",
          verdict: "COLLAPSED_HIGH",
          gap_low: 0.505,
          gap_high: -0.31,
          diagnosticFlags: [],
        },
        {
          runId: "cohort03-hi-i-audit-b-v5-v7-alt-r01",
          role: "candidate",
          bracket: "V5-V7",
          verdict: "COLLAPSED_HIGH",
          gap_low: 0.61,
          gap_high: -0.36,
          diagnosticFlags: [],
        },
        {
          runId: "cohort03-hi-i-audit-b-v4-v7-control-main-r01",
          role: "control",
          bracket: "V4-V7",
          verdict: "COLLAPSED_HIGH",
          gap_low: 0.47,
          gap_high: -0.31,
          diagnosticFlags: [],
        },
        {
          runId: "cohort03-hi-i-audit-b-v4-v7-control-alt-r01",
          role: "control",
          bracket: "V4-V7",
          verdict: "COLLAPSED_HIGH",
          gap_low: 0.685,
          gap_high: -0.36,
          diagnosticFlags: [],
        },
      ],
      functionMixedArmCollapsedHigh: true,
      functionMatchedArmCollapsedHigh: true,
      repeatedAcrossIndependentPacks: true,
    });

    expect(out).toEqual({
      seriesLabel: "cohort03-hi-i-highregion-audit-arm-b-function-matched-v0.1",
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
    });
  });

  test("keeps boundary overpressure primary for a complete series with boundary flags", () => {
    const out = diagnoseHighRegionCollapseSeriesV0_1({
      seriesLabel: "boundary-pressure-series",
      runs: [
        {
          runId: "candidate-main",
          role: "candidate",
          bracket: "V5-V7",
          verdict: "COLLAPSED_HIGH",
          gap_low: 0.12,
          gap_high: -0.02,
          diagnosticFlags: ["BOUNDARY_UNCERTAIN_HIGH"],
        },
        {
          runId: "control-main",
          role: "control",
          bracket: "V4-V7",
          verdict: "COLLAPSED_HIGH",
          gap_low: 0.14,
          gap_high: -0.03,
          diagnosticFlags: [],
        },
      ],
      functionMatchedArmCollapsedHigh: true,
    });

    expect(out.collapseMode).toBe("BOUNDARY_OVERPRESSURE");
    expect(out.secondary).toEqual([]);
    expect(out.diagnosticBasis).toEqual([
      "candidateCollapsedHigh",
      "widerControlCollapsedHigh",
      "highSideGapNegative",
      "boundaryFlagsPresent",
      "functionMatchedAuditCollapsedHigh",
    ]);
  });

  test("does not invent a collapse mode when candidate or control evidence is incomplete", () => {
    const out = diagnoseHighRegionCollapseSeriesV0_1({
      seriesLabel: "incomplete-series",
      runs: [
        {
          runId: "candidate-main",
          role: "candidate",
          bracket: "V5-V7",
          verdict: "INTERMEDIATE",
          gap_low: 0.2,
          gap_high: 0.2,
          diagnosticFlags: [],
        },
        {
          runId: "control-main",
          role: "control",
          bracket: "V4-V7",
          verdict: "COLLAPSED_HIGH",
          gap_low: 0.4,
          gap_high: -0.2,
          diagnosticFlags: [],
        },
      ],
      functionMatchedArmCollapsedHigh: false,
    });

    expect(out.collapseMode).toBeNull();
    expect(out.secondary).toEqual([]);
    expect(out.diagnosticBasis).toEqual(["widerControlCollapsedHigh"]);
    expect(out.seriesBasis.runCount).toBe(2);
  });

  test("adds high-anchor contamination only when explicitly supplied", () => {
    const out = diagnoseHighRegionCollapseSeriesV0_1({
      seriesLabel: "contamination-suspect-series",
      runs: [
        {
          runId: "candidate-main",
          role: "candidate",
          bracket: "V5-V7",
          verdict: "COLLAPSED_HIGH",
          gap_low: 0.505,
          gap_high: -0.31,
          diagnosticFlags: [],
        },
        {
          runId: "control-main",
          role: "control",
          bracket: "V4-V7",
          verdict: "COLLAPSED_HIGH",
          gap_low: 0.47,
          gap_high: -0.31,
          diagnosticFlags: [],
        },
      ],
      functionMatchedArmCollapsedHigh: true,
      highAnchorContaminationSuspected: true,
    });

    expect(out.collapseMode).toBe("HIGH_ANCHOR_SUCTION");
    expect(out.secondary).toEqual([
      "HIGH_ANCHOR_CONTAMINATION_SUSPECT",
      "BRACKET_GEOMETRY_SUSPECT",
    ]);
    expect(out.diagnosticBasis).toContain("highAnchorContaminationSuspected");
  });
});
