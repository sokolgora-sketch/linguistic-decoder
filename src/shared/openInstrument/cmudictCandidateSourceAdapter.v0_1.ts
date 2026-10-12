import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { normalizeEnglishLexicalJoinKeyV0_1 } from "./englishLexicalSenseSourceContract.v0_1";
import {
  CMUDICT_DATA_BYTES_V0_1,
  CMUDICT_DATA_SHA256_V0_1,
  CMUDICT_SOURCE_NOTATION_V0_1,
  CMUDICT_SOURCE_PROFILE_ID_V0_1,
  CMUDICT_SOURCE_REVISION_V0_1,
} from "./cmudictArpabetPronunciation.v0_1";

const CMUDICT_DATASET_PATH_V0_1 = join(
  process.cwd(),
  "src/data/openInstrument/pronunciation/cmudict.dict",
);

const CMUDICT_ARPABET_BASE_SYMBOLS_V0_1 = new Set([
  "AA",
  "AE",
  "AH",
  "AO",
  "AW",
  "AY",
  "B",
  "CH",
  "D",
  "DH",
  "EH",
  "ER",
  "EY",
  "F",
  "G",
  "HH",
  "IH",
  "IY",
  "JH",
  "K",
  "L",
  "M",
  "N",
  "NG",
  "OW",
  "OY",
  "P",
  "R",
  "S",
  "SH",
  "T",
  "TH",
  "UH",
  "UW",
  "V",
  "W",
  "Y",
  "Z",
  "ZH",
]);

const CMUDICT_ARPABET_VOWEL_SYMBOLS_V0_1 = new Set([
  "AA",
  "AE",
  "AH",
  "AO",
  "AW",
  "AY",
  "EH",
  "ER",
  "EY",
  "IH",
  "IY",
  "OW",
  "OY",
  "UH",
  "UW",
]);

export type CmuDictCandidateAdapterReasonCodeV0_1 =
  | "PRONUNCIATION_NOT_FOUND"
  | "PRONUNCIATION_JOIN_COLLISION"
  | "CMUDICT_SOURCE_LINE_MALFORMED"
  | "CMUDICT_ARPABET_TOKEN_UNSUPPORTED"
  | "CMUDICT_STRESS_DIGIT_MALFORMED"
  | "CMUDICT_CANDIDATE_NOTATION_UNAUTHORIZED"
  | "CMUDICT_SOURCE_ARTIFACT_MISMATCH"
  | "CMUDICT_SOURCE_REVISION_MISMATCH"
  | "PRONUNCIATION_VARIANT_AMBIGUOUS"
  | "CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION"
  | "PRONUNCIATION_PROVENANCE_UNRESOLVED";

export type CmuDictCandidateAdapterInputV0_1 = Readonly<{
  candidateId: string;
  sourceId: string;
  sourceFamilyId: string;
  sourceRecordId: string;
  sourceForm: string;
  normalizedForm: string;
  language: "English";
  senseId?: string;
  gloss?: string;
  sourceProvenance: Readonly<Record<string, unknown>>;
}>;

export type CmuDictCandidateSourceLocatorV0_1 = Readonly<{
  sourceArtifactSha256: typeof CMUDICT_DATA_SHA256_V0_1;
  sourceLineNumber: number;
  rawSourceLine: string;
}>;

export type CmuDictCandidatePronunciationTokenViewV0_1 = Readonly<{
  rawToken: string;
  baseToken: string;
  stress: "0" | "1" | "2" | null;
}>;

export type CmuDictCandidatePronunciationEvidenceVariantV0_1 =
  CmuDictCandidateSourceLocatorV0_1 &
  Readonly<{
  sourceProfileId: typeof CMUDICT_SOURCE_PROFILE_ID_V0_1;
  sourceRevision: typeof CMUDICT_SOURCE_REVISION_V0_1;
  sourceNotation: typeof CMUDICT_SOURCE_NOTATION_V0_1;
  sourceArtifactBytes: typeof CMUDICT_DATA_BYTES_V0_1;
  sourceArtifactSha256: typeof CMUDICT_DATA_SHA256_V0_1;
  sourceLineNumber: number;
  rawSourceLine: string;
  sourceForm: string;
  baseSourceForm: string;
  variantId: string;
  variantOrder: number;
  rawPronunciation: string;
  orderedRawArpabetTokens: readonly string[];
  losslessBaseStressViews: readonly CmuDictCandidatePronunciationTokenViewV0_1[];
  opaqueAnnotationText?: string;
  authorityStatus: "RATIFIED_SOURCE_EVIDENCE_ONLY";
  }>;

