import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";

import { EVAL_SPEC_V0_1 } from "@/shared/evals/spec.v0.1";
import { parseEvalRunBundleV0_1 } from "@/shared/evals/run.v0.1";
import { scoreEvalRunBundleV0_1 } from "@/shared/evals/scoreEvalRun.v0.1";
import { renderEvalReportMdV0_1 } from "@/shared/evals/renderEvalReportMd.v0.1";
import { withEvalsArtifactWriteLockV0_1 } from "./evalsArtifactWriteLock.v0.1";

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

function baselineReadyTask(t: any): boolean {
  const targetBuckets = Array.isArray(t.targetBuckets) ? t.targetBuckets : [];
  const bucketSet = new Set(targetBuckets);

  const buckets = Array.isArray(t.buckets) ? t.buckets : [];
  for (const b of buckets) {
    if (!bucketSet.has(b.bucket)) continue;
    if (b.validN < b.expectedN) return false;
    if (b.invalidN !== 0) return false;
    if (b.duplicateN !== 0) return false;
  }

  const d = t.diagnostics;
  if (d?.missingBuckets?.length) return false;
  if ((d?.totalInvalidTokenCount ?? 0) !== 0) return false;

  // slope only meaningful when >=2 buckets
  if (targetBuckets.length >= 2) {
    if (!t.slope_aperturePrimary) return false;
    if (!t.slope_aperturePresenceMean) return false;
  }

  return true;
}

function baselineReadyReport(report: any): boolean {
  const tasks = Array.isArray(report.tasks) ? report.tasks : [];
  return tasks.length > 0 && tasks.every((t) => baselineReadyTask(t));
}

describe("Evals runner v0.1 — baseline lock (out + baselines)", () => {
  it("writes out report; compares to committed baselines when complete", () => {
    const root = process.cwd();

    const runPath = path.join(
      root,
      "tests/evals/runs/evalRun.public-grounding-probe.v0.1.gold.synthetic.full.v0.1.json"
    );

    const rawRun = JSON.parse(fs.readFileSync(runPath, "utf8"));
    const run = parseEvalRunBundleV0_1(rawRun);

    const report = scoreEvalRunBundleV0_1({ spec: EVAL_SPEC_V0_1, run });

    // extra safety: derived negative control must not be significant
    const derived = report.tasks.find((t) => t.kind === "derived");
    if (derived?.slope_aperturePresenceMean) {
      expect(derived.slope_aperturePresenceMean.p_spearman).toBeGreaterThanOrEqual(0.1);
      expect(derived.slope_aperturePresenceMean.p_pearson).toBeGreaterThanOrEqual(0.1);
    }

    const md = renderEvalReportMdV0_1(report);
    const json = JSON.stringify(report, null, 2) + "\n";

    const outBase = `evals.${report.specId}.${report.runId}.v0.1`;
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, `${outBase}.md`);
    const outJson = path.join(outDir, `${outBase}.json`);
    const baseDir = path.join(root, "tests/validation/baselines");
    const baseMd = path.join(baseDir, `${outBase}.md`);
    const baseJson = path.join(baseDir, `${outBase}.json`);
    const ready = baselineReadyReport(report);

    withEvalsArtifactWriteLockV0_1(root, () => {
      ensureDir(outDir);
      fs.writeFileSync(outMd, md, "utf8");
      fs.writeFileSync(outJson, json, "utf8");

      if (!ready) {
        // still useful to have out artifacts; baselines remain unchanged
        expect(fs.existsSync(outMd)).toBe(true);
        expect(fs.existsSync(outJson)).toBe(true);
        return;
      }

      ensureDir(baseDir);
      const hasMd = fs.existsSync(baseMd);
      const hasJson = fs.existsSync(baseJson);
      if (hasMd !== hasJson) {
        throw new Error(`Incomplete committed baseline pair for ${outBase}; refusing to write either file.`);
      }
      if (!hasMd) {
        const allowWrite = (process.env.EVALS_WRITE_BASELINES ?? "").trim() === "1";
        if (!allowWrite) {
          throw new Error(
            [
              `Missing baselines for: ${outBase}`,
              `Expected:`,
              `- ${baseMd}`,
              `- ${baseJson}`,
              `To bootstrap explicitly, set EVALS_WRITE_BASELINES=1 after reviewing the generated reports.`,
            ].join("\n")
          );
        }

        fs.writeFileSync(baseMd, md, "utf8");
        fs.writeFileSync(baseJson, json, "utf8");
        expect(fs.existsSync(baseMd)).toBe(true);
        expect(fs.existsSync(baseJson)).toBe(true);
        return;
      }

      expect(fs.existsSync(baseMd)).toBe(true);
      expect(fs.existsSync(baseJson)).toBe(true);
      const md0 = fs.readFileSync(baseMd, "utf8");
      const j0 = fs.readFileSync(baseJson, "utf8");
      expect(md).toBe(md0);
      expect(json).toBe(j0);
    });
  });
});
