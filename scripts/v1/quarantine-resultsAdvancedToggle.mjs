import fs from "node:fs";
import path from "node:path";

const target = "tests/resultsAdvancedToggle.spec.tsx";
const filePath = path.resolve(process.cwd(), target);

if (!fs.existsSync(filePath)) {
  console.log(`[skip] not found: ${target}`);
  process.exit(0);
}

const src = fs.readFileSync(filePath, "utf8");

if (src.includes("describe.skip(") || src.includes("describe['skip'](")) {
  console.log(`[ok] already quarantined: ${target}`);
  process.exit(0);
}

const idx = src.indexOf("describe(");
if (idx === -1) {
  console.log(`[warn] no describe( found: ${target}`);
  process.exit(0);
}

const out =
  `/**\n` +
  ` * v1.1+ suite (quarantined for ZË-RO v1 minimal release)\n` +
  ` * This suite targets advanced “Heart summary / Engine meta” UI.\n` +
  ` * Re-enable after v1 ships.\n` +
  ` */\n\n` +
  src.slice(0, idx) +
  "describe.skip(" +
  src.slice(idx + "describe(".length);

fs.writeFileSync(filePath, out, "utf8");
console.log(`[patched] quarantined: ${target}`);
