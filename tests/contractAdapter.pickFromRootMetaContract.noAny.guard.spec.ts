import fs from "node:fs";

describe("contractAdapter pickFromRootMetaContract boundary", () => {
  it("does not use broad any-casts inside pickFromRootMetaContract", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    const match = text.match(
      /function pickFromRootMetaContract\(.*?\): string \| null \{[\s\S]*?\n\}(?=\n\nfunction pickMetaCreated)/
    );

    expect(match).not.toBeNull();

    const block = String(match?.[0] ?? "");

    expect(block).not.toContain("function pickFromRootMetaContract(root: any, key: string)");
    expect(block).not.toContain("(root as any).meta");
    expect(block).not.toContain("(root as any).contract");
    expect(block).not.toContain("asString(root?.[key])");
    expect(block).not.toContain("asString(contract?.[key])");
    expect(block).not.toContain("asString(meta?.[key])");

    expect(block).toContain(
      "function pickFromRootMetaContract(root: Record<string, unknown> | null, key: string): string | null {"
    );
    expect(block).toContain('const meta = root && isRecord(root["meta"]) ? root["meta"] : null;');
    expect(block).toContain('const contract = root && isRecord(root["contract"]) ? root["contract"] : null;');
    expect(block).toContain("asString(root ? root[key] : null) ??");
    expect(block).toContain("asString(contract ? contract[key] : null) ??");
    expect(block).toContain("asString(meta ? meta[key] : null) ??");
  });
});
