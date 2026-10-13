import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { VowelVoice } from "@/shared/vowels/vowelVoices.v0.1";

import {
  CMUDICT_DATA_BYTES_V0_1,
  CMUDICT_DATA_SHA256_V0_1,
  CMUDICT_SOURCE_NOTATION_V0_1,
  CMUDICT_SOURCE_PROFILE_ID_V0_1,
  CMUDICT_SOURCE_REVISION_V0_1,
  normalizeCmuDictLexicalWordV0_1,
  type CmuDictPronunciationVariantV0_1,
} from "./cmudictArpabetPronunciation.v0_1";
import { normalizeEnglishLexicalJoinKeyV0_1 } from "./englishLexicalSenseSourceContract.v0_1";
import {
  PRONUNCIATION_TO_VOICE_PROFILE_V0_1,
  resolveCmuDictPronunciationToVoiceV0_1,
  type ArpabetNucleusV0_1,
  type NormalizedArpabetSegmentV0_1,
  type PronunciationToVoiceReasonCodeV0_1,
  type PronunciationVoiceVariantResultV0_1,
} from "./pronunciationToVoice.v0_1";

export const CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_SCHEMA_V0_1 =
  "open-instrument.cmudict-production-spoken-bridge-prerequisites.v0_1" as const;
export const CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_VARIANT_SCHEMA_V0_1 =
  "open-instrument.cmudict-production-spoken-bridge-prerequisites.variant.v0_1" as const;
export const CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PROJECTOR_ID_V0_1 =
  "open-instrument.cmudict-production-spoken-bridge-prerequisites.v0_1" as const;
export const CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_REPRESENTATION_KIND_V0_1 =
  "production_spoken" as const;
export const CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_SOURCE_PATH_V0_1 =
  "src/data/openInstrument/pronunciation/cmudict.dict" as const;
export const CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_NORMALIZATION_IDENTITY_V0_1 =
  "normalizeCmuDictLexicalWordV0_1:NFC->trim->lowercase" as const;
export const CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PARSER_IDENTITY_V0_1 =
  "loadCmuDictV0_1:existing-production-parser" as const;
export const CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_MAPPING_ID_V0_1 =
  `pronunciation-to-voice.${PRONUNCIATION_TO_VOICE_PROFILE_V0_1}.v0_1` as const;
export const CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_MAPPING_TABLE_V0_1 =
  "CMUDICT_ARPABET_VOICE_PROFILE_V0_1" as const;

const CMUDICT_DATASET_PATH_V0_1 = join(
  process.cwd(),
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_SOURCE_PATH_V0_1,
);

type ProductionStatusV0_1 = "defined" | "null";

export type CmuDictPhysicalSourceEvidenceV0_1 = Readonly<{
  physicalRecordId: string;
  sourceLineNumber: number;
  rawSourceLine: string;
  sourceForm: string;
  baseSourceForm: string;
  variantId: string;
  variantOrder: number;
  rawProductionPronunciation: string;
  rawPhysicalPronunciation: string;
  opaqueAnnotationText: string | null;
  terminalOpaqueAnnotationDetected: boolean;
}>;

