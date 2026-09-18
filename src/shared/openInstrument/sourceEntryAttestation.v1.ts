export const SOURCE_ENTRY_ATTESTATION_SCHEMA_V1 =
  "open-instrument.source-entry-attestation.v1" as const;

export type SourceEntrySelectionStatusV1 =
  | "NOT_APPLICABLE"
  | "UNRESOLVED"
  | "EXPLICITLY_RESOLVED";

export type SourceSenseSelectionStatusV1 =
  | "NOT_APPLICABLE"
  | "UNRESOLVED"
  | "EXPLICITLY_RESOLVED";

export type SourceEntryAttestationSenseV1 = Readonly<{
  senseId: string;
  senseLocator: string;
  text: string;
  contentStatus: "SUBSTANTIVE_LEXICAL_SENSE";
}>;

export type SourceEntryAttestationEntryV1 = Readonly<{
  entryId: string;
  entryKey: string;
  entryLocator: string;
  sourceForm: string;
  senses: readonly SourceEntryAttestationSenseV1[];
  senseSelectionStatus: SourceSenseSelectionStatusV1;
  selectedSenseId: string | null;
}>;

export type SourceEntryAttestationV1 = Readonly<{
  schemaVersion: typeof SOURCE_ENTRY_ATTESTATION_SCHEMA_V1;
  attestationId: string;
  sourceTraditionId: string;
  sourceTitle: string;
  sourceAuthorOrEditor: string | null;
  sourcePublisherOrHost: string;
  sourceDateOrVersion: string;
  sourceRepositoryCommit: string;
  sourceFilePath: string;
  sourceUrlOrArchiveRef: string;
  sourceHashOrArchiveHash: string;
  sourceForm: string;
  sourceFormNormalization: "EXACT_PRESERVED";
  sourceAttestation: "SOURCE_FORM_OR_ENTRY_ATTESTED";
  entries: readonly SourceEntryAttestationEntryV1[];
  entrySelectionStatus: SourceEntrySelectionStatusV1;
  selectedEntryId: string | null;
}>;

export type SourceEntryAttestationValidationReasonV1 =
  | "INPUT_NOT_RECORD"
  | "UNEXPECTED_FIELD_PRESENT"
  | "FORBIDDEN_SEMANTIC_FIELD_PRESENT"
  | "SCHEMA_VERSION_INVALID"
  | "ATTESTATION_ID_INVALID"
  | "SOURCE_TRADITION_ID_INVALID"
  | "SOURCE_TITLE_INVALID"
  | "SOURCE_PUBLISHER_INVALID"
  | "SOURCE_DATE_INVALID"
  | "SOURCE_COMMIT_INVALID"
  | "SOURCE_FILE_PATH_INVALID"
  | "SOURCE_URL_INVALID"
  | "SOURCE_HASH_INVALID"
  | "SOURCE_FORM_INVALID"
  | "SOURCE_FORM_NORMALIZATION_INVALID"
  | "SOURCE_ATTESTATION_INVALID"
  | "ENTRIES_REQUIRED"
  | "ENTRY_ID_INVALID"
  | "ENTRY_KEY_INVALID"
  | "ENTRY_LOCATOR_INVALID"
  | "ENTRY_SOURCE_FORM_MISMATCH"
  | "ENTRY_ID_DUPLICATE"
  | "SENSES_REQUIRED"
  | "SENSE_ID_INVALID"
  | "SENSE_LOCATOR_INVALID"
  | "SENSE_TEXT_INVALID"
  | "SENSE_EDITORIAL_ONLY"
  | "SENSE_STATUS_INVALID"
  | "SENSE_ID_DUPLICATE"
  | "ENTRY_SELECTION_STATUS_INVALID"
  | "ENTRY_SELECTION_STATUS_MISMATCH"
  | "SELECTED_ENTRY_INVALID"
  | "SENSE_SELECTION_STATUS_INVALID"
  | "SENSE_SELECTION_STATUS_MISMATCH"
  | "SELECTED_SENSE_INVALID";

export type SourceEntryAttestationValidationResultV1 = Readonly<
  | { ok: true; attestation: SourceEntryAttestationV1 }
  | { ok: false; reasonCodes: readonly SourceEntryAttestationValidationReasonV1[] }
>;

