import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import { GET } from "../app/api/analyze-v1/route";
import {
  buildMotivationEngineDiscoveryServerOnlyV0_1,
} from "@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1";
import {
  createAlbanianKaikkiServerOnlyUnavailableProviderV0_1,
} from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import {
  createAlbaNetSourceFamilyAdapterV0_1,
  ALBANET_SOURCE_PATH_ENV_V0_1,
  type AlbaNetSourceRecordV0_1,
} from "@/shared/openInstrument/albanetSourceFamilyAdapter.v0_1";
import type { GenericFunctionalWitnessSourceAdapterV1 } from "@/shared/openInstrument/genericFunctionalWitnessDiscovery.v1";
import {
  ENGLISH_KAIKKI_SERVER_ONLY_EXACT_INDEX_PROVIDER_ID_V0_1,
  type EnglishKaikkiServerOnlyExactIndexProviderV0_1,
} from "@/shared/openInstrument/englishKaikkiServerOnlyExactIndexProvider.v0_1";

async function analysisFor(word: string) {
  const payload = await runAnalysisDeterministic(word, {
    mode: "strict",
    alphabet: "auto",
  });
  return enginePayloadToAnalysisResult(payload);
}

function unavailableEnglishProvider(): EnglishKaikkiServerOnlyExactIndexProviderV0_1 {
  const result = {
    status: "PROVIDER_CONFIGURATION_FAILURE" as const,
    reasonCode: "PROVIDER_CONFIGURATION_FAILURE",
    queryForm: null,
    records: Object.freeze([]) as readonly [],
  };
  return {
    providerId: ENGLISH_KAIKKI_SERVER_ONLY_EXACT_INDEX_PROVIDER_ID_V0_1,
    runtimeBoundary: "SERVER_ONLY",
    query: async () => result,
    queryWithMetrics: async () => ({
      result,
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

describe("AlbaNet server-only Discovery integration v0.1", () => {
  it("adds AlbaNet as additive Albanian research evidence without functional authorization", async () => {
    const records: readonly AlbaNetSourceRecordV0_1[] = [{
      sourceRecordId: "albanet-omw-sq-v0.1:00000001-n:lemma=di",
      synsetId: "00000001-n",
      lemma: "di",
      definitions: ["knowledge"],
      examples: ["Ai di."],
      relationTypes: ["als:def", "als:exe", "als:lemma"],
      entryLocator: "wns/als/wn-data-als.tab#synset=00000001-n;lemma=di",
    }];
    const albanetSourceAdapter: GenericFunctionalWitnessSourceAdapterV1 =
      createAlbaNetSourceFamilyAdapterV0_1(records);
    const word = "study";
    const heart = buildHeartInstrumentV1(word);

    const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word,
      inputLanguage: "sq",
      inputProfile: "albanian",
      analysis: await analysisFor(word),
      heart,
      provider: unavailableEnglishProvider(),
      albanianLexicalSourceProvider: createAlbanianKaikkiServerOnlyUnavailableProviderV0_1("ALBANIAN_SOURCE_PATH_NOT_CONFIGURED"),
      albanetSourceAdapter,
    });

    const candidates = result.discovery.candidates.filter(
      (candidate) => candidate.sourceFact.sourceFamilyId === "albanet-omw-sq-v0.1",
    );
    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates[0]).toMatchObject({
      candidateForm: "di",
      candidateGloss: "knowledge",
      candidateVoicePath: [],
      sourceFact: {
        sourceFamilyId: "albanet-omw-sq-v0.1",
        sourceUrlOrArchiveRef: "https://github.com/omwn/omw-data",
        sourceDetails: {
          synsetId: "00000001-n",
          definitions: ["knowledge"],
          examples: ["Ai di."],
        },
      },
      functionalInterpretation: {
        status: "UNKNOWN_OR_NULL",
      },
      noSingleWinner: true,
      userDecisionPosture: "user_decides",
    });
  });

  it("reaches the analyze-v1 API as additive AlbaNet evidence for Albanian input", async () => {
    const previousPath = process.env[ALBANET_SOURCE_PATH_ENV_V0_1];
    process.env[ALBANET_SOURCE_PATH_ENV_V0_1] =
      "/Users/wei/OpenInstrumentResearch/multi-source-acquisition-v0-1-20261028/raw/omw-data/wns/als/wn-data-als.tab";
    try {
      const response = await GET(
        new Request("http://localhost/api/analyze-v1?word=study&mode=strict&alphabet=albanian&language=sq"),
      );
      expect(response.status).toBe(200);
      const body = await response.json() as {
        motivationDiscoveryV0_1?: {
          candidates?: readonly Readonly<{
            candidateForm: string;
            functionalInterpretation: Readonly<{ status: string }>;
            sourceFact: Readonly<{
              sourceFamilyId?: string;
              sourceDetails?: Readonly<{ synsetId: string }>;
            }>;
          }>[];
        };
      };
      const albaNetCandidate = body.motivationDiscoveryV0_1?.candidates?.find(
        (candidate) => candidate.sourceFact.sourceFamilyId === "albanet-omw-sq-v0.1",
      );
      expect(albaNetCandidate).toMatchObject({
        candidateForm: "di",
        functionalInterpretation: { status: "UNKNOWN_OR_NULL" },
        sourceFact: {
          sourceFamilyId: "albanet-omw-sq-v0.1",
          sourceDetails: { synsetId: expect.any(String) },
        },
      });
    } finally {
      if (previousPath === undefined) delete process.env[ALBANET_SOURCE_PATH_ENV_V0_1];
      else process.env[ALBANET_SOURCE_PATH_ENV_V0_1] = previousPath;
    }
  });
});