export type CmuDictCandidatePronunciationEvidenceV0_1 = Readonly<{
  candidateId: string;
  candidateSourceId: string;
  candidateSourceFamilyId: string;
  candidateSourceRecordId: string;
  candidateSourceForm: string;
  candidateJoinKey: string;
  candidateSourceProvenance: Readonly<Record<string, unknown>>;
  status: "defined" | "null";
  reasonCode: CmuDictCandidateAdapterReasonCodeV0_1 | null;
  variants: readonly CmuDictCandidatePronunciationEvidenceVariantV0_1[];
}>;

export type CmuDictCandidateSourceArtifactOverrideV0_1 = Readonly<{
  text?: string;
  sourceArtifactBytes?: number;
  sourceArtifactSha256?: string;
  sourceRevision?: string;
  sourceNotation?: string;
  sourceProfileId?: string;
}>;

type ValidParsedSourceRecordV0_1 = Readonly<{
  kind: "valid";
  sourceLineNumber: number;
  rawSourceLine: string;
  sourceForm: string;
  baseSourceForm: string;
  variantId: string;
  variantOrder: number;
  rawPronunciation: string;
  orderedRawArpabetTokens: readonly string[];
  losslessBaseStressViews: readonly CmuDictCandidatePronunciationTokenViewV0_1[];
  opaqueAnnotationText?: string;
}>;

type InvalidParsedSourceRecordV0_1 = Readonly<{
  kind: "invalid";
  sourceLineNumber: number;
  rawSourceLine: string;
  sourceForm: string | null;
  baseSourceForm: string | null;
  reasonCode:
    | "CMUDICT_SOURCE_LINE_MALFORMED"
    | "CMUDICT_ARPABET_TOKEN_UNSUPPORTED"
    | "CMUDICT_STRESS_DIGIT_MALFORMED";
}>;

export type CmuDictCandidateParsedSourceRecordV0_1 =
  | ValidParsedSourceRecordV0_1
  | InvalidParsedSourceRecordV0_1;

function deepFreezeV0_1<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value)) {
    return value;
  }

  seen.add(value);
  Object.freeze(value);
  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreezeV0_1(child, seen);
  }
  return value;
}

function copyValueV0_1<T>(value: T, seen = new WeakMap<object, unknown>()): T {
  if (value === null || typeof value !== "object") return value;
  const existing = seen.get(value);
  if (existing !== undefined) return existing as T;

  if (Array.isArray(value)) {
    const copy: unknown[] = [];
    seen.set(value, copy);
    for (const child of value) copy.push(copyValueV0_1(child, seen));
    return copy as T;
  }

  const copy: Record<string, unknown> = {};
  seen.set(value, copy);
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    copy[key] = copyValueV0_1(child, seen);
  }
  return copy as T;
}

function splitVariantSuffixV0_1(sourceForm: string): {
  baseSourceForm: string;
  variantId: string;
} {
  const match = /^(.*)\((\d+)\)$/u.exec(sourceForm);
  if (!match) return { baseSourceForm: sourceForm, variantId: "1" };
  return { baseSourceForm: match[1], variantId: match[2] };
}

function invalidRecordV0_1(
  lineNumber: number,
  rawSourceLine: string,
  sourceForm: string | null,
  reasonCode: InvalidParsedSourceRecordV0_1["reasonCode"],
): InvalidParsedSourceRecordV0_1 {
  const baseSourceForm = sourceForm
    ? splitVariantSuffixV0_1(sourceForm).baseSourceForm
    : null;
  return {
    kind: "invalid",
    sourceLineNumber: lineNumber,
    rawSourceLine,
    sourceForm,
    baseSourceForm,
    reasonCode,
  };
}

