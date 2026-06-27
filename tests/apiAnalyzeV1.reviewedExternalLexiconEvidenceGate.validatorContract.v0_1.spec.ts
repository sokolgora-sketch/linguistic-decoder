import fs from "node:fs";
import path from "node:path";

type CitationStatus =
  | "missing"
  | "present_unreviewed"
  | "reviewed_accepted"
  | "reviewed_rejected"
  | "superseded";

type CitationType =
  | "dictionary_entry"
  | "grammar_entry"
  | "corpus_line"
  | "academic_lexical_reference"
  | "reviewed_scanned_source"
  | "reviewed_archive_copy"
  | "project_doc"
  | "project_fixture"
  | "project_snapshot"
  | "seed_row"
  | "model_output";

type SourceStatus =
  | "missing_source"
  | "draft_source"
  | "review_pending"
  | "reviewed_accepted"
  | "reviewed_rejected"
  | "superseded";

type SourceKind =
  | "reviewed_static_source"
  | "reviewed_dictionary_source"
  | "reviewed_lexical_source"
  | "reviewed_human_curation_source"
  | "reviewed_provider_capture_source"
  | "SEED"
  | "EXAMPLE"
  | "FIXTURE_ONLY"
  | "MODEL_OUTPUT_UNREVIEWED"
  | "SYMBOLIC_RESONANCE_ONLY"
  | "HISTORICAL_CONTEXT_ONLY";

type ExternalCitation = {
  citationId: string;
  citationStatus: CitationStatus;
  citationType: CitationType;
  sourceTitle: string | null;
  sourceAuthorOrEditor: string | null;
  sourcePublisherOrHost: string | null;
  sourceDateOrVersion: string | null;
  sourceUrlOrArchiveRef: string | null;
  entryLocator: string | null;
  attestedForm: string | null;
  attestedGloss: string | null;
  attestedGrammarNote: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  sourceHashOrArchiveHash: string | null;
};

type CandidateSourceRow = {
  sourceId: string;
  sourceKind: SourceKind;
  sourceStatus: SourceStatus;
  candidateId: string;
  displayForm: string;
  candidateLanguage: string;
  embryo: string;
  isolatedStandaloneForm: string | null;
  plainStandaloneGloss: string | null;
  sourceNote: string | null;
  semanticBridge: string | null;
  originClaim: false;
  historicalTransmissionClaim: false;
  winnerClaim: false;
  languageSuperiorityClaim: false;
  candidateTruthClaim: false;
  publicationEvidenceClaim: false;
  scientificEvidenceClaim: false;
  userDecisionPosture: "user_decides" | null;
  externalCitations: ExternalCitation[];
};

const INTERNAL_CITATION_TYPES: ReadonlySet<CitationType> = new Set([
  "project_doc",
  "project_fixture",
  "project_snapshot",
  "seed_row",
  "model_output",
]);

const NON_VALIDATING_SOURCE_KINDS: ReadonlySet<SourceKind> = new Set([
  "SEED",
  "EXAMPLE",
  "FIXTURE_ONLY",
  "MODEL_OUTPUT_UNREVIEWED",
  "SYMBOLIC_RESONANCE_ONLY",
  "HISTORICAL_CONTEXT_ONLY",
]);

function norm(value: string | null | undefined): string {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("en-US");
}

function hasSplitDivideGloss(value: string | null | undefined): boolean {
  const text = norm(value);
  return /\b(split|divide|separate|separation|cut|share|divided)\b/.test(text);
}

function hasKnowGloss(value: string | null | undefined): boolean {
  const text = norm(value);
  return /\b(know|knowing|knowledge|i know)\b/.test(text);
}

function hasGiveGloss(value: string | null | undefined): boolean {
  const text = norm(value);
  return /\b(give|gave|given)\b/.test(text);
}

