jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

jest.mock("@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1", () => {
  const actual = jest.requireActual(
    "@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1",
  );
  return {
    ...actual,
    buildMotivationEngineDiscoveryServerOnlyV0_1: jest.fn(
      actual.buildMotivationEngineDiscoveryServerOnlyV0_1,
    ),
  };
});

import {
  buildMotivationEngineDiscoveryServerOnlyV0_1,
  type EnglishKaikkiServerOnlyExactIndexProviderV0_1,
} from "@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1";

const buildDiscoveryMock = jest.mocked(
  buildMotivationEngineDiscoveryServerOnlyV0_1,
);
const buildDiscoveryActual = jest.requireActual(
  "@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1",
).buildMotivationEngineDiscoveryServerOnlyV0_1 as typeof buildMotivationEngineDiscoveryServerOnlyV0_1;

function unavailableEnglishProvider(): EnglishKaikkiServerOnlyExactIndexProviderV0_1 {
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

describe("/api/analyze-v1 (adapter) — smoke", () => {
  test("POST returns adapter output", async () => {
    const mod = await import("../app/api/analyze-v1/route");

    const req: any = { json: async () => ({ word: "study", mode: "strict" }) };

    const res: any = await mod.POST(req);
    expect(res.status).toBe(200);

    const json: any = await res.json();
    expect(json.word.toLowerCase()).toBe("study");
    expect(json).toHaveProperty("heart");
    expect(json).toHaveProperty("candidates");
  });

  test("GET returns adapter output", async () => {
    const mod = await import("../app/api/analyze-v1/route");

    const req: any = { url: "http://localhost/api/analyze-v1?word=study&mode=strict" };

    const res: any = await mod.GET(req);
    expect(res.status).toBe(200);

    const json: any = await res.json();
    expect(json.word.toLowerCase()).toBe("study");
    expect(json).toHaveProperty("heart");
  });

  test("optional English source unavailability warns and preserves deterministic fallback", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    buildDiscoveryMock.mockClear();
    buildDiscoveryMock.mockImplementation((input) =>
      buildDiscoveryActual({
        ...input,
        provider: unavailableEnglishProvider(),
      }),
    );

    try {
      const mod = await import("../app/api/analyze-v1/route");
      const request = {
        url: "http://localhost/api/analyze-v1?word=study&mode=strict&alphabet=latin&language=en&providerExecution=automatic",
      } as Request;

      const firstResponse = await mod.GET(request);
      const firstBody: any = await firstResponse.json();
      const secondResponse = await mod.GET(request);
      const secondBody: any = await secondResponse.json();

      expect(firstResponse.status).toBe(200);
      expect(secondResponse.status).toBe(200);
      expect(firstBody).toHaveProperty("motivationDiscoveryV0_1");
      expect(firstBody).not.toHaveProperty("englishProvider");
      expect(firstBody.motivationDiscoveryV0_1.exactLexicalSourceStatus).toMatchObject({
        status: "NOT_QUERIED",
        reasonCode: "NOT_ALBANIAN_INPUT",
      });
      expect(firstBody.motivationDiscoveryV0_1.candidates.filter(
        (candidate: { candidateLanguage: string }) => candidate.candidateLanguage === "English",
      )).toEqual([]);
      expect(secondBody.motivationDiscoveryV0_1).toEqual(
        firstBody.motivationDiscoveryV0_1,
      );
      expect(secondBody.functionalMotivationInterpretationV0_2).toEqual(
        firstBody.functionalMotivationInterpretationV0_2,
      );
      expect(buildDiscoveryMock).toHaveBeenCalledTimes(2);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "[analyze-v1] optional English Kaikki Discovery source unavailable",
        expect.objectContaining({
          status: "UNAVAILABLE",
          failureReasonCodes: ["PROVIDER_CONFIGURATION_FAILURE"],
        }),
      );
      expect(consoleErrorSpy.mock.calls.filter(
        ([message]) => message === "[analyze-v1] internal failure",
      )).toEqual([]);
    } finally {
      buildDiscoveryMock.mockImplementation(buildDiscoveryActual);
      consoleErrorSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    }
  });
});
