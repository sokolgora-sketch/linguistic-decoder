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
  | "invalid_packet_shape"
  | "invalid_candidate_set"
  | "empty_candidate_set"
  | "invalid_candidate_shape"
  | "candidate_id_missing"
  | "duplicate_candidate_id"
  | "language_id_missing"
  | "language_variety_invalid"
  | "intended_evidence_role_invalid"
  | "claim_boundary_invalid"
  | "review_status_invalid"
  | "review_notes_invalid"
  | "citations_invalid"
  | "candidate_present_evidence_invalid"
  | "rejected_candidate_missing_reason"
  | "ready_surface_form_missing"
  | "ready_attested_gloss_missing"
  | "ready_source_status_missing"
  | "ready_source_status_invalid"
  | "ready_citation_missing"
  | "ready_citation_incomplete"
  | "ready_surface_attestation_missing"
  | "ready_surface_gloss_attestation_missing"
  | "ready_comparison_form_missing"
  | "ready_comparison_mode_missing"
  | "ready_comparison_mode_invalid"
  | "ready_comparison_authority_missing"
  | "ready_comparison_provenance_missing"
  | "ready_comparison_provenance_invalid"
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

type UnknownRecord = {
  [key: string]: unknown;
};

function isRecord(
  value: unknown,
): value is UnknownRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(
      value,
    )
  );
}

function evidenceRoleIsValid(
  value: unknown,
): boolean {
  return (
    value ===
      "cohort_member" ||
    value ===
      "negative_control"
  );
}

function sourceStatusIsValid(
  value: unknown,
): boolean {
  return (
    value ===
      "research_candidate" ||
    value ===
      "reviewed_candidate"
  );
}

function comparisonModeIsValid(
  value: unknown,
): boolean {
  return (
    value ===
      "orthography" ||
    value ===
      "transliteration" ||
    value ===
      "z_zero_functional_normalization"
  );
}

function normalizedId(
  value: unknown,
): string {
  if (
    typeof value !==
      "string"
  ) {
    return "";
  }

  return value
    .normalize("NFC")
    .trim();
}

function hasText(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

function claimBoundaryIsResearchOnly(
  value: unknown,
): boolean {
  if (
    !isRecord(
      value,
    )
  ) {
    return false;
  }

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
  citation: unknown,
): citation is MultiSourceFunctionalResearchCitationV0_1 {
  if (
    !isRecord(
      citation,
    )
  ) {
    return false;
  }

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
    (
      citation.sourceAuthorOrEditor ===
        null ||
      typeof citation.sourceAuthorOrEditor ===
        "string"
    ) &&
    (
      citation.sourceHashOrArchiveHash ===
        null ||
      typeof citation.sourceHashOrArchiveHash ===
        "string"
    ) &&
    hasText(
      citation.attestedForm,
    ) &&
    hasText(
      citation.attestedGloss,
    )
  );
}

function citationsAttestSurfaceAndGloss(
  citations:
    readonly unknown[],
  surfaceForm: unknown,
  attestedGloss: unknown,
): boolean {
  if (
    !hasText(
      surfaceForm,
    ) ||
    !hasText(
      attestedGloss,
    )
  ) {
    return false;
  }

  const normalizedSurface =
    normalizedId(
      surfaceForm,
    );

  const normalizedGloss =
    normalizedId(
      attestedGloss,
    );

  return citations.some(
    (citation) =>
      citationIsComplete(
        citation,
      ) &&
      normalizedId(
        citation.attestedForm,
      ) ===
        normalizedSurface &&
      normalizedId(
        citation.attestedGloss,
      ) ===
        normalizedGloss,
  );
}

function comparisonProvenanceIsStructurallyValid(
  value: unknown,
): value is UnknownRecord {
  return (
    isRecord(
      value,
    ) &&
    hasText(
      value.provenanceId,
    ) &&
    hasText(
      value.authority,
    ) &&
    (
      value.ruleId ===
        null ||
      hasText(
        value.ruleId,
      )
    ) &&
    Array.isArray(
      value.evidenceRefs,
    ) &&
    value.evidenceRefs.every(
      (ref) =>
        hasText(
          ref,
        ),
    )
  );
}

