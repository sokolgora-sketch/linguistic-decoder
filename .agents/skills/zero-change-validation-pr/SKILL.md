---
name: zero-change-validation-pr
description: "Use when the owner authorizes an Open Instrument or ZË-RO code, test, configuration, or documentation change, validation, branch publication, PR creation, or PR repair."
---

# Change, validation, and pull request

This skill governs an already authorized change. Complete `zero-session-bootstrap` first; this skill does not grant mutation, publication, or merge authority.

## Validation tier

Before expensive commands, state the task tier and planned checks:

- **A — READ_ONLY:** inspection, review, research, or planning; no tests, gates, builds, installations, or repository mutation.
- **B — DOCS_ONLY:** non-executable Markdown docs or instruction skills; validate exact paths, whitespace, skill frontmatter, repository references, and local links. The mandatory `npm run gate:prepush` may use its docs fast path only after the hook context, pushed commit, clean worktree, live remote/base, and strict Markdown allowlist are verified. Any uncertainty uses the existing full lint and serial Jest gate.
- **C — SCOPED_CODE:** code/tests/ordinary implementation; focused regression, applicable lint/typecheck, and mandatory pre-push gate. The hook may use the bounded Instrument UI selection only when its live Git classifier and test selector prove eligibility; otherwise it runs FULL.
- **D — HIGH_IMPACT:** changes to the gate, hook, CI, dependencies, runtime, security, or scientific contracts; justified integration/contract coverage and the full mandatory pre-push gate.

The tier is based on the requested scope, never an environment flag or an arbitrary changed-file list. Fast paths are not push bypasses: keep the hook enabled, run the `gate:prepush` entry point, and let its classifier and selector fall back to full validation on any ambiguous state. Never use `SKIP_PREPUSH` or `--no-verify`. Avoid duplicate broad gates and repeated unchanged failures.

## Scope and inspection

1. Confirm the exact deliverable, authorized files, branch/PR scope, and stop boundary. Keep one lane and one PR; do not absorb adjacent research or refactoring.
2. Inspect the current implementation, tests/contracts, `package.json`, `CONTRIBUTING.md`, `docs/dev-workflow.md`, `scripts/gate.prepush.mjs`, `scripts/gate.mjs`, `.githooks/pre-push`, and relevant CI workflow before choosing validation. If workflow prose conflicts, follow live ZE-21, `CONTRIBUTING.md`, and the executable scripts/CI; call out stale guidance instead of broadening scope.
3. Make the smallest change in an isolated feature worktree based on verified current `main`. Preserve unrelated, protected, and dirty worktrees. Never encode historical SHAs or transient PR states in reusable instructions.

## Validation and publication

1. Run focused checks first, then changed-file lint and applicable typechecks. Inspect `git diff --check`, the complete diff, and the exact changed-file boundary.
2. For a push, keep the normal hook enabled and pass `npm run gate:prepush` once on the final patch. DOCS_ONLY requires a clean single-branch push whose live remote/base and complete commit diff prove every changed file is allowlisted regular Markdown. SCOPED_CODE is limited to the exact Instrument UI source and focused test paths documented in `CONTRIBUTING.md`; its selector must include related tests, all Instrument UI guards, the required registered filesystem-scanning guards, direct changed tests, and source-referencing consumers, then run changed-file ESLint, `typecheck:prod`, and selected serial Jest. Any uncertainty uses FULL. Changes to the gate, hook, CI, dependencies, configuration, shared engines/contracts, APIs, security, generated artifacts, deletions, renames, and unrecognized paths are always FULL. If the hook is absent, run that command explicitly and report the absence. Never set `SKIP_PREPUSH`, suppress failures, or substitute `npm run gate` or `npm run gate:quick` as if equivalent. Broader local gates are not universal push prerequisites; use them only when current policy or the changed behavior warrants them.
3. If validation fails, classify the actual failure as code, contract, environment, or authority. Make one bounded diagnosis; do not repeat unchanged full gates or install attempts.
4. Push and create/update only the PR explicitly authorized by the user. Verify the final exact head/base, all required hosted checks, substantive review findings, and review threads. Pending checks are not successful.
5. Stop before merge unless the owner explicitly authorizes merging that exact PR/head. CI success is not merge authorization.

## Report

Give base and feature SHAs, changed files, focused checks, exact mandatory gate result, hosted CI and review state, any environment limitation, and the next authorized decision. Do not claim success without command or hosted evidence.
