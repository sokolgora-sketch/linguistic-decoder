import {
  OPEN_INSTRUMENT_OFFLINE_SOURCE_ENTRY_SNAPSHOT_VERSION_V0_1,
  type OpenInstrumentOfflineSourceEntrySnapshotV0_1,
} from "./openInstrumentOfflineSourceEntryExtractor.v0_1";

export const OPEN_INSTRUMENT_SOURCE_SNAPSHOT_BUILDER_VERSION_V0_1 =
  "open-instrument.source-snapshot-builder.v0_1" as const;

export type OpenInstrumentReviewedSourceEntryCaptureV0_1 = {
  builderVersion: typeof OPEN_INSTRUMENT_SOURCE_SNAPSHOT_BUILDER_VERSION_V0_1;
  sourceTraditionId: string;
  sourceUrlOrArchiveRef: string;
  sourceDateOrVersion?: string | null;
  entryHeadword: string;
  entryLocator: string;
  senseLabel?: string | null;
  attestedForm: string;
  attestedGloss: string;
};

export type OpenInstrumentSourceSnapshotBuilderReasonCodeV0_1 =
  | "INVALID_BUILDER_VERSION"
  | "UNKNOWN_SOURCE_TRADITION"
  | "SOURCE_URL_MISSING"
  | "ENTRY_HEADWORD_MISSING"
  | "ENTRY_LOCATOR_MISSING"
  | "ATTESTED_FORM_MISSING"
  | "ATTESTED_GLOSS_MISSING"
  | "INVALID_OPTIONAL_DATE_VERSION"
  | "INVALID_OPTIONAL_SENSE_LABEL";

export type OpenInstrumentSourceSnapshotBuilderResultV0_1 =
  | {
      ok: true;
      snapshot: OpenInstrumentOfflineSourceEntrySnapshotV0_1;
    }
  | {
      ok: false;
      snapshot: null;
      reasonCodes: readonly OpenInstrumentSourceSnapshotBuilderReasonCodeV0_1[];
    };

const TRADITION_ID_PREFIXES_V0_1: Readonly<Record<string, string>> = {
  "fjale.fjalor-shqip.v0_1": "fjale",
  "scaife.lewis-short.v0_1": "scaife",
};

