import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_ID_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_VERSION_V0_1,
  normalizeEnglishLexicalJoinKeyV0_1,
} from "./englishLexicalSenseSourceContract.v0_1";
import {
  CMUDICT_DATA_BYTES_V0_1,
  CMUDICT_DATA_SHA256_V0_1,
  CMUDICT_SOURCE_NOTATION_V0_1,
  CMUDICT_SOURCE_REVISION_V0_1,
  normalizeCmuDictLexicalWordV0_1,
} from "./cmudictArpabetPronunciation.v0_1";
import {
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_NORMALIZATION_IDENTITY_V0_1,
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PROJECTOR_ID_V0_1,
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_VARIANT_SCHEMA_V0_1,
} from "./cmudictProductionSpokenBridgePrerequisites.v0_1";
import {
  CMUDICT_SHARED_SOURCE_PRONUNCIATION_ALIGNMENT_TAG_V0_1,
  CMUDICT_SHARED_SOURCE_PRONUNCIATION_EVIDENCE_TAG_V0_1,
  serializeCmuDictSharedSourcePronunciationInstanceV0_1,
  validateCmuDictSharedSourcePronunciationInstanceV0_1,
  type CmuDictSharedSourcePronunciationInstanceV0_1,
} from "./cmudictSharedRepresentationEvidenceExposure.v0_1";

export const CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_CONTRACT_ID_V0_1 =
  "OPEN_INSTRUMENT_CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_CONFORMANCE_V0_1" as const;
export const CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_CONTRACT_VERSION_V0_1 =
  "v0.1" as const;
export const CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_CANONICALIZATION_V0_1 =
  "CMUDICT_PATH_B_NORMALIZATION_CONFORMANCE_CANONICAL_JSON_ARRAY_V0_1" as const;
export const CMUDICT_PATH_B_CANDIDATE_NORMALIZATION_IDENTITY_V0_1 =
  "normalizeEnglishLexicalJoinKeyV0_1:NFC->en-US-lowercase->NFC:no-trim" as const;
export const CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_EVIDENCE_STATUS_V0_1 =
  "BOUNDED_NORMALIZATION_CONFORMANCE_EVIDENCE_ONLY" as const;

const CMUDICT_DATASET_PATH_V0_1 = join(
  process.cwd(),
  "src/data/openInstrument/pronunciation/cmudict.dict",
);

export type CmuDictPathBNormalizationConformanceReasonCodeV0_1 =
  | "CMUDICT_PATH_B_NORMALIZATION_ARTIFACT_MISMATCH"
  | "CMUDICT_PATH_B_NORMALIZATION_DOMAIN_MISMATCH"
  | "CMUDICT_PATH_B_NORMALIZATION_VARIANT_BASE_MISMATCH"
  | "CMUDICT_PATH_B_NORMALIZATION_CANDIDATE_OUTPUT_MISMATCH"
  | "CMUDICT_PATH_B_NORMALIZATION_PRODUCTION_OUTPUT_MISMATCH"
  | "CMUDICT_PATH_B_NORMALIZATION_ROLE_IDENTITY_MISSING"
  | "CMUDICT_PATH_B_NORMALIZATION_INPUT_INVALID"
  | "CMUDICT_PATH_B_NORMALIZATION_PROVENANCE_INCOMPLETE"
  | "CMUDICT_PATH_B_NORMALIZATION_AUTHORITY_NOT_APPROVED";

export type CmuDictPathBNormalizationCandidateEvidenceV0_1 = Readonly<{
  role: "CANDIDATE";
  normalizerIdentity: typeof CMUDICT_PATH_B_CANDIDATE_NORMALIZATION_IDENTITY_V0_1;
  sourceContractId: typeof ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_ID_V0_1;
  sourceContractVersion: typeof ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_VERSION_V0_1;
  normalizedOutput: string;
}>;

