import {
  classifyLewisShortSenseStructureV1,
} from "../scripts/openInstrument/reviewedLewisShortBatchImport.v1";
import {
  SOURCE_PROVIDED_LOOKUP_REPRESENTATION_SCHEMA_V1,
  validateSourceProvidedLookupRepresentationV1,
} from "../src/shared/openInstrument/sourceProvidedLookupRepresentationContract.v1";
import {
  evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1,
  isReviewedExternalLexiconSourceIdFunctionallyRuntimeAuthorizedV0_1,
} from "../src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1";
import {
  buildReviewedExternalLexiconFunctionalReadinessV0_1,
} from "../src/shared/reviewedExternalLexiconFunctionalReadiness.v0_1";
import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
  isReviewedExternalLexiconSourceIdInProductionMembershipV0_1,
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";

const SOURCE_FILE_SHA256 =
  "a21c3799f42d33931b463c19a036b0e5c4a6504ccbd81ee55a262421a9e1836c";

const SOURCE_URL =
  "https://github.com/PerseusDL/lexica/blob/56061ca127f4a2844980baffc5f2b6d1332897b3/CTS_XML_TEI/perseus/pdllex/lat/ls/lat.ls.perseus-eng2.xml";

function getRow(sourceId: string) {
  const row = reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
    (candidate) => candidate.sourceId === sourceId,
  );

  if (!row) throw new Error(`Missing reviewed source row: ${sourceId}`);
  return row;
}

function representationFor(
  sourceForm: string,
  lookupForm: string,
  locator: string,
) {
  return {
    schemaVersion: SOURCE_PROVIDED_LOOKUP_REPRESENTATION_SCHEMA_V1,
    sourceForm,
    authorizedLookupRepresentation: lookupForm,
    authority: "SOURCE_PROVIDED" as const,
    sourceField: "source_key" as const,
    sourceFieldValue: sourceForm,
    sourceLocator: locator,
    representationKind: "SOURCE_FIELD_EXPLICIT_REPRESENTATION" as const,
    lossiness: "POTENTIALLY_LOSSY_EXPLICIT" as const,
    sourceDisambiguation: "NOT_APPLICABLE" as const,
    reasonCode: "SOURCE_FIELD_EXPLICITLY_AUTHORIZED" as const,
  };
}

