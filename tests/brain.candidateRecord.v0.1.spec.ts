import { normalizeCandidateRecord } from "../src/shared/brain/candidateRecord.normalize.v0.1";
import { CANDIDATE_RECORD_VERSION } from "../src/shared/brain/candidateRecord.v0.1";

describe("BRAIN-0 CandidateRecord v0.1", () => {
  test("normalizes deterministically and returns ok for valid record", () => {
    const input = {
      v: CANDIDATE_RECORD_VERSION,
      languageId: "wlt:indo-european.albanian",
      languageName: "Albanian",
      form: "  di  ",
      gloss: "  to know ",
      roots: ["di", "DI", "  di "],
      explains: [{ segment: " dy ", note: " Y↔I " }],
      opsUsed: [" Y↔I ", "Y↔I"],
      functionTag: "FUNCTION",
      source: { kind: "SEED", ref: "seedLexicon.v0.1", version: "0.1.0" },
    };

    const a = normalizeCandidateRecord(input);
    const b = normalizeCandidateRecord(input);

    expect(a.ok).toBe(true);
    expect(b.ok).toBe(true);

    if (a.ok && b.ok) {
      expect(a.record).toEqual(b.record);
      expect(a.record.roots).toEqual(["DI"]); // canonical + uniqStable
      expect(a.record.opsUsed).toEqual(["y_to_i"]);
      expect(a.record.explains?.[0].segment).toBe("dy");
      expect(a.record.explains?.[0].note).toBe("Y↔I");
    }
  });

  test("rejects invalid root tags (keeps law strict)", () => {
    const bad = normalizeCandidateRecord({
      v: CANDIDATE_RECORD_VERSION,
      languageId: "wlt:indo-european.albanian",
      languageName: "Albanian",
      form: "di",
      gloss: "to know",
      roots: ["D I"], // invalid
      opsUsed: [],
      source: { kind: "SEED", ref: "seedLexicon.v0.1", version: "0.1.0" },
    });

    expect(bad.ok).toBe(false);
    if (!bad.ok) {
      expect(bad.errors.join(" ")).toMatch(/root_bad_token/i);
    }
  });

  test("rejects missing essentials", () => {
    const res = normalizeCandidateRecord({ v: CANDIDATE_RECORD_VERSION });
    expect(res.ok).toBe(false);
  });
});

it("rejects non-AllowedOpId opsUsed tokens", () => {
  const bad = normalizeCandidateRecord({
    v: CANDIDATE_RECORD_VERSION,
    languageId: "wlt:test",
    languageName: "Test",
    form: "x",
    gloss: "x",
    roots: ["X"],
    opsUsed: ["definitely_not_an_op"], // unmapped => must reject
    source: { kind: "SEED", ref: "test", version: "v0" },
  });

  expect(bad.ok).toBe(false);
  expect((bad as any).errors.join("|")).toContain("candidateRecord:ops_bad_token");
});
