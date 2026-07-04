import fs from "node:fs";

describe("contractAdapter phoneticIpaV0_1 boundary", () => {
  it("does not use broad any-casts in the phoneticIpaV0_1 parser slice", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    expect(text).not.toContain('(payload as any).phoneticIpaV0_1');
    expect(text).not.toContain('(v as any).ipa');
    expect(text).not.toContain('(v as any).voices');
    expect(text).not.toContain('(v as any)?.diagnostics?.unmapped');
    expect(text).not.toContain('map((x: any) => String(x))');

    expect(text).toContain('const v = payload["phoneticIpaV0_1"]');
    expect(text).toContain('const ipa = asString(v["ipa"])');
    expect(text).toContain('const voices = asVowelArray2(v["voices"])');
    expect(text).toContain('const diagnostics = isRecord(v["diagnostics"]) ? v["diagnostics"] : null;');
    expect(text).toContain('const unmappedRaw = diagnostics ? diagnostics["unmapped"] : null;');
  });
});
