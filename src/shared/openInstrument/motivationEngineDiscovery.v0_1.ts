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
  createAlbanianLexicalSubstrateWitnessAdapterV0_1,
} from "@/shared/openInstrument/albanianLexicalSubstrate.v0_1";
import type { HeartInstrumentV1 } from "@/v1/heartInstrument.v1";

export const MOTIVATION_ENGINE_DISCOVERY_SCHEMA_V0_1 =
  "open-instrument.motivation-engine-discovery.v0_1" as const;

export type MotivationRepresentationKindV0_1 =
  | "production_spoken"
  | "albanian_profile"
  | "orthographic_profile_derived"
  | "unknown";

export type MotivationRepresentationCompatibilityV0_1 =
  | "SAME_REPRESENTATION"
  | "CROSS_REPRESENTATION"
  | "NOT_COMPARABLE_ACROSS_REPRESENTATIONS"
  | "UNKNOWN";

export type MotivationStructuralComparisonV0_1 = Readonly<{
  matchClassification:
    | "STRUCTURAL_MOTIVATION_CANDIDATE"
    | "EXACT_LEXICAL_SELF_MATCH";
  presentationClassification:
    | "STRUCTURAL_MOTIVATION"
    | "LEXICAL_ENTRY_CONFIRMATION";
  matchedQuery: string;
  inputRepresentationKind: MotivationRepresentationKindV0_1;
  candidateRepresentationKind: MotivationRepresentationKindV0_1;
  representationCompatibility: MotivationRepresentationCompatibilityV0_1;
  inputVoicePath: readonly string[];
  candidateVoicePath: readonly string[];
  voiceRelationship:
    | "EXACT_ORDERED_VOICE_MATCH"
    | "PARTIAL_ORDERED_VOICE_MATCH"
    | "EMBRYO_VOICE_MATCH"
    | "NO_AUTHORIZED_VOICE_RELATION"
    | "NOT_COMPARABLE_ACROSS_REPRESENTATIONS"
    | "UNKNOWN";
  inputConsonantalStructure: Readonly<{
    gamma: readonly string[] | null;
    zeroConsonantalStructuralComposition: readonly unknown[] | null;
    minRootId: string;
    protoRoots: readonly string[];
    carrierForms: readonly string[];
    operationIds: readonly string[];
  }>;
  candidateConsonantalStructure: Readonly<{
    gamma: readonly string[] | null;
    zeroConsonantalStructuralComposition: readonly unknown[] | null;
  }> | null;
  consonantalCarrierRelationship:
    | "INPUT_CARRIER_CONTEXT_ONLY"
    | "UNRESOLVED";
  expansionOrCompositionChain: readonly string[];
  authorizedOperationIds: readonly string[];
  reasonCodes: readonly string[];
  unresolvedFields: readonly string[];
  matchReason: string;
}>;

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
  structuralComparison: MotivationStructuralComparisonV0_1;
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

type CandidateMatchContextV0_1 = Readonly<{
  queryForm: string;
  minRootId: string;
  protoRoots: readonly string[];
  carrierForms: readonly string[];
  operationIds: readonly string[];
  expansionOrCompositionChain: readonly string[];
  reasonCodes: readonly string[];
}>;

function normalizedLexicalFormV0_1(value: string): string {
  return value.normalize("NFC").trim().toLocaleLowerCase("en-US");
}

function normalizedLanguageV0_1(value: string): string {
  const normalized = value.normalize("NFC").trim().toLocaleLowerCase("en-US");
  if (normalized === "sq" || normalized === "albanian") return "sq";
  if (normalized === "en" || normalized === "english") return "en";
  return normalized;
}

