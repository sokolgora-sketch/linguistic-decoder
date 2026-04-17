import { describe, expect, it } from "@jest/globals";
import JSZip from "jszip";

import { buildEvalsSeriesEvidencePackZipArrayBufferV0_1 } from "@/ui/evals/evalsEvidencePackExport.v0.1";

function makeReport(runId: string, vowel: string, anchorLow: string, anchorHigh: string, normalizedPosition: number): any {
  return {
    evalReportVersion: "evalReport.v0.1",
    evalSpecVersion: "evalSpec.v0.1",
    specId: "public-grounding-probe.v0.1",
    runId,
    tasks: [
      {
        taskId: "T5_INTERMEDIATE_V0_1",
        kind: "byo",
        title: "Intermediate Position Test",
        languageHint: runId.includes(".pt.") ? "pt" : "fi",
        targetBuckets: ["anchor_low", "x_vowel", "anchor_high"],
        nPerBucket: 10,
        buckets: [],
        slope_aperturePrimary: null,
        slope_aperturePresenceMean: null,
        intermediate_aperturePresenceMean: {
          scoreKey: "aperturePresenceMean",
          vowelUnderTest: vowel,
          anchorLow,
          anchorHigh,
          mean_anchor_low: 0.9,
          mean_x_vowel: 0.7,
          mean_anchor_high: 0.2,
          gap_low: 0.2,
          gap_high: 0.5,
          normalizedPosition,
          verdict: "INTERMEDIATE",
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
  };
}

describe("Evals series evidence pack export v0.1", () => {
  it("builds a multi-run series evidence zip", async () => {
    const zipBytes = await buildEvalsSeriesEvidencePackZipArrayBufferV0_1({
      seriesId: "series-fi-pt",
      seriesLabel: "t5-falsification-2026-04",
      targetCount: 2,
      exportedAtUtc: "2026-04-17T00:00:00.000Z",
      runs: [
        {
          ordinal: 1,
          runId: "t5.fi.ae.v1-v3.pilot.main.r04",
          runJson: { runId: "t5.fi.ae.v1-v3.pilot.main.r04" },
          report: makeReport("t5.fi.ae.v1-v3.pilot.main.r04", "ä", "V1", "V3", 0.185),
          reportMd: "# fi report\n",
          pdfBytes: new Uint8Array([37, 80, 68, 70]),
          workbookBytes: new Uint8Array([80, 75, 3, 4]),
          summaryCsv: "Run Summary\n",
        },
        {
          ordinal: 2,
          runId: "t5.pt.aa.v1-v4.pilot.main.r01",
          runJson: { runId: "t5.pt.aa.v1-v4.pilot.main.r01" },
          report: makeReport("t5.pt.aa.v1-v4.pilot.main.r01", "â", "V1", "V4", 0.728),
          reportMd: "# pt report\n",
          pdfBytes: new Uint8Array([37, 80, 68, 70]),
          workbookBytes: new Uint8Array([80, 75, 3, 4]),
          summaryCsv: "Run Summary\n",
        },
      ],
    });

    const zip = await JSZip.loadAsync(zipBytes);

    expect(zip.file("00_README.md")).toBeTruthy();
    expect(zip.file("01_RUN_INDEX.md")).toBeTruthy();
    expect(zip.file("series-summary.csv")).toBeTruthy();

    expect(zip.file("runs/t5.fi.ae.v1-v3.pilot.main.r04/input.json")).toBeTruthy();
    expect(zip.file("runs/t5.fi.ae.v1-v3.pilot.main.r04/report.pdf")).toBeTruthy();
    expect(zip.file("runs/t5.pt.aa.v1-v4.pilot.main.r01/input.json")).toBeTruthy();
    expect(zip.file("runs/t5.pt.aa.v1-v4.pilot.main.r01/report.pdf")).toBeTruthy();

    const readme = await zip.file("00_README.md")?.async("string");
    const index = await zip.file("01_RUN_INDEX.md")?.async("string");
    const summary = await zip.file("series-summary.csv")?.async("string");

    expect(readme).toContain("ZË-RO Series Evidence Pack");
    expect(readme).toContain("scoredRunCount: 2");
    expect(index).toContain("t5.fi.ae.v1-v3.pilot.main.r04");
    expect(index).toContain("ä | V1–V3 | INTERMEDIATE");
    expect(index).toContain("t5.pt.aa.v1-v4.pilot.main.r01");
    expect(index).toContain("â | V1–V4 | INTERMEDIATE");
    expect(summary).toContain("ordinal,runId,taskId,language,vowel,anchorLow,anchorHigh,verdict");
    expect(summary).toContain("1,t5.fi.ae.v1-v3.pilot.main.r04,T5_INTERMEDIATE_V0_1,fi,ä,V1,V3,INTERMEDIATE");
    expect(summary).toContain("2,t5.pt.aa.v1-v4.pilot.main.r01,T5_INTERMEDIATE_V0_1,pt,â,V1,V4,INTERMEDIATE");
  });
});
