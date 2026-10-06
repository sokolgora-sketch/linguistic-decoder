import type { AnalyzeWordResultV1 } from "@/shared/analysisResult.v1";
import { buildMinRootHypotheses } from "@/shared/deepRoot.minRoots.v1";
import { extractSevenVowelsFromString } from "@/shared/math7.core";
import { discoverStructuralHypothesesV0_1 } from "@/shared/structuralHypothesisDiscovery.v0_1";
import {
  GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
  queryGenericFunctionalWitnessesV1,
  type GenericFunctionalWitnessV1,
} from "@/shared/openInstrument/genericFunctionalWitnessDiscovery.v1";
import {
  createReviewedExternalLexiconWitnessAdapterV0_1,
} from "@/shared/openInstrument/reviewedExternalLexiconWitnessAdapter.v0_1";
import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
} from "@/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import type { HeartInstrumentV1 } from "@/v1/heartInstrument.v1";

export const MOTIVATION_ENGINE_DISCOVERY_SCHEMA_V0_1 =
  "open-instrument.motivation-engine-discovery.v0_1" as const;

export type MotivationEngineDiscoveryCandidateV0_1 = Readonly<{
  candidateId: string;
  candidateLanguage: string;
  candidateForm: string;
  candidateGloss: string;
  candidateEmbryo: string;
  candidateVoicePath: readonly string[];
  sourceFact: Readonly<{
    sourceId: string;
    sourceStatus: string;
    attestationTruth: string;
    evidenceRefs: readonly string[];
    sourceUrlOrArchiveRef: string | null;
    entryLocator: string | null;
  }>;
  derivedStructure: Readonly<{
    minRootId: string;
    protoRoots: readonly string[];
    carrierForms: readonly string[];
    operationIds: readonly string[];
  }>;
  functionalInterpretation: Readonly<{
    truthClassification: "hypothesis";
    statement: string | null;
  }>;
  candidateStatus: "experimental";
  historicalRelation: "not_claimed";
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
}>;