function evaluateContract(row: CandidateSourceRow): {
  eligible: boolean;
  validationOutcome: "source_validation_eligible" | "blocked";
  validationReasons: string[];
  originClaim: "not_claimed";
  userDecisionPosture: "user_decides" | null;
} {
  const reasons = new Set<string>();

  if (NON_VALIDATING_SOURCE_KINDS.has(row.sourceKind)) {
    if (row.sourceKind === "SEED") reasons.add("sourceKind_seed_not_validation");
    else if (row.sourceKind === "MODEL_OUTPUT_UNREVIEWED") reasons.add("externalCitation_model_output_only");
    else if (row.sourceKind === "SYMBOLIC_RESONANCE_ONLY") reasons.add("symbolic_resonance_not_validation");
    else if (row.sourceKind === "HISTORICAL_CONTEXT_ONLY") reasons.add("historical_context_not_validation");
    else reasons.add("sourceKind_not_validation");
  }

  if (row.sourceStatus !== "reviewed_accepted") {
    reasons.add("source_not_reviewed_accepted");
  }

  if (!row.isolatedStandaloneForm) reasons.add("missing_isolatedStandaloneForm");
  if (!row.plainStandaloneGloss) reasons.add("missing_plainStandaloneGloss");
  if (!row.sourceNote) reasons.add("missing_sourceNote");
  if (!row.semanticBridge) reasons.add("missing_semanticBridge");
  if (row.userDecisionPosture !== "user_decides") reasons.add("user_decision_posture_missing");

  if (row.externalCitations.length === 0) {
    reasons.add("missing_externalCitation");
  }

  const reviewedExternalCitations = row.externalCitations.filter((citation) => {
    if (citation.citationStatus !== "reviewed_accepted") {
      reasons.add("externalCitation_not_reviewed_accepted");
    }

    if (INTERNAL_CITATION_TYPES.has(citation.citationType)) {
      if (citation.citationType === "seed_row") reasons.add("externalCitation_seed_source_only");
      else if (citation.citationType === "project_fixture") reasons.add("externalCitation_example_fixture_only");
      else if (citation.citationType === "model_output") reasons.add("externalCitation_model_output_only");
      else reasons.add("externalCitation_internal_source_only");
    }

    if (!citation.entryLocator) reasons.add("externalCitation_missing_locator");
    if (!citation.attestedForm) reasons.add("externalCitation_missing_attestedForm");
    if (!citation.attestedGloss) reasons.add("externalCitation_missing_attestedGloss");

    return (
      citation.citationStatus === "reviewed_accepted" &&
      !INTERNAL_CITATION_TYPES.has(citation.citationType) &&
      Boolean(citation.entryLocator) &&
      Boolean(citation.attestedForm) &&
      Boolean(citation.attestedGloss)
    );
  });

  if (reviewedExternalCitations.length === 0) {
    reasons.add("externalCitation_not_reviewed_accepted");
  }

  if (row.candidateId === "albanian-da-dam-damage-functional") {
    const exactDaSplit = reviewedExternalCitations.some(
      (citation) => norm(citation.attestedForm) === "da" && hasSplitDivideGloss(citation.attestedGloss),
    );

    const derivativeInsteadOfEmbryo = reviewedExternalCitations.some((citation) =>
      ["ndaj", "ndarë", "ndare"].includes(norm(citation.attestedForm)),
    );

    const gaveCollision = reviewedExternalCitations.some(
      (citation) => norm(citation.attestedForm) === "da" && hasGiveGloss(citation.attestedGloss),
    );

    if (derivativeInsteadOfEmbryo) reasons.add("externalCitation_derivative_not_embryo");
    if (gaveCollision) reasons.add("externalCitation_homophone_collision");
    if (gaveCollision) reasons.add("externalCitation_gloss_mismatch");

    if (!exactDaSplit) {
      reasons.add("da_quarantine_missing_reviewed_exact_external_citation");
    }
  }

  if (row.candidateId === "albanian-shtu-di-study-functional") {
    const exactDiKnow = reviewedExternalCitations.some(
      (citation) => norm(citation.attestedForm) === "di" && hasKnowGloss(citation.attestedGloss),
    );

    if (!exactDiKnow) {
      reasons.add("di_missing_reviewed_external_citation");
    }

    if (!row.semanticBridge) {
      reasons.add("di_composition_bridge_missing");
    }
  }

  const validationReasons = [...reasons].sort();
  const eligible = validationReasons.length === 0;

  return {
    eligible,
    validationOutcome: eligible ? "source_validation_eligible" : "blocked",
    validationReasons,
    originClaim: "not_claimed",
    userDecisionPosture: row.userDecisionPosture,
  };
}

