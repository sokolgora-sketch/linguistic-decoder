import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
  getReviewedExternalLexiconSourceRowRegistryBoundaryV0_1,
  isReviewedExternalLexiconRegistryRowProductionSafeV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import {
  reviewedExternalLexiconSourceRowFixtureContractRowsV0_1,
  syntheticReviewedDiSourceRowFixtureV0_1,
} from "./fixtures/openInstrument/reviewedExternalLexiconSourceRows.fixture.v0_1";

describe("reviewed external lexicon source row registry boundary v0.1", () => {
  it("starts with an empty production registry", () => {
    const rows = getReviewedExternalLexiconProductionSourceRowsV0_1();
    const boundary = getReviewedExternalLexiconSourceRowRegistryBoundaryV0_1();

    expect(rows).toEqual([]);
    expect(boundary).toEqual({
      registryId: "reviewed-external-lexicon-source-row-registry.v0_1",
      productionRows: [],
      liveRowCount: 0,
      hasLiveRows: false,
      syntheticFixtureRowsAllowed: false,
      liveCitationRequirement: "reviewed_external_metadata_required",
    });
  });

  it("rejects every synthetic fixture row as production registry input", () => {
    for (const row of reviewedExternalLexiconSourceRowFixtureContractRowsV0_1) {
      expect(isReviewedExternalLexiconRegistryRowProductionSafeV0_1(row)).toBe(false);
    }
  });

  it("rejects fixture url refs even when the source id is renamed", () => {
    const row = {
      ...syntheticReviewedDiSourceRowFixtureV0_1,
      sourceId: "reviewed.external.di.v0_1",
    };

    expect(isReviewedExternalLexiconRegistryRowProductionSafeV0_1(row)).toBe(false);
  });

  it("rejects fixture citation ids even when the source url is renamed", () => {
    const row = {
      ...syntheticReviewedDiSourceRowFixtureV0_1,
      sourceId: "reviewed.external.di.v0_1",
      externalCitations: [
        {
          ...syntheticReviewedDiSourceRowFixtureV0_1.externalCitations[0],
          sourceUrlOrArchiveRef: "archive://reviewed-external-lexicon/di",
        },
      ],
    };

    expect(isReviewedExternalLexiconRegistryRowProductionSafeV0_1(row)).toBe(false);
  });

  it("rejects contract-test-only notes even when ids and refs are renamed", () => {
    const row = {
      ...syntheticReviewedDiSourceRowFixtureV0_1,
      sourceId: "reviewed.external.di.v0_1",
      externalCitations: [
        {
          ...syntheticReviewedDiSourceRowFixtureV0_1.externalCitations[0],
          citationId: "reviewed.external.di.citation.v0_1",
          sourceUrlOrArchiveRef: "archive://reviewed-external-lexicon/di",
        },
      ],
    };

    expect(isReviewedExternalLexiconRegistryRowProductionSafeV0_1(row)).toBe(false);
  });

  it("allows only rows with no synthetic fixture markers through the boundary predicate", () => {
    const row = {
      sourceId: "reviewed.external.di.v0_1",
      sourceNote: "Reviewed external source row candidate.",
      externalCitations: [
        {
          citationId: "reviewed.external.di.citation.v0_1",
          sourceUrlOrArchiveRef: "archive://reviewed-external-lexicon/di",
          reviewNote: "Reviewed external citation metadata candidate.",
        },
      ],
    };

    expect(isReviewedExternalLexiconRegistryRowProductionSafeV0_1(row)).toBe(true);
  });
});
