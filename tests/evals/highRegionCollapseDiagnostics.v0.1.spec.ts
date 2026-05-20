import { diagnoseHighRegionCollapseV0_1 } from "@/shared/evals/highRegionCollapseDiagnostics.v0.1";

describe("high-region collapse diagnostics v0.1", () => {
  test("classifies clean candidate/control high collapse as high-anchor suction without changing score fields", () => {
    const out = diagnoseHighRegionCollapseV0_1({
      candidateRuns: [
        { verdict: "COLLAPSED_HIGH", gap_high: -0.398333, gap_low: 0.508333, diagnosticFlags: [] },
        { verdict: "COLLAPSED_HIGH", gap_high: -0.198333, gap_low: 0.508333, diagnosticFlags: [] },
      ],
      controlRuns: [
        { verdict: "COLLAPSED_HIGH", gap_high: -0.398333, gap_low: 0.483333, diagnosticFlags: [] },
        { verdict: "COLLAPSED_HIGH", gap_high: -0.198333, gap_low: 0.558333, diagnosticFlags: [] },
      ],
      functionMixedArmCollapsedHigh: true,
      functionMatchedArmCollapsedHigh: true,
      repeatedAcrossIndependentPacks: true,
    });

    expect(out).toEqual({
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
    });
  });

  test("keeps boundary overpressure primary when boundary flags are present", () => {
    const out = diagnoseHighRegionCollapseV0_1({
      candidateRuns: [
        { verdict: "COLLAPSED_HIGH", gap_high: -0.02, gap_low: 0.12, diagnosticFlags: ["BOUNDARY_UNCERTAIN_HIGH"] },
      ],
      controlRuns: [
        { verdict: "COLLAPSED_HIGH", gap_high: -0.03, gap_low: 0.14, diagnosticFlags: [] },
      ],
      functionMatchedArmCollapsedHigh: true,
      repeatedAcrossIndependentPacks: true,
    });

    expect(out).toEqual({
      collapseMode: "BOUNDARY_OVERPRESSURE",
      secondary: [],
      diagnosticBasis: [
        "candidateCollapsedHigh",
        "widerControlCollapsedHigh",
        "highSideGapNegative",
        "boundaryFlagsPresent",
        "functionMatchedAuditCollapsedHigh",
        "repeatedAcrossIndependentPacks",
      ],
    });
  });

  test("does not invent a collapse mode when candidate or control evidence is incomplete", () => {
    const out = diagnoseHighRegionCollapseV0_1({
      candidateRuns: [
        { verdict: "INTERMEDIATE", gap_high: 0.2, gap_low: 0.2, diagnosticFlags: [] },
      ],
      controlRuns: [
        { verdict: "COLLAPSED_HIGH", gap_high: -0.2, gap_low: 0.4, diagnosticFlags: [] },
      ],
      functionMatchedArmCollapsedHigh: false,
    });

    expect(out).toEqual({
      collapseMode: null,
      secondary: [],
      diagnosticBasis: ["widerControlCollapsedHigh"],
    });
  });

  test("adds high-anchor contamination as secondary when explicitly suspected", () => {
    const out = diagnoseHighRegionCollapseV0_1({
      candidateRuns: [
        { verdict: "COLLAPSED_HIGH", gap_high: -0.31, gap_low: 0.505, diagnosticFlags: [] },
      ],
      controlRuns: [
        { verdict: "COLLAPSED_HIGH", gap_high: -0.31, gap_low: 0.47, diagnosticFlags: [] },
      ],
      functionMatchedArmCollapsedHigh: true,
      highAnchorContaminationSuspected: true,
    });

    expect(out.collapseMode).toBe("HIGH_ANCHOR_SUCTION");
    expect(out.secondary).toEqual([
      "HIGH_ANCHOR_CONTAMINATION_SUSPECT",
      "BRACKET_GEOMETRY_SUSPECT",
    ]);
    expect(out.diagnosticBasis).toEqual([
      "candidateCollapsedHigh",
      "widerControlCollapsedHigh",
      "highSideGapNegative",
      "functionMatchedAuditCollapsedHigh",
      "highAnchorContaminationSuspected",
    ]);
  });
});
