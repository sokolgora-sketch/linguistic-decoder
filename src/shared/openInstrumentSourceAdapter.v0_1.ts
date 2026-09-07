import type {
  MultiSourceFunctionalResearchCitationV0_1,
} from "./multiSourceFunctionalResearchEvidenceRegistry.v0_1";
import type {
  MultiSourceEvidenceFamilyV0_1,
} from "./multiSourceFunctionalDiscovery.v0_1";

export const OPEN_INSTRUMENT_VERIFIED_SOURCE_RECORD_VERSION_V0_1 =
  "open-instrument.verified-source-record.v0_1" as const;

export type OpenInstrumentVerifiedSourceRecordV0_1 = {
  sourceRecordVersion:
    typeof OPEN_INSTRUMENT_VERIFIED_SOURCE_RECORD_VERSION_V0_1;
  sourceRecordId: string;
  sourceTraditionId: string;
  language: string | null;
  sourceTitle: string | null;
  sourceAuthorOrEditor: string | null;
  sourcePublisherOrHost: string | null;
  sourceDateOrVersion: string | null;
  sourceUrlOrArchiveRef: string | null;
  entryLocator: string | null;
  sourceHashOrArchiveHash: string | null;
  attestedForm: string | null;
  attestedGloss: string | null;
};

export type OpenInstrumentSourceAdapterClassificationV0_1 =
  | "FACT_FROM_SOURCE"
  | "DETERMINISTIC_DERIVATION"
  | "REVIEW_REQUIRED"
  | "UNKNOWN";

export type OpenInstrumentSourceAdapterReasonCodeV0_1 =
  | "SOURCE_RECORD_INVALID"
  | "SOURCE_IDENTITY_UNKNOWN"
  | "ENTRY_LOCATOR_MISSING"
  | "ATTESTED_FORM_MISSING"
  | "ATTESTED_GLOSS_MISSING"
  | "LANGUAGE_MISSING"
  | "EVIDENCE_FAMILY_UNRESOLVED"
  | "PROVENANCE_UNRESOLVED"
  | "REVIEW_REQUIRED";

export type OpenInstrumentNormalizedSourceCandidateV0_1 = {
  sourceRecordId: string;
  sourceKey: string;
  evidenceFamily: MultiSourceEvidenceFamilyV0_1 | null;
  language: string | null;
  form: string | null;
  gloss: string | null;
  citation: MultiSourceFunctionalResearchCitationV0_1 | null;
  classifications: {
    sourceIdentity: OpenInstrumentSourceAdapterClassificationV0_1;
    attestedForm: OpenInstrumentSourceAdapterClassificationV0_1;
    attestedGloss: OpenInstrumentSourceAdapterClassificationV0_1;
    evidenceFamily: OpenInstrumentSourceAdapterClassificationV0_1;
    provenance: OpenInstrumentSourceAdapterClassificationV0_1;
  };
  reasonCodes: readonly OpenInstrumentSourceAdapterReasonCodeV0_1[];
};

export type OpenInstrumentSourceAdapterResultV0_1 =
  | {
      ok: true;
      admissible: boolean;
      candidate: OpenInstrumentNormalizedSourceCandidateV0_1;
    }
  | {
      ok: false;
      admissible: false;
      candidate: null;
      reasonCodes: readonly OpenInstrumentSourceAdapterReasonCodeV0_1[];
    };

type SourceTraditionMappingV0_1 = {
  evidenceFamily: MultiSourceEvidenceFamilyV0_1;
  provenanceGroupId: string;
  language: string;
  sourceTitle: string;
  sourceAuthorOrEditor: string | null;
  sourcePublisherOrHost: string;
  sourceDateOrVersion: string | null;
};

/** These IDs are copied from existing catalog provenance, not generated here. */
export const OPEN_INSTRUMENT_SOURCE_TRADITION_MAPPINGS_V0_1: Readonly<
  Record<string, SourceTraditionMappingV0_1>
> = {
  "fjale.fjalor-shqip.v0_1": {
    evidenceFamily: "lexical_dictionary",
    provenanceGroupId: "fjale.fjalor-shqip.v0_1",
    language: "Albanian",
    sourceTitle: "FJALË — Fjalor Shqip",
    sourceAuthorOrEditor: null,
    sourcePublisherOrHost: "FJALË — Fjalor Shqip",
    sourceDateOrVersion: null,
  },
  "scaife.lewis-short.v0_1": {
    evidenceFamily: "historical_dictionary",
    provenanceGroupId: "scaife.lewis-short.v0_1",
    language: "Latin",
    sourceTitle: "Lewis & Short Latin Dictionary",
    sourceAuthorOrEditor: "Charlton T. Lewis and Charles Short",
    sourcePublisherOrHost: "Scaife ATLAS / Perseus Digital Library",
    sourceDateOrVersion: null,
  },
  "scaife.middle-liddell.v0_1": {
    evidenceFamily: "historical_dictionary",
    provenanceGroupId: "scaife.middle-liddell.v0_1",
    language: "Ancient Greek",
    sourceTitle: "Middle Liddell",
    sourceAuthorOrEditor: "Henry George Liddell and Robert Scott",
    sourcePublisherOrHost: "Scaife ATLAS / Perseus Digital Library",
    sourceDateOrVersion: null,
  },
};

