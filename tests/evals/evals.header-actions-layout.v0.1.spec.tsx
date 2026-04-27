import { describe, expect, it } from "@jest/globals";
import fs from "fs";
import path from "path";

describe("Evals header actions layout v0.1", () => {
  it("locks the sticky nav action shell and header rail wiring in source", () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), "src/ui/evals/EvalsPageClient.v0.1.tsx"),
      "utf8"
    );

    expect(src).toContain("function StickyNav({");
    expect(src).toContain("onCopyPageLink: () => void | Promise<void>;");
    expect(src).toContain("summaryPearsonText: string;");
    expect(src).toContain("summarySpearmanText: string;");
    expect(src).toContain("summaryPPermText: string;");
    expect(src).toContain("complianceSummaryText: string;");
    expect(src).toContain("stateDetailText: string;");
    expect(src).toContain("stateDotClass: string;");
    expect(src).toContain("stateToneClass: string;");

    expect(src).toContain("<StickyNav");
    expect(src).toContain("onCopyPageLink={onCopyPageLink}");
    expect(src).toContain("summaryPearsonText={");
    expect(src).toContain("summarySpearmanText={");
    expect(src).toContain("summaryPPermText={");
    expect(src).toContain("complianceSummaryText={");
    expect(src).toContain("stateDetailText={");
    expect(src).toContain("stateDotClass={stateDotClass}");
    expect(src).toContain("stateToneClass={stateToneClass}");

    expect(src).toContain('className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex"');
    expect(src).toContain('href="/evals/help"');
    expect(src).toContain('href="/evals/reference"');
    expect(src).toContain('href="/battery"');
    expect(src).toContain("Battery index");
    expect(src).toContain("Report feedback ↗");
    expect(src).toContain("Copy page link");
    expect(src).toContain("Open Saved Run");
  });
});
