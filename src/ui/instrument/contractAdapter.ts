"use client";

import { normalizePrinciplesToLabels } from "@/v1/principles.vocab.v0.1";
import {
  SEVEN_VOICE_CATEGORY_TO_VOICE_V0_1,
  SEVEN_VOICE_PHONOLOGICAL_CATEGORY_VALUES_V0_1,
} from "@/shared/openInstrument/sevenVoicePhonologicalCategoryAuthority.v0_1";
import { isVowelVoice } from "@/shared/vowels/vowelVoices.v0.1";
import {
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_URL_V0_1,
} from "@/shared/openInstrument/albanianKaikkiExactLexicalSourceIdentity.v0_1";
import {
  ALBANET_SOURCE_FAMILY_ID_V0_1,
  ALBANET_SOURCE_FILE_RELATIVE_PATH_V0_1,
  ALBANET_SOURCE_FILE_SHA256_V0_1,
  ALBANET_SOURCE_REPOSITORY_V0_1,
  ALBANET_SOURCE_REVISION_V0_1,
  ALBANET_SOURCE_TITLE_V0_1,
} from "@/shared/openInstrument/albanetSourceIdentity.v0_1";
import {
  ALBANIAN_SENSE_ALIGNED_LEXICAL_ROLE_LINEAGE_STATUS_V0_1,
  ALBANIAN_SENSE_ALIGNED_LEXICAL_ROLE_PREDICATE_ID_V0_1,
  ALBANIAN_SENSE_ALIGNED_LEXICAL_ROLE_REVIEWED_DEFINITIONS_V0_1,
  ALBANIAN_SENSE_ALIGNED_LEXICAL_ROLE_SCHEMA_V0_1,
} from "@/shared/openInstrument/albanianSenseAlignedLexicalRolePolicy.v0_1";
/**
 * UI contract adapter: raw analyze-v1 payload → TelemetryViewModel (VM).
 *
 * Rules:
 * - UI must consume ONLY the VM (no raw payload parsing in components).
 * - Keep adapters deterministic + defensive.
 * - PresentOrMissing prevents silent emptiness.
 */

import { adaptSoundRootsToVM } from "@/ui/telemetry/soundRootsVM.v0.1";

import type {
  CandidateRowVM,
  DecompositionItemVM,
  MathTelemetryVM,
  OriginClaimGatesVM,
  PresentOrMissing,
  RejectionItemVM,
  TelemetryViewModel,
  RootMapVM,
  Vowel,
  PhoneticIpaV0_1VM,
  PronunciationConsonantSegmentV0_1VM,
  SpokenPronunciationProvenanceV0_1VM,
  SpokenPronunciationVariantV0_1VM,
  ZeroConsonantalStructuralCompositionV0_1VM,
  ResonanceProfileV1VM,
  MotivationDiscoveryV0_1VM,
  MotivationDiscoveryCandidateV0_1VM,
  FunctionalMotivationInterpretationV0_2VM,
} from "../telemetry/types";
import {
  DOCTRINE_READING_COMPOSITION_MODE_V1,
  DOCTRINE_READING_CONTRACT_SCHEMA_V1,
  DOCTRINE_READING_PATH_COMPOSITION_V1,
  DOCTRINE_READING_PROVENANCE_V1,
  type DoctrineReadingV1,
} from "@/shared/openInstrument/doctrineReadingContract.v1";
import {
  DOCTRINE_FUNCTIONAL_PROFILE_COMPLETENESS_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_ENGINE_AUTHORITY_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_TRUTH_CLASSIFICATION_V0_1,
  getSevenVoiceDoctrineFunctionalProfileV0_1,
} from "@/shared/openInstrument/doctrineFunctionalProfile.v0_1";
import { isDoctrineLevel3ProofPairReadingV0_1 } from
  "@/shared/openInstrument/doctrineLevel3ProofPair.v0_1";
import type { RootMapV1 } from "@/shared/deepRoot.rootMap.v1";
import { computeDeepRootHeartGateV01 } from "@/shared/deepRootHeartGate.v0.1.compute";
import { isSevenVoiceKey } from "@/shared/sevenVoiceOrderedViews.v0.1";
import { SEVEN_PRINCIPLES, vowelToIndex1, vowelToRingIndex, vowelToColor, vowelToNote } from "@/shared/sevenPrinciples.v1";
import type { AnalysisStatusV0_1VM } from "../telemetry/types";
import {
  parseGenericFunctionalWitnessRuntimeProjectionV1,
} from "@/shared/openInstrument/genericFunctionalWitnessRuntimeProjection.v1";
import {
  isWordSpecificFunctionalDepthV0_1,
} from "@/shared/openInstrument/wordSpecificFunctionalDepth.v0_1";
import type { WordSpecificFunctionalDepthV0_1 } from "@/shared/openInstrument/wordSpecificFunctionalDepth.v0_1";
import {
  isFunctionalMotivationInterpretationV0_2,
} from "@/shared/openInstrument/functionalMotivationInterpretation.v0_2";

type ParseRootMapResult = { ok: true; value: RootMapV1 } | { ok: false; reason: string };

function parseRootMapV1(v: unknown): ParseRootMapResult {
  if (!isRecord(v)) return { ok: false, reason: "rootMap expected object" };

  const tokens = v["tokens"];
  const keys = v["keys"];
  const composedMeaning = v["composedMeaning"];

  if (!Array.isArray(tokens)) return { ok: false, reason: "rootMap.tokens expected array" };
  if (!Array.isArray(keys)) return { ok: false, reason: "rootMap.keys expected array" };
  if (typeof composedMeaning !== "string") return { ok: false, reason: "rootMap.composedMeaning expected string" };

  type RootMapTokenRole = Exclude<NonNullable<RootMapV1["tokens"]>[number]["role"], undefined>;
  type RootMapKeyStatus = NonNullable<RootMapV1["keys"]>[number]["status"];
  type RootMapSpanSource = NonNullable<RootMapV1["spans"]>[number]["source"];

  const normalizeRootTokenRole = (value: unknown): RootMapTokenRole | null => {
    switch (String(value ?? "")) {
      case "action":
      case "Action":
        return "action";
      case "instrument":
      case "Instrument":
      case "Function":
        return "instrument";
      case "unit":
      case "Unit":
        return "unit";
      case "modifier":
      case "Modifier":
        return "modifier";
      case "unknown":
      case "Unknown":
        return "unknown";
      default:
        return null;
    }
  };

  const normalizeRootKeyStatus = (value: unknown): RootMapKeyStatus | null => {
    if (typeof value !== "string") return null;

    switch (value) {
      case "supported":
        return "supported";
      case "dialect_attested_pending_review":
        return "dialect_attested_pending_review";
      case "carrier_only":
        return "carrier_only";
      case "candidate_only":
        return "candidate_only";
      default:
        return null;
    }
  };

  const normalizeRootSpanSource = (value: unknown): RootMapSpanSource | null => {
    if (typeof value !== "string") return null;

    switch (value) {
      case "surface":
        return "surface";
      case "normalized":
        return "normalized";
      default:
        return null;
    }
  };

  // tokens: [{ token: string, role?: string, vowel_path?: string }]
  for (const t of tokens) {
    if (!isRecord(t)) return { ok: false, reason: "rootMap.tokens item expected object" };

    const token = t["token"];
    const role = t["role"];
    const vowelPath = t["vowel_path"];

    const normalizedRole = role == null ? null : normalizeRootTokenRole(role);

    if (typeof token !== "string") return { ok: false, reason: "rootMap.tokens[].token expected string" };
    if (role != null && normalizedRole == null)
      return { ok: false, reason: "rootMap.tokens[].role expected RootTokenRoleV1" };
    if (vowelPath != null && typeof vowelPath !== "string")
      return { ok: false, reason: "rootMap.tokens[].vowel_path expected string" };
  }

  // keys: [{ token, language, gloss, evidence[], status, ops?[] }]
  for (const k of keys) {
    if (!isRecord(k)) return { ok: false, reason: "rootMap.keys item expected object" };

    const token = k["token"];
    const language = k["language"];
    const gloss = k["gloss"];
    const evidence = k["evidence"];
    const status = k["status"];
    const ops = k["ops"];
    const normalizedStatus = normalizeRootKeyStatus(status);

    if (typeof token !== "string") return { ok: false, reason: "rootMap.keys[].token expected string" };
    if (typeof language !== "string") return { ok: false, reason: "rootMap.keys[].language expected string" };
    if (typeof gloss !== "string") return { ok: false, reason: "rootMap.keys[].gloss expected string" };
    if (!Array.isArray(evidence) || !evidence.every((x) => typeof x === "string"))
      return { ok: false, reason: "rootMap.keys[].evidence expected string[]" };
    if (normalizedStatus == null)
      return { ok: false, reason: "rootMap.keys[].status expected RootKeyStatusV1" };
    if (ops != null) {
      if (!Array.isArray(ops) || !ops.every((x) => typeof x === "string"))
        return { ok: false, reason: "rootMap.keys[].ops expected string[]" };
    }
  }

  // carriers?: [{ token, language, carrierForm, note? }]
  const carriers = v["carriers"];
  if (carriers != null) {
    if (!Array.isArray(carriers)) return { ok: false, reason: "rootMap.carriers expected array" };
    for (const c of carriers) {
      if (!isRecord(c)) return { ok: false, reason: "rootMap.carriers item expected object" };

      const token = c["token"];
      const language = c["language"];
      const carrierForm = c["carrierForm"];
      const note = c["note"];

      if (typeof token !== "string") return { ok: false, reason: "rootMap.carriers[].token expected string" };
      if (typeof language !== "string") return { ok: false, reason: "rootMap.carriers[].language expected string" };
      if (typeof carrierForm !== "string")
        return { ok: false, reason: "rootMap.carriers[].carrierForm expected string" };
      if (note != null && typeof note !== "string")
        return { ok: false, reason: "rootMap.carriers[].note expected string" };
    }
  }

  // spans?: [{ token, start, end, source, note? }]
  const spans = v["spans"];
  if (spans != null) {
    if (!Array.isArray(spans)) return { ok: false, reason: "rootMap.spans expected array" };
    for (const s of spans) {
      if (!isRecord(s)) return { ok: false, reason: "rootMap.spans item expected object" };

      const token = s["token"];
      const start = s["start"];
      const end = s["end"];
      const source = s["source"];
      const note = s["note"];
      const normalizedSource = normalizeRootSpanSource(source);

      if (typeof token !== "string") return { ok: false, reason: "rootMap.spans[].token expected string" };
      if (typeof start !== "number")
        return { ok: false, reason: "rootMap.spans[].start expected number" };
      if (typeof end !== "number")
        return { ok: false, reason: "rootMap.spans[].end expected number" };
      if (normalizedSource == null)
        return { ok: false, reason: "rootMap.spans[].source expected RootSpanSourceV1" };
      if (note != null && typeof note !== "string")
        return { ok: false, reason: "rootMap.spans[].note expected string" };
    }
  }

  // notes?: string[]
  const notes = v["notes"];
  if (notes != null) {
    if (!Array.isArray(notes) || !notes.every((x) => typeof x === "string"))
      return { ok: false, reason: "rootMap.notes expected string[]" };
  }

  type RootMapToken = NonNullable<RootMapV1["tokens"]>[number];
  type RootMapKey = NonNullable<RootMapV1["keys"]>[number];
  type RootMapCarrier = NonNullable<RootMapV1["carriers"]>[number];
  type RootMapSpan = NonNullable<RootMapV1["spans"]>[number];

  const typedTokens: RootMapToken[] = tokens.map((t): RootMapToken => {
    if (!isRecord(t)) throw new Error("rootMap.tokens item expected object");

    const token = t["token"];
    const role = t["role"];
    const vowelPath = t["vowel_path"];
    const normalizedRole = role == null ? null : normalizeRootTokenRole(role);

    if (typeof token !== "string") throw new Error("rootMap.tokens[].token expected string");
    if (role != null && normalizedRole == null) throw new Error("rootMap.tokens[].role expected RootTokenRoleV1");
    if (vowelPath != null && typeof vowelPath !== "string") throw new Error("rootMap.tokens[].vowel_path expected string");

    return {
      token,
      ...(normalizedRole != null ? { role: normalizedRole } : {}),
      ...(vowelPath != null ? { vowel_path: vowelPath } : {}),
    };
  });

  const typedKeys: RootMapKey[] = keys.map((k): RootMapKey => {
    if (!isRecord(k)) throw new Error("rootMap.keys item expected object");

    const token = k["token"];
    const language = k["language"];
    const gloss = k["gloss"];
    const evidence = k["evidence"];
    const status = k["status"];
    const ops = k["ops"];
    const normalizedStatus = normalizeRootKeyStatus(status);

    if (typeof token !== "string") throw new Error("rootMap.keys[].token expected string");
    if (typeof language !== "string") throw new Error("rootMap.keys[].language expected string");
    if (typeof gloss !== "string") throw new Error("rootMap.keys[].gloss expected string");
    if (!Array.isArray(evidence) || !evidence.every((x) => typeof x === "string"))
      throw new Error("rootMap.keys[].evidence expected string[]");
    if (normalizedStatus == null) throw new Error("rootMap.keys[].status expected RootKeyStatusV1");
    if (ops != null && (!Array.isArray(ops) || !ops.every((x) => typeof x === "string")))
      throw new Error("rootMap.keys[].ops expected string[]");

    return {
      token,
      language,
      gloss,
      evidence,
      status: normalizedStatus,
      ...(ops != null ? { ops } : {}),
    };
  });

  const typedCarriers: RootMapV1["carriers"] =
    carriers == null
      ? undefined
      : carriers.map((c): RootMapCarrier => {
          if (!isRecord(c)) throw new Error("rootMap.carriers item expected object");

          const token = c["token"];
          const language = c["language"];
          const carrierForm = c["carrierForm"];
          const note = c["note"];

          if (typeof token !== "string") throw new Error("rootMap.carriers[].token expected string");
          if (typeof language !== "string") throw new Error("rootMap.carriers[].language expected string");
          if (typeof carrierForm !== "string") throw new Error("rootMap.carriers[].carrierForm expected string");
          if (note != null && typeof note !== "string") throw new Error("rootMap.carriers[].note expected string");

          return {
            token,
            language,
            carrierForm,
            ...(note != null ? { note } : {}),
          };
        });

  const typedSpans: RootMapV1["spans"] =
    spans == null
      ? undefined
      : spans.map((s): RootMapSpan => {
          if (!isRecord(s)) throw new Error("rootMap.spans item expected object");

          const token = s["token"];
          const start = s["start"];
          const end = s["end"];
          const source = s["source"];
          const note = s["note"];
          const normalizedSource = normalizeRootSpanSource(source);

          if (typeof token !== "string") throw new Error("rootMap.spans[].token expected string");
          if (typeof start !== "number")
            throw new Error("rootMap.spans[].start expected number");
          if (typeof end !== "number")
            throw new Error("rootMap.spans[].end expected number");
          if (normalizedSource == null)
            throw new Error("rootMap.spans[].source expected RootSpanSourceV1");
          if (note != null && typeof note !== "string")
            throw new Error("rootMap.spans[].note expected string");

          return {
            token,
            start,
            end,
            source: normalizedSource,
            ...(note != null ? { note } : {}),
          };
        });

  const typedNotes: RootMapV1["notes"] =
    notes == null ? undefined : notes.map((x) => String(x));

  return {
    ok: true,
    value: {
      tokens: typedTokens,
      keys: typedKeys,
      composedMeaning,
      ...(typedCarriers ? { carriers: typedCarriers } : {}),
      ...(typedSpans ? { spans: typedSpans } : {}),
      ...(typedNotes ? { notes: typedNotes } : {}),
    },
  };
}

// ----------------------- small helpers -----------------------

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

type ZeroConsonantalStructuralCompositionParseV0_1 =
  | { ok: true; value: ZeroConsonantalStructuralCompositionV0_1VM | null }
  | { ok: false; reason: string };

type ZeroConsonantalStructuralCompositionExpectedV0_1 = Readonly<{
  voicePath: readonly Vowel[] | null;
  variantId: string;
  variantOrder: number;
  sourceProfileId: string;
  sourceNotation: string;
  sourceRevision: string;
}>;

function parseZeroConsonantalStructuralCompositionV0_1(
  value: unknown,
  expected: ZeroConsonantalStructuralCompositionExpectedV0_1,
): ZeroConsonantalStructuralCompositionParseV0_1 {
  if (value === undefined || value === null) return { ok: true, value: null };
  if (!isRecord(value)) {
    return { ok: false, reason: "zeroConsonantalStructuralComposition expected object|null" };
  }

  const schemaVersion = value["schemaVersion"];
  const voicePath = value["voicePath"];
  const variantId = value["variantId"];
  const variantOrder = value["variantOrder"];
  const sourceProfileId = value["sourceProfileId"];
  const sourceNotation = value["sourceNotation"];
  const sourceRevision = value["sourceRevision"];
  const p = value["p"];
  const i = value["i"];
  const s = value["s"];
  const d = value["d"];
  const a = value["a"];
  const r = value["r"];

  if (schemaVersion !== "open-instrument.zero-consonantal-structural-composition.v0_1") {
    return { ok: false, reason: "zeroConsonantalStructuralComposition.schemaVersion invalid" };
  }
  if (
    typeof variantId !== "string" ||
    !variantId.trim() ||
    variantId !== expected.variantId
  ) {
    return { ok: false, reason: "zeroConsonantalStructuralComposition.variantId expected enclosing variant identity" };
  }
  if (
    typeof variantOrder !== "number" ||
    !Number.isInteger(variantOrder) ||
    variantOrder < 0 ||
    variantOrder !== expected.variantOrder
  ) {
    return { ok: false, reason: "zeroConsonantalStructuralComposition.variantOrder expected enclosing variant order" };
  }
  if (typeof sourceProfileId !== "string" || sourceProfileId !== expected.sourceProfileId) {
    return { ok: false, reason: "zeroConsonantalStructuralComposition.sourceProfileId expected enclosing pronunciation profile" };
  }
  if (typeof sourceNotation !== "string" || sourceNotation !== expected.sourceNotation) {
    return { ok: false, reason: "zeroConsonantalStructuralComposition.sourceNotation expected enclosing pronunciation notation" };
  }
  if (typeof sourceRevision !== "string" || sourceRevision !== expected.sourceRevision) {
    return { ok: false, reason: "zeroConsonantalStructuralComposition.sourceRevision expected enclosing pronunciation revision" };
  }

  if (!Array.isArray(voicePath)) {
    return { ok: false, reason: "zeroConsonantalStructuralComposition.voicePath expected Voice[]" };
  }
  const parsedVoicePath: Vowel[] = [];
  for (const [index, rawVoice] of voicePath.entries()) {
    if (typeof rawVoice !== "string") {
      return { ok: false, reason: `zeroConsonantalStructuralComposition.voicePath[${index}] expected Voice` };
    }
    const parsedVoice = normalizeVowelChar(rawVoice);
    if (!parsedVoice) {
      return { ok: false, reason: `zeroConsonantalStructuralComposition.voicePath[${index}] expected Voice` };
    }
    parsedVoicePath.push(parsedVoice);
  }
  if (
    expected.voicePath === null ||
    parsedVoicePath.length !== expected.voicePath.length ||
    parsedVoicePath.some((part, index) => part !== expected.voicePath?.[index])
  ) {
    return { ok: false, reason: "zeroConsonantalStructuralComposition.voicePath expected enclosing canonical Voice path" };
  }

  const nonNegativeIntegerArray = (candidate: unknown): number[] | null =>
    Array.isArray(candidate) && candidate.every(
      (item) => typeof item === "number" && Number.isInteger(item) && item >= 0,
    )
      ? candidate as number[]
      : null;

  const iValues = nonNegativeIntegerArray(i);
  const dValues = nonNegativeIntegerArray(d);
  if (typeof p !== "number" || !Number.isInteger(p) || p < 0) {
    return { ok: false, reason: "zeroConsonantalStructuralComposition.p expected non-negative integer" };
  }
  if (iValues === null) {
    return { ok: false, reason: "zeroConsonantalStructuralComposition.i expected integer[]" };
  }
  if (typeof s !== "number" || !Number.isInteger(s) || s < 0) {
    return { ok: false, reason: "zeroConsonantalStructuralComposition.s expected non-negative integer" };
  }
  if (dValues === null) {
    return { ok: false, reason: "zeroConsonantalStructuralComposition.d expected integer[]" };
  }
  if (
    dValues.length !== iValues.length + 2 ||
    dValues[0] !== p ||
    dValues[dValues.length - 1] !== s ||
    dValues.slice(1, -1).some((value, index) => value !== iValues[index])
  ) {
    return { ok: false, reason: "zeroConsonantalStructuralComposition.d inconsistent with P/I/S" };
  }
  if (typeof a !== "number" || !Number.isInteger(a)) {
    return { ok: false, reason: "zeroConsonantalStructuralComposition.a expected integer" };
  }
  if (a !== p - s) {
    return { ok: false, reason: "zeroConsonantalStructuralComposition.a inconsistent with P/S" };
  }
  if (!Array.isArray(r)) {
    return { ok: false, reason: "zeroConsonantalStructuralComposition.r expected array" };
  }

  const recurrences: Array<ZeroConsonantalStructuralCompositionV0_1VM["r"][number]> = [];
  for (const [index, rawRecurrence] of r.entries()) {
    if (!isRecord(rawRecurrence)) {
      return { ok: false, reason: `zeroConsonantalStructuralComposition.r[${index}] expected object` };
    }
    const identity = rawRecurrence["identity"];
    const segmentIndices = rawRecurrence["segmentIndices"];
    const occurrenceCount = rawRecurrence["occurrenceCount"];
    const segmentIndexValues = nonNegativeIntegerArray(segmentIndices);
    if (!Array.isArray(identity) || !identity.every((item) => typeof item === "string")) {
      return { ok: false, reason: `zeroConsonantalStructuralComposition.r[${index}].identity expected string[]` };
    }
    if (segmentIndexValues === null) {
      return { ok: false, reason: `zeroConsonantalStructuralComposition.r[${index}].segmentIndices expected integer[]` };
    }
    if (
      typeof occurrenceCount !== "number" ||
      !Number.isInteger(occurrenceCount) ||
      occurrenceCount < 2 ||
      occurrenceCount !== segmentIndexValues.length
    ) {
      return { ok: false, reason: `zeroConsonantalStructuralComposition.r[${index}].occurrenceCount invalid` };
    }
    recurrences.push({
      identity,
      segmentIndices: segmentIndexValues,
      occurrenceCount,
    });
  }

  return {
    ok: true,
    value: {
      schemaVersion,
      voicePath: parsedVoicePath,
      variantId,
      variantOrder,
      sourceProfileId,
      sourceNotation,
      sourceRevision,
      p,
      i: iValues,
      s,
      d: dValues,
      a,
      r: recurrences,
    },
  };
}

function asString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function isDoctrineReadingV1(value: unknown): value is DoctrineReadingV1 {
  if (!isRecord(value)) return false;
  if (value.schemaVersion !== DOCTRINE_READING_CONTRACT_SCHEMA_V1) return false;
  if (value.compositionMode !== DOCTRINE_READING_COMPOSITION_MODE_V1) return false;
  if (value.pathComposition !== DOCTRINE_READING_PATH_COMPOSITION_V1) return false;
  if (value.providerIndependent !== true) return false;
  if (value.externalEvidenceIndependent !== true) return false;
  if (value.candidateWinnerIndependent !== true) return false;
  if (value.userDecisionPosture !== "user_decides") return false;
  if (value.noSingleWinner !== true) return false;
  if (
    value.level3WholePathReading !== undefined &&
    value.level3WholePathReading !== null &&
    !isDoctrineLevel3ProofPairReadingV0_1(value.level3WholePathReading)
  ) {
    return false;
  }

  const analyzedVoicePath = value.analyzedVoicePath;
  const entries = value.entries;
  if (!Array.isArray(analyzedVoicePath) || !analyzedVoicePath.every(isSevenVoiceKey)) {
    return false;
  }
  if (!Array.isArray(entries) || entries.length !== analyzedVoicePath.length) return false;

  const roleSet = new Set<string>(Object.values(SEVEN_PRINCIPLES).map((principle) => principle.role));
  for (const [index, entryValue] of entries.entries()) {
    if (!isRecord(entryValue)) return false;
    if (entryValue.pathIndex !== index) return false;
    if (
      typeof entryValue.voice !== "string" ||
      !isSevenVoiceKey(entryValue.voice) ||
      entryValue.voice !== analyzedVoicePath[index]
    ) {
      return false;
    }
    if (typeof entryValue.doctrineRole !== "string" || !roleSet.has(entryValue.doctrineRole)) {
      return false;
    }
    if (entryValue.profileSchemaVersion !== DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1) return false;
    if (entryValue.profileEngineAuthority !== DOCTRINE_FUNCTIONAL_PROFILE_ENGINE_AUTHORITY_V0_1) return false;
    if (entryValue.profileNormalizationStatus !== DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1) return false;
    if (entryValue.profileCompleteness !== DOCTRINE_FUNCTIONAL_PROFILE_COMPLETENESS_V0_1) return false;
    if (entryValue.profileTruthClassification !== DOCTRINE_FUNCTIONAL_PROFILE_TRUTH_CLASSIFICATION_V0_1) return false;

    const canonicalProfile = getSevenVoiceDoctrineFunctionalProfileV0_1(entryValue.voice);
    if (!canonicalProfile) return false;
    if (!Array.isArray(entryValue.functionalProperties)) return false;
    for (const property of entryValue.functionalProperties) {
      if (!isRecord(property)) return false;
      if (typeof property.id !== "string" || property.id.trim().length === 0) return false;
      if (!canonicalProfile.functionalProperties.some((expected) => expected.id === property.id)) {
        return false;
      }
      if (property.sourceClass !== "EXPLICIT_DOCTRINE" && property.sourceClass !== "FUNCTIONAL_INTERPRETATION") {
        return false;
      }
      if (property.normalizationStatus !== DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1) {
        return false;
      }
      if (!Array.isArray(property.sourceRefs)) return false;
      if (
        !property.sourceRefs.every(
          (sourceRef) =>
            isRecord(sourceRef) &&
            typeof sourceRef.sourceId === "string" &&
            typeof sourceRef.locator === "string" &&
            sourceRef.sourceKind === "AUTHOR_PRIMARY_DOCTRINE_SOURCE" &&
            sourceRef.sourceStatus === "VERBATIM" &&
            sourceRef.engineAuthority === "NOT_EXECUTABLE_DIRECTLY",
        )
      ) {
        return false;
      }
    }
  }

  const claimBoundary = value.claimBoundary;
  if (
    !isRecord(claimBoundary) ||
    claimBoundary.historicalOriginClaim !== "not_claimed" ||
    claimBoundary.historicalTransmissionClaim !== "not_claimed" ||
    claimBoundary.winnerClaim !== "not_claimed" ||
    claimBoundary.languageSuperiorityClaim !== "not_claimed" ||
    claimBoundary.candidateTruthClaim !== "not_claimed" ||
    claimBoundary.lexicalMeaningClaim !== "not_claimed"
  ) {
    return false;
  }

  const provenance = value.provenance;
  return (
    isRecord(provenance) &&
    provenance.doctrineProjectionSchema === DOCTRINE_READING_PROVENANCE_V1.doctrineProjectionSchema &&
    provenance.orderedViewsSchema === DOCTRINE_READING_PROVENANCE_V1.orderedViewsSchema &&
    provenance.doctrineAuthority === DOCTRINE_READING_PROVENANCE_V1.doctrineAuthority &&
    provenance.roleVocabularyAuthority === DOCTRINE_READING_PROVENANCE_V1.roleVocabularyAuthority &&
    provenance.functionalProfileSchema === DOCTRINE_READING_PROVENANCE_V1.functionalProfileSchema &&
    provenance.functionalProfileAuthority === DOCTRINE_READING_PROVENANCE_V1.functionalProfileAuthority
  );
}

