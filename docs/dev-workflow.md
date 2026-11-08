# ZË-RO / Linguistic Decoder — Dev Workflow

This repo has strict rules so we don’t break the Seven-Voices engine or the Firebase Studio setup.

## 1. Core safety rails

- **Never** run auto-fix tools that touch many files at once (Gemini, `next lint --fix`, etc.).
- Treat `tsconfig`, `package.json`, `jest.config`, and Firebase config as **high-risk**.  
  Only change them in very small, deliberate commits.
- Every change must preserve correctness and receive validation proportional to its scope. Use `npm test` and `npm run build` when the changed behavior or current policy requires them; they are not a blanket requirement for a Markdown-only edit.

## 2. Source of truth

Use current repository evidence as the authority for the task:

1. Current repository files and reviewed contracts.
2. Current tests and validation output.
3. Current Git and GitHub state.
4. Canonical repository documentation.
5. Git history and confirmed milestone records.
6. DF_BRAIN historical continuity.
7. ChatGPT/Codex summaries and conversational memory.

When these conflict, current repository evidence wins. DF_BRAIN records confirmed history; it does not override current repository, contract, test, Git, or GitHub truth.

Canonical analytical rules remain owned by the [Reality Guide](./ZERO_REALITY_GUIDE.md), the [Constitution](./constitution/README.md), the [Engine Contract Freeze](./ENGINE_CONTRACT_FREEZE.md), and the relevant Open Instrument contract or runbook. This workflow references those documents rather than duplicating doctrine.

## 3. ChatGPT and Codex roles

- **ChatGPT High** owns project orchestration, architecture review, task selection, Codex prompt design, evidence review, and capability-gap review.
- **Codex Luna Extra High** is the default bounded repository engineering worker for inspection, implementation, tests, gates, normal bug fixes, documentation, PR preparation, milestone evidence, and DF_BRAIN closeout.
- **Sol** is an escalation path for difficult reasoning, cross-file ambiguity, or unresolved architectural interactions.
- **Astra** is a rare specialist escalation for high-risk or high-uncertainty architecture, adversarial milestone review, difficult nondeterministic bugs, major architecture decisions, or unresolved multi-system interactions.

Escalation is based on uncertainty and risk, not task size. Do not make subscription or usage-limit assumptions part of the workflow.

## 4. Standard capability loop

Use this loop for Open Instrument work:

1. Inspect repository truth.
2. Determine the smallest justified scope from the current implementation,
   contracts, tests, and documentation.
3. Identify a measured milestone capability gap when the lane changes
   analytical or product behavior.
4. Execute the bounded Codex inspection or implementation.
5. Run focused tests first, then the required typechecks, gates, and build
   for the changed scope.
6. Inspect the final diff and verify the changed-file boundary.
7. Commit and push the reviewed branch.
8. Open the PR only when the lane explicitly authorizes publication.
9. Poll required CI until it reaches a terminal state; pending CI is not a
   reason to stop the lifecycle.
10. Inspect substantive review findings and review threads. Fix only
    justified in-scope findings, rerun affected validation, and explicitly
    resolve addressed threads when the tooling permits it.
11. Verify required checks are green, substantive review findings are
    resolved, and the PR is mergeable before merging.
12. Sync local `main` and prove post-merge repository truth.
13. Reconcile the relevant Linear record when the project uses Linear.
14. Update DF_BRAIN locally after a confirmed significant merge when the
    standing workflow authorizes it; report remote state separately.
15. Produce an exact evidence report and select the next lane from measured
    evidence.

PRs are delivery mechanisms. Measured Open Instrument capability is the objective. Do not select the next task merely because another PR can be created.

## 5. Inspection-first discipline

Before modifying files, verify:

- repository and lane;
- branch;
- HEAD;
- `origin/main`;
- divergence;
- tracked and untracked worktree state;
- relevant implementation;
- relevant contracts;
- relevant tests;
- relevant documentation;
- protected state when applicable.

Stop on a repository or lane mismatch. Do not guess repository state.

