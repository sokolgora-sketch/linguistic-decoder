import { extractCarrierVoicesFromIpaV0_1 } from "@/shared/vowels/extractCarrierVoicesFromIpa.v0.1";
import { vectorDeltaSummaryV0_1 } from "@/shared/geometry/vectorDeltaSummary.v0.1";

function makeConsonantNoiseSet(): string[] {
  // fixed deterministic set (no randomness)
  return [
    "str",
    "tsk",
    "pft",
    "ɾɬ",
    "ʃtɾ",
    "ŋkʃ",
    "bdɡ",
    "ʔtʔ",
    "tʃ",
    "dʒ",
    "θs",
    "ðz",
    "ɣx",
    "çʝ",
    "ʂʐ",
    "ɸβ",
    "ʙr",
    "ʀʁ",
    "ɕʑ",
    "ɬs",
    // add many more fixed clusters
    "spl",
    "spr",
    "skr",
    "skw",
    "stɹ",
    "skt",
    "ptk",
    "kts",
    "mpt",
    "ndz",
    "ŋks",
    "rts",
    "lft",
    "lfθ",
    "mps",
    "nʃt",
    "rʃt",
    "xtr",
    "ɡz",
    "ks",
    "ps",
    "ts",
    "dz",
    "tʂ",
    "dʐ",
    "tɕ",
    "dʑ"
  ];
}

describe("IPA noise rejection v0.1 (no vowels => no carriers)", () => {
  test("consonant-only strings must not invent carrier voices", () => {
    const noises = makeConsonantNoiseSet();
    const view = noises.map((ipa) => {
      const out = extractCarrierVoicesFromIpaV0_1(ipa);
      const voices = (out as any)?.voices ?? [];
      const geom = vectorDeltaSummaryV0_1(Array.isArray(voices) ? voices : []);
      return { ipa, voices, signature: geom.signature };
    });

    for (const row of view) {
      expect(row.voices).toEqual([]);
      expect(row.signature).toBe("∅");
    }
  });
});