function parseDoctrineReading(
  value: unknown,
): PresentOrMissing<DoctrineReadingV1 | null> {
  if (value === undefined) return missing("not_emitted", "doctrineReading");
  if (value === null) return present(null);
  return isDoctrineReadingV1(value)
    ? present(value)
    : missing("malformed", "doctrineReading expected the public V1 shape");
}

function parseWordSpecificFunctionalDepthV0_1(
  value: unknown,
): PresentOrMissing<WordSpecificFunctionalDepthV0_1 | null> {
  if (value === undefined) {
    return missing("not_emitted", "wordSpecificFunctionalDepth");
  }
  if (value === null) return present(null);
  return isWordSpecificFunctionalDepthV0_1(value)
    ? present(value)
    : missing("malformed", "wordSpecificFunctionalDepth contract");
}

type CandidateStatus = "pass" | "fail" | "experimental" | "unknown";

function parseCandidateStatus(v: unknown): CandidateStatus | null {
  return v === "pass" || v === "fail" || v === "experimental" || v === "unknown"
    ? v
    : null;
}

function parseOptionalCandidateString(
  rec: Record<string, unknown>,
  field: "confidenceTag" | "fitTag",
): PresentOrMissing<string> | undefined {
  if (!(field in rec)) return undefined;
  const value = rec[field];
  return typeof value === "string" && value.trim().length > 0
    ? present(value)
    : missing("malformed", `candidate.${field} expected non-empty string`);
}

// Pick helpers (Instrument contract adapter)
function pickFromRootMetaContract(root: Record<string, unknown> | null, key: string): string | null {
  const meta = root && isRecord(root["meta"]) ? root["meta"] : null;
  const contract = root && isRecord(root["contract"]) ? root["contract"] : null;
  return (
    asString(root ? root[key] : null) ??
    asString(contract ? contract[key] : null) ??
    asString(meta ? meta[key] : null) ??
    null
  );
}

function pickMetaCreated(root: Record<string, unknown> | null): string | null {
  const meta = root && isRecord(root["meta"]) ? root["meta"] : null;
  const contract = root && isRecord(root["contract"]) ? root["contract"] : null;
  const contractMeta = contract && isRecord(contract["meta"]) ? contract["meta"] : null;
  return (
    asString(contractMeta ? contractMeta["created"] : null) ??
    asString(contractMeta ? contractMeta["createdAt"] : null) ??
    asString(meta ? meta["created"] : null) ??
    asString(meta ? meta["createdAt"] : null) ??
    null
  );
}


function asBool(v: unknown): boolean | null {
  return typeof v === "boolean" ? v : null;
}

function asArray(v: unknown): unknown[] | null {
  return Array.isArray(v) ? v : null;
}

function asStringArray(v: unknown): string[] | null {
  const arr = asArray(v);
  if (!arr) return null;
  const out: string[] = [];
  for (const x of arr) out.push(String(x));
  return out;
}

function formatNormalizationStep(x: unknown): string {
  // Contract: never throw; always return a string.
  if (typeof x === "string") return x;
  if (!x || typeof x !== "object") return String(x);
  if (!isRecord(x)) {
    try {
      return JSON.stringify(x);
    } catch {
      return String(x);
    }
  }

  const from = typeof x["from"] === "string" ? x["from"] : "";
  const to = typeof x["to"] === "string" ? x["to"] : "";
  const reason = typeof x["reason"] === "string" ? x["reason"] : "";

  // { from:"UY", to:"UI", reason:"functional_equivalence" }
  // -> "UY → UI (functional_equivalence)"
  if (from && to) {
    const tail = reason ? ` (${reason})` : "";
    return `${from} → ${to}${tail}`;
  }

  try {
    return JSON.stringify(x);
  } catch {
    return String(x);
  }
}

function formatEvidenceItem(x: unknown): string {
  // Never leak "[object Object]" into UI.
  if (typeof x === "string") return x;
  if (x == null) return "";
  if (typeof x === "object") {
    try { return JSON.stringify(x); } catch { return String(x); }
  }
  return String(x);
}



export function present<T>(value: T): PresentOrMissing<T> {
  return { kind: "present", value };
}

export function missing<T>(
  missingState: "none" | "not_emitted" | "malformed" | "unknown",
  note?: string
): PresentOrMissing<T> {
  return { kind: "missing", missing: missingState, note };
}

function presentBool(v: boolean): PresentOrMissing<boolean> {
  return present(v);
}

function countOrMissing(arr: unknown[] | null): PresentOrMissing<number> {
  if (!arr) return missing("not_emitted");
  return present(arr.length);
}

function presentStringArray(arr: unknown[] | null): PresentOrMissing<string[]> {
  if (!arr) return missing("not_emitted");
  return present(arr.map((v) => String(v)));
}

// ----------------------- vowel path helpers -----------------------

function normalizeMode(v: unknown): "strict" | "open" | null {
  const s = asString(v);
  if (s === "strict" || s === "open") return s;
  return null;
}

function normalizeVowelChar(s: string): Vowel | null {
  const t = s.trim().toUpperCase();

  switch (t) {
    case "A":
      return "A";
    case "E":
      return "E";
    case "I":
      return "I";
    case "O":
      return "O";
    case "U":
      return "U";
    case "Y":
      return "Y";
    case "Ë":
      return "Ë";
    default:
      return null;
  }
}

function normalizeVowelPathArray(v: unknown): Vowel[] | null {
  const arr = asArray(v);
  if (!arr) return null;
  const out: Vowel[] = [];
  for (const x of arr) {
    const s = asString(x);
    if (!s) return null;
    const vv = normalizeVowelChar(s);
    if (!vv) return null;
    out.push(vv);
  }
  return out.length ? out : null;
}

function normalizeVowelPathString(v: unknown): Vowel[] | null {
  const s = asString(v);
  if (!s) return null;
  // Accept "U-I" or "U→I" or "UI"
  const parts = s.includes("-") ? s.split("-") : s.includes("→") ? s.split("→") : s.split("");
  const out: Vowel[] = [];
  for (const p of parts.map((t) => t.trim()).filter(Boolean)) {
    const vv = normalizeVowelChar(p);
    if (!vv) return null;
    out.push(vv);
  }
  return out.length ? out : null;
}

// ----------------------- voice path selection -----------------------

function getField(obj: unknown, key: string): unknown {
  return isRecord(obj) ? obj[key] : undefined;
}

