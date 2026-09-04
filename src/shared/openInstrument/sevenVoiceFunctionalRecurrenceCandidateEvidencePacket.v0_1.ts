import type {
  SevenVoiceFunctionalRecurrenceCohortEvidenceClaimBoundaryV0_1,
  SevenVoiceFunctionalRecurrenceComparisonProvenanceV0_1,
  SevenVoiceFunctionalRecurrenceEvidenceRoleV0_1,
} from "./sevenVoiceFunctionalRecurrenceCohortEvidence.v0_1";

import type {
  SevenVoiceFunctionalRecurrenceComparisonModeV0_1,
} from "./sevenVoiceFunctionalRecurrence.v0_1";

import type {
  MultiSourceFunctionalResearchCitationV0_1,
  MultiSourceFunctionalResearchSourceStatusV0_1,
} from "../multiSourceFunctionalResearchEvidenceRegistry.v0_1";

/**
 * Research-only staging contract before FVR cohort admission.
 *
 * This layer may record incomplete or rejected research candidates.
 *
 * It does NOT:
 * - admit observations into an FVR cohort;
 * - call the recurrence engine;
 * - write to the live FVR research catalog;
 * - promote research evidence;
 * - establish candidate truth;
 * - authorize statistics;
 * - expose API/UI/runtime state.
 *
 * Required ordering:
 *
 * candidate research
 *   -> candidate evidence packet
 *   -> human/review gate
 *   -> existing FVR cohort-evidence admission
 *   -> existing recurrence engine
 */
export const
SEVEN_VOICE_FUNCTIONAL_RECURRENCE_CANDIDATE_EVIDENCE_PACKET_SCHEMA_V0_1 =
  "open-instrument.seven-voice-functional-recurrence-candidate-evidence-packet.v0_1" as const;

export type SevenVoiceFunctionalRecurrenceCandidateReviewStatusV0_1 =
  | "needs_source"
  | "ready_for_admission_review"
  | "reject";

export type SevenVoiceFunctionalRecurrenceCandidateEvidenceObservationV0_1 =
  Readonly<{
    candidateObservationId: string;

    languageId: string;

    languageVariety:
      string | null;

    intendedEvidenceRole:
      SevenVoiceFunctionalRecurrenceEvidenceRoleV0_1;

    /**
     * May be null while status=needs_source.
     * Must be source-attested before ready_for_admission_review.
     */
    surfaceForm:
      string | null;

    attestedGloss:
      string | null;

    sourceStatus:
      MultiSourceFunctionalResearchSourceStatusV0_1 | null;

    citations:
      readonly MultiSourceFunctionalResearchCitationV0_1[];

    proposedComparisonForm:
      string | null;

    proposedComparisonMode:
      SevenVoiceFunctionalRecurrenceComparisonModeV0_1 | null;

    proposedComparisonAuthority:
      string | null;

    proposedComparisonProvenance:
      SevenVoiceFunctionalRecurrenceComparisonProvenanceV0_1 | null;

    reviewStatus:
      SevenVoiceFunctionalRecurrenceCandidateReviewStatusV0_1;

    reviewNotes:
      readonly string[];

    claimBoundary:
      SevenVoiceFunctionalRecurrenceCohortEvidenceClaimBoundaryV0_1;
  }>;

export type SevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1 =
  Readonly<{
    schemaVersion:
      typeof SEVEN_VOICE_FUNCTIONAL_RECURRENCE_CANDIDATE_EVIDENCE_PACKET_SCHEMA_V0_1;

    packetId: string;

    conceptId: string;

    /**
     * Hard boundary proving this packet is staging research only.
     */
    researchOnly: true;

    /**
     * Candidate packets never own or imply an admitted cohort.
     */
    admittedCohortId: null;

    candidates:
      readonly SevenVoiceFunctionalRecurrenceCandidateEvidenceObservationV0_1[];
  }>;

