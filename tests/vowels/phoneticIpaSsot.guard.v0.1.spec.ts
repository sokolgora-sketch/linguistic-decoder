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

test("guard: phonetic IPA extraction must go through SSOT (no direct parseIpaVowels/ipaVowelMap usage outside vowels/)", () => {
  const roots = ["src", "app"];
  const files = roots.flatMap((r) => (fs.existsSync(r) ? walk(r) : [])).filter(isTsFile);

  const offenders: string[] = [];

  // Any import that references parseIpaVowels.* or ipaVowelMap.* (any v0.x), outside vowels/
  const reImport = /\bfrom\s+["'][^"']*(?:parseIpaVowels|ipaVowelMap)\.v0\.[^"']*["']/;

  for (const f of files) {
    const rel = f.replace(/\\/g, "/");

    // Allowed: internal vowels module implementation details
    if (rel.startsWith("src/shared/vowels/")) continue;

    const t = fs.readFileSync(f, "utf8");
    if (reImport.test(t)) offenders.push(rel);
  }

  expect(offenders).toEqual([]);
});