function tokenViewV0_1(
  rawToken: string,
): CmuDictCandidatePronunciationTokenViewV0_1 {
  const match = /^([A-Z]+)([012])?$/u.exec(rawToken);
  return {
    rawToken,
    baseToken: match?.[1] ?? rawToken,
    stress: (match?.[2] as "0" | "1" | "2" | undefined) ?? null,
  };
}

function tokenFailureV0_1(
  token: string,
): InvalidParsedSourceRecordV0_1["reasonCode"] | null {
  const stressed = /^([A-Z]+)(\d+)$/u.exec(token);
  if (stressed) {
    const [, base, digits] = stressed;
    if (digits.length !== 1 || !/^[012]$/u.test(digits)) {
      return "CMUDICT_STRESS_DIGIT_MALFORMED";
    }
    if (
      CMUDICT_ARPABET_BASE_SYMBOLS_V0_1.has(base) &&
      !CMUDICT_ARPABET_VOWEL_SYMBOLS_V0_1.has(base)
    ) {
      return "CMUDICT_STRESS_DIGIT_MALFORMED";
    }
  }

  const unambiguous = /^([A-Z]+)([012])?$/u.exec(token);
  if (!unambiguous || !CMUDICT_ARPABET_BASE_SYMBOLS_V0_1.has(unambiguous[1])) {
    return "CMUDICT_ARPABET_TOKEN_UNSUPPORTED";
  }
  return null;
}

function parseSourceLineV0_1(
  rawSourceLine: string,
  sourceLineNumber: number,
  variantOrderByJoinKey: Map<string, number>,
): CmuDictCandidateParsedSourceRecordV0_1 | null {
  if (rawSourceLine.length === 0 || rawSourceLine.startsWith(";;;")) {
    return null;
  }

  const separator = rawSourceLine.indexOf(" ");
  const sourceForm =
    rawSourceLine.match(/^\S+/u)?.[0] ?? null;
  if (
    separator <= 0 ||
    sourceForm === null ||
    !/^\S+$/u.test(sourceForm) ||
    rawSourceLine.startsWith(" ")
  ) {
    return invalidRecordV0_1(
      sourceLineNumber,
      rawSourceLine,
      sourceForm,
      "CMUDICT_SOURCE_LINE_MALFORMED",
    );
  }

  const remainder = rawSourceLine.slice(separator + 1);
  const annotationDelimiter = remainder.indexOf(" # ");
  const hasHash = remainder.includes("#");
  if (hasHash && annotationDelimiter < 0) {
    return invalidRecordV0_1(
      sourceLineNumber,
      rawSourceLine,
      sourceForm,
      "CMUDICT_SOURCE_LINE_MALFORMED",
    );
  }

  const rawPronunciation =
    annotationDelimiter < 0
      ? remainder
      : remainder.slice(0, annotationDelimiter);
  const opaqueAnnotationText =
    annotationDelimiter < 0
      ? undefined
      : remainder.slice(annotationDelimiter + " # ".length);

  if (
    rawPronunciation.length === 0 ||
    rawPronunciation.startsWith(" ") ||
    rawPronunciation.endsWith(" ") ||
    rawPronunciation.includes("  ") ||
    (annotationDelimiter >= 0 && opaqueAnnotationText?.length === 0)
  ) {
    return invalidRecordV0_1(
      sourceLineNumber,
      rawSourceLine,
      sourceForm,
      "CMUDICT_SOURCE_LINE_MALFORMED",
    );
  }

  const tokens = rawPronunciation.split(" ");
  for (const token of tokens) {
    const reasonCode = tokenFailureV0_1(token);
    if (reasonCode !== null) {
      return invalidRecordV0_1(
        sourceLineNumber,
        rawSourceLine,
        sourceForm,
        reasonCode,
      );
    }
  }

  const { baseSourceForm, variantId } = splitVariantSuffixV0_1(sourceForm);
  const joinKey = normalizeEnglishLexicalJoinKeyV0_1(baseSourceForm);
  const variantOrder = variantOrderByJoinKey.get(joinKey) ?? 0;
  variantOrderByJoinKey.set(joinKey, variantOrder + 1);

  return {
    kind: "valid",
    sourceLineNumber,
    rawSourceLine,
    sourceForm,
    baseSourceForm,
    variantId,
    variantOrder,
    rawPronunciation,
    orderedRawArpabetTokens: Object.freeze([...tokens]),
    losslessBaseStressViews: Object.freeze(tokens.map(tokenViewV0_1)),
    ...(opaqueAnnotationText === undefined ? {} : { opaqueAnnotationText }),
  };
}