After identifying the intended repository-relative changed paths, run `node scripts/frozenContractPreflight.v0_1.cjs --planned <repo-relative-paths>` before editing paths that may be checksum-frozen. Include the planned paths. This command is read-only and reports registered checksum owners and expected identities; it is a planning aid, not a replacement for mandatory hooked validation.

## 6. Change discipline

- Make the smallest correct change.
- Keep the task lane-specific and avoid unrelated refactors.
- Do not add word-specific production shortcuts merely to satisfy tests.
- Do not weaken tests merely to obtain PASS.
- Do not promote unsupported evidence or fabricate semantics.
- Preserve valid Null results and existing truth boundaries.
- Inspect protected files and state when the task touches them.
- Keep changes affecting interconnected contracts or runtime paths serialized.

## 7. Test and gate discipline

### Checkout hook bootstrap (mandatory for implementation)

After safe preflight and before edits, run `npm run hooks:setup && npm run hooks:check` in the actual feature checkout. The repository `prepare` lifecycle also activates/verifies hooks during ordinary `npm ci`/`npm install` in a Git clone. It checks that `.githooks/pre-push` is a regular executable file; refuses conflicting effective `core.hooksPath` values; and avoids changing shared Git config from a linked worktree without preexisting per-worktree config. Non-Git npm installs may safely skip `prepare` hook setup. A missing or unsafe hook is a STOP, not permission to run a no-context FULL gate in place of the correct pre-push hook. Normal push must invoke the hook with genuine Git-supplied context. Hook/bootstrap/dependency changes are HIGH_IMPACT and require FULL validation.


Run focused tests first for changed behavior. Use the actual repository commands for repository-wide validation:

- `npm run gate:quick` runs lint, unit tests, and integration tests but does not run the production build.
- `npm run build` runs the production build directly.
- `npm run gate` runs lint, unit tests, integration tests, and the production build.

Use `npm run gate` or a separately executed `npm run build` when production-build validation is required. Pre-merge proof must show the command that actually provided build coverage.

The repository pre-push hook always enters through `npm run gate:prepush`. For
a verified changeset outside the two verified fast paths below, or when
fast-path selection remains uncertain, it runs repository lint plus Jest in `--ci --runInBand` mode
with `OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT` unset so deterministic local
results cannot change with an optional external provider. It excludes only the
known capability-dependent suites that require loopback, `tsx` child-process
IPC, or the integration build/network path:

- `tests/apiAnalyzeV1.evidence.smoke.curl.spec.ts`
- `tests/apiAnalyzeV1.stability.repeat.smoke.spec.ts`
- `tests/openInstrument.multilingualDiscoverySubstrateS3.v0_2.spec.ts`
- `tests/ownedNextServer.spec.ts`
- `tests/battery/batterySeriesStatsGenerator.v0.1.spec.ts`
- `tests/battery/batteryEvidencePackInspectScript.v0.1.spec.ts`

Those suites remain mandatory in CI. The CI workflow runs the full unit suite,
`npm run test:integration`, the production build, and the browser smoke. A
normal capable local environment may still use `npm run gate:quick` or
`npm run gate` directly.

For a positively proven docs-only push, `gate:prepush` can run a fast path
instead of lint/Jest. It requires actual Git pre-push ref data, exactly one
branch update, a clean index/worktree, an exact configured push URL, a live
matching remote branch (or live remote `main` for a new branch), and a complete
commit diff made only of regular `100644` Markdown files in this allowlist:
`AGENTS.md`, `CONTRIBUTING.md`, `README.md`,
`.agents/skills/<skill-name>/SKILL.md`, `docs/dev-workflow.md`, and
`docs/process/**/*.md`. The classifier
reads committed Git objects; extensions, environment flags, staged paths, and
caller-supplied file lists cannot establish eligibility. The fast path runs
`git diff --check`, Markdown encoding/final-newline checks, relevant skill
frontmatter and AGENTS reference checks, and local Markdown-link checks.
Multiple refs, tags, deletes, renames, mode changes, symlinks, MDX, code,
tests, CI, hooks, gate/dependency/config changes, unusual paths, stale or
missing refs, dirty state, and any ambiguous Git/remote result do not qualify
for DOCS_ONLY. The classifier may then consider the separate SCOPED_CODE
allowlist below. If the changeset is verified but fast-path selection remains
uncertain, the gate uses FULL. If the Git ref or changed-path context cannot be
verified, the gate stops with `FROZEN_CHANGESET_UNVERIFIED` before validation.
A failing docs check fails the gate.

