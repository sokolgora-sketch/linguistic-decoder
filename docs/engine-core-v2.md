# Engine Core v2 — Seven-Voices Heart Snapshot

Status: **internal / stable**
Source: Seven-Voices engine v2
Endpoint: `GET /api/analyze-core?word={word}&mode=strict|open&alphabet=auto|latin|...`

This is the **minimal heart snapshot** for a single word.  
It is a strict subset of the full `AnalysisResult` — enough for:

- Visual heart views
- Compare-Two-Words heart summaries
- Future U&AI / Linguistic Decoder integrations

---

## Example payload

```jsonc
{
  "word": "study",
  "engineVersion": "2025-11-16-core-2",

  "input": {
    "raw": "study",
    "normalized": "study",
    "alphabet": "auto",
    "languageGuess": "unknown",
    "languageConfidence": "medium",
    "dialectGuess": "geg",
    "mode": "strict"
  },

  "voices": {
    "vowelVoices": ["U", "I"],
    "ringPath": [1, 1],
    "levelPath": ["low", "high"],
    "dominantVoices": {}
  },

  "consonants": {
    "clusters": [],
    "overallHarmony": {
      "byVoice": {},
      "globalHarmonyScore": 0
    }
  },

  "heartPaths": {
    "primary": {
      "voiceSequence": ["U", "I"],
      "ringPath": [1, 1],
      "tensionLevel": "low"
    }
  },

  "frontierCount": 7
}
```

### Core snapshot (`core`)

The engine now exposes a **minimal, stable "heart" view** of each analysis under the `core` field.

This object is designed for:

- UIs that only need the **Seven-Voices heart** summary
- Lightweight exports (no heavy frontier, math, or language trees)
- Future tools that run **comparisons** or **statistics** over many words

#### Shape

```jsonc
{
  "word": "study",
  "engineVersion": "2025-11-16-core-2",

  "input": {
    "raw": "study",
    "normalized": "study",
    "alphabet": "auto",
    "languageGuess": "unknown",
    "languageConfidence": "medium",
    "dialectGuess": "geg",
    "mode": "strict"
  },

  "voices": {
    "vowelVoices": ["U", "I"],
    "ringPath": [1, 1],             // ring indexes over the path
    "levelPath": ["low", "high"],   // low / mid / high
    "dominantVoices": {}
  },

  "consonants": {
    "clusters": [],
    "overallHarmony": {
      "byVoice": {},
      "globalHarmonyScore": 0
    }
  },

  "heartPaths": {
    "primary": {
      "voiceSequence": ["U", "I"],   // main path through the heart
      "ringPath": [1, 1],
      "tensionLevel": "low",         // low / medium / high
      "frontierCount": 7             // number of viable alternates
    }
  }
}
```

#### Guarantees

core is small and stable compared to the full analysis.

core.heartPaths.primary is always present when an analysis succeeds.

The full analysis still contains everything, and now simply re-embeds this same object under core so UI layers don’t need to recompute it.

### Field breakdown
Top-level

word: string
The word as requested by the client (after basic trimming).

engineVersion: string
Semantic / date-style version of the core engine.
Used by UIs and external clients to decide how to interpret the payload.

input

Echo of how the engine saw the word:

raw: original user input.

normalized: lower-cased, stripped, engine-ready form.

alphabet: "auto" or a concrete alphabet ("latin", "cyrillic", …).

languageGuess: engine’s best guess (e.g. "en", "sq"), or "unknown".

languageConfidence: "low" | "medium" | "high".

dialectGuess: free-text hint ("geg", "tosk", "none", …).

mode: "strict" or "open" — same as /api/analyze.

Clients can use input for logging, debugging and future stats.

voices

Core vowel-only view of the path:

vowelVoices: string[]
Ordered sequence of Seven-Voices symbols actually used by the solver.
Example: ["U", "I"].

ringPath: number[]
Same length as vowelVoices. Each item is the ring index for that step
(e.g. 0 = center, 1 = inner, 2 = middle, 3 = outer).

levelPath: ("low" | "mid" | "high")[]
Vertical movement for each step. Indexed like vowelVoices.

dominantVoices: { [voice: string]: number }
Optional map of “how dominant” each vowel is in this word.
(For now often {}; kept for future analytics.)

Invariant:
vowelVoices.length === ringPath.length === levelPath.length.

consonants

Compressed consonant information:

clusters: minimal representation of consonant clusters (may be empty).

overallHarmony:

byVoice: map of harmony scores per vowel voice (0–1 scale, internal).

globalHarmonyScore: single scalar summarising consonant-vowel fit.

This block is “nice to have” for future research and harmony scoring,
but UI must not depend on exact scoring range.

heartPaths

The heart view is the solver’s “best path” through the Seven-Voices rings.

primary:

voiceSequence: string[] — main vowel path, usually mirrors vowelVoices.

ringPath: number[] — ring for each step of voiceSequence.

tensionLevel: "low" | "medium" | "high" — how “stretched” this path is.

Clients should treat primary as the official heart for the word.

Future versions may add more entries (e.g. secondary, shadow) but must not
break the shape of primary.

frontierCount

frontierCount: number
How many near-optimal alternates the engine considered for this word.

Used for:

UI frontier grid (“alt-0 … alt-N”).

Rough sense of how many plausible alternate paths exist:

0–3 → very stable word

4–10 → interesting

>10 → highly ambiguous / rich

Compatibility notes

Engine Core v2 is downward-compatible with v1 for all fields above.

New fields must be:

additive,

optional for clients,

or safely defaulted.

Any external consumer (U&AI, other apps) should only rely on the fields
documented in this file.
