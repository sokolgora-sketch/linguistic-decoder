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
  type AlbanianKaikkiExactLexicalSourceEtymologyLinkV0_1,
  type AlbanianKaikkiExactLexicalSourceEtymologyTemplateV0_1,
  type AlbanianKaikkiExactLexicalSourceStatusV0_1,
  type AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1,
} from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import {
  projectAlbanianKaikkiFactSourceIpaToSevenVoicesV0_1,
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
    /** Source-authored prose; displayed as attribution, never as machine relation proof. */
    etymologyText: string | null;
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
    /** Source-authored prose; displayed as attribution, never as machine relation proof. */
    etymologyText: string | null;
  }>[];
  sourceLinkedComparison?: AlbanianSourceLinkedComparisonV0_1 | null;
  composition: AlbanianLexicalCompositionV0_1;
  interpretation: Readonly<{
    status: "EXPLORATORY_ZHEJI_READING" | "UNKNOWN_OR_NULL";
    statement: string | null;
    alternatives: readonly string[];
    basis: readonly string[];
    claimBoundary: string;
  }>;
}>;

export type AlbanianSourceLinkedPronunciationV0_1 = Readonly<{
  soundIndex: number;
  rawIpa: string | null;
  tags: readonly string[];
  status: "SUPPORTED" | "NULL";
  voicePath: readonly string[];
  reasonCodes: readonly string[];
  consonantalContext: Readonly<{
    status: "SUPPORTED" | "NULL";
    authorityBoundary: string;
    prefixConsonants: readonly AlbanianSourceLinkedConsonantSegmentV0_1[] | null;
    interNucleusConsonants: readonly (readonly AlbanianSourceLinkedConsonantSegmentV0_1[])[] | null;
    suffixConsonants: readonly AlbanianSourceLinkedConsonantSegmentV0_1[] | null;
    structuralSignature: string | null;
    reasonCodes: readonly string[];
  }>;
}>;

export type AlbanianSourceLinkedConsonantSegmentV0_1 = Readonly<{
  raw: string;
  baseSymbol: string;
  optional: boolean;
}>;

export type AlbanianSourceLinkedRecordV0_1 = Readonly<{
  sourceRecordId: string;
  entryLocator: string;
  physicalRecordOrdinal: number;
  form: string;
  partOfSpeech: string | null;
  meaningGlosses: readonly string[];
  etymologyText: string | null;
  etymologyLinks: readonly AlbanianKaikkiExactLexicalSourceEtymologyLinkV0_1[];
  etymologyTemplates: readonly AlbanianKaikkiExactLexicalSourceEtymologyTemplateV0_1[];
  pronunciationVariants: readonly AlbanianSourceLinkedPronunciationV0_1[];
}>;