export type CmuDictProductionSpokenBridgePrerequisiteVariantV0_1 = Readonly<{
  schemaVersion: typeof CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_VARIANT_SCHEMA_V0_1;
  physicalEvidence: CmuDictPhysicalSourceEvidenceV0_1;
  sourceProfileId: typeof CMUDICT_SOURCE_PROFILE_ID_V0_1;
  sourceRevision: typeof CMUDICT_SOURCE_REVISION_V0_1;
  sourceNotation: typeof CMUDICT_SOURCE_NOTATION_V0_1;
  sourceArtifactBytes: typeof CMUDICT_DATA_BYTES_V0_1;
  sourceArtifactSha256: typeof CMUDICT_DATA_SHA256_V0_1;
  rawProductionPronunciation: string;
  orderedProductionSourceUnits: readonly string[];
  normalizedSegments: readonly NormalizedArpabetSegmentV0_1[];
  nuclei: readonly ArpabetNucleusV0_1[];
  canonicalVoicePath: readonly VowelVoice[] | null;
  voiceMappingId: typeof CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_MAPPING_ID_V0_1;
  voiceMappingTable: typeof CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_MAPPING_TABLE_V0_1;
  normalizationIdentity: typeof CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_NORMALIZATION_IDENTITY_V0_1;
  parserIdentity: typeof CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PARSER_IDENTITY_V0_1;
  existingProductionStatus: ProductionStatusV0_1;
  existingProductionReasonCode: PronunciationToVoiceReasonCodeV0_1 | null;
  status: ProductionStatusV0_1;
  reasonCode: PronunciationToVoiceReasonCodeV0_1 | null;
  annotationContamination: Readonly<{
    detected: boolean;
    opaqueAnnotationText: string | null;
    eligibility:
      | "ELIGIBLE_FOR_FUTURE_BRIDGE_EVALUATION"
      | "INELIGIBLE_FOR_FUTURE_BRIDGE_EVALUATION";
  }>;
}>;

export type CmuDictProductionSpokenBridgePrerequisitesV0_1 = Readonly<{
  schemaVersion: typeof CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_SCHEMA_V0_1;
  projectorId: typeof CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PROJECTOR_ID_V0_1;
  representationKind: typeof CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_REPRESENTATION_KIND_V0_1;
  originalLexicalInput: string;
  productionNormalizedLexicalKey: string;
  sourcePath: typeof CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_SOURCE_PATH_V0_1;
  artifactBytes: number | null;
  artifactSha256: string | null;
  sourceRevision: typeof CMUDICT_SOURCE_REVISION_V0_1;
  sourceNotation: typeof CMUDICT_SOURCE_NOTATION_V0_1;
  sourceProfileId: typeof CMUDICT_SOURCE_PROFILE_ID_V0_1;
  artifactIdentityVerified: boolean;
  voiceMappingId: typeof CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_MAPPING_ID_V0_1;
  voiceMappingTable: typeof CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_MAPPING_TABLE_V0_1;
  normalizationIdentity: typeof CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_NORMALIZATION_IDENTITY_V0_1;
  parserIdentity: typeof CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PARSER_IDENTITY_V0_1;
  physicalEvidenceIndex: Readonly<{
    role: "READ_ONLY_PHYSICAL_SOURCE_PROVENANCE";
    totalPhysicalSourceRecords: number;
    totalDistinctSourceForms: number;
    annotatedRecordCount: number;
  }>;
  status: ProductionStatusV0_1;
  reasonCode: PronunciationToVoiceReasonCodeV0_1 | null;
  variants: readonly CmuDictProductionSpokenBridgePrerequisiteVariantV0_1[];
}>;

export type CmuDictNormalizationDomainAuditV0_1 = Readonly<{
  totalPhysicalSourceRecords: number;
  totalDistinctSourceForms: number;
  normalizationEqualRecordCount: number;
  normalizationMismatchRecordCount: number;
  normalizationMismatchDistinctFormCount: number;
  normalizationMismatchForms: readonly string[];
  sharedNormalizationArtifactDomainVerified: boolean;
}>;

type PhysicalSourceIndexV0_1 = Readonly<{
  recordsByProductionKey: ReadonlyMap<string, readonly CmuDictPhysicalSourceEvidenceV0_1[]>;
  allRecords: readonly CmuDictPhysicalSourceEvidenceV0_1[];
  totalDistinctSourceForms: number;
  annotatedRecordCount: number;
}>;

type ArtifactReadV0_1 = Readonly<{
  text: string | null;
  bytes: number | null;
  sha256: string | null;
  verified: boolean;
}>;

let cachedArtifactIndexV0_1: {
  sha256: typeof CMUDICT_DATA_SHA256_V0_1;
  index: PhysicalSourceIndexV0_1;
} | null = null;

