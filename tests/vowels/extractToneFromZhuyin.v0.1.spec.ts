import { describe, it, expect } from "@jest/globals";
import { extractToneFromZhuyinV0_1 } from "@/shared/vowels/extractToneFromZhuyin.v0.1";

describe("extractToneFromZhuyinV0_1 v0.1", () => {
  it("unmarked Zhuyin => tone 1", () => {
    expect(extractToneFromZhuyinV0_1("ㄓㄨㄥ").tone).toBe(1);
  });
  it("marked tones", () => {
    expect(extractToneFromZhuyinV0_1("ㄕㄤˋ").tone).toBe(4);
    expect(extractToneFromZhuyinV0_1("ㄑㄧㄢˊ").tone).toBe(2);
    expect(extractToneFromZhuyinV0_1("ㄩㄢˇ").tone).toBe(3);
    expect(extractToneFromZhuyinV0_1("ㄉㄜ˙").tone).toBe(5);
  });
  it("normalizes by removing marks", () => {
    expect(extractToneFromZhuyinV0_1("ㄕㄤˋ").normalized).toBe("ㄕㄤ");
  });
});
