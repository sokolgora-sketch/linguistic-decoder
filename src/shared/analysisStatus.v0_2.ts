import {
  buildAnalysisStatusV0_1,
  type AnalysisStatusV0_1,
} from "@/shared/analysisStatus.v0_1";
import {
  INTERPRETATION_DECISION_POLICY_V0_1,
  isInterpretationDecisionPolicyV0_1,
} from "@/shared/openInstrument/interpretationDecisionPolicy.v0_1";

export const ANALYSIS_STATUS_SCHEMA_VERSION_V0_2 =
  "open-instrument.analysis-status.v0_2" as const;

export type AnalysisStatusV0_2 = Omit<
  AnalysisStatusV0_1,
  "schemaVersion" | "claimBoundary"
> & Readonly<{
  schemaVersion: typeof ANALYSIS_STATUS_SCHEMA_VERSION_V0_2;
  claimBoundary: Omit<AnalysisStatusV0_1["claimBoundary"], "winnerClaim">;
  interpretationDecisionPolicy: typeof INTERPRETATION_DECISION_POLICY_V0_1;
}>;

export function migrateAnalysisStatusV0_1ToV0_2(
  value: unknown,
): AnalysisStatusV0_2 | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const legacy = value as Record<string, unknown>;
  const boundary = legacy.claimBoundary;
  if (
    legacy.schemaVersion !== "open-instrument.analysis-status.v0_1" ||
    legacy.userDecisionPosture !== "user_decides" ||
    typeof legacy.status !== "string" || typeof legacy.summary !== "string" ||
    !Array.isArray(legacy.reviewedOperators) ||
    !Array.isArray(legacy.candidateOnlyOperators) ||
    !Array.isArray(legacy.researchHypothesisEmbryos) ||
    !Array.isArray(legacy.structuralTokens) ||
    boundary === null || typeof boundary !== "object" || Array.isArray(boundary) ||
    Object.prototype.hasOwnProperty.call(legacy, "noSingleWinner") ||
    Object.prototype.hasOwnProperty.call(legacy, "winnerClaim")
  ) {
    return null;
  }
  const oldBoundary = boundary as Record<string, unknown>;
  if (
    oldBoundary.winnerClaim !== "not_claimed" ||
    oldBoundary.historicalOriginClaim !== "not_claimed" ||
    oldBoundary.historicalTransmissionClaim !== "not_claimed" ||
    oldBoundary.languageSuperiorityClaim !== "not_claimed" ||
    oldBoundary.linguisticOwnershipClaim !== "not_claimed" ||
    oldBoundary.candidateTruthClaim !== "not_claimed" ||
    oldBoundary.structuralOutputIsCandidateTruth !== false ||
    oldBoundary.nullIsValid !== true
  ) {
    return null;
  }

  const { schemaVersion: _schemaVersion, claimBoundary: _claimBoundary, ...rest } =
    legacy as unknown as AnalysisStatusV0_1;
  const { winnerClaim: _winnerClaim, ...claimBoundary } =
    boundary as AnalysisStatusV0_1["claimBoundary"];
  const migrated: AnalysisStatusV0_2 = {
    ...rest,
    summary: (legacy.summary as string).replace(
      "This is functional evidence, not a historical-origin or winner claim.",
      "This is functional evidence, not historical-origin evidence. Multiple interpretations may coexist; automatic interpretation selection is disabled. User decides.",
    ),
    schemaVersion: ANALYSIS_STATUS_SCHEMA_VERSION_V0_2,
    claimBoundary,
    interpretationDecisionPolicy: INTERPRETATION_DECISION_POLICY_V0_1,
  };
  return isAnalysisStatusV0_2(migrated) ? migrated : null;
}

export function buildAnalysisStatusV0_2(result: unknown): AnalysisStatusV0_2 {
  const migrated = migrateAnalysisStatusV0_1ToV0_2(buildAnalysisStatusV0_1(result));
  if (!migrated) throw new Error("V0_1 analysis status could not be projected to V0_2");
  return migrated;
}

export function isAnalysisStatusV0_2(value: unknown): value is AnalysisStatusV0_2 {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const status = value as Record<string, unknown>;
  const boundary = status.claimBoundary;
  const claimBoundary = boundary !== null && typeof boundary === "object" && !Array.isArray(boundary)
    ? boundary as Record<string, unknown>
    : null;
  const hasExactKeys = (record: Record<string, unknown>, expected: readonly string[]) => {
    const actual = Object.keys(record).sort();
    return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
  };
  const exactStatusKeys = [
    "candidateOnlyOperators",
    "claimBoundary",
    "interpretationDecisionPolicy",
    "researchHypothesisEmbryos",
    "reviewedOperators",
    "schemaVersion",
    "status",
    "structuralTokens",
    "summary",
    "userDecisionPosture",
  ];
  const exactBoundaryKeys = [
    "candidateTruthClaim",
    "historicalOriginClaim",
    "historicalTransmissionClaim",
    "languageSuperiorityClaim",
    "linguisticOwnershipClaim",
    "nullIsValid",
    "structuralOutputIsCandidateTruth",
  ];
  const allowedStatuses = new Set([
    "reviewed_functional_evidence",
    "research_functional_hypothesis",
    "candidate_only",
    "structural_unreviewed",
    "null_no_supported_candidate",
  ]);
  return (
    status.schemaVersion === ANALYSIS_STATUS_SCHEMA_VERSION_V0_2 &&
    typeof status.status === "string" && allowedStatuses.has(status.status) &&
    typeof status.summary === "string" &&
    Array.isArray(status.reviewedOperators) &&
    status.reviewedOperators.every((item) => typeof item === "string") &&
    Array.isArray(status.candidateOnlyOperators) &&
    status.candidateOnlyOperators.every((item) => typeof item === "string") &&
    Array.isArray(status.researchHypothesisEmbryos) &&
    status.researchHypothesisEmbryos.every((item) => typeof item === "string") &&
    Array.isArray(status.structuralTokens) &&
    status.structuralTokens.every((item) => typeof item === "string") &&
    claimBoundary !== null &&
    claimBoundary.historicalOriginClaim === "not_claimed" &&
    claimBoundary.historicalTransmissionClaim === "not_claimed" &&
    claimBoundary.languageSuperiorityClaim === "not_claimed" &&
    claimBoundary.linguisticOwnershipClaim === "not_claimed" &&
    claimBoundary.candidateTruthClaim === "not_claimed" &&
    claimBoundary.structuralOutputIsCandidateTruth === false &&
    claimBoundary.nullIsValid === true &&
    status.userDecisionPosture === "user_decides" &&
    isInterpretationDecisionPolicyV0_1(status.interpretationDecisionPolicy) &&
    hasExactKeys(status, exactStatusKeys) &&
    claimBoundary !== null && hasExactKeys(claimBoundary, exactBoundaryKeys) &&
    !Object.prototype.hasOwnProperty.call(status, "winnerClaim") &&
    !Object.prototype.hasOwnProperty.call(status, "noSingleWinner") &&
    !Object.prototype.hasOwnProperty.call(claimBoundary, "winnerClaim") &&
    !Object.prototype.hasOwnProperty.call(claimBoundary, "noSingleWinner")
  );
}