describe("Lewis & Short EU/OH Gate-2 reviewed source admission v0.1", () => {
  const euSourceId = "reviewed.external.latin-eu.source-attestation.v0_1";
  const ohSourceId = "reviewed.external.latin-oh.source-attestation.v0_1";

  it("records exactly the two DF-accepted source attestations with complete provenance", () => {
    const eu = getRow(euSourceId);
    const oh = getRow(ohSourceId);

    expect([eu, oh]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceStatus: "reviewed_accepted",
          sourceKind: "reviewed_dictionary_source",
          candidateLanguage: "la",
          semanticBridge: null,
          originClaim: false,
          historicalTransmissionClaim: false,
          winnerClaim: false,
          languageSuperiorityClaim: false,
          candidateTruthClaim: false,
          userDecisionPosture: "user_decides",
        }),
      ]),
    );

    expect(eu).toMatchObject({
      sourceId: euSourceId,
      embryo: "EU",
      isolatedStandaloneForm: "eu",
      plainStandaloneGloss:
        "well! well done! bravo! an exclamation of joy or approbation",
      externalCitations: [
        expect.objectContaining({
          citationStatus: "reviewed_accepted",
          citationType: "dictionary_entry",
          attestedForm: "eu",
          entryLocator: 'TEI.2 entryFree id="n16308" key="eu"',
          reviewedBy: "open-instrument-gate2-human-review",
          reviewedAt: "2026-09-18",
          sourceUrlOrArchiveRef: SOURCE_URL,
          sourceHashOrArchiveHash: SOURCE_FILE_SHA256,
        }),
      ],
    });
    expect(oh).toMatchObject({
      sourceId: ohSourceId,
      embryo: "OH",
      isolatedStandaloneForm: "oh",
      plainStandaloneGloss: "oh! O! ah!",
      externalCitations: [
        expect.objectContaining({
          citationStatus: "reviewed_accepted",
          citationType: "dictionary_entry",
          attestedForm: "oh",
          entryLocator: 'TEI.2 entryFree id="n32423" key="oh"',
          reviewedBy: "open-instrument-gate2-human-review",
          reviewedAt: "2026-09-18",
          sourceUrlOrArchiveRef: SOURCE_URL,
          sourceHashOrArchiveHash: SOURCE_FILE_SHA256,
        }),
      ],
    });
  });

  it("revalidates substantive EU/OH senses and keeps IM blocked", () => {
    expect(
      classifyLewisShortSenseStructureV1(
        '<hi rend="ital">well! well done! bravo!</hi> an exclamation of joy or approbation',
      ),
    ).toBe("LEXICAL_GLOSS_PRESENT");
    expect(
      classifyLewisShortSenseStructureV1('<hi rend="ital">oh! O! ah!</hi>'),
    ).toBe("LEXICAL_GLOSS_PRESENT");
    expect(
      classifyLewisShortSenseStructureV1('<hi rend="ital">init.</hi>'),
    ).toBe("LEXICAL_DEFINITION_MISSING");

    const eu = getRow(euSourceId);
    const oh = getRow(ohSourceId);
    expect(
      validateSourceProvidedLookupRepresentationV1(
        representationFor(
          eu.isolatedStandaloneForm!,
          "EU",
          'TEI.2 entryFree id="n16308" key="eu"',
        ),
      ).ok,
    ).toBe(true);
    expect(
      validateSourceProvidedLookupRepresentationV1(
        representationFor(
          oh.isolatedStandaloneForm!,
          "OH",
          'TEI.2 entryFree id="n32423" key="oh"',
        ),
      ).ok,
    ).toBe(true);
  });

  it("keeps source attestation separate from functional correspondence and acceptance", () => {
    for (const sourceId of [euSourceId, ohSourceId]) {
      const row = getRow(sourceId);
      const readiness =
        buildReviewedExternalLexiconFunctionalReadinessV0_1(row);
      const authorization =
        evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
          row,
        );

      expect(readiness.functionalReady).toBe(false);
      expect(
        readiness.items.find((item) => item.id === "functional_bridge_present")
          ?.passed,
      ).toBe(false);
      expect(authorization.authorized).toBe(false);
      expect(authorization.reasons).toContain("source_id_not_authorized");
      expect(row.sourceNote).toContain("source attestation");
      expect(Object.keys(row)).not.toContain("targetWord");
      expect(Object.keys(row)).not.toContain("functionalCorrespondence");
      expect(Object.keys(row)).not.toContain("historicalRelation");
    }
  });

  it("keeps EU/OH out of Gate-3 production membership and preserves existing runtime rows", () => {
    expect(
      isReviewedExternalLexiconSourceIdInProductionMembershipV0_1(euSourceId),
    ).toBe(false);
    expect(
      isReviewedExternalLexiconSourceIdInProductionMembershipV0_1(ohSourceId),
    ).toBe(false);
    expect(
      isReviewedExternalLexiconSourceIdFunctionallyRuntimeAuthorizedV0_1(
        euSourceId,
      ),
    ).toBe(false);
    expect(
      isReviewedExternalLexiconSourceIdFunctionallyRuntimeAuthorizedV0_1(
        ohSourceId,
      ),
    ).toBe(false);

    expect(getReviewedExternalLexiconProductionSourceRowsV0_1()).toHaveLength(3);
    expect(
      getReviewedExternalLexiconProductionSourceRowsV0_1().map(
        (row) => row.sourceId,
      ),
    ).toEqual(
      expect.arrayContaining([
        "reviewed.external.di.knowledge.candidate.v0_1",
        "reviewed.external.gheg-da.damage.candidate.v0_1",
        "reviewed.external.albanian-at.father.candidate.v0_1",
      ]),
    );
  });

  it("does not accept IM or any other Lewis & Short row", () => {
    expect(
      reviewedExternalLexiconSourceRowCandidateRegistryV0_1.filter((row) =>
        row.sourceId.includes("latin-")
          ? ![euSourceId, ohSourceId].includes(row.sourceId)
          : false,
      ),
    ).toEqual([]);
    expect(
      reviewedExternalLexiconSourceRowCandidateRegistryV0_1.some(
        (row) => row.embryo === "IM",
      ),
    ).toBe(false);
  });
});