function buildStructuralComparisonV0_1(
  word: string,
  inputLanguage: string,
  inputRepresentationKind: MotivationRepresentationKindV0_1,
  inputVoicePath: readonly string[],
  inputGamma: readonly string[] | null,
  inputZeroConsonantalStructuralComposition: readonly unknown[] | null,
  matchContext: CandidateMatchContextV0_1,
  candidateVoicePath: readonly string[],
  witness: GenericFunctionalWitnessV1,
): MotivationStructuralComparisonV0_1 {
  const selfMatch =
    normalizedLanguageV0_1(inputLanguage) === normalizedLanguageV0_1(witness.language) &&
    normalizedLexicalFormV0_1(word) ===
    normalizedLexicalFormV0_1(witness.sourceForm);
  const representationCompatibility =
    inputRepresentationKind === "unknown"
      ? "UNKNOWN" as const
      : "CROSS_REPRESENTATION" as const;
  const unresolvedFields = [
    "CANDIDATE_CONSONANTAL_STRUCTURE_NOT_AUTHORIZED",
    "CANDIDATE_ZERO_CONSONANTAL_STRUCTURE_NOT_AUTHORIZED",
    ...(inputRepresentationKind === "unknown"
      ? ["INPUT_REPRESENTATION_UNKNOWN"]
      : []),
  ];

  return {
    matchClassification: selfMatch
      ? "EXACT_LEXICAL_SELF_MATCH"
      : "STRUCTURAL_MOTIVATION_CANDIDATE",
    presentationClassification: selfMatch
      ? "LEXICAL_ENTRY_CONFIRMATION"
      : "STRUCTURAL_MOTIVATION",
    matchedQuery: witness.queryForm,
    inputRepresentationKind,
    candidateRepresentationKind: "orthographic_profile_derived",
    representationCompatibility,
    inputVoicePath: [...inputVoicePath],
    candidateVoicePath: [...candidateVoicePath],
    voiceRelationship: inputRepresentationKind === "unknown"
      ? "UNKNOWN"
      : "NOT_COMPARABLE_ACROSS_REPRESENTATIONS",
    inputConsonantalStructure: {
      gamma: inputGamma ? [...inputGamma] : null,
      zeroConsonantalStructuralComposition:
        inputZeroConsonantalStructuralComposition
          ? [...inputZeroConsonantalStructuralComposition]
          : null,
      minRootId: matchContext.minRootId,
      protoRoots: [...matchContext.protoRoots],
      carrierForms: [...matchContext.carrierForms],
      operationIds: [...matchContext.operationIds],
    },
    candidateConsonantalStructure: null,
    consonantalCarrierRelationship:
      matchContext.protoRoots.length || matchContext.carrierForms.length ||
      matchContext.operationIds.length
        ? "INPUT_CARRIER_CONTEXT_ONLY"
        : "UNRESOLVED",
    expansionOrCompositionChain: [...matchContext.expansionOrCompositionChain],
    authorizedOperationIds: [...new Set([
      ...matchContext.operationIds,
      ...witness.relationOperationIds,
    ])].sort(compareText),
    reasonCodes: [...matchContext.reasonCodes],
    unresolvedFields,
    matchReason: selfMatch
      ? "Input lexical form matches a source-attested lexical record; this is lexical entry confirmation, not a cross-form structural motivation claim."
      : `Input structural analysis produced the ${witness.queryForm} embryo; the Albanian lexical substrate contains the source-attested ${witness.sourceForm} record.`,
  };
}

function buildCandidate(
  word: string,
  inputLanguage: string,
  inputRepresentationKind: MotivationRepresentationKindV0_1,
  inputVoicePath: readonly string[],
  inputGamma: readonly string[] | null,
  inputZeroConsonantalStructuralComposition: readonly unknown[] | null,
  matchContext: CandidateMatchContextV0_1,
  witness: GenericFunctionalWitnessV1,
): MotivationEngineDiscoveryCandidateV0_1 {
  return {
    candidateId: `motivation-discovery:${word}:${matchContext.minRootId}:${witness.sourceId}`,
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
      minRootId: matchContext.minRootId,
      protoRoots: [...matchContext.protoRoots],
      carrierForms: [...matchContext.carrierForms],
      operationIds: [...matchContext.operationIds],
    },
    structuralComparison: buildStructuralComparisonV0_1(
      word,
      inputLanguage,
      inputRepresentationKind,
      inputVoicePath,
      inputGamma,
      inputZeroConsonantalStructuralComposition,
      matchContext,
      extractSevenVowelsFromString(witness.sourceForm),
      witness,
    ),
    functionalInterpretation: {
      truthClassification: "hypothesis",
      // Generic witness discovery does not evaluate a target-bound semantic
      // correspondence. Keep target-specific bridges out of this layer.
      statement: null,
    },
    candidateStatus: "experimental",
    historicalRelation: "not_claimed",
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
  };
}

