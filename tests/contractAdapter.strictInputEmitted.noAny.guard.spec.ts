import fs from "node:fs";

describe("contractAdapter strictInputEmittedRaw boundary", () => {
  it("does not use broad any-casts inside strictInputEmittedRaw extraction", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    const start = text.indexOf("const strictInputEmittedRaw =");
    const end = text.indexOf("const strictInputEmittedBool: boolean | null =", start);

    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);

    const block = text.slice(start, end);

    expect(block).not.toContain('(heart ? (heart as any)["strictInput"] : null)');
    expect(block).not.toContain('(root as any)["strictInput"]');
    expect(block).not.toContain('pickFromRootMetaContract(root as any, "strictInput")');

    expect(block).toContain('(heart ? heart["strictInput"] : null) ??');
    expect(block).toContain('root["strictInput"] ??');
    expect(block).toContain('pickFromRootMetaContract(root, "strictInput") ??');
  });
});
