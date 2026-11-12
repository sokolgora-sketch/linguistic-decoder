# Open Instrument / ZË-RO

Before any runnable task, read `.agents/skills/zero-session-bootstrap/SKILL.md` and complete its live authorization, repository, concurrent-task, and worktree preflight. Stop on a mismatch, unknown active lane, or unsafe dirty state; never reset, clean, stash, prune, or edit a protected worktree.

For authorized implementation and PR work, after safe checkout preflight and BEFORE edits, run `npm run hooks:setup && npm run hooks:check` in the actual clone/worktree. Ordinary `npm ci` also runs a repository `prepare` bootstrap, but a cached install or skipped lifecycle scripts is not evidence that the hook is active. This bootstrap refuses conflicting hooks and unsafe shared worktree config. If it fails, STOP; do not waste time on a no-context FULL gate as a substitute. Normal Git push must invoke the tracked executable `.githooks/pre-push` and its verified mandatory gate.

Once intended repository-relative changed paths are identified, before editing any path that may be checksum-frozen, run `node scripts/frozenContractPreflight.v0_1.cjs --planned <repo-relative-paths>` with the planned paths. This is a read-only planning check; it does not replace mandatory hooked validation. At push time, unverified Git ref or changeset context fails immediately with `FROZEN_CHANGESET_UNVERIFIED`; a verified frozen-identity mismatch fails before lint or Jest; verified clean identities continue to normal gate classification; and uncertainty in selecting a fast path uses the existing FULL validation.

Before expensive commands, state the task's validation tier and plan: **A READ_ONLY** (inspect/review/research; no tests or mutation), **B DOCS_ONLY** (allowlisted non-executable Markdown; structural/content checks and the verified docs fast path), **C SCOPED_CODE** (focused tests, applicable lint/typecheck, mandatory pre-push gate), or **D HIGH_IMPACT** (gate, hook, CI, dependency, runtime, security, or scientific-contract changes; justified integration/contract checks and the full mandatory pre-push gate). Read-only preflight needed to classify a task is allowed first. Avoid duplicate broad checks and repeated unchanged failures.

Route by task:

- Authorized code or documentation changes, validation, or PR work: `.agents/skills/zero-change-validation-pr/SKILL.md`.
- Linguistic, source, morphology, function, or Seven-Voices claims: `.agents/skills/zero-linguistic-evidence/SKILL.md`.
- A new milestone, experiment, or GO/REVISE/NO-GO decision: `.agents/skills/zero-milestone-evaluation/SKILL.md`.
- An explicitly authorized merge decision, post-merge closure, or handoff: `.agents/skills/zero-merge-continuity/SKILL.md`.

Skills guide work; they do not grant permission. Follow current ZE-21 and repository policy. Preserve user spellings exactly and distinguish Fact, Inference, Hypothesis, and Unknown/Null. A new ZË-RO milestone requires evidence-backed confidence above 80% and explicit owner approval. `npm run gate:prepush` is the required push gate. Never merge without explicit authorization for the exact PR and head.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
