require("./helpers/whatwgGlobals.cjs");

describe("/api/analyze-v1 evidence wiring (unit)", () => {
  it("returns engine evidence at root and mirrors it into raw.evidence", async () => {
    // IMPORTANT: require AFTER globals shim so next/server sees Request/Response
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { GET } = require("../app/api/analyze-v1/route");

    const res = await GET({
      url: "http://localhost:3000/api/analyze-v1?word=study&mode=strict",
    } as any);

    expect(res).toBeTruthy();
    expect(res.status).toBe(200);

    const json: any = await res.json();

    expect(json.evidence).toBeTruthy();
    expect(typeof json.evidence.basis).toBe("string");
    expect(Array.isArray(json.evidence.surfaceVowels)).toBe(true);
    expect(json.evidence.math7).toBeTruthy();

    expect(json.raw?.evidence).toBeTruthy();
    expect(json.raw.evidence).toEqual(json.evidence);

    expect(json.evidence.signals || []).not.toContain("EVIDENCE_MISSING_FALLBACK");
  });
});
