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
5. Before pushing, verify the repository's normal pre-push hook is active and leave it enabled. The hook runs `npm run gate:prepush`; allow it to complete normally on every push, including later pushes to the same PR.
6. Open or update the PR and wait for all required GitHub checks to pass before merge. Obtain any separately required owner approval; do not merge automatically.

The default workflow does **not** require a separate `npm run gate:quick` immediately before the push hook. If the hook is inactive, do not bypass it: run `npm run gate:prepush` explicitly before pushing, and report that the hook itself did not run.

## Gate coverage and broader local validation

`npm run gate:quick` and `npm run gate:prepush` overlap substantially, but they are **not equivalent**:

- `npm run gate:quick` runs repository-wide lint, the configured serial Jest unit suite, and integration tests. Quick mode does not run the production build.
- `npm run gate:prepush` runs repository-wide lint and nearly all deterministic Jest suites serially, excluding the repository's defined capability-dependent tests. It does not run the integration-test command.

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
