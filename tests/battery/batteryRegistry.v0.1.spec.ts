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

    const estonian = getBatteryCaseById("et-ae");
    expect(estonian?.seriesStats).toBeUndefined();
    expect(estonian?.mainPairStats).toBeUndefined();
    expect(estonian?.controlPairStats).toBeUndefined();
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
