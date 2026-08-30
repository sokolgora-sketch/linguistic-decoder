import {
  analyzeSevenVoiceFunctionalRecurrenceV0_1,
} from "./sevenVoiceFunctionalRecurrence.v0_1";

import type {
  SevenVoiceFunctionalRecurrenceComparisonModeV0_1,
  SevenVoiceFunctionalRecurrenceFormV0_1,
  SevenVoiceFunctionalRecurrenceResultV0_1,
} from "./sevenVoiceFunctionalRecurrence.v0_1";

import type {
  MultiSourceTruthStatusV0_1,
} from "../multiSourceFunctionalDiscovery.v0_1";

import type {
  MultiSourceFunctionalResearchCitationV0_1,
  MultiSourceFunctionalResearchSourceStatusV0_1,
} from "../multiSourceFunctionalResearchEvidenceRegistry.v0_1";

/**
 * Evidence-admission layer for Seven-Voice Functional Recurrence.
 *
 * Placement:
 *
 * source-attested cohort rows
 *   -> FVR COHORT EVIDENCE ADMISSION
 *   -> existing Seven-Voice Functional Recurrence engine
 *   -> future research evaluation/statistics
 *
 * This module intentionally does NOT:
 *
 * - acquire sources;
 * - execute a provider or network request;
 * - invent a comparison form;
 * - invent a normalization;
 * - assign semantic meaning to a recurrent voice;
 * - establish cognacy, borrowing, or historical origin;
 * - promote candidate/research evidence;
 * - expose API/UI/runtime projection;
 * - calculate recurrence significance or baseline frequencies.
 *
 * The responsibility is narrower:
 *
 * only source-traceable, mode-explicit, claim-bounded cohort
 * observations may enter the evidence-backed recurrence path.
 */

export const SEVEN_VOICE_FUNCTIONAL_RECURRENCE_COHORT_EVIDENCE_SCHEMA_V0_1 =
  "open-instrument.seven-voice-functional-recurrence-cohort-evidence.v0_1" as const;

export type SevenVoiceFunctionalRecurrenceEvidenceRoleV0_1 =
  | "cohort_member"
  | "negative_control";

export type SevenVoiceFunctionalRecurrenceAttestationTruthV0_1 =
  Extract<
    MultiSourceTruthStatusV0_1,
    "fact" | "inference"
  >;

export type SevenVoiceFunctionalRecurrenceComparisonProvenanceV0_1 =
  Readonly<{
    provenanceId: string;

    /**
     * Must agree with comparisonAuthority.
     *
     * This may identify a source orthography convention,
     * transliteration scheme, or reviewed ZË-RO project doctrine.
     */
    authority: string;

    /**
     * Required for transliteration and
     * z_zero_functional_normalization.
     *
     * Examples are data, never implementation shortcuts:
     *
     * - a named transliteration scheme/rule;
     * - a reviewed project normalization rule id.
     */
    ruleId: string | null;

    /**
     * Optional ids for project/source evidence supporting the
     * comparison operation. These are audit references only.
     */
    evidenceRefs:
      readonly string[];
  }>;

export type SevenVoiceFunctionalRecurrenceCohortEvidenceClaimBoundaryV0_1 =
  Readonly<{
    historicalOriginClaim:
      "not_claimed";

    historicalTransmissionClaim:
      "not_claimed";

    cognacyClaim:
      "not_claimed";

    borrowingClaim:
      "not_claimed";

    winnerClaim:
      "not_claimed";

    languageSuperiorityClaim:
      "not_claimed";

    candidateTruthClaim:
      "not_claimed";

    universalityClaim:
      "not_claimed";

    userDecisionPosture:
      "user_decides";
  }>;

export type SevenVoiceFunctionalRecurrenceCohortEvidenceObservationV0_1 =
  Readonly<{
    recurrenceEvidenceId: string;

    evidenceRole:
      SevenVoiceFunctionalRecurrenceEvidenceRoleV0_1;

    languageId: string;

    /**
     * Optional dialect / language-variety label.
     *
     * It is retained for evidence audit but does not modify
     * Seven-Voice extraction.
     */
    languageVariety:
      string | null;

    /**
     * Source-attested lexical surface.
     */
    surfaceForm: string;

    /**
     * Explicit form to be passed to the already-existing
     * recurrence engine after this row is admitted.
     */
    comparisonForm: string;

    comparisonMode:
      SevenVoiceFunctionalRecurrenceComparisonModeV0_1;

    comparisonAuthority: string;

    comparisonProvenance:
      SevenVoiceFunctionalRecurrenceComparisonProvenanceV0_1;

    /**
     * Cohort v0.1 accepts factual lexical attestation and
     * explicitly marked reconstruction/inference.
     *
     * Hypothesis/unknown source attestation is not admitted into
     * an evidence-backed recurrence cohort.
     */
    attestationTruth:
      SevenVoiceFunctionalRecurrenceAttestationTruthV0_1;

    sourceStatus:
      MultiSourceFunctionalResearchSourceStatusV0_1;

    citations:
      readonly MultiSourceFunctionalResearchCitationV0_1[];

    claimBoundary:
      SevenVoiceFunctionalRecurrenceCohortEvidenceClaimBoundaryV0_1;
  }>;

