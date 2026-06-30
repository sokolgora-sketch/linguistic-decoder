import fs from "node:fs";
import path from "node:path";

import {
  evaluateReviewedExternalLexiconEvidenceGateV0_1,
  type ReviewedExternalLexiconCandidateSourceRowV0_1,
  type ReviewedExternalLexiconCitationV0_1,
} from "@/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1";

function reviewedCitation(
  overrides: Partial<ReviewedExternalLexiconCitationV0_1> = {},
): ReviewedExternalLexiconCitationV0_1 {
  return {
    citationId: "contract-fixture-reviewed-external-citation-v0",
    citationStatus: "reviewed_accepted",
    citationType: "dictionary_entry",
    sourceTitle: "Contract fixture external lexical source",
    sourceAuthorOrEditor: "Contract fixture reviewer",
    sourcePublisherOrHost: "external-contract-fixture",
    sourceDateOrVersion: "v0.1",
    sourceUrlOrArchiveRef: "contract-fixture://external-lexicon/source",
    entryLocator: "entry:di",
    attestedForm: "di",
    attestedGloss: "know",
    attestedGrammarNote: "verb",
    reviewedBy: "contract-review",
    reviewedAt: "2026-06-27",
    reviewNote: "synthetic reviewed citation shape; not a live lexical source row",
    sourceHashOrArchiveHash: "sha256-contract-fixture",
    ...overrides,
  };
}

function baseRow(
  overrides: Partial<ReviewedExternalLexiconCandidateSourceRowV0_1> = {},
): ReviewedExternalLexiconCandidateSourceRowV0_1 {
  return {
    sourceId: "contract-fixture-source-row-v0",
    sourceKind: "reviewed_dictionary_source",
    sourceStatus: "reviewed_accepted",
    candidateId: "albanian-shtu-di-study-functional",
    displayForm: "SHTU + DI → STUDY",
    candidateLanguage: "Albanian",
    embryo: "DI",
    isolatedStandaloneForm: "di",
    plainStandaloneGloss: "know / knowledge",
    sourceNote: "synthetic contract source row; not live evidence",
    semanticBridge: "knowledge is made internal through study",
    originClaim: false,
    historicalTransmissionClaim: false,
    winnerClaim: false,
    languageSuperiorityClaim: false,
    candidateTruthClaim: false,
    publicationEvidenceClaim: false,
    scientificEvidenceClaim: false,
    userDecisionPosture: "user_decides",
    externalCitations: [reviewedCitation()],
    ...overrides,
  };
}