function parseMotivationDiscoveryV0_1(
  raw: unknown,
): PresentOrMissing<MotivationDiscoveryV0_1VM> {
  const value = getField(raw, "motivationDiscoveryV0_1");
  if (value == null) return missing("not_emitted", "motivationDiscoveryV0_1");
  if (!isRecord(value)) return missing("malformed", "motivationDiscoveryV0_1 expected object");

  if (
    value.schemaVersion !== "open-instrument.motivation-engine-discovery.v0_1" ||
    (value.status !== "MATCHES_FOUND" && value.status !== "NO_MATCHES") ||
    typeof value.inputWord !== "string" ||
    typeof value.inputLanguage !== "string" ||
    typeof value.inputProfile !== "string" ||
    !isRecord(value.sourceFact) ||
    !isRecord(value.derivedStructure) ||
    !Array.isArray(value.candidates) ||
    !isRecord(value.interpretation) ||
    !isRecord(value.unknownOrNull) ||
    value.userDecisionPosture !== "user_decides" ||
    value.noSingleWinner !== true
  ) {
    return missing("malformed", "motivationDiscoveryV0_1 shape invalid");
  }

  const sourceFact = value.sourceFact;
  const derived = value.derivedStructure;
  const math7 = isRecord(derived.math7) ? derived.math7 : null;
  const gamma = isRecord(derived.gamma) ? derived.gamma : null;
  const zc = isRecord(derived.zeroConsonantalStructuralComposition)
    ? derived.zeroConsonantalStructuralComposition
    : null;
  const isStringArray = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every((item) => typeof item === "string");
  const validSourceRelationAssertion = (
    assertion: unknown,
    senses: unknown,
  ): boolean => {
    if (!isRecord(assertion) || !isStringArray(assertion.reasonCodes)) return false;
    if (assertion.assertionScope === "UNKNOWN_OR_NULL") {
      return assertion.sourceSenseId === null &&
        assertion.sourceSenseOrdinal === null &&
        assertion.sourceSenseIdentityStatus === "UNKNOWN_OR_NULL" &&
        assertion.sourceAssertionOrdinal === null &&
        assertion.reasonCodes.length === 1 &&
        assertion.reasonCodes[0] === "SOURCE_RELATION_PROVENANCE_NOT_PROJECTED";
    }
    if (!Number.isInteger(assertion.sourceAssertionOrdinal) || (assertion.sourceAssertionOrdinal as number) < 0) return false;
    if (assertion.assertionScope === "SOURCE_RECORD") {
      return assertion.sourceSenseId === null &&
        assertion.sourceSenseOrdinal === null &&
        assertion.sourceSenseIdentityStatus === "NOT_APPLICABLE" &&
        assertion.reasonCodes.length === 0;
    }
    if (assertion.assertionScope !== "SOURCE_SENSE" ||
      !Number.isInteger(assertion.sourceSenseOrdinal) || (assertion.sourceSenseOrdinal as number) < 0 ||
      (assertion.sourceSenseId !== null && typeof assertion.sourceSenseId !== "string")) return false;
    if (!Array.isArray(senses)) {
      return assertion.sourceSenseIdentityStatus === "UNKNOWN_OR_NULL" &&
          ((assertion.sourceSenseId === null && assertion.reasonCodes.length === 1 && assertion.reasonCodes[0] === "SOURCE_SENSE_ID_MISSING") ||
            (typeof assertion.sourceSenseId === "string" && assertion.reasonCodes.length === 1 && assertion.reasonCodes[0] === "SOURCE_SENSE_ID_DUPLICATE"));
    }
    if ((assertion.sourceSenseOrdinal as number) >= senses.length) return false;
    const owner = senses[assertion.sourceSenseOrdinal as number];
    if (!isRecord(owner) || (owner.senseId !== null && typeof owner.senseId !== "string") ||
      assertion.sourceSenseId !== owner.senseId) return false;
    const ownerId = owner.senseId;
    const ownerIdCount = typeof ownerId === "string"
      ? senses.filter((sense) => isRecord(sense) && sense.senseId === ownerId).length
      : 0;
    const expectedStatus = typeof ownerId === "string" && ownerId.length > 0 && ownerIdCount === 1
      ? "VERIFIED"
      : "UNKNOWN_OR_NULL";
    const expectedReason = expectedStatus === "VERIFIED"
      ? null
      : typeof ownerId === "string" && ownerId.length > 0
        ? "SOURCE_SENSE_ID_DUPLICATE"
        : "SOURCE_SENSE_ID_MISSING";
    return assertion.sourceSenseIdentityStatus === expectedStatus &&
      (expectedReason === null
        ? assertion.reasonCodes.length === 0
        : assertion.reasonCodes.length === 1 && assertion.reasonCodes[0] === expectedReason);
  };
  const validExactRelationEdges = (relations: unknown, senses: unknown): boolean => {
    if (!Array.isArray(relations)) return false;
    const hasAssertion = relations.map((edge) => isRecord(edge) && "sourceRelationAssertion" in edge);
    // Older payloads may predate this additive projection; current provider output always includes it.
    if (hasAssertion.length > 0 && hasAssertion.some(Boolean) && hasAssertion.some((present) => !present)) return false;
    if (!hasAssertion.some(Boolean)) return relations.every((edge) => isRecord(edge) &&
      typeof edge.form === "string" && typeof edge.entryLocator === "string" &&
      (edge.relation === "SOURCE_RELATED_FORM" || edge.relation === "SOURCE_DERIVED_FORM"));
    let prior: readonly number[] | null = null;
    const priorOrdinals = new Map<string, number>();
    for (const edge of relations) {
      if (!isRecord(edge) || typeof edge.form !== "string" || typeof edge.entryLocator !== "string" ||
        (edge.relation !== "SOURCE_RELATED_FORM" && edge.relation !== "SOURCE_DERIVED_FORM") ||
        !validSourceRelationAssertion(edge.sourceRelationAssertion, senses)) return false;
      const assertion = edge.sourceRelationAssertion;
      if (!isRecord(assertion) || assertion.assertionScope === "UNKNOWN_OR_NULL") continue;
      const scope = assertion.assertionScope;
      const relationRank = edge.relation === "SOURCE_RELATED_FORM" ? 0 : 1;
      const key = scope === "SOURCE_RECORD"
        ? `record:${edge.relation}`
        : `sense:${assertion.sourceSenseOrdinal}:${edge.relation}`;
      const ownerRank = scope === "SOURCE_RECORD"
        ? relationRank
        : (edge.relation === "SOURCE_RELATED_FORM" ? 2 : 3);
      const order = scope === "SOURCE_RECORD"
        ? [ownerRank, -1, assertion.sourceAssertionOrdinal as number]
        : [ownerRank, assertion.sourceSenseOrdinal as number, assertion.sourceAssertionOrdinal as number];
      if (prior && (order[0]! < prior[0]! ||
        (order[0] === prior[0] && order[1]! < prior[1]!) ||
        (order[0] === prior[0] && order[1] === prior[1] && order[2]! <= prior[2]!))) return false;
      const priorOrdinal = priorOrdinals.get(key);
      if (priorOrdinal !== undefined && (assertion.sourceAssertionOrdinal as number) <= priorOrdinal) return false;
      priorOrdinals.set(key, assertion.sourceAssertionOrdinal as number);
      prior = order;
    }
    return true;
  };
  const sameSourceRelationAssertion = (left: unknown, right: unknown): boolean => {
    if (!isRecord(left) || !isRecord(right) ||
      left.assertionScope !== right.assertionScope ||
      left.sourceSenseId !== right.sourceSenseId ||
      left.sourceSenseOrdinal !== right.sourceSenseOrdinal ||
      left.sourceSenseIdentityStatus !== right.sourceSenseIdentityStatus ||
      left.sourceAssertionOrdinal !== right.sourceAssertionOrdinal ||
      !isStringArray(left.reasonCodes) || !isStringArray(right.reasonCodes)) return false;
    const leftReasons = left.reasonCodes;
    const rightReasons = right.reasonCodes;
    return leftReasons.length === rightReasons.length &&
      leftReasons.every((reason, index) => reason === rightReasons[index]);
  };
  const normalizeAlbanianRelationForm = (form: string): string =>
    form.normalize("NFC").trim().toLocaleLowerCase("sq-AL");
  const sameNormalizedAlbanianRelationForm = (left: unknown, right: unknown): boolean =>
    typeof left === "string" && typeof right === "string" &&
    normalizeAlbanianRelationForm(left) === normalizeAlbanianRelationForm(right);
  const exactLexicalSourceStatus = value.exactLexicalSourceStatus;
  const exactLexicalSourceFacts = value.exactLexicalSourceFacts;
  const validSourceAuthoredSuffixTemplateReading = (
    componentReading: unknown,
    expectedTarget?: unknown,
  ): boolean => {
    if (!isRecord(componentReading) || !isRecord(componentReading.relation) ||
      componentReading.relation.relation !== "SOURCE_AUTHORED_SUFFIX_TEMPLATE" ||
      !isRecord(componentReading.primary)) return false;
    const relation = componentReading.relation;
    const relationReferences = relation.references as unknown[];
    const primary = componentReading.primary;
    if (typeof primary.sourceRecordId !== "string" || typeof primary.entryLocator !== "string" ||
      typeof primary.form !== "string" || typeof primary.physicalRecordOrdinal !== "number" ||
      (primary.etymologyText !== null && typeof primary.etymologyText !== "string") ||
      !Array.isArray(primary.etymologyLinks) || !Array.isArray(primary.etymologyTemplates) ||
      relation.primarySourceRecordId !== primary.sourceRecordId ||
      relation.primaryEntryLocator !== primary.entryLocator ||
      relation.sourceAuthoredExplanation !== primary.etymologyText ||
      !Array.isArray(relation.references) || relationReferences.length !== 2) return false;
    if (expectedTarget !== undefined && (!isRecord(expectedTarget) ||
      expectedTarget.sourceRecordId !== primary.sourceRecordId ||
      expectedTarget.entryLocator !== primary.entryLocator || expectedTarget.form !== primary.form)) return false;

    const exactFacts = Array.isArray(exactLexicalSourceFacts)
      ? exactLexicalSourceFacts.filter((fact) => isRecord(fact) &&
        fact.sourceRecordId === primary.sourceRecordId && fact.entryLocator === primary.entryLocator &&
        fact.form === primary.form)
      : [];
    if (exactFacts.length !== 1) return false;
    const raw = exactFacts[0];
    if (!isRecord(raw) || raw.physicalRecordOrdinal !== primary.physicalRecordOrdinal ||
      raw.partOfSpeech !== primary.partOfSpeech || (raw.etymologyText ?? null) !== primary.etymologyText ||
      !Array.isArray(raw.etymologyLinks) || !Array.isArray(raw.etymologyTemplates)) return false;

    const projectedLinks = primary.etymologyLinks as unknown[];
    const rawLinks = raw.etymologyLinks as unknown[];
    const projectedTemplates = primary.etymologyTemplates as unknown[];
    const rawTemplates = raw.etymologyTemplates as unknown[];
    const sameTemplate = (left: unknown, right: unknown): boolean => {
      if (!isRecord(left) || !isRecord(right) || !isRecord(left.args) || !isRecord(right.args)) return false;
      const leftArgs = left.args as Record<string, unknown>;
      const rightArgs = right.args as Record<string, unknown>;
      return left.name === right.name && left.expansion === right.expansion &&
        Object.keys(leftArgs).sort().join("\u0000") === Object.keys(rightArgs).sort().join("\u0000") &&
        Object.entries(leftArgs).every(([key, item]) => rightArgs[key] === item);
    };
    if (rawLinks.length !== projectedLinks.length || !rawLinks.every((link, index) =>
      isRecord(link) && isRecord(projectedLinks[index]) &&
      link.sourceForm === projectedLinks[index].sourceForm && link.reference === projectedLinks[index].reference) ||
      rawTemplates.length !== projectedTemplates.length ||
      !rawTemplates.every((template, index) => sameTemplate(template, projectedTemplates[index]))) return false;

    const suffixTemplates = projectedTemplates.filter((template) => isRecord(template) && template.name === "suffix");
    if (projectedTemplates.length !== 1 || suffixTemplates.length !== 1 ||
      !isRecord(suffixTemplates[0]) || !isRecord(suffixTemplates[0].args) ||
      typeof suffixTemplates[0].expansion !== "string") return false;
    const template = suffixTemplates[0] as Record<string, unknown>;
    const templateExpansion = template.expansion as string;
    const args = template.args as Record<string, unknown>;
    const argumentKeys = Object.keys(args).sort();
    const base = typeof args["2"] === "string" ? args["2"].normalize("NFC").trim() : "";
    const bareSuffix = typeof args["3"] === "string" ? args["3"].normalize("NFC").trim() : "";
    if (argumentKeys.join(",") !== "1,2,3" || args["1"] !== "sq" || !base || !bareSuffix ||
      bareSuffix.startsWith("-")) return false;
    const componentForms = [base, `-${bareSuffix}`];
    const normalizeText = (text: string): string =>
      text.normalize("NFC").trim().replace(/\s+/gu, " ").toLocaleLowerCase("sq-AL");
    const expectedExpansion = `${base} + -${bareSuffix}`;
    const explanation = typeof primary.etymologyText === "string"
      ? normalizeText(primary.etymologyText).replace(/[.!?]+$/u, "")
      : "";
    if (normalizeText(templateExpansion) !== normalizeText(expectedExpansion) ||
      explanation !== normalizeText(`From ${expectedExpansion}`) || rawLinks.length !== 2 ||
      projectedLinks.length !== 2) return false;

    return componentForms.every((form, index) => {
      const reference = relationReferences[index];
      const projected = projectedLinks[index];
      const rawLink = rawLinks[index];
      return isRecord(reference) && isRecord(projected) && isRecord(rawLink) &&
        reference.sourceForm === form && reference.reference === `${form}#Albanian` &&
        projected.sourceForm === form && projected.reference === reference.reference &&
        rawLink.sourceForm === form && rawLink.reference === reference.reference;
    });
  };
  const validExactLexicalSourceFact = (fact: unknown): boolean => {
    if (!isRecord(fact) || !isRecord(fact.sourceSnapshot) || !Array.isArray(fact.senses) || !Array.isArray(fact.ipaObservations)) {
      return false;
    }
    return (
      typeof fact.sourceRecordId === "string" &&
      typeof fact.entryLocator === "string" &&
      typeof fact.physicalRecordOrdinal === "number" &&
      Number.isInteger(fact.physicalRecordOrdinal) &&
      fact.physicalRecordOrdinal >= 0 &&
      fact.language === "Albanian" &&
      fact.languageCode === "sq" &&
      typeof fact.form === "string" &&
      (fact.partOfSpeech === null || typeof fact.partOfSpeech === "string") &&
      fact.senses.every((sense) =>
        isRecord(sense) &&
        (sense.senseId === null || typeof sense.senseId === "string") &&
        isStringArray(sense.glosses) &&
        (sense.synonyms === undefined || isStringArray(sense.synonyms))
      ) &&
      fact.ipaObservations.every((observation) =>
        isRecord(observation) &&
        typeof observation.soundIndex === "number" &&
        Number.isInteger(observation.soundIndex) &&
        observation.soundIndex >= 0 &&
        (observation.ipa === null || typeof observation.ipa === "string") &&
        isStringArray(observation.tags)
      ) &&
      (fact.etymologyText === undefined || fact.etymologyText === null || typeof fact.etymologyText === "string") &&
      (fact.etymologyLinks === undefined || (
        Array.isArray(fact.etymologyLinks) && fact.etymologyLinks.every((link) =>
          isRecord(link) &&
          typeof link.sourceForm === "string" &&
          typeof link.reference === "string"
        )
      )) &&
      (fact.etymologyTemplates === undefined || (
        Array.isArray(fact.etymologyTemplates) && fact.etymologyTemplates.every((template) =>
          isRecord(template) &&
          typeof template.name === "string" &&
          isRecord(template.args) &&
          Object.values(template.args).every((value) => typeof value === "string") &&
          typeof template.expansion === "string"
        )
      )) &&
      (fact.relatedForms === undefined || (
        Array.isArray(fact.relatedForms) && validExactRelationEdges(fact.relatedForms, fact.senses)
      )) &&
      fact.sourceStatus === "observed_external_snapshot" &&
      fact.attestationTruth === "fact" &&
      fact.pronunciationAuthority === "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE" &&
      fact.sourceSnapshot.sourceFamilyId === ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1 &&
      fact.sourceSnapshot.sourceUrl === ALBANIAN_KAIKKI_LEXICAL_SOURCE_URL_V0_1 &&
      fact.sourceSnapshot.sha256 === ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1 &&
      fact.sourceSnapshot.bytes === ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1
    );
  };
  const validSourceIpaSevenVoiceAnalysis = (analysis: unknown): boolean => {
    if (!isRecord(analysis) || !isRecord(analysis.sourceSnapshot) || !isRecord(analysis.nonVoiceFeatures) || !Array.isArray(analysis.nuclei)) {
      return false;
    }
    const canonicalCategories = new Set<string>(SEVEN_VOICE_PHONOLOGICAL_CATEGORY_VALUES_V0_1);
    const isCanonicalVoice = (voice: unknown): boolean => isVowelVoice(voice);
    const isCanonicalCategory = (category: unknown): boolean =>
      typeof category === "string" && canonicalCategories.has(category);
    const validNucleus = (nucleus: unknown): boolean =>
      isRecord(nucleus) &&
      typeof nucleus.order === "number" &&
      Number.isInteger(nucleus.order) &&
      nucleus.order >= 0 &&
      typeof nucleus.raw === "string" &&
      typeof nucleus.baseSymbol === "string" &&
      isStringArray(nucleus.combiningMarks) &&
      (nucleus.category === null || isCanonicalCategory(nucleus.category)) &&
      (nucleus.voice === null || isCanonicalVoice(nucleus.voice)) &&
      (nucleus.status === "SUPPORTED" || nucleus.status === "NULL") &&
      isStringArray(nucleus.reasonCodes) &&
      (nucleus.status === "SUPPORTED"
        ? nucleus.category !== null &&
          nucleus.voice !== null &&
          nucleus.reasonCodes.length === 0 &&
          SEVEN_VOICE_CATEGORY_TO_VOICE_V0_1[nucleus.category as keyof typeof SEVEN_VOICE_CATEGORY_TO_VOICE_V0_1] === nucleus.voice
        : nucleus.category === null &&
          nucleus.voice === null &&
          nucleus.reasonCodes.length > 0);
    const nuclei = analysis.nuclei;
    const voicePath = analysis.voicePath;
    const hasCanonicalVoicePath = isStringArray(voicePath) && voicePath.every(isCanonicalVoice);
    const hasValidStatusRelationship =
      analysis.status === "SUPPORTED"
        ? hasCanonicalVoicePath &&
          voicePath.length > 0 &&
          voicePath.length === nuclei.length &&
          nuclei.every((nucleus) => isRecord(nucleus) && nucleus.status === "SUPPORTED") &&
          nuclei.every((nucleus, index) => nucleus.voice === voicePath[index])
        : hasCanonicalVoicePath && voicePath.length === 0;
    const valid = (
      analysis.schemaVersion === "open-instrument.albanian-kaikki-source-ipa-seven-voice-product-interpretation.v0_1" &&
      analysis.interpretationId === "ALBANIAN_KAIKKI_SOURCE_IPA_SEVEN_VOICE_PRODUCT_INTERPRETATION_V0_1" &&
      (analysis.status === "SUPPORTED" || analysis.status === "NULL") &&
      analysis.authorityBoundary === "CURRENT_KAIKKI_IPA_SOURCE_DERIVED_PRODUCT_INTERPRETATION_NOT_FROZEN_PRONUNCIATION_AUTHORITY" &&
      analysis.sourcePronunciationAuthority === "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE" &&
      typeof analysis.sourceRecordId === "string" &&
      typeof analysis.entryLocator === "string" &&
      typeof analysis.physicalRecordOrdinal === "number" &&
      Number.isInteger(analysis.physicalRecordOrdinal) &&
      analysis.physicalRecordOrdinal >= 0 &&
      typeof analysis.form === "string" &&
      typeof analysis.soundIndex === "number" &&
      Number.isInteger(analysis.soundIndex) &&
      analysis.soundIndex >= 0 &&
      isStringArray(analysis.tags) &&
      (analysis.rawIpa === null || typeof analysis.rawIpa === "string") &&
      (analysis.pronunciationBody === null || typeof analysis.pronunciationBody === "string") &&
      (analysis.notationKind === "PHONEMIC" || analysis.notationKind === "PHONETIC" || analysis.notationKind === "UNSPECIFIED" || analysis.notationKind === "NULL") &&
      isStringArray(analysis.nonVoiceFeatures.stressMarkers) &&
      isStringArray(analysis.nonVoiceFeatures.lengthMarkers) &&
      isStringArray(analysis.nonVoiceFeatures.nasalizationMarks) &&
      (analysis.nucleusStructure === "MONOPHTHONG_NUCLEUS" || analysis.nucleusStructure === "SEQUENTIAL_NUCLEI" || analysis.nucleusStructure === "UNRESOLVED_NUCLEUS_STRUCTURE" || analysis.nucleusStructure === "NULL") &&
      hasValidStatusRelationship &&
      isStringArray(analysis.reasonCodes) &&
      (analysis.status === "SUPPORTED" ? analysis.reasonCodes.length === 0 : analysis.reasonCodes.length > 0) &&
      isStringArray(analysis.authorityRefs) &&
      typeof analysis.sourceSnapshot.sourceFamilyId === "string" &&
      typeof analysis.sourceSnapshot.sourceUrl === "string" &&
      typeof analysis.sourceSnapshot.sha256 === "string" &&
      analysis.sourceSnapshot.bytes === 67438537 &&
      analysis.nuclei.every(validNucleus)
    );
    return valid;
  };
  const validAlbanianLexicalReading = (reading: unknown, exactSourceFacts: unknown): boolean => {
    if (!isRecord(reading) || (reading.status !== "SUPPORTED" && reading.status !== "NULL") || !Array.isArray(reading.relatedForms) || !isRecord(reading.interpretation)) {
      return false;
    }
    const primary = reading.primarySourceFact;
    const pronunciation = reading.sourcePronunciation;
    const exactPrimarySourceFacts = isRecord(primary) && Array.isArray(exactSourceFacts)
      ? exactSourceFacts.filter((fact) => isRecord(fact) &&
          fact.sourceRecordId === primary.sourceRecordId && fact.entryLocator === primary.entryLocator && fact.form === primary.form)
      : [];
    const exactPrimarySourceFact = exactPrimarySourceFacts.length === 1 && isRecord(exactPrimarySourceFacts[0])
      ? exactPrimarySourceFacts[0]
      : null;
    const primaryRecord = isRecord(primary) ? primary : null;
    const validPrimary = primary === null || (
      isRecord(primary) &&
      typeof primary.sourceRecordId === "string" &&
      typeof primary.entryLocator === "string" &&
      typeof primary.form === "string" &&
      (primary.partOfSpeech === null || typeof primary.partOfSpeech === "string") &&
      (primary.etymologyText === null || typeof primary.etymologyText === "string") &&
      isStringArray(primary.meaningGlosses)
    );
    const validPronunciation = pronunciation === null || (
      isRecord(pronunciation) &&
      typeof pronunciation.sourceRecordId === "string" &&
      typeof pronunciation.soundIndex === "number" &&
      Number.isInteger(pronunciation.soundIndex) &&
      (pronunciation.rawIpa === null || typeof pronunciation.rawIpa === "string") &&
      (pronunciation.status === "SUPPORTED" || pronunciation.status === "NULL") &&
      isStringArray(pronunciation.voicePath) &&
      isStringArray(pronunciation.reasonCodes)
    );
    const sourceSensesForProjectedRelation = (relation: Record<string, unknown>): unknown => {
      if (exactPrimarySourceFact) return exactPrimarySourceFact.senses;
      if (relation.sourceRelationAssertion === undefined || !Array.isArray(reading.relatedCandidateEvaluations) ||
        typeof primaryRecord?.sourceRecordId !== "string") return undefined;
      const matches = reading.relatedCandidateEvaluations.filter((candidate) =>
        isRecord(candidate) && candidate.sourceRelation === relation.relation &&
        sameNormalizedAlbanianRelationForm(candidate.relatedForm, relation.form) &&
        sameSourceRelationAssertion(candidate.sourceRelationAssertion, relation.sourceRelationAssertion) &&
        isRecord(candidate.sourceLinkedComparison) && isRecord(candidate.sourceLinkedComparison.primary) &&
        isRecord(candidate.sourceLinkedComparison.relation) &&
        candidate.sourceLinkedComparison.primary.sourceRecordId === primaryRecord.sourceRecordId &&
        candidate.sourceLinkedComparison.primary.entryLocator === primaryRecord.entryLocator &&
        candidate.sourceLinkedComparison.relation.primarySourceRecordId === primaryRecord.sourceRecordId &&
        candidate.sourceLinkedComparison.relation.primaryEntryLocator === primaryRecord.entryLocator &&
        candidate.sourceLinkedComparison.relation.relation === relation.relation &&
        sameNormalizedAlbanianRelationForm(candidate.sourceLinkedComparison.relation.relatedForm, relation.form),
      );
      if (matches.length !== 1) return undefined;
      const comparison = (matches[0] as Record<string, unknown>).sourceLinkedComparison;
      return isRecord(comparison) && isRecord(comparison.primary) ? comparison.primary.sourceSenses : undefined;
    };
    const validRelated = reading.relatedForms.every((relation) => {
      if (!isRecord(relation) || typeof relation.form !== "string" || typeof relation.entryLocator !== "string" ||
        (relation.relation !== "SOURCE_RELATED_FORM" && relation.relation !== "SOURCE_DERIVED_FORM") ||
        (relation.resolution !== "RESOLVED" && relation.resolution !== "UNRESOLVED") ||
        (relation.sourceRecordId !== null && typeof relation.sourceRecordId !== "string") ||
        (relation.partOfSpeech !== null && typeof relation.partOfSpeech !== "string") ||
        (relation.etymologyText !== null && typeof relation.etymologyText !== "string") ||
        !isStringArray(relation.meaningGlosses)) return false;
      return relation.sourceRelationAssertion === undefined || validSourceRelationAssertion(
        relation.sourceRelationAssertion,
        sourceSensesForProjectedRelation(relation),
      );
    });
    const validCompositionStructure = (structure: unknown): boolean => {
      if (structure === null) return true;
      if (!isRecord(structure)) return false;
      const validStringArray = (value: unknown): boolean =>
        Array.isArray(value) && value.every((item) => typeof item === "string");
      return typeof structure.sourceRecordId === "string" &&
        typeof structure.entryLocator === "string" &&
        typeof structure.form === "string" &&
        typeof structure.soundIndex === "number" && Number.isInteger(structure.soundIndex) && structure.soundIndex >= 0 &&
        typeof structure.rawIpa === "string" &&
        validStringArray(structure.voicePath) &&
        validStringArray(structure.prefixConsonants) &&
        Array.isArray(structure.interNucleusConsonants) &&
        structure.interNucleusConsonants.every(validStringArray) &&
        validStringArray(structure.suffixConsonants) &&
        typeof structure.structuralSignature === "string" &&
        typeof structure.authorityBoundary === "string";
    };
    const composition = reading.composition;
    const validComposition = isRecord(composition) &&
      (composition.status === "SUPPORTED" || composition.status === "NULL") &&
      (composition.relatedForm === null || typeof composition.relatedForm === "string") &&
      isRecord(composition.sourceRelation) &&
      (composition.sourceRelation.status === "SOURCE_EXPLICIT_RELATION" || composition.sourceRelation.status === "SOURCE_RELATION_NOT_VERIFIED") &&
      (composition.sourceRelation.sourceRecordId === null || typeof composition.sourceRelation.sourceRecordId === "string") &&
      (composition.sourceRelation.entryLocator === null || typeof composition.sourceRelation.entryLocator === "string") &&
      (composition.sourceRelation.evidenceText === null || typeof composition.sourceRelation.evidenceText === "string") &&
      validCompositionStructure(composition.primaryStructure) &&
      validCompositionStructure(composition.relatedStructure) &&
      isRecord(composition.interpretation) &&
      (composition.interpretation.status === "EXPLORATORY_ZHEJI_READING" || composition.interpretation.status === "UNKNOWN_OR_NULL") &&
      (composition.interpretation.statement === null || typeof composition.interpretation.statement === "string") &&
      isStringArray(composition.interpretation.alternatives) &&
      isStringArray(composition.interpretation.basis) &&
      typeof composition.interpretation.claimBoundary === "string";
    const validSourceLinkedPronunciation = (variant: unknown): boolean => {
      if (!isRecord(variant) || !isRecord(variant.consonantalContext)) return false;
      const context = variant.consonantalContext;
      const validConsonantSegment = (value: unknown): boolean =>
        isRecord(value) &&
        typeof value.raw === "string" &&
        value.raw.length > 0 &&
        typeof value.baseSymbol === "string" &&
        value.baseSymbol.length > 0 &&
        typeof value.optional === "boolean";
      const validConsonantSegmentArray = (value: unknown): boolean =>
        Array.isArray(value) && value.every(validConsonantSegment);
      const validStringArrayOrNull = (value: unknown): boolean =>
        value === null || validConsonantSegmentArray(value);
      return typeof variant.soundIndex === "number" &&
        Number.isInteger(variant.soundIndex) &&
        variant.soundIndex >= 0 &&
        (variant.rawIpa === null || typeof variant.rawIpa === "string") &&
        isStringArray(variant.tags) &&
        (variant.status === "SUPPORTED" || variant.status === "NULL") &&
        isStringArray(variant.voicePath) &&
        isStringArray(variant.reasonCodes) &&
        (context.status === "SUPPORTED" || context.status === "NULL") &&
        typeof context.authorityBoundary === "string" &&
        validStringArrayOrNull(context.prefixConsonants) &&
        (context.interNucleusConsonants === null || (
          Array.isArray(context.interNucleusConsonants) &&
          context.interNucleusConsonants.every(validConsonantSegmentArray)
        )) &&
        validStringArrayOrNull(context.suffixConsonants) &&
        (context.structuralSignature === null || typeof context.structuralSignature === "string") &&
        isStringArray(context.reasonCodes);
    };
    const validSourceCategory = (category: unknown): boolean =>
      isRecord(category) &&
      typeof category.name === "string" &&
      (category.kind === null || typeof category.kind === "string") &&
      isStringArray(category.parents) &&
      (category.source === null || typeof category.source === "string") &&
      (category.orig === null || typeof category.orig === "string") &&
      (category.langcode === null || typeof category.langcode === "string") &&
      (category._dis === null || typeof category._dis === "string");
    const validSourceSenses = (value: unknown): boolean => value === undefined || (
      Array.isArray(value) && value.every((sense, sourceSenseOrdinal) =>
        isRecord(sense) &&
        (sense.senseId === null || typeof sense.senseId === "string") &&
        (sense.sourceSenseOrdinal === undefined ||
          (Number.isInteger(sense.sourceSenseOrdinal) && sense.sourceSenseOrdinal === sourceSenseOrdinal)) &&
        isStringArray(sense.glosses) &&
        (sense.synonyms === undefined || isStringArray(sense.synonyms)) &&
        Array.isArray(sense.categories) &&
        sense.categories.every(validSourceCategory),
      )
    );
    const validSourceLinkedRecord = (record: unknown): record is Record<string, unknown> => {
      if (!isRecord(record) || !Array.isArray(record.etymologyLinks) || !Array.isArray(record.etymologyTemplates) || !Array.isArray(record.pronunciationVariants)) {
        return false;
      }
      return typeof record.sourceRecordId === "string" &&
        typeof record.entryLocator === "string" &&
        typeof record.physicalRecordOrdinal === "number" &&
        Number.isInteger(record.physicalRecordOrdinal) &&
        record.physicalRecordOrdinal >= 0 &&
        typeof record.form === "string" &&
        (record.partOfSpeech === null || typeof record.partOfSpeech === "string") &&
        isStringArray(record.meaningGlosses) &&
        validSourceSenses(record.sourceSenses) &&
        (record.etymologyText === null || typeof record.etymologyText === "string") &&
        record.etymologyLinks.every((link) =>
          isRecord(link) && typeof link.sourceForm === "string" && typeof link.reference === "string",
        ) &&
        record.etymologyTemplates.every((template) =>
          isRecord(template) &&
          typeof template.name === "string" &&
          isRecord(template.args) &&
          Object.values(template.args).every((value) => typeof value === "string") &&
          typeof template.expansion === "string",
        ) &&
        record.pronunciationVariants.every(validSourceLinkedPronunciation);
    };
    const validSenseAlignedLexicalRole = (value: unknown): boolean => {
      if (value === undefined) return true;
      if (!isRecord(value) || value.schemaVersion !== ALBANIAN_SENSE_ALIGNED_LEXICAL_ROLE_SCHEMA_V0_1 ||
        (value.status !== "SUPPORTED" && value.status !== "NULL") ||
        (value.targetSourceRecordId !== null && typeof value.targetSourceRecordId !== "string") ||
        !Array.isArray(value.candidates) || !isStringArray(value.reasonCodes) ||
        !isStringArray(value.alternatives) ||
        value.lineageIndependence !== ALBANIAN_SENSE_ALIGNED_LEXICAL_ROLE_LINEAGE_STATUS_V0_1 ||
        value.functionalOperation !== null || value.noSingleWinner !== true ||
        value.userDecisionPosture !== "user_decides" || typeof value.claimBoundary !== "string") return false;

      const exactFacts = Array.isArray(exactSourceFacts) ? exactSourceFacts : [];
      let supportedCount = 0;
      for (const candidate of value.candidates) {
        if (!isRecord(candidate) || !isRecord(candidate.sourceFact) || !isRecord(candidate.inference) ||
          candidate.functionalOperation !== null || !isStringArray(candidate.reasonCodes)) return false;
        const sourceFact = candidate.sourceFact;
        const sourceSenseOrdinal = sourceFact.sourceSenseOrdinal;
        const sourceSenseId = sourceFact.sourceSenseId;
        const sourceGlosses = sourceFact.glosses;
        const synonymOrdinal = sourceFact.synonymOrdinal;
        const synonym = sourceFact.synonym;
        if (typeof sourceFact.sourceRecordId !== "string" || typeof sourceFact.entryLocator !== "string" ||
          sourceFact.sourceFamilyId !== ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1 ||
          sourceFact.sourceUrl !== ALBANIAN_KAIKKI_LEXICAL_SOURCE_URL_V0_1 ||
          sourceFact.sourceSha256 !== ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1 ||
          sourceFact.sourceBytes !== ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1 ||
          typeof sourceFact.form !== "string" || typeof sourceSenseOrdinal !== "number" ||
          !Number.isInteger(sourceSenseOrdinal) || sourceSenseOrdinal < 0 ||
          (sourceSenseId !== null && typeof sourceSenseId !== "string") ||
          !isStringArray(sourceGlosses) ||
          (synonymOrdinal !== null && (typeof synonymOrdinal !== "number" || !Number.isInteger(synonymOrdinal) || synonymOrdinal < 0)) ||
          (synonym !== null && typeof synonym !== "string")) return false;
        const linkedFacts = exactFacts.filter((fact) => isRecord(fact) &&
          fact.sourceRecordId === sourceFact.sourceRecordId && fact.entryLocator === sourceFact.entryLocator &&
          fact.form === sourceFact.form);
        if (linkedFacts.length !== 1 || !isRecord(linkedFacts[0]) || !Array.isArray(linkedFacts[0].senses) ||
          !isRecord(linkedFacts[0].sourceSnapshot) ||
          linkedFacts[0].sourceSnapshot.sha256 !== ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1 ||
          linkedFacts[0].sourceSnapshot.sourceFamilyId !== ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1 ||
          linkedFacts[0].sourceSnapshot.bytes !== ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1 ||
          value.targetSourceRecordId !== sourceFact.sourceRecordId) return false;
        const linkedSense = linkedFacts[0].senses[sourceSenseOrdinal];
        if (!isRecord(linkedSense) || linkedSense.senseId !== sourceSenseId ||
          !Array.isArray(linkedSense.glosses) || linkedSense.glosses.length !== sourceGlosses.length ||
          !linkedSense.glosses.every((gloss, index) => gloss === sourceGlosses[index])) return false;
        if (synonym === null) {
          if (synonymOrdinal !== null) return false;
        } else {
          if (typeof synonymOrdinal !== "number" || !Number.isInteger(synonymOrdinal) || !Array.isArray(linkedSense.synonyms) ||
            linkedSense.synonyms[synonymOrdinal] !== synonym) return false;
        }

        let reviewedRule: typeof ALBANIAN_SENSE_ALIGNED_LEXICAL_ROLE_REVIEWED_DEFINITIONS_V0_1[number] | null = null;
        if (candidate.crossSourceFact !== null) {
          const cross = candidate.crossSourceFact;
          if (!isRecord(cross)) return false;
          const definitions = cross.definitions;
          if (typeof cross.sourceRecordId !== "string" ||
            cross.sourceFamilyId !== ALBANET_SOURCE_FAMILY_ID_V0_1 ||
            cross.sourceTitle !== ALBANET_SOURCE_TITLE_V0_1 ||
            cross.sourceRevision !== ALBANET_SOURCE_REVISION_V0_1 ||
            cross.sourceUrl !== ALBANET_SOURCE_REPOSITORY_V0_1 ||
            cross.sourceSha256 !== ALBANET_SOURCE_FILE_SHA256_V0_1 ||
            typeof cross.entryLocator !== "string" || typeof cross.lemma !== "string" ||
            typeof cross.synsetId !== "string" || !isStringArray(definitions) ||
            cross.sourceRecordId !== `${ALBANET_SOURCE_FAMILY_ID_V0_1}:${cross.synsetId}:lemma=${encodeURIComponent(cross.lemma)}` ||
            cross.entryLocator !== `${ALBANET_SOURCE_FILE_RELATIVE_PATH_V0_1}#synset=${cross.synsetId};lemma=${encodeURIComponent(cross.lemma)}` ||
            synonym === null ||
            cross.lemma.normalize("NFC").trim().toLocaleLowerCase("en-US").normalize("NFC") !==
              synonym.normalize("NFC").trim().toLocaleLowerCase("en-US").normalize("NFC")) return false;
          if (definitions.length === 1) {
            reviewedRule = ALBANIAN_SENSE_ALIGNED_LEXICAL_ROLE_REVIEWED_DEFINITIONS_V0_1.find((rule) =>
              rule.lemma === cross.lemma && rule.synsetId === cross.synsetId &&
              rule.definition === definitions[0] && rule.sourceFamilyId === cross.sourceFamilyId &&
              rule.sourceRevision === cross.sourceRevision && rule.sourceSha256 === cross.sourceSha256 &&
              rule.sourceTitle === cross.sourceTitle && rule.sourceUrl === cross.sourceUrl &&
              rule.reviewStatus === "REVIEWED_EXACT_SOURCE_DEFINITION",
            ) ?? null;
          }
        }
        if (candidate.inference.status === "SUPPORTED") {
          supportedCount += 1;
          const ownerOccurrences = linkedFacts[0].senses.flatMap((sense, senseOrdinal) =>
            isRecord(sense) && Array.isArray(sense.synonyms)
              ? sense.synonyms.flatMap((synonym, synonymOrdinal) =>
                  typeof synonym === "string" && typeof sourceFact.synonym === "string" &&
                  synonym.normalize("NFC").trim().toLocaleLowerCase("en-US").normalize("NFC") ===
                    sourceFact.synonym.normalize("NFC").trim().toLocaleLowerCase("en-US").normalize("NFC")
                    ? [{ senseOrdinal, synonymOrdinal }]
                    : [],
                )
              : [],
          );
          if (candidate.inference.roleLabel !== "HUMAN_ROLE" ||
            candidate.inference.predicateId !== ALBANIAN_SENSE_ALIGNED_LEXICAL_ROLE_PREDICATE_ID_V0_1 ||
            typeof candidate.inference.statement !== "string" || candidate.reasonCodes.length !== 0 ||
            !reviewedRule || sourceSenseId === null || ownerOccurrences.length !== 1 ||
            ownerOccurrences[0]?.senseOrdinal !== sourceSenseOrdinal ||
            ownerOccurrences[0]?.synonymOrdinal !== synonymOrdinal) return false;
        } else if (candidate.inference.status !== "UNKNOWN_OR_NULL" ||
          candidate.inference.roleLabel !== null || candidate.inference.predicateId !== null ||
          candidate.inference.statement !== null || candidate.reasonCodes.length === 0) {
          return false;
        }
      }
      return (value.status === "SUPPORTED") === (supportedCount > 0) &&
        (supportedCount > 0 ? value.reasonCodes.length === 0 : value.reasonCodes.length > 0);
    };
    const validFiveWindowsComparison = reading.fiveWindowsComparison === undefined || reading.fiveWindowsComparison === null || (() => {
      const expectedForms = ["dritare", "fënjeshtër", "finestër", "penxhere", "derkë"];
      const comparison = reading.fiveWindowsComparison;
      if (!isRecord(comparison) || comparison.comparisonId !== "FIVE_WINDOWS" ||
        typeof comparison.queryForm !== "string" || !Array.isArray(comparison.members) || comparison.members.length !== expectedForms.length ||
        !isStringArray(comparison.alternatives) || typeof comparison.summary !== "string" || typeof comparison.claimBoundary !== "string") {
        return false;
      }
      const validRecord = (record: unknown): boolean => {
        if (!isRecord(record)) return false;
        const ipaObservations = record.ipaObservations;
        const sourceIpaSevenVoiceAnalyses = record.sourceIpaSevenVoiceAnalyses;
        if (!Array.isArray(ipaObservations) || !Array.isArray(sourceIpaSevenVoiceAnalyses) || !Array.isArray(record.etymologyLinks) || !Array.isArray(record.etymologyTemplates)) {
          return false;
        }
        return typeof record.sourceRecordId === "string" &&
          typeof record.entryLocator === "string" &&
          typeof record.physicalRecordOrdinal === "number" &&
          Number.isInteger(record.physicalRecordOrdinal) &&
          record.physicalRecordOrdinal >= 0 &&
          typeof record.form === "string" &&
          (record.partOfSpeech === null || typeof record.partOfSpeech === "string") &&
          isStringArray(record.meaningGlosses) &&
          (record.etymologyText === null || typeof record.etymologyText === "string") &&
          record.etymologyLinks.every((link) =>
            isRecord(link) && typeof link.sourceForm === "string" && typeof link.reference === "string",
          ) &&
          record.etymologyTemplates.every((template) =>
            isRecord(template) && typeof template.name === "string" && isRecord(template.args) &&
            Object.values(template.args).every((value) => typeof value === "string") && typeof template.expansion === "string",
          ) &&
          ipaObservations.every((observation) =>
            isRecord(observation) && typeof observation.soundIndex === "number" && Number.isInteger(observation.soundIndex) &&
            observation.soundIndex >= 0 && (observation.ipa === null || typeof observation.ipa === "string") &&
            isStringArray(observation.tags),
          ) &&
          sourceIpaSevenVoiceAnalyses.length === ipaObservations.length &&
          sourceIpaSevenVoiceAnalyses.every((analysis, index) =>
            validSourceIpaSevenVoiceAnalysis(analysis) &&
            isRecord(analysis) &&
            analysis.sourceRecordId === record.sourceRecordId &&
            analysis.entryLocator === record.entryLocator &&
            analysis.physicalRecordOrdinal === record.physicalRecordOrdinal &&
            analysis.form === record.form &&
            isRecord(ipaObservations[index]) &&
            analysis.soundIndex === ipaObservations[index].soundIndex,
          ) &&
          (record.classification === "ALBANIAN_INTERNAL_FORMATION" ||
            record.classification === "SOURCE_ATTRIBUTED_BORROWING" ||
            record.classification === "UNKNOWN_OR_NULL") &&
          (record.borrowedFromLanguage === null || typeof record.borrowedFromLanguage === "string") &&
          (record.ultimateSourceLanguage === null || typeof record.ultimateSourceLanguage === "string") &&
          isStringArray(record.usageNotes);
      };
      return comparison.members.every((member, index) =>
        isRecord(member) &&
        member.form === expectedForms[index] &&
        (member.status === "MATCHES_FOUND" || member.status === "SOURCE_NOT_FOUND" || member.status === "UNAVAILABLE") &&
        Array.isArray(member.records) && member.records.every(validRecord) &&
        isStringArray(member.reasonCodes),
      );
    })();
    const sourceLinkedComponentReading = reading.sourceLinkedComponentReading;
    const validSourceLinkedComponentReading = sourceLinkedComponentReading === undefined || sourceLinkedComponentReading === null || (() => {
      if (!isRecord(sourceLinkedComponentReading) ||
        !isRecord(sourceLinkedComponentReading.relation) ||
        !Array.isArray(sourceLinkedComponentReading.relation.references) ||
        !Array.isArray(sourceLinkedComponentReading.components) ||
        !Array.isArray(sourceLinkedComponentReading.componentResolutions)) return false;
      const componentRelation = sourceLinkedComponentReading.relation;
      const componentReferences = componentRelation.references as unknown[];
      const componentRecords = sourceLinkedComponentReading.components as unknown[];
      const componentResolutions = sourceLinkedComponentReading.componentResolutions as unknown[];
      const validRelationStatusCombination = (() => {
        if (!isStringArray(sourceLinkedComponentReading.reasonCodes)) {
          return false;
        }
        const relation = componentRelation.relation;
        const reasonCodes = sourceLinkedComponentReading.reasonCodes;
        const referenceCount = componentReferences.length;
        const componentCount = componentRecords.length;
        if (!Array.isArray(componentResolutions) || componentResolutions.length !== referenceCount) return false;
        const normalizedForm = (value: string): string =>
          value.normalize("NFC").trim().toLocaleLowerCase("sq-AL");
        const validResolution = componentResolutions.every((resolution, index) => {
          const reference = componentReferences[index];
          if (!isRecord(resolution) || !isRecord(reference) ||
            typeof resolution.sourceForm !== "string" ||
            resolution.sourceForm !== reference.sourceForm ||
            resolution.reference !== reference.reference ||
            (resolution.status !== "RESOLVED" && resolution.status !== "AMBIGUOUS" && resolution.status !== "UNRESOLVED") ||
            !Array.isArray(resolution.sourceRecordIds) ||
            !resolution.sourceRecordIds.every((sourceRecordId) => typeof sourceRecordId === "string" && sourceRecordId.length > 0) ||
            new Set(resolution.sourceRecordIds).size !== resolution.sourceRecordIds.length ||
            !isStringArray(resolution.reasonCodes)) return false;
          const sourceRecordIds = resolution.sourceRecordIds as string[];
          if ((resolution.status === "RESOLVED" && resolution.sourceRecordIds.length !== 1) ||
            (resolution.status === "AMBIGUOUS" && resolution.sourceRecordIds.length === 1) ||
            (resolution.status === "UNRESOLVED" && resolution.sourceRecordIds.length !== 0)) return false;
          const recordsForForm = componentRecords.filter((component): component is Record<string, unknown> =>
            isRecord(component) && typeof component.form === "string" &&
            normalizedForm(component.form) === normalizedForm(resolution.sourceForm as string),
          );
          return recordsForForm.length === sourceRecordIds.length &&
            recordsForForm.every((record, recordIndex) => record.sourceRecordId === sourceRecordIds[recordIndex]);
        });
        if (!validResolution) return false;
        const validSourceAuthoredAfTemplate = (): boolean => {
          if (relation !== "SOURCE_AUTHORED_AF_TEMPLATE") return true;
          const primary = sourceLinkedComponentReading.primary;
          if (!isRecord(primary) || typeof primary.sourceRecordId !== "string" ||
            typeof primary.entryLocator !== "string" || typeof primary.form !== "string" ||
            typeof primary.etymologyText !== "string" && primary.etymologyText !== null ||
            !Array.isArray(primary.etymologyLinks) || !Array.isArray(primary.etymologyTemplates) ||
            componentRelation.primarySourceRecordId !== primary.sourceRecordId ||
            componentRelation.primaryEntryLocator !== primary.entryLocator ||
            componentRelation.sourceAuthoredExplanation !== primary.etymologyText) return false;
          const projectedLinks = primary.etymologyLinks as unknown[];
          const projectedTemplates = primary.etymologyTemplates as unknown[];
          const primaryForm = primary.form as string;

          const exactPrimaryFacts = Array.isArray(exactLexicalSourceFacts)
            ? exactLexicalSourceFacts.filter((fact) => isRecord(fact) &&
              fact.sourceRecordId === primary.sourceRecordId && fact.entryLocator === primary.entryLocator &&
              fact.form === primary.form)
            : [];
          if (exactPrimaryFacts.length !== 1) return false;
          const rawPrimary = exactPrimaryFacts[0];
          const rawLinks = isRecord(rawPrimary) && Array.isArray(rawPrimary.etymologyLinks)
            ? rawPrimary.etymologyLinks
            : [];
          if (!isRecord(rawPrimary) || rawPrimary.physicalRecordOrdinal !== primary.physicalRecordOrdinal ||
            rawPrimary.partOfSpeech !== primary.partOfSpeech ||
            (rawPrimary.etymologyText ?? null) !== primary.etymologyText ||
            rawLinks.length !== projectedLinks.length ||
            !rawLinks.every((link, index) => isRecord(link) &&
              isRecord(projectedLinks[index]) &&
              link.sourceForm === projectedLinks[index].sourceForm &&
              link.reference === projectedLinks[index].reference)) return false;

          const templates = projectedTemplates;
          const afTemplates = templates.filter((template) => isRecord(template) && template.name === "af");
          if (afTemplates.length === 0) return false;
          const template = afTemplates[0];
          if (!isRecord(template) || !isRecord(template.args) || typeof template.expansion !== "string") return false;
          const rawTemplates = Array.isArray(rawPrimary.etymologyTemplates) ? rawPrimary.etymologyTemplates : [];
          const sameTemplate = (projected: unknown, raw: unknown): boolean =>
            isRecord(projected) && isRecord(raw) && projected.name === raw.name &&
            projected.expansion === raw.expansion && isRecord(projected.args) && isRecord(raw.args) &&
            (() => {
              const projectedArgs = projected.args as Record<string, unknown>;
              const rawArgs = raw.args as Record<string, unknown>;
              return Object.keys(projectedArgs).sort().join("\u0000") === Object.keys(rawArgs).sort().join("\u0000") &&
                Object.entries(projectedArgs).every(([key, value]) => rawArgs[key] === value);
            })();
          if (rawTemplates.length !== templates.length ||
            !templates.every((projected, index) => sameTemplate(projected, rawTemplates[index]))) return false;

          const templateArgs = template.args as Record<string, unknown>;
          const numericKeys = Object.keys(templateArgs).filter((key) => /^\d+$/u.test(key))
            .sort((left, right) => Number(left) - Number(right));
          const componentForms: string[] = numericKeys.filter((key) => Number(key) >= 2)
            .map((key) => templateArgs[key] as string);
          const normalizedComponentForms = componentForms.map((form) => form.normalize("NFC").trim());
          if (templateArgs["1"] !== "sq" || componentReferences.length !== componentForms.length ||
            !componentForms.every((form, index) => {
              const reference = componentReferences[index];
              return typeof form === "string" && form.trim().length > 0 &&
                isRecord(reference) && reference.sourceForm === normalizedComponentForms[index];
            })) return false;

          const auxiliaryKeys = Object.keys(templateArgs).filter((key) => !/^\d+$/u.test(key));
          const supportedArgumentSet = numericKeys.join(",") === "1,2,3" && componentForms.length === 2 &&
            auxiliaryKeys.every((key) => key === "t1" || key === "t2");
          const hasReason = (code: string): boolean => reasonCodes.includes(code);
          const ambiguousTemplate = afTemplates.length !== 1 || templates.length !== 1;
          if (hasReason("SOURCE_AF_TEMPLATE_AMBIGUOUS") !== ambiguousTemplate ||
            hasReason("SOURCE_AF_TEMPLATE_ARGUMENT_SET_INVALID") === supportedArgumentSet) return false;

          const normalized = (form: string): string => form.normalize("NFC").trim().toLocaleLowerCase("sq-AL");
          const formsInvalid = componentForms.length < 2 || normalizedComponentForms.some((form, index) =>
            normalizedComponentForms.indexOf(form) !== index ||
            normalized(form) === normalized(primaryForm),
          );
          const links = projectedLinks;
          const referenceProjectionConsistent = componentForms.every((form, index) => {
            const reference = componentReferences[index];
            const matching = links.filter((link) => isRecord(link) && typeof link.sourceForm === "string" &&
              normalized(link.sourceForm) === normalized(form));
            return isRecord(reference) && reference.reference === (isRecord(matching[0]) ? matching[0].reference : null);
          });
          if (!referenceProjectionConsistent) return false;
          const referenceSetMismatch = links.length !== componentForms.length;
          const referenceNotPresent = componentForms.some((form) => !links.some((link) =>
            isRecord(link) && typeof link.sourceForm === "string" && normalized(link.sourceForm) === normalized(form),
          ));
          const referenceAmbiguous = componentForms.some((form) => links.filter((link) =>
            isRecord(link) && typeof link.sourceForm === "string" && normalized(link.sourceForm) === normalized(form),
          ).length > 1);
          const referenceIdentityInvalid = componentForms.some((form, index) => {
            const matching = links.filter((link) => isRecord(link) && typeof link.sourceForm === "string" &&
              normalized(link.sourceForm) === normalized(form));
            if (matching.length === 0) return false;
            if (!isRecord(matching[0]) || typeof matching[0].reference !== "string") return true;
            const sourceReference = matching[0].reference as string;
            const separator = sourceReference.indexOf("#");
            return separator <= 0 || separator !== sourceReference.lastIndexOf("#") ||
              normalized(sourceReference.slice(0, separator)) !== normalized(form) ||
              sourceReference.slice(separator + 1) !== "Albanian";
          });
          if (hasReason("SOURCE_COMPONENT_FORMS_INVALID") !== formsInvalid ||
            hasReason("SOURCE_COMPONENT_REFERENCE_SET_MISMATCH") !== referenceSetMismatch ||
            hasReason("SOURCE_COMPONENT_REFERENCE_NOT_PRESENT") !== referenceNotPresent ||
            hasReason("SOURCE_COMPONENT_REFERENCE_AMBIGUOUS") !== referenceAmbiguous ||
            hasReason("SOURCE_COMPONENT_REFERENCE_IDENTITY_INVALID") !== referenceIdentityInvalid) return false;

          const resolutionReasonCodes = componentResolutions.flatMap((resolution) =>
            isRecord(resolution) && isStringArray(resolution.reasonCodes) ? resolution.reasonCodes : [],
          );
          if (resolutionReasonCodes.some((code) => !reasonCodes.includes(code)) ||
            componentResolutions.some((resolution) => {
              if (!isRecord(resolution) || !isStringArray(resolution.reasonCodes)) return false;
              const codes = resolution.reasonCodes;
              return resolution.status === "RESOLVED" && codes.length !== 0 ||
                resolution.status === "UNRESOLVED" && codes.length === 0 ||
                resolution.status === "AMBIGUOUS" &&
                  !codes.some((code) => code === "SOURCE_COMPONENT_RECORD_AMBIGUOUS" ||
                    code === "SOURCE_COMPONENT_RECORD_IDENTITY_DUPLICATE");
            })) return false;
          return componentRecords.length === componentResolutions.reduce<number>((total, resolution) =>
            total + (isRecord(resolution) && Array.isArray(resolution.sourceRecordIds) ? resolution.sourceRecordIds.length : 0), 0);
        };
        if (sourceLinkedComponentReading.status === "SUPPORTED") {
          return reasonCodes.length === 0 && (
            relation === "SOURCE_EXPLICIT_TWO_COMPONENT_COMPOUND" &&
              referenceCount === 2 && componentCount === 2 &&
              componentResolutions.every((resolution) => isRecord(resolution) && resolution.status === "RESOLVED") ||
            relation === "SOURCE_AUTHORED_AF_TEMPLATE" &&
              referenceCount === 2 && componentCount === 2 &&
              componentResolutions.every((resolution) => isRecord(resolution) && resolution.status === "RESOLVED") &&
              validSourceAuthoredAfTemplate() ||
            relation === "SOURCE_AUTHORED_SUFFIX_TEMPLATE" &&
              referenceCount === 2 && componentCount === 2 &&
              componentResolutions.every((resolution) => isRecord(resolution) && resolution.status === "RESOLVED") &&
              validSourceAuthoredSuffixTemplateReading(sourceLinkedComponentReading) ||
            relation === "SOURCE_EXPLICIT_THREE_COMPONENT_COMPOUND" &&
              referenceCount === 3 && componentCount >= 3 &&
              componentResolutions.every((resolution) => isRecord(resolution) &&
                (resolution.status === "RESOLVED" || resolution.status === "AMBIGUOUS"))
          );
        }
        if (sourceLinkedComponentReading.status !== "NULL") return false;
        if (relation === "SOURCE_EXPLICIT_TWO_COMPONENT_COMPOUND") {
          return !reasonCodes.includes("SOURCE_COMPOUND_ARITY_UNSUPPORTED") &&
            reasonCodes.length > 0 &&
            referenceCount === 2 &&
            componentCount === componentResolutions.reduce<number>((total, resolution) =>
              total + (isRecord(resolution) && Array.isArray(resolution.sourceRecordIds) ? resolution.sourceRecordIds.length : 0), 0);
        }
        if (relation === "SOURCE_AUTHORED_AF_TEMPLATE") {
          const primary = sourceLinkedComponentReading.primary;
          const template = isRecord(primary) && Array.isArray(primary.etymologyTemplates)
            ? primary.etymologyTemplates.find((candidate) => isRecord(candidate) && candidate.name === "af")
            : null;
          const args = isRecord(template) && isRecord(template.args) ? template.args : null;
          const componentArity = args
            ? Object.keys(args).filter((key) => /^\d+$/u.test(key) && Number(key) >= 2).length
            : -1;
          return reasonCodes.length > 0 && validSourceAuthoredAfTemplate() &&
            (componentArity === 2 || componentArity === 1 || componentArity === 3) &&
            (componentArity === 2 || reasonCodes.includes("SOURCE_AF_TEMPLATE_ARGUMENT_SET_INVALID"));
        }
        if (relation === "SOURCE_AUTHORED_SUFFIX_TEMPLATE") {
          return reasonCodes.length > 0 && referenceCount === 2 &&
            validSourceAuthoredSuffixTemplateReading(sourceLinkedComponentReading) &&
            componentCount === componentResolutions.reduce<number>((total, resolution) =>
              total + (isRecord(resolution) && Array.isArray(resolution.sourceRecordIds) ? resolution.sourceRecordIds.length : 0), 0);
        }
        if (relation === "SOURCE_EXPLICIT_THREE_COMPONENT_COMPOUND") {
          return reasonCodes.length > 0 && referenceCount === 3 && componentCount >= 0;
        }
        return relation === "SOURCE_COMPOUND_ARITY_UNSUPPORTED" &&
          reasonCodes.includes("SOURCE_COMPOUND_ARITY_UNSUPPORTED") &&
          referenceCount > 3;
      })();
      const functionalHypothesis = isRecord(sourceLinkedComponentReading)
        ? sourceLinkedComponentReading.functionalHypothesis
        : null;
      const sourceReadingRecord = sourceLinkedComponentReading as Record<string, unknown>;
      const sourceRelationRecord = sourceReadingRecord.relation as Record<string, unknown>;
      const validSupportedThreeComponentSourceIdentity =
        sourceReadingRecord.status !== "SUPPORTED" ||
        sourceRelationRecord.relation !== "SOURCE_EXPLICIT_THREE_COMPONENT_COMPOUND" || (() => {
          const primary = sourceReadingRecord.primary;
          const references = sourceRelationRecord.references as unknown[];
          if (!isRecord(primary) || typeof primary.sourceRecordId !== "string" ||
            typeof primary.entryLocator !== "string" ||
            sourceRelationRecord.primarySourceRecordId !== primary.sourceRecordId ||
            sourceRelationRecord.primaryEntryLocator !== primary.entryLocator ||
            typeof primary.etymologyText !== "string" ||
            !Array.isArray(primary.etymologyTemplates) ||
            !references.every((reference) => isRecord(reference) &&
              typeof reference.sourceForm === "string" &&
              reference.reference === reference.sourceForm + "#Albanian")) return false;
          const templates = (primary.etymologyTemplates as unknown[]).filter((template) =>
            isRecord(template) && template.name === "compound",
          );
          if (templates.length !== 1) return false;
          const template = templates[0];
          if (!isRecord(template) || !isRecord(template.args) ||
            typeof template.expansion !== "string" || template.args["1"] !== "sq") return false;
          const componentForms = references.map((reference) =>
            (reference as Record<string, unknown>).sourceForm as string,
          );
          const numericArgumentNumbers = Object.keys(template.args)
            .filter((argument) => /^\d+$/u.test(argument))
            .map(Number)
            .sort((left, right) => left - right);
          const normalizeTemplateText = (value: string): string =>
            value.normalize("NFC").trim().replace(/\s+/gu, " ").toLocaleLowerCase("sq-AL");
          return numericArgumentNumbers.join(",") === "1,2,3,4" &&
            template.args["2"] === componentForms[0] &&
            template.args["3"] === componentForms[1] &&
            template.args["4"] === componentForms[2] &&
            normalizeTemplateText(template.expansion) === normalizeTemplateText(componentForms.join(" + ")) &&
            normalizeTemplateText(primary.etymologyText).replace(/[.]$/u, "") ===
              normalizeTemplateText("From " + componentForms.join(" + "));
        })();
      const validFunctionalHypothesis = (() => {
        if (!isRecord(functionalHypothesis) ||
          (functionalHypothesis.status !== "EXPLORATORY_FUNCTIONAL_HYPOTHESIS" &&
            functionalHypothesis.status !== "UNKNOWN_OR_NULL") ||
          functionalHypothesis.functionalOperation !== null ||
          (functionalHypothesis.statement !== null && typeof functionalHypothesis.statement !== "string") ||
          !isStringArray(functionalHypothesis.basis) ||
          !isStringArray(functionalHypothesis.alternatives) ||
          !isStringArray(functionalHypothesis.reasonCodes) ||
          typeof functionalHypothesis.claimBoundary !== "string" ||
          functionalHypothesis.noSingleWinner !== true ||
          functionalHypothesis.userDecisionPosture !== "user_decides" ||
          !Array.isArray(functionalHypothesis.evidenceRefs)) return false;
        if (!Array.isArray(sourceLinkedComponentReading.components)) return false;
        const sourceRecords: unknown[] = [sourceLinkedComponentReading.primary, ...componentRecords];
        const validEvidenceRefs = functionalHypothesis.evidenceRefs.every((reference) =>
          isRecord(reference) &&
          typeof reference.sourceRecordId === "string" &&
          typeof reference.entryLocator === "string" &&
          isStringArray(reference.senseIds) &&
          sourceRecords.some((record) => isRecord(record) &&
            record.sourceRecordId === reference.sourceRecordId &&
            record.entryLocator === reference.entryLocator &&
            Array.isArray(record.sourceSenses) &&
            (reference.senseIds as string[]).every((senseId) => (record.sourceSenses as unknown[]).some((sense: unknown) =>
              isRecord(sense) && sense.senseId === senseId,
            )),
          ),
        );
        if (!validEvidenceRefs) return false;
        if (functionalHypothesis.status === "EXPLORATORY_FUNCTIONAL_HYPOTHESIS") {
          return sourceLinkedComponentReading.status === "SUPPORTED" &&
            sourceLinkedComponentReading.relation.relation === "SOURCE_EXPLICIT_THREE_COMPONENT_COMPOUND" &&
            typeof functionalHypothesis.statement === "string" && functionalHypothesis.statement.length > 0 &&
            functionalHypothesis.basis.length > 0 && functionalHypothesis.evidenceRefs.length > 0 &&
            functionalHypothesis.reasonCodes.length === 0;
        }
        return functionalHypothesis.statement === null;
      })();
      if (!isRecord(sourceLinkedComponentReading) ||
        (sourceLinkedComponentReading.status !== "SUPPORTED" && sourceLinkedComponentReading.status !== "NULL") ||
        !isStringArray(sourceLinkedComponentReading.reasonCodes) ||
        !isRecord(sourceLinkedComponentReading.relation) ||
        !validRelationStatusCombination ||
        !validSupportedThreeComponentSourceIdentity ||
        !validFunctionalHypothesis ||
        typeof sourceLinkedComponentReading.relation.primarySourceRecordId !== "string" ||
        typeof sourceLinkedComponentReading.relation.primaryEntryLocator !== "string" ||
        (sourceLinkedComponentReading.relation.sourceAuthoredExplanation !== null &&
          typeof sourceLinkedComponentReading.relation.sourceAuthoredExplanation !== "string") ||
        !Array.isArray(sourceLinkedComponentReading.relation.references) ||
        !sourceLinkedComponentReading.relation.references.every((reference) =>
          isRecord(reference) &&
          typeof reference.sourceForm === "string" &&
          reference.sourceForm.length > 0 &&
          (reference.reference === null || typeof reference.reference === "string"),
        ) ||
        !validSourceLinkedRecord(sourceLinkedComponentReading.primary) ||
        !Array.isArray(sourceLinkedComponentReading.components) ||
        !sourceLinkedComponentReading.components.every(validSourceLinkedRecord) ||
        !isRecord(sourceLinkedComponentReading.exploratoryRelationship) ||
        (sourceLinkedComponentReading.exploratoryRelationship.status !== "EXPLORATORY_SOURCE_COMPONENT_RELATION" &&
          sourceLinkedComponentReading.exploratoryRelationship.status !== "UNKNOWN_OR_NULL") ||
        (sourceLinkedComponentReading.exploratoryRelationship.statement !== null &&
          typeof sourceLinkedComponentReading.exploratoryRelationship.statement !== "string") ||
        !isStringArray(sourceLinkedComponentReading.exploratoryRelationship.alternatives) ||
        typeof sourceLinkedComponentReading.exploratoryRelationship.claimBoundary !== "string" ||
        typeof sourceLinkedComponentReading.claimBoundary !== "string") {
        return false;
      }
      return true;
    })();
    const sourceLinkedComparison = reading.sourceLinkedComparison;
    const validSourceLinkedComparison = sourceLinkedComparison === undefined || sourceLinkedComparison === null || (
      isRecord(sourceLinkedComparison) &&
      (sourceLinkedComparison.status === "SUPPORTED" || sourceLinkedComparison.status === "NULL") &&
      isStringArray(sourceLinkedComparison.reasonCodes) &&
      isRecord(sourceLinkedComparison.relation) &&
      (sourceLinkedComparison.relation.relation === "SOURCE_RELATED_FORM" || sourceLinkedComparison.relation.relation === "SOURCE_DERIVED_FORM" || sourceLinkedComparison.relation.relation === "TARGET_AUTHORED_ETYMOLOGY_REFERENCE") &&
      typeof sourceLinkedComparison.relation.primarySourceRecordId === "string" &&
      typeof sourceLinkedComparison.relation.primaryEntryLocator === "string" &&
      typeof sourceLinkedComparison.relation.relatedForm === "string" &&
      (sourceLinkedComparison.relation.relatedSourceRecordId === null || typeof sourceLinkedComparison.relation.relatedSourceRecordId === "string") &&
      typeof sourceLinkedComparison.relation.relatedEntryLocator === "string" &&
      sourceLinkedComparison.relation.direction === "RELATED_FORM_TO_PRIMARY_ETYMLOGY_REFERENCE" &&
      (sourceLinkedComparison.relation.referencedForm === null || typeof sourceLinkedComparison.relation.referencedForm === "string") &&
      (sourceLinkedComparison.relation.reference === null || typeof sourceLinkedComparison.relation.reference === "string") &&
      (sourceLinkedComparison.relation.relation === "TARGET_AUTHORED_ETYMOLOGY_REFERENCE"
        ? sourceLinkedComparison.relation.sourceRelationAssertion === null || sourceLinkedComparison.relation.sourceRelationAssertion === undefined
        : sourceLinkedComparison.relation.sourceRelationAssertion === undefined || validSourceRelationAssertion(
            sourceLinkedComparison.relation.sourceRelationAssertion,
            isRecord(sourceLinkedComparison.primary) ? sourceLinkedComparison.primary.sourceSenses : undefined,
          )) &&
      validSourceLinkedRecord(sourceLinkedComparison.primary) &&
      (sourceLinkedComparison.related === null || validSourceLinkedRecord(sourceLinkedComparison.related)) &&
      isRecord(sourceLinkedComparison.summary) &&
      (sourceLinkedComparison.summary.voicePathRelationship === "EXACT_SUPPORTED_PATH_SET_MATCH" ||
        sourceLinkedComparison.summary.voicePathRelationship === "SHARED_INITIAL_VOICE_DIFFERENT_LATER_PATH" ||
        sourceLinkedComparison.summary.voicePathRelationship === "DIFFERENT_SUPPORTED_VOICE_PATHS" ||
        sourceLinkedComparison.summary.voicePathRelationship === "UNKNOWN") &&
      (sourceLinkedComparison.summary.consonantalContextRelationship === "EXACT_SUPPORTED_CONTEXT_SET_MATCH" ||
        sourceLinkedComparison.summary.consonantalContextRelationship === "DIFFERENT_SUPPORTED_CONTEXTS" ||
        sourceLinkedComparison.summary.consonantalContextRelationship === "UNKNOWN") &&
      typeof sourceLinkedComparison.summary.text === "string" &&
      typeof sourceLinkedComparison.claimBoundary === "string"
    );
    const validFunctionalMeaningBridgeValue = (bridge: unknown): boolean => {
      if (!isRecord(bridge) || (bridge.status !== "SUPPORTED" && bridge.status !== "NULL")) return false;
      if (!isStringArray(bridge.truthLayers) || bridge.truthLayers.some((layer) =>
        layer !== "SOURCE_FACT" &&
        layer !== "DERIVED_STRUCTURE" &&
        layer !== "EXPLORATORY_FUNCTIONAL_HYPOTHESIS" &&
        layer !== "UNKNOWN_OR_NULL",
      )) return false;
      if (bridge.relatedForm !== null && typeof bridge.relatedForm !== "string") return false;
      const sourceFacts = bridge.sourceFacts;
      if (sourceFacts !== null) {
        if (!isRecord(sourceFacts) || !isRecord(sourceFacts.primary) || !isRecord(sourceFacts.structuredReference)) return false;
        const validBridgeRecord = (record: unknown): boolean =>
          isRecord(record) &&
          typeof record.sourceRecordId === "string" &&
          typeof record.entryLocator === "string" &&
          typeof record.form === "string" &&
          isStringArray(record.meaningGlosses) &&
          validSourceSenses(record.sourceSenses);
        if (!validBridgeRecord(sourceFacts.primary)) return false;
        const relatedBridgeRecord = sourceFacts.related;
        if (relatedBridgeRecord !== null) {
          if (!isRecord(relatedBridgeRecord) || !validBridgeRecord(relatedBridgeRecord)) return false;
          if (
            relatedBridgeRecord.sourceAuthoredExplanation !== null &&
            typeof relatedBridgeRecord.sourceAuthoredExplanation !== "string"
          ) return false;
        }
        if (
          (sourceFacts.structuredReference.referencedForm !== null && typeof sourceFacts.structuredReference.referencedForm !== "string") ||
          (sourceFacts.structuredReference.reference !== null && typeof sourceFacts.structuredReference.reference !== "string")
        ) return false;
      }
      const derivedStructure = bridge.derivedStructure;
      if (derivedStructure !== null) {
        if (!isRecord(derivedStructure) || !isRecord(derivedStructure.primary) || !isRecord(derivedStructure.related)) return false;
        const validBridgeStructure = (structure: unknown): boolean =>
          isRecord(structure) &&
          (structure.rawIpa === null || typeof structure.rawIpa === "string") &&
          isStringArray(structure.voicePaths) &&
          isStringArray(structure.consonantalContexts);
        if (!validBridgeStructure(derivedStructure.primary) || !validBridgeStructure(derivedStructure.related)) return false;
        if (
          derivedStructure.voicePathRelationship !== "EXACT_SUPPORTED_PATH_SET_MATCH" &&
          derivedStructure.voicePathRelationship !== "SHARED_INITIAL_VOICE_DIFFERENT_LATER_PATH" &&
          derivedStructure.voicePathRelationship !== "DIFFERENT_SUPPORTED_VOICE_PATHS" &&
          derivedStructure.voicePathRelationship !== "UNKNOWN"
        ) return false;
        if (
          derivedStructure.consonantalContextRelationship !== "EXACT_SUPPORTED_CONTEXT_SET_MATCH" &&
          derivedStructure.consonantalContextRelationship !== "DIFFERENT_SUPPORTED_CONTEXTS" &&
          derivedStructure.consonantalContextRelationship !== "UNKNOWN"
        ) return false;
      }
      const hypothesis = bridge.functionalHypothesis;
      return isRecord(hypothesis) &&
        (hypothesis.status === "EXPLORATORY_FUNCTIONAL_HYPOTHESIS" || hypothesis.status === "UNKNOWN_OR_NULL") &&
        (hypothesis.functionalOperation === undefined || hypothesis.functionalOperation === null || hypothesis.functionalOperation === "AGENT" || hypothesis.functionalOperation === "ENABLE_PASSAGE") &&
        (hypothesis.statement === null || typeof hypothesis.statement === "string") &&
        isStringArray(hypothesis.alternatives) &&
        isStringArray(hypothesis.basis) &&
        typeof hypothesis.claimBoundary === "string" &&
        isStringArray(bridge.reasonCodes) &&
        typeof bridge.claimBoundary === "string";
    };
    const validDirectTargetRoleFunctionalBridge = (): boolean => {
      const bridge = reading.functionalMeaningBridge;
      if (!isRecord(bridge) || !isRecord(bridge.functionalHypothesis)) return true;
      const hypothesis = bridge.functionalHypothesis;
      const basis = hypothesis.basis;
      if (!isStringArray(basis)) return true;
      const componentReading = reading.sourceLinkedComponentReading;
      const componentRelationType = isRecord(componentReading) && isRecord(componentReading.relation)
        ? componentReading.relation.relation
        : null;
      const claimsDirectTargetAgent = bridge.status === "SUPPORTED" && bridge.relatedForm === null &&
        bridge.derivedStructure === null && hypothesis.status === "EXPLORATORY_FUNCTIONAL_HYPOTHESIS" &&
        hypothesis.functionalOperation === "AGENT";
      const hasTargetRoleBasis = basis.includes("SOURCE_ATTESTED_TARGET_ROLE_CATEGORY");
      const hasTargetAuthoredTemplateRelation = componentRelationType === "SOURCE_AUTHORED_SUFFIX_TEMPLATE" ||
        componentRelationType === "SOURCE_AUTHORED_AF_TEMPLATE";
      if (!hasTargetRoleBasis && !(claimsDirectTargetAgent && hasTargetAuthoredTemplateRelation)) return true;
      const sourceFacts = bridge.sourceFacts;
      const target = reading.primarySourceFact;
      if (!isRecord(sourceFacts) || !isRecord(sourceFacts.primary) || !isRecord(sourceFacts.structuredReference)) return false;
      if (
        bridge.status !== "SUPPORTED" ||
        bridge.relatedForm !== null ||
        bridge.derivedStructure !== null ||
        hypothesis.status !== "EXPLORATORY_FUNCTIONAL_HYPOTHESIS" ||
        hypothesis.functionalOperation !== "AGENT" ||
        sourceFacts.related !== null ||
        sourceFacts.structuredReference.referencedForm !== null ||
        sourceFacts.structuredReference.reference !== null ||
        !isRecord(target) || typeof target.form !== "string" || typeof target.sourceRecordId !== "string" ||
        typeof target.entryLocator !== "string" || target.partOfSpeech !== "noun" ||
        target.form !== sourceFacts.primary.form ||
        target.sourceRecordId !== sourceFacts.primary.sourceRecordId ||
        target.entryLocator !== sourceFacts.primary.entryLocator ||
        !isRecord(componentReading) || !isRecord(componentReading.relation) ||
        (componentRelationType !== "SOURCE_AUTHORED_AF_TEMPLATE" &&
          componentRelationType !== "SOURCE_AUTHORED_SUFFIX_TEMPLATE") ||
        componentReading.relation.primarySourceRecordId !== target.sourceRecordId ||
        componentReading.relation.primaryEntryLocator !== target.entryLocator ||
        !Array.isArray(componentReading.relation.references) || componentReading.relation.references.length !== 2 ||
        !isRecord(componentReading.primary) || componentReading.primary.sourceRecordId !== target.sourceRecordId ||
        componentReading.primary.entryLocator !== target.entryLocator ||
        !Array.isArray(exactSourceFacts)
      ) return false;

      const targetForm = typeof target.form === "string" ? target.form : null;
      if (targetForm === null) return false;
      const normalizeForm = (form: string): string => form.normalize("NFC").trim().toLocaleLowerCase("sq-AL");
      const targetRecords = exactSourceFacts.filter((fact) => isRecord(fact) &&
        fact.language === "Albanian" && fact.languageCode === "sq" &&
        typeof fact.form === "string" && normalizeForm(fact.form) === normalizeForm(targetForm) &&
        fact.partOfSpeech !== "name",
      );
      const expectedIdPrefix = `kaikki-albanian-jsonl:word=${encodeURIComponent(targetForm)}:ordinal=`;
      const targetOrdinal = typeof target.sourceRecordId === "string"
        ? target.sourceRecordId.slice(expectedIdPrefix.length)
        : "";
      if (
        targetRecords.length !== 1 || targetRecords[0]?.sourceRecordId !== target.sourceRecordId ||
        !/^\d+$/u.test(targetOrdinal) ||
        targetRecords.filter((fact) => isRecord(fact) && fact.sourceRecordId === target.sourceRecordId).length !== 1
      ) return false;

      const rawTarget = targetRecords[0];
      const componentPrimary = isRecord(componentReading) ? componentReading.primary : null;
      if (!isRecord(rawTarget) || !Array.isArray(rawTarget.senses) || !isRecord(componentPrimary) ||
        rawTarget.sourceRecordId !== target.sourceRecordId || rawTarget.entryLocator !== target.entryLocator ||
        rawTarget.form !== target.form || rawTarget.partOfSpeech !== target.partOfSpeech ||
        rawTarget.partOfSpeech !== "noun" || rawTarget.etymologyText !== target.etymologyText ||
        componentPrimary.sourceRecordId !== target.sourceRecordId ||
        componentPrimary.entryLocator !== target.entryLocator || componentPrimary.form !== target.form ||
        componentPrimary.partOfSpeech !== rawTarget.partOfSpeech ||
        componentPrimary.physicalRecordOrdinal !== rawTarget.physicalRecordOrdinal) return false;

      const rawSenses = rawTarget.senses as unknown[];
      if (!rawSenses.every((sense) => isRecord(sense) &&
        (sense.senseId === null || typeof sense.senseId === "string") && isStringArray(sense.glosses))) return false;
      const sameStringArray = (left: unknown, right: unknown): boolean =>
        isStringArray(left) && isStringArray(right) && left.length === right.length &&
        left.every((value, index) => value === right[index]);
      const matchesRawSenseProjection = (projection: unknown): boolean =>
        Array.isArray(projection) && projection.length === rawSenses.length &&
        rawSenses.every((rawSense, index) => {
          const projectedSense = projection[index];
          return isRecord(rawSense) && isRecord(projectedSense) &&
            projectedSense.senseId === rawSense.senseId &&
            sameStringArray(projectedSense.glosses, rawSense.glosses);
        });
      const expectedMeaningGlosses = [...new Set(rawSenses.flatMap((sense) =>
        isRecord(sense) && isStringArray(sense.glosses) ? sense.glosses : [],
      ))];
      if (!matchesRawSenseProjection(sourceFacts.primary.sourceSenses) ||
        !matchesRawSenseProjection(componentPrimary.sourceSenses) ||
        !sameStringArray(sourceFacts.primary.meaningGlosses, expectedMeaningGlosses) ||
        !sameStringArray(target.meaningGlosses, expectedMeaningGlosses) ||
        !sameStringArray(componentPrimary.meaningGlosses, expectedMeaningGlosses)) return false;

      const sourceSenses = sourceFacts.primary.sourceSenses;
      if (!Array.isArray(sourceSenses)) return false;
      const roleSenses = sourceSenses.flatMap((sense) => {
        if (!isRecord(sense) || typeof sense.senseId !== "string" || !sense.senseId ||
          !isStringArray(sense.glosses) || !sense.glosses.some((gloss) => gloss.trim().length > 0) ||
          !Array.isArray(sense.categories)) return [];
        const categories = sense.categories.filter((category) => isRecord(category) &&
          category.name === "Occupations" && category.orig === "sq:Occupations" &&
          category.langcode === "sq" && category.source === "w",
        );
        return categories.length === 1 ? [{ sense, category: categories[0] }] : [];
      });
      if (roleSenses.length !== 1) return false;
      const roleSenseId = roleSenses[0]?.sense.senseId;
      if (typeof roleSenseId !== "string" || sourceSenses.filter((sense) => isRecord(sense) && sense.senseId === roleSenseId).length !== 1) {
        return false;
      }
      if (rawSenses.filter((sense) => isRecord(sense) && sense.senseId === roleSenseId).length !== 1) return false;
      const rawRoleSense = rawTarget.senses.find((sense) => isRecord(sense) && sense.senseId === roleSenseId);
      const projectedRoleSense = sourceSenses.find((sense) => isRecord(sense) && sense.senseId === roleSenseId);
      if (!isRecord(rawRoleSense) || !Array.isArray(rawRoleSense.categories) ||
        !isRecord(projectedRoleSense) || !Array.isArray(projectedRoleSense.categories)) return false;
      if (!sameStringArray(projectedRoleSense.glosses, rawRoleSense.glosses)) return false;
      const isExactSourceOccupationCategory = (category: unknown): category is Record<string, unknown> =>
        isRecord(category) && category.name === "Occupations" && category.orig === "sq:Occupations" &&
        category.langcode === "sq" && category.source === "w";
      const rawRoleCategories = rawRoleSense.categories.filter(isExactSourceOccupationCategory);
      const projectedRoleCategories = projectedRoleSense.categories.filter(isExactSourceOccupationCategory);
      if (rawRoleCategories.length !== 1 || projectedRoleCategories.length !== 1) return false;

      const expectedTemplateBasis = componentRelationType === "SOURCE_AUTHORED_SUFFIX_TEMPLATE"
        ? "TARGET_SOURCE_AUTHORED_SUFFIX_TEMPLATE"
        : "TARGET_SOURCE_AUTHORED_AF_TEMPLATE";
      if (!sameStringArray(basis, [
        "SOURCE_ATTESTED_TARGET_ROLE_CATEGORY",
        "SOURCE_ATTESTED_FINAL_SENSE_CATEGORY",
        expectedTemplateBasis,
        "SOURCE_STRUCTURED_ALBANIAN_REFERENCES",
      ])) return false;

      let validTemplateEvidence = false;
      if (componentRelationType === "SOURCE_AUTHORED_SUFFIX_TEMPLATE") {
        validTemplateEvidence = validSourceAuthoredSuffixTemplateReading(componentReading, target);
      } else {
        const references = componentReading.relation.references as unknown[];
        const projectedTemplateArray = Array.isArray(componentPrimary.etymologyTemplates)
          ? componentPrimary.etymologyTemplates
          : [];
        const rawTemplates = Array.isArray(rawTarget.etymologyTemplates) ? rawTarget.etymologyTemplates : [];
        const projectedLinks = Array.isArray(componentPrimary.etymologyLinks) ? componentPrimary.etymologyLinks : [];
        const rawLinks = Array.isArray(rawTarget.etymologyLinks) ? rawTarget.etymologyLinks : [];
        if (!Array.isArray(componentPrimary.etymologyTemplates) || !Array.isArray(rawTarget.etymologyTemplates) ||
          rawTemplates.length !== projectedTemplateArray.length ||
          rawLinks.length !== projectedLinks.length || rawLinks.length !== 2) return false;
        const sameTemplate = (left: unknown, right: unknown): boolean => {
          if (!isRecord(left) || !isRecord(right) || !isRecord(left.args) || !isRecord(right.args)) return false;
          const leftArgs = left.args as Record<string, unknown>;
          const rightArgs = right.args as Record<string, unknown>;
          return left.name === right.name && left.expansion === right.expansion &&
            Object.keys(leftArgs).sort().join("\u0000") === Object.keys(rightArgs).sort().join("\u0000") &&
            Object.entries(leftArgs).every(([key, value]) => rightArgs[key] === value);
        };
        if (!rawTemplates.every((template, index) => sameTemplate(template, projectedTemplateArray[index])) ||
          !rawLinks.every((link, index) => isRecord(link) && isRecord(projectedLinks[index]) &&
            link.sourceForm === projectedLinks[index].sourceForm && link.reference === projectedLinks[index].reference)) return false;
        const projectedTemplates = projectedTemplateArray.filter((template) => isRecord(template) && template.name === "af");
        if (projectedTemplates.length !== 1) return false;
        const template = projectedTemplates[0];
        if (!isRecord(template) || !isRecord(template.args)) return false;
        const templateArguments = template.args;
        const templateBaseForm = templateArguments["2"];
        const templateComponentForm = templateArguments["3"];
        if (templateArguments["1"] !== "sq" ||
          Object.keys(templateArguments).some((argument) => !["1", "2", "3", "t1", "t2"].includes(argument)) ||
          Object.keys(templateArguments).filter((argument) => /^\d+$/u.test(argument)).sort().join(",") !== "1,2,3" ||
          Object.keys(templateArguments).filter((argument) => argument === "t1" || argument === "t2")
            .some((argument) => typeof templateArguments[argument] !== "string") ||
          typeof templateBaseForm !== "string" || typeof templateComponentForm !== "string" ||
          typeof template.expansion !== "string" || typeof componentPrimary.etymologyText !== "string") return false;
        const normalizeText = (text: string): string => text.normalize("NFC").trim().replace(/\s+/gu, " ").toLocaleLowerCase("sq-AL");
        const expansionParts = template.expansion.split(/\s+\+\s+/u);
        const matchesExpansionRoot = (part: string | undefined, form: string): boolean => {
          if (!part) return false;
          const normalizedPart = normalizeText(part);
          const normalizedForm = normalizeText(form);
          return normalizedPart === normalizedForm ||
            (normalizedPart.startsWith(`${normalizedForm} (`) && normalizedPart.endsWith(")"));
        };
        if (expansionParts.length !== 2 ||
          !matchesExpansionRoot(expansionParts[0], templateBaseForm) ||
          !matchesExpansionRoot(expansionParts[1], templateComponentForm) ||
          normalizeText(componentPrimary.etymologyText).replace(/[.!?]+$/u, "") !==
            normalizeText(`A compound of ${template.expansion}`).replace(/[.!?]+$/u, "")) return false;
        validTemplateEvidence = references.every((reference, index) => {
          const link = projectedLinks[index];
          return isRecord(reference) && isRecord(link) &&
            reference.sourceForm === (index === 0 ? templateBaseForm : templateComponentForm) &&
            reference.reference === `${reference.sourceForm}#Albanian` &&
            link.sourceForm === reference.sourceForm && link.reference === reference.reference;
        });
      }
      if (!validTemplateEvidence) return false;

      const templateName = componentRelationType === "SOURCE_AUTHORED_SUFFIX_TEMPLATE" ? "suffix" : "af";
      const rawTemplates = Array.isArray(rawTarget.etymologyTemplates) ? rawTarget.etymologyTemplates : [];
      const matchingTemplates = rawTemplates.filter((template) => isRecord(template) && template.name === templateName);
      if (matchingTemplates.length !== 1 || !isRecord(matchingTemplates[0]) ||
        typeof matchingTemplates[0].expansion !== "string") return false;
      const references = componentReading.relation.references as unknown[];
      const sourceReferences = references.map((reference) => {
        if (!isRecord(reference) || typeof reference.sourceForm !== "string" || typeof reference.reference !== "string") {
          return null;
        }
        return `${reference.sourceForm} → ${reference.reference}`;
      });
      if (sourceReferences.some((reference) => reference === null)) return false;
      const roleGlosses = rawRoleSense.glosses as string[];
      const expectedStatement = `Source-bounded target-role interpretation (exploratory): the directly queried Albanian noun ${target.form} has source sense ${roleSenseId} (“${roleGlosses.join("; ")}”) with the exact source-authored sq:Occupations category (category source: w). This category supports an exploratory AGENT reading for this identified target sense. The same target record attributes the ${templateName} template “${matchingTemplates[0].expansion}” and the Albanian references ${sourceReferences.join(" · ")}; those references do not create a base-side SOURCE_DERIVED_FORM assertion or select a component sense.`;
      return hypothesis.statement === expectedStatement;
    };
    const validFunctionalMeaningBridge = validFunctionalMeaningBridgeValue(reading.functionalMeaningBridge) &&
      validDirectTargetRoleFunctionalBridge();
    const validRelatedCandidateComparison = (candidate: unknown): boolean => {
      if (!isRecord(candidate) || (candidate.status !== "SUPPORTED" && candidate.status !== "NULL") ||
        !isStringArray(candidate.reasonCodes) || !isRecord(candidate.relation) ||
        (candidate.relation.relation !== "SOURCE_RELATED_FORM" && candidate.relation.relation !== "SOURCE_DERIVED_FORM" && candidate.relation.relation !== "TARGET_AUTHORED_ETYMOLOGY_REFERENCE") ||
        typeof candidate.relation.primarySourceRecordId !== "string" ||
        typeof candidate.relation.primaryEntryLocator !== "string" ||
        typeof candidate.relation.relatedForm !== "string" ||
        (candidate.relation.relatedSourceRecordId !== null && typeof candidate.relation.relatedSourceRecordId !== "string") ||
        typeof candidate.relation.relatedEntryLocator !== "string" ||
        candidate.relation.direction !== "RELATED_FORM_TO_PRIMARY_ETYMLOGY_REFERENCE" ||
        (candidate.relation.referencedForm !== null && typeof candidate.relation.referencedForm !== "string") ||
        (candidate.relation.reference !== null && typeof candidate.relation.reference !== "string") ||
        !validSourceLinkedRecord(candidate.primary) ||
        candidate.primary.sourceRecordId !== candidate.relation.primarySourceRecordId ||
        candidate.primary.entryLocator !== candidate.relation.primaryEntryLocator ||
        (candidate.related !== null && !validSourceLinkedRecord(candidate.related)) ||
        (candidate.related !== null &&
          (candidate.related.sourceRecordId !== candidate.relation.relatedSourceRecordId ||
            candidate.related.entryLocator !== candidate.relation.relatedEntryLocator)) ||
        !isRecord(candidate.summary) ||
        !["EXACT_SUPPORTED_PATH_SET_MATCH", "SHARED_INITIAL_VOICE_DIFFERENT_LATER_PATH", "DIFFERENT_SUPPORTED_VOICE_PATHS", "UNKNOWN"].includes(candidate.summary.voicePathRelationship as string) ||
        !["EXACT_SUPPORTED_CONTEXT_SET_MATCH", "DIFFERENT_SUPPORTED_CONTEXTS", "UNKNOWN"].includes(candidate.summary.consonantalContextRelationship as string) ||
        typeof candidate.summary.text !== "string" ||
        typeof candidate.claimBoundary !== "string") {
        return false;
      }
      return true;
    };
    const relatedCandidateEvaluations = reading.relatedCandidateEvaluations;
    const validRelatedCandidateEvaluations = relatedCandidateEvaluations === undefined || (
      Array.isArray(relatedCandidateEvaluations) && relatedCandidateEvaluations.every((candidate) => {
        const validCandidate = isRecord(candidate) &&
          typeof candidate.relatedForm === "string" &&
          (candidate.sourceRelation === "SOURCE_RELATED_FORM" || candidate.sourceRelation === "SOURCE_DERIVED_FORM" || candidate.sourceRelation === "TARGET_AUTHORED_ETYMOLOGY_REFERENCE") &&
          (candidate.sourceRelation === "TARGET_AUTHORED_ETYMOLOGY_REFERENCE"
            ? (candidate.sourceRelationAssertion === null || candidate.sourceRelationAssertion === undefined) &&
              isRecord(candidate.sourceLinkedComparison) && isRecord(candidate.sourceLinkedComparison.relation) &&
              (candidate.sourceLinkedComparison.relation.sourceRelationAssertion === null || candidate.sourceLinkedComparison.relation.sourceRelationAssertion === undefined)
            : candidate.sourceRelationAssertion === undefined
              ? isRecord(candidate.sourceLinkedComparison) && isRecord(candidate.sourceLinkedComparison.relation) &&
                candidate.sourceLinkedComparison.relation.sourceRelationAssertion === undefined
              : validSourceRelationAssertion(candidate.sourceRelationAssertion,
                  isRecord(candidate.sourceLinkedComparison) && isRecord(candidate.sourceLinkedComparison.primary)
                    ? candidate.sourceLinkedComparison.primary.sourceSenses
                    : undefined) &&
                isRecord(candidate.sourceLinkedComparison) && isRecord(candidate.sourceLinkedComparison.relation) &&
                sameSourceRelationAssertion(candidate.sourceRelationAssertion, candidate.sourceLinkedComparison.relation.sourceRelationAssertion)) &&
          (candidate.resolution === "RESOLVED" || candidate.resolution === "UNRESOLVED") &&
          validRelatedCandidateComparison(candidate.sourceLinkedComparison) &&
          validFunctionalMeaningBridgeValue(candidate.functionalMeaningBridge);
        return validCandidate;
      })
    );
    const validRelationOwnershipBindings = (): boolean => {
      if (!Array.isArray(reading.relatedForms)) return false;
      const isSourceRelationKind = (relation: unknown): relation is "SOURCE_RELATED_FORM" | "SOURCE_DERIVED_FORM" =>
        relation === "SOURCE_RELATED_FORM" || relation === "SOURCE_DERIVED_FORM";
      const candidateComparison = (candidate: Record<string, unknown>): Record<string, unknown> | null =>
        isRecord(candidate.sourceLinkedComparison) ? candidate.sourceLinkedComparison : null;
      const comparisonRelation = (comparison: Record<string, unknown> | null): Record<string, unknown> | null =>
        comparison && isRecord(comparison.relation) ? comparison.relation : null;
      const sameOrLegacyAssertion = (left: unknown, right: unknown): boolean =>
        left === undefined || right === undefined
          ? left === undefined && right === undefined
          : sameSourceRelationAssertion(left, right);
      const validOptionalSourceRelationAssertion = (assertion: unknown, senses: unknown): boolean =>
        assertion === undefined || validSourceRelationAssertion(assertion, senses);
      const exactFact = exactPrimarySourceFact;
      const candidates = Array.isArray(relatedCandidateEvaluations) ? relatedCandidateEvaluations : [];
      const selectedComparison = reading.sourceLinkedComparison;
      const hasSourceAssertion = reading.relatedForms.length > 0 ||
        candidates.some((candidate) => isRecord(candidate) && isSourceRelationKind(candidate.sourceRelation)) ||
        (isRecord(selectedComparison) && isRecord(selectedComparison.relation) &&
          isSourceRelationKind(selectedComparison.relation.relation));
      if (!exactFact) {
        if (!hasSourceAssertion) return true;
        const sourceCandidates = candidates.filter((candidate): candidate is Record<string, unknown> =>
          isRecord(candidate) && isSourceRelationKind(candidate.sourceRelation));
        if (sourceCandidates.length > 0) {
          const primaryCandidates = sourceCandidates.filter((candidate) =>
            comparisonRelation(candidateComparison(candidate))?.primarySourceRecordId === primaryRecord?.sourceRecordId);
          const targetFirstCandidates = sourceCandidates.filter((candidate) =>
            comparisonRelation(candidateComparison(candidate))?.primarySourceRecordId !== primaryRecord?.sourceRecordId);
          if (primaryCandidates.length !== reading.relatedForms.length || targetFirstCandidates.length > 1) return false;
          for (let index = 0; index < primaryCandidates.length; index += 1) {
            const candidate = primaryCandidates[index];
            const projected = reading.relatedForms[index];
            if (!isRecord(candidate) || !isRecord(projected) ||
              !sameNormalizedAlbanianRelationForm(candidate.relatedForm, projected.form) ||
              candidate.sourceRelation !== projected.relation ||
              !sameOrLegacyAssertion(candidate.sourceRelationAssertion, projected.sourceRelationAssertion) ||
              !isRecord(candidate.sourceLinkedComparison) || !isRecord(candidate.sourceLinkedComparison.primary) ||
              candidate.sourceLinkedComparison.primary.sourceRecordId !== primaryRecord?.sourceRecordId ||
              candidate.sourceLinkedComparison.primary.entryLocator !== primaryRecord?.entryLocator ||
              !validOptionalSourceRelationAssertion(candidate.sourceRelationAssertion,
                candidate.sourceLinkedComparison.primary.sourceSenses)) return false;
          }
          for (const candidate of targetFirstCandidates) {
            if (!isRecord(candidate) || !isRecord(candidate.sourceLinkedComparison) ||
              !isRecord(candidate.sourceLinkedComparison.primary) || !isRecord(candidate.sourceLinkedComparison.related) ||
              !isRecord(candidate.sourceLinkedComparison.relation)) return false;
            const comparison = candidateComparison(candidate);
            const relation = comparisonRelation(comparison);
            if (!comparison || !relation || !isRecord(comparison.primary) || !isRecord(comparison.related)) return false;
            if (candidate.sourceRelation !== relation.relation ||
              !sameNormalizedAlbanianRelationForm(candidate.relatedForm, relation.relatedForm) ||
              relation.relatedSourceRecordId !== primaryRecord?.sourceRecordId ||
              relation.relatedEntryLocator !== primaryRecord?.entryLocator ||
              comparison.related.sourceRecordId !== primaryRecord?.sourceRecordId ||
              comparison.related.entryLocator !== primaryRecord?.entryLocator ||
              !sameNormalizedAlbanianRelationForm(comparison.related.form, primaryRecord?.form) ||
              !validOptionalSourceRelationAssertion(candidate.sourceRelationAssertion,
                comparison.primary.sourceSenses) ||
              !sameOrLegacyAssertion(candidate.sourceRelationAssertion, relation.sourceRelationAssertion)) return false;
          }
        } else if (reading.relatedForms.length !== 1 || !isRecord(selectedComparison) ||
          !isRecord(selectedComparison.relation) || !isRecord(selectedComparison.primary) ||
          selectedComparison.relation.relation !== reading.relatedForms[0]?.relation ||
          selectedComparison.relation.relatedForm !== reading.relatedForms[0]?.form ||
          !validOptionalSourceRelationAssertion(selectedComparison.relation.sourceRelationAssertion,
            selectedComparison.primary.sourceSenses)) return false;
        const selectedComparisonRecord = isRecord(selectedComparison) ? selectedComparison : null;
        const selectedRelation = selectedComparisonRecord && isRecord(selectedComparisonRecord.relation)
          ? selectedComparisonRecord.relation
          : null;
        if (selectedComparisonRecord && selectedRelation && isSourceRelationKind(selectedRelation.relation)) {
          const matched = sourceCandidates.filter((candidate) => isRecord(candidate) &&
              comparisonRelation(candidateComparison(candidate))?.primarySourceRecordId === selectedRelation.primarySourceRecordId &&
              comparisonRelation(candidateComparison(candidate))?.primaryEntryLocator === selectedRelation.primaryEntryLocator &&
              candidate.sourceRelation === selectedRelation.relation &&
              sameNormalizedAlbanianRelationForm(candidate.relatedForm, selectedRelation.relatedForm) &&
              sameOrLegacyAssertion(candidate.sourceRelationAssertion, selectedRelation.sourceRelationAssertion));
          const legacyMatched = sourceCandidates.length === 0
            ? reading.relatedForms.filter((relation) => isRecord(relation) &&
              relation.relation === selectedRelation.relation &&
              sameNormalizedAlbanianRelationForm(relation.form, selectedRelation.relatedForm) &&
              sameOrLegacyAssertion(relation.sourceRelationAssertion, selectedRelation.sourceRelationAssertion))
            : [];
          if ((sourceCandidates.length > 0 ? matched.length : legacyMatched.length) !== 1) return false;
          if (selectedRelation.primarySourceRecordId === primaryRecord?.sourceRecordId) {
            if (selectedRelation.primaryEntryLocator !== primaryRecord?.entryLocator) return false;
          } else if (sourceCandidates.length === 0 || !matched.some((candidate) => isRecord(candidate) &&
            candidateComparison(candidate) && isRecord(candidateComparison(candidate)?.primary) &&
            (candidateComparison(candidate)?.primary as Record<string, unknown>).sourceRecordId === selectedRelation.primarySourceRecordId &&
            (candidateComparison(candidate)?.primary as Record<string, unknown>).entryLocator === selectedRelation.primaryEntryLocator)) return false;
        }
        return true;
      }
      const exactEdges = Array.isArray(exactFact.relatedForms) ? exactFact.relatedForms : [];
      if (reading.relatedForms.length !== exactEdges.length) return false;
      for (let index = 0; index < exactEdges.length; index += 1) {
        const exactEdge = exactEdges[index];
        const projectedEdge = reading.relatedForms[index];
        if (!isRecord(exactEdge) || !isRecord(projectedEdge) ||
          projectedEdge.form !== exactEdge.form || projectedEdge.relation !== exactEdge.relation ||
          !sameOrLegacyAssertion(projectedEdge.sourceRelationAssertion, exactEdge.sourceRelationAssertion)) return false;
        if (exactEdge.sourceRelationAssertion !== undefined &&
          !validSourceRelationAssertion(exactEdge.sourceRelationAssertion, exactFact.senses)) return false;
      }
      const sourceCandidates = Array.isArray(relatedCandidateEvaluations)
        ? relatedCandidateEvaluations.filter((candidate): candidate is Record<string, unknown> =>
            isRecord(candidate) && isSourceRelationKind(candidate.sourceRelation))
        : [];
      if (Array.isArray(relatedCandidateEvaluations)) {
        const primaryCandidates = sourceCandidates.filter((candidate) =>
          comparisonRelation(candidateComparison(candidate))?.primarySourceRecordId === exactFact.sourceRecordId);
        const targetFirstCandidates = sourceCandidates.filter((candidate) =>
          comparisonRelation(candidateComparison(candidate))?.primarySourceRecordId !== exactFact.sourceRecordId);
        if (primaryCandidates.length !== exactEdges.length || targetFirstCandidates.length > 1) return false;
        for (let index = 0; index < exactEdges.length; index += 1) {
          const exactEdge = exactEdges[index];
          const candidate = primaryCandidates[index];
          if (!isRecord(exactEdge) || !isRecord(candidate) ||
            !sameNormalizedAlbanianRelationForm(candidate.relatedForm, exactEdge.form) ||
            candidate.sourceRelation !== exactEdge.relation ||
            !sameOrLegacyAssertion(candidate.sourceRelationAssertion, exactEdge.sourceRelationAssertion) ||
            !isRecord(candidate.sourceLinkedComparison) || !isRecord(candidate.sourceLinkedComparison.relation) ||
            candidate.sourceLinkedComparison.relation.relation !== exactEdge.relation ||
            !sameNormalizedAlbanianRelationForm(candidate.sourceLinkedComparison.relation.relatedForm, exactEdge.form) ||
            candidate.sourceLinkedComparison.relation.primarySourceRecordId !== exactFact.sourceRecordId ||
            candidate.sourceLinkedComparison.relation.primaryEntryLocator !== exactFact.entryLocator ||
            !sameOrLegacyAssertion(candidate.sourceLinkedComparison.relation.sourceRelationAssertion, exactEdge.sourceRelationAssertion)) return false;
        }
        for (const candidate of targetFirstCandidates) {
          if (!isRecord(candidate) || !isRecord(candidate.sourceLinkedComparison) ||
            !isRecord(candidate.sourceLinkedComparison.primary) || !isRecord(candidate.sourceLinkedComparison.related) ||
            !isRecord(candidate.sourceLinkedComparison.relation)) return false;
          const comparison = candidateComparison(candidate);
          const relation = comparisonRelation(comparison);
          if (!comparison || !relation || !isRecord(comparison.primary) || !isRecord(comparison.related)) return false;
          if (candidate.sourceRelation !== relation.relation ||
            !sameNormalizedAlbanianRelationForm(candidate.relatedForm, relation.relatedForm) ||
            relation.relatedSourceRecordId !== exactFact.sourceRecordId ||
            relation.relatedEntryLocator !== exactFact.entryLocator ||
            comparison.related.sourceRecordId !== exactFact.sourceRecordId ||
            comparison.related.entryLocator !== exactFact.entryLocator ||
            !sameNormalizedAlbanianRelationForm(comparison.related.form, exactFact.form) ||
            !validOptionalSourceRelationAssertion(candidate.sourceRelationAssertion,
              comparison.primary.sourceSenses) ||
            !sameOrLegacyAssertion(candidate.sourceRelationAssertion, relation.sourceRelationAssertion)) return false;
        }
        if (relatedCandidateEvaluations.some((candidate) => isRecord(candidate) &&
          candidate.sourceRelation === "TARGET_AUTHORED_ETYMOLOGY_REFERENCE" &&
          ((candidate.sourceRelationAssertion !== null && candidate.sourceRelationAssertion !== undefined) || !isRecord(candidate.sourceLinkedComparison) ||
            !isRecord(candidate.sourceLinkedComparison.relation) ||
            (candidate.sourceLinkedComparison.relation.sourceRelationAssertion !== null &&
              candidate.sourceLinkedComparison.relation.sourceRelationAssertion !== undefined)))) return false;
      }
      if (isRecord(selectedComparison) && isRecord(selectedComparison.relation)) {
        const selectedRelation = selectedComparison.relation;
        if (isSourceRelationKind(selectedRelation.relation)) {
          if (selectedRelation.primarySourceRecordId === exactFact.sourceRecordId) {
            const matchedEdges = exactEdges.filter((edge) => isRecord(edge) &&
              edge.relation === selectedRelation.relation &&
              sameNormalizedAlbanianRelationForm(edge.form, selectedRelation.relatedForm) &&
              sameOrLegacyAssertion(edge.sourceRelationAssertion, selectedRelation.sourceRelationAssertion));
            const legacyUnownedDuplicateSelection = matchedEdges.length > 1 &&
              selectedRelation.sourceRelationAssertion === undefined &&
              matchedEdges.every((edge) => isRecord(edge) && edge.sourceRelationAssertion === undefined);
            if ((matchedEdges.length !== 1 && !legacyUnownedDuplicateSelection) ||
              selectedRelation.primaryEntryLocator !== exactFact.entryLocator) return false;
          } else {
            const matchedCandidates = sourceCandidates.filter((candidate) => isRecord(candidate) &&
              isRecord(candidate.sourceLinkedComparison) && isRecord(candidate.sourceLinkedComparison.relation) &&
              candidate.sourceLinkedComparison.relation.primarySourceRecordId === selectedRelation.primarySourceRecordId &&
              candidate.sourceLinkedComparison.relation.primaryEntryLocator === selectedRelation.primaryEntryLocator &&
              candidate.sourceLinkedComparison.relation.relation === selectedRelation.relation &&
              sameNormalizedAlbanianRelationForm(candidate.sourceLinkedComparison.relation.relatedForm, selectedRelation.relatedForm) &&
              sameOrLegacyAssertion(candidate.sourceRelationAssertion, selectedRelation.sourceRelationAssertion));
            if (matchedCandidates.length !== 1) return false;
          }
        } else if (selectedRelation.relation === "TARGET_AUTHORED_ETYMOLOGY_REFERENCE" &&
          selectedRelation.sourceRelationAssertion !== null && selectedRelation.sourceRelationAssertion !== undefined) {
          return false;
        }
      }
      return true;
    };
    const validFunctionalFamilyReading = (() => {
      const family = reading.functionalFamilyReading;
      if (family === undefined || family === null) return true; // Older payloads have no family projection.
      if (!isRecord(family) || family.status !== "EXPLORATORY_FUNCTIONAL_FAMILY" ||
        family.functionalOperation !== "AGENT" || !isRecord(family.primary) ||
        !isRecord(primary) || family.primary.form !== primary.form ||
        family.primary.sourceRecordId !== primary.sourceRecordId ||
        family.primary.entryLocator !== primary.entryLocator ||
        typeof family.primary.senseId !== "string" || !family.primary.senseId ||
        !isStringArray(family.primary.meaningGlosses) || family.primary.meaningGlosses.length === 0 ||
        !Array.isArray(family.members) || family.members.length < 2 ||
        typeof family.statement !== "string" || !isStringArray(family.alternatives) ||
        typeof family.claimBoundary !== "string" ||
        family.noSingleWinner !== true || family.userDecisionPosture !== "user_decides" ||
        !Array.isArray(relatedCandidateEvaluations)) return false;
      const normalizeAlbanianForm = (form: string): string =>
        form.normalize("NFC").trim().toLocaleLowerCase("sq-AL");
      const forms = new Set<string>();
      return family.members.every((member) => {
        const normalizedMemberForm = isRecord(member) && typeof member.form === "string"
          ? normalizeAlbanianForm(member.form)
          : "";
        if (!isRecord(member) || typeof member.form !== "string" || !member.form ||
          !normalizedMemberForm || forms.has(normalizedMemberForm) || typeof member.sourceRecordId !== "string" ||
          typeof member.entryLocator !== "string" || typeof member.senseId !== "string" ||
          !member.senseId || !isStringArray(member.meaningGlosses) || member.meaningGlosses.length === 0 ||
          member.sourceRelation !== "SOURCE_DERIVED_FORM" ||
          member.sourceComparisonStatus !== "SUPPORTED" || member.functionalBridgeStatus !== "SUPPORTED" ||
          !isStringArray(member.evidenceBasis) || !member.evidenceBasis.includes("SOURCE_DERIVED_FORM_LINK")) return false;
        forms.add(normalizedMemberForm);
        return relatedCandidateEvaluations.some((candidate) => isRecord(candidate) &&
          typeof candidate.relatedForm === "string" &&
          normalizeAlbanianForm(candidate.relatedForm) === normalizedMemberForm &&
          candidate.sourceRelation === "SOURCE_DERIVED_FORM" &&
          isRecord(candidate.sourceLinkedComparison) && candidate.sourceLinkedComparison.status === "SUPPORTED" &&
          isRecord(candidate.sourceLinkedComparison.related) &&
          candidate.sourceLinkedComparison.related.sourceRecordId === member.sourceRecordId &&
          candidate.sourceLinkedComparison.related.entryLocator === member.entryLocator &&
          Array.isArray(candidate.sourceLinkedComparison.related.sourceSenses) &&
          candidate.sourceLinkedComparison.related.sourceSenses.some((sense) =>
            isRecord(sense) && sense.senseId === member.senseId) &&
          isRecord(candidate.functionalMeaningBridge) && candidate.functionalMeaningBridge.status === "SUPPORTED" &&
          isRecord(candidate.functionalMeaningBridge.functionalHypothesis) &&
          candidate.functionalMeaningBridge.functionalHypothesis.functionalOperation === "AGENT");
      });
    })();
    const validOccupationalRoleResearchCandidateBatch = (batch: unknown): boolean => {
      if (batch === undefined || batch === null) return true;
      if (!isRecord(batch) ||
        typeof batch.queryForm !== "string" ||
        (batch.status !== "CANDIDATES_FOUND" && batch.status !== "NO_CANDIDATES") ||
        batch.sourceProfileId !== "open-instrument.albanian-kaikki.frozen.20261022T035432Z" ||
        batch.sourceArtifactSha256 !== "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc" ||
        batch.sourceArtifactBytes !== 67438537 ||
        batch.sourceUrl !== "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl" ||
        batch.sourceUpstream !== "English Wiktionary → Wiktextract → Kaikki Albanian JSONL" ||
        !isStringArray(batch.sourceLicenses) || batch.sourceLicenses.length !== 2 ||
        batch.sourceLicenses[0] !== "CC BY-SA 4.0" || batch.sourceLicenses[1] !== "GFDL" ||
        batch.sourceAttributionRequired !== true ||
        batch.oewnArtifactSha256 !== "7d749f6e2c39e6970e4997839dcf6e42fd281f3c2fae0171d2192bae8cfa4b51" ||
        batch.oewnArtifactBytes !== 9986555 || batch.oewnReleaseDate !== "2025-12-31" ||
        batch.oewnLicense !== "CC BY 4.0" || !isStringArray(batch.oewnAttribution) ||
        batch.oewnAttribution.length !== 2 || batch.oewnAttribution[0] !== "Princeton WordNet" ||
        batch.oewnAttribution[1] !== "Open English WordNet Community" ||
        !isStringArray(batch.reasonCodes) ||
        typeof batch.claimBoundary !== "string" ||
        !isRecord(batch.scanSummary) ||
        !Array.isArray(batch.candidates)) return false;
      const summaryNumbers = [
        "sourceRowsScanned", "suffixRows", "uniqueSuffixLemmas", "suffixSenseCount", "sourceCategorySenseCount",
        "candidateSenseCount", "selectedUniqueLemmaCount", "excludedSuffixSenseCount", "sourceDerivedRelationCount",
        "targetEtymologyReferenceCount", "targetLexicalEtymologyReferenceCount", "targetEtymologyCandidateSenseCount",
        "uniqueSourceDerivedFormEdgeCount", "exactOewnSenseCount", "exactOewnCandidateSenseCount",
        "typedWorkerPathSenseCount", "typedWorkerCandidateSenseCount", "existingFunctionalGateEvidenceCandidateSenseCount",
      ];
      const scanSummary = batch.scanSummary;
      if (!isRecord(scanSummary) || summaryNumbers.some((key) => typeof scanSummary[key] !== "number" || !Number.isInteger(scanSummary[key]) || (scanSummary[key] as number) < 0)) return false;
      const validCandidate = (candidate: unknown): boolean => {
        if (!isRecord(candidate) ||
          typeof candidate.candidateId !== "string" ||
          (candidate.candidateStatus !== "SOURCE_ROLE_CATEGORY_CANDIDATE" && candidate.candidateStatus !== "EXISTING_RESEARCH_HYPOTHESIS") ||
          candidate.sourceProfileId !== batch.sourceProfileId ||
          candidate.sourceArtifactSha256 !== batch.sourceArtifactSha256 ||
          typeof candidate.sourceRecordId !== "string" ||
          typeof candidate.senseId !== "string" ||
          candidate.sourceRecordId === candidate.senseId ||
          !isRecord(candidate.sourceRecord) ||
          !isStringArray(candidate.suffixDiscoveryMatches) ||
          !Array.isArray(candidate.sourceDerivedRelations) ||
          !isRecord(candidate.ontology) ||
          candidate.ontology.release !== "Open English WordNet 2025" ||
          candidate.ontology.artifactSha256 !== batch.oewnArtifactSha256 ||
          !isStringArray(candidate.ontology.exactGlossTerms) ||
          !["TYPED_WORKER_PATHS_OBSERVED", "EXACT_GLOSS_SENSES_FOUND", "EXACT_GLOSS_SENSES_NOT_FOUND"].includes(candidate.ontology.status as string) ||
          !Array.isArray(candidate.ontology.senses) ||
          candidate.functionalOperation !== null ||
          candidate.productionAuthorization !== "NOT_AUTHORIZED" ||
          candidate.embryoFunction !== "UNKNOWN_OR_NULL" ||
          candidate.historicalRelation !== "NOT_CLAIMED" ||
          candidate.noSingleWinner !== true ||
          candidate.userDecisionPosture !== "user_decides" ||
          !isStringArray(candidate.reasonCodes) ||
          typeof candidate.claimBoundary !== "string") return false;
        const source = candidate.sourceRecord;
        if (typeof source.physicalRecordOrdinal !== "number" || !Number.isInteger(source.physicalRecordOrdinal) || source.physicalRecordOrdinal < 0 ||
          typeof source.senseOrdinal !== "number" || !Number.isInteger(source.senseOrdinal) || source.senseOrdinal < 0 ||
          typeof source.entryLocator !== "string" ||
          (source.rawEntryId !== null && typeof source.rawEntryId !== "string") ||
          typeof source.lemma !== "string" ||
          (source.partOfSpeech !== null && typeof source.partOfSpeech !== "string") ||
          !isStringArray(source.glosses) || !Array.isArray(source.pronunciationIpa) ||
          !source.pronunciationIpa.every((ipa) => isRecord(ipa) && typeof ipa.soundIndex === "number" && Number.isInteger(ipa.soundIndex) && ipa.soundIndex >= 0 && typeof ipa.ipa === "string") ||
          !Array.isArray(source.categories) ||
          !source.categories.every((category) => isRecord(category) && typeof category.name === "string" &&
            (category.source === null || typeof category.source === "string") && (category.orig === null || typeof category.orig === "string") &&
            (category.langcode === null || typeof category.langcode === "string")) ||
          (source.etymologyText !== null && typeof source.etymologyText !== "string") ||
          !Array.isArray(source.etymologyTemplates) ||
          !source.etymologyTemplates.every((template) => isRecord(template) && typeof template.name === "string" &&
            isRecord(template.args) && Object.values(template.args).every((value) => typeof value === "string") &&
            typeof template.expansion === "string") ||
          !Array.isArray(source.etymologyLinks) ||
          !source.etymologyLinks.every((link) => isRecord(link) && typeof link.form === "string" && typeof link.reference === "string" &&
            link.direction === "TARGET_RECORD_REFERENCES_SOURCE_FORM" &&
            (link.resolution === "SOURCE_ROWS_FOUND" || link.resolution === "SOURCE_ROW_NOT_FOUND" ||
              link.resolution === "REFERENCE_LANGUAGE_NOT_EXPLICITLY_ALBANIAN") &&
            Array.isArray(link.resolvedSourceRows) && link.resolvedSourceRows.every((row) => isRecord(row) &&
              typeof row.sourceRecordId === "string" && row.sourceRecordId !== candidate.sourceRecordId &&
              typeof row.entryLocator === "string" && typeof row.physicalRecordOrdinal === "number" &&
              Number.isInteger(row.physicalRecordOrdinal) && row.physicalRecordOrdinal >= 0 && isStringArray(row.senseIds)) &&
            ((link.resolution === "SOURCE_ROWS_FOUND") === (link.resolvedSourceRows.length > 0)))) return false;
        if (!candidate.sourceDerivedRelations.every((relation) => isRecord(relation) && typeof relation.baseLemma === "string" &&
          typeof relation.baseSourceRecordId === "string" && typeof relation.baseEntryLocator === "string" &&
          typeof relation.basePhysicalRecordOrdinal === "number" && Number.isInteger(relation.basePhysicalRecordOrdinal) &&
          isStringArray(relation.baseSenseIds) && (relation.relationScope === "SOURCE_RECORD" || relation.relationScope === "SOURCE_SENSE") &&
          typeof relation.relationIndex === "number" && Number.isInteger(relation.relationIndex) && relation.relationIndex >= 0 &&
          relation.direction === "BASE_RECORD_LISTS_TARGET_AS_DERIVED_FORM")) return false;
        if (!candidate.ontology.senses.every((sense) => isRecord(sense) && typeof sense.lemma === "string" && typeof sense.senseId === "string" &&
          typeof sense.synsetId === "string" && isStringArray(sense.definitions) && Array.isArray(sense.typedHypernymPaths) &&
          sense.typedHypernymPaths.every((path) => Array.isArray(path) && path.every((node) => isRecord(node) && typeof node.synsetId === "string" && isStringArray(node.members) && isStringArray(node.definitions))))) return false;
        const hypothesis = candidate.researchHypothesis;
        return hypothesis === null || (isRecord(hypothesis) &&
          hypothesis.sourceStatus === "research_candidate" && hypothesis.admissionScope === "research_hypothesis_only" &&
          hypothesis.sourceRecordId === candidate.sourceRecordId && hypothesis.senseId === candidate.senseId &&
          hypothesis.hypothesisStatus === "PROPOSED_NOT_REVIEWED" && hypothesis.reviewTrack === "NONE" &&
          hypothesis.reviewCandidate === null && hypothesis.ownerApproval === null && hypothesis.functionalOperation === null &&
          hypothesis.productionAuthorization === "NOT_AUTHORIZED" && hypothesis.embryoFunction === "UNKNOWN_OR_NULL" &&
          hypothesis.historicalRelation === "NOT_CLAIMED" && hypothesis.noSingleWinner === true && hypothesis.userDecisionPosture === "user_decides" &&
          isStringArray(hypothesis.evidenceRefs) && isStringArray(hypothesis.reasonCodes));
      };
      return batch.candidates.every(validCandidate) &&
        ((batch.status === "CANDIDATES_FOUND") === (batch.candidates.length > 0));
    };
    return validPrimary && validPronunciation && validRelated &&
      validComposition &&
      validSourceLinkedComponentReading &&
      validSourceLinkedComparison &&
      validFiveWindowsComparison &&
      validFunctionalMeaningBridge &&
      validRelatedCandidateEvaluations &&
      validFunctionalFamilyReading &&
      validOccupationalRoleResearchCandidateBatch(reading.occupationalRoleResearchCandidates) &&
      validSenseAlignedLexicalRole(reading.senseAlignedLexicalRole) &&
      validRelationOwnershipBindings() &&
      (reading.interpretation.status === "EXPLORATORY_ZHEJI_READING" || reading.interpretation.status === "UNKNOWN_OR_NULL") &&
      (reading.interpretation.statement === null || typeof reading.interpretation.statement === "string") &&
      isStringArray(reading.interpretation.alternatives) &&
      isStringArray(reading.interpretation.basis) &&
      typeof reading.interpretation.claimBoundary === "string";
  };

  if (
    (sourceFact.layer !== "SOURCE_FACT") ||
    typeof sourceFact.language !== "string" ||
    typeof sourceFact.profile !== "string" ||
    (sourceFact.representation !== "production_spoken" &&
      sourceFact.representation !== "albanian_profile" &&
      sourceFact.representation !== "unknown") ||
    typeof sourceFact.sourceStatus !== "string" ||
    typeof sourceFact.authorityBoundary !== "string" ||
    derived.layer !== "DERIVED_STRUCTURE" ||
    !isStringArray(derived.voicePath) ||
    (derived.voicePathSource !== "production_spoken" &&
      derived.voicePathSource !== "albanian_profile" &&
      derived.voicePathSource !== "unknown") ||
    !math7 ||
    !gamma ||
    !zc ||
    !Array.isArray(derived.structuralHypotheses) ||
    (math7.basis !== null && typeof math7.basis !== "string") ||
    (math7.totalMod7 !== null && typeof math7.totalMod7 !== "number") ||
    !isStringArray(math7.principlesPath) ||
    (gamma.status !== "source_pronunciation" && gamma.status !== "profile_derived" && gamma.status !== "NULL") ||
    !isStringArray(gamma.orderedUnits) ||
    (zc.status !== "source_pronunciation" && zc.status !== "NULL") ||
    !Array.isArray(zc.variants) ||
    (exactLexicalSourceStatus !== undefined &&
      (!isRecord(exactLexicalSourceStatus) ||
        (exactLexicalSourceStatus.status !== "MATCHES_FOUND" &&
          exactLexicalSourceStatus.status !== "SOURCE_NOT_FOUND" &&
          exactLexicalSourceStatus.status !== "UNAVAILABLE" &&
          exactLexicalSourceStatus.status !== "NOT_QUERIED") ||
        (exactLexicalSourceStatus.queryForm !== null && typeof exactLexicalSourceStatus.queryForm !== "string") ||
        (exactLexicalSourceStatus.reasonCode !== null && typeof exactLexicalSourceStatus.reasonCode !== "string"))) ||
    (exactLexicalSourceFacts !== undefined &&
      (!Array.isArray(exactLexicalSourceFacts) || !exactLexicalSourceFacts.every(validExactLexicalSourceFact))) ||
    (value.sourceIpaSevenVoiceAnalyses !== undefined &&
      (!Array.isArray(value.sourceIpaSevenVoiceAnalyses) || !value.sourceIpaSevenVoiceAnalyses.every(validSourceIpaSevenVoiceAnalysis)))
      || (value.albanianLexicalReading !== undefined && !validAlbanianLexicalReading(value.albanianLexicalReading, value.exactLexicalSourceFacts))
  ) {
    return missing("malformed", "motivationDiscoveryV0_1 derived structure invalid");
  }

  const candidates: MotivationDiscoveryCandidateV0_1VM[] = [];
  for (const candidate of value.candidates) {
    if (!isRecord(candidate) || !isRecord(candidate.sourceFact) || !isRecord(candidate.derivedStructure) || !isRecord(candidate.structuralComparison) || !isRecord(candidate.functionalInterpretation)) {
      return missing("malformed", "motivationDiscoveryV0_1 candidate invalid");
    }
    const source = candidate.sourceFact;
    const structure = candidate.derivedStructure;
    const comparison = candidate.structuralComparison;
    const inputConsonantal = isRecord(comparison.inputConsonantalStructure)
      ? comparison.inputConsonantalStructure
      : null;
    const candidateConsonantalValue = comparison.candidateConsonantalStructure;
    const candidateConsonantal = candidateConsonantalValue === null
      ? null
      : isRecord(candidateConsonantalValue)
        ? candidateConsonantalValue
        : null;
    const candidateConsonantalMalformed =
      candidateConsonantalValue !== null && !isRecord(candidateConsonantalValue);
    const interpretation = candidate.functionalInterpretation;
    const sourceDetails = source.sourceDetails;
    const sourceDetailsValid = sourceDetails === undefined || (
      isRecord(sourceDetails) &&
      typeof sourceDetails.synsetId === "string" &&
      (sourceDetails.sourceIdentity === undefined || typeof sourceDetails.sourceIdentity === "string") &&
      isStringArray(sourceDetails.definitions) &&
      isStringArray(sourceDetails.examples) &&
      isStringArray(sourceDetails.relationTypes) &&
      (sourceDetails.license === undefined || typeof sourceDetails.license === "string")
    );
    if (
      typeof candidate.candidateId !== "string" ||
      typeof candidate.candidateLanguage !== "string" ||
      typeof candidate.candidateForm !== "string" ||
      typeof candidate.candidateGloss !== "string" ||
      typeof candidate.candidateEmbryo !== "string" ||
      !isStringArray(candidate.candidateVoicePath) ||
      (source.sourceFamilyId !== undefined &&
        (typeof source.sourceFamilyId !== "string" || source.sourceFamilyId.length === 0)) ||
      !sourceDetailsValid ||
      typeof source.sourceId !== "string" ||
      typeof source.sourceStatus !== "string" ||
      typeof source.attestationTruth !== "string" ||
      !isStringArray(source.evidenceRefs) ||
      !isStringArray(structure.protoRoots) ||
      !isStringArray(structure.carrierForms) ||
      !isStringArray(structure.operationIds) ||
      typeof structure.minRootId !== "string" ||
      (comparison.matchClassification !== "STRUCTURAL_MOTIVATION_CANDIDATE" &&
        comparison.matchClassification !== "EXACT_LEXICAL_SELF_MATCH") ||
      (comparison.presentationClassification !== "STRUCTURAL_MOTIVATION" &&
        comparison.presentationClassification !== "LEXICAL_ENTRY_CONFIRMATION") ||
      typeof comparison.matchedQuery !== "string" ||
      (comparison.inputRepresentationKind !== "production_spoken" &&
        comparison.inputRepresentationKind !== "albanian_profile" &&
        comparison.inputRepresentationKind !== "orthographic_profile_derived" &&
        comparison.inputRepresentationKind !== "unknown") ||
      (comparison.candidateRepresentationKind !== "production_spoken" &&
        comparison.candidateRepresentationKind !== "albanian_profile" &&
        comparison.candidateRepresentationKind !== "orthographic_profile_derived" &&
        comparison.candidateRepresentationKind !== "unknown") ||
      (comparison.representationCompatibility !== "SAME_REPRESENTATION" &&
        comparison.representationCompatibility !== "CROSS_REPRESENTATION" &&
        comparison.representationCompatibility !== "NOT_COMPARABLE_ACROSS_REPRESENTATIONS" &&
        comparison.representationCompatibility !== "UNKNOWN") ||
      !isStringArray(comparison.inputVoicePath) ||
      !isStringArray(comparison.candidateVoicePath) ||
      (comparison.voiceRelationship !== "EXACT_ORDERED_VOICE_MATCH" &&
        comparison.voiceRelationship !== "PARTIAL_ORDERED_VOICE_MATCH" &&
        comparison.voiceRelationship !== "EMBRYO_VOICE_MATCH" &&
        comparison.voiceRelationship !== "NO_AUTHORIZED_VOICE_RELATION" &&
        comparison.voiceRelationship !== "NOT_COMPARABLE_ACROSS_REPRESENTATIONS" &&
        comparison.voiceRelationship !== "UNKNOWN") ||
      !inputConsonantal ||
      (inputConsonantal.gamma !== null && !isStringArray(inputConsonantal.gamma)) ||
      (inputConsonantal.zeroConsonantalStructuralComposition !== null &&
        !Array.isArray(inputConsonantal.zeroConsonantalStructuralComposition)) ||
      typeof inputConsonantal.minRootId !== "string" ||
      !isStringArray(inputConsonantal.protoRoots) ||
      !isStringArray(inputConsonantal.carrierForms) ||
      !isStringArray(inputConsonantal.operationIds) ||
      candidateConsonantalMalformed ||
      (candidateConsonantal !== null &&
        (candidateConsonantal.gamma !== null && !isStringArray(candidateConsonantal.gamma) ||
          (candidateConsonantal.zeroConsonantalStructuralComposition !== null &&
            !Array.isArray(candidateConsonantal.zeroConsonantalStructuralComposition)))) ||
      (comparison.consonantalCarrierRelationship !== "INPUT_CARRIER_CONTEXT_ONLY" &&
        comparison.consonantalCarrierRelationship !== "UNRESOLVED") ||
      !isStringArray(comparison.expansionOrCompositionChain) ||
      !isStringArray(comparison.authorizedOperationIds) ||
      !isStringArray(comparison.reasonCodes) ||
      !isStringArray(comparison.unresolvedFields) ||
      typeof comparison.matchReason !== "string" ||
      (interpretation.status !== "REVIEWED_HYPOTHESIS" &&
        interpretation.status !== "GENERATED_BOUNDED_HYPOTHESIS" &&
        interpretation.status !== "NOT_APPLICABLE_SELF_MATCH" &&
        interpretation.status !== "UNKNOWN_OR_NULL") ||
      (interpretation.truthClassification !== "hypothesis" &&
        interpretation.truthClassification !== "unknown_or_null") ||
      (interpretation.statement !== null && typeof interpretation.statement !== "string") ||
      (interpretation.evidenceKind !== "reviewed_functional_evidence" &&
        interpretation.evidenceKind !== "lexical_gloss_plus_structural_match" &&
        interpretation.evidenceKind !== "none") ||
      !isStringArray(interpretation.evidenceRefs) ||
      (interpretation.reason !== null && typeof interpretation.reason !== "string") ||
      candidate.candidateStatus !== "experimental" ||
      candidate.historicalRelation !== "not_claimed" ||
      candidate.userDecisionPosture !== "user_decides" ||
      candidate.noSingleWinner !== true
    ) {
      return missing("malformed", "motivationDiscoveryV0_1 candidate fields invalid");
    }
    candidates.push(candidate as MotivationDiscoveryCandidateV0_1VM);
  }

  return present(value as unknown as MotivationDiscoveryV0_1VM);
}

