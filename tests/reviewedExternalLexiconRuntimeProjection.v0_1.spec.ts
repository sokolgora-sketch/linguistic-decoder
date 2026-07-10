import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import {
  projectReviewedExternalLexiconProductionRowForRuntimeV0_1,
} from "../src/shared/reviewedExternalLexiconRuntimeProjection.v0_1";

describe("reviewed external lexicon runtime projection contract v0.1", () => {
  it("projects both bounded production rows into boundary-safe runtime evidence", () => {
    const projections =
      getReviewedExternalLexiconProductionSourceRowsV0_1()
        .map(
          projectReviewedExternalLexiconProductionRowForRuntimeV0_1,
        )
        .filter(
          (
            projection,
          ): projection is NonNullable<typeof projection> =>
            projection != null,
        );

    expect(projections).toHaveLength(2);

    expect(projections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceId:
            "reviewed.external.gheg-da.damage.candidate.v0_1",
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
        expect.objectContaining({
          sourceId:
            "reviewed.external.di.knowledge.candidate.v0_1",
          candidateId: "albanian-di-know-functional",
          embryo: "DI",
          isolatedStandaloneForm: "di",
          claimBoundary: {
            historicalOriginClaim: "not_claimed",
            winnerClaim: "not_claimed",
            languageSuperiorityClaim: "not_claimed",
            userDecisionPosture: "user_decides",
          },
        }),
      ]),
    );
  });

  it("projects DI as bounded lexical evidence without DA citation reuse", () => {
    const diRow =
      reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
        (row) =>
          row.sourceId ===
          "reviewed.external.di.knowledge.candidate.v0_1",
      );

    expect(diRow).toBeDefined();

    const projection =
      projectReviewedExternalLexiconProductionRowForRuntimeV0_1(
        diRow!,
      );

    expect(projection).toMatchObject({
      sourceId:
        "reviewed.external.di.knowledge.candidate.v0_1",
      candidateId: "albanian-di-know-functional",
      embryo: "DI",
      isolatedStandaloneForm: "di",
      claimBoundary: {
        historicalOriginClaim: "not_claimed",
        winnerClaim: "not_claimed",
        languageSuperiorityClaim: "not_claimed",
        userDecisionPosture: "user_decides",
      },
    });

    expect(projection?.evidenceText).toContain(
      "Albanian > Etymology 1 > Verb > di: to know",
    );
    expect(projection?.evidenceText).toContain(
      "di = know / knowledge",
    );
    expect(projection?.evidenceText).toContain(
      "https://en.wiktionary.org/wiki/di#Albanian",
    );

    expect(projection?.evidenceText).not.toContain(
      "10.3765/plsa.v8i1.5501",
    );
    expect(projection?.evidenceText).not.toContain(
      "Direct DPEWA/FGJSH locator",
    );
  });

  it("keeps projection mediated through the RootMap builder rather than routes or UI adapters", () => {
    const fs = require("node:fs");
    const path = require("node:path");
    const read = (file: string) =>
      fs.readFileSync(
        path.join(process.cwd(), file),
        "utf8",
      );

    const routeAndAdapterSources = [
      "app/api/analyze-v1/route.ts",
      "src/engine/analyzeWordV1.ts",
      "src/shared/analysisAdapter.ts",
      "src/shared/analyzeV1Adapter.ts",
    ].map(read).join("\n");

    const rootMapBuilderSource = read(
      "src/shared/deepRoot.rootMap.builder.v1.ts",
    );

    expect(routeAndAdapterSources).not.toContain(
      "getReviewedExternalLexiconProductionSourceRowsV0_1",
    );
    expect(routeAndAdapterSources).not.toContain(
      "projectReviewedExternalLexiconProductionRowForRuntimeV0_1",
    );
    expect(rootMapBuilderSource).toContain(
      "projectReviewedExternalLexiconProductionRowForRuntimeV0_1",
    );
  });
});
