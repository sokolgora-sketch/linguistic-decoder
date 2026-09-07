import {
  MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,
  type MultiSourceFunctionalResearchEvidenceRowV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceRegistry.v0_1";
import {
  validateCohortGEvidencePacketV0_1,
  type CohortGEvidencePacketPolicyV0_1,
} from "@/tests/helpers/openInstrumentCohortGEvidencePacketValidator.v0_1";

const policy: CohortGEvidencePacketPolicyV0_1 = {
  targetWord: "build",
  targetSenseId: "physical_construction",
  minimumRows: 2,
  minimumProvenanceGroups: 2,
};

function makeRow(
  id: string,
  provenanceGroupId: string,
): MultiSourceFunctionalResearchEvidenceRowV0_1 {
  return {
    registryVersion:
      MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,
    researchEvidenceId: id,
    embryo: "ndërtoj",
    evidenceFamily: "lexical_dictionary",
    language: "Albanian",
    form: "ndërtoj",
    gloss: "to build",
    embryoRelation: "exact_form",
    relationOperationIds: [],
    attestationTruth: "fact",
    sourceStatus: "research_candidate",
    citations: [
      {
        citationId: `${id}.citation`,
        sourceTitle: `${id} dictionary entry`,
        sourceAuthorOrEditor: "fixture editor",
        sourcePublisherOrHost: "fixture host",
        sourceDateOrVersion: "fixture v1",
        sourceUrlOrArchiveRef: `fixture://${id}`,
        entryLocator: "entry build",
        sourceHashOrArchiveHash: null,
        attestedForm: "ndërtoj",
        attestedGloss: "to build",
        provenanceGroupId,
      },
    ],
    functionalHypotheses: [
      {
        targetWord: "build",
        targetSenseId: "physical_construction",
        semanticBridge: "the attested verb directly names physical construction",
        functionalBridgeTruth: "hypothesis",
        claimBoundary: "functional_hypothesis_only",
      },
    ],
    historicalOriginClaim: "not_claimed",
    historicalTransmissionClaim: "not_claimed",
    winnerClaim: "not_claimed",
    languageSuperiorityClaim: "not_claimed",
    candidateTruthClaim: "not_claimed",
    userDecisionPosture: "user_decides",
  };
}

function freshRows(): MultiSourceFunctionalResearchEvidenceRowV0_1[] {
  return [
    makeRow("research.build.a", "source-family-a"),
    makeRow("research.build.b", "source-family-b"),
  ];
}

function cloneRows(
  rows: readonly MultiSourceFunctionalResearchEvidenceRowV0_1[],
): MultiSourceFunctionalResearchEvidenceRowV0_1[] {
  return JSON.parse(JSON.stringify(rows)) as MultiSourceFunctionalResearchEvidenceRowV0_1[];
}

describe("Open Instrument Cohort-G evidence packet validator v0.1", () => {
  it("passes a complete two-row packet with independent provenance groups", () => {
    expect(validateCohortGEvidencePacketV0_1(freshRows(), policy)).toMatchObject({
      ready: true,
      reasonCodes: [],
      acceptedResearchEvidenceIds: ["research.build.a", "research.build.b"],
      provenanceGroupIds: ["source-family-a", "source-family-b"],
    });
  });

  it.each([
    ["missing target sense", (rows: MultiSourceFunctionalResearchEvidenceRowV0_1[]) => {
      delete (rows[0].functionalHypotheses[0] as { targetSenseId?: string }).targetSenseId;
    }, "target_sense_missing"],
    ["wrong target sense", (rows: MultiSourceFunctionalResearchEvidenceRowV0_1[]) => {
      rows[0].functionalHypotheses[0].targetSenseId = "political_freedom";
    }, "target_sense_mismatch"],
    ["wrong target word", (rows: MultiSourceFunctionalResearchEvidenceRowV0_1[]) => {
      rows[0].functionalHypotheses[0].targetWord = "carry";
    }, "target_hypothesis_missing"],
    ["one provenance group reused", (rows: MultiSourceFunctionalResearchEvidenceRowV0_1[]) => {
      rows[1].citations[0].provenanceGroupId = "source-family-a";
    }, "minimum_provenance_groups_not_met"],
    ["missing provenance group", (rows: MultiSourceFunctionalResearchEvidenceRowV0_1[]) => {
      delete (rows[0].citations[0] as { provenanceGroupId?: string }).provenanceGroupId;
    }, "provenance_group_missing"],
    ["missing functional bridge", (rows: MultiSourceFunctionalResearchEvidenceRowV0_1[]) => {
      rows[0].functionalHypotheses[0].semanticBridge = null;
    }, "functional_bridge_missing"],
    ["attestation is not fact", (rows: MultiSourceFunctionalResearchEvidenceRowV0_1[]) => {
      rows[0].attestationTruth = "inference";
    }, "attestation_not_fact"],
    ["functional bridge is not hypothesis", (rows: MultiSourceFunctionalResearchEvidenceRowV0_1[]) => {
      rows[0].functionalHypotheses[0].functionalBridgeTruth = "inference";
    }, "functional_bridge_not_hypothesis"],
  ])("rejects %s", (_label, mutate, expectedReason) => {
    const rows = freshRows();
    mutate(rows);
    const result = validateCohortGEvidencePacketV0_1(rows, policy);
    expect(result.ready).toBe(false);
    expect(result.reasonCodes).toContain(expectedReason);
  });

  it("rejects two citations from the same provenance group as independent evidence", () => {
    const rows = freshRows();
    rows[0].citations = [
      ...rows[0].citations,
      {
        ...rows[0].citations[0],
        citationId: "research.build.a.citation-copy",
      },
    ];
    rows[1].citations[0].provenanceGroupId = "source-family-a";

    const result = validateCohortGEvidencePacketV0_1(rows, policy);
    expect(result.ready).toBe(false);
    expect(result.reasonCodes).toContain("minimum_provenance_groups_not_met");
  });

  it("rejects duplicate citations and every forbidden truth claim", () => {
    const forbiddenClaims = [
      "historicalOriginClaim",
      "historicalTransmissionClaim",
      "winnerClaim",
      "languageSuperiorityClaim",
      "candidateTruthClaim",
    ] as const;

    for (const claim of forbiddenClaims) {
      const rows = cloneRows(freshRows());
      (rows[0] as unknown as Record<string, unknown>)[claim] = "claimed";
      const result = validateCohortGEvidencePacketV0_1(rows, policy);
      expect(result.ready).toBe(false);
      expect(result.reasonCodes).toContain("research_boundary_violation");
    }

    const wrongPosture = cloneRows(freshRows());
    wrongPosture[0].userDecisionPosture = "system_decides" as "user_decides";
    expect(validateCohortGEvidencePacketV0_1(wrongPosture, policy).reasonCodes).toContain(
      "research_boundary_violation",
    );

    const duplicateCitation = cloneRows(freshRows());
    duplicateCitation[1].citations[0].citationId = duplicateCitation[0].citations[0].citationId;
    expect(validateCohortGEvidencePacketV0_1(duplicateCitation, policy).reasonCodes).toContain(
      "duplicate_citation",
    );
  });
});
