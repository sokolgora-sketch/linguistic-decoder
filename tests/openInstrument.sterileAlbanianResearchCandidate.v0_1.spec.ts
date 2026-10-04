import {
  loadMultiSourceFunctionalResearchEvidenceCatalogV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceCatalog.v0_1";
import {
  buildSourceAttestedFunctionalResearchInputGroupsV0_1,
  buildMultiSourceFunctionalResearchInputsV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceRegistry.v0_1";
import {
  discoverSourceAttestedFunctionalWitnessesV0_1,
} from "@/shared/multiSourceFunctionalDiscovery.v0_1";
import {
  projectMultiSourceFunctionalResearchWitnessesV0_1,
} from "@/shared/multiSourceFunctionalResearchProjection.v0_1";
import {
  isReviewedExternalLexiconSourceIdInProductionMembershipV0_1,
} from "@/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";

const STERILE_RESEARCH_EVIDENCE = [
  {
    id: "research.external.albanian-shter-depletion.v0_1",
    form: "shter",
    embryo: "SHTER",
    citationIds: [
      "research.external.albanian-shter-fjalori-online.citation.v0_1",
      "research.external.albanian-shter-fjale.citation.v0_1",
    ],
  },
  {
    id: "research.external.albanian-shterp-barren.v0_1",
    form: "shterp",
    embryo: "SHTERP",
    citationIds: [
      "research.external.albanian-shterp-fjalori-online.citation.v0_1",
      "research.external.albanian-shterp-fjale.citation.v0_1",
    ],
  },
  {
    id: "research.external.albanian-shterpe-barren.v0_1",
    form: "shterpë",
    embryo: "SHTERPË",
    citationIds: [
      "research.external.albanian-shterpe-fjalori-online.citation.v0_1",
      "research.external.albanian-shterpe-fjale.citation.v0_1",
    ],
  },
  {
    id: "research.external.albanian-shterpezoj-sterilize.v0_1",
    form: "shterpëzoj",
    embryo: "SHTERPËZOJ",
    citationIds: [
      "research.external.albanian-shterpezoj-fjale.citation.v0_1",
    ],
  },
] as const;

describe("Open Instrument sterile Albanian research candidate v0.1", () => {
  it("preserves the attested Albanian forms and bounded target hypotheses", () => {
    const rows = loadMultiSourceFunctionalResearchEvidenceCatalogV0_1();

    for (const expected of STERILE_RESEARCH_EVIDENCE) {
      const row = rows.find(
        (candidate) => candidate.researchEvidenceId === expected.id,
      );

      expect(row).toBeDefined();
      expect(row).toMatchObject({
        embryo: expected.embryo,
        language: "Albanian",
        form: expected.form,
        embryoRelation: "exact_form",
        relationOperationIds: [],
        attestationTruth: "fact",
        sourceStatus: "research_candidate",
        historicalOriginClaim: "not_claimed",
        historicalTransmissionClaim: "not_claimed",
        winnerClaim: "not_claimed",
        languageSuperiorityClaim: "not_claimed",
        candidateTruthClaim: "not_claimed",
        userDecisionPosture: "user_decides",
      });
      expect(row?.citations.map((citation) => citation.citationId)).toEqual(
        expected.citationIds,
      );
      expect(row?.citations.every((citation) => citation.attestedForm === expected.form)).toBe(
        true,
      );
      expect(row?.functionalHypotheses).toHaveLength(1);
      expect(row?.functionalHypotheses[0]).toMatchObject({
        targetWord: "sterile",
        functionalBridgeTruth: "hypothesis",
        claimBoundary: "functional_hypothesis_only",
        evidenceBasis: "functional_correspondence",
      });
    }
  });

  it("projects the evidence as research-only without reviewed membership or a winner", () => {
    const rows = loadMultiSourceFunctionalResearchEvidenceCatalogV0_1();

    for (const expected of STERILE_RESEARCH_EVIDENCE) {
      const row = rows.find(
        (candidate) => candidate.researchEvidenceId === expected.id,
      );

      expect(row).toBeDefined();
      expect(
        isReviewedExternalLexiconSourceIdInProductionMembershipV0_1(
          expected.id,
        ),
      ).toBe(false);

      const sourceRecords = buildMultiSourceFunctionalResearchInputsV0_1({
        targetWord: "sterile",
        embryo: expected.embryo,
        rows: row ? [row] : [],
      });

      expect(sourceRecords).toHaveLength(1);
      expect(sourceRecords[0]).toMatchObject({
        sourceId: expected.id,
        form: expected.form,
        evidenceBasis: "functional_correspondence",
        attestationTruth: "fact",
        functionalBridgeTruth: "hypothesis",
        sourceStatus: "research_candidate",
        embryoRelation: "exact_form",
        relationOperationIds: [],
      });
      expect(sourceRecords[0]?.citationRefs).toEqual(expected.citationIds);

      const groups = buildSourceAttestedFunctionalResearchInputGroupsV0_1({
        targetWord: "sterile",
        rows: row ? [row] : [],
      });

      expect(groups).toHaveLength(1);
      const witnesses = discoverSourceAttestedFunctionalWitnessesV0_1({
        targetWord: "sterile",
        embryo: expected.embryo,
        sources: groups[0]?.sources ?? [],
      });
      const projected = projectMultiSourceFunctionalResearchWitnessesV0_1(
        witnesses,
      );

      expect(projected).toHaveLength(1);
      expect(projected[0]).toMatchObject({
        targetWord: "sterile",
        displayForm: expected.form,
        form: expected.form,
        candidateLanguage: "Albanian",
        sourceKind: "multi_source_research_witness",
        sourceId: expected.id,
        sourceStatus: "research_candidate",
        claimType: "functionalMotivation",
        claimBoundary: "research_functional_hypothesis_only",
        evidenceBasis: "functional_correspondence",
        attestationTruth: "fact",
        functionalBridgeTruth: "hypothesis",
        embryoRelation: "exact_form",
        historicalOriginClaim: "not_claimed",
        winnerClaim: "not_claimed",
        candidateTruthClaim: "not_claimed",
        userDecisionPosture: "user_decides",
      });
      expect(projected[0]?.evidenceRefs).toEqual(expected.citationIds);
    }
  });

  it("preserves ER and does not create Albanian production or historical claims", () => {
    const rows = loadMultiSourceFunctionalResearchEvidenceCatalogV0_1();

    expect(rows.filter((row) => row.embryo === "ER")).toHaveLength(2);
    expect(
      rows.filter((row) =>
        STERILE_RESEARCH_EVIDENCE.some(
          (expected) => expected.id === row.researchEvidenceId,
        ),
      ),
    ).toHaveLength(4);
    expect(
      rows.some(
        (row) =>
          row.language === "Albanian" &&
          row.sourceStatus === "reviewed_accepted" &&
          row.functionalHypotheses.some(
            (hypothesis) => hypothesis.targetWord === "sterile",
          ),
      ),
    ).toBe(false);
  });
});
