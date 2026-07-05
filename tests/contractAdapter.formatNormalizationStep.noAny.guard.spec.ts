import fs from "node:fs";

describe("contractAdapter formatNormalizationStep boundary", () => {
  it("does not use a broad Record cast inside formatNormalizationStep", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    const start = text.indexOf("function formatNormalizationStep(x: unknown): string {");
    const end = text.indexOf("function formatEvidenceItem(x: unknown): string {", start);

    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);

    const block = text.slice(start, end);

    expect(block).not.toContain("const o = x as Record<string, unknown>;");
    expect(block).not.toContain('const from = typeof o["from"] === "string" ? o["from"] : "";');
    expect(block).not.toContain('const to = typeof o["to"] === "string" ? o["to"] : "";');
    expect(block).not.toContain('const reason = typeof o["reason"] === "string" ? o["reason"] : "";');

    expect(block).toContain("if (!isRecord(x)) {");
    expect(block).toContain('const from = typeof x["from"] === "string" ? x["from"] : "";');
    expect(block).toContain('const to = typeof x["to"] === "string" ? x["to"] : "";');
    expect(block).toContain('const reason = typeof x["reason"] === "string" ? x["reason"] : "";');
    expect(block).toContain("return JSON.stringify(x);");
    expect(block).toContain("return String(x);");
  });
});
