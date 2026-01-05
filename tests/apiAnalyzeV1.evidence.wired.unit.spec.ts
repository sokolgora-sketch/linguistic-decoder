import { GET } from "../app/api/analyze-v1/route";

describe("/api/analyze-v1 evidence wiring (unit)", () => {
  it("returns engine evidence at root and mirrors it into raw.evidence", async () => {
    const res = await GET({
      url: "http://localhost:3000/api/analyze-v1?word=study&mode=strict",
    } as any);

    // NextResponse is a Response
    expect(res).toBeTruthy();
    expect((res as any).status).toBe(200);

    const json: any = await (res as any).json();

    // evidence exists at root
    expect(json.evidence).toBeTruthy();

    // must look like engine evidence (not stub-only)
    expect(typeof json.evidence.basis).toBe("string");
    expect(Array.isArray(json.evidence.surfaceVowels)).toBe(true);
    expect(json.evidence.math7).toBeTruthy();

    // raw.evidence must exist and match the root evidence
    expect(json.raw?.evidence).toBeTruthy();
    expect(json.raw.evidence).toEqual(json.evidence);

    // guard: fallback tag must NOT be present when engine evidence exists
    expect(json.evidence.signals || []).not.toContain("EVIDENCE_MISSING_FALLBACK");
  });
});
