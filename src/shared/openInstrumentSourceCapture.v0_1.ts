import {
  OPEN_INSTRUMENT_SOURCE_TRADITION_MAPPINGS_V0_1,
  OPEN_INSTRUMENT_VERIFIED_SOURCE_RECORD_VERSION_V0_1,
  type OpenInstrumentVerifiedSourceRecordV0_1,
} from "./openInstrumentSourceAdapter.v0_1";

export const OPEN_INSTRUMENT_SOURCE_CAPTURE_VERSION_V0_1 =
  "open-instrument.reviewed-source-capture.v0_1" as const;

export type OpenInstrumentReviewedSourceCaptureV0_1 = {
  captureVersion: typeof OPEN_INSTRUMENT_SOURCE_CAPTURE_VERSION_V0_1;
  sourceTraditionId: string;
  sourceTitle?: string;
  sourceDateOrVersion: string;
  sourceUrlOrArchiveRef: string;
  entryLocator: string;
  attestedForm: string;
  attestedGloss: string;
  sourceHashOrArchiveHash?: string | null;
  sourceRecordId?: string;
};

export type OpenInstrumentSourceCaptureReasonCodeV0_1 =
  | "CAPTURE_INVALID"
  | "CAPTURE_VERSION_INVALID"
  | "SOURCE_TRADITION_UNKNOWN"
  | "SOURCE_RECORD_ID_COLLISION"
  | "SOURCE_DATE_OR_VERSION_MISSING"
  | "SOURCE_URL_OR_ARCHIVE_REF_MISSING"
  | "ENTRY_LOCATOR_MISSING"
  | "ATTESTED_FORM_MISSING"
  | "ATTESTED_GLOSS_MISSING";

export type OpenInstrumentSourceCaptureResultV0_1 =
  | {
      ok: true;
      sourceRecord: OpenInstrumentVerifiedSourceRecordV0_1;
    }
  | {
      ok: false;
      sourceRecord: null;
      reasonCodes: readonly OpenInstrumentSourceCaptureReasonCodeV0_1[];
    };

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
  reasonCodes: Iterable<OpenInstrumentSourceCaptureReasonCodeV0_1>,
): OpenInstrumentSourceCaptureReasonCodeV0_1[] {
  return [...new Set(reasonCodes)].sort();
}

function safeIdSegmentV0_1(value: string): string {
  const asciiSegment = value
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (asciiSegment) return asciiSegment;
  return Array.from(value.normalize("NFC").trim())
    .map((character) => `u${character.codePointAt(0)?.toString(16)}`)
    .join("-");
}

function generatedSourceRecordIdV0_1(
  sourceTraditionId: string,
  entryLocator: string,
  attestedForm: string,
): string {
  return [
    "capture",
    safeIdSegmentV0_1(sourceTraditionId),
    safeIdSegmentV0_1(entryLocator),
    safeIdSegmentV0_1(attestedForm),
    "v0_1",
  ].join(".");
}