export type SevenVoiceFunctionalRecurrenceCohortEvidenceInputV0_1 =
  Readonly<{
    schemaVersion:
      typeof SEVEN_VOICE_FUNCTIONAL_RECURRENCE_COHORT_EVIDENCE_SCHEMA_V0_1;

    cohortId: string;

    conceptId: string;

    observations:
      readonly SevenVoiceFunctionalRecurrenceCohortEvidenceObservationV0_1[];
  }>;

export type SevenVoiceFunctionalRecurrenceCohortEvidenceReasonCodeV0_1 =
  | "invalid_input"
  | "invalid_schema_version"
  | "missing_cohort_id"
  | "missing_concept_id"
  | "empty_cohort"
  | "duplicate_recurrence_evidence_id"
  | "invalid_recurrence_evidence_id"
  | "invalid_evidence_role"
  | "invalid_language_id"
  | "invalid_language_variety"
  | "invalid_surface_form"
  | "invalid_comparison_form"
  | "unsupported_comparison_mode"
  | "invalid_comparison_authority"
  | "invalid_comparison_provenance"
  | "comparison_authority_mismatch"
  | "missing_transliteration_rule"
  | "missing_functional_normalization_rule"
  | "invalid_attestation_truth"
  | "invalid_source_status"
  | "missing_citations"
  | "invalid_citation"
  | "surface_form_not_source_attested"
  | "claim_boundary_violation";

export type SevenVoiceFunctionalRecurrenceAdmittedObservationV0_1 =
  Readonly<{
    recurrenceEvidenceId: string;

    evidenceRole:
      SevenVoiceFunctionalRecurrenceEvidenceRoleV0_1;

    languageId: string;
    languageVariety:
      string | null;

    surfaceForm: string;
    comparisonForm: string;

    comparisonMode:
      SevenVoiceFunctionalRecurrenceComparisonModeV0_1;

    comparisonAuthority: string;

    comparisonProvenance:
      SevenVoiceFunctionalRecurrenceComparisonProvenanceV0_1;

    attestationTruth:
      SevenVoiceFunctionalRecurrenceAttestationTruthV0_1;

    sourceStatus:
      MultiSourceFunctionalResearchSourceStatusV0_1;

    citationRefs:
      readonly string[];

    claimBoundary:
      SevenVoiceFunctionalRecurrenceCohortEvidenceClaimBoundaryV0_1;
  }>;

export type SevenVoiceFunctionalRecurrenceCohortAdmissionV0_1 =
  Readonly<{
    schemaVersion:
      typeof SEVEN_VOICE_FUNCTIONAL_RECURRENCE_COHORT_EVIDENCE_SCHEMA_V0_1;

    status:
      "accepted" | "rejected";

    cohortId: string;

    conceptId: string;

    reasonCodes:
      SevenVoiceFunctionalRecurrenceCohortEvidenceReasonCodeV0_1[];

    observations:
      SevenVoiceFunctionalRecurrenceAdmittedObservationV0_1[];

    recurrenceForms:
      SevenVoiceFunctionalRecurrenceFormV0_1[];

    evidenceRefs:
      string[];
  }>;

export type SevenVoiceFunctionalRecurrenceEvidenceAnalysisV0_1 =
  Readonly<
    | {
        status:
          "accepted";

        admission:
          SevenVoiceFunctionalRecurrenceCohortAdmissionV0_1;

        recurrence:
          SevenVoiceFunctionalRecurrenceResultV0_1;
      }
    | {
        status:
          "rejected";

        admission:
          SevenVoiceFunctionalRecurrenceCohortAdmissionV0_1;

        recurrence:
          null;
      }
  >;

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