function candidatePresentEvidenceIsValid(
  candidate: UnknownRecord,
): boolean {
  if (
    candidate.surfaceForm !==
      null &&
    !hasText(
      candidate.surfaceForm,
    )
  ) {
    return false;
  }

  if (
    candidate.attestedGloss !==
      null &&
    !hasText(
      candidate.attestedGloss,
    )
  ) {
    return false;
  }

  if (
    candidate.sourceStatus !==
      null &&
    !sourceStatusIsValid(
      candidate.sourceStatus,
    )
  ) {
    return false;
  }

  if (
    !Array.isArray(
      candidate.citations,
    ) ||
    !candidate.citations.every(
      citationIsComplete,
    )
  ) {
    return false;
  }

  if (
    candidate.proposedComparisonForm !==
      null &&
    !hasText(
      candidate.proposedComparisonForm,
    )
  ) {
    return false;
  }

  if (
    candidate.proposedComparisonMode !==
      null &&
    !comparisonModeIsValid(
      candidate.proposedComparisonMode,
    )
  ) {
    return false;
  }

  if (
    candidate.proposedComparisonAuthority !==
      null &&
    !hasText(
      candidate.proposedComparisonAuthority,
    )
  ) {
    return false;
  }

  const provenance =
    candidate.proposedComparisonProvenance;

  if (
    provenance !==
      null
  ) {
    if (
      !comparisonProvenanceIsStructurallyValid(
        provenance,
      )
    ) {
      return false;
    }

    if (
      candidate.proposedComparisonAuthority !==
        null &&
      hasText(
        candidate.proposedComparisonAuthority,
      ) &&
      provenance.authority !==
        candidate.proposedComparisonAuthority
    ) {
      return false;
    }

    if (
      candidate.proposedComparisonMode !==
        null &&
      comparisonModeIsValid(
        candidate.proposedComparisonMode,
      ) &&
      candidate.proposedComparisonMode !==
        "orthography" &&
      !hasText(
        provenance.ruleId,
      )
    ) {
      return false;
    }
  }

  return true;
}

