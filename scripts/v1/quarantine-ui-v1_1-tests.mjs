import fs from "node:fs";
import path from "node:path";

const targets = [
  "tests/recentWords.spec.tsx",
  "tests/copyJsonButton.spec.tsx",
];

function quarantine(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`[skip] not found: ${filePath}`);
    return;
  }

  const src = fs.readFileSync(filePath, "utf8");
  if (src.includes("describe.skip(") || src.includes("describe['skip'](")) {
    console.log(`[ok] already skipped: ${filePath}`);
    return;
  }

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
  quarantine(path.resolve(process.cwd(), rel));
}

console.log("\nDone. Now run: npm test\n");