function matchContextsV0_1(
  word: string,
  structuralHypotheses: readonly Readonly<{
    hypothesisId: string;
    embryo: string;
    expansionChain: readonly string[];
    reasonCodes: readonly string[];
  }>[],
) {
  const contexts: Array<Readonly<{
    queryForm: string;
    voicePath: readonly string[];
    matchContext: CandidateMatchContextV0_1;
  }>> = [];
  const seen = new Set<string>();

  for (const root of stableUniqueRoots(word)) {
    const operationIds = root.carriers
      .filter((carrier) => root.protoRoots.includes(carrier.protoRootId))
      .flatMap((carrier) => carrier.ops)
      .sort(compareText);

    for (const protoRoot of root.protoRoots) {
      const voicePath = extractSevenVowelsFromString(protoRoot);
      if (voicePath.length === 0) continue;
      const key = `root:${root.id}:${protoRoot}`;
      if (seen.has(key)) continue;
      seen.add(key);
      contexts.push({
        queryForm: protoRoot,
        voicePath,
        matchContext: {
          queryForm: protoRoot,
          minRootId: root.id,
          protoRoots: root.protoRoots,
          carrierForms: root.carriers.map((carrier) => carrier.carrierForm),
          operationIds,
          expansionOrCompositionChain: [],
          reasonCodes: [],
        },
      });
    }
  }

  for (const hypothesis of structuralHypotheses) {
    for (const queryForm of hypothesis.expansionChain) {
      const normalizedQueryForm = queryForm.normalize("NFC").trim();
      const voicePath = extractSevenVowelsFromString(normalizedQueryForm);
      if (!normalizedQueryForm || voicePath.length === 0) continue;
      const key = `hypothesis:${hypothesis.hypothesisId}:${normalizedQueryForm}`;
      if (seen.has(key)) continue;
      seen.add(key);
      contexts.push({
        queryForm: normalizedQueryForm,
        voicePath,
        matchContext: {
          queryForm: normalizedQueryForm,
          minRootId: hypothesis.hypothesisId,
          protoRoots: [hypothesis.embryo],
          carrierForms: [],
          operationIds: [],
          expansionOrCompositionChain: [...hypothesis.expansionChain],
          reasonCodes: [...hypothesis.reasonCodes],
        },
      });
    }
  }

  return contexts.sort((left, right) =>
    compareText(
      `${left.queryForm}:${left.matchContext.minRootId}`,
      `${right.queryForm}:${right.matchContext.minRootId}`,
    ),
  );
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
  const spokenPath = isAlbanianProfile
    ? null
    : input.heart.canonicalSpokenVoicePath;
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
  const inputRepresentationKind: MotivationRepresentationKindV0_1 =
    spokenPath?.length
      ? "production_spoken"
      : isAlbanianProfile
        ? "albanian_profile"
        : "unknown";
  const inputGamma = spokenPath?.length
    ? spokenGamma(input.heart).orderedUnits
    : isAlbanianProfile
      ? profileDerivedGamma(input.analysis).orderedUnits
      : null;
  const inputZeroConsonantalStructuralComposition = spokenPath?.length
    ? spokenZc(input.heart).variants
    : null;
  const structuralHypotheses = discoverStructuralHypothesesV0_1(word).map((hypothesis) => ({
    hypothesisId: hypothesis.hypothesisId,
    embryo: hypothesis.embryo,
    expansionChain: [...hypothesis.expansionChain],
    reasonCodes: [...hypothesis.reasonCodes],
  }));

  const candidates: MotivationEngineDiscoveryCandidateV0_1[] = [];
  const seenCandidateKeys = new Set<string>();
  for (const context of matchContextsV0_1(word, structuralHypotheses)) {
    const discovery = queryGenericFunctionalWitnessesV1(
      {
        schemaVersion: GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
        embryo: context.queryForm,
        voicePath: context.voicePath,
        queryNormalization: "EXACT_NFC",
      },
      [createAlbanianLexicalSubstrateWitnessAdapterV0_1()],
    );

    for (const witness of discovery.matches) {
      const key = `${witness.queryForm}:${witness.sourceId}`;
      if (seenCandidateKeys.has(key)) continue;
      seenCandidateKeys.add(key);
      candidates.push(buildCandidate(
        word,
        input.inputLanguage,
        inputRepresentationKind,
        voicePath,
        inputGamma,
        inputZeroConsonantalStructuralComposition,
        {
          ...context.matchContext,
          queryForm: context.matchContext.queryForm,
        },
        witness,
      ));
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
