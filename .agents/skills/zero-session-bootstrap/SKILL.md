---
name: zero-session-bootstrap
description: "Use at the start of any Open Instrument or ZË-RO Codex session, investigation, implementation, PR review, or handoff to confirm scope and authorization, read ZE-21, inspect live GitHub and local worktrees, and route to the right specialist skill."
---

# Session bootstrap and scope

This skill is the repository entry point. It checks current authority and state; it does not authorize edits, source acquisition, experiments, PR publication, or merging.

## Classify before expensive commands

After the read-only preflight needed to understand the request, state the validation tier and planned checks before running tests, gates, builds, installations, or other expensive commands:

- **A — READ_ONLY:** inspection, review, research, or planning. Do not run tests, gates, builds, or installations and do not mutate the repository.
- **B — DOCS_ONLY:** non-executable Markdown documentation or instruction skills. Check the exact changed-file scope, formatting, frontmatter, references, and links. Let `npm run gate:prepush` select its docs-only lane only when its live-Git classifier proves eligibility; on verified Git context, uncertain fast-path selection uses the existing full lint and serial Jest lane.
- **C — SCOPED_CODE:** ordinary code/tests, or an exact verified Instrument UI/native cognitive engine path. Run focused regression tests and applicable changed-file lint/typechecks. Existing scoped paths still require the normal mandatory hooked gate; unsafe, broad, or uncertain selections use FULL.
- **D — HIGH_IMPACT:** gate/hook, CI, dependency, runtime, security, or scientific-contract changes. Add justified integration/contract coverage and run the full required push gate.

The tier describes the requested change, not an environment setting or a caller-provided file list. Fast-path eligibility must be proven from the actual pushed ref and live remote base. Do not use `SKIP_PREPUSH`, `--no-verify`, or another bypass. Avoid duplicate broad gates, unnecessary installation, and repeated unchanged failing validation.

## Preflight before execution

1. Restate the requested outcome and its authorized scope. A Linear milestone, prior prompt, green CI, or skill is not permission to expand the task.
2. Read the current Linear ZE-21 workflow first. Read ZE-15 and ZE-18 when the task concerns their research or delivery scope. Use current repository policy and live service state over dated snapshots.
   For owner-specific functional-motivation priorities, follow the latest live ZE-15/ZE-21 directive and Notion Session Bootstrap; this skill is a workflow pointer and does not supersede those decisions.
3. Check Codex task/session inventory for concurrent work. Do not treat an absent PR or a clean branch as proof that no task is running. If a concurrent task or ownership boundary cannot be resolved, stop and report `ACTIVE_CODEX_STATUS_UNKNOWN`.
4. Verify the canonical repository path and identity; live GitHub `main`; relevant open PRs, exact heads, merge/CI status, and parked dispositions; local branch, HEAD, `origin/main`, divergence, and `git status --porcelain=v1 -uall`.
5. List every registered worktree and inspect its branch, HEAD, and tracked/untracked status. Preserve protected or dirty paths. Never reset, clean, stash, prune, switch, or write to them.
6. Before creating or attaching a linked feature worktree, inspect the effective `core.hooksPath` with origin/scope, `extensions.worktreeConfig`, its resolved directory and hook files/symlinks, the target worktree's existing config, and the tracked `.githooks/pre-push`. A shared conflicting path may be overridden only in the target worktree, only when worktree config is already enabled, and only after confirming no custom hook requires preservation. Record shared and sibling config hashes before an authorized `git config --worktree core.hooksPath .githooks` repair and verify they remain unchanged. If any condition fails, stop without changing shared settings or custom hooks.
7. Check that the requested lane does not overlap an active task or protected work. Stop on repository mismatch, unexplained drift, unsafe state, or unresolved concurrency.

Once the intended repository-relative changed paths are identified, before editing any path that may be checksum-frozen, run `node scripts/frozenContractPreflight.v0_1.cjs --planned <repo-relative-paths>` with the planned paths. This is read-only planning output; it does not authorize a checksum change or replace the mandatory pre-push hook.

The hook's frozen-identity outcomes are distinct: missing or invalid Git ref/changeset context stops immediately with `FROZEN_CHANGESET_UNVERIFIED`; a verified frozen-identity mismatch stops before lint or Jest; verified clean identities proceed to normal classification; and uncertain fast-path selection on a verified changeset runs FULL validation.

## Mandatory hook bootstrap before implementation

After safe live repository/worktree preflight and BEFORE editing or publishing a branch, run `npm run hooks:setup && npm run hooks:check` in the actual checkout. This verifies the executable hook. `npm ci`/`npm install` also run the repository `prepare` bootstrap, but cached dependencies or skipped lifecycle scripts are insufficient proof. For an existing linked-worktree conflict, use only the preflight's narrowly authorized target-worktree repair; never silently overwrite shared `core.hooksPath`, add shared `extensions.worktreeConfig`, or replace real custom hooks. If isolation cannot be established, stop. Never replace missing-hook setup with a no-context FULL gate, a skipped hook, or fabricated push ref data.

## Route to a specialist

- Changes, validation, or PR publication: `zero-change-validation-pr`.
- Linguistic evidence or claim wording: `zero-linguistic-evidence`.
- A new milestone or experiment decision: `zero-milestone-evaluation`.
- Owner-authorized merge closure or continuity: `zero-merge-continuity`.

Load only the relevant specialist guidance; multiple skills may apply when the authorized task crosses those concerns. Skills supplement ZE-21, current repository contracts, and explicit owner authorization.

## Report

Record each preflight item as verified, blocked, or unknown, including the exact branch/SHA and protected-worktree status needed for the task. If a required check is unavailable, state that limitation rather than inferring success. Do not begin executable work until the required gates are clear.
