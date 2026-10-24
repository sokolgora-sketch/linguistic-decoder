import type { AnalyzeWordResultV1 } from "@/shared/analysisResult.v1";
import {
  createAlbanianLexicalSubstrateWitnessAdapterV0_1,
  getAlbanianLexicalSubstrateRecordsV0_1,
} from "@/shared/openInstrument/albanianLexicalSubstrate.v0_1";
import {
  createEnglishKaikkiServerOnlyExactIndexProviderV0_1,
  ENGLISH_KAIKKI_SERVER_ONLY_EXACT_INDEX_PROVIDER_ID_V0_1,
  type EnglishKaikkiServerOnlyExactIndexProviderResultV0_1,
  type EnglishKaikkiServerOnlyExactIndexProviderV0_1,
} from "@/shared/openInstrument/englishKaikkiServerOnlyExactIndexProvider.v0_1";
import {
  createAlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1,
  type AlbanianKaikkiExactLexicalSourceFactV0_1,
  type AlbanianKaikkiExactLexicalSourceStatusV0_1,
  type AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1,
} from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import {
  projectAlbanianKaikkiFactsSourceIpaToSevenVoicesV0_1,
  type AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1,
} from "@/shared/openInstrument/albanianKaikkiSourceIpaSevenVoiceProductInterpretation.v0_1";
import {
  projectAlbanianSourceOrderContextSignatureV0_1,
  type AlbanianSourceOrderContextSignatureV0_1,
} from "@/shared/openInstrument/albanianSourceOrderContextSignature.v0_1";
import {
  normalizeEnglishLexicalJoinKeyV0_1,
} from "@/shared/openInstrument/englishLexicalSenseSourceContract.v0_1";
import {
  buildMotivationEngineDiscoveryV0_1,
  type MotivationEngineDiscoveryV0_1,
} from "@/shared/openInstrument/motivationEngineDiscovery.v0_1";
import {
  createMultilingualDiscoverySubstrateS1LatinWitnessAdapterV0_2,
  getMultilingualDiscoverySubstrateS1LatinSubstrateRecordsV0_2,
} from "@/shared/openInstrument/multilingualDiscoverySubstrateS1.v0_2";
import type {
  GenericFunctionalWitnessQueryV1,
  GenericFunctionalWitnessSourceAdapterResultV1,
  GenericFunctionalWitnessSourceAdapterV1,
  GenericFunctionalWitnessSourceRecordV1,
} from "@/shared/openInstrument/genericFunctionalWitnessDiscovery.v1";
import type { HeartInstrumentV1 } from "@/v1/heartInstrument.v1";

export type EnglishKaikkiProviderOperationalStatusV0_1 = Readonly<{
  status: "AVAILABLE" | "UNAVAILABLE" | "NOT_QUERIED";
  queryFormsAttempted: number;
  lexicalMisses: number;
  matchQueries: number;
  failureReasonCodes: readonly string[];
}>;

export type AlbanianLexicalReadingV0_1 = Readonly<{
  status: "SUPPORTED" | "NULL";
  primarySourceFact: Readonly<{
    sourceRecordId: string;
    entryLocator: string;
    form: string;
    partOfSpeech: string | null;
    meaningGlosses: readonly string[];
  }> | null;
  sourcePronunciation: Readonly<{
    sourceRecordId: string;
    soundIndex: number;
    rawIpa: string | null;
    status: "SUPPORTED" | "NULL";
    voicePath: readonly string[];
    reasonCodes: readonly string[];
  }> | null;
  relatedForms: readonly Readonly<{
    form: string;
    entryLocator: string;
    relation: "SOURCE_RELATED_FORM";
    resolution: "RESOLVED" | "UNRESOLVED";
    sourceRecordId: string | null;
    partOfSpeech: string | null;
    meaningGlosses: readonly string[];
  }>[];
  composition: AlbanianLexicalCompositionV0_1;
  interpretation: Readonly<{
    status: "EXPLORATORY_ZHEJI_READING" | "UNKNOWN_OR_NULL";
    statement: string | null;
    alternatives: readonly string[];
    basis: readonly string[];
    claimBoundary: string;
  }>;
}>;

