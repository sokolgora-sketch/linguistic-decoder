import { discoverCanonicalOperatorCandidatesV0_1 } from "./canonicalOperatorDiscovery.v0_1";

export const ANALYSIS_STATUS_SCHEMA_VERSION_V0_1 =
  "open-instrument.analysis-status.v0_1" as const;

export type AnalysisStatusCodeV0_1 =
  | "reviewed_functional_evidence"
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
    structuralTokens,
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
