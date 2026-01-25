# Seven Principles — Note Mapping v0.1

## Goal
Define a stable 7-note mapping aligned to the Seven Principles vowels (A,E,I,O,U,Y,Ë) and keep it deterministic across engine + UI.

## Canonical Mapping (v0.1)
Using the natural diatonic letters:

- A → C
- E → D
- I → E
- O → F
- U → G
- Y → A
- Ë → B

Rationale: A starts the sequence at C (neutral “tonic” anchor), then proceeds stepwise through the 7 natural notes without accidentals.

## Source of Truth
- `src/shared/sevenPrinciples.v1.ts`
  - `VOWEL_TO_NOTE_V0_1`
  - `vowelToNote(vowel: Vowel): Note`

## DONE Criteria
1) `VOWEL_TO_NOTE_V0_1` exists and matches the canonical mapping above.
2) `vowelToNote()` returns from `VOWEL_TO_NOTE_V0_1`.
3) Unit test locks the mapping:
   - `tests/sevenPrinciples.noteMapping.v0.1.spec.ts`
4) `npm run gate:quick` passes on main after merge.