function parseFunctionalMotivationInterpretationV0_2(
  raw: unknown,
): PresentOrMissing<FunctionalMotivationInterpretationV0_2VM> {
  const value = getField(raw, "functionalMotivationInterpretationV0_2");
  if (value == null) {
    return missing("not_emitted", "functionalMotivationInterpretationV0_2");
  }
  if (!isFunctionalMotivationInterpretationV0_2(value)) {
    return missing("malformed", "functionalMotivationInterpretationV0_2 shape invalid");
  }
  return present(value);
}

function pickVoicePaths(payload: unknown): { detected: string | null; surface: string | null; functional: string | null } {
  // detected (primary)
  const primaryPathValue = getField(payload, "primaryPath");
  const primaryPath = isRecord(primaryPathValue) ? primaryPathValue : null;
  const detectedArr = primaryPath ? normalizeVowelPathArray(primaryPath["voicePath"]) : null;

  // surface/functional (optional)
  const detected = detectedArr ? detectedArr.join("-") : null;

  const evidenceValue = getField(payload, "evidence");
  const evidence = isRecord(evidenceValue) ? evidenceValue : null;

  const deepRootValue = getField(payload, "deepRoot");
  const deepRoot = isRecord(deepRootValue) ? deepRootValue : null;

  const functionalRoots =
    deepRoot && Array.isArray(deepRoot["functionalRoots"])
      ? deepRoot["functionalRoots"]
      : null;

  const functionalRoot0 =
    functionalRoots && functionalRoots.length > 0 && isRecord(functionalRoots[0])
      ? functionalRoots[0]
      : null;

  const candidatesValue = getField(payload, "candidates");
  const candidates = Array.isArray(candidatesValue) ? candidatesValue : null;

  const candidate0 =
    candidates && candidates.length > 0 && isRecord(candidates[0])
      ? candidates[0]
      : null;

  const surface =
    (() => {
      const sv = evidence?.["surfaceVowels"];
      if (Array.isArray(sv)) {
        const joined = normalizeVowelPathString(sv.map((x) => String(x)).join("-"))?.join("-");
        return joined ?? normalizeVowelPathArray(sv)?.join("-") ?? null;
      }
      return null;
    })();

  const functional =
    (normalizeVowelPathString(functionalRoot0?.["vowelPath"])?.join("-") ?? null) ??
    (normalizeVowelPathArray(functionalRoot0?.["vowelPath"])?.join("-") ?? null) ??
    (normalizeVowelPathString(functionalRoot0?.["vowel_path"])?.join("-") ?? null) ??
    (normalizeVowelPathArray(functionalRoot0?.["vowel_path"])?.join("-") ?? null) ??
    (normalizeVowelPathString(candidate0?.["vowelPath"])?.join("-") ?? null) ??
    (normalizeVowelPathArray(candidate0?.["vowelPath"])?.join("-") ?? null) ??
    (normalizeVowelPathString(candidate0?.["vowel_path"])?.join("-") ?? null) ??
    (normalizeVowelPathArray(candidate0?.["vowel_path"])?.join("-") ?? null) ??
    null;

  return { detected, surface, functional };
}

