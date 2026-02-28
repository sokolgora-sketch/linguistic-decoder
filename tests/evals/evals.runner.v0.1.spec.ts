import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";

import { EVAL_SPEC_V0_1 } from "@/shared/evals/spec.v0.1";
import { parseEvalRunBundleV0_1 } from "@/shared/evals/run.v0.1";
import { scoreEvalRunBundleV0_1 } from "@/shared/evals/scoreEvalRun.v0.1";
import { renderEvalReportMdV0_1 } from "@/shared/evals/renderEvalReportMd.v0.1";

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

    const outDir = path.join(root, "tests/validation/out");
    ensureDir(outDir);

    const outBase = `evals.${report.specId}.${report.runId}.v0.1`;
    const outMd = path.join(outDir, `${outBase}.md`);
    const outJson = path.join(outDir, `${outBase}.json`);

    fs.writeFileSync(outMd, md, "utf8");
    fs.writeFileSync(outJson, json, "utf8");

    const baseDir = path.join(root, "tests/validation/baselines");
    ensureDir(baseDir);

    const baseMd = path.join(baseDir, `${outBase}.md`);
    const baseJson = path.join(baseDir, `${outBase}.json`);

    const ready = baselineReadyReport(report);

    if (!ready) {
      // still useful to have out artifacts; baselines remain unchanged
      expect(fs.existsSync(outMd)).toBe(true);
      expect(fs.existsSync(outJson)).toBe(true);
      return;
    }

    // If baselines exist, compare; otherwise write once (bootstrap).
    if (fs.existsSync(baseMd) && fs.existsSync(baseJson)) {
      const md0 = fs.readFileSync(baseMd, "utf8");
      const j0 = fs.readFileSync(baseJson, "utf8");
      expect(md).toBe(md0);
      expect(json).toBe(j0);
    } else {
      fs.writeFileSync(baseMd, md, "utf8");
      fs.writeFileSync(baseJson, json, "utf8");
      expect(fs.existsSync(baseMd)).toBe(true);
      expect(fs.existsSync(baseJson)).toBe(true);
    }
  });
});
