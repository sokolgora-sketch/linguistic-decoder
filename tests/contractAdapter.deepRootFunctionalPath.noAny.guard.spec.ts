import fs from "node:fs";

describe("contractAdapter deepRootFunctionalPathStr boundary", () => {
  it("does not use broad any-casts inside the deepRoot functional path block", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    const start = text.indexOf("// Canonical DeepRoot functional vowel path (if emitted)");
    const end = text.indexOf("// Candidates", start);

    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);

    const block = text.slice(start, end);

    expect(block).not.toContain("(payload as any)?.deepRoot?.functionalRoots?.[0]");
    expect(block).not.toContain("fr0?.vowelPath");
    expect(block).not.toContain("fr0?.vowel_path");
    expect(block).not.toContain("fr0?.voicePath");
    expect(block).not.toContain("fr0?.voice_path");

    expect(block).toContain('const deepRoot = isRecord(root["deepRoot"]) ? root["deepRoot"] : null;');
    expect(block).toContain('const functionalRoots = deepRoot && Array.isArray(deepRoot["functionalRoots"]) ? deepRoot["functionalRoots"] : null;');
    expect(block).toContain('const fr0 = functionalRoots && functionalRoots.length > 0 && isRecord(functionalRoots[0]) ? functionalRoots[0] : null;');
    expect(block).toContain('normalizeVowelPathArray(fr0 ? fr0["vowelPath"] : null) ??');
    expect(block).toContain('normalizeVowelPathString(fr0 ? fr0["voice_path"] : null) ??');
  });
});
