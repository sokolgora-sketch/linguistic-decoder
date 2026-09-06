import { readFileSync } from "node:fs";

describe("analyze-v1 adapter raw boundary", () => {
  it("does not declare or use broad any values inside the adapter boundary", () => {
    const source = readFileSync("src/shared/analyzeV1Adapter.ts", "utf8");

    expect(source).not.toContain("type Raw = any");
    expect(source).not.toContain(": any");
    expect(source).not.toContain(" as any");
  });
});
