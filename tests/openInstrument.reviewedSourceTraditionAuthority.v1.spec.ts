import {
  evaluateReviewedSourceTraditionAuthorityV1,
  type ReviewedSourceTraditionAuthorityInputV1,
} from "../src/shared/openInstrument/reviewedSourceTraditionAuthority.v1";
import {
  OPEN_INSTRUMENT_SOURCE_TRADITION_MAPPINGS_V0_1,
  adaptVerifiedSourceRecordV0_1,
  OPEN_INSTRUMENT_VERIFIED_SOURCE_RECORD_VERSION_V0_1,
} from "../src/shared/openInstrumentSourceAdapter.v0_1";
import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import {
  isReviewedExternalLexiconSourceIdFunctionallyRuntimeAuthorizedV0_1,
} from "../src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1";

function validInput(
  overrides: Partial<ReviewedSourceTraditionAuthorityInputV1> = {},
): ReviewedSourceTraditionAuthorityInputV1 {
  return {
    sourceTraditionId: "example.dictionary.v1",
    sourceTitle: "Example reviewed dictionary",
    sourceAuthorOrEditor: "Example editor",
    sourcePublisherOrHost: "Example archive",
    sourceDateOrVersion: "2026 edition",
    sourceUrlOrArchiveRef: "https://example.test/dictionary",
    sourceHashOrArchiveHash: "sha256:example",
    reproducibilityOrArchivePosture: "PINNED_SOURCE_HASH",
    licenseStatus: "EXPLICIT_OPEN_LICENSE",
    sourceType: "reviewed_dictionary_source",
    citationTypes: ["dictionary_entry"],
    language: "Example language",
    languageVariety: "Example variety",
    claimBoundary: {
      historicalOriginClaim: false,
      historicalTransmissionClaim: false,
      winnerClaim: false,
      languageSuperiorityClaim: false,
      candidateTruthClaim: false,
      functionalCorrespondence: "NOT_EVALUATED",
      historicalRelation: "NOT_CLAIMED",
      userDecisionPosture: "user_decides",
    },
    ...overrides,
  };
}