export function parseCmuDictCandidateSourceRecordsV0_1(
  sourceText: string,
): readonly CmuDictCandidateParsedSourceRecordV0_1[] {
  const variantOrderByJoinKey = new Map<string, number>();
  const records: CmuDictCandidateParsedSourceRecordV0_1[] = [];
  for (const [index, line] of sourceText.split(/\r?\n/u).entries()) {
    const record = parseSourceLineV0_1(line, index + 1, variantOrderByJoinKey);
    if (record !== null) records.push(record);
  }
  return deepFreezeV0_1(records);
}

function sourceArtifactIdentityV0_1(
  override: CmuDictCandidateSourceArtifactOverrideV0_1 | undefined,
): Readonly<{
  text: string;
  sourceArtifactBytes: number;
  sourceArtifactSha256: string;
  sourceRevision: string;
  sourceNotation: string;
  sourceProfileId: string;
}> {
  const text = override?.text ?? readFileSync(CMUDICT_DATASET_PATH_V0_1, "utf8");
  const computedBytes = Buffer.byteLength(text, "utf8");
  const computedSha256 = createHash("sha256").update(Buffer.from(text, "utf8")).digest("hex");
  return {
    text,
    sourceArtifactBytes: override?.sourceArtifactBytes ?? computedBytes,
    sourceArtifactSha256: override?.sourceArtifactSha256 ?? computedSha256,
    sourceRevision: override?.sourceRevision ?? CMUDICT_SOURCE_REVISION_V0_1,
    sourceNotation: override?.sourceNotation ?? CMUDICT_SOURCE_NOTATION_V0_1,
    sourceProfileId: override?.sourceProfileId ?? CMUDICT_SOURCE_PROFILE_ID_V0_1,
  };
}

function candidateHasValidAuthorityV0_1(
  input: CmuDictCandidateAdapterInputV0_1,
): boolean {
  return (
    input.candidateId.length > 0 &&
    input.sourceId.length > 0 &&
    input.sourceFamilyId.length > 0 &&
    input.sourceRecordId.length > 0 &&
    input.sourceForm.length > 0 &&
    input.language === "English" &&
    input.normalizedForm === normalizeEnglishLexicalJoinKeyV0_1(input.sourceForm) &&
    input.sourceProvenance !== null &&
    typeof input.sourceProvenance === "object" &&
    !Array.isArray(input.sourceProvenance)
  );
}

function resultBaseV0_1(
  input: CmuDictCandidateAdapterInputV0_1,
  candidateJoinKey: string,
): {
  candidateId: string;
  candidateSourceId: string;
  candidateSourceFamilyId: string;
  candidateSourceRecordId: string;
  candidateSourceForm: string;
  candidateJoinKey: string;
  candidateSourceProvenance: Readonly<Record<string, unknown>>;
} {
  return {
    candidateId: input.candidateId,
    candidateSourceId: input.sourceId,
    candidateSourceFamilyId: input.sourceFamilyId,
    candidateSourceRecordId: input.sourceRecordId,
    candidateSourceForm: input.sourceForm,
    candidateJoinKey,
    candidateSourceProvenance: copyValueV0_1(input.sourceProvenance),
  };
}

function nullResultV0_1(
  input: CmuDictCandidateAdapterInputV0_1,
  candidateJoinKey: string,
  reasonCode: CmuDictCandidateAdapterReasonCodeV0_1,
): CmuDictCandidatePronunciationEvidenceV0_1 {
  return deepFreezeV0_1({
    ...resultBaseV0_1(input, candidateJoinKey),
    status: "null" as const,
    reasonCode,
    variants: [] as const,
  });
}

