---
name: zero-session-bootstrap
description: "Use at the start of any Open Instrument or ZË-RO Codex session, investigation, implementation, PR review, or handoff to confirm scope and authorization, read ZE-21, inspect live GitHub and local worktrees, and route to the right specialist skill."
---

# Session bootstrap and scope

This skill is the repository entry point. It checks current authority and state; it does not authorize edits, source acquisition, experiments, PR publication, or merging.

## Preflight before execution

1. Restate the requested outcome and its authorized scope. A Linear milestone, prior prompt, green CI, or skill is not permission to expand the task.
2. Read the current Linear ZE-21 workflow first. Read ZE-15 and ZE-18 when the task concerns their research or delivery scope. Use current repository policy and live service state over dated snapshots.
3. Check Codex task/session inventory for concurrent work. Do not treat an absent PR or a clean branch as proof that no task is running. If a concurrent task or ownership boundary cannot be resolved, stop and report `ACTIVE_CODEX_STATUS_UNKNOWN`.
4. Verify the canonical repository path and identity; live GitHub `main`; relevant open PRs, exact heads, merge/CI status, and parked dispositions; local branch, HEAD, `origin/main`, divergence, and `git status --porcelain=v1 -uall`.
5. List every registered worktree and inspect its branch, HEAD, and tracked/untracked status. Preserve protected or dirty paths. Never reset, clean, stash, prune, switch, or write to them.
6. Check that the requested lane does not overlap an active task or protected work. Stop on repository mismatch, unexplained drift, unsafe state, or unresolved concurrency.

## Route to a specialist

- Changes, validation, or PR publication: `zero-change-validation-pr`.
- Linguistic evidence or claim wording: `zero-linguistic-evidence`.
- A new milestone or experiment decision: `zero-milestone-evaluation`.
- Owner-authorized merge closure or continuity: `zero-merge-continuity`.

Load only the relevant specialist guidance; multiple skills may apply when the authorized task crosses those concerns. Skills supplement ZE-21, current repository contracts, and explicit owner authorization.

## Report

Record each preflight item as verified, blocked, or unknown, including the exact branch/SHA and protected-worktree status needed for the task. If a required check is unavailable, state that limitation rather than inferring success. Do not begin executable work until the required gates are clear.
