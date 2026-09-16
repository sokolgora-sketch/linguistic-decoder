import {
  DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_AUTHORITY_V0_1,
  getDalipajExpandedEmbryomorphemeSourceRecordV0_1,
  validateDalipajExpandedEmbryomorphemeSourceCorpusV0_1,
} from "./dalipajEmbryomorphemeExpandedSourceCorpus.v0_1";
import {
  extractSevenVowelsFromString,
  type SevenVowel,
} from "@/shared/math7.core";
import {
  isSevenVoiceKey,
  type SevenVoiceKey,
} from "@/shared/sevenVoiceOrderedViews.v0.1";

export const SOURCE_ATTESTED_ATOMICITY_RESEARCH_SCHEMA_V0_1 =
  "open-instrument.source-attested-atomicity-research.v0_1" as const;

export const SOURCE_ATTESTED_ATOMICITY_RELATION_V0_1 =
  "SOURCE_ATTESTED_ATOMICITY" as const;

export const SOURCE_ATTESTED_ATOMICITY_SEMANTIC_STATUS_V0_1 =
  "SEALED_NOT_CONSUMED" as const;

export type SourceAttestedAtomicityResearchSourceRefV0_1 = Readonly<{
  sourceRecordId: string;
  sourceLocator: string;
  sourceClass: "PRIMARY_AUTHOR_SOURCE";
  sourceAuthority: "SOURCE_FROZEN_EXTERNAL_RESEARCH_INPUT";
  confidence: "MEDIUM" | "LOW_MEDIUM";
}>;

export type SourceAttestedAtomicityResearchInputV0_1 = Readonly<{
  form: string;
  sourceAtomicityStatus: "PRIMARY_ATOMIC_VERIFIED";
  sourceRef: SourceAttestedAtomicityResearchSourceRefV0_1;
}>;

export type SourceAttestedAtomicityResearchRepresentationV0_1 = Readonly<{
  schemaVersion: typeof SOURCE_ATTESTED_ATOMICITY_RESEARCH_SCHEMA_V0_1;
  relationType: typeof SOURCE_ATTESTED_ATOMICITY_RELATION_V0_1;
  sourceForm: string;
  normalizedForm: string;
  sourceAtomicityStatus: "PRIMARY_ATOMIC_VERIFIED";
  sourceAuthority: "SOURCE_FROZEN_EXTERNAL_RESEARCH_INPUT";
  sourceRefs: readonly SourceAttestedAtomicityResearchSourceRefV0_1[];
  canonicalVoicePath: readonly SevenVoiceKey[];
  canonicalVoiceProjectionStatus:
    | "FORM_DERIVED"
    | "NO_CANONICAL_VOICE_PATH";
  semanticInputStatus: typeof SOURCE_ATTESTED_ATOMICITY_SEMANTIC_STATUS_V0_1;
  runtimeAuthority: "NO";
  ordinaryChatIntegration: "NO";
  productionEvidencePromotion: "NO";
  canonicalPromotion: "NO";
  reviewedFunctionalTruth: "NO";
  historicalClaimAdoption: "NO";
}>;

export type SourceAttestedAtomicityResearchReasonCodeV0_1 =
  | "INPUT_NOT_RECORD"
  | "FORM_REQUIRED"
  | "FORM_NOT_EXACT"
  | "FORM_UNSUPPORTED"
  | "SOURCE_ATOMICITY_STATUS_INVALID"
  | "SOURCE_REF_REQUIRED"
  | "SOURCE_REF_INVALID"
  | "SOURCE_RECORD_ID_INVALID"
  | "SOURCE_LOCATOR_INVALID"
  | "SOURCE_CLASS_INVALID"
  | "SOURCE_AUTHORITY_INVALID"
  | "SOURCE_CONFIDENCE_INVALID"
  | "FORBIDDEN_SEMANTIC_FIELD_PRESENT"
  | "UNEXPECTED_FIELD_PRESENT"
  | "SOURCE_RECORD_NOT_FOUND"
  | "SOURCE_CORPUS_INVALID"
  | "REPRESENTATION_INVALID";

export type SourceAttestedAtomicityResearchResultV0_1 = Readonly<
  | {
      ok: true;
      representation: SourceAttestedAtomicityResearchRepresentationV0_1;
    }
  | {
      ok: false;
      reasonCodes: readonly SourceAttestedAtomicityResearchReasonCodeV0_1[];
    }
>;

const INPUT_KEYS_V0_1 = [
  "form",
  "sourceAtomicityStatus",
  "sourceRef",
] as const;

