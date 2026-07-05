import fs from "node:fs";

describe("contractAdapter normalizeVowelChar boundary", () => {
  it("does not use a broad cast in normalizeVowelChar", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    const start = text.indexOf("function normalizeVowelChar(s: string): Vowel | null {");
    const end = text.indexOf("function normalizeVowelPathArray", start);

    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);

    const block = text.slice(start, end);

    expect(block).not.toContain("return t as Vowel;");
    expect(block).toContain("switch (t) {");
    expect(block).toContain('case "A":');
    expect(block).toContain('case "Ë":');
    expect(block).toContain("default:");
    expect(block).toContain("return null;");
  });
});
