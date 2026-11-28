# Open Instrument / ZË-RO

## Binding owner Rule No. 1 — Functional discovery first

**NO HISTORICAL-PROOF GATING.** ZË-RO is a functional meaning-discovery engine, not a historical, scientific-consensus, or conventional-etymology certification system. Discover, investigate, connect, compare, compose, and explain plausible functional candidates using available information. Historical proof, conventional morphology, consensus, dictionary wording, template classifications, fixed embryo registries, or independent lexical attestation are not prerequisites for exploratory reasoning. Uncertainty changes claim status and specificity, not permission to reason. An unresolved component remains local `Null` and must not cancel useful reasoning supported by other available information. Never fabricate source facts or present an inference as source-reported.

Preserve exact spelling, source integrity, canonical Seven Voices `A E I O U Y Ë`, determinism, local `Null`, `no_single_winner`, and `user_decides`. This rule governs exploratory reasoning and claim certainty; it does not authorize repository mutations, external/provider execution, authority promotion, merge, or deployment. It supersedes older linguistic wording wherever that wording could be read as an eligibility gate. Repository safety and publication safeguards remain in force.

Before any runnable task, read `.agents/skills/zero-session-bootstrap/SKILL.md` and complete its live authorization, repository, concurrent-task, and worktree preflight. Stop on a mismatch, unknown active lane, or unsafe dirty state; never reset, clean, stash, prune, or edit a protected worktree. Before creating or attaching a linked feature worktree, inspect the effective `core.hooksPath`, its origin and scope, the existing `extensions.worktreeConfig` value, the resolved hook directory and files, the feature worktree config, and the tracked `.githooks/pre-push`. If a shared hook path conflicts, change only the feature worktree with `git config --worktree core.hooksPath .githooks` when per-worktree config is already enabled and no custom hook needs preservation; verify shared and sibling worktree configs remain unchanged. Otherwise stop. Never enable shared worktree config or overwrite shared hook settings.

For authorized implementation and PR work, after safe checkout preflight and BEFORE edits, run `npm run hooks:setup && npm run hooks:check` in the actual clone/worktree. Ordinary `npm ci` also runs a repository `prepare` bootstrap, but a cached install or skipped lifecycle scripts is not evidence that the hook is active. This bootstrap refuses conflicting hooks and unsafe shared worktree config. If it fails, STOP; do not waste time on a no-context FULL gate as a substitute. Normal Git push must invoke the tracked executable `.githooks/pre-push` and its verified mandatory gate.

Once intended repository-relative changed paths are identified, before editing any path that may be checksum-frozen, run `node scripts/frozenContractPreflight.v0_1.cjs --planned <repo-relative-paths>` with the planned paths. This is a read-only planning check; it does not replace mandatory hooked validation. At push time, unverified Git ref or changeset context fails immediately with `FROZEN_CHANGESET_UNVERIFIED`; a verified frozen-identity mismatch fails before lint or Jest; verified clean identities continue to normal gate classification; and uncertainty in selecting a fast path uses the existing FULL validation.

Before expensive commands, state the task's scope, validation tier, reuse plan, exact checks, and stop boundary; recommend an available Codex model and reasoning effort. **A READ_ONLY** (no tests/build/install or mutation), **B DOCS_ONLY** (allowlisted Markdown), **C SCOPED_CODE** (focused tests and applicable lint/typecheck for a verified UI or native cognitive engine lane), or **D HIGH_IMPACT** (gate/hook/CI/dependency/runtime/security/scientific-contract changes; justified coverage and one full mandatory hooked gate). Existing engine work is eligible only through its exact classifier allowlist and complete selector; uncertainty, broader/shared-engine changes, or validation infrastructure changes use FULL. Read-only preflight needed to classify a task is allowed first. Avoid duplicate broad checks and repeated unchanged failures.

Route by task:

- Authorized code or documentation changes, validation, or PR work: `.agents/skills/zero-change-validation-pr/SKILL.md`.
- Linguistic, source, morphology, function, or Seven-Voices claims: `.agents/skills/zero-linguistic-evidence/SKILL.md`.
- A new milestone, experiment, or GO/REVISE/NO-GO decision: `.agents/skills/zero-milestone-evaluation/SKILL.md`.
- An explicitly authorized merge decision, post-merge closure, or handoff: `.agents/skills/zero-merge-continuity/SKILL.md`.

Skills guide work; they do not grant permission. Follow current ZE-21 and repository policy. Preserve user spellings exactly and distinguish Fact, Inference, Hypothesis, and Unknown/Null. A new ZË-RO milestone requires evidence-backed confidence above 80% and explicit owner approval; that threshold governs authorization to start a separate milestone, not exploration within an already authorized task. `npm run gate:prepush` is the required push gate. Never merge without explicit authorization for the exact PR and head.

Long-identifier UI resilience: User-facing reason codes, source references, citation locators, URLs and other unbroken identifiers must remain readable and copyable at mobile widths. Text containers must support overflow wrapping (for example, `overflow-wrap:anywhere`). Flex/grid children that must shrink should use `min-w-0`. Do not rely on ancestor `overflow-x:hidden` as a clipping fix. When one overflow defect is found, inspect surrounding components and adjacent sections for similar strings. Verify element and ancestor `scrollWidth` against `clientWidth`, not only document width. Preserve exact text and evidence authority.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
