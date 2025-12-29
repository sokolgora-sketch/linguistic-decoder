# ProtoRoots Library v1

Purpose: a deterministic, curated dictionary of minimal functional roots (proto-roots) and their carrier forms across languages/dialects.

This library is the foundation for DeepRoot Minimal Roots + Carriers (the “stu–di / shtu–di–m” capability).

## Design Rules

1) **No runtime invention**
- The engine must not generate new proto-roots during analysis.
- If a root is not in the library, it cannot be used as a minimal-root explanation.

2) **Minimal meaning**
- Each proto-root should represent a small functional unit, not a full etymological chain.
- Keep gloss short and operational (what function it performs in decomposition).

3) **Carriers are concrete**
- Each carrier is a surface form in some language/dialect.
- Carriers do not claim “true origin” by themselves; they are just allowed anchors.

4) **Determinism**
- File is versioned (v1). New changes are explicit edits.
- Order matters for stable diffs; append new roots at the end.

## Data Model (TypeScript)

File: `src/shared/protoRoots.v1.ts`

Each proto-root includes:

- `id` (e.g., DI, SHTU, DA, AT)
- `gloss` (short meaning/function label)
- `roleHint` (Action | Function | Unit | Modifier | Unknown)
- `carriers[]`
  - `lang` (e.g., sq, en, la, grc, sa)
  - optional `dialect` (Gheg/Tosk)
  - `form` (carrier form)
  - optional `gloss` and `notes`

## Contribution Rules

When adding a new proto-root:

- Prefer 2–6 carriers max initially.
- Add notes if the carrier is weak/ambiguous.
- Avoid adding “big” words as proto-roots; keep roots minimal.
- Do not add speculative claims in code. Put cautious notes if needed.

## Library Size Targets

- v1 start: 50–200 roots.
- Expand incrementally with tests and canon words.