const FORBIDDEN_SOURCE_RECORD_FIELDS_V0_1 = [
  "targetWord",
  "targetSenseId",
  "embryo",
  "semanticBridge",
  "embryoRelation",
  "relationOperationIds",
  "historicalOriginClaim",
  "historicalTransmissionClaim",
  "winnerClaim",
  "candidateTruthClaim",
  "languageSuperiorityClaim",
] as const;

function isRecordV0_1(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeTextV0_1(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.normalize("NFC").trim();
  return normalized || null;
}

function normalizeNullableTextV0_1(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  return normalizeTextV0_1(value);
}

function sortReasonCodesV0_1(
  reasonCodes: Iterable<OpenInstrumentSourceAdapterReasonCodeV0_1>,
): OpenInstrumentSourceAdapterReasonCodeV0_1[] {
  return [...new Set(reasonCodes)].sort();
}

function sourceKeyV0_1(sourceRecordId: string): string {
  return `verified-source:${sourceRecordId}`;
}

function citationIdV0_1(sourceRecordId: string): string {
  return `open-instrument.source-record.${sourceRecordId}.citation.v0_1`;
}

function forbiddenFieldPresentV0_1(value: Record<string, unknown>): boolean {
  return FORBIDDEN_SOURCE_RECORD_FIELDS_V0_1.some((field) =>
    Object.prototype.hasOwnProperty.call(value, field),
  );
}

export function adaptVerifiedSourceRecordV0_1(
  value: unknown,
): OpenInstrumentSourceAdapterResultV0_1 {
  if (!isRecordV0_1(value) || forbiddenFieldPresentV0_1(value)) {
    return {
      ok: false,
      admissible: false,
      candidate: null,
      reasonCodes: ["SOURCE_RECORD_INVALID"],
    };
  }

  const sourceRecordVersion = normalizeTextV0_1(value.sourceRecordVersion);
  const sourceRecordId = normalizeTextV0_1(value.sourceRecordId);
  const sourceTraditionId = normalizeTextV0_1(value.sourceTraditionId);
  const language = normalizeNullableTextV0_1(value.language);
  const sourceTitle = normalizeNullableTextV0_1(value.sourceTitle);
  const sourceAuthorOrEditor = normalizeNullableTextV0_1(
    value.sourceAuthorOrEditor,
  );
  const sourcePublisherOrHost = normalizeNullableTextV0_1(
    value.sourcePublisherOrHost,
  );
  const sourceDateOrVersion = normalizeNullableTextV0_1(
    value.sourceDateOrVersion,
  );
  const sourceUrlOrArchiveRef = normalizeNullableTextV0_1(
    value.sourceUrlOrArchiveRef,
  );
  const entryLocator = normalizeNullableTextV0_1(value.entryLocator);
  const sourceHashOrArchiveHash = normalizeNullableTextV0_1(
    value.sourceHashOrArchiveHash,
  );
  const attestedForm = normalizeNullableTextV0_1(value.attestedForm);
  const attestedGloss = normalizeNullableTextV0_1(value.attestedGloss);

  const reasonCodes = new Set<OpenInstrumentSourceAdapterReasonCodeV0_1>();

  if (
    sourceRecordVersion !==
    OPEN_INSTRUMENT_VERIFIED_SOURCE_RECORD_VERSION_V0_1
  ) {
    reasonCodes.add("SOURCE_RECORD_INVALID");
  }
  if (
    !sourceRecordId ||
    !sourceTraditionId ||
    !sourceTitle ||
    !sourcePublisherOrHost ||
    !sourceDateOrVersion ||
    !sourceUrlOrArchiveRef
  ) {
    reasonCodes.add("SOURCE_RECORD_INVALID");
  }
  if (!language) reasonCodes.add("LANGUAGE_MISSING");
  if (!entryLocator) reasonCodes.add("ENTRY_LOCATOR_MISSING");
  if (!attestedForm) reasonCodes.add("ATTESTED_FORM_MISSING");
  if (!attestedGloss) reasonCodes.add("ATTESTED_GLOSS_MISSING");

  if (
    [
      "sourceRecordVersion",
      "sourceRecordId",
      "sourceTraditionId",
      "language",
      "sourceTitle",
      "sourceAuthorOrEditor",
      "sourcePublisherOrHost",
      "sourceDateOrVersion",
      "sourceUrlOrArchiveRef",
      "entryLocator",
      "sourceHashOrArchiveHash",
      "attestedForm",
      "attestedGloss",
    ].some((field) => {
      const raw = value[field];
      return raw !== null && raw !== undefined && typeof raw !== "string";
    })
  ) {
    reasonCodes.add("SOURCE_RECORD_INVALID");
  }

  if (
    reasonCodes.size > 0 ||
    !sourceRecordId ||
    !sourceTraditionId ||
    !sourceTitle ||
    !sourcePublisherOrHost ||
    !sourceDateOrVersion ||
    !sourceUrlOrArchiveRef ||
    !entryLocator ||
    !attestedForm ||
    !attestedGloss ||
    !language
  ) {
    return {
      ok: false,
      admissible: false,
      candidate: null,
      reasonCodes: sortReasonCodesV0_1(reasonCodes),
    };
  }

  const mapping = OPEN_INSTRUMENT_SOURCE_TRADITION_MAPPINGS_V0_1[
    sourceTraditionId
  ];

  if (!mapping) {
    reasonCodes.add("SOURCE_IDENTITY_UNKNOWN");
    reasonCodes.add("EVIDENCE_FAMILY_UNRESOLVED");
    reasonCodes.add("PROVENANCE_UNRESOLVED");
    reasonCodes.add("REVIEW_REQUIRED");
  }

  const sortedReasonCodes = sortReasonCodesV0_1(reasonCodes);
  const candidate: OpenInstrumentNormalizedSourceCandidateV0_1 = {
    sourceRecordId,
    sourceKey: sourceKeyV0_1(sourceRecordId),
    evidenceFamily: mapping?.evidenceFamily ?? null,
    language,
    form: attestedForm,
    gloss: attestedGloss,
    citation: mapping
      ? {
          citationId: citationIdV0_1(sourceRecordId),
          sourceTitle,
          sourceAuthorOrEditor,
          sourcePublisherOrHost: sourcePublisherOrHost ?? "",
          sourceDateOrVersion: sourceDateOrVersion ?? "",
          sourceUrlOrArchiveRef,
          entryLocator,
          sourceHashOrArchiveHash,
          attestedForm,
          attestedGloss,
          provenanceGroupId: mapping.provenanceGroupId,
        }
      : null,
    classifications: {
      sourceIdentity: mapping ? "FACT_FROM_SOURCE" : "REVIEW_REQUIRED",
      attestedForm: "FACT_FROM_SOURCE",
      attestedGloss: "FACT_FROM_SOURCE",
      evidenceFamily: mapping
        ? "DETERMINISTIC_DERIVATION"
        : "UNKNOWN",
      provenance: mapping ? "DETERMINISTIC_DERIVATION" : "UNKNOWN",
    },
    reasonCodes: sortedReasonCodes,
  };

  return {
    ok: true,
    admissible: sortedReasonCodes.length === 0,
    candidate,
  };
}

export function adaptVerifiedSourceRecordsV0_1(
  values: readonly unknown[],
): readonly OpenInstrumentSourceAdapterResultV0_1[] {
  const results = values.map(adaptVerifiedSourceRecordV0_1);
  const sourceRecordCounts = new Map<string, number>();
  const sourceKeyCounts = new Map<string, number>();
  const citationIdCounts = new Map<string, number>();

  for (const result of results) {
    if (!result.ok) continue;
    const { sourceRecordId, sourceKey, citation } = result.candidate;
    sourceRecordCounts.set(
      sourceRecordId,
      (sourceRecordCounts.get(sourceRecordId) ?? 0) + 1,
    );
    sourceKeyCounts.set(sourceKey, (sourceKeyCounts.get(sourceKey) ?? 0) + 1);
    if (citation) {
      citationIdCounts.set(
        citation.citationId,
        (citationIdCounts.get(citation.citationId) ?? 0) + 1,
      );
    }
  }

  for (const result of results) {
    if (!result.ok) continue;
    const { sourceRecordId, sourceKey, citation } = result.candidate;
    if (
      (sourceRecordCounts.get(sourceRecordId) ?? 0) > 1 ||
      (sourceKeyCounts.get(sourceKey) ?? 0) > 1 ||
      (citation && (citationIdCounts.get(citation.citationId) ?? 0) > 1)
    ) {
      result.candidate = {
        ...result.candidate,
        reasonCodes: sortReasonCodesV0_1([
          ...result.candidate.reasonCodes,
          "SOURCE_RECORD_INVALID",
        ]),
      };
      result.admissible = false;
    }
  }

  return results;
}
