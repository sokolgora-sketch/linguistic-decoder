import { buildOriginClaimV1 } from "@/shared/originClaim.builder.v1";
import { CANDIDATE_RECORD_VERSION } from "@/shared/brain/candidateRecord.v0.1";

describe("BRAIN-0.1 — CandidateRecord side-channel (OriginClaim meta.inputs)", () => {
  test("additive: does not alter originClaim.candidates; only adds meta.inputs.brainCandidates when present", () => {
    const result: any = {
      word: "x",
      engineVersion: "test",
      mode: "strict",
      alphabet: "auto",
      heart: { math7: { primary: { vowels: ["U", "I"] } } },
      candidates: [
        // normal candidate (not CandidateRecord)
        { id: "c0", language: "Latin", form: "studium", status: "pass" },

        // CandidateRecord-like (explicit)
        {
          id: "c1",
          v: CANDIDATE_RECORD_VERSION,
          languageId: "wlt:test.latin",
          languageName: "Latin",
          form: "studium",
          gloss: "study, zeal, pursuit",
          roots: ["STUD"],
          opsUsed: [],
          source: { kind: "SEED", ref: "seedLexicon.v0.1", version: "0.1" },
        },
      ],
    };

    const oc = buildOriginClaimV1(result);

    // OriginClaim candidates still exist and are not filtered/deleted
    expect(Array.isArray(oc.candidates)).toBe(true);
    expect(oc.candidates.length).toBeGreaterThan(0);

    // Side-channel exists only because we provided a valid record
    const brainCandidates = (oc as any)?.meta?.inputs?.brainCandidates;
    expect(Array.isArray(brainCandidates)).toBe(true);
    expect(brainCandidates.length).toBe(1);
    expect(brainCandidates[0].languageId).toBe("wlt:test.latin");
    expect(brainCandidates[0].roots).toEqual(["STUD"]);
  });

  test("snapshot-safe: does not add brainCandidates key when none normalize", () => {
    const result: any = {
      word: "x",
      engineVersion: "test",
      mode: "strict",
      alphabet: "auto",
      heart: { math7: { primary: { vowels: ["U", "I"] } } },
      candidates: [{ id: "c0", language: "Latin", form: "studium", status: "pass" }],
    };

    const oc = buildOriginClaimV1(result);
    expect((oc as any)?.meta?.inputs?.brainCandidates).toBeUndefined();
  });
});
