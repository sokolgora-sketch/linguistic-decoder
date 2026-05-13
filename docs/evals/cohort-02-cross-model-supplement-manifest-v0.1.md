# Cohort 02 Cross-Model Supplement Manifest v0.1

Status: INTERNAL SUPPLEMENT MANIFEST
Project: ZË-RO
Cohort: Cohort 02
Scope: French `/ø~œ/`, Danish `/ø/`, Turkish `/ı/`
Date recorded: 2026-05-13

This manifest links the repo-recorded cross-model evidence batches created after the Cohort 02 public paper.

It is not a public release by itself. It does not update README, Zenodo, LingBuzz, registry labels, or public claims.

## 1. Purpose

The purpose of this manifest is to collect the post-publication cross-model evidence into one controlled supplement index.

The supplement set currently contains:

1. French `/ø~œ/` — high-edge front-rounded support case.
2. Danish `/ø/` — low-edge front-rounded cleaner-provisional support case.
3. Turkish `/ı/` — high-region pressure-audit case.

This gives a balanced evidence set:

| Case | Role | Current interpretation |
|---|---|---|
| French `/ø~œ/` | strong support | cross-model V5-V7 support over V2-V5 |
| Danish `/ø/` | cautious support | cross-model cleaner-provisional V1-V3 support over V2-V5 |
| Turkish `/ı/` | pressure case | unresolved high-region pressure; V4-V7 does not consistently rescue |

## 2. Repo batch documents

| Case | Batch doc | Status |
|---|---|---|
| French `/ø~œ/` | `docs/evals/cohort-02-french-cross-model-replication-batch-v0.1.md` | merged in PR #982 |
| Danish `/ø/` | `docs/evals/cohort-02-danish-cross-model-replication-batch-v0.1.md` | merged in PR #983 |
| Turkish `/ı/` | `docs/evals/cohort-02-turkish-cross-model-pressure-audit-batch-v0.1.md` | merged in PR #986 |

## 3. Evidence-pack inventory

### 3.1 French `/ø~œ/`

Case role: high-edge front-rounded support.

Candidate bracket: V5-V7
Control bracket: V2-V5
Task: `T5_INTERMEDIATE_V0_1`

| Source | Evidence pack | SHA256 |
|---|---|---|
| Claude | `evals.series-evidence-pack.French_Claude-assisted_researcher-reviewed_cross-model_replication_v0.1.v0.1.zip` | `9b569621dad195f2ba35803b15a50c0a2ce7955fa9219032ceb5979e260185c4` |
| Gemini | `evals.series-evidence-pack.t5-fr-euoe-v5-v7-gemini-assisted-researcher-reviewed-v0.1.v0.1.zip` | `6ae1cb2f9d5702cc86945198eb8313385bb7788a32e5fc7390efe06802a37511` |
| Grok | `evals.series-evidence-pack.t5-fr-euoe-v5-v7-grok-assisted-researcher-reviewed-v0.1.v0.1.zip` | `641f78e0ba56516bded61bed4a465d86ca5ac96a2f6aae71bced215740f334cb` |
| DeepSeek | `evals.series-evidence-pack.t5-fr-euoe-v5-v7-deepseek-assisted-researcher-reviewed-v0.1.v0.1 (1).zip` | `770dc1f9c5f2187636116153e4dee0789b828f25f23770c83ae21af6c96d9e17` |

Summary:

- Claude: clean replication.
- Gemini: supportive / partial replication.
- Grok: clean replication with high-boundary uncertainty on controls.
- DeepSeek: clean replication.

Interpretation:

> French `/ø~œ/` shows cross-model stability for the V5-V7 candidate bracket across Claude-, Gemini-, Grok-, and DeepSeek-assisted researcher-reviewed token curation. The V2-V5 control bracket repeatedly collapses high or sits at the high boundary.

### 3.2 Danish `/ø/`

Case role: low-edge front-rounded cleaner-provisional support.

Candidate bracket: V1-V3
Control bracket: V2-V5
Task: `T5_INTERMEDIATE_V0_1`

| Source | Evidence pack | SHA256 |
|---|---|---|
| Claude | `evals.series-evidence-pack.Danish_Claude-assisted_researcher-reviewed_cross-model_replication_v0.1.v0.1.zip` | `4bcf0bbd081116730e676efc39448e4dfd34732c6024bb73714e0cf52ef7974a` |
| Grok | `evals.series-evidence-pack.Danish_Grok-assisted_researcher-reviewed_cross-model_replication_v0.1.v0.1.zip` | `0dc7cc6579e07208c322773e45c8a0cf25a6c46c47e3750a3ecba37f65ee59e9` |
| DeepSeek | `evals.series-evidence-pack.Danish_DeepSeek-assisted_researcher-reviewed_cross-model_replication_v0.1.v0.1 (1).zip` | `e3c90bf81a2a39299c6edc3a42a1ed097504ada56901b346c71756cc54e50575` |

Summary:

