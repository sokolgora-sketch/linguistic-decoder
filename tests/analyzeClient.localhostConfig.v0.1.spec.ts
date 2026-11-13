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
      json: async () => ({
        responseContractVersion: "open-instrument.analyze-word-result.v2",
        word: "study",
      }),
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
      "http://127.0.0.1:3000/api/analyze-v2?word=study&mode=strict"
    );
  });

  it("honors OPEN_INSTRUMENT_ANALYZE_BASE_URL and trims trailing slash", () => {
    process.env.OPEN_INSTRUMENT_ANALYZE_BASE_URL = "http://localhost:3001/";
    expect(resolveAnalyzeClientBaseUrl()).toBe("http://localhost:3001");
    expect(
      buildAnalyzeClientUrl({ word: "study", mode: "open", alphabet: "auto" })
    ).toBe(
      "http://localhost:3001/api/analyze-v2?word=study&mode=open&alphabet=auto"
    );
  });

  it("keeps the dev-script positional call shape on the neutral V2 route", async () => {
    const result = await analyzeClient("study", "strict", "auto", { useAi: true });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:3000/api/analyze-v2?word=study&mode=strict&alphabet=auto",
      { method: "GET" }
    );
    expect(result).toEqual({
      responseContractVersion: "open-instrument.analyze-word-result.v2",
      word: "study",
    });
  });
});
