import { describe, expect, it } from "@jest/globals";
import ExcelJS from "exceljs/dist/exceljs.min.js";

import {
  buildEvalsWorkbookArrayBufferV0_1,
  EVALS_WORKBOOK_EXPORT_VERSION_V0_1,
} from "@/ui/evals/evalsWorkbookExport.v0.1";

async function readWorkbook(bytes: ArrayBuffer): Promise<ExcelJS.Workbook> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(bytes);
  return wb;
}

describe("evals workbook export v0.1", () => {
  it("builds a deterministic xlsx workbook payload", async () => {
    const bytes = await buildEvalsWorkbookArrayBufferV0_1({
      exportedAtUtc: "2026-04-13T00:00:00.000Z",
      runId: "t5.test.run",
      report: {
        runId: "t5.test.run",
        meta: { provider: "manual", model: "pilot", label: "test" },
        tasks: [
          {
            kind: "byo",
            taskId: "T5_INTERMEDIATE_V0_1",
            languageHint: "fi",
            vowelUnderTest: "ä",
            anchorLow: "V1",
            anchorHigh: "V3",
            intermediatePosition: {
              aperturePresenceMean: {
                verdict: "INTERMEDIATE",
                normalizedPosition: 0.446,
                gap_low: 0.247,
                gap_high: 0.306,
                diagnosticFlags: [],
              },
            },
            buckets: [
              {
                bucket: "anchor_low",
                expectedN: 10,
                providedN: 30,
                validN: 30,
                invalidN: 0,
                dupN: 0,
                meanPresenceMean: 0.99,
              },
            ],
          },
        ],
      } as any,
      md: "# report\n\n- verdict: INTERMEDIATE",
    });

    const wb = await readWorkbook(bytes);
    expect(wb.worksheets.map((ws) => ws.name)).toEqual([
      "Run Summary",
      "Bucket Stats",
      "Pilot Planner",
      "Pilot Summary",
      "Raw Report",
    ]);

    const runSummary = wb.getWorksheet("Run Summary");
    const bucketStats = wb.getWorksheet("Bucket Stats");
    const planner = wb.getWorksheet("Pilot Planner");
    const summary = wb.getWorksheet("Pilot Summary");

    expect(runSummary?.getCell("C2").value).toBe(EVALS_WORKBOOK_EXPORT_VERSION_V0_1);
    expect(runSummary?.getCell("C11").value).toBe("T5_INTERMEDIATE_V0_1");
    expect(bucketStats?.getCell("A2").value).toBe("anchor_low");
    expect(planner?.getCell("H4").value).toBe("t5.fi.ae.v1-v3.pilot.main.r01");
    expect(summary?.getCell("B6").value).toBe("SOFT_COLLAPSE_HIGH_CONTROL");
  });
});
