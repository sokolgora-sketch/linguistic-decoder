import fs from "node:fs";
import path from "node:path";

const snapPath = path.join(
  "tests",
  "__snapshots__",
  "engineContract.v1.capture.gold.spec.ts.snap"
);

if (!fs.existsSync(snapPath)) {
  console.error("Snapshot file not found:", snapPath);
  process.exit(1);
}

const text = fs.readFileSync(snapPath, "utf8");

// exports[`name`] = `...`;
const re = /exports\[`([^`]+)`\]\s*=\s*`([\s\S]*?)`;/g;

let m;
let total = 0;
let bad = 0;

function unwrapMaybeQuoted(s) {
  const t = s.trim();

  // Typical Jest string snapshot:
  // `"{\n  "a": 1\n}"`
  if (t.startsWith('"') && t.endsWith('"')) {
    return t.slice(1, -1);
  }

  return t;
}

while ((m = re.exec(text))) {
  total++;
  const name = m[1];
  const raw = m[2];

  try {
    const inner = unwrapMaybeQuoted(raw);
    JSON.parse(inner);
    console.log(`OK: ${name}`);
  } catch (e) {
    bad++;
    console.log(`\n--- ${name} ---`);
    console.log("NOT JSON-parseable.");
    console.log("First 200 chars:\n");
    console.log(raw.trim().slice(0, 200));
    console.log("\nLast 50 chars:\n");
    console.log(raw.trim().slice(-50));
    console.log("\nError:", e?.message ?? String(e));
  }
}

console.log(`\nScanned ${total} snapshots.`);
if (bad) process.exit(1);
