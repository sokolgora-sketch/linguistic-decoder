import { describe, it, expect } from "@jest/globals";
import { __ZHUYIN_MAP_V0_1 } from "../../src/shared/vowels/extractCarrierVoicesFromZhuyin.v0.1";

describe("Zhuyin map v0.1 lock", () => {
  it("is stable (no accidental edits)", () => {
    expect(__ZHUYIN_MAP_V0_1).toEqual({
      "ㄚ": ["A"],
      "ㄛ": ["O"],
      "ㄜ": ["Ë"],
      "ㄝ": ["E"],
      "ㄧ": ["I"],
      "ㄨ": ["U"],
      "ㄩ": ["Y"],
      "ㄞ": ["A","I"],
      "ㄟ": ["E","I"],
      "ㄠ": ["A","O"],
      "ㄡ": ["O","U"],
      "ㄢ": ["A"],
      "ㄤ": ["A"],
      "ㄣ": ["Ë"],
      "ㄥ": ["Ë"],
      "ㄦ": ["Ë"],
    });
  });
});
