import fs from "node:fs";

describe("contractAdapter originClaimGates.active boundary", () => {
  it("does not use broad any-casts inside the originClaimGates active block", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    const start = text.indexOf("const originClaimGatesActiveRecord =");
    const end = text.indexOf('flag: "ocg" as const,', start);

    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);

    const block = text.slice(start, end);

    expect(block).not.toContain("(raw as any)?.originClaimGates?.active");

    expect(block).toContain('const originClaimGatesActiveRecord =');
    expect(block).toContain(
      'isRecord(raw) && isRecord(raw["originClaimGates"]) ? raw["originClaimGates"] : null;'
    );
    expect(block).toContain(
      'const a = originClaimGatesActiveRecord ? originClaimGatesActiveRecord["active"] : null;'
    );
  });
});
