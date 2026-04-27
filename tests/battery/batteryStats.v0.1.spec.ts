import { describe, expect, it } from "@jest/globals";

import {
  buildBatteryBracketStatsFromIntermediateV0_1,
  buildBatteryBracketStatsFromReportV0_1,
  getPrimaryIntermediateTaskReportV0_1,
  hasImportedBatteryBracketStatsV0_1,
} from "@/lib/battery/batteryStats.v0.1";
import type {
  EvalReportBundleV0_1,
  EvalTaskReportV0_1,
  IntermediateTaskReportV0_1,
} from "@/shared/evals/report.v0.1";

describe("batteryStats.v0.1", () => {
  const intermediate: IntermediateTaskReportV0_1 = {
    scoreKey: "aperturePresenceMean",
    vowelUnderTest: "ä",
    anchorLow: "V1",
    anchorHigh: "V3",
    mean_anchor_low: 0.917,
    mean_x_vowel: 0.78,
    mean_anchor_high: 0.177,
    gap_low: 0.137,
    gap_high: 0.603,
    normalizedPosition: 0.185,
    verdict: "INTERMEDIATE",
    ordinalPermutation: {
      observed_order: true,
      p_value: 0.167,
      iters: 12000,
      seed: 85605032,
    },
    marginPermutation: {
      observed_min_gap: 0.137,
      p_value: 0.001,
      iters: 12000,
      seed: 85605032,
    },
    effectSizes: {
      hedges_g_low_x: 0.733,
      hedges_g_x_high: 3.263,
    },
    bootstrap: {
      ci95_gap_low: [0.045, 0.227],
      ci95_gap_high: [0.51, 0.693],
      ci95_normalizedPosition: [0.063, 0.296],
      iters: 12000,
      seed: 85605032,
    },
    diagnosticFlags: [],
  };

  it("normalizes intermediate report stats into battery bracket stats shape", () => {
    const stats = buildBatteryBracketStatsFromIntermediateV0_1({
      seriesLabel: "t5-fi-ae-v1-v3-core-v0.2",
      evidenceZipFilename:
        "evals.series-evidence-pack.t5-fi-ae-v1-v3-core-v0.2.v0.1.zip",
      intermediate,
      notes: "fixture only",
    });

    expect(stats).toEqual({
      source: "evidence-pack",
      seriesLabel: "t5-fi-ae-v1-v3-core-v0.2",
      evidenceZipFilename:
        "evals.series-evidence-pack.t5-fi-ae-v1-v3-core-v0.2.v0.1.zip",
      marginPermutation: {
        observedMinGap: 0.137,
        pValue: 0.001,
        iters: 12000,
        seed: 85605032,
      },
      effectSizes: {
        hedgesGLowX: 0.733,
        hedgesGXHigh: 3.263,
      },
      bootstrap: {
        ci95GapLow: [0.045, 0.227],
        ci95GapHigh: [0.51, 0.693],
        ci95NormalizedPosition: [0.063, 0.296],
        iters: 12000,
        seed: 85605032,
      },
      notes: "fixture only",
    });

    expect(hasImportedBatteryBracketStatsV0_1(stats)).toBe(true);
  });

  function makeTask(
    overrides: Partial<EvalTaskReportV0_1>,
  ): EvalTaskReportV0_1 {
    return {
      taskId: "T5_INTERMEDIATE_V0_1",
      kind: "byo",
      title: "Intermediate Position Test",
      languageHint: "fi",
      targetBuckets: ["anchor_low", "x_vowel", "anchor_high"],
      nPerBucket: 10,
      buckets: [],
      slope_aperturePrimary: null,
      slope_aperturePresenceMean: null,
      diagnostics: {
        missingBuckets: [],
        extraBuckets: [],
        emptyTokenCount: 0,
        whitespaceTokenCount: 0,
        noVowelTokenCount: 0,
        totalInvalidTokenCount: 0,
        notes: [],
      },
      ...overrides,
    };
  }

  function makeReport(tasks: EvalTaskReportV0_1[]): EvalReportBundleV0_1 {
    return {
      evalReportVersion: "evalReport.v0.1",
      evalSpecVersion: "evalSpec.v0.1",
      specId: "public-grounding-probe.v0.1",
      runId: "fixture.run",
      tasks,
      controlHealth: {
        status: "controlClean",
        reason: "fixture",
        threshold: 0.1,
        failingCount: 0,
        missingCount: 0,
        tasks: [],
      },
    };
  }

  it("extracts the primary T5 intermediate task from a report bundle", () => {
    const derivedTask = makeTask({
      kind: "derived",
      intermediate_aperturePresenceMean: {
        ...intermediate,
        vowelUnderTest: "ø",
        marginPermutation: {
          observed_min_gap: 0.999,
          p_value: 0.999,
          iters: 1,
          seed: 1,
        },
      },
    });

    const primaryTask = makeTask({
      kind: "byo",
      intermediate_aperturePresenceMean: intermediate,
    });

    const report = makeReport([derivedTask, primaryTask]);
    const selected = getPrimaryIntermediateTaskReportV0_1(report);

    expect(selected?.vowelUnderTest).toBe("ä");
    expect(selected?.marginPermutation.p_value).toBe(0.001);
  });

  it("builds bracket stats from a full eval report bundle", () => {
    const report = makeReport([
      makeTask({
        intermediate_aperturePresenceMean: intermediate,
      }),
    ]);

    const stats = buildBatteryBracketStatsFromReportV0_1({
      seriesLabel: "t5-fi-ae-v1-v3-core-v0.2",
      evidenceZipFilename:
        "evals.series-evidence-pack.t5-fi-ae-v1-v3-core-v0.2.v0.1.zip",
      report,
      notes: "report fixture",
    });

    expect(stats.marginPermutation.pValue).toBe(0.001);
    expect(stats.effectSizes.hedgesGLowX).toBe(0.733);
    expect(stats.bootstrap.ci95NormalizedPosition).toEqual([0.063, 0.296]);
    expect(stats.notes).toBe("report fixture");
    expect(hasImportedBatteryBracketStatsV0_1(stats)).toBe(true);
  });

  it("returns null-shaped stats when a report has no intermediate task", () => {
    const report = makeReport([
      makeTask({
        taskId: "T1_BUCKET_V1_V0_1",
        intermediate_aperturePresenceMean: null,
      }),
    ]);

    const stats = buildBatteryBracketStatsFromReportV0_1({
      seriesLabel: "no-intermediate",
      evidenceZipFilename: "no-intermediate.zip",
      report,
    });

    expect(stats.marginPermutation.pValue).toBeNull();
    expect(stats.effectSizes.hedgesGLowX).toBeNull();
    expect(stats.bootstrap.ci95NormalizedPosition).toBeNull();
    expect(hasImportedBatteryBracketStatsV0_1(stats)).toBe(false);
  });

  it("keeps missing or non-finite values null instead of inventing numbers", () => {
    const stats = buildBatteryBracketStatsFromIntermediateV0_1({
      seriesLabel: "missing-series",
      evidenceZipFilename: "missing.zip",
      intermediate: null,
    });

    expect(stats.marginPermutation).toEqual({
      observedMinGap: null,
      pValue: null,
      iters: null,
      seed: null,
    });
    expect(stats.effectSizes).toEqual({
      hedgesGLowX: null,
      hedgesGXHigh: null,
    });
    expect(stats.bootstrap).toEqual({
      ci95GapLow: null,
      ci95GapHigh: null,
      ci95NormalizedPosition: null,
      iters: null,
      seed: null,
    });
    expect(hasImportedBatteryBracketStatsV0_1(stats)).toBe(false);
  });
});
