import { classifyIpaSegmentsV0_1 } from "@/shared/ipa/ipaClassify.v0.1";
import type { VowelVoice } from "@/shared/vowels/vowelVoices.v0.1";

import {
  ALBANIAN_KAIKKI_LEXICAL_PRONUNCIATION_AUTHORITY_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_URL_V0_1,
  type AlbanianKaikkiExactLexicalSourceFactV0_1,
} from "./albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import type {
  AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1,
  AlbanianKaikkiSourceIpaSevenVoiceNucleusV0_1,
} from "./albanianKaikkiSourceIpaSevenVoiceProductInterpretation.v0_1";

export const ALBANIAN_SOURCE_ORDER_CONTEXT_SIGNATURE_SCHEMA_V0_1 =
  "open-instrument.albanian-source-order-context-signature.v0_1" as const;

export const ALBANIAN_SOURCE_ORDER_CONTEXT_SIGNATURE_ID_V0_1 =
  "ALBANIAN_SOURCE_ORDER_CONTEXT_SIGNATURE_V0_1" as const;

export const ALBANIAN_SOURCE_ORDER_CONTEXT_SIGNATURE_AUTHORITY_BOUNDARY_V0_1 =
  "RESEARCH_ONLY_STRUCTURAL_PROJECTION_NOT_FROZEN_LINGUISTIC_AUTHORITY" as const;

export type AlbanianSourceOrderContextSignatureReasonCodeV0_1 =
  | "INPUT_MALFORMED"
  | "SOURCE_AUTHORITY_UNBOUND_REQUIRED"
  | "SOURCE_IDENTITY_INVALID"
  | "SOURCE_RECORD_ANALYSIS_MISMATCH"
  | "SOURCE_IPA_MISSING"
  | "IPA_SYMBOL_UNSUPPORTED"
  | "OPTIONAL_MARKER_INVALID"
  | "NUCLEUS_STRUCTURE_UNRESOLVED"
  | "ANALYSIS_NULL";

export type AlbanianSourceOrderContextSegmentV0_1 = Readonly<{
  order: number;
  raw: string;
  baseSymbol: string;
  class: "vowel" | "consonant";
  sourceClass: "vowel" | "sonorant" | "obstruent";
  optional: boolean;
  nucleusIndex: number | null;
  voiceAnchors: readonly VowelVoice[];
}>;

export type AlbanianSourceOrderContextRegionV0_1 = Readonly<{
  leftNucleusIndex: number;
  rightNucleusIndex: number;
  consonants: readonly AlbanianSourceOrderContextSegmentV0_1[];
}>;

export type AlbanianSourceOrderContextSignatureInputV0_1 = Readonly<{
  fact: AlbanianKaikkiExactLexicalSourceFactV0_1;
  analysis: AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1;
}>;

export type AlbanianSourceOrderContextSignatureV0_1 = Readonly<{
  schemaVersion: typeof ALBANIAN_SOURCE_ORDER_CONTEXT_SIGNATURE_SCHEMA_V0_1;
  projectionId: typeof ALBANIAN_SOURCE_ORDER_CONTEXT_SIGNATURE_ID_V0_1;
  authorityBoundary: typeof ALBANIAN_SOURCE_ORDER_CONTEXT_SIGNATURE_AUTHORITY_BOUNDARY_V0_1;
  status: "SUPPORTED" | "NULL";
  sourcePronunciationAuthority:
    | typeof ALBANIAN_KAIKKI_LEXICAL_PRONUNCIATION_AUTHORITY_V0_1
    | null;
  source: Readonly<{
    sourceRecordId: string;
    entryLocator: string;
    physicalRecordOrdinal: number;
    form: string;
    soundIndex: number;
    variantIdentity: string;
    tags: readonly string[];
    sourceStatus: "observed_external_snapshot" | null;
    attestationTruth: "fact" | null;
    sourceSnapshot: Readonly<{
      sourceFamilyId: string;
      sourceUrl: string;
      sha256: string;
      bytes: number;
    }>;
  }>;
  rawIpa: string | null;
  nonVoiceFeatures: AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1["nonVoiceFeatures"];
  sourceSegments: readonly AlbanianSourceOrderContextSegmentV0_1[];
  voicePath: readonly VowelVoice[];
  optionalNucleusOrders: readonly number[];
  prefixConsonants: readonly AlbanianSourceOrderContextSegmentV0_1[] | null;
  interNucleusRegions: readonly AlbanianSourceOrderContextRegionV0_1[] | null;
  suffixConsonants: readonly AlbanianSourceOrderContextSegmentV0_1[] | null;
  structuralSignature: string | null;
  upstreamReasonCodes: readonly string[];
  reasonCodes: readonly AlbanianSourceOrderContextSignatureReasonCodeV0_1[];
  semanticOutput: "NOT_GENERATED";
}>;

