import { createHash } from "node:crypto";

import {
  CMUDICT_DATA_BYTES_V0_1,
  CMUDICT_DATA_SHA256_V0_1,
  CMUDICT_SOURCE_NOTATION_V0_1,
  CMUDICT_SOURCE_PROFILE_ID_V0_1,
  CMUDICT_SOURCE_REVISION_V0_1,
} from "./cmudictArpabetPronunciation.v0_1";
import type {
  CmuDictCandidatePronunciationEvidenceVariantV0_1,
} from "./cmudictCandidateSourceAdapter.v0_1";
import type {
  CmuDictProductionSpokenBridgePrerequisiteVariantV0_1,
} from "./cmudictProductionSpokenBridgePrerequisites.v0_1";
import {
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_VARIANT_SCHEMA_V0_1,
} from "./cmudictProductionSpokenBridgePrerequisites.v0_1";

export const CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_ID_V0_1 =
  "open-instrument.cmudict-shared-source-pronunciation.v0_1" as const;
export const CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_VERSION_V0_1 =
  "v0.1" as const;
export const CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_REVISION_V0_1 =
  "representation-contract-alignment-authority-v0.1" as const;
export const CMUDICT_SHARED_SOURCE_PRONUNCIATION_SCHEMA_V0_1 =
  "open-instrument.cmudict-shared-source-pronunciation.v0.1" as const;
export const CMUDICT_SHARED_SOURCE_PRONUNCIATION_SOURCE_PATH_V0_1 =
  "src/data/openInstrument/pronunciation/cmudict.dict" as const;
export const CMUDICT_SHARED_SOURCE_PRONUNCIATION_SOURCE_AUTHORITY_V0_1 =
  "RATIFIED_CMUDICT_SOURCE_ARTIFACT" as const;
export const CMUDICT_SHARED_SOURCE_PRONUNCIATION_ALIGNMENT_TAG_V0_1 =
  "CMUDICT_PATH_B_REPRESENTATION_CONTRACT_ALIGNMENT_AUTHORITY_V0_1" as const;
export const CMUDICT_SHARED_SOURCE_PRONUNCIATION_EVIDENCE_TAG_V0_1 =
  "CMUDICT_PATH_B_SHARED_REPRESENTATION_EVIDENCE_EXPOSURE_AUTHORITY_V0_1" as const;
export const CMUDICT_SHARED_SOURCE_PRONUNCIATION_CANONICALIZATION_V0_1 =
  "CMUDICT_SHARED_EVIDENCE_CANONICAL_JSON_ARRAY_V0_1" as const;

const CMUDICT_SOURCE_PROVENANCE_ARTIFACT_PREFIX_V0_1 =
  "CMUDICT_SOURCE_ARTIFACT_V0_1" as const;
const CMUDICT_SOURCE_PROVENANCE_RECORD_PREFIX_V0_1 =
  "CMUDICT_SOURCE_RECORD_V0_1" as const;