function deepCloneAndFreezeV0_1<T>(
  value: T,
  seen = new WeakMap<object, unknown>(),
): T {
  if (value === null || typeof value !== "object") return value;
  const existing = seen.get(value);
  if (existing !== undefined) return existing as T;

  if (Array.isArray(value)) {
    const copy: unknown[] = [];
    seen.set(value, copy);
    for (const child of value) copy.push(deepCloneAndFreezeV0_1(child, seen));
    Object.freeze(copy);
    return copy as T;
  }

  const copy: Record<string, unknown> = {};
  seen.set(value, copy);
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    copy[key] = deepCloneAndFreezeV0_1(child, seen);
  }
  Object.freeze(copy);
  return copy as T;
}

function sanitizeOwnDataForValidationV0_1(
  value: unknown,
  seen = new WeakSet<object>(),
): unknown {
  if (value === null) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (typeof value !== "object") {
    throw new Error("validation value contains unsupported data");
  }
  if (seen.has(value)) throw new Error("validation value contains a cycle");
  seen.add(value);

  if (Array.isArray(value)) {
    const ownKeys = Object.getOwnPropertyNames(value);
    if (
      ownKeys.some(
        (key) => key !== "length" && !/^(?:0|[1-9]\d*)$/u.test(key),
      ) ||
      Object.getOwnPropertySymbols(value).length > 0
    ) {
      throw new Error("validation array contains unsupported properties");
    }
    const result = Array.from({ length: value.length }, (_, index) => {
      const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
      if (descriptor === undefined || !("value" in descriptor)) {
        throw new Error("validation array contains a hole or accessor");
      }
      return sanitizeOwnDataForValidationV0_1(descriptor.value, seen);
    });
    seen.delete(value);
    return result;
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new Error("validation object has an unsupported prototype");
  }
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(value).sort()) {
    if (key === "toJSON") {
      throw new Error("validation object contains serialization behavior");
    }
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor === undefined || !("value" in descriptor)) {
      throw new Error("validation object contains an accessor");
    }
    result[key] = sanitizeOwnDataForValidationV0_1(descriptor.value, seen);
  }
  if (Object.getOwnPropertySymbols(value).length > 0) {
    throw new Error("validation object contains symbol properties");
  }
  seen.delete(value);
  return result;
}

function readFrozenArtifactV0_1(): ArtifactReadV0_1 {
  let text: string;
  try {
    text = readFileSync(CMUDICT_DATASET_PATH_V0_1, "utf8");
  } catch {
    return { text: null, bytes: null, sha256: null, verified: false };
  }

  const bytes = Buffer.byteLength(text, "utf8");
  const sha256 = createHash("sha256")
    .update(Buffer.from(text, "utf8"))
    .digest("hex");
  return {
    text,
    bytes,
    sha256,
    verified:
      bytes === CMUDICT_DATA_BYTES_V0_1 &&
      sha256 === CMUDICT_DATA_SHA256_V0_1,
  };
}

function splitVariantSuffixV0_1(sourceForm: string): {
  baseSourceForm: string;
  variantId: string;
} {
  const match = /^(.*)\((\d+)\)$/u.exec(sourceForm);
  if (!match) return { baseSourceForm: sourceForm, variantId: "1" };
  return { baseSourceForm: match[1], variantId: match[2] };
}

