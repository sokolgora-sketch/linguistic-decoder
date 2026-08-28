import { discoverCanonicalOperatorCandidatesV0_1 } from "./canonicalOperatorDiscovery.v0_1";

export const ANALYSIS_STATUS_SCHEMA_VERSION_V0_1 =
  "open-instrument.analysis-status.v0_1" as const;

export type AnalysisStatusCodeV0_1 =
  | "reviewed_functional_evidence"
  | "research_functional_hypothesis"
  | "candidate_only"
  | "structural_unreviewed"
  | "null_no_supported_candidate";

export type AnalysisStatusClaimBoundaryV0_1 = {
  historicalOriginClaim: "not_claimed";
  historicalTransmissionClaim: "not_claimed";
  winnerClaim: "not_claimed";
  languageSuperiorityClaim: "not_claimed";
  linguisticOwnershipClaim: "not_claimed";
  candidateTruthClaim: "not_claimed";
  structuralOutputIsCandidateTruth: false;
  nullIsValid: true;
};

export type AnalysisStatusV0_1 = {
  schemaVersion: typeof ANALYSIS_STATUS_SCHEMA_VERSION_V0_1;
  status: AnalysisStatusCodeV0_1;
  summary: string;
  reviewedOperators: string[];
  candidateOnlyOperators: string[];
  researchHypothesisEmbryos: string[];
  structuralTokens: string[];
  claimBoundary: AnalysisStatusClaimBoundaryV0_1;
  userDecisionPosture: "user_decides";
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function uniqueStrings(values: readonly string[]): string[] {
  return [...new Set(values.filter((value) => value.trim().length > 0))];
}

function readStructuralTokens(result: UnknownRecord): string[] {
  const rootMap = isRecord(result.rootMap) ? result.rootMap : null;
  const tokens = Array.isArray(rootMap?.tokens) ? rootMap.tokens : [];

  return uniqueStrings(
    tokens
      .map((token) => (isRecord(token) ? token.token : null))
      .filter((token): token is string => typeof token === "string"),
  );
}

function operatorSummary(operators: readonly string[]): string {
  return operators.length > 0 ? operators.join(", ") : "none";
}

function readStructuralHypothesisCandidatesV0_1(
  result: UnknownRecord,
): string[] {
  const rows =
    Array.isArray(result.candidates)
      ? result.candidates
      : [];

  return uniqueStrings(
    rows.flatMap((candidate) => {
      if (!isRecord(candidate)) {
        return [];
      }

      const isStructuralHypothesis =
        candidate.claimType ===
          "structuralHypothesis" &&
        candidate.sourceKind ===
          "logic_derived_structural_hypothesis" &&
        candidate.rankGroup ===
          "structuralHypothesis" &&
        candidate.validationOutcome ===
          "not_evaluated" &&
        candidate.userDecisionPosture ===
          "user_decides";

      if (!isStructuralHypothesis) {
        return [];
      }

      const embryo =
        typeof candidate.embryo ===
          "string"
          ? candidate.embryo.trim()
          : "";

      return embryo
        ? [embryo]
        : [];
    }),
  );
}

function readVerifiedProposedFunctionalCandidatesV0_1(
  result: UnknownRecord,
): string[] {
  const rows =
    Array.isArray(result.candidates)
      ? result.candidates
      : [];

  return uniqueStrings(
    rows.flatMap((candidate) => {
      if (!isRecord(candidate)) {
        return [];
      }

      const verification =
        isRecord(
          candidate.proposalVerificationV0_1,
        )
          ? candidate
              .proposalVerificationV0_1
          : null;

      const isVerifiedProposed =
        candidate.claimType ===
          "functionalMotivation" &&
        candidate.sourceKind ===
          "automatic_llm_functional_proposal" &&
        candidate.sourceStatus ===
          "deterministically_verified_proposed" &&
        candidate.validationOutcome ===
          "not_evaluated" &&
        candidate.userDecisionPosture ===
          "user_decides" &&
        verification?.classification ===
          "Proposed";

      if (!isVerifiedProposed) {
        return [];
      }

      const label =
        typeof candidate.displayForm ===
          "string"
          ? candidate.displayForm.trim()
          : typeof candidate.form ===
              "string"
            ? candidate.form.trim()
            : "";

      return label
        ? [label]
        : [];
    }),
  );
}

function readResearchFunctionalHypothesisCandidatesV0_1(
  result: UnknownRecord,
  analyzedWord: string,
): string[] {
  const rows =
    Array.isArray(result.candidates)
      ? result.candidates
      : [];

  const normalizedAnalyzedWord =
    analyzedWord
      .trim()
      .toLocaleLowerCase("en-US");

  if (!normalizedAnalyzedWord) {
    return [];
  }

  return uniqueStrings(
    rows.flatMap((candidate) => {
      if (!isRecord(candidate)) {
        return [];
      }

      const candidateTargetWord =
        typeof candidate.targetWord ===
          "string"
          ? candidate.targetWord
              .trim()
              .toLocaleLowerCase("en-US")
          : "";

      const embryo =
        typeof candidate.embryo ===
          "string"
          ? candidate.embryo.trim()
          : "";

      const semanticBridge =
        typeof candidate.semanticBridge ===
          "string"
          ? candidate.semanticBridge.trim()
          : "";

      const evidenceRefs =
        Array.isArray(candidate.evidenceRefs)
          ? candidate.evidenceRefs
              .filter(
                (value): value is string =>
                  typeof value === "string",
              )
              .map((value) => value.trim())
              .filter(Boolean)
          : [];

      const sourceStatusIsResearch =
        candidate.sourceStatus ===
          "research_candidate" ||
        candidate.sourceStatus ===
          "reviewed_candidate";

      const attestationTruthIsUsable =
        candidate.attestationTruth ===
          "fact" ||
        candidate.attestationTruth ===
          "inference" ||
        candidate.attestationTruth ===
          "hypothesis";

      const functionalBridgeTruthIsUsable =
        candidate.functionalBridgeTruth ===
          "fact" ||
        candidate.functionalBridgeTruth ===
          "inference" ||
        candidate.functionalBridgeTruth ===
          "hypothesis";

      const isBoundedResearchFunctionalHypothesis =
        candidateTargetWord ===
          normalizedAnalyzedWord &&
        embryo.length > 0 &&
        candidate.sourceKind ===
          "multi_source_research_witness" &&
        sourceStatusIsResearch &&
        candidate.claimType ===
          "functionalMotivation" &&
        candidate.validationOutcome ===
          "not_evaluated" &&
        candidate.rankGroup ===
          "unresolved" &&
        semanticBridge.length > 0 &&
        evidenceRefs.length > 0 &&
        attestationTruthIsUsable &&
        functionalBridgeTruthIsUsable &&
        candidate.claimBoundary ===
          "research_functional_hypothesis_only" &&
        candidate.historicalOriginClaim ===
          "not_claimed" &&
        candidate.historicalTransmissionClaim ===
          "not_claimed" &&
        candidate.winnerClaim ===
          "not_claimed" &&
        candidate.languageSuperiorityClaim ===
          "not_claimed" &&
        candidate.candidateTruthClaim ===
          "not_claimed" &&
        candidate.userDecisionPosture ===
          "user_decides";

      return isBoundedResearchFunctionalHypothesis
        ? [embryo]
        : [];
    }),
  );
}

export function isReviewedFunctionalEvidenceLineV0_1(
  value: unknown,
): boolean {
  if (typeof value !== "string") {
    return false;
  }

  const normalized =
    value
      .trim()
      .toLocaleLowerCase("en-US");

  return (
    normalized.startsWith(
      "reviewed functional free-operator evidence:",
    ) &&
    normalized.includes(
      "historicaloriginclaim=not_claimed",
    ) &&
    normalized.includes(
      "winnerclaim=not_claimed",
    ) &&
    normalized.includes(
      "languagesuperiorityclaim=not_claimed",
    ) &&
    normalized.includes(
      "userdecisionposture=user_decides",
    )
  );
}

export function buildAnalysisStatusV0_1(resultValue: unknown): AnalysisStatusV0_1 {
  type UnknownRecord =
    Record<string, unknown>;

  const asRecord = (
    value: unknown,
  ): UnknownRecord | null =>
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
      ? (value as UnknownRecord)
      : null;

  const normalizeOperatorId = (
    value: unknown,
  ): string =>
    typeof value === "string"
      ? value
          .trim()
          .toLocaleUpperCase("en-US")
      : "";

  const uniqueOperatorIds = (
    values: readonly string[],
  ): string[] =>
    [...new Set(values.filter(Boolean))];

  const resultRecord =
    asRecord(resultValue);

  const basis =
    String(
      resultRecord?.word ??
        resultRecord?.sanitized ??
        "",
    ).trim();

  const discoveries =
    discoverCanonicalOperatorCandidatesV0_1(
      basis,
    );

  const rootMap =
    asRecord(resultRecord?.rootMap);

  const rootMapKeys =
    Array.isArray(rootMap?.keys)
      ? rootMap.keys
          .map(asRecord)
          .filter(
            (
              key,
            ): key is UnknownRecord =>
              key !== null,
          )
      : [];

  const structuralTokens =
    uniqueOperatorIds(
      Array.isArray(rootMap?.tokens)
        ? rootMap.tokens.map((token) => {
            if (
              typeof token === "string"
            ) {
              return normalizeOperatorId(
                token,
              );
            }

            const tokenRecord =
              asRecord(token);

            return normalizeOperatorId(
              tokenRecord?.token,
            );
          })
        : [],
    );

  const hasMatchingEmittedReviewedEvidence = (
    operatorId: string,
  ): boolean =>
    rootMapKeys.some((key) => {
      const keyOperatorId =
        normalizeOperatorId(
          key.token,
        );

      if (
        keyOperatorId !== operatorId
      ) {
        return false;
      }

      const evidence =
        key.evidence;

      return (
        Array.isArray(evidence) &&
        evidence.some(
          isReviewedFunctionalEvidenceLineV0_1,
        )
      );
    });

  const allDiscoveredOperators =
    uniqueOperatorIds(
      discoveries.map(
        (discovery) =>
          normalizeOperatorId(
            discovery.operatorId,
          ),
      ),
    );

  const reviewedOperators =
    uniqueOperatorIds(
      discoveries
        .filter((discovery) => {
          const operatorId =
            normalizeOperatorId(
              discovery.operatorId,
            );

          return (
            discovery
              .reviewedEvidenceEligible ===
              true &&
            hasMatchingEmittedReviewedEvidence(
              operatorId,
            )
          );
        })
        .map((discovery) =>
          normalizeOperatorId(
            discovery.operatorId,
          ),
        ),
    );

  const reviewedOperatorSet =
    new Set(reviewedOperators);

  const candidateOnlyOperators =
    allDiscoveredOperators.filter(
      (operatorId) =>
        !reviewedOperatorSet.has(
          operatorId,
        ),
    );

  const proposedFunctionalCandidates =
    resultRecord
      ? readVerifiedProposedFunctionalCandidatesV0_1(
          resultRecord,
        )
      : [];

  const structuralHypothesisCandidates =
    resultRecord
      ? readStructuralHypothesisCandidatesV0_1(
          resultRecord,
        )
      : [];

  const researchHypothesisEmbryos =
    resultRecord
      ? readResearchFunctionalHypothesisCandidatesV0_1(
          resultRecord,
          basis,
        )
      : [];

  // Logic-derived structural hypotheses are a lower-precedence
  // status-driving layer. They become aggregate structuralTokens
  // only when no reviewed, research, proposed, canonical-candidate,
  // or existing RootMap structural layer already owns the status.
  const structuralHypothesesDriveStatus =
    reviewedOperators.length === 0 &&
    researchHypothesisEmbryos.length === 0 &&
    proposedFunctionalCandidates.length === 0 &&
    candidateOnlyOperators.length === 0 &&
    structuralTokens.length === 0 &&
    structuralHypothesisCandidates.length > 0;

  const statusStructuralTokens =
    structuralHypothesesDriveStatus
      ? structuralHypothesisCandidates
      : structuralTokens;

  let status:
    AnalysisStatusCodeV0_1;

  let summary: string;

  if (reviewedOperators.length > 0) {
    status =
      "reviewed_functional_evidence";

    summary =
      `Bounded reviewed functional evidence is available for ${reviewedOperators.join(
        ", ",
      )}. This is functional evidence, not a historical-origin or winner claim.`;
  } else if (
    researchHypothesisEmbryos.length > 0
  ) {
    status =
      "research_functional_hypothesis";

    summary =
      `Source-backed functional research hypothes${researchHypothesisEmbryos.length === 1 ? "is" : "es"} available for ${researchHypothesisEmbryos.join(
        ", ",
      )}. ${researchHypothesisEmbryos.length === 1 ? "It is" : "They are"} not reviewed functional evidence, candidate truth, or historical-origin evidence. User decides.`;
  } else if (
    proposedFunctionalCandidates.length > 0
  ) {
    status =
      "candidate_only";

    summary =
      `Deterministically verified Proposed functional candidate${proposedFunctionalCandidates.length === 1 ? "" : "s"} available: ${proposedFunctionalCandidates.join(
        ", ",
      )}. ${proposedFunctionalCandidates.length === 1 ? "It remains an unreviewed functional hypothesis" : "They remain unreviewed functional hypotheses"}, not candidate truth or historical-origin evidence. User decides.`;
  } else if (
    candidateOnlyOperators.length > 0
  ) {
    status =
      "candidate_only";

    summary =
      `Structural canonical candidates were detected for ${candidateOnlyOperators.join(
        ", ",
      )}, but reviewed functional evidence is not authorized.`;
  } else if (
    structuralTokens.length > 0
  ) {
    status =
      "structural_unreviewed";

    summary =
      `Structural RootMap output was emitted for ${structuralTokens.join(
        ", ",
      )}, but no reviewed canonical operator evidence applies.`;
  } else if (
    structuralHypothesisCandidates.length > 0
  ) {
    status =
      "structural_unreviewed";

    summary =
      `Deterministic structural hypothes${structuralHypothesisCandidates.length === 1 ? "is" : "es"} available for ${structuralHypothesisCandidates.join(
        ", ",
      )}. Independent functional meaning and reviewed evidence remain unclaimed.`;
  } else {
    status =
      "null_no_supported_candidate";

    summary =
      "No supported canonical candidate or reviewed functional evidence is available. Null is a valid result.";
  }

  return {
    schemaVersion:
      ANALYSIS_STATUS_SCHEMA_VERSION_V0_1,
    status,
    summary,
    reviewedOperators,
    candidateOnlyOperators,
    researchHypothesisEmbryos,
    structuralTokens:
      statusStructuralTokens,
    claimBoundary: {
      historicalOriginClaim:
        "not_claimed",
      historicalTransmissionClaim:
        "not_claimed",
      winnerClaim:
        "not_claimed",
      languageSuperiorityClaim:
        "not_claimed",
      linguisticOwnershipClaim:
        "not_claimed",
      candidateTruthClaim:
        "not_claimed",
      structuralOutputIsCandidateTruth:
        false,
      nullIsValid:
        true,
    },
    userDecisionPosture:
      "user_decides",
  };
}
