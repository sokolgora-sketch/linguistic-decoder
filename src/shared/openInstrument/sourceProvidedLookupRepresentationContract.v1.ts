export const SOURCE_PROVIDED_LOOKUP_REPRESENTATION_SCHEMA_V1 =
  "open-instrument.source-provided-lookup-representation.v1" as const;

export type SourceProvidedLookupRepresentationAuthorityV1 =
  | "SOURCE_PROVIDED"
  | "REVIEWED_SOURCE_ADAPTER";

export type SourceProvidedLookupRepresentationSourceFieldV1 =
  | "source_key"
  | "source_metadata";

export type SourceProvidedLookupRepresentationKindV1 =
  | "SOURCE_FIELD_EXPLICIT_REPRESENTATION"
  | "REVIEWED_SOURCE_ADAPTER_REPRESENTATION";

export type SourceProvidedLookupRepresentationLossinessV1 =
  | "NONE"
  | "POTENTIALLY_LOSSY_EXPLICIT";

export type SourceProvidedLookupRepresentationDisambiguationV1 =
  | "NOT_APPLICABLE"
  | "EXPLICITLY_RESOLVED"
  | "UNRESOLVED";

export type SourceProvidedLookupRepresentationReasonCodeV1 =
  | "SOURCE_FIELD_EXPLICITLY_AUTHORIZED"
  | "REVIEWED_ADAPTER_EXPLICITLY_AUTHORIZED";

export type SourceProvidedLookupRepresentationMatchClassV1 =
  | "EXACT_SOURCE_FORM_MATCH"
  | "EXACT_AUTHORIZED_REPRESENTATION_MATCH"
  | "NO_MATCH";

export type SourceProvidedLookupRepresentationV1 = Readonly<{
  schemaVersion: typeof SOURCE_PROVIDED_LOOKUP_REPRESENTATION_SCHEMA_V1;
  sourceForm: string;
  authorizedLookupRepresentation: string;
  authority: SourceProvidedLookupRepresentationAuthorityV1;
  sourceField: SourceProvidedLookupRepresentationSourceFieldV1;
  sourceFieldValue: string;
  sourceLocator: string;
  representationKind: SourceProvidedLookupRepresentationKindV1;
  lossiness: SourceProvidedLookupRepresentationLossinessV1;
  sourceDisambiguation:
    SourceProvidedLookupRepresentationDisambiguationV1;
  reasonCode: SourceProvidedLookupRepresentationReasonCodeV1;
}>;

export type SourceProvidedLookupRepresentationReasonCodeResultV1 =
  | "INPUT_NOT_RECORD"
  | "UNEXPECTED_FIELD_PRESENT"
  | "FORBIDDEN_SEMANTIC_FIELD_PRESENT"
  | "SCHEMA_VERSION_INVALID"
  | "SOURCE_FORM_REQUIRED"
  | "SOURCE_FORM_INVALID"
  | "REPRESENTATION_REQUIRED"
  | "REPRESENTATION_INVALID"
  | "REPRESENTATION_NOT_NFC"
  | "REPRESENTATION_EQUALS_SOURCE_FORM"
  | "AUTHORITY_INVALID"
  | "SOURCE_FIELD_INVALID"
  | "SOURCE_FIELD_VALUE_INVALID"
  | "SOURCE_LOCATOR_INVALID"
  | "SOURCE_FIELD_TRANSFORMATION_MISMATCH"
  | "REPRESENTATION_KIND_INVALID"
  | "LOSSINESS_INVALID"
  | "SOURCE_DISAMBIGUATION_INVALID"
  | "HOMOGRAPH_DISAMBIGUATION_UNRESOLVED"
  | "REASON_CODE_INVALID"
  | "AUTHORITY_KIND_MISMATCH";

export type SourceProvidedLookupRepresentationResultV1 = Readonly<
  | {
      ok: true;
      representation: SourceProvidedLookupRepresentationV1;
    }
  | {
      ok: false;
      reasonCodes: readonly SourceProvidedLookupRepresentationReasonCodeResultV1[];
    }
>;

const REPRESENTATION_KEYS_V1 = [
  "schemaVersion",
  "sourceForm",
  "authorizedLookupRepresentation",
  "authority",
  "sourceField",
  "sourceFieldValue",
  "sourceLocator",
  "representationKind",
  "lossiness",
  "sourceDisambiguation",
  "reasonCode",
] as const;

const AUTHORITIES_V1 = new Set<SourceProvidedLookupRepresentationAuthorityV1>([
  "SOURCE_PROVIDED",
  "REVIEWED_SOURCE_ADAPTER",
]);

const SOURCE_FIELDS_V1 = new Set<SourceProvidedLookupRepresentationSourceFieldV1>([
  "source_key",
  "source_metadata",
]);