export type AlbanianLexicalCompositionStructureV0_1 = Readonly<{
  sourceRecordId: string;
  entryLocator: string;
  form: string;
  soundIndex: number;
  rawIpa: string;
  voicePath: readonly string[];
  prefixConsonants: readonly string[];
  interNucleusConsonants: readonly (readonly string[])[];
  suffixConsonants: readonly string[];
  structuralSignature: string;
  authorityBoundary: string;
}>;

export type AlbanianLexicalCompositionV0_1 = Readonly<{
  status: "SUPPORTED" | "NULL";
  relatedForm: string | null;
  sourceRelation: Readonly<{
    status: "SOURCE_EXPLICIT_RELATION" | "SOURCE_RELATION_NOT_VERIFIED";
    sourceRecordId: string | null;
    entryLocator: string | null;
    evidenceText: string | null;
  }>;
  primaryStructure: AlbanianLexicalCompositionStructureV0_1 | null;
  relatedStructure: AlbanianLexicalCompositionStructureV0_1 | null;
  interpretation: Readonly<{
    status: "EXPLORATORY_ZHEJI_READING" | "UNKNOWN_OR_NULL";
    statement: string | null;
    alternatives: readonly string[];
    basis: readonly string[];
    claimBoundary: string;
  }>;
}>;

export type MotivationEngineDiscoveryWithAlbanianLexicalFactsV0_1 = Readonly<
  MotivationEngineDiscoveryV0_1 & {
    /** Additive exact-input source facts; never structural candidates or Voice authority. */
    exactLexicalSourceStatus: AlbanianKaikkiExactLexicalSourceStatusV0_1;
    exactLexicalSourceFacts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[];
    /** Separate current-source IPA interpretation; never the canonical/profile-derived path. */
    sourceIpaSevenVoiceAnalyses: readonly AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1[];
    /** Additive Albanian product reading; source facts and exploratory symbolism stay separated. */
    albanianLexicalReading: AlbanianLexicalReadingV0_1;
  }
>;

export type MotivationEngineDiscoveryServerOnlyResultV0_1 = Readonly<{
  discovery: MotivationEngineDiscoveryWithAlbanianLexicalFactsV0_1;
  englishProvider: EnglishKaikkiProviderOperationalStatusV0_1;
}>;

let productionProviderPromise:
  Promise<EnglishKaikkiServerOnlyExactIndexProviderV0_1> | undefined;
let productionAlbanianLexicalSourceProviderPromise:
  Promise<AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1> | undefined;

function getProductionProviderV0_1(): Promise<EnglishKaikkiServerOnlyExactIndexProviderV0_1> {
  productionProviderPromise ??=
    createEnglishKaikkiServerOnlyExactIndexProviderV0_1();
  return productionProviderPromise;
}

function getProductionAlbanianLexicalSourceProviderV0_1(): Promise<AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1> {
  productionAlbanianLexicalSourceProviderPromise ??=
    createAlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1();
  return productionAlbanianLexicalSourceProviderPromise;
}

function isAlbanianInputV0_1(input: {
  inputLanguage: string;
  inputProfile: string;
}): boolean {
  const language = input.inputLanguage.normalize("NFC").trim().toLocaleLowerCase("en-US");
  const profile = input.inputProfile.normalize("NFC").trim().toLocaleLowerCase("en-US");
  return language === "sq" || language === "albanian" || profile === "sq" || profile === "albanian";
}

function createResolvedEnglishAdapterV0_1(
  recordsByQuery: ReadonlyMap<string, readonly GenericFunctionalWitnessSourceRecordV1[]>,
): GenericFunctionalWitnessSourceAdapterV1 {
  return Object.freeze({
    adapterId: ENGLISH_KAIKKI_SERVER_ONLY_EXACT_INDEX_PROVIDER_ID_V0_1,
    candidateVoicePathPolicy: "NULL_UNAUTHORIZED" as const,
    query(input: GenericFunctionalWitnessQueryV1): GenericFunctionalWitnessSourceAdapterResultV1 {
      const records = recordsByQuery.get(
        normalizeEnglishLexicalJoinKeyV0_1(input.embryo),
      ) ?? [];

      return {
        ok: true,
        // Generic Discovery requires the record query form to agree with its
        // already-selected embryo. The provider's frozen lowercase join key
        // remains the lookup identity; this projection binds it to the
        // existing generic query contract without adding a new match rule.
        records: records.map((record) => ({
          ...record,
          queryForm: input.embryo,
        })),
      };
    },
  });
}

