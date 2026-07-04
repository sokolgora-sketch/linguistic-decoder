import fs from "node:fs";

describe("contractAdapter resonanceProfileV1 boundary", () => {
  it("does not use broad any-casts in the resonanceProfileV1 parser slice", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    expect(text).not.toContain('(payload as any).resonanceProfileV1');
    expect(text).not.toContain('(v as any).version');

    expect(text).toContain('const v = payload["resonanceProfileV1"]');
    expect(text).toContain('const version = asString(v["version"])');
    expect(text).toContain('return present(v as ResonanceProfileV1VM);');
  });
});
