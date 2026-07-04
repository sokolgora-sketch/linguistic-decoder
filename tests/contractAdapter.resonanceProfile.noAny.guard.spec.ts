import fs from "node:fs";

describe("contractAdapter resonanceProfileV1 boundary", () => {
  it("does not use broad casts in the resonanceProfileV1 parser slice", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    const start = text.indexOf("// ----------------------- resonance profile v0.1 -----------------------");
    const end = text.indexOf("// ----------------------- phonetic IPA v0.1 -----------------------", start);

    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);

    const block = text.slice(start, end);

    expect(block).not.toContain("(payload as any).resonanceProfileV1");
    expect(block).not.toContain("(v as any).version");
    expect(block).not.toContain("return present(v as ResonanceProfileV1VM);");

    expect(block).toContain('const v = payload["resonanceProfileV1"]');
    expect(block).toContain('const version = asString(v["version"])');
    expect(block).toContain("const parseResonanceReadout = (");
    expect(block).toContain('const surfaceParsed = parseResonanceReadout(v["surface"], "surface");');
    expect(block).toContain('const normalizedParsed = parseResonanceReadout(v["normalized"], "normalized");');
    expect(block).toContain("return present({");
    expect(block).toContain("surface: surfaceParsed.value,");
    expect(block).toContain("normalized: normalizedParsed.value,");
  });
});