const REPRESENTATION_KINDS_V1 = new Set<SourceProvidedLookupRepresentationKindV1>([
  "SOURCE_FIELD_EXPLICIT_REPRESENTATION",
  "REVIEWED_SOURCE_ADAPTER_REPRESENTATION",
]);

const LOSSINESS_VALUES_V1 = new Set<SourceProvidedLookupRepresentationLossinessV1>([
  "NONE",
  "POTENTIALLY_LOSSY_EXPLICIT",
]);

const DISAMBIGUATION_VALUES_V1 = new Set<SourceProvidedLookupRepresentationDisambiguationV1>([
  "NOT_APPLICABLE",
  "EXPLICITLY_RESOLVED",
  "UNRESOLVED",
]);

const REASON_CODES_V1 = new Set<SourceProvidedLookupRepresentationReasonCodeV1>([
  "SOURCE_FIELD_EXPLICITLY_AUTHORIZED",
  "REVIEWED_ADAPTER_EXPLICITLY_AUTHORIZED",
]);

const FORBIDDEN_FIELDS_V1 = new Set([
  "targetWord",
  "targetSense",
  "targetSenseId",
  "targetMeaning",
  "functionalCorrespondence",
  "functionalAcceptance",
  "historicalRelation",
  "historicalOrigin",
  "etymologicalClaim",
  "candidateTruthClaim",
  "winnerClaim",
  "languageSuperiorityClaim",
  "productionEvidence",
  "providerOutput",
]);

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

function hasWellFormedUnicodeV1(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);
    if (codeUnit >= 0xd800 && codeUnit <= 0xdbff) {
      const nextCodeUnit = value.charCodeAt(index + 1);
      if (!(nextCodeUnit >= 0xdc00 && nextCodeUnit <= 0xdfff)) {
        return false;
      }
      index += 1;
      continue;
    }
    if (codeUnit >= 0xdc00 && codeUnit <= 0xdfff) return false;
  }
  return true;
}

function validSourceFormV1(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value === value.trim() &&
    hasWellFormedUnicodeV1(value)
  );
}

