import fs from "node:fs";

describe("contractAdapter evidence source boundary", () => {
  it("does not use broad any-casts inside evidence source selection", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    const start = text.indexOf("// Evidence ledger sources (root -> raw.evidence -> heart.evidence)");
    const end = text.indexOf("const normalizationSteps =", start);

    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);

    const block = text.slice(start, end);

    expect(block).not.toContain('(root["evidence"] as Record<string, unknown>)');
    expect(block).not.toContain('(root as any)["raw"]');
    expect(block).not.toContain('((root as any)["raw"] as any)["evidence"]');
    expect(block).not.toContain('(heart as any)["evidence"]');
    expect(block).not.toContain('(((heart as any)["evidence"] as any) as Record<string, unknown>)');

    expect(block).toContain('const rootEvidence = isRecord(root["evidence"]) ? root["evidence"] : null;');
    expect(block).toContain('const rawRecord = isRecord(root["raw"]) ? root["raw"] : null;');
    expect(block).toContain('const rawEvidence = rawRecord && isRecord(rawRecord["evidence"]) ? rawRecord["evidence"] : null;');
    expect(block).toContain('const heartEvidence = heart && isRecord(heart["evidence"]) ? heart["evidence"] : null;');
  });
});
