# ZË-RO Versioning & Snapshot Policy (Solo) — v1

Date: 2025-12-28  
Mantra: lock behavior first; explain every change; version everything.

This policy keeps the engine a reproducible instrument. Snapshots are the lock; version bumps are the key.
It prevents accidental drift when you are tired, moving fast, or context-switching.

---

## 1) Version levers (four fields, no ambiguity)

**engineVersion**
- Bump when analysis behavior changes (even if JSON shape stays the same).
- Example: candidate ordering changes; new hypothesis is added; functionalRoots extractor expands.

**contractVersion**
- Bump when JSON shape **or semantics** change (fields added/removed/renamed; meaning of a field changes).
- Example: DeepRootOutput adds `functionalRoots` (even if optional); rename `candidates` → `hypotheses`.

**rulesetVersion**
- Bump when DeepRoot/hypothesis rules, gates, or tie-breakers change.
- Example: how protoRoots are derived; how carrier ops are filtered; “pass/fail” constraints change.

**canonVersion**
- Bump when the canon word list, battery policy, or fixtures change.
- Example: adding/removing a gold word; changing expected outputs for canon battery.

---

## 2) Snapshot rules (hard)

- Never update snapshots to “make tests pass.” Update only for intended behavior changes.
- If snapshots change, bump **at least one** of:
  - `engineVersion`, `contractVersion`, `rulesetVersion`, `canonVersion`.
- If diffs are caused by unstable fields (timestamps, request ids), remove/normalize those fields instead of snapshotting them.
- Keep changes small:
  - Prefer one commit for code, and a separate commit for snapshot updates.

---

## 3) Solo checklist before you push

- Run the full gate:
  - `npx next lint`
  - `npm test --silent`
  - `npm run build`
- Read at least one snapshot diff end-to-end (use a representative word like `study` or `damage`).
- Write a 3-line note in your PR/commit description:
  1) what changed
  2) why it changed
  3) which words demonstrate it

---

## 4) Never do this (self-sabotage list)

- Run `jest -u` blindly. Always inspect diffs first.
- Mix **Surface** and **Candidate** evidence:
  - Surface = literal vowels from basis.
  - Candidates = transformed forms with ops recorded.
- Introduce non-determinism into contract-visible output.
- Duplicate vowel order/mapping in more than one file.