const ARPABET_BASE_SYMBOLS_V0_1 = new Set([
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

const ARPABET_VOWEL_SYMBOLS_V0_1 = new Set([
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

export type CmuDictPathBSharedRepresentationEvidenceExposureReasonCodeV0_1 =
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_AUTHORIZED"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_ARTIFACT_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_PROVENANCE_INCOMPLETE"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_PROVENANCE_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_LINE_MISSING"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_SOURCE_LINE_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_FORM_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_VARIANT_IDENTITY_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_VARIANT_ORDER_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_PRONUNCIATION_MISSING"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_PRONUNCIATION_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_TOKEN_MALFORMED"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_TOKEN_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_ANNOTATION_EVIDENCE_MALFORMED"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_ANNOTATION_ELIGIBILITY_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_CONTRACT_IDENTITY_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_AUTHORITY_TAG_MISSING_OR_MALFORMED"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_PHYSICAL_RECORD_ID_MISMATCH"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_CANONICALIZATION_FAILURE"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_INPUT_FINGERPRINT_FAILURE"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_OUTPUT_FINGERPRINT_FAILURE"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_NON_DETERMINISTIC_REPRODUCTION"
  | "CMUDICT_PATH_B_SHARED_EVIDENCE_UNKNOWN_FIELD_OR_MALFORMED_EVIDENCE";

export type CmuDictSharedSourcePronunciationRepresentationContractV0_1 =
  Readonly<{
    contractId: typeof CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_ID_V0_1;
    contractVersion: typeof CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_VERSION_V0_1;
    contractRevision: typeof CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_REVISION_V0_1;
    schemaVersion: typeof CMUDICT_SHARED_SOURCE_PRONUNCIATION_SCHEMA_V0_1;
    languageScope: "English";
    varietyScope: "en-US";
    notation: "ARPABET";
    normalizationIdentity: "NOT_APPLICABLE_AT_SHARED_BOUNDARY";
    segmentationIdentity: "ORDERED_RAW_ARPABET_TOKEN_SEQUENCE";
    orderingIdentity: "SOURCE_LINE_ORDER_AND_VARIANT_ORDER";
    projectionMethodology: null;
    projectionProfileVersion: null;
    variantPolicy: "PRESERVE_PHYSICAL_RECORDS_AND_VARIANTS";
    ambiguityPolicy: "PRESERVE_ANNOTATION_AND_MULTIPLICITY_FAIL_CLOSED";
    sourceAuthority: typeof CMUDICT_SHARED_SOURCE_PRONUNCIATION_SOURCE_AUTHORITY_V0_1;
    authorityProvenanceRequirements: readonly string[];
    sourceProvenanceRequirements: readonly string[];
    reproducibilityRequirements: Readonly<{
      algorithm: "SHA-256";
      canonicalization: typeof CMUDICT_SHARED_SOURCE_PRONUNCIATION_CANONICALIZATION_V0_1;
    }>;
  }>;

export type CmuDictSharedSourcePronunciationInstanceV0_1 = Readonly<{
  contractId: typeof CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_ID_V0_1;
  contractVersion: typeof CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_VERSION_V0_1;
  contractRevision: typeof CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_REVISION_V0_1;
  schemaVersion: typeof CMUDICT_SHARED_SOURCE_PRONUNCIATION_SCHEMA_V0_1;
  languageScope: "English";
  varietyScope: "en-US";
  notation: "ARPABET";
  sourcePath: typeof CMUDICT_SHARED_SOURCE_PRONUNCIATION_SOURCE_PATH_V0_1;
  sourceRevision: typeof CMUDICT_SOURCE_REVISION_V0_1;
  sourceArtifactBytes: typeof CMUDICT_DATA_BYTES_V0_1;
  sourceArtifactSha256: typeof CMUDICT_DATA_SHA256_V0_1;
  physicalRecordId: string;
  sourceLineNumber: number;
  rawSourceLine: string;
  sourceForm: string;
  baseSourceForm: string;
  variantId: string;
  variantOrder: number;
  rawPronunciation: string;
  orderedRawArpabetTokens: readonly string[];
  opaqueAnnotationText: string | null;
  annotationEligibility: "ELIGIBLE" | "INELIGIBLE";
  sourceAuthority: typeof CMUDICT_SHARED_SOURCE_PRONUNCIATION_SOURCE_AUTHORITY_V0_1;
  sourceProvenanceRefs: readonly string[];
  deterministicReproducibility: Readonly<{
    algorithm: "SHA-256";
    canonicalization: typeof CMUDICT_SHARED_SOURCE_PRONUNCIATION_CANONICALIZATION_V0_1;
    inputFingerprint: string;
    outputFingerprint: string;
  }>;
  alignmentAuthorityTag: typeof CMUDICT_SHARED_SOURCE_PRONUNCIATION_ALIGNMENT_TAG_V0_1;
  evidenceExposureAuthorityTag: typeof CMUDICT_SHARED_SOURCE_PRONUNCIATION_EVIDENCE_TAG_V0_1;
}>;

export type CmuDictSharedSourcePronunciationExposureResultV0_1 =
  | Readonly<{
      status: "authorized";
      reasonCode: "CMUDICT_PATH_B_SHARED_EVIDENCE_AUTHORIZED";
      instance: CmuDictSharedSourcePronunciationInstanceV0_1;
    }>
  | Readonly<{
      status: "null";
      reasonCode: Exclude<
        CmuDictPathBSharedRepresentationEvidenceExposureReasonCodeV0_1,
        "CMUDICT_PATH_B_SHARED_EVIDENCE_AUTHORIZED"
      >;
      instance: null;
    }>;

export type CmuDictSharedSourcePronunciationInputFingerprintInputV0_1 = Readonly<{
  scope: "INPUT";
  sourcePath: string;
  sourceRevision: string;
  sourceArtifactBytes: number;
  sourceArtifactSha256: string;
  sourceLineNumber: number;
  rawSourceLine: string;
}>;

export type CmuDictSharedSourcePronunciationComparisonResultV0_1 =
  | Readonly<{
      status: "match";
      reasonCode: "CMUDICT_PATH_B_SHARED_EVIDENCE_AUTHORIZED";
    }>
  | Readonly<{
      status: "mismatch";
      reasonCode: Exclude<
        CmuDictPathBSharedRepresentationEvidenceExposureReasonCodeV0_1,
        "CMUDICT_PATH_B_SHARED_EVIDENCE_AUTHORIZED"
      >;
    }>;

export const CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_V0_1:
  CmuDictSharedSourcePronunciationRepresentationContractV0_1 = Object.freeze({
  contractId: CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_ID_V0_1,
  contractVersion: CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_VERSION_V0_1,
  contractRevision: CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_REVISION_V0_1,
  schemaVersion: CMUDICT_SHARED_SOURCE_PRONUNCIATION_SCHEMA_V0_1,
  languageScope: "English",
  varietyScope: "en-US",
  notation: "ARPABET",
  normalizationIdentity: "NOT_APPLICABLE_AT_SHARED_BOUNDARY",
  segmentationIdentity: "ORDERED_RAW_ARPABET_TOKEN_SEQUENCE",
  orderingIdentity: "SOURCE_LINE_ORDER_AND_VARIANT_ORDER",
  projectionMethodology: null,
  projectionProfileVersion: null,
  variantPolicy: "PRESERVE_PHYSICAL_RECORDS_AND_VARIANTS",
  ambiguityPolicy: "PRESERVE_ANNOTATION_AND_MULTIPLICITY_FAIL_CLOSED",
  sourceAuthority: CMUDICT_SHARED_SOURCE_PRONUNCIATION_SOURCE_AUTHORITY_V0_1,
  authorityProvenanceRequirements: Object.freeze([
    CMUDICT_SHARED_SOURCE_PRONUNCIATION_ALIGNMENT_TAG_V0_1,
    CMUDICT_SHARED_SOURCE_PRONUNCIATION_EVIDENCE_TAG_V0_1,
  ]),
  sourceProvenanceRequirements: Object.freeze([
    CMUDICT_SOURCE_PROVENANCE_ARTIFACT_PREFIX_V0_1,
    CMUDICT_SOURCE_PROVENANCE_RECORD_PREFIX_V0_1,
  ]),
  reproducibilityRequirements: Object.freeze({
    algorithm: "SHA-256",
    canonicalization: CMUDICT_SHARED_SOURCE_PRONUNCIATION_CANONICALIZATION_V0_1,
  }),
});

const INSTANCE_KEYS_V0_1 = Object.freeze([
  "contractId",
  "contractVersion",
  "contractRevision",
  "schemaVersion",
  "languageScope",
  "varietyScope",
  "notation",
  "sourcePath",
  "sourceRevision",
  "sourceArtifactBytes",
  "sourceArtifactSha256",
  "physicalRecordId",
  "sourceLineNumber",
  "rawSourceLine",
  "sourceForm",
  "baseSourceForm",
  "variantId",
  "variantOrder",
  "rawPronunciation",
  "orderedRawArpabetTokens",
  "opaqueAnnotationText",
  "annotationEligibility",
  "sourceAuthority",
  "sourceProvenanceRefs",
  "deterministicReproducibility",
  "alignmentAuthorityTag",
  "evidenceExposureAuthorityTag",
] as const);

const DETERMINISTIC_REPRODUCIBILITY_KEYS_V0_1 = Object.freeze([
  "algorithm",
  "canonicalization",
  "inputFingerprint",
  "outputFingerprint",
] as const);

const INPUT_KEYS_V0_1 = Object.freeze([
  "scope",
  "sourcePath",
  "sourceRevision",
  "sourceArtifactBytes",
  "sourceArtifactSha256",
  "sourceLineNumber",
  "rawSourceLine",
] as const);

const INPUT_SCOPE_PREFIX_V0_1 = "CMUDICT_SHARED_EVIDENCE_INPUT_V0_1" as const;

const CROSS_SIDE_FIELDS_V0_1 = Object.freeze([
  "contractId",
  "contractVersion",
  "contractRevision",
  "schemaVersion",
  "languageScope",
  "varietyScope",
  "notation",
  "sourcePath",
  "sourceRevision",
  "sourceArtifactBytes",
  "sourceArtifactSha256",
  "physicalRecordId",
  "sourceLineNumber",
  "rawSourceLine",
  "sourceForm",
  "baseSourceForm",
  "variantId",
  "variantOrder",
  "rawPronunciation",
  "orderedRawArpabetTokens",
  "opaqueAnnotationText",
  "annotationEligibility",
  "sourceAuthority",
  "sourceProvenanceRefs",
  "alignmentAuthorityTag",
  "evidenceExposureAuthorityTag",
  "deterministicReproducibility.algorithm",
  "deterministicReproducibility.canonicalization",
  "deterministicReproducibility.inputFingerprint",
  "deterministicReproducibility.outputFingerprint",
] as const);

const REASON = {
  authorized: "CMUDICT_PATH_B_SHARED_EVIDENCE_AUTHORIZED",
  artifact: "CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_ARTIFACT_MISMATCH",
  provenanceIncomplete: "CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_PROVENANCE_INCOMPLETE",
  provenanceMismatch: "CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_PROVENANCE_MISMATCH",
  lineMissing: "CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_LINE_MISSING",
  rawLine: "CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_SOURCE_LINE_MISMATCH",
  sourceForm: "CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_FORM_MISMATCH",
  variantIdentity: "CMUDICT_PATH_B_SHARED_EVIDENCE_VARIANT_IDENTITY_MISMATCH",
  variantOrder: "CMUDICT_PATH_B_SHARED_EVIDENCE_VARIANT_ORDER_MISMATCH",
  rawMissing: "CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_PRONUNCIATION_MISSING",
  rawMismatch: "CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_PRONUNCIATION_MISMATCH",
  tokenMalformed: "CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_TOKEN_MALFORMED",
  tokenMismatch: "CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_TOKEN_MISMATCH",
  annotationMalformed: "CMUDICT_PATH_B_SHARED_EVIDENCE_ANNOTATION_EVIDENCE_MALFORMED",
  annotationMismatch: "CMUDICT_PATH_B_SHARED_EVIDENCE_ANNOTATION_ELIGIBILITY_MISMATCH",
  contract: "CMUDICT_PATH_B_SHARED_EVIDENCE_CONTRACT_IDENTITY_MISMATCH",
  tags: "CMUDICT_PATH_B_SHARED_EVIDENCE_AUTHORITY_TAG_MISSING_OR_MALFORMED",
  physicalId: "CMUDICT_PATH_B_SHARED_EVIDENCE_PHYSICAL_RECORD_ID_MISMATCH",
  canonical: "CMUDICT_PATH_B_SHARED_EVIDENCE_CANONICALIZATION_FAILURE",
  inputFingerprint: "CMUDICT_PATH_B_SHARED_EVIDENCE_INPUT_FINGERPRINT_FAILURE",
  outputFingerprint: "CMUDICT_PATH_B_SHARED_EVIDENCE_OUTPUT_FINGERPRINT_FAILURE",
  nondeterministic: "CMUDICT_PATH_B_SHARED_EVIDENCE_NON_DETERMINISTIC_REPRODUCTION",
  unknown: "CMUDICT_PATH_B_SHARED_EVIDENCE_UNKNOWN_FIELD_OR_MALFORMED_EVIDENCE",
} as const satisfies Record<string, CmuDictPathBSharedRepresentationEvidenceExposureReasonCodeV0_1>;

type ReasonCode = CmuDictPathBSharedRepresentationEvidenceExposureReasonCodeV0_1;

class ContractFailureV0_1 extends Error {
  constructor(readonly reasonCode: Exclude<ReasonCode, typeof REASON.authorized>) {
    super(reasonCode);
  }
}

function failV0_1(
  reasonCode: Exclude<ReasonCode, typeof REASON.authorized>,
): never {
  throw new ContractFailureV0_1(reasonCode);
}

function deepFreezeV0_1<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreezeV0_1(child, seen);
  }
  return Object.freeze(value);
}

function isSafeStringV0_1(value: unknown): value is string {
  if (typeof value !== "string") return false;
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (next < 0xdc00 || next > 0xdfff) return false;
      index += 1;
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      return false;
    }
  }
  return true;
}