function stableCandidateId(index: number, lang: string | null, form: string | null): string {
  return `cand_${index}_${(lang ?? "xx").toLowerCase()}_${(form ?? "form").toLowerCase()}`.replace(/[^a-z0-9_]/g, "_");
}

function parseAnalysisStatusV0_1(
  payload: unknown,
): PresentOrMissing<AnalysisStatusV0_1VM> {
  if (!isRecord(payload)) {
    return missing("malformed", "analysisStatusV0_1 payload");
  }

  const value = payload["analysisStatusV0_1"];

  if (value == null) {
    return missing("not_emitted", "analysisStatusV0_1");
  }

  if (!isRecord(value)) {
    return missing("malformed", "analysisStatusV0_1 expected object");
  }

  const schemaVersion = value["schemaVersion"];
  const statusValue = value["status"];
  const summary = value["summary"];
  const reviewedOperators = value["reviewedOperators"];
  const candidateOnlyOperators = value["candidateOnlyOperators"];
  const researchHypothesisEmbryos =
    value["researchHypothesisEmbryos"];
  const structuralTokens = value["structuralTokens"];
  const claimBoundary = value["claimBoundary"];
  const userDecisionPosture = value["userDecisionPosture"];

  const allowedStatuses = new Set<AnalysisStatusV0_1VM["status"]>([
    "reviewed_functional_evidence",
    "research_functional_hypothesis",
    "candidate_only",
    "structural_unreviewed",
    "null_no_supported_candidate",
  ]);

  if (
    schemaVersion !== "open-instrument.analysis-status.v0_1" ||
    typeof statusValue !== "string" ||
    !allowedStatuses.has(statusValue as AnalysisStatusV0_1VM["status"]) ||
    typeof summary !== "string" ||
    !Array.isArray(reviewedOperators) ||
    !reviewedOperators.every((item) => typeof item === "string") ||
    !Array.isArray(candidateOnlyOperators) ||
    !candidateOnlyOperators.every((item) => typeof item === "string") ||
    !(
      (
        Array.isArray(
          researchHypothesisEmbryos,
        ) &&
        researchHypothesisEmbryos.every(
          (item) =>
            typeof item === "string",
        )
      ) ||
      (
        researchHypothesisEmbryos == null &&
        statusValue !==
          "research_functional_hypothesis"
      )
    ) ||
    !Array.isArray(structuralTokens) ||
    !structuralTokens.every((item) => typeof item === "string") ||
    !isRecord(claimBoundary) ||
    userDecisionPosture !== "user_decides"
  ) {
    return missing("malformed", "analysisStatusV0_1 contract");
  }

  if (
    claimBoundary["historicalOriginClaim"] !== "not_claimed" ||
    claimBoundary["historicalTransmissionClaim"] !== "not_claimed" ||
    claimBoundary["winnerClaim"] !== "not_claimed" ||
    claimBoundary["languageSuperiorityClaim"] !== "not_claimed" ||
    claimBoundary["linguisticOwnershipClaim"] !== "not_claimed" ||
    claimBoundary["candidateTruthClaim"] !== "not_claimed" ||
    claimBoundary["structuralOutputIsCandidateTruth"] !== false ||
    claimBoundary["nullIsValid"] !== true
  ) {
    return missing("malformed", "analysisStatusV0_1 claimBoundary");
  }

  return present({
    schemaVersion: "open-instrument.analysis-status.v0_1",
    status: statusValue as AnalysisStatusV0_1VM["status"],
    summary,
    reviewedOperators: reviewedOperators.map((item) => String(item)),
    candidateOnlyOperators: candidateOnlyOperators.map((item) => String(item)),
    researchHypothesisEmbryos:
      Array.isArray(
        researchHypothesisEmbryos,
      )
        ? researchHypothesisEmbryos.map(
            (item) => String(item),
          )
        : [],
    structuralTokens: structuralTokens.map((item) => String(item)),
    claimBoundary: {
      historicalOriginClaim: "not_claimed",
      historicalTransmissionClaim: "not_claimed",
      winnerClaim: "not_claimed",
      languageSuperiorityClaim: "not_claimed",
      linguisticOwnershipClaim: "not_claimed",
      candidateTruthClaim: "not_claimed",
      structuralOutputIsCandidateTruth: false,
      nullIsValid: true,
    },
    userDecisionPosture: "user_decides",
  });
}
// ----------------------- adapter -----------------------

