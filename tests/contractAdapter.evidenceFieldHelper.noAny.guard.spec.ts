import fs from "node:fs";

describe("contractAdapter evidence field helper boundary", () => {
  it("does not use broad any-casts inside pomStringListFromEvidenceField", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    expect(text).not.toContain('(parent as any)[field]');
    expect(text).toContain('const v = parent[field];');
  });
});
