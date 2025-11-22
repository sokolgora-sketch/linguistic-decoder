# Math7 / Seven-Principles Heart Summary — Spec v1

## Purpose

The **Math7 / Heart** layer is a *secondary* analysis built on top of the Seven-Voices solver.

- Input: the existing `AnalyzeWordResult` (core engine output).
- Output: a compact, deterministic summary of the **primary voice path** in terms of the **Seven Principles**.
- This layer does **not** change the core solver – it only reads the primary path and derives extra structure.

The goal is to be a stable contract for UI, APIs, and future AI helpers.

---

## Data shape

The core result gains an optional field:

```ts
// Conceptual only – actual type names may differ in engineShape.ts
type Math7Summary = {
  primary: {
    voicePath: string;        // e.g. "U → I"
    levelPath: string;        // e.g. "Low → High"
    ringPath: string;         // e.g. "1 → 1"

    state: "flow" | "cycle";  // "flow" if first ≠ last vowel, "cycle" if first == last
    totalSteps: number;       // number of steps in primary path (length of voice path)
    totalMod7: number;        // totalSteps % 7, but 0 is mapped to 7 (1..7 only)

    principlesPath: string[]; // mapped sequence of Seven Principles, same length as voice path
  };
};


This is attached to the normal analysis:

type AnalyzeWordResultWithMath7 = AnalyzeWordResult & {
  math7?: Math7Summary;
};
```

If the engine cannot produce a primary path for a word, it may simply omit `math7`.

## Principles map (vowel → principle)

The Math7 layer uses a fixed, deterministic mapping from vowels (Seven Voices) to principles:

| Voice | Principle         | Short meaning (v1)                                |
| :---- | :---------------- | :------------------------------------------------ |
| A     | Truth / Action    | Source, decision, initiating force                |
| E     | Expansion         | Growth, unfolding, projection                     |
| I     | Insight           | Focused knowing, inner clarity                    |
| O     | Balance           | Mediation, harmony, stabilising centre            |
| U     | Unity             | Connection, togetherness, shared field            |
| Y     | Network Integrity | Structure, links, channels, information flow      |
| Ë     | Evolution         | Transition, mutation, completion into new         |

Internal engine logic always uses the real vowels.
The UI is free to mask them with symbols / colours / icons if we want to keep the order secret.