const SOURCE_REF_KEYS_V0_1 = [
  "sourceRecordId",
  "sourceLocator",
  "sourceClass",
  "sourceAuthority",
  "confidence",
] as const;

const REPRESENTATION_KEYS_V0_1 = [
  "schemaVersion",
  "relationType",
  "sourceForm",
  "normalizedForm",
  "sourceAtomicityStatus",
  "sourceAuthority",
  "sourceRefs",
  "canonicalVoicePath",
  "canonicalVoiceProjectionStatus",
  "semanticInputStatus",
  "runtimeAuthority",
  "ordinaryChatIntegration",
  "productionEvidencePromotion",
  "canonicalPromotion",
  "reviewedFunctionalTruth",
  "historicalClaimAdoption",
] as const;

const FORBIDDEN_SEMANTIC_FIELDS_V0_1 = new Set([
  "sourceGloss",
  "normalizedGloss",
  "gloss",
  "meaning",
  "functionalClaim",
  "functionalBridge",
  "semanticBridge",
  "targetSense",
  "targetSenseId",
  "targetSenseLabel",
  "semanticAlignment",
  "historicalMeaning",
  "etymologicalClaim",
  "expectedVoice",
  "expectedPath",
  "expectedEmbryo",
  "expectedFunctionalComponent",
  "expectedCorrespondence",
  "agreement",
  "providerOutput",
  "evidenceRefs",
]);

function isRecordV0_1(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasForbiddenSemanticFieldV0_1(
  value: unknown,
  seen = new WeakSet<object>(),
): boolean {
  if (typeof value !== "object" || value === null) return false;
  if (seen.has(value)) return false;
  seen.add(value);

  if (Array.isArray(value)) {
    return value.some((child) =>
      hasForbiddenSemanticFieldV0_1(child, seen),
    );
  }

  return Object.entries(value).some(
    ([key, child]) =>
      FORBIDDEN_SEMANTIC_FIELDS_V0_1.has(key) ||
      hasForbiddenSemanticFieldV0_1(child, seen),
  );
}

function hasExactKeysV0_1(
  value: Record<string, unknown>,
  expectedKeys: readonly string[],
): boolean {
  return JSON.stringify(Object.keys(value).sort()) ===
    JSON.stringify([...expectedKeys].sort());
}

function normalizedFormV0_1(value: string): string {
  return value.normalize("NFC").toLocaleUpperCase("en-US");
}

function validExactFormV0_1(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value === value.normalize("NFC") &&
    value === normalizedFormV0_1(value) &&
    /^[A-ZË]+$/u.test(value)
  );
}

function sortedUniqueReasonsV0_1(
  reasons: readonly SourceAttestedAtomicityResearchReasonCodeV0_1[],
): SourceAttestedAtomicityResearchReasonCodeV0_1[] {
  return [...new Set(reasons)].sort();
}

function sourceRefReasonsV0_1(
  value: unknown,
): SourceAttestedAtomicityResearchReasonCodeV0_1[] {
  if (!isRecordV0_1(value)) return ["SOURCE_REF_REQUIRED"];

  const reasons: SourceAttestedAtomicityResearchReasonCodeV0_1[] = [];
  if (hasForbiddenSemanticFieldV0_1(value)) {
    reasons.push("FORBIDDEN_SEMANTIC_FIELD_PRESENT");
  }
  if (!hasExactKeysV0_1(value, SOURCE_REF_KEYS_V0_1)) {
    reasons.push("UNEXPECTED_FIELD_PRESENT");
  }
  if (
    typeof value.sourceRecordId !== "string" ||
    value.sourceRecordId.length === 0
  ) {
    reasons.push("SOURCE_RECORD_ID_INVALID");
  }
  if (
    typeof value.sourceLocator !== "string" ||
    value.sourceLocator.length === 0
  ) {
    reasons.push("SOURCE_LOCATOR_INVALID");
  }
  if (value.sourceClass !== "PRIMARY_AUTHOR_SOURCE") {
    reasons.push("SOURCE_CLASS_INVALID");
  }
  if (value.sourceAuthority !== "SOURCE_FROZEN_EXTERNAL_RESEARCH_INPUT") {
    reasons.push("SOURCE_AUTHORITY_INVALID");
  }
  if (value.confidence !== "MEDIUM" && value.confidence !== "LOW_MEDIUM") {
    reasons.push("SOURCE_CONFIDENCE_INVALID");
  }
  return reasons;
}

