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

describe("Evals/Landing copy regression guard v0.1", () => {
  it("locks landing pseudoword note wording", () => {
    const landing = readUtf8("src/components/landing/LandingPage.v0.2.tsx");
    const stats = readUtf8("src/components/landing/StatsCards.v0.1.tsx");

    const good = "expected non-significant (p_perm > 0.05)";
    const stale = "should be weak/flat";

    expect(landing).toContain(good);
    expect(stats).toContain(good);

    expect(landing).not.toContain(stale);
    expect(stats).not.toContain(stale);
  });

  it("locks markdown renderer taskId and blank-meta normalization", () => {
    const runPath = path.join(
      process.cwd(),
      "tests/evals/runs/evalRun.public-grounding-probe.v0.1.gold.synthetic.full.v0.1.json"
    );

    const rawRun = JSON.parse(fs.readFileSync(runPath, "utf8"));
    const blankMetaRun = {
      ...rawRun,
      runId: "regression.blank-meta.v0.1",
      meta: {
        provider: "   ",
        model: "",
        label: "   ",
      },
    };

    const run = parseEvalRunBundleV0_1(blankMetaRun);
    const report = scoreEvalRunBundleV0_1({ spec: EVAL_SPEC_V0_1, run });
    const md = renderEvalReportMdV0_1(report);

    expect(md).toContain("- taskId: T1_BUCKET_V1_V0_1");
    expect(md).toContain("- provider: not set");
    expect(md).toContain("- model: not set");
    expect(md).toContain("- label: not set");
  });

  it("locks evals UI source copy for mode clarity and device plate metadata", () => {
    const ui = readUtf8("src/ui/evals/EvalsPageClient.v0.1.tsx");

    expect(ui).toContain(`Task (Buckets only mode)`);
    expect(ui).toContain(`Task source`);
    expect(ui).toContain(
      `Select the task used to wrap V1..V7 bucket JSON into evalRun.v0.1.`
    );
    expect(ui).toContain(`TASK PROMPT — USED ONLY FOR BUCKETS-ONLY MODE`);
    expect(ui).toContain(`disabled={mode !== "task_buckets"}`);

    expect(ui).toContain(`Consistency (Spearman <span className="normal-case">ρ</span>)`);

    expect(ui).toContain(
      `provider <span className={\`font-mono \${report.meta?.provider?.trim() ? "text-white" : "text-[#8f8f8f]"}\`}>{report.meta?.provider?.trim() ? report.meta.provider : "not set"}</span>`
    );
    expect(ui).toContain(
      `model <span className={\`font-mono \${report.meta?.model?.trim() ? "text-white" : "text-[#8f8f8f]"}\`}>{report.meta?.model?.trim() ? report.meta.model : "not set"}</span>`
    );
    expect(ui).toContain(
      `label <span className={\`font-mono \${report.meta?.label?.trim() ? "text-white" : "text-[#8f8f8f]"}\`}>{report.meta?.label?.trim() ? report.meta.label : "not set"}</span>`
    );

    expect(ui).toContain(
      `taskId: <span className="font-mono text-[#f2f2f2]">{summaryTask?.taskId ?? "—"}</span>`
    );
  });
});
