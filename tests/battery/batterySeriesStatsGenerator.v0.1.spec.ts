import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import JSZip from "jszip";

function tsxBin(): string {
  return join(
    process.cwd(),
    "node_modules",
    ".bin",
    process.platform === "win32" ? "tsx.cmd" : "tsx",
  );
}

function makeReport(runId: string, pValue: number, hedgesGLowX: number, hedgesGXHigh: number, ci95NormalizedPosition: [number, number]) {
  return {
    runId,
    tasks: [
      {
        taskId: "T5_INTERMEDIATE_V0_1",
        kind: "byo",
        intermediate_aperturePresenceMean: {
          marginPermutation: {
            observed_min_gap: 0.123,
            p_value: pValue,
            iters: 12000,
            seed: 85605032,
          },
          effectSizes: {
            hedges_g_low_x: hedgesGLowX,
            hedges_g_x_high: hedgesGXHigh,
          },
          bootstrap: {
            ci95_gap_low: [0.01, 0.02],
            ci95_gap_high: [0.03, 0.04],
            ci95_normalizedPosition: ci95NormalizedPosition,
            iters: 12000,
            seed: 85605032,
          },
        },
      },
    ],
  };
}

async function writeFixtureZip(path: string): Promise<void> {
  const zip = new JSZip();

  const reports = [
    makeReport("t5.et.ae.v1-v3.exp.main.r01", 0.0025833333333333333, 0.5545588905459405, 3.3788729357208416, [0.01687618549916784, 0.25953006089362474]),
    makeReport("t5.et.ae.v1-v3.exp.alt.r02", 0.05316666666666667, 0.18585610045242854, 3.228770024675538, [-0.10315486549358109, 0.1923810142806043]),
    makeReport("t5.et.ae.v2-v3.exp.ctrl.r03", 0.9974166666666666, -1.2548084847778591, 3.3788729357208416, [-0.9694656488549633, -0.3360955329356846]),
    makeReport("t5.et.ae.v2-v3.exp.ctrl-alt.r04", 0.99975, -1.5256813128871087, 3.228770024675538, [-1.3543749569648162, -0.49355045311160994]),
  ];

  for (const report of reports) {
    zip.file(`runs/${report.runId}/report.json`, JSON.stringify(report, null, 2));
  }

  const bytes = await zip.generateAsync({ type: "nodebuffer" });
  writeFileSync(path, bytes);
}

describe("generate-battery-series-stats.v0.1", () => {
  it("prints a reviewable four-run seriesStats block from explicit run roles", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "battery-series-generator-"));
    const zipPath = join(tmp, "evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1.zip");

    try {
      await writeFixtureZip(zipPath);

      const stdout = execFileSync(
        tsxBin(),
        [
          "scripts/generate-battery-series-stats.v0.1.ts",
          "--zip",
          zipPath,
          "--case-id",
          "et-ae",
          "--inspected-manifest-path",
          "docs/evals/inspected-battery-packs-v0.1.md",
          "--intended-main-run-id",
          "t5.et.ae.v1-v3.exp.main.r01",
          "--intended-alt-run-id",
          "t5.et.ae.v1-v3.exp.alt.r02",
          "--control-main-run-id",
          "t5.et.ae.v2-v3.exp.ctrl.r03",
          "--control-alt-run-id",
          "t5.et.ae.v2-v3.exp.ctrl-alt.r04",
        ],
        { encoding: "utf8" },
      );

      expect(stdout).toContain("seriesStats: {");
      expect(stdout).toContain("\n    main: {");
      expect(stdout).toContain("\n    alt: {");
      expect(stdout).not.toContain("\n        main: {");
      expect(stdout).not.toContain("\n        alt: {");
      expect(stdout).not.toContain("main:       {");
      expect(stdout).not.toContain("alt:       {");
      expect(stdout).toContain('seriesLabel: "t5-et-ae-v1-v3-exp-v0.2"');
      expect(stdout).toContain('bracketId: "V1-V3"');
      expect(stdout).toContain('bracketId: "V2-V3"');
      expect(stdout).toContain("pValue: 0.0025833333333333333");
      expect(stdout).toContain("pValue: 0.99975");
      expect(stdout).toContain("hedgesGLowX: -1.5256813128871087");
      expect(stdout).toContain("ci95NormalizedPosition: [-1.3543749569648162, -0.49355045311160994]");
      expect(stdout).toContain("role:intended-main; source:runs/t5.et.ae.v1-v3.exp.main.r01/report.json");
      expect(stdout).toContain("role:control-alt; source:runs/t5.et.ae.v2-v3.exp.ctrl-alt.r04/report.json");
      expect(stdout).toContain("docs/evals/inspected-battery-packs-v0.1.md");
    } finally {
      rmSync(tmp, { force: true, recursive: true });
    }
  });

  it("fails when an explicit role run id is missing from the pack", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "battery-series-generator-missing-"));
    const zipPath = join(tmp, "fixture.zip");

    try {
      await writeFixtureZip(zipPath);

      expect(() =>
        execFileSync(
          tsxBin(),
          [
            "scripts/generate-battery-series-stats.v0.1.ts",
            "--zip",
            zipPath,
            "--case-id",
            "et-ae",
            "--intended-main-run-id",
            "missing-main-run",
            "--intended-alt-run-id",
            "t5.et.ae.v1-v3.exp.alt.r02",
            "--control-main-run-id",
            "t5.et.ae.v2-v3.exp.ctrl.r03",
            "--control-alt-run-id",
            "t5.et.ae.v2-v3.exp.ctrl-alt.r04",
          ],
          { encoding: "utf8", stdio: "pipe" },
        ),
      ).toThrow(/Could not find intended-main runId/);
    } finally {
      rmSync(tmp, { force: true, recursive: true });
    }
  });
});
