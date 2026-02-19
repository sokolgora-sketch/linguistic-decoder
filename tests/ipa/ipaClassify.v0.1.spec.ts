import {
  classifyIpaSegmentsV0_1,
  SYLLABIC_MARK_V0_1,
} from "../../src/shared/ipa/ipaClassify.v0.1";

describe("ipaClassify v0.1", () => {
  test("tokenizes base+combining marks (syllabic m̩)", () => {
    const segs = classifyIpaSegmentsV0_1("m\u0329");
    expect(segs).toHaveLength(1);
    expect(segs[0].base).toBe("m");
    expect(segs[0].marks).toEqual([SYLLABIC_MARK_V0_1]);
    expect(segs[0].raw).toBe("m\u0329");
    expect(segs[0].cls).toBe("sonorant");
  });

  test("classifies rhythm-style rɪðm̩ (sonorant, vowel, obstruent, sonorant)", () => {
    const segs = classifyIpaSegmentsV0_1("rɪðm\u0329");
    expect(segs.map((s) => s.base)).toEqual(["r", "ɪ", "ð", "m"]);
    expect(segs.map((s) => s.cls)).toEqual(["sonorant", "vowel", "obstruent", "sonorant"]);
  });

  test("normalizes wrappers + stress", () => {
    const segs = classifyIpaSegmentsV0_1("/ˈrɪðm/");
    expect(segs.map((s) => s.base)).toEqual(["r", "ɪ", "ð", "m"]);
  });

  test("film (/fɪlm/) ends sonorant+sonorant (l,m)", () => {
    const segs = classifyIpaSegmentsV0_1("fɪlm");
    expect(segs.map((s) => s.cls)).toEqual(["obstruent", "vowel", "sonorant", "sonorant"]);
  });
});
