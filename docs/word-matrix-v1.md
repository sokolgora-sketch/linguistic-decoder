# Word Matrix v1 – spec (engine + UI)

## Purpose

Give a compact, structured view of the engine’s internal reading for a word:
- 1 row for the primary Heart path.
- 7 rows for Frontier alternatives (alt-1 … alt-7).
- Optional rows for language families (Latin, Albanian, etc).

This is a *summary* card, not the full internal matrix.

---

## Data shapes

```ts
// One row in the matrix
export type WordMatrixRow = {
  id: string;          // "primary", "alt-1", "latin-core", etc.
  label: string;       // Short label shown in UI
  voicePath: string;   // e.g. "U → I" or "A → U → A → E"
  levelPath?: string;  // optional
  ringPath?: string;   // optional
  meta?: {
    kind: "heart" | "frontier" | "language";
    tags?: string[];   // e.g. ["Latin", "core", "effort"]
  };
};

export type WordMatrixV1 = {
  word: string;        // sanitized word
  rows: WordMatrixRow[];
};
```