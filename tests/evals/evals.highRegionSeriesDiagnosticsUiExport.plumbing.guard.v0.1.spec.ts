import { readFileSync } from "fs";

describe("high-region series diagnostics UI export plumbing guard", () => {
  test("series evidence-pack export passes optional diagnostics artifact", () => {
    const src = readFileSync("src/ui/evals/EvalsPageClient.v0.1.tsx", "utf8");

    expect(src).toContain("maybeBuildHighRegionSeriesDiagnosticsArtifactFromRowsV0_1");
    expect(src).toContain("const seriesDiagnosticsArtifact =");
    expect(src).toContain("seriesDiagnosticsArtifact,");
    expect(src).toContain("buildEvalsSeriesEvidencePackZipArrayBufferV0_1({");
  });
});
