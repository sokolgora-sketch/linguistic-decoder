import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "@jest/globals";

import { buildEvalsSeriesEvidencePackZipArrayBufferV0_1 } from "@/ui/evals/evalsEvidencePackExport.v0.1";

function makeReportV0_1(runId: string): unknown {
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
          ordinalPermutation: {
            observed_order: true,
            p_value: 0.167,
            iters: 12000,
            seed: 85605032,
          },
          marginPermutation: {
            observed_min_gap: 0.137,
            p_value: 0.001,
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

describe("inspect-battery-evidence-pack.v0.1", () => {
  it("prints parsed stats from an exported evidence ZIP", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "zero-battery-inspect-"));

    try {
      const zipBytes = await buildEvalsSeriesEvidencePackZipArrayBufferV0_1({
        seriesId: "fixture-series",
        seriesLabel: "fixture-series",
        targetCount: 1,
        exportedAtUtc: "2026-04-27T00:00:00.000Z",
        runs: [
          {
            ordinal: 1,
            runId: "t5.fi.ae.v1-v3.fixture.r01",
            runJson: { runId: "t5.fi.ae.v1-v3.fixture.r01" },
            report: makeReportV0_1("t5.fi.ae.v1-v3.fixture.r01"),
            reportMd: "# fixture report\n",
            pdfBytes: new Uint8Array([37, 80, 68, 70]),
            workbookBytes: new Uint8Array([80, 75, 3, 4]),
            summaryCsv: "Run Summary\n",
          },
        ],
      });

      const zipPath = join(tmp, "evals.series-evidence-pack.fixture-series.v0.1.zip");
      writeFileSync(zipPath, Buffer.from(zipBytes));

      const stdout = execFileSync(
        "node_modules/.bin/tsx",
        [
          "scripts/inspect-battery-evidence-pack.v0.1.ts",
          "--zip",
          zipPath,
          "--series-label",
          "fixture-series",
        ],
        {
          cwd: process.cwd(),
          encoding: "utf8",
        },
      );

      expect(stdout).toContain("# Battery Evidence Pack Stats");
      expect(stdout).toContain("runCount: 1");
      expect(stdout).toContain("t5.fi.ae.v1-v3.fixture.r01");
      expect(stdout).toContain("true");
      expect(stdout).toContain("0.001");
      expect(stdout).toContain("3.263");
      expect(stdout).toContain("[0.063, 0.296]");
    } finally {
      rmSync(tmp, { force: true, recursive: true });
    }
  });
});
