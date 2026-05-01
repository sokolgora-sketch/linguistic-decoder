import { readFileSync } from "node:fs";

const src = readFileSync("src/ui/evals/EvalsPageClient.v0.1.tsx", "utf8");

describe("evals saved run restore guard v0.1", () => {
  it("loads a saved run checkpoint back into the workbench form", () => {
    expect(src).toContain("function openSavedRunById(savedRunId: string)");
    expect(src).toContain("setSelectedSavedRunId(selected.id);");
    expect(src).toContain("restoreWorkbench(selected.workbench);");
    expect(src).toContain("setNotice(`Opened saved run: ${selected.title}`);");
  });

  it("restores the linked active series when a saved run belongs to a series", () => {
    expect(src).toContain("if (selected.seriesId) {");
    expect(src).toContain("const series = runSeries.find((row) => row.id === selected.seriesId);");
    expect(src).toContain("setSelectedSeriesId(series.id);");
    expect(src).toContain("setSeriesLabelDraft(series.label);");
    expect(src).toContain("setSeriesTargetCountDraft(String(series.targetCount));");
  });

  it("exposes explicit load behavior in the saved runs card", () => {
    expect(src).toContain("onClick={() => openSavedRunById(row.id)}");
    expect(src).toMatch(/>\s*Load\s*<\/button>/);
    expect(src).not.toContain("onClick={() => setSelectedSavedRunId(row.id)}");
  });
});