export type CmuDictPathBNormalizationProductionEvidenceV0_1 = Readonly<{
  role: "PRODUCTION";
  normalizerIdentity: typeof CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_NORMALIZATION_IDENTITY_V0_1;
  producerSchemaVersion: typeof CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_VARIANT_SCHEMA_V0_1;
  producerProjectorId: typeof CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PROJECTOR_ID_V0_1;
  normalizedOutput: string;
}>;

export type CmuDictPathBNormalizationConformanceInputV0_1 = Readonly<{
  sharedSourceInstance: CmuDictSharedSourcePronunciationInstanceV0_1;
  candidateNormalization: CmuDictPathBNormalizationCandidateEvidenceV0_1;
  productionNormalization: CmuDictPathBNormalizationProductionEvidenceV0_1;
}>;

type CmuDictPathBNormalizationConformanceEvidenceV0_1 = Readonly<{
  status: typeof CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_EVIDENCE_STATUS_V0_1;
  reasonCode: null;
  evidenceOnly: true;
  proposedContractId: typeof CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_CONTRACT_ID_V0_1;
  proposedContractVersion: typeof CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_CONTRACT_VERSION_V0_1;
  candidateNormalization: CmuDictPathBNormalizationCandidateEvidenceV0_1;
  productionNormalization: CmuDictPathBNormalizationProductionEvidenceV0_1;
  sourceEvidence: CmuDictSharedSourcePronunciationInstanceV0_1;
  normalization: Readonly<{
    domain: "VERIFIED_FROZEN_CMUDICT_BASE_SOURCE_FORM_ONLY";
    sourceForm: string;
    baseSourceForm: string;
    variantId: string;
    variantOrder: number;
    physicalRecordId: string;
    sourceLineNumber: number;
    candidateOutput: string;
    productionOutput: string;
    exactOutputEquality: true;
  }>;
  authorityBoundary: "EVIDENCE_ONLY_NO_CANONICAL_GATE2_AUTHORITY";
  deterministicReproducibility: Readonly<{
    algorithm: "SHA-256";
    canonicalization: typeof CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_CANONICALIZATION_V0_1;
    inputFingerprint: string;
    outputFingerprint: string;
  }>;
}>;

export type CmuDictPathBNormalizationConformanceResultV0_1 =
  | CmuDictPathBNormalizationConformanceEvidenceV0_1
  | Readonly<{
      status: "null";
      reasonCode: CmuDictPathBNormalizationConformanceReasonCodeV0_1;
      evidence: null;
    }>;

const INPUT_KEYS_V0_1 = Object.freeze([
  "sharedSourceInstance",
  "candidateNormalization",
  "productionNormalization",
] as const);
const CANDIDATE_KEYS_V0_1 = Object.freeze([
  "role",
  "normalizerIdentity",
  "sourceContractId",
  "sourceContractVersion",
  "normalizedOutput",
] as const);
const PRODUCTION_KEYS_V0_1 = Object.freeze([
  "role",
  "normalizerIdentity",
  "producerSchemaVersion",
  "producerProjectorId",
  "normalizedOutput",
] as const);

type PlainRecordV0_1 = Record<string, unknown>;

function isPlainRecordV0_1(value: unknown): value is PlainRecordV0_1 {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null)
  );
}

function exactOwnKeysV0_1(value: object, expected: readonly string[]): boolean {
  if (Object.getOwnPropertySymbols(value).length > 0) return false;
  const actual = Object.getOwnPropertyNames(value).sort();
  const target = [...expected].sort();
  return (
    actual.length === target.length &&
    actual.every((key, index) => key === target[index])
  );
}

function hasOnlyDataPropertiesV0_1(value: object): boolean {
  return Object.getOwnPropertyNames(value).every((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    return descriptor !== undefined && "value" in descriptor;
  });
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

function validSha256V0_1(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{64}$/u.test(value);
}

function deepFreezeV0_1<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value)) {
    return value;
  }
  seen.add(value);
  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreezeV0_1(child, seen);
  }
  return Object.freeze(value);
}

