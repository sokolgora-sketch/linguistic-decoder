import fs from "fs";
import path from "path";

const ROOT = process.cwd();

// Only scan production code folders.
const SCAN_DIRS = ["src", "app"];

// Doctrine file is the only allowed home for the canonical hex palette.
const ALLOW_HEX_FILES = new Set<string>([
  path.join(ROOT, "src/shared/doctrine/voiceDoctrine.v0.1.ts"),
]);

const FORBIDDEN_HEX = [
  "#EF4444",
  "#EAB308",
  "#C026D3",
  "#F97316",
  "#3B82F6",
  "#4F46E5",
  "#22C55E",
];

const EXT_OK = new Set([".ts", ".tsx", ".js", ".jsx"]);

function walk(dirAbs: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dirAbs)) return out;

  const entries = fs.readdirSync(dirAbs, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dirAbs, e.name);
    if (e.isDirectory()) {
      // skip common noise
      if (
        e.name === "node_modules" ||
        e.name === ".next" ||
        e.name === "dist" ||
        e.name === ".git"
      )
        continue;
      out.push(...walk(p));
    } else if (e.isFile()) {
      if (EXT_OK.has(path.extname(p))) out.push(p);
    }
  }
  return out;
}

test("doctrine drift guard v0.1.2 — hex palette must not be duplicated in src/app", () => {
  const offenders: Array<{ file: string; hits: string[] }> = [];

  for (const rel of SCAN_DIRS) {
    const dirAbs = path.join(ROOT, rel);
    for (const f of walk(dirAbs)) {
      if (ALLOW_HEX_FILES.has(f)) continue;
      const txt = fs.readFileSync(f, "utf8");
      const hits = FORBIDDEN_HEX.filter((h) => txt.includes(h));
      if (hits.length) offenders.push({ file: path.relative(ROOT, f), hits });
    }
  }

  expect(offenders).toEqual([]);
});