function normalizeTextV0_1(
  value: unknown,
): string {
  return String(
    value ?? "",
  )
    .normalize("NFC")
    .trim();
}

function sameAuditTextV0_1(
  left: string,
  right: string,
): boolean {
  return (
    normalizeTextV0_1(
      left,
    ).toLocaleUpperCase(
      "en-US",
    ) ===
    normalizeTextV0_1(
      right,
    ).toLocaleUpperCase(
      "en-US",
    )
  );
}

function normalizeUniqueTextArrayV0_1(
  value: unknown,
): string[] | null {
  if (
    !Array.isArray(
      value,
    )
  ) {
    return null;
  }

  const out:
    string[] =
    [];

  const seen =
    new Set<string>();

  for (
    const item
    of value
  ) {
    if (
      typeof item !==
      "string"
    ) {
      return null;
    }

    const normalized =
      normalizeTextV0_1(
        item,
      );

    if (!normalized) {
      return null;
    }

    if (
      seen.has(
        normalized,
      )
    ) {
      continue;
    }

    seen.add(
      normalized,
    );

    out.push(
      normalized,
    );
  }

  return out;
}

function comparisonModeIfValidV0_1(
  value: unknown,
):
  SevenVoiceFunctionalRecurrenceComparisonModeV0_1 | null {
  if (
    value ===
      "orthography" ||
    value ===
      "transliteration" ||
    value ===
      "z_zero_functional_normalization"
  ) {
    return value;
  }

  return null;
}

function evidenceRoleIfValidV0_1(
  value: unknown,
):
  SevenVoiceFunctionalRecurrenceEvidenceRoleV0_1 | null {
  if (
    value ===
      "cohort_member" ||
    value ===
      "negative_control"
  ) {
    return value;
  }

  return null;
}

function attestationTruthIfValidV0_1(
  value: unknown,
):
  SevenVoiceFunctionalRecurrenceAttestationTruthV0_1 | null {
  if (
    value === "fact" ||
    value === "inference"
  ) {
    return value;
  }

  return null;
}

function sourceStatusIfValidV0_1(
  value: unknown,
):
  MultiSourceFunctionalResearchSourceStatusV0_1 | null {
  if (
    value ===
      "research_candidate" ||
    value ===
      "reviewed_candidate"
  ) {
    return value;
  }

  return null;
}

function parseCitationV0_1(
  value: unknown,
):
  MultiSourceFunctionalResearchCitationV0_1 | null {
  if (!isRecord(value)) {
    return null;
  }

  const citationId =
    normalizeTextV0_1(
      value.citationId,
    );

  const sourceTitle =
    normalizeTextV0_1(
      value.sourceTitle,
    );

  const sourcePublisherOrHost =
    normalizeTextV0_1(
      value.sourcePublisherOrHost,
    );

  const sourceDateOrVersion =
    normalizeTextV0_1(
      value.sourceDateOrVersion,
    );

  const sourceUrlOrArchiveRef =
    normalizeTextV0_1(
      value.sourceUrlOrArchiveRef,
    );

  const entryLocator =
    normalizeTextV0_1(
      value.entryLocator,
    );

  const attestedForm =
    normalizeTextV0_1(
      value.attestedForm,
    );

  const attestedGloss =
    normalizeTextV0_1(
      value.attestedGloss,
    );

  if (
    !citationId ||
    !sourceTitle ||
    !sourcePublisherOrHost ||
    !sourceDateOrVersion ||
    !sourceUrlOrArchiveRef ||
    !entryLocator ||
    !attestedForm ||
    !attestedGloss
  ) {
    return null;
  }

  const sourceAuthorOrEditor =
    value.sourceAuthorOrEditor ==
      null
      ? null
      : normalizeTextV0_1(
          value.sourceAuthorOrEditor,
        ) || null;

  const sourceHashOrArchiveHash =
    value.sourceHashOrArchiveHash ==
      null
      ? null
      : normalizeTextV0_1(
          value.sourceHashOrArchiveHash,
        ) || null;

  return {
    citationId,
    sourceTitle,
    sourceAuthorOrEditor,
    sourcePublisherOrHost,
    sourceDateOrVersion,
    sourceUrlOrArchiveRef,
    entryLocator,
    sourceHashOrArchiveHash,
    attestedForm,
    attestedGloss,
  };
}

