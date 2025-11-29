// src/scripts/print-seven-vowels.ts
// Simple debug script to prove the Seven-Vowels core is wired correctly.
// Run it with:  npx tsx src/scripts/print-seven-vowels.ts

import { sevenVowelsClient, getVowelView } from "../lib/sevenVowelsClient";

function run() {
  console.log("Seven-Vowels Core v1\n");

  for (const v of sevenVowelsClient.VOWELS) {
    const view = getVowelView(v);
    const t = view.trait;

    console.log(
      [
        `Vowel: ${view.symbol}`,
        `index: ${sevenVowelsClient.indexOf(v)}`,
        `ring: ${sevenVowelsClient.ringOf(v)}`,
        t.label ? `label: ${t.label}` : null,
        t.role ? `role: ${t.role}` : null,
        t.force ? `force: ${t.force}` : null,
        t.color ? `color: ${t.color}` : null,
      ]
        .filter(Boolean)
        .join(" | ")
    );
  }

  console.log("\nDone.");
}

run();
