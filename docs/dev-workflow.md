# ZË-RO / Linguistic Decoder — Dev Workflow

This repo has strict rules so we don’t break the Seven-Voices engine or the Firebase Studio setup.

## 1. Core safety rails

- **Never** run auto-fix tools that touch many files at once (Gemini, `next lint --fix`, etc.).
- Treat `tsconfig`, `package.json`, `jest.config`, and Firebase config as **high-risk**.  
  Only change them in very small, deliberate commits.
- Every change must keep:

  ```bash
  npm test
  npm run build
  ```

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

Run focused tests first for changed behavior. Use the actual repository commands for repository-wide validation:

- `npm run gate:quick` runs lint, unit tests, and integration tests but does not run the production build.
- `npm run build` runs the production build directly.
- `npm run gate` runs lint, unit tests, integration tests, and the production build.

Use `npm run gate:quick` for quick validation when a build is not required. Use `npm run gate`, or report a separately executed `npm run build`, when production-build validation is required. Pre-merge proof must show the command that actually provided build coverage.

Never claim PASS, build success, CI success, or gate success without actual output. Do not encode transient test counts in this durable workflow.

For the current repository command surface, the normal pre-merge sequence is
focused validation, `npm run gate:quick`, and `npm run build` when the lane
requires production-build coverage. `npm run gate` is the combined full gate
when that broader command is appropriate. Inspect `package.json` and the
current CI workflows before relying on any command or historical test count.
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
