import type {
  MultiSourceFunctionalResearchEvidenceRowV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceRegistry.v0_1";

export type CohortGEvidencePacketPolicyV0_1 = {
  targetWord: string;
  targetSenseId: string;
  minimumRows: number;
  minimumProvenanceGroups: number;
};

export type CohortGEvidencePacketReasonCodeV0_1 =
  | "invalid_policy"
  | "duplicate_evidence_row"
  | "target_hypothesis_missing"
  | "target_sense_missing"
  | "target_sense_mismatch"
  | "source_status_not_research_candidate"
  | "attestation_not_fact"
  | "functional_bridge_missing"
  | "functional_bridge_not_hypothesis"
  | "research_boundary_violation"
  | "citation_missing"
  | "citation_metadata_invalid"
  | "provenance_group_missing"
  | "duplicate_citation"
  | "minimum_rows_not_met"
  | "minimum_provenance_groups_not_met";

export type CohortGEvidencePacketValidationResultV0_1 = {
  ready: boolean;
  reasonCodes: readonly CohortGEvidencePacketReasonCodeV0_1[];
  acceptedResearchEvidenceIds: readonly string[];
  provenanceGroupIds: readonly string[];
};

function normalizeTextV0_1(value: string): string {
  return value.normalize("NFC").trim();
}

function sameTargetWordV0_1(
  left: string,
  right: string,
): boolean {
  return (
    normalizeTextV0_1(left).toLocaleUpperCase("en-US") ===
    normalizeTextV0_1(right).toLocaleUpperCase("en-US")
  );
}

function hasTextV0_1(value: unknown): value is string {
  return typeof value === "string" && normalizeTextV0_1(value).length > 0;
}

function hasUsableCitationV0_1(
  citation: MultiSourceFunctionalResearchEvidenceRowV0_1["citations"][number],
): boolean {
  return (
    hasTextV0_1(citation.citationId) &&
    hasTextV0_1(citation.sourceTitle) &&
    hasTextV0_1(citation.sourcePublisherOrHost) &&
    hasTextV0_1(citation.sourceDateOrVersion) &&
    hasTextV0_1(citation.sourceUrlOrArchiveRef) &&
    hasTextV0_1(citation.entryLocator) &&
    hasTextV0_1(citation.attestedForm) &&
    hasTextV0_1(citation.attestedGloss)
  );
}

function hasResearchBoundaryV0_1(
  row: MultiSourceFunctionalResearchEvidenceRowV0_1,
): boolean {
  return (
    row.historicalOriginClaim === "not_claimed" &&
    row.historicalTransmissionClaim === "not_claimed" &&
    row.winnerClaim === "not_claimed" &&
    row.languageSuperiorityClaim === "not_claimed" &&
    row.candidateTruthClaim === "not_claimed" &&
    row.userDecisionPosture === "user_decides"
  );
}

export function validateCohortGEvidencePacketV0_1(
  rows: readonly MultiSourceFunctionalResearchEvidenceRowV0_1[],
  policy: CohortGEvidencePacketPolicyV0_1,
): CohortGEvidencePacketValidationResultV0_1 {
  const reasonCodes = new Set<CohortGEvidencePacketReasonCodeV0_1>();
  const acceptedResearchEvidenceIds: string[] = [];
  const provenanceGroupIds = new Set<string>();
  const seenResearchEvidenceIds = new Set<string>();
  const seenCitationIds = new Set<string>();

  if (
    !hasTextV0_1(policy.targetWord) ||
    !hasTextV0_1(policy.targetSenseId) ||
    !Number.isInteger(policy.minimumRows) ||
    policy.minimumRows < 1 ||
    !Number.isInteger(policy.minimumProvenanceGroups) ||
    policy.minimumProvenanceGroups < 1
  ) {
    reasonCodes.add("invalid_policy");
  }

  for (const row of rows) {
    const researchEvidenceId = normalizeTextV0_1(row.researchEvidenceId);

    if (!researchEvidenceId || seenResearchEvidenceIds.has(researchEvidenceId)) {
      reasonCodes.add("duplicate_evidence_row");
      continue;
    }

    seenResearchEvidenceIds.add(researchEvidenceId);

    const targetHypothesis = row.functionalHypotheses.find((hypothesis) =>
      sameTargetWordV0_1(hypothesis.targetWord, policy.targetWord),
    );

    if (!targetHypothesis) {
      reasonCodes.add("target_hypothesis_missing");
      continue;
    }

    if (!hasTextV0_1(targetHypothesis.targetSenseId)) {
      reasonCodes.add("target_sense_missing");
      continue;
    }

    if (
      normalizeTextV0_1(targetHypothesis.targetSenseId) !==
      normalizeTextV0_1(policy.targetSenseId)
    ) {
      reasonCodes.add("target_sense_mismatch");
      continue;
    }

    if (row.attestationTruth !== "fact") {
      reasonCodes.add("attestation_not_fact");
      continue;
    }

    if (row.sourceStatus !== "research_candidate") {
      reasonCodes.add("source_status_not_research_candidate");
      continue;
    }

    if (!hasTextV0_1(targetHypothesis.semanticBridge)) {
      reasonCodes.add("functional_bridge_missing");
      continue;
    }

    if (targetHypothesis.functionalBridgeTruth !== "hypothesis") {
      reasonCodes.add("functional_bridge_not_hypothesis");
      continue;
    }

    if (
      targetHypothesis.claimBoundary !== "functional_hypothesis_only" ||
      !hasResearchBoundaryV0_1(row)
    ) {
      reasonCodes.add("research_boundary_violation");
      continue;
    }

    if (row.citations.length === 0) {
      reasonCodes.add("citation_missing");
      continue;
    }

    let rowIsAccepted = true;

    for (const citation of row.citations) {
      const citationId = normalizeTextV0_1(citation.citationId);
      const provenanceGroupId = citation.provenanceGroupId == null
        ? ""
        : normalizeTextV0_1(citation.provenanceGroupId);

      if (!hasUsableCitationV0_1(citation)) {
        reasonCodes.add("citation_metadata_invalid");
        rowIsAccepted = false;
      }

      if (!provenanceGroupId) {
        reasonCodes.add("provenance_group_missing");
        rowIsAccepted = false;
      }

      if (!citationId || seenCitationIds.has(citationId)) {
        reasonCodes.add("duplicate_citation");
        rowIsAccepted = false;
      }
    }

    if (!rowIsAccepted) {
      continue;
    }

    acceptedResearchEvidenceIds.push(researchEvidenceId);

    for (const citation of row.citations) {
      seenCitationIds.add(normalizeTextV0_1(citation.citationId));
      provenanceGroupIds.add(normalizeTextV0_1(citation.provenanceGroupId!));
    }
  }

  if (acceptedResearchEvidenceIds.length < policy.minimumRows) {
    reasonCodes.add("minimum_rows_not_met");
  }

  if (provenanceGroupIds.size < policy.minimumProvenanceGroups) {
    reasonCodes.add("minimum_provenance_groups_not_met");
  }

  return {
    ready: reasonCodes.size === 0,
    reasonCodes: [...reasonCodes],
    acceptedResearchEvidenceIds,
    provenanceGroupIds: [...provenanceGroupIds],
  };
}
