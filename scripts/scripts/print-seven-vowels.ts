// src/scripts/print-seven-vowels.ts
// Debug helper: print all seven vowels with index, ring, and traits.
import { sevenVowelsClient, getVowelView } from "../lib/sevenVowelsClient";

function main() {
  console.log("symbol\tindex\tring\ttrait");

  for (const v of sevenVowelsClient.VOWELS) {
    const view = getVowelView(v);
    const index = sevenVowelsClient.indexOf(v);
    const ring = sevenVowelsClient.ringOf(v);

    // Don't rely on any specific field name on trait; just dump the object.
    const traitSummary = JSON.stringify(view.trait);

    console.log(`${view.symbol}\t${index}\t${ring}\t${traitSummary}`);
  }
}

main();