function sha256V0_1(value: string): string {
  return createHash("sha256").update(Buffer.from(value, "utf8")).digest("hex");
}

function canonicalJsonV0_1(value: readonly unknown[]): string {
  return JSON.stringify(value);
}

function nullResultV0_1(
  reasonCode: CmuDictPathBNormalizationConformanceReasonCodeV0_1,
): CmuDictPathBNormalizationConformanceResultV0_1 {
  return Object.freeze({ status: "null" as const, reasonCode, evidence: null });
}

function deriveVariantIdentityV0_1(sourceForm: string): {
  baseSourceForm: string;
  variantId: string;
} {
  const match = /^(.*)\((\d+)\)$/u.exec(sourceForm);
  if (!match) return { baseSourceForm: sourceForm, variantId: "1" };
  return { baseSourceForm: match[1], variantId: match[2] };
}

function parsePhysicalLineV0_1(rawSourceLine: string): {
  sourceForm: string;
  baseSourceForm: string;
  variantId: string;
  rawPronunciation: string;
  orderedRawArpabetTokens: readonly string[];
  opaqueAnnotationText: string | null;
} | null {
  const separator = rawSourceLine.indexOf(" ");
  if (separator <= 0 || rawSourceLine.startsWith(" ")) return null;
  const sourceForm = rawSourceLine.slice(0, separator);
  const remainder = rawSourceLine.slice(separator + 1);
  const annotationDelimiter = remainder.indexOf(" # ");
  const rawPronunciation =
    annotationDelimiter < 0
      ? remainder
      : remainder.slice(0, annotationDelimiter);
  const opaqueAnnotationText =
    annotationDelimiter < 0
      ? null
      : remainder.slice(annotationDelimiter + " # ".length);
  if (
    rawPronunciation.length === 0 ||
    rawPronunciation.startsWith(" ") ||
    rawPronunciation.endsWith(" ") ||
    rawPronunciation.includes("  ") ||
    opaqueAnnotationText === ""
  ) {
    return null;
  }
  const orderedRawArpabetTokens = rawPronunciation.split(" ");
  const { baseSourceForm, variantId } = deriveVariantIdentityV0_1(sourceForm);
  return {
    sourceForm,
    baseSourceForm,
    variantId,
    rawPronunciation,
    orderedRawArpabetTokens,
    opaqueAnnotationText,
  };
}

function readFrozenArtifactV0_1():
  | { text: string; lines: readonly string[] }
  | CmuDictPathBNormalizationConformanceReasonCodeV0_1 {
  let text: string;
  try {
    text = readFileSync(CMUDICT_DATASET_PATH_V0_1, "utf8");
  } catch {
    return "CMUDICT_PATH_B_NORMALIZATION_ARTIFACT_MISMATCH";
  }
  const bytes = Buffer.byteLength(text, "utf8");
  const sha256 = createHash("sha256")
    .update(Buffer.from(text, "utf8"))
    .digest("hex");
  if (bytes !== CMUDICT_DATA_BYTES_V0_1 || sha256 !== CMUDICT_DATA_SHA256_V0_1) {
    return "CMUDICT_PATH_B_NORMALIZATION_ARTIFACT_MISMATCH";
  }
  return { text, lines: text.split(/\r?\n/u) };
}

