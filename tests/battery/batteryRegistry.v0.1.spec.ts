import {
  BATTERY_CASES,
  BRACKETS,
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

  it("groups sections and statuses correctly", () => {
    expect(getBatteryCasesBySection("core")).toHaveLength(4);
    expect(getBatteryCasesBySection("expansion")).toHaveLength(4);
    expect(getBatteryCasesBySection("pressure")).toHaveLength(1);

    expect(getSupportCases()).toHaveLength(7);
    expect(getMixedCases()).toHaveLength(1);
    expect(getPressureCases()).toHaveLength(1);
  });
});