function isRecordV0_1(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeTextV0_1(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.normalize("NFC").trim();
  return normalized || null;
}

function sortReasonCodesV0_1(
  reasonCodes: Iterable<OpenInstrumentSourceSnapshotBuilderReasonCodeV0_1>,
): OpenInstrumentSourceSnapshotBuilderReasonCodeV0_1[] {
  return [...new Set(reasonCodes)].sort();
}

function safeIdSegmentV0_1(value: string): string {
  const asciiSegment = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return asciiSegment || "undetermined";
}

function sourceSnapshotIdV0_1(
  sourceTraditionId: string,
  entryHeadword: string,
  sourceDateOrVersion: string | null,
): string {
  const traditionPrefix = TRADITION_ID_PREFIXES_V0_1[sourceTraditionId];
  const dateMatch = sourceDateOrVersion?.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  const versionSegment = dateMatch
    ? dateMatch[1]
    : sourceDateOrVersion
      ? safeIdSegmentV0_1(sourceDateOrVersion)
      : "undated";

  return [
    traditionPrefix,
    safeIdSegmentV0_1(entryHeadword),
    "reviewed",
    versionSegment,
  ].join("-");
}

export function buildOfflineSourceEntrySnapshotV0_1(
  value: unknown,
): OpenInstrumentSourceSnapshotBuilderResultV0_1 {
  if (!isRecordV0_1(value)) {
    return {
      ok: false,
      snapshot: null,
      reasonCodes: ["INVALID_BUILDER_VERSION"],
    };
  }

  const builderVersion = normalizeTextV0_1(value.builderVersion);
  const sourceTraditionId = normalizeTextV0_1(value.sourceTraditionId);
  const sourceUrlOrArchiveRef = normalizeTextV0_1(value.sourceUrlOrArchiveRef);
  const sourceDateOrVersion =
    value.sourceDateOrVersion === undefined || value.sourceDateOrVersion === null
      ? null
      : normalizeTextV0_1(value.sourceDateOrVersion);
  const entryHeadword = normalizeTextV0_1(value.entryHeadword);
  const entryLocator = normalizeTextV0_1(value.entryLocator);
  const senseLabel =
    value.senseLabel === undefined || value.senseLabel === null
      ? null
      : normalizeTextV0_1(value.senseLabel);
  const attestedForm = normalizeTextV0_1(value.attestedForm);
  const attestedGloss = normalizeTextV0_1(value.attestedGloss);
  const reasonCodes = new Set<OpenInstrumentSourceSnapshotBuilderReasonCodeV0_1>();

  if (builderVersion !== OPEN_INSTRUMENT_SOURCE_SNAPSHOT_BUILDER_VERSION_V0_1) {
    reasonCodes.add("INVALID_BUILDER_VERSION");
  }
  if (!sourceTraditionId || !TRADITION_ID_PREFIXES_V0_1[sourceTraditionId]) {
    reasonCodes.add("UNKNOWN_SOURCE_TRADITION");
  }
  if (!sourceUrlOrArchiveRef) reasonCodes.add("SOURCE_URL_MISSING");
  if (!entryHeadword) reasonCodes.add("ENTRY_HEADWORD_MISSING");
  if (!entryLocator) reasonCodes.add("ENTRY_LOCATOR_MISSING");
  if (!attestedForm) reasonCodes.add("ATTESTED_FORM_MISSING");
  if (!attestedGloss) reasonCodes.add("ATTESTED_GLOSS_MISSING");
  if (
    value.sourceDateOrVersion !== undefined &&
    value.sourceDateOrVersion !== null &&
    !sourceDateOrVersion
  ) {
    reasonCodes.add("INVALID_OPTIONAL_DATE_VERSION");
  }
  if (
    value.senseLabel !== undefined &&
    value.senseLabel !== null &&
    !senseLabel
  ) {
    reasonCodes.add("INVALID_OPTIONAL_SENSE_LABEL");
  }

  for (const field of [
    "builderVersion",
    "sourceTraditionId",
    "sourceUrlOrArchiveRef",
    "entryHeadword",
    "entryLocator",
    "attestedForm",
    "attestedGloss",
  ]) {
    if (value[field] !== undefined && typeof value[field] !== "string") {
      reasonCodes.add("INVALID_BUILDER_VERSION");
    }
  }

  const optionalTextFields = ["sourceDateOrVersion", "senseLabel"] as const;
  for (const field of optionalTextFields) {
    if (
      value[field] !== undefined &&
      value[field] !== null &&
      typeof value[field] !== "string"
    ) {
      reasonCodes.add(
        field === "sourceDateOrVersion"
          ? "INVALID_OPTIONAL_DATE_VERSION"
          : "INVALID_OPTIONAL_SENSE_LABEL",
      );
    }
  }

  const sortedReasonCodes = sortReasonCodesV0_1(reasonCodes);
  if (sortedReasonCodes.length > 0) {
    return {
      ok: false,
      snapshot: null,
      reasonCodes: sortedReasonCodes,
    };
  }

  const snapshot: OpenInstrumentOfflineSourceEntrySnapshotV0_1 = {
    snapshotVersion: OPEN_INSTRUMENT_OFFLINE_SOURCE_ENTRY_SNAPSHOT_VERSION_V0_1,
    sourceTraditionId: sourceTraditionId as string,
    sourceSnapshotId: sourceSnapshotIdV0_1(
      sourceTraditionId as string,
      entryHeadword as string,
      sourceDateOrVersion,
    ),
    ...(sourceDateOrVersion ? { sourceDateOrVersion } : {}),
    sourceUrlOrArchiveRef: sourceUrlOrArchiveRef as string,
    entry: {
      headword: entryHeadword as string,
      locator: entryLocator as string,
      attestedForms: [attestedForm as string],
      senses: [
        {
          ...(senseLabel ? { label: senseLabel } : {}),
          text: attestedGloss as string,
        },
      ],
    },
  };

  return { ok: true, snapshot };
}
