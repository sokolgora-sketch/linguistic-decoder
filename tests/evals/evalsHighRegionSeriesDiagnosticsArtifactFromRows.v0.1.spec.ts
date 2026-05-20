import { maybeBuildHighRegionSeriesDiagnosticsArtifactFromRowsV0_1 } from "@/ui/evals/evalsHighRegionSeriesDiagnosticsArtifactFromRows.v0.1";

function makeReport(params: {
  runId: string;
  languageHint?: string;
  vowelUnderTest?: string;
  anchorLow: string;
  anchorHigh: string;
  verdict?: string;
  gapLow?: number;
  gapHigh?: number;
  normalizedPosition?: number;
}) {
  return {
    evalReportVersion: "evalReport.v0.1",
    evalSpecVersion: "evalSpec.v0.1",
    specId: "adapter-test",
    runId: params.runId,
    tasks: [
      {
        taskId: "T5_INTERMEDIATE_V0_1",
        kind: "byo",
        title: "Intermediate Position Test",
        languageHint: params.languageHint ?? "hi",
        targetBuckets: ["anchor_low", "x_vowel", "anchor_high"],
        nPerBucket: 10,
        buckets: [],
        slope_aperturePrimary: null,
        slope_aperturePresenceMean: null,
        intermediate_aperturePresenceMean: {
          scoreKey: "aperturePresenceMean",
          vowelUnderTest: params.vowelUnderTest ?? "i",
          anchorLow: params.anchorLow,
          anchorHigh: params.anchorHigh,
          mean_anchor_low: 0.9,
          mean_x_vowel: 0.7,
          mean_anchor_high: 0.2,
          gap_low: params.gapLow ?? 0.5,
          gap_high: params.gapHigh ?? -0.3,
          normalizedPosition: params.normalizedPosition ?? 4.1,
          verdict: params.verdict ?? "COLLAPSED_HIGH",
          diagnosticFlags: [],
        },
        diagnostics: {
          missingBuckets: [],
          extraBuckets: [],
          emptyTokenCount: 0,
          whitespaceTokenCount: 0,
          noVowelTokenCount: 0,
          totalInvalidTokenCount: 0,
          notes: [],
        },
      },
    ],
    controlHealth: {
      status: "controlClean",
      reason: "no ladder controls applicable",
      threshold: 0.1,
      failingCount: 0,
      missingCount: 0,
      tasks: [],
    },
  } as any;
}

describe("evals high-region series diagnostics artifact adapter v0.1", () => {
  test("builds an artifact for a complete high-region candidate/control saved-run series", () => {
    const artifact = maybeBuildHighRegionSeriesDiagnosticsArtifactFromRowsV0_1({
      seriesLabel: "cohort03-hi-i-high-region-audit-v0.1",
      rows: [
        {
          ordinal: 1,
          title: "candidate main",
          runId: "cohort03-hi-i-v5-v7-main-r01",
          report: makeReport({
            runId: "cohort03-hi-i-v5-v7-main-r01",
            anchorLow: "V5",
            anchorHigh: "V7",
            gapLow: 0.505,
            gapHigh: -0.31,
          }),
        },
        {
          ordinal: 2,
          title: "candidate alt",
          runId: "cohort03-hi-i-v5-v7-alt-r01",
          report: makeReport({
            runId: "cohort03-hi-i-v5-v7-alt-r01",
            anchorLow: "V5",
            anchorHigh: "V7",
            gapLow: 0.61,
            gapHigh: -0.36,
          }),
        },
        {
          ordinal: 3,
          title: "control main",
          runId: "cohort03-hi-i-v4-v7-control-main-r01",
          report: makeReport({
            runId: "cohort03-hi-i-v4-v7-control-main-r01",
            anchorLow: "V4",
            anchorHigh: "V7",
            gapLow: 0.47,
            gapHigh: -0.31,
          }),
        },
        {
          ordinal: 4,
          title: "control alt",
          runId: "cohort03-hi-i-v4-v7-control-alt-r01",
          report: makeReport({
            runId: "cohort03-hi-i-v4-v7-control-alt-r01",
            anchorLow: "V4",
            anchorHigh: "V7",
            gapLow: 0.685,
            gapHigh: -0.36,
          }),
        },
      ],
    });

    expect(artifact).not.toBeNull();
    expect(artifact?.artifactVersion).toBe("highRegionSeriesDiagnosticsArtifact.v0.1");
    expect(artifact?.series).toMatchObject({
      seriesLabel: "cohort03-hi-i-high-region-audit-v0.1",
      cohort: "cohort03",
      phase: "high-region",
      languageHint: "hi",
      vowelUnderTest: "i",
      taskId: "T5_INTERMEDIATE_V0_1",
      inputShape: "intermediate_triple",
    });
    expect(artifact?.runSets.candidate.runIds).toEqual([
      "cohort03-hi-i-v5-v7-main-r01",
      "cohort03-hi-i-v5-v7-alt-r01",
    ]);
    expect(artifact?.runSets.control.runIds).toEqual([
      "cohort03-hi-i-v4-v7-control-main-r01",
      "cohort03-hi-i-v4-v7-control-alt-r01",
    ]);
    expect(artifact?.source.sourceType).toBe("series_evidence_pack");
    expect(artifact?.claimBoundaries).toContain("Does not change scorer output.");
  });

  test("returns null when no control row can be identified", () => {
    const artifact = maybeBuildHighRegionSeriesDiagnosticsArtifactFromRowsV0_1({
      seriesLabel: "cohort03-hi-i-high-region-audit-v0.1",
      rows: [
        {
          ordinal: 1,
          title: "main",
          runId: "cohort03-hi-i-v5-v7-main-r01",
          report: makeReport({
            runId: "cohort03-hi-i-v5-v7-main-r01",
            anchorLow: "V5",
            anchorHigh: "V7",
          }),
        },
      ],
    });

    expect(artifact).toBeNull();
  });

  test("returns null for non-high-region brackets", () => {
    const artifact = maybeBuildHighRegionSeriesDiagnosticsArtifactFromRowsV0_1({
      seriesLabel: "cohort03-fi-ae-v1-v3-v0.1",
      rows: [
        {
          ordinal: 1,
          title: "candidate",
          runId: "cohort03-fi-ae-v1-v3-main-r01",
          report: makeReport({
            runId: "cohort03-fi-ae-v1-v3-main-r01",
            vowelUnderTest: "ä",
            anchorLow: "V1",
            anchorHigh: "V3",
            verdict: "INTERMEDIATE",
            gapHigh: 0.3,
          }),
        },
        {
          ordinal: 2,
          title: "control",
          runId: "cohort03-fi-ae-v2-v3-control-r01",
          report: makeReport({
            runId: "cohort03-fi-ae-v2-v3-control-r01",
            vowelUnderTest: "ä",
            anchorLow: "V2",
            anchorHigh: "V3",
            verdict: "INTERMEDIATE",
            gapHigh: 0.3,
          }),
        },
      ],
    });

    expect(artifact).toBeNull();
  });
});