function domainSurfaceReasonV0_1(
  instance: CmuDictSharedSourcePronunciationInstanceV0_1,
): CmuDictPathBNormalizationConformanceReasonCodeV0_1 | null {
  if (
    !isSafeStringV0_1(instance.sourceForm) ||
    !isSafeStringV0_1(instance.baseSourceForm) ||
    instance.sourceForm.length === 0 ||
    instance.baseSourceForm.length === 0
  ) {
    return "CMUDICT_PATH_B_NORMALIZATION_INPUT_INVALID";
  }
  if (
    /[^\x00-\x7f]/u.test(instance.sourceForm) ||
    /[^\x00-\x7f]/u.test(instance.baseSourceForm) ||
    /\s/u.test(instance.sourceForm) ||
    /\s/u.test(instance.baseSourceForm)
  ) {
    return "CMUDICT_PATH_B_NORMALIZATION_DOMAIN_MISMATCH";
  }
  const expectedVariant = deriveVariantIdentityV0_1(instance.sourceForm);
  if (
    instance.baseSourceForm !== expectedVariant.baseSourceForm ||
    instance.variantId !== expectedVariant.variantId
  ) {
    return "CMUDICT_PATH_B_NORMALIZATION_VARIANT_BASE_MISMATCH";
  }
  return null;
}

function physicalMembershipReasonV0_1(
  instance: CmuDictSharedSourcePronunciationInstanceV0_1,
  artifact: { text: string; lines: readonly string[] },
): CmuDictPathBNormalizationConformanceReasonCodeV0_1 | null {
  if (
    !validSha256V0_1(instance.sourceArtifactSha256) ||
    instance.sourceArtifactBytes !== CMUDICT_DATA_BYTES_V0_1 ||
    instance.sourceArtifactSha256 !== CMUDICT_DATA_SHA256_V0_1 ||
    instance.sourceRevision !== CMUDICT_SOURCE_REVISION_V0_1 ||
    instance.sourcePath !== "src/data/openInstrument/pronunciation/cmudict.dict" ||
    instance.notation !== CMUDICT_SOURCE_NOTATION_V0_1
  ) {
    return "CMUDICT_PATH_B_NORMALIZATION_ARTIFACT_MISMATCH";
  }
  if (
    !Number.isSafeInteger(instance.sourceLineNumber) ||
    instance.sourceLineNumber <= 0
  ) {
    return "CMUDICT_PATH_B_NORMALIZATION_PROVENANCE_INCOMPLETE";
  }
  const actualLine = artifact.lines[instance.sourceLineNumber - 1];
  if (actualLine === undefined || actualLine !== instance.rawSourceLine) {
    return "CMUDICT_PATH_B_NORMALIZATION_ARTIFACT_MISMATCH";
  }
  const parsed = parsePhysicalLineV0_1(actualLine);
  if (parsed === null) {
    return "CMUDICT_PATH_B_NORMALIZATION_DOMAIN_MISMATCH";
  }
  if (
    parsed.sourceForm !== instance.sourceForm ||
    parsed.baseSourceForm !== instance.baseSourceForm ||
    parsed.variantId !== instance.variantId ||
    parsed.rawPronunciation !== instance.rawPronunciation ||
    parsed.opaqueAnnotationText !== instance.opaqueAnnotationText ||
    parsed.orderedRawArpabetTokens.length !== instance.orderedRawArpabetTokens.length ||
    parsed.orderedRawArpabetTokens.some(
      (token, index) => token !== instance.orderedRawArpabetTokens[index],
    )
  ) {
    return "CMUDICT_PATH_B_NORMALIZATION_ARTIFACT_MISMATCH";
  }
  let expectedVariantOrder = 0;
  for (const line of artifact.lines.slice(0, instance.sourceLineNumber - 1)) {
    const previous = parsePhysicalLineV0_1(line);
    if (previous?.baseSourceForm === parsed.baseSourceForm) {
      expectedVariantOrder += 1;
    }
  }
  if (instance.variantOrder !== expectedVariantOrder) {
    return "CMUDICT_PATH_B_NORMALIZATION_VARIANT_BASE_MISMATCH";
  }
  return null;
}

