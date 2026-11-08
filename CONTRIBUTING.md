# Contributing

This repo is run as a deterministic instrument. Preserve correctness, scientific reproducibility, and source authority while keeping validation proportional to the change.

## Non-negotiables

- **No direct pushes to `main`.** All changes go through a pull request.
- Preserve existing tests, gate scripts, Git hooks, CI checks, contracts, and production safeguards.
- Do not bypass the mandatory pre-push hook or merge before all required GitHub checks pass.

## Default workflow for an ordinary scoped PR

1. Sync from the current `main` and create a feature branch. After safe checkout preflight and before editing, run `npm run hooks:setup && npm run hooks:check` in that checkout.
2. Identify the intended changed paths. Before editing any path that may be checksum-frozen, run `node scripts/frozenContractPreflight.v0_1.cjs --planned <repo-relative-paths>` with the planned paths. This read-only check reports registered owners and expected hashes; it does not replace mandatory hooked validation. Then make the smallest scoped change.
3. During implementation, run the focused tests relevant to the changed behavior, ESLint on changed files, and the applicable production or contract typecheck. Add other focused checks when the change warrants them.
4. Avoid repeating broad validation after edits that do not invalidate its result. Do not automatically run both broad local gates for every ordinary PR.
5. Before pushing, verify the repository's normal pre-push hook is active and leave it enabled. The hook runs `npm run gate:prepush` on every push, including later pushes to the same PR. Unverified Git ref or changeset context fails immediately with `FROZEN_CHANGESET_UNVERIFIED`. With verified context, a frozen-identity mismatch fails before lint or Jest; clean identities continue to normal gate classification. If fast-path selection is uncertain after changeset verification, the existing FULL validation runs.
6. Open or update the PR and wait for all required GitHub checks to pass before merge. Obtain any separately required owner approval; do not merge automatically.

The default workflow does **not** require a separate `npm run gate:quick` immediately before the push hook. Hook activation belongs to initial checkout setup, not to a late gate fallback: `npm run hooks:setup` safely sets `core.hooksPath=.githooks` in a standalone clone; `npm run hooks:check` verifies it. `npm ci` also runs `prepare`, but preexisting dependencies or disabled lifecycle scripts do not prove activation. Conflicting custom hooks and linked worktrees without safe per-worktree config STOP instead of being silently overwritten. If setup fails, STOP and diagnose; do not run a no-context FULL gate merely because the hook is missing. Normal Git push executes the hook with real ref context. Never use `--no-verify` or forged hook arguments.

## Gate coverage and broader local validation

`npm run gate:quick` and `npm run gate:prepush` overlap substantially, but they are **not equivalent**:

- `npm run gate:quick` runs repository-wide lint, the configured serial Jest unit suite, and integration tests. Quick mode does not run the production build.
- `npm run gate:prepush` runs repository-wide lint and nearly all deterministic Jest suites serially, excluding the repository's defined capability-dependent tests, for a verified changeset outside the bounded paths below or when fast-path selection is uncertain. It does not run the integration-test command. Positively verified docs-only and bounded Instrument UI pushes use their respective checks below instead.

Before any gate validation path, the gate verifies the actual pushed base, head, and changed paths, then checks changed frozen identities against authority recorded in the verified base. Missing or invalid Git context fails closed with `FROZEN_CHANGESET_UNVERIFIED`; a frozen mismatch fails before lint/Jest. Clean identities proceed to the existing DOCS_ONLY, SCOPED_CODE, or FULL classifier result. This preflight does not authorize checksum migrations or bypass the normal hook.

The docs-only path is eligible only from the Git pre-push hook with one identical local/remote branch update, a clean index and worktree, a matching configured push URL, a current live remote ref (or live remote `main` for a new branch), and a complete commit-to-commit diff containing only regular mode `100644` files in this allowlist:

- `AGENTS.md`, `CONTRIBUTING.md`, and `README.md`;
- `.agents/skills/<skill-name>/SKILL.md`;
- `docs/dev-workflow.md`;
- `docs/process/**/*.md`.

The gate derives paths from Git objects, not staged files, an environment flag, or a caller-supplied file list. It checks `git diff --check`, committed Markdown encoding and final newlines, changed or AGENTS-referenced skill frontmatter, AGENTS skill paths, and relative Markdown links. Multiple refs, tags, deletes, renames, executable or symlink modes, MDX, non-allowlisted code/config/dependency/CI/hook/gate changes, unusual paths, dirty state, a stale/missing base, or Git/remote uncertainty do not qualify for DOCS_ONLY; only the separate UI allowlist below can qualify for SCOPED_CODE. If the changeset is verified but fast-path selection remains uncertain, use FULL. If the Git ref or changed-path context cannot be verified, stop with `FROZEN_CHANGESET_UNVERIFIED` instead of starting FULL validation. If a docs content check itself fails, the gate fails; it does not report success or hide the error behind a fast path.

The separate `SCOPED_CODE` path is limited to regular `100644` changes whose entire pushed diff consists of `src/ui/instrument/InstrumentPanel.tsx`, `src/ui/instrument/sections/**/*.tsx`, and/or direct tests matching `tests/ui.instrument.*.spec.ts(x)` or `tests/instrumentPanel.*.spec.ts(x)`. The selector derives related tests from each changed UI source with Jest, includes every directly changed test, all registered Instrument UI guard suites, four required filesystem-scanning guards (`tests/ui.devOnly.contractAdapter.import.guard.spec.ts`, `tests/doctrine/doctrineDrift.guard.v0.1.2.spec.ts`, `tests/vowels/orthographySsot.guard.v0.1.spec.ts`, and `tests/vowels/phoneticIpaSsot.guard.v0.1.spec.ts`), and registered test files that explicitly reference a changed source path or component name. Missing required guard registration falls back to FULL. It runs ESLint on every changed file, `npm run typecheck:prod`, and the selected Jest suites serially with `--runInBand`. Selection must be nonempty, every source must have related tests, every direct test must be registered, and the final set must fit both a 150-suite ceiling and 20% of registered Jest suites. Otherwise the gate uses FULL. Shared engines/contracts, API or security code, generated data, baselines, dependencies, configuration, CI, hooks, gates, deletions, renames, symlinks, and all unrecognized paths always use FULL. The scoped path does not parallelize Jest or replace hosted CI.

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