const FORBIDDEN_CAPTURE_FIELDS_V0_1 = [
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

export function captureReviewedSourceV0_1(
  value: unknown,
): OpenInstrumentSourceCaptureResultV0_1 {
  if (!isRecordV0_1(value)) {
    return { ok: false, sourceRecord: null, reasonCodes: ["CAPTURE_INVALID"] };
  }

  if (
    FORBIDDEN_CAPTURE_FIELDS_V0_1.some((field) =>
      Object.prototype.hasOwnProperty.call(value, field),
    )
  ) {
    return { ok: false, sourceRecord: null, reasonCodes: ["CAPTURE_INVALID"] };
  }

  const captureVersion = normalizeTextV0_1(value.captureVersion);
  const sourceTraditionId = normalizeTextV0_1(value.sourceTraditionId);
  const mapping = sourceTraditionId
    ? OPEN_INSTRUMENT_SOURCE_TRADITION_MAPPINGS_V0_1[sourceTraditionId]
    : undefined;
  const sourceTitle = normalizeTextV0_1(value.sourceTitle) ?? mapping?.sourceTitle ?? null;
  const sourceDateOrVersion =
    normalizeTextV0_1(value.sourceDateOrVersion) ??
    mapping?.sourceDateOrVersion ??
    null;
  const sourceUrlOrArchiveRef = normalizeTextV0_1(value.sourceUrlOrArchiveRef);
  const entryLocator = normalizeTextV0_1(value.entryLocator);
  const attestedForm = normalizeTextV0_1(value.attestedForm);
  const attestedGloss = normalizeTextV0_1(value.attestedGloss);
  const sourceHashOrArchiveHash = normalizeNullableTextV0_1(
    value.sourceHashOrArchiveHash,
  );
  const suppliedSourceRecordId = normalizeTextV0_1(value.sourceRecordId);
  const reasonCodes = new Set<OpenInstrumentSourceCaptureReasonCodeV0_1>();

  if (captureVersion !== OPEN_INSTRUMENT_SOURCE_CAPTURE_VERSION_V0_1) {
    reasonCodes.add("CAPTURE_VERSION_INVALID");
  }
  if (!mapping) reasonCodes.add("SOURCE_TRADITION_UNKNOWN");
  if (!sourceDateOrVersion) reasonCodes.add("SOURCE_DATE_OR_VERSION_MISSING");
  if (!sourceUrlOrArchiveRef) reasonCodes.add("SOURCE_URL_OR_ARCHIVE_REF_MISSING");
  if (!entryLocator) reasonCodes.add("ENTRY_LOCATOR_MISSING");
  if (!attestedForm) reasonCodes.add("ATTESTED_FORM_MISSING");
  if (!attestedGloss) reasonCodes.add("ATTESTED_GLOSS_MISSING");

  for (const field of [
    "captureVersion",
    "sourceTraditionId",
    "sourceTitle",
    "sourceDateOrVersion",
    "sourceUrlOrArchiveRef",
    "entryLocator",
    "attestedForm",
    "attestedGloss",
    "sourceRecordId",
  ]) {
    if (value[field] !== undefined && typeof value[field] !== "string") {
      reasonCodes.add("CAPTURE_INVALID");
    }
  }
  if (
    value.sourceHashOrArchiveHash !== undefined &&
    value.sourceHashOrArchiveHash !== null &&
    typeof value.sourceHashOrArchiveHash !== "string"
  ) {
    reasonCodes.add("CAPTURE_INVALID");
  }

  if (
    reasonCodes.size > 0 ||
    !sourceTraditionId ||
    !mapping ||
    !sourceTitle ||
    !sourceDateOrVersion ||
    !sourceUrlOrArchiveRef ||
    !entryLocator ||
    !attestedForm ||
    !attestedGloss
  ) {
    return {
      ok: false,
      sourceRecord: null,
      reasonCodes: sortReasonCodesV0_1(reasonCodes),
    };
  }

  const sourceRecordId =
    suppliedSourceRecordId ??
    generatedSourceRecordIdV0_1(sourceTraditionId, entryLocator, attestedForm);

  return {
    ok: true,
    sourceRecord: {
      sourceRecordVersion: OPEN_INSTRUMENT_VERIFIED_SOURCE_RECORD_VERSION_V0_1,
      sourceRecordId,
      sourceTraditionId,
      language: mapping.language,
      sourceTitle,
      sourceAuthorOrEditor: mapping.sourceAuthorOrEditor,
      sourcePublisherOrHost: mapping.sourcePublisherOrHost,
      sourceDateOrVersion,
      sourceUrlOrArchiveRef,
      entryLocator,
      sourceHashOrArchiveHash,
      attestedForm,
      attestedGloss,
    },
  };
}

export function captureReviewedSourcesV0_1(
  values: readonly unknown[],
): readonly OpenInstrumentSourceCaptureResultV0_1[] {
  const results = values.map(captureReviewedSourceV0_1);
  const ids = new Map<string, number>();
  for (const result of results) {
    if (!result.ok) continue;
    ids.set(
      result.sourceRecord.sourceRecordId,
      (ids.get(result.sourceRecord.sourceRecordId) ?? 0) + 1,
    );
  }
  return results.map((result) => {
    if (!result.ok || (ids.get(result.sourceRecord.sourceRecordId) ?? 0) < 2) {
      return result;
    }
    return {
      ok: false,
      sourceRecord: null,
      reasonCodes: ["SOURCE_RECORD_ID_COLLISION"],
    };
  });
}
