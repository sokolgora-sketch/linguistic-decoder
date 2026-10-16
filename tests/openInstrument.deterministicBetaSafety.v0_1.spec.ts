import { GET as analyzeGet, POST as analyzePost } from "@/app/api/analyze-v1/route";
import { GET as legacyAnalyzeGet } from "@/app/api/analyze/route";
import { POST as generateRootsPost } from "@/app/api/generate-roots/route";
import { POST as proposeLoopPost } from "@/app/api/propose-loop/route";
import { POST as oraclePost } from "@/app/api/propose-with-engine-oracle/route";
import {
  runProposerV0_2,
} from "@/shared/llm/providers/proposerProvider.v0.2";
import {
  GET_REQUEST_TARGET_MAX_UTF8_BYTES_V0_1,
  POST_BODY_MAX_UTF8_BYTES_V0_1,
  requestTargetUtf8ByteLengthV0_1,
  validateAnalyzeInputSizesV0_1,
  WORD_MAX_CODEPOINTS_V0_1,
} from "@/shared/openInstrument/publicBetaSafety.v0_1";

let mockDiscoveryProviderMode: "available" | "unavailable" = "available";
let mockLastEnglishProviderStatus:
  | {
      status: "AVAILABLE" | "UNAVAILABLE" | "NOT_QUERIED";
      failureReasonCodes: readonly string[];
    }
  | undefined;

jest.mock("@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1", () => {
  const actual = jest.requireActual(
    "@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1",
  );
  const providerModule = jest.requireActual(
    "@/shared/openInstrument/englishKaikkiServerOnlyExactIndexProvider.v0_1",
  );
  const adapterModule = jest.requireActual(
    "@/shared/openInstrument/englishKaikkiSourceFamilyAdapter.v0_1",
  );
  const { resolve, join } = require("node:path") as typeof import("node:path");
  const fixtureRoot = resolve(
    "tests/fixtures/openInstrument/englishKaikkiDeterministicIndexProvider.v0_1",
  );
  const providerPromise = providerModule
    .createEnglishKaikkiServerOnlyExactIndexProviderForSyntheticFixtureV0_1({
      fixtureRoot,
      sourcePath: join(fixtureRoot, "source.jsonl"),
      indexPath: fixtureRoot,
      adaptRecord: (input: Parameters<typeof adapterModule.adaptEnglishKaikkiJsonlRecordV0_1>[0]) =>
        adapterModule.adaptEnglishKaikkiJsonlRecordV0_1({
          ...input,
          verifiedSnapshot: adapterModule.ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
        }),
    });

  const unavailableQuery = async (query: unknown) => ({
    status: "PROVIDER_CONFIGURATION_FAILURE" as const,
    reasonCode: "PROVIDER_CONFIGURATION_FAILURE",
    queryForm: typeof query === "string" ? query : null,
    records: Object.freeze([]) as readonly [],
  });
  const unavailableProvider = {
    providerId: "open-instrument.english-kaikki-server-only-exact-index-provider.v0.1",
    runtimeBoundary: "SERVER_ONLY" as const,
    query: unavailableQuery,
    queryWithMetrics: async (query: unknown) => ({
      result: await unavailableQuery(query),
      metrics: {
        directoryBytesRead: 0,
        postingsBytesRead: 0,
        sourceBytesRead: 0,
        sourceRecordsRecovered: 0,
        adapterRecordsEmitted: 0,
      },
    }),
  };

  return {
    ...actual,
    buildMotivationEngineDiscoveryServerOnlyV0_1: jest.fn(async (input: any) => {
      const result = await actual.buildMotivationEngineDiscoveryServerOnlyV0_1({
        ...input,
        provider: mockDiscoveryProviderMode === "unavailable"
          ? unavailableProvider
          : await providerPromise,
      });
      mockLastEnglishProviderStatus = result.englishProvider;
      return result;
    }),
  };
});

