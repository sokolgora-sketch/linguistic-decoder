import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import {
  buildMotivationEngineDiscoveryServerOnlyV0_1,
} from "@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1";
import {
  adaptEnglishKaikkiJsonlRecordV0_1,
  ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
} from "@/shared/openInstrument/englishKaikkiSourceFamilyAdapter.v0_1";
import {
  createEnglishKaikkiServerOnlyExactIndexProviderForSyntheticFixtureV0_1,
  type EnglishKaikkiServerOnlyExactIndexProviderV0_1,
} from "@/shared/openInstrument/englishKaikkiServerOnlyExactIndexProvider.v0_1";
import type { AnalyzeWordResultV1 } from "@/shared/analysisResult.v1";

const FIXTURE_ROOT = resolve(
  "tests/fixtures/openInstrument/englishKaikkiDeterministicIndexProvider.v0_1",
);

const fixtureAdapter = (input: Parameters<typeof adaptEnglishKaikkiJsonlRecordV0_1>[0]) =>
  adaptEnglishKaikkiJsonlRecordV0_1({
    ...input,
    verifiedSnapshot: ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
  });

function isKaikkiSourceUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  try {
    const hostname = new URL(value).hostname;
    return hostname === "kaikki.org" || hostname.endsWith(".kaikki.org");
  } catch {
    return false;
  }
}

async function fixtureProvider(): Promise<EnglishKaikkiServerOnlyExactIndexProviderV0_1> {
  return createEnglishKaikkiServerOnlyExactIndexProviderForSyntheticFixtureV0_1({
    fixtureRoot: FIXTURE_ROOT,
    sourcePath: join(FIXTURE_ROOT, "source.jsonl"),
    indexPath: FIXTURE_ROOT,
    adaptRecord: fixtureAdapter,
  });
}

async function analysisFor(word: string): Promise<AnalyzeWordResultV1> {
  const payload = await runAnalysisDeterministic(word, {
    mode: "strict",
    alphabet: "auto",
  });
  return enginePayloadToAnalysisResult(payload);
}

function unavailableProvider(): EnglishKaikkiServerOnlyExactIndexProviderV0_1 {
  const failure = async (query: unknown) => ({
    status: "PROVIDER_CONFIGURATION_FAILURE" as const,
    reasonCode: "PROVIDER_CONFIGURATION_FAILURE",
    queryForm: typeof query === "string" ? query : null,
    records: Object.freeze([]) as readonly [],
  });
  return {
    providerId: "open-instrument.english-kaikki-server-only-exact-index-provider.v0.1",
    runtimeBoundary: "SERVER_ONLY",
    query: failure,
    queryWithMetrics: async (query) => ({
      result: await failure(query),
      metrics: {
        directoryBytesRead: 0,
        postingsBytesRead: 0,
        sourceBytesRead: 0,
        sourceRecordsRecovered: 0,
        adapterRecordsEmitted: 0,
      },
    }),
  };
}

function partiallyFailingProvider(): EnglishKaikkiServerOnlyExactIndexProviderV0_1 {
  const fixtureQuery = async (query: unknown) => {
    if (query === "banana") {
      return {
        status: "MATCHES_FOUND" as const,
        queryForm: "banana",
        records: Object.freeze([]),
      };
    }
    return {
      status: "INDEX_ARTIFACT_FAILURE" as const,
      reasonCode: "INDEX_ARTIFACT_FAILURE",
      queryForm: typeof query === "string" ? query : null,
      records: Object.freeze([]) as readonly [],
    };
  };
  return {
    providerId: "open-instrument.english-kaikki-server-only-exact-index-provider.v0.1",
    runtimeBoundary: "SERVER_ONLY",
    query: fixtureQuery,
    queryWithMetrics: async (query) => ({
      result: await fixtureQuery(query),
      metrics: {
        directoryBytesRead: 0,
        postingsBytesRead: 0,
        sourceBytesRead: 0,
        sourceRecordsRecovered: 0,
        adapterRecordsEmitted: 0,
      },
    }),
  };
}

