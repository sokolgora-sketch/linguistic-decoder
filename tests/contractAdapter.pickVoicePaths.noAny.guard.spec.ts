import fs from "node:fs";

describe("contractAdapter pickVoicePaths boundary", () => {
  it("does not use broad casts inside pickVoicePaths extractor reads", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    const start = text.indexOf('function pickVoicePaths(payload: unknown): { detected: string | null; surface: string | null; functional: string | null } {');
    const end = text.indexOf("function stableCandidateId(", start);

    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);

    const block = text.slice(start, end);

    expect(block).not.toContain('(getField(payload, "primaryPath") as Record<string, unknown>)');
    expect(block).not.toContain('(getField(payload, "evidence") as Record<string, unknown>)');
    expect(block).not.toContain('(getField(payload, "deepRoot") as Record<string, unknown>)');
    expect(block).not.toContain('(deepRoot?.["functionalRoots"] as unknown[])');
    expect(block).not.toContain('(functionalRoots[0] as Record<string, unknown>)');
    expect(block).not.toContain('(getField(payload, "candidates") as unknown[])');
    expect(block).not.toContain('(candidates[0] as Record<string, unknown>)');

    expect(block).toContain('const primaryPathValue = getField(payload, "primaryPath");');
    expect(block).toContain('const primaryPath = isRecord(primaryPathValue) ? primaryPathValue : null;');
    expect(block).toContain('const evidenceValue = getField(payload, "evidence");');
    expect(block).toContain('const evidence = isRecord(evidenceValue) ? evidenceValue : null;');
    expect(block).toContain('const deepRootValue = getField(payload, "deepRoot");');
    expect(block).toContain('const deepRoot = isRecord(deepRootValue) ? deepRootValue : null;');
    expect(block).toContain('const functionalRoots =');
    expect(block).toContain('const candidatesValue = getField(payload, "candidates");');
    expect(block).toContain('const candidates = Array.isArray(candidatesValue) ? candidatesValue : null;');
  });
});
