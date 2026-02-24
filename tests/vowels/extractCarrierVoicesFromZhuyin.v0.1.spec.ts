import { describe, it, expect } from "@jest/globals";
import { extractCarrierVoicesFromZhuyinV0_1 } from "../../src/shared/vowels/extractCarrierVoicesFromZhuyin.v0.1";

describe("extractCarrierVoicesFromZhuyinV0_1 v0.1", () => {
  it("extracts ㄅㄚ => [A], primary A", () => {
    const out = extractCarrierVoicesFromZhuyinV0_1("ㄅㄚ");
    expect(out.voices).toEqual(["A"]);
    expect(out.primary).toBe("A");
  });

  it("strips tone marks (ˋ) and avoids schwa hallucination in ㄓㄨㄥˋ (treat ㄥ as coda after ㄨ)", () => {
    const out = extractCarrierVoicesFromZhuyinV0_1("ㄓㄨㄥˋ");
    expect(out.voices).toEqual(["U"]);
    expect(out.primary).toBe("U");
  });

  it("handles ㄣ alone as central vowel (Ë)", () => {
    const out = extractCarrierVoicesFromZhuyinV0_1("ㄣ");
    expect(out.voices).toEqual(["Ë"]);
    expect(out.primary).toBe("Ë");
  });

  it("treats ㄧㄣ as [I] (ㄣ becomes coda after ㄧ)", () => {
    const out = extractCarrierVoicesFromZhuyinV0_1("ㄧㄣ");
    expect(out.voices).toEqual(["I"]);
    expect(out.primary).toBe("I");
  });

  it("medial skip for primary: ㄩㄝ => voices [Y,E], primary E", () => {
    const out = extractCarrierVoicesFromZhuyinV0_1("ㄩㄝ");
    expect(out.voices).toEqual(["Y","E"]);
    expect(out.primary).toBe("E");
  });

  it("ㄧㄠ (I + AO) => voices [I,A,O], primary A (skip medial ㄧ)", () => {
    const out = extractCarrierVoicesFromZhuyinV0_1("ㄧㄠ");
    expect(out.voices).toEqual(["I","A","O"]);
    expect(out.primary).toBe("A");
  });
});
