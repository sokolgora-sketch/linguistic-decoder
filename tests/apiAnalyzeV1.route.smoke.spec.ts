jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      headers: new Headers(),
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
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { isInterpretationDecisionPolicyV0_1 } from "@/shared/openInstrument/interpretationDecisionPolicy.v0_1";

const LEGACY_SELECTION_KEYS = new Set([
  "analysisStatusV0_1",
  "functionalMotivationInterpretationV0_2",
  "motivationDiscoveryV0_1",
  "winnerClaim",
  "noSingleWinner",
  "candidateWinnerIndependent",
]);

function legacySelectionPaths(value: unknown, path: string[] = []): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => legacySelectionPaths(item, [...path, String(index)]));
  }
  if (value === null || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) => {
    const current = [...path, key];
    const keyIsLegacy = LEGACY_SELECTION_KEYS.has(key) ||
      ((key === "policy" || key === "mode") && child === "no_single_winner");
    return [
      ...(keyIsLegacy ? [current.join(".")] : []),
      ...legacySelectionPaths(child, current),
    ];
  });
}

function legacyInterpretationTextPaths(value: unknown, path: string[] = []): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => legacyInterpretationTextPaths(item, [...path, String(index)]));
  }
  if (typeof value === "string") {
    return /\b(?:winner|no_single_winner)\b/i.test(value) ? [path.join(".")] : [];
  }
  if (value === null || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) =>
    legacyInterpretationTextPaths(child, [...path, key]),
  );
}

function expectNeutralActiveResponse(payload: any) {
  expect(payload.responseContractVersion).toBe("open-instrument.analyze-word-result.v2");
  expect(legacySelectionPaths(payload)).toEqual([]);
  expect(legacyInterpretationTextPaths(payload)).toEqual([]);
  expect(isInterpretationDecisionPolicyV0_1(payload.interpretationDecisionPolicyV0_1)).toBe(true);
  expect(isInterpretationDecisionPolicyV0_1(payload.analysisStatusV0_2.interpretationDecisionPolicy)).toBe(true);
  if (payload.motivationDiscoveryV0_2) {
    expect(payload.motivationDiscoveryV0_2.schemaVersion).toBe("open-instrument.motivation-engine-discovery.v0_2");
    expect(isInterpretationDecisionPolicyV0_1(payload.motivationDiscoveryV0_2.interpretationDecisionPolicy)).toBe(true);
    expect(Array.isArray(payload.motivationDiscoveryV0_2.candidates)).toBe(true);
  }
  if (payload.functionalMotivationInterpretationV0_3) {
    expect(isInterpretationDecisionPolicyV0_1(
      payload.functionalMotivationInterpretationV0_3.interpretationDecisionPolicy,
    )).toBe(true);
    expect(Array.isArray(payload.functionalMotivationInterpretationV0_3.candidates)).toBe(true);
  }
}

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

    const req: any = {
      url: "http://localhost/api/analyze-v1",
      json: async () => ({ word: "study", mode: "strict" }),
    };

    const res: any = await mod.POST(req);
    expect(res.status).toBe(200);

    const json: any = await res.json();
    expect(json.word.toLowerCase()).toBe("study");
    expect(json).toHaveProperty("heart");
    expect(res.headers.get("X-Analyze-Response-Contract")).toBe("open-instrument.analyze-word-result.v2");
    expect(res.headers.get("Deprecation")).toBe("true");
    expect(json).toHaveProperty("candidates");
    expect(json.responseContractVersion).toBe("open-instrument.analyze-word-result.v2");
    expect(json).not.toHaveProperty("analysisStatusV0_1");
    expect(json).not.toHaveProperty("functionalMotivationInterpretationV0_2");
    expectNeutralActiveResponse(json);
    expect(res.headers.get("X-Analyze-Response-Contract")).toBe("open-instrument.analyze-word-result.v2");
    expect(res.headers.get("Deprecation")).toBe("true");
    expect(res.headers.get("Link")).toBe("</api/analyze-v2>; rel=\"successor-version\"");
  });

  test("the successor Analyze V2 endpoint is the active neutral response route", async () => {
    const mod = await import("../app/api/analyze-v2/route");
    const response: any = await mod.GET({
      url: "http://localhost/api/analyze-v2?word=study&mode=strict",
    } as any);
    const payload: any = await response.json();
    expect(response.status).toBe(200);
    expect(payload.responseContractVersion).toBe("open-instrument.analyze-word-result.v2");
    expect(payload.analysisStatusV0_2).toBeDefined();
    expect(payload).not.toHaveProperty("analysisStatusV0_1");
    expect(payload).not.toHaveProperty("functionalMotivationInterpretationV0_2");
    expectNeutralActiveResponse(payload);
    const vm = adaptAnalysisToTelemetryVM(payload);
    expect(vm).not.toHaveProperty("analysisStatusV0_1");
    expect(vm).not.toHaveProperty("motivationDiscoveryV0_1");
    expect(vm).not.toHaveProperty("functionalMotivationInterpretationV0_2");
    expect(vm.raw).toEqual(expect.not.objectContaining({ analysisStatusV0_1: expect.anything() }));
    expect(legacySelectionPaths(vm.raw)).toEqual([]);
    expect(vm.analysisStatusV0_2?.kind).toBe("present");
    expect(vm.motivationDiscoveryV0_2?.kind).toBe("present");
    expect(vm.functionalMotivationInterpretationV0_3?.kind).toBe("present");
    expect(response.headers.get("Deprecation")).toBeNull();
    expect(response.headers.get("Link")).toBeNull();
    expect(response.headers.get("X-Analyze-Response-Contract")).toBe("open-instrument.analyze-word-result.v2");
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
      expect(firstBody).toHaveProperty("motivationDiscoveryV0_2");
      expect(firstBody).not.toHaveProperty("englishProvider");
      expect(firstBody.motivationDiscoveryV0_2.exactLexicalSourceStatus).toMatchObject({
        status: "NOT_QUERIED",
        reasonCode: "NOT_ALBANIAN_INPUT",
      });
      expect(firstBody.motivationDiscoveryV0_2.candidates.filter(
        (candidate: { candidateLanguage: string }) => candidate.candidateLanguage === "English",
      )).toEqual([]);
      expect(secondBody.motivationDiscoveryV0_2).toEqual(
        firstBody.motivationDiscoveryV0_2,
      );
      expect(secondBody.functionalMotivationInterpretationV0_3).toEqual(
        firstBody.functionalMotivationInterpretationV0_3,
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
