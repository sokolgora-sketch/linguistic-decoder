import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

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
  parseAlbaNetTabV0_1,
  type AlbaNetSourceRecordV0_1,
  type AlbaNetSourceLoadResultV0_1,
} from "@/shared/openInstrument/albanetSourceFamilyAdapter.v0_1";
import type { GenericFunctionalWitnessSourceAdapterV1 } from "@/shared/openInstrument/genericFunctionalWitnessDiscovery.v1";
import {
  ENGLISH_KAIKKI_SERVER_ONLY_EXACT_INDEX_PROVIDER_ID_V0_1,
  type EnglishKaikkiServerOnlyExactIndexProviderV0_1,
} from "@/shared/openInstrument/englishKaikkiServerOnlyExactIndexProvider.v0_1";

const mockAlbaNetFixtureTabV0_1 = [
  "# Albanet\tals\thttp://fjalnet.com/\tCC BY 3.0",
  "00000001-n\tals:lemma\tdi",
  "00000001-n\tals:def\t0\tknowledge",
  "00000001-n\tals:exe\t0\tAi di.",
].join("\n");

let mockAlbaNetSourceLoadResultV0_1: AlbaNetSourceLoadResultV0_1 | null = null;

jest.mock("@/shared/openInstrument/albanetSourceFamilyAdapter.v0_1", () => {
  const actual = jest.requireActual(
    "@/shared/openInstrument/albanetSourceFamilyAdapter.v0_1",
  );

  return {
    ...actual,
    getProductionAlbaNetSourceV0_1: jest.fn(async () => {
      const configuredPath = process.env[actual.ALBANET_SOURCE_PATH_ENV_V0_1];
      if (
        mockAlbaNetSourceLoadResultV0_1 === null ||
        configuredPath !== mockAlbaNetSourceLoadResultV0_1.sourcePath
      ) {
        throw new Error("ALBANET_TEST_FIXTURE_NOT_CONFIGURED");
      }
      return mockAlbaNetSourceLoadResultV0_1;
    }),
  };
});

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
    const directory = await mkdtemp(join(tmpdir(), "open-instrument-albanet-api-"));
    const fixturePath = join(directory, "wn-data-als.tab");
    const fixtureBytes = Buffer.from(mockAlbaNetFixtureTabV0_1, "utf8");
    const fixtureSha256 = createHash("sha256").update(fixtureBytes).digest("hex");
    await writeFile(fixturePath, fixtureBytes);

    const previousPath = process.env[ALBANET_SOURCE_PATH_ENV_V0_1];
    process.env[ALBANET_SOURCE_PATH_ENV_V0_1] = fixturePath;
    try {
      const parsed = parseAlbaNetTabV0_1(await readFile(fixturePath, "utf8"));
      expect(parsed.ok).toBe(true);
      if (!parsed.ok) return;

      expect(fixtureBytes.byteLength).toBe(Buffer.byteLength(mockAlbaNetFixtureTabV0_1, "utf8"));
      expect(fixtureSha256).toMatch(/^[a-f0-9]{64}$/u);
      mockAlbaNetSourceLoadResultV0_1 = {
        status: "READY",
        sourcePath: fixturePath,
        records: parsed.records,
        adapter: createAlbaNetSourceFamilyAdapterV0_1(parsed.records),
      };

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
      mockAlbaNetSourceLoadResultV0_1 = null;
      if (previousPath === undefined) delete process.env[ALBANET_SOURCE_PATH_ENV_V0_1];
      else process.env[ALBANET_SOURCE_PATH_ENV_V0_1] = previousPath;
      await rm(directory, { recursive: true, force: true });
    }
  });
});