For a clean, single-ref push whose complete regular `100644` code/test diff is
limited to `src/ui/instrument/InstrumentPanel.tsx`,
`src/ui/instrument/sections/**/*.tsx`, and/or direct tests matching
`tests/ui.instrument.*.spec.ts(x)` or
`tests/instrumentPanel.*.spec.ts(x)`, the classifier may select `SCOPED_CODE`.
It derives related tests from each changed UI source using Jest, keeps every
directly changed test, adds all registered Instrument UI guard suites and four
required filesystem-scanning guards (`tests/ui.devOnly.contractAdapter.import.guard.spec.ts`,
`tests/doctrine/doctrineDrift.guard.v0.1.2.spec.ts`,
`tests/vowels/orthographySsot.guard.v0.1.spec.ts`, and
`tests/vowels/phoneticIpaSsot.guard.v0.1.spec.ts`), and scans registered test
files for explicit references to changed source paths or component names.
Missing required guard registration falls back to FULL. It then runs ESLint on the changed files,
`npm run typecheck:prod`, and the selected tests serially with `--runInBand`.
The selection must be nonempty, each source must have related tests, each
direct test must be registered, the cross-cutting guard inventory must be
present, and the union must be no larger than 150 suites or 20% of the
registered Jest inventory, whichever limit is smaller. Any failed, empty,
malformed, oversized, or otherwise uncertain selection falls back to FULL.
Shared engines/contracts, APIs, security, generated artifacts/baselines,
dependencies, configuration, CI, hooks, gate scripts, deletions, renames,
symlinks, and unrecognized paths are never eligible. Selected Jest execution
remains serial; this path does not replace full hosted CI.

Never claim PASS, build success, CI success, or gate success without actual output. Do not encode transient test counts in this durable workflow.

For an ordinary scoped code change, default local validation is focused tests,
changed-file ESLint, and the applicable production or contract typecheck. Keep
the normal pre-push hook enabled; it must complete `npm run gate:prepush` on
every push, selecting only a verified docs path, a verified bounded Instrument
UI path, or the existing full lane.

Before lint/Jest, the gate also requires verified Git ref and changeset context.
Missing or invalid context fails immediately with
`FROZEN_CHANGESET_UNVERIFIED`. A verified frozen-identity mismatch fails before
lint or Jest. Verified clean identities continue to normal classification;
uncertainty in selecting a fast path runs the existing FULL validation. The
read-only planning command above does not replace the hook.
Run `npm run gate:quick` when broader local integration validation
is warranted, not as a routine pre-merge step. `gate:quick` and `gate:prepush`
are not equivalent: `gate:prepush` excludes the defined capability-dependent
suites and does not run integration tests. Require all hosted CI checks to pass
before merge; neither local gate substitutes for hosted CI. Use `npm run gate`
or `npm run build` when production-build coverage is required. Inspect
`package.json` and the current CI workflows before relying on any command or
historical test count.
Documentation-only changes still require consistency, path/link, and any
repository documentation validation that actually exists; do not run
unrelated expensive suites only for ceremony.

## 8. Merge authorization

A task may merge only when that task explicitly authorizes merging that specific PR. General instructions such as "finish the task" do not authorize a merge.

Before an authorized merge, verify the applicable:

- exact PR;
- exact expected head;
- expected base;
- changed-file scope;
- required CI;
- review-thread state;
- mergeability;
- expected-head protection.

