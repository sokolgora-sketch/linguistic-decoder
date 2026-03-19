import fs from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "../..");

function readUtf8(rel: string) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

describe("Evals PDF provenance footer guard v0.1", () => {
  it("locks per-page provenance footer plumbing in the PDF route", () => {
    const src = readUtf8("app/api/evals/pdf/route.ts");

    expect(src).toContain("async function stampPdfProvenanceFooter(");
    expect(src).toContain("pdfBytes: Uint8Array,");
    expect(src).toContain("md: string,");
    expect(src).toContain("): Promise<Uint8Array>");

    expect(src).toContain(
      'const specId = extractMdFrontMatterValue(md, "specId");',
    );
    expect(src).toContain(
      'const runId = extractMdFrontMatterValue(md, "runId");',
    );
    expect(src).toContain(
      'const taskVersion = extractMdFrontMatterValue(md, "taskVersion");',
    );
    expect(src).toContain(
      'const scorerBuild = extractMdFrontMatterValue(md, "scorerBuild");',
    );

    expect(src).toContain(
      "const sourceEngineVersion = extractMdFrontMatterValue(",
    );
    expect(src).toContain('"sourceEngineVersion",');

    expect(src).toContain('" · sourceEngineVersion " +');
    expect(src).toContain("page.drawText(footer1");
    expect(src).toContain("page.drawText(footer2");
  });
});
