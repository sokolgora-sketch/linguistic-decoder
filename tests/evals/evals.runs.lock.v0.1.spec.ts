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

function fmt(x: number, d = 3): string {
  if (!Number.isFinite(x)) return "NaN";
  return x.toFixed(d);
}

function writeOrCompareBaseline(params: {
  basePathNoExt: string;
  md: string;
  json: string;
}) {
  const { basePathNoExt, md, json } = params;

  const baseMd = basePathNoExt + ".md";
  const baseJson = basePathNoExt + ".json";

  const allowWrite = (process.env.EVALS_WRITE_BASELINES ?? "").trim() === "1";

  const has = fs.existsSync(baseMd) && fs.existsSync(baseJson);

  if (!has) {
    if (!allowWrite) {
      throw new Error(
        [
          `Missing baselines for: ${path.basename(basePathNoExt)}`,
          `Expected:`,
          `- ${baseMd}`,
          `- ${baseJson}`,
          ``,
          `To bootstrap baselines locally, run:`,
          `EVALS_WRITE_BASELINES=1 npm test -- tests/evals/evals.runs.lock.v0.1.spec.ts`,
        ].join("\n")
      );
    }

    fs.writeFileSync(baseMd, md, "utf8");
    fs.writeFileSync(baseJson, json, "utf8");
    return;
  }

  const md0 = fs.readFileSync(baseMd, "utf8");
  const j0 = fs.readFileSync(baseJson, "utf8");

  expect(md).toBe(md0);
  expect(json).toBe(j0);
}

type IndexRow = {
  file: string;
  runId: string;
  provider: string;
  model: string;
  label: string;
  t2_p_spearman: string;
  t2_p_pearson: string;
  t3_p_spearman: string;
  t3_p_pearson: string;
};

function findTask(report: any, prefix: string) {
  const tasks = Array.isArray(report?.tasks) ? report.tasks : [];
  return tasks.find((t: any) => typeof t?.taskId === "string" && t.taskId.startsWith(prefix)) ?? null;
}

function pvals(task: any) {
  const s = task?.slope_aperturePresenceMean;
  if (!s) return { p_spearman: "n/a", p_pearson: "n/a" };
  return {
    p_spearman: fmt(Number(s.p_spearman), 3),
    p_pearson: fmt(Number(s.p_pearson), 3),
  };
}

function renderIndex(rows: IndexRow[]): string {
  const lines: string[] = [];
  lines.push("# ZË-RO Evals — Run Index v0.1");
  lines.push("");
  lines.push("This is a deterministic index of scored BYO runs in `tests/evals/runs`.");
  lines.push("");
  lines.push("| file | runId | provider | model | label | T2 p(ρ) | T2 p(r) | T3 p(ρ) | T3 p(r) |");
  lines.push("|---|---|---|---|---|---:|---:|---:|---:|");

  for (const r of rows) {
    lines.push(
      `| ${r.file} | ${r.runId} | ${r.provider} | ${r.model} | ${r.label} | ${r.t2_p_spearman} | ${r.t2_p_pearson} | ${r.t3_p_spearman} | ${r.t3_p_pearson} |`
    );
  }

  return lines.join("\n") + "\n";
}

describe("Evals run library v0.1 — score all runs + baseline lock", () => {
  it("scores every run in tests/evals/runs and locks baselines", () => {
    const root = process.cwd();

    const runsDir = path.join(root, "tests/evals/runs");
    if (!fs.existsSync(runsDir)) throw new Error(`Missing runs dir: ${runsDir}`);

    const files = fs
      .readdirSync(runsDir)
      .filter((f) => f.endsWith(".json"))
      .sort((a, b) => a.localeCompare(b));

    if (!files.length) {
      throw new Error(
        [
          "No run files found in tests/evals/runs.",
          "Add at least one evalRun.v0.1 JSON file, for example:",
          "- tests/evals/runs/evalRun.public-grounding-probe.v0.1.gold.synthetic.full.v0.1.json",
        ].join("\n")
      );
    }

    const outDir = path.join(root, "tests/validation/out");
    const baseDir = path.join(root, "tests/validation/baselines");
    ensureDir(outDir);
    ensureDir(baseDir);

    const indexRows: IndexRow[] = [];

    for (const f of files) {
      const runPath = path.join(runsDir, f);
      const raw = JSON.parse(fs.readFileSync(runPath, "utf8"));
      const run = parseEvalRunBundleV0_1(raw);

      const report = scoreEvalRunBundleV0_1({ spec: EVAL_SPEC_V0_1, run });
      const md = renderEvalReportMdV0_1(report);
      const json = JSON.stringify(report, null, 2) + "\n";

      const outBase = `evals.${report.specId}.${report.runId}.v0.1`;
      const outMd = path.join(outDir, `${outBase}.md`);
      const outJson = path.join(outDir, `${outBase}.json`);

      fs.writeFileSync(outMd, md, "utf8");
      fs.writeFileSync(outJson, json, "utf8");

      const basePathNoExt = path.join(baseDir, outBase);
      writeOrCompareBaseline({ basePathNoExt, md, json });

      const t2 = findTask(report, "T2_");
      const t3 = findTask(report, "T3_");

      const t2p = pvals(t2);
      const t3p = pvals(t3);

      indexRows.push({
        file: f,
        runId: report.runId,
        provider: String(report?.meta?.provider ?? ""),
        model: String(report?.meta?.model ?? ""),
        label: String(report?.meta?.label ?? ""),
        t2_p_spearman: t2p.p_spearman,
        t2_p_pearson: t2p.p_pearson,
        t3_p_spearman: t3p.p_spearman,
        t3_p_pearson: t3p.p_pearson,
      });
    }

    const indexMd = renderIndex(indexRows);
    const indexJson = JSON.stringify(
      { indexVersion: "evals.index.v0.1", rows: indexRows },
      null,
      2
    ) + "\n";

    const indexOutMd = path.join(outDir, "evals.index.v0.1.md");
    const indexOutJson = path.join(outDir, "evals.index.v0.1.json");
    fs.writeFileSync(indexOutMd, indexMd, "utf8");
    fs.writeFileSync(indexOutJson, indexJson, "utf8");

    const indexBaseNoExt = path.join(baseDir, "evals.index.v0.1");
    writeOrCompareBaseline({ basePathNoExt: indexBaseNoExt, md: indexMd, json: indexJson });
  });
});