function sharedReasonV0_1(
  reason: string,
): CmuDictPathBNormalizationConformanceReasonCodeV0_1 {
  if (
    reason.includes("SOURCE_ARTIFACT") ||
    reason.includes("RAW_SOURCE_LINE") ||
    reason.includes("PHYSICAL_RECORD")
  ) {
    return "CMUDICT_PATH_B_NORMALIZATION_ARTIFACT_MISMATCH";
  }
  if (reason.includes("VARIANT") || reason.includes("SOURCE_FORM")) {
    return "CMUDICT_PATH_B_NORMALIZATION_VARIANT_BASE_MISMATCH";
  }
  if (reason.includes("PROVENANCE") || reason.includes("FINGERPRINT") || reason.includes("CANONICALIZATION")) {
    return "CMUDICT_PATH_B_NORMALIZATION_PROVENANCE_INCOMPLETE";
  }
  if (reason.includes("AUTHORITY_TAG")) {
    return "CMUDICT_PATH_B_NORMALIZATION_AUTHORITY_NOT_APPROVED";
  }
  if (reason.includes("CONTRACT_IDENTITY")) {
    return "CMUDICT_PATH_B_NORMALIZATION_AUTHORITY_NOT_APPROVED";
  }
  return "CMUDICT_PATH_B_NORMALIZATION_INPUT_INVALID";
}

function candidateNormalizationCanonicalArrayV0_1(
  value: CmuDictPathBNormalizationCandidateEvidenceV0_1,
): readonly unknown[] {
  return [
    value.role,
    value.normalizerIdentity,
    value.sourceContractId,
    value.sourceContractVersion,
    value.normalizedOutput,
  ];
}

function productionNormalizationCanonicalArrayV0_1(
  value: CmuDictPathBNormalizationProductionEvidenceV0_1,
): readonly unknown[] {
  return [
    value.role,
    value.normalizerIdentity,
    value.producerSchemaVersion,
    value.producerProjectorId,
    value.normalizedOutput,
  ];
}

function roleEvidenceReasonV0_1(
  input: unknown,
  role: "CANDIDATE" | "PRODUCTION",
): CmuDictPathBNormalizationConformanceReasonCodeV0_1 | null {
  const expectedKeys = role === "CANDIDATE" ? CANDIDATE_KEYS_V0_1 : PRODUCTION_KEYS_V0_1;
  if (!isPlainRecordV0_1(input) || !hasOnlyDataPropertiesV0_1(input)) {
    return "CMUDICT_PATH_B_NORMALIZATION_INPUT_INVALID";
  }
  if (!exactOwnKeysV0_1(input, expectedKeys)) {
    return "CMUDICT_PATH_B_NORMALIZATION_INPUT_INVALID";
  }
  if (input.role !== role || typeof input.normalizedOutput !== "string") {
    return "CMUDICT_PATH_B_NORMALIZATION_INPUT_INVALID";
  }
  if (role === "CANDIDATE") {
    if (
      input.normalizerIdentity !== CMUDICT_PATH_B_CANDIDATE_NORMALIZATION_IDENTITY_V0_1 ||
      input.sourceContractId !== ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_ID_V0_1 ||
      input.sourceContractVersion !== ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_VERSION_V0_1
    ) {
      return "CMUDICT_PATH_B_NORMALIZATION_ROLE_IDENTITY_MISSING";
    }
  } else if (
    input.normalizerIdentity !== CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_NORMALIZATION_IDENTITY_V0_1 ||
    input.producerSchemaVersion !== CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_VARIANT_SCHEMA_V0_1 ||
    input.producerProjectorId !== CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PROJECTOR_ID_V0_1
  ) {
    return "CMUDICT_PATH_B_NORMALIZATION_ROLE_IDENTITY_MISSING";
  }
  return null;
}

function canonicalInputArrayV0_1(
  input: CmuDictPathBNormalizationConformanceInputV0_1,
): readonly unknown[] {
  return [
    "CMUDICT_PATH_B_NORMALIZATION_CONFORMANCE_INPUT_V0_1",
    serializeCmuDictSharedSourcePronunciationInstanceV0_1(input.sharedSourceInstance),
    candidateNormalizationCanonicalArrayV0_1(input.candidateNormalization),
    productionNormalizationCanonicalArrayV0_1(input.productionNormalization),
  ];
}

