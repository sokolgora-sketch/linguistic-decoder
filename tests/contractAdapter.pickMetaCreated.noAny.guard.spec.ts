import fs from "node:fs";

describe("contractAdapter pickMetaCreated boundary", () => {
  it("does not use broad any-casts inside pickMetaCreated", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    const start = text.indexOf("function pickMetaCreated(");
    const end = text.indexOf("\nfunction asBool", start);

    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);

    const block = text.slice(start, end);

    expect(block).not.toContain("function pickMetaCreated(root: any): string | null {");
    expect(block).not.toContain("(root as any).meta");
    expect(block).not.toContain("(root as any).contract");
    expect(block).not.toContain("asString(contract?.meta?.created)");
    expect(block).not.toContain("asString(contract?.meta?.createdAt)");
    expect(block).not.toContain("asString(meta?.created)");
    expect(block).not.toContain("asString(meta?.createdAt)");

    expect(block).toContain(
      'function pickMetaCreated(root: Record<string, unknown> | null): string | null {'
    );
    expect(block).toContain('const meta = root && isRecord(root["meta"]) ? root["meta"] : null;');
    expect(block).toContain('const contract = root && isRecord(root["contract"]) ? root["contract"] : null;');
    expect(block).toContain('const contractMeta = contract && isRecord(contract["meta"]) ? contract["meta"] : null;');
    expect(block).toContain('asString(contractMeta ? contractMeta["created"] : null) ??');
    expect(block).toContain('asString(contractMeta ? contractMeta["createdAt"] : null) ??');
    expect(block).toContain('asString(meta ? meta["created"] : null) ??');
    expect(block).toContain('asString(meta ? meta["createdAt"] : null) ??');
  });
});
