export const OPEN_INSTRUMENT_OFFLINE_SOURCE_ENTRY_SNAPSHOT_VERSION_V0_1 =
  "open-instrument.offline-source-entry-snapshot.v0_1" as const;

export const OPEN_INSTRUMENT_SOURCE_FACT_CANDIDATE_VERSION_V0_1 =
  "open-instrument.source-fact-candidate.v0_1" as const;

export type OpenInstrumentOfflineSourceEntrySnapshotV0_1 = {
  snapshotVersion: typeof OPEN_INSTRUMENT_OFFLINE_SOURCE_ENTRY_SNAPSHOT_VERSION_V0_1;
  sourceTraditionId: string;
  sourceSnapshotId: string;
  sourceDateOrVersion?: string | null;
  sourceUrlOrArchiveRef?: string | null;
  entry: {
    headword: string;
    locator?: string | null;
    attestedForms: readonly string[];
    senses: readonly {
      label?: string | null;
      text: string;
    }[];
  };
};

export type OpenInstrumentSourceFactExtractorReasonCodeV0_1 =
  | "SNAPSHOT_INVALID"
  | "SNAPSHOT_VERSION_INVALID"
  | "UNSUPPORTED_SOURCE_FORMAT"
  | "SOURCE_SNAPSHOT_ID_MISSING"
  | "HEADWORD_NOT_FOUND"
  | "LOCATOR_NOT_FOUND"
  | "ATTESTED_FORM_NOT_FOUND"
  | "GLOSS_NOT_FOUND"
  | "MULTIPLE_FORMS_REVIEW_REQUIRED"
  | "MULTIPLE_SENSES_REVIEW_REQUIRED"
  | "REVIEW_REQUIRED";

export type OpenInstrumentExtractedSourceFactsV0_1 = {
  extractorVersion: typeof OPEN_INSTRUMENT_SOURCE_FACT_CANDIDATE_VERSION_V0_1;
  sourceTraditionId: string;
  sourceSnapshotId: string;
  sourceDateOrVersion: string | null;
  sourceUrlOrArchiveRef: string | null;
  headwordCandidates: readonly string[];
  entryLocatorCandidates: readonly string[];
  attestedFormCandidates: readonly string[];
  attestedGlossCandidates: readonly string[];
  diagnostics: readonly OpenInstrumentSourceFactExtractorReasonCodeV0_1[];
  reviewStatus: "EXTRACTED_REVIEW_REQUIRED";
};

export type OpenInstrumentSourceFactExtractionResultV0_1 =
  | {
      ok: true;
      candidate: OpenInstrumentExtractedSourceFactsV0_1;
    }
  | {
      ok: false;
      candidate: null;
      diagnostics: readonly OpenInstrumentSourceFactExtractorReasonCodeV0_1[];
      reviewStatus: "REVIEW_REQUIRED";
    };

const SUPPORTED_SOURCE_TRADITIONS_V0_1 = new Set([
  "fjale.fjalor-shqip.v0_1",
  "scaife.lewis-short.v0_1",
]);