function providerFailureReasonV0_1(
  result: EnglishKaikkiServerOnlyExactIndexProviderResultV0_1,
): string | null {
  return "reasonCode" in result ? result.reasonCode : null;
}

function attachSourceFamilyProjectionV0_1(
  discovery: MotivationEngineDiscoveryV0_1,
  sourceFamilyBySourceId: ReadonlyMap<string, string>,
): MotivationEngineDiscoveryV0_1 {
  const candidates = discovery.candidates.map((candidate) => {
    const sourceFamilyId = sourceFamilyBySourceId.get(candidate.sourceFact.sourceId);
    return {
      ...candidate,
      sourceFact: {
        ...candidate.sourceFact,
        ...(sourceFamilyId ? { sourceFamilyId } : {}),
      },
    };
  });

  return {
    ...discovery,
    candidates,
  } as MotivationEngineDiscoveryV0_1;
}

function addStaticSourceFamiliesV0_1(
  sourceFamilyBySourceId: Map<string, string>,
): void {
  for (const record of getAlbanianLexicalSubstrateRecordsV0_1()) {
    const sourceFamilyId = record.sourceProvenance?.sourceTraditionId;
    if (sourceFamilyId) sourceFamilyBySourceId.set(record.sourceId, sourceFamilyId);
  }
  for (const record of getMultilingualDiscoverySubstrateS1LatinSubstrateRecordsV0_2()) {
    sourceFamilyBySourceId.set(record.sourceRecordId, record.sourceTraditionId);
  }
}

function sourceFamilyRecordingAdapterV0_1(
  adapter: GenericFunctionalWitnessSourceAdapterV1,
  sourceFamilyBySourceId: Map<string, string>,
): GenericFunctionalWitnessSourceAdapterV1 {
  return Object.freeze({
    ...adapter,
    query(input: GenericFunctionalWitnessQueryV1): GenericFunctionalWitnessSourceAdapterResultV1 {
      const result = adapter.query(input);
      if (result.ok) {
        for (const record of result.records) {
          const sourceFamilyId = record.sourceProvenance?.sourceTraditionId;
          if (sourceFamilyId) sourceFamilyBySourceId.set(record.sourceId, sourceFamilyId);
        }
      }
      return result;
    },
  });
}

export function projectMotivationEngineDiscoverySourceFamiliesV0_1(
  discovery: MotivationEngineDiscoveryV0_1,
): MotivationEngineDiscoveryV0_1 {
  const sourceFamilyBySourceId = new Map<string, string>();
  addStaticSourceFamiliesV0_1(sourceFamilyBySourceId);
  return attachSourceFamilyProjectionV0_1(discovery, sourceFamilyBySourceId);
}

function getMotivationEngineDiscoveryQueryFormsV0_1(input: {
  word: string;
  inputLanguage: string;
  inputProfile: string;
  analysis: AnalyzeWordResultV1;
  heart: HeartInstrumentV1;
}): readonly string[] {
  const queryForms = new Set<string>();
  const captureAdapter: GenericFunctionalWitnessSourceAdapterV1 = {
    adapterId: "open-instrument.discovery-query-form-capture.v0.1",
    candidateVoicePathPolicy: "NULL_UNAUTHORIZED",
    query(queryInput: GenericFunctionalWitnessQueryV1): GenericFunctionalWitnessSourceAdapterResultV1 {
      queryForms.add(queryInput.embryo);
      return { ok: true, records: [] };
    },
  };

  buildMotivationEngineDiscoveryV0_1({
    ...input,
    sourceAdapters: [captureAdapter],
  });

  return Object.freeze([...queryForms]);
}