export function adaptAnalysisToTelemetryVM(raw: unknown): TelemetryViewModel {
  const payload = raw;
  const doctrineReading = parseDoctrineReading(getField(payload, "doctrineReading"));
  const wordSpecificFunctionalDepth = parseWordSpecificFunctionalDepthV0_1(
    getField(payload, "wordSpecificFunctionalDepth"),
  );
  const motivationDiscoveryV0_1 = parseMotivationDiscoveryV0_1(payload);
  const motivationDiscoveryFieldEmitted =
    isRecord(payload) && Object.prototype.hasOwnProperty.call(payload, "motivationDiscoveryV0_1");
  const functionalMotivationInterpretationV0_2 =
    parseFunctionalMotivationInterpretationV0_2(payload);
  const functionalMotivationInterpretationFieldEmitted =
    isRecord(payload) && Object.prototype.hasOwnProperty.call(payload, "functionalMotivationInterpretationV0_2");

  const vp = pickVoicePaths(payload);

  // DeepRoot–Heart Alignment Gate v0.1 (adapter-first)
  // Prefer emitted Heart primary path when available (more canonical than UI-detected fallback).
  // Accept both string and array-ish shapes; normalize to dash-delimited.
  const heartPrimaryPathForGate: string | null =
    (() => {
      const heartPrimaryPath = getField(payload, "heartPrimaryPath");
      const s =
        normalizeVowelPathString(heartPrimaryPath)?.join("-") ??
        normalizeVowelPathArray(heartPrimaryPath)?.join("-") ??
        null;

      const cleaned = typeof s === "string" && s.trim() ? s.trim() : null;
      return cleaned ?? (vp.detected ?? null);
    })();


  // Accept unknown input, normalize to a dash-delimited string, then parse.
  // This avoids runtime crashes when upstream emits arrays or non-strings.
  const toVoiceParts = (v: unknown): Vowel[] | null => {
    if (!v) return null;

    // If we got ["U","I"] etc.
    if (Array.isArray(v)) {
      const parts = v.map((x) => (typeof x === "string" ? x : String(x))).map((t) => t.trim()).filter(Boolean);
      const out: Vowel[] = [];
      for (const p of parts) {
        const vv = normalizeVowelChar(p);
        if (!vv) return null;
        out.push(vv);
      }
      return out.length ? out : null;
    }

    // If we got "U-I" or "U→I" or "UI"
    if (typeof v !== "string") return null;
    const str = v;

    const parts = str.includes("-") ? str.split("-") : str.includes("→") ? str.split("→") : str.split("");
    const out: Vowel[] = [];
    for (const p of parts.map((t) => t.trim()).filter(Boolean)) {
      const vv = normalizeVowelChar(p);
      if (!vv) return null;
      out.push(vv);
    }
    return out.length ? out : null;
  };

  const detectedParts = toVoiceParts(vp.detected);

// Embryo-first path semantics:
// - detected path = primary/Heart surface detection.
// - surface path = evidence.surfaceVowelsRaw when emitted.
// - functional path = DeepRoot functionalRoots vowelPath when emitted.
// - evidence.surfaceVowels/evidence.vowelPath are run-level fallbacks.
// - candidate vowelPath is a final compatibility fallback only.
//
// This prevents a surface U-Y reading from masking a DeepRoot functional U-I
// reading and falsely reporting MATCH.

  const hiRootValue = getField(payload, "heartInstrumentV1");
  const hiRoot = isRecord(hiRootValue) ? hiRootValue : null;
  const hiSurfaceArr = hiRoot ? asStringArray(hiRoot["surfaceVowels"]) : null;

  const spokenPronunciation: PresentOrMissing<SpokenPronunciationProvenanceV0_1VM> = (() => {
    if (!hiRoot) return missing("not_emitted", "heartInstrumentV1.spokenPronunciation");

    const rawPronunciation = hiRoot["spokenPronunciation"];
    if (rawPronunciation == null) {
      return missing("not_emitted", "heartInstrumentV1.spokenPronunciation");
    }
    if (!isRecord(rawPronunciation)) {
      return missing("malformed", "heartInstrumentV1.spokenPronunciation expected object");
    }

    const status = rawPronunciation["status"];
    if (status !== "defined" && status !== "null") {
      return missing("malformed", "spokenPronunciation.status expected defined|null");
    }

    const reasonCode = rawPronunciation["reasonCode"];
    if (reasonCode !== null && typeof reasonCode !== "string") {
      return missing("malformed", "spokenPronunciation.reasonCode expected string|null");
    }

    const normalizedWord = rawPronunciation["normalizedWord"];
    const sourceProfileId = rawPronunciation["sourceProfileId"];
    const sourceNotation = rawPronunciation["sourceNotation"];
    const sourceRevision = rawPronunciation["sourceRevision"];
    const rawVariants = rawPronunciation["variants"];

    if (typeof normalizedWord !== "string") {
      return missing("malformed", "spokenPronunciation.normalizedWord expected string");
    }
    if (typeof sourceProfileId !== "string" || !sourceProfileId.trim()) {
      return missing("malformed", "spokenPronunciation.sourceProfileId expected string");
    }
    if (typeof sourceNotation !== "string" || !sourceNotation.trim()) {
      return missing("malformed", "spokenPronunciation.sourceNotation expected string");
    }
    if (typeof sourceRevision !== "string" || !sourceRevision.trim()) {
      return missing("malformed", "spokenPronunciation.sourceRevision expected string");
    }
    if (!Array.isArray(rawVariants)) {
      return missing("malformed", "spokenPronunciation.variants expected array");
    }

    const variants: SpokenPronunciationVariantV0_1VM[] = [];
    for (const [index, rawVariantResult] of rawVariants.entries()) {
      if (!isRecord(rawVariantResult)) {
        return missing("malformed", `spokenPronunciation.variants[${index}] expected object`);
      }

      const rawVariant = rawVariantResult["variant"];
      if (!isRecord(rawVariant)) {
        return missing("malformed", `spokenPronunciation.variants[${index}].variant expected object`);
      }

      const sourceForm = rawVariant["sourceForm"];
      const sourcePronunciation = rawVariant["sourcePronunciation"];
      const variantId = rawVariant["variantId"];
      const variantOrder = rawVariant["variantOrder"];
      const rawCanonicalPath = rawVariantResult["canonicalVoicePath"];
      const variantReasonCode = rawVariantResult["reasonCode"];
      const rawNormalizedSegments = rawVariantResult["normalizedSegments"];
      const rawZeroConsonantalStructuralComposition =
        rawVariantResult["zeroConsonantalStructuralComposition"];

      if (typeof sourceForm !== "string" || !sourceForm.trim()) {
        return missing("malformed", `spokenPronunciation.variants[${index}].variant.sourceForm expected string`);
      }
      if (typeof sourcePronunciation !== "string" || !sourcePronunciation.trim()) {
        return missing("malformed", `spokenPronunciation.variants[${index}].variant.sourcePronunciation expected string`);
      }
      if (typeof variantId !== "string" || !variantId.trim()) {
        return missing("malformed", `spokenPronunciation.variants[${index}].variant.variantId expected string`);
      }
      if (typeof variantOrder !== "number" || !Number.isInteger(variantOrder)) {
        return missing("malformed", `spokenPronunciation.variants[${index}].variant.variantOrder expected integer`);
      }
      if (variantReasonCode !== null && typeof variantReasonCode !== "string") {
        return missing("malformed", `spokenPronunciation.variants[${index}].reasonCode expected string|null`);
      }

      let canonicalVoicePath: Vowel[] | null = null;
      if (rawCanonicalPath !== null && rawCanonicalPath !== undefined) {
        canonicalVoicePath = toVoiceParts(rawCanonicalPath);
        if (!canonicalVoicePath) {
          return missing("malformed", `spokenPronunciation.variants[${index}].canonicalVoicePath expected Voice[]|null`);
        }
      }

      const zeroConsonantalStructuralComposition =
        parseZeroConsonantalStructuralCompositionV0_1(
          rawZeroConsonantalStructuralComposition,
          {
            voicePath: canonicalVoicePath,
            variantId,
            variantOrder,
            sourceProfileId,
            sourceNotation,
            sourceRevision,
          },
        );
      if (!zeroConsonantalStructuralComposition.ok) {
        return missing(
          "malformed",
          `spokenPronunciation.variants[${index}].${zeroConsonantalStructuralComposition.reason}`,
        );
      }

      let segments: PronunciationConsonantSegmentV0_1VM[] = [];
      if (status === "defined") {
        if (!Array.isArray(rawNormalizedSegments)) {
          return missing("malformed", `spokenPronunciation.variants[${index}].normalizedSegments expected array`);
        }

        for (const [segmentIndex, rawSegment] of rawNormalizedSegments.entries()) {
          if (!isRecord(rawSegment)) {
            return missing("malformed", `spokenPronunciation.variants[${index}].normalizedSegments[${segmentIndex}] expected object`);
          }

          const normalizedSegmentIndex = rawSegment["segmentIndex"];
          const kind = rawSegment["kind"];
          const sourceUnits = rawSegment["sourceUnits"];
          if (typeof normalizedSegmentIndex !== "number" || !Number.isInteger(normalizedSegmentIndex)) {
            return missing("malformed", `spokenPronunciation.variants[${index}].normalizedSegments[${segmentIndex}].segmentIndex expected integer`);
          }
          if (typeof kind !== "string") {
            return missing("malformed", `spokenPronunciation.variants[${index}].normalizedSegments[${segmentIndex}].kind expected string`);
          }
          if (!Array.isArray(sourceUnits) || !sourceUnits.every((unit): unit is string => typeof unit === "string")) {
            return missing("malformed", `spokenPronunciation.variants[${index}].normalizedSegments[${segmentIndex}].sourceUnits expected string[]`);
          }

          if (kind === "consonant") {
            segments.push({
              segmentIndex: normalizedSegmentIndex,
              sourceUnits,
              kind,
            });
          }
        }

        segments.sort((left, right) => left.segmentIndex - right.segmentIndex);
      }

      variants.push({
        sourceForm,
        sourcePronunciation,
        variantId,
        variantOrder,
        canonicalVoicePath,
        reasonCode: variantReasonCode,
        segments,
        zeroConsonantalStructuralComposition: zeroConsonantalStructuralComposition.value,
      });
    }

    return present({
      status,
      reasonCode,
      normalizedWord,
      sourceProfileId,
      sourceNotation,
      sourceRevision,
      variants,
    });
  })();

// Evidence may exist at root or mirrored in raw.evidence (adapter must not touch later bindings).
const evRootEvidenceValue = getField(payload, "evidence");
const evRootEvidence = isRecord(evRootEvidenceValue) ? evRootEvidenceValue : null;

const rawPayload = getField(payload, "raw");
const rawEvidenceValue = isRecord(rawPayload) ? rawPayload["evidence"] : null;
const evRawEvidence = isRecord(rawEvidenceValue) ? rawEvidenceValue : null;

const evPick = evRootEvidence ?? evRawEvidence ?? null;

const evSurfaceRawArr = evPick ? asStringArray(evPick["surfaceVowelsRaw"]) : null;
const evFunctionalArr = evPick ? asStringArray(evPick["surfaceVowels"]) : null;
const evVowelPathArr = evPick ? asStringArray(evPick["vowelPath"]) : null;

// Prefer arrays; otherwise fall back to legacy string sources.
const surfaceForParts =
  evSurfaceRawArr
    ? evSurfaceRawArr.join("-")
    : hiSurfaceArr
      ? hiSurfaceArr.join("-")
      : vp.surface;

const deepRootForReadoutValue =
  getField(payload, "deepRoot");

const deepRootForReadout =
  isRecord(deepRootForReadoutValue)
    ? deepRootForReadoutValue
    : null;

const deepRootFunctionalRootsForReadout =
  deepRootForReadout &&
  Array.isArray(
    deepRootForReadout["functionalRoots"],
  )
    ? deepRootForReadout["functionalRoots"]
    : null;

const deepRootFunctionalRoot0ForReadout =
  deepRootFunctionalRootsForReadout &&
  deepRootFunctionalRootsForReadout.length > 0 &&
  isRecord(
    deepRootFunctionalRootsForReadout[0],
  )
    ? deepRootFunctionalRootsForReadout[0]
    : null;

const deepRootFunctionalForParts =
  (normalizeVowelPathString(
    deepRootFunctionalRoot0ForReadout?.["vowelPath"],
  )?.join("-") ?? null) ??
  (normalizeVowelPathArray(
    deepRootFunctionalRoot0ForReadout?.["vowelPath"],
  )?.join("-") ?? null) ??
  (normalizeVowelPathString(
    deepRootFunctionalRoot0ForReadout?.["vowel_path"],
  )?.join("-") ?? null) ??
  (normalizeVowelPathArray(
    deepRootFunctionalRoot0ForReadout?.["vowel_path"],
  )?.join("-") ?? null) ??
  null;

const functionalNormalizationValue =
  getField(
    payload,
    "functionalVoiceNormalizationV0_1",
  );

const functionalNormalization =
  isRecord(
    functionalNormalizationValue,
  )
    ? functionalNormalizationValue
    : null;

const automaticCarrierPronunciationValue =
  getField(
    payload,
    "automaticCarrierPronunciationV0_1",
  );

const automaticCarrierPronunciation =
  isRecord(
    automaticCarrierPronunciationValue,
  )
    ? automaticCarrierPronunciationValue
    : null;

const normalizedFunctionalForParts =
  functionalNormalization
    ? (
        normalizeVowelPathArray(
          functionalNormalization[
            "functionalPath"
          ],
        )?.join("-") ??
        normalizeVowelPathString(
          functionalNormalization[
            "functionalPath"
          ],
        )?.join("-") ??
        null
      )
    : null;

// Legacy payload compatibility:
// evidence.surfaceVowels/evidence.vowelPath remain valid
// run-level functional fallbacks when no Slice G
// normalization attempt exists.
//
// A modern attempted pronunciation with no usable
// normalization MUST NOT silently fall back to surface
// and call it functional.
const modernFunctionalAuthorityPresent =
  functionalNormalization !== null ||
  (
    automaticCarrierPronunciation !== null &&
    (
      automaticCarrierPronunciation[
        "attempted"
      ] === true ||
      automaticCarrierPronunciation[
        "status"
      ] === "manual_ipa"
    )
  );

const legacyFunctionalForParts =
  evFunctionalArr
    ? evFunctionalArr.join("-")
    : evVowelPathArr
      ? evVowelPathArr.join("-")
      : vp.functional;

const functionalForParts =
  deepRootFunctionalForParts ??
  normalizedFunctionalForParts ??
  (
    modernFunctionalAuthorityPresent
      ? null
      : legacyFunctionalForParts
  );

const surfaceParts = toVoiceParts(surfaceForParts);
const functionalParts = toVoiceParts(functionalForParts);

const voicePathDetectedMaybe: PresentOrMissing<Vowel[]> =
    detectedParts ? present(detectedParts) : missing<Vowel[]>("not_emitted");

  const voicePathSurfaceMaybe: PresentOrMissing<Vowel[]> =
    surfaceParts ? present(surfaceParts) : missing<Vowel[]>("not_emitted");

  const voicePathFunctionalMaybe: PresentOrMissing<Vowel[]> =
    functionalParts ? present(functionalParts) : missing<Vowel[]>("not_emitted");
  // Delta must be computed from the SAME sources the UI renders:
// - surfaceParts uses evidence.surfaceVowelsRaw (fallback: heartInstrumentV1.surfaceVowels, then vp.surface)
// - functionalParts uses DeepRoot functional path first,
//   then emitted evidence, then candidate compatibility fallback.
  const surfaceNorm = surfaceParts ? surfaceParts.join("-") : null;
  const functionalNorm = functionalParts ? functionalParts.join("-") : null;

  
      type SpectrumSectionVM = {
      vowels: Vowel[];
      indices1: number[];
      ringIndex: number[];
      colors: string[];
      notes: string[];
      roles: string[];
      polarities: string[];
      rings: string[];
      crossesCenter: boolean;
      endsOnE: boolean;
      endsOnË: boolean;
      drift: "static" | "mostly_increasing" | "mostly_decreasing" | "mixed";
    };

function buildSpectrumSection(m: PresentOrMissing<Vowel[]>): PresentOrMissing<SpectrumSectionVM> {
      if (m && m.kind === "present" && Array.isArray(m.value)) {
        const vowels = m.value;

        const indices1 = vowels.map((v) => vowelToIndex1(v));
        const ringIndex = vowels.map((v) => vowelToRingIndex(v));
        const colors = vowels.map((v) => vowelToColor(v));
        const notes = vowels.map((v) => vowelToNote(v));

        // doctrine (SSOT): role / polarity / ring label
        const roles = vowels.map((v) => SEVEN_PRINCIPLES[v].role);
        const polarities = vowels.map((v) => SEVEN_PRINCIPLES[v].polarity);
        const rings = vowels.map((v) => SEVEN_PRINCIPLES[v].ring);

        const crossesCenter = indices1.includes(4);
        const last = indices1.length ? indices1[indices1.length - 1] : null;
        const endsOnE = last === 2;
        const endsOnË = last === 7;

        let inc = 0, dec = 0;
        for (let i = 1; i < indices1.length; i++) {
          if (indices1[i] > indices1[i - 1]) inc++;
          else if (indices1[i] < indices1[i - 1]) dec++;
        }
        const drift =
          indices1.length <= 1 ? "static" :
          inc > dec ? "mostly_increasing" :
          dec > inc ? "mostly_decreasing" :
          "mixed";

        return present({
          vowels,
          indices1,
          ringIndex,
          colors,
          notes,
          roles,
          polarities,
          rings,
          crossesCenter,
          endsOnE,
          endsOnË,
          drift,
        });
      }
        // Preserve original missing reason if present
        if (m.kind === "missing") {
          const missingStateValue = m.missing;
          const missingState =
            missingStateValue === "none" ||
            missingStateValue === "not_emitted" ||
            missingStateValue === "malformed" ||
            missingStateValue === "unknown"
              ? missingStateValue
              : "unknown";
          const note = typeof m.note === "string" ? m.note : undefined;
          return missing(missingState, note);
        }

        return missing("unknown");
    }

  const sevenPrinciplesSpectrum = (() => {
    const surface = buildSpectrumSection(voicePathSurfaceMaybe);
    const functional = buildSpectrumSection(voicePathFunctionalMaybe);

    const surfaceStr =
        surface.kind === "present" && surface.value?.vowels
          ? surface.value.vowels.join("-")
          : "";

      const functionalStr =
        functional.kind === "present" && functional.value?.vowels
          ? functional.value.vowels.join("-")
          : "";

    return {
      surface,
      functional,
      delta: {
        same: surfaceStr === functionalStr,
        surface: surfaceStr || undefined,
        functional: functionalStr || undefined,
      },
    };
  })();


  const voicePathDelta =
    surfaceNorm && functionalNorm
      ? (surfaceNorm === functionalNorm ? "MATCH" : "DIVERGE")
      : "NOT_EMITTED";

  const root = isRecord(raw) ? raw : {};
  const heart = isRecord(root["heart"]) ? root["heart"] : null;

  const word = asString(root["word"]) ?? "(missing word)";
  const sanitized = asString(root["sanitized"]);
  const engineVersion = pickFromRootMetaContract(root, "engineVersion");
  const mode =
      normalizeMode(pickFromRootMetaContract(root, "mode") ?? root["mode"]) ??
      (heart ? normalizeMode(heart["mode"]) : null);
  const alphabet =
    pickFromRootMetaContract(root, "alphabet") ??
    (heart ? asString(heart["alphabet"]) : null);

  const meta = isRecord(root["meta"]) ? root["meta"] : null;
  const createdAt = meta ? asString(meta["created"]) : null;

  const heartPrinciplePath = heart ? (asStringArray(heart["principlePath"]) ?? null) : null;

  const heartMath7 = heart && isRecord(heart["math7"]) ? heart["math7"] : null;
  const heartMath7Primary = heartMath7 && isRecord(heartMath7["primary"]) ? heartMath7["primary"] : null;

  const math7PrinciplesPath = heartMath7Primary ? asStringArray(heartMath7Primary["principlesPath"]) : null;
  const principlesPathRaw = heartPrinciplePath ?? math7PrinciplesPath;
  const principlesPath = principlesPathRaw ? normalizePrinciplesToLabels(principlesPathRaw) : null;

  const primaryPath = isRecord(root["primaryPath"]) ? root["primaryPath"] : null;
  const detectedVoicePath =
    (primaryPath ? normalizeVowelPathArray(primaryPath["voicePath"]) : null) ??
    (heartMath7Primary ? normalizeVowelPathArray(heartMath7Primary["vowels"]) : null);

  const strictInputEmittedRaw =
      (heart ? heart["strictInput"] : null) ??
      root["strictInput"] ??
      pickFromRootMetaContract(root, "strictInput") ??
      null;

    const strictInputEmittedBool: boolean | null =
      (() => {
        if (typeof strictInputEmittedRaw === "boolean") return strictInputEmittedRaw;
        const s = asString(strictInputEmittedRaw);
        if (!s) return null;
        const nm = normalizeMode(s);
        if (nm === "strict") return true;
        if (nm === "open") return false;
        return null;
      })();

    const strictInput: PresentOrMissing<boolean> =
      strictInputEmittedBool !== null
        ? presentBool(strictInputEmittedBool)
        : mode
          ? presentBool(mode === "strict")
          : missing("not_emitted", "Expected strictInput; derive requires mode");

// Evidence ledger sources (root -> raw.evidence -> heart.evidence)
    const rootEvidence = isRecord(root["evidence"]) ? root["evidence"] : null;

    const rawRecord = isRecord(root["raw"]) ? root["raw"] : null;
    const rawEvidence = rawRecord && isRecord(rawRecord["evidence"]) ? rawRecord["evidence"] : null;

    const heartEvidence = heart && isRecord(heart["evidence"]) ? heart["evidence"] : null;

    const evidence = rootEvidence ?? rawEvidence ?? heartEvidence ?? null;

const normalizationSteps =
    asArray(evidence?.["normalizationSteps"]) ??
    asArray(heartEvidence?.["normalizationSteps"]) ??
    null;

  const rootOps = asArray(root["ops"]);
  const ops =
    asArray(evidence?.["ops"]) ??
    rootOps ??
    asArray(heartEvidence?.["ops"]) ??
    null;

  const rootNotes = asArray(root["notes"]);
  const notes =
    asArray(evidence?.["notes"]) ??
    rootNotes ??
    asArray(heartEvidence?.["notes"]) ??
    null;

  const rootSignals = asArray(root["signals"]);
  const signals =
    asArray(evidence?.["signals"]) ??
    rootSignals ??
    asArray(heartEvidence?.["signals"]) ??
    null;

    // Canonical DeepRoot functional vowel path (if emitted)
    // Prefer this for DeepRoot–Heart gate comparisons; fall back per-candidate otherwise.
    const deepRootFunctionalPathStr: string | null =
  (() => {
    const deepRoot = isRecord(root["deepRoot"]) ? root["deepRoot"] : null;
    const functionalRoots = deepRoot && Array.isArray(deepRoot["functionalRoots"]) ? deepRoot["functionalRoots"] : null;
    const fr0 = functionalRoots && functionalRoots.length > 0 && isRecord(functionalRoots[0]) ? functionalRoots[0] : null;

    const arr =
      normalizeVowelPathArray(fr0 ? fr0["vowelPath"] : null) ??
      normalizeVowelPathString(fr0 ? fr0["vowelPath"] : null) ??
      normalizeVowelPathArray(fr0 ? fr0["vowel_path"] : null) ??
      normalizeVowelPathString(fr0 ? fr0["vowel_path"] : null) ??
      normalizeVowelPathArray(fr0 ? fr0["voicePath"] : null) ??
      normalizeVowelPathString(fr0 ? fr0["voicePath"] : null) ??
      normalizeVowelPathArray(fr0 ? fr0["voice_path"] : null) ??
      normalizeVowelPathString(fr0 ? fr0["voice_path"] : null) ??
      null;

    const s = arr ? arr.join("-") : null;
    return typeof s === "string" && s.trim() ? s.trim() : null;
  })();

  // Candidates
  const candRaw = Array.isArray(root["candidates"]) ? root["candidates"] : null;
  const candidates: CandidateRowVM[] = [];

  if (candRaw) {
    candRaw.forEach((c, i) => {
      const rec = isRecord(c) ? c : {};
      const lang = asString(rec["language"]);
      const form = asString(rec["form"]);
      const id = asString(rec["id"]) ?? stableCandidateId(i, lang, form);

      // v0.3 honest-provenance: lift candidateRecord.source.kind into the VM.
      // Adapter is the designated raw->VM boundary, so the lift happens here.
      const candRecord = isRecord(rec["candidateRecord"]) ? rec["candidateRecord"] : null;
      const candSource = candRecord && isRecord(candRecord["source"]) ? candRecord["source"] : null;
      const candSourceKind = asString(rec["sourceKind"]) ?? (candSource ? asString(candSource["kind"]) : null);

      const statusWasEmitted = Object.prototype.hasOwnProperty.call(rec, "status");
      const candidateStatus = parseCandidateStatus(rec["status"]);
      const status = statusWasEmitted
          ? candidateStatus
          ? present<CandidateStatus>(candidateStatus)
          : missing<CandidateStatus>(
              "malformed",
              "candidate.status expected pass | fail | experimental | unknown",
            )
        : undefined;
      const confidenceTag = parseOptionalCandidateString(rec, "confidenceTag");
      const fitTag = parseOptionalCandidateString(rec, "fitTag");

      const targetWord =
        asString(rec["targetWord"]);
      const targetSenseId =
        asString(rec["targetSenseId"]);
      const targetSenseLabel =
        asString(rec["targetSenseLabel"]);
      const semanticAlignmentStatus =
        asString(rec["semanticAlignmentStatus"]);
      const semanticAlignmentSource =
        asString(rec["semanticAlignmentSource"]);
      const semanticAlignmentReasonCodes =
        asStringArray(rec["semanticAlignmentReasonCodes"]);
      const semanticAlignmentBridge =
        asString(rec["semanticAlignmentBridge"]);
      const sourceId =
        asString(rec["sourceId"]);
      const sourceStatus =
        asString(rec["sourceStatus"]);
      const semanticBridge =
        asString(rec["semanticBridge"]);
      const evidenceRefs =
        asStringArray(
          rec["evidenceRefs"],
        );
      const attestationTruth =
        asString(rec["attestationTruth"]);
      const functionalBridgeTruth =
        asString(
          rec["functionalBridgeTruth"],
        );
      const evidenceBasis =
        asString(rec["evidenceBasis"]);

      // Analyze V1 validates this as an ordered string array; preserve it
      // without deriving, sorting, or normalizing the emitted chain.
      const expansionChain =
        asStringArray(rec["expansionChain"]);

      const embryo = asString(rec["embryo"]);
      const plainStandaloneGloss =
        asString(rec["plainStandaloneGloss"]);
      const claimType = asString(rec["claimType"]);
      const validationOutcome =
        asString(rec["validationOutcome"]);
      const rankGroup = asString(rec["rankGroup"]);
      const claimBoundary =
        asString(rec["claimBoundary"]);
      const userDecisionPosture =
        asString(rec["userDecisionPosture"]);

      const isGenericFunctionalHypothesis =
        claimType === "genericFunctionalHypothesis";

      const discoveryStatus =
        asString(rec["discoveryStatus"]);

      const independentStandaloneMeaningWasEmitted =
        Object.prototype.hasOwnProperty.call(
          rec,
          "independentStandaloneMeaning",
        );

      const independentStandaloneMeaningValue =
        rec["independentStandaloneMeaning"];

      const independentStandaloneMeaningIsValid =
        independentStandaloneMeaningWasEmitted &&
        (
          independentStandaloneMeaningValue === null ||
          typeof independentStandaloneMeaningValue === "string"
        );

      const functionalSupportStatus =
        asString(rec["functionalSupportStatus"]);

      const historicalOriginClaim =
        asString(rec["historicalOriginClaim"]);

      const candidateTruthClaim =
        asString(rec["candidateTruthClaim"]);

      const genericFunctionalWitnessRuntimeProjection =
        parseGenericFunctionalWitnessRuntimeProjectionV1(
          rec["genericFunctionalWitnessRuntimeProjectionV1"],
        );

      const segmentation =
        isRecord(rec["segmentation"])
          ? rec["segmentation"]
          : null;

      const segmentationKind =
        segmentation
          ? asString(
              segmentation["kind"],
            )
          : null;

      const rawFunctionalComponents =
        segmentation &&
        (
          segmentationKind ===
            "functionalComposition" ||
          segmentationKind ===
            "functionalProposal"
        )
          ? asArray(
              segmentation["components"],
            )
          : isGenericFunctionalHypothesis
            ? asArray(rec["functionalComponents"])
            : null;

      const functionalComponents =
        (
          rawFunctionalComponents ?? []
        ).flatMap((item) => {
          if (!isRecord(item)) {
            return [];
          }

          const embryo =
            asString(item["embryo"]) ??
            (isGenericFunctionalHypothesis
              ? asString(item["voice"])
              : null);

          if (!embryo) {
            return [];
          }

          const componentLanguageRaw =
            item["language"] ??
            (isGenericFunctionalHypothesis
              ? "voice-profile"
              : null);

          const plainMeaningRaw =
            item["plainMeaning"];

          const evidenceStateRaw =
            item["evidenceState"] ??
            (isGenericFunctionalHypothesis
              ? item["profileTruthClassification"]
              : null);

          const componentLanguage:
            string | null =
            typeof componentLanguageRaw ===
              "string"
              ? componentLanguageRaw.trim() ||
                null
              : null;

          const plainMeaning:
            string | null =
            typeof plainMeaningRaw ===
              "string"
              ? plainMeaningRaw.trim() ||
                null
              : null;

          const evidenceState:
            string | null =
            typeof evidenceStateRaw ===
              "string"
              ? evidenceStateRaw.trim() ||
                null
              : null;

          return [
            {
              embryo,
              language:
                componentLanguage
                  ? present<string>(
                      componentLanguage,
                    )
                  : missing<string>(
                      "not_emitted",
                    ),
              plainMeaning:
                plainMeaning
                  ? present<string>(
                      plainMeaning,
                    )
                  : missing<string>(
                      "not_emitted",
                    ),
              evidenceState:
                evidenceState
                  ? present<string>(
                      evidenceState,
                    )
                  : missing<string>(
                      "not_emitted",
                    ),
            },
          ];
        });

// EvidenceRefs should be stable and filesystem-safe (no ":" etc.)
const evidenceId = String(id).toLowerCase().replace(/[^a-z0-9_]/g, "_");

      const functionalStatement =
        asString(rec["functionalStatement"]) ??
        asString(rec["function"]) ??
        null;

      const candVowelPath =
  normalizeVowelPathArray(rec["vowelPath"]) ??
  normalizeVowelPathString(rec["vowelPath"]) ??
  normalizeVowelPathArray(rec["vowel_path"]) ??
  normalizeVowelPathString(rec["vowel_path"]) ??
  normalizeVowelPathArray(rec["voicePath"]) ??
  normalizeVowelPathString(rec["voicePath"]) ??
  normalizeVowelPathArray(rec["voice_path"]) ??
  normalizeVowelPathString(rec["voice_path"]) ??
  null;

      // v0.1.1: populate per-candidate lists when present (no heuristics).
      const candOps = asArray(rec["ops"]);
      const candNotes = asArray(rec["notes"]) ?? asArray(rec["note"]) ?? null; // note may be string; handled by presentStringArray via String()
      const candSignals = asArray(rec["signals"]);

      candidates.push({
        index: i,
        id,
        language: lang ? present(lang) : missing("not_emitted"),
        form: form ? present(form) : missing("not_emitted"),
        sourceKind: candSourceKind ? present(candSourceKind) : missing("not_emitted"),

        ...(status ? { status } : {}),
        ...(confidenceTag ? { confidenceTag } : {}),
        ...(fitTag ? { fitTag } : {}),

        ...(targetWord
          ? {
              targetWord:
                present(targetWord),
            }
          : {}),

        ...(targetSenseId
          ? {
              targetSenseId: present(targetSenseId),
            }
          : {}),

        ...(targetSenseLabel
          ? {
              targetSenseLabel: present(targetSenseLabel),
            }
          : {}),

        ...(semanticAlignmentStatus
          ? { semanticAlignmentStatus: present(semanticAlignmentStatus) }
          : {}),

        ...(semanticAlignmentSource
          ? { semanticAlignmentSource: present(semanticAlignmentSource) }
          : {}),

        ...(semanticAlignmentReasonCodes && semanticAlignmentReasonCodes.length > 0
          ? { semanticAlignmentReasonCodes: present(semanticAlignmentReasonCodes) }
          : {}),

        ...(semanticAlignmentBridge
          ? { semanticAlignmentBridge: present(semanticAlignmentBridge) }
          : {}),

        ...(sourceId
          ? {
              sourceId:
                present(sourceId),
            }
          : {}),

        ...(sourceStatus
          ? {
              sourceStatus:
                present(sourceStatus),
            }
          : {}),

        ...(semanticBridge
          ? {
              semanticBridge:
                present(semanticBridge),
            }
          : {}),

        ...(evidenceRefs &&
        evidenceRefs.length > 0
          ? {
              evidenceRefs:
                present(evidenceRefs),
            }
          : {}),

        ...(attestationTruth
          ? {
              attestationTruth:
                present(attestationTruth),
            }
          : {}),

        ...(functionalBridgeTruth
          ? {
              functionalBridgeTruth:
                present(
                  functionalBridgeTruth,
                ),
            }
          : {}),

        ...(evidenceBasis
          ? { evidenceBasis: present(evidenceBasis) }
          : {}),

        ...(expansionChain
          ? {
              expansionChain:
                present(expansionChain),
            }
          : {}),

        ...(embryo
          ? { embryo: present(embryo) }
          : {}),

        ...(plainStandaloneGloss
          ? {
              plainStandaloneGloss:
                present(plainStandaloneGloss),
            }
          : {}),

        ...(claimType
          ? { claimType: present(claimType) }
          : {}),

        ...(validationOutcome
          ? {
              validationOutcome:
                present(validationOutcome),
            }
          : {}),

        ...(rankGroup
          ? { rankGroup: present(rankGroup) }
          : {}),

        ...(claimBoundary
          ? {
              claimBoundary:
                present(claimBoundary),
            }
          : {}),

        ...(userDecisionPosture
          ? {
              userDecisionPosture:
                present(userDecisionPosture),
            }
          : {}),

        ...(discoveryStatus
          ? {
              discoveryStatus:
                present(discoveryStatus),
            }
          : {}),

        ...(independentStandaloneMeaningIsValid
          ? {
              independentStandaloneMeaning:
                present(
                  independentStandaloneMeaningValue as
                    string | null,
                ),
            }
          : {}),

        ...(functionalSupportStatus
          ? {
              functionalSupportStatus:
                present(functionalSupportStatus),
            }
          : {}),

        ...(historicalOriginClaim
          ? {
              historicalOriginClaim:
                present(historicalOriginClaim),
            }
          : {}),

        ...(candidateTruthClaim
          ? {
              candidateTruthClaim:
                present(candidateTruthClaim),
            }
          : {}),

        ...(genericFunctionalWitnessRuntimeProjection
          ? {
              genericFunctionalWitnessRuntimeProjectionV1:
                present(
                  genericFunctionalWitnessRuntimeProjection,
                ),
            }
          : {}),

        ...(functionalComponents.length > 0
          ? {
              functionalComponents:
                present(
                  functionalComponents,
                ),
            }
          : {}),

        functionalStatement: functionalStatement ? present(functionalStatement) : missing("not_emitted"),
        vowelPath: candVowelPath ? present(candVowelPath) : missing("not_emitted"),

                        deepRootHeartGate: present(
          computeDeepRootHeartGateV01({
            heartPrimaryPath: heartPrimaryPathForGate,
            deepRootFunctionalPath:
              (candVowelPath && candVowelPath.length
                ? candVowelPath.join("-")
                : claimType !== "functionalMotivation"
                  ? deepRootFunctionalPathStr
                  : null),
            evidenceRefs: [
              "heartPrimaryPath",
              "primaryPath.voicePath",
              ...(candVowelPath && candVowelPath.length
                ? ["candidates[" + evidenceId + "].vowelPath"]
                : claimType !== "functionalMotivation" &&
                    deepRootFunctionalPathStr
                  ? ["deepRoot.functionalRoots[0].vowelPath"]
                  : []),
            ],
          })
        ),
// leave decomposition for later (shape varies too much right now)
        decomposition: missing<DecompositionItemVM[]>("not_emitted"),

        ops: candOps ? presentStringArray(candOps) : missing("not_emitted"),
        notes: candNotes ? presentStringArray(candNotes) : missing("not_emitted"),
        signals: candSignals ? presentStringArray(candSignals) : missing("not_emitted"),

        raw: c,
      });
    });
  }

  let math: PresentOrMissing<MathTelemetryVM> = missing("not_emitted");
  if (heartMath7Primary) {
    math = present({
      L: missing("not_emitted"),
      verdict: missing("not_emitted"),
      OI: missing("not_emitted"),
      light: missing("not_emitted"),
      shadow: missing("not_emitted"),
      bridge: missing("not_emitted"),
      ringSummary: missing("not_emitted"),
      levelSummary: missing("not_emitted"),
      raw: heartMath7Primary,
    });
  }

  const rejectionItems: PresentOrMissing<RejectionItemVM[]> = missing("not_emitted");

  const status: "detected" | "none" | "error" =
    detectedVoicePath && detectedVoicePath.length ? "detected" : "none";

  const p = isRecord(payload) ? payload : null;
  const oc = p && isRecord(p.originClaim) ? p.originClaim : null;
    const originClaim: PresentOrMissing<unknown> = oc ? present<unknown>(oc) : missing<unknown>("not_emitted", "originClaim");

    // ----------------------- rootMap v0.1 -----------------------
    const rootMap: PresentOrMissing<RootMapVM> = (() => {
      if (!isRecord(payload)) return missing("not_emitted", "rootMap");
      if (!("rootMap" in payload)) return missing("not_emitted", "rootMap");

      const v = payload["rootMap"];
      if (v == null) return missing("not_emitted", "rootMap");

      const parsed = parseRootMapV1(v);
      if (!parsed.ok) return missing("malformed", parsed.reason);

      return present(parsed.value);
    })();

  const reasonCounts: Record<string, number> = {};
    const ocCandidates = oc && Array.isArray(oc["candidates"]) ? oc["candidates"] : null;
    if (ocCandidates) {
      for (const c of ocCandidates) {
        if (!isRecord(c)) continue;
        const reasonCodes = c["reasonCodes"];
        if (!Array.isArray(reasonCodes)) continue;
        for (const code of reasonCodes) {
          const codeStr = String(code);
          reasonCounts[codeStr] = (reasonCounts[codeStr] ?? 0) + 1;
        }
      }
    }

  const gatesActive = (oc && isRecord(oc.policy) && oc.policy.gatesActive === true) || (oc && oc.policy === "gates-v1.1");

  
  // ----------------------- resonance profile v0.1 -----------------------

    const resonanceProfileV1: PresentOrMissing<ResonanceProfileV1VM> = (() => {
    if (!isRecord(payload)) return missing("not_emitted", "resonanceProfileV1");
    if (!("resonanceProfileV1" in payload)) return missing("not_emitted", "resonanceProfileV1");

    const v = payload["resonanceProfileV1"];
    if (v == null) return missing("not_emitted", "resonanceProfileV1");

    if (!isRecord(v)) return missing("malformed", "resonanceProfileV1 expected object");

    const version = asString(v["version"]);
    if (!version) return missing("malformed", "resonanceProfileV1.version expected string");

    if (!("surface" in v)) return missing("malformed", "resonanceProfileV1.surface missing");
    if (!("normalized" in v)) return missing("malformed", "resonanceProfileV1.normalized missing");

    const parseResonanceReadout = (
      input: unknown,
      label: "surface" | "normalized"
    ):
      | { ok: true; value: ResonanceProfileV1VM["surface"] }
      | { ok: false; reason: string } => {
      if (!isRecord(input)) return { ok: false, reason: `resonanceProfileV1.${label} expected object` };

      const vowels = asStringArray(input["vowels"]);
      if (!vowels) return { ok: false, reason: `resonanceProfileV1.${label}.vowels expected string[]` };

      const bucketCountsValue = input["bucketCounts"];
      if (!isRecord(bucketCountsValue)) {
        return { ok: false, reason: `resonanceProfileV1.${label}.bucketCounts expected object` };
      }

      const source = typeof bucketCountsValue["source"] === "number" ? bucketCountsValue["source"] : null;
      const boundary = typeof bucketCountsValue["boundary"] === "number" ? bucketCountsValue["boundary"] : null;
      const manifest = typeof bucketCountsValue["manifest"] === "number" ? bucketCountsValue["manifest"] : null;
      if (source == null || boundary == null || manifest == null) {
        return {
          ok: false,
          reason: `resonanceProfileV1.${label}.bucketCounts expected numeric source/boundary/manifest`,
        };
      }

      const dominantBucket = asString(input["dominantBucket"]);
      if (
        dominantBucket !== "source" &&
        dominantBucket !== "boundary" &&
        dominantBucket !== "manifest" &&
        dominantBucket !== "mixed" &&
        dominantBucket !== "none"
      ) {
        return { ok: false, reason: `resonanceProfileV1.${label}.dominantBucket expected ResonanceBucket` };
      }

      const signature = asString(input["signature"]);
      if (!signature) return { ok: false, reason: `resonanceProfileV1.${label}.signature expected string` };

      const polaritySymbol = asString(input["polaritySymbol"]);
      if (!polaritySymbol) {
        return { ok: false, reason: `resonanceProfileV1.${label}.polaritySymbol expected string` };
      }

      const colorBand = asStringArray(input["colorBand"]);
      if (!colorBand) return { ok: false, reason: `resonanceProfileV1.${label}.colorBand expected string[]` };

      const dominantColor = asString(input["dominantColor"]);
      if (!dominantColor) {
        return { ok: false, reason: `resonanceProfileV1.${label}.dominantColor expected string` };
      }

      const transitions = asStringArray(input["transitions"]);
      if (!transitions) {
        return { ok: false, reason: `resonanceProfileV1.${label}.transitions expected string[]` };
      }

      const notes = asStringArray(input["notes"]);
      if (!notes) return { ok: false, reason: `resonanceProfileV1.${label}.notes expected string[]` };

      return {
        ok: true,
        value: {
          vowels,
          bucketCounts: { source, boundary, manifest },
          dominantBucket,
          signature,
          polaritySymbol,
          colorBand,
          dominantColor,
          transitions,
          notes,
        },
      };
    };

    const surfaceParsed = parseResonanceReadout(v["surface"], "surface");
    if (!surfaceParsed.ok) return missing("malformed", surfaceParsed.reason);

    const normalizedParsed = parseResonanceReadout(v["normalized"], "normalized");
    if (!normalizedParsed.ok) return missing("malformed", normalizedParsed.reason);

    return present({
      version,
      surface: surfaceParsed.value,
      normalized: normalizedParsed.value,
    });
  })();

  // ----------------------- phonetic IPA v0.1 -----------------------
    const phoneticIpaV0_1: PresentOrMissing<PhoneticIpaV0_1VM> = (() => {
    if (!isRecord(payload)) return missing("not_emitted", "phoneticIpaV0_1");
    if (!("phoneticIpaV0_1" in payload)) return missing("not_emitted", "phoneticIpaV0_1");

    const v = payload["phoneticIpaV0_1"];
    if (v == null) return missing("not_emitted", "phoneticIpaV0_1");
    if (!isRecord(v)) return missing("malformed", "phoneticIpaV0_1 expected object");

    const ipa = asString(v["ipa"]);
    const voices = asVowelArray2(v["voices"]);
    const diagnostics = isRecord(v["diagnostics"]) ? v["diagnostics"] : null;
    const unmappedRaw = diagnostics ? diagnostics["unmapped"] : null;
    const unmapped = Array.isArray(unmappedRaw) ? unmappedRaw.map((x) => String(x)) : [];

    if (!ipa) return missing("malformed", "phoneticIpaV0_1.ipa expected string");
    if (!voices) return missing("malformed", "phoneticIpaV0_1.voices expected Vowel[]");

    return present({ ipa, voices, unmapped });
  })();
const originClaimGatesActiveRecord =
    isRecord(raw) && isRecord(raw["originClaimGates"]) ? raw["originClaimGates"] : null;

const originClaimGates: OriginClaimGatesVM = {
    active: (() => {
      // VM-only: NEVER override with dev flags / URL params.
      const a = originClaimGatesActiveRecord ? originClaimGatesActiveRecord["active"] : null;
      if (typeof a === "boolean") return a;

      // Fallback: derive from OriginClaim policy gates indicator.
      return !!gatesActive;
    })(),
    flag: "ocg" as const,
    candidateCount: (oc && Array.isArray(oc.candidates)) ? oc.candidates.length : 0,
    reasonCounts,
  };

  return {
    readout: {
      voicePath: voicePathDetectedMaybe,
      voicePathSurface: voicePathSurfaceMaybe,
      voicePathFunctional: voicePathFunctionalMaybe,
      voicePathDelta,

        sevenPrinciplesSpectrum,
      word,
      normalizedWord: sanitized ? present(sanitized) : missing("not_emitted", "sanitized"),
      mode: mode ? present(mode) : missing("not_emitted", "mode"),
      strictInput,
      engineVersion: engineVersion ? present(engineVersion) : missing("not_emitted", "engineVersion"),
      alphabet: alphabet ? present(alphabet) : missing("not_emitted", "alphabet"),
      createdAt: createdAt ? present(createdAt) : missing("not_emitted", "meta.created"),
      principlesPath: principlesPath
        ? present(principlesPath)
        : missing("not_emitted", "heart.principlePath | heart.math7.primary.principlesPath"),
      phoneticIpaV0_1,
      spokenPronunciation,
      status,
      counts: {
        candidates: candidates.length,
        ops: countOrMissing(ops),
        notes: countOrMissing(notes),
        signals: countOrMissing(signals),
        rejections: missing("not_emitted"),
      },
    },

    doctrineReading,
    ...(wordSpecificFunctionalDepth.kind === "missing"
      ? {}
      : { wordSpecificFunctionalDepth }),
    ...(motivationDiscoveryFieldEmitted
      ? { motivationDiscoveryV0_1 }
      : motivationDiscoveryV0_1.kind === "missing"
      ? {}
      : { motivationDiscoveryV0_1 }),
    ...(functionalMotivationInterpretationFieldEmitted
      ? { functionalMotivationInterpretationV0_2 }
      : functionalMotivationInterpretationV0_2.kind === "missing"
      ? {}
      : { functionalMotivationInterpretationV0_2 }),
    evidence: {
      normalizationSteps: pomStringListFromEvidenceField(evidence, "normalizationSteps"),
      ops: pomStringListFromEvidenceField(evidence, "ops"),
      notes: pomStringListFromEvidenceField(evidence, "notes"),
      signals: pomStringListFromEvidenceField(evidence, "signals"),
    },

    candidates,
    math,
    rejections: { items: rejectionItems },
    originClaimGates,
      originClaim,
      rootMap,
      soundRoots: adaptSoundRootsToVM(payload),

      resonanceProfileV1,
    analysisStatusV0_1: parseAnalysisStatusV0_1(payload),
    raw,
  };
}


  // ----------------------- helpers: vowel arrays -----------------------
  function isVowelSymbol(s: string): s is import("../telemetry/types").Vowel {
    return s === "A" || s === "E" || s === "I" || s === "O" || s === "U" || s === "Y" || s === "Ë";
  }

  function asVowelArray2(v: unknown): import("../telemetry/types").Vowel[] | null {
    if (!Array.isArray(v)) return null;
    const out: import("../telemetry/types").Vowel[] = [];
    for (const x of v) {
      const s = asString(x);
      if (!s) return null;
      const up = s.toUpperCase();
      if (!isVowelSymbol(up)) return null;
      out.push(up);
    }
    return out;
  }
// ----------------------- malformed-aware array extraction -----------------------

function pomStringListFromEvidenceField(
  parent: Record<string, unknown> | null,
  field: "normalizationSteps" | "ops" | "notes" | "signals"
): PresentOrMissing<string[]> {
  if (!parent) return missing("not_emitted", `evidence.${field}`);
  if (!(field in parent)) return missing("not_emitted", `evidence.${field}`);

  const v = parent[field];
  if (v == null) return missing("not_emitted", `evidence.${field}`);
  if (!Array.isArray(v)) return missing("malformed", `evidence.${field} expected array`);

  const mapped =
    field === "normalizationSteps"
      ? v.map((x: unknown) => formatNormalizationStep(x))
      : v.map((x: unknown) => formatEvidenceItem(x));

  return present(mapped);
}

export function adaptComparisonSourceResultToTelemetryVMV0_1(raw: unknown): TelemetryViewModel {
  return adaptAnalysisToTelemetryVM(raw);
}