export type MotivationEngineDiscoveryV0_1 = Readonly<{
  schemaVersion: typeof MOTIVATION_ENGINE_DISCOVERY_SCHEMA_V0_1;
  status: "MATCHES_FOUND" | "NO_MATCHES";
  inputWord: string;
  inputLanguage: string;
  inputProfile: string;
  sourceFact: Readonly<{
    layer: "SOURCE_FACT";
    language: string;
    profile: string;
    representation: "production_spoken" | "albanian_profile" | "unknown";
    sourceStatus: string;
    authorityBoundary: string;
  }>;
  derivedStructure: Readonly<{
    layer: "DERIVED_STRUCTURE";
    voicePath: readonly string[];
    voicePathSource: "production_spoken" | "albanian_profile" | "unknown";
    math7: Readonly<{
      basis: string | null;
      totalMod7: number | null;
      principlesPath: readonly string[];
    }>;
    gamma: Readonly<{
      status: "source_pronunciation" | "profile_derived" | "NULL";
      orderedUnits: readonly string[];
      reason: string | null;
    }>;
    zeroConsonantalStructuralComposition: Readonly<{
      status: "source_pronunciation" | "NULL";
      variants: readonly unknown[];
      reason: string | null;
    }>;
    structuralHypotheses: readonly Readonly<{
      hypothesisId: string;
      embryo: string;
      expansionChain: readonly string[];
      reasonCodes: readonly string[];
    }>[];
  }>;
  candidates: readonly MotivationEngineDiscoveryCandidateV0_1[];
  interpretation: Readonly<{
    layer: "ZË-RO_INTERPRETATION_OR_HYPOTHESIS";
    status: "hypothesis" | "UNKNOWN_OR_NULL";
    note: string;
  }>;
  unknownOrNull: Readonly<{
    layer: "UNKNOWN_OR_NULL";
    reason: string | null;
  }>;
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
}>;

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as UnknownRecord
    : null;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function stableUniqueRoots(word: string) {
  const roots = buildMinRootHypotheses(word, {
    allowSSh: true,
    langAllowList: ["sq"],
    maxHypotheses: 25,
    maxSegments: 5,
  });
  const seen = new Set<string>();
  return roots.filter((root) => {
    const key = root.protoRoots.join("+");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function spokenGamma(heart: HeartInstrumentV1) {
  if (heart.spokenPronunciation.status !== "defined") {
    return {
      status: "NULL" as const,
      orderedUnits: [],
      reason: "SPOKEN_PRONUNCIATION_UNAVAILABLE",
    };
  }

  return {
    status: "source_pronunciation" as const,
    orderedUnits: heart.spokenPronunciation.variants.flatMap((variant) =>
      variant.normalizedSegments
        .filter((segment) => segment.kind === "consonant")
        .flatMap((segment) => [...segment.sourceUnits]),
    ),
    reason: null,
  };
}

function spokenZc(heart: HeartInstrumentV1) {
  if (heart.spokenPronunciation.status !== "defined") {
    return {
      status: "NULL" as const,
      variants: [],
      reason: "SPOKEN_PRONUNCIATION_UNAVAILABLE",
    };
  }

  return {
    status: "source_pronunciation" as const,
    variants: heart.spokenPronunciation.variants.map(
      (variant) => variant.zeroConsonantalStructuralComposition,
    ),
    reason: null,
  };
}

function profileDerivedGamma(analysis: AnalyzeWordResultV1) {
  const root = asRecord(analysis);
  const consonants = asRecord(root?.consonants);
  const field = asRecord(consonants?.field);
  const slots = Array.isArray(field?.slots) ? field.slots : [];
  const orderedUnits = slots
    .map((slot) => asRecord(slot)?.ch)
    .filter((value): value is string => typeof value === "string");

  return {
    status: "profile_derived" as const,
    orderedUnits,
    reason: orderedUnits.length
      ? "ALBANIAN_PROFILE_CONSONANT_FIELD_DERIVED_STRUCTURE"
      : "CONSONANT_FIELD_NOT_EMITTED",
  };
}

function math7Summary(analysis: AnalyzeWordResultV1, heart: HeartInstrumentV1) {
  const root = asRecord(analysis);
  const heartRoot = asRecord(root?.heart);
  const math = asRecord(heartRoot?.math7) ?? asRecord(heart.math7);
  const primary = asRecord(math?.primary);
  const principles = Array.isArray(primary?.principlesPath)
    ? primary.principlesPath.filter((value): value is string => typeof value === "string")
    : [];

  return {
    basis: text(primary?.basis) || null,
    totalMod7: typeof primary?.totalMod7 === "number" ? primary.totalMod7 : heart.math7.totalMod7,
    principlesPath: principles.length ? principles : [...heart.principlesPath],
  };
}

function rowForSourceId(sourceId: string) {
  return getReviewedExternalLexiconProductionSourceRowsV0_1().find(
    (row) => row.sourceId === sourceId,
  ) ?? null;
}

function buildCandidate(
  word: string,
  root: ReturnType<typeof stableUniqueRoots>[number],
  witness: GenericFunctionalWitnessV1,
): MotivationEngineDiscoveryCandidateV0_1 {
  const sourceRow = rowForSourceId(witness.sourceId);
  const operationIds = root.carriers
    .filter((carrier) => root.protoRoots.includes(carrier.protoRootId))
    .flatMap((carrier) => carrier.ops)
    .sort(compareText);

  return {
    candidateId: `motivation-discovery:${word}:${root.id}:${witness.sourceId}`,
    candidateLanguage: witness.language,
    candidateForm: witness.sourceForm,
    candidateGloss: witness.gloss,
    candidateEmbryo: witness.queryForm,
    candidateVoicePath: [...extractSevenVowelsFromString(witness.sourceForm)],
    sourceFact: {
      sourceId: witness.sourceId,
      sourceStatus: witness.sourceAuthorityStatus ?? witness.sourceStatus,
      attestationTruth: witness.attestationTruth,
      evidenceRefs: [...witness.citationRefs],
      sourceUrlOrArchiveRef: witness.sourceProvenance?.sourceUrlOrArchiveRef ?? null,
      entryLocator: witness.sourceProvenance?.entryLocator ?? null,
    },
    derivedStructure: {
      minRootId: root.id,
      protoRoots: [...root.protoRoots],
      carrierForms: root.carriers.map((carrier) => carrier.carrierForm),
      operationIds,
    },
    functionalInterpretation: {
      truthClassification: "hypothesis",
      statement: sourceRow?.semanticBridge ?? null,
    },
    candidateStatus: "experimental",
    historicalRelation: "not_claimed",
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
  };
}

/**
 * Builds the additive Discovery Lab projection from existing deterministic
 * structure and existing generic source adapters. It is deliberately separate
 * from the production candidate/status path.
 */
export function buildMotivationEngineDiscoveryV0_1(input: {
  word: string;
  inputLanguage: string;
  inputProfile: string;
  analysis: AnalyzeWordResultV1;
  heart: HeartInstrumentV1;
}): MotivationEngineDiscoveryV0_1 {
  const word = input.word.normalize("NFC").trim();
  const isAlbanianProfile = input.inputProfile === "albanian" || input.inputLanguage === "sq";
  const spokenPath = input.heart.canonicalSpokenVoicePath;
  const profilePath = asRecord(input.analysis.primaryPath)?.voicePath;
  const fallbackVoicePath = Array.isArray(profilePath)
    ? profilePath.filter((value): value is string => typeof value === "string")
    : typeof profilePath === "string"
      ? profilePath
          .split(profilePath.includes("→") ? "→" : "-")
          .map((value) => value.trim())
          .filter(Boolean)
      : [];
  const voicePath = spokenPath?.length ? [...spokenPath] : fallbackVoicePath;
  const voicePathSource = spokenPath?.length
    ? "production_spoken" as const
    : isAlbanianProfile
      ? "albanian_profile" as const
      : "unknown" as const;
  const structuralHypotheses = discoverStructuralHypothesesV0_1(word).map((hypothesis) => ({
    hypothesisId: hypothesis.hypothesisId,
    embryo: hypothesis.embryo,
    expansionChain: [...hypothesis.expansionChain],
    reasonCodes: [...hypothesis.reasonCodes],
  }));

  const candidates: MotivationEngineDiscoveryCandidateV0_1[] = [];
  const seenCandidateKeys = new Set<string>();
  for (const root of stableUniqueRoots(word)) {
    for (const protoRoot of root.protoRoots) {
      const candidateVoicePath = extractSevenVowelsFromString(protoRoot);
      if (candidateVoicePath.length === 0) continue;

      const discovery = queryGenericFunctionalWitnessesV1(
        {
          schemaVersion: GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
          embryo: protoRoot,
          voicePath: candidateVoicePath,
          queryNormalization: "EXACT_NFC",
        },
        [createReviewedExternalLexiconWitnessAdapterV0_1()],
      );

      for (const witness of discovery.matches) {
        const key = `${root.id}:${witness.sourceId}`;
        if (seenCandidateKeys.has(key)) continue;
        seenCandidateKeys.add(key);
        candidates.push(buildCandidate(word, root, witness));
      }
    }
  }

  candidates.sort((left, right) => compareText(left.candidateId, right.candidateId));

  const status = candidates.length > 0 ? "MATCHES_FOUND" as const : "NO_MATCHES" as const;
  return Object.freeze({
    schemaVersion: MOTIVATION_ENGINE_DISCOVERY_SCHEMA_V0_1,
    status,
    inputWord: word,
    inputLanguage: input.inputLanguage,
    inputProfile: input.inputProfile,
    sourceFact: {
      layer: "SOURCE_FACT",
      language: input.inputLanguage,
      profile: input.inputProfile,
      representation: spokenPath?.length
        ? "production_spoken"
        : isAlbanianProfile
          ? "albanian_profile"
          : "unknown",
      sourceStatus: spokenPath?.length
        ? "production_authoritative_pronunciation"
        : isAlbanianProfile
          ? "explicit_profile_binding_without_spoken_authority"
          : "source_not_bound",
      authorityBoundary: isAlbanianProfile
        ? "Albanian Discovery profile only; no production pronunciation promotion"
        : "Existing production source may enrich Discovery; no candidate/status mutation",
    },
    derivedStructure: {
      layer: "DERIVED_STRUCTURE",
      voicePath,
      voicePathSource,
      math7: math7Summary(input.analysis, input.heart),
      gamma: spokenPath?.length
        ? spokenGamma(input.heart)
        : isAlbanianProfile
          ? profileDerivedGamma(input.analysis)
          : spokenGamma(input.heart),
      zeroConsonantalStructuralComposition: spokenPath?.length
        ? spokenZc(input.heart)
        : {
            status: "NULL" as const,
            variants: [],
            reason: "NO_AUTHORIZED_SPOKEN_VARIANT_FOR_DISCOVERY_INPUT",
          },
      structuralHypotheses,
    },
    candidates,
    interpretation: {
      layer: "ZË-RO_INTERPRETATION_OR_HYPOTHESIS",
      status: candidates.length > 0 ? "hypothesis" : "UNKNOWN_OR_NULL",
      note: candidates.length > 0
        ? "Source facts and deterministic structure may support a functional motivation hypothesis; historical relation and winner claims remain unclaimed."
        : "No qualifying generic source witness was found for the derived structure; Null is valid.",
    },
    unknownOrNull: {
      layer: "UNKNOWN_OR_NULL",
      reason: candidates.length > 0 ? null : "NO_GENERIC_AUTHORIZED_SOURCE_WITNESS",
    },
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
  }) as MotivationEngineDiscoveryV0_1;
}