function exactOwnKeysV0_1(value: object, expected: readonly string[]): boolean {
  if (Object.getOwnPropertySymbols(value).length > 0) return false;
  const actual = Object.getOwnPropertyNames(value).sort();
  const target = [...expected].sort();
  return actual.length === target.length && actual.every((key, index) => key === target[index]);
}

function plainValueSnapshotV0_1(
  value: unknown,
  active = new WeakSet<object>(),
): unknown {
  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (typeof value !== "object") throw new Error("unsupported value");
  if (active.has(value)) throw new Error("cycle");
  active.add(value);

  if (Array.isArray(value)) {
    const ownKeys = Object.getOwnPropertyNames(value);
    if (
      ownKeys.some((key) => key !== "length" && !/^(?:0|[1-9]\d*)$/u.test(key)) ||
      Object.getOwnPropertySymbols(value).length > 0
    ) {
      throw new Error("array has unknown fields");
    }
    const result = Array.from({ length: value.length }, (_, index) => {
      const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
      if (!descriptor || !("value" in descriptor)) throw new Error("array accessor or hole");
      return plainValueSnapshotV0_1(descriptor.value, active);
    });
    active.delete(value);
    return result;
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) throw new Error("prototype");
  const result: Record<string, unknown> = {};
  for (const key of Object.getOwnPropertyNames(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor || !("value" in descriptor)) throw new Error("accessor");
    result[key] = plainValueSnapshotV0_1(descriptor.value, active);
  }
  if (Object.getOwnPropertySymbols(value).length > 0) throw new Error("symbols");
  active.delete(value);
  return result;
}