function reviewedCitation(overrides: Partial<ExternalCitation> = {}): ExternalCitation {
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

function baseRow(overrides: Partial<CandidateSourceRow> = {}): CandidateSourceRow {
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
  it("keeps the gate docs and accepted review aligned with the validator-contract next task", () => {
    const root = process.cwd();
    const gateDoc = fs.readFileSync(
      path.join(root, "docs/open-instrument/reviewed-external-lexicon-evidence-gate-embryo-first-source-validation-v0.1.md"),
      "utf8",
    );
    const reviewDoc = fs.readFileSync(
      path.join(
        root,
        "docs/open-instrument/reviews/reviewed-external-lexicon-evidence-gate-embryo-first-source-validation-review-v0.1.md",
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
      "REVIEWED_EXTERNAL_LEXICON_EVIDENCE_GATE_EMBRYO_FIRST_SOURCE_VALIDATION_V0_1_REVIEWED_ACCEPTED_READY_FOR_VALIDATOR_CONTRACT",
    );
    expect(reviewDoc).toContain("Internal project sources do not satisfy live lexical evidence.");
    expect(reviewDoc).toContain("Shape validation alone is insufficient.");
    expect(reviewDoc).toContain(
      "test(open-instrument): add reviewed external lexicon evidence gate validator contract v0.1",
    );
  });

  it("blocks shape-valid source rows when external lexical citations are missing", () => {
    const projected = evaluateContract(baseRow({ externalCitations: [] }));

    expect(projected.validationOutcome).toBe("blocked");
    expect(projected.eligible).toBe(false);
    expect(projected.originClaim).toBe("not_claimed");
    expect(projected.userDecisionPosture).toBe("user_decides");
    expect(projected.validationReasons).toEqual(
      expect.arrayContaining(["missing_externalCitation", "externalCitation_not_reviewed_accepted"]),
    );
  });

  it("blocks internal project artifacts even when citation-shaped metadata is present", () => {
    const projected = evaluateContract(
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
    const projected = evaluateContract(
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
    const modelOnly = evaluateContract(
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

    const fixtureOnly = evaluateContract(
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
    const projected = evaluateContract(
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

  it("does not allow ndaj or ndarë derivative evidence to prove isolated two-letter da", () => {
    const projected = evaluateContract(
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
        "externalCitation_derivative_not_embryo",
        "da_quarantine_missing_reviewed_exact_external_citation",
      ]),
    );
  });

  it("separates DA split from DA give homophone collision", () => {
    const projected = evaluateContract(
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
    const projected = evaluateContract(baseRow());

    expect(projected.validationOutcome).toBe("source_validation_eligible");
    expect(projected.eligible).toBe(true);
    expect(projected.validationReasons).toEqual([]);
    expect(projected.originClaim).toBe("not_claimed");
    expect(projected.userDecisionPosture).toBe("user_decides");
  });

  it("keeps DI citation pending when the composition bridge is missing", () => {
    const projected = evaluateContract(baseRow({ semanticBridge: null }));

    expect(projected.validationOutcome).toBe("blocked");
    expect(projected.validationReasons).toEqual(
      expect.arrayContaining(["missing_semanticBridge", "di_composition_bridge_missing"]),
    );
  });

  it("blocks DI when a reviewed citation is present but does not attest di as know/knowledge", () => {
    const projected = evaluateContract(
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
