import { describe, expect, it } from "@jest/globals";
import fs from "fs";
import path from "path";

function readUtf8(rel: string): string {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

describe("Evals timestamp provenance guard v0.1", () => {
  it("locks exportedAtUtc into markdown renderer and routes", () => {
    const mdSrc = readUtf8("src/shared/evals/renderEvalReportMd.v0.1.ts");
    const scoreSrc = readUtf8("app/api/evals/score/route.ts");
    const pdfSrc = readUtf8("app/api/evals/pdf/route.ts");

    expect(mdSrc).toContain("exportedAtUtc");
    expect(mdSrc).toContain("- exportedAtUtc:");

    expect(scoreSrc).toContain('const exportedAtUtc = new Date().toISOString();');
    expect(scoreSrc).toContain("renderEvalReportMdV0_1(report, { exportedAtUtc })");

    expect(pdfSrc).toContain('const exportedAtUtc = new Date().toISOString();');
    expect(pdfSrc).toContain("renderEvalReportMdV0_1(report, { exportedAtUtc })");
    expect(pdfSrc).toContain('const exportedAtUtc = extractMdFrontMatterValue(md, "exportedAtUtc");');
    expect(pdfSrc).toContain('exportedAtUtcCompact');
  });
});
