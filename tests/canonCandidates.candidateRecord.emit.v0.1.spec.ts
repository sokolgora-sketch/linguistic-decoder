import { CANON_CANDIDATES } from "@/shared/canonCandidates";
import { normalizeCandidateRecord } from "@/shared/brain/candidateRecord.normalize.v0.1";
import { CANDIDATE_RECORD_VERSION } from "@/shared/brain/candidateRecord.v0.1";

describe("canonCandidates emits candidateRecord v0.1", () => {
  it("study canon candidates include a normalizable CandidateRecord", () => {
    const cs = CANON_CANDIDATES["study"] || [];
    expect(cs.length).toBeGreaterThan(0);

    for (const c of cs) {
      const raw = (c as any).candidateRecord;
      expect(raw).toBeTruthy();
      expect(raw.v).toBe(CANDIDATE_RECORD_VERSION);
      expect(raw.source?.kind).toBeTruthy();

      const norm = normalizeCandidateRecord(raw);
      expect(norm.ok).toBe(true);
      if (norm.ok) {
        // minimum lock: required fields survive normalization
        expect(norm.record.v).toBe(CANDIDATE_RECORD_VERSION);
        expect(norm.record.languageId).toMatch(/^wlt:/);
        expect(norm.record.languageName.length).toBeGreaterThan(0);
        expect(norm.record.form.length).toBeGreaterThan(0);
        expect(norm.record.gloss.length).toBeGreaterThan(0);
        expect(Array.isArray(norm.record.roots)).toBe(true);
        expect(norm.record.roots.length).toBeGreaterThan(0);
        expect(norm.record.source.kind === "SEED" || norm.record.source.kind === "DATASET").toBe(
          true
        );
      }
    }
  });
});