export type SevenVoiceFunctionalRecurrenceCandidatePacketReasonCodeV0_1 =
  | "schema_mismatch"
  | "packet_id_missing"
  | "concept_id_missing"
  | "research_only_boundary_invalid"
  | "admitted_cohort_boundary_invalid"
  | "empty_candidate_set"
  | "candidate_id_missing"
  | "duplicate_candidate_id"
  | "language_id_missing"
  | "claim_boundary_invalid"
  | "rejected_candidate_missing_reason"
  | "ready_surface_form_missing"
  | "ready_attested_gloss_missing"
  | "ready_source_status_missing"
  | "ready_citation_missing"
  | "ready_citation_incomplete"
  | "ready_surface_attestation_missing"
  | "ready_comparison_form_missing"
  | "ready_comparison_mode_missing"
  | "ready_comparison_authority_missing"
  | "ready_comparison_provenance_missing"
  | "ready_comparison_authority_mismatch"
  | "ready_comparison_rule_id_missing";

export type SevenVoiceFunctionalRecurrenceCandidatePacketValidationV0_1 =
  Readonly<{
    valid: boolean;

    reasonCodes:
      readonly SevenVoiceFunctionalRecurrenceCandidatePacketReasonCodeV0_1[];

    readyForAdmissionReviewCandidateIds:
      readonly string[];

    needsSourceCandidateIds:
      readonly string[];

    rejectedCandidateIds:
      readonly string[];
  }>;

function normalizedId(
  value: string,
): string {
  return value
    .normalize("NFC")
    .trim();
}

