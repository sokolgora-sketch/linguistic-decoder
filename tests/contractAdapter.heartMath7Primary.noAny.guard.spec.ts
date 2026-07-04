import fs from "node:fs";

describe("contractAdapter heartMath7Primary boundary", () => {
  it("does not use broad any-casts inside the heartMath7Primary extractor", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    const start = text.indexOf('const heartMath7 = heart && isRecord(heart["math7"]) ? heart["math7"] : null;');
    const end = text.indexOf('const math7PrinciplesPath =', start);

    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);

    const block = text.slice(start, end);

    expect(block).not.toContain('(heart as any)["math7"]');
    expect(block).not.toContain('((heart as any)["math7"] as any)["primary"]');
    expect(block).not.toContain('(((heart as any)["math7"] as any)["primary"] as Record<string, unknown>)');

    expect(block).toContain('const heartMath7 = heart && isRecord(heart["math7"]) ? heart["math7"] : null;');
    expect(block).toContain('const heartMath7Primary = heartMath7 && isRecord(heartMath7["primary"]) ? heartMath7["primary"] : null;');
  });
});
