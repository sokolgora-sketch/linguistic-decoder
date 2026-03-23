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

const T1_PROMPT_HASH = createHash("sha256")
  .update(
    EVAL_SPEC_V0_1.tasks.find((t) => t.taskId === "T1_BUCKET_V1_V0_1")
      ?.prompt ?? "",
  )
  .digest("hex");

describe("Evals/Landing copy regression guard v0.1", () => {
  it("locks landing pseudoword note wording", () => {
    const landing = readUtf8("src/components/landing/LandingPage.v0.2.tsx");
    const stats = readUtf8("src/components/landing/StatsCards.v0.1.tsx");
    const evalsPage = readUtf8("app/evals/page.tsx");

    const good = "expected non-significant (p_perm > 0.05)";
    const stale = "should be weak/flat";

    expect(landing).toContain(good);
    expect(stats).toContain(good);

    expect(landing).not.toContain(stale);
    expect(stats).not.toContain(stale);

    expect(evalsPage).toContain('title: "ZË-RO — Evals"');
    expect(evalsPage).toContain(
      "Deterministic scorer for evalRun and V1..V7 bucket JSON. Bring model outputs, score them, inspect the signal, and export the report."
    );

    expect(landing).toContain("ZË-RO Public Beta");
    expect(landing).toContain(
      "Deterministic evals now live. Open Instrument and Voice Lab are intentionally closed for now."
    );
    expect(landing).toContain(
      "ZË-RO is a deterministic eval instrument for testing whether model outputs preserve a seven-voice vowel-aperture ladder."
    );
    expect(landing).toContain(
      "No model calls happen inside /evals. You bring model outputs, ZË-RO scores them."
    );
    expect(landing).toContain("Open Evals Beta");
    expect(landing).toContain("Report Feedback");
    expect(landing).toContain("https://github.com/sokolgora-sketch/linguistic-decoder/issues/new");
    expect(landing).toContain("Open Instrument · Coming Soon");
    expect(landing).toContain("Voice Lab · Coming Soon");
    expect(landing).toContain(
      "Open Instrument and Voice Lab are planned next. They stay closed during the Evals beta so the live surface remains stable and testable."
    );

    expect(landing).toContain("Research snapshots and live evals");
    expect(landing).toContain(
      "Reference fresh-chat and same-thread snapshots now sit beside live"
    );
    expect(landing).toContain(
      "scoring, export, and validation tools."
    );
    expect(landing).not.toContain("Paper snapshots moved to Evals");
    expect(landing).not.toContain(
      "Fresh-chat and same-thread paper snapshots now live on the Evals"
    );

    expect(landing).toContain("What ZË-RO means");
    expect(landing).toContain(
      "ZË-RO draws from Albanian: ZË means voice, and RO points to living continuity. The name reflects the project's aim: to return attention to voice, follow it toward deeper structural patterns, and examine those patterns through a clear, repeatable, evidence-based instrument."
    );
    expect(landing).toContain("function MeaningSection() {");
    const meaningIndex = landing.indexOf("<MeaningSection />");
    const faqIndex = landing.indexOf("<FAQSection />");
    expect(meaningIndex).toBeGreaterThan(-1);
    expect(faqIndex).toBeGreaterThan(meaningIndex);
  });
  it("locks markdown renderer taskId and blank-meta normalization", () => {
    const runPath = path.join(
      process.cwd(),
      "tests/evals/runs/evalRun.public-grounding-probe.v0.1.gold.synthetic.full.v0.1.json",
    );

    const rawRun = JSON.parse(fs.readFileSync(runPath, "utf8"));
    const blankMetaRun = {
      ...rawRun,
      runId: "regression.blank-meta.v0.1",
      meta: {
        provider: "   ",
        model: "",
        label: "   ",
        sourceEngineId: "   ",
        sourceEngineVersion: "",
        sourceEngineBuild: "   ",
      },
    };

    const run = parseEvalRunBundleV0_1(blankMetaRun);
    const report = scoreEvalRunBundleV0_1({ spec: EVAL_SPEC_V0_1, run });
    const md = renderEvalReportMdV0_1(report);

    expect(md).toContain("- taskId: T1_BUCKET_V1_V0_1");
    expect(md).toContain("- taskVersion: v0.1");
    expect(md).toContain(`- promptHash: ${T1_PROMPT_HASH}`);
    expect(md).toContain("- provider: not set");
    expect(md).toContain("- model: not set");
    expect(md).toContain("- label: not set");
    expect(md).toContain("- sourceEngineId: not set");
    expect(md).toContain("- sourceEngineVersion: not set");
    expect(md).toContain("- sourceEngineBuild: not set");
  });

  it("locks evals UI source copy for mode clarity and device plate metadata", () => {
    const ui = readUtf8("src/ui/evals/EvalsPageClient.v0.1.tsx");

    expect(ui).toContain(
      "Full run bundle mode expects task provenance to come from the uploaded evalRun.v0.1 bundle. Switch to Buckets only mode to copy a ZË-RO task prompt.",
    );
    expect(ui).toContain('disabled={mode !== "task_buckets"}');

    expect(ui).toContain("Consistency (Spearman");
    expect(ui).toContain('className="normal-case">ρ</span>');

    expect(ui).toContain("provider");
    expect(ui).toContain("report.meta?.provider?.trim()");
    expect(ui).toContain("report.meta.provider");
    expect(ui).toContain('"not set"');

    expect(ui).toContain("model");
    expect(ui).toContain("report.meta?.model?.trim()");
    expect(ui).toContain("report.meta.model");

    expect(ui).toContain("label");
    expect(ui).toContain("report.meta?.label?.trim()");
    expect(ui).toContain("report.meta.label");

    expect(ui).toContain("sourceEngineId");
    expect(ui).toContain("report.meta?.sourceEngineId?.trim()");
    expect(ui).toContain("report.meta.sourceEngineId");

    expect(ui).toContain("sourceEngineVersion");
    expect(ui).toContain("report.meta?.sourceEngineVersion?.trim()");
    expect(ui).toContain("report.meta.sourceEngineVersion");

    expect(ui).toContain("sourceEngineBuild");
    expect(ui).toContain("report.meta?.sourceEngineBuild?.trim()");
    expect(ui).toContain("report.meta.sourceEngineBuild");

    expect(ui).toContain("taskId:");
    expect(ui).toContain('devicePlateTaskId ?? "—"');

    expect(ui).toContain("taskVersion:");
    expect(ui).toContain("{devicePlateTaskVersion}");

    expect(ui).toContain("promptHash:");
    expect(ui).toContain("{devicePlatePromptHash}");

    expect(ui).toContain("exportedAtUtc:");
    expect(ui).toContain("{devicePlateExportedAtUtc}");

    expect(ui).toContain("const reportMeta = report.meta ?? {};");
      expect(ui).toContain('const csvLabel = String(reportMeta?.label ?? "").trim();');
      expect(ui).toContain("dfSplitCsvSafe(csvLabel)");
      expect(ui).toContain('sourceEngineId=${csvSourceEngineId || ""}');
      expect(ui).toContain('sourceEngineBuild=${csvSourceEngineBuild || ""}');
      expect(ui).not.toContain("dfSplitCsvSafe(sourceEngineVersion.trim())");
  });
});
