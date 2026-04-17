import { describe, expect, it } from "@jest/globals";
import JSZip from "jszip";

import { buildEvalsEvidencePackZipArrayBufferV0_1 } from "@/ui/evals/evalsEvidencePackExport.v0.1";

describe("Evals evidence pack export v0.1", () => {
  it("builds a single-run evidence zip with paper-auditable files", async () => {
    const zipBytes = await buildEvalsEvidencePackZipArrayBufferV0_1({
      runId: "t5.fi.ae.v1-v3.pilot.main.r03",
      exportedAtUtc: "2026-04-16T12:00:00.000Z",
      runJson: {
        evalRunVersion: "evalRun.v0.1",
        runId: "t5.fi.ae.v1-v3.pilot.main.r03",
        tasks: [{ taskId: "T5_INTERMEDIATE_V0_1" }],
      },
      report: {
        evalReportVersion: "evalReport.v0.1",
        evalSpecVersion: "evalSpec.v0.1",
        specId: "public-grounding-probe.v0.1",
        runId: "t5.fi.ae.v1-v3.pilot.main.r03",
        tasks: [
          {
            taskId: "T5_INTERMEDIATE_V0_1",
            kind: "byo",
            title: "Intermediate Position Test",
            languageHint: "fi",
            targetBuckets: ["anchor_low", "x_vowel", "anchor_high"],
            nPerBucket: 10,
            buckets: [],
            slope_aperturePrimary: null,
            slope_aperturePresenceMean: null,
            intermediate_aperturePresenceMean: {
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
              ordinalPermutation: { observed_order: true, p_value: 0.167, iters: 12000, seed: 85605032 },
              marginPermutation: { observed_min_gap: 0.137, p_value: 0.001, iters: 12000, seed: 85605032 },
              effectSizes: { hedges_g_low_x: 0.733, hedges_g_x_high: 3.263 },
              bootstrap: {
                ci95_gap_low: [0.045, 0.227],
                ci95_gap_high: [0.51, 0.693],
                ci95_normalizedPosition: [0.063, 0.296],
                iters: 12000,
                seed: 85605032,
              },
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
      },
      reportMd: "# ZË-RO Evals Report v0.1\n",
      pdfBytes: new Uint8Array([37, 80, 68, 70]),
      workbookBytes: new Uint8Array([80, 75, 3, 4]),
      summaryCsv: "Run Summary\n",
    });

    const zip = await JSZip.loadAsync(zipBytes);
    const names = Object.keys(zip.files).sort();

    expect(names).toEqual([
      "00_README.md",
      "01_RUN_INDEX.md",
      "runs/",
      "runs/t5.fi.ae.v1-v3.pilot.main.r03/",
      "runs/t5.fi.ae.v1-v3.pilot.main.r03/input.json",
      "runs/t5.fi.ae.v1-v3.pilot.main.r03/notes.md",
      "runs/t5.fi.ae.v1-v3.pilot.main.r03/report.md",
      "runs/t5.fi.ae.v1-v3.pilot.main.r03/report.pdf",
      "runs/t5.fi.ae.v1-v3.pilot.main.r03/summary.csv",
      "runs/t5.fi.ae.v1-v3.pilot.main.r03/workbook.xlsx",
    ]);

    const readme = await zip.file("00_README.md")?.async("string");
    const index = await zip.file("01_RUN_INDEX.md")?.async("string");
    const notes = await zip.file("runs/t5.fi.ae.v1-v3.pilot.main.r03/notes.md")?.async("string");

    expect(readme).toContain("ZË-RO Evidence Pack");
    expect(readme).toContain("There are only seven primal vowel positions");
    expect(index).toContain("t5.fi.ae.v1-v3.pilot.main.r03");
    expect(index).toContain("INTERMEDIATE");
    expect(notes).toContain("gap_low: 0.137");
    expect(notes).toContain("Supports / weakens / challenges: pending researcher review");
  });
});
