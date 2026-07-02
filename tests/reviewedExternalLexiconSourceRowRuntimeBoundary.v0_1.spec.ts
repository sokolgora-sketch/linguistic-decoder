import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";

function read(path: string): string {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("reviewed external lexicon production source row runtime boundary v0.1", () => {
  it("has reviewed DA production rows while DI remains blocked from production rows", () => {
    const rows = getReviewedExternalLexiconProductionSourceRowsV0_1();

    expect(rows).toEqual([
      expect.objectContaining({
        sourceId: "reviewed.external.gheg-da.damage.candidate.v0_1",
        candidateId: "albanian-da-dam-damage-functional",
        embryo: "DA",
        isolatedStandaloneForm: "da",
        userDecisionPosture: "user_decides",
      }),
    ]);

    expect(rows).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceId: "reviewed.external.di.knowledge.candidate.v0_1",
        }),
      ]),
    );
  });

  it("keeps production source rows out of direct route and UI adapter wiring", () => {
    const runtimeSources = [
      "app/api/analyze-v1/route.ts",
      "src/engine/analyzeWordV1.ts",
      "src/shared/analysisAdapter.ts",
      "src/shared/analyzeV1Adapter.ts",
    ].map(read).join("\n");

    expect(runtimeSources).not.toContain("getReviewedExternalLexiconProductionSourceRowsV0_1");
    expect(runtimeSources).not.toContain("reviewed.external.gheg-da.damage.candidate.v0_1");
    expect(runtimeSources).not.toContain("reviewed.external.di.knowledge.candidate.v0_1");

    const rootMapBuilderSource = read("src/shared/deepRoot.rootMap.builder.v1.ts");
    expect(rootMapBuilderSource).toContain("projectReviewedExternalLexiconProductionRowForRuntimeV0_1");
  });

  it("documents the safe next step before runtime projection", () => {
    const registrySource = read("src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts");

    expect(registrySource).toContain("PRODUCTION_SOURCE_ROW_IDS_V0_1");
    expect(registrySource).toContain("reviewed.external.gheg-da.damage.candidate.v0_1");
    expect(registrySource).toContain("reviewed.external.di.knowledge.candidate.v0_1");

    // Boundary: source rows are reviewed evidence objects first.
    // Runtime projection is mediated through the reviewed projection adapter and RootMap builder.
    expect(registrySource).toContain("Production source row promotion accepted v0.1");
    expect(registrySource).toContain("still required before production-live promotion");
  });
});
