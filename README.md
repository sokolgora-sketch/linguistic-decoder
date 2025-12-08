# Linguistic Decoder

This is an application for linguistic analysis based on the **Seven-Voices** model.  
It decodes words into their primary and frontier phonetic paths by analyzing vowel
levels and rings. The engine is particularly aware of Albanian phonology and can
provide dialect-specific insights.

## How to run it

To get started with the project, run:

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

What can I click?

The main UI is a single page made of a few cards:

Analyze a word
Type a word, pick the Mode (strict, etc.) and Alphabet (auto, latin, …),
then click Analyze or press Enter to run the Seven-Voices engine.

Engine meta
Debug card that shows which engine and build were used
(for example SevenVoices Core, 0.2.0-symbolic), plus the mode and alphabet.
It also includes a dev button to Copy JSON with the raw analysis payload.

Heart summary
Shows the primary Seven-Voices path for the word:

Voice path (e.g. U → I)

Level path (low / mid / high)

Ring path (1 → 1, 1 → 3, etc.)

When available, alternative paths are listed below the primary path.

Language families (experimental)
Table where the engine lists plausible language families for this word, with:

Language (e.g. Latin, Albanian)

Form (surface form used by the engine)

Pivot (core syllable/root)

Status (core, effort, …)

Optional tags describing the role of that candidate.

Symbolic reading (experimental)
A short Zheji-inspired symbolic reading of the word.
Shows a label and up to a handful of de-duplicated notes, for example:

“Represents a conscious application of will.”

Recent words (this session)
Lightweight history of the last heart paths you ran in this browser session:
word, voice path, level path, and ring path.

Compare two words
Panel that lets you run the engine on two words side-by-side.

Both inputs must be filled; otherwise you see
“Enter both words before comparing.”

Each side shows its own loading and error state.

Results are rendered with the same engine meta + heart logic as the single
analysis view, but in a compact compare layout.

Keyboard & validation behaviour

Press Enter in the Analyze a word input to trigger analysis
(same as clicking Analyze).

In Compare two words, pressing Enter in either input runs the comparison
when both fields are non-empty.

Empty inputs surface friendly validation messages instead of sending
empty requests to the API.


---

Next steps for you:

1. Open `README.md` in VS Code.
2. Select all, paste this version over it.