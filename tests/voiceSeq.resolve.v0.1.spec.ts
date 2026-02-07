import { resolveVoiceSeqV0_1 } from "@/shared/voiceSeq.resolve.v0.1";

describe("voiceSeq.resolve v0.1", () => {
  test("arrays: keeps only valid vowel tokens", () => {
    expect(resolveVoiceSeqV0_1(["U", "i", " ", null, "Ë", "x"])).toEqual(["U", "I", "Ë"]);
  });

  test("string: parses arrow path", () => {
    expect(resolveVoiceSeqV0_1("U→I")).toEqual(["U", "I"]);
    expect(resolveVoiceSeqV0_1("u->i")).toEqual(["U", "I"]);
    expect(resolveVoiceSeqV0_1("A - Ë")).toEqual(["A", "Ë"]);
  });

  test("string: ignores trailing notes (no vowel scraping)", () => {
    expect(resolveVoiceSeqV0_1("U → I (note)")).toEqual(["U", "I"]);
    expect(resolveVoiceSeqV0_1("U→I (comment: do not parse vowels here)")).toEqual(["U", "I"]);
  });

  test("string: accepts pure vowel whitespace form", () => {
    expect(resolveVoiceSeqV0_1("U I")).toEqual(["U", "I"]);
    expect(resolveVoiceSeqV0_1("  Ë   A ")).toEqual(["Ë", "A"]);
  });

  test("string: rejects embedded word false positives (co-operate)", () => {
    expect(resolveVoiceSeqV0_1("co-operate")).toBeNull();
    expect(resolveVoiceSeqV0_1("stone-age")).toBeNull();
  });

  test("string: rejects arbitrary prose", () => {
    expect(resolveVoiceSeqV0_1("this is not a path")).toBeNull();
  });
});
