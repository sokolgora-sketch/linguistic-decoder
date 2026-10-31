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
  type AlbanianKaikkiExactLexicalSourceCategoryV0_1,
  type AlbanianKaikkiExactLexicalSourceFactV0_1,
  type AlbanianKaikkiExactLexicalSourceEtymologyLinkV0_1,
  type AlbanianKaikkiExactLexicalSourceEtymologyTemplateV0_1,
  type AlbanianKaikkiExactLexicalSourceLookupResultV0_1,
  type AlbanianKaikkiExactLexicalSourceStatusV0_1,
  type AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1,
} from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import { createAlbanianKaikkiServerOnlyProductionProviderV0_1 } from "@/shared/openInstrument/albanianKaikkiServerOnlySourceDelivery.v0_1";
import {
  getProductionAlbaNetSourceV0_1,
} from "@/shared/openInstrument/albanetSourceFamilyAdapter.v0_1";
import {
  getProductionLexinSourceV0_1,
} from "@/shared/openInstrument/lexinSourceFamilyAdapter.v0_1";
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
  getAlbanianOccupationalRoleCandidatesForWordV0_1,
  type AlbanianOccupationalRoleCandidateBatchViewV0_1,
} from "@/shared/openInstrument/albanianOccupationalRoleCandidateBatch.v0_1";
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
  GenericFunctionalWitnessSourceDetailsV1,
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

export const ALBANIAN_FIVE_WINDOWS_FORMS_V0_1 = Object.freeze([
  "dritare",
  "fënjeshtër",
  "finestër",
  "penxhere",
  "derkë",
] as const);

export type AlbanianFiveWindowsClassificationV0_1 =
  | "ALBANIAN_INTERNAL_FORMATION"
  | "SOURCE_ATTRIBUTED_BORROWING"
  | "UNKNOWN_OR_NULL";

export type AlbanianFiveWindowsRecordV0_1 = Readonly<{
  sourceRecordId: string;
  entryLocator: string;
  physicalRecordOrdinal: number;
  form: string;
  partOfSpeech: string | null;
  meaningGlosses: readonly string[];
  ipaObservations: readonly Readonly<{
    soundIndex: number;
    ipa: string | null;
    tags: readonly string[];
  }>[];
  /** Additive source-IPA projection; each observation remains keyed by source record and sound index. */
  sourceIpaSevenVoiceAnalyses: readonly AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1[];
  etymologyText: string | null;
  etymologyLinks: readonly AlbanianKaikkiExactLexicalSourceEtymologyLinkV0_1[];
  etymologyTemplates: readonly AlbanianKaikkiExactLexicalSourceEtymologyTemplateV0_1[];
  classification: AlbanianFiveWindowsClassificationV0_1;
  borrowedFromLanguage: string | null;
  ultimateSourceLanguage: string | null;
  /** The current exact-source provider does not carry record usage/register tags. */
  usageNotes: readonly string[];
}>;

export type AlbanianFiveWindowsMemberV0_1 = Readonly<{
  form: string;
  status: "MATCHES_FOUND" | "SOURCE_NOT_FOUND" | "UNAVAILABLE";
  records: readonly AlbanianFiveWindowsRecordV0_1[];
  reasonCodes: readonly string[];
}>;

export type AlbanianFiveWindowsComparisonV0_1 = Readonly<{
  comparisonId: "FIVE_WINDOWS";
  queryForm: string;
  members: readonly AlbanianFiveWindowsMemberV0_1[];
  summary: string;
  alternatives: readonly string[];
  claimBoundary: string;
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
    relation: "SOURCE_RELATED_FORM" | "SOURCE_DERIVED_FORM";
    resolution: "RESOLVED" | "UNRESOLVED";
    sourceRecordId: string | null;
    partOfSpeech: string | null;
    meaningGlosses: readonly string[];
    /** Source-authored prose; displayed as attribution, never as machine relation proof. */
    etymologyText: string | null;
  }>[];
  /** Additive per-related-form evidence; the singular bridge below remains the selected primary bridge. */
  relatedCandidateEvaluations: readonly AlbanianRelatedCandidateEvaluationV0_1[];
  /** Source-order synthesis of already-supported derived-form AGENT bridges only. */
  functionalFamilyReading: AlbanianFunctionalFamilyReadingV0_1 | null;
  /** Bounded source/ontology research candidates; never authorizes a functional operation. */
  occupationalRoleResearchCandidates?: AlbanianOccupationalRoleCandidateBatchViewV0_1;
  /** Additive bounded comparison for the five configured source-backed window forms. */
  fiveWindowsComparison?: AlbanianFiveWindowsComparisonV0_1 | null;
  sourceLinkedComponentReading?: AlbanianSourceLinkedComponentReadingV0_1 | null;
  sourceLinkedComparison?: AlbanianSourceLinkedComparisonV0_1 | null;
  /** Additive product bridge; this never upgrades source evidence into morphology or proof. */
  functionalMeaningBridge: AlbanianFunctionalMeaningBridgeV0_1;
  composition: AlbanianLexicalCompositionV0_1;
  interpretation: Readonly<{
    status: "EXPLORATORY_ZHEJI_READING" | "UNKNOWN_OR_NULL";
    statement: string | null;
    alternatives: readonly string[];
    basis: readonly string[];
    claimBoundary: string;
  }>;
}>;

export type AlbanianFunctionalMeaningBridgeTruthLayerV0_1 =
  | "SOURCE_FACT"
  | "DERIVED_STRUCTURE"
  | "EXPLORATORY_FUNCTIONAL_HYPOTHESIS"
  | "UNKNOWN_OR_NULL";

export type AlbanianFunctionalMeaningBridgeV0_1 = Readonly<{
  status: "SUPPORTED" | "NULL";
  truthLayers: readonly AlbanianFunctionalMeaningBridgeTruthLayerV0_1[];
  relatedForm: string | null;
  sourceFacts: Readonly<{
    primary: Readonly<{
      sourceRecordId: string;
      entryLocator: string;
      form: string;
      meaningGlosses: readonly string[];
      sourceSenses: readonly Readonly<{
        senseId: string | null;
        glosses: readonly string[];
        categories: readonly AlbanianKaikkiExactLexicalSourceCategoryV0_1[];
      }>[];
    }>;
    related: Readonly<{
      sourceRecordId: string;
      entryLocator: string;
      form: string;
      meaningGlosses: readonly string[];
      sourceAuthoredExplanation: string | null;
      sourceSenses: readonly Readonly<{
        senseId: string | null;
        glosses: readonly string[];
        categories: readonly AlbanianKaikkiExactLexicalSourceCategoryV0_1[];
      }>[];
    }> | null;
    structuredReference: Readonly<{
      referencedForm: string | null;
      reference: string | null;
    }>;
  }> | null;
  derivedStructure: Readonly<{
    primary: Readonly<{
      rawIpa: string | null;
      voicePaths: readonly string[];
      consonantalContexts: readonly string[];
    }>;
    related: Readonly<{
      rawIpa: string | null;
      voicePaths: readonly string[];
      consonantalContexts: readonly string[];
    }>;
    voicePathRelationship: AlbanianSourceLinkedComparisonV0_1["summary"]["voicePathRelationship"];
    consonantalContextRelationship: AlbanianSourceLinkedComparisonV0_1["summary"]["consonantalContextRelationship"];
  }> | null;
  functionalHypothesis: Readonly<{
    status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS" | "UNKNOWN_OR_NULL";
    functionalOperation: "AGENT" | "ENABLE_PASSAGE" | null;
    statement: string | null;
    alternatives: readonly string[];
    basis: readonly string[];
    claimBoundary: string;
  }>;
  reasonCodes: readonly string[];
  claimBoundary: string;
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
  sourceSenses?: readonly Readonly<{
    senseId: string | null;
    glosses: readonly string[];
    categories: readonly AlbanianKaikkiExactLexicalSourceCategoryV0_1[];
  }>[];
  etymologyText: string | null;
  etymologyLinks: readonly AlbanianKaikkiExactLexicalSourceEtymologyLinkV0_1[];
  etymologyTemplates: readonly AlbanianKaikkiExactLexicalSourceEtymologyTemplateV0_1[];
  pronunciationVariants: readonly AlbanianSourceLinkedPronunciationV0_1[];
}>;

type AlbanianSourceEvidenceRelationV0_1 =
  | "SOURCE_RELATED_FORM"
  | "SOURCE_DERIVED_FORM"
  /** The queried target cites a base in its own etymology; no base-side form link is implied. */
  | "TARGET_AUTHORED_ETYMOLOGY_REFERENCE";

