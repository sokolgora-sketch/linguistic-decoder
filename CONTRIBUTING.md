# Contributing

This repo is run as a deterministic instrument. Stability beats speed.

## Non-negotiables
- **No direct pushes to `main`.** All changes go through a Pull Request.
- **`npm run gate:quick` must pass** before you open or update a PR.
  - Gate runs: lint + test (fast signal; reproducible).

## Workflow (required)
1. Sync:
   - `git switch main && git pull`
2. Create a branch:
   - `git switch -c <type>/<short-name>`
3. Make changes.
4. Run the gate:
   - `npm run gate:quick`
5. Commit with a clear message (conventional-ish):
   - `docs: ...`, `chore: ...`, `fix: ...`, `feat: ...`
6. Push branch + open PR:
   - `git push -u origin <branch>`
7. Merge via GitHub UI (Squash is fine).

## What counts as a “result”
- Reproducible output (same input -> same output) with contract + snapshots intact.
- Any rule/engine change must be justified by canon diffs and keep invariants green.

## Helpful commands
- Quick gate: `npm run gate:quick`
- Full build check: `npm run build`
