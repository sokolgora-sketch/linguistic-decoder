---
name: zero-merge-continuity
description: "Use when the user requests an owner-authorized merge decision, post-merge verification, safe local-main synchronization, Linear/DF_BRAIN closure, or an Open Instrument cross-chat handoff."
---

# Merge closure and cross-chat continuity

This skill does not authorize merging. Require explicit owner authorization for the exact PR and head before any merge action; never infer it from task completion, review, or green CI.

## Before an authorized merge

Verify live PR status, base and exact head, changed-file scope, mergeability, terminal success for every required hosted check, and substantive review findings/threads. Stop on pending or failing required checks, unresolved findings, or missing owner approval.

## After an authorized merge

1. Verify GitHub's exact merge/squash SHA, parent, current `main`, and post-merge checks. Report pending checks as pending.
2. Synchronize only the designated clean local `main` by fetch and fast-forward when it is strictly safe. Verify HEAD equals `origin/main`, divergence is 0/0, and the checkout is clean. Stop rather than reset, rebase, force-pull, or clean. Preserve all other worktrees.
3. If explicitly authorized, update local DF_BRAIN project state and dated log with verified facts, inspect the diff, run `git diff --check`, and commit locally only when requested. Do not push DF_BRAIN. Reuse the existing user-level `df-brain` skill for DF_BRAIN conventions; do not duplicate its history here.
4. Reconcile only the existing relevant Linear record when authorized, update an existing checkpoint instead of duplicating it, and preserve milestone status unless the owner explicitly changes it.
5. Keep product acceptance separate from deployment checks and keep scientific Unknown/Null boundaries intact.

## Handoff

Read current ZE-21 first, then relevant ZE-15/ZE-18 and the exact target issue. Recheck GitHub, local main, protected worktrees, and DF_BRAIN as needed. Mark every fact as verified now, historical, or unknown; provide exact paths/SHAs only when inspected. Do not hard-code old SHAs or active PR states into this reusable skill.