const TOP_LEVEL_KEYS_V1 = [
  "schemaVersion",
  "attestationId",
  "sourceTraditionId",
  "sourceTitle",
  "sourceAuthorOrEditor",
  "sourcePublisherOrHost",
  "sourceDateOrVersion",
  "sourceRepositoryCommit",
  "sourceFilePath",
  "sourceUrlOrArchiveRef",
  "sourceHashOrArchiveHash",
  "sourceForm",
  "sourceFormNormalization",
  "sourceAttestation",
  "entries",
  "entrySelectionStatus",
  "selectedEntryId",
] as const;

const ENTRY_KEYS_V1 = [
  "entryId",
  "entryKey",
  "entryLocator",
  "sourceForm",
  "senses",
  "senseSelectionStatus",
  "selectedSenseId",
] as const;

const SENSE_KEYS_V1 = [
  "senseId",
  "senseLocator",
  "text",
  "contentStatus",
] as const;

const ENTRY_SELECTION_STATUSES_V1 = new Set<SourceEntrySelectionStatusV1>([
  "NOT_APPLICABLE",
  "UNRESOLVED",
  "EXPLICITLY_RESOLVED",
]);

const SENSE_SELECTION_STATUSES_V1 = new Set<SourceSenseSelectionStatusV1>([
  "NOT_APPLICABLE",
  "UNRESOLVED",
  "EXPLICITLY_RESOLVED",
]);

const FORBIDDEN_FIELDS_V1 = new Set([
  "targetWord",
  "targetSense",
  "targetSenseId",
  "targetMeaning",
  "semanticBridge",
  "functionalCorrespondence",
  "functionalAcceptance",
  "historicalRelation",
  "historicalOrigin",
  "historicalTransmission",
  "winner",
  "winnerClaim",
  "languageSuperiority",
  "languageSuperiorityClaim",
  "runtimeAuthorization",
  "productionMembership",
  "providerOutput",
]);

const EDITORIAL_ONLY_SENSE_TEXT_V1 = /^(?:init|fin)\.$|^P\.?\s*a\.?\s*fin\.$/iu;

function isRecordV1(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeysV1(
  value: Record<string, unknown>,
  expectedKeys: readonly string[],
): boolean {
  return JSON.stringify(Object.keys(value).sort()) ===
    JSON.stringify([...expectedKeys].sort());
}

function isWellFormedUnicodeV1(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);
    if (codeUnit >= 0xd800 && codeUnit <= 0xdbff) {
      const nextCodeUnit = value.charCodeAt(index + 1);
      if (!(nextCodeUnit >= 0xdc00 && nextCodeUnit <= 0xdfff)) return false;
      index += 1;
      continue;
    }
    if (codeUnit >= 0xdc00 && codeUnit <= 0xdfff) return false;
  }
  return true;
}

function validTextV1(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value === value.trim() &&
    isWellFormedUnicodeV1(value)
  );
}

function hasForbiddenFieldV1(
  value: unknown,
  seen = new WeakSet<object>(),
): boolean {
  if (typeof value !== "object" || value === null || seen.has(value)) {
    return false;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    return value.some((child) => hasForbiddenFieldV1(child, seen));
  }

  return Object.entries(value).some(
    ([key, child]) =>
      FORBIDDEN_FIELDS_V1.has(key) || hasForbiddenFieldV1(child, seen),
  );
}

function deepFreezeV1<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null || seen.has(value)) {
    return value;
  }
  seen.add(value);
  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreezeV1(child, seen);
  }
  return Object.freeze(value);
}

function sortedReasonsV1(
  reasons: Iterable<SourceEntryAttestationValidationReasonV1>,
): SourceEntryAttestationValidationReasonV1[] {
  return [...new Set(reasons)].sort();
}