Required checks must be terminal and green, and substantive review findings
must be resolved. When a review finding is addressed, explicitly resolve its
thread when GitHub tooling permits it; if the tooling cannot resolve a thread,
report that limitation rather than claiming resolution. Do not merge
unresolved or failing work.

Pending CI is not a genuine blocker. Return to the user/DF only for an
authentication or permission failure, required human approval, an
infrastructure failure that cannot safely be worked around, an incompatible
concurrent repository change, a substantive product/scientific/semantic
decision requiring authority, or an unsafe/ambiguous repository state.

## 9. Completion evidence

Normal completion evidence should report:

```text
branch=
HEAD=
originMain=
divergence=
worktree=
changedFiles=
tests=
gate=
commit=
PR=
CI=
reviewThreads=
mergeability=
mergeSHA=
linearMutation=
dfBrainLocalState=
dfBrainRemoteState=
protectedState=
behaviorChanged=
capabilityDelta=
baselineDelta=
truthBoundaryChanged=
remainingGap=
remainingRisks=
RESULT=PASS/FAIL
```

A technical PASS does not automatically mean analytical capability improved. For documentation or process-only work, `capabilityDelta=NONE_DOCS_ONLY` and `baselineDelta=NONE` are valid truthful values.

Completion evidence must distinguish performed actions from planned actions.
Do not claim CI, review resolution, merge, Linear reconciliation, DF_BRAIN
update, remote push, or post-merge synchronization unless each was actually
verified. A normal merged-lane report should include the final branch, HEAD,
`origin/main`, divergence, worktree, changed files, validation, commit, PR,
CI, review-thread state, mergeability, merge SHA, protected state, Linear
mutation, and DF_BRAIN local/remote state.

## 10. Bounded unattended work

Preferred unattended work is read-only inspection, architecture analysis, test-health analysis, documentation inspection, and evidence collection.

Authorized unattended implementation must use:

- an isolated branch or worktree;
- one bounded task;
- required tests;
- exact evidence left for review;
- no direct modification of `main`;
- no force-push;
- no branch deletion;
- no automatic merge.

Without explicit task-specific authorization, unattended work must not alter canonical Seven-Voice doctrine, production truth boundaries, acceptance semantics, evidence promotion state, provider authorization or execution, or protected state.

## 11. Safe parallel work

Safe parallel lanes include research, read-only architecture inspection, test analysis, documentation review, and evidence collection. Serialize implementation when multiple tasks touch interconnected contracts, acceptance logic, evidence state, runtime paths, or analytical architecture.

## 12. Open Instrument boundaries

Preserve the repository's canonical rules for Seven Voices `A E I O U Y Ë`, canonical `Y`, vowel-driven analysis, embryo-first reasoning, Fact / Inference / Hypothesis / Unknown, valid Null, `no_single_winner`, `user_decides`, evidence provenance, gated research/provider promotion, deterministic evidence-first behavior, and the prohibition on word-specific production shortcuts.

The owning constitutional and contract documents remain authoritative. This workflow does not create new analytical semantics.

## 13. Post-merge proof, Linear, and DF_BRAIN

After a confirmed merge, synchronize local `main` and verify the branch,
HEAD, `origin/main`, divergence, and worktree before calling the lane complete.
If Linear is part of the project, inspect the existing project/issue/milestone
record and reconcile that existing record rather than creating duplicates. If
Linear is unavailable or no relevant authority can be identified, report the
limitation.

DF_BRAIN is a continuity record for confirmed project history. Inspect its
current project/log state before updating it; update only after confirmed
significant merges or milestones when the standing workflow authorizes the
local record update; never record speculative accomplishments; and preserve
unrelated dirty work. Authorization to update a local DF_BRAIN record does
not by itself authorize a remote push. A DF_BRAIN remote push requires
separate explicit authorization unless a current authoritative instruction
demonstrably provides it. Report whether the local update was committed and
whether any remote push occurred.

Protected JO state must remain unchanged unless a task explicitly authorizes a
protected-state operation. Provider or model execution remains
authorization-bound. A documentation or inspection task must not execute
providers or models.
