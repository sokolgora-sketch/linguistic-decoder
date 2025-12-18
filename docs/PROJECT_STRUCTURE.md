# ZË-RO Project Structure (v1 baseline)

## Canonical rule (v1)
We use the **root app router**:

- `app/` is the only active Next.js App Router directory in v1.

`src/` is reserved for engine + utilities (pure TS modules), not routes.

## Why
Having both `app/` and `src/app/` in one repo creates ambiguity:
- Developers edit the wrong page/route.
- Tests and runtime can drift.
- Future refactors become risky.

## Current policy
- Keep: `app/`
  - `app/page.tsx` (v1 one-page UI)
  - `app/api/analyze/route.ts` (v1 API)
- Treat as legacy (v1.1+ / old prototype): `src/app/`

## Next cleanup step (after this doc lands)
Rename legacy routes folder:
- `src/app` → `src/app__legacy` (or move under `legacy/`)

Do this only after running tests so we can catch any direct imports that still reference `src/app`.