type JsonRecord = Record<string, any>;

const ENV_KEYS = [
  "OPEN_INSTRUMENT_PUBLIC_BETA_MODE",
  "OPEN_INSTRUMENT_AUTO_CARRIER",
  "OPEN_INSTRUMENT_AUTO_PROPOSER",
  "OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT",
  "OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT",
  "OPENAI_BASE_URL",
  "OPENAI_MODEL",
  "OPENAI_API_KEY",
  "OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER",
  "OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT_TEST_PROVIDER",
] as const;

function snapshotEnv(): Record<string, string | undefined> {
  return Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
}

function restoreEnv(snapshot: Record<string, string | undefined>): void {
  for (const key of ENV_KEYS) {
    const value = snapshot[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

async function jsonResponse(response: Response): Promise<{ status: number; json: JsonRecord }> {
  return { status: response.status, json: await response.json() as JsonRecord };
}

function requestWithTargetBytes(targetBytes: number): Request {
  let extra = "";
  const prefix = "http://localhost/api/analyze-v1?word=stone&x=";
  while (requestTargetUtf8ByteLengthV0_1(`${prefix}${extra}`) < targetBytes) extra += "x";
  if (requestTargetUtf8ByteLengthV0_1(`${prefix}${extra}`) !== targetBytes) {
    throw new Error(`unable to construct ${targetBytes}-byte request target`);
  }
  return new Request(`${prefix}${extra}`);
}

function bodyTextWithBytes(targetBytes: number): string {
  let padding = "";
  while (new TextEncoder().encode(JSON.stringify({ word: "stone", padding })).byteLength < targetBytes) {
    padding += "x";
  }
  const body = JSON.stringify({ word: "stone", padding });
  if (new TextEncoder().encode(body).byteLength !== targetBytes) {
    throw new Error(`unable to construct ${targetBytes}-byte request body`);
  }
  return body;
}

function betaRequestBody(
  body: unknown,
  extraHeaders: Record<string, string> = {},
): Request {
  return new Request("http://localhost/api/analyze-v1", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });
}

describe("Open Instrument deterministic-only public beta boundary v0.1", () => {
  const originalFetch = global.fetch;
  let originalEnv: Record<string, string | undefined>;

  beforeEach(() => {
    originalEnv = snapshotEnv();
    mockDiscoveryProviderMode = "available";
    mockLastEnglishProviderStatus = undefined;
    delete process.env.OPEN_INSTRUMENT_PUBLIC_BETA_MODE;
    delete process.env.OPEN_INSTRUMENT_AUTO_CARRIER;
    delete process.env.OPEN_INSTRUMENT_AUTO_PROPOSER;
    delete process.env.OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT;
    delete process.env.OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT;
    delete process.env.OPENAI_BASE_URL;
    delete process.env.OPENAI_MODEL;
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER;
    delete process.env.OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT_TEST_PROVIDER;
  });

  afterEach(() => {
    restoreEnv(originalEnv);
    global.fetch = originalFetch;
  });

  it("keeps the real-provider positive control available when beta mode is unset", async () => {
    process.env.OPENAI_BASE_URL = "http://127.0.0.1:11434/v1";
    process.env.OPENAI_MODEL = "fixture-model";
    process.env.OPENAI_API_KEY = "fixture-key";
    const fetchMock = jest.fn(async () => new Response(
      JSON.stringify({ choices: [{ message: { content: "{}" } }] }),
      { status: 200, headers: { "content-type": "application/json" } },
    ));
    global.fetch = fetchMock as any;

    await runProposerV0_2(
      { word: "stone", mode: "strict", systemPrompt: "JSON only." },
      "openai_compat",
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("blocks the real-provider boundary before fetch when beta mode is enabled", async () => {
    process.env.OPEN_INSTRUMENT_PUBLIC_BETA_MODE = "deterministic_only";
    process.env.OPENAI_BASE_URL = "http://127.0.0.1:11434/v1";
    process.env.OPENAI_MODEL = "fixture-model";
    process.env.OPENAI_API_KEY = "fixture-key";
    const fetchMock = jest.fn();
    global.fetch = fetchMock as any;

    await expect(runProposerV0_2(
      { word: "stone", mode: "strict", systemPrompt: "JSON only." },
      "openai_compat",
    )).rejects.toThrow("MODEL_EXECUTION_DISABLED_IN_PUBLIC_BETA");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails closed for invalid or empty beta configuration", async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as any;

    for (const invalidMode of ["", "permissive"]) {
      process.env.OPEN_INSTRUMENT_PUBLIC_BETA_MODE = invalidMode;
      const analyze = await jsonResponse(await analyzeGet(new Request(
        "http://localhost/api/analyze-v1?word=stone",
      )));
      const providerRoute = await jsonResponse(await generateRootsPost(
        new Request("http://localhost/api/generate-roots", {
          method: "POST",
          body: JSON.stringify({ word: "stone" }),
        }),
      ));

      expect(analyze.status).toBe(503);
      expect(analyze.json.reason).toBe("INVALID_PUBLIC_BETA_MODE");
      expect(providerRoute.status).toBe(503);
      expect(providerRoute.json.reason).toBe("INVALID_PUBLIC_BETA_MODE");
    }

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("enforces deterministic beta policy for real POST requests despite client overrides", async () => {
    process.env.OPEN_INSTRUMENT_PUBLIC_BETA_MODE = "deterministic_only";
    process.env.OPEN_INSTRUMENT_AUTO_CARRIER = "1";
    process.env.OPEN_INSTRUMENT_AUTO_PROPOSER = "1";
    process.env.OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT = "1";
    process.env.OPENAI_BASE_URL = "http://127.0.0.1:11434/v1";
    process.env.OPENAI_MODEL = "fixture-model";
    process.env.OPENAI_API_KEY = "fixture-key";
    process.env.OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER = "openai_compat";
    process.env.OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT_TEST_PROVIDER = "openai_compat";
    const fetchMock = jest.fn(() => {
      throw new Error("external model must not be called in deterministic beta mode");
    });
    global.fetch = fetchMock as any;

    const requests: readonly [string, unknown, Record<string, string>?][] = [
      ["omitted", { word: "stone" }],
      ["automatic", { word: "stone", providerExecution: "automatic" }],
      ["disabled", { word: "stone", providerExecution: "disabled" }],
      [
        "conflicting client controls",
        {
          word: "stone",
          providerExecution: "automatic",
          opts: { providerExecution: "automatic", publicBetaMode: "unset" },
        },
        {
          "x-open-instrument-public-beta-mode": "unset",
          "x-provider-execution": "automatic",
        },
      ],
    ];

    for (const [, body, headers] of requests) {
      const response = await jsonResponse(await analyzePost(betaRequestBody(body, headers)));
      expect(response.status).toBe(200);
      expect(response.json.automaticCarrierPronunciationV0_1.status).toBe("skipped_disabled");
      expect(response.json.automaticFunctionalProposalV0_1.status).toBe("skipped_disabled");
    }

    const manualIpa = await jsonResponse(await analyzePost(betaRequestBody({
      word: "rhythm",
      ipa: "ˈrɪðəm",
      providerExecution: "automatic",
    }, {
      "x-provider-execution": "automatic",
    })));
    expect(manualIpa.status).toBe(200);
    expect(manualIpa.json.automaticCarrierPronunciationV0_1.status).toBe("manual_ipa");

    const nullCase = await jsonResponse(await analyzePost(betaRequestBody({
      word: "xyz",
      providerExecution: "automatic",
    })));
    expect(nullCase.status).toBe(200);
    expect(nullCase.json.analysisStatusV0_1.status).toBe("null_no_supported_candidate");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("preserves deterministic Discovery and fails closed when the local Kaikki provider is unavailable", async () => {
    process.env.OPEN_INSTRUMENT_PUBLIC_BETA_MODE = "deterministic_only";
    process.env.OPEN_INSTRUMENT_AUTO_PROPOSER = "1";
    process.env.OPENAI_BASE_URL = "http://127.0.0.1:11434/v1";
    process.env.OPENAI_MODEL = "fixture-model";
    process.env.OPENAI_API_KEY = "fixture-key";
    mockDiscoveryProviderMode = "unavailable";
    const fetchMock = jest.fn(() => {
      throw new Error("external model or network fallback must not be called");
    });
    global.fetch = fetchMock as any;

    const internalErrorSpy = jest.spyOn(console, "error").mockImplementation();
    try {
      const response = await jsonResponse(await analyzeGet(new Request(
        "http://localhost/api/analyze-v1?word=study&providerExecution=automatic",
      )));

      expect(response.status).toBe(200);
      expect(mockLastEnglishProviderStatus).toMatchObject({
        status: "UNAVAILABLE",
        failureReasonCodes: ["PROVIDER_CONFIGURATION_FAILURE"],
      });
      expect(response.json.motivationDiscoveryV0_1.candidates.filter(
        (candidate: any) => candidate.candidateLanguage === "English",
      )).toEqual([]);
      expect(response.json.motivationDiscoveryV0_1.candidates.some(
        (candidate: any) => candidate.sourceFact.sourceId === "reviewed.external.di.knowledge.candidate.v0_1",
      )).toBe(true);
      expect(JSON.stringify(response.json.motivationDiscoveryV0_1)).not.toContain(
        "LEXICAL_SENSE_SOURCE_NOT_FOUND",
      );
      expect(fetchMock).not.toHaveBeenCalled();
    } finally {
      internalErrorSpy.mockRestore();
    }
  });

  it("keeps analyze and its legacy shim deterministic and preserves fixture-backed local Kaikki lookup", async () => {
    process.env.OPEN_INSTRUMENT_PUBLIC_BETA_MODE = "deterministic_only";
    process.env.OPEN_INSTRUMENT_AUTO_CARRIER = "1";
    process.env.OPEN_INSTRUMENT_AUTO_PROPOSER = "1";
    process.env.OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT = "1";
    process.env.OPENAI_BASE_URL = "http://127.0.0.1:11434/v1";
    process.env.OPENAI_MODEL = "fixture-model";
    process.env.OPENAI_API_KEY = "fixture-key";
    process.env.OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER = "openai_compat";
    process.env.OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT_TEST_PROVIDER = "openai_compat";
    const fetchMock = jest.fn(() => {
      throw new Error("external model must not be called in deterministic beta mode");
    });
    global.fetch = fetchMock as any;

    const stone = await jsonResponse(await analyzeGet(new Request(
      "http://localhost/api/analyze-v1?word=stone&providerExecution=automatic",
    )));
    const shim = await jsonResponse(await legacyAnalyzeGet(new Request(
      "http://localhost/api/analyze?word=stone&providerExecution=automatic",
    )));
    const banana = await jsonResponse(await analyzeGet(new Request(
      "http://localhost/api/analyze-v1?word=banana&providerExecution=automatic",
    )));
    const candle = await jsonResponse(await analyzeGet(new Request(
      "http://localhost/api/analyze-v1?word=candle&providerExecution=automatic",
    )));
    const nullCase = await jsonResponse(await analyzeGet(new Request(
      "http://localhost/api/analyze-v1?word=xyz&providerExecution=automatic",
    )));
    const manualIpa = await jsonResponse(await analyzeGet(new Request(
      "http://localhost/api/analyze-v1?word=rhythm&ipa=%CB%88r%C9%AA%C3%B0%C9%99m",
    )));

    expect(stone.status).toBe(200);
    expect(shim.status).toBe(200);
    expect(stone.json.automaticCarrierPronunciationV0_1.status).toBe("skipped_disabled");
    expect(stone.json.automaticFunctionalProposalV0_1.status).toBe("skipped_disabled");
    expect(shim.json.automaticCarrierPronunciationV0_1.status).toBe("skipped_disabled");
    expect(manualIpa.status).toBe(200);
    expect(manualIpa.json.automaticCarrierPronunciationV0_1.status).toBe("manual_ipa");
    expect(banana.status).toBe(200);
    expect(banana.json.motivationDiscoveryV0_1.candidates.some((candidate: any) =>
      candidate.candidateLanguage === "English",
    )).toBe(true);
    expect(candle.status).toBe(200);
    expect(candle.json.word).toBe("candle");
    expect(nullCase.status).toBe(200);
    expect(nullCase.json.analysisStatusV0_1.status).toBe("null_no_supported_candidate");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects every public provider-only route before orchestration in beta mode", async () => {
    process.env.OPEN_INSTRUMENT_PUBLIC_BETA_MODE = "deterministic_only";
    const request = () => new Request("http://localhost/api/provider", {
      method: "POST",
      body: JSON.stringify({ word: "stone", provider: "openai_compat" }),
    });

    const responses = await Promise.all([
      generateRootsPost(request()),
      proposeLoopPost(request()),
      oraclePost(request()),
    ]);
    for (const response of responses) {
      const result = await jsonResponse(response);
      expect(result.status).toBe(503);
      expect(result.json.reason).toBe("MODEL_EXECUTION_DISABLED_IN_PUBLIC_BETA");
    }
  });

  it("enforces code-point, UTF-8 target, and streaming body bounds", async () => {
    expect(validateAnalyzeInputSizesV0_1({
      word: "😀".repeat(WORD_MAX_CODEPOINTS_V0_1),
      ipa: "i".repeat(200),
      targetSenseLabel: "s".repeat(200),
      targetSenseId: "i".repeat(200),
      language: "e".repeat(50),
    })).toEqual({ ok: true });
    expect(validateAnalyzeInputSizesV0_1({ word: "a".repeat(101) })).toEqual({
      ok: false,
      reason: "WORD_TOO_LONG",
    });

    const exactTarget = requestWithTargetBytes(GET_REQUEST_TARGET_MAX_UTF8_BYTES_V0_1);
    const oversizedTarget = new Request(`${exactTarget.url}x`);
    const exactTargetResponse = await jsonResponse(await analyzeGet(exactTarget));
    const oversizedTargetResponse = await jsonResponse(await analyzeGet(oversizedTarget));
    expect(exactTargetResponse.status).toBe(200);
    expect(oversizedTargetResponse.status).toBe(413);
    expect(oversizedTargetResponse.json.reason).toBe("REQUEST_TOO_LARGE");

    const exactBodyResponse = await jsonResponse(await analyzePost(new Request(
      "http://localhost/api/analyze-v1",
      { method: "POST", body: bodyTextWithBytes(POST_BODY_MAX_UTF8_BYTES_V0_1) },
    )));
    const oversizedBodyResponse = await jsonResponse(await analyzePost(new Request(
      "http://localhost/api/analyze-v1",
      { method: "POST", body: `${bodyTextWithBytes(POST_BODY_MAX_UTF8_BYTES_V0_1)}x` },
    )));
    expect(exactBodyResponse.status).toBe(200);
    expect(oversizedBodyResponse.status).toBe(413);
    expect(oversizedBodyResponse.json.reason).toBe("REQUEST_TOO_LARGE");

    const wordTooLong = await jsonResponse(await analyzePost(betaRequestBody({
      word: "a".repeat(101),
    })));
    expect(wordTooLong.status).toBe(413);
    expect(wordTooLong.json.reason).toBe("WORD_TOO_LONG");
  });
});
