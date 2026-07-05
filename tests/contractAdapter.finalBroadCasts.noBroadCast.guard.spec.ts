import fs from "node:fs";

describe("contractAdapter final broad-cast boundary", () => {
  it("does not keep the last broad casts in formatNormalizationStep or originClaim", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    expect(text).not.toContain("const o = x as Record<string, unknown>;");
    expect(text).not.toContain("present(oc as unknown)");

    expect(text).toContain("if (!isRecord(x)) {");
    expect(text).toContain('const from = typeof x["from"] === "string" ? x["from"] : "";');
    expect(text).toContain('const to = typeof x["to"] === "string" ? x["to"] : "";');
    expect(text).toContain('const reason = typeof x["reason"] === "string" ? x["reason"] : "";');

    expect(text).toContain('const originClaim: PresentOrMissing<unknown> = oc ? present<unknown>(oc) : missing<unknown>("not_emitted", "originClaim");');
  });
});
