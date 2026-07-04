import fs from "node:fs";

describe("contractAdapter formatNormalizationStep boundary", () => {
  it("does not use broad any-casts inside formatNormalizationStep", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    expect(text).not.toContain("const o = x as any;");
    expect(text).not.toContain('typeof o.from === "string"');
    expect(text).not.toContain('typeof o.to === "string"');
    expect(text).not.toContain('typeof o.reason === "string"');

    expect(text).toContain("const o = x as Record<string, unknown>;");
    expect(text).toContain('const from = typeof o["from"] === "string" ? o["from"] : "";');
    expect(text).toContain('const to = typeof o["to"] === "string" ? o["to"] : "";');
    expect(text).toContain('const reason = typeof o["reason"] === "string" ? o["reason"] : "";');
  });
});
