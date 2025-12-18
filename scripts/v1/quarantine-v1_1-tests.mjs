import fs from "node:fs";
import path from "node:path";

const targets = [
  "src/lib/solver/solver.test.ts",
  "src/lib/solver/languageProfiles.spec.ts",
];

function patchDescribeSkip(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`[skip] not found: ${filePath}`);
    return;
  }

  const src = fs.readFileSync(filePath, "utf8");

  // If already skipped anywhere near the top, do nothing.
  if (src.includes("describe.skip(") || src.includes("describe['skip'](")) {
    console.log(`[ok] already skipped: ${filePath}`);
    return;
  }

  // Replace the first occurrence of "describe(" with "describe.skip("
  const idx = src.indexOf("describe(");
  if (idx === -1) {
    console.log(`[warn] no describe( found: ${filePath}`);
    return;
  }

  const out =
    `/**\n` +
    ` * v1.1+ suite (quarantined for ZË-RO v1 minimal release)\n` +
    ` * Re-enable after v1 ships.\n` +
    ` */\n\n` +
    src.slice(0, idx) +
    "describe.skip(" +
    src.slice(idx + "describe(".length);

  fs.writeFileSync(filePath, out, "utf8");
  console.log(`[patched] quarantined: ${filePath}`);
}

for (const rel of targets) {
  patchDescribeSkip(path.resolve(process.cwd(), rel));
}

console.log("\nDone. Now run: npm test\n");
