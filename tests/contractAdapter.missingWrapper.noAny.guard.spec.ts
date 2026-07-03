import fs from "node:fs";

describe("contractAdapter missing wrapper normalization", () => {
  it("does not use broad any-casts for missing/note forwarding", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    expect(text).not.toContain("(m as any)?.missing");
    expect(text).not.toContain("(m as any)?.note");
    expect(text).toContain('const missingStateValue = m.missing');
    expect(text).toContain('typeof m.note === "string" ? m.note : undefined');
  });
});
