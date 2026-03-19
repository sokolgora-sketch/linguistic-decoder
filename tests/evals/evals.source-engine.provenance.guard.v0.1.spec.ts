import fs from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "../..");

function readUtf8(rel: string) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

describe("Evals source-engine provenance guard v0.1", () => {
  it("locks source-engine fields in run/report/markdown contracts", () => {
    const runSrc = readUtf8("src/shared/evals/run.v0.1.ts");
    const reportSrc = readUtf8("src/shared/evals/report.v0.1.ts");
    const mdSrc = readUtf8("src/shared/evals/renderEvalReportMd.v0.1.ts");

    expect(runSrc).toContain("sourceEngineId?: string;");
    expect(runSrc).toContain("sourceEngineVersion?: string;");
    expect(runSrc).toContain("sourceEngineBuild?: string;");

    expect(reportSrc).toContain("sourceEngineId?: string;");
    expect(reportSrc).toContain("sourceEngineVersion?: string;");
    expect(reportSrc).toContain("sourceEngineBuild?: string;");

    expect(mdSrc).toContain("- sourceEngineId:");
    expect(mdSrc).toContain("- sourceEngineVersion:");
    expect(mdSrc).toContain("- sourceEngineBuild:");
  });

  it("locks UI and PDF provenance surfacing", () => {
    const uiSrc = readUtf8("src/ui/evals/EvalsPageClient.v0.1.tsx");
    const pdfSrc = readUtf8("app/api/evals/pdf/route.ts");

    expect(uiSrc).toContain("sourceEngineId:");
    expect(uiSrc).toContain("sourceEngineVersion:");
    expect(uiSrc).toContain("sourceEngineBuild:");
    expect(uiSrc).toContain("report.meta?.sourceEngineVersion?.trim()");

    expect(pdfSrc).toContain(
      "const sourceEngineVersion = extractMdFrontMatterValue(",
    );
    expect(pdfSrc).toContain('"sourceEngineVersion",');
    expect(pdfSrc).toContain('" · sourceEngineVersion " +');
  });
});