function validNfcTextV1(value: unknown): boolean {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value === value.trim() &&
    value === value.normalize("NFC") &&
    hasWellFormedUnicodeV1(value)
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

function sortReasonCodesV1(
  values: readonly SourceProvidedLookupRepresentationReasonCodeResultV1[],
): SourceProvidedLookupRepresentationReasonCodeResultV1[] {
  return [...new Set(values)].sort();
}

function inputReasonCodesV1(
  value: unknown,
): SourceProvidedLookupRepresentationReasonCodeResultV1[] {
  if (!isRecordV1(value)) return ["INPUT_NOT_RECORD"];

  const reasons: SourceProvidedLookupRepresentationReasonCodeResultV1[] = [];
  if (hasForbiddenFieldV1(value)) {
    reasons.push("FORBIDDEN_SEMANTIC_FIELD_PRESENT");
  }
  if (!hasExactKeysV1(value, REPRESENTATION_KEYS_V1)) {
    reasons.push("UNEXPECTED_FIELD_PRESENT");
  }
  if (value.schemaVersion !== SOURCE_PROVIDED_LOOKUP_REPRESENTATION_SCHEMA_V1) {
    reasons.push("SCHEMA_VERSION_INVALID");
  }
  if (!validSourceFormV1(value.sourceForm)) {
    reasons.push("SOURCE_FORM_REQUIRED");
  }
  if (
    typeof value.sourceForm === "string" &&
    value.sourceForm.length > 0 &&
    !hasWellFormedUnicodeV1(value.sourceForm)
  ) {
    reasons.push("SOURCE_FORM_INVALID");
  }

  if (
    typeof value.authorizedLookupRepresentation !== "string" ||
    value.authorizedLookupRepresentation.length === 0
  ) {
    reasons.push("REPRESENTATION_REQUIRED");
  } else {
    const authorizedLookupRepresentation =
      value.authorizedLookupRepresentation;
    if (!validNfcTextV1(authorizedLookupRepresentation)) {
      reasons.push("REPRESENTATION_INVALID");
      if (
        authorizedLookupRepresentation !==
        authorizedLookupRepresentation.normalize("NFC")
      ) {
        reasons.push("REPRESENTATION_NOT_NFC");
      }
    }
    if (
      typeof value.sourceForm === "string" &&
      value.authorizedLookupRepresentation === value.sourceForm
    ) {
      reasons.push("REPRESENTATION_EQUALS_SOURCE_FORM");
    }
  }

  if (
    typeof value.authority !== "string" ||
    !AUTHORITIES_V1.has(value.authority as SourceProvidedLookupRepresentationAuthorityV1)
  ) {
    reasons.push("AUTHORITY_INVALID");
  }
  if (
    typeof value.sourceField !== "string" ||
    !SOURCE_FIELDS_V1.has(value.sourceField as SourceProvidedLookupRepresentationSourceFieldV1)
  ) {
    reasons.push("SOURCE_FIELD_INVALID");
  }
  if (!validSourceFormV1(value.sourceFieldValue)) {
    reasons.push("SOURCE_FIELD_VALUE_INVALID");
  }
  if (
    value.authority === "SOURCE_PROVIDED" &&
    validSourceFormV1(value.sourceFieldValue) &&
    typeof value.authorizedLookupRepresentation === "string" &&
    value.authorizedLookupRepresentation !==
      value.sourceFieldValue.toLocaleUpperCase("en-US").normalize("NFC")
  ) {
    reasons.push("SOURCE_FIELD_TRANSFORMATION_MISMATCH");
  }
  if (!validNfcTextV1(value.sourceLocator)) {
    reasons.push("SOURCE_LOCATOR_INVALID");
  }
  if (
    typeof value.representationKind !== "string" ||
    !REPRESENTATION_KINDS_V1.has(
      value.representationKind as SourceProvidedLookupRepresentationKindV1,
    )
  ) {
    reasons.push("REPRESENTATION_KIND_INVALID");
  }
  if (
    typeof value.lossiness !== "string" ||
    !LOSSINESS_VALUES_V1.has(
      value.lossiness as SourceProvidedLookupRepresentationLossinessV1,
    )
  ) {
    reasons.push("LOSSINESS_INVALID");
  }
  if (
    typeof value.sourceDisambiguation !== "string" ||
    !DISAMBIGUATION_VALUES_V1.has(
      value.sourceDisambiguation as SourceProvidedLookupRepresentationDisambiguationV1,
    )
  ) {
    reasons.push("SOURCE_DISAMBIGUATION_INVALID");
  } else if (value.sourceDisambiguation === "UNRESOLVED") {
    reasons.push("HOMOGRAPH_DISAMBIGUATION_UNRESOLVED");
  }
  if (
    typeof value.reasonCode !== "string" ||
    !REASON_CODES_V1.has(
      value.reasonCode as SourceProvidedLookupRepresentationReasonCodeV1,
    )
  ) {
    reasons.push("REASON_CODE_INVALID");
  }

  if (
    value.authority === "SOURCE_PROVIDED" &&
    (value.representationKind !== "SOURCE_FIELD_EXPLICIT_REPRESENTATION" ||
      value.reasonCode !== "SOURCE_FIELD_EXPLICITLY_AUTHORIZED")
  ) {
    reasons.push("AUTHORITY_KIND_MISMATCH");
  }
  if (
    value.authority === "REVIEWED_SOURCE_ADAPTER" &&
    (value.representationKind !== "REVIEWED_SOURCE_ADAPTER_REPRESENTATION" ||
      value.reasonCode !== "REVIEWED_ADAPTER_EXPLICITLY_AUTHORIZED")
  ) {
    reasons.push("AUTHORITY_KIND_MISMATCH");
  }

  return sortReasonCodesV1(reasons);
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

export function validateSourceProvidedLookupRepresentationV1(
  value: unknown,
): SourceProvidedLookupRepresentationResultV1 {
  const reasonCodes = inputReasonCodesV1(value);
  if (reasonCodes.length > 0 || !isRecordV1(value)) {
    return { ok: false, reasonCodes };
  }

  return {
    ok: true,
    representation: deepFreezeV1({
      schemaVersion: SOURCE_PROVIDED_LOOKUP_REPRESENTATION_SCHEMA_V1,
      sourceForm: value.sourceForm as string,
      authorizedLookupRepresentation:
        value.authorizedLookupRepresentation as string,
      authority: value.authority as SourceProvidedLookupRepresentationAuthorityV1,
      sourceField: value.sourceField as SourceProvidedLookupRepresentationSourceFieldV1,
      sourceFieldValue: value.sourceFieldValue as string,
      sourceLocator: value.sourceLocator as string,
      representationKind:
        value.representationKind as SourceProvidedLookupRepresentationKindV1,
      lossiness: value.lossiness as SourceProvidedLookupRepresentationLossinessV1,
      sourceDisambiguation:
        value.sourceDisambiguation as SourceProvidedLookupRepresentationDisambiguationV1,
      reasonCode: value.reasonCode as SourceProvidedLookupRepresentationReasonCodeV1,
    }),
  };
}

export const SOURCE_PROVIDED_LOOKUP_REPRESENTATION_MATCH_CLASSES_V1 = [
  "EXACT_SOURCE_FORM_MATCH",
  "EXACT_AUTHORIZED_REPRESENTATION_MATCH",
  "NO_MATCH",
] as const satisfies readonly SourceProvidedLookupRepresentationMatchClassV1[];
