jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

const mockRunAnalysisDeterministic = jest.fn();
const mockEnginePayloadToAnalysisResult = jest.fn();
const mockAdaptAnalyzeV1ToUI = jest.fn();

jest.mock("@/lib/runAnalysisDeterministic", () => ({
  runAnalysisDeterministic: (...args: unknown[]) =>
    mockRunAnalysisDeterministic(...args),
}));

jest.mock("@/shared/analysisAdapter", () => ({
  enginePayloadToAnalysisResult: (...args: unknown[]) =>
    mockEnginePayloadToAnalysisResult(...args),
}));

jest.mock("@/shared/analyzeV1Adapter", () => ({
  adaptAnalyzeV1ToUI: (...args: unknown[]) => mockAdaptAnalyzeV1ToUI(...args),
}));

import { GET, POST } from "../app/api/analyze-v1/route";
import { GET as legacyGET } from "../app/api/analyze/route";

const originalNodeEnv = process.env.NODE_ENV;

function getRequest(): Request {
  return {
    url: "http://localhost/api/analyze-v1?word=study&mode=strict",
  } as Request;
}

function postRequest(): Request {
  return {
    url: "http://localhost/api/analyze-v1",
    json: async () => ({ word: "study", mode: "strict" }),
  } as Request;
}

async function responseBody(response: { json: () => Promise<unknown> }) {
  return response.json();
}

beforeEach(() => {
  mockRunAnalysisDeterministic.mockReset();
  mockEnginePayloadToAnalysisResult.mockReset();
  mockAdaptAnalyzeV1ToUI.mockReset();
  process.env.NODE_ENV = "test";
});

afterAll(() => {
  if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = originalNodeEnv;
});

describe("Analyze V1 internal 500 diagnostics", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("returns a generic production body for contract failures and logs diagnostics", async () => {
    process.env.NODE_ENV = "production";
    mockRunAnalysisDeterministic.mockResolvedValue({ engineVersion: "test" });
    mockEnginePayloadToAnalysisResult.mockReturnValue({});
    mockAdaptAnalyzeV1ToUI.mockReturnValue({});

    const response = await GET(getRequest());
    const body = await responseBody(response);

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: "Internal server error" });
    expect(body).not.toHaveProperty("message");
    expect(body).not.toHaveProperty("issues");
    expect(body).not.toHaveProperty("outPreview");
    expect(body).not.toHaveProperty("details");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[analyze-v1] internal failure",
      expect.objectContaining({
        kind: "contract",
        message: "enginePayloadToAnalysisResult produced an off-contract V1 payload",
        issues: expect.any(String),
        outPreview: "{}",
      }),
    );
  });

  it("retains the existing contract diagnostics outside production", async () => {
    mockRunAnalysisDeterministic.mockResolvedValue({ engineVersion: "test" });
    mockEnginePayloadToAnalysisResult.mockReturnValue({});
    mockAdaptAnalyzeV1ToUI.mockReturnValue({});

    const response = await GET(getRequest());
    const body = await responseBody(response);

    expect(response.status).toBe(500);
    expect(body).toEqual(
      expect.objectContaining({
        error: "analyze-v1 contract failure",
        message: "enginePayloadToAnalysisResult produced an off-contract V1 payload",
        issues: expect.any(Array),
        outPreview: "{}",
      }),
    );
  });

  it("returns the same generic production body for GET and POST outer exceptions", async () => {
    process.env.NODE_ENV = "production";
    const thrown = new Error("internal failure /private/server/module.ts:42");
    mockRunAnalysisDeterministic.mockRejectedValue(thrown);

    const getResponse = await GET(getRequest());
    const postResponse = await POST(postRequest());

    expect(getResponse.status).toBe(500);
    expect(postResponse.status).toBe(500);
    expect(await responseBody(getResponse)).toEqual({
      error: "Internal server error",
    });
    expect(await responseBody(postResponse)).toEqual({
      error: "Internal server error",
    });
    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    for (const call of consoleErrorSpy.mock.calls) {
      expect(call[0]).toBe("[analyze-v1] internal failure");
      expect(call[1]).toEqual(
        expect.objectContaining({
          kind: "orchestration",
          details: expect.stringContaining("internal failure /private/server/module.ts:42"),
        }),
      );
    }
  });

  it("retains the existing outer exception details outside production", async () => {
    mockRunAnalysisDeterministic.mockRejectedValue(new Error("development failure"));

    const response = await GET(getRequest());
    const body = await responseBody(response);

    expect(response.status).toBe(500);
    expect(body).toEqual({
      error: "analyze-v1 failed",
      details: expect.stringContaining("development failure"),
    });
  });

  it("propagates the production generic body through the legacy re-export", async () => {
    process.env.NODE_ENV = "production";
    mockRunAnalysisDeterministic.mockRejectedValue(new Error("legacy failure"));

    const response = await legacyGET(getRequest());

    expect(response.status).toBe(500);
    expect(await responseBody(response)).toEqual({
      error: "Internal server error",
    });
  });
});
