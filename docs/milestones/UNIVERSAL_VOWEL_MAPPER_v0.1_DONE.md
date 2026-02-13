# Universal Vowel Mapper v0.1 — DONE Criteria

Goal: deterministic **orthography → Seven Voices** mapping (Latin + diacritics + Greek), with mapping tables + overrides contract-locked so drift can’t happen silently.

## Scope
- Input: written word (Unicode), optional `langHint`
- Output: `{ voices[], tokens[], diagnostics{ unmapped[], usedOverrides } }`
- Deterministic, no I/O, no network, no G2P
- Policy:
  - Latin base map v0.1 stays stable (foundation)
  - v0.2 extends orthography support (Greek + registry overrides + mapper behavior)

## SSOT Modules (Orthography)
- Mapper (SSOT): `src/shared/vowels/mapVowels.v0.2.ts`
- Base Latin table (locked): `src/shared/vowels/vowelMap.baseLatin.v0.1.ts`
- Base Greek table (v0.2): `src/shared/vowels/vowelMap.baseGreek.v0.2.ts`
- Overrides registry (v0.2): `src/shared/vowels/vowelMap.registry.v0.2.ts`

## DONE Criteria (must all pass)

### A) Latin foundation is locked
- Test: `tests/vowels/vowelMap.baseLatin.v0.1.lock.spec.ts`
- Guarantee: the v0.1 Latin mapping table cannot change without an explicit snapshot diff.

### B) v0.2 mapper behavior is deterministic and stable
- Test: `tests/vowels/mapVowels.v0.2.spec.ts`
- Guarantees:
  - deterministic tokenization + mapping
  - parity with v0.1 for Latin canon samples
  - Greek mapping works for monotonic + polytonic (via NFD base fallback)

### C) v0.2 tables + overrides are contract-locked (anti-drift)
- Lock tests:
  - `tests/vowels/mapVowels.v0.2.lock.spec.ts`
  - `tests/vowels/vowelMap.baseGreek.v0.2.lock.spec.ts`
  - `tests/vowels/vowelMap.registry.v0.2.lock.spec.ts`
- Guarantees:
  - any change to mapper tables/behavior/overrides becomes a visible snapshot diff
  - review must be intentional

## Proof Command
Run:
- `npm test -- tests/vowels/vowelMap.baseLatin.v0.1.lock.spec.ts tests/vowels/mapVowels.v0.2.spec.ts tests/vowels/mapVowels.v0.2.lock.spec.ts tests/vowels/vowelMap.baseGreek.v0.2.lock.spec.ts tests/vowels/vowelMap.registry.v0.2.lock.spec.ts`
- `npm run gate:quick`