function claimBoundaryIfValidV0_1(
  value: unknown,
):
  SevenVoiceFunctionalRecurrenceCohortEvidenceClaimBoundaryV0_1 | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    value.historicalOriginClaim !==
      "not_claimed" ||
    value.historicalTransmissionClaim !==
      "not_claimed" ||
    value.cognacyClaim !==
      "not_claimed" ||
    value.borrowingClaim !==
      "not_claimed" ||
    value.winnerClaim !==
      "not_claimed" ||
    value.languageSuperiorityClaim !==
      "not_claimed" ||
    value.candidateTruthClaim !==
      "not_claimed" ||
    value.universalityClaim !==
      "not_claimed" ||
    value.userDecisionPosture !==
      "user_decides"
  ) {
    return null;
  }

  return {
    historicalOriginClaim:
      "not_claimed",

    historicalTransmissionClaim:
      "not_claimed",

    cognacyClaim:
      "not_claimed",

    borrowingClaim:
      "not_claimed",

    winnerClaim:
      "not_claimed",

    languageSuperiorityClaim:
      "not_claimed",

    candidateTruthClaim:
      "not_claimed",

    universalityClaim:
      "not_claimed",

    userDecisionPosture:
      "user_decides",
  };
}

function parseComparisonProvenanceV0_1(
  value: unknown,
):
  SevenVoiceFunctionalRecurrenceComparisonProvenanceV0_1 | null {
  if (!isRecord(value)) {
    return null;
  }

  const provenanceId =
    normalizeTextV0_1(
      value.provenanceId,
    );

  const authority =
    normalizeTextV0_1(
      value.authority,
    );

  if (
    !provenanceId ||
    !authority
  ) {
    return null;
  }

  let ruleId:
    string | null =
    null;

  if (
    value.ruleId != null
  ) {
    if (
      typeof value.ruleId !==
      "string"
    ) {
      return null;
    }

    ruleId =
      normalizeTextV0_1(
        value.ruleId,
      ) || null;
  }

  const evidenceRefs =
    normalizeUniqueTextArrayV0_1(
      value.evidenceRefs,
    );

  if (
    evidenceRefs ===
    null
  ) {
    return null;
  }

  return {
    provenanceId,
    authority,
    ruleId,
    evidenceRefs,
  };
}

type ObservationParseResultV0_1 =
  Readonly<{
    observation:
      SevenVoiceFunctionalRecurrenceAdmittedObservationV0_1 | null;

    reasonCodes:
      SevenVoiceFunctionalRecurrenceCohortEvidenceReasonCodeV0_1[];
  }>;

