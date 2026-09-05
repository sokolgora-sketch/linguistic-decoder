import type {
  MultiSourceFunctionalWitnessV0_1,
  MultiSourceTruthStatusV0_1,
} from "./multiSourceFunctionalDiscovery.v0_1";

/**
 * Distinct analysis-status identity reserved for source-backed,
 * non-reviewed functional research hypotheses.
 *
 * Do not alias this to candidate_only:
 *
 * candidate_only currently belongs to canonical/RootMap candidate
 * ownership and related proposal/quarantine lanes.
 *
 * A multi-source research witness has stronger provenance than a bare
 * candidate proposal, but its functional bridge is still not reviewed
 * production truth.
 */
export const RESEARCH_FUNCTIONAL_HYPOTHESIS_STATUS_V0_1 =
  "research_functional_hypothesis" as const;

export type MultiSourceFunctionalResearchProjectionV0_1 = {
  candidateId: string;

  /**
   * Explicit analyzed-word binding inherited from the witness.
   *
   * This prevents a source-backed functional hypothesis discovered
   * for one analyzed word from being silently attached to another.
   */
  targetWord: string;

  displayForm: string;
  form: string;

  candidateLanguage: string;
  language: string;

  embryo: string;

  embryoAuthority:
    MultiSourceFunctionalWitnessV0_1["embryoAuthority"];

  sourceKind:
    "multi_source_research_witness";

  sourceId: string;

  sourceStatus:
    MultiSourceFunctionalWitnessV0_1["sourceStatus"];

  claimType:
    "functionalMotivation";

  validationOutcome:
    "not_evaluated";

  rankGroup:
    "unresolved";

  plainStandaloneGloss:
    string;

  semanticBridge:
    string | null;

  evidenceRefs:
    readonly string[];

  embryoRelation:
    MultiSourceFunctionalWitnessV0_1["embryoRelation"];

  relationOperationIds:
    readonly string[];

  attestationTruth:
    MultiSourceTruthStatusV0_1;

  functionalBridgeTruth:
    MultiSourceTruthStatusV0_1;

  claimBoundary:
    "research_functional_hypothesis_only";

  historicalOriginClaim:
    "not_claimed";

  historicalTransmissionClaim:
    "not_claimed";

  winnerClaim:
    "not_claimed";

  languageSuperiorityClaim:
    "not_claimed";

  candidateTruthClaim:
    "not_claimed";

  userDecisionPosture:
    "user_decides";
};

/**
 * RED-stage pure projection seam.
 *
 * This function must eventually convert admissible research witnesses
 * into analyze-v1-compatible candidate material while preserving:
 *
 * - source provenance;
 * - source-attestation truth;
 * - functional-bridge truth;
 * - research-only status;
 * - no reviewed-production promotion;
 * - no origin/winner/candidate-truth claims.
 *
 * Runtime insertion is deliberately out of scope here.
 */
export function projectMultiSourceFunctionalResearchWitnessesV0_1(
  witnesses:
    readonly MultiSourceFunctionalWitnessV0_1[],
): MultiSourceFunctionalResearchProjectionV0_1[] {
  const projected:
    MultiSourceFunctionalResearchProjectionV0_1[] =
    [];

  const seenWitnessIds =
    new Set<string>();

  for (const witness of witnesses) {
    /**
     * This seam is research-only.
     *
     * reviewed_accepted belongs to the reviewed production path and
     * must not be re-labelled as an unreviewed research hypothesis.
     */
    if (
      witness.sourceStatus ===
      "reviewed_accepted"
    ) {
      continue;
    }

    const witnessId =
      witness.witnessId
        .normalize("NFC")
        .trim();

    const sourceId =
      witness.sourceId
        .normalize("NFC")
        .trim();

    const targetWord =
      witness.targetWord
        .normalize("NFC")
        .trim();

    const embryo =
      witness.embryo
        .normalize("NFC")
        .trim();

    const sourceForm =
      witness.sourceForm
        .normalize("NFC")
        .trim();

    const language =
      witness.language
        .normalize("NFC")
        .trim();

    const gloss =
      witness.gloss
        .normalize("NFC")
        .trim();

    if (
      !witnessId ||
      !sourceId ||
      !targetWord ||
      !embryo ||
      !sourceForm ||
      !language ||
      !gloss
    ) {
      continue;
    }

    if (
      seenWitnessIds.has(
        witnessId,
      )
    ) {
      continue;
    }

    seenWitnessIds.add(
      witnessId,
    );

    const semanticBridge =
      witness.semanticBridge == null
        ? null
        : witness.semanticBridge
            .normalize("NFC")
            .trim() || null;

    const evidenceRefs =
      witness.citationRefs
        .map((ref) =>
          ref
            .normalize("NFC")
            .trim(),
        )
        .filter(Boolean);

    if (
      evidenceRefs.length === 0
    ) {
      continue;
    }

    projected.push({
      candidateId:
        `research-functional:${witnessId}`,

      targetWord,

      displayForm:
        sourceForm,

      form:
        sourceForm,

      candidateLanguage:
        language,

      language,

      embryo,

      embryoAuthority:
        witness.embryoAuthority,

      sourceKind:
        "multi_source_research_witness",

      sourceId,

      sourceStatus:
        witness.sourceStatus,

      claimType:
        "functionalMotivation",

      validationOutcome:
        "not_evaluated",

      rankGroup:
        "unresolved",

      plainStandaloneGloss:
        gloss,

      semanticBridge,

      evidenceRefs,

      embryoRelation:
        witness.embryoRelation,

      relationOperationIds:
        [...witness.relationOperationIds],

      attestationTruth:
        witness.attestationTruth,

      functionalBridgeTruth:
        semanticBridge == null
          ? "unknown"
          : witness.functionalBridgeTruth,

      claimBoundary:
        "research_functional_hypothesis_only",

      historicalOriginClaim:
        "not_claimed",

      historicalTransmissionClaim:
        "not_claimed",

      winnerClaim:
        "not_claimed",

      languageSuperiorityClaim:
        "not_claimed",

      candidateTruthClaim:
        "not_claimed",

      userDecisionPosture:
        "user_decides",
    });
  }

  return projected;
}
