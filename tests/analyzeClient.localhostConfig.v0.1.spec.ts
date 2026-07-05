import {
  analyzeClient,
  buildAnalyzeClientUrl,
  resolveAnalyzeClientBaseUrl,
} from "@/lib/analyzeClient";

describe("analyzeClient localhost config seam", () => {
  const realFetch = global.fetch;

  beforeEach(() => {
    delete process.env.OPEN_INSTRUMENT_ANALYZE_BASE_URL;
    global.fetch = jest.fn(async () => ({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({ payload: { ok: true } }),
      text: async () => "",
    })) as any;
  });

  afterEach(() => {
    delete process.env.OPEN_INSTRUMENT_ANALYZE_BASE_URL;
    global.fetch = realFetch;
    jest.clearAllMocks();
  });

  it("defaults to the explicit local loopback base url", () => {
    expect(resolveAnalyzeClientBaseUrl()).toBe("http://127.0.0.1:3000");
    expect(buildAnalyzeClientUrl({ word: "study", mode: "strict" })).toBe(
      "http://127.0.0.1:3000/api/analyze-v1?word=study&mode=strict"
    );
  });

  it("honors OPEN_INSTRUMENT_ANALYZE_BASE_URL and trims trailing slash", () => {
    process.env.OPEN_INSTRUMENT_ANALYZE_BASE_URL = "http://localhost:3001/";
    expect(resolveAnalyzeClientBaseUrl()).toBe("http://localhost:3001");
    expect(
      buildAnalyzeClientUrl({ word: "study", mode: "open", alphabet: "auto" })
    ).toBe(
      "http://localhost:3001/api/analyze-v1?word=study&mode=open&alphabet=auto"
    );
  });

  it("keeps the legacy positional call shape used by the dev script", async () => {
    await analyzeClient("study", "strict", "auto", { useAi: true });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/analyze-v1?word=study&mode=strict&alphabet=auto",
      { method: "GET" }
    );
  });
});