export function
validateSevenVoiceFunctionalRecurrenceCandidateEvidencePacketV0_1(
  packet: unknown,
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
    !isRecord(
      packet,
    )
  ) {
    reasonCodes.add(
      "invalid_packet_shape",
    );

    return {
      valid:
        false,

      reasonCodes:
        [...reasonCodes],

      readyForAdmissionReviewCandidateIds,

      needsSourceCandidateIds,

      rejectedCandidateIds,
    };
  }

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
    !Array.isArray(
      packet.candidates,
    )
  ) {
    reasonCodes.add(
      "invalid_candidate_set",
    );

    return {
      valid:
        false,

      reasonCodes:
        [...reasonCodes],

      readyForAdmissionReviewCandidateIds,

      needsSourceCandidateIds,

      rejectedCandidateIds,
    };
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
    const candidateReasonCodes =
      new Set<
        SevenVoiceFunctionalRecurrenceCandidatePacketReasonCodeV0_1
      >();

    const addCandidateReason = (
      reason:
        SevenVoiceFunctionalRecurrenceCandidatePacketReasonCodeV0_1,
    ) => {
      candidateReasonCodes.add(
        reason,
      );

      reasonCodes.add(
        reason,
      );
    };

    if (
      !isRecord(
        candidate,
      )
    ) {
      addCandidateReason(
        "invalid_candidate_shape",
      );

      continue;
    }
    const candidateId =
      normalizedId(
        candidate.candidateObservationId,
      );

    if (
      candidateId.length ===
      0
    ) {
      addCandidateReason(
        "candidate_id_missing",
      );
    } else if (
      candidateIds.has(
        candidateId,
      )
    ) {
      addCandidateReason(
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
      addCandidateReason(
        "language_id_missing",
      );
    }

    if (
      candidate.languageVariety !==
        null &&
      typeof candidate.languageVariety !==
        "string"
    ) {
      addCandidateReason(
        "language_variety_invalid",
      );
    }

    if (
      !evidenceRoleIsValid(
        candidate.intendedEvidenceRole,
      )
    ) {
      addCandidateReason(
        "intended_evidence_role_invalid",
      );
    }

    if (
      !claimBoundaryIsResearchOnly(
        candidate.claimBoundary,
      )
    ) {
      addCandidateReason(
        "claim_boundary_invalid",
      );
    }

    if (
      !Array.isArray(
        candidate.reviewNotes,
      ) ||
      !candidate.reviewNotes.every(
        (note) =>
          typeof note ===
            "string",
      )
    ) {
      addCandidateReason(
        "review_notes_invalid",
      );
    }

    if (
      !Array.isArray(
        candidate.citations,
      )
    ) {
      addCandidateReason(
        "citations_invalid",
      );
    }

    const presentEvidenceIsValid =
      candidatePresentEvidenceIsValid(
        candidate,
      );

    if (
      !presentEvidenceIsValid
    ) {
      addCandidateReason(
        "candidate_present_evidence_invalid",
      );
    }

    if (
      candidate.reviewStatus !==
        "needs_source" &&
      candidate.reviewStatus !==
        "ready_for_admission_review" &&
      candidate.reviewStatus !==
        "reject"
    ) {
      addCandidateReason(
        "review_status_invalid",
      );

      continue;
    }

    if (
      candidate.reviewStatus ===
      "needs_source"
    ) {
      if (
        candidateId.length >
          0 &&
        presentEvidenceIsValid
      ) {
        needsSourceCandidateIds.push(
          candidateId,
        );
      }

      continue;
    }

    if (
      candidate.reviewStatus ===
      "reject"
    ) {
      if (
        candidateId.length >
        0
      ) {
        rejectedCandidateIds.push(
          candidateId,
        );
      }

      if (
        !Array.isArray(
          candidate.reviewNotes,
        ) ||
        !candidate.reviewNotes.some(
          (note) =>
            hasText(
              note,
            ),
        )
      ) {
        addCandidateReason(
          "rejected_candidate_missing_reason",
        );
      }

      continue;
    }

    if (
      !hasText(
        candidate.surfaceForm,
      )
    ) {
      addCandidateReason(
        "ready_surface_form_missing",
      );
    }

    if (
      !hasText(
        candidate.attestedGloss,
      )
    ) {
      addCandidateReason(
        "ready_attested_gloss_missing",
      );
    }

    if (
      candidate.sourceStatus ==
      null
    ) {
      addCandidateReason(
        "ready_source_status_missing",
      );
    } else if (
      !sourceStatusIsValid(
        candidate.sourceStatus,
      )
    ) {
      addCandidateReason(
        "ready_source_status_invalid",
      );
    }

    if (
      !Array.isArray(
        candidate.citations,
      )
    ) {
      addCandidateReason(
        "citations_invalid",
      );
    } else if (
      candidate.citations.length ===
      0
    ) {
      addCandidateReason(
        "ready_citation_missing",
      );
    } else {
      if (
        !candidate.citations.every(
          citationIsComplete,
        )
      ) {
        addCandidateReason(
          "ready_citation_incomplete",
        );
      }

      const hasSurfaceAttestation =
        candidate.citations.some(
          (citation) =>
            citationIsComplete(
              citation,
            ) &&
            normalizedId(
              citation.attestedForm,
            ) ===
              normalizedId(
                candidate.surfaceForm,
              ),
        );

      if (
        !hasSurfaceAttestation
      ) {
        addCandidateReason(
          "ready_surface_attestation_missing",
        );
      }

      if (
        !citationsAttestSurfaceAndGloss(
          candidate.citations,
          candidate.surfaceForm,
          candidate.attestedGloss,
        )
      ) {
        addCandidateReason(
          "ready_surface_gloss_attestation_missing",
        );
      }
    }

    if (
      !hasText(
        candidate.proposedComparisonForm,
      )
    ) {
      addCandidateReason(
        "ready_comparison_form_missing",
      );
    }

    if (
      candidate.proposedComparisonMode ==
      null
    ) {
      addCandidateReason(
        "ready_comparison_mode_missing",
      );
    } else if (
      !comparisonModeIsValid(
        candidate.proposedComparisonMode,
      )
    ) {
      addCandidateReason(
        "ready_comparison_mode_invalid",
      );
    }

    if (
      !hasText(
        candidate.proposedComparisonAuthority,
      )
    ) {
      addCandidateReason(
        "ready_comparison_authority_missing",
      );
    }

    const provenance =
      candidate.proposedComparisonProvenance;

    if (
      provenance ==
      null
    ) {
      addCandidateReason(
        "ready_comparison_provenance_missing",
      );

      continue;
    }

    if (
      !isRecord(
        provenance,
      )
    ) {
      addCandidateReason(
        "ready_comparison_provenance_invalid",
      );

      continue;
    }

    const provenanceIsValid =
      hasText(
        provenance.provenanceId,
      ) &&
      hasText(
        provenance.authority,
      ) &&
      (
        provenance.ruleId ===
          null ||
        hasText(
          provenance.ruleId,
        )
      ) &&
      Array.isArray(
        provenance.evidenceRefs,
      ) &&
      provenance.evidenceRefs.every(
        (ref) =>
          hasText(
            ref,
          ),
      );

    if (
      !provenanceIsValid
    ) {
      addCandidateReason(
        "ready_comparison_provenance_invalid",
      );
    }

    if (
      !hasText(
        candidate.proposedComparisonAuthority,
      ) ||
      provenance.authority !==
        candidate.proposedComparisonAuthority
    ) {
      addCandidateReason(
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
      addCandidateReason(
        "ready_comparison_rule_id_missing",
      );
    }

    if (
      candidateId.length >
        0 &&
      candidateReasonCodes.size ===
        0
    ) {
      readyForAdmissionReviewCandidateIds.push(
        candidateId,
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
