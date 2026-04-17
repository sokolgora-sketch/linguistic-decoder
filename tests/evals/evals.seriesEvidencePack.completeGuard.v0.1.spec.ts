import { readFileSync } from "node:fs";

describe("series evidence pack complete guard v0.1", () => {
  it("blocks series evidence export unless active series is fully export-ready", () => {
    const src = readFileSync("src/ui/evals/EvalsPageClient.v0.1.tsx", "utf8");

    expect(src).toContain("async function onDownloadSeriesEvidencePack()");
    expect(src).toContain("if (!activeSeriesExportReady)");
    expect(src).toContain("complete and clean the active series first");
    expect(src).toContain("activeSeriesExportSummary");
    expect(src).toContain("disabled={busy || !selectedSeriesId || !activeSeriesExportReady}");
  });
});
