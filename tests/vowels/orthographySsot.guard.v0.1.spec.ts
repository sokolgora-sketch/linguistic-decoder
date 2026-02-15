import fs from "node:fs";
import path from "node:path";

const ROOTS = ["src", "tests", "scripts", "app"];
const IGNORE_DIRS = new Set(["node_modules", ".next", "dist", "coverage", "docs"]);

function walk(dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;

  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (IGNORE_DIRS.has(ent.name)) continue;
      out.push(...walk(p));
    } else {
      out.push(p);
    }
  }
  return out;
}

function isCodeFile(p: string): boolean {
  return (
    p.endsWith(".ts") ||
    p.endsWith(".tsx") ||
    p.endsWith(".js") ||
    p.endsWith(".mjs") ||
    p.endsWith(".cjs")
  );
}

test("guard: orthography extraction must go through SSOT (no mapVowels/mapVowels.v0.x outside vowels/)", () => {
  const files = ROOTS.flatMap((r) => walk(r)).filter(isCodeFile);

  const offenders: Array<{ file: string; why: string }> = [];

  const reCall = /\bmapVowels\s*\(/;
  const reImportMap = /\bfrom\s+["'][^"']*mapVowels\.v0\.[^"']*["']/;
  const reImportTables = /\bfrom\s+["'][^"']*vowelMap\.(?:base|registry)[^"']*["']/;

  for (const f of files) {
    const rel = f.replace(/\\/g, "/");

    // Allowed: internal vowels implementation + its own tests
    if (rel.startsWith("src/shared/vowels/")) continue;
    if (rel.startsWith("tests/vowels/")) continue;

    const t = fs.readFileSync(f, "utf8");

    if (reCall.test(t)) offenders.push({ file: rel, why: "mapVowels(" });
    if (reImportMap.test(t)) offenders.push({ file: rel, why: "import mapVowels.v0.x" });
    if (reImportTables.test(t)) offenders.push({ file: rel, why: "import vowelMap.(base|registry)" });
  }

  expect(offenders).toEqual([]);
});