async function resolveEnglishRecordsV0_1(
  provider: EnglishKaikkiServerOnlyExactIndexProviderV0_1,
  queryForms: readonly string[],
): Promise<Readonly<{
  recordsByQuery: ReadonlyMap<string, readonly GenericFunctionalWitnessSourceRecordV1[]>;
  operationalStatus: EnglishKaikkiProviderOperationalStatusV0_1;
}>> {
  const recordsByQuery = new Map<string, readonly GenericFunctionalWitnessSourceRecordV1[]>();
  const failureReasonCodes = new Set<string>();
  let lexicalMisses = 0;
  let matchQueries = 0;

  const results = await Promise.all(queryForms.map(async (queryForm) => {
    try {
      return Object.freeze({
        queryForm,
        result: await provider.query(queryForm),
      });
    } catch {
      return Object.freeze({
        queryForm,
        result: null,
      });
    }
  }));

  for (const { queryForm, result } of results) {
    if (result === null) {
      failureReasonCodes.add("PROVIDER_QUERY_FAILURE");
      continue;
    }

    if (result.status === "MATCHES_FOUND") {
      matchQueries += 1;
      recordsByQuery.set(result.queryForm, Object.freeze([...result.records]));
      continue;
    }

    if (
      result.status === "LEXICAL_SENSE_SOURCE_NOT_FOUND" ||
      result.status === "LEXICAL_SENSE_GLOSS_NOT_FOUND"
    ) {
      lexicalMisses += 1;
      recordsByQuery.set(result.queryForm, Object.freeze([]));
      continue;
    }

    failureReasonCodes.add(providerFailureReasonV0_1(result) ?? "PROVIDER_QUERY_FAILURE");
    // Keep the exact attempted key represented as an empty source result so
    // a later generic query cannot accidentally reuse another key's records.
    recordsByQuery.set(normalizeEnglishLexicalJoinKeyV0_1(queryForm), Object.freeze([]));
  }

  const failureReasons = Object.freeze([...failureReasonCodes].sort());
  if (failureReasons.length > 0) {
    // A partial provider result is not a complete source witness. Keep the
    // existing Discovery adapters visible, but discard all English records
    // for this request rather than presenting an incomplete source slice.
    recordsByQuery.clear();
  }
  const status = queryForms.length === 0
    ? "NOT_QUERIED" as const
    : failureReasons.length > 0
      ? "UNAVAILABLE" as const
      : "AVAILABLE" as const;

  return Object.freeze({
    recordsByQuery,
    operationalStatus: Object.freeze({
      status,
      queryFormsAttempted: queryForms.length,
      lexicalMisses,
      matchQueries,
      failureReasonCodes: failureReasons,
    }),
  });
}

function normalizedAlbanianFormV0_1(value: string): string {
  return value.normalize("NFC").trim().toLocaleLowerCase("sq-AL");
}

function distinctGlossesV0_1(
  facts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[],
): readonly string[] {
  return Object.freeze([...new Set(
    facts.flatMap((fact) => fact.senses.flatMap((sense) => sense.glosses)),
  )]);
}

function hasConservativePrimaryIlluminationEvidenceV0_1(
  fact: AlbanianKaikkiExactLexicalSourceFactV0_1,
): boolean {
  const glosses = distinctGlossesV0_1([fact]);
  const illuminationGlossCount = glosses.filter((gloss) =>
    /\b(?:light|daylight|illumination|illuminat(?:e|ed|ing)|bright(?:ness)?)\b/iu.test(gloss),
  ).length;
  const competingOrUnrelatedGloss = glosses.some((gloss) =>
    /\b(?:weight|not\s+heavy|easy|opening|access|knowledge|vision|clarity|clear)\b/iu.test(gloss),
  );

  // This is deliberately a conservative source-bound product gate: only the
  // primary fact's own glosses count, two or more compatible illumination
  // glosses are required, and explicit alternate senses fail closed. Related
  // forms never create an interpretation for the queried word.
  return illuminationGlossCount >= 2 && !competingOrUnrelatedGloss;
}

