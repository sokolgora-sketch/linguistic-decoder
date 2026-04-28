import {
  BATTERY_CASES,
  BRACKETS,
  type BatteryFourRunSeriesStatsV0_1,
  type BracketId
} from "@/lib/battery/batteryRegistry.v0.1";
import {
  getAllBatteryCases,
  getBatteryCaseById,
  getBatteryCaseBySeriesLabel,
  getBracket,
  getBatteryCasesBySection,
  getSupportCases,
  getPressureCases,
  getMixedCases
} from "@/lib/battery/getBatteryCase.v0.1";
import type { BatteryBracketStatsV0_1 } from "@/lib/battery/batteryStats.v0.1";

describe("batteryRegistry.v0.1", () => {
  it("contains 9 cases", () => {
    expect(BATTERY_CASES).toHaveLength(9);
    expect(getAllBatteryCases()).toHaveLength(9);
  });

  it("has unique case ids and series labels", () => {
    const caseIds = BATTERY_CASES.map((c) => c.caseId);
    const seriesLabels = BATTERY_CASES.map((c) => c.seriesLabel);

    expect(new Set(caseIds).size).toBe(caseIds.length);
    expect(new Set(seriesLabels).size).toBe(seriesLabels.length);
  });

  it("only references defined brackets", () => {
    const bracketIds = new Set(Object.keys(BRACKETS));

    for (const batteryCase of BATTERY_CASES) {
      expect(bracketIds.has(batteryCase.intendedBracketId)).toBe(true);
      expect(bracketIds.has(batteryCase.controlBracketId)).toBe(true);
    }
  });

  it("keeps all ordinals locked to [1,2,3,4]", () => {
    for (const batteryCase of BATTERY_CASES) {
      expect(batteryCase.ordinalsConfirmed).toEqual([1, 2, 3, 4]);
    }
  });

  it("exposes lookup helpers correctly", () => {
    const french = getBatteryCaseById("fr-euoe");
    expect(french?.displayName).toBe("French /ø~œ/");

    const turkish = getBatteryCaseBySeriesLabel("t5-tr-ii-v6-v7-core-v0.2");
    expect(turkish?.scientificStatus).toBe("pressure");
    expect(turkish?.strength).toBe("strong-pressure");
  });

  it("returns brackets through helper", () => {
    const bracket = getBracket("V2-V5" as BracketId);
    expect(bracket.low).toBe("V2");
    expect(bracket.high).toBe("V5");
  });

  it("exposes optional stats fields without requiring them on every case", () => {
    const french = getBatteryCaseById("fr-euoe");
    const finnish = getBatteryCaseById("fi-ae");
    const turkish = getBatteryCaseById("tr-ii");
    const german = getBatteryCaseById("de-oe");

    expect(french?.mainPairStats?.notes).toContain("Journal-facing stats pending");
    expect(finnish?.controlPairStats?.notes).toContain("Journal-facing stats pending");
    expect(turkish?.mainPairStats?.notes).toContain("Journal-facing stats pending");
    expect(german?.mainPairStats).toBeUndefined();
  });

  it("defines four-run series stats shape without importing registry numbers yet", () => {
    const baseStats: BatteryBracketStatsV0_1 = {
      source: "evidence-pack",
      seriesLabel: "fixture-series",
      evidenceZipFilename: "fixture.zip",
      marginPermutation: {
        observedMinGap: null,
        pValue: null,
        iters: null,
        seed: null
      },
      effectSizes: {
        hedgesGLowX: null,
        hedgesGXHigh: null
      },
      bootstrap: {
        ci95GapLow: null,
        ci95GapHigh: null,
        ci95NormalizedPosition: null,
        iters: null,
        seed: null
      },
      notes: "base fixture"
    };

    const seriesStats: BatteryFourRunSeriesStatsV0_1 = {
      source: "evidence-pack",
      seriesLabel: "t5-et-ae-v1-v3-exp-v0.2",
      evidenceZipFilename:
        "evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1.zip",
      inspectedManifestPath: "docs/evals/inspected-battery-packs-v0.1.md",
      intended: {
        bracketId: "V1-V3",
        main: { ...baseStats, notes: "intended-main fixture" },
        alt: { ...baseStats, notes: "intended-alt fixture" }
      },
      control: {
        bracketId: "V2-V3",
        main: { ...baseStats, notes: "control-main fixture" },
        alt: { ...baseStats, notes: "control-alt fixture" }
      },
      notes: "shape fixture only"
    };

    expect(seriesStats.source).toBe("evidence-pack");
    expect(seriesStats.intended.bracketId).toBe("V1-V3");
    expect(seriesStats.control.bracketId).toBe("V2-V3");
    expect(seriesStats.intended.main.notes).toBe("intended-main fixture");
    expect(seriesStats.control.alt.notes).toBe("control-alt fixture");

    const finnish = getBatteryCaseById("fi-ae");
    expect(finnish?.seriesStats).toBeUndefined();
  });

  it("imports Estonian four-run series stats from inspected manifest values", () => {
    const estonian = getBatteryCaseById("et-ae");

    expect(estonian?.seriesStats?.source).toBe("evidence-pack");
    expect(estonian?.seriesStats?.seriesLabel).toBe("t5-et-ae-v1-v3-exp-v0.2");
    expect(estonian?.seriesStats?.evidenceZipFilename).toBe(
      "evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1.zip",
    );
    expect(estonian?.seriesStats?.inspectedManifestPath).toBe(
      "docs/evals/inspected-battery-packs-v0.1.md",
    );

    expect(estonian?.seriesStats?.intended.bracketId).toBe("V1-V3");
    expect(estonian?.seriesStats?.control.bracketId).toBe("V2-V3");

    expect(estonian?.seriesStats?.intended.main.marginPermutation.pValue).toBe(
      0.0025833333333333333,
    );
    expect(estonian?.seriesStats?.intended.alt.marginPermutation.pValue).toBe(
      0.05316666666666667,
    );
    expect(estonian?.seriesStats?.control.main.marginPermutation.pValue).toBe(
      0.9974166666666666,
    );
    expect(estonian?.seriesStats?.control.alt.marginPermutation.pValue).toBe(
      0.99975,
    );

    expect(estonian?.seriesStats?.intended.main.effectSizes.hedgesGLowX).toBe(
      0.5545588905459405,
    );
    expect(estonian?.seriesStats?.intended.alt.effectSizes.hedgesGXHigh).toBe(
      3.228770024675538,
    );
    expect(estonian?.seriesStats?.control.main.effectSizes.hedgesGLowX).toBe(
      -1.2548084847778591,
    );
    expect(estonian?.seriesStats?.control.alt.effectSizes.hedgesGLowX).toBe(
      -1.5256813128871087,
    );

    expect(
      estonian?.seriesStats?.intended.main.bootstrap.ci95NormalizedPosition,
    ).toEqual([0.01687618549916784, 0.25953006089362474]);
    expect(
      estonian?.seriesStats?.intended.alt.bootstrap.ci95NormalizedPosition,
    ).toEqual([-0.10315486549358109, 0.1923810142806043]);
    expect(
      estonian?.seriesStats?.control.main.bootstrap.ci95NormalizedPosition,
    ).toEqual([-0.9694656488549633, -0.3360955329356846]);
    expect(
      estonian?.seriesStats?.control.alt.bootstrap.ci95NormalizedPosition,
    ).toEqual([-1.3543749569648162, -0.49355045311160994]);

    expect(estonian?.seriesStats?.intended.main.notes).toContain(
      "runs/t5.et.ae.v1-v3.exp.main.r01/report.json",
    );
    expect(estonian?.seriesStats?.intended.alt.notes).toContain(
      "runs/t5.et.ae.v1-v3.exp.alt.r02/report.json",
    );
    expect(estonian?.seriesStats?.control.main.notes).toContain(
      "runs/t5.et.ae.v2-v3.exp.ctrl.r03/report.json",
    );
    expect(estonian?.seriesStats?.control.alt.notes).toContain(
      "runs/t5.et.ae.v2-v3.exp.ctrl-alt.r04/report.json",
    );

    expect(estonian?.seriesStats?.intended.main.marginPermutation.observedMinGap).toBeNull();
    expect(estonian?.seriesStats?.intended.main.bootstrap.ci95GapLow).toBeNull();
    expect(estonian?.seriesStats?.intended.main.bootstrap.ci95GapHigh).toBeNull();
  });

  it("groups sections and statuses correctly", () => {
    expect(getBatteryCasesBySection("core")).toHaveLength(4);
    expect(getBatteryCasesBySection("expansion")).toHaveLength(4);
    expect(getBatteryCasesBySection("pressure")).toHaveLength(1);

    expect(getSupportCases()).toHaveLength(7);
    expect(getMixedCases()).toHaveLength(1);
    expect(getPressureCases()).toHaveLength(1);
  });
});