function inputReasonsV0_1(
  value: unknown,
): SourceAttestedAtomicityResearchReasonCodeV0_1[] {
  if (!isRecordV0_1(value)) return ["INPUT_NOT_RECORD"];

  const reasons: SourceAttestedAtomicityResearchReasonCodeV0_1[] = [];
  if (hasForbiddenSemanticFieldV0_1(value)) {
    reasons.push("FORBIDDEN_SEMANTIC_FIELD_PRESENT");
  }
  if (!hasExactKeysV0_1(value, INPUT_KEYS_V0_1)) {
    reasons.push("UNEXPECTED_FIELD_PRESENT");
  }
  if (typeof value.form !== "string" || value.form.length === 0) {
    reasons.push("FORM_REQUIRED");
  } else if (value.form !== normalizedFormV0_1(value.form)) {
    reasons.push("FORM_NOT_EXACT");
  } else if (!validExactFormV0_1(value.form)) {
    reasons.push("FORM_UNSUPPORTED");
  }
  if (value.sourceAtomicityStatus !== "PRIMARY_ATOMIC_VERIFIED") {
    reasons.push("SOURCE_ATOMICITY_STATUS_INVALID");
  }
  reasons.push(...sourceRefReasonsV0_1(value.sourceRef));
  return sortedUniqueReasonsV0_1(reasons);
}

function deepFreezeV0_1<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null || seen.has(value)) {
    return value;
  }

  seen.add(value);
  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreezeV0_1(child, seen);
  }
  return Object.freeze(value);
}

function sourceRefFromInputV0_1(
  value: Record<string, unknown>,
): SourceAttestedAtomicityResearchSourceRefV0_1 {
  return {
    sourceRecordId: value.sourceRecordId as string,
    sourceLocator: value.sourceLocator as string,
    sourceClass: value.sourceClass as "PRIMARY_AUTHOR_SOURCE",
    sourceAuthority:
      value.sourceAuthority as "SOURCE_FROZEN_EXTERNAL_RESEARCH_INPUT",
    confidence: value.confidence as "MEDIUM" | "LOW_MEDIUM",
  };
}

export function createSourceAttestedAtomicityResearchV0_1(
  input: unknown,
): SourceAttestedAtomicityResearchResultV0_1 {
  const reasons = inputReasonsV0_1(input);
  if (reasons.length > 0 || !isRecordV0_1(input)) {
    return { ok: false, reasonCodes: reasons };
  }

  const sourceRef = sourceRefFromInputV0_1(input.sourceRef as Record<string, unknown>);
  const sourceForm = input.form as string;
  const normalizedForm = normalizedFormV0_1(sourceForm);
  const canonicalVoicePath = extractSevenVowelsFromString(normalizedForm) as SevenVowel[];
  const representation = deepFreezeV0_1({
    schemaVersion: SOURCE_ATTESTED_ATOMICITY_RESEARCH_SCHEMA_V0_1,
    relationType: SOURCE_ATTESTED_ATOMICITY_RELATION_V0_1,
    sourceForm,
    normalizedForm,
    sourceAtomicityStatus: "PRIMARY_ATOMIC_VERIFIED" as const,
    sourceAuthority: "SOURCE_FROZEN_EXTERNAL_RESEARCH_INPUT" as const,
    sourceRefs: [sourceRef],
    canonicalVoicePath,
    canonicalVoiceProjectionStatus:
      canonicalVoicePath.length > 0
        ? ("FORM_DERIVED" as const)
        : ("NO_CANONICAL_VOICE_PATH" as const),
    semanticInputStatus: SOURCE_ATTESTED_ATOMICITY_SEMANTIC_STATUS_V0_1,
    runtimeAuthority: "NO" as const,
    ordinaryChatIntegration: "NO" as const,
    productionEvidencePromotion: "NO" as const,
    canonicalPromotion: "NO" as const,
    reviewedFunctionalTruth: "NO" as const,
    historicalClaimAdoption: "NO" as const,
  });

  return { ok: true, representation };
}

export function projectDalipajExpandedAtomicityResearchV0_1(
  form: unknown,
): SourceAttestedAtomicityResearchResultV0_1 {
  if (
    validateDalipajExpandedEmbryomorphemeSourceCorpusV0_1().ok !== true
  ) {
    return { ok: false, reasonCodes: ["SOURCE_CORPUS_INVALID"] };
  }

  const normalized =
    typeof form === "string" ? normalizedFormV0_1(form) : "";
  const sourceRecord =
    getDalipajExpandedEmbryomorphemeSourceRecordV0_1(normalized);
  if (!sourceRecord) {
    return { ok: false, reasonCodes: ["SOURCE_RECORD_NOT_FOUND"] };
  }

  return createSourceAttestedAtomicityResearchV0_1({
    form: sourceRecord.form,
    sourceAtomicityStatus: sourceRecord.atomicStatus,
    sourceRef: {
      sourceRecordId: sourceRecord.recordId,
      sourceLocator: sourceRecord.sourceLocator,
      sourceClass: sourceRecord.sourceClass,
      sourceAuthority:
        DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_AUTHORITY_V0_1,
      confidence: sourceRecord.confidence,
    },
  });
}