function sourceRelationEvidenceV0_1(
  primary: AlbanianKaikkiExactLexicalSourceFactV0_1,
  related: AlbanianKaikkiExactLexicalSourceFactV0_1,
): Readonly<{
  status: "SOURCE_EXPLICIT_RELATION" | "SOURCE_RELATION_NOT_VERIFIED";
  sourceRecordId: string | null;
  entryLocator: string | null;
  evidenceText: string | null;
}> {
  const primaryNeedle = normalizedAlbanianFormV0_1(primary.form);
  const relatedNeedle = normalizedAlbanianFormV0_1(related.form);
  const relatedText = related.etymologyText ?? null;
  const primaryText = primary.etymologyText ?? null;
  const hasSourceRelationMarker = (value: string | null): boolean =>
    value !== null && /\b(?:from|derived\s+from|originating\s+from)\b/iu.test(value);
  const relatedNamesPrimary = hasSourceRelationMarker(relatedText) &&
    (relatedText?.normalize("NFC").toLocaleLowerCase("sq-AL").includes(primaryNeedle) ?? false);
  const primaryNamesRelated = hasSourceRelationMarker(primaryText) &&
    (primaryText?.normalize("NFC").toLocaleLowerCase("sq-AL").includes(relatedNeedle) ?? false);
  if (relatedNamesPrimary) {
    return Object.freeze({
      status: "SOURCE_EXPLICIT_RELATION",
      sourceRecordId: related.sourceRecordId,
      entryLocator: related.entryLocator,
      evidenceText: relatedText,
    });
  }
  if (primaryNamesRelated) {
    return Object.freeze({
      status: "SOURCE_EXPLICIT_RELATION",
      sourceRecordId: primary.sourceRecordId,
      entryLocator: primary.entryLocator,
      evidenceText: primaryText,
    });
  }
  return Object.freeze({
    status: "SOURCE_RELATION_NOT_VERIFIED",
    sourceRecordId: null,
    entryLocator: null,
    evidenceText: null,
  });
}

function structureSummaryV0_1(
  signature: AlbanianSourceOrderContextSignatureV0_1 | null,
): AlbanianLexicalCompositionStructureV0_1 | null {
  if (signature?.status !== "SUPPORTED" || !signature.rawIpa || !signature.structuralSignature) return null;
  const consonants = (segments: readonly { baseSymbol: string }[] | null): readonly string[] =>
    Object.freeze((segments ?? []).map((segment) => segment.baseSymbol));
  return Object.freeze({
    sourceRecordId: signature.source.sourceRecordId,
    entryLocator: signature.source.entryLocator,
    form: signature.source.form,
    soundIndex: signature.source.soundIndex,
    rawIpa: signature.rawIpa,
    voicePath: Object.freeze([...signature.voicePath]),
    prefixConsonants: consonants(signature.prefixConsonants),
    interNucleusConsonants: Object.freeze(
      (signature.interNucleusRegions ?? []).map((region) => consonants(region.consonants)),
    ),
    suffixConsonants: consonants(signature.suffixConsonants),
    structuralSignature: signature.structuralSignature,
    authorityBoundary: signature.authorityBoundary,
  });
}

function selectSupportedStructureV0_1(
  fact: AlbanianKaikkiExactLexicalSourceFactV0_1,
  analyses: readonly AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1[],
): AlbanianLexicalCompositionStructureV0_1 | null {
  const supported = analyses
    .filter((analysis) => analysis.sourceRecordId === fact.sourceRecordId && analysis.status === "SUPPORTED")
    .sort((left, right) => left.soundIndex - right.soundIndex);
  const summaries = supported
    .map((analysis) => structureSummaryV0_1(projectAlbanianSourceOrderContextSignatureV0_1({ fact, analysis })))
    .filter((summary): summary is AlbanianLexicalCompositionStructureV0_1 => summary !== null);
  if (summaries.length === 0) return null;
  const first = summaries[0];
  return summaries.every((summary) => summary.structuralSignature === first.structuralSignature) ? first : null;
}

function nullCompositionV0_1(
  relatedForm: string | null = null,
  sourceRelation: AlbanianLexicalCompositionV0_1["sourceRelation"] = Object.freeze({
    status: "SOURCE_RELATION_NOT_VERIFIED",
    sourceRecordId: null,
    entryLocator: null,
    evidenceText: null,
  }),
): AlbanianLexicalCompositionV0_1 {
  return Object.freeze({
    status: "NULL",
    relatedForm,
    sourceRelation,
    primaryStructure: null,
    relatedStructure: null,
    interpretation: Object.freeze({
      status: "UNKNOWN_OR_NULL",
      statement: null,
      alternatives: Object.freeze([]),
      basis: Object.freeze([]),
      claimBoundary: "A source-explicit lexical relation and two supported source-order structures are required; Null is preserved.",
    }),
  });
}

