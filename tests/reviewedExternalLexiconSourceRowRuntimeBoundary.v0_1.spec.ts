import fs from "node:fs";
import path from "node:path";
import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";

const read = (file: string): string =>
  fs.readFileSync(path.join(process.cwd(), file), "utf8");

describe("reviewed external lexicon source-row runtime boundary v0.1", () => {
  it("exposes DA, DI, and runtime-verified AT only through authorization-enforced production enumeration", () => {
    const rows =
      getReviewedExternalLexiconProductionSourceRowsV0_1();

    expect(rows).toHaveLength(3);
    expect(rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceId:
            "reviewed.external.gheg-da.damage.candidate.v0_1",
          embryo: "DA",
          userDecisionPosture: "user_decides",
        }),
        expect.objectContaining({
          sourceId:
            "reviewed.external.di.knowledge.candidate.v0_1",
          embryo: "DI",
          userDecisionPosture: "user_decides",
        }),
        expect.objectContaining({
          sourceId:
            "reviewed.external.albanian-at.father.candidate.v0_1",
          embryo: "AT",
          userDecisionPosture: "user_decides",
        }),
      ]),
    );
  });

  it("keeps production rows out of direct route and UI adapter wiring", () => {
    const runtimeSources = [
      "app/api/analyze-v1/route.ts",
      "src/engine/analyzeWordV1.ts",
      "src/shared/analysisAdapter.ts",
      "src/shared/analyzeV1Adapter.ts",
    ].map(read).join("\n");

    expect(runtimeSources).not.toContain(
      "getReviewedExternalLexiconProductionSourceRowsV0_1",
    );
    expect(runtimeSources).not.toContain(
      "reviewed.external.gheg-da.damage.candidate.v0_1",
    );
    expect(runtimeSources).not.toContain(
      "reviewed.external.di.knowledge.candidate.v0_1",
    );
    expect(runtimeSources).not.toContain(
      "reviewed.external.albanian-at.father.candidate.v0_1",
    );

    const rootMapBuilderSource = read(
      "src/shared/deepRoot.rootMap.builder.v1.ts",
    );

    expect(rootMapBuilderSource).toContain(
      "projectReviewedExternalLexiconProductionRowForRuntimeV0_1",
    );
  });

  it("documents bounded DI production separately from unresolved historical authority", () => {
    const registrySource = read(
      "src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts",
    );

    expect(registrySource).toContain(
      "PRODUCTION_SOURCE_ROW_IDS_V0_1",
    );
    expect(registrySource).toContain(
      "reviewed.external.gheg-da.damage.candidate.v0_1",
    );
    expect(registrySource).toContain(
      "reviewed.external.di.knowledge.candidate.v0_1",
    );
    expect(registrySource).toContain(
      "bounded functional lexical projection",
    );
    expect(registrySource).toContain(
      "remains unresolved for historical-authority or stronger-source claims",
    );
    expect(registrySource).toContain(
      "is not required for this bounded lexical projection",
    );
  });
});
