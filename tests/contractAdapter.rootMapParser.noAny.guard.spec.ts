import fs from "node:fs";

describe("contractAdapter rootMap parser boundary", () => {
  it("does not use broad any-casts in parseRootMapV1 or rootMap wrapper", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    expect(text).not.toContain('(v as any).tokens');
    expect(text).not.toContain('(v as any).keys');
    expect(text).not.toContain('(v as any).carriers');
    expect(text).not.toContain('(v as any).notes');
    expect(text).not.toContain('(payload as any).rootMap');
    expect(text).not.toContain('present(parsed.value as any)');

    expect(text).toContain('const tokens = v["tokens"]');
    expect(text).toContain('const keys = v["keys"]');
    expect(text).toContain('const carriers = v["carriers"]');
    expect(text).toContain('const notes = v["notes"]');
    expect(text).toContain('const v = payload["rootMap"]');
    expect(text).toContain('return present(parsed.value);');
  });
});
