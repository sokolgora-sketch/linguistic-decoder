
// Set a flag to signal a test environment BEFORE other imports.
process.env.IS_TEST_SCRIPT = 'true';

import { config } from 'dotenv';
config(); // Load .env.local for GOOGLE_GENAI_API_KEY

import { analyzeClient } from '../lib/analyzeClient';
import type { Alphabet } from '@/lib/solver/engineConfig';

async function testAiMapper() {
  const word = process.argv[2];
  if (!word) {
    console.error('Please provide a word to analyze.');
    console.log('Usage: npx tsx src/scripts/test-ai-mapper.ts <word>');
    process.exit(1);
  }

  console.log(`Analyzing "${word}" with AI Mapper enabled...`);

  try {
    const { payload } = await analyzeClient(word, 'strict', 'auto' as Alphabet, { useAi: true });
    console.log('\n✅ Analysis complete. Full payload:');
    console.log(JSON.stringify(payload, null, 2));
  } catch (e) {
    console.error('\n❌ An error occurred during analysis:');
    console.error(e);
    process.exit(1);
  }
}

testAiMapper();
