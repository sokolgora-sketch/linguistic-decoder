import {
  reviewedExternalLexiconSourceRowFixtureContractRowsV0_1,
  syntheticDaDerivativeTrapSourceRowFixtureV0_1,
  syntheticDaHomophoneTrapSourceRowFixtureV0_1,
  syntheticReviewedDiSourceRowFixtureV0_1,
  syntheticSeedSourceRowFixtureV0_1,
} from "./fixtures/openInstrument/reviewedExternalLexiconSourceRows.fixture.v0_1";

const REQUIRED_SOURCE_ROW_KEYS = [
  "candidateId",
  "candidateLanguage",
  "candidateTruthClaim",
  "displayForm",
  "embryo",
  "externalCitations",
  "historicalTransmissionClaim",
  "isolatedStandaloneForm",
  "languageSuperiorityClaim",
  "originClaim",
  "plainStandaloneGloss",
  "publicationEvidenceClaim",
  "scientificEvidenceClaim",
  "semanticBridge",
  "sourceId",
  "sourceKind",
  "sourceNote",
  "sourceStatus",
  "userDecisionPosture",
  "winnerClaim",
].sort();

const REQUIRED_CITATION_KEYS = [
  "attestedForm",
  "attestedGloss",
  "attestedGrammarNote",
  "citationId",
  "citationStatus",
  "citationType",
  "entryLocator",
  "reviewNote",
  "reviewedAt",
  "reviewedBy",
  "sourceAuthorOrEditor",
  "sourceDateOrVersion",
  "sourceHashOrArchiveHash",
  "sourcePublisherOrHost",
  "sourceTitle",
  "sourceUrlOrArchiveRef",
].sort();

describe("reviewed external lexicon source row fixture contract v0.1", () => {
  it("keeps every fixture row on the reviewed source-row contract shape", () => {
    expect(reviewedExternalLexiconSourceRowFixtureContractRowsV0_1).toHaveLength(4);

    for (const row of reviewedExternalLexiconSourceRowFixtureContractRowsV0_1) {
      expect(Object.keys(row).sort()).toEqual(REQUIRED_SOURCE_ROW_KEYS);
      expect(row.externalCitations).toHaveLength(1);

      for (const citation of row.externalCitations) {
        expect(Object.keys(citation).sort()).toEqual(REQUIRED_CITATION_KEYS);
      }
    }
  });

  it("marks all fixtures as synthetic contract-test-only data, not live evidence", () => {
    for (const row of reviewedExternalLexiconSourceRowFixtureContractRowsV0_1) {
      expect(row.sourceId).toMatch(/^fixture\.synthetic\./);
      expect(row.sourceNote).toContain("CONTRACT TEST ONLY");
      expect(row.sourceNote).not.toContain("LIVE");
      expect(row.userDecisionPosture).toBe("user_decides");

      for (const citation of row.externalCitations) {
        expect(citation.citationId).toMatch(/^fixture\.synthetic\./);
        expect(citation.sourceUrlOrArchiveRef).toMatch(/^fixture:\/\//);
        expect(citation.reviewNote).toContain("CONTRACT TEST ONLY");
        expect(citation.reviewNote).not.toContain("LIVE");
      }
    }
  });

  it("locks claim boundaries false for every fixture row", () => {
    for (const row of reviewedExternalLexiconSourceRowFixtureContractRowsV0_1) {
      expect(row.originClaim).toBe(false);
      expect(row.historicalTransmissionClaim).toBe(false);
      expect(row.winnerClaim).toBe(false);
      expect(row.languageSuperiorityClaim).toBe(false);
      expect(row.candidateTruthClaim).toBe(false);
      expect(row.publicationEvidenceClaim).toBe(false);
      expect(row.scientificEvidenceClaim).toBe(false);
    }
  });

  it("provides one synthetic reviewed DI row while preserving user-decision posture", () => {
    expect(syntheticReviewedDiSourceRowFixtureV0_1).toMatchObject({
      sourceKind: "reviewed_dictionary_source",
      sourceStatus: "reviewed_accepted",
      candidateId: "albanian-shtu-di-study-functional",
      candidateLanguage: "sq",
      embryo: "DI",
      isolatedStandaloneForm: "di",
      plainStandaloneGloss: "know",
      userDecisionPosture: "user_decides",
    });

    expect(syntheticReviewedDiSourceRowFixtureV0_1.semanticBridge).toContain("SHTU + DI");
    expect(syntheticReviewedDiSourceRowFixtureV0_1.externalCitations[0]).toMatchObject({
      citationStatus: "reviewed_accepted",
      citationType: "dictionary_entry",
      attestedForm: "di",
      attestedGloss: "know",
    });
  });

  it("keeps seed rows non-validating by source kind and citation type", () => {
    expect(syntheticSeedSourceRowFixtureV0_1.sourceKind).toBe("SEED");
    expect(syntheticSeedSourceRowFixtureV0_1.sourceStatus).toBe("review_pending");
    expect(syntheticSeedSourceRowFixtureV0_1.externalCitations[0].citationStatus).toBe(
      "present_unreviewed",
    );
    expect(syntheticSeedSourceRowFixtureV0_1.externalCitations[0].citationType).toBe(
      "seed_row",
    );
  });

  it("keeps DA derivative evidence trapped away from isolated DA validation", () => {
    expect(syntheticDaDerivativeTrapSourceRowFixtureV0_1.candidateId).toBe(
      "albanian-da-dam-damage-functional",
    );
    expect(syntheticDaDerivativeTrapSourceRowFixtureV0_1.embryo).toBe("DA");
    expect(syntheticDaDerivativeTrapSourceRowFixtureV0_1.isolatedStandaloneForm).toBe(
      "ndare",
    );
    expect(syntheticDaDerivativeTrapSourceRowFixtureV0_1.isolatedStandaloneForm).not.toBe(
      "da",
    );
    expect(syntheticDaDerivativeTrapSourceRowFixtureV0_1.sourceNote).toContain(
      "derivative trap",
    );
    expect(syntheticDaDerivativeTrapSourceRowFixtureV0_1.sourceNote).toContain(
      "must not validate isolated DA",
    );
  });

  it("keeps DA homophone evidence trapped away from split/divide validation", () => {
    expect(syntheticDaHomophoneTrapSourceRowFixtureV0_1.candidateId).toBe(
      "albanian-da-dam-damage-functional",
    );
    expect(syntheticDaHomophoneTrapSourceRowFixtureV0_1.embryo).toBe("DA");
    expect(syntheticDaHomophoneTrapSourceRowFixtureV0_1.isolatedStandaloneForm).toBe(
      "da",
    );
    expect(syntheticDaHomophoneTrapSourceRowFixtureV0_1.plainStandaloneGloss).toBe(
      "gave",
    );
    expect(syntheticDaHomophoneTrapSourceRowFixtureV0_1.sourceNote).toContain(
      "homophone trap",
    );
    expect(syntheticDaHomophoneTrapSourceRowFixtureV0_1.sourceNote).toContain(
      "must not validate DA = split/divide",
    );
  });
});
