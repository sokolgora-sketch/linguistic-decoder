// @ts-nocheck
import fs from "node:fs/promises";
import path from "node:path";

// IMPORTANT: This import is based on the usage in tests/analyzeWord.spec.ts
import { analyzeWord } from "../src/engine/analyzeWord";

// Words you want to export in one shot.
// Tweak this list anytime.
const WORDS = [
  "study",
  "love",
  "language",
  "trust",
  "hope",
];

async function runOne(word: string) {
  console.log(`→ Analyzing "${word}" ...`);

  // This call is based on how analyzeWord is used in tests/analyzeWord.spec.ts
  const result = analyzeWord(word, "strict");

  console.log(
    `✓ Done "${word}" (engineVersion: ${result.meta.engineVersion ?? "n/a"})`
  );

  return result;
}

async function main() {
  const results: any[] = [];

  for (const word of WORDS) {
    const res = await runOne(word);
    results.push(res);
  }

  const outDir = path.join(process.cwd(), "exports");
  await fs.mkdir(outDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outPath = path.join(outDir, `batch-${timestamp}.json`);

  await fs.writeFile(outPath, JSON.stringify(results, null, 2), "utf8");

  console.log("\n======================================");
  console.log(`Saved ${results.length} entries to:\n  ${outPath}`);
  console.log("======================================\n");
}

main().catch((err) => {
  console.error("Batch export failed:", err);
  process.exit(1);
});