export type AlbanianSourceLinkedComparisonV0_1 = Readonly<{
  status: "SUPPORTED" | "NULL";
  reasonCodes: readonly string[];
  relation: Readonly<{
    relation: AlbanianSourceEvidenceRelationV0_1;
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

export type AlbanianRelatedCandidateEvaluationV0_1 = Readonly<{
  relatedForm: string;
  sourceRelation: AlbanianSourceEvidenceRelationV0_1;
  resolution: "RESOLVED" | "UNRESOLVED";
  sourceLinkedComparison: AlbanianSourceLinkedComparisonV0_1;
  functionalMeaningBridge: AlbanianFunctionalMeaningBridgeV0_1;
}>;

export type AlbanianFunctionalFamilyReadingV0_1 = Readonly<{
  status: "EXPLORATORY_FUNCTIONAL_FAMILY";
  functionalOperation: "AGENT";
  primary: Readonly<{
    form: string;
    sourceRecordId: string;
    entryLocator: string;
    senseId: string;
    meaningGlosses: readonly string[];
  }>;
  members: readonly Readonly<{
    form: string;
    sourceRecordId: string;
    entryLocator: string;
    senseId: string;
    meaningGlosses: readonly string[];
    sourceRelation: "SOURCE_DERIVED_FORM";
    sourceComparisonStatus: "SUPPORTED";
    functionalBridgeStatus: "SUPPORTED";
    evidenceBasis: readonly string[];
  }>[];
  statement: string;
  alternatives: readonly string[];
  claimBoundary: string;
  noSingleWinner: true;
  userDecisionPosture: "user_decides";
}>;

type AlbanianSourceLinkedComponentRelationV0_1 =
  | "SOURCE_EXPLICIT_TWO_COMPONENT_COMPOUND"
  | "SOURCE_COMPOUND_ARITY_UNSUPPORTED";

export type AlbanianSourceLinkedComponentReadingV0_1 = Readonly<{
  status: "SUPPORTED" | "NULL";
  reasonCodes: readonly string[];
  relation: Readonly<{
    relation: AlbanianSourceLinkedComponentRelationV0_1;
    primarySourceRecordId: string;
    primaryEntryLocator: string;
    sourceAuthoredExplanation: string | null;
    references: readonly Readonly<{
      sourceForm: string;
      reference: string | null;
    }>[];
  }>;
  primary: AlbanianSourceLinkedRecordV0_1;
  components: readonly AlbanianSourceLinkedRecordV0_1[];
  exploratoryRelationship: Readonly<{
    status: "EXPLORATORY_SOURCE_COMPONENT_RELATION" | "UNKNOWN_OR_NULL";
    statement: string | null;
    alternatives: readonly string[];
    claimBoundary: string;
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
    createAlbanianKaikkiServerOnlyProductionProviderV0_1();
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
  sourceDetailsBySourceId: ReadonlyMap<string, GenericFunctionalWitnessSourceDetailsV1> = new Map(),
): MotivationEngineDiscoveryV0_1 {
  const candidates = discovery.candidates.map((candidate) => {
    const sourceFamilyId = sourceFamilyBySourceId.get(candidate.sourceFact.sourceId);
    const sourceDetails = sourceDetailsBySourceId.get(candidate.sourceFact.sourceId);
    return {
      ...candidate,
      sourceFact: {
        ...candidate.sourceFact,
        ...(sourceFamilyId ? { sourceFamilyId } : {}),
        ...(sourceDetails
          ? {
              sourceDetails: {
                ...sourceDetails,
                definitions: [...sourceDetails.definitions],
                examples: [...sourceDetails.examples],
                relationTypes: [...sourceDetails.relationTypes],
              },
            }
          : {}),
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
  sourceDetailsBySourceId: Map<string, GenericFunctionalWitnessSourceDetailsV1>,
): GenericFunctionalWitnessSourceAdapterV1 {
  return Object.freeze({
    ...adapter,
    query(input: GenericFunctionalWitnessQueryV1): GenericFunctionalWitnessSourceAdapterResultV1 {
      const result = adapter.query(input);
      if (result.ok) {
        for (const record of result.records) {
          const sourceFamilyId = record.sourceProvenance?.sourceTraditionId;
          if (sourceFamilyId) sourceFamilyBySourceId.set(record.sourceId, sourceFamilyId);
          if (record.sourceDetails) sourceDetailsBySourceId.set(record.sourceId, record.sourceDetails);
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
  facts: readonly Readonly<{
    senses: readonly Readonly<{ glosses: readonly string[] }>[];
  }>[],
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
    sourceSenses: Object.freeze(fact.senses.map((sense) => Object.freeze({
      senseId: sense.senseId,
      glosses: Object.freeze([...sense.glosses]),
      categories: Object.freeze([...(sense.categories ?? [])]),
    }))),
    etymologyText: fact.etymologyText ?? null,
    etymologyLinks: Object.freeze([...(fact.etymologyLinks ?? [])]),
    etymologyTemplates: Object.freeze([...(fact.etymologyTemplates ?? [])]),
    pronunciationVariants: sourceRecordPronunciationV0_1(fact, analyses),
  });
}

function exactAlbanianComponentReferenceV0_1(
  link: AlbanianKaikkiExactLexicalSourceEtymologyLinkV0_1,
): boolean {
  const sourceForm = normalizedAlbanianFormV0_1(link.sourceForm);
  const reference = link.reference.normalize("NFC").trim();
  const separatorIndex = reference.indexOf("#");
  if (!sourceForm || separatorIndex <= 0 || separatorIndex !== reference.lastIndexOf("#")) return false;
  return normalizedAlbanianFormV0_1(reference.slice(0, separatorIndex)) === sourceForm &&
    reference.slice(separatorIndex + 1) === "Albanian";
}

function compoundComponentReferencesV0_1(
  primary: AlbanianKaikkiExactLexicalSourceFactV0_1,
): Readonly<{
  relation: AlbanianSourceLinkedComponentRelationV0_1;
  componentForms: readonly string[];
  references: readonly Readonly<{ sourceForm: string; reference: string | null }>[];
  reasonCodes: readonly string[];
}> | null {
  const compoundTemplates = (primary.etymologyTemplates ?? []).filter((template) =>
    template.name === "compound" && template.args["1"] === "sq",
  );
  if (compoundTemplates.length === 0) return null;

  const reasons = new Set<string>();
  if (compoundTemplates.length !== 1) reasons.add("SOURCE_COMPOUND_TEMPLATE_AMBIGUOUS");
  const template = compoundTemplates[0];
  const componentArgumentEntries = template
    ? Object.entries(template.args)
      .filter(([argument]) => /^\d+$/.test(argument) && Number(argument) >= 2)
      .sort(([left], [right]) => Number(left) - Number(right))
    : [];
  const componentForms = componentArgumentEntries.map(([, form]) => form.normalize("NFC").trim());
  const relation: AlbanianSourceLinkedComponentRelationV0_1 = componentForms.length > 2
    ? "SOURCE_COMPOUND_ARITY_UNSUPPORTED"
    : "SOURCE_EXPLICIT_TWO_COMPONENT_COMPOUND";
  if (componentForms.length > 2) reasons.add("SOURCE_COMPOUND_ARITY_UNSUPPORTED");
  if (componentForms.length < 2 || componentForms.some((form) => !form) ||
    componentForms.some((form, index) => componentForms.indexOf(form) !== index) ||
    componentForms.some((form) => normalizedAlbanianFormV0_1(form) === normalizedAlbanianFormV0_1(primary.form))) {
    reasons.add("SOURCE_COMPONENT_FORMS_INVALID");
  }

  const links = primary.etymologyLinks ?? [];
  const references = componentForms.map((componentForm) => {
    const matching = links.filter((link) =>
      normalizedAlbanianFormV0_1(link.sourceForm) === normalizedAlbanianFormV0_1(componentForm),
    );
    if (matching.length !== 1) {
      reasons.add(matching.length === 0
        ? "SOURCE_COMPONENT_REFERENCE_NOT_PRESENT"
        : "SOURCE_COMPONENT_REFERENCE_AMBIGUOUS");
    }
    const link = matching[0];
    if (link && !exactAlbanianComponentReferenceV0_1(link)) {
      reasons.add("SOURCE_COMPONENT_REFERENCE_IDENTITY_INVALID");
    }
    return Object.freeze({
      sourceForm: componentForm,
      reference: link?.reference ?? null,
    });
  });

  return Object.freeze({
    relation,
    componentForms: Object.freeze(componentForms),
    references: Object.freeze(references),
    reasonCodes: Object.freeze([...reasons]),
  });
}

function nullSourceLinkedComponentReadingV0_1(input: Readonly<{
  primary: AlbanianKaikkiExactLexicalSourceFactV0_1;
  primaryAnalyses: readonly AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1[];
  relation: AlbanianSourceLinkedComponentRelationV0_1;
  componentForms: readonly string[];
  references: readonly Readonly<{ sourceForm: string; reference: string | null }>[];
  components: readonly AlbanianSourceLinkedRecordV0_1[];
  reasonCodes: readonly string[];
}>): AlbanianSourceLinkedComponentReadingV0_1 {
  return Object.freeze({
    status: "NULL",
    reasonCodes: Object.freeze([...new Set(input.reasonCodes)]),
    relation: Object.freeze({
      relation: input.relation,
      primarySourceRecordId: input.primary.sourceRecordId,
      primaryEntryLocator: input.primary.entryLocator,
      sourceAuthoredExplanation: input.primary.etymologyText ?? null,
      references: input.references,
    }),
    primary: sourceRecordProjectionV0_1(input.primary, input.primaryAnalyses),
    components: input.components,
    exploratoryRelationship: Object.freeze({
      status: "UNKNOWN_OR_NULL" as const,
      statement: null,
      alternatives: Object.freeze([]),
      claimBoundary: "The source component evidence is incomplete or ambiguous; no component reading is claimed.",
    }),
    claimBoundary: "Source-authored component references remain attributed evidence only; no engine-proven derivation, semantic operation, or functional composition is claimed.",
  });
}

async function buildSourceLinkedComponentReadingV0_1(input: Readonly<{
  primary: AlbanianKaikkiExactLexicalSourceFactV0_1;
  primaryAnalyses: readonly AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1[];
  provider: AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1;
}>): Promise<AlbanianSourceLinkedComponentReadingV0_1 | null> {
  const componentEvidence = compoundComponentReferencesV0_1(input.primary);
  if (!componentEvidence) return null;

  const components: AlbanianSourceLinkedRecordV0_1[] = [];
  const reasons = [...componentEvidence.reasonCodes];
  for (const componentForm of componentEvidence.componentForms) {
    try {
      const result = await input.provider.query(componentForm);
      const matches = result.status === "MATCHES_FOUND"
        ? result.facts.filter((fact) =>
            fact.languageCode === "sq" &&
            fact.language === "Albanian" &&
            normalizedAlbanianFormV0_1(fact.form) === normalizedAlbanianFormV0_1(componentForm) &&
            fact.partOfSpeech !== "name",
          )
        : [];
      if (matches.length === 0) {
        reasons.push("SOURCE_COMPONENT_RECORD_NOT_FOUND");
      } else if (matches.length > 1) {
        reasons.push("SOURCE_COMPONENT_RECORD_AMBIGUOUS");
      } else {
        components.push(sourceRecordProjectionV0_1(
          matches[0],
          projectAlbanianKaikkiFactSourceIpaToSevenVoicesV0_1(matches[0]),
        ));
      }
    } catch {
      reasons.push("SOURCE_COMPONENT_RECORD_LOOKUP_FAILED");
    }
  }

  if (components.length !== componentEvidence.componentForms.length) {
    return nullSourceLinkedComponentReadingV0_1({
      primary: input.primary,
      primaryAnalyses: input.primaryAnalyses,
      relation: componentEvidence.relation,
      componentForms: componentEvidence.componentForms,
      references: componentEvidence.references,
      components: Object.freeze(components),
      reasonCodes: reasons,
    });
  }

  if (!hasMeaningEvidenceV0_1(distinctGlossesV0_1([input.primary]))) {
    reasons.push("PRIMARY_MEANING_EVIDENCE_MISSING");
  }
  if (components.some((component) => !hasMeaningEvidenceV0_1(component.meaningGlosses))) {
    reasons.push("SOURCE_COMPONENT_MEANING_EVIDENCE_MISSING");
  }
  if (reasons.length > 0) {
    return nullSourceLinkedComponentReadingV0_1({
      primary: input.primary,
      primaryAnalyses: input.primaryAnalyses,
      relation: componentEvidence.relation,
      componentForms: componentEvidence.componentForms,
      references: componentEvidence.references,
      components: Object.freeze(components),
      reasonCodes: reasons,
    });
  }

  const componentText = components.map((component) =>
    `${component.form} (“${component.meaningGlosses.join("; ")}”)`,
  ).join(" + ");
  return Object.freeze({
    status: "SUPPORTED",
    reasonCodes: Object.freeze([]),
    relation: Object.freeze({
      relation: componentEvidence.relation,
      primarySourceRecordId: input.primary.sourceRecordId,
      primaryEntryLocator: input.primary.entryLocator,
      sourceAuthoredExplanation: input.primary.etymologyText ?? null,
      references: componentEvidence.references,
    }),
    primary: sourceRecordProjectionV0_1(input.primary, input.primaryAnalyses),
    components: Object.freeze(components),
    exploratoryRelationship: Object.freeze({
      status: "EXPLORATORY_SOURCE_COMPONENT_RELATION" as const,
      statement: `The source records ${input.primary.form} (“${distinctGlossesV0_1([input.primary]).join("; ")}") as a compound of ${componentText}. This is a source-attributed component reading; the engine does not independently prove the derivation or add a semantic operation.`,
      alternatives: Object.freeze([
        "The source-authored compound account may be descriptive or historically contestable.",
        "The available records do not establish a universal sound-to-meaning rule.",
        "Component phonetic and Voice comparison is not performed in this reading.",
      ]),
      claimBoundary: "Exploratory product relationship only; source-authored etymology remains attributed and no morphology, causation, or Voice semantics is asserted.",
    }),
    claimBoundary: "The exact source-authored compound template and Albanian references are preserved. IPA and Voice structure remain Null when the source supplies no pronunciation; composition remains separately Null.",
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
  relatedForm: Readonly<{
    form: string;
    relation: AlbanianSourceEvidenceRelationV0_1;
  }>,
  relatedSourceRecordId: string | null,
  relatedEntryLocator: string,
  reasonCode: string,
  primaryAnalyses: readonly AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1[],
): AlbanianSourceLinkedComparisonV0_1 {
  return Object.freeze({
    status: "NULL",
    reasonCodes: Object.freeze([reasonCode]),
    relation: Object.freeze({
      relation: relatedForm.relation,
      primarySourceRecordId: primary.sourceRecordId,
      primaryEntryLocator: primary.entryLocator,
      relatedForm: relatedForm.form,
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
  relatedForm: Readonly<{
    form: string;
    relation: AlbanianSourceEvidenceRelationV0_1;
    entryLocator: string;
  }>;
  related: AlbanianKaikkiExactLexicalSourceFactV0_1 | null;
}>): AlbanianSourceLinkedComparisonV0_1 {
  if (!input.related) {
    return nullSourceLinkedComparisonV0_1(
      input.primary,
      input.relatedForm,
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
      input.relatedForm,
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
      relation: input.relatedForm.relation,
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

async function buildTargetAuthoredEtymologyCandidateV0_1(input: Readonly<{
  target: AlbanianKaikkiExactLexicalSourceFactV0_1;
  targetFacts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[];
  provider: AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1;
}>): Promise<AlbanianRelatedCandidateEvaluationV0_1 | null> {
  if (
    input.targetFacts.length !== 1 ||
    input.targetFacts[0]?.sourceRecordId !== input.target.sourceRecordId ||
    input.target.language !== "Albanian" ||
    input.target.languageCode !== "sq" ||
    input.target.partOfSpeech !== "noun"
  ) {
    return null;
  }

  const templates = input.target.etymologyTemplates?.filter((template) => template.name === "af") ?? [];
  let baseForm: string;
  if (templates.length === 1) {
    const template = templates[0];
    baseForm = template?.args["2"]?.trim() ?? "";
    const otherComponent = template?.args["3"]?.trim() ?? "";
    if (template?.args["1"] !== "sq" || !baseForm || !otherComponent) return null;

    const matchingReferences = (input.target.etymologyLinks ?? []).filter((link) =>
      normalizedAlbanianFormV0_1(link.sourceForm) === normalizedAlbanianFormV0_1(baseForm),
    );
    if (matchingReferences.length !== 1 || !exactAlbanianSourceReferenceV0_1(matchingReferences[0]!, baseForm)) {
      return null;
    }
  } else if (templates.length === 0) {
    // Some source-authored target entries provide an exact Albanian lexical
    // reference without an `af` template. Accept only one unambiguous lexical
    // reference; hyphen-prefixed affix references are not base-word queries.
    const lexicalReferences = (input.target.etymologyLinks ?? []).filter((link) => {
      const sourceForm = link.sourceForm.normalize("NFC").trim();
      return sourceForm.length > 0 &&
        !sourceForm.startsWith("-") &&
        normalizedAlbanianFormV0_1(sourceForm) !== normalizedAlbanianFormV0_1(input.target.form);
    });
    if (lexicalReferences.length !== 1) return null;
    baseForm = lexicalReferences[0]!.sourceForm.normalize("NFC").trim();
    if (!exactAlbanianSourceReferenceV0_1(lexicalReferences[0]!, baseForm)) return null;
  } else {
    return null;
  }

  // This is only a bounded lookup prefilter for the existing passage path;
  // the resolved base must still pass the complete functional bridge below.
  if (templates.length === 0 && (
    !hasOpeningAccessMeaningV0_1(distinctGlossesV0_1([input.target])) ||
    !hasSourceAuthoredTransmissionExplanationV0_1(input.target.etymologyText)
  )) {
    return null;
  }

  let baseResult: AlbanianKaikkiExactLexicalSourceLookupResultV0_1;
  try {
    baseResult = await input.provider.query(baseForm);
  } catch {
    return null;
  }
  if (baseResult.status !== "MATCHES_FOUND") return null;
  const baseFacts = templates.length === 1
    ? baseResult.facts
    : baseResult.facts.filter((fact) =>
        fact.language === "Albanian" &&
        fact.languageCode === "sq" &&
        fact.partOfSpeech === "noun" &&
        normalizedAlbanianFormV0_1(fact.form) === normalizedAlbanianFormV0_1(baseForm),
      );
  if (baseFacts.length !== 1) return null;
  const base = baseFacts[0];
  const baseMeaningfulSenses = base?.senses.filter((sense) => sense.glosses.some((gloss) => gloss.trim().length > 0)) ?? [];
  if (
    !base ||
    base.language !== "Albanian" ||
    base.languageCode !== "sq" ||
    normalizedAlbanianFormV0_1(base.form) !== normalizedAlbanianFormV0_1(baseForm) ||
    base.partOfSpeech !== "noun" ||
    (templates.length === 1 && baseMeaningfulSenses.length !== 1) ||
    (templates.length === 0 && baseMeaningfulSenses.length === 0)
  ) {
    return null;
  }

  const relation = Object.freeze({
    form: input.target.form,
    relation: "TARGET_AUTHORED_ETYMOLOGY_REFERENCE" as const,
    entryLocator: input.target.entryLocator,
  });
  const comparison = buildSourceLinkedComparisonV0_1({
    primary: base,
    primaryAnalyses: projectAlbanianKaikkiFactSourceIpaToSevenVoicesV0_1(base),
    relatedForm: relation,
    related: input.target,
  });
  const bridge = buildAlbanianFunctionalMeaningBridgeV0_1({
    primary: sourceRecordProjectionV0_1(base, projectAlbanianKaikkiFactSourceIpaToSevenVoicesV0_1(base)),
    comparison,
    related: sourceRecordProjectionV0_1(input.target, projectAlbanianKaikkiFactSourceIpaToSevenVoicesV0_1(input.target)),
    sourceRelation: relation.relation,
  });

  return Object.freeze({
    relatedForm: input.target.form,
    sourceRelation: relation.relation,
    resolution: "RESOLVED" as const,
    sourceLinkedComparison: comparison,
    functionalMeaningBridge: bridge,
  });
}

function hasConservativePrimaryIlluminationEvidenceV0_1(
  fact: Readonly<{ senses: readonly Readonly<{ glosses: readonly string[] }>[] }>,
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

function hasOpeningAccessMeaningV0_1(glosses: readonly string[]): boolean {
  return glosses.some((gloss) => /\b(?:window|opening|access)\b/iu.test(gloss.toLocaleLowerCase("en-US")));
}

function hasSourceAuthoredTransmissionExplanationV0_1(sourceExplanation: string | null | undefined): boolean {
  const sourceExplanationText = sourceExplanation?.trim().toLocaleLowerCase("en-US") ?? "";
  const negatesTransmission = /\b(?:does\s+not|do\s+not|did\s+not|doesn't|don't|didn't|never|cannot|can't|won't|not)\s+(?:\w+\s+){0,2}(?:let|lets|allow|allows|permit|permits|enable|enables|admit|admits)\b/iu.test(sourceExplanationText);
  return !negatesTransmission &&
    /\b(?:let|lets|allow|allows|permit|permits|enable|enables|admit|admits)\s+(?:the\s+)?(?:light|daylight|illumination)\s+(?:through|to\s+(?:enter|pass)|enter|pass)\b/iu.test(sourceExplanationText);
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

function sourceContextTextV0_1(
  variant: AlbanianSourceLinkedPronunciationV0_1,
): string {
  const context = variant.consonantalContext;
  if (context.status !== "SUPPORTED") {
    return `Null (${context.reasonCodes.join(", ") || "SOURCE_ORDER_CONTEXT_NOT_SUPPORTED"})`;
  }
  const segmentText = (segment: AlbanianSourceLinkedConsonantSegmentV0_1): string =>
    `${segment.baseSymbol}${segment.optional ? " (optional)" : ""}`;
  const regionText = (region: readonly AlbanianSourceLinkedConsonantSegmentV0_1[]): string =>
    region.map(segmentText).join(" ") || "∅";
  const inter = context.interNucleusConsonants?.map(regionText).join(" · ") ?? "Null";
  return `prefix ${context.prefixConsonants?.map(segmentText).join(" ") || "∅"} · inter ${inter} · suffix ${context.suffixConsonants?.map(segmentText).join(" ") || "∅"}`;
}

function bridgeRecordFactsV0_1(
  primary: AlbanianSourceLinkedRecordV0_1,
  related: AlbanianSourceLinkedRecordV0_1 | null,
  comparison: AlbanianSourceLinkedComparisonV0_1 | null,
): AlbanianFunctionalMeaningBridgeV0_1["sourceFacts"] {
  return Object.freeze({
    primary: Object.freeze({
      sourceRecordId: primary.sourceRecordId,
      entryLocator: primary.entryLocator,
      form: primary.form,
      meaningGlosses: primary.meaningGlosses,
      sourceSenses: primary.sourceSenses ?? Object.freeze([]),
    }),
    related: related
      ? Object.freeze({
          sourceRecordId: related.sourceRecordId,
          entryLocator: related.entryLocator,
          form: related.form,
          meaningGlosses: related.meaningGlosses,
          sourceAuthoredExplanation: related.etymologyText,
          sourceSenses: related.sourceSenses ?? Object.freeze([]),
        })
      : null,
    structuredReference: Object.freeze({
      referencedForm: comparison?.relation.referencedForm ?? null,
      reference: comparison?.relation.reference ?? null,
    }),
  });
}

function bridgeDerivedStructureV0_1(
  comparison: AlbanianSourceLinkedComparisonV0_1,
): AlbanianFunctionalMeaningBridgeV0_1["derivedStructure"] {
  if (comparison.status !== "SUPPORTED" || comparison.related === null) return null;
  const supportedVariants = (record: AlbanianSourceLinkedRecordV0_1) => record.pronunciationVariants.filter((variant) =>
    variant.status === "SUPPORTED" && variant.consonantalContext.status === "SUPPORTED",
  );
  const primaryVariants = supportedVariants(comparison.primary);
  const relatedVariants = supportedVariants(comparison.related);
  if (primaryVariants.length === 0 || relatedVariants.length === 0) return null;
  return Object.freeze({
    primary: Object.freeze({
      rawIpa: primaryVariants[0]?.rawIpa ?? null,
      voicePaths: Object.freeze(primaryVariants.map((variant) => variant.voicePath.join(" → "))),
      consonantalContexts: Object.freeze(primaryVariants.map(sourceContextTextV0_1)),
    }),
    related: Object.freeze({
      rawIpa: relatedVariants[0]?.rawIpa ?? null,
      voicePaths: Object.freeze(relatedVariants.map((variant) => variant.voicePath.join(" → "))),
      consonantalContexts: Object.freeze(relatedVariants.map(sourceContextTextV0_1)),
    }),
    voicePathRelationship: comparison.summary.voicePathRelationship,
    consonantalContextRelationship: comparison.summary.consonantalContextRelationship,
  });
}

function nullFunctionalMeaningBridgeV0_1(input: Readonly<{
  relatedForm?: string | null;
  sourceFacts: AlbanianFunctionalMeaningBridgeV0_1["sourceFacts"];
  derivedStructure?: AlbanianFunctionalMeaningBridgeV0_1["derivedStructure"];
  reasonCodes: readonly string[];
}>): AlbanianFunctionalMeaningBridgeV0_1 {
  return Object.freeze({
    status: "NULL",
    truthLayers: Object.freeze([
      ...(input.sourceFacts ? ["SOURCE_FACT" as const] : []),
      ...(input.derivedStructure ? ["DERIVED_STRUCTURE" as const] : []),
      "UNKNOWN_OR_NULL" as const,
    ]),
    relatedForm: input.relatedForm ?? null,
    sourceFacts: input.sourceFacts,
    derivedStructure: input.derivedStructure ?? null,
    functionalHypothesis: Object.freeze({
      status: "UNKNOWN_OR_NULL" as const,
      functionalOperation: null,
      statement: null,
      alternatives: Object.freeze([]),
      basis: Object.freeze([]),
      claimBoundary: "The source or structure is incomplete for a bounded functional product prompt; Null is preserved.",
    }),
    reasonCodes: Object.freeze([...input.reasonCodes]),
    claimBoundary: "Source facts and derived structure remain separate from functional meaning; no morphology, etymology, causation, or Voice semantics is asserted.",
  });
}

function hasMeaningEvidenceV0_1(glosses: readonly string[]): boolean {
  return glosses.some((gloss) => gloss.trim().length > 0);
}

type AlbanianFunctionalHypothesisV0_1 = Readonly<{
  functionalOperation: "AGENT" | "ENABLE_PASSAGE" | null;
  statement: string;
  basis: readonly string[];
  alternatives: readonly string[];
}>;

function buildDirectionalFunctionalHypothesisV0_1(input: Readonly<{
  primary: AlbanianSourceLinkedRecordV0_1;
  related: AlbanianSourceLinkedRecordV0_1;
}>): AlbanianFunctionalHypothesisV0_1 | null {
  const primaryMeaning = input.primary.meaningGlosses.join("; ");
  const relatedMeaning = input.related.meaningGlosses.join("; ");
  const sourceExplanation = input.related.etymologyText?.trim() ?? "";
  const primaryHasIlluminationMeaning = hasConservativePrimaryIlluminationEvidenceV0_1({
    senses: input.primary.meaningGlosses.length > 0
      ? [{ glosses: input.primary.meaningGlosses }]
      : [],
  });
  const relatedHasOpeningMeaning = hasOpeningAccessMeaningV0_1(input.related.meaningGlosses);
  const sourceDescribesAffirmativeTransmission = hasSourceAuthoredTransmissionExplanationV0_1(sourceExplanation);

  if (!primaryHasIlluminationMeaning || !relatedHasOpeningMeaning || !sourceDescribesAffirmativeTransmission) {
    return null;
  }

  return Object.freeze({
    functionalOperation: "ENABLE_PASSAGE" as const,
    statement: `Directional functional interpretation (exploratory): the source relates ${input.primary.form} (“${primaryMeaning}”) to ${input.related.form} (“${relatedMeaning}”). Its source-authored explanation mentions letting light through, while the related meanings include a window, opening, or access function. The engine therefore models ${input.primary.form} as an enabling input and ${input.related.form} as a structure that lets that input enter or provides access. This is a falsifiable use-oriented model, not proof of morphology, etymology, causation, or Voice semantics.`,
    basis: Object.freeze([
      "SOURCE_ATTESTED_PRIMARY_MEANING",
      "SOURCE_ATTESTED_RELATED_MEANING",
      "SOURCE_AUTHORED_TRANSMISSION_EXPLANATION",
      "SOURCE_DERIVED_PRONUNCIATION_STRUCTURE",
    ]),
    alternatives: Object.freeze([
      "The source-authored explanation may be approximate, contested, or ordinary lexical description rather than a demonstrated derivation.",
      "The opening or access sense may be figurative or context-specific rather than a physical transmission function.",
      "The computed Voice paths and consonantal contexts are phonological observations and may have no semantic force.",
    ]),
  });
}

function buildEntityToAttributedPropertyHypothesisV0_1(input: Readonly<{
  comparison: AlbanianSourceLinkedComparisonV0_1;
  primary: AlbanianSourceLinkedRecordV0_1;
  related: AlbanianSourceLinkedRecordV0_1;
}>): AlbanianFunctionalHypothesisV0_1 | null {
  if (
    input.comparison.status !== "SUPPORTED" ||
    input.comparison.relation.relation !== "SOURCE_DERIVED_FORM" ||
    input.primary.partOfSpeech !== "noun" ||
    input.related.partOfSpeech !== "adj" ||
    !hasMeaningEvidenceV0_1(input.primary.meaningGlosses) ||
    !hasMeaningEvidenceV0_1(input.related.meaningGlosses)
  ) {
    return null;
  }

  const suffixTemplate = input.related.etymologyTemplates.find((template) =>
    template.name === "suffix" &&
    template.args["1"] === "sq" &&
    normalizedAlbanianFormV0_1(template.args["2"] ?? "") === normalizedAlbanianFormV0_1(input.primary.form) &&
    template.args["3"] === "-or",
  );
  const sourceExplanation = input.related.etymologyText?.trim() ?? "";
  const sourceExplanationText = sourceExplanation.toLocaleLowerCase("en-US").replace(/\s+/gu, " ");
  const expectedSourceExplanation = `from ${input.primary.form.toLocaleLowerCase("en-US")} + -or.`;
  if (!suffixTemplate || sourceExplanationText !== expectedSourceExplanation) return null;
  const sourceExplanationStatement = sourceExplanation.replace(/[.!?]\s*$/u, "");

  const primaryMeaning = input.primary.meaningGlosses.join("; ");
  const relatedMeaning = input.related.meaningGlosses.join("; ");
  return Object.freeze({
    functionalOperation: null,
    statement: `Source-bounded functional interpretation (exploratory): the source links ${input.related.form} (“${relatedMeaning}”) to ${input.primary.form} (“${primaryMeaning}”) and attributes its form to ${sourceExplanationStatement}. The product therefore models an entity → attributed property relationship: ${input.primary.form} supplies the entity concept and ${input.related.form} supplies a related property. This is a source-bounded product prompt, not proof of morphology, etymology, causation, or Voice semantics.`,
    basis: Object.freeze([
      "SOURCE_ATTESTED_PRIMARY_MEANING",
      "SOURCE_ATTESTED_PROPERTY_MEANING",
      "SOURCE_AUTHORED_SUFFIX_EXPLANATION",
      "SOURCE_STRUCTURED_FORM_REFERENCE",
    ]),
    alternatives: Object.freeze([
      "The source-authored suffix account may be descriptive or historically contestable rather than a complete derivational analysis.",
      "The adjective's ordinary contextual use may extend beyond the property gloss represented here.",
      "The related record has no source IPA in this snapshot, so no Voice or phonological semantic force is claimed.",
    ]),
  });
}

type AlbanianSourceSenseAgentEvidenceV0_1 = Readonly<{
  sense: NonNullable<AlbanianSourceLinkedRecordV0_1["sourceSenses"]>[number];
  category: AlbanianKaikkiExactLexicalSourceCategoryV0_1;
}>;

function qualifyingSourceSenseAgentEvidenceV0_1(
  record: AlbanianSourceLinkedRecordV0_1,
): AlbanianSourceSenseAgentEvidenceV0_1 | null {
  const qualifyingSenses = (record.sourceSenses ?? []).flatMap((sense) => {
    if (!sense.senseId || sense.glosses.length === 0) return [];
    const qualifyingCategories = sense.categories.filter((category) =>
      category.name === "Occupations" &&
      category.orig === "sq:Occupations" &&
      category.langcode === "sq" &&
      category.source === "w",
    );
    if (qualifyingCategories.length !== 1) return [];
    const category = qualifyingCategories[0];
    return category ? [{ sense, category }] : [];
  });

  return qualifyingSenses.length === 1 ? qualifyingSenses[0] ?? null : null;
}

function normalizedSourceTemplateTextV0_1(value: string): string {
  return value.normalize("NFC").trim().replace(/\s+/gu, " ").toLocaleLowerCase("sq-AL");
}

function hasExactTargetAuthoredAlbanianSuffixEvidenceV0_1(input: Readonly<{
  primary: AlbanianSourceLinkedRecordV0_1;
  related: AlbanianSourceLinkedRecordV0_1;
  comparison: AlbanianSourceLinkedComparisonV0_1 | null;
}>): boolean {
  const comparison = input.comparison;
  if (
    comparison?.status !== "SUPPORTED" ||
    comparison.relation.relation !== "SOURCE_RELATED_FORM" ||
    comparison.relation.primarySourceRecordId !== input.primary.sourceRecordId ||
    comparison.relation.primaryEntryLocator !== input.primary.entryLocator ||
    comparison.relation.relatedSourceRecordId !== input.related.sourceRecordId ||
    comparison.relation.relatedEntryLocator !== input.related.entryLocator ||
    normalizedAlbanianFormV0_1(comparison.relation.relatedForm) !== normalizedAlbanianFormV0_1(input.related.form) ||
    comparison.related?.sourceRecordId !== input.related.sourceRecordId ||
    comparison.related.entryLocator !== input.related.entryLocator ||
    comparison.related.form !== input.related.form
  ) {
    return false;
  }

  const matchingReferences = input.related.etymologyLinks.filter((link) =>
    exactAlbanianSourceReferenceV0_1(link, input.primary.form) &&
    link.sourceForm === comparison.relation.referencedForm &&
    link.reference === comparison.relation.reference,
  );
  const suffixTemplates = input.related.etymologyTemplates.filter((template) => template.name === "suffix");
  if (matchingReferences.length !== 1 || suffixTemplates.length !== 1) return false;

  const template = suffixTemplates[0];
  if (!template) return false;
  const args = template.args;
  const argKeys = Object.keys(args).sort();
  const base = args["2"]?.trim() ?? "";
  const suffix = args["3"]?.trim() ?? "";
  if (
    JSON.stringify(argKeys) !== JSON.stringify(["1", "2", "3"]) ||
    args["1"] !== "sq" ||
    normalizedAlbanianFormV0_1(base) !== normalizedAlbanianFormV0_1(input.primary.form) ||
    suffix.length === 0 ||
    suffix.startsWith("-") ||
    normalizedSourceTemplateTextV0_1(template.expansion) !== normalizedSourceTemplateTextV0_1(`${base} + -${suffix}`)
  ) {
    return false;
  }

  const sourceExplanation = input.related.etymologyText?.trim().replace(/[.!?]+$/u, "") ?? "";
  return sourceExplanation.length > 0 &&
    normalizedSourceTemplateTextV0_1(sourceExplanation) === normalizedSourceTemplateTextV0_1(`${base} + -${suffix}`.replace(/^/u, "From "));
}

function hasExactTargetAuthoredAlbanianReferenceV0_1(input: Readonly<{
  primary: AlbanianSourceLinkedRecordV0_1;
  related: AlbanianSourceLinkedRecordV0_1;
  comparison: AlbanianSourceLinkedComparisonV0_1 | null;
}>): boolean {
  const comparison = input.comparison;
  if (
    comparison?.status !== "SUPPORTED" ||
    comparison.relation.relation !== "TARGET_AUTHORED_ETYMOLOGY_REFERENCE" ||
    comparison.relation.direction !== "RELATED_FORM_TO_PRIMARY_ETYMLOGY_REFERENCE" ||
    comparison.relation.primarySourceRecordId !== input.primary.sourceRecordId ||
    comparison.relation.primaryEntryLocator !== input.primary.entryLocator ||
    comparison.relation.relatedSourceRecordId !== input.related.sourceRecordId ||
    comparison.relation.relatedEntryLocator !== input.related.entryLocator ||
    normalizedAlbanianFormV0_1(comparison.relation.relatedForm) !== normalizedAlbanianFormV0_1(input.related.form) ||
    normalizedAlbanianFormV0_1(comparison.relation.referencedForm ?? "") !== normalizedAlbanianFormV0_1(input.primary.form)
  ) {
    return false;
  }

  const targetReferences = input.related.etymologyLinks.filter((link) =>
    normalizedAlbanianFormV0_1(link.sourceForm) === normalizedAlbanianFormV0_1(input.primary.form),
  );
  return targetReferences.length === 1 &&
    exactAlbanianSourceReferenceV0_1(targetReferences[0]!, input.primary.form) &&
    targetReferences[0]?.sourceForm === comparison.relation.referencedForm &&
    targetReferences[0]?.reference === comparison.relation.reference;
}

function hasExactTargetAuthoredEtymologyReferenceEvidenceV0_1(input: Readonly<{
  primary: AlbanianSourceLinkedRecordV0_1;
  related: AlbanianSourceLinkedRecordV0_1;
  comparison: AlbanianSourceLinkedComparisonV0_1 | null;
}>): boolean {
  const comparison = input.comparison;
  if (
    comparison?.status !== "SUPPORTED" ||
    comparison.relation.relation !== "TARGET_AUTHORED_ETYMOLOGY_REFERENCE" ||
    comparison.relation.direction !== "RELATED_FORM_TO_PRIMARY_ETYMLOGY_REFERENCE" ||
    comparison.relation.primarySourceRecordId !== input.primary.sourceRecordId ||
    comparison.relation.primaryEntryLocator !== input.primary.entryLocator ||
    comparison.relation.relatedSourceRecordId !== input.related.sourceRecordId ||
    comparison.relation.relatedEntryLocator !== input.related.entryLocator ||
    normalizedAlbanianFormV0_1(comparison.relation.relatedForm) !== normalizedAlbanianFormV0_1(input.related.form) ||
    normalizedAlbanianFormV0_1(comparison.relation.referencedForm ?? "") !== normalizedAlbanianFormV0_1(input.primary.form)
  ) {
    return false;
  }

  const targetReferences = input.related.etymologyLinks.filter((link) =>
    normalizedAlbanianFormV0_1(link.sourceForm) === normalizedAlbanianFormV0_1(input.primary.form),
  );
  if (
    targetReferences.length !== 1 ||
    !exactAlbanianSourceReferenceV0_1(targetReferences[0]!, input.primary.form) ||
    targetReferences[0]?.sourceForm !== comparison.relation.referencedForm ||
    targetReferences[0]?.reference !== comparison.relation.reference
  ) {
    return false;
  }

  const templates = input.related.etymologyTemplates.filter((template) => template.name === "af");
  if (templates.length !== 1) return false;
  const template = templates[0];
  if (!template) return false;
  const base = template.args["2"]?.trim() ?? "";
  const otherComponent = template.args["3"]?.trim() ?? "";
  const expansionParts = template.expansion.split(" + ");
  const expansionBase = expansionParts[0]?.trim() ?? "";
  const expansionBaseRemainder = expansionBase.slice(input.primary.form.length).trim();
  const expansionBaseIsExact = normalizedAlbanianFormV0_1(expansionBase) === normalizedAlbanianFormV0_1(input.primary.form) ||
    (normalizedAlbanianFormV0_1(expansionBase.slice(0, input.primary.form.length)) === normalizedAlbanianFormV0_1(input.primary.form) &&
      /^\(.+\)$/u.test(expansionBaseRemainder));
  if (
    template.args["1"] !== "sq" ||
    normalizedAlbanianFormV0_1(base) !== normalizedAlbanianFormV0_1(input.primary.form) ||
    otherComponent.length === 0 ||
    expansionParts.length !== 2 ||
    !expansionBaseIsExact ||
    normalizedSourceTemplateTextV0_1(expansionParts[1] ?? "") !== normalizedSourceTemplateTextV0_1(otherComponent)
  ) {
    return false;
  }

  const sourceExplanation = input.related.etymologyText?.trim().replace(/[.!?]+$/u, "") ?? "";
  return sourceExplanation.length > 0 &&
    normalizedSourceTemplateTextV0_1(sourceExplanation) === normalizedSourceTemplateTextV0_1(`From ${template.expansion}`);
}

function buildAgentFunctionalHypothesisV0_1(input: Readonly<{
  primary: AlbanianSourceLinkedRecordV0_1;
  related: AlbanianSourceLinkedRecordV0_1;
  comparison: AlbanianSourceLinkedComparisonV0_1 | null;
  sourceRelation: AlbanianSourceEvidenceRelationV0_1 | null;
}>): AlbanianFunctionalHypothesisV0_1 | null {
  const directDerivedForm = input.sourceRelation === "SOURCE_DERIVED_FORM";
  const targetAuthoredSuffixRelation = input.sourceRelation === "SOURCE_RELATED_FORM" &&
    hasExactTargetAuthoredAlbanianSuffixEvidenceV0_1(input);
  const targetAuthoredEtymologyReference = input.sourceRelation === "TARGET_AUTHORED_ETYMOLOGY_REFERENCE" &&
    hasExactTargetAuthoredEtymologyReferenceEvidenceV0_1(input);
  if (
    (!directDerivedForm && !targetAuthoredSuffixRelation && !targetAuthoredEtymologyReference) ||
    (input.primary.partOfSpeech !== "noun" && input.primary.partOfSpeech !== "verb") ||
    input.related.partOfSpeech !== "noun" ||
    !hasMeaningEvidenceV0_1(input.primary.meaningGlosses) ||
    !hasMeaningEvidenceV0_1(input.related.meaningGlosses)
  ) {
    return null;
  }

  const sourceSenseAgentEvidence = input.comparison?.status === "SUPPORTED"
    ? qualifyingSourceSenseAgentEvidenceV0_1(input.related)
    : null;
  const meaningfulTargetSenses = (input.related.sourceSenses ?? []).filter((sense) =>
    sense.glosses.some((gloss) => gloss.trim().length > 0),
  );
  if (
    (targetAuthoredSuffixRelation && !sourceSenseAgentEvidence) ||
    ((targetAuthoredSuffixRelation || targetAuthoredEtymologyReference) &&
      (meaningfulTargetSenses.length !== 1 || !meaningfulTargetSenses[0]?.senseId ||
        (sourceSenseAgentEvidence && sourceSenseAgentEvidence.sense.senseId !== meaningfulTargetSenses[0]?.senseId)))
  ) {
    return null;
  }
  const existingWhitelistedAgentGloss = input.related.meaningGlosses.some((gloss) =>
    /\b(?:fisher(?:man|woman)?|angler|farmer|hunter|seller|singer|trader|worker|teacher|driver|operator|professional|practitioner|stableman|ostler)\b/iu.test(gloss),
  );
  if (
    !sourceSenseAgentEvidence &&
    !(directDerivedForm && existingWhitelistedAgentGloss) &&
    !(targetAuthoredEtymologyReference && existingWhitelistedAgentGloss)
  ) return null;

  const primaryMeaning = input.primary.meaningGlosses.join("; ");
  const relatedMeaning = input.related.meaningGlosses.join("; ");
  const functionalMeaning = sourceSenseAgentEvidence?.sense.glosses.join("; ") ?? relatedMeaning;
  const relatedHasSourceIpa = input.related.pronunciationVariants.some((variant) => variant.rawIpa !== null);
  const targetSuffixTemplate = input.related.etymologyTemplates.find((template) => template.name === "suffix");
  const targetAuthoredTemplate = input.related.etymologyTemplates.find((template) => template.name === "af");
  const categoryBackedStatement = sourceSenseAgentEvidence
    ? ` The final source sense (“${functionalMeaning}”) carries the exact source-authored sq:Occupations category, with its sense identity preserved; the category is evidence for this lexical sense only, not for every use of the suffix or for an independent semantic law.`
    : "";
  const statement = targetAuthoredEtymologyReference && targetAuthoredTemplate
    ? `Source-bounded functional operation AGENT (exploratory): the directly queried target record ${input.related.form} (“${relatedMeaning}”) is linked to the resolved Albanian base record ${input.primary.form} (“${primaryMeaning}”) only by its own exact source-authored etymology reference ${input.comparison?.relation.reference ?? "Null"} and template ${targetAuthoredTemplate.expansion}. The identified target sense (“${functionalMeaning}”)${sourceSenseAgentEvidence ? " carries the exact source-authored sq:Occupations category" : " matches the existing bounded human-role source-gloss qualification"}. The target record does not create a base-side SOURCE_DERIVED_FORM assertion; this reading does not infer one, resolve the remaining template component, or establish a suffix rule. It is an exploratory AGENT reading for this source-qualified target sense only; no embryo meaning is claimed.`
    : targetAuthoredSuffixRelation && targetSuffixTemplate
    ? `Source-bounded functional operation AGENT (exploratory): the base source record lists ${input.related.form} (“${relatedMeaning}”) as SOURCE_RELATED_FORM of ${input.primary.form} (“${primaryMeaning}”), not as a base-side derived-form link. The exact target record separately cites ${input.comparison?.relation.reference ?? "Null"} and attributes the template ${targetSuffixTemplate.expansion}; its uniquely identified source sense (“${functionalMeaning}”) carries sq:Occupations. The product models AGENT for this source-qualified target sense while preserving the source relation label. The attributed template is not independent proof of morphology, history, or a universal suffix rule, and no embryo meaning is claimed.`
    : `Source-bounded functional operation AGENT (exploratory): the source lists ${input.related.form} as a derived form of ${input.primary.form}; its glosses identify ${input.primary.form} as “${primaryMeaning}” and ${input.related.form} as “${relatedMeaning}”. The product preserves AGENT as an exploratory label for the related agent or profession gloss and this source-derived link; it does not assign an entity, resource, or other semantic role to the primary word beyond its source gloss.${categoryBackedStatement} This is a source-bounded product hypothesis, not proof of morphology, etymology, causation, or universal Voice semantics.`;
  return Object.freeze({
    functionalOperation: "AGENT" as const,
    statement,
    basis: Object.freeze([
      "SOURCE_ATTESTED_PRIMARY_MEANING",
      "SOURCE_ATTESTED_AGENT_MEANING",
      ...(targetAuthoredEtymologyReference
        ? ["TARGET_SOURCE_AUTHORED_ETYMOLOGY_REFERENCE", "SOURCE_STRUCTURED_ALBANIAN_REFERENCE"]
        : targetAuthoredSuffixRelation
        ? ["SOURCE_RELATED_FORM_LINK", "TARGET_SOURCE_AUTHORED_SUFFIX_TEMPLATE", "SOURCE_STRUCTURED_ALBANIAN_REFERENCE"]
        : ["SOURCE_DERIVED_FORM_LINK"]),
      ...(sourceSenseAgentEvidence ? ["SOURCE_ATTESTED_FINAL_SENSE_CATEGORY"] : []),
    ]),
    alternatives: Object.freeze([
      ...(targetAuthoredEtymologyReference
        ? [
            "The target record supplies an etymology reference, not a base-side derived-form edge; no direction stronger than that source attribution is claimed.",
            "The source-authored template's remaining component is not independently resolved and supports no suffix law or embryo meaning.",
          ]
        : targetAuthoredSuffixRelation
        ? [
            "The base record labels this as a related form; only the target record attributes the source reference and suffix template, and that attribution is not independent proof of morphology.",
            "The exact source category supports this identified lexical sense only; it establishes no universal suffix rule or independent embryo meaning.",
          ]
        : [
            "The source-derived link is not a complete morphological or etymological analysis.",
            "The profession gloss may describe an occupation without establishing a universal semantic operation.",
          ]),
      relatedHasSourceIpa
        ? "The related source IPA and computed Voice path are phonological observations and may have no semantic force."
        : "The related record has no source IPA in this snapshot, so no Voice or phonological force is claimed.",
    ]),
  });
}

export function buildAlbanianFunctionalMeaningBridgeV0_1(input: Readonly<{
  primary: AlbanianSourceLinkedRecordV0_1;
  comparison: AlbanianSourceLinkedComparisonV0_1 | null;
  related?: AlbanianSourceLinkedRecordV0_1 | null;
  sourceRelation?: AlbanianSourceEvidenceRelationV0_1 | null;
}>): AlbanianFunctionalMeaningBridgeV0_1 {
  const related = input.related ?? input.comparison?.related ?? null;
  const sourceRelation = input.sourceRelation ?? input.comparison?.relation.relation ?? null;
  const sourceFacts = bridgeRecordFactsV0_1(input.primary, related, input.comparison);
  const derivedStructure = input.comparison ? bridgeDerivedStructureV0_1(input.comparison) : null;
  const reasons: string[] = [];
  const agentFunctionalHypothesis = related
    ? buildAgentFunctionalHypothesisV0_1({
        primary: input.primary,
        related,
        comparison: input.comparison,
        sourceRelation,
      })
    : null;

  if (!agentFunctionalHypothesis && (!input.comparison || input.comparison.status !== "SUPPORTED" || related === null)) {
    reasons.push("SOURCE_LINKED_RELATION_NOT_SUPPORTED");
  }
  if (related !== null && related.meaningGlosses.length === 0) {
    reasons.push("RELATED_MEANING_EVIDENCE_MISSING");
  }
  if (!hasMeaningEvidenceV0_1(input.primary.meaningGlosses)) {
    reasons.push("PRIMARY_MEANING_EVIDENCE_MISSING");
  }
  if (!agentFunctionalHypothesis && related !== null && !related.etymologyText?.trim()) {
    reasons.push("SOURCE_AUTHORED_FUNCTIONAL_EXPLANATION_MISSING");
  }
  const entityToAttributedPropertyHypothesis = related && input.comparison && sourceRelation !== "TARGET_AUTHORED_ETYMOLOGY_REFERENCE"
    ? buildEntityToAttributedPropertyHypothesisV0_1({
        comparison: input.comparison,
        primary: input.comparison.primary,
        related,
      })
    : null;
  if (derivedStructure === null && entityToAttributedPropertyHypothesis === null && !agentFunctionalHypothesis) {
    reasons.push("DERIVED_STRUCTURE_NOT_SUPPORTED_FOR_BOTH_RECORDS");
  }
  if (reasons.length > 0) {
    return nullFunctionalMeaningBridgeV0_1({
      relatedForm: related?.form ?? input.comparison?.relation.relatedForm ?? null,
      sourceFacts,
      derivedStructure,
      reasonCodes: Object.freeze([...new Set(reasons)]),
    });
  }

  const targetAuthoredReferenceIsExact = related && sourceRelation === "TARGET_AUTHORED_ETYMOLOGY_REFERENCE"
    ? hasExactTargetAuthoredAlbanianReferenceV0_1({
        primary: input.comparison?.primary ?? input.primary,
        related,
        comparison: input.comparison,
      })
    : sourceRelation !== "TARGET_AUTHORED_ETYMOLOGY_REFERENCE";
  const directionalHypothesis = related && targetAuthoredReferenceIsExact
    ? buildDirectionalFunctionalHypothesisV0_1({
        primary: input.comparison?.primary ?? input.primary,
        related,
      })
    : null;
  const functionalHypothesis = directionalHypothesis ?? entityToAttributedPropertyHypothesis ?? agentFunctionalHypothesis;
  if (!functionalHypothesis) {
    return nullFunctionalMeaningBridgeV0_1({
      relatedForm: related?.form ?? input.comparison?.relation.relatedForm ?? null,
      sourceFacts,
      derivedStructure,
      reasonCodes: ["FUNCTIONAL_OPERATION_NOT_SUPPORTED"],
    });
  }

  return Object.freeze({
    status: "SUPPORTED",
    truthLayers: Object.freeze([
      "SOURCE_FACT",
      ...(derivedStructure ? ["DERIVED_STRUCTURE" as const] : []),
      "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
    ] as const satisfies readonly AlbanianFunctionalMeaningBridgeTruthLayerV0_1[]),
    relatedForm: related?.form ?? null,
    sourceFacts,
    derivedStructure,
    functionalHypothesis: Object.freeze({
      status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS" as const,
      functionalOperation: functionalHypothesis.functionalOperation,
      statement: functionalHypothesis.statement,
      alternatives: functionalHypothesis.alternatives,
      basis: functionalHypothesis.basis,
      claimBoundary: "Exploratory product interpretation only; source-authored explanation remains attributed evidence and is not engine-proven morphology, etymology, causation, or universal Voice meaning.",
    }),
    reasonCodes: Object.freeze([]),
    claimBoundary: "The four truth layers are kept separate: source facts, derived structure, an exploratory functional prompt, and explicit alternatives/limits. No historical or semantic authority is promoted.",
  });
}

function buildIntegratedFunctionalReadingInterpretationV0_1(
  functionalMeaningBridge: AlbanianFunctionalMeaningBridgeV0_1,
): AlbanianLexicalReadingV0_1["interpretation"] {
  const hypothesis = functionalMeaningBridge.functionalHypothesis;
  if (
    functionalMeaningBridge.status !== "SUPPORTED" ||
    hypothesis.status !== "EXPLORATORY_FUNCTIONAL_HYPOTHESIS" ||
    hypothesis.statement === null
  ) {
    return Object.freeze({
      status: "UNKNOWN_OR_NULL" as const,
      statement: null,
      alternatives: Object.freeze([]),
      basis: Object.freeze([]),
      claimBoundary: "The available source evidence does not authorize a bounded product interpretation; Null is preserved.",
    });
  }

  return Object.freeze({
    status: "EXPLORATORY_ZHEJI_READING" as const,
    statement: `Integrated source-bounded functional reading (exploratory): ${hypothesis.statement} The source-bounded bridge is presented alongside the source facts and descriptive structural observations; independent functional meaning for any structural embryo remains Unknown / Null.`,
    alternatives: Object.freeze([
      ...hypothesis.alternatives,
      "Other evaluated source-linked candidates remain inspectable; no single winner is claimed.",
    ]),
    basis: Object.freeze([
      "SOURCE_ATTESTED_FUNCTIONAL_BRIDGE",
      ...hypothesis.basis,
      "STRUCTURAL_EMBRYO_FUNCTION_REMAINS_UNKNOWN_OR_NULL",
    ]),
    claimBoundary: "Integrated exploratory product reading only; source facts, derived structure and functional hypothesis remain separate. No independent embryo function, morphology, etymology, causation, historical origin, or universal Voice semantics is claimed.",
  });
}

const FIVE_WINDOWS_LANGUAGE_NAMES_V0_1: Readonly<Record<string, string>> = Object.freeze({
  "fa-cls": "Classical Persian",
  it: "Italian",
  "la-vul": "Vulgar Latin",
  ota: "Ottoman Turkish",
  la: "Latin",
});

function languageNameFromTemplateV0_1(
  template: AlbanianKaikkiExactLexicalSourceEtymologyTemplateV0_1 | null,
): string | null {
  if (!template) return null;
  const languageCode = template.args["2"]?.trim().toLocaleLowerCase("en-US") ?? "";
  if (FIVE_WINDOWS_LANGUAGE_NAMES_V0_1[languageCode]) {
    return FIVE_WINDOWS_LANGUAGE_NAMES_V0_1[languageCode];
  }
  const languageMatch = /^[A-Za-z]+(?:[ -][A-Za-z]+)*/u.exec(template.expansion.trim());
  return languageMatch?.[0] ?? null;
}

function projectFiveWindowsRecordV0_1(
  fact: AlbanianKaikkiExactLexicalSourceFactV0_1,
): AlbanianFiveWindowsRecordV0_1 {
  const etymologyText = fact.etymologyText?.trim() || null;
  const etymologyLinks = Object.freeze([...(fact.etymologyLinks ?? [])]);
  const etymologyTemplates = Object.freeze([...(fact.etymologyTemplates ?? [])]);
  const borrowingTemplate = etymologyTemplates.find((template) => template.name === "bor+") ?? null;
  const hasBorrowingEvidence = Boolean(borrowingTemplate) || /^Borrowed from\b/iu.test(etymologyText ?? "");
  const hasAlbanianReference = etymologyLinks.some((link) => /#Albanian$/u.test(link.reference));
  const hasInternalFormationEvidence = hasAlbanianReference && (
    etymologyTemplates.some((template) => template.name === "af") ||
    /^From\b/iu.test(etymologyText ?? "")
  );
  const classification: AlbanianFiveWindowsClassificationV0_1 = hasBorrowingEvidence
    ? "SOURCE_ATTRIBUTED_BORROWING"
    : hasInternalFormationEvidence
      ? "ALBANIAN_INTERNAL_FORMATION"
      : "UNKNOWN_OR_NULL";
  const ultimateTemplate = etymologyTemplates.find((template) =>
    template.name === "der" && template.args["2"] !== undefined && template.args["2"] !== "sq",
  ) ?? null;

  return Object.freeze({
    sourceRecordId: fact.sourceRecordId,
    entryLocator: fact.entryLocator,
    physicalRecordOrdinal: fact.physicalRecordOrdinal,
    form: fact.form,
    partOfSpeech: fact.partOfSpeech,
    meaningGlosses: distinctGlossesV0_1([fact]),
    ipaObservations: Object.freeze(fact.ipaObservations.map((observation) => Object.freeze({
      soundIndex: observation.soundIndex,
      ipa: observation.ipa,
      tags: Object.freeze([...observation.tags]),
    }))),
    sourceIpaSevenVoiceAnalyses: projectAlbanianKaikkiFactSourceIpaToSevenVoicesV0_1(fact),
    etymologyText,
    etymologyLinks,
    etymologyTemplates,
    classification,
    borrowedFromLanguage: hasBorrowingEvidence
      ? languageNameFromTemplateV0_1(borrowingTemplate)
      : null,
    ultimateSourceLanguage: hasBorrowingEvidence
      ? languageNameFromTemplateV0_1(ultimateTemplate)
      : null,
    usageNotes: Object.freeze([]),
  });
}

function fiveWindowsMemberFromResultV0_1(
  form: string,
  result: AlbanianKaikkiExactLexicalSourceLookupResultV0_1,
): AlbanianFiveWindowsMemberV0_1 {
  if (result.status === "MATCHES_FOUND") {
    return Object.freeze({
      form,
      status: "MATCHES_FOUND",
      records: Object.freeze(result.facts.map(projectFiveWindowsRecordV0_1)),
      reasonCodes: Object.freeze([]),
    });
  }
  return Object.freeze({
    form,
    status: result.status,
    records: Object.freeze([]),
    reasonCodes: Object.freeze([result.reasonCode]),
  });
}

async function buildFiveWindowsComparisonV0_1(input: Readonly<{
  word: string;
  facts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[];
  sourceStatus: AlbanianKaikkiExactLexicalSourceStatusV0_1;
  provider: AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1;
}>): Promise<AlbanianFiveWindowsComparisonV0_1 | null> {
  const queryForm = normalizedAlbanianFormV0_1(input.word);
  if (!ALBANIAN_FIVE_WINDOWS_FORMS_V0_1.some((form) => normalizedAlbanianFormV0_1(form) === queryForm)) {
    return null;
  }
  if (input.sourceStatus.status === "NOT_QUERIED") return null;

  const unavailableResult: Extract<AlbanianKaikkiExactLexicalSourceLookupResultV0_1, { status: "UNAVAILABLE" }> | null = input.sourceStatus.status === "UNAVAILABLE"
    ? Object.freeze({
        status: "UNAVAILABLE" as const,
        queryForm: input.sourceStatus.queryForm,
        facts: Object.freeze([]) as readonly [],
        reasonCode: (input.sourceStatus.reasonCode ?? "ALBANIAN_SOURCE_RECORD_FAILURE") as Extract<AlbanianKaikkiExactLexicalSourceLookupResultV0_1, { status: "UNAVAILABLE" }>['reasonCode'],
      })
    : null;
  const members = await Promise.all(ALBANIAN_FIVE_WINDOWS_FORMS_V0_1.map(async (form) => {
    if (normalizedAlbanianFormV0_1(form) === queryForm) {
      if (input.sourceStatus.status === "MATCHES_FOUND") {
        return fiveWindowsMemberFromResultV0_1(form, Object.freeze({
          status: "MATCHES_FOUND" as const,
          queryForm: input.sourceStatus.queryForm ?? form,
          facts: input.facts,
          reasonCode: null,
        }));
      }
      return fiveWindowsMemberFromResultV0_1(form, Object.freeze({
        status: input.sourceStatus.status,
        queryForm: input.sourceStatus.queryForm,
        facts: Object.freeze([]) as readonly [],
        reasonCode: input.sourceStatus.reasonCode,
      }) as unknown as AlbanianKaikkiExactLexicalSourceLookupResultV0_1);
    }
    if (unavailableResult) return fiveWindowsMemberFromResultV0_1(form, unavailableResult);
    try {
      return fiveWindowsMemberFromResultV0_1(form, await input.provider.query(form));
    } catch {
      return Object.freeze({
        form,
        status: "UNAVAILABLE" as const,
        records: Object.freeze([]),
        reasonCodes: Object.freeze(["ALBANIAN_SOURCE_RECORD_FAILURE"]),
      });
    }
  }));

  return Object.freeze({
    comparisonId: "FIVE_WINDOWS",
    queryForm: input.word,
    members: Object.freeze(members),
    summary: "This bounded comparison keeps five configured Albanian window expressions in source order. Source-authored formation or borrowing labels are shown only when the exact source record carries matching evidence.",
    alternatives: Object.freeze([
      "Source-authored etymology is attributed evidence, not independent historical proof.",
      "Usage and register tags are not carried by the current exact-source contract; Unknown / Null is preserved.",
      "IPA and Seven-Voices observations remain descriptive and separate from formation or borrowing classification.",
      "The five configured expressions are a bounded comparison set, not a claim of synonymy or universal interchangeability.",
    ]),
    claimBoundary: "Curated source-linked comparison only; no synonymy, universal interchangeability, historical proof, or Seven-Voices semantic claim.",
  });
}

function buildAlbanianFunctionalFamilyReadingV0_1(input: Readonly<{
  primary: AlbanianSourceLinkedRecordV0_1;
  uniquePrimaryRecord: boolean;
  sourceStatus: AlbanianKaikkiExactLexicalSourceStatusV0_1;
  candidates: readonly AlbanianRelatedCandidateEvaluationV0_1[];
  uniqueRelatedRecords: readonly boolean[];
}>): AlbanianFunctionalFamilyReadingV0_1 | null {
  const primarySenses = (input.primary.sourceSenses ?? []).filter((sense) =>
    sense.senseId && hasMeaningEvidenceV0_1(sense.glosses),
  );
  if (
    input.sourceStatus.status !== "MATCHES_FOUND" ||
    !input.uniquePrimaryRecord ||
    !input.primary.sourceRecordId || !input.primary.entryLocator ||
    !hasMeaningEvidenceV0_1(input.primary.meaningGlosses) ||
    primarySenses.length !== 1 || input.primary.sourceSenses?.length !== 1
  ) return null;

  // A family is a projection of existing bridges, never another AGENT classifier.
  if (input.candidates.some((candidate) =>
    candidate.sourceRelation === "SOURCE_DERIVED_FORM" &&
    candidate.functionalMeaningBridge.status === "SUPPORTED" &&
    candidate.functionalMeaningBridge.functionalHypothesis.functionalOperation !== "AGENT",
  )) return null;

  const formCounts = new Map<string, number>();
  for (const candidate of input.candidates) {
    if (candidate.sourceRelation !== "SOURCE_DERIVED_FORM") continue;
    const form = normalizedAlbanianFormV0_1(candidate.relatedForm);
    formCounts.set(form, (formCounts.get(form) ?? 0) + 1);
  }

  const members: AlbanianFunctionalFamilyReadingV0_1["members"][number][] = [];
  input.candidates.forEach((candidate, index) => {
    const comparison = candidate.sourceLinkedComparison;
    const bridge = candidate.functionalMeaningBridge;
    const related = comparison.related;
    const bridgeFacts = bridge.sourceFacts;
    const meaningfulSenses = (related?.sourceSenses ?? []).filter((sense) =>
      sense.senseId && hasMeaningEvidenceV0_1(sense.glosses),
    );
    if (
      candidate.sourceRelation !== "SOURCE_DERIVED_FORM" ||
      candidate.resolution !== "RESOLVED" || !input.uniqueRelatedRecords[index] ||
      (formCounts.get(normalizedAlbanianFormV0_1(candidate.relatedForm)) ?? 0) !== 1 ||
      comparison.status !== "SUPPORTED" || comparison.relation.relation !== "SOURCE_DERIVED_FORM" ||
      comparison.relation.direction !== "RELATED_FORM_TO_PRIMARY_ETYMLOGY_REFERENCE" ||
      comparison.relation.primarySourceRecordId !== input.primary.sourceRecordId ||
      comparison.relation.primaryEntryLocator !== input.primary.entryLocator ||
      comparison.relation.relatedSourceRecordId !== related?.sourceRecordId ||
      comparison.relation.relatedEntryLocator !== related?.entryLocator ||
      normalizedAlbanianFormV0_1(comparison.relation.relatedForm) !== normalizedAlbanianFormV0_1(candidate.relatedForm) ||
      comparison.primary.sourceRecordId !== input.primary.sourceRecordId ||
      bridge.status !== "SUPPORTED" ||
      bridge.functionalHypothesis.status !== "EXPLORATORY_FUNCTIONAL_HYPOTHESIS" ||
      bridge.functionalHypothesis.functionalOperation !== "AGENT" ||
      !bridge.functionalHypothesis.basis.includes("SOURCE_DERIVED_FORM_LINK") ||
      bridgeFacts?.primary.sourceRecordId !== input.primary.sourceRecordId ||
      bridgeFacts.primary.entryLocator !== input.primary.entryLocator ||
      bridgeFacts.related?.sourceRecordId !== related?.sourceRecordId ||
      bridgeFacts.related?.entryLocator !== related?.entryLocator ||
      related?.partOfSpeech !== "noun" || !related.sourceRecordId || !related.entryLocator ||
      !hasMeaningEvidenceV0_1(related.meaningGlosses) ||
      meaningfulSenses.length !== 1 || related.sourceSenses?.length !== 1 ||
      meaningfulSenses[0]?.senseId !== bridgeFacts.related?.sourceSenses[0]?.senseId
    ) return;
    members.push(Object.freeze({
      form: related.form,
      sourceRecordId: related.sourceRecordId,
      entryLocator: related.entryLocator,
      senseId: meaningfulSenses[0]!.senseId!,
      meaningGlosses: Object.freeze([...meaningfulSenses[0]!.glosses]),
      sourceRelation: "SOURCE_DERIVED_FORM" as const,
      sourceComparisonStatus: "SUPPORTED" as const,
      functionalBridgeStatus: "SUPPORTED" as const,
      evidenceBasis: bridge.functionalHypothesis.basis,
    }));
  });
  if (members.length < 2) return null;

  const primarySense = primarySenses[0]!;
  const primaryMeaning = primarySense.glosses.join("; ");
  const memberMeanings = members.map((member) =>
    `${member.form} (“${member.meaningGlosses.join("; ")}”)`,
  ).join("; ");
  return Object.freeze({
    status: "EXPLORATORY_FUNCTIONAL_FAMILY" as const,
    functionalOperation: "AGENT" as const,
    primary: Object.freeze({
      form: input.primary.form,
      sourceRecordId: input.primary.sourceRecordId,
      entryLocator: input.primary.entryLocator,
      senseId: primarySense.senseId!,
      meaningGlosses: Object.freeze([...primarySense.glosses]),
    }),
    members: Object.freeze(members),
    statement: `The frozen Kaikki Albanian source attests ${input.primary.form} as “${primaryMeaning}” and lists these derived forms in source order: ${memberMeanings}. Each listed relation independently supports an exploratory AGENT reading under the existing source gates.`,
    alternatives: Object.freeze([
      "Other source-linked forms may remain unresolved or support no functional operation.",
      "These observations come from one frozen source and do not establish independent corroboration or a shared embryo meaning.",
    ]),
    claimBoundary: "A source-bounded family of existing exploratory AGENT bridges, not a new AGENT rule, a suffix law, historical proof, or a unique winner.",
    noSingleWinner: true,
    userDecisionPosture: "user_decides" as const,
  });
}

async function buildAlbanianLexicalReadingV0_1(input: Readonly<{
  word: string;
  facts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[];
  analyses: readonly AlbanianKaikkiSourceIpaSevenVoiceAnalysisV0_1[];
  sourceStatus: AlbanianKaikkiExactLexicalSourceStatusV0_1;
  provider: AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1;
}>): Promise<AlbanianLexicalReadingV0_1> {
  const fiveWindowsComparison = await buildFiveWindowsComparisonV0_1({
    word: input.word,
    facts: input.facts,
    sourceStatus: input.sourceStatus,
    provider: input.provider,
  });
  const occupationalRoleResearchCandidates = getAlbanianOccupationalRoleCandidatesForWordV0_1(input.word);
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
      relatedCandidateEvaluations: Object.freeze([]),
      functionalFamilyReading: null,
      occupationalRoleResearchCandidates,
      fiveWindowsComparison,
      sourceLinkedComponentReading: null,
      sourceLinkedComparison: null,
      functionalMeaningBridge: nullFunctionalMeaningBridgeV0_1({
        sourceFacts: null,
        reasonCodes: Object.freeze(["PRIMARY_SOURCE_RECORD_NOT_FOUND"]),
      }),
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
  const relatedLookupIndexes = new Set<number>();
  let relatedFormLookupCount = 0;
  let derivedFormLookupCount = 0;
  related.forEach((relation, index) => {
    const lookupLimit = relation.relation === "SOURCE_DERIVED_FORM" ? 39 : 8;
    const lookupCount = relation.relation === "SOURCE_DERIVED_FORM"
      ? derivedFormLookupCount++
      : relatedFormLookupCount++;
    if (lookupCount < lookupLimit) relatedLookupIndexes.add(index);
  });
  const relatedResultsWithFacts = await Promise.all(related.map(async (relation, index) => {
    if (!relatedLookupIndexes.has(index)) {
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
        uniqueRelatedRecord: false,
      });
    }
    try {
      const result = await input.provider.query(relation.form);
      const resolved = result.status === "MATCHES_FOUND"
        ? result.facts.find((fact) => fact.partOfSpeech !== "name") ?? result.facts[0] ?? null
        : null;
      const uniqueRelatedRecord = result.status === "MATCHES_FOUND" &&
        result.facts.filter((fact) => fact.partOfSpeech !== "name").length === 1;
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
      return Object.freeze({ publicResult, resolved, uniqueRelatedRecord });
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
        uniqueRelatedRecord: false,
      });
    }
  }));
  const relatedResults = Object.freeze(relatedResultsWithFacts.map(({ publicResult }) => publicResult));
  const primaryProjection = sourceRecordProjectionV0_1(primary, input.analyses);
  const relatedCandidateEvaluations = relatedResultsWithFacts.map(({ publicResult, resolved }, index) => {
    const relatedForm = related[index]!;
    const comparison = buildSourceLinkedComparisonV0_1({
      primary,
      primaryAnalyses: input.analyses,
      relatedForm,
      related: resolved,
    });
    const bridge = buildAlbanianFunctionalMeaningBridgeV0_1({
      primary: primaryProjection,
      comparison,
      related: resolved
        ? sourceRecordProjectionV0_1(resolved, projectAlbanianKaikkiFactSourceIpaToSevenVoicesV0_1(resolved))
        : null,
      sourceRelation: relatedForm.relation,
    });
    return Object.freeze({
      relatedForm: publicResult.form,
      sourceRelation: publicResult.relation,
      resolution: publicResult.resolution,
      sourceLinkedComparison: comparison,
      functionalMeaningBridge: bridge,
    });
  });
  const targetAuthoredEtymologyCandidate = input.sourceStatus.status === "MATCHES_FOUND"
    ? await buildTargetAuthoredEtymologyCandidateV0_1({
        target: primary,
        targetFacts: input.facts.filter((fact) =>
          normalizedAlbanianFormV0_1(fact.form) === normalizedAlbanianFormV0_1(input.word) &&
          fact.partOfSpeech !== "name",
        ),
        provider: input.provider,
      })
    : null;
  const allRelatedCandidateEvaluations = targetAuthoredEtymologyCandidate
    ? Object.freeze([...relatedCandidateEvaluations, targetAuthoredEtymologyCandidate])
    : Object.freeze(relatedCandidateEvaluations);
  const functionalFamilyReading = buildAlbanianFunctionalFamilyReadingV0_1({
    primary: primaryProjection,
    uniquePrimaryRecord: input.facts.filter((fact) =>
      normalizedAlbanianFormV0_1(fact.form) === normalizedAlbanianFormV0_1(input.word) &&
      fact.partOfSpeech === primary.partOfSpeech,
    ).length === 1,
    sourceStatus: input.sourceStatus,
    candidates: allRelatedCandidateEvaluations,
    uniqueRelatedRecords: relatedResultsWithFacts.map(({ uniqueRelatedRecord }) => uniqueRelatedRecord),
  });
  const selectedRelatedCandidate = allRelatedCandidateEvaluations.find(({ sourceLinkedComparison, functionalMeaningBridge }) =>
    sourceLinkedComparison.status === "SUPPORTED" && functionalMeaningBridge.status === "SUPPORTED",
  ) ?? allRelatedCandidateEvaluations.find(({ functionalMeaningBridge }) => functionalMeaningBridge.status === "SUPPORTED")
    ?? allRelatedCandidateEvaluations.find(({ sourceLinkedComparison }) => sourceLinkedComparison.status === "SUPPORTED")
    ?? allRelatedCandidateEvaluations[0]
    ?? null;
  const sourceLinkedComparison = selectedRelatedCandidate?.sourceLinkedComparison ?? null;
  const functionalMeaningBridge = selectedRelatedCandidate?.functionalMeaningBridge ?? buildAlbanianFunctionalMeaningBridgeV0_1({
    primary: primaryProjection,
    comparison: null,
  });
  const sourceLinkedComponentReading = await buildSourceLinkedComponentReadingV0_1({
    primary,
    primaryAnalyses: input.analyses,
    provider: input.provider,
  });

  const compositionCandidate = relatedResultsWithFacts.find(({ resolved }) => resolved !== null);
  const relatedFact = compositionCandidate?.resolved ?? null;
  const composition = nullCompositionV0_1(relatedFact?.form ?? null);

  const meaningGlosses = distinctGlossesV0_1([primary]);
  const hasLightMeaning = hasConservativePrimaryIlluminationEvidenceV0_1(primary);
  const hasSupportedPath = sourcePronunciation?.status === "SUPPORTED" &&
    sourcePronunciation.voicePath.length > 0;
  const voicePath = sourcePronunciation?.voicePath.join(" → ") ?? "Null";
  const interpretation = functionalMeaningBridge.status === "SUPPORTED"
    ? buildIntegratedFunctionalReadingInterpretationV0_1(functionalMeaningBridge)
    : hasLightMeaning && hasSupportedPath
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
    relatedCandidateEvaluations: allRelatedCandidateEvaluations,
    functionalFamilyReading,
    occupationalRoleResearchCandidates,
    fiveWindowsComparison,
    sourceLinkedComponentReading,
    sourceLinkedComparison,
    functionalMeaningBridge,
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
  profileDerivedVoicePath?: readonly string[] | null;
  provider?: EnglishKaikkiServerOnlyExactIndexProviderV0_1;
  albanianLexicalSourceProvider?: AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1;
  albanetSourceAdapter?: GenericFunctionalWitnessSourceAdapterV1 | null;
  lexinSourceAdapter?: GenericFunctionalWitnessSourceAdapterV1 | null;
}): Promise<MotivationEngineDiscoveryServerOnlyResultV0_1> {
  const provider = input.provider ?? await getProductionProviderV0_1();
  // Keep the profile-derived path in the server/API integration seam. The
  // public Discovery builder remains byte-identical to its S2-pinned contract;
  // this internal view is never returned as API primaryPath.
  const discoveryAnalysis = input.profileDerivedVoicePath?.length
    ? {
        ...input.analysis,
        primaryPath: {
          ...(input.analysis.primaryPath ?? {
            levelPath: "",
            ringPath: "",
          }),
          voicePath: input.profileDerivedVoicePath.join(" → "),
        },
      }
    : input.analysis;
  const queryForms = getMotivationEngineDiscoveryQueryFormsV0_1(input);
  const resolved = await resolveEnglishRecordsV0_1(provider, queryForms);
  const albanianLexicalSourceProvider = input.albanianLexicalSourceProvider ?? await getProductionAlbanianLexicalSourceProviderV0_1();
  const albanianLexicalSourceResult = isAlbanianInputV0_1(input)
    ? await albanianLexicalSourceProvider.query(input.word)
    : null;
  const exactLexicalSourceStatus = albanianLexicalSourceResult
    ? {
        status: albanianLexicalSourceResult.status,
        queryForm: albanianLexicalSourceResult.queryForm,
        reasonCode: albanianLexicalSourceResult.reasonCode,
      }
    : {
        status: "NOT_QUERIED" as const,
        queryForm: null,
        reasonCode: "NOT_ALBANIAN_INPUT",
      };
  const albanetSourceAdapter = !isAlbanianInputV0_1(input) || input.albanetSourceAdapter === null
    ? null
    : input.albanetSourceAdapter ?? (await getProductionAlbaNetSourceV0_1()).adapter;
  const lexinSourceAdapter = !isAlbanianInputV0_1(input) || input.lexinSourceAdapter === null
    ? null
    : input.lexinSourceAdapter ?? (await getProductionLexinSourceV0_1()).adapter;
  const sourceAdapters: readonly GenericFunctionalWitnessSourceAdapterV1[] = [
    createAlbanianLexicalSubstrateWitnessAdapterV0_1(),
    createMultilingualDiscoverySubstrateS1LatinWitnessAdapterV0_2(),
    createResolvedEnglishAdapterV0_1(resolved.recordsByQuery),
    ...(isAlbanianInputV0_1(input) && albanetSourceAdapter ? [albanetSourceAdapter] : []),
    ...(isAlbanianInputV0_1(input) && lexinSourceAdapter ? [lexinSourceAdapter] : []),
  ];
  const sourceFamilyBySourceId = new Map<string, string>();
  const sourceDetailsBySourceId = new Map<string, GenericFunctionalWitnessSourceDetailsV1>();
  addStaticSourceFamiliesV0_1(sourceFamilyBySourceId);
  const recordingSourceAdapters = sourceAdapters.map((adapter) =>
    sourceFamilyRecordingAdapterV0_1(adapter, sourceFamilyBySourceId, sourceDetailsBySourceId),
  );

  const discovery = attachSourceFamilyProjectionV0_1(buildMotivationEngineDiscoveryV0_1({
    word: input.word,
    inputLanguage: input.inputLanguage,
    inputProfile: input.inputProfile,
    analysis: discoveryAnalysis,
    heart: input.heart,
    sourceAdapters: recordingSourceAdapters,
  }), sourceFamilyBySourceId, sourceDetailsBySourceId);
  const exactLexicalSourceFacts = albanianLexicalSourceResult?.status === "MATCHES_FOUND"
    ? albanianLexicalSourceResult.facts
    : Object.freeze([]) as readonly AlbanianKaikkiExactLexicalSourceFactV0_1[];
  const sourceIpaSevenVoiceAnalyses = projectAlbanianKaikkiFactsSourceIpaToSevenVoicesV0_1(
    exactLexicalSourceFacts,
  );
  return Object.freeze({
    discovery: Object.freeze({
      ...discovery,
      exactLexicalSourceStatus,
      exactLexicalSourceFacts,
      sourceIpaSevenVoiceAnalyses,
      albanianLexicalReading: await buildAlbanianLexicalReadingV0_1({
        word: input.word,
        facts: exactLexicalSourceFacts,
        analyses: sourceIpaSevenVoiceAnalyses,
        sourceStatus: exactLexicalSourceStatus,
        provider: albanianLexicalSourceProvider,
      }),
    }),
    englishProvider: resolved.operationalStatus,
  });
}
