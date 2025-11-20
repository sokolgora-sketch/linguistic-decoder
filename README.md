# Linguistic Decoder

This is an application for linguistic analysis based on the "Seven-Voices" model. It decodes words into their primary and frontier phonetic paths by analyzing vowel levels and rings. The engine is particularly aware of Albanian phonology and can provide dialect-specific insights.

## How to run it

To get started with the project, run the following commands:

```bash
# Install dependencies
npm ci

# Start the development server
npm run dev

# Run the test suite
npm test

# Run the parameter sweep evaluation script
npx tsx scripts/sweep.ts
```

## What can I click?

The user interface provides several key features:

- **Word Analysis**: The main page where you can type a word to see its primary and frontier paths, view how consonants influence the score, and export the raw analysis as a JSON file.
- **History Panel**: View your personal analysis history. Entries can be loaded, recomputed, or deleted. Clearing the entire history requires a double confirmation to prevent accidental data loss.
- **Batch Eval Panel**: Upload a "gold set" CSV file to run batch analysis and see performance statistics, which is useful for regression testing and engine tuning.
