import fs from "node:fs";

describe("contractAdapter evidence fallback fields boundary", () => {
  it("does not use broad any-casts inside ops/notes/signals root fallback reads", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    const start = text.indexOf('const rootOps = asArray(root["ops"]);');
    const end = text.indexOf("// Canonical DeepRoot functional vowel path (if emitted)", start);

    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);

    const block = text.slice(start, end);

    expect(block).not.toContain('(root as any)["ops"]');
    expect(block).not.toContain('(root as any)["notes"]');
    expect(block).not.toContain('(root as any)["signals"]');

    expect(block).toContain('const rootOps = asArray(root["ops"]);');
    expect(block).toContain('const rootNotes = asArray(root["notes"]);');
    expect(block).toContain('const rootSignals = asArray(root["signals"]);');
  });
});
