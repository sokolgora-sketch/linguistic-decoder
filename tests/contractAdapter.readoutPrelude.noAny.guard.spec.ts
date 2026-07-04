import fs from "node:fs";

describe("contractAdapter readout prelude boundary", () => {
  it("does not use broad any-casts inside the engineVersion/mode/alphabet prelude", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    const start = text.indexOf('const engineVersion = pickFromRootMetaContract(root, "engineVersion");');
    const end = text.indexOf('const meta = isRecord(root["meta"]) ? root["meta"] : null;', start);

    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);

    const block = text.slice(start, end);

    expect(block).not.toContain('pickFromRootMetaContract(root as any, "engineVersion")');
    expect(block).not.toContain('pickFromRootMetaContract(root as any, "mode")');
    expect(block).not.toContain('pickFromRootMetaContract(root as any, "alphabet")');
    expect(block).not.toContain('(heart ? asString((heart as any)["alphabet"]) : null)');

    expect(block).toContain('const engineVersion = pickFromRootMetaContract(root, "engineVersion");');
    expect(block).toContain('normalizeMode(pickFromRootMetaContract(root, "mode") ?? root["mode"]) ??');
    expect(block).toContain('pickFromRootMetaContract(root, "alphabet") ??');
    expect(block).toContain('(heart ? asString(heart["alphabet"]) : null)');
  });
});
