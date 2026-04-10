import { describe, expect, it } from "@jest/globals";
import fs from "fs";
import path from "path";

describe("Evals screenshot-grade polish v0.1", () => {
  it("locks the main screenshot-polish copy and compact header rail cues in source", () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), "src/ui/evals/EvalsPageClient.v0.1.tsx"),
      "utf8"
    );

    expect(src).toContain(
      'className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex"'
    );
    expect(src).toContain('summaryPearsonText={typeof summaryPearson === "number" ? fmt(summaryPearson) : "—"}');
    expect(src).toContain('summarySpearmanText={typeof summarySpearman === "number" ? fmt(summarySpearman) : "—"}');
    expect(src).toContain('summaryPPermText={typeof summaryPPerm === "number" ? fmtP(summaryPPerm) : "—"}');
    expect(src).toContain('complianceSummaryText={report ? complianceText : "—"}');
    expect(src).not.toContain(
      'className="flex w-full items-stretch divide-x divide-[#1a1e28] px-2 xl:px-4"'
    );

    expect(src).toContain("Deterministic eval instrument.");
    expect(src).toContain("Live scoring stays here; paper snapshots live on the reference page.");
    expect(src).toContain("What to paste");
    expect(src).toContain("How the workflow works");
    expect(src).toContain('border-[#355a7a] bg-[#101a24] text-[#9fd3ff]');
  });
});