describe("server-only English Kaikki Discovery integration v0.1", () => {
  it("projects exact fixture matches through generic Discovery with multiplicity and provenance", async () => {
    const word = "banana";
    const heart = buildHeartInstrumentV1(word);
    const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word,
      inputLanguage: "en",
      inputProfile: heart.spokenPronunciation.sourceProfileId,
      analysis: await analysisFor(word),
      heart,
      provider: await fixtureProvider(),
    });

    expect(result.englishProvider).toMatchObject({
      status: "AVAILABLE",
      queryFormsAttempted: expect.any(Number),
      matchQueries: 1,
      lexicalMisses: expect.any(Number),
      failureReasonCodes: [],
    });
    const english = result.discovery.candidates.filter(
      (candidate) => candidate.candidateLanguage === "English",
    );
    expect(english).toHaveLength(3);
    expect(english.map((candidate) => candidate.candidateGloss)).toEqual([
      "A tropical fruit",
      "A yellow fruit",
      "The plant",
    ]);
    expect(english.every((candidate) => candidate.candidateVoicePath.length === 0)).toBe(true);
    expect(english.every((candidate) =>
      candidate.functionalInterpretation.status === "UNKNOWN_OR_NULL" ||
      candidate.functionalInterpretation.status === "NOT_APPLICABLE_SELF_MATCH",
    )).toBe(true);
    expect(english.every((candidate) =>
      candidate.functionalInterpretation.reason === "INSUFFICIENT_FUNCTIONAL_EVIDENCE" ||
      candidate.functionalInterpretation.reason === "LEXICAL_SELF_MATCH_NOT_FUNCTIONAL_MOTIVATION",
    )).toBe(true);
    expect(english.every((candidate) => candidate.historicalRelation === "not_claimed")).toBe(true);
    expect(english.every((candidate) => candidate.noSingleWinner && candidate.userDecisionPosture === "user_decides")).toBe(true);
    expect(english.every((candidate) => isKaikkiSourceUrl(candidate.sourceFact.sourceUrlOrArchiveRef))).toBe(true);
    expect(english.every((candidate) => candidate.sourceFact.entryLocator?.startsWith("jsonl://record/"))).toBe(true);
  });

  it("keeps an absent English key as a valid lexical miss without erasing the generic Null boundary", async () => {
    const word = "learning";
    const heart = buildHeartInstrumentV1(word);
    const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word,
      inputLanguage: "en",
      inputProfile: heart.spokenPronunciation.sourceProfileId,
      analysis: await analysisFor(word),
      heart,
      provider: await fixtureProvider(),
    });

    expect(result.englishProvider).toMatchObject({
      status: "AVAILABLE",
      matchQueries: 0,
      failureReasonCodes: [],
    });
    expect(result.discovery.candidates.filter(
      (candidate) => candidate.candidateLanguage === "English",
    )).toEqual([]);
    expect(result.discovery.status).toBe("NO_MATCHES");
    expect(result.discovery.unknownOrNull.reason).toBe("NO_GENERIC_AUTHORIZED_SOURCE_WITNESS");
  });

  it("degrades when the optional provider is unavailable while preserving existing Albanian Discovery", async () => {
    const word = "study";
    const heart = buildHeartInstrumentV1(word);
    const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word,
      inputLanguage: "en",
      inputProfile: heart.spokenPronunciation.sourceProfileId,
      analysis: await analysisFor(word),
      heart,
      provider: unavailableProvider(),
    });

    expect(result.englishProvider).toMatchObject({
      status: "UNAVAILABLE",
      failureReasonCodes: ["PROVIDER_CONFIGURATION_FAILURE"],
    });
    expect(result.discovery.candidates.filter(
      (candidate) => candidate.candidateLanguage === "English",
    )).toEqual([]);
    expect(result.discovery.candidates.some(
      (candidate) => candidate.sourceFact.sourceId === "reviewed.external.di.knowledge.candidate.v0_1",
    )).toBe(true);
    expect(JSON.stringify(result.discovery)).not.toContain("LEXICAL_SENSE_SOURCE_NOT_FOUND");
  });

  it("discards partial English results after a non-lexical provider failure", async () => {
    const word = "banana";
    const heart = buildHeartInstrumentV1(word);
    const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word,
      inputLanguage: "en",
      inputProfile: heart.spokenPronunciation.sourceProfileId,
      analysis: await analysisFor(word),
      heart,
      provider: partiallyFailingProvider(),
    });

    expect(result.englishProvider).toMatchObject({
      status: "UNAVAILABLE",
      failureReasonCodes: ["INDEX_ARTIFACT_FAILURE"],
    });
    expect(result.discovery.candidates.filter(
      (candidate) => candidate.candidateLanguage === "English",
    )).toEqual([]);
  });

  it("keeps the integrated discovery object compatible with the existing UI contract adapter", async () => {
    const word = "banana";
    const heart = buildHeartInstrumentV1(word);
    const discovery = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word,
      inputLanguage: "en",
      inputProfile: heart.spokenPronunciation.sourceProfileId,
      analysis: await analysisFor(word),
      heart,
      provider: await fixtureProvider(),
    });
    const routeLikePayload = {
      word,
      sanitized: word,
      engineVersion: "fixture",
      primaryPath: { voicePath: heart.canonicalSpokenVoicePath },
      candidates: [],
      motivationDiscoveryV0_1: discovery.discovery,
    };

    const vm = adaptAnalysisToTelemetryVM(routeLikePayload);
    expect(vm.readout.word).toBe(word);
    expect(vm.motivationDiscoveryV0_1?.kind).toBe("present");
    if (vm.motivationDiscoveryV0_1?.kind === "present") {
      expect(vm.motivationDiscoveryV0_1.value.candidates).toHaveLength(3);
      expect(vm.motivationDiscoveryV0_1.value.candidates[0]?.candidateLanguage).toBe("English");
    }
  });
});