async function buildAlbanianLexicalReadingV0_1(input: Readonly<{
  word: string;
  facts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[];
  analyses: readonly AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1[];
  provider: AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1;
}>): Promise<AlbanianLexicalReadingV0_1> {
  const primary = input.facts.find((fact) =>
    normalizedAlbanianFormV0_1(fact.form) === normalizedAlbanianFormV0_1(input.word) &&
    fact.partOfSpeech !== "name",
  ) ?? input.facts[0] ?? null;

  if (!primary) {
    return Object.freeze({
      status: "NULL",
      primarySourceFact: null,
      sourcePronunciation: null,
      relatedForms: Object.freeze([]),
      composition: nullCompositionV0_1(),
      interpretation: Object.freeze({
        status: "UNKNOWN_OR_NULL",
        statement: null,
        alternatives: Object.freeze([]),
        basis: Object.freeze([]),
        claimBoundary: "No exact Albanian source fact is available; no product reading is claimed.",
      }),
    });
  }

  const sourcePronunciation = input.analyses.find((analysis) =>
    analysis.sourceRecordId === primary.sourceRecordId && analysis.status === "SUPPORTED",
  ) ?? input.analyses.find((analysis) => analysis.sourceRecordId === primary.sourceRecordId) ?? null;
  const related = primary.relatedForms ?? [];
  const relatedResultsWithFacts = await Promise.all(related.slice(0, 8).map(async (relation) => {
    try {
      const result = await input.provider.query(relation.form);
      const resolved = result.status === "MATCHES_FOUND"
        ? result.facts.find((fact) => fact.partOfSpeech !== "name") ?? result.facts[0] ?? null
        : null;
      const publicResult = Object.freeze({
        form: relation.form,
        entryLocator: resolved?.entryLocator ?? relation.entryLocator,
        relation: relation.relation,
        resolution: resolved ? "RESOLVED" as const : "UNRESOLVED" as const,
        sourceRecordId: resolved?.sourceRecordId ?? null,
        partOfSpeech: resolved?.partOfSpeech ?? null,
        meaningGlosses: resolved ? distinctGlossesV0_1([resolved]) : Object.freeze([]),
      });
      return Object.freeze({ publicResult, resolved });
    } catch {
      return Object.freeze({
        publicResult: Object.freeze({
        form: relation.form,
        entryLocator: relation.entryLocator,
        relation: relation.relation,
        resolution: "UNRESOLVED" as const,
        sourceRecordId: null,
        partOfSpeech: null,
        meaningGlosses: Object.freeze([]),
        }),
        resolved: null,
      });
    }
  }));
  const relatedResults = Object.freeze(relatedResultsWithFacts.map(({ publicResult }) => publicResult));

  const compositionCandidate = relatedResultsWithFacts.find(({ resolved }) =>
    resolved !== null && sourceRelationEvidenceV0_1(primary, resolved).status === "SOURCE_EXPLICIT_RELATION",
  ) ?? relatedResultsWithFacts.find(({ resolved }) => resolved !== null);
  const relatedFact = compositionCandidate?.resolved ?? null;
  const relationEvidence = relatedFact
    ? sourceRelationEvidenceV0_1(primary, relatedFact)
    : Object.freeze({
        status: "SOURCE_RELATION_NOT_VERIFIED" as const,
        sourceRecordId: null,
        entryLocator: null,
        evidenceText: null,
      });
  const primaryStructure = selectSupportedStructureV0_1(primary, input.analyses);
  const relatedAnalyses = relatedFact
    ? projectAlbanianKaikkiFactsSourceIpaToSevenVoicesV0_1([relatedFact])
    : Object.freeze([]) as readonly AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1[];
  const relatedStructure = relatedFact ? selectSupportedStructureV0_1(relatedFact, relatedAnalyses) : null;
  const primaryGloss = distinctGlossesV0_1([primary]).join("; ") || "Null";
  const relatedGloss = relatedFact ? distinctGlossesV0_1([relatedFact]).join("; ") || "Null" : "Null";
  const composition = relationEvidence.status === "SOURCE_EXPLICIT_RELATION" && primaryStructure && relatedStructure && relatedFact
    ? Object.freeze({
        status: "SUPPORTED" as const,
        relatedForm: relatedFact.form,
        sourceRelation: relationEvidence,
        primaryStructure,
        relatedStructure,
        interpretation: Object.freeze({
          status: "EXPLORATORY_ZHEJI_READING" as const,
          statement: `The source explicitly relates ${relatedFact.form} to ${primary.form} and records ${primary.form} as “${primaryGloss}” and ${relatedFact.form} as “${relatedGloss}”. The computed source structures are ${primaryStructure.voicePath.join(" → ")} with consonant frame ${primaryStructure.prefixConsonants.join(" ") || "∅"}–${primaryStructure.interNucleusConsonants.map((region) => region.join(" ") || "∅").join(" / ") || "∅"} and ${relatedStructure.voicePath.join(" → ")} with consonant frame ${relatedStructure.prefixConsonants.join(" ") || "∅"}–${relatedStructure.interNucleusConsonants.map((region) => region.join(" ") || "∅").join(" / ") || "∅"}. This is a source-grounded composition prompt, not proof that sound causes meaning.`,
          alternatives: Object.freeze([
            "The source-authored relation may reflect ordinary lexical or morphological history rather than a functional composition.",
            "The computed Voice paths and consonant regions are pronunciation observations; they may carry no semantic force.",
            "The source etymology entry may be incomplete or represent a historical proposal rather than a settled derivation.",
          ]),
          basis: Object.freeze([
            "SOURCE_EXPLICIT_ETYMOLOGY_TEXT",
            "ATTESTED_SOURCE_GLOSSES",
            "SOURCE_DERIVED_IPA_VOICE_PATHS",
            "SOURCE_ORDER_CONSONANT_CONTEXT_SIGNATURES",
          ]),
          claimBoundary: "Exploratory product interpretation only; source attribution, structural inference and functional hypothesis remain separate. No universal Voice meaning, sound causation or independently reviewed etymology is claimed.",
        }),
      })
    : nullCompositionV0_1(relatedFact?.form ?? null, relationEvidence);

  const meaningGlosses = distinctGlossesV0_1([primary]);
  const hasLightMeaning = hasConservativePrimaryIlluminationEvidenceV0_1(primary);
  const hasSupportedPath = sourcePronunciation?.status === "SUPPORTED" &&
    sourcePronunciation.voicePath.length > 0;
  const voicePath = sourcePronunciation?.voicePath.join(" → ") ?? "Null";
  const interpretation = hasLightMeaning && hasSupportedPath
    ? Object.freeze({
        status: "EXPLORATORY_ZHEJI_READING" as const,
        statement: `The attested primary-source meaning is placed beside the source-derived ${voicePath} path. As a Zheji-inspired product prompt, this can invite an illumination → clarity reading; the prompt is exploratory and does not claim causation, etymology, or a universal Voice meaning.`,
        alternatives: Object.freeze([
          "The source-linked forms may reflect ordinary lexical or morphological relations.",
          "The Voice path may be only a phonological observation with no semantic force.",
        ]),
        basis: Object.freeze([
          "ATTESTED_SOURCE_GLOSSES",
          "SOURCE_DERIVED_IPA_VOICE_PATH",
          "PRIMARY_SOURCE_GLOSS_EVIDENCE",
        ]),
        claimBoundary: "Exploratory product interpretation only; no historical-origin claim, semantic proof, or winner selection.",
      })
    : Object.freeze({
        status: "UNKNOWN_OR_NULL" as const,
        statement: null,
        alternatives: Object.freeze([]),
        basis: Object.freeze([
          "ATTESTED_SOURCE_GLOSSES",
          ...(sourcePronunciation ? ["SOURCE_DERIVED_IPA_VOICE_PATH"] : []),
        ]),
        claimBoundary: "The available source evidence does not authorize a bounded product interpretation; Null is preserved.",
      });

  return Object.freeze({
    status: "SUPPORTED",
    primarySourceFact: Object.freeze({
      sourceRecordId: primary.sourceRecordId,
      entryLocator: primary.entryLocator,
      form: primary.form,
      partOfSpeech: primary.partOfSpeech,
      meaningGlosses,
    }),
    sourcePronunciation: sourcePronunciation
      ? Object.freeze({
          sourceRecordId: sourcePronunciation.sourceRecordId,
          soundIndex: sourcePronunciation.soundIndex,
          rawIpa: sourcePronunciation.rawIpa,
          status: sourcePronunciation.status,
          voicePath: sourcePronunciation.voicePath,
          reasonCodes: sourcePronunciation.reasonCodes,
        })
      : null,
    relatedForms: Object.freeze(relatedResults),
    composition,
    interpretation,
  });
}

