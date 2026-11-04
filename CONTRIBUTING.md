# Contributing

This repo is run as a deterministic instrument. Preserve correctness, scientific reproducibility, and source authority while keeping validation proportional to the change.

## Non-negotiables

- **No direct pushes to `main`.** All changes go through a pull request.
- Preserve existing tests, gate scripts, Git hooks, CI checks, contracts, and production safeguards.
- Do not bypass the mandatory pre-push hook or merge before all required GitHub checks pass.

## Default workflow for an ordinary scoped PR

1. Sync from the current `main` and create a feature branch.
2. Make the smallest scoped change.
3. During implementation, run the focused tests relevant to the changed behavior, ESLint on changed files, and the applicable production or contract typecheck. Add other focused checks when the change warrants them.
4. Avoid repeating broad validation after edits that do not invalidate its result. Do not automatically run both broad local gates for every ordinary PR.
5. Before pushing, verify the repository's normal pre-push hook is active and leave it enabled. The hook runs `npm run gate:prepush` on every push, including later pushes to the same PR. That entry point selects only a verified docs-only or bounded Instrument UI validation path; every other or uncertain change uses the existing full pre-push validation.
6. Open or update the PR and wait for all required GitHub checks to pass before merge. Obtain any separately required owner approval; do not merge automatically.

The default workflow does **not** require a separate `npm run gate:quick` immediately before the push hook. If the hook is inactive, do not bypass it: run `npm run gate:prepush` explicitly before pushing, and report that the hook itself did not run.

## Gate coverage and broader local validation

`npm run gate:quick` and `npm run gate:prepush` overlap substantially, but they are **not equivalent**:

- `npm run gate:quick` runs repository-wide lint, the configured serial Jest unit suite, and integration tests. Quick mode does not run the production build.
- `npm run gate:prepush` runs repository-wide lint and nearly all deterministic Jest suites serially, excluding the repository's defined capability-dependent tests, for changes outside the bounded paths below or whenever selection is uncertain. It does not run the integration-test command. Positively verified docs-only and bounded Instrument UI pushes use their respective checks below instead.

The docs-only path is eligible only from the Git pre-push hook with one identical local/remote branch update, a clean index and worktree, a matching configured push URL, a current live remote ref (or live remote `main` for a new branch), and a complete commit-to-commit diff containing only regular mode `100644` files in this allowlist:

- `AGENTS.md`, `CONTRIBUTING.md`, and `README.md`;
- `.agents/skills/<skill-name>/SKILL.md`;
- `docs/dev-workflow.md`;
- `docs/process/**/*.md`.

The gate derives paths from Git objects, not staged files, an environment flag, or a caller-supplied file list. It checks `git diff --check`, committed Markdown encoding and final newlines, changed or AGENTS-referenced skill frontmatter, AGENTS skill paths, and relative Markdown links. Multiple refs, tags, deletes, renames, executable or symlink modes, MDX, non-allowlisted code/config/dependency/CI/hook/gate changes, unusual paths, dirty state, a stale/missing base, or any Git/remote uncertainty do not qualify for DOCS_ONLY; only the separate UI allowlist below can qualify for SCOPED_CODE. All other uncertainty uses FULL. If a docs content check itself fails, the gate fails; it does not report success or hide the error behind a fast path.

The separate `SCOPED_CODE` path is limited to regular `100644` changes whose entire pushed diff consists of `src/ui/instrument/InstrumentPanel.tsx`, `src/ui/instrument/sections/**/*.tsx`, and/or direct tests matching `tests/ui.instrument.*.spec.ts(x)` or `tests/instrumentPanel.*.spec.ts(x)`. The selector derives related tests from each changed UI source with Jest, includes every directly changed test, all registered Instrument UI guard suites, and registered test files that explicitly reference a changed source path or component name. It runs ESLint on every changed file, `npm run typecheck:prod`, and the selected Jest suites serially with `--runInBand`. Selection must be nonempty, every source must have related tests, every direct test must be registered, and the final set must fit both a 150-suite ceiling and 20% of registered Jest suites. Otherwise the gate uses FULL. Shared engines/contracts, API or security code, generated data, baselines, dependencies, configuration, CI, hooks, gates, deletions, renames, symlinks, and all unrecognized paths always use FULL. The scoped path does not parallelize Jest or replace hosted CI.

Use `npm run gate:quick` when broader local integration validation is justified—for example, changes to API/runtime behavior, Next.js server behavior, shared analysis engines, cross-cutting contracts, uncertain dependency impact, or when diagnosing a failure. Do not treat the pre-push gate as a replacement for integration coverage. Run `npm run build` locally when the change or an explicit requirement warrants it; the existing hosted CI also performs build validation.

The existing GitHub CI and required status checks remain the complete PR validation path. Keep them enabled and require their success; a focused local run or either local gate alone is not a substitute for required hosted checks.

## Helpful commands

- Focused Jest: `npm test -- --ci --runInBand path/to/relevant.spec.ts`
- Changed-file lint: `npx eslint -c eslint.config.mjs path/to/changed-file.ts`
- Production typecheck: `npm run typecheck:prod`
- Contract typecheck: `npm run typecheck:contracts`
- Broader local integration validation, when warranted: `npm run gate:quick`
- Mandatory pre-push validation: `npm run gate:prepush` (normally invoked by the active Git hook)
- Build validation, when warranted: `npm run build`
