import { describe, it, expect } from "@jest/globals";
import { extractZhuyinSignalV0_1 } from "@/shared/vowels/extractZhuyinSignal.v0.1";

describe("extractZhuyinSignalV0_1 v0.1", () => {
  it("tone + normalization + carrier voices", () => {
    const r = extractZhuyinSignalV0_1("ㄕㄤˋ");
    expect(r.tone).toBe(4);
    expect(r.normalized).toBe("ㄕㄤ");
    expect(r.voices).toEqual(["A"]);
    expect(r.primary).toBe("A");
  });

  it("unmarked Zhuyin => tone 1", () => {
    const r = extractZhuyinSignalV0_1("ㄓㄨㄥ");
    expect(r.tone).toBe(1);
    expect(r.primary).toBe("U");
  });
});