/**
 * Server-only orchestration seam for the production route and fixture proof.
 * The provider performs async bounded filesystem lookup here; the resulting
 * source records then enter the existing synchronous generic Discovery path.
 */
export async function buildMotivationEngineDiscoveryServerOnlyV0_1(input: {
  word: string;
  inputLanguage: string;
  inputProfile: string;
  analysis: AnalyzeWordResultV1;
  heart: HeartInstrumentV1;
  provider?: EnglishKaikkiServerOnlyExactIndexProviderV0_1;
  albanianLexicalSourceProvider?: AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1;
}): Promise<MotivationEngineDiscoveryServerOnlyResultV0_1> {
  const provider = input.provider ?? await getProductionProviderV0_1();
  const queryForms = getMotivationEngineDiscoveryQueryFormsV0_1(input);
  const resolved = await resolveEnglishRecordsV0_1(provider, queryForms);
  const albanianLexicalSourceResult = isAlbanianInputV0_1(input)
    ? await (input.albanianLexicalSourceProvider ?? await getProductionAlbanianLexicalSourceProviderV0_1()).query(input.word)
    : null;
  const sourceAdapters: readonly GenericFunctionalWitnessSourceAdapterV1[] = [
    createAlbanianLexicalSubstrateWitnessAdapterV0_1(),
    createMultilingualDiscoverySubstrateS1LatinWitnessAdapterV0_2(),
    createResolvedEnglishAdapterV0_1(resolved.recordsByQuery),
  ];
  const sourceFamilyBySourceId = new Map<string, string>();
  addStaticSourceFamiliesV0_1(sourceFamilyBySourceId);
  const recordingSourceAdapters = sourceAdapters.map((adapter) =>
    sourceFamilyRecordingAdapterV0_1(adapter, sourceFamilyBySourceId),
  );

  const discovery = attachSourceFamilyProjectionV0_1(buildMotivationEngineDiscoveryV0_1({
    word: input.word,
    inputLanguage: input.inputLanguage,
    inputProfile: input.inputProfile,
    analysis: input.analysis,
    heart: input.heart,
    sourceAdapters: recordingSourceAdapters,
  }), sourceFamilyBySourceId);
  const exactLexicalSourceFacts = albanianLexicalSourceResult?.status === "MATCHES_FOUND"
    ? albanianLexicalSourceResult.facts
    : Object.freeze([]) as readonly AlbanianKaikkiExactLexicalSourceFactV0_1[];
  const sourceIpaSevenVoiceAnalyses = projectAlbanianKaikkiFactsSourceIpaToSevenVoicesV0_1(
    exactLexicalSourceFacts,
  );
  return Object.freeze({
    discovery: Object.freeze({
      ...discovery,
      exactLexicalSourceStatus: albanianLexicalSourceResult
        ? {
            status: albanianLexicalSourceResult.status,
            queryForm: albanianLexicalSourceResult.queryForm,
            reasonCode: albanianLexicalSourceResult.reasonCode,
          }
        : {
            status: "NOT_QUERIED" as const,
            queryForm: null,
            reasonCode: "NOT_ALBANIAN_INPUT",
          },
      exactLexicalSourceFacts,
      sourceIpaSevenVoiceAnalyses,
      albanianLexicalReading: await buildAlbanianLexicalReadingV0_1({
        word: input.word,
        facts: exactLexicalSourceFacts,
        analyses: sourceIpaSevenVoiceAnalyses,
        provider: input.albanianLexicalSourceProvider ?? await getProductionAlbanianLexicalSourceProviderV0_1(),
      }),
    }),
    englishProvider: resolved.operationalStatus,
  });
}