type RecordV0_1 = Record<string, unknown>;

const CANONICAL_VOICES_V0_1 = new Set<VowelVoice>([
  "A",
  "E",
  "I",
  "O",
  "U",
  "Y",
  "Ë",
]);

function isRecordV0_1(value: unknown): value is RecordV0_1 {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyStringV0_1(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArrayV0_1(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function sortedReasonsV0_1(
  reasons: readonly AlbanianSourceOrderContextSignatureReasonCodeV0_1[],
): readonly AlbanianSourceOrderContextSignatureReasonCodeV0_1[] {
  return Object.freeze([...new Set(reasons)].sort());
}

function sourceIdentityValidV0_1(
  fact: RecordV0_1,
): boolean {
  const snapshot = fact.sourceSnapshot;
  return (
    fact.sourceStatus === "observed_external_snapshot" &&
    fact.attestationTruth === "fact" &&
    isNonEmptyStringV0_1(fact.sourceRecordId) &&
    isNonEmptyStringV0_1(fact.entryLocator) &&
    Number.isInteger(fact.physicalRecordOrdinal) &&
    isNonEmptyStringV0_1(fact.form) &&
    isRecordV0_1(snapshot) &&
    snapshot.sourceFamilyId === ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1 &&
    snapshot.sourceUrl === ALBANIAN_KAIKKI_LEXICAL_SOURCE_URL_V0_1 &&
    snapshot.sha256 === ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1 &&
    snapshot.bytes === ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1
  );
}

function analysisShapeValidV0_1(
  analysis: RecordV0_1,
): boolean {
  return (
    analysis.interpretationId ===
      "ALBANIAN_KAIKKI_SOURCE_IPA_SEVEN_VOICE_PRODUCT_INTERPRETATION_V0_1" &&
    analysis.authorityBoundary ===
      "CURRENT_KAIKKI_IPA_SOURCE_DERIVED_PRODUCT_INTERPRETATION_NOT_FROZEN_PRONUNCIATION_AUTHORITY" &&
    analysis.sourcePronunciationAuthority === ALBANIAN_KAIKKI_LEXICAL_PRONUNCIATION_AUTHORITY_V0_1 &&
    (analysis.status === "SUPPORTED" || analysis.status === "NULL") &&
    isNonEmptyStringV0_1(analysis.sourceRecordId) &&
    isNonEmptyStringV0_1(analysis.entryLocator) &&
    Number.isInteger(analysis.physicalRecordOrdinal) &&
    isNonEmptyStringV0_1(analysis.form) &&
    Number.isInteger(analysis.soundIndex) &&
    Array.isArray(analysis.tags) &&
    isStringArrayV0_1(analysis.tags) &&
    (analysis.rawIpa === null || typeof analysis.rawIpa === "string") &&
    isRecordV0_1(analysis.sourceSnapshot) &&
    Array.isArray(analysis.nuclei) &&
    analysis.nuclei.every((nucleus) =>
      isRecordV0_1(nucleus) &&
      Number.isInteger(nucleus.order) &&
      isNonEmptyStringV0_1(nucleus.raw) &&
      isNonEmptyStringV0_1(nucleus.baseSymbol) &&
      (nucleus.voice === null || CANONICAL_VOICES_V0_1.has(nucleus.voice as VowelVoice)) &&
      (nucleus.status === "SUPPORTED" || nucleus.status === "NULL") &&
      Array.isArray(nucleus.reasonCodes) &&
      isStringArrayV0_1(nucleus.reasonCodes)
    ) &&
    Array.isArray(analysis.voicePath) &&
    analysis.voicePath.every((voice) => CANONICAL_VOICES_V0_1.has(voice as VowelVoice)) &&
    Array.isArray(analysis.reasonCodes) &&
    isStringArrayV0_1(analysis.reasonCodes)
  );
}

function snapshotMatchesV0_1(
  left: RecordV0_1,
  right: RecordV0_1,
): boolean {
  return (
    left.sourceFamilyId === right.sourceFamilyId &&
    left.sourceUrl === right.sourceUrl &&
    left.sha256 === right.sha256 &&
    left.bytes === right.bytes
  );
}

function sourceSegmentsV0_1(
  body: string,
): Readonly<{
  segments: readonly Readonly<{
    raw: string;
    base: string;
    sourceClass: "vowel" | "sonorant" | "obstruent";
    optional: boolean;
  }>[];
  reasonCodes: readonly AlbanianSourceOrderContextSignatureReasonCodeV0_1[];
}> {
  const segments: Array<{
    raw: string;
    base: string;
    sourceClass: "vowel" | "sonorant" | "obstruent";
    optional: boolean;
  }> = [];
  const reasons: AlbanianSourceOrderContextSignatureReasonCodeV0_1[] = [];
  let optionalDepth = 0;

  for (const segment of classifyIpaSegmentsV0_1(body)) {
    if (segment.base === "(") {
      if (optionalDepth !== 0) reasons.push("OPTIONAL_MARKER_INVALID");
      optionalDepth += 1;
      continue;
    }
    if (segment.base === ")") {
      if (optionalDepth !== 1) reasons.push("OPTIONAL_MARKER_INVALID");
      optionalDepth = Math.max(0, optionalDepth - 1);
      continue;
    }

    if (segment.cls !== "vowel" && segment.cls !== "sonorant" && segment.cls !== "obstruent") {
      reasons.push("IPA_SYMBOL_UNSUPPORTED");
      continue;
    }

    segments.push({
      raw: segment.raw,
      base: segment.base,
      sourceClass: segment.cls,
      optional: optionalDepth === 1,
    });
  }

  if (optionalDepth !== 0) reasons.push("OPTIONAL_MARKER_INVALID");
  return Object.freeze({
    segments: Object.freeze(segments),
    reasonCodes: sortedReasonsV0_1(reasons),
  });
}

function sourceRecordV0_1(
  fact: RecordV0_1,
  analysis: RecordV0_1,
): Readonly<AlbanianSourceOrderContextSignatureV0_1["source"]> {
  const snapshot = fact.sourceSnapshot as RecordV0_1;
  return Object.freeze({
    sourceRecordId: fact.sourceRecordId as string,
    entryLocator: fact.entryLocator as string,
    physicalRecordOrdinal: fact.physicalRecordOrdinal as number,
    form: fact.form as string,
    soundIndex: analysis.soundIndex as number,
    variantIdentity: `${fact.sourceRecordId as string}:sound:${analysis.soundIndex as number}`,
    tags: Object.freeze([...(analysis.tags as readonly string[])]),
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    sourceSnapshot: Object.freeze({
      sourceFamilyId: snapshot.sourceFamilyId as string,
      sourceUrl: snapshot.sourceUrl as string,
      sha256: snapshot.sha256 as string,
      bytes: snapshot.bytes as number,
    }),
  });
}

function nullResultV0_1(
  fact: RecordV0_1 | null,
  analysis: RecordV0_1 | null,
  reasonCodes: readonly AlbanianSourceOrderContextSignatureReasonCodeV0_1[],
  sourceSegments: readonly AlbanianSourceOrderContextSegmentV0_1[] = [],
): AlbanianSourceOrderContextSignatureV0_1 {
  const safeFact = fact ?? {};
  const safeAnalysis = analysis ?? {};
  const snapshot = isRecordV0_1(safeFact.sourceSnapshot) ? safeFact.sourceSnapshot : {};
  return Object.freeze({
    schemaVersion: ALBANIAN_SOURCE_ORDER_CONTEXT_SIGNATURE_SCHEMA_V0_1,
    projectionId: ALBANIAN_SOURCE_ORDER_CONTEXT_SIGNATURE_ID_V0_1,
    authorityBoundary: ALBANIAN_SOURCE_ORDER_CONTEXT_SIGNATURE_AUTHORITY_BOUNDARY_V0_1,
    status: "NULL",
    sourcePronunciationAuthority:
      safeFact.pronunciationAuthority ===
      ALBANIAN_KAIKKI_LEXICAL_PRONUNCIATION_AUTHORITY_V0_1
        ? ALBANIAN_KAIKKI_LEXICAL_PRONUNCIATION_AUTHORITY_V0_1
        : null,
    source: Object.freeze({
      sourceRecordId: typeof safeFact.sourceRecordId === "string" ? safeFact.sourceRecordId : "",
      entryLocator: typeof safeFact.entryLocator === "string" ? safeFact.entryLocator : "",
      physicalRecordOrdinal: typeof safeFact.physicalRecordOrdinal === "number" ? safeFact.physicalRecordOrdinal : -1,
      form: typeof safeFact.form === "string" ? safeFact.form : "",
      soundIndex: typeof safeAnalysis.soundIndex === "number" ? safeAnalysis.soundIndex : -1,
      variantIdentity:
        typeof safeFact.sourceRecordId === "string" && typeof safeAnalysis.soundIndex === "number"
          ? `${safeFact.sourceRecordId}:sound:${safeAnalysis.soundIndex}`
          : "",
      tags: isStringArrayV0_1(safeAnalysis.tags) ? Object.freeze([...safeAnalysis.tags]) : Object.freeze([]),
      sourceStatus:
        safeFact.sourceStatus === "observed_external_snapshot"
          ? "observed_external_snapshot"
          : null,
      attestationTruth: safeFact.attestationTruth === "fact" ? "fact" : null,
      sourceSnapshot: Object.freeze({
        sourceFamilyId: typeof snapshot.sourceFamilyId === "string" ? snapshot.sourceFamilyId : "",
        sourceUrl: typeof snapshot.sourceUrl === "string" ? snapshot.sourceUrl : "",
        sha256: typeof snapshot.sha256 === "string" ? snapshot.sha256 : "",
        bytes: typeof snapshot.bytes === "number" ? snapshot.bytes : -1,
      }),
    }),
    rawIpa: typeof safeAnalysis.rawIpa === "string" ? safeAnalysis.rawIpa : null,
    nonVoiceFeatures: isRecordV0_1(safeAnalysis.nonVoiceFeatures)
      ? safeAnalysis.nonVoiceFeatures as AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1["nonVoiceFeatures"]
      : Object.freeze({ stressMarkers: [], lengthMarkers: [], nasalizationMarks: [] }),
    sourceSegments: Object.freeze([...sourceSegments]),
    voicePath: Object.freeze([]),
    optionalNucleusOrders: Object.freeze([]),
    prefixConsonants: null,
    interNucleusRegions: null,
    suffixConsonants: null,
    structuralSignature: null,
    upstreamReasonCodes: isStringArrayV0_1(safeAnalysis.reasonCodes)
      ? Object.freeze([...safeAnalysis.reasonCodes])
      : Object.freeze([]),
    reasonCodes: sortedReasonsV0_1(reasonCodes),
    semanticOutput: "NOT_GENERATED",
  });
}

export function projectAlbanianSourceOrderContextSignatureV0_1(
  input: unknown,
): AlbanianSourceOrderContextSignatureV0_1 {
  if (!isRecordV0_1(input) || !isRecordV0_1(input.fact) || !isRecordV0_1(input.analysis)) {
    return nullResultV0_1(null, null, ["INPUT_MALFORMED"]);
  }

  const fact = input.fact;
  const analysis = input.analysis;
  if (!sourceIdentityValidV0_1(fact)) {
    return nullResultV0_1(fact, analysis, ["SOURCE_IDENTITY_INVALID"]);
  }
  if (fact.pronunciationAuthority !== ALBANIAN_KAIKKI_LEXICAL_PRONUNCIATION_AUTHORITY_V0_1) {
    return nullResultV0_1(fact, analysis, ["SOURCE_AUTHORITY_UNBOUND_REQUIRED"]);
  }
  if (!analysisShapeValidV0_1(analysis)) {
    return nullResultV0_1(fact, analysis, ["INPUT_MALFORMED"]);
  }
  const typedFact = fact as AlbanianKaikkiExactLexicalSourceFactV0_1;
  const typedAnalysis = analysis as AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1;
  if (
    typedAnalysis.sourceRecordId !== typedFact.sourceRecordId ||
    typedAnalysis.entryLocator !== typedFact.entryLocator ||
    typedAnalysis.physicalRecordOrdinal !== typedFact.physicalRecordOrdinal ||
    typedAnalysis.form !== typedFact.form ||
    !snapshotMatchesV0_1(typedAnalysis.sourceSnapshot, typedFact.sourceSnapshot)
  ) {
    return nullResultV0_1(fact, analysis, ["SOURCE_RECORD_ANALYSIS_MISMATCH"]);
  }

  const observations = typedFact.ipaObservations;
  if (
    !Array.isArray(observations) ||
    !Number.isInteger(typedAnalysis.soundIndex) ||
    !isRecordV0_1(observations[typedAnalysis.soundIndex]) ||
    observations[typedAnalysis.soundIndex].ipa !== typedAnalysis.rawIpa
  ) {
    return nullResultV0_1(fact, analysis, ["SOURCE_RECORD_ANALYSIS_MISMATCH"]);
  }
  if (
    typedAnalysis.rawIpa === null ||
    typedAnalysis.pronunciationBody === null ||
    typeof typedAnalysis.pronunciationBody !== "string"
  ) {
    return nullResultV0_1(fact, analysis, ["SOURCE_IPA_MISSING"]);
  }

  const parsed = sourceSegmentsV0_1(typedAnalysis.pronunciationBody);
  if (parsed.reasonCodes.length > 0) {
    return nullResultV0_1(fact, analysis, parsed.reasonCodes, []);
  }

  const nuclei = typedAnalysis.nuclei as readonly AlbanianKaikkiSourceIpaSevenVoiceNucleusV0_1[];
  const sourceSegments: AlbanianSourceOrderContextSegmentV0_1[] = [];
  let nucleusIndex = 0;
  for (const [order, segment] of parsed.segments.entries()) {
    if (segment.sourceClass === "vowel") {
      const nucleus = nuclei[nucleusIndex];
      if (!nucleus || nucleus.order !== nucleusIndex) {
        return nullResultV0_1(fact, analysis, ["NUCLEUS_STRUCTURE_UNRESOLVED"]);
      }
      sourceSegments.push(Object.freeze({
        order,
        raw: segment.raw,
        baseSymbol: segment.base,
        class: "vowel",
        sourceClass: "vowel",
        optional: segment.optional,
        nucleusIndex,
        voiceAnchors: nucleus.voice === null ? Object.freeze([]) : Object.freeze([nucleus.voice]),
      }));
      nucleusIndex += 1;
    } else {
      sourceSegments.push(Object.freeze({
        order,
        raw: segment.raw,
        baseSymbol: segment.base,
        class: "consonant",
        sourceClass: segment.sourceClass,
        optional: segment.optional,
        nucleusIndex: null,
        voiceAnchors: Object.freeze([]),
      }));
    }
  }

  if (nucleusIndex !== nuclei.length) {
    return nullResultV0_1(fact, analysis, ["NUCLEUS_STRUCTURE_UNRESOLVED"], sourceSegments);
  }

  const optionalNucleusOrders = Object.freeze(
    sourceSegments
      .filter((segment) => segment.class === "vowel" && segment.optional)
      .map((segment) => segment.nucleusIndex as number),
  );
  const firstNucleusOrder = sourceSegments.findIndex((segment) => segment.class === "vowel");
  let lastNucleusOrder = -1;
  for (const [order, segment] of sourceSegments.entries()) {
    if (segment.class === "vowel") lastNucleusOrder = order;
  }
  if (firstNucleusOrder < 0 || lastNucleusOrder < 0) {
    return nullResultV0_1(fact, analysis, ["NUCLEUS_STRUCTURE_UNRESOLVED"], sourceSegments);
  }

  const prefixConsonants = Object.freeze(
    sourceSegments.slice(0, firstNucleusOrder).filter((segment) => segment.class === "consonant"),
  );
  const suffixConsonants = Object.freeze(
    sourceSegments.slice(lastNucleusOrder + 1).filter((segment) => segment.class === "consonant"),
  );
  const interNucleusRegions: AlbanianSourceOrderContextRegionV0_1[] = [];
  for (let left = 0; left < nuclei.length - 1; left += 1) {
    const leftOrder = sourceSegments.findIndex((segment) => segment.nucleusIndex === left);
    const rightOrder = sourceSegments.findIndex((segment) => segment.nucleusIndex === left + 1);
    interNucleusRegions.push(Object.freeze({
      leftNucleusIndex: left,
      rightNucleusIndex: left + 1,
      consonants: Object.freeze(
        sourceSegments
          .slice(leftOrder + 1, rightOrder)
          .filter((segment) => segment.class === "consonant"),
      ),
    }));
  }

  const voicePath = Object.freeze(
    typedAnalysis.voicePath.filter((voice): voice is VowelVoice => CANONICAL_VOICES_V0_1.has(voice)),
  );
  if (typedAnalysis.status !== "SUPPORTED" || voicePath.length === 0 || typedAnalysis.reasonCodes.length > 0) {
    return nullResultV0_1(
      fact,
      analysis,
      ["ANALYSIS_NULL", ...(typedAnalysis.reasonCodes.includes("NUCLEUS_STRUCTURE_UNRESOLVED") ? ["NUCLEUS_STRUCTURE_UNRESOLVED" as const] : [])],
      sourceSegments,
    );
  }

  const source = sourceRecordV0_1(typedFact, typedAnalysis);
  const signaturePayload = {
    schemaVersion: ALBANIAN_SOURCE_ORDER_CONTEXT_SIGNATURE_SCHEMA_V0_1,
    source,
    rawIpa: typedAnalysis.rawIpa,
    nonVoiceFeatures: typedAnalysis.nonVoiceFeatures,
    sourceSegments,
    voicePath,
    optionalNucleusOrders,
    prefixConsonants,
    interNucleusRegions,
    suffixConsonants,
  };

  return Object.freeze({
    schemaVersion: ALBANIAN_SOURCE_ORDER_CONTEXT_SIGNATURE_SCHEMA_V0_1,
    projectionId: ALBANIAN_SOURCE_ORDER_CONTEXT_SIGNATURE_ID_V0_1,
    authorityBoundary: ALBANIAN_SOURCE_ORDER_CONTEXT_SIGNATURE_AUTHORITY_BOUNDARY_V0_1,
    status: "SUPPORTED",
    sourcePronunciationAuthority: ALBANIAN_KAIKKI_LEXICAL_PRONUNCIATION_AUTHORITY_V0_1,
    source,
    rawIpa: typedAnalysis.rawIpa,
    nonVoiceFeatures: typedAnalysis.nonVoiceFeatures,
    sourceSegments: Object.freeze(sourceSegments),
    voicePath,
    optionalNucleusOrders,
    prefixConsonants,
    interNucleusRegions: Object.freeze(interNucleusRegions),
    suffixConsonants,
    structuralSignature: JSON.stringify(signaturePayload),
    upstreamReasonCodes: Object.freeze([]),
    reasonCodes: Object.freeze([]),
    semanticOutput: "NOT_GENERATED",
  });
}
