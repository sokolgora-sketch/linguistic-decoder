import {
  loadMultiSourceFunctionalResearchEvidenceCatalogV0_1,
  MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_CATALOG_VERSION_V0_1,
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
  admitOpenInstrumentResearchCatalogV0_1,
} from "@/shared/openInstrumentResearchCatalogAdmission.v0_1";
import {
  isReviewedExternalLexiconSourceIdInProductionMembershipV0_1,
} from "@/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";

const MAT_RESEARCH_EVIDENCE_ID =
  "research.external.albanian-mat-measure.v0_1";

describe("Open Instrument MAT research candidate v0.1", () => {
  it("preserves one qualified Albanian lexical fact and bounded target hypothesis", () => {
    const rows = loadMultiSourceFunctionalResearchEvidenceCatalogV0_1();
    const row = rows.find(
      (candidate) => candidate.researchEvidenceId === MAT_RESEARCH_EVIDENCE_ID,
    );

    expect(row).toBeDefined();
    expect(row).toMatchObject({
      embryo: "MAT",
      language: "Albanian",
      form: "mat",
      gloss: "measure / to measure (attested form; lemma mas)",
      embryoRelation: "exact_form",
      attestationTruth: "fact",
      sourceStatus: "research_candidate",
      historicalOriginClaim: "not_claimed",
      historicalTransmissionClaim: "not_claimed",
      winnerClaim: "not_claimed",
      candidateTruthClaim: "not_claimed",
      userDecisionPosture: "user_decides",
    });

    expect(row?.citations).toHaveLength(2);
    expect(row?.citations.map((citation) => citation.attestedForm)).toEqual([
      "mat",
      "mat",
    ]);
    expect(row?.citations[0]?.provenanceGroupId).toBe(
      "fjalori.online.albanian-mat.v0_1",
    );
    expect(row?.functionalHypotheses).toEqual([
      {
        targetWord: "mathematics",
        targetSenseId: "mathematics-sense",
        semanticBridge:
          "An independently attested Albanian measure-related lexical form may motivate a research-only functional comparison with mathematics; this does not assert morphology, historical derivation, or semantic identity.",
        functionalBridgeTruth: "hypothesis",
        claimBoundary: "functional_hypothesis_only",
        evidenceBasis: "functional_correspondence",
      },
    ]);
  });

  it("projects provenance as research-only without production membership", () => {
    const rows = loadMultiSourceFunctionalResearchEvidenceCatalogV0_1();
    const row = rows.find(
      (candidate) => candidate.researchEvidenceId === MAT_RESEARCH_EVIDENCE_ID,
    );

    expect(row).toBeDefined();
    expect(
      isReviewedExternalLexiconSourceIdInProductionMembershipV0_1(
        MAT_RESEARCH_EVIDENCE_ID,
      ),
    ).toBe(false);

    const sourceRecords = buildMultiSourceFunctionalResearchInputsV0_1({
      targetWord: "mathematics",
      targetSenseId: "mathematics-sense",
      preserveTargetSenseId: true,
      embryo: "MAT",
      rows: row ? [row] : [],
    });

    expect(sourceRecords).toHaveLength(1);
    expect(sourceRecords[0]).toMatchObject({
      sourceId: MAT_RESEARCH_EVIDENCE_ID,
      targetSenseId: "mathematics-sense",
      form: "mat",
      attestationTruth: "fact",
      functionalBridgeTruth: "hypothesis",
      sourceStatus: "research_candidate",
      embryoRelation: "exact_form",
    });
    expect(sourceRecords[0]?.citationRefs).toEqual([
      "research.external.albanian-mat-fjalori-online.citation.v0_1",
      "research.external.albanian-mas-kaikki.citation.v0_1",
    ]);

    const groups = buildSourceAttestedFunctionalResearchInputGroupsV0_1({
      targetWord: "mathematics",
      rows: row ? [row] : [],
    });
    expect(groups).toHaveLength(1);

    const witnesses = discoverSourceAttestedFunctionalWitnessesV0_1({
      targetWord: "mathematics",
      embryo: "MAT",
      sources: groups[0]?.sources ?? [],
    });
    expect(witnesses).toHaveLength(1);

    const projected = projectMultiSourceFunctionalResearchWitnessesV0_1(
      witnesses,
    );
    expect(projected).toHaveLength(1);
    expect(projected[0]).toMatchObject({
      targetWord: "mathematics",
      displayForm: "mat",
      form: "mat",
      candidateLanguage: "Albanian",
      sourceKind: "multi_source_research_witness",
      sourceId: MAT_RESEARCH_EVIDENCE_ID,
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
    expect(projected[0]?.evidenceRefs).toEqual([
      "research.external.albanian-mat-fjalori-online.citation.v0_1",
      "research.external.albanian-mas-kaikki.citation.v0_1",
    ]);

    const admission = admitOpenInstrumentResearchCatalogV0_1(
      {
        catalogVersion:
          MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_CATALOG_VERSION_V0_1,
        rows: rows.filter(
          (candidate) => candidate.researchEvidenceId !== MAT_RESEARCH_EVIDENCE_ID,
        ),
      },
      [row],
    );
    if (!admission.ok) throw new Error(admission.reasonCodes.join(", "));
    expect(admission.ok).toBe(true);
    expect(admission.dryRun).toMatchObject({
      currentRowCount: 94,
      incomingRowCount: 1,
      resultRowCount: 95,
      wouldChange: true,
      collisions: [],
    });
  });

  it("does not create a semantic M row or promote the MAT candidate", () => {
    const rows = loadMultiSourceFunctionalResearchEvidenceCatalogV0_1();

    expect(
      rows.some(
        (row) =>
          row.language === "Albanian" &&
          row.form.toLocaleUpperCase("en-US") === "M",
      ),
    ).toBe(false);

    expect(
      rows.filter(
        (row) => row.researchEvidenceId === MAT_RESEARCH_EVIDENCE_ID,
      ),
    ).toHaveLength(1);
    expect(
      isReviewedExternalLexiconSourceIdInProductionMembershipV0_1(
        MAT_RESEARCH_EVIDENCE_ID,
      ),
    ).toBe(false);
  });
});
