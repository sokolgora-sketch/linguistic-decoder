import { createHash } from "node:crypto";
import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";

import { EVAL_SPEC_V0_1 } from "@/shared/evals/spec.v0.1";
import { parseEvalRunBundleV0_1 } from "@/shared/evals/run.v0.1";
import { scoreEvalRunBundleV0_1 } from "@/shared/evals/scoreEvalRun.v0.1";
import { renderEvalReportMdV0_1 } from "@/shared/evals/renderEvalReportMd.v0.1";

function readUtf8(rel: string): string {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

function findExisting(paths: string[]): string {
  for (const p of paths) {
    const abs = path.join(process.cwd(), p);
    if (fs.existsSync(abs)) return p;
  }
  throw new Error(`Could not find any existing path from:\n- ${paths.join("\n- ")}`);
}

const T1_PROMPT_HASH = createHash("sha256")
  .update(EVAL_SPEC_V0_1.tasks.find((t) => t.taskId === "T1_BUCKET_V1_V0_1")?.prompt ?? "")
  .digest("hex");

describe("Evals export parity guard v0.1", () => {
  it("locks markdown export contract for taskId and blank-meta normalization", () => {
    const raw = JSON.parse(
      readUtf8("tests/evals/runs/evalRun.public-grounding-probe.v0.1.gold.synthetic.full.v0.1.json")
    );

    raw.meta = {
      ...(raw.meta ?? {}),
      provider: "",
      model: "",
      label: "",
    };

    const run = parseEvalRunBundleV0_1(raw);
    const report = scoreEvalRunBundleV0_1({ spec: EVAL_SPEC_V0_1, run });
    const md = renderEvalReportMdV0_1(report);

    expect(md).toContain("# ZË-RO Evals Report v0.1");
    expect(md).toContain("- taskId: T1_BUCKET_V1_V0_1");
    expect(md).toContain("- taskVersion: v0.1");
    expect(md).toContain(`- promptHash: ${T1_PROMPT_HASH}`);
    expect(md).toContain("- provider: not set");
    expect(md).toContain("- model: not set");
    expect(md).toContain("- label: not set");
  });

  it("locks committed baseline markdown header to the same export contract", () => {
    const md = readUtf8(
      "tests/validation/baselines/evals.public-grounding-probe.v0.1.gold.synthetic.full.v0.1.md"
    );

    expect(md).toContain("# ZË-RO Evals Report v0.1");
    expect(md).toContain("- taskId: T1_BUCKET_V1_V0_1");
    expect(md).toContain("- taskVersion: v0.1");
    expect(md).toContain(`- promptHash: ${T1_PROMPT_HASH}`);
    expect(md).toContain("- provider: synthetic");
    expect(md).toContain("- model: none");
    expect(md).toContain("- label: calibration");
  });

  it("locks PDF route to the shared markdown renderer contract", () => {
    const routeRel = findExisting([
      "app/api/evals/pdf/route.ts",
      "src/app/api/evals/pdf/route.ts",
      "pages/api/evals/pdf.ts",
      "src/pages/api/evals/pdf.ts",
    ]);

    const src = readUtf8(routeRel);

    expect(src).toContain("renderEvalReportMdV0_1");
    expect(src).toMatch(/renderEvalReportMdV0_1\s*\(/);
  });
});