- Claude: supportive relative separation.
- Grok: stronger cleaner-provisional support with V2-V5 low-boundary flags.
- DeepSeek: supportive cleaner-provisional support with one V2-V5 control near low collapse.

Interpretation:

> Danish `/ø/` shows cross-model stability for a cleaner V1-V3 candidate bracket over V2-V5 controls. The V2-V5 controls do not categorically collapse, but they are consistently weaker or lower-boundary stressed compared with the clean V1-V3 candidate runs.

### 3.3 Turkish `/ı/`

Case role: high-region pressure audit.

Candidate bracket: V4-V7
Control bracket: V5-V7
Task: `T5_INTERMEDIATE_V0_1`

| Source | Evidence pack | SHA256 |
|---|---|---|
| Claude | `evals.series-evidence-pack.Turkish_Claude-assisted_researcher-reviewed_cross-model_pressure_audit_v0.1.v0.1.zip` | `9fda8ff51236a38aa9ae5f4ce9e504ee2dcc383c19e003c75d8f3088d6eb04ff` |
| Grok | `evals.series-evidence-pack.Turkish_Grok-assisted_researcher-reviewed_cross-model_pressure_audit_v0.1.v0.1.zip` | `ca191962b8f093087f08f59956c3dbd3e7782de307071abb0ddc5e97c6fcc2b7` |
| DeepSeek | `evals.series-evidence-pack.Turkish_DeepSeek-assisted_researcher-reviewed_cross-model_pressure_audit_v0.1.v0.1.zip` | `b1e34556039f4c65b892068d427f0a0069b7dce0ec5212c122a4aab04bddbe42` |

Summary:

- Claude: severe high-region pressure.
- Grok: pressure persists; V5-V7 worse.
- DeepSeek: mixed pressure; no stable V4-V7 rescue.

Interpretation:

> Turkish `/ı/` remains an unresolved high-region pressure case. V4-V7 does not consistently rescue the target, and V5-V7 remains high-boundary unstable.

## 4. Supplement-level interpretation

This supplement set is scientifically stronger than a support-only package because it preserves both support and pressure.

Current cross-model status:

| Class | Case | Interpretation |
|---|---|---|
| Strong support | French `/ø~œ/` | V5-V7 repeatedly stable over V2-V5 |
| Cleaner-provisional support | Danish `/ø/` | V1-V3 cleaner than V2-V5, but controls do not categorically collapse |
| Pressure audit | Turkish `/ı/` | no stable V4-V7 rescue; V5-V7 high-boundary unstable |

This supports a cautious supplement thesis:

> Cross-model assistant-assisted researcher-reviewed curation preserves the Cohort 02 distinction between support, cleaner-provisional support, and pressure cases.

## 5. Publication options

This manifest supports three possible next decisions.

### Option A — keep internal

Use this manifest only as internal evidence planning.

Appropriate if:
- no new public archive is desired yet;
- the team wants to wait for VoiceLab/acoustic evidence;
- the evidence is useful but not ready for a public supplement.

### Option B — public supplement archive

Package the evidence packs and this manifest into a small public supplement archive.

Appropriate if:
- the goal is traceability for post-publication cross-model tests;
- the public claim remains cautious;
- no paper rewrite is required.

Minimum archive contents:

- this manifest;
- French batch doc;
- Danish batch doc;
- Turkish pressure-audit batch doc;
- all 10 evidence packs;
- checksum table;
- short README;
- no changed scoring code.

### Option C — later supplement note or paper appendix

Use the manifest as source material for a future short supplement note.

Appropriate if:
- the goal is a written interpretation update;
- the supplement should include figures/tables;
- the archive should be paired with a text release.

## 6. Claim boundaries

Allowed:

- French `/ø~œ/` has cross-model support for V5-V7 over V2-V5.
- Danish `/ø/` has cross-model cleaner-provisional support for V1-V3 over V2-V5.
- Turkish `/ı/` remains a cross-model high-region pressure case.
- The cross-model supplement preserves a support/pressure distinction.
- The supplement is useful for future VoiceLab/acoustic bridge planning.

Blocked:

- The supplement proves the full ZË-RO framework.
- All front-rounded vowels are solved.
- Turkish `/ı/` is solved by V4-V7.
- Turkish `/ı/` should be treated as support.
- Danish `/ø/` categorically falsifies V2-V5.
- French `/ø~œ/` alone proves the high-edge bracket.
- A public update has already been made.

## 7. Publication status

Current status:

- Local evidence packs exist.
- Batch docs exist in repo.
- This manifest exists after this PR.
- No new Zenodo upload.
- No LingBuzz update.
- No README update.
- No registry migration.

Recommended next step:

- Keep internal unless the next task is explicitly to build a public supplement archive.
- If public release is chosen, create a separate archive-build PR and checksum table.
- Do not change README/LingBuzz/Zenodo until the supplement archive exists and is verified.

## 8. Completion criteria

This manifest is complete when:

- the manifest doc is merged;
- all three batch docs are linked;
- all 10 evidence-pack filenames are listed;
- all 10 SHA256 hashes are recorded;
- claim boundaries are explicit;
- gates pass.
