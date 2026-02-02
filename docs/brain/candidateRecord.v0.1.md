# CandidateRecord v0.1 (BRAIN-0)

**Version:** `brain.candidateRecord.v0.1`  
**Purpose:** The only contract shape the Brain is allowed to hand to the Heart (after normalization).  
**Rules:** No ranking, no scoring, no inference. Deterministic normalization. Reject invalid.

---

## Contract: `CandidateRecord`

Required fields:

- `v`: must equal `brain.candidateRecord.v0.1`
- `languageId`: stable WLT language node id (string, non-empty)
- `languageName`: display name (string, non-empty)
- `form`: carrier form in that language (string, non-empty)
- `gloss`: short gloss (string, non-empty)
- `roots[]`: proto-root tags (array, must normalize to >= 1 valid token)
- `opsUsed[]`: declared op tokens used to connect segment↔carrier (array; may be empty)
- `source`: provenance object (required)

Optional fields:

- `explains[]`: links to input segments
  - `{ segment: string, note?: string }`
- `functionTag`: `"ACTION" | "FUNCTION" | "UNIT" | "UNKNOWN"`

Provenance:

- `source.kind`: `"SEED" | "DATASET"`
- `source.ref`: human-readable reference (non-empty)
- `source.version`: producing artifact version (non-empty)

---

## Normalization Law v0.1

Normalization is performed by:

- `src/shared/brain/candidateRecord.normalize.v0.1.ts`

Deterministic behaviors:

1. **Whitespace law**
   - All text fields: `trim`, and squeeze internal whitespace to single spaces.

2. **Roots canonicalization**
   - `roots[]` items:
     - canonical form: `trim + squeeze + uppercase`
     - stable unique: keep first occurrence order
     - drop empty after cleaning
   - Token law (strict): `^[A-Z0-9_-]{1,24}$`
     - Any root violating token law rejects the record.

3. **opsUsed canonicalization**
   - canonical form: `trim + squeeze` (no legality enforcement here; Heart validates allowed ops)
   - stable unique
   - token constraints:
     - length ≤ 64
     - must not contain newlines

4. **explains validation**
   - `segment`:
     - canonical form: `trim + squeeze`
     - length ≤ 32
     - must not contain newlines
   - `note`:
     - canonical form: `trim + squeeze`

5. **source validation**
   - kind must be exactly `"SEED"` or `"DATASET"`
   - `ref` and `version` must be non-empty after cleaning

6. **Never-throw rule**
   - Normalizer never throws.
   - If invalid: returns `{ ok: false, errors: [...] }` with stable unique errors.

---

## Determinism & Caching Notes

- CandidateRecord is designed for deterministic caching by `{word|engineVersion|mode}` upstream.
- Seed fallback uses:
  - `src/shared/brain/seedLexicon.v0.1.ts`
  - deterministic `wlt:seed.auto` record(s)
- UI must render from ViewModels/adapters only; raw records are treated as data.

---

## Tests

Existing:
- `tests/brain.candidateRecord.v0.1.spec.ts`
- `tests/originClaim.brainCandidates.sidechannel.v0.1.spec.ts`

Guard (BRAIN-0.3):
- `tests/originClaim.builder.singleSource.guard.spec.ts`