function buildPhysicalSourceIndexV0_1(
  artifactText: string,
): PhysicalSourceIndexV0_1 {
  const recordsByProductionKey = new Map<
    string,
    CmuDictPhysicalSourceEvidenceV0_1[]
  >();
  const variantOrderByProductionKey = new Map<string, number>();
  const allRecords: CmuDictPhysicalSourceEvidenceV0_1[] = [];

  for (const [index, rawSourceLine] of artifactText.split(/\r?\n/u).entries()) {
    const sourceLineNumber = index + 1;
    const trimmed = rawSourceLine.trim();
    if (trimmed.length === 0 || trimmed.startsWith(";;;")) continue;

    const separator = trimmed.indexOf(" ");
    if (separator <= 0) continue;

    const sourceForm = trimmed.slice(0, separator);
    const rawProductionPronunciation = trimmed.slice(separator + 1).trim();
    if (rawProductionPronunciation.length === 0) continue;

    const { baseSourceForm, variantId } = splitVariantSuffixV0_1(sourceForm);
    const productionKey = normalizeCmuDictLexicalWordV0_1(baseSourceForm);
    const variantOrder = variantOrderByProductionKey.get(productionKey) ?? 0;
    variantOrderByProductionKey.set(productionKey, variantOrder + 1);

    const annotationDelimiter = rawProductionPronunciation.indexOf(" # ");
    const opaqueAnnotationText =
      annotationDelimiter < 0
        ? null
        : rawProductionPronunciation.slice(annotationDelimiter + " # ".length);
    const record = {
      physicalRecordId: `cmudict:${sourceLineNumber}:${sourceForm}`,
      sourceLineNumber,
      rawSourceLine,
      sourceForm,
      baseSourceForm,
      variantId,
      variantOrder,
      rawProductionPronunciation,
      rawPhysicalPronunciation:
        annotationDelimiter < 0
          ? rawProductionPronunciation
          : rawProductionPronunciation.slice(0, annotationDelimiter),
      opaqueAnnotationText:
        opaqueAnnotationText === "" ? null : opaqueAnnotationText,
      terminalOpaqueAnnotationDetected:
        annotationDelimiter >= 0 && opaqueAnnotationText !== "",
    } satisfies CmuDictPhysicalSourceEvidenceV0_1;

    allRecords.push(record);
    const records = recordsByProductionKey.get(productionKey) ?? [];
    records.push(record);
    recordsByProductionKey.set(productionKey, records);
  }

  const frozenRecordsByProductionKey = new Map<
    string,
    readonly CmuDictPhysicalSourceEvidenceV0_1[]
  >();
  for (const [key, records] of recordsByProductionKey) {
    frozenRecordsByProductionKey.set(key, Object.freeze(records));
  }

  const frozenRecords = Object.freeze(allRecords);
  return {
    recordsByProductionKey: frozenRecordsByProductionKey,
    allRecords: frozenRecords,
    totalDistinctSourceForms: new Set(allRecords.map((record) => record.sourceForm))
      .size,
    annotatedRecordCount: allRecords.filter(
      (record) => record.terminalOpaqueAnnotationDetected,
    ).length,
  };
}

function physicalSourceIndexV0_1(
  artifact: ArtifactReadV0_1,
): PhysicalSourceIndexV0_1 | null {
  if (!artifact.verified || artifact.text === null || artifact.sha256 === null) {
    return null;
  }
  if (cachedArtifactIndexV0_1?.sha256 === artifact.sha256) {
    return cachedArtifactIndexV0_1.index;
  }

  const index = buildPhysicalSourceIndexV0_1(artifact.text);
  cachedArtifactIndexV0_1 = {
    sha256: CMUDICT_DATA_SHA256_V0_1,
    index,
  };
  return index;
}

function artifactIndexSummaryV0_1(
  index: PhysicalSourceIndexV0_1 | null,
): CmuDictProductionSpokenBridgePrerequisitesV0_1["physicalEvidenceIndex"] {
  return {
    role: "READ_ONLY_PHYSICAL_SOURCE_PROVENANCE",
    totalPhysicalSourceRecords: index?.allRecords.length ?? 0,
    totalDistinctSourceForms: index?.totalDistinctSourceForms ?? 0,
    annotatedRecordCount: index?.annotatedRecordCount ?? 0,
  };
}