describe("reviewed external lexicon evidence gate validator contract v0.1", () => {
  it("keeps the gate docs and accepted review aligned with the validator implementation task", () => {
    const root = process.cwd();
    const gateDoc = fs.readFileSync(
      path.join(root, "docs/open-instrument/reviewed-external-lexicon-evidence-gate-embryo-first-source-validation-v0.1.md"),
      "utf8",
    );
    const reviewDoc = fs.readFileSync(
      path.join(
        root,
        "docs/open-instrument/reviews/reviewed-external-lexicon-evidence-gate-validator-contract-review-v0.1.md",
      ),
      "utf8",
    );

    expect(gateDoc).toContain(
      "REVIEWED_EXTERNAL_LEXICON_EVIDENCE_GATE_EMBRYO_FIRST_SOURCE_VALIDATION_V0_1_DEFINED_PENDING_REVIEW",
    );
    expect(gateDoc).toContain("Internal sources cannot satisfy the external lexical citation gate.");
    expect(gateDoc).toContain("The candidate `albanian-da-dam-damage-functional` is quarantined for live validation.");
    expect(gateDoc).toContain("A real `DI` citation does not automatically prove the full composition.");

    expect(reviewDoc).toContain(
      "REVIEWED_EXTERNAL_LEXICON_EVIDENCE_GATE_VALIDATOR_CONTRACT_V0_1_REVIEWED_ACCEPTED_READY_FOR_IMPLEMENTATION",
    );
    expect(reviewDoc).toContain("shape validity alone is insufficient");
    expect(reviewDoc).toContain("The implementation should not promote live candidates yet.");
    expect(reviewDoc).toContain("test(open-instrument): implement reviewed external lexicon evidence gate validator v0.1");
  });

  it("blocks shape-valid source rows when external lexical citations are missing", () => {
    const projected = evaluateReviewedExternalLexiconEvidenceGateV0_1(baseRow({ externalCitations: [] }));

    expect(projected.validationOutcome).toBe("blocked");
    expect(projected.eligible).toBe(false);
    expect(projected.originClaim).toBe("not_claimed");
    expect(projected.userDecisionPosture).toBe("user_decides");
    expect(projected.validationReasons).toEqual(
      expect.arrayContaining(["missing_externalCitation", "externalCitation_not_reviewed_accepted"]),
    );
  });

  it("blocks internal project artifacts even when citation-shaped metadata is present", () => {
    const projected = evaluateReviewedExternalLexiconEvidenceGateV0_1(
      baseRow({
        externalCitations: [
          reviewedCitation({
            citationType: "project_doc",
            sourceUrlOrArchiveRef: "repo://docs/open-instrument/internal-only.md",
            entryLocator: "internal-doc-anchor",
            attestedForm: "di",
            attestedGloss: "know",
          }),
        ],
      }),
    );

    expect(projected.validationOutcome).toBe("blocked");
    expect(projected.validationReasons).toEqual(
      expect.arrayContaining(["externalCitation_internal_source_only", "externalCitation_not_reviewed_accepted"]),
    );
  });

  it("blocks SEED source kind and seed-row citations from validation", () => {
    const projected = evaluateReviewedExternalLexiconEvidenceGateV0_1(
      baseRow({
        sourceKind: "SEED",
        externalCitations: [
          reviewedCitation({
            citationType: "seed_row",
            sourceUrlOrArchiveRef: "repo://seed-row",
            entryLocator: "seed:di",
            attestedForm: "di",
            attestedGloss: "know",
          }),
        ],
      }),
    );

    expect(projected.validationOutcome).toBe("blocked");
    expect(projected.validationReasons).toEqual(
      expect.arrayContaining([
        "sourceKind_seed_not_validation",
        "externalCitation_seed_source_only",
        "externalCitation_not_reviewed_accepted",
      ]),
    );
  });

  it("blocks model output, example fixtures, and snapshots as lexical evidence", () => {
    const modelOnly = evaluateReviewedExternalLexiconEvidenceGateV0_1(
      baseRow({
        externalCitations: [
          reviewedCitation({
            citationType: "model_output",
            sourceUrlOrArchiveRef: "model://provider-output",
            entryLocator: "model-answer",
            attestedForm: "di",
            attestedGloss: "know",
          }),
        ],
      }),
    );

    const fixtureOnly = evaluateReviewedExternalLexiconEvidenceGateV0_1(
      baseRow({
        externalCitations: [
          reviewedCitation({
            citationType: "project_fixture",
            sourceUrlOrArchiveRef: "repo://tests/fixtures",
            entryLocator: "fixture:di",
            attestedForm: "di",
            attestedGloss: "know",
          }),
        ],
      }),
    );

    expect(modelOnly.validationReasons).toEqual(
      expect.arrayContaining(["externalCitation_model_output_only", "externalCitation_not_reviewed_accepted"]),
    );
    expect(fixtureOnly.validationReasons).toEqual(
      expect.arrayContaining(["externalCitation_example_fixture_only", "externalCitation_not_reviewed_accepted"]),
    );
  });

  it("keeps DA quarantined without reviewed exact external citation for da as split/divide", () => {
    const projected = evaluateReviewedExternalLexiconEvidenceGateV0_1(
      baseRow({
        candidateId: "albanian-da-dam-damage-functional",
        displayForm: "DA → DAM → DAMAGE",
        embryo: "DA",
        isolatedStandaloneForm: "da",
        plainStandaloneGloss: "split / divide",
        semanticBridge: "what is split or broken becomes harmed or damaged",
        externalCitations: [],
      }),
    );

    expect(projected.validationOutcome).toBe("blocked");
    expect(projected.validationReasons).toEqual(
      expect.arrayContaining([
        "missing_externalCitation",
        "externalCitation_not_reviewed_accepted",
        "da_quarantine_missing_reviewed_exact_external_citation",
      ]),
    );
  });


  it("allows reviewed Gheg da as split/divide free-operator evidence", () => {
    const projected = evaluateReviewedExternalLexiconEvidenceGateV0_1(
      baseRow({
        candidateId: "albanian-da-dam-damage-functional",
        displayForm: "DA → DAM → DAMAGE",
        embryo: "DA",
        isolatedStandaloneForm: "da",
        plainStandaloneGloss: "split / divide",
        semanticBridge: "what is split or broken becomes harmed or damaged",
        externalCitations: [
          reviewedCitation({
            citationId: "contract-fixture-gheg-da-split-v0",
            attestedForm: "da",
            attestedGloss: "split / divide",
            attestedGrammarNote:
              "Gheg Albanian free operator, as in E kom da bukën për gjysë.",
            entryLocator: "entry:gheg-da-split",
          }),
        ],
      }),
    );

    expect(projected.validationOutcome).toBe("source_validation_eligible");
    expect(projected.eligible).toBe(true);
    expect(projected.validationReasons).toEqual([]);
  });

  it("allows reviewed Tosk daj as split/divide free-operator cognate evidence", () => {
    const projected = evaluateReviewedExternalLexiconEvidenceGateV0_1(
      baseRow({
        candidateId: "albanian-da-dam-damage-functional",
        displayForm: "DA → DAM → DAMAGE",
        embryo: "DA",
        isolatedStandaloneForm: "da",
        plainStandaloneGloss: "split / divide",
        semanticBridge: "what is split or broken becomes harmed or damaged",
        externalCitations: [
          reviewedCitation({
            citationId: "contract-fixture-tosk-daj-split-v0",
            attestedForm: "daj",
            attestedGloss: "split / divide",
            attestedGrammarNote:
              "Tosk Albanian standalone cognate/free-operator form for split/divide.",
            entryLocator: "entry:tosk-daj-split",
          }),
        ],
      }),
    );

    expect(projected.validationOutcome).toBe("source_validation_eligible");
    expect(projected.eligible).toBe(true);
    expect(projected.validationReasons).toEqual([]);
  });

  it("does not allow ndaj or ndarë derivative evidence to prove isolated two-letter da", () => {
    const projected = evaluateReviewedExternalLexiconEvidenceGateV0_1(
      baseRow({
        candidateId: "albanian-da-dam-damage-functional",
        displayForm: "DA → DAM → DAMAGE",
        embryo: "DA",
        isolatedStandaloneForm: "da",
        plainStandaloneGloss: "split / divide",
        semanticBridge: "what is split or broken becomes harmed or damaged",
        externalCitations: [
          reviewedCitation({
            citationId: "contract-fixture-ndaj-v0",
            attestedForm: "ndaj",
            attestedGloss: "divide / share",
            entryLocator: "entry:ndaj",
          }),
          reviewedCitation({
            citationId: "contract-fixture-ndare-v0",
            attestedForm: "ndarë",
            attestedGloss: "divided",
            entryLocator: "entry:ndare",
          }),
        ],
      }),
    );

    expect(projected.validationOutcome).toBe("blocked");
    expect(projected.validationReasons).toEqual(
      expect.arrayContaining([
        "da_family_supported_by_derivative_form",
        "externalCitation_derivative_family_support_not_exact_embryo",
        "da_quarantine_missing_reviewed_exact_external_citation",
      ]),
    );
  });

  it("separates DA split from DA give homophone collision", () => {
    const projected = evaluateReviewedExternalLexiconEvidenceGateV0_1(
      baseRow({
        candidateId: "albanian-da-dam-damage-functional",
        displayForm: "DA → DAM → DAMAGE",
        embryo: "DA",
        isolatedStandaloneForm: "da",
        plainStandaloneGloss: "split / divide",
        semanticBridge: "what is split or broken becomes harmed or damaged",
        externalCitations: [
          reviewedCitation({
            citationId: "contract-fixture-da-give-v0",
            attestedForm: "da",
            attestedGloss: "gave",
            entryLocator: "entry:da-gave",
          }),
        ],
      }),
    );

    expect(projected.validationOutcome).toBe("blocked");
    expect(projected.validationReasons).toEqual(
      expect.arrayContaining([
        "externalCitation_homophone_collision",
        "externalCitation_gloss_mismatch",
        "da_quarantine_missing_reviewed_exact_external_citation",
      ]),
    );
  });

  it("allows DI to become source-validation eligible only with reviewed external citation and semantic bridge", () => {
    const projected = evaluateReviewedExternalLexiconEvidenceGateV0_1(baseRow());

    expect(projected.validationOutcome).toBe("source_validation_eligible");
    expect(projected.eligible).toBe(true);
    expect(projected.validationReasons).toEqual([]);
    expect(projected.originClaim).toBe("not_claimed");
    expect(projected.userDecisionPosture).toBe("user_decides");
  });

  it("keeps DI citation pending when the composition bridge is missing", () => {
    const projected = evaluateReviewedExternalLexiconEvidenceGateV0_1(baseRow({ semanticBridge: null }));

    expect(projected.validationOutcome).toBe("blocked");
    expect(projected.validationReasons).toEqual(
      expect.arrayContaining(["missing_semanticBridge", "di_composition_bridge_missing"]),
    );
  });

  it("blocks DI when a reviewed citation is present but does not attest di as know/knowledge", () => {
    const projected = evaluateReviewedExternalLexiconEvidenceGateV0_1(
      baseRow({
        externalCitations: [
          reviewedCitation({
            attestedForm: "di",
            attestedGloss: "day",
            entryLocator: "entry:di-unrelated",
          }),
        ],
      }),
    );

    expect(projected.validationOutcome).toBe("blocked");
    expect(projected.validationReasons).toEqual(expect.arrayContaining(["di_missing_reviewed_external_citation"]));
  });
});