export function validateSourceEntryAttestationV1(
  value: unknown,
): SourceEntryAttestationValidationResultV1 {
  if (!isRecordV1(value)) return { ok: false, reasonCodes: ["INPUT_NOT_RECORD"] };

  const reasons = new Set<SourceEntryAttestationValidationReasonV1>();
  if (!hasExactKeysV1(value, TOP_LEVEL_KEYS_V1)) {
    reasons.add("UNEXPECTED_FIELD_PRESENT");
  }
  if (hasForbiddenFieldV1(value)) {
    reasons.add("FORBIDDEN_SEMANTIC_FIELD_PRESENT");
  }
  if (value.schemaVersion !== SOURCE_ENTRY_ATTESTATION_SCHEMA_V1) {
    reasons.add("SCHEMA_VERSION_INVALID");
  }
  if (!validTextV1(value.attestationId)) reasons.add("ATTESTATION_ID_INVALID");
  if (!validTextV1(value.sourceTraditionId)) reasons.add("SOURCE_TRADITION_ID_INVALID");
  if (!validTextV1(value.sourceTitle)) reasons.add("SOURCE_TITLE_INVALID");
  if (value.sourceAuthorOrEditor !== null && !validTextV1(value.sourceAuthorOrEditor)) {
    reasons.add("SOURCE_TITLE_INVALID");
  }
  if (!validTextV1(value.sourcePublisherOrHost)) reasons.add("SOURCE_PUBLISHER_INVALID");
  if (!validTextV1(value.sourceDateOrVersion)) reasons.add("SOURCE_DATE_INVALID");
  if (!validTextV1(value.sourceRepositoryCommit)) reasons.add("SOURCE_COMMIT_INVALID");
  if (!validTextV1(value.sourceFilePath)) reasons.add("SOURCE_FILE_PATH_INVALID");
  if (!validTextV1(value.sourceUrlOrArchiveRef)) reasons.add("SOURCE_URL_INVALID");
  if (!validTextV1(value.sourceHashOrArchiveHash)) reasons.add("SOURCE_HASH_INVALID");
  if (!validTextV1(value.sourceForm)) reasons.add("SOURCE_FORM_INVALID");
  if (value.sourceFormNormalization !== "EXACT_PRESERVED") {
    reasons.add("SOURCE_FORM_NORMALIZATION_INVALID");
  }
  if (value.sourceAttestation !== "SOURCE_FORM_OR_ENTRY_ATTESTED") {
    reasons.add("SOURCE_ATTESTATION_INVALID");
  }

  const entries = Array.isArray(value.entries) ? value.entries : [];
  if (entries.length === 0) reasons.add("ENTRIES_REQUIRED");

  const entryIds = new Set<string>();
  for (const entryValue of entries) {
    if (!isRecordV1(entryValue)) {
      reasons.add("ENTRY_ID_INVALID");
      continue;
    }
    if (!hasExactKeysV1(entryValue, ENTRY_KEYS_V1)) reasons.add("UNEXPECTED_FIELD_PRESENT");
    if (hasForbiddenFieldV1(entryValue)) reasons.add("FORBIDDEN_SEMANTIC_FIELD_PRESENT");
    if (!validTextV1(entryValue.entryId)) reasons.add("ENTRY_ID_INVALID");
    if (!validTextV1(entryValue.entryKey)) reasons.add("ENTRY_KEY_INVALID");
    if (!validTextV1(entryValue.entryLocator)) reasons.add("ENTRY_LOCATOR_INVALID");
    if (!validTextV1(entryValue.sourceForm)) reasons.add("ENTRY_SOURCE_FORM_MISMATCH");
    if (validTextV1(value.sourceForm) && entryValue.sourceForm !== value.sourceForm) {
      reasons.add("ENTRY_SOURCE_FORM_MISMATCH");
    }
    if (validTextV1(entryValue.entryId)) {
      if (entryIds.has(entryValue.entryId)) reasons.add("ENTRY_ID_DUPLICATE");
      entryIds.add(entryValue.entryId);
    }

    const senses = Array.isArray(entryValue.senses) ? entryValue.senses : [];
    if (senses.length === 0) reasons.add("SENSES_REQUIRED");
    const senseIds = new Set<string>();
    for (const senseValue of senses) {
      if (!isRecordV1(senseValue)) {
        reasons.add("SENSE_ID_INVALID");
        continue;
      }
      if (!hasExactKeysV1(senseValue, SENSE_KEYS_V1)) reasons.add("UNEXPECTED_FIELD_PRESENT");
      if (hasForbiddenFieldV1(senseValue)) reasons.add("FORBIDDEN_SEMANTIC_FIELD_PRESENT");
      if (!validTextV1(senseValue.senseId)) reasons.add("SENSE_ID_INVALID");
      if (!validTextV1(senseValue.senseLocator)) reasons.add("SENSE_LOCATOR_INVALID");
      if (!validTextV1(senseValue.text)) reasons.add("SENSE_TEXT_INVALID");
      if (
        validTextV1(senseValue.text) &&
        EDITORIAL_ONLY_SENSE_TEXT_V1.test(senseValue.text)
      ) {
        reasons.add("SENSE_EDITORIAL_ONLY");
      }
      if (senseValue.contentStatus !== "SUBSTANTIVE_LEXICAL_SENSE") {
        reasons.add("SENSE_STATUS_INVALID");
      }
      if (validTextV1(senseValue.senseId)) {
        if (senseIds.has(senseValue.senseId)) reasons.add("SENSE_ID_DUPLICATE");
        senseIds.add(senseValue.senseId);
      }
    }

    if (!SENSE_SELECTION_STATUSES_V1.has(
      entryValue.senseSelectionStatus as SourceSenseSelectionStatusV1,
    )) {
      reasons.add("SENSE_SELECTION_STATUS_INVALID");
    } else if (
      entryValue.senseSelectionStatus === "EXPLICITLY_RESOLVED" &&
      (typeof entryValue.selectedSenseId !== "string" ||
        !senseIds.has(entryValue.selectedSenseId))
    ) {
      reasons.add("SELECTED_SENSE_INVALID");
    } else if (
      entryValue.senseSelectionStatus !== "EXPLICITLY_RESOLVED" &&
      entryValue.selectedSenseId !== null
    ) {
      reasons.add("SENSE_SELECTION_STATUS_MISMATCH");
    } else if (
      senses.length > 1 &&
      entryValue.senseSelectionStatus === "NOT_APPLICABLE"
    ) {
      reasons.add("SENSE_SELECTION_STATUS_MISMATCH");
    } else if (
      senses.length === 1 &&
      entryValue.senseSelectionStatus === "UNRESOLVED"
    ) {
      reasons.add("SENSE_SELECTION_STATUS_MISMATCH");
    }
  }

  if (!ENTRY_SELECTION_STATUSES_V1.has(
    value.entrySelectionStatus as SourceEntrySelectionStatusV1,
  )) {
    reasons.add("ENTRY_SELECTION_STATUS_INVALID");
  } else if (
    value.entrySelectionStatus === "EXPLICITLY_RESOLVED" &&
    (typeof value.selectedEntryId !== "string" || !entryIds.has(value.selectedEntryId))
  ) {
    reasons.add("SELECTED_ENTRY_INVALID");
  } else if (
    value.entrySelectionStatus !== "EXPLICITLY_RESOLVED" &&
    value.selectedEntryId !== null
  ) {
    reasons.add("ENTRY_SELECTION_STATUS_MISMATCH");
  } else if (
    entries.length > 1 &&
    value.entrySelectionStatus !== "UNRESOLVED"
  ) {
    reasons.add("ENTRY_SELECTION_STATUS_MISMATCH");
  } else if (
    entries.length === 1 &&
    value.entrySelectionStatus === "UNRESOLVED"
  ) {
    reasons.add("ENTRY_SELECTION_STATUS_MISMATCH");
  }

  const sortedReasons = sortedReasonsV1(reasons);
  if (sortedReasons.length > 0) return { ok: false, reasonCodes: sortedReasons };

  return {
    ok: true,
    attestation: deepFreezeV1({
      schemaVersion: SOURCE_ENTRY_ATTESTATION_SCHEMA_V1,
      attestationId: value.attestationId as string,
      sourceTraditionId: value.sourceTraditionId as string,
      sourceTitle: value.sourceTitle as string,
      sourceAuthorOrEditor: value.sourceAuthorOrEditor as string | null,
      sourcePublisherOrHost: value.sourcePublisherOrHost as string,
      sourceDateOrVersion: value.sourceDateOrVersion as string,
      sourceRepositoryCommit: value.sourceRepositoryCommit as string,
      sourceFilePath: value.sourceFilePath as string,
      sourceUrlOrArchiveRef: value.sourceUrlOrArchiveRef as string,
      sourceHashOrArchiveHash: value.sourceHashOrArchiveHash as string,
      sourceForm: value.sourceForm as string,
      sourceFormNormalization: "EXACT_PRESERVED",
      sourceAttestation: "SOURCE_FORM_OR_ENTRY_ATTESTED",
      entries: (value.entries as SourceEntryAttestationEntryV1[]).map((entry) => ({
        entryId: entry.entryId,
        entryKey: entry.entryKey,
        entryLocator: entry.entryLocator,
        sourceForm: entry.sourceForm,
        senses: entry.senses.map((sense) => ({
          senseId: sense.senseId,
          senseLocator: sense.senseLocator,
          text: sense.text,
          contentStatus: "SUBSTANTIVE_LEXICAL_SENSE" as const,
        })),
        senseSelectionStatus: entry.senseSelectionStatus,
        selectedSenseId: entry.selectedSenseId,
      })),
      entrySelectionStatus: value.entrySelectionStatus as SourceEntrySelectionStatusV1,
      selectedEntryId: value.selectedEntryId as string | null,
    }),
  };
}
