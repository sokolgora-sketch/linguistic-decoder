# SEVEN PRINCIPLES — NOTE MAPPING v0.1 (CANON)

Status: LOCKED (v0.1)
Scope: Defines the single canonical mapping between the Seven Principles (A,E,I,O,U,Y,Ë) and 7-note Western scale letters (C D E F G A B).
Rationale: Stable, deterministic “musical lens” that can be used consistently across engine output, UI, tests, and docs.

## Canon mapping (v0.1)

| Vowel / Principle | Principle ID | Label       | Note |
|---|---|---|---|
| A | TRUTH      | Truth      | C |
| E | EXPANSION  | Expansion  | D |
| I | INSIGHT    | Insight    | E |
| O | BALANCE    | Balance    | F |
| U | UNITY      | Unity      | G |
| Y | REFLECTION | Reflection | A |
| Ë | EVOLUTION  | Evolution  | B |

## Rules

1) Deterministic: mapping must never depend on locale, runtime, or user settings.
2) Canonical order: A → E → I → O → U → Y → Ë.
3) Notes are letters only (C D E F G A B). Octave is intentionally NOT specified in v0.1.
4) UI MUST display the user-facing note letter from this mapping (not derived ad-hoc).
5) If future versions add octave or frequency (Hz), they must preserve this letter mapping as the base.

## DONE criteria

- [ ] Mapping exists in code as a single source of truth (no duplicated ad-hoc maps).
- [ ] At least one unit test asserts the mapping for all 7 vowels.
- [ ] UI consumes the mapping through VM/adapters (no raw payload parsing).
- [ ] `npm run gate:quick` passes on main.

## Change policy

Any modification requires:
- new versioned doc (v0.2+),
- explicit PR note in release/milestone section,
- updated tests/snapshots.
