import { CANON_CANDIDATES } from "@/shared/canonCandidates";

describe("canonCandidates emits candidateRecord v0.1", () => {
  it("study canon candidates include candidateRecord", () => {
    const cs = CANON_CANDIDATES["study"] || [];
    expect(cs.length).toBeGreaterThan(0);

    for (const c of cs) {
      expect((c as any).candidateRecord).toBeTruthy();
      expect((c as any).candidateRecord.v).toBeTruthy();
      expect((c as any).candidateRecord.source).toBeTruthy();
      expect((c as any).candidateRecord.source.kind).toBeTruthy();
    }
  });
});
