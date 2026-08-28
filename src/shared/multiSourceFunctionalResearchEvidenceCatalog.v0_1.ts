import rawCatalog from "../data/multiSourceFunctionalResearchEvidenceCatalog.v0_1.json";

import {
  MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,
  type MultiSourceFunctionalResearchCitationV0_1,
  type MultiSourceFunctionalResearchEvidenceRowV0_1,
  type MultiSourceFunctionalResearchHypothesisV0_1,
} from "./multiSourceFunctionalResearchEvidenceRegistry.v0_1";

import type {
  EmbryoSourceRelationV0_1,
  MultiSourceEvidenceFamilyV0_1,
  MultiSourceTruthStatusV0_1,
} from "./multiSourceFunctionalDiscovery.v0_1";

export const MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_CATALOG_VERSION_V0_1 =
  "open-instrument.multi-source-functional-research-evidence-catalog.v0_1" as const;

type UnknownRecord =
  Record<
    string,
    unknown
  >;

function isRecord(
  value: unknown,
): value is UnknownRecord {
  return (
    typeof value ===
      "object" &&
    value !== null &&
    !Array.isArray(
      value,
    )
  );
}

function nonEmptyString(
  value: unknown,
): string | null {
  if (
    typeof value !==
      "string"
  ) {
    return null;
  }

  const normalized =
    value
      .normalize("NFC")
      .trim();

  return normalized ||
    null;
}

function nullableString(
  value: unknown,
): string | null | undefined {
  if (
    value ===
      null
  ) {
    return null;
  }

  const normalized =
    nonEmptyString(
      value,
    );

  return normalized ??
    undefined;
}

function exactString<
  T extends string,
>(
  value: unknown,
  allowed:
    readonly T[],
): T | null {
  return (
    typeof value ===
      "string" &&
    (
      allowed as
        readonly string[]
    ).includes(
      value,
    )
  )
    ? value as T
    : null;
}

const EVIDENCE_FAMILIES_V0_1 =
  [
    "lexical_dictionary",
    "dialect_lexicon",
    "etymological_dictionary",
    "historical_dictionary",
    "corpus",
    "scholarly_paper",
    "reconstructed_lexicon",
    "other",
  ] as const satisfies
    readonly MultiSourceEvidenceFamilyV0_1[];

const EMBRYO_RELATIONS_V0_1 =
  [
    "exact_form",
    "authorized_transformation",
    "reconstructed_form",
    "phonetic_resemblance",
    "semantic_resemblance",
    "unresolved",
    "unsupported",
  ] as const satisfies
    readonly EmbryoSourceRelationV0_1[];

const TRUTH_STATUSES_V0_1 =
  [
    "fact",
    "inference",
    "hypothesis",
    "unknown",
  ] as const satisfies
    readonly MultiSourceTruthStatusV0_1[];

const SOURCE_STATUSES_V0_1 =
  [
    "research_candidate",
    "reviewed_candidate",
  ] as const;

