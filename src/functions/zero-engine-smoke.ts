// src/functions/zero-engine-smoke.ts
// Smoke test for Layer 2 (Mind) DeepRoot builder.
// This does NOT touch your real engine. It just:
//  - builds fake HeartResult objects for "damage", "dëmtim" and "study"
//  - runs buildDeepRootFromHeart
//  - logs the DeepRootResult to console

import { computeDeepRootForWord } from "./zero-engine-deep-root";

async function main() {
  const testCases = [
    "damage",
    "dëmtim",
    "study",
    "mathematics",
    "religion",
    "mystery",
    "philosophy",
    "filozofi",
    "language",
  ];

  console.log("=== ZË-RO DeepRoot smoke test ===");

  for (const word of testCases) {
    const deepRoot = computeDeepRootForWord(word);

    console.log(`\n--- DeepRoot for '${word}' ---`);
    if (!deepRoot) {
      console.log(`No DeepRootResult produced for '${word}'.`);
    } else {
      console.log(JSON.stringify(deepRoot, null, 2));
    }
  }

  console.log("\n=== smoke test done ===");
}

// Allow running via: npx tsx src/functions/zero-engine-smoke.ts
main().catch((err) => {
  console.error("Smoke test error:", err);
  process.exit(1);
});
