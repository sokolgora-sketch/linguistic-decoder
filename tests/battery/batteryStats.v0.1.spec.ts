import { describe, expect, it } from "@jest/globals";

import {
  buildBatteryBracketStatsFromIntermediateV0_1,
  hasImportedBatteryBracketStatsV0_1,
} from "@/lib/battery/batteryStats.v0.1";
import type { IntermediateTaskReportV0_1 } from "@/shared/evals/report.v0.1";

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
