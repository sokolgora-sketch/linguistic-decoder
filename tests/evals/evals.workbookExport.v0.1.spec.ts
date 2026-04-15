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

const T5_MARKDOWN = `# ZË-RO Evals Report v0.1

- taskId: T5_INTERMEDIATE_V0_1
- runId: workbook.smoke.t5.fi.ae.v1-v3.r01
- provider: not set
- model: not set
- label: not set

## T5_INTERMEDIATE_V0_1 — Intermediate Position Test

- kind: byo
- languageHint: fi
- targetBuckets: anchor_low, x_vowel, anchor_high
- nPerBucket: 10

### Buckets

| Bucket | expectedN | providedN | validN | invalidN | dupN | mean(primary) | mean(presenceMean) |
|---|---:|---:|---:|---:|---:|---:|---:|
| anchor_low | 10 | 30 | 30 | 0 | 0 | 1.000 | 0.990 |
| x_vowel | 10 | 30 | 30 | 0 | 0 | 0.900 | 0.735 |
| anchor_high | 10 | 30 | 30 | 0 | 0 | 0.583 | 0.441 |

### Intermediate Position — aperturePresenceMean

- vowelUnderTest: ä
- anchorLow: V1
- anchorHigh: V3
- mean(anchor_low): 0.990
- mean(x_vowel): 0.735
- mean(anchor_high): 0.441
- gap_low: 0.255
- gap_high: 0.294
- normalizedPosition: 0.464 (0=collapsed to low, 1=collapsed to high, 0.5=midpoint)
- verdict: INTERMEDIATE
- diagnostic flags: (none)
`;

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
      md: "# report\\n\\n- verdict: INTERMEDIATE",
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

  it("populates T5 summary and bucket stats from markdown fallback", async () => {
    const bytes = await buildEvalsWorkbookArrayBufferV0_1({
      exportedAtUtc: "2026-04-13T00:00:00.000Z",
      runId: "workbook.smoke.t5.fi.ae.v1-v3.r01",
      report: {
        runId: "workbook.smoke.t5.fi.ae.v1-v3.r01",
        meta: {},
        tasks: [{ kind: "byo", taskId: "T5_INTERMEDIATE_V0_1" }],
      } as any,
      md: T5_MARKDOWN,
    });

    const wb = await readWorkbook(bytes);
    const runSummary = wb.getWorksheet("Run Summary");
    const bucketStats = wb.getWorksheet("Bucket Stats");

    expect(runSummary?.getCell("C13").value).toBe("fi");
    expect(runSummary?.getCell("C14").value).toBe("ä");
    expect(runSummary?.getCell("C15").value).toBe("V1");
    expect(runSummary?.getCell("C16").value).toBe("V3");
    expect(runSummary?.getCell("C17").value).toBe("INTERMEDIATE");
    expect(runSummary?.getCell("C18").value).toBe(0.464);
    expect(runSummary?.getCell("C19").value).toBe(0.255);
    expect(runSummary?.getCell("C20").value).toBe(0.294);
    expect(runSummary?.getCell("C21").value).toBe(0.99);
    expect(runSummary?.getCell("C22").value).toBe(0.735);
    expect(runSummary?.getCell("C23").value).toBe(0.441);

    expect(bucketStats?.getCell("A2").value).toBe("anchor_low");
    expect(bucketStats?.getCell("H2").value).toBe(0.99);
    expect(bucketStats?.getCell("A3").value).toBe("x_vowel");
    expect(bucketStats?.getCell("H3").value).toBe(0.735);
    expect(bucketStats?.getCell("A4").value).toBe("anchor_high");
    expect(bucketStats?.getCell("H4").value).toBe(0.441);
  });
});