function isPositiveSafeIntegerV0_1(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function isNonNegativeSafeIntegerV0_1(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function validSha256V0_1(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{64}$/u.test(value);
}

function derivePhysicalRecordIdV0_1(
  sourceArtifactSha256: string,
  sourceLineNumber: number,
): string {
  if (!validSha256V0_1(sourceArtifactSha256) || !isPositiveSafeIntegerV0_1(sourceLineNumber)) {
    failV0_1(REASON.physicalId);
  }
  return `cmudict-physical-v0_1|sha256=${sourceArtifactSha256}|line=${sourceLineNumber}`;
}

function deriveProvenanceRefsV0_1(
  sourcePath: string,
  sourceRevision: string,
  sourceArtifactBytes: number,
  sourceArtifactSha256: string,
  sourceLineNumber: number,
): readonly string[] {
  if (
    !isSafeStringV0_1(sourcePath) ||
    !isSafeStringV0_1(sourceRevision) ||
    !isNonNegativeSafeIntegerV0_1(sourceArtifactBytes) ||
    !validSha256V0_1(sourceArtifactSha256) ||
    !isPositiveSafeIntegerV0_1(sourceLineNumber)
  ) {
    failV0_1(REASON.provenanceIncomplete);
  }
  const refs = [
    `${CMUDICT_SOURCE_PROVENANCE_ARTIFACT_PREFIX_V0_1}|path=${sourcePath}|revision=${sourceRevision}|bytes=${sourceArtifactBytes}|sha256=${sourceArtifactSha256}`,
    `${CMUDICT_SOURCE_PROVENANCE_RECORD_PREFIX_V0_1}|artifactSha256=${sourceArtifactSha256}|line=${sourceLineNumber}`,
  ];
  refs.sort((left, right) => Buffer.from(left, "utf8").compare(Buffer.from(right, "utf8")));
  return Object.freeze(refs);
}

function tokenReasonV0_1(token: string): ReasonCode | null {
  const match = /^([A-Z]+)([012])?$/u.exec(token);
  if (!match || !ARPABET_BASE_SYMBOLS_V0_1.has(match[1])) return REASON.tokenMalformed;
  if (match[2] !== undefined && !ARPABET_VOWEL_SYMBOLS_V0_1.has(match[1])) {
    return REASON.tokenMalformed;
  }
  return null;
}

function deriveRawTokensV0_1(rawPronunciation: unknown): readonly string[] {
  if (
    !isSafeStringV0_1(rawPronunciation) ||
    rawPronunciation.length === 0 ||
    rawPronunciation.startsWith(" ") ||
    rawPronunciation.endsWith(" ") ||
    rawPronunciation.includes("  ") ||
    rawPronunciation.includes("#")
  ) {
    failV0_1(REASON.tokenMalformed);
  }
  const tokens = rawPronunciation.split(" ");
  if (tokens.some((token) => tokenReasonV0_1(token) !== null)) failV0_1(REASON.tokenMalformed);
  return Object.freeze([...tokens]);
}

function annotationV0_1(
  opaqueAnnotationText: unknown,
): { text: string | null; eligibility: "ELIGIBLE" | "INELIGIBLE" } {
  if (opaqueAnnotationText === undefined || opaqueAnnotationText === null) {
    return { text: null, eligibility: "ELIGIBLE" };
  }
  if (!isSafeStringV0_1(opaqueAnnotationText) || opaqueAnnotationText.length === 0) {
    failV0_1(REASON.annotationMalformed);
  }
  return { text: opaqueAnnotationText, eligibility: "INELIGIBLE" };
}

function canonicalOutputArrayV0_1(
  input: CmuDictSharedSourcePronunciationInstanceV0_1,
): readonly unknown[] {
  return [
    input.contractId,
    input.contractVersion,
    input.contractRevision,
    input.schemaVersion,
    input.languageScope,
    input.varietyScope,
    input.notation,
    input.sourcePath,
    input.sourceRevision,
    input.sourceArtifactBytes,
    input.sourceArtifactSha256,
    input.physicalRecordId,
    input.sourceLineNumber,
    input.rawSourceLine,
    input.sourceForm,
    input.baseSourceForm,
    input.variantId,
    input.variantOrder,
    input.rawPronunciation,
    input.orderedRawArpabetTokens,
    input.opaqueAnnotationText,
    input.annotationEligibility,
    input.sourceAuthority,
    input.sourceProvenanceRefs,
    input.alignmentAuthorityTag,
    input.evidenceExposureAuthorityTag,
  ];
}

function canonicalInputArrayV0_1(
  input: CmuDictSharedSourcePronunciationInputFingerprintInputV0_1,
): readonly unknown[] {
  return [
    INPUT_SCOPE_PREFIX_V0_1,
    input.sourcePath,
    input.sourceRevision,
    input.sourceArtifactBytes,
    input.sourceArtifactSha256,
    input.sourceLineNumber,
    input.rawSourceLine,
  ];
}

function canonicalJsonV0_1(value: readonly unknown[]): string {
  return JSON.stringify(value);
}

function sha256V0_1(value: string): string {
  return createHash("sha256").update(Buffer.from(value, "utf8")).digest("hex");
}

function makeInstanceV0_1(
  fields: Omit<CmuDictSharedSourcePronunciationInstanceV0_1, "deterministicReproducibility">,
  inputFingerprint: string,
): CmuDictSharedSourcePronunciationInstanceV0_1 {
  const incomplete = {
    ...fields,
    deterministicReproducibility: {
      algorithm: "SHA-256" as const,
      canonicalization: CMUDICT_SHARED_SOURCE_PRONUNCIATION_CANONICALIZATION_V0_1,
      inputFingerprint,
      outputFingerprint: "",
    },
  };
  const outputFingerprint = sha256V0_1(
    canonicalJsonV0_1(canonicalOutputArrayV0_1(incomplete)),
  );
  return deepFreezeV0_1({
    ...fields,
    deterministicReproducibility: {
      algorithm: "SHA-256" as const,
      canonicalization: CMUDICT_SHARED_SOURCE_PRONUNCIATION_CANONICALIZATION_V0_1,
      inputFingerprint,
      outputFingerprint,
    },
  });
}

function inputFingerprintForFieldsV0_1(
  sourcePath: string,
  sourceRevision: string,
  sourceArtifactBytes: number,
  sourceArtifactSha256: string,
  sourceLineNumber: number,
  rawSourceLine: string,
): string {
  return sha256V0_1(
    canonicalJsonV0_1(
      canonicalInputArrayV0_1({
        scope: "INPUT",
        sourcePath,
        sourceRevision,
        sourceArtifactBytes,
        sourceArtifactSha256,
        sourceLineNumber,
        rawSourceLine,
      }),
    ),
  );
}

function sharedFieldsV0_1(
  sourceLine: number,
  rawSourceLine: string,
  sourceForm: string,
  baseSourceForm: string,
  variantId: string,
  variantOrder: number,
  rawPronunciation: string,
  orderedRawArpabetTokens: readonly string[],
  opaqueAnnotationText: string | null,
): Omit<CmuDictSharedSourcePronunciationInstanceV0_1, "deterministicReproducibility"> {
  const sourceProvenanceRefs = deriveProvenanceRefsV0_1(
    CMUDICT_SHARED_SOURCE_PRONUNCIATION_SOURCE_PATH_V0_1,
    CMUDICT_SOURCE_REVISION_V0_1,
    CMUDICT_DATA_BYTES_V0_1,
    CMUDICT_DATA_SHA256_V0_1,
    sourceLine,
  );
  return {
    contractId: CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_ID_V0_1,
    contractVersion: CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_VERSION_V0_1,
    contractRevision: CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_REVISION_V0_1,
    schemaVersion: CMUDICT_SHARED_SOURCE_PRONUNCIATION_SCHEMA_V0_1,
    languageScope: "English",
    varietyScope: "en-US",
    notation: "ARPABET",
    sourcePath: CMUDICT_SHARED_SOURCE_PRONUNCIATION_SOURCE_PATH_V0_1,
    sourceRevision: CMUDICT_SOURCE_REVISION_V0_1,
    sourceArtifactBytes: CMUDICT_DATA_BYTES_V0_1,
    sourceArtifactSha256: CMUDICT_DATA_SHA256_V0_1,
    physicalRecordId: derivePhysicalRecordIdV0_1(
      CMUDICT_DATA_SHA256_V0_1,
      sourceLine,
    ),
    sourceLineNumber: sourceLine,
    rawSourceLine,
    sourceForm,
    baseSourceForm,
    variantId,
    variantOrder,
    rawPronunciation,
    orderedRawArpabetTokens: Object.freeze([...orderedRawArpabetTokens]),
    opaqueAnnotationText,
    annotationEligibility:
      opaqueAnnotationText === null ? "ELIGIBLE" : "INELIGIBLE",
    sourceAuthority: CMUDICT_SHARED_SOURCE_PRONUNCIATION_SOURCE_AUTHORITY_V0_1,
    sourceProvenanceRefs,
    alignmentAuthorityTag: CMUDICT_SHARED_SOURCE_PRONUNCIATION_ALIGNMENT_TAG_V0_1,
    evidenceExposureAuthorityTag: CMUDICT_SHARED_SOURCE_PRONUNCIATION_EVIDENCE_TAG_V0_1,
  };
}

function nullResultV0_1(
  reasonCode: Exclude<ReasonCode, typeof REASON.authorized>,
): CmuDictSharedSourcePronunciationExposureResultV0_1 {
  return Object.freeze({ status: "null" as const, reasonCode, instance: null });
}

function buildCandidateInstanceV0_1(
  input: CmuDictCandidatePronunciationEvidenceVariantV0_1,
): CmuDictSharedSourcePronunciationInstanceV0_1 {
  if (input === null || typeof input !== "object") failV0_1(REASON.unknown);
  if (
    input.sourceProfileId !== CMUDICT_SOURCE_PROFILE_ID_V0_1 ||
    input.sourceRevision !== CMUDICT_SOURCE_REVISION_V0_1 ||
    input.sourceNotation !== CMUDICT_SOURCE_NOTATION_V0_1 ||
    input.sourceArtifactBytes !== CMUDICT_DATA_BYTES_V0_1 ||
    input.sourceArtifactSha256 !== CMUDICT_DATA_SHA256_V0_1
  ) {
    failV0_1(REASON.artifact);
  }
  if (!isPositiveSafeIntegerV0_1(input.sourceLineNumber)) failV0_1(REASON.lineMissing);
  if (!isSafeStringV0_1(input.rawSourceLine)) failV0_1(REASON.rawLine);
  if (!isSafeStringV0_1(input.sourceForm) || !isSafeStringV0_1(input.baseSourceForm)) {
    failV0_1(REASON.sourceForm);
  }
  if (!isSafeStringV0_1(input.variantId)) failV0_1(REASON.variantIdentity);
  if (!isNonNegativeSafeIntegerV0_1(input.variantOrder)) failV0_1(REASON.variantOrder);
  if (!isSafeStringV0_1(input.rawPronunciation) || input.rawPronunciation.length === 0) {
    failV0_1(REASON.rawMissing);
  }
  const derivedTokens = deriveRawTokensV0_1(input.rawPronunciation);
  if (
    !Array.isArray(input.orderedRawArpabetTokens) ||
    input.orderedRawArpabetTokens.length !== derivedTokens.length ||
    input.orderedRawArpabetTokens.some((token, index) => token !== derivedTokens[index])
  ) {
    failV0_1(REASON.tokenMismatch);
  }
  const annotation = annotationV0_1(input.opaqueAnnotationText);
  const expectedRawSourceLine =
    annotation.text === null
      ? `${input.sourceForm} ${input.rawPronunciation}`
      : `${input.sourceForm} ${input.rawPronunciation} # ${annotation.text}`;
  if (input.rawSourceLine !== expectedRawSourceLine) failV0_1(REASON.rawLine);
  const fields = sharedFieldsV0_1(
    input.sourceLineNumber,
    input.rawSourceLine,
    input.sourceForm,
    input.baseSourceForm,
    input.variantId,
    input.variantOrder,
    input.rawPronunciation,
    derivedTokens,
    annotation.text,
  );
  const inputFingerprint = inputFingerprintForFieldsV0_1(
    fields.sourcePath,
    fields.sourceRevision,
    fields.sourceArtifactBytes,
    fields.sourceArtifactSha256,
    fields.sourceLineNumber,
    fields.rawSourceLine,
  );
  return makeInstanceV0_1(fields, inputFingerprint);
}

function buildProductionInstanceV0_1(
  input: CmuDictProductionSpokenBridgePrerequisiteVariantV0_1,
): CmuDictSharedSourcePronunciationInstanceV0_1 {
  if (input === null || typeof input !== "object") failV0_1(REASON.unknown);
  if (
    input.schemaVersion !== CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_VARIANT_SCHEMA_V0_1 ||
    input.sourceProfileId !== CMUDICT_SOURCE_PROFILE_ID_V0_1 ||
    input.sourceRevision !== CMUDICT_SOURCE_REVISION_V0_1 ||
    input.sourceNotation !== CMUDICT_SOURCE_NOTATION_V0_1 ||
    input.sourceArtifactBytes !== CMUDICT_DATA_BYTES_V0_1 ||
    input.sourceArtifactSha256 !== CMUDICT_DATA_SHA256_V0_1
  ) {
    failV0_1(REASON.artifact);
  }
  const physical = input.physicalEvidence;
  if (physical === null || typeof physical !== "object") failV0_1(REASON.unknown);
  if (!isPositiveSafeIntegerV0_1(physical.sourceLineNumber)) failV0_1(REASON.lineMissing);
  if (!isSafeStringV0_1(physical.rawSourceLine)) failV0_1(REASON.rawLine);
  if (!isSafeStringV0_1(physical.sourceForm) || !isSafeStringV0_1(physical.baseSourceForm)) {
    failV0_1(REASON.sourceForm);
  }
  if (!isSafeStringV0_1(physical.variantId)) failV0_1(REASON.variantIdentity);
  if (!isNonNegativeSafeIntegerV0_1(physical.variantOrder)) failV0_1(REASON.variantOrder);
  if (!isSafeStringV0_1(physical.rawPhysicalPronunciation) || physical.rawPhysicalPronunciation.length === 0) {
    failV0_1(REASON.rawMissing);
  }
  if (!isSafeStringV0_1(physical.rawProductionPronunciation)) failV0_1(REASON.annotationMalformed);
  const annotation = annotationV0_1(physical.opaqueAnnotationText);
  const expectedFullPronunciation =
    annotation.text === null
      ? physical.rawPhysicalPronunciation
      : `${physical.rawPhysicalPronunciation} # ${annotation.text}`;
  if (
    physical.rawProductionPronunciation !== expectedFullPronunciation ||
    physical.terminalOpaqueAnnotationDetected !== (annotation.text !== null)
  ) {
    failV0_1(REASON.annotationMalformed);
  }
  const derivedTokens = deriveRawTokensV0_1(physical.rawPhysicalPronunciation);
  const expectedRawSourceLine =
    annotation.text === null
      ? `${physical.sourceForm} ${physical.rawPhysicalPronunciation}`
      : `${physical.sourceForm} ${physical.rawPhysicalPronunciation} # ${annotation.text}`;
  if (physical.rawSourceLine !== expectedRawSourceLine) failV0_1(REASON.rawLine);
  const fields = sharedFieldsV0_1(
    physical.sourceLineNumber,
    physical.rawSourceLine,
    physical.sourceForm,
    physical.baseSourceForm,
    physical.variantId,
    physical.variantOrder,
    physical.rawPhysicalPronunciation,
    derivedTokens,
    annotation.text,
  );
  const inputFingerprint = inputFingerprintForFieldsV0_1(
    fields.sourcePath,
    fields.sourceRevision,
    fields.sourceArtifactBytes,
    fields.sourceArtifactSha256,
    fields.sourceLineNumber,
    fields.rawSourceLine,
  );
  return makeInstanceV0_1(fields, inputFingerprint);
}

function mismatchForFieldV0_1(field: string): Exclude<ReasonCode, typeof REASON.authorized> {
  if (field === "sourceProvenanceRefs") return REASON.provenanceMismatch;
  if (field === "orderedRawArpabetTokens") return REASON.tokenMismatch;
  if (field === "annotationEligibility") return REASON.annotationMismatch;
  if (field === "physicalRecordId") return REASON.physicalId;
  if (field === "rawSourceLine") return REASON.rawLine;
  if (field === "sourceForm" || field === "baseSourceForm") return REASON.sourceForm;
  if (field === "variantId") return REASON.variantIdentity;
  if (field === "variantOrder") return REASON.variantOrder;
  if (field === "rawPronunciation") return REASON.rawMismatch;
  if (field === "sourceLineNumber") return REASON.lineMissing;
  if (field === "sourcePath" || field === "sourceRevision" || field === "sourceArtifactBytes" || field === "sourceArtifactSha256" || field === "sourceAuthority") return REASON.artifact;
  if (field.startsWith("deterministicReproducibility.inputFingerprint")) return REASON.inputFingerprint;
  if (field.startsWith("deterministicReproducibility.outputFingerprint")) return REASON.outputFingerprint;
  if (field.startsWith("deterministicReproducibility.")) return REASON.canonical;
  if (field === "alignmentAuthorityTag" || field === "evidenceExposureAuthorityTag") return REASON.tags;
  if (field === "opaqueAnnotationText") return REASON.annotationMalformed;
  if (["contractId", "contractVersion", "contractRevision", "schemaVersion", "languageScope", "varietyScope", "notation"].includes(field)) return REASON.contract;
  return REASON.unknown;
}

function valueAtPathV0_1(
  instance: CmuDictSharedSourcePronunciationInstanceV0_1,
  field: string,
): unknown {
  if (field.startsWith("deterministicReproducibility.")) {
    return instance.deterministicReproducibility[
      field.slice("deterministicReproducibility.".length) as keyof typeof instance.deterministicReproducibility
    ];
  }
  return instance[field as keyof CmuDictSharedSourcePronunciationInstanceV0_1];
}

function valuesEqualV0_1(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
  return left.every((value, index) => valuesEqualV0_1(value, right[index]));
}

export function buildCmuDictCandidateSharedSourcePronunciationInstanceV0_1(
  input: CmuDictCandidatePronunciationEvidenceVariantV0_1,
): CmuDictSharedSourcePronunciationExposureResultV0_1 {
  try {
    return Object.freeze({
      status: "authorized" as const,
      reasonCode: REASON.authorized,
      instance: buildCandidateInstanceV0_1(input),
    });
  } catch (error) {
    return nullResultV0_1(
      error instanceof ContractFailureV0_1 ? error.reasonCode : REASON.unknown,
    );
  }
}

export function buildCmuDictProductionSharedSourcePronunciationInstanceV0_1(
  input: CmuDictProductionSpokenBridgePrerequisiteVariantV0_1,
): CmuDictSharedSourcePronunciationExposureResultV0_1 {
  try {
    return Object.freeze({
      status: "authorized" as const,
      reasonCode: REASON.authorized,
      instance: buildProductionInstanceV0_1(input),
    });
  } catch (error) {
    return nullResultV0_1(
      error instanceof ContractFailureV0_1 ? error.reasonCode : REASON.unknown,
    );
  }
}

export function serializeCmuDictSharedSourcePronunciationInstanceV0_1(
  input: CmuDictSharedSourcePronunciationInstanceV0_1,
): string {
  if (validateCmuDictSharedSourcePronunciationInstanceV0_1(input) !== REASON.authorized) {
    throw new Error(REASON.canonical);
  }
  return canonicalJsonV0_1(canonicalOutputArrayV0_1(input));
}

export function fingerprintCmuDictSharedSourcePronunciationV0_1(
  input:
    | CmuDictSharedSourcePronunciationInputFingerprintInputV0_1
    | CmuDictSharedSourcePronunciationInstanceV0_1,
): string {
  const snapshot = plainValueSnapshotV0_1(input);
  if (
    snapshot === null ||
    typeof snapshot !== "object" ||
    Array.isArray(snapshot)
  ) {
    throw new Error(REASON.canonical);
  }
  const record = snapshot as Record<string, unknown>;
  if (record.scope === "INPUT") {
    if (!exactOwnKeysV0_1(record, INPUT_KEYS_V0_1)) throw new Error(REASON.canonical);
    if (
      !isSafeStringV0_1(record.sourcePath) ||
      !isSafeStringV0_1(record.sourceRevision) ||
      !isNonNegativeSafeIntegerV0_1(record.sourceArtifactBytes) ||
      !validSha256V0_1(record.sourceArtifactSha256) ||
      !isPositiveSafeIntegerV0_1(record.sourceLineNumber) ||
      !isSafeStringV0_1(record.rawSourceLine)
    ) {
      throw new Error(REASON.canonical);
    }
    return sha256V0_1(canonicalJsonV0_1(canonicalInputArrayV0_1(record as unknown as CmuDictSharedSourcePronunciationInputFingerprintInputV0_1)));
  }
  const reason = validateCmuDictSharedSourcePronunciationInstanceV0_1(input);
  if (reason !== REASON.authorized) throw new Error(reason);
  return (input as CmuDictSharedSourcePronunciationInstanceV0_1)
    .deterministicReproducibility.outputFingerprint;
}

export function validateCmuDictSharedSourcePronunciationInstanceV0_1(
  input: unknown,
): ReasonCode {
  let snapshot: unknown;
  try {
    snapshot = plainValueSnapshotV0_1(input);
  } catch {
    return REASON.unknown;
  }
  if (
    snapshot === null ||
    typeof snapshot !== "object" ||
    Array.isArray(snapshot) ||
    !exactOwnKeysV0_1(snapshot, INSTANCE_KEYS_V0_1)
  ) {
    return REASON.unknown;
  }
  const value = snapshot as Record<string, unknown>;
  if (
    value.contractId !== CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_ID_V0_1 ||
    value.contractVersion !== CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_VERSION_V0_1 ||
    value.contractRevision !== CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_REVISION_V0_1 ||
    value.schemaVersion !== CMUDICT_SHARED_SOURCE_PRONUNCIATION_SCHEMA_V0_1 ||
    value.languageScope !== "English" ||
    value.varietyScope !== "en-US" ||
    value.notation !== "ARPABET"
  ) return REASON.contract;
  if (
    value.sourcePath !== CMUDICT_SHARED_SOURCE_PRONUNCIATION_SOURCE_PATH_V0_1 ||
    value.sourceRevision !== CMUDICT_SOURCE_REVISION_V0_1 ||
    value.sourceArtifactBytes !== CMUDICT_DATA_BYTES_V0_1 ||
    value.sourceArtifactSha256 !== CMUDICT_DATA_SHA256_V0_1 ||
    value.sourceAuthority !== CMUDICT_SHARED_SOURCE_PRONUNCIATION_SOURCE_AUTHORITY_V0_1
  ) return REASON.artifact;
  if (!isPositiveSafeIntegerV0_1(value.sourceLineNumber)) return REASON.lineMissing;
  if (
    !isSafeStringV0_1(value.rawSourceLine) ||
    !isSafeStringV0_1(value.sourceForm) ||
    !isSafeStringV0_1(value.baseSourceForm)
  ) return REASON.rawLine;
  if (!isSafeStringV0_1(value.variantId)) return REASON.variantIdentity;
  if (!isNonNegativeSafeIntegerV0_1(value.variantOrder)) return REASON.variantOrder;
  if (!isSafeStringV0_1(value.rawPronunciation) || value.rawPronunciation.length === 0) return REASON.rawMissing;
  let derivedTokens: readonly string[];
  try {
    derivedTokens = deriveRawTokensV0_1(value.rawPronunciation);
  } catch {
    return REASON.tokenMalformed;
  }
  if (!Array.isArray(value.orderedRawArpabetTokens)) return REASON.tokenMismatch;
  if (
    value.orderedRawArpabetTokens.length !== derivedTokens.length ||
    value.orderedRawArpabetTokens.some((token, index) => token !== derivedTokens[index])
  ) return REASON.tokenMismatch;
  if (value.opaqueAnnotationText !== null && !isSafeStringV0_1(value.opaqueAnnotationText)) return REASON.annotationMalformed;
  if (value.opaqueAnnotationText === "") return REASON.annotationMalformed;
  const expectedEligibility = value.opaqueAnnotationText === null ? "ELIGIBLE" : "INELIGIBLE";
  if (value.annotationEligibility !== expectedEligibility) return REASON.annotationMismatch;
  if (!validSha256V0_1(value.sourceArtifactSha256)) return REASON.artifact;
  if (value.physicalRecordId !== derivePhysicalRecordIdV0_1(value.sourceArtifactSha256, value.sourceLineNumber)) return REASON.physicalId;
  let refs: readonly string[];
  try {
    refs = deriveProvenanceRefsV0_1(
      value.sourcePath,
      value.sourceRevision,
      value.sourceArtifactBytes as number,
      value.sourceArtifactSha256,
      value.sourceLineNumber,
    );
  } catch {
    return REASON.provenanceIncomplete;
  }
  if (!Array.isArray(value.sourceProvenanceRefs) || !valuesEqualV0_1(value.sourceProvenanceRefs, refs)) return REASON.provenanceIncomplete;
  if (value.alignmentAuthorityTag !== CMUDICT_SHARED_SOURCE_PRONUNCIATION_ALIGNMENT_TAG_V0_1 || value.evidenceExposureAuthorityTag !== CMUDICT_SHARED_SOURCE_PRONUNCIATION_EVIDENCE_TAG_V0_1) return REASON.tags;
  if (
    value.deterministicReproducibility === null ||
    typeof value.deterministicReproducibility !== "object" ||
    Array.isArray(value.deterministicReproducibility) ||
    !exactOwnKeysV0_1(value.deterministicReproducibility, DETERMINISTIC_REPRODUCIBILITY_KEYS_V0_1)
  ) return REASON.canonical;
  const reproducibility = value.deterministicReproducibility as Record<string, unknown>;
  if (reproducibility.algorithm !== "SHA-256" || reproducibility.canonicalization !== CMUDICT_SHARED_SOURCE_PRONUNCIATION_CANONICALIZATION_V0_1) return REASON.canonical;
  if (!validSha256V0_1(reproducibility.inputFingerprint)) return REASON.inputFingerprint;
  if (!validSha256V0_1(reproducibility.outputFingerprint)) return REASON.outputFingerprint;
  const expectedInput = inputFingerprintForFieldsV0_1(
    value.sourcePath,
    value.sourceRevision,
    value.sourceArtifactBytes as number,
    value.sourceArtifactSha256,
    value.sourceLineNumber,
    value.rawSourceLine,
  );
  if (reproducibility.inputFingerprint !== expectedInput) return REASON.inputFingerprint;
  const outputWithoutFingerprint = {
    ...value,
    deterministicReproducibility: {
      algorithm: "SHA-256",
      canonicalization: CMUDICT_SHARED_SOURCE_PRONUNCIATION_CANONICALIZATION_V0_1,
      inputFingerprint: reproducibility.inputFingerprint,
      outputFingerprint: reproducibility.outputFingerprint,
    },
  } as CmuDictSharedSourcePronunciationInstanceV0_1;
  const expectedOutput = sha256V0_1(canonicalJsonV0_1(canonicalOutputArrayV0_1(outputWithoutFingerprint)));
  if (reproducibility.outputFingerprint !== expectedOutput) return REASON.outputFingerprint;
  return REASON.authorized;
}

export function compareCmuDictSharedSourcePronunciationInstancesV0_1(
  candidate: CmuDictSharedSourcePronunciationInstanceV0_1,
  production: CmuDictSharedSourcePronunciationInstanceV0_1,
): CmuDictSharedSourcePronunciationComparisonResultV0_1 {
  const candidateReason = validateCmuDictSharedSourcePronunciationInstanceV0_1(candidate);
  if (candidateReason === REASON.provenanceIncomplete) {
    return Object.freeze({ status: "mismatch", reasonCode: REASON.provenanceMismatch });
  }
  if (candidateReason !== REASON.authorized) return Object.freeze({ status: "mismatch", reasonCode: candidateReason });
  const productionReason = validateCmuDictSharedSourcePronunciationInstanceV0_1(production);
  if (productionReason === REASON.provenanceIncomplete) {
    return Object.freeze({ status: "mismatch", reasonCode: REASON.provenanceMismatch });
  }
  if (productionReason !== REASON.authorized) return Object.freeze({ status: "mismatch", reasonCode: productionReason });
  for (const field of CROSS_SIDE_FIELDS_V0_1) {
    if (!valuesEqualV0_1(valueAtPathV0_1(candidate, field), valueAtPathV0_1(production, field))) {
      return Object.freeze({ status: "mismatch", reasonCode: mismatchForFieldV0_1(field) });
    }
  }
  return Object.freeze({ status: "match", reasonCode: REASON.authorized });
}
