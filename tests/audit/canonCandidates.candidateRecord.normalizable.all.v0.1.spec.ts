import { CANON_CANDIDATES } from "@/shared/canonCandidates";
import { normalizeCandidateRecord } from "@/shared/brain/candidateRecord.normalize.v0.1";
import { CANDIDATE_RECORD_VERSION } from "@/shared/brain/candidateRecord.v0.1";

describe("audit: all canonCandidates candidateRecord normalizable (v0.1)", () => {
  it("every canon candidate carries a CandidateRecord that normalizes", () => {
    const keys = Object.keys(CANON_CANDIDATES);
    expect(keys.length).toBeGreaterThan(0);

    for (const word of keys) {
      const list = (CANON_CANDIDATES as any)[word] as any[];
      expect(Array.isArray(list)).toBe(true);

      for (const c of list) {
        const raw = c?.candidateRecord;
        expect(raw).toBeTruthy();
        expect(raw.v).toBe(CANDIDATE_RECORD_VERSION);

        const norm = normalizeCandidateRecord(raw);
        if (!norm.ok) {
          // fail with useful context
          throw new Error(
            `canonCandidates[${word}] candidateRecord rejected: ${JSON.stringify(norm.errors)}`
          );
        }

        // minimal invariants
        expect(norm.record.languageId).toMatch(/^wlt:/);
        expect(norm.record.source.kind === "SEED" || norm.record.source.kind === "DATASET").toBe(
          true
        );
      }
    }
  });
});
