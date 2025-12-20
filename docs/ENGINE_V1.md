# ZË-RO Engine v1.0 – Draft Spec

This document defines what “engine v1.0” means for the ZË-RO etymology engine.

We treat v1.0 as the first **stable** contract:
same input + same config = same JSON shape and same behaviour.

---

## 1. Scope of v1.0

v1.0 includes:

- Seven-Vowels math core (`sevenVowelsCore.ts`).
- Deterministic candidate generation (Search-Operation rules).
- Stable `analyzeWord(word, mode)` JSON contract.
- A small gold set of test words with snapshot/regression tests.
- One main word-analysis UI + public share (even if share is in-memory in dev).

Out of scope for v1.0:

- Fancy visualizations (big 7-rings animations, timelines, etc.).
- Multi-word phrases or full sentences.
- Heavy Firestore history / analytics.
- Multi-user accounts or auth.

---

## 2. Seven-Vowels Core (Math7)

Core concepts:

- Vowels drive the system: `A, E, I, O, U, Y, Ë`.
- Consonants are “clothes”; vowels are the “heart”.
- Path = sequence of vowels in the word.
- Vector = counts of each vowel.
- Rings:
  - INNER: I, U
  - MIDDLE: E, Y
  - OUTER: A, Ë
  - MEDIATOR: O (special role)

Implementation (v1.0):

- `extractVowelPath(word: string): VoicePath`
- `voiceVectorFromPath(path: VoicePath): VoiceVector`
- `summarizeWordMath7(word: string): Math7Summary`

`Math7Summary` (target shape):

- `path: VoicePath`
- `totalVoices: number`
- `vector: VoiceVector`
- `dominantVoices: Voice[]`
- `ringWeights: { inner: number; middle: number; outer: number; mediator: number }`
- `signals: string[]` (simple text notes)

---

## 3. Search-Operation Rules (Candidates)

Legal operations in v1.0:

- Vowel swaps only among `{A, E, I, O, U, Y, Ë}`.
- `s ↔ sh`
- `g ↔ gj`
- Optional `h/j` around `gu/gi`.
- Final `-a/-ë` toggles.
- Compounding of smaller parts.

Candidate structure:

- `form: string`
- `pieces: string[]` (smallest functional units)
- `opsUsed: string[]` (which transforms were applied)

v1.0 expectation: every candidate must be explainable using only these rules.

---

## 4. analyzeWord v1.0 – Target JSON

Entry point:

```ts
analyzeWord(word: string, mode: "strict" | "open"): AnalysisResult
```