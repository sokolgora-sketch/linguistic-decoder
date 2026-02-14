# Voice Doctrine v0.1 (Symbolic SSOT)

This doctrine defines **symbolic correspondences** for the Seven Voices:

- Symbolic Order: **A E I O U Y Ë**
- Colors (rainbow ladder)
- Notes (7-note diatonic correspondence)
- Principles (project doctrine set)

## Critical distinction: Physics vs Symbolism

### Physics constraints (testable)
- Consonants do not carry sustained tone on their own.
- Vowels are the carrier system.
- Orthography and IPA mapping are enforced by SSOT modules in `src/shared/vowels/*`.

### Symbolic correspondences (chosen)
- Color, note, and principle mappings are **not acoustic truth**.
- They are a **coherent internal language** used for UI, teaching, and narrative consistency.

Both are valid — but they are different categories.

## Source of truth
This doc is backed by the code contract:

- `src/shared/doctrine/voiceDoctrine.v0.1.ts`
- Locked by `tests/doctrine/voiceDoctrine.v0.1.lock.spec.ts`
