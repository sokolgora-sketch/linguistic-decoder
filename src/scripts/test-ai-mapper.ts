
import 'dotenv/config';
require("ts-node/register");
require("tsconfig-paths/register");

import { analyzeClient } from "@/lib/analyzeClient";

async function main() {
  const word = process.argv[2];
  if (!word) {
    console.error("Please provide a word to analyze.");
    console.log("Usage: npx tsx src/scripts/test-ai-mapper.ts <word>");
    process.exit(1);
  }

  console.log(`Analyzing "${word}" with AI Mapper enabled...`);

  try {
    const result = await analyzeClient(word, "strict", "auto", { useAi: true, bypass: true });
    console.log("Analysis Complete!");
    console.log("===================");
    console.log(JSON.stringify(result, null, 2));

    if (result.languageFamilies && result.languageFamilies.length > 0) {
        console.log("\n✅ AI Mapper appears to be working correctly.");
    } else {
        console.warn("\n⚠️ AI Mapper returned no language families. Check for fallback signals.");
    }

  } catch (error) {
    console.error("\n❌ An error occurred during analysis:");
    console.error(error);
    process.exit(1);
  }
}

main();
