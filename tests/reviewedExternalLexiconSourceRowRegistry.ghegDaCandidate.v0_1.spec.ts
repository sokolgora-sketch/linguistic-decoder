import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
  isReviewedExternalLexiconRegistryRowProductionSafeV0_1,
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import { evaluateReviewedExternalLexiconEvidenceGateV0_1 } from "../src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1";

const GHEG_DA_SOURCE_ID_V0_1 = "reviewed.external.gheg-da.damage.candidate.v0_1";

function getGhegDaCandidateRowV0_1() {
  const row = reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
    (candidate) => candidate.sourceId === GHEG_DA_SOURCE_ID_V0_1,
  );

  if (!row) throw new Error("Gheg DA candidate row not found.");

  return row;
}

describe("reviewed external lexicon source row candidate registry Gheg DA v0.1", () => {
  it("keeps production rows empty while exposing a non-live candidate registry", () => {
    expect(getReviewedExternalLexiconProductionSourceRowsV0_1()).toEqual([]);
    expect(reviewedExternalLexiconSourceRowCandidateRegistryV0_1).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceId: GHEG_DA_SOURCE_ID_V0_1,
        }),
      ]),
    );
  });

  it("contains a reviewed Gheg DA damage candidate with claim boundaries locked off", () => {
    const row = getGhegDaCandidateRowV0_1();

    expect(row).toMatchObject({
      sourceId: "reviewed.external.gheg-da.damage.candidate.v0_1",
      candidateId: "albanian-da-dam-damage-functional",
      displayForm: "Gheg DA split damage candidate",
      candidateLanguage: "sq",
      sourceKind: "reviewed_dictionary_source",
      sourceStatus: "reviewed_accepted",
      embryo: "DA",
      isolatedStandaloneForm: "da",
      plainStandaloneGloss: "split / divide",
      originClaim: false,
      historicalTransmissionClaim: false,
      winnerClaim: false,
      languageSuperiorityClaim: false,
      candidateTruthClaim: false,
      publicationEvidenceClaim: false,
      scientificEvidenceClaim: false,
      userDecisionPosture: "user_decides",
    });

    expect(row.sourceNote).not.toContain("NON-LIVE CANDIDATE");
    expect(row.sourceNote).toContain("Reviewed citation candidate");
    expect(row.semanticBridge).toContain("without making a historical-origin claim");
  });

  it("is promotion-safe after reviewed citation metadata intake while remaining outside production rows", () => {
    const row = getGhegDaCandidateRowV0_1();

    expect(isReviewedExternalLexiconRegistryRowProductionSafeV0_1(row)).toBe(true);
    expect(row.externalCitations[0].citationStatus).toBe("reviewed_accepted");
    expect(row.externalCitations[0].citationType).toBe("dictionary_entry");
    expect(row.externalCitations[0].sourceTitle).toBe("Linguistic variation within the Northwestern Gheg Albanian dialect");
    expect(row.externalCitations[0].sourceAuthorOrEditor).toBe("Lindon Dedvukaj & Rexhina Ndoci");
    expect(row.externalCitations[0].sourcePublisherOrHost).toBe("Proceedings of the Linguistic Society of America");
    expect(row.externalCitations[0].sourceDateOrVersion).toBe("2023; volume 8, issue 1; article 5501");
    expect(row.externalCitations[0].reviewedBy).toBe("open-instrument-candidate-registry");
    expect(row.externalCitations[0].reviewedAt).toBe("2026-06-30");
    expect(row.externalCitations[0].sourceHashOrArchiveHash).toBe("doi:10.3765/plsa.v8i1.5501");
    expect(row.externalCitations[0].sourceUrlOrArchiveRef).toBe(
      "https://doi.org/10.3765/plsa.v8i1.5501",
    );
  });

  it("still exercises the positive free-operator gate path for diagnostics", () => {
    const result = evaluateReviewedExternalLexiconEvidenceGateV0_1(
      getGhegDaCandidateRowV0_1(),
    );

    expect(result.validationOutcome).toBe("source_validation_eligible");
    expect(result.evidenceCategories).toEqual([
      "free_operator_attested",
      "functional_motivation_supported",
      "historical_origin_not_claimed",
      "user_decides",
    ]);
    expect(result.freeOperatorDiagnostic).toMatchObject({
      operator: "da",
      attestedForms: ["da"],
      historicalOriginClaim: "not_claimed",
      userDecisionPosture: "user_decides",
    });
  });
});