describe("reviewed source tradition authority v1", () => {
  it("passes complete Gate-1 metadata without passing later gates", () => {
    const result = evaluateReviewedSourceTraditionAuthorityV1(validInput());
    const productionRowsBefore =
      getReviewedExternalLexiconProductionSourceRowsV0_1();

    expect(result).toMatchObject({
      authorityVersion:
        "open-instrument.reviewed-source-tradition-authority.v1",
      gate: "SOURCE_TRADITION_AUTHORITY",
      status: "ELIGIBLE_FOR_REVIEWED_INTAKE",
      eligibleForReviewedIntake: true,
      sourceRecordAuthority: "NOT_EVALUATED",
      functionalRuntimeAuthority: "NOT_GRANTED",
      functionalCorrespondence: "NOT_EVALUATED",
      historicalRelation: "NOT_CLAIMED",
      winnerSelection: "NONE",
      reasonCodes: [],
    });
    expect(Object.values(result.dimensions).every((dimension) => dimension.status === "PASS")).toBe(
      true,
    );
    expect(getReviewedExternalLexiconProductionSourceRowsV0_1()).toEqual(
      productionRowsBefore,
    );
    expect(
      isReviewedExternalLexiconSourceIdFunctionallyRuntimeAuthorizedV0_1(
        "example.dictionary.v1",
      ),
    ).toBe(false);
  });

  it("fails closed when provenance or license posture is incomplete", () => {
    const result = evaluateReviewedSourceTraditionAuthorityV1(
      validInput({
        sourceUrlOrArchiveRef: null,
        licenseStatus: null,
      }),
    );

    expect(result.status).toBe("NOT_ELIGIBLE_FOR_REVIEWED_INTAKE");
    expect(result.reasonCodes).toEqual([
      "LICENSE_STATUS_UNRESOLVED",
      "PROVENANCE_UNRESOLVED",
    ]);
    expect(result.dimensions.PROVENANCE.status).toBe("UNKNOWN");
    expect(result.dimensions.LICENSE_STATUS.status).toBe("UNKNOWN");
  });

  it("requires an explicitly supported source type and citation type", () => {
    const grammar = evaluateReviewedSourceTraditionAuthorityV1(
      validInput({
        sourceType: "reviewed_dictionary_source",
        citationTypes: ["grammar_entry"],
      }),
    );
    const unknownKind = evaluateReviewedSourceTraditionAuthorityV1(
      validInput({ sourceType: "reviewed_human_curation_source" }),
    );

    expect(grammar.dimensions.SOURCE_TYPE).toEqual({
      status: "FAIL",
      reasonCodes: ["SOURCE_TYPE_REVIEW_REQUIRED"],
    });
    expect(unknownKind).toMatchObject({
      status: "NOT_ELIGIBLE_FOR_REVIEWED_INTAKE",
      reasonCodes: ["SOURCE_TYPE_REVIEW_REQUIRED"],
    });
  });

  it("does not treat institutional prestige as authority", () => {
    const result = evaluateReviewedSourceTraditionAuthorityV1(
      validInput({
        sourceTitle: "National Academy historical dictionary",
        sourcePublisherOrHost: "University archive",
        licenseStatus: null,
        reproducibilityOrArchivePosture: null,
      }),
    );

    expect(result.status).toBe("NOT_ELIGIBLE_FOR_REVIEWED_INTAKE");
    expect(result.reasonCodes).toEqual([
      "ARCHIVE_POSTURE_UNRESOLVED",
      "LICENSE_STATUS_UNRESOLVED",
    ]);
  });

  it("keeps claim boundaries explicit and rejects correspondence or winner claims", () => {
    const result = evaluateReviewedSourceTraditionAuthorityV1(
      validInput({
        claimBoundary: {
          historicalOriginClaim: false,
          historicalTransmissionClaim: false,
          winnerClaim: true,
          languageSuperiorityClaim: false,
          candidateTruthClaim: false,
          functionalCorrespondence: "NOT_EVALUATED",
          historicalRelation: "NOT_CLAIMED",
          userDecisionPosture: "user_decides",
        },
      }),
    );

    expect(result.dimensions.CLAIM_BOUNDARY_COMPATIBILITY).toEqual({
      status: "FAIL",
      reasonCodes: ["CLAIM_BOUNDARY_INCOMPATIBLE"],
    });
    expect(result.functionalCorrespondence).toBe("NOT_EVALUATED");
    expect(result.historicalRelation).toBe("NOT_CLAIMED");
    expect(result.winnerSelection).toBe("NONE");
  });

  it("preserves explicit no-variety representation and rejects missing representation", () => {
    const noVariety = evaluateReviewedSourceTraditionAuthorityV1(
      validInput({ languageVariety: null }),
    );
    const missingVariety = evaluateReviewedSourceTraditionAuthorityV1(
      { ...validInput(), languageVariety: undefined as never },
    );

    expect(noVariety.dimensions.VARIETY_REPRESENTATION.status).toBe("PASS");
    expect(missingVariety.dimensions.VARIETY_REPRESENTATION).toEqual({
      status: "UNKNOWN",
      reasonCodes: ["VARIETY_REPRESENTATION_UNRESOLVED"],
    });
  });

  it("is deterministic and returns frozen result data", () => {
    const first = evaluateReviewedSourceTraditionAuthorityV1(validInput());
    const second = evaluateReviewedSourceTraditionAuthorityV1(validInput());

    expect(first).toEqual(second);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.reasonCodes)).toBe(true);
    expect(Object.isFrozen(first.dimensions)).toBe(true);
  });

  it("preserves existing FJALË, Lewis & Short, and Middle Liddell mappings", () => {
    expect(Object.keys(OPEN_INSTRUMENT_SOURCE_TRADITION_MAPPINGS_V0_1)).toEqual([
      "fjale.fjalor-shqip.v0_1",
      "scaife.lewis-short.v0_1",
      "scaife.middle-liddell.v0_1",
    ]);

    const source = {
      sourceRecordVersion: OPEN_INSTRUMENT_VERIFIED_SOURCE_RECORD_VERSION_V0_1,
      sourceRecordId: "record.backward-compat.v0_1",
      sourceTraditionId: "fjale.fjalor-shqip.v0_1",
      language: "Albanian",
      sourceTitle: "FJALË",
      sourceAuthorOrEditor: null,
      sourcePublisherOrHost: "FJALË — Fjalor Shqip",
      sourceDateOrVersion: "accessed 2026-09-17",
      sourceUrlOrArchiveRef: "https://fjale.al/example",
      entryLocator: "example",
      sourceHashOrArchiveHash: null,
      attestedForm: "shembull",
      attestedGloss: "example",
    };

    expect(adaptVerifiedSourceRecordV0_1(source)).toMatchObject({
      ok: true,
      admissible: true,
    });
  });

  it("keeps EL, OT, and IT as non-promoted boundary fixtures", () => {
    const productionIds = getReviewedExternalLexiconProductionSourceRowsV0_1().map(
      (row) => row.sourceId,
    );

    expect(productionIds.join(" ")).not.toMatch(/\b(EL|OT|IT)\b/i);
    expect(Object.keys(OPEN_INSTRUMENT_SOURCE_TRADITION_MAPPINGS_V0_1)).not.toEqual(
      expect.arrayContaining(["el.rae.v0_1", "ot.dsl.v0_1", "it.cuny.v0_1"]),
    );

    const incompleteFixture = evaluateReviewedSourceTraditionAuthorityV1(
      validInput({
        sourceTraditionId: "el.rae.v0_1",
        sourceTitle: "RAE",
        sourcePublisherOrHost: "RAE",
        licenseStatus: null,
        reproducibilityOrArchivePosture: null,
      }),
    );

    expect(incompleteFixture.status).toBe("NOT_ELIGIBLE_FOR_REVIEWED_INTAKE");
  });
});