function parseObservationV0_1(
  value: unknown,
): ObservationParseResultV0_1 {
  const reasons =
    new Set<
      SevenVoiceFunctionalRecurrenceCohortEvidenceReasonCodeV0_1
    >();

  if (!isRecord(value)) {
    return {
      observation:
        null,

      reasonCodes: [
        "invalid_input",
      ],
    };
  }

  const recurrenceEvidenceId =
    normalizeTextV0_1(
      value.recurrenceEvidenceId,
    );

  if (!recurrenceEvidenceId) {
    reasons.add(
      "invalid_recurrence_evidence_id",
    );
  }

  const evidenceRole =
    evidenceRoleIfValidV0_1(
      value.evidenceRole,
    );

  if (!evidenceRole) {
    reasons.add(
      "invalid_evidence_role",
    );
  }

  const languageId =
    normalizeTextV0_1(
      value.languageId,
    );

  if (!languageId) {
    reasons.add(
      "invalid_language_id",
    );
  }

  let languageVariety:
    string | null =
    null;

  if (
    value.languageVariety != null
  ) {
    if (
      typeof value.languageVariety !==
      "string"
    ) {
      reasons.add(
        "invalid_language_variety",
      );
    } else {
      languageVariety =
        normalizeTextV0_1(
          value.languageVariety,
        ) || null;
    }
  }

  const surfaceForm =
    normalizeTextV0_1(
      value.surfaceForm,
    );

  if (!surfaceForm) {
    reasons.add(
      "invalid_surface_form",
    );
  }

  const comparisonForm =
    normalizeTextV0_1(
      value.comparisonForm,
    );

  if (!comparisonForm) {
    reasons.add(
      "invalid_comparison_form",
    );
  }

  const comparisonMode =
    comparisonModeIfValidV0_1(
      value.comparisonMode,
    );

  if (!comparisonMode) {
    reasons.add(
      "unsupported_comparison_mode",
    );
  }

  const comparisonAuthority =
    normalizeTextV0_1(
      value.comparisonAuthority,
    );

  if (!comparisonAuthority) {
    reasons.add(
      "invalid_comparison_authority",
    );
  }

  const comparisonProvenance =
    parseComparisonProvenanceV0_1(
      value.comparisonProvenance,
    );

  if (!comparisonProvenance) {
    reasons.add(
      "invalid_comparison_provenance",
    );
  }

  if (
    comparisonProvenance &&
    comparisonAuthority &&
    !sameAuditTextV0_1(
      comparisonProvenance.authority,
      comparisonAuthority,
    )
  ) {
    reasons.add(
      "comparison_authority_mismatch",
    );
  }

  if (
    comparisonMode ===
      "transliteration" &&
    comparisonProvenance &&
    !comparisonProvenance.ruleId
  ) {
    reasons.add(
      "missing_transliteration_rule",
    );
  }

  if (
    comparisonMode ===
      "z_zero_functional_normalization" &&
    comparisonProvenance &&
    !comparisonProvenance.ruleId
  ) {
    reasons.add(
      "missing_functional_normalization_rule",
    );
  }

  const attestationTruth =
    attestationTruthIfValidV0_1(
      value.attestationTruth,
    );

  if (!attestationTruth) {
    reasons.add(
      "invalid_attestation_truth",
    );
  }

  const sourceStatus =
    sourceStatusIfValidV0_1(
      value.sourceStatus,
    );

  if (!sourceStatus) {
    reasons.add(
      "invalid_source_status",
    );
  }

  const citationsRaw =
    value.citations;

  const citations:
    MultiSourceFunctionalResearchCitationV0_1[] =
    [];

  if (
    !Array.isArray(
      citationsRaw,
    ) ||
    citationsRaw.length === 0
  ) {
    reasons.add(
      "missing_citations",
    );
  } else {
    for (
      const citationRaw
      of citationsRaw
    ) {
      const citation =
        parseCitationV0_1(
          citationRaw,
        );

      if (!citation) {
        reasons.add(
          "invalid_citation",
        );

        continue;
      }

      citations.push(
        citation,
      );
    }
  }

  if (
    citationsRaw instanceof
      Array &&
    citations.length !==
      citationsRaw.length
  ) {
    reasons.add(
      "invalid_citation",
    );
  }

  if (
    surfaceForm &&
    citations.length > 0 &&
    !citations.some(
      (citation) =>
        sameAuditTextV0_1(
          citation.attestedForm,
          surfaceForm,
        ),
    )
  ) {
    reasons.add(
      "surface_form_not_source_attested",
    );
  }

  const claimBoundary =
    claimBoundaryIfValidV0_1(
      value.claimBoundary,
    );

  if (!claimBoundary) {
    reasons.add(
      "claim_boundary_violation",
    );
  }

  if (
    reasons.size > 0 ||
    !evidenceRole ||
    !comparisonMode ||
    !comparisonProvenance ||
    !attestationTruth ||
    !sourceStatus ||
    !claimBoundary
  ) {
    return {
      observation:
        null,

      reasonCodes:
        [...reasons].sort(),
    };
  }

  const citationRefs =
    [...new Set(
      citations.map(
        (citation) =>
          citation.citationId,
      ),
    )];

  return {
    observation: {
      recurrenceEvidenceId,

      evidenceRole,

      languageId,
      languageVariety,

      surfaceForm,
      comparisonForm,

      comparisonMode,
      comparisonAuthority,

      comparisonProvenance,

      attestationTruth,
      sourceStatus,

      citationRefs,

      claimBoundary,
    },

    reasonCodes: [],
  };
}

/**
 * Validate one complete recurrence cohort.
 *
 * Fail-closed rule:
 *
 * if any observation is malformed, unsafe, duplicated, or violates
 * the claim boundary, the complete cohort is rejected and ZERO
 * recurrence forms are emitted.
 *
 * This prevents a partially valid cohort from silently changing the
 * shared canonical intersection.
 */
