import { execFileSync } from "node:child_process";

function rg(pattern: string): string[] {
  const paths = ["src", "tests", "scripts", "app"];
  const globs = [
    "--glob", "!**/node_modules/**",
    "--glob", "!**/.next/**",
    "--glob", "!**/dist/**",
    "--glob", "!**/coverage/**",
    "--glob", "!docs/**",
    // allow SSOT implementation + its own tests
    "--glob", "!src/shared/vowels/**",
    "--glob", "!tests/vowels/**",
  ];

  try {
    const out = execFileSync("rg", ["-n", pattern, ...paths, ...globs], { encoding: "utf8" });
    return out.trim().split("\n").filter(Boolean);
  } catch (e: any) {
    // rg exit code 1 => no matches
    if (e?.status === 1) return [];
    throw e;
  }
}

test("guard: orthography extraction must go through SSOT (no direct mapVowels usage outside vowels/)", () => {
  const hits = rg(String.raw`\bmapVowels\s*\(`);
  expect(hits).toEqual([]);
});

test("guard: no direct vowelMap table imports outside vowels/ (base/registry bypass)", () => {
  // blocks imports like: from "@/shared/vowels/vowelMap.baseLatin.v0.1"
  const hits = rg(String.raw`\bfrom\s+["'][^"']*vowelMap\.(?:base|registry)[^"']*["']`);
  expect(hits).toEqual([]);
});