function hasText(
  value: string | null | undefined,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

function claimBoundaryIsResearchOnly(
  value:
    SevenVoiceFunctionalRecurrenceCohortEvidenceClaimBoundaryV0_1,
): boolean {
  return (
    value.historicalOriginClaim ===
      "not_claimed" &&
    value.historicalTransmissionClaim ===
      "not_claimed" &&
    value.cognacyClaim ===
      "not_claimed" &&
    value.borrowingClaim ===
      "not_claimed" &&
    value.winnerClaim ===
      "not_claimed" &&
    value.languageSuperiorityClaim ===
      "not_claimed" &&
    value.candidateTruthClaim ===
      "not_claimed" &&
    value.universalityClaim ===
      "not_claimed" &&
    value.userDecisionPosture ===
      "user_decides"
  );
}

function citationIsComplete(
  citation:
    MultiSourceFunctionalResearchCitationV0_1,
): boolean {
  return (
    hasText(
      citation.citationId,
    ) &&
    hasText(
      citation.sourceTitle,
    ) &&
    hasText(
      citation.sourcePublisherOrHost,
    ) &&
    hasText(
      citation.sourceDateOrVersion,
    ) &&
    hasText(
      citation.sourceUrlOrArchiveRef,
    ) &&
    hasText(
      citation.entryLocator,
    ) &&
    hasText(
      citation.attestedForm,
    ) &&
    hasText(
      citation.attestedGloss,
    )
  );
}

function citationsAttestSurface(
  citations:
    readonly MultiSourceFunctionalResearchCitationV0_1[],
  surfaceForm:
    string | null,
): boolean {
  if (
    !hasText(
      surfaceForm,
    )
  ) {
    return false;
  }

  const normalizedSurface =
    normalizedId(
      surfaceForm,
    );

  return citations.some(
    (citation) =>
      normalizedId(
        citation.attestedForm,
      ) ===
      normalizedSurface,
  );
}

export function
validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
  packet:
    SevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1,
):
  SevenVoiceFunctionalRecurrenceCandidatePacketValidationV0_1 {
  const reasonCodes =
    new Set<
      SevenVoiceFunctionalRecurrenceCandidatePacketReasonCodeV0_1
    >();

  const readyForAdmissionReviewCandidateIds:
    string[] = [];

  const needsSourceCandidateIds:
    string[] = [];

  const rejectedCandidateIds:
    string[] = [];

  if (
    packet.schemaVersion !==
    SEVEN_VOICE_FUNCTIONAL_RECURRENCE_CANDIDATE_EVIDENCE_PACKET_SCHEMA_V0_1
  ) {
    reasonCodes.add(
      "schema_mismatch",
    );
  }

  if (
    !hasText(
      packet.packetId,
    )
  ) {
    reasonCodes.add(
      "packet_id_missing",
    );
  }

  if (
    !hasText(
      packet.conceptId,
    )
  ) {
    reasonCodes.add(
      "concept_id_missing",
    );
  }

  if (
    packet.researchOnly !==
      true
  ) {
    reasonCodes.add(
      "research_only_boundary_invalid",
    );
  }

  if (
    packet.admittedCohortId !==
      null
  ) {
    reasonCodes.add(
      "admitted_cohort_boundary_invalid",
    );
  }

  if (
    packet.candidates.length ===
    0
  ) {
    reasonCodes.add(
      "empty_candidate_set",
    );
  }

  const candidateIds =
    new Set<string>();

  for (
    const candidate
    of packet.candidates
  ) {
    const candidateId =
      normalizedId(
        candidate.candidateObservationId,
      );

    if (
      candidateId.length ===
      0
    ) {
      reasonCodes.add(
        "candidate_id_missing",
      );
    } else if (
      candidateIds.has(
        candidateId,
      )
    ) {
      reasonCodes.add(
        "duplicate_candidate_id",
      );
    } else {
      candidateIds.add(
        candidateId,
      );
    }

    if (
      !hasText(
        candidate.languageId,
      )
    ) {
      reasonCodes.add(
        "language_id_missing",
      );
    }

    if (
      !claimBoundaryIsResearchOnly(
        candidate.claimBoundary,
      )
    ) {
      reasonCodes.add(
        "claim_boundary_invalid",
      );
    }

    if (
      candidate.reviewStatus ===
      "needs_source"
    ) {
      needsSourceCandidateIds.push(
        candidate.candidateObservationId,
      );

      continue;
    }

    if (
      candidate.reviewStatus ===
      "reject"
    ) {
      rejectedCandidateIds.push(
        candidate.candidateObservationId,
      );

      if (
        !candidate.reviewNotes.some(
          (note) =>
            hasText(
              note,
            ),
        )
      ) {
        reasonCodes.add(
          "rejected_candidate_missing_reason",
        );
      }

      continue;
    }

    readyForAdmissionReviewCandidateIds.push(
      candidate.candidateObservationId,
    );

    if (
      !hasText(
        candidate.surfaceForm,
      )
    ) {
      reasonCodes.add(
        "ready_surface_form_missing",
      );
    }

    if (
      !hasText(
        candidate.attestedGloss,
      )
    ) {
      reasonCodes.add(
        "ready_attested_gloss_missing",
      );
    }

    if (
      candidate.sourceStatus ==
      null
    ) {
      reasonCodes.add(
        "ready_source_status_missing",
      );
    }

    if (
      candidate.citations.length ===
      0
    ) {
      reasonCodes.add(
        "ready_citation_missing",
      );
    } else {
      if (
        !candidate.citations.every(
          citationIsComplete,
        )
      ) {
        reasonCodes.add(
          "ready_citation_incomplete",
        );
      }

      if (
        !citationsAttestSurface(
          candidate.citations,
          candidate.surfaceForm,
        )
      ) {
        reasonCodes.add(
          "ready_surface_attestation_missing",
        );
      }
    }

    if (
      !hasText(
        candidate.proposedComparisonForm,
      )
    ) {
      reasonCodes.add(
        "ready_comparison_form_missing",
      );
    }

    if (
      candidate.proposedComparisonMode ==
      null
    ) {
      reasonCodes.add(
        "ready_comparison_mode_missing",
      );
    }

    if (
      !hasText(
        candidate.proposedComparisonAuthority,
      )
    ) {
      reasonCodes.add(
        "ready_comparison_authority_missing",
      );
    }

    const provenance =
      candidate.proposedComparisonProvenance;

    if (
      provenance ==
      null
    ) {
      reasonCodes.add(
        "ready_comparison_provenance_missing",
      );

      continue;
    }

    if (
      !hasText(
        candidate.proposedComparisonAuthority,
      ) ||
      provenance.authority !==
        candidate.proposedComparisonAuthority
    ) {
      reasonCodes.add(
        "ready_comparison_authority_mismatch",
      );
    }

    if (
      candidate.proposedComparisonMode !==
        null &&
      candidate.proposedComparisonMode !==
        "orthography" &&
      !hasText(
        provenance.ruleId,
      )
    ) {
      reasonCodes.add(
        "ready_comparison_rule_id_missing",
      );
    }
  }

  return {
    valid:
      reasonCodes.size === 0,

    reasonCodes:
      [...reasonCodes],

    readyForAdmissionReviewCandidateIds,

    needsSourceCandidateIds,

    rejectedCandidateIds,
  };
}
