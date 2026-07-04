import fs from "node:fs";

describe("contractAdapter reasonCounts boundary", () => {
  it("does not use broad any-casts inside reasonCounts aggregation", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    const start = text.indexOf("const reasonCounts: Record<string, number> = {};");
    const end = text.indexOf("const gatesActive =", start);

    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);

    const block = text.slice(start, end);

    expect(block).not.toContain("(oc.candidates as any[])");
    expect(block).not.toContain("(c.reasonCodes as any[])");
    expect(block).not.toContain("Array.isArray(oc.candidates)");
    expect(block).not.toContain("Array.isArray(c.reasonCodes)");

    expect(block).toContain('const ocCandidates = oc && Array.isArray(oc["candidates"]) ? oc["candidates"] : null;');
    expect(block).toContain('const reasonCodes = c["reasonCodes"];');
    expect(block).toContain("if (!Array.isArray(reasonCodes)) continue;");
  });
});