function canonicalOutputArrayV0_1(
  result: CmuDictPathBNormalizationConformanceEvidenceV0_1,
): readonly unknown[] {
  return [
    "CMUDICT_PATH_B_NORMALIZATION_CONFORMANCE_OUTPUT_V0_1",
    result.status,
    result.evidenceOnly,
    result.proposedContractId,
    result.proposedContractVersion,
    candidateNormalizationCanonicalArrayV0_1(result.candidateNormalization),
    productionNormalizationCanonicalArrayV0_1(result.productionNormalization),
    serializeCmuDictSharedSourcePronunciationInstanceV0_1(result.sourceEvidence),
    result.normalization,
    result.authorityBoundary,
    result.deterministicReproducibility.algorithm,
    result.deterministicReproducibility.canonicalization,
    result.deterministicReproducibility.inputFingerprint,
  ];
}

export function serializeCmuDictPathBNormalizationConformanceEvidenceV0_1(
  result: CmuDictPathBNormalizationConformanceEvidenceV0_1,
): string {
  return canonicalJsonV0_1(canonicalOutputArrayV0_1(result));
}

export function fingerprintCmuDictPathBNormalizationConformanceEvidenceV0_1(
  result: CmuDictPathBNormalizationConformanceEvidenceV0_1,
): string {
  return result.deterministicReproducibility.outputFingerprint;
}

function makeEvidenceV0_1(
  input: CmuDictPathBNormalizationConformanceInputV0_1,
): CmuDictPathBNormalizationConformanceEvidenceV0_1 {
  const inputFingerprint = sha256V0_1(
    canonicalJsonV0_1(canonicalInputArrayV0_1(input)),
  );
  const core = {
    status: CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_EVIDENCE_STATUS_V0_1,
    reasonCode: null,
    evidenceOnly: true as const,
    proposedContractId: CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_CONTRACT_ID_V0_1,
    proposedContractVersion:
      CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_CONTRACT_VERSION_V0_1,
    candidateNormalization: input.candidateNormalization,
    productionNormalization: input.productionNormalization,
    sourceEvidence: input.sharedSourceInstance,
    normalization: {
      domain: "VERIFIED_FROZEN_CMUDICT_BASE_SOURCE_FORM_ONLY" as const,
      sourceForm: input.sharedSourceInstance.sourceForm,
      baseSourceForm: input.sharedSourceInstance.baseSourceForm,
      variantId: input.sharedSourceInstance.variantId,
      variantOrder: input.sharedSourceInstance.variantOrder,
      physicalRecordId: input.sharedSourceInstance.physicalRecordId,
      sourceLineNumber: input.sharedSourceInstance.sourceLineNumber,
      candidateOutput: input.candidateNormalization.normalizedOutput,
      productionOutput: input.productionNormalization.normalizedOutput,
      exactOutputEquality: true as const,
    },
    authorityBoundary: "EVIDENCE_ONLY_NO_CANONICAL_GATE2_AUTHORITY" as const,
    deterministicReproducibility: {
      algorithm: "SHA-256" as const,
      canonicalization: CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_CANONICALIZATION_V0_1,
      inputFingerprint,
      outputFingerprint: "",
    },
  } satisfies Omit<CmuDictPathBNormalizationConformanceEvidenceV0_1, "deterministicReproducibility"> & {
    deterministicReproducibility: CmuDictPathBNormalizationConformanceEvidenceV0_1["deterministicReproducibility"];
  };
  const outputFingerprint = sha256V0_1(
    canonicalJsonV0_1(canonicalOutputArrayV0_1(core)),
  );
  return deepFreezeV0_1({
    ...core,
    deterministicReproducibility: {
      ...core.deterministicReproducibility,
      outputFingerprint,
    },
  });
}

