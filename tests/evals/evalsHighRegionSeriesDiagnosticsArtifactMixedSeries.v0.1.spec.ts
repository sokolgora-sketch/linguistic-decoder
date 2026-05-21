import type { EvalReportBundleV0_1 } from "@/shared/evals/report.v0.1";
import { maybeBuildHighRegionSeriesDiagnosticsArtifactFromRowsV0_1 } from "@/ui/evals/evalsHighRegionSeriesDiagnosticsArtifactFromRows.v0.1";

type TestRunInput = {
  runId: string;
  languageHint: string;
  vowelUnderTest: string;
  anchorLow: string;
  anchorHigh: string;
  verdict: string;
  gapLow: number;
  gapHigh: number;
  normalizedPosition: number;
  flags?: string[];
};

function makeReportV0_1(input: TestRunInput): EvalReportBundleV0_1 {
  return {
    runId: input.runId,
    tasks: [
      {
        taskId: "T5_INTERMEDIATE_V0_1",
        languageHint: input.languageHint,
        vowelUnderTest: input.vowelUnderTest,
        intermediate_aperturePresenceMean: {
          vowelUnderTest: input.vowelUnderTest,
          anchorLow: input.anchorLow,
          anchorHigh: input.anchorHigh,
          verdict: input.verdict,
          gap_low: input.gapLow,
          gap_high: input.gapHigh,
          normalizedPosition: input.normalizedPosition,
          diagnosticFlags: input.flags ?? [],
        },
      },
    ],
  } as unknown as EvalReportBundleV0_1;
}