function representationReasonsV0_1(
  value: unknown,
): SourceAttestedAtomicityResearchReasonCodeV0_1[] {
  if (!isRecordV0_1(value)) return ["REPRESENTATION_INVALID"];

  const reasons: SourceAttestedAtomicityResearchReasonCodeV0_1[] = [];
  if (hasForbiddenSemanticFieldV0_1(value)) {
    reasons.push("FORBIDDEN_SEMANTIC_FIELD_PRESENT");
  }
  if (!hasExactKeysV0_1(value, REPRESENTATION_KEYS_V0_1)) {
    reasons.push("UNEXPECTED_FIELD_PRESENT");
  }
  const normalizedForm = value.normalizedForm;
  if (
    value.schemaVersion !== SOURCE_ATTESTED_ATOMICITY_RESEARCH_SCHEMA_V0_1 ||
    value.relationType !== SOURCE_ATTESTED_ATOMICITY_RELATION_V0_1 ||
    typeof value.sourceForm !== "string" ||
    typeof value.normalizedForm !== "string" ||
    value.sourceAtomicityStatus !== "PRIMARY_ATOMIC_VERIFIED" ||
    value.sourceAuthority !== "SOURCE_FROZEN_EXTERNAL_RESEARCH_INPUT" ||
    value.semanticInputStatus !== SOURCE_ATTESTED_ATOMICITY_SEMANTIC_STATUS_V0_1 ||
    value.runtimeAuthority !== "NO" ||
    value.ordinaryChatIntegration !== "NO" ||
    value.productionEvidencePromotion !== "NO" ||
    value.canonicalPromotion !== "NO" ||
    value.reviewedFunctionalTruth !== "NO" ||
    value.historicalClaimAdoption !== "NO"
  ) {
    reasons.push("REPRESENTATION_INVALID");
  }
  if (
    typeof value.sourceForm === "string" &&
    (typeof normalizedForm !== "string" ||
      !validExactFormV0_1(value.sourceForm) ||
      normalizedFormV0_1(value.sourceForm) !== normalizedForm)
  ) {
    reasons.push("REPRESENTATION_INVALID");
  }
  if (
    !Array.isArray(value.sourceRefs) ||
    value.sourceRefs.length !== 1
  ) {
    reasons.push("SOURCE_REF_INVALID");
  } else {
    reasons.push(...sourceRefReasonsV0_1(value.sourceRefs[0]));
  }
  const canonicalVoicePath = value.canonicalVoicePath;
  if (
    !Array.isArray(canonicalVoicePath) ||
    !canonicalVoicePath.every(
      (voice) => typeof voice === "string" && isSevenVoiceKey(voice),
    ) ||
    (Array.isArray(canonicalVoicePath) &&
      typeof normalizedForm === "string" &&
      JSON.stringify(canonicalVoicePath) !==
        JSON.stringify(extractSevenVowelsFromString(normalizedForm)))
  ) {
    reasons.push("REPRESENTATION_INVALID");
  }
  if (
    value.canonicalVoiceProjectionStatus !== "FORM_DERIVED" &&
    value.canonicalVoiceProjectionStatus !== "NO_CANONICAL_VOICE_PATH"
  ) {
    reasons.push("REPRESENTATION_INVALID");
  }
  if (
    Array.isArray(canonicalVoicePath) &&
    ((canonicalVoicePath.length > 0 &&
      value.canonicalVoiceProjectionStatus !== "FORM_DERIVED") ||
      (canonicalVoicePath.length === 0 &&
        value.canonicalVoiceProjectionStatus !==
          "NO_CANONICAL_VOICE_PATH"))
  ) {
    reasons.push("REPRESENTATION_INVALID");
  }
  return sortedUniqueReasonsV0_1(reasons);
}

export function validateSourceAttestedAtomicityResearchV0_1(
  value: unknown,
): SourceAttestedAtomicityResearchResultV0_1 {
  const reasons = representationReasonsV0_1(value);
  if (reasons.length > 0) {
    return { ok: false, reasonCodes: reasons };
  }

  return {
    ok: true,
    representation: value as SourceAttestedAtomicityResearchRepresentationV0_1,
  };
}
