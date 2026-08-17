import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
  getReviewedExternalLexiconSourceRowRegistryBoundaryV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";

describe("reviewed external lexicon source row registry boundary v0.1", () => {
  it("exposes reviewed DA, DI, and AT rows through the production registry", () => {
    const rows =
      getReviewedExternalLexiconProductionSourceRowsV0_1();

    const boundary =
      getReviewedExternalLexiconSourceRowRegistryBoundaryV0_1();

    expect(rows).toHaveLength(3);

    expect(rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceId:
            "reviewed.external.gheg-da.damage.candidate.v0_1",
          candidateId:
            "albanian-da-dam-damage-functional",
          sourceKind: "reviewed_dictionary_source",
          sourceStatus: "reviewed_accepted",
          embryo: "DA",
        }),
        expect.objectContaining({
          sourceId:
            "reviewed.external.di.knowledge.candidate.v0_1",
          candidateId: "albanian-di-know-functional",
          sourceKind: "reviewed_dictionary_source",
          sourceStatus: "reviewed_accepted",
          embryo: "DI",
        }),
        expect.objectContaining({
          sourceId:
            "reviewed.external.albanian-at.father.candidate.v0_1",
          candidateId:
            "albanian-at-father-functional",
          sourceKind:
            "reviewed_lexical_source",
          sourceStatus:
            "reviewed_accepted",
          embryo: "AT",
        }),
      ]),
    );

    expect(boundary).toMatchObject({
      registryId:
        "reviewed-external-lexicon-source-row-registry.v0_1",
      liveRowCount: 3,
      hasLiveRows: true,
      syntheticFixtureRowsAllowed: false,
      liveCitationRequirement:
        "reviewed_external_metadata_required",
    });

    expect(boundary.productionRows).toHaveLength(3);
  });
});