export function validateCmuDictPathBDownstreamNormalizationConformanceV0_1(
  input: unknown,
): CmuDictPathBNormalizationConformanceResultV0_1 {
  try {
    if (!isPlainRecordV0_1(input) || !hasOnlyDataPropertiesV0_1(input)) {
      return nullResultV0_1("CMUDICT_PATH_B_NORMALIZATION_INPUT_INVALID");
    }
    if (!exactOwnKeysV0_1(input, INPUT_KEYS_V0_1)) {
      return nullResultV0_1("CMUDICT_PATH_B_NORMALIZATION_INPUT_INVALID");
    }
    const candidateReason = roleEvidenceReasonV0_1(
      input.candidateNormalization,
      "CANDIDATE",
    );
    if (candidateReason !== null) return nullResultV0_1(candidateReason);
    const productionReason = roleEvidenceReasonV0_1(
      input.productionNormalization,
      "PRODUCTION",
    );
    if (productionReason !== null) return nullResultV0_1(productionReason);
    const candidateNormalization =
      input.candidateNormalization as CmuDictPathBNormalizationCandidateEvidenceV0_1;
    const productionNormalization =
      input.productionNormalization as CmuDictPathBNormalizationProductionEvidenceV0_1;
    if (
      !isPlainRecordV0_1(input.sharedSourceInstance) ||
      !hasOnlyDataPropertiesV0_1(input.sharedSourceInstance)
    ) {
      return nullResultV0_1("CMUDICT_PATH_B_NORMALIZATION_INPUT_INVALID");
    }

    const shared = input.sharedSourceInstance as CmuDictSharedSourcePronunciationInstanceV0_1;
    const surfaceReason = domainSurfaceReasonV0_1(shared);
    if (surfaceReason !== null) return nullResultV0_1(surfaceReason);
    const artifact = readFrozenArtifactV0_1();
    if (typeof artifact === "string") return nullResultV0_1(artifact);
    const membershipReason = physicalMembershipReasonV0_1(shared, artifact);
    if (membershipReason !== null) return nullResultV0_1(membershipReason);
    const sharedReason = validateCmuDictSharedSourcePronunciationInstanceV0_1(shared);
    if (sharedReason !== "CMUDICT_PATH_B_SHARED_EVIDENCE_AUTHORIZED") {
      return nullResultV0_1(sharedReasonV0_1(sharedReason));
    }
    if (
      shared.alignmentAuthorityTag !== CMUDICT_SHARED_SOURCE_PRONUNCIATION_ALIGNMENT_TAG_V0_1 ||
      shared.evidenceExposureAuthorityTag !== CMUDICT_SHARED_SOURCE_PRONUNCIATION_EVIDENCE_TAG_V0_1
    ) {
      return nullResultV0_1("CMUDICT_PATH_B_NORMALIZATION_AUTHORITY_NOT_APPROVED");
    }

    const candidateOutput = normalizeEnglishLexicalJoinKeyV0_1(
      shared.baseSourceForm,
    );
    if (candidateNormalization.normalizedOutput !== candidateOutput) {
      return nullResultV0_1(
        "CMUDICT_PATH_B_NORMALIZATION_CANDIDATE_OUTPUT_MISMATCH",
      );
    }
    const productionOutput = normalizeCmuDictLexicalWordV0_1(
      shared.baseSourceForm,
    );
    if (productionNormalization.normalizedOutput !== productionOutput) {
      return nullResultV0_1(
        "CMUDICT_PATH_B_NORMALIZATION_PRODUCTION_OUTPUT_MISMATCH",
      );
    }
    if (candidateOutput !== productionOutput) {
      return nullResultV0_1(
        "CMUDICT_PATH_B_NORMALIZATION_CANDIDATE_OUTPUT_MISMATCH",
      );
    }
    return makeEvidenceV0_1({
      sharedSourceInstance: shared,
      candidateNormalization,
      productionNormalization,
    });
  } catch {
    return nullResultV0_1("CMUDICT_PATH_B_NORMALIZATION_INPUT_INVALID");
  }
}