export function adaptCmuDictCandidateSourceEvidenceV0_1(
  input: CmuDictCandidateAdapterInputV0_1,
  artifactOverride?: CmuDictCandidateSourceArtifactOverrideV0_1,
): CmuDictCandidatePronunciationEvidenceV0_1 {
  const artifact = sourceArtifactIdentityV0_1(artifactOverride);
  const artifactMismatch =
    Buffer.byteLength(artifact.text, "utf8") !== CMUDICT_DATA_BYTES_V0_1 ||
    createHash("sha256").update(Buffer.from(artifact.text, "utf8")).digest("hex") !==
      CMUDICT_DATA_SHA256_V0_1 ||
    artifact.sourceArtifactBytes !== CMUDICT_DATA_BYTES_V0_1 ||
    artifact.sourceArtifactSha256 !== CMUDICT_DATA_SHA256_V0_1;

  const candidateJoinKey =
    typeof input.sourceForm === "string"
      ? normalizeEnglishLexicalJoinKeyV0_1(input.sourceForm)
      : "";

  if (artifactMismatch) {
    return nullResultV0_1(input, candidateJoinKey, "CMUDICT_SOURCE_ARTIFACT_MISMATCH");
  }
  if (
    artifact.sourceProfileId !== CMUDICT_SOURCE_PROFILE_ID_V0_1 ||
    artifact.sourceNotation !== CMUDICT_SOURCE_NOTATION_V0_1
  ) {
    return nullResultV0_1(
      input,
      candidateJoinKey,
      "CMUDICT_CANDIDATE_NOTATION_UNAUTHORIZED",
    );
  }
  if (artifact.sourceRevision !== CMUDICT_SOURCE_REVISION_V0_1) {
    return nullResultV0_1(input, candidateJoinKey, "CMUDICT_SOURCE_REVISION_MISMATCH");
  }
  if (!candidateHasValidAuthorityV0_1(input)) {
    return nullResultV0_1(
      input,
      candidateJoinKey,
      input.sourceProvenance === undefined
        ? "PRONUNCIATION_PROVENANCE_UNRESOLVED"
        : "CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION",
    );
  }

  const records = parseCmuDictCandidateSourceRecordsV0_1(artifact.text);
  const relevantRecords = records.filter(
    (record) =>
      record.baseSourceForm !== null &&
      normalizeEnglishLexicalJoinKeyV0_1(record.baseSourceForm) === candidateJoinKey,
  );
  const firstInvalid = relevantRecords.find(
    (record): record is InvalidParsedSourceRecordV0_1 => record.kind === "invalid",
  );
  if (firstInvalid) {
    return nullResultV0_1(input, candidateJoinKey, firstInvalid.reasonCode);
  }

  const validRecords = relevantRecords.filter(
    (record): record is ValidParsedSourceRecordV0_1 => record.kind === "valid",
  );
  const distinctBaseForms = new Set(validRecords.map((record) => record.baseSourceForm));
  if (distinctBaseForms.size > 1) {
    return nullResultV0_1(input, candidateJoinKey, "PRONUNCIATION_JOIN_COLLISION");
  }
  if (validRecords.length === 0) {
    return nullResultV0_1(input, candidateJoinKey, "PRONUNCIATION_NOT_FOUND");
  }

  const variants = validRecords.map((record) => ({
    sourceProfileId: CMUDICT_SOURCE_PROFILE_ID_V0_1,
    sourceRevision: CMUDICT_SOURCE_REVISION_V0_1,
    sourceNotation: CMUDICT_SOURCE_NOTATION_V0_1,
    sourceArtifactBytes: CMUDICT_DATA_BYTES_V0_1,
    sourceArtifactSha256: CMUDICT_DATA_SHA256_V0_1,
    sourceLineNumber: record.sourceLineNumber,
    rawSourceLine: record.rawSourceLine,
    sourceForm: record.sourceForm,
    baseSourceForm: record.baseSourceForm,
    variantId: record.variantId,
    variantOrder: record.variantOrder,
    rawPronunciation: record.rawPronunciation,
    orderedRawArpabetTokens: record.orderedRawArpabetTokens,
    losslessBaseStressViews: record.losslessBaseStressViews,
    ...(record.opaqueAnnotationText === undefined
      ? {}
      : { opaqueAnnotationText: record.opaqueAnnotationText }),
    authorityStatus: "RATIFIED_SOURCE_EVIDENCE_ONLY" as const,
  }));

  return deepFreezeV0_1({
    ...resultBaseV0_1(input, candidateJoinKey),
    status: "defined" as const,
    reasonCode: null,
    variants,
  });
}
