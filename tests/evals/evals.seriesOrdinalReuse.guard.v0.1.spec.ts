import { readFileSync } from "node:fs";

describe("series ordinal reuse guard v0.1", () => {
  it("uses the lowest missing ordinal and requires exact target ordinals for export readiness", () => {
    const src = readFileSync("src/ui/evals/EvalsPageClient.v0.1.tsx", "utf8");

    expect(src).toContain("function findNextAvailableSeriesOrdinal(");
    expect(src).toContain("for (let n = 1; n <= series.targetCount; n += 1)");
    expect(src).toContain("const saveOrdinal = findNextAvailableSeriesOrdinal(series)");
    expect(src).toContain("if (saveOrdinal > series.targetCount)");
    expect(src).toContain("const rowsAfterSave = [savedRecord, ...savedRuns]");
    expect(src).toContain("activeSeriesSavedCount === activeRunSeries!.targetCount");
    expect(src).toContain("activeSeriesScoredCount === activeRunSeries!.targetCount");
    expect(src).toContain("activeSeriesMissingOrdinals.length === 0");
    expect(src).toContain("activeSeriesOutOfRangeOrdinals.length === 0");
    expect(src).toContain("activeSeriesHasOrdinalRangeIssue");
    expect(src).toContain("const activeSeriesNextOrdinalValue = activeRunSeries");
    expect(src).toContain("findNextAvailableSeriesOrdinal(activeRunSeries, activeSeriesSavedRuns)");
    expect(src).toContain("applySeriesRunIdTemplate(activeRunSeries.runIdTemplate, activeSeriesNextOrdinalValue)");
    expect(src).toContain("makeSeriesLabel(activeRunSeries.label, activeSeriesNextOrdinalValue)");
    expect(src).toContain("savedRuns.filter((row) => row.seriesId === series.id)");
  });
});
