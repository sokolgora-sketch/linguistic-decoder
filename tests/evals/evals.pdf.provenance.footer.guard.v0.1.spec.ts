import { describe, expect, it } from "@jest/globals";
import fs from "fs";
import path from "path";

function readUtf8(rel: string): string {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

describe("Evals PDF provenance footer guard v0.1", () => {
  it("locks per-page provenance footer plumbing in the PDF route", () => {
    const src = readUtf8("app/api/evals/pdf/route.ts");

    expect(src).toContain("async function stampPdfProvenanceFooter(pdfBytes: Uint8Array, md: string): Promise<Uint8Array>");
    expect(src).toContain('const specId = extractMdFrontMatterValue(md, "specId");');
    expect(src).toContain('const runId = extractMdFrontMatterValue(md, "runId");');
    expect(src).toContain('const taskVersion = extractMdFrontMatterValue(md, "taskVersion");');
    expect(src).toContain('const promptHash = extractMdFrontMatterValue(md, "promptHash");');
    expect(src).toContain('const exportedAtUtc = extractMdFrontMatterValue(md, "exportedAtUtc");');
    expect(src).toContain("promptHashShort");
    expect(src).toContain('pdfBytes = await stampPdfProvenanceFooter(pdfBytes, md);');
    expect(src).toContain('exportedAtUtcCompact');
  });
});
