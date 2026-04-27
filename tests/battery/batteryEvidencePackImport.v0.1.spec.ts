import { describe, expect, it } from "@jest/globals";

import { parseBatteryEvidencePackStatsV0_1 } from "@/lib/battery/batteryEvidencePackImport.v0.1";
import { buildEvalsSeriesEvidencePackZipArrayBufferV0_1 } from "@/ui/evals/evalsEvidencePackExport.v0.1";

function makeReport(
  runId: string,
  languageHint: string,
  vowel: string,
  anchorLow: string,
  anchorHigh: string,
  pValue: number,
  normalizedPosition: number,
): any {
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
        languageHint,
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
          mean_anchor_low: 0.917,
          mean_x_vowel: 0.78,
          mean_anchor_high: 0.177,
          gap_low: 0.137,
          gap_high: 0.603,
          normalizedPosition,
          verdict: "INTERMEDIATE",
          ordinalPermutation: {
            observed_order: true,
            p_value: 0.167,
            iters: 12000,
            seed: 85605032,
          },
          marginPermutation: {
            observed_min_gap: 0.137,
            p_value: pValue,
            iters: 12000,
            seed: 85605032,
          },
          effectSizes: {
            hedges_g_low_x: 0.733,
            hedges_g_x_high: 3.263,
          },
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
      reason: "fixture",
      threshold: 0.1,
      failingCount: 0,
      missingCount: 0,
      tasks: [],
    },
  };
}

describe("batteryEvidencePackImport.v0.1", () => {
  it("extracts battery stats from per-run report.json artifacts in a series evidence ZIP", async () => {
    const zipBytes = await buildEvalsSeriesEvidencePackZipArrayBufferV0_1({
      seriesId: "series-fi-et",
      seriesLabel: "t5-fi-et-fixture",
      targetCount: 2,
      exportedAtUtc: "2026-04-27T00:00:00.000Z",
      runs: [
        {
          ordinal: 1,
          runId: "t5.fi.ae.v1-v3.pilot.main.r04",
          runJson: { runId: "t5.fi.ae.v1-v3.pilot.main.r04" },
          report: makeReport(
            "t5.fi.ae.v1-v3.pilot.main.r04",
            "fi",
            "ä",
            "V1",
            "V3",
            0.001,
            0.185,
          ),
          reportMd: "# fi report\n",
          pdfBytes: new Uint8Array([37, 80, 68, 70]),
          workbookBytes: new Uint8Array([80, 75, 3, 4]),
          summaryCsv: "Run Summary\n",
        },
        {
          ordinal: 2,
          runId: "t5.et.ae.v1-v3.pilot.main.r01",
          runJson: { runId: "t5.et.ae.v1-v3.pilot.main.r01" },
          report: makeReport(
            "t5.et.ae.v1-v3.pilot.main.r01",
            "et",
            "ä",
            "V1",
            "V3",
            0.002,
            0.218,
          ),
          reportMd: "# et report\n",
          pdfBytes: new Uint8Array([37, 80, 68, 70]),
          workbookBytes: new Uint8Array([80, 75, 3, 4]),
          summaryCsv: "Run Summary\n",
        },
      ],
    });

    const parsed = await parseBatteryEvidencePackStatsV0_1({
      zipBytes,
      seriesLabel: "t5-fi-et-fixture",
      evidenceZipFilename: "evals.series-evidence-pack.t5-fi-et-fixture.v0.1.zip",
    });

    expect(parsed).toHaveLength(2);

    expect(parsed[0]).toMatchObject({
      reportPath: "runs/t5.et.ae.v1-v3.pilot.main.r01/report.json",
      runId: "t5.et.ae.v1-v3.pilot.main.r01",
      hasImportedStats: true,
    });
    expect(parsed[0]?.stats.marginPermutation.pValue).toBe(0.002);
    expect(parsed[0]?.stats.bootstrap.ci95NormalizedPosition).toEqual([0.063, 0.296]);
    expect(parsed[0]?.stats.notes).toBe(
      "source:runs/t5.et.ae.v1-v3.pilot.main.r01/report.json",
    );

    expect(parsed[1]).toMatchObject({
      reportPath: "runs/t5.fi.ae.v1-v3.pilot.main.r04/report.json",
      runId: "t5.fi.ae.v1-v3.pilot.main.r04",
      hasImportedStats: true,
    });
    expect(parsed[1]?.stats.marginPermutation.pValue).toBe(0.001);
    expect(parsed[1]?.stats.effectSizes.hedgesGXHigh).toBe(3.263);
  });
});
