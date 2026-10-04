import { GET, POST } from "@/app/api/analyze-v1/route";

type JsonRecord = Record<string, any>;

const ENV_KEYS = [
  "OPEN_INSTRUMENT_AUTO_CARRIER",
  "OPENAI_BASE_URL",
  "OPENAI_MODEL",
  "OPENAI_API_KEY",
  "OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER",
  "OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT_TEST_PROVIDER",
] as const;

function snapshotEnv(): Record<string, string | undefined> {
  return Object.fromEntries(
    ENV_KEYS.map((key) => [key, process.env[key]]),
  );
}

function restoreEnv(snapshot: Record<string, string | undefined>): void {
  for (const key of ENV_KEYS) {
    const value = snapshot[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

async function get(params: Record<string, string>): Promise<{ status: number; json: JsonRecord }> {
  const url = new URL("http://localhost/api/analyze-v1");
  url.searchParams.set("word", "mathematics");
  url.searchParams.set("mode", "strict");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await GET(new Request(url));
  return { status: response.status, json: await response.json() };
}

async function post(body: unknown): Promise<{ status: number; json: JsonRecord }> {
  const response = await POST(
    new Request("http://localhost/api/analyze-v1", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
  return { status: response.status, json: await response.json() };
}

describe("/api/analyze-v1 explicit provider-free boundary v0.1", () => {
  const originalFetch = global.fetch;
  let originalEnv: Record<string, string | undefined>;

  beforeEach(() => {
    originalEnv = snapshotEnv();
  });

  afterEach(() => {
    restoreEnv(originalEnv);
    global.fetch = originalFetch;
  });

  it("suppresses every optional provider seam while preserving mathematics", async () => {
    process.env.OPEN_INSTRUMENT_AUTO_CARRIER = "1";
    process.env.OPENAI_BASE_URL = "http://127.0.0.1:11434/v1";
    process.env.OPENAI_MODEL = "fixture-model";
    process.env.OPENAI_API_KEY = "fixture-key";
    process.env.OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER = "openai_compat";
    process.env.OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT_TEST_PROVIDER = "openai_compat";

    const providerFetch = jest.fn(() => {
      throw new Error("provider must not be called in provider-free mode");
    });
    global.fetch = providerFetch as any;

    const result = await get({
      providerExecution: "disabled",
      targetSenseId: "mathematics-sense",
      targetSenseLabel: "a system of calculation",
    });

    expect(result.status).toBe(200);
    expect(providerFetch).not.toHaveBeenCalled();

    expect(result.json.heartInstrumentV1.spokenPronunciation.variants[0].variant.sourcePronunciation)
      .toBe("M AE2 TH AH0 M AE1 T IH0 K S");
    expect(result.json.heartInstrumentV1.canonicalSpokenVoicePath)
      .toEqual(["A", "Ë", "A", "I"]);
    expect(result.json.primaryPath.voicePath)
      .toEqual(["A", "Ë", "A", "I"]);

    const variant = result.json.heartInstrumentV1.spokenPronunciation.variants[0];
    expect(
      variant.normalizedSegments
        .filter((segment: any) => segment.kind === "consonant")
        .flatMap((segment: any) => segment.sourceUnits),
    ).toEqual(["M", "TH", "M", "T", "K", "S"]);
    expect(variant.zeroConsonantalStructuralComposition).toMatchObject({
      p: 1,
      i: [1, 1, 1],
      s: 2,
      d: [1, 1, 1, 1, 2],
      a: -1,
      r: [
        {
          identity: ["M"],
          occurrenceCount: 2,
        },
      ],
    });

    expect(result.json.automaticCarrierPronunciationV0_1).toMatchObject({
      attempted: false,
      status: "skipped_disabled",
      provider: null,
    });
    expect(result.json.automaticFunctionalProposalV0_1).toMatchObject({
      attempted: false,
      status: "skipped_disabled",
      provider: null,
    });
    expect(JSON.stringify(result.json)).not.toContain("provider must not be called");
  });

  it("keeps omitted providerExecution on the existing normal path", async () => {
    process.env.OPEN_INSTRUMENT_AUTO_CARRIER = "0";

    const result = await get({});

    expect(result.status).toBe(200);
    expect(result.json.heartInstrumentV1.canonicalSpokenVoicePath)
      .toEqual(["A", "Ë", "A", "I"]);
    expect(result.json.automaticCarrierPronunciationV0_1.status)
      .toBe("skipped_disabled");
  });

  it("rejects an invalid providerExecution value for GET and POST", async () => {
    const getResult = await get({ providerExecution: "sometimes" });
    const postResult = await post({
      word: "mathematics",
      providerExecution: "sometimes",
    });

    expect(getResult.status).toBe(400);
    expect(getResult.json.reason).toBe("INVALID_PROVIDER_EXECUTION");
    expect(postResult.status).toBe(400);
    expect(postResult.json.reason).toBe("INVALID_PROVIDER_EXECUTION");
  });
});
