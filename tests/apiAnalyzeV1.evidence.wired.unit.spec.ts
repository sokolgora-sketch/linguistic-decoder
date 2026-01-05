require("./helpers/whatwgGlobals.cjs");

describe("/api/analyze-v1 evidence wiring (unit)", () => {
  it("returns engine evidence at root and mirrors it into raw.evidence", async () => {
    const { GET } = require("../app/api/analyze-v1/route");

    const res = await GET({
      url: "http://localhost:3000/api/analyze-v1?word=study&mode=strict",
    } as any);

    expect(res).toBeTruthy();
    expect(res.status).toBe(200);

    const json: any = await res.json();

    // Evidence exists at root
    expect(json.evidence).toBeTruthy();

    // Core fields must exist
    expect(typeof json.evidence.basis).toBe("string");

    // math7 must be wired (this catches regressions)
    expect(json.evidence.math7).toBeTruthy();
    expect(json.evidence.math7).toEqual(json.heart.math7);
    expect(Array.isArray(json.evidence.surfaceVowels)).toBe(true);

        // Must not be fallback
    const signals = json.evidence?.signals || [];
    expect(signals).not.toContain("EVIDENCE_MISSING_FALLBACK");

    // Must mirror into raw.evidence
    expect(json.raw).toBeTruthy();
    expect(json.raw.evidence).toEqual(json.evidence);
  });
});