function baseEnvelopeV0_1(
  originalLexicalInput: string,
  artifact: ArtifactReadV0_1,
  index: PhysicalSourceIndexV0_1 | null,
): Omit<CmuDictProductionSpokenBridgePrerequisitesV0_1, "status" | "reasonCode" | "variants"> {
  return {
    schemaVersion: CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_SCHEMA_V0_1,
    projectorId: CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PROJECTOR_ID_V0_1,
    representationKind:
      CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_REPRESENTATION_KIND_V0_1,
    originalLexicalInput,
    productionNormalizedLexicalKey:
      normalizeCmuDictLexicalWordV0_1(originalLexicalInput),
    sourcePath: CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_SOURCE_PATH_V0_1,
    artifactBytes: artifact.bytes,
    artifactSha256: artifact.sha256,
    sourceRevision: CMUDICT_SOURCE_REVISION_V0_1,
    sourceNotation: CMUDICT_SOURCE_NOTATION_V0_1,
    sourceProfileId: CMUDICT_SOURCE_PROFILE_ID_V0_1,
    artifactIdentityVerified: artifact.verified,
    voiceMappingId: CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_MAPPING_ID_V0_1,
    voiceMappingTable:
      CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_MAPPING_TABLE_V0_1,
    normalizationIdentity:
      CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_NORMALIZATION_IDENTITY_V0_1,
    parserIdentity:
      CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PARSER_IDENTITY_V0_1,
    physicalEvidenceIndex: artifactIndexSummaryV0_1(index),
  };
}

function sourceFailureV0_1(
  originalLexicalInput: string,
  artifact: ArtifactReadV0_1,
  index: PhysicalSourceIndexV0_1 | null,
): CmuDictProductionSpokenBridgePrerequisitesV0_1 {
  return deepCloneAndFreezeV0_1({
    ...baseEnvelopeV0_1(originalLexicalInput, artifact, index),
    status: "null" as const,
    reasonCode: "PRONUNCIATION_SOURCE_UNSUPPORTED" as const,
    variants: [] as const,
  });
}

function samePhysicalEvidenceV0_1(
  physical: CmuDictPhysicalSourceEvidenceV0_1,
  production: CmuDictPronunciationVariantV0_1,
): boolean {
  return (
    physical.sourceForm === production.sourceForm &&
    physical.baseSourceForm === production.lexicalWord &&
    physical.variantId === production.variantId &&
    physical.variantOrder === production.variantOrder &&
    physical.rawProductionPronunciation === production.sourcePronunciation
  );
}

function variantEnvelopeV0_1(
  physical: CmuDictPhysicalSourceEvidenceV0_1,
  production: PronunciationVoiceVariantResultV0_1,
): CmuDictProductionSpokenBridgePrerequisiteVariantV0_1 {
  const annotationContamination = {
    detected: physical.terminalOpaqueAnnotationDetected,
    opaqueAnnotationText: physical.opaqueAnnotationText,
    eligibility: physical.terminalOpaqueAnnotationDetected
      ? "INELIGIBLE_FOR_FUTURE_BRIDGE_EVALUATION"
      : "ELIGIBLE_FOR_FUTURE_BRIDGE_EVALUATION",
  } as const;
  return {
    schemaVersion:
      CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_VARIANT_SCHEMA_V0_1,
    physicalEvidence: physical,
    sourceProfileId: CMUDICT_SOURCE_PROFILE_ID_V0_1,
    sourceRevision: CMUDICT_SOURCE_REVISION_V0_1,
    sourceNotation: CMUDICT_SOURCE_NOTATION_V0_1,
    sourceArtifactBytes: CMUDICT_DATA_BYTES_V0_1,
    sourceArtifactSha256: CMUDICT_DATA_SHA256_V0_1,
    rawProductionPronunciation: production.variant.sourcePronunciation,
    orderedProductionSourceUnits: production.variant.sourceUnits,
    normalizedSegments: production.normalizedSegments,
    nuclei: production.nuclei,
    canonicalVoicePath: production.canonicalVoicePath,
    voiceMappingId: CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_MAPPING_ID_V0_1,
    voiceMappingTable:
      CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_MAPPING_TABLE_V0_1,
    normalizationIdentity:
      CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_NORMALIZATION_IDENTITY_V0_1,
    parserIdentity:
      CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PARSER_IDENTITY_V0_1,
    existingProductionStatus: production.reasonCode === null ? "defined" : "null",
    existingProductionReasonCode: production.reasonCode,
    status: production.reasonCode === null ? "defined" : "null",
    reasonCode: production.reasonCode,
    annotationContamination,
  };
}