const FORBIDDEN_SOURCE_FACT_FIELDS_V0_1 = [
  "targetWord",
  "targetSenseId",
  "embryo",
  "embryoRelation",
  "relationOperationIds",
  "semanticBridge",
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

function normalizeTextListV0_1(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(normalizeTextV0_1)
    .filter((item): item is string => item !== null);
}

function sortDiagnosticsV0_1(
  diagnostics: Iterable<OpenInstrumentSourceFactExtractorReasonCodeV0_1>,
): OpenInstrumentSourceFactExtractorReasonCodeV0_1[] {
  return [...new Set(diagnostics)].sort();
}

function extractSnapshotEntryV0_1(
  value: Record<string, unknown>,
): OpenInstrumentSourceFactExtractionResultV0_1 {
  const sourceTraditionId = normalizeTextV0_1(value.sourceTraditionId);
  const sourceSnapshotId = normalizeTextV0_1(value.sourceSnapshotId);
  const sourceDateOrVersion =
    value.sourceDateOrVersion === undefined || value.sourceDateOrVersion === null
      ? null
      : normalizeTextV0_1(value.sourceDateOrVersion);
  const sourceUrlOrArchiveRef =
    value.sourceUrlOrArchiveRef === undefined || value.sourceUrlOrArchiveRef === null
      ? null
      : normalizeTextV0_1(value.sourceUrlOrArchiveRef);
  const entry = isRecordV0_1(value.entry) ? value.entry : null;
  const headword = entry ? normalizeTextV0_1(entry.headword) : null;
  const locator = entry ? normalizeTextV0_1(entry.locator) : null;
  const attestedForms = entry ? normalizeTextListV0_1(entry.attestedForms) : [];
  const senses = entry && Array.isArray(entry.senses) ? entry.senses : [];
  const attestedGlosses = senses
    .map((sense) => (isRecordV0_1(sense) ? normalizeTextV0_1(sense.text) : null))
    .filter((item): item is string => item !== null);
  const diagnostics = new Set<OpenInstrumentSourceFactExtractorReasonCodeV0_1>();

  if (value.snapshotVersion !== OPEN_INSTRUMENT_OFFLINE_SOURCE_ENTRY_SNAPSHOT_VERSION_V0_1) {
    diagnostics.add("SNAPSHOT_VERSION_INVALID");
  }
  if (!sourceTraditionId || !SUPPORTED_SOURCE_TRADITIONS_V0_1.has(sourceTraditionId)) {
    diagnostics.add("UNSUPPORTED_SOURCE_FORMAT");
  }
  if (!sourceSnapshotId) diagnostics.add("SOURCE_SNAPSHOT_ID_MISSING");
  if (!entry || !headword) diagnostics.add("HEADWORD_NOT_FOUND");
  if (!locator) diagnostics.add("LOCATOR_NOT_FOUND");
  if (attestedForms.length === 0) diagnostics.add("ATTESTED_FORM_NOT_FOUND");
  if (attestedForms.length > 1) diagnostics.add("MULTIPLE_FORMS_REVIEW_REQUIRED");
  if (attestedGlosses.length === 0) diagnostics.add("GLOSS_NOT_FOUND");
  if (attestedGlosses.length > 1) diagnostics.add("MULTIPLE_SENSES_REVIEW_REQUIRED");

  const sortedDiagnostics = sortDiagnosticsV0_1(diagnostics);
  if (
    sortedDiagnostics.some((diagnostic) =>
      [
        "SNAPSHOT_INVALID",
        "SNAPSHOT_VERSION_INVALID",
        "UNSUPPORTED_SOURCE_FORMAT",
        "SOURCE_SNAPSHOT_ID_MISSING",
        "HEADWORD_NOT_FOUND",
        "LOCATOR_NOT_FOUND",
        "ATTESTED_FORM_NOT_FOUND",
        "GLOSS_NOT_FOUND",
      ].includes(diagnostic),
    ) ||
    !sourceTraditionId ||
    !sourceSnapshotId
  ) {
    return {
      ok: false,
      candidate: null,
      diagnostics: sortedDiagnostics.length > 0 ? sortedDiagnostics : ["SNAPSHOT_INVALID"],
      reviewStatus: "REVIEW_REQUIRED",
    };
  }

  return {
    ok: true,
    candidate: {
      extractorVersion: OPEN_INSTRUMENT_SOURCE_FACT_CANDIDATE_VERSION_V0_1,
      sourceTraditionId,
      sourceSnapshotId,
      sourceDateOrVersion,
      sourceUrlOrArchiveRef,
      headwordCandidates: [headword as string],
      entryLocatorCandidates: [locator as string],
      attestedFormCandidates: attestedForms,
      attestedGlossCandidates: attestedGlosses,
      diagnostics: sortedDiagnostics,
      reviewStatus: "EXTRACTED_REVIEW_REQUIRED",
    },
  };
}

export function extractOfflineSourceEntryFactsV0_1(
  value: unknown,
): OpenInstrumentSourceFactExtractionResultV0_1 {
  if (!isRecordV0_1(value)) {
    return {
      ok: false,
      candidate: null,
      diagnostics: ["SNAPSHOT_INVALID"],
      reviewStatus: "REVIEW_REQUIRED",
    };
  }

  if (
    FORBIDDEN_SOURCE_FACT_FIELDS_V0_1.some((field) =>
      Object.prototype.hasOwnProperty.call(value, field),
    )
  ) {
    return {
      ok: false,
      candidate: null,
      diagnostics: ["SNAPSHOT_INVALID"],
      reviewStatus: "REVIEW_REQUIRED",
    };
  }

  return extractSnapshotEntryV0_1(value);
}
