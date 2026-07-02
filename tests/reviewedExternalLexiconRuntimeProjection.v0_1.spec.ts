import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import {
  projectReviewedExternalLexiconProductionRowForRuntimeV0_1,
} from "../src/shared/reviewedExternalLexiconRuntimeProjection.v0_1";

describe("reviewed external lexicon runtime projection contract v0.1", () => {
  it("projects only production-live Gheg DA into a boundary-safe runtime evidence shape", () => {
    const projections = getReviewedExternalLexiconProductionSourceRowsV0_1()
      .map(projectReviewedExternalLexiconProductionRowForRuntimeV0_1)
      .filter((projection): projection is NonNullable<typeof projection> => projection != null);

    expect(projections).toEqual([
      expect.objectContaining({
        projectionVersion: "reviewed-external-lexicon-runtime-projection.v0_1",
        sourceId: "reviewed.external.gheg-da.damage.candidate.v0_1",
        candidateId: "albanian-da-dam-damage-functional",
        embryo: "DA",
        isolatedStandaloneForm: "da",
        claimBoundary: {
          historicalOriginClaim: "not_claimed",
          winnerClaim: "not_claimed",
          languageSuperiorityClaim: "not_claimed",
          userDecisionPosture: "user_decides",
        },
      }),
    ]);

    expect(projections[0].evidenceText).toContain("Dedvukaj & Ndoci 2023 PLSA");
    expect(projections[0].evidenceText).toContain("Example (4), page 3; footnote 1");
    expect(projections[0].evidenceText).toContain("10.3765/plsa.v8i1.5501");
    expect(projections[0].evidenceText).toContain("da");
  });

  it("keeps reviewed DI absent while it is blocked from production-live promotion", () => {
    const diRow = reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
      (row) => row.sourceId === "reviewed.external.di.knowledge.candidate.v0_1",
    );

    expect(diRow).toBeDefined();
    expect(diRow?.liveStatus).not.toBe("production_live");
    expect(projectReviewedExternalLexiconProductionRowForRuntimeV0_1(diRow!)).toBeNull();

    const projections = getReviewedExternalLexiconProductionSourceRowsV0_1()
      .map(projectReviewedExternalLexiconProductionRowForRuntimeV0_1)
      .filter(Boolean);

    expect(projections).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceId: "reviewed.external.di.knowledge.candidate.v0_1",
        }),
      ]),
    );
  });

  it("keeps projection logic mediated through the RootMap builder, not route or UI adapters", () => {
    const fs = require("node:fs");
    const path = require("node:path");
    const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), "utf8");

    const routeAndAdapterSources = [
      "app/api/analyze-v1/route.ts",
      "src/engine/analyzeWordV1.ts",
      "src/shared/analysisAdapter.ts",
      "src/shared/analyzeV1Adapter.ts",
    ].map(read).join("\n");
    const rootMapBuilderSource = read("src/shared/deepRoot.rootMap.builder.v1.ts");

    expect(routeAndAdapterSources).not.toContain("getReviewedExternalLexiconProductionSourceRowsV0_1");
    expect(routeAndAdapterSources).not.toContain("projectReviewedExternalLexiconProductionRowForRuntimeV0_1");
    expect(rootMapBuilderSource).toContain("projectReviewedExternalLexiconProductionRowForRuntimeV0_1");
  });
});
