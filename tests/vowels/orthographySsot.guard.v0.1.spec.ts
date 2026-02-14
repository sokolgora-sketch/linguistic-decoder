import fs from "fs";
import path from "path";

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function isTsFile(p: string): boolean {
  return p.endsWith(".ts") || p.endsWith(".tsx");
}

test("guard: orthography extraction must go through SSOT (no direct mapVowels usage outside vowels/)", () => {
  const roots = ["src", "app"];
  const files = roots.flatMap((r) => (fs.existsSync(r) ? walk(r) : [])).filter(isTsFile);

  const offenders: string[] = [];

  // Any import referencing mapVowels.v0.* OR symbol usage (mapVowelsV0_1, mapVowelsV0_2, etc.)
  const reImport = /\bfrom\s+["'][^"']*mapVowels\.v0\.[^"']*["']/;
  const reSymbol = /\bmapVowelsV0_\d+\b/;

  for (const f of files) {
    const rel = f.replace(/\\/g, "/");

    // Allowed: internal vowels module implementation details
    if (rel.startsWith("src/shared/vowels/")) continue;

    const t = fs.readFileSync(f, "utf8");
    if (reImport.test(t) || reSymbol.test(t)) offenders.push(rel);
  }

  expect(offenders).toEqual([]);
});