function parseCitationV0_1(
  value: unknown,
): MultiSourceFunctionalResearchCitationV0_1 | null {
  if (
    !isRecord(
      value,
    )
  ) {
    return null;
  }

  const citationId =
    nonEmptyString(
      value.citationId,
    );

  const sourceTitle =
    nonEmptyString(
      value.sourceTitle,
    );

  const sourceAuthorOrEditor =
    nullableString(
      value.sourceAuthorOrEditor,
    );

  const sourcePublisherOrHost =
    nonEmptyString(
      value.sourcePublisherOrHost,
    );

  const sourceDateOrVersion =
    nonEmptyString(
      value.sourceDateOrVersion,
    );

  const sourceUrlOrArchiveRef =
    nonEmptyString(
      value.sourceUrlOrArchiveRef,
    );

  const entryLocator =
    nonEmptyString(
      value.entryLocator,
    );

  const sourceHashOrArchiveHash =
    nullableString(
      value.sourceHashOrArchiveHash,
    );

  const attestedForm =
    nonEmptyString(
      value.attestedForm,
    );

  const attestedGloss =
    nonEmptyString(
      value.attestedGloss,
    );

  if (
    !citationId ||
    !sourceTitle ||
    sourceAuthorOrEditor ===
      undefined ||
    !sourcePublisherOrHost ||
    !sourceDateOrVersion ||
    !sourceUrlOrArchiveRef ||
    !entryLocator ||
    sourceHashOrArchiveHash ===
      undefined ||
    !attestedForm ||
    !attestedGloss
  ) {
    return null;
  }

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

function parseHypothesisV0_1(
  value: unknown,
): MultiSourceFunctionalResearchHypothesisV0_1 | null {
  if (
    !isRecord(
      value,
    )
  ) {
    return null;
  }

  const targetWord =
    nonEmptyString(
      value.targetWord,
    );

  const semanticBridge =
    nullableString(
      value.semanticBridge,
    );

  const functionalBridgeTruth =
    exactString(
      value.functionalBridgeTruth,
      TRUTH_STATUSES_V0_1,
    );

  if (
    !targetWord ||
    semanticBridge ===
      undefined ||
    !functionalBridgeTruth ||
    value.claimBoundary !==
      "functional_hypothesis_only"
  ) {
    return null;
  }

  return {
    targetWord,
    semanticBridge,
    functionalBridgeTruth,
    claimBoundary:
      "functional_hypothesis_only",
  };
}

function parseRowV0_1(
  value: unknown,
): MultiSourceFunctionalResearchEvidenceRowV0_1 | null {
  if (
    !isRecord(
      value,
    )
  ) {
    return null;
  }

  if (
    value.registryVersion !==
      MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1
  ) {
    return null;
  }

  const researchEvidenceId =
    nonEmptyString(
      value.researchEvidenceId,
    );

  const embryo =
    nonEmptyString(
      value.embryo,
    );

  const evidenceFamily =
    exactString(
      value.evidenceFamily,
      EVIDENCE_FAMILIES_V0_1,
    );

  const language =
    nonEmptyString(
      value.language,
    );

  const form =
    nonEmptyString(
      value.form,
    );

  const gloss =
    nonEmptyString(
      value.gloss,
    );

  const embryoRelation =
    exactString(
      value.embryoRelation,
      EMBRYO_RELATIONS_V0_1,
    );

  const attestationTruth =
    exactString(
      value.attestationTruth,
      TRUTH_STATUSES_V0_1,
    );

  const sourceStatus =
    exactString(
      value.sourceStatus,
      SOURCE_STATUSES_V0_1,
    );

  if (
    !researchEvidenceId ||
    !embryo ||
    !evidenceFamily ||
    !language ||
    !form ||
    !gloss ||
    !embryoRelation ||
    !attestationTruth ||
    !sourceStatus
  ) {
    return null;
  }

  if (
    !Array.isArray(
      value.relationOperationIds,
    ) ||
    !value.relationOperationIds.every(
      (operationId) =>
        nonEmptyString(
          operationId,
        ) !== null,
    )
  ) {
    return null;
  }

  const relationOperationIds =
    value.relationOperationIds.map(
      (operationId) =>
        nonEmptyString(
          operationId,
        )!,
    );

  if (
    !Array.isArray(
      value.citations,
    ) ||
    value.citations.length ===
      0
  ) {
    return null;
  }

  const citations =
    value.citations.map(
      parseCitationV0_1,
    );

  if (
    citations.some(
      (citation) =>
        citation ===
          null,
    )
  ) {
    return null;
  }

  const citationRows =
    citations as
      MultiSourceFunctionalResearchCitationV0_1[];

  const citationIds =
    citationRows.map(
      (citation) =>
        citation.citationId,
    );

  if (
    new Set(
      citationIds,
    ).size !==
      citationIds.length
  ) {
    return null;
  }

  if (
    !Array.isArray(
      value.functionalHypotheses,
    ) ||
    value.functionalHypotheses.length ===
      0
  ) {
    return null;
  }

  const functionalHypotheses =
    value.functionalHypotheses.map(
      parseHypothesisV0_1,
    );

  if (
    functionalHypotheses.some(
      (hypothesis) =>
        hypothesis ===
          null,
    )
  ) {
    return null;
  }

  if (
    value.historicalOriginClaim !==
      "not_claimed" ||
    value.historicalTransmissionClaim !==
      "not_claimed" ||
    value.winnerClaim !==
      "not_claimed" ||
    value.languageSuperiorityClaim !==
      "not_claimed" ||
    value.candidateTruthClaim !==
      "not_claimed" ||
    value.userDecisionPosture !==
      "user_decides"
  ) {
    return null;
  }

  return {
    registryVersion:
      MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,

    researchEvidenceId,
    embryo,
    evidenceFamily,
    language,
    form,
    gloss,
    embryoRelation,
    relationOperationIds,
    attestationTruth,
    sourceStatus,
    citations:
      citationRows,
    functionalHypotheses:
      functionalHypotheses as
        MultiSourceFunctionalResearchHypothesisV0_1[],

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
  };
}

/**
 * Validate one complete static research catalog.
 *
 * The catalog is passive evidence data.
 *
 * It does not create structural hypotheses, authorize runtime
 * operations, review evidence, or establish historical origin.
 *
 * Any malformed row causes the complete catalog to fail closed.
 */
export function parseMultiSourceFunctionalResearchEvidenceCatalogV0_1(
  value: unknown,
): MultiSourceFunctionalResearchEvidenceRowV0_1[] {
  if (
    !isRecord(
      value,
    ) ||
    value.catalogVersion !==
      MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_CATALOG_VERSION_V0_1 ||
    !Array.isArray(
      value.rows,
    )
  ) {
    return [];
  }

  const rows =
    value.rows.map(
      parseRowV0_1,
    );

  if (
    rows.some(
      (row) =>
        row ===
          null,
    )
  ) {
    return [];
  }

  const parsedRows =
    rows as
      MultiSourceFunctionalResearchEvidenceRowV0_1[];

  const researchEvidenceIds =
    parsedRows.map(
      (row) =>
        row.researchEvidenceId,
    );

  if (
    new Set(
      researchEvidenceIds,
    ).size !==
      researchEvidenceIds.length
  ) {
    return [];
  }

  return parsedRows;
}

export function loadMultiSourceFunctionalResearchEvidenceCatalogV0_1():
  MultiSourceFunctionalResearchEvidenceRowV0_1[] {
  return parseMultiSourceFunctionalResearchEvidenceCatalogV0_1(
    rawCatalog as unknown,
  );
}
