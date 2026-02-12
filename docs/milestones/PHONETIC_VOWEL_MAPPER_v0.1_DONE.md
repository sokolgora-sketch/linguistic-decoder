# Phonetic Vowel Mapper v0.1 — DONE Criteria

Goal: deterministic IPA → Seven Voices extraction (phonetic rail), with mapping + parser contract-locked.

## Scope
- Input: IPA string (no G2P; no network)
- Output: `voices[]` + `diagnostics` (including `unmapped`), deterministic across runs
- Policy: v0.1 remains stable; v0.2 expands coverage

## SSOT Modules
- Mapping table (expanded coverage): `src/shared/vowels/ipaVowelMap.v0.2.ts`
- Parser (combining marks ignored deterministically): `src/shared/vowels/parseIpaVowels.v0.2.ts`
- Phonetic math lane: `src/shared/math7.phonetic.v0.1.ts`

## DONE Criteria (must all pass)

### A) Mapping table is contract-locked
- Test: `tests/vowels/ipaVowelMap.v0.2.lock.spec.ts`
- Snapshot: `tests/vowels/__snapshots__/ipaVowelMap.v0.2.lock.spec.ts.snap`
- Guarantees: any change to `IPA_VOWEL_MAP_V0_2` is explicit + reviewable.

### B) Parser behavior is deterministic + stable
- Test: `tests/vowels/parseIpaVowels.v0.2.spec.ts`
- Guarantees:
  - codepoint iteration is stable
  - combining marks are ignored deterministically
  - unmapped symbols are surfaced in diagnostics

### C) v0.2 rails use v0.2 parser (no split-brain)
- Lock: `tests/validation/dataset.lock.v0.2.spec.ts` must validate IPA using `parseIpaVowelsV0_2`
- Guarantees: dataset lock checks the same IPA SSOT runtime rails use.

### D) Engine + API wiring proves end-to-end behavior
- Tests:
  - `tests/math7/ipa.phonetic.v0.1.spec.ts`
  - `tests/apiAnalyzeV1.ipaInput.v0.1.spec.ts`
- Guarantees: phonetic extraction survives real integration paths.

## Proof Command
Run:
- `npm test -- tests/vowels/ipaVowelMap.v0.2.lock.spec.ts tests/vowels/parseIpaVowels.v0.2.spec.ts tests/math7/ipa.phonetic.v0.1.spec.ts tests/validation/dataset.lock.v0.2.spec.ts tests/apiAnalyzeV1.ipaInput.v0.1.spec.ts`
- `npm run gate:quick`