export function admitSevenVoiceFunctionalRecurrenceCohortEvidenceV0_1(
  value: unknown,
): SevenVoiceFunctionalRecurrenceCohortAdmissionV0_1 {
  const reasons =
    new Set<
      SevenVoiceFunctionalRecurrenceCohortEvidenceReasonCodeV0_1
    >();

  if (!isRecord(value)) {
    return {
      schemaVersion:
        SEVEN_VOICE_FUNCTIONAL_RECURRENCE_COHORT_EVIDENCE_SCHEMA_V0_1,

      status:
        "rejected",

      cohortId:
        "",

      conceptId:
        "",

      reasonCodes: [
        "invalid_input",
      ],

      observations: [],
      recurrenceForms: [],
      evidenceRefs: [],
    };
  }

  if (
    value.schemaVersion !==
      SEVEN_VOICE_FUNCTIONAL_RECURRENCE_COHORT_EVIDENCE_SCHEMA_V0_1
  ) {
    reasons.add(
      "invalid_schema_version",
    );
  }

  const cohortId =
    normalizeTextV0_1(
      value.cohortId,
    );

  if (!cohortId) {
    reasons.add(
      "missing_cohort_id",
    );
  }

  const conceptId =
    normalizeTextV0_1(
      value.conceptId,
    );

  if (!conceptId) {
    reasons.add(
      "missing_concept_id",
    );
  }

  if (
    !Array.isArray(
      value.observations,
    ) ||
    value.observations.length ===
      0
  ) {
    reasons.add(
      "empty_cohort",
    );

    return {
      schemaVersion:
        SEVEN_VOICE_FUNCTIONAL_RECURRENCE_COHORT_EVIDENCE_SCHEMA_V0_1,

      status:
        "rejected",

      cohortId,
      conceptId,

      reasonCodes:
        [...reasons].sort(),

      observations: [],
      recurrenceForms: [],
      evidenceRefs: [],
    };
  }

  const observations:
    SevenVoiceFunctionalRecurrenceAdmittedObservationV0_1[] =
    [];

  const seenIds =
    new Set<string>();

  for (
    const observationRaw
    of value.observations
  ) {
    const parsed =
      parseObservationV0_1(
        observationRaw,
      );

    for (
      const reasonCode
      of parsed.reasonCodes
    ) {
      reasons.add(
        reasonCode,
      );
    }

    if (!parsed.observation) {
      continue;
    }

    if (
      seenIds.has(
        parsed.observation
          .recurrenceEvidenceId,
      )
    ) {
      reasons.add(
        "duplicate_recurrence_evidence_id",
      );

      continue;
    }

    seenIds.add(
      parsed.observation
        .recurrenceEvidenceId,
    );

    observations.push(
      parsed.observation,
    );
  }

  if (
    reasons.size > 0 ||
    observations.length !==
      value.observations.length
  ) {
    return {
      schemaVersion:
        SEVEN_VOICE_FUNCTIONAL_RECURRENCE_COHORT_EVIDENCE_SCHEMA_V0_1,

      status:
        "rejected",

      cohortId,
      conceptId,

      reasonCodes:
        [...reasons].sort(),

      observations: [],
      recurrenceForms: [],
      evidenceRefs: [],
    };
  }

  const recurrenceForms:
    SevenVoiceFunctionalRecurrenceFormV0_1[] =
    observations.map(
      (observation) => ({
        languageId:
          observation.languageId,

        surfaceForm:
          observation.surfaceForm,

        comparisonForm:
          observation.comparisonForm,

        comparisonMode:
          observation.comparisonMode,

        comparisonAuthority:
          observation.comparisonAuthority,
      }),
    );

  const evidenceRefs =
    [...new Set(
      observations.flatMap(
        (observation) => [
          ...observation.citationRefs,
          ...observation
            .comparisonProvenance
            .evidenceRefs,
        ],
      ),
    )];

  return {
    schemaVersion:
      SEVEN_VOICE_FUNCTIONAL_RECURRENCE_COHORT_EVIDENCE_SCHEMA_V0_1,

    status:
      "accepted",

    cohortId,
    conceptId,

    reasonCodes: [],

    observations,
    recurrenceForms,
    evidenceRefs,
  };
}

/**
 * Evidence-backed recurrence entry point.
 *
 * The existing recurrence algorithm remains unchanged.
 *
 * Rejected evidence never reaches it.
 */
export function analyzeSevenVoiceFunctionalRecurrenceFromCohortEvidenceV0_1(
  value: unknown,
): SevenVoiceFunctionalRecurrenceEvidenceAnalysisV0_1 {
  const admission =
    admitSevenVoiceFunctionalRecurrenceCohortEvidenceV0_1(
      value,
    );

  if (
    admission.status !==
    "accepted"
  ) {
    return {
      status:
        "rejected",

      admission,

      recurrence:
        null,
    };
  }

  return {
    status:
      "accepted",

    admission,

    recurrence:
      analyzeSevenVoiceFunctionalRecurrenceV0_1({
        conceptId:
          admission.conceptId,

        forms:
          admission.recurrenceForms,
      }),
  };
}
