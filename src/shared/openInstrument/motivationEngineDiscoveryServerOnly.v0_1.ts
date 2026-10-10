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

export type MotivationEngineDiscoveryServerOnlyResultV0_1 = Readonly<{
  discovery: MotivationEngineDiscoveryV0_1;
  englishProvider: EnglishKaikkiProviderOperationalStatusV0_1;
}>;

let productionProviderPromise:
  Promise<EnglishKaikkiServerOnlyExactIndexProviderV0_1> | undefined;

function getProductionProviderV0_1(): Promise<EnglishKaikkiServerOnlyExactIndexProviderV0_1> {
  productionProviderPromise ??=
    createEnglishKaikkiServerOnlyExactIndexProviderV0_1();
  return productionProviderPromise;
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
}): Promise<MotivationEngineDiscoveryServerOnlyResultV0_1> {
  const provider = input.provider ?? await getProductionProviderV0_1();
  const queryForms = getMotivationEngineDiscoveryQueryFormsV0_1(input);
  const resolved = await resolveEnglishRecordsV0_1(provider, queryForms);
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

  return Object.freeze({
    discovery: attachSourceFamilyProjectionV0_1(buildMotivationEngineDiscoveryV0_1({
      word: input.word,
      inputLanguage: input.inputLanguage,
      inputProfile: input.inputProfile,
      analysis: input.analysis,
      heart: input.heart,
      sourceAdapters: recordingSourceAdapters,
    }), sourceFamilyBySourceId),
    englishProvider: resolved.operationalStatus,
  });
}