export function buildCmuDictProductionSpokenBridgePrerequisitesV0_1(
  originalLexicalInput: string,
): CmuDictProductionSpokenBridgePrerequisitesV0_1 {
  const lexicalInput = String(originalLexicalInput ?? "");
  const artifact = readFrozenArtifactV0_1();
  const index = physicalSourceIndexV0_1(artifact);
  if (!artifact.verified || index === null) {
    return sourceFailureV0_1(lexicalInput, artifact, index);
  }

  const production = resolveCmuDictPronunciationToVoiceV0_1(lexicalInput);
  const physicalRecords =
    index.recordsByProductionKey.get(
      normalizeCmuDictLexicalWordV0_1(lexicalInput),
    ) ?? [];
  if (
    physicalRecords.length !== production.variants.length ||
    physicalRecords.some(
      (physical, index) =>
        production.variants[index] === undefined ||
        !samePhysicalEvidenceV0_1(physical, production.variants[index].variant),
    )
  ) {
    return sourceFailureV0_1(lexicalInput, artifact, index);
  }

  return deepCloneAndFreezeV0_1({
    ...baseEnvelopeV0_1(lexicalInput, artifact, index),
    status: production.status,
    reasonCode: production.reasonCode,
    variants: production.variants.map((variant, index) =>
      variantEnvelopeV0_1(physicalRecords[index], variant),
    ),
  });
}

export function auditCmuDictNormalizationDomainV0_1(): CmuDictNormalizationDomainAuditV0_1 {
  const artifact = readFrozenArtifactV0_1();
  const index = physicalSourceIndexV0_1(artifact);
  if (!artifact.verified || index === null) {
    return deepCloneAndFreezeV0_1({
      totalPhysicalSourceRecords: 0,
      totalDistinctSourceForms: 0,
      normalizationEqualRecordCount: 0,
      normalizationMismatchRecordCount: 0,
      normalizationMismatchDistinctFormCount: 0,
      normalizationMismatchForms: [],
      sharedNormalizationArtifactDomainVerified: false,
    });
  }

  const mismatches: string[] = [];
  let equalCount = 0;
  for (const record of index.allRecords) {
    const candidateKey = normalizeEnglishLexicalJoinKeyV0_1(record.sourceForm);
    const productionKey = normalizeCmuDictLexicalWordV0_1(record.sourceForm);
    if (candidateKey === productionKey) {
      equalCount += 1;
    } else {
      mismatches.push(record.sourceForm);
    }
  }

  return deepCloneAndFreezeV0_1({
    totalPhysicalSourceRecords: index.allRecords.length,
    totalDistinctSourceForms: index.totalDistinctSourceForms,
    normalizationEqualRecordCount: equalCount,
    normalizationMismatchRecordCount: mismatches.length,
    normalizationMismatchDistinctFormCount: new Set(mismatches).size,
    normalizationMismatchForms: mismatches,
    sharedNormalizationArtifactDomainVerified: mismatches.length === 0,
  });
}

export function validateCmuDictProductionSpokenBridgePrerequisitesV0_1(
  value: unknown,
): value is CmuDictProductionSpokenBridgePrerequisitesV0_1 {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    (() => {
      const descriptor = Object.getOwnPropertyDescriptor(
        value,
        "originalLexicalInput",
      );
      return (
        descriptor === undefined ||
        !("value" in descriptor) ||
        typeof descriptor.value !== "string"
      );
    })()
  ) {
    return false;
  }

  const candidate = value as CmuDictProductionSpokenBridgePrerequisitesV0_1;
  const rebuilt = buildCmuDictProductionSpokenBridgePrerequisitesV0_1(
    candidate.originalLexicalInput,
  );
  try {
    return (
      JSON.stringify(sanitizeOwnDataForValidationV0_1(candidate)) ===
      JSON.stringify(sanitizeOwnDataForValidationV0_1(rebuilt))
    );
  } catch {
    return false;
  }
}