export type AlbanianSourceLinkedComparisonV0_1 = Readonly<{
  status: "SUPPORTED" | "NULL";
  reasonCodes: readonly string[];
  relation: Readonly<{
    relation: "SOURCE_RELATED_FORM";
    primarySourceRecordId: string;
    primaryEntryLocator: string;
    relatedForm: string;
    relatedSourceRecordId: string | null;
    relatedEntryLocator: string;
    direction: "RELATED_FORM_TO_PRIMARY_ETYMLOGY_REFERENCE";
    referencedForm: string | null;
    reference: string | null;
  }>;
  primary: AlbanianSourceLinkedRecordV0_1;
  related: AlbanianSourceLinkedRecordV0_1 | null;
  summary: Readonly<{
    voicePathRelationship:
      | "EXACT_SUPPORTED_PATH_SET_MATCH"
      | "SHARED_INITIAL_VOICE_DIFFERENT_LATER_PATH"
      | "DIFFERENT_SUPPORTED_VOICE_PATHS"
      | "UNKNOWN";
    consonantalContextRelationship:
      | "EXACT_SUPPORTED_CONTEXT_SET_MATCH"
      | "DIFFERENT_SUPPORTED_CONTEXTS"
      | "UNKNOWN";
    text: string;
  }>;
  claimBoundary: string;
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

function sourceRecordPronunciationV0_1(
  fact: AlbanianKaikkiExactLexicalSourceFactV0_1,
  analyses: readonly AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1[],
): AlbanianSourceLinkedRecordV0_1["pronunciationVariants"] {
  return Object.freeze(fact.ipaObservations.map((observation) => {
    const analysis = analyses.find((candidate) =>
      candidate.sourceRecordId === fact.sourceRecordId && candidate.soundIndex === observation.soundIndex,
    ) ?? null;
    const context = analysis
      ? projectAlbanianSourceOrderContextSignatureV0_1({ fact, analysis })
      : null;
    const consonantalContext = context
      ? Object.freeze({
          status: context.status,
          authorityBoundary: context.authorityBoundary,
          prefixConsonants: context.prefixConsonants
            ? Object.freeze(context.prefixConsonants.map((segment) => Object.freeze({
                raw: segment.raw,
                baseSymbol: segment.baseSymbol,
                optional: segment.optional,
              })))
            : null,
          interNucleusConsonants: context.interNucleusRegions
            ? Object.freeze(context.interNucleusRegions.map((region) => Object.freeze(
                region.consonants.map((segment) => Object.freeze({
                  raw: segment.raw,
                  baseSymbol: segment.baseSymbol,
                  optional: segment.optional,
                })),
              )))
            : null,
          suffixConsonants: context.suffixConsonants
            ? Object.freeze(context.suffixConsonants.map((segment) => Object.freeze({
                raw: segment.raw,
                baseSymbol: segment.baseSymbol,
                optional: segment.optional,
              })))
            : null,
          structuralSignature: context.structuralSignature,
          reasonCodes: context.reasonCodes,
        })
      : Object.freeze({
          status: "NULL" as const,
          authorityBoundary: "SOURCE_ORDER_CONTEXT_ANALYSIS_NOT_AVAILABLE",
          prefixConsonants: null,
          interNucleusConsonants: null,
          suffixConsonants: null,
          structuralSignature: null,
          reasonCodes: Object.freeze(["SOURCE_ANALYSIS_NOT_AVAILABLE"]),
        });

    return Object.freeze({
      soundIndex: observation.soundIndex,
      rawIpa: observation.ipa,
      tags: Object.freeze([...observation.tags]),
      status: analysis?.status ?? "NULL",
      voicePath: analysis?.voicePath ?? Object.freeze([]),
      reasonCodes: analysis?.reasonCodes ?? Object.freeze(["SOURCE_ANALYSIS_NOT_AVAILABLE"]),
      consonantalContext,
    });
  }));
}

function sourceRecordProjectionV0_1(
  fact: AlbanianKaikkiExactLexicalSourceFactV0_1,
  analyses: readonly AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1[],
): AlbanianSourceLinkedRecordV0_1 {
  return Object.freeze({
    sourceRecordId: fact.sourceRecordId,
    entryLocator: fact.entryLocator,
    physicalRecordOrdinal: fact.physicalRecordOrdinal,
    form: fact.form,
    partOfSpeech: fact.partOfSpeech,
    meaningGlosses: distinctGlossesV0_1([fact]),
    etymologyText: fact.etymologyText ?? null,
    etymologyLinks: Object.freeze([...(fact.etymologyLinks ?? [])]),
    etymologyTemplates: Object.freeze([...(fact.etymologyTemplates ?? [])]),
    pronunciationVariants: sourceRecordPronunciationV0_1(fact, analyses),
  });
}

function supportedVoicePathKeysV0_1(
  record: AlbanianSourceLinkedRecordV0_1,
): readonly string[] {
  return Object.freeze([...new Set(
    record.pronunciationVariants
      .filter((variant) => variant.status === "SUPPORTED" && variant.voicePath.length > 0)
      .map((variant) => variant.voicePath.join("→")),
  )].sort());
}

function supportedContextKeysV0_1(
  record: AlbanianSourceLinkedRecordV0_1,
): readonly string[] {
  return Object.freeze([...new Set(
    record.pronunciationVariants
      .filter((variant) => variant.consonantalContext.status === "SUPPORTED")
      .map((variant) => JSON.stringify({
        prefix: variant.consonantalContext.prefixConsonants,
        inter: variant.consonantalContext.interNucleusConsonants,
        suffix: variant.consonantalContext.suffixConsonants,
      })),
  )].sort());
}

function exactAlbanianSourceReferenceV0_1(
  link: AlbanianKaikkiExactLexicalSourceEtymologyLinkV0_1,
  primaryForm: string,
): boolean {
  const normalizedPrimaryForm = normalizedAlbanianFormV0_1(primaryForm);
  if (normalizedAlbanianFormV0_1(link.sourceForm) !== normalizedPrimaryForm) return false;

  const reference = link.reference.normalize("NFC").trim();
  const separatorIndex = reference.indexOf("#");
  if (separatorIndex <= 0 || separatorIndex !== reference.lastIndexOf("#")) return false;

  const referencedForm = reference.slice(0, separatorIndex);
  const languageSection = reference.slice(separatorIndex + 1);
  return normalizedAlbanianFormV0_1(referencedForm) === normalizedPrimaryForm &&
    languageSection === "Albanian";
}

function sourceLinkedSummaryV0_1(
  primary: AlbanianSourceLinkedRecordV0_1,
  related: AlbanianSourceLinkedRecordV0_1,
): AlbanianSourceLinkedComparisonV0_1["summary"] {
  const primaryPaths = supportedVoicePathKeysV0_1(primary);
  const relatedPaths = supportedVoicePathKeysV0_1(related);
  const primaryContexts = supportedContextKeysV0_1(primary);
  const relatedContexts = supportedContextKeysV0_1(related);
  let voicePathRelationship: AlbanianSourceLinkedComparisonV0_1["summary"]["voicePathRelationship"] = "UNKNOWN";
  if (primaryPaths.length > 0 && relatedPaths.length > 0) {
    if (JSON.stringify(primaryPaths) === JSON.stringify(relatedPaths)) {
      voicePathRelationship = "EXACT_SUPPORTED_PATH_SET_MATCH";
    } else {
      const primaryInitial = [...new Set(primaryPaths.map((path) => path.split("→")[0]))];
      const relatedInitial = [...new Set(relatedPaths.map((path) => path.split("→")[0]))];
      if (primaryInitial.length === 1 && relatedInitial.length === 1 && primaryInitial[0] === relatedInitial[0]) {
        voicePathRelationship = "SHARED_INITIAL_VOICE_DIFFERENT_LATER_PATH";
      } else {
        voicePathRelationship = "DIFFERENT_SUPPORTED_VOICE_PATHS";
      }
    }
  }

  let consonantalContextRelationship: AlbanianSourceLinkedComparisonV0_1["summary"]["consonantalContextRelationship"] = "UNKNOWN";
  if (primaryContexts.length > 0 && relatedContexts.length > 0) {
    consonantalContextRelationship = JSON.stringify(primaryContexts) === JSON.stringify(relatedContexts)
      ? "EXACT_SUPPORTED_CONTEXT_SET_MATCH"
      : "DIFFERENT_SUPPORTED_CONTEXTS";
  }

  const voiceText = voicePathRelationship === "EXACT_SUPPORTED_PATH_SET_MATCH"
    ? "the supported Voice-path sets match"
    : voicePathRelationship === "SHARED_INITIAL_VOICE_DIFFERENT_LATER_PATH"
      ? `the supported Voice-path sets share initial Voice ${primaryPaths[0]?.split("→")[0] ?? "Null"} and differ later`
      : voicePathRelationship === "DIFFERENT_SUPPORTED_VOICE_PATHS"
        ? "the supported Voice-path sets differ"
        : "the Voice-path comparison is unresolved";
  const consonantText = consonantalContextRelationship === "EXACT_SUPPORTED_CONTEXT_SET_MATCH"
    ? "the supported source-order consonantal contexts match"
    : consonantalContextRelationship === "DIFFERENT_SUPPORTED_CONTEXTS"
      ? "the supported source-order consonantal contexts differ"
      : "the source-order consonantal comparison is unresolved";

  return Object.freeze({
    voicePathRelationship,
    consonantalContextRelationship,
    text: `The engine compares all source pronunciation variants: ${voiceText}; ${consonantText}. These are descriptive source-derived observations, not claims of derivation, causation, or semantic force.`,
  });
}

function nullSourceLinkedComparisonV0_1(
  primary: AlbanianKaikkiExactLexicalSourceFactV0_1,
  relatedForm: string,
  relatedSourceRecordId: string | null,
  relatedEntryLocator: string,
  reasonCode: string,
  primaryAnalyses: readonly AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1[],
): AlbanianSourceLinkedComparisonV0_1 {
  return Object.freeze({
    status: "NULL",
    reasonCodes: Object.freeze([reasonCode]),
    relation: Object.freeze({
      relation: "SOURCE_RELATED_FORM" as const,
      primarySourceRecordId: primary.sourceRecordId,
      primaryEntryLocator: primary.entryLocator,
      relatedForm,
      relatedSourceRecordId,
      relatedEntryLocator,
      direction: "RELATED_FORM_TO_PRIMARY_ETYMLOGY_REFERENCE" as const,
      referencedForm: null,
      reference: null,
    }),
    primary: sourceRecordProjectionV0_1(primary, primaryAnalyses),
    related: null,
    summary: Object.freeze({
      voicePathRelationship: "UNKNOWN" as const,
      consonantalContextRelationship: "UNKNOWN" as const,
      text: "The source-linked comparison is Null because the related source evidence is incomplete or does not contain an exact structured reference to the primary form.",
    }),
    claimBoundary: "Source links and source-authored text remain attributed evidence only; no derivation, historical relation, or functional composition is claimed.",
  });
}

function buildSourceLinkedComparisonV0_1(input: Readonly<{
  primary: AlbanianKaikkiExactLexicalSourceFactV0_1;
  primaryAnalyses: readonly AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1[];
  relatedForm: Readonly<{ form: string; entryLocator: string }>;
  related: AlbanianKaikkiExactLexicalSourceFactV0_1 | null;
}>): AlbanianSourceLinkedComparisonV0_1 {
  if (!input.related) {
    return nullSourceLinkedComparisonV0_1(
      input.primary,
      input.relatedForm.form,
      null,
      input.relatedForm.entryLocator,
      "SOURCE_LINK_UNRESOLVED",
      input.primaryAnalyses,
    );
  }

  const sourceFormMatchingLinks = (input.related.etymologyLinks ?? []).filter((link) =>
    normalizedAlbanianFormV0_1(link.sourceForm) === normalizedAlbanianFormV0_1(input.primary.form),
  );
  const matchingLinks = sourceFormMatchingLinks.filter((link) =>
    exactAlbanianSourceReferenceV0_1(link, input.primary.form),
  );
  if (sourceFormMatchingLinks.length !== 1 || matchingLinks.length !== 1) {
    return nullSourceLinkedComparisonV0_1(
      input.primary,
      input.relatedForm.form,
      input.related.sourceRecordId,
      input.related.entryLocator,
      sourceFormMatchingLinks.length === 0
        ? "SOURCE_FORM_REFERENCE_NOT_PRESENT"
        : sourceFormMatchingLinks.length !== 1 || matchingLinks.length > 1
          ? "SOURCE_FORM_REFERENCE_AMBIGUOUS"
          : "SOURCE_FORM_REFERENCE_IDENTITY_INVALID",
      input.primaryAnalyses,
    );
  }

  const primaryProjection = sourceRecordProjectionV0_1(input.primary, input.primaryAnalyses);
  const relatedAnalyses = projectAlbanianKaikkiFactSourceIpaToSevenVoicesV0_1(input.related);
  const relatedProjection = sourceRecordProjectionV0_1(input.related, relatedAnalyses);
  return Object.freeze({
    status: "SUPPORTED",
    reasonCodes: Object.freeze([]),
    relation: Object.freeze({
      relation: "SOURCE_RELATED_FORM" as const,
      primarySourceRecordId: input.primary.sourceRecordId,
      primaryEntryLocator: input.primary.entryLocator,
      relatedForm: input.related.form,
      relatedSourceRecordId: input.related.sourceRecordId,
      relatedEntryLocator: input.related.entryLocator,
      direction: "RELATED_FORM_TO_PRIMARY_ETYMLOGY_REFERENCE" as const,
      referencedForm: matchingLinks[0].sourceForm,
      reference: matchingLinks[0].reference,
    }),
    primary: primaryProjection,
    related: relatedProjection,
    summary: sourceLinkedSummaryV0_1(primaryProjection, relatedProjection),
    claimBoundary: "The exact source-authored structured reference is preserved as attributed evidence. Computed IPA, Voice and consonantal context are descriptive only; no morphology, historical derivation, causation, or functional composition is claimed.",
  });
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
      claimBoundary: "No directionally meaningful structured source relation is available; source-authored prose and computed pronunciation structure remain separate, and Null is preserved.",
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
      sourceLinkedComparison: null,
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
        etymologyText: resolved?.etymologyText ?? null,
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
          etymologyText: null,
        }),
        resolved: null,
      });
    }
  }));
  const relatedResults = Object.freeze(relatedResultsWithFacts.map(({ publicResult }) => publicResult));
  const firstRelatedForm = related[0] ?? null;
  const firstRelatedResolved = relatedResultsWithFacts[0]?.resolved ?? null;
  const sourceLinkedComparison = firstRelatedForm
    ? buildSourceLinkedComparisonV0_1({
        primary,
        primaryAnalyses: input.analyses,
        relatedForm: firstRelatedForm,
        related: firstRelatedResolved,
      })
    : null;

  const compositionCandidate = relatedResultsWithFacts.find(({ resolved }) => resolved !== null);
  const relatedFact = compositionCandidate?.resolved ?? null;
  const composition = nullCompositionV0_1(relatedFact?.form ?? null);

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
      etymologyText: primary.etymologyText ?? null,
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
    sourceLinkedComparison,
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
