import { stableStringify } from "../src/shared/engineContract.v1";

describe("engineContract.v1 smoke", () => {
  it("stableStringify sorts object keys", () => {
    const s = stableStringify({ b: 2, a: 1 });
    expect(s.indexOf('"a"')).toBeLessThan(s.indexOf('"b"'));
  });

  it("stableStringify rejects circular objects", () => {
    const x: any = { a: 1 };
    x.self = x;
    expect(() => stableStringify(x)).toThrow(/circular/i);
  });
});