describe("mixed high-region series diagnostics export adapter v0.1", () => {
  it("builds series-diagnostics for mixed-language and mixed-vowel high-front probe series", () => {
    const rows = [
      {
        ordinal: 1,
        title: "Hindi /i/ prior V5-V7 control",
        runId: "cohort03-hi-i-high-front-lane-prior-v5-v7-control-r01",
        report: makeReportV0_1({
          runId: "cohort03-hi-i-high-front-lane-prior-v5-v7-control-r01",
          languageHint: "hi",
          vowelUnderTest: "i",
          anchorLow: "V5",
          anchorHigh: "V7",
          verdict: "COLLAPSED_HIGH",
          gapLow: 0.468333,
          gapHigh: -0.258333,
          normalizedPosition: 2.230159,
        }),
      },
      {
        ordinal: 2,
        title: "Hindi /i/ V6-V7 candidate",
        runId: "cohort03-hi-i-high-front-lane-v6-v7-candidate-r01",
        report: makeReportV0_1({
          runId: "cohort03-hi-i-high-front-lane-v6-v7-candidate-r01",
          languageHint: "hi",
          vowelUnderTest: "i",
          anchorLow: "V6",
          anchorHigh: "V7",
          verdict: "COLLAPSED_HIGH",
          gapLow: 0.468333,
          gapHigh: -0.338333,
          normalizedPosition: 3.602564,
        }),
      },
      {
        ordinal: 3,
        title: "Arabic /i/ prior V5-V7 control",
        runId: "cohort03-ar-i-high-front-lane-prior-v5-v7-control-r01",
        report: makeReportV0_1({
          runId: "cohort03-ar-i-high-front-lane-prior-v5-v7-control-r01",
          languageHint: "ar",
          vowelUnderTest: "i",
          anchorLow: "V5",
          anchorHigh: "V7",
          verdict: "COLLAPSED_HIGH",
          gapLow: 0.515,
          gapHigh: -0.555,
          normalizedPosition: -12.875,
        }),
      },
      {
        ordinal: 4,
        title: "Arabic /i/ V6-V7 candidate",
        runId: "cohort03-ar-i-high-front-lane-v6-v7-candidate-r01",
        report: makeReportV0_1({
          runId: "cohort03-ar-i-high-front-lane-v6-v7-candidate-r01",
          languageHint: "ar",
          vowelUnderTest: "i",
          anchorLow: "V6",
          anchorHigh: "V7",
          verdict: "INTERMEDIATE",
          gapLow: 0.515,
          gapHigh: 0.27,
          normalizedPosition: 0.656051,
        }),
      },
      {
        ordinal: 5,
        title: "Finnish /y/ prior V5-V7 control",
        runId: "cohort03-fi-y-high-front-lane-prior-v5-v7-control-r01",
        report: makeReportV0_1({
          runId: "cohort03-fi-y-high-front-lane-prior-v5-v7-control-r01",
          languageHint: "fi",
          vowelUnderTest: "y",
          anchorLow: "V5",
          anchorHigh: "V7",
          verdict: "INTERMEDIATE",
          gapLow: 0.005,
          gapHigh: 0.26,
          normalizedPosition: 0.018868,
          flags: ["NEAR_COLLAPSE_LOW", "BOUNDARY_UNCERTAIN_LOW"],
        }),
      },
      {
        ordinal: 6,
        title: "Finnish /y/ V6-V7 control",
        runId: "cohort03-fi-y-high-front-lane-v6-v7-control-r01",
        report: makeReportV0_1({
          runId: "cohort03-fi-y-high-front-lane-v6-v7-control-r01",
          languageHint: "fi",
          vowelUnderTest: "y",
          anchorLow: "V6",
          anchorHigh: "V7",
          verdict: "INTERMEDIATE",
          gapLow: 0.005,
          gapHigh: 0.26,
          normalizedPosition: 0.018868,
          flags: ["NEAR_COLLAPSE_LOW", "BOUNDARY_UNCERTAIN_LOW"],
        }),
      },
      {
        ordinal: 7,
        title: "Turkish /ı/ prior V6-V7 control",
        runId: "cohort03-tr-ii-high-front-lane-prior-v6-v7-control-r01",
        report: makeReportV0_1({
          runId: "cohort03-tr-ii-high-front-lane-prior-v6-v7-control-r01",
          languageHint: "tr",
          vowelUnderTest: "ı",
          anchorLow: "V6",
          anchorHigh: "V7",
          verdict: "INTERMEDIATE",
          gapLow: 0.185,
          gapHigh: 0.085,
          normalizedPosition: 0.685185,
          flags: ["BOUNDARY_UNCERTAIN_HIGH"],
        }),
      },
      {
        ordinal: 8,
        title: "Turkish /ı/ widened V5-V7 control",
        runId: "cohort03-tr-ii-high-front-lane-v5-v7-control-r01",
        report: makeReportV0_1({
          runId: "cohort03-tr-ii-high-front-lane-v5-v7-control-r01",
          languageHint: "tr",
          vowelUnderTest: "ı",
          anchorLow: "V5",
          anchorHigh: "V7",
          verdict: "INTERMEDIATE",
          gapLow: 0.555,
          gapHigh: 0.085,
          normalizedPosition: 0.867187,
          flags: ["BOUNDARY_UNCERTAIN_HIGH"],
        }),
      },
    ];

    const artifact = maybeBuildHighRegionSeriesDiagnosticsArtifactFromRowsV0_1({
      seriesLabel: "cohort03-i-high-front-lane-probe-v0.1",
      rows,
    });

    expect(artifact).not.toBeNull();
    expect(artifact?.series.seriesLabel).toBe("cohort03-i-high-front-lane-probe-v0.1");
    expect(artifact?.series.languageHint).toBe("mixed");
    expect(artifact?.series.vowelUnderTest).toBe("mixed");
    expect(artifact?.series.taskId).toBe("T5_INTERMEDIATE_V0_1");
    expect(artifact?.runSummaries).toHaveLength(8);
    expect(artifact?.runSummaries.some((run) => run.role === "candidate")).toBe(true);
    expect(artifact?.runSummaries.some((run) => run.role === "control")).toBe(true);
    expect(artifact?.runSummaries.map((run) => run.runId)).toEqual(rows.map((row) => row.runId));
    expect(artifact?.runSets.candidate.count).toBe(2);
    expect(artifact?.runSets.control.count).toBe(6);
    expect(artifact?.runSets.candidate.runIds).toEqual([
      "cohort03-hi-i-high-front-lane-v6-v7-candidate-r01",
      "cohort03-ar-i-high-front-lane-v6-v7-candidate-r01",
    ]);
    expect(artifact?.runSets.control.runIds).toEqual([
      "cohort03-hi-i-high-front-lane-prior-v5-v7-control-r01",
      "cohort03-ar-i-high-front-lane-prior-v5-v7-control-r01",
      "cohort03-fi-y-high-front-lane-prior-v5-v7-control-r01",
      "cohort03-fi-y-high-front-lane-v6-v7-control-r01",
      "cohort03-tr-ii-high-front-lane-prior-v6-v7-control-r01",
      "cohort03-tr-ii-high-front-lane-v5-v7-control-r01",
    ]);
  });
});
